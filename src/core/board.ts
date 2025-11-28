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
  const board = createEmptyBoard();

  // Initial Setup
  // Black: A2, B2, E2, F2 -> y=1; x=0, 1, 4, 5
  // White: A5, B5, E5, F5 -> y=4; x=0, 1, 4, 5

  const blackRow = 1;
  const whiteRow = 4;
  const cols = [0, 1, 4, 5];

  cols.forEach((x) => {
    board[blackRow][x] = 'black';
    board[whiteRow][x] = 'white';
  });

  return board;
}
