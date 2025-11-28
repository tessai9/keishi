import { Board, PlayerColor, Coordinates } from './types';
import { BOARD_SIZE } from './board';

export function getPlayerStones(board: Board, player: PlayerColor): Coordinates[] {
  const stones: Coordinates[] = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (board[y][x] === player) {
        stones.push({ x, y });
      }
    }
  }
  return stones;
}

export function checkWin(board: Board, player: PlayerColor): boolean {
  const stones = getPlayerStones(board, player);
  if (stones.length !== 4) return false;

  const xs = new Set(stones.map((s) => s.x));
  const ys = new Set(stones.map((s) => s.y));

  // A rectangle parallel to grid lines must have exactly 2 unique X coordinates
  // and exactly 2 unique Y coordinates for its 4 vertices.
  if (xs.size !== 2 || ys.size !== 2) return false;

  const sortedX = [...xs].sort((a, b) => a - b);
  const sortedY = [...ys].sort((a, b) => a - b);

  const w = sortedX[1] - sortedX[0];
  const h = sortedY[1] - sortedY[0];

  // Rule: At least 1 gap between stones => Side length >= 2
  // e.g., 0 and 1 (dist 1) is NOT allowed. 0 and 2 (dist 2) IS allowed.
  return w >= 2 && h >= 2;
}
