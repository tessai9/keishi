import './style.css';
import './components/board-grid.ts';
import './components/game-lobby.ts';
import type { GameStartDetail } from './components/game-lobby';
import type { RoomService } from './online/room-service';
import type { GameState } from './core/types';

const app = document.querySelector<HTMLDivElement>('#app')!;

function showModeSelect() {
  app.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <h1>Keishi Board Game</h1>
      <a class="help-link" href="https://raw.githubusercontent.com/tessai9/keishi/refs/heads/main/docs/official_rule_book.md" target="_blank">Help (Official Rule Book)</a>
    </div>
    <div id="mode-select" style="display: flex; gap: 16px; justify-content: center; margin-top: 24px;">
      <button id="btn-local" class="mode-btn">ローカル対戦</button>
      <button id="btn-online" class="mode-btn">オンライン対戦</button>
    </div>
  `;

  document
    .getElementById('btn-local')!
    .addEventListener('click', startLocalGame);
  document
    .getElementById('btn-online')!
    .addEventListener('click', showOnlineLobby);
}

function startLocalGame() {
  app.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <h1>Keishi Board Game</h1>
      <a class="help-link" href="https://raw.githubusercontent.com/tessai9/keishi/refs/heads/main/docs/official_rule_book.md" target="_blank">Help (Official Rule Book)</a>
    </div>
    <board-grid></board-grid>
    <div style="margin-top: 16px;">
      <button id="btn-back" class="mode-btn secondary">戻る</button>
    </div>
  `;

  document.getElementById('btn-back')!.addEventListener('click', showModeSelect);
}

async function showOnlineLobby() {
  app.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <h1>Keishi Board Game</h1>
      <p style="color: #aaa;">オンライン対戦</p>
    </div>
    <div id="lobby-area"></div>
    <div style="margin-top: 16px;">
      <button id="btn-back" class="mode-btn secondary">戻る</button>
    </div>
  `;

  const { createRoomService } = await import('./online/create-room-service');
  let service: RoomService;
  try {
    service = await createRoomService();
  } catch {
    const area = document.getElementById('lobby-area')!;
    area.innerHTML =
      '<p style="color: #f44336;">Firebase の設定が見つかりません。.env ファイルを確認してください。</p>';
    document
      .getElementById('btn-back')!
      .addEventListener('click', showModeSelect);
    return;
  }

  const lobby = document.createElement('game-lobby') as HTMLElement & {
    roomService: RoomService;
  };
  lobby.roomService = service;
  document.getElementById('lobby-area')!.appendChild(lobby);

  lobby.addEventListener('game-start', ((e: CustomEvent<GameStartDetail>) => {
    startOnlineGame(e.detail);
  }) as EventListener);

  lobby.addEventListener('lobby-cancel', () => {
    showModeSelect();
  });

  document.getElementById('btn-back')!.addEventListener('click', () => {
    service.dispose();
    showModeSelect();
  });
}

function startOnlineGame(detail: GameStartDetail) {
  const { service, info } = detail;

  app.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <h1>Keishi Board Game</h1>
      <p style="color: #aaa;">
        ルーム: <strong>${info.roomId}</strong>
        &nbsp;|&nbsp;
        あなた: <strong style="color: ${info.playerColor === 'black' ? '#fff' : '#ccc'};">${info.playerColor === 'black' ? '● 先手(黒)' : '○ 後手(白)'}</strong>
      </p>
    </div>
    <board-grid id="online-board"></board-grid>
    <div style="margin-top: 16px;">
      <button id="btn-leave" class="mode-btn secondary">退出</button>
    </div>
  `;

  const board = document.getElementById('online-board') as HTMLElement & {
    localPlayer: import('./core/types').PlayerColor | null;
    onMoveExecuted:
      | ((
          from: import('./core/types').Coordinates,
          to: import('./core/types').Coordinates,
          newState: GameState,
        ) => void)
      | null;
    applyRemoteState: (state: GameState) => void;
  };

  board.localPlayer = info.playerColor;

  board.onMoveExecuted = (from, to, newState) => {
    service.sendMove(from, to, newState);
  };

  const unsub = service.onRoomUpdate((roomState) => {
    const remoteState: GameState = {
      board: roomState.board,
      turn: roomState.turn,
      winner: roomState.winner,
      history: roomState.history,
      phase: 'movement',
    };
    board.applyRemoteState(remoteState);
  });

  document.getElementById('btn-leave')!.addEventListener('click', () => {
    unsub();
    service.dispose();
    showModeSelect();
  });
}

showModeSelect();
