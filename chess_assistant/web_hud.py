import http.server
import socketserver
import json
import threading
import chess
import chess.svg
import socket
import sys

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

class ChessStateHolder:
    def __init__(self):
        self.lock = threading.RLock()
        self.state = {
            "fen": chess.STARTING_FEN,
            "player_color": "white",
            "best_move_uci": None,
            "best_move_san": None,
            "reply_move_uci": None,
            "reply_move_san": None,
            "score_str": "+0.00",
            "score_val": 0.0,
            "depth": 0,
            "explanation": "Стартовая позиция. Сделайте первый ход!",
            "is_my_turn": True,
            "lines": []
        }

    def update(self, **kwargs):
        with self.lock:
            self.state.update(kwargs)

    def get_state(self):
        with self.lock:
            return dict(self.state)

    def get_svg_board(self):
        with self.lock:
            fen = self.state.get("fen", chess.STARTING_FEN)
            board = chess.Board(fen)
            arrows = []
            is_my_turn = self.state.get("is_my_turn", True)
            best_uci = self.state.get("best_move_uci")
            
            # Show recommendation arrow
            if is_my_turn and best_uci and len(best_uci) >= 4:
                try:
                    m = chess.Move.from_uci(best_uci)
                    arrows.append(chess.svg.Arrow(m.from_square, m.to_square, color="#22c55e"))
                except Exception:
                    pass

            orientation = chess.WHITE if self.state.get("player_color") == "white" else chess.BLACK
            return chess.svg.board(board=board, orientation=orientation, arrows=arrows, size=390)

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Chess Stealth Remote</title>
  <style>
    :root {
      --bg: #0b1120;
      --card: #151f32;
      --card-border: #1e293b;
      --accent: #22c55e;
      --accent-hover: #16a34a;
      --warning: #eab308;
      --danger: #ef4444;
      --text: #f8fafc;
      --muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      width: 100%;
      max-width: 420px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 2px;
    }
    .title {
      font-size: 17px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .badge {
      padding: 5px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge.green { background: #14532d; color: #86efac; border: 1px solid #166534; }
    .badge.yellow { background: #713f12; color: #fde047; border: 1px solid #854d0e; }

    /* Move Card */
    .hud-card {
      background: var(--card);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    }
    .move-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .move-label {
      font-size: 11px;
      color: var(--muted);
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .best-move {
      font-size: 28px;
      font-weight: 800;
      color: var(--accent);
      line-height: 1.1;
    }
    .best-move.waiting {
      font-size: 20px;
      color: var(--warning);
    }
    .eval-badge {
      font-size: 18px;
      font-weight: 800;
      background: #0b1120;
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid var(--card-border);
      color: #38bdf8;
    }
    .explanation {
      font-size: 13px;
      color: var(--muted);
      line-height: 1.35;
    }

    /* Main Next Move Button */
    .btn-main {
      background: var(--accent);
      color: #052e16;
      border: none;
      padding: 14px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
      transition: all 0.15s ease;
    }
    .btn-main:active {
      transform: scale(0.98);
      background: var(--accent-hover);
    }
    .btn-main:disabled {
      background: #1e293b;
      color: #64748b;
      box-shadow: none;
      cursor: not-allowed;
    }

    /* Secondary Action Buttons */
    .btn-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
    }
    .btn-sub {
      background: #1e293b;
      color: #e2e8f0;
      border: 1px solid #334155;
      padding: 9px 4px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
    }
    .btn-sub:active {
      background: #334155;
    }

    /* Chessboard SVG Container */
    .board-container {
      width: 100%;
      background: var(--card);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      touch-action: manipulation;
      user-select: none;
      position: relative;
    }
    .board-container svg {
      width: 100% !important;
      height: auto !important;
      max-width: 390px;
      border-radius: 8px;
      cursor: pointer;
    }

    /* Selection Indicator */
    .hint-text {
      font-size: 12px;
      text-align: center;
      color: var(--muted);
      margin-top: 2px;
    }

    /* Toast notification */
    #toast {
      position: fixed;
      bottom: 20px;
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid var(--card-border);
      color: var(--text);
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.25s ease;
      z-index: 999;
    }
    #toast.show {
      opacity: 1;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">♟ Chess Remote</div>
      <div class="badge green" id="statusBadge">ВАШ ХОД</div>
    </div>

    <!-- Main Best Move HUD Card -->
    <div class="hud-card">
      <div class="move-row">
        <div>
          <div class="move-label" id="moveLabel">ЛУЧШИЙ ХОД</div>
          <div class="best-move" id="bestMove">-</div>
        </div>
        <div class="eval-badge" id="evalScore">+0.00</div>
      </div>
      <div class="explanation" id="explanationText">Загрузка позиции...</div>
    </div>

    <!-- Primary Action: Apply Best Move / Next Move -->
    <button class="btn-main" id="btnNextMove" onclick="applyNextMove()">
      ⚡️ Сделать ход: <span id="btnMoveName">-</span>
    </button>

    <!-- Secondary Actions Row -->
    <div class="btn-row">
      <button class="btn-sub" onclick="undoMove()">↩️ Отмена</button>
      <button class="btn-sub" id="btnColor" onclick="flipColor()">⚪ Я за Белых</button>
      <button class="btn-sub" onclick="resetBoard()">🔄 Сброс</button>
    </div>

    <!-- Interactive Chess Board -->
    <div class="board-container" id="boardSvgWrapper">
      <!-- SVG injected here -->
    </div>
    <div class="hint-text" id="boardHint">Нажмите на клетку "откуда", затем "куда", чтобы сделать ход</div>
  </div>

  <div id="toast"></div>

  <script>
    let currentState = null;
    let selectedSquare = null;
    let isRequestInProgress = false;

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.innerText = msg;
      t.className = 'show';
      setTimeout(() => { t.className = ''; }, 2000);
    }

    async function updateHUD() {
      if (isRequestInProgress) return;
      try {
        const res = await fetch('/api/state');
        if (res.ok) {
          const data = await res.json();
          currentState = data;

          const badge = document.getElementById('statusBadge');
          const moveLabel = document.getElementById('moveLabel');
          const bestMove = document.getElementById('bestMove');
          const evalScore = document.getElementById('evalScore');
          const explanation = document.getElementById('explanationText');
          const btnNext = document.getElementById('btnNextMove');
          const btnMoveName = document.getElementById('btnMoveName');
          const btnColor = document.getElementById('btnColor');
          const boardHint = document.getElementById('boardHint');

          btnColor.innerText = (data.player_color === 'white') ? '⚪ Я за Белых' : '⚫ Я за Черных';

          if (data.is_my_turn) {
            badge.className = 'badge green';
            badge.innerText = 'ВАШ ХОД (' + data.player_color.toUpperCase() + ')';
            moveLabel.innerText = 'ЛУЧШИЙ ХОД ДЛЯ ВАС';
            bestMove.className = 'best-move';
            bestMove.innerText = data.best_move_san || data.best_move_uci || '-';
            explanation.innerText = data.explanation || '';

            btnNext.disabled = false;
            btnMoveName.innerText = data.best_move_san || data.best_move_uci || 'Ход сделан';
            boardHint.innerText = 'Сделайте ход на компьютере и нажмите "Сделать ход" (или тапните на доске)';
          } else {
            const oppColor = (data.player_color === 'white') ? 'ЧЕРНЫХ' : 'БЕЛЫХ';
            badge.className = 'badge yellow';
            badge.innerText = 'ХОД СОПЕРНИКА (' + oppColor + ')';
            moveLabel.innerText = 'ОЖИДАЕТСЯ ОТ СОПЕРНИКА';
            bestMove.className = 'best-move waiting';
            bestMove.innerText = data.best_move_san || 'Ожидание';
            explanation.innerText = data.reply_move_san
              ? 'Ваш лучший ответ при ' + data.best_move_san + ' — ход ' + data.reply_move_san
              : 'Тапните фигуру соперника на доске ниже, чтобы сделать его ход';

            btnNext.disabled = true;
            btnMoveName.innerText = 'Ожидание соперника...';
            boardHint.innerText = '👉 Нажмите фигуру противника, чтобы сделать его ход';
          }

          evalScore.innerText = data.score_str || '+0.00';
        }

        const svgRes = await fetch('/api/board.svg');
        if (svgRes.ok) {
          const svgText = await svgRes.text();
          const wrapper = document.getElementById('boardSvgWrapper');
          wrapper.innerHTML = svgText;
          attachBoardEvents();
          if (selectedSquare) {
            highlightSelectedSquare(selectedSquare);
          }
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }

    function attachBoardEvents() {
      const svg = document.querySelector('#boardSvgWrapper svg');
      if (!svg) return;

      svg.onclick = (e) => handleBoardClick(e);
    }

    function handleBoardClick(e) {
      if (!currentState) return;
      const svg = document.querySelector('#boardSvgWrapper svg');
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const scale = 390.0 / rect.width;
      const clickX = (e.clientX - rect.left) * scale;
      const clickY = (e.clientY - rect.top) * scale;

      // Board grid is between 15 and 375 px (margin 15px)
      if (clickX < 15 || clickX >= 375 || clickY < 15 || clickY >= 375) {
        clearSelection();
        return;
      }

      const col = Math.floor((clickX - 15) / 45.0);
      const row = Math.floor((clickY - 15) / 45.0);

      let sq;
      if (currentState.player_color === 'white') {
        sq = String.fromCharCode(97 + col) + (8 - row);
      } else {
        sq = String.fromCharCode(104 - col) + (row + 1);
      }

      onSquareTapped(sq);
    }

    function onSquareTapped(sq) {
      if (!selectedSquare) {
        selectedSquare = sq;
        highlightSelectedSquare(sq);
      } else if (selectedSquare === sq) {
        clearSelection();
      } else {
        const moveUci = selectedSquare + sq;
        clearSelection();
        sendMove(moveUci);
      }
    }

    function highlightSelectedSquare(sq) {
      removeExistingHighlight();
      const svg = document.querySelector('#boardSvgWrapper svg');
      if (!svg || !currentState) return;

      const colIdx = (currentState.player_color === 'white')
        ? (sq.charCodeAt(0) - 97)
        : (104 - sq.charCodeAt(0));
      const rowIdx = (currentState.player_color === 'white')
        ? (8 - parseInt(sq[1], 10))
        : (parseInt(sq[1], 10) - 1);

      const x = 15 + colIdx * 45;
      const y = 15 + rowIdx * 45;

      const hl = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      hl.setAttribute("id", "selectionHighlight");
      hl.setAttribute("x", x);
      hl.setAttribute("y", y);
      hl.setAttribute("width", 45);
      hl.setAttribute("height", 45);
      hl.setAttribute("fill", "rgba(234, 179, 8, 0.45)");
      hl.setAttribute("stroke", "#eab308");
      hl.setAttribute("stroke-width", "3");
      hl.setAttribute("pointer-events", "none");
      svg.appendChild(hl);
    }

    function removeExistingHighlight() {
      const old = document.getElementById('selectionHighlight');
      if (old) old.remove();
    }

    function clearSelection() {
      selectedSquare = null;
      removeExistingHighlight();
    }

    async function sendMove(moveUci) {
      isRequestInProgress = true;
      try {
        const res = await fetch('/api/move', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ move: moveUci })
        });
        const data = await res.json();
        if (data.status === 'ok') {
          showToast('Ход ' + moveUci + ' сделан');
        } else {
          showToast('⚠️ Невозможный ход: ' + moveUci);
        }
      } catch (e) {
        showToast('⚠️ Ошибка соединения');
      } finally {
        isRequestInProgress = false;
        updateHUD();
      }
    }

    async function applyNextMove() {
      isRequestInProgress = true;
      try {
        const res = await fetch('/api/apply_best', { method: 'POST' });
        const data = await res.json();
        if (data.status === 'ok') {
          showToast('Ход применен!');
        } else {
          showToast('Нет доступного хода');
        }
      } catch (e) {
        showToast('⚠️ Ошибка соединения');
      } finally {
        isRequestInProgress = false;
        updateHUD();
      }
    }

    async function undoMove() {
      isRequestInProgress = true;
      try {
        await fetch('/api/undo', { method: 'POST' });
        showToast('Ход отменен');
      } catch (e) {
        showToast('⚠️ Ошибка соединения');
      } finally {
        isRequestInProgress = false;
        updateHUD();
      }
    }

    async function resetBoard() {
      if (!confirm('Сбросить доску в начальное положение?')) return;
      isRequestInProgress = true;
      try {
        await fetch('/api/reset', { method: 'POST' });
        showToast('Новая игра начата');
      } catch (e) {
        showToast('⚠️ Ошибка соединения');
      } finally {
        isRequestInProgress = false;
        updateHUD();
      }
    }

    async function flipColor() {
      isRequestInProgress = true;
      try {
        await fetch('/api/flip', { method: 'POST' });
      } catch (e) {
        showToast('⚠️ Ошибка соединения');
      } finally {
        isRequestInProgress = false;
        updateHUD();
      }
    }

    setInterval(updateHUD, 800);
    updateHUD();
  </script>
</body>
</html>
"""

class SilentThreadingServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True

    def handle_error(self, request, client_address):
        exc_type, _, _ = sys.exc_info()
        if exc_type and issubclass(exc_type, (BrokenPipeError, ConnectionResetError)):
            return
        super().handle_error(request, client_address)

def make_handler(state_holder: ChessStateHolder, action_callback=None):
    class CustomHandler(http.server.BaseHTTPRequestHandler):
        def do_OPTIONS(self):
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()

        def do_POST(self):
            try:
                content_len = int(self.headers.get("Content-Length", 0))
                post_data = self.rfile.read(content_len).decode("utf-8") if content_len > 0 else "{}"
                try:
                    payload = json.loads(post_data) if post_data else {}
                except Exception:
                    payload = {}

                res_data = {"status": "ok"}
                if self.path == "/api/move":
                    if action_callback:
                        res_data = action_callback("move", payload)
                elif self.path == "/api/apply_best":
                    if action_callback:
                        res_data = action_callback("apply_best", payload)
                elif self.path == "/api/undo":
                    if action_callback:
                        res_data = action_callback("undo", payload)
                elif self.path == "/api/reset":
                    if action_callback:
                        res_data = action_callback("reset", payload)
                elif self.path == "/api/flip":
                    if action_callback:
                        res_data = action_callback("flip", payload)
                elif self.path == "/api/sync_fen":
                    if action_callback:
                        res_data = action_callback("sync_fen", payload)
                else:
                    self.send_response(404)
                    self.end_headers()
                    return

                self.send_response(200)
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(res_data).encode("utf-8"))

            except (BrokenPipeError, ConnectionResetError):
                pass
            except Exception as e:
                try:
                    self.send_response(500)
                    self.end_headers()
                except Exception:
                    pass

        def do_GET(self):
            try:
                if self.path == "/" or self.path == "/index.html":
                    self.send_response(200)
                    self.send_header("Content-Type", "text/html; charset=utf-8")
                    self.send_header("Access-Control-Allow-Origin", "*")
                    self.end_headers()
                    self.wfile.write(HTML_TEMPLATE.encode("utf-8"))
                elif self.path == "/api/state":
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.send_header("Access-Control-Allow-Origin", "*")
                    self.end_headers()
                    self.wfile.write(json.dumps(state_holder.get_state()).encode("utf-8"))
                elif self.path == "/api/board.svg":
                    self.send_response(200)
                    self.send_header("Content-Type", "image/svg+xml")
                    self.send_header("Access-Control-Allow-Origin", "*")
                    self.end_headers()
                    self.wfile.write(state_holder.get_svg_board().encode("utf-8"))
                else:
                    self.send_response(404)
                    self.end_headers()
            except (BrokenPipeError, ConnectionResetError):
                pass

        def log_message(self, format, *args):
            pass

    return CustomHandler

class WebHudServer:
    def __init__(self, state_holder: ChessStateHolder, port: int = 8765, action_callback=None):
        self.state_holder = state_holder
        self.port = port
        self.action_callback = action_callback
        self.server = None
        self.thread = None

    def start(self):
        handler_class = make_handler(self.state_holder, self.action_callback)
        self.server = SilentThreadingServer(("0.0.0.0", self.port), handler_class)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def get_urls(self):
        local_ip = get_local_ip()
        return {
            "localhost": f"http://localhost:{self.port}",
            "mobile": f"http://{local_ip}:{self.port}"
        }

    def stop(self):
        if self.server:
            self.server.shutdown()
            self.server.server_close()
