import { describe, it, expect } from 'vitest';
import { createEmptyBoard } from '../src/core/board';
import { getValidMoves } from '../src/core/movement';
import { Board } from '../src/core/types';

describe('Movement Logic', () => {
  it('Ayumi: should move to adjacent empty spots', () => {
    const board: Board = createEmptyBoard();
    // Place a black stone at B2 (1, 1)
    board[1][1] = 'black';

    const moves = getValidMoves(board, { x: 1, y: 1 });
    
    // Expect 8 moves (all surrounding are empty)
    expect(moves.length).toBe(8);
    expect(moves).toContainEqual({ x: 0, y: 0 });
    expect(moves).toContainEqual({ x: 2, y: 2 });
  });

  it('Ayumi: blocked by another stone', () => {
    const board: Board = createEmptyBoard();
    board[1][1] = 'black';
    board[1][0] = 'white'; // Block to the left (x=0, y=1)

    const moves = getValidMoves(board, { x: 1, y: 1 });
    
    // Ayumi to (0, 1) is blocked.
    // Koshi to (-1, 1) is invalid (out of bounds).
    // Total 7 moves.
    expect(moves.length).toBe(7);
    expect(moves).not.toContainEqual({ x: 0, y: 1 });
  });

  it('Koshi: should jump over adjacent stone', () => {
    const board: Board = createEmptyBoard();
    board[1][1] = 'black';
    board[1][2] = 'white'; // Stone to jump over (x=2, y=1)

    const moves = getValidMoves(board, { x: 1, y: 1 });
    
    // Should contain jump to (3, 1) (Right)
    expect(moves).toContainEqual({ x: 3, y: 1 });
  });

  it('Koshi: cannot jump if landing is blocked', () => {
    const board: Board = createEmptyBoard();
    board[1][1] = 'black';
    board[1][2] = 'white'; // Stone to jump over
    board[1][3] = 'black'; // Landing spot occupied

    const moves = getValidMoves(board, { x: 1, y: 1 });
    
    expect(moves).not.toContainEqual({ x: 1, y: 3 });
  });
  
  it('Koshi: cannot jump over empty space', () => {
      const board: Board = createEmptyBoard();
      board[1][1] = 'black';
      // (1, 2) is empty
      
      const moves = getValidMoves(board, { x: 1, y: 1 });
      expect(moves).not.toContainEqual({ x: 1, y: 3 });
  });
});
