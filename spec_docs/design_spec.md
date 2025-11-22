# 形四 (Keishi) - Design Specification

## 1. Game Overview
**Keishi** is an abstract strategy board game played on a 6x6 grid. Two players (Black and White) control 4 stones each. The objective is to form a rectangle or square with the 4 stones before the opponent does.

## 2. Core Rules & Mechanics

### 2.1 Board & Pieces
*   **Grid**: 6x6 matrix.
    *   Rows: 1 to 6 (Top to Bottom or Bottom to Top, internal logic should be 0-5).
    *   Columns: A to F (Left to Right, internal logic 0-5).
*   **Pieces**: 4 Black stones (Player 1/Sente), 4 White stones (Player 2/Gote).

### 2.2 Initial Configuration
*   **Black**: A2, B2, E2, F2
*   **White**: A5, B5, E5, F5

### 2.3 Movement Rules
Players take turns moving one stone. Two types of moves are available:

1.  **Ayumi (Step)**:
    *   Move 1 square in any direction (vertical, horizontal, diagonal).
    *   Condition: Target square must be empty.
2.  **Koshi (Jump)**:
    *   Jump over an *adjacent* stone (friend or foe) to the immediate empty square beyond it.
    *   Direction: Vertical, horizontal, diagonal.
    *   Condition: Target square must be empty.
    *   Restriction: No multi-jumps. Do NOT capture the jumped piece.

### 2.4 Victory Condition (The Rectangle)
A player wins immediately upon positioning their 4 stones to form the vertices of a rectangle (or square).
*   **Orientation**: Sides must be parallel to the grid lines (no diamonds).
*   **Size Constraint**: There must be at least 1 empty square gap between adjacent vertices along the sides.
    *   *Invalid*: A 2x2 cluster (gap = 0).
    *   *Valid*: Side length (coordinate difference) $\ge$ 2.
    *   Formula: If vertices are $(x_1, y_1)$ and $(x_2, y_2)$, then $|x_1 - x_2| \ge 2$ AND $|y_1 - y_2| \ge 2$.

### 2.5 Special Rules
*   **Sennichite (Ko Rule)**: It is forbidden to make a move that returns the board to the exact state it was in at the start of the player's previous turn. (Preventing immediate infinite loops).

## 3. Technical Architecture

### 3.1 Data Structures

#### Coordinate System
*   `x`: 0-5 (Column A-F)
*   `y`: 0-5 (Row 1-6)

#### Board State
*   Representation: 2D Array `board[6][6]` or a flat Map.
*   Values: `NULL` (Empty), `BLACK`, `WHITE`.

#### Game State Object
```typescript
interface GameState {
  board: Cell[][];          // Current grid layout
  turn: PlayerColor;        // 'BLACK' | 'WHITE'
  winner: PlayerColor | null;
  history: string[];        // Hash of board states for Ko checking
}
```

### 3.2 Logic Modules

#### Move Validator
Input: `CurrentState`, `From(x,y)`, `To(x,y)`
1.  Check if `To` is empty.
2.  Check geometry:
    *   Is distance 1? -> Valid **Ayumi**.
    *   Is distance 2? -> Check midpoint for any stone -> Valid **Koshi**.
    *   Else -> Invalid.
3.  Check Ko: Simulate move, hash board, compare with `history[last - 1]`.

#### Win Checker
Input: `Board`, `PlayerColor`
1.  Find all 4 coordinates of `PlayerColor`.
2.  Sort coordinates to simplify checking.
3.  Check if they form a valid rectangle:
    *   Verify x-coords are pairs (e.g., x1, x1, x2, x2).
    *   Verify y-coords are pairs (e.g., y1, y2, y1, y2).
    *   Verify $|x_1 - x_2| \ge 2$ and $|y_1 - y_2| \ge 2$.

### 3.3 User Interface (Browser)
*   **Visuals**: Clean, minimal abstract design.
*   **Interaction**:
    *   Click stone to select (Highlight valid moves).
    *   Click target cell to move.
*   **Feedback**:
    *   Turn indicator.
    *   Victory notification.
    *   "Invalid Move" warning (especially for Ko).
