# Test Suite

This directory contains comprehensive unit tests for the blackjack game logic.

## Test Files

### `deck.test.ts`
Tests for card dealing, shuffling, and hand calculations:
- `getRankValue()` - Card value mappings
- `createDeck()` - Deck generation
- `shuffle()` - Fisher-Yates shuffling
- `calculateHandValue()` - Hand totals with soft ace handling
- `isPair()` - Pair detection for splits (by rank, not value)

### `strategy.test.ts`
Tests for basic strategy decisions:
- `getAvailableActions()` - Valid actions for given hands
- `getOptimalActions()` - Correct basic strategy for:
  - Hard hands (no aces or aces counted as 1)
  - Soft hands (aces counted as 11)
  - Pairs (split decisions)

### `scoring.test.ts`
Tests for the 3-1-0 point system:
- 3 points: Optimal action (rank 1)
- 1 point: Second-best action (rank 2)
- 0 points: Incorrect action (rank 3+)
- Jack's feedback messages

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run with coverage report
npm run test:coverage

# Run with UI
npm run test:ui
```

## Coverage

Current test coverage: **58 tests** covering:
- Deck operations (26 tests)
- Basic strategy logic (21 tests)
- Scoring system (11 tests)

## Key Test Scenarios

### Pair Detection Bug (Fixed)
Tests ensure that only cards with the **same rank** can be split, not just the same value:
- ✅ K-K can split
- ✅ 10-10 can split
- ❌ K-Q cannot split (both value 10, different ranks)
- ❌ K-10 cannot split
- ❌ Q-J cannot split

### Soft Hand Calculations
Tests verify correct ace handling:
- A-6 = soft 17 (ace as 11)
- A-K-5 = 16 (ace converts from 11 to 1)
- A-A-9 = soft 21 (one ace as 11, one as 1)

### Basic Strategy
Tests verify correct decisions for standard scenarios:
- Always split aces and 8s
- Never split 10s
- Double on 11 vs dealer 2-10
- Stand on 17+
- Hit/stand breakpoints for dealer up cards
