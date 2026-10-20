import time
import json
from pathlib import Path
from pynput import mouse
from PIL import Image
import mss

from config import load_config, save_config, BASE_DIR

def get_mouse_pos():
    m = mouse.Controller()
    return m.position

def calibrate_interactive():
    print("=" * 60)
    print("      КАЛИБРОВКА ОБЛАСТИ ШАХМАТНОЙ ДОСКИ НА ЭКРАНЕ      ")
    print("=" * 60)
    print("1. Откройте окно с шахматами (Discord или Chess.com) на экране.")
    print("2. Доска должна быть полностью видна.")
    print("-" * 60)

    input("\n[1] Наведите курсор мыши на ВЕРХНИЙ ЛЕВЫЙ угол шахматной доски\n    (угол клетки a8 или h1) и нажмите ENTER...")
    time.sleep(0.3)
    x1, y1 = get_mouse_pos()
    print(f"    --> Зафиксирован угол 1: X={int(x1)}, Y={int(y1)}")

    input("\n[2] Теперь наведите курсор мыши на НИЖНИЙ ПРАВЫЙ угол шахматной доски\n    (противоположный по диагонали) и нажмите ENTER...")
    time.sleep(0.3)
    x2, y2 = get_mouse_pos()
    print(f"    --> Зафиксирован угол 2: X={int(x2)}, Y={int(y2)}")

    left = int(min(x1, x2))
    top = int(min(y1, y2))
    width = int(abs(x2 - x1))
    height = int(abs(y2 - y1))

    # Safety check for square aspect ratio
    side = max(width, height)
    print(f"\n[+] Исходный размер: {width} x {height}")
    print(f"[+] Нормализованный размер доски: {side} x {side}")

    config = load_config()
    config["board_bbox"] = {
        "left": left,
        "top": top,
        "width": side,
        "height": side
    }

    color_choice = input("\n[3] За какой цвет вы обычно играете? (w - белые [по умолч.], b - черные): ").strip().lower()
    if color_choice == "b":
        config["player_color"] = "black"
    else:
        config["player_color"] = "white"

    save_config(config)
    print(f"\n[OK] Настройки сохранены в {BASE_DIR / 'config.json'}!")

    # Verify by taking a test snapshot
    test_snapshot_path = BASE_DIR / "test_calibrated_board.png"
    with mss.mss() as sct:
        monitor = {
            "top": top,
            "left": left,
            "width": side,
            "height": side
        }
        raw = sct.grab(monitor)
        img = Image.frombytes("RGB", raw.size, raw.bgra, "raw", "BGRX")
        img.save(test_snapshot_path)

    print(f"[+] Тестовый скриншот доски сохранен в:\n    {test_snapshot_path}")
    print("    Откройте его и убедитесь, что доска захвачена ровно без лишних рамок.")
    print("=" * 60)

if __name__ == "__main__":
    calibrate_interactive()
