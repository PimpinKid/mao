import os
import json
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
CONFIG_FILE = BASE_DIR / "config.json"

DEFAULT_CONFIG = {
    "stockfish_path": "",
    "board_bbox": {
        "left": 0,
        "top": 0,
        "width": 600,
        "height": 600
    },
    "player_color": "white",  # "white" or "black"
    "engine_depth": 18,
    "engine_time": 0.2,       # seconds per move calculation
    "multipv": 3,             # show top 3 best moves
    "web_hud_port": 8765
}

def find_stockfish():
    """Auto-detect Stockfish binary path on system."""
    candidates = [
        shutil.which("stockfish"),
        "/opt/homebrew/bin/stockfish",
        "/usr/local/bin/stockfish",
        "/usr/bin/stockfish"
    ]
    for p in candidates:
        if p and os.path.exists(p) and os.access(p, os.X_OK):
            return p
    return ""

def load_config():
    """Load configuration from file or create with defaults."""
    config = DEFAULT_CONFIG.copy()
    if CONFIG_FILE.exists():
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                saved = json.load(f)
                config.update(saved)
        except Exception as e:
            print(f"[!] Warning reading config: {e}, using defaults.")

    if not config.get("stockfish_path") or not os.path.exists(config["stockfish_path"]):
        detected = find_stockfish()
        if detected:
            config["stockfish_path"] = detected

    return config

def save_config(config):
    """Save configuration to file."""
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
