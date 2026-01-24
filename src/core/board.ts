import type { Board, Cell } from './types';

export const BOARD_SIZE = 6;

/**
 * Initial configuration presets for testing different game scenarios.
 * Coordinates use the internal system: x=0-5 (A-F), y=0-5 (Row 6-1)
 * So Row 1 = y=5, Row 6 = y=0
 */
export interface InitialConfig {
  id: string;
  name: string;
  description: string;
  black: Array<{ x: number; y: number }>;
  white: Array<{ x: number; y: number }>;
}

export const INITIAL_CONFIGS: InitialConfig[] = [
  {
    id: 'default',
    name: 'Default (Center Line)',
    description: 'B3-E3 vs B4-E4: Standard center confrontation',
    black: [
      { x: 1, y: 3 }, // B3
      { x: 2, y: 3 }, // C3
      { x: 3, y: 3 }, // D3
      { x: 4, y: 3 }, // E3
    ],
    white: [
      { x: 1, y: 2 }, // B4
      { x: 2, y: 2 }, // C4
      { x: 3, y: 2 }, // D4
      { x: 4, y: 2 }, // E4
    ],
  },
  {
    id: 'corners',
    name: 'Corner Start',
    description: 'Diagonal corner positions for long-range strategy',
    black: [
      { x: 0, y: 0 }, // A1
      { x: 1, y: 0 }, // B1
      { x: 4, y: 5 }, // E6
      { x: 5, y: 5 }, // F6
    ],
    white: [
      { x: 0, y: 5 }, // A6
      { x: 1, y: 5 }, // B6
      { x: 4, y: 0 }, // E1
      { x: 5, y: 0 }, // F1
    ],
  },
];

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

export function createInitialBoard(configId: string = 'default'): Board {
  const board = createEmptyBoard();

  const config = INITIAL_CONFIGS.find(c => c.id === configId) ?? INITIAL_CONFIGS[0];

  // Place black pieces
  for (const pos of config.black) {
    board[pos.y][pos.x] = 'black';
  }

  // Place white pieces
  for (const pos of config.white) {
    board[pos.y][pos.x] = 'white';
  }

  return board;
}
