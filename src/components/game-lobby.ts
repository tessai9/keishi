import { INITIAL_CONFIGS } from '../core/board';
import type { RoomService } from '../online/room-service';
import type { RoomInfo } from '../online/types';

function generateRoomId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 4; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export interface GameStartDetail {
  service: RoomService;
  info: RoomInfo;
  configId: string;
}

class GameLobby extends HTMLElement {
  private _service: RoomService | null = null;
  private _roomInfo: RoomInfo | null = null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        color: rgba(255, 255, 255, 0.87);
        font-family: monospace;
      }
      .lobby {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        max-width: 400px;
        margin: 0 auto;
      }
      .section {
        width: 100%;
        border: 1px solid #555;
        border-radius: 8px;
        padding: 20px;
      }
      .section h3 {
        margin: 0 0 12px 0;
        font-size: 1.1rem;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 12px;
      }
      .field label {
        font-size: 0.85rem;
        color: #aaa;
      }
      .row {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      input, select {
        padding: 8px 12px;
        font-size: 1rem;
        font-family: monospace;
        border: 1px solid #555;
        border-radius: 4px;
        background: #333;
        color: #fff;
      }
      input {
        flex: 1;
        text-transform: uppercase;
      }
      button {
        padding: 8px 16px;
        font-size: 1rem;
        font-family: monospace;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background: #4caf50;
        color: white;
        font-weight: bold;
      }
      button:disabled {
        background: #555;
        cursor: not-allowed;
      }
      button.secondary {
        background: #666;
      }
      button.back {
        background: #555;
        font-size: 0.9rem;
      }
      .waiting {
        text-align: center;
        padding: 20px;
      }
      .waiting .room-id-display {
        font-size: 2rem;
        font-weight: bold;
        letter-spacing: 0.3em;
        color: #4caf50;
        margin: 16px 0;
      }
      .waiting .hint {
        font-size: 0.85rem;
        color: #aaa;
      }
      .error {
        color: #f44336;
        font-size: 0.85rem;
        margin-top: 8px;
      }
      .spinner {
        display: inline-block;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;

    shadow.appendChild(style);

    const container = document.createElement('div');
    container.classList.add('lobby');
    shadow.appendChild(container);

    this.renderLobby();
  }

  set roomService(service: RoomService) {
    this._service = service;
  }

  private get container(): HTMLDivElement {
    return this.shadowRoot!.querySelector('.lobby')!;
  }

  private renderLobby() {
    const c = this.container;
    c.innerHTML = '';

    const createSection = document.createElement('div');
    createSection.classList.add('section');
    createSection.innerHTML = `
      <h3>ルームを作成</h3>
      <div class="field">
        <label>ルームID</label>
        <div class="row">
          <input id="create-id" maxlength="8" placeholder="例: ${generateRoomId()}" />
          <button id="generate-btn" class="secondary" title="ランダム生成">↻</button>
        </div>
      </div>
      <div class="field">
        <label>初期配置</label>
        <select id="config-select"></select>
      </div>
      <button id="create-btn">作成して待機</button>
      <div id="create-error" class="error"></div>
    `;

    const configSelect = createSection.querySelector<HTMLSelectElement>(
      '#config-select',
    )!;
    for (const config of INITIAL_CONFIGS) {
      const opt = document.createElement('option');
      opt.value = config.id;
      opt.textContent = config.name;
      configSelect.appendChild(opt);
    }

    createSection
      .querySelector('#generate-btn')!
      .addEventListener('click', () => {
        createSection.querySelector<HTMLInputElement>('#create-id')!.value =
          generateRoomId();
      });

    createSection
      .querySelector('#create-btn')!
      .addEventListener('click', () => this.handleCreate(createSection));

    const joinSection = document.createElement('div');
    joinSection.classList.add('section');
    joinSection.innerHTML = `
      <h3>ルームに参加</h3>
      <div class="field">
        <label>ルームID</label>
        <div class="row">
          <input id="join-id" maxlength="8" placeholder="ルームIDを入力" />
        </div>
      </div>
      <button id="join-btn">参加</button>
      <div id="join-error" class="error"></div>
    `;

    joinSection
      .querySelector('#join-btn')!
      .addEventListener('click', () => this.handleJoin(joinSection));

    c.appendChild(createSection);
    c.appendChild(joinSection);
  }

  private renderWaiting(roomId: string) {
    const c = this.container;
    c.innerHTML = '';

    const waitDiv = document.createElement('div');
    waitDiv.classList.add('section', 'waiting');
    waitDiv.innerHTML = `
      <div><span class="spinner">⏳</span> 対戦相手の参加を待っています...</div>
      <div class="room-id-display">${roomId}</div>
      <div class="hint">このルームIDを対戦相手に共有してください</div>
      <button id="cancel-btn" class="back" style="margin-top: 16px;">キャンセル</button>
    `;

    waitDiv
      .querySelector('#cancel-btn')!
      .addEventListener('click', () => this.handleCancel());

    c.appendChild(waitDiv);
  }

  private async handleCreate(section: HTMLDivElement) {
    if (!this._service) return;

    const input = section.querySelector<HTMLInputElement>('#create-id')!;
    const errorEl = section.querySelector<HTMLDivElement>('#create-error')!;
    const roomId = input.value.trim().toUpperCase();

    if (!roomId) {
      errorEl.textContent = 'ルームIDを入力してください';
      return;
    }

    const configId =
      section.querySelector<HTMLSelectElement>('#config-select')!.value;

    const btn = section.querySelector<HTMLButtonElement>('#create-btn')!;
    btn.disabled = true;
    errorEl.textContent = '';

    try {
      this._roomInfo = await this._service.createRoom(roomId, configId);
      this.renderWaiting(roomId);
      this.listenForOpponent(configId);
    } catch (e) {
      errorEl.textContent = (e as Error).message;
      btn.disabled = false;
    }
  }

  private async handleJoin(section: HTMLDivElement) {
    if (!this._service) return;

    const input = section.querySelector<HTMLInputElement>('#join-id')!;
    const errorEl = section.querySelector<HTMLDivElement>('#join-error')!;
    const roomId = input.value.trim().toUpperCase();

    if (!roomId) {
      errorEl.textContent = 'ルームIDを入力してください';
      return;
    }

    const btn = section.querySelector<HTMLButtonElement>('#join-btn')!;
    btn.disabled = true;
    errorEl.textContent = '';

    try {
      this._roomInfo = await this._service.joinRoom(roomId);

      const unsub = this._service.onRoomUpdate((state) => {
        unsub();
        this.dispatchEvent(
          new CustomEvent<GameStartDetail>('game-start', {
            detail: {
              service: this._service!,
              info: this._roomInfo!,
              configId: state.configId,
            },
          }),
        );
      });
    } catch (e) {
      errorEl.textContent = (e as Error).message;
      btn.disabled = false;
    }
  }

  private listenForOpponent(configId: string) {
    if (!this._service) return;

    const unsub = this._service.onRoomUpdate((state) => {
      if (state.status === 'playing' && state.guestId) {
        unsub();
        this.dispatchEvent(
          new CustomEvent<GameStartDetail>('game-start', {
            detail: {
              service: this._service!,
              info: this._roomInfo!,
              configId,
            },
          }),
        );
      }
    });
  }

  private async handleCancel() {
    if (this._service) {
      try {
        await this._service.leaveRoom();
      } catch {
        // ignore cleanup errors
      }
      this._service.dispose();
    }
    this._roomInfo = null;
    this.dispatchEvent(new CustomEvent('lobby-cancel'));
  }
}

customElements.define('game-lobby', GameLobby);
