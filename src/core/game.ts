import { createInitialBoard } from './board';
import type { Board, Coordinates, GameState, PlayerColor } from './types';
import { getValidMoves } from './movement';

export function createInitialState(): GameState {
  return {
    board: createInitialBoard(),
    turn: 'black',
    winner: null,
    history: [],
  };
}

export function switchTurn(color: PlayerColor): PlayerColor {
  return color === 'black' ? 'white' : 'black';
}

export function serializeBoard(board: Board): string {
  return JSON.stringify(board);
}

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

  // Update history (store the state BEFORE the move? or AFTER?)
  // Ko check usually compares result with previous states.
  // We should store the board state *before* this move was made,
  // or better, store the sequence of board states.
  // Let's store the state *resulting* from this move?
  // Actually, to check "cannot return to 1 move ago", we need to see if the NEW board matches
  // the board from 2 moves ago (start of previous turn).
  
  // Let's store the board state at the beginning of the turn (before move).
  // Then after move, we check if new board matches any forbidden state.
  // "Ko" usually only forbids the *immediate* previous state (S_n-1).
  // Wait, if I am at S_n, and I move to S_n+1.
  // My opponent was at S_n-1. They moved to S_n.
  // I cannot move to S_n-1.
  
  // So, before making the move, we record the current board (S_n).
  newState.history.push(serializeBoard(state.board));

  // Switch turn
  newState.turn = switchTurn(newState.turn);

  return newState;
}
