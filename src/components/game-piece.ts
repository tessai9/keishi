import type { PlayerColor } from '../core/types';

class GamePiece extends HTMLElement {
  private _color: PlayerColor | null = null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      .piece {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        color: white;
        animation: popIn 0.2s ease-out;
      }
      @keyframes popIn {
        from { transform: scale(0); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      .black {
        background-color: black;
        border: 2px solid #555;
      }
      .white {
        background-color: white;
        border: 2px solid #aaa;
      }
    `;

    const pieceDiv = document.createElement('div');
    pieceDiv.classList.add('piece');
    shadow.appendChild(style);
    shadow.appendChild(pieceDiv);
  }

  static get observedAttributes() {
    return ['color'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'color') {
      this.color = newValue as PlayerColor;
    }
  }

  set color(value: PlayerColor | null) {
    this._color = value;
    const pieceDiv = this.shadowRoot?.querySelector('.piece');
    if (pieceDiv) {
      pieceDiv.classList.remove('black', 'white');
      if (value) {
        pieceDiv.classList.add(value);
      }
    }
  }

  get color(): PlayerColor | null {
    return this._color;
  }
}

customElements.define('game-piece', GamePiece);
