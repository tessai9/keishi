import {
  ref,
  set,
  get,
  update,
  onValue,
  remove,
  type DatabaseReference,
  type Unsubscribe as FirebaseUnsubscribe,
} from 'firebase/database';
import { database } from './firebase-config';
import type { RoomService } from './room-service';
import type { RoomInfo, RoomState, Unsubscribe } from './types';
import type { Coordinates, GameState } from '../core/types';
import { createInitialBoard } from '../core/board';
import { serializeBoard } from '../core/game';

function generatePlayerId(): string {
  return Math.random().toString(36).substring(2, 10);
}

interface RoomData {
  hostId: string;
  guestId: string | null;
  status: string;
  configId: string;
  board: string;
  turn: string;
  winner: string | null;
  history: string;
  lastMove: string | null;
}

function toRoomState(roomId: string, data: RoomData): RoomState {
  return {
    roomId,
    hostId: data.hostId,
    guestId: data.guestId ?? null,
    status: data.status as RoomState['status'],
    configId: data.configId,
    board: JSON.parse(data.board),
    turn: data.turn as RoomState['turn'],
    winner: (data.winner as RoomState['winner']) ?? null,
    history: JSON.parse(data.history),
    lastMove: data.lastMove ? JSON.parse(data.lastMove) : null,
  };
}

export class FirebaseRoomService implements RoomService {
  private playerId = generatePlayerId();
  private currentRoomId: string | null = null;
  private listeners: FirebaseUnsubscribe[] = [];

  async createRoom(roomId: string, configId: string): Promise<RoomInfo> {
    const roomRef = this.roomRef(roomId);
    const snapshot = await get(roomRef);

    if (snapshot.exists()) {
      const data = snapshot.val() as RoomData;
      if (data.status !== 'finished') {
        throw new Error('このルームIDは既に使われています');
      }
    }

    const board = createInitialBoard(configId);

    await set(roomRef, {
      hostId: this.playerId,
      guestId: null,
      status: 'waiting',
      configId,
      board: JSON.stringify(board),
      turn: 'black',
      winner: null,
      history: JSON.stringify([serializeBoard(board)]),
      lastMove: null,
    });

    this.currentRoomId = roomId;

    return { roomId, playerId: this.playerId, playerColor: 'black' };
  }

  async joinRoom(roomId: string): Promise<RoomInfo> {
    const roomRef = this.roomRef(roomId);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      throw new Error('ルームが見つかりません');
    }

    const data = snapshot.val() as RoomData;
    if (data.status !== 'waiting') {
      throw new Error('このルームには参加できません');
    }

    await update(roomRef, {
      guestId: this.playerId,
      status: 'playing',
    });

    this.currentRoomId = roomId;

    return { roomId, playerId: this.playerId, playerColor: 'white' };
  }

  async leaveRoom(): Promise<void> {
    if (!this.currentRoomId) return;
    await remove(this.roomRef(this.currentRoomId));
    this.currentRoomId = null;
  }

  async sendMove(
    from: Coordinates,
    to: Coordinates,
    newState: GameState,
  ): Promise<void> {
    if (!this.currentRoomId) throw new Error('ルームに接続されていません');

    await update(this.roomRef(this.currentRoomId), {
      board: JSON.stringify(newState.board),
      turn: newState.turn,
      winner: newState.winner ?? null,
      history: JSON.stringify(newState.history),
      lastMove: JSON.stringify({ from, to }),
      status: newState.winner ? 'finished' : 'playing',
    });
  }

  onRoomUpdate(callback: (state: RoomState) => void): Unsubscribe {
    if (!this.currentRoomId) throw new Error('ルームに接続されていません');

    const roomId = this.currentRoomId;
    const unsub = onValue(this.roomRef(roomId), (snapshot) => {
      if (!snapshot.exists()) return;
      callback(toRoomState(roomId, snapshot.val() as RoomData));
    });

    this.listeners.push(unsub);
    return unsub;
  }

  dispose(): void {
    for (const unsub of this.listeners) unsub();
    this.listeners = [];
    this.currentRoomId = null;
  }

  private roomRef(roomId: string): DatabaseReference {
    return ref(database, `rooms/${roomId}`);
  }
}
