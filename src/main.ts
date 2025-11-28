import './style.css';
import './components/board-grid.ts'; // Import the Web Component

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Keishi Board Game</h1>
    <board-grid></board-grid>
  </div>
`;
