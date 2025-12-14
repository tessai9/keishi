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
  
  // White (Second): B4, C4, D4, E4
  // Row 4 corresponds to y=2 (since y=0 is Row 6)
  board[2][1] = 'white';
  board[2][2] = 'white';
  board[2][3] = 'white';
  board[2][4] = 'white';

  // Black (First): B3, C3, D3, E3
  // Row 3 corresponds to y=3
  board[3][1] = 'black';
  board[3][2] = 'black';
  board[3][3] = 'black';
  board[3][4] = 'black';

  return board;
}
