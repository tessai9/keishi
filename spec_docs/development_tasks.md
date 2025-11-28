# Keishi Development Tasks

This document outlines the step-by-step plan to build the browser-based implementation of Keishi.

## Phase 1: Project Setup
- [x] Initialize project repository
- [x] Set up web framework(Vanilla JS but uses TypeScript with Vite)
    - [x] WebComponents API based directory structure
- [x] Configure linting and formatting tools
- [x] Create basic HTML structure

## Phase 2: Core Logic Implementation (The Engine)
- [x] **Data Structures**: Define types for Coordinates, Pieces, Board, and Game State.
- [x] **Board Initialization**: Implement function to setup the board with initial stone positions.
- [x] **Move Logic**:
    - [x] Implement `Ayumi` (Step) validation logic.
    - [x] Implement `Koshi` (Jump) validation logic.
    - [x] Combine validations into a `getValidMoves(pos)` function.
- [x] **State Management**:
    - [x] Implement `makeMove(from, to)` to update board state.
    - [x] Implement turn switching (Black <-> White).
- [x] **Win Condition**:
    - [x] Implement `checkWin(board, player)` to detect valid rectangles.
    - [x] Ensure gap constraints are enforced.
- [x] **Special Rules**:
    - [x] Implement board state hashing.
    - [x] Implement Sennichite (Ko) check to prevent immediate repetition.

## Phase 3: UI Development
- [x] **Grid Rendering**:
    - [x] Create a 6x6 grid display.
    - [x] Add coordinate labels (1-6, A-F).
- [x] **Piece Rendering**:
    - [x] Display Black and White stones visually.
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
