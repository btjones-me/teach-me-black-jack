/**
 * Core type definitions for Teach me Black, Jack
 */

// Card suits and ranks
export enum Suit {
  HEARTS = '♥',
  DIAMONDS = '♦',
  CLUBS = '♣',
  SPADES = '♠',
}

export enum Rank {
  ACE = 'A',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K',
}

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number; // Blackjack value (ace is 11 initially)
}

// Player actions
export enum Action {
  HIT = 'HIT',
  STAND = 'STAND',
  DOUBLE = 'DOUBLE',
  SPLIT = 'SPLIT',
}

// Strategy lookup
export interface StrategyAction {
  action: Action;
  rank: number; // 1 = optimal, 2 = second-best, etc.
}

export interface HandValue {
  total: number;
  isSoft: boolean; // Contains an ace counted as 11
  isPair: boolean;
}

// Game state
export interface GameState {
  currentHand: number;
  totalHands: number;
  score: number;
  playerCards: Card[];
  dealerCard: Card | null;
  availableActions: Action[];
  feedback: FeedbackResult | null;
  history: HandResult[];
  gameOver: boolean;
  handInProgress: boolean;
  actionsThisHand: Action[];
  canDouble: boolean;
  canSplit: boolean;
}

export interface FeedbackResult {
  chosen: Action;
  optimal: StrategyAction[];
  pointsEarned: number;
  jackMessage: string;
}

export interface HandResult {
  handNumber: number;
  playerCards: Card[];
  dealerCard: Card;
  chosen: Action;
  optimal: Action;
  pointsEarned: number;
}

// Storage
export interface GameSettings {
  totalHands: number;
  deckCount: number;
  dealerHitsSoft17: boolean;
}

export interface StorageAdapter {
  saveSettings(settings: GameSettings): Promise<void>;
  loadSettings(): Promise<GameSettings | null>;
  saveHistory(history: HandResult[]): Promise<void>;
  loadHistory(): Promise<HandResult[]>;
  clearHistory(): Promise<void>;
}
