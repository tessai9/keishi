import './style.css';
import './components/board-grid.ts'; // Import the Web Component

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div style="margin-bottom: 1.5rem;">
    <h1>Keishi Board Game</h1>
    <a class="help-link" href="https://raw.githubusercontent.com/tessai9/keishi/refs/heads/main/docs/official_rule_book.md" target="_blank">Help (Official Rule Book)</a>
  </div>
  <board-grid></board-grid>
`;
