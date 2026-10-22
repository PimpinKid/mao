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
        self.lock = threading.RLock()

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

        is_my_turn = (self.board.turn == (chess.WHITE if self.player_color == "white" else chess.BLACK))

        bottom_str = "БЕЛЫЕ" if self.player_color == "white" else "ЧЕРНЫЕ"

        print("\n" + "═" * 60)
        if trigger_reason:
            print(f"[*] Событие:          {trigger_reason}")
        print(f"[*] Игрок снизу (ВЫ): {C_CYAN}{C_BOLD}{bottom_str}{C_RESET} (определено со снимка)")
        print(f"[*] Чей сейчас ход:   {C_BOLD}{turn_str}{C_RESET} (Ход {move_num})")
        print(f"[*] История ходов:    {history_str}")
        print(f"┌────────────────────────────────────────────────────────┐")
        if is_my_turn:
            print(f"│ {C_BOLD}СТАТУС:{C_RESET}      {C_GREEN}{C_BOLD}ВАШ ХОД ({turn_str}){C_RESET}")
            print(f"│ {C_BOLD}ЛУЧШИЙ ХОД:{C_RESET}  {C_GREEN}{C_BOLD}{analysis['best_move_san']:<8}{C_RESET} ({analysis['best_move_uci']})")
        else:
            print(f"│ {C_BOLD}СТАТУС:{C_RESET}      {C_YELLOW}ОЖИДАНИЕ ХОДА СОПЕРНИКА ({turn_str}){C_RESET}")
            print(f"│ {C_BOLD}ОЖИДАЕТСЯ:{C_RESET}   {analysis['best_move_san']} ({analysis['best_move_uci']}) от соперника")
            if analysis.get("reply_move_san"):
                print(f"│ {C_BOLD}ВАШ ОТВЕТ:{C_RESET}   {C_GREEN}{C_BOLD}{analysis['reply_move_san']:<8}{C_RESET} ({analysis['reply_move_uci']}) (на этот ход соперника)")

        print(f"│ {C_BOLD}ОЦЕНКА:{C_RESET}      {C_YELLOW}{analysis['score_str']:<8}{C_RESET} (Глубина: {analysis['depth']})")
        print(f"│ {C_BOLD}ИДЕЯ ХОДА:{C_RESET}   {analysis['explanation']}")

        if analysis.get("lines") and len(analysis["lines"]) > 1:
            alt_str = " | ".join([f"{l['move_san']} ({l['score']})" for l in analysis["lines"][1:3]])
            print(f"│ {C_BOLD}ВАРИАНТЫ:{C_RESET}    {alt_str}")
        print(f"└────────────────────────────────────────────────────────┘")
        print("═" * 60)

    def analyze_current_position(self, reason: str = "Запрос по Enter"):
        with self.lock:
            # 1. Directly scan screen and synchronize exact board state!
            synced_board, bottom_player, success = self.vision.sync_board_state(self.board)
            if success:
                self.board = synced_board
                reason = "Доска мгновенно синхронизирована со снимка экрана"

            # Auto-update player perspective if bottom player changed (White <-> Black)
            if bottom_player != self.player_color:
                self.player_color = bottom_player
                self.config["player_color"] = bottom_player
                self.vision.update_config(self.config["board_bbox"], self.player_color)

            # 2. Evaluate with Stockfish for the current board
            analysis = self.engine.evaluate(
                self.board,
                time_limit=self.config.get("engine_time", 0.25),
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
            reply_move_uci=analysis.get("reply_move_uci"),
            reply_move_san=analysis.get("reply_move_san"),
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
                        # Require stability: verify move is still present after 150ms (filters animations/cursor)
                        time.sleep(0.15)
                        confirm_move, _, _ = self.vision.detect_move(self.board)
                        if confirm_move == detected_move:
                            print(f"\n{C_CYAN}[+] Авто-детекция: ход {detected_move.uci()}{C_RESET}")
                            self.board.push(detected_move)
                            analysis = self.engine.evaluate(self.board)
                            self.print_hint(analysis, trigger_reason=f"Авто-детекция: {detected_move.uci()}")
                            self._update_hud(analysis)
            time.sleep(0.5)

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

    def calibrate_in_app(self):
        with self.lock:
            from calibrate import calibrate_interactive
            calibrate_interactive()
            self.config = load_config()
            self.player_color = self.config.get("player_color", "white").lower()
            self.vision.update_config(self.config["board_bbox"], self.player_color)
            self.board.reset()
            self.vision.force_update_reference()
            print(f"{C_GREEN}[+] Калибровка завершена! Доска сброшена на старт.{C_RESET}")
            self.analyze_current_position("Новая калибровка")

    def run_cli(self):
        # Start auto-scan thread
        scan_thread = threading.Thread(target=self.auto_scan_loop, daemon=True)
        scan_thread.start()

        print("\n" + "=" * 60)
        print("          ШАХМАТНЫЙ ПОДСКАЗЧИК ГОТОВ К ИГРЕ          ")
        print("=" * 60)
        print("Горячие команды терминала:")
        print("  [Enter]          - СКАН ЭКРАНА И ЛУЧШИЙ ХОД (для игрока снизу)")
        print("  auto on / off    - Включить / выключить авто-сканирование экрана")
        print("  cal              - Откалибровать доску под новое окно")
        print("  moves <ходы>     - Ввести ходы вручную (если нужно)")
        print("  flip             - Принудительно сменить цвет (Белые <-> Черные)")
        print("  new / reset      - Сброс на стартовую позицию")
        print("  q                - Выход")
        print("=" * 60)

        # First evaluation of start position (instant, does not block startup)
        init_analysis = self.engine.evaluate(self.board, time_limit=0.1, depth=10)
        self.print_hint(init_analysis, trigger_reason="Готов к игре")
        self._update_hud(init_analysis)

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
                elif cmd == "cal" or cmd == "calibrate":
                    self.calibrate_in_app()
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
