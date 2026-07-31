import type { Coordinates } from '../core/types';
import type { GameState } from '../core/types';
import type { RoomInfo, RoomState, Unsubscribe } from './types';

export interface RoomService {
  createRoom(roomId: string, configId: string): Promise<RoomInfo>;
  joinRoom(roomId: string): Promise<RoomInfo>;
  leaveRoom(): Promise<void>;
  sendMove(
    from: Coordinates,
    to: Coordinates,
    newState: GameState,
  ): Promise<void>;
  onRoomUpdate(callback: (state: RoomState) => void): Unsubscribe;
  dispose(): void;
}
