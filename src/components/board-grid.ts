import { createInitialBoard } from '../core/board';
import './game-piece'; // Import the game-piece Web Component
import type { PlayerColor } from '../core/types';

const BOARD_SIZE = 6;
const COLUMN_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

class BoardGrid extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      .board-container {
        display: grid;
        grid-template-columns: auto repeat(6, 50px);
        grid-template-rows: auto repeat(6, 50px);
        gap: 1px;
        background-color: #333;
        border: 1px solid #333;
        font-family: monospace;
      }
      .cell {
        width: 50px;
        height: 50px;
        background-color: #eee;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }
      .coord-label {
        background-color: #ccc;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
      }
      .empty-corner {
        background-color: #ccc;
      }
    `;

    const boardContainer = document.createElement('div');
    boardContainer.classList.add('board-container');

    // Empty corner for the grid (top-left)
    const emptyCorner = document.createElement('div');
    emptyCorner.classList.add('empty-corner');
    boardContainer.appendChild(emptyCorner);

    // Column labels (A-F)
    COLUMN_LABELS.forEach((label) => {
      const colLabel = document.createElement('div');
      colLabel.classList.add('coord-label');
      colLabel.textContent = label;
      boardContainer.appendChild(colLabel);
    });

    // Cells will be rendered in connectedCallback

    shadow.appendChild(style);
    shadow.appendChild(boardContainer);
  }

  connectedCallback() {
    const boardContainer = this.shadowRoot?.querySelector('.board-container');
    if (!boardContainer) return;

    // Clear existing cells if any
    boardContainer.querySelectorAll('.cell').forEach(cell => cell.remove());
    
    const initialBoard = createInitialBoard();

    for (let y = 0; y < BOARD_SIZE; y++) {
      // Row label (1-6)
      const rowLabel = document.createElement('div');
      rowLabel.classList.add('coord-label');
      rowLabel.textContent = (y + 1).toString();
      boardContainer.appendChild(rowLabel);

      for (let x = 0; x < BOARD_SIZE; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.x = x.toString();
        cell.dataset.y = y.toString();

        const pieceColor = initialBoard[y][x];
        if (pieceColor) {
          const piece = document.createElement('game-piece') as HTMLElement & { color: PlayerColor };
          piece.color = pieceColor;
          cell.appendChild(piece);
        }
        boardContainer.appendChild(cell);
      }
    }
  }
}

customElements.define('board-grid', BoardGrid);
