import { describe, it, expect } from 'vitest';
import { createEmptyBoard } from '../src/core/board';
import { checkWin } from '../src/core/win-logic';
import { Board } from '../src/core/types';

describe('Win Logic', () => {
  it('should not detect win on empty board (or incomplete stones)', () => {
    const board: Board = createEmptyBoard();
    expect(checkWin(board, 'black')).toBe(false);
  });

  it('should detect valid square win (2x2 gap)', () => {
    const board: Board = createEmptyBoard();
    // (0,0), (0,2), (2,0), (2,2) -> w=2, h=2
    const coords = [[0,0], [0,2], [2,0], [2,2]];
    coords.forEach(([x, y]) => { board[y][x] = 'black'; });
    
    expect(checkWin(board, 'black')).toBe(true);
  });

  it('should detect valid rectangle win (2x3 gap)', () => {
      const board: Board = createEmptyBoard();
      // (0,0), (0,3), (2,0), (2,3) -> w=2, h=3
      const coords = [[0,0], [0,3], [2,0], [2,3]];
      coords.forEach(([x, y]) => { board[y][x] = 'black'; });
      
      expect(checkWin(board, 'black')).toBe(true);
  });

  it('should NOT detect win for too small rectangle (1x1 gap)', () => {
    const board: Board = createEmptyBoard();
    // (0,0), (0,1), (1,0), (1,1) -> w=1, h=1
    const coords = [[0,0], [0,1], [1,0], [1,1]];
    coords.forEach(([x, y]) => { board[y][x] = 'black'; });
    
    expect(checkWin(board, 'black')).toBe(false);
  });

  it('should NOT detect win for too small width (1x2 gap)', () => {
      const board: Board = createEmptyBoard();
      // (0,0), (0,2), (1,0), (1,2) -> w=1, h=2
      const coords = [[0,0], [0,2], [1,0], [1,2]];
      coords.forEach(([x, y]) => { board[y][x] = 'black'; });
      
      expect(checkWin(board, 'black')).toBe(false);
  });

  it('should NOT detect win for non-parallel rectangle (Diamond)', () => {
      const board: Board = createEmptyBoard();
      // (1,0), (0,1), (2,1), (1,2)
      const coords = [[1,0], [0,1], [2,1], [1,2]];
      coords.forEach(([x, y]) => { board[y][x] = 'black'; });
      
      expect(checkWin(board, 'black')).toBe(false);
  });
});
