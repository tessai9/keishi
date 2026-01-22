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
    id: 'official',
    name: 'Official (Wide)',
    description: 'A2,B2,E2,F2 vs A5,B5,E5,F5: Official rulebook setup',
    black: [
      { x: 0, y: 4 }, // A2
      { x: 1, y: 4 }, // B2
      { x: 4, y: 4 }, // E2
      { x: 5, y: 4 }, // F2
    ],
    white: [
      { x: 0, y: 1 }, // A5
      { x: 1, y: 1 }, // B5
      { x: 4, y: 1 }, // E5
      { x: 5, y: 1 }, // F5
    ],
  },
  {
    id: 'corners',
    name: 'Corner Start',
    description: 'Diagonal corner positions for long-range strategy',
    black: [
      { x: 0, y: 5 }, // A1
      { x: 1, y: 5 }, // B1
      { x: 0, y: 4 }, // A2
      { x: 1, y: 4 }, // B2
    ],
    white: [
      { x: 4, y: 0 }, // E6
      { x: 5, y: 0 }, // F6
      { x: 4, y: 1 }, // E5
      { x: 5, y: 1 }, // F5
    ],
  },
  {
    id: 'diamond',
    name: 'Diamond',
    description: 'Diamond-shaped formations in the center',
    black: [
      { x: 2, y: 4 }, // C2
      { x: 1, y: 3 }, // B3
      { x: 3, y: 3 }, // D3
      { x: 2, y: 2 }, // C4
    ],
    white: [
      { x: 3, y: 1 }, // D5
      { x: 2, y: 0 }, // C6
      { x: 4, y: 0 }, // E6
      { x: 3, y: 0 }, // D6 - top row formation
    ],
  },
  {
    id: 'asymmetric',
    name: 'Asymmetric',
    description: 'Unbalanced starting positions for varied gameplay',
    black: [
      { x: 0, y: 3 }, // A3
      { x: 1, y: 3 }, // B3
      { x: 2, y: 3 }, // C3
      { x: 3, y: 3 }, // D3
    ],
    white: [
      { x: 2, y: 1 }, // C5
      { x: 3, y: 1 }, // D5
      { x: 4, y: 2 }, // E4
      { x: 5, y: 2 }, // F4
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
