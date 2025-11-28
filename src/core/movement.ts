import type { Board, Coordinates } from './types';
import { BOARD_SIZE } from './board';

export const DIRECTIONS = [
  { dx: -1, dy: -1 },
  { dx: 0, dy: -1 },
  { dx: 1, dy: -1 },
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
  { dx: -1, dy: 1 },
  { dx: 0, dy: 1 },
  { dx: 1, dy: 1 },
];

export function isValidCoordinate(c: Coordinates): boolean {
  return c.x >= 0 && c.x < BOARD_SIZE && c.y >= 0 && c.y < BOARD_SIZE;
}

export function getAyumiMoves(board: Board, start: Coordinates): Coordinates[] {
  const moves: Coordinates[] = [];
  const currentPlayer = board[start.y][start.x];
  if (!currentPlayer) return [];

  for (const dir of DIRECTIONS) {
    const target = { x: start.x + dir.dx, y: start.y + dir.dy };

    if (isValidCoordinate(target) && board[target.y][target.x] === null) {
      moves.push(target);
    }
  }
  return moves;
}

export function getKoshiMoves(board: Board, start: Coordinates): Coordinates[] {
  const moves: Coordinates[] = [];
  const currentPlayer = board[start.y][start.x];
  if (!currentPlayer) return [];

  for (const dir of DIRECTIONS) {
    const adjacent = { x: start.x + dir.dx, y: start.y + dir.dy };
    const landing = { x: start.x + dir.dx * 2, y: start.y + dir.dy * 2 };

    if (isValidCoordinate(adjacent) && isValidCoordinate(landing)) {
      const adjacentCell = board[adjacent.y][adjacent.x];
      const landingCell = board[landing.y][landing.x];

      // Must jump over a stone (enemy or ally) and land on empty cell
      if (adjacentCell !== null && landingCell === null) {
        moves.push(landing);
      }
    }
  }
  return moves;
}

export function getValidMoves(board: Board, start: Coordinates): Coordinates[] {
  // Combine Ayumi and Koshi moves
  const ayumi = getAyumiMoves(board, start);
  const koshi = getKoshiMoves(board, start);
  
  // Deduplication shouldn't be strictly necessary as Ayumi is dist 1 and Koshi is dist 2,
  // but good to keep in mind if rules change. Here they land on different squares.
  return [...ayumi, ...koshi];
}
