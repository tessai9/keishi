import type { Board, Cell } from './types';

export const BOARD_SIZE = 6;

export function createEmptyBoard(): Board {
  const board: Board = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < BOARD_SIZE; x++) {
      row.push(null);
    }
    board.push(row);
  }
  return board;
}

export function createInitialBoard(): Board {
  return createEmptyBoard();
}
