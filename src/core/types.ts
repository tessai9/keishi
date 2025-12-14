export type PlayerColor = 'black' | 'white';

export interface Coordinates {
  x: number; // 0-5 (Column A-F)
  y: number; // 0-5 (Row 1-6)
}

export type Cell = PlayerColor | null;

export type Board = Cell[][];

export type GamePhase = 'movement';

export interface GameState {
  board: Board;
  turn: PlayerColor;
  winner: PlayerColor | null;
  history: string[]; // For Ko rule enforcement (board state hashes)
  phase: GamePhase;
}
