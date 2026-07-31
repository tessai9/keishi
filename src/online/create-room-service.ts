import type { RoomService } from './room-service';

export async function createRoomService(): Promise<RoomService> {
  const { FirebaseRoomService } = await import('./firebase-room-service');
  return new FirebaseRoomService();
}
