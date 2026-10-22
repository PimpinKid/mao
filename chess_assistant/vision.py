import mss
import numpy as np
from PIL import Image
import chess

class BoardVision:
    def __init__(self, bbox: dict, player_color: str = "white"):
        """
        bbox: {"left": int, "top": int, "width": int, "height": int}
        player_color: "white" or "black" (determines board orientation)
        """
        self.bbox = bbox
        self.player_color = player_color.lower()
        self.sct = mss.mss()
        self.last_square_images = {}  # {square_index: np.ndarray}
        self.last_full_image = None

    def update_config(self, bbox: dict, player_color: str = None):
        self.bbox = bbox
        if player_color:
            self.player_color = player_color.lower()

    def capture_board_image(self) -> np.ndarray:
        """Captures the board bounding box from screen as RGB numpy array."""
        monitor = {
            "top": int(self.bbox["top"]),
            "left": int(self.bbox["left"]),
            "width": int(self.bbox["width"]),
            "height": int(self.bbox["height"])
        }
        raw = self.sct.grab(monitor)
        # Convert BGRA to RGB
        img = np.array(raw)[:, :, :3][:, :, ::-1]
        self.last_full_image = img
        return img

    def get_square_crops(self, board_img: np.ndarray = None) -> dict:
        """
        Slices the board image into 64 individual square crops.
        Returns: {chess.Square (0..63): np.ndarray}
        """
        if board_img is None:
            board_img = self.capture_board_image()

        h, w, _ = board_img.shape
        cell_w = w / 8.0
        cell_h = h / 8.0

        # Margin inset (15% on each edge) to avoid detecting board borders and grid lines
        margin_x = int(cell_w * 0.15)
        margin_y = int(cell_h * 0.15)

        crops = {}
        is_white = (self.player_color == "white")

        for row in range(8):
            for col in range(8):
                # Map row/col to chess.square
                # White perspective: row 0 is rank 8, col 0 is file A
                # Black perspective: row 0 is rank 1, col 0 is file H
                if is_white:
                    file_idx = col
                    rank_idx = 7 - row
                else:
                    file_idx = 7 - col
                    rank_idx = row

                sq = chess.square(file_idx, rank_idx)

                x1 = int(col * cell_w) + margin_x
                x2 = int((col + 1) * cell_w) - margin_x
                y1 = int(row * cell_h) + margin_y
                y2 = int((row + 1) * cell_h) - margin_y

                crop = board_img[y1:y2, x1:x2]
                crops[sq] = crop

        return crops

    def initialize_reference(self, board_img: np.ndarray = None):
        """Save the initial reference state of all 64 squares."""
        self.last_square_images = self.get_square_crops(board_img)

    def is_cell_empty(self, crop: np.ndarray) -> bool:
        """
        Determines if a square crop has NO chess piece in its central area.
        Empty squares have completely flat texture (spatial std dev < 8.0).
        """
        if crop is None or crop.size == 0:
            return True
        h, w, _ = crop.shape
        y1, y2 = int(h * 0.25), int(h * 0.75)
        x1, x2 = int(w * 0.25), int(w * 0.75)
        center = crop[y1:y2, x1:x2]
        spatial_std = float(center.std(axis=(0, 1)).mean())
        return spatial_std < 8.0

    @staticmethod
    def detect_square_occupancy(crop: np.ndarray) -> str:
        """
        Determines occupancy of a square: 'W' (White piece), 'B' (Black piece), or '.' (empty).
        Works seamlessly across Discord ("Chess in the Park") and Chess.com boards.
        """
        if crop is None or crop.size == 0:
            return '.'
        h, w, _ = crop.shape
        y1, y2 = int(h * 0.25), int(h * 0.75)
        x1, x2 = int(w * 0.25), int(w * 0.75)
        center = crop[y1:y2, x1:x2]

        # Spatial std dev: empty cells have flat uniform texture (< 8.0)
        spatial_std = float(center.std(axis=(0, 1)).mean())
        if spatial_std < 8.0:
            return '.'

        # Calculate luminance for piece color classification
        lum = 0.299 * center[:, :, 0] + 0.587 * center[:, :, 1] + 0.114 * center[:, :, 2]
        mean_lum = float(lum.mean())
        bright_ratio = float(np.mean(lum > 185))
        dark_ratio = float(np.mean(lum < 105))

        if mean_lum > 170.0 or bright_ratio > dark_ratio:
            return 'W'
        else:
            return 'B'

    def detect_move(self, board: chess.Board, threshold: float = 18.0):
        """
        Compares current screen with the last reference snapshot.
        Strictly verifies that:
        1. Both from_sq and to_sq changed significantly (>= threshold).
        2. from_sq became EMPTY (piece left).
        3. to_sq became OCCUPIED (piece arrived).
        
        Returns:
            (detected_move: chess.Move or None, max_diff: float, details: dict)
        """
        if not self.last_square_images:
            self.initialize_reference()
            return None, 0.0, {}

        curr_crops = self.get_square_crops()

        # Compute difference for every square
        diffs = {}
        for sq in range(64):
            prev = self.last_square_images.get(sq)
            curr = curr_crops.get(sq)
            if prev is not None and curr is not None:
                # Resize if shapes differ slightly
                if prev.shape != curr.shape:
                    prev = np.array(Image.fromarray(prev).resize((curr.shape[1], curr.shape[0])))
                # Mean Absolute Difference across color channels
                d = float(np.mean(np.abs(curr.astype(np.float32) - prev.astype(np.float32))))
                diffs[sq] = d
            else:
                diffs[sq] = 0.0

        # Score all legal moves
        best_move = None
        best_score = 0.0

        for move in board.legal_moves:
            from_sq = move.from_square
            to_sq = move.to_square

            d_from = diffs.get(from_sq, 0.0)
            d_to = diffs.get(to_sq, 0.0)

            # Both from and to must show significant pixel change
            if d_from < threshold or d_to < threshold:
                continue

            # Strict piece-presence validation:
            curr_from = curr_crops.get(from_sq)
            curr_to = curr_crops.get(to_sq)

            # 1. Origin square MUST now be empty (piece left)!
            if curr_from is not None and not self.is_cell_empty(curr_from):
                continue

            # 2. Destination square MUST now have a piece (NOT empty)!
            if curr_to is not None and self.is_cell_empty(curr_to):
                continue

            score = d_from + d_to

            # Handle castling (4 squares change)
            if board.is_castling(move):
                if chess.square_file(to_sq) > chess.square_file(from_sq):
                    # Kingside
                    rook_from = chess.square(7, chess.square_rank(from_sq))
                    rook_to = chess.square(5, chess.square_rank(from_sq))
                else:
                    # Queenside
                    rook_from = chess.square(0, chess.square_rank(from_sq))
                    rook_to = chess.square(3, chess.square_rank(from_sq))
                score += diffs.get(rook_from, 0.0) + diffs.get(rook_to, 0.0)

            # Handle en-passant (3 squares change)
            if board.is_en_passant(move):
                ep_sq = chess.square(chess.square_file(to_sq), chess.square_rank(from_sq))
                score += diffs.get(ep_sq, 0.0)

            if score > best_score:
                best_score = score
                best_move = move

        if best_move and best_score >= (threshold * 2):
            # Update reference snapshot
            self.last_square_images = curr_crops
            return best_move, best_score, {
                "from": chess.square_name(best_move.from_square),
                "to": chess.square_name(best_move.to_square),
                "diff": best_score
            }

        return None, best_score, {}

    def get_board_occupancy(self, board_img: np.ndarray = None) -> tuple[dict, str]:
        """
        Scans all 64 squares directly to determine occupancy ('W', 'B', '.')
        and automatically identifies if the bottom player is White or Black.
        """
        if board_img is None:
            board_img = self.capture_board_image()

        h, w, _ = board_img.shape
        cell_w = w / 8.0
        cell_h = h / 8.0

        # Step 1: Detect bottom player orientation by checking pieces on bottom 2 ranks (rows 6, 7) vs top 2 ranks (rows 0, 1)
        bottom_white, bottom_black = 0, 0
        top_white, top_black = 0, 0

        for r in [6, 7]:
            for c in range(8):
                crop = board_img[int(r*cell_h):int((r+1)*cell_h), int(c*cell_w):int((c+1)*cell_w)]
                occ_sq = self.detect_square_occupancy(crop)
                if occ_sq == 'W': bottom_white += 1
                elif occ_sq == 'B': bottom_black += 1

        for r in [0, 1]:
            for c in range(8):
                crop = board_img[int(r*cell_h):int((r+1)*cell_h), int(c*cell_w):int((c+1)*cell_w)]
                occ_sq = self.detect_square_occupancy(crop)
                if occ_sq == 'W': top_white += 1
                elif occ_sq == 'B': top_black += 1

        # Bottom player is White if bottom ranks have more white than black pieces
        if (bottom_white + top_black) >= (bottom_black + top_white):
            bottom_player = "white"
        else:
            bottom_player = "black"

        is_white_view = (bottom_player == "white")

        # Step 2: Build occupancy map for all 64 squares
        occ = {}
        for r in range(8):
            for c in range(8):
                sq = chess.square(c, 7 - r) if is_white_view else chess.square(7 - c, r)
                crop = board_img[int(r*cell_h):int((r+1)*cell_h), int(c*cell_w):int((c+1)*cell_w)]
                occ[sq] = self.detect_square_occupancy(crop)

        return occ, bottom_player

    def sync_board_state(self, current_board: chess.Board = None, max_depth: int = 8) -> tuple[chess.Board, str, bool]:
        """
        Directly scans screen, detects occupancy, and reconstructs the exact legal board position.
        Returns:
            (synced_board, bottom_player, success_bool)
        """
        import heapq
        board_img = self.capture_board_image()
        occ, bottom_player = self.get_board_occupancy(board_img)

        def diff_count(b):
            c = 0
            for sq in chess.SQUARES:
                p = b.piece_at(sq)
                exp = 'W' if (p and p.color == chess.WHITE) else ('B' if (p and p.color == chess.BLACK) else '.')
                if occ.get(sq, '.') != exp:
                    c += 1
            return c

        def search_from(start_b, limit_depth, max_nodes=500):
            pq = []
            init_diff = diff_count(start_b)
            if init_diff == 0:
                return start_b
            cnt = 0
            heapq.heappush(pq, (init_diff, 0, cnt, start_b))
            visited = set()
            nodes = 0

            while pq and nodes < max_nodes:
                h, d, _, bd = heapq.heappop(pq)
                if h == 0:
                    return bd
                if d >= limit_depth:
                    continue
                fen_key = bd.board_fen()
                if fen_key in visited:
                    continue
                visited.add(fen_key)
                nodes += 1

                for m in bd.legal_moves:
                    nb = bd.copy()
                    nb.push(m)
                    cur_diff = diff_count(nb)
                    if cur_diff <= h:
                        cnt += 1
                        heapq.heappush(pq, (cur_diff, d + 1, cnt, nb))
            return None

        # 1. Direct check if current_board matches screen (0 diff)
        if current_board is not None and diff_count(current_board) == 0:
            self.initialize_reference(board_img)
            return current_board, bottom_player, True

        # 2. Search forward from current_board (fastest: depth 1..2, max 500 nodes)
        if current_board is not None:
            res = search_from(current_board, limit_depth=2, max_nodes=500)
            if res:
                self.initialize_reference(board_img)
                return res, bottom_player, True

        # 3. Try depth 3..4 from current_board
        if current_board is not None:
            res = search_from(current_board, limit_depth=4, max_nodes=800)
            if res:
                self.initialize_reference(board_img)
                return res, bottom_player, True

        # 4. Direct check of standard initial board
        if diff_count(chess.Board()) == 0:
            self.initialize_reference(board_img)
            return chess.Board(), bottom_player, True

        # 5. Search from standard initial board (opening up to 6 plies / 3 moves, max 1000 nodes)
        res = search_from(chess.Board(), limit_depth=6, max_nodes=1000)
        if res:
            self.initialize_reference(board_img)
            return res, bottom_player, True

        return (current_board or chess.Board()), bottom_player, False

    def force_update_reference(self):
        """Force re-capture reference snapshot (e.g. after manual correction)."""
        self.initialize_reference()
