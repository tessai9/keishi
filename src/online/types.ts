import type { Board, Coordinates, PlayerColor } from '../core/types';

export type Unsubscribe = () => void;

export type RoomStatus = 'waiting' | 'playing' | 'finished';

export interface RoomState {
  roomId: string;
  hostId: string;
  guestId: string | null;
  status: RoomStatus;
  configId: string;
  board: Board;
  turn: PlayerColor;
  winner: PlayerColor | null;
  history: string[];
  lastMove: { from: Coordinates; to: Coordinates } | null;
}

export interface RoomInfo {
  roomId: string;
  playerId: string;
  playerColor: PlayerColor;
}
