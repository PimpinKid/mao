import chess
import chess.engine
import os

PIECE_NAMES_RU = {
    chess.PAWN: "пешку",
    chess.KNIGHT: "коня",
    chess.BISHOP: "слона",
    chess.ROOK: "ладью",
    chess.QUEEN: "ферзя",
    chess.KING: "короля"
}

SAN_RU_TRANSLATION = {
    "N": "К",
    "B": "С",
    "R": "Л",
    "Q": "Ф",
    "K": "Кр"
}

def to_russian_san(san_move: str) -> str:
    """Convert English SAN notation (Nf3, Bxe5) to Russian (Кf3, Сxe5)."""
    res = san_move
    for en, ru in SAN_RU_TRANSLATION.items():
        if res.startswith(en):
            res = ru + res[1:]
            break
    return res

class ChessEngine:
    def __init__(self, stockfish_path: str):
        if not stockfish_path or not os.path.exists(stockfish_path):
            raise FileNotFoundError(f"Stockfish not found at path: {stockfish_path}")
        self.engine_path = stockfish_path
        self.engine = None
        self._start_engine()

    def _start_engine(self):
        try:
            self.engine = chess.engine.SimpleEngine.popen_uci(self.engine_path)
            # Configure engine for high responsiveness
            self.engine.configure({"Threads": 2, "Hash": 64})
        except Exception as e:
            raise RuntimeError(f"Failed to start Stockfish engine: {e}")

    def evaluate(self, board: chess.Board, time_limit: float = 0.2, depth: int = 18, multipv: int = 3):
        """
        Analyze the current board state.
        Returns:
            dict containing best_move (uci and san), score_str, score_val, depth, multipv_lines, explanation
        """
        if self.engine is None:
            self._start_engine()

        if board.is_game_over():
            return {
                "game_over": True,
                "result": board.result(),
                "best_move_uci": None,
                "best_move_san": None,
                "score_str": "0.0",
                "explanation": f"Партия окончена: {board.result()}"
            }

        limit = chess.engine.Limit(time=time_limit, depth=depth)
        try:
            analysis = self.engine.analyse(board, limit=limit, multipv=multipv)
        except Exception as e:
            # Reconnect if crashed
            self._start_engine()
            analysis = self.engine.analyse(board, limit=limit, multipv=multipv)

        if not analysis:
            return None

        primary = analysis[0]
        pv = primary.get("pv", [])
        if not pv:
            return None

        best_move = pv[0]
        san_move = board.san(best_move)
        ru_san = to_russian_san(san_move)

        # Score parsing
        score = primary.get("score")
        if score:
            relative_score = score.relative
            if relative_score.is_mate():
                mate_in = relative_score.mate()
                score_str = f"M{mate_in}"
                score_val = 10000 if mate_in > 0 else -10000
            else:
                cp = relative_score.score()
                score_val = cp / 100.0 if cp is not None else 0.0
                score_str = f"{score_val:+.2f}"
        else:
            score_str = "+0.00"
            score_val = 0.0

        # Generate strategic explanation
        explanation = self._explain_move(board, best_move, ru_san, score_str)

        # Parse alternative moves (multipv)
        lines = []
        for line in analysis:
            line_pv = line.get("pv", [])
            if line_pv:
                m = line_pv[0]
                s = line.get("score", score).relative
                s_str = f"M{s.mate()}" if s.is_mate() else f"{(s.score() or 0)/100:+.2f}"
                lines.append({
                    "move_uci": m.uci(),
                    "move_san": to_russian_san(board.san(m)),
                    "score": s_str
                })

        return {
            "game_over": False,
            "best_move_uci": best_move.uci(),
            "best_move_san": ru_san,
            "score_str": score_str,
            "score_val": score_val,
            "depth": primary.get("depth", depth),
            "lines": lines,
            "explanation": explanation
        }

    def _explain_move(self, board: chess.Board, move: chess.Move, ru_san: str, score_str: str) -> str:
        """Generate human-readable chess reasoning for the recommended move."""
        piece = board.piece_at(move.from_square)
        target_piece = board.piece_at(move.to_square)

        # Castling
        if board.is_castling(move):
            side = "короткая (0-0)" if chess.square_file(move.to_square) > chess.square_file(move.from_square) else "длинная (0-0-0)"
            return f"Рокировка ({side}): обеспечение безопасности короля и ввод ладьи в центр."

        # Captures
        if target_piece:
            captured_name = PIECE_NAMES_RU.get(target_piece.piece_type, "фигуру")
            return f"Взятие: выигрыш материала ({captured_name} на {chess.square_name(move.to_square)})."

        # Pawn advance
        if piece and piece.piece_type == chess.PAWN:
            if chess.square_name(move.to_square) in ["e4", "d4", "e5", "d5"]:
                return "Захват и контроль центральной клетки ключевой пешкой."
            if move.promotion:
                return "Превращение проходной пешки в ферзя!"
            return f"Продвижение пешки для ограничения пространства соперника."

        # Knight development
        if piece and piece.piece_type == chess.KNIGHT:
            return f"Развитие коня на активную позицию {chess.square_name(move.to_square)} с контролем центра."

        # Bishop development
        if piece and piece.piece_type == chess.BISHOP:
            return f"Вывод слона на открытую диагональ с давлением на позицию противника."

        # Check
        board.push(move)
        is_check = board.is_check()
        board.pop()
        if is_check:
            return f"Шах королю соперника с перехватом инициативы."

        return f"Позиционное усиление: оптимальный ход {ru_san} по оценке Stockfish ({score_str})."

    def close(self):
        if self.engine:
            try:
                self.engine.quit()
            except Exception:
                pass
            self.engine = None
