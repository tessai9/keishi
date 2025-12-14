import { createInitialBoard } from './board';
import type { Board, Coordinates, GameState, PlayerColor } from './types';
import { checkWin } from './win-logic';
import { getValidMoves } from './movement';

export function createInitialState(): GameState {
  const board = createInitialBoard();
  return {
    board,
    turn: 'black',
    winner: null,
    history: [serializeBoard(board)],
    phase: 'movement',
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



export function makeMove(state: GameState, from: Coordinates, to: Coordinates): GameState {
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
