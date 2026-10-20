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

    def detect_move(self, board: chess.Board, threshold: float = 18.0):
        """
        Compares current screen with the last reference snapshot.
        Evaluates legal moves in `board.legal_moves` and selects the move
        whose involved squares show the highest pixel difference.
        
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

            # Basic move score (both from and to must show change)
            if d_from < threshold or d_to < threshold:
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

    def force_update_reference(self):
        """Force re-capture reference snapshot (e.g. after manual correction)."""
        self.initialize_reference()
