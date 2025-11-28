# Keishi (形四)

A browser-based abstract strategy board game implemented with Vanilla TypeScript, Vite, and Web Components.

## Rules Overview
- **Goal**: Form a rectangle with 4 of your stones.
- **Board**: 6x6 grid.
- **Pieces**: 4 Black, 4 White.
- **Movement**:
    - **Step (Ayumi)**: Move 1 square in any direction to an empty spot.
    - **Jump (Koshi)**: Jump over an adjacent stone to an empty spot immediately behind it.
- **Special Rules**:
    - **Ko**: You cannot make a move that restores the board to the exact state it was in at the start of your previous turn (prevents infinite loops).

For full rules, see [Official Rule Book](docs/official_rule_book.md).

## Project Setup

### Prerequisites
- Node.js (v18 or later recommended)

### Installation
```bash
npm install
```

### Development
Start the local development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### Testing
Run unit tests (Vitest):
```bash
npm test
```

### Linting & Formatting
```bash
npm run lint
npm run format
```

## Tech Stack
- **Framework**: None (Vanilla JS + Web Components)
- **Language**: TypeScript
- **Bundler**: Vite
- **Testing**: Vitest
