# Keishi Development Tasks

This document outlines the step-by-step plan to build the browser-based implementation of Keishi.

## Phase 1: Project Setup
- [ ] Initialize project repository
- [ ] Set up web framework(Vanilla JS but uses TypeScript with Vite)
    - [ ] WebComponents API based directory structure
- [ ] Configure linting and formatting tools
- [ ] Create basic HTML structure

## Phase 2: Core Logic Implementation (The Engine)
- [ ] **Data Structures**: Define types for Coordinates, Pieces, Board, and Game State.
- [ ] **Board Initialization**: Implement function to setup the board with initial stone positions.
- [ ] **Move Logic**:
    - [ ] Implement `Ayumi` (Step) validation logic.
    - [ ] Implement `Koshi` (Jump) validation logic.
    - [ ] Combine validations into a `getValidMoves(pos)` function.
- [ ] **State Management**:
    - [ ] Implement `makeMove(from, to)` to update board state.
    - [ ] Implement turn switching (Black <-> White).
- [ ] **Win Condition**:
    - [ ] Implement `checkWin(board, player)` to detect valid rectangles.
    - [ ] Ensure gap constraints are enforced.
- [ ] **Special Rules**:
    - [ ] Implement board state hashing.
    - [ ] Implement Sennichite (Ko) check to prevent immediate repetition.

## Phase 3: UI Development
- [ ] **Grid Rendering**:
    - [ ] Create a 6x6 grid display.
    - [ ] Add coordinate labels (1-6, A-F).
- [ ] **Piece Rendering**:
    - [ ] Display Black and White stones visually.
- [ ] **Interactivity**:
    - [ ] Click to select piece.
    - [ ] Highlight valid move destinations.
    - [ ] Click destination to move.
- [ ] **Game Info Display**:
    - [ ] Current Turn indicator.
    - [ ] Game Over message with Winner announcement.
    - [ ] Restart/Reset button.

## Phase 4: Polish & Testing
- [ ] **Unit Tests**:
    - [ ] Test Ayumi/Koshi movement edge cases.
    - [ ] Test Win detection (valid vs invalid rectangles).
    - [ ] Test Ko rule blocking.
- [ ] **UI Polish**:
    - [ ] Add simple animations for movement.
    - [ ] Responsive design adjustments.
- [ ] **Documentation**:
    - [ ] Update README with "How to Run".
