import http.server
import socketserver
import json
import threading
import chess
import chess.svg
import socket

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
            "score_str": "+0.00",
            "score_val": 0.0,
            "depth": 0,
            "explanation": "Ожидание первого хода...",
            "last_move": None,
            "reply_move_uci": None,
            "reply_move_san": None,
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
            
            # Only draw the recommendation arrow when it is the player's turn!
            if is_my_turn and best_uci and len(best_uci) >= 4:
                try:
                    m = chess.Move.from_uci(best_uci)
                    arrows.append(chess.svg.Arrow(m.from_square, m.to_square, color="#22c55e"))
                except Exception:
                    pass

            orientation = chess.WHITE if self.state.get("player_color") == "white" else chess.BLACK
            return chess.svg.board(board=board, orientation=orientation, arrows=arrows, size=420)

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>Скрытый Chess HUD</title>
  <style>
    :root {
      --bg: #0f172a;
      --card: #1e293b;
      --accent: #22c55e;
      --text: #f8fafc;
      --muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); padding: 16px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
    .header { width: 100%; max-width: 480px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .badge { padding: 5px 12px; border-radius: 999px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .badge.green { background: #166534; color: #bbf7d0; }
    .badge.yellow { background: #854d0e; color: #fef08a; }
    .hud-card { width: 100%; max-width: 480px; background: var(--card); border-radius: 16px; padding: 18px; margin-bottom: 14px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
    .move-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .best-move { font-size: 32px; font-weight: 800; color: var(--accent); letter-spacing: -0.5px; }
    .best-move.waiting { font-size: 22px; color: #94a3b8; }
    .eval-badge { font-size: 20px; font-weight: 700; background: #0f172a; padding: 6px 14px; border-radius: 10px; border: 1px solid #334155; }
    .explanation { font-size: 14px; color: var(--muted); line-height: 1.4; margin-top: 6px; }
    .board-container { width: 100%; max-width: 480px; display: flex; justify-content: center; background: var(--card); border-radius: 16px; padding: 12px; margin-bottom: 14px; }
    .board-container svg { width: 100% !important; height: auto !important; max-width: 420px; border-radius: 8px; }
    .alternatives { width: 100%; max-width: 480px; font-size: 13px; color: var(--muted); }
    .alt-item { display: inline-block; background: #334155; padding: 3px 8px; border-radius: 6px; margin-right: 6px; margin-top: 4px; color: #e2e8f0; }
  </style>
</head>
<body>
  <div class="header">
    <div style="font-weight: 700; font-size: 16px;">♟ Chess Stealth HUD</div>
    <div class="badge green" id="statusBadge">ВАШ ХОД</div>
  </div>

  <div class="hud-card">
    <div class="move-row">
      <div>
        <div style="font-size: 12px; color: var(--muted); text-transform: uppercase;" id="moveLabel">Лучший ход для вас</div>
        <div class="best-move" id="bestMove">-</div>
      </div>
      <div class="eval-badge" id="evalScore">+0.00</div>
    </div>
    <div class="explanation" id="explanationText">Ожидание позиции...</div>
    <div id="altMoves" class="alternatives" style="margin-top: 10px;"></div>
  </div>

  <div class="board-container" id="boardSvgWrapper">
    <!-- SVG board will be injected here -->
  </div>

  <script>
    async function updateHUD() {
      try {
        const res = await fetch('/api/state');
        if (res.ok) {
          const data = await res.json();
          const badge = document.getElementById('statusBadge');
          const moveLabel = document.getElementById('moveLabel');
          const bestMove = document.getElementById('bestMove');

          if (data.is_my_turn) {
            badge.className = 'badge green';
            badge.innerText = 'ВАШ ХОД (' + data.player_color.toUpperCase() + ')';
            moveLabel.innerText = 'ЛУЧШИЙ ХОД ДЛЯ ВАС';
            bestMove.className = 'best-move';
            bestMove.innerText = data.best_move_san || data.best_move_uci || 'Ожидание';
            document.getElementById('explanationText').innerText = data.explanation || '';
            
            if (data.lines && data.lines.length > 1) {
              const alts = data.lines.slice(1).map(l => `<span class="alt-item">${l.move_san} (${l.score})</span>`).join('');
              document.getElementById('altMoves').innerHTML = 'Варианты: ' + alts;
            } else {
              document.getElementById('altMoves').innerHTML = '';
            }
          } else {
            const oppColor = (data.player_color === 'white') ? 'ЧЕРНЫХ' : 'БЕЛЫХ';
            badge.className = 'badge yellow';
            badge.innerText = 'ХОД СОПЕРНИКА (' + oppColor + ')';
            
            if (data.reply_move_san) {
              moveLabel.innerText = 'ОЖИДАЕТСЯ ' + (data.best_move_san || '') + ' → ВАШ ОТВЕТ:';
              bestMove.className = 'best-move';
              bestMove.innerText = data.reply_move_san;
              document.getElementById('explanationText').innerText = 'Соперник выбирает ход. Лучший ответ при ' + data.best_move_san + ' — ход ' + data.reply_move_san;
            } else {
              moveLabel.innerText = 'СТАТУС';
              bestMove.className = 'best-move waiting';
              bestMove.innerText = '⏳ Ожидание хода ' + oppColor;
              document.getElementById('explanationText').innerText = 'Соперник думает. Ожидайте ход на доске...';
            }
            document.getElementById('altMoves').innerHTML = '';
          }

          document.getElementById('evalScore').innerText = data.score_str || '0.00';
        }

        const svgRes = await fetch('/api/board.svg');
        if (svgRes.ok) {
          const svgText = await svgRes.text();
          document.getElementById('boardSvgWrapper').innerHTML = svgText;
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }
    setInterval(updateHUD, 600);
    updateHUD();
  </script>
</body>
</html>
"""

import sys

class SilentThreadingServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True

    def handle_error(self, request, client_address):
        exc_type, _, _ = sys.exc_info()
        if exc_type and issubclass(exc_type, (BrokenPipeError, ConnectionResetError)):
            return
        super().handle_error(request, client_address)

def make_handler(state_holder: ChessStateHolder):
    class CustomHandler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            try:
                if self.path == "/" or self.path == "/index.html":
                    self.send_response(200)
                    self.send_header("Content-Type", "text/html; charset=utf-8")
                    self.end_headers()
                    self.wfile.write(HTML_TEMPLATE.encode("utf-8"))
                elif self.path == "/api/state":
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps(state_holder.get_state()).encode("utf-8"))
                elif self.path == "/api/board.svg":
                    self.send_response(200)
                    self.send_header("Content-Type", "image/svg+xml")
                    self.end_headers()
                    self.wfile.write(state_holder.get_svg_board().encode("utf-8"))
                else:
                    self.send_response(404)
                    self.end_headers()
            except (BrokenPipeError, ConnectionResetError):
                pass

        def log_message(self, format, *args):
            # Suppress console clutter
            pass

    return CustomHandler

class WebHudServer:
    def __init__(self, state_holder: ChessStateHolder, port: int = 8765):
        self.state_holder = state_holder
        self.port = port
        self.server = None
        self.thread = None

    def start(self):
        handler_class = make_handler(self.state_holder)
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
