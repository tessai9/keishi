import { describe, it, expect } from 'vitest';
import { createEmptyBoard } from '../src/core/board';
import { getLegalMoves, serializeBoard } from '../src/core/game';
import { GameState } from '../src/core/types';

describe('Ko Rule (Sennichite)', () => {
  it('should prevent a move that restores the board to the previous state', () => {
    // Setup a specific scenario
    // We manually construct a state where moving to a specific spot would replicate 
    // the board state stored in 'history' (simulating the state before opponent's move).
    
    const board = createEmptyBoard();
    board[0][0] = 'black';
    const targetMove = { x: 1, y: 0 }; // Move to (1,0)
    
    // Construct a board that results from moving (0,0)->(1,0).
    const nextBoard = createEmptyBoard();
    nextBoard[0][1] = 'black';
    const nextBoardStr = serializeBoard(nextBoard);
    
    // Current state: Black at (0,0).
    // History: [nextBoardStr]. 
    // This simulates that the board WAS `nextBoard` exactly 1 move ago (before opponent moved).
    // (This situation might be geometrically impossible in standard play, but ensures the rule logic works).
    
    const gameState: GameState = {
      board: board,
      turn: 'black',
      winner: null,
      history: [nextBoardStr],
      phase: 'movement'
    };
    
    const legalMoves = getLegalMoves(gameState, { x: 0, y: 0 });
    
    // Moving to (1,0) produces `nextBoard`.
    // Since `nextBoardStr` is in history (last), it should be blocked.
    expect(legalMoves).not.toContainEqual(targetMove);
    
    // Verify other moves are allowed (e.g., (0,1))
    // Move to (0,1) -> Board with Black at (0,1).
    // This is NOT equal to nextBoard (Black at (1,0)).
    expect(legalMoves).toContainEqual({ x: 0, y: 1 });
  });
});