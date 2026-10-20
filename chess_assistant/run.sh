#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

if [ ! -d ".venv" ]; then
    echo "[!] Виртуальное окружение не найдено. Создаем..."
    python3 -m venv .venv
    .venv/bin/pip install chess mss pillow numpy pynput
fi

if [ "$1" == "calibrate" ]; then
    .venv/bin/python calibrate.py
else
    .venv/bin/python assistant.py
fi
