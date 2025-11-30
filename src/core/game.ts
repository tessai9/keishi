import { createInitialBoard } from './board';
import type { Board, Coordinates, GameState, PlayerColor } from './types';
import { checkWin } from './win-logic';
import { getValidMoves } from './movement';

const STONES_PER_PLAYER = 4;

export function createInitialState(): GameState {
  return {
    board: createInitialBoard(),
    turn: 'black',
    winner: null,
    history: [],
    phase: 'placement',
    stonesPlaced: { black: 0, white: 0 },
  };
}

export function switchTurn(color: PlayerColor): PlayerColor {
  return color === 'black' ? 'white' : 'black';
}

export function serializeBoard(board: Board): string {
  return JSON.stringify(board);
}

// Re-implementing isKo and getLegalMoves here or importing?
// Previously they were in this file. I will keep them.

export function isKo(history: string[], nextBoard: Board): boolean {
  if (history.length === 0) return false;
  const lastState = history[history.length - 1];
  return serializeBoard(nextBoard) === lastState;
}

export function getLegalMoves(state: GameState, start: Coordinates): Coordinates[] {
  if (state.phase !== 'movement') return [];
  
  const validMoves = getValidMoves(state.board, start);
  return validMoves.filter((move) => {
    // Simulate move to check for Ko
    const nextBoard = state.board.map((row) => [...row]);
    const piece = nextBoard[start.y][start.x];
    nextBoard[start.y][start.x] = null;
    nextBoard[move.y][move.x] = piece;

    return !isKo(state.history, nextBoard);
  });
}

export function placeStone(state: GameState, at: Coordinates): GameState {
  if (state.phase !== 'placement') {
    throw new Error('Cannot place stone in movement phase');
  }
  if (state.board[at.y][at.x] !== null) {
    throw new Error('Cell is already occupied');
  }
  
  const newState: GameState = {
    ...state,
    board: state.board.map(row => [...row]),
    stonesPlaced: { ...state.stonesPlaced }
  };

  // Place stone
  const currentPlayer = newState.turn;
  newState.board[at.y][at.x] = currentPlayer;
  newState.stonesPlaced[currentPlayer]++;

  // Check Win (Instant win allowed in placement)
  if (checkWin(newState.board, currentPlayer)) {
    newState.winner = currentPlayer;
    return newState;
  }

  // Check Phase Transition
  if (newState.stonesPlaced.black === STONES_PER_PLAYER && newState.stonesPlaced.white === STONES_PER_PLAYER) {
    newState.phase = 'movement';
    // Rule: "Movement phase starts with White"
    newState.turn = 'white';
    
    // Initialize history for Ko rule from this point?
    // Ko rule prevents returning to *previous* state.
    // Starting movement phase, there is no "previous movement state".
    // We can keep history or clear it. Usually clear or treat current board as start.
    // Let's keep history as board states, but Ko only matters for movement.
    // We should probably push the current state to history so the first move has something to compare?
    // But Ko says "restore to 1 move ago". First move cannot restore anything.
    // Let's just reset history to be safe/clean for the movement phase.
    newState.history = [serializeBoard(newState.board)]; 
    
  } else {
    // Continue Placement
    newState.turn = switchTurn(currentPlayer);
  }

  return newState;
}

export function makeMove(state: GameState, from: Coordinates, to: Coordinates): GameState {
  if (state.phase !== 'movement') {
    throw new Error('Cannot move stone in placement phase');
  }

  // Deep copy state to avoid mutation
  const newState: GameState = {
    ...state,
    board: state.board.map((row) => [...row]),
    history: [...state.history],
  };

  const piece = newState.board[from.y][from.x];
  if (piece !== newState.turn) {
    throw new Error(`It is ${newState.turn}'s turn, but attempted to move ${piece}`);
  }

  // Update board
  newState.board[from.y][from.x] = null;
  newState.board[to.y][to.x] = piece;

  // Update history
  newState.history.push(serializeBoard(state.board));

  // Switch turn
  newState.turn = switchTurn(newState.turn);

  return newState;
}
