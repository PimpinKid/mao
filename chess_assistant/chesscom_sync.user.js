// ==UserScript==
// @name         Chess.com Stealth Assistant Bridge
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Silent bridge from Chess.com to local Stockfish Assistant and Web HUD
// @author       Assistant
// @match        https://www.chess.com/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  let lastSentState = "";
  let debounceTimer = null;

  function parseSquare(clsList) {
    for (const cls of clsList) {
      if (cls.startsWith('square-')) {
        const val = cls.replace('square-', '');
        if (/^\d{2}$/.test(val)) {
          return { col: parseInt(val[0], 10), row: parseInt(val[1], 10) };
        }
        if (/^[a-h][1-8]$/.test(val)) {
          const col = val.charCodeAt(0) - 96;
          const row = parseInt(val[1], 10);
          return { col, row };
        }
      }
    }
    return null;
  }

  function parsePieceType(clsList) {
    const pieceMap = {
      'wp': 'P', 'wn': 'N', 'wb': 'B', 'wr': 'R', 'wq': 'Q', 'wk': 'K',
      'bp': 'p', 'bn': 'n', 'bb': 'b', 'br': 'r', 'bq': 'q', 'bk': 'k'
    };
    for (const cls of clsList) {
      if (pieceMap[cls]) return pieceMap[cls];
    }
    return null;
  }

  function extractBoardState() {
    const boardEl = document.querySelector('wc-chess-board') ||
                    document.querySelector('#board-layout-chessboard') ||
                    document.querySelector('.board');

    if (!boardEl) return null;

    const isFlipped = boardEl.classList.contains('flipped') ||
                      document.querySelector('.board.flipped') !== null;
    const player_color = isFlipped ? 'black' : 'white';

    const pieces = boardEl.querySelectorAll('.piece');
    if (!pieces || pieces.length === 0) return null;

    const grid = Array.from({ length: 8 }, () => Array(8).fill('.'));

    pieces.forEach(p => {
      const clsList = Array.from(p.classList);
      const sq = parseSquare(clsList);
      const piece = parsePieceType(clsList);
      if (sq && piece && sq.col >= 1 && sq.col <= 8 && sq.row >= 1 && sq.row <= 8) {
        grid[8 - sq.row][sq.col - 1] = piece;
      }
    });

    const fenRows = grid.map(row => {
      let rStr = "";
      let empty = 0;
      for (const cell of row) {
        if (cell === '.') {
          empty++;
        } else {
          if (empty > 0) {
            rStr += empty;
            empty = 0;
          }
          rStr += cell;
        }
      }
      if (empty > 0) rStr += empty;
      return rStr;
    });

    const moveNodes = document.querySelectorAll(
      '.move-text-component, .main-line-row div.node, .vertical-move-list-component .node'
    );
    const movesList = [];
    if (moveNodes && moveNodes.length > 0) {
      moveNodes.forEach(node => {
        const txt = node.innerText.trim();
        if (txt && !/^\d+\.?$/.test(txt)) {
          movesList.push(txt);
        }
      });
    }

    const turn = (movesList.length % 2 === 0) ? 'w' : 'b';
    const fen = `${fenRows.join('/')} ${turn} - - 0 1`;

    return {
      fen,
      moves: movesList.join(' '),
      player_color
    };
  }

  function syncState() {
    const state = extractBoardState();
    if (!state) return;

    const key = `${state.fen}|${state.moves}|${state.player_color}`;
    if (key === lastSentState) return;

    lastSentState = key;

    if (typeof GM_xmlhttpRequest !== 'undefined') {
      GM_xmlhttpRequest({
        method: "POST",
        url: "http://localhost:8765/api/sync_fen",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(state),
        onerror: () => {}
      });
    } else {
      fetch('http://localhost:8765/api/sync_fen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      }).catch(() => {});
    }
  }

  function onBoardMutated() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(syncState, 120);
  }

  function initObserver() {
    const target = document.querySelector('wc-chess-board') ||
                   document.querySelector('#board-layout-chessboard') ||
                   document.body;

    const observer = new MutationObserver(onBoardMutated);
    observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    syncState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObserver);
  } else {
    initObserver();
  }
})();
