import sys
import time
import threading
import chess
from pynput import keyboard

from config import load_config, save_config, BASE_DIR
from engine_wrapper import ChessEngine
from vision import BoardVision
from web_hud import ChessStateHolder, WebHudServer

# ANSI Terminal Colors
C_GREEN = "\033[92m"
C_YELLOW = "\033[93m"
C_CYAN = "\033[96m"
C_BOLD = "\033[1m"
C_RED = "\033[91m"
C_RESET = "\033[0m"

class ChessAssistantApp:
    def __init__(self):
        self.config = load_config()
        self.player_color = self.config.get("player_color", "white").lower()
        self.board = chess.Board()

        # Engine init
        print(f"[*] Запуск шахматного движка Stockfish...")
        stockfish_path = self.config.get("stockfish_path")
        if not stockfish_path:
            print(f"{C_RED}[!] Ошибка: Stockfish не найден. Установите его: brew install stockfish{C_RESET}")
            sys.exit(1)

        self.engine = ChessEngine(stockfish_path)
        print(f"{C_GREEN}[+] Движок успешно запущен: {stockfish_path}{C_RESET}")

        # Vision init
        bbox = self.config.get("board_bbox", {})
        self.vision = BoardVision(bbox, self.player_color)

        # Web HUD init (stealth mode for phone)
        self.state_holder = ChessStateHolder()
        port = self.config.get("web_hud_port", 8765)
        self.web_server = WebHudServer(self.state_holder, port)
        try:
            self.web_server.start()
            urls = self.web_server.get_urls()
            print(f"{C_CYAN}[+] Скрытый Web-HUD запущен:{C_RESET}")
            print(f"    - На компьютере: {urls['localhost']}")
            print(f"    - На телефоне (в одной Wi-Fi сети): {urls['mobile']}")
        except Exception as e:
            print(f"{C_YELLOW}[!] Предупреждение: Не удалось запустить Web HUD: {e}{C_RESET}")

        self.auto_scan = False
        self.running = True
        self.lock = threading.Lock()

        # Initial reference snapshot
        try:
            self.vision.initialize_reference()
            print(f"{C_GREEN}[+] Опорный снимок доски сохранен.{C_RESET}")
        except Exception as e:
            print(f"{C_YELLOW}[!] Внимание: область доски еще не откалибрована!{C_RESET}")
            print(f"    Запустите калибровку: python calibrate.py")

        self._update_hud(initial=True)

    def print_hint(self, analysis: dict, trigger_reason: str = ""):
        if not analysis:
            return

        move_num = (len(self.board.move_stack) // 2) + 1
        turn_str = "БЕЛЫЕ" if self.board.turn == chess.WHITE else "ЧЕРНЫЕ"
        
        # Recent moves history
        recent = []
        for i, m in enumerate(self.board.move_stack[-6:]):
            idx = len(self.board.move_stack) - 6 + i
            m_num = (idx // 2) + 1
            if idx % 2 == 0:
                recent.append(f"{m_num}.{m.uci()}")
            else:
                recent.append(f"{m.uci()}")
        history_str = " ".join(recent) if recent else "Стартовая позиция"

        print("\n" + "═" * 60)
        if trigger_reason:
            print(f"[*] Событие: {trigger_reason}")
        print(f"[*] Позиция в памяти: {C_BOLD}Ход {move_num} ({turn_str}){C_RESET}")
        print(f"[*] История ходов: {history_str}")
        print(f"┌────────────────────────────────────────────────────────┐")
        print(f"│ {C_BOLD}ЛУЧШИЙ ХОД:{C_RESET}  {C_GREEN}{C_BOLD}{analysis['best_move_san']:<8}{C_RESET} ({analysis['best_move_uci']})")
        print(f"│ {C_BOLD}ОЦЕНКА:{C_RESET}      {C_YELLOW}{analysis['score_str']:<8}{C_RESET} (Глубина: {analysis['depth']})")
        print(f"│ {C_BOLD}ИДЕЯ ХОДА:{C_RESET}   {analysis['explanation']}")

        if analysis.get("lines") and len(analysis["lines"]) > 1:
            alt_str = " | ".join([f"{l['move_san']} ({l['score']})" for l in analysis["lines"][1:3]])
            print(f"│ {C_BOLD}ВАРИАНТЫ:{C_RESET}    {alt_str}")
        print(f"└────────────────────────────────────────────────────────┘")
        print("═" * 60)

    def analyze_current_position(self, reason: str = "Ручной запрос"):
        with self.lock:
            # Check if screen contains an opponent move
            detected_move, score, details = self.vision.detect_move(self.board)
            if detected_move:
                self.board.push(detected_move)
                reason = f"Обнаружен ход соперника на экране: {detected_move.uci()}"

            analysis = self.engine.evaluate(
                self.board,
                time_limit=self.config.get("engine_time", 0.2),
                depth=self.config.get("engine_depth", 18),
                multipv=self.config.get("multipv", 3)
            )

            self.print_hint(analysis, trigger_reason=reason)
            self._update_hud(analysis)

    def _update_hud(self, analysis: dict = None, initial: bool = False):
        if initial:
            analysis = self.engine.evaluate(self.board, time_limit=0.1, depth=10)

        if not analysis:
            return

        is_my_turn = (self.board.turn == (chess.WHITE if self.player_color == "white" else chess.BLACK))
        self.state_holder.update(
            fen=self.board.fen(),
            player_color=self.player_color,
            best_move_uci=analysis.get("best_move_uci"),
            best_move_san=analysis.get("best_move_san"),
            score_str=analysis.get("score_str", "+0.00"),
            score_val=analysis.get("score_val", 0.0),
            depth=analysis.get("depth", 18),
            explanation=analysis.get("explanation", ""),
            lines=analysis.get("lines", []),
            is_my_turn=is_my_turn
        )

    def auto_scan_loop(self):
        """Background thread scanning for moves on screen when auto-scan is active."""
        while self.running:
            if self.auto_scan:
                with self.lock:
                    detected_move, score, details = self.vision.detect_move(self.board)
                    if detected_move:
                        print(f"\n{C_CYAN}[+] Авто-детекция: ход {detected_move.uci()}{C_RESET}")
                        self.board.push(detected_move)
                        analysis = self.engine.evaluate(self.board)
                        self.print_hint(analysis, trigger_reason=f"Авто-детекция: {detected_move.uci()}")
                        self._update_hud(analysis)
            time.sleep(0.4)

    def reset_game(self):
        with self.lock:
            self.board.reset()
            self.vision.force_update_reference()
            print(f"{C_GREEN}[+] Доска сброшена в начальную позицию (Новая игра).{C_RESET}")
            self.analyze_current_position("Новая игра")

    def undo_move(self):
        with self.lock:
            if len(self.board.move_stack) > 0:
                m = self.board.pop()
                self.vision.force_update_reference()
                print(f"{C_YELLOW}[+] Отменен последний ход: {m.uci()}{C_RESET}")
                self.analyze_current_position("Отмена хода")
            else:
                print("[!] Стек ходов пуст.")

    def manual_move(self, uci_str: str):
        with self.lock:
            try:
                move = chess.Move.from_uci(uci_str)
                if move in self.board.legal_moves:
                    self.board.push(move)
                    self.vision.force_update_reference()
                    print(f"{C_GREEN}[+] Ход {uci_str} применен.{C_RESET}")
                    self.analyze_current_position(f"Ручной ввод хода: {uci_str}")
                else:
                    print(f"{C_RED}[!] Нелегальный ход: {uci_str}{C_RESET}")
            except Exception as e:
                print(f"{C_RED}[!] Ошибка хода: {e}{C_RESET}")

    def flip_color(self):
        with self.lock:
            self.player_color = "black" if self.player_color == "white" else "white"
            self.config["player_color"] = self.player_color
            save_config(self.config)
            self.vision.update_config(self.config["board_bbox"], self.player_color)
            print(f"{C_CYAN}[+] Цвет игрока изменен на: {self.player_color.upper()}{C_RESET}")
            self.analyze_current_position("Смена цвета игрока")

    def load_moves(self, text: str):
        with self.lock:
            import re
            # Remove move numbers like '1.', '2.', '1.e4'
            cleaned = re.sub(r'\d+\.+', ' ', text)
            tokens = cleaned.strip().split()
            new_board = chess.Board()
            success_count = 0
            for tok in tokens:
                tok = tok.strip().strip(",.;")
                if not tok:
                    continue
                try:
                    # Try SAN notation first (e4, c5, Nf3, Bb5)
                    move = new_board.parse_san(tok)
                    new_board.push(move)
                    success_count += 1
                except Exception:
                    try:
                        # Try UCI notation (e2e4, g1f3)
                        move = chess.Move.from_uci(tok)
                        if move in new_board.legal_moves:
                            new_board.push(move)
                            success_count += 1
                        else:
                            print(f"{C_RED}[!] Не удалось распознать ход: {tok}{C_RESET}")
                            break
                    except Exception:
                        print(f"{C_RED}[!] Не удалось распознать ход: {tok}{C_RESET}")
                        break

            if success_count > 0:
                self.board = new_board
                self.vision.force_update_reference()
                print(f"{C_GREEN}[+] Успешно загружено ходов: {success_count}. Позиция синхронизирована!{C_RESET}")
                self.analyze_current_position(f"Загрузка {success_count} ходов")
            else:
                print(f"{C_RED}[!] Ни один ход не был загружен.{C_RESET}")

    def run_cli(self):
        # Start auto-scan thread
        scan_thread = threading.Thread(target=self.auto_scan_loop, daemon=True)
        scan_thread.start()

        print("\n" + "=" * 60)
        print("          ШАХМАТНЫЙ ПОДСКАЗЧИК ГОТОВ К ИГРЕ          ")
        print("=" * 60)
        print("Горячие команды терминала:")
        print("  [Enter] / h      - Получить подсказку / обновить позицию")
        print("  auto on / off    - Включить / выключить авто-сканирование экрана")
        print("  moves <ходы>     - Синхронизировать партию (e4 c5 a4 Nc6...)")
        print("  sync             - Перекалибровать опорный снимок доски")
        print("  flip             - Сменить цвет (Белые <-> Черные)")
        print("  m <ход>          - Ввести 1 ход вручную (например: m e2e4)")
        print("  u                - Отменить последний ход")
        print("  new / reset      - Начать новую партию с 1-го хода")
        print("  q                - Выход")
        print("=" * 60)

        # First evaluation
        self.analyze_current_position("Старт партии")

        while self.running:
            try:
                cmd = input("\n[Chess] > ").strip()
                if not cmd or cmd == "h":
                    self.analyze_current_position("Запрос подсказки")
                elif cmd == "auto on":
                    self.auto_scan = True
                    print(f"{C_GREEN}[+] Авто-сканирование экрана ВКЛЮЧЕНО (каждые 400мс).{C_RESET}")
                elif cmd == "auto off":
                    self.auto_scan = False
                    print(f"{C_YELLOW}[+] Авто-сканирование экрана ВЫКЛЮЧЕНО.{C_RESET}")
                elif cmd.startswith("moves ") or cmd.startswith("pgn "):
                    parts = cmd.split(" ", 1)
                    if len(parts) > 1:
                        self.load_moves(parts[1])
                elif cmd == "sync":
                    self.vision.force_update_reference()
                    print(f"{C_GREEN}[+] Опорный снимок доски обновлен!{C_RESET}")
                elif cmd == "flip":
                    self.flip_color()
                elif cmd == "new" or cmd == "reset":
                    self.reset_game()
                elif cmd == "u" or cmd == "undo":
                    self.undo_move()
                elif cmd.startswith("m "):
                    parts = cmd.split()
                    if len(parts) > 1:
                        self.manual_move(parts[1])
                elif cmd == "q" or cmd == "exit":
                    self.running = False
                    print("[*] Завершение работы...")
                    break
                else:
                    print(f"[?] Неизвестная команда: {cmd}. Нажмите Enter для подсказки или 'q' для выхода.")
            except (KeyboardInterrupt, EOFError):
                self.running = False
                break

        self.engine.close()
        self.web_server.stop()
        print("[OK] До скорой встречи!")

if __name__ == "__main__":
    app = ChessAssistantApp()
    app.run_cli()
