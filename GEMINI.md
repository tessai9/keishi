# Gemini Agent Context & Guidelines (@GEMINI.md)

This file defines the context, architectural decisions, and development guidelines for the "Keishi" project. It is intended to guide the Gemini CLI agent to ensure consistency and adherence to the project's design philosophy.

## 1. Project Overview
**Keishi** is an abstract strategy board game played on a 6x6 grid.
- **Goal**: Form a rectangle with 4 stones.
- **Stack**: TypeScript, Vite, Vanilla JS (Web Components).
- **Platform**: Browser-based.

## 2. Architecture & Design

### 2.1 Core Principles
- **Minimalism**: The code and UI should be clean and minimal.
- **Strict Typing**: Use TypeScript interfaces for all game entities (Coordinates, Board, GameState).
- **Separation of Concerns**: Keep game logic (engine) separate from UI rendering (Web Components).

### 2.2 Data Structures
- **Grid**: 0-indexed, `x` (Column A-F), `y` (Row 1-6).
- **Board**: `(PlayerColor | null)[][]` (6x6).
- **State**:
  ```typescript
  interface GameState {
    board: Cell[][];
    turn: PlayerColor;
    winner: PlayerColor | null;
    history: string[]; // For Ko rule enforcement
  }
  ```

### 2.3 Game Logic (Engine)
- **Ayumi (Step)**: Move 1 square (any direction) to an empty spot.
- **Koshi (Jump)**: Jump over 1 adjacent stone to an immediate empty spot.
- **Win Condition**: 4 stones forming a rectangle/square with `side_length >= 2` (at least 1 gap).
- **Ko Rule**: Prevent restoring the board to the exact state of the start of the previous turn.

## 3. Development Guidelines

### 3.1 Workflow
1.  **Consult Specs**: Always refer to `spec_docs/design_spec.md` before implementing logic.
2.  **Task Tracking**: Update `spec_docs/development_tasks.md` as tasks are completed.
3.  **Testing**: Unit tests are crucial for movement logic and win conditions.

### 3.2 File Structure
- `src/core/`: Pure game logic (Board, Rules, Validation).
- `src/components/`: Web Components for UI.
- `tests/`: Unit tests (e.g., Vitest).

### 3.3 Coding Style
- **Formatting**: Adhere to project `.prettierrc` or standard TS conventions if absent.
- **Comments**: Explain *why*, not *what*, especially for complex geometry checks.

## 4. Documentation
- Keep `spec_docs/` up to date.
- If a rule is ambiguous, ask the user before assuming.
