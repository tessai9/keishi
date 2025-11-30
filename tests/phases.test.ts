import { describe, it, expect } from 'vitest';
import { createInitialState, placeStone, makeMove } from '../src/core/game';
import { GameState } from '../src/core/types';

describe('Game Phase Logic', () => {
  it('should start in placement phase with empty board', () => {
    const state = createInitialState();
    expect(state.phase).toBe('placement');
    expect(state.stonesPlaced.black).toBe(0);
    expect(state.stonesPlaced.white).toBe(0);
    
    // Check board is empty
    state.board.forEach(row => {
        row.forEach(cell => {
            expect(cell).toBeNull();
        });
    });
  });

  it('should alternate turns during placement', () => {
    let state = createInitialState();
    expect(state.turn).toBe('black');
    
    state = placeStone(state, { x: 0, y: 0 }); // Black places
    expect(state.board[0][0]).toBe('black');
    expect(state.turn).toBe('white');
    expect(state.stonesPlaced.black).toBe(1);
    
    state = placeStone(state, { x: 0, y: 1 }); // White places
    expect(state.board[1][0]).toBe('white');
    expect(state.turn).toBe('black');
    expect(state.stonesPlaced.white).toBe(1);
  });
  
  it('should transition to movement phase after 4 stones each', () => {
      let state = createInitialState();
      
      // Place 3 stones each
      for (let i = 0; i < 3; i++) {
          state = placeStone(state, { x: i, y: 0 }); // Black
          state = placeStone(state, { x: i, y: 1 }); // White
      }
      expect(state.stonesPlaced.black).toBe(3);
      expect(state.stonesPlaced.white).toBe(3);
      expect(state.phase).toBe('placement');
      
      // Place 4th stone Black
      state = placeStone(state, { x: 3, y: 0 });
      expect(state.phase).toBe('placement'); // Still placement, waiting for White
      
      // Place 4th stone White
      state = placeStone(state, { x: 3, y: 1 });
      
      // Should now be movement phase
      expect(state.phase).toBe('movement');
      expect(state.stonesPlaced.black).toBe(4);
      expect(state.stonesPlaced.white).toBe(4);
      
      // Turn should be White (Second Player starts movement)
      expect(state.turn).toBe('white');
  });

  it('should detect win during placement phase', () => {
      let state = createInitialState();
      
      // Construct a winning rectangle for Black: (0,0), (0,2), (2,0), (2,2)
      const moves = [
          { x: 0, y: 0 }, // Black 1
          { x: 5, y: 5 }, // White 1 (random)
          { x: 0, y: 2 }, // Black 2
          { x: 4, y: 5 }, // White 2
          { x: 2, y: 0 }, // Black 3
          { x: 3, y: 5 }, // White 3
          { x: 2, y: 2 }, // Black 4 (WIN)
      ];
      
      for (const move of moves) {
          state = placeStone(state, move);
          if (state.winner) break;
      }
      
      expect(state.winner).toBe('black');
      expect(state.phase).toBe('placement'); // Phase shouldn't necessarily change if game ends
  });
});
