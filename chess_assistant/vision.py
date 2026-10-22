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
        """Determines if a square crop has NO chess piece in its central area."""
        h, w, _ = crop.shape
        y1, y2 = int(h * 0.25), int(h * 0.75)
        x1, x2 = int(w * 0.25), int(w * 0.75)
        center = crop[y1:y2, x1:x2]

        # Check dark border or dark piece pixels (RGB all < 85)
        dark_ratio = np.mean(np.all(center < 85, axis=-1))
        # Check white piece pixels (RGB all > 215)
        white_ratio = np.mean(np.all(center > 215, axis=-1))

        # An empty square has zero piece pixels in its center
        return (dark_ratio < 0.04 and white_ratio < 0.06)

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

        # Step 1: Detect whether bottom row has White or Black pieces
        bottom_white_score = 0
        bottom_black_score = 0
        for c in range(8):
            b_crop = board_img[int(7*cell_h):int(8*cell_h), int(c*cell_w):int((c+1)*cell_w)]
            corners = np.concatenate([b_crop[:4,:4], b_crop[:4,-4:], b_crop[-4:,:4], b_crop[-4:,-4:]], axis=0)
            bg = np.median(corners, axis=(0,1))
            center = b_crop[int(b_crop.shape[0]*0.2):int(b_crop.shape[0]*0.8), int(b_crop.shape[1]*0.2):int(b_crop.shape[1]*0.8)]
            diff = np.abs(center.astype(np.float32) - bg).sum(axis=-1)
            fg = (diff > 35)
            if np.mean(fg) > 0.10:
                bright = np.mean(center[fg])
                if bright > 135:
                    bottom_white_score += 1
                else:
                    bottom_black_score += 1

        bottom_player = "white" if bottom_white_score >= bottom_black_score else "black"
        is_white_view = (bottom_player == "white")

        # Step 2: Build occupancy map for all 64 squares
        occ = {}
        for r in range(8):
            for c in range(8):
                sq = chess.square(c, 7 - r) if is_white_view else chess.square(7 - c, r)

                crop = board_img[int(r*cell_h):int((r+1)*cell_h), int(c*cell_w):int((c+1)*cell_w)]
                corners = np.concatenate([crop[:4,:4], crop[:4,-4:], crop[-4:,:4], crop[-4:,-4:]], axis=0)
                bg = np.median(corners, axis=(0,1))
                center = crop[int(crop.shape[0]*0.2):int(crop.shape[0]*0.8), int(crop.shape[1]*0.2):int(crop.shape[1]*0.8)]
                diff = np.abs(center.astype(np.float32) - bg).sum(axis=-1)
                fg = (diff > 35)
                if np.mean(fg) < 0.10:
                    occ[sq] = '.'
                else:
                    bright = np.mean(center[fg])
                    occ[sq] = 'W' if bright > 135 else 'B'

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

        def search_from(start_b, limit_depth):
            pq = []
            init_diff = diff_count(start_b)
            if init_diff == 0:
                return start_b
            cnt = 0
            heapq.heappush(pq, (init_diff, 0, cnt, start_b))
            visited = set()

            while pq:
                h, d, _, bd = heapq.heappop(pq)
                if h == 0:
                    return bd
                if d >= limit_depth:
                    continue
                fen_key = bd.board_fen()
                if fen_key in visited:
                    continue
                visited.add(fen_key)

                for m in bd.legal_moves:
                    nb = bd.copy()
                    nb.push(m)
                    cur_diff = diff_count(nb)
                    if cur_diff <= h:
                        cnt += 1
                        heapq.heappush(pq, (cur_diff, d + 1, cnt, nb))
            return None

        # 1. Search forward from current_board (fastest: depth 1..4)
        if current_board is not None:
            res = search_from(current_board, limit_depth=4)
            if res:
                self.initialize_reference(board_img)
                return res, bottom_player, True

        # 2. Search from standard initial board (up to depth max_depth)
        res = search_from(chess.Board(), limit_depth=max_depth)
        if res:
            self.initialize_reference(board_img)
            return res, bottom_player, True

        return (current_board or chess.Board()), bottom_player, False

    def force_update_reference(self):
        """Force re-capture reference snapshot (e.g. after manual correction)."""
        self.initialize_reference()
