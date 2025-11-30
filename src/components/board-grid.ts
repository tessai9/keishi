import { createInitialState, getLegalMoves, makeMove, placeStone } from '../core/game';
import { checkWin } from '../core/win-logic';
import './game-piece'; 
import type { PlayerColor, Coordinates, GameState } from '../core/types';

const BOARD_SIZE = 6;
const COLUMN_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

class BoardGrid extends HTMLElement {
  private gameState: GameState;
  private selected: Coordinates | null = null;
  private legalMoves: Coordinates[] = []; // Cache legal moves for selected piece

  constructor() {
    super();
    this.gameState = createInitialState();
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
        user-select: none;
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
      .cell.selected {
        background-color: #ffeb3b; /* Yellow for selected */
      }
      .cell.valid-move {
        background-color: #81c784; /* Green for valid move */
        cursor: pointer;
      }
      .cell.valid-move::after {
        content: '';
        width: 15px;
        height: 15px;
        background-color: rgba(0,0,0,0.2);
        border-radius: 50%;
      }
      /* Hover effect for placement phase */
      .cell.empty:hover {
        background-color: #ddd;
        cursor: pointer;
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
      .status {
        margin-bottom: 10px;
        font-size: 1.2rem;
        font-weight: bold;
      }
    `;

    // Status display
    const statusDiv = document.createElement('div');
    statusDiv.classList.add('status');
    statusDiv.id = 'status';

    // Reset Button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Game';
    resetButton.style.marginBottom = '10px';
    resetButton.addEventListener('click', () => this.resetGame());

    const boardContainer = document.createElement('div');
    boardContainer.classList.add('board-container');
    
    // Add click listener
    boardContainer.addEventListener('click', (e) => this.handleCellClick(e));

    shadow.appendChild(style);
    shadow.appendChild(statusDiv);
    shadow.appendChild(resetButton); // Append button
    shadow.appendChild(boardContainer);
    
    // Initial structure setup (labels)
    
    // Empty corner
    const emptyCorner = document.createElement('div');
    emptyCorner.classList.add('empty-corner');
    boardContainer.appendChild(emptyCorner);

    // Column labels
    COLUMN_LABELS.forEach((label) => {
      const colLabel = document.createElement('div');
      colLabel.classList.add('coord-label');
      colLabel.textContent = label;
      boardContainer.appendChild(colLabel);
    });

    // Rows & Cells placeholders
    for (let y = 0; y < BOARD_SIZE; y++) {
      const rowLabel = document.createElement('div');
      rowLabel.classList.add('coord-label');
      rowLabel.textContent = (y + 1).toString();
      boardContainer.appendChild(rowLabel);

      for (let x = 0; x < BOARD_SIZE; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.x = x.toString();
        cell.dataset.y = y.toString();
        boardContainer.appendChild(cell);
      }
    }
  }

  connectedCallback() {
    this.render();
  }

  private resetGame() {
    this.gameState = createInitialState();
    this.selected = null;
    this.legalMoves = [];
    this.render();
  }

  private handleCellClick(event: Event) {
    if (this.gameState.winner) return; // Game over

    const target = (event.target as HTMLElement).closest('.cell') as HTMLElement;
    if (!target) return;

    const x = parseInt(target.dataset.x!, 10);
    const y = parseInt(target.dataset.y!, 10);
    const clickedCoord = { x, y };

    if (this.gameState.phase === 'placement') {
      // Placement Phase Logic
      try {
        const newState = placeStone(this.gameState, clickedCoord);
        this.gameState = newState;
        this.render();
      } catch (e) {
        // Ignore invalid placements (e.g. occupied cell)
        console.log('Invalid placement:', e);
      }
    } else {
      // Movement Phase Logic
      
      // Check if clicked cell is a valid move destination
      const isMoveDest = this.legalMoves.some(m => m.x === x && m.y === y);

      if (isMoveDest && this.selected) {
        // Execute Move
        this.executeMove(this.selected, clickedCoord);
      } else {
        // Select logic
        const piece = this.gameState.board[y][x];
        if (piece === this.gameState.turn) {
          // Select own piece
          this.selected = clickedCoord;
          this.legalMoves = getLegalMoves(this.gameState, clickedCoord);
        } else {
          // Clicked empty or enemy piece (not a move dest) -> Deselect
          this.selected = null;
          this.legalMoves = [];
        }
        this.render();
      }
    }
  }

  private executeMove(from: Coordinates, to: Coordinates) {
    try {
      // Update state
      const newState = makeMove(this.gameState, from, to);
      
      // Check Win (for the player who just moved - which is previous turn)
      // newState.turn has already switched, so we check win for the player who JUST moved.
      // E.g. Black moved. turn is White. Check win for Black.
      const playerWhoMoved = newState.turn === 'black' ? 'white' : 'black';
      
      if (checkWin(newState.board, playerWhoMoved)) {
        newState.winner = playerWhoMoved;
      }
      
      this.gameState = newState;
      this.selected = null;
      this.legalMoves = [];
      this.render();
      
    } catch (e) {
      console.error(e);
      alert('Invalid move!');
    }
  }

  private render() {
    const shadow = this.shadowRoot;
    if (!shadow) return;

    // Update Status
    const statusDiv = shadow.getElementById('status');
    if (statusDiv) {
      if (this.gameState.winner) {
        statusDiv.textContent = `Winner: ${this.gameState.winner.toUpperCase()}!`;
        statusDiv.style.color = 'red';
      } else {
        const phaseName = this.gameState.phase === 'placement' ? 'Placement' : 'Movement';
        statusDiv.textContent = `Phase: ${phaseName} | Turn: ${this.gameState.turn.toUpperCase()}`;
        statusDiv.style.color = '';
      }
    }

    const cells = shadow.querySelectorAll('.cell');
    cells.forEach((el) => {
      const cell = el as HTMLElement;
      const x = parseInt(cell.dataset.x!, 10);
      const y = parseInt(cell.dataset.y!, 10);
      
      // Reset classes/content
      cell.classList.remove('selected', 'valid-move', 'empty');
      cell.innerHTML = '';

      // Place Piece
      const pieceColor = this.gameState.board[y][x];
      if (pieceColor) {
        const piece = document.createElement('game-piece') as HTMLElement & { color: PlayerColor };
        piece.color = pieceColor;
        cell.appendChild(piece);
      } else {
        cell.classList.add('empty');
      }

      // Highlight Selected
      if (this.selected && this.selected.x === x && this.selected.y === y) {
        cell.classList.add('selected');
      }

      // Highlight Valid Moves
      if (this.legalMoves.some(m => m.x === x && m.y === y)) {
        cell.classList.add('valid-move');
      }
    });
  }
}

customElements.define('board-grid', BoardGrid);