/**
 * Tests for deck.ts - Card dealing, shuffling, and hand calculations
 */

import { describe, it, expect } from 'vitest';
import {
  getRankValue,
  createDeck,
  shuffle,
  calculateHandValue,
  isPair,
} from '../deck';
import { Rank, Suit } from '../types';
import type { Card } from '../types';

describe('getRankValue', () => {
  it('should return 11 for ACE', () => {
    expect(getRankValue(Rank.ACE)).toBe(11);
  });

  it('should return numeric values for 2-9', () => {
    expect(getRankValue(Rank.TWO)).toBe(2);
    expect(getRankValue(Rank.THREE)).toBe(3);
    expect(getRankValue(Rank.NINE)).toBe(9);
  });

  it('should return 10 for face cards', () => {
    expect(getRankValue(Rank.TEN)).toBe(10);
    expect(getRankValue(Rank.JACK)).toBe(10);
    expect(getRankValue(Rank.QUEEN)).toBe(10);
    expect(getRankValue(Rank.KING)).toBe(10);
  });
});

describe('createDeck', () => {
  it('should create a 52-card deck', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(52);
  });

  it('should have 13 cards of each suit', () => {
    const deck = createDeck();
    const suits = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES];
    
    suits.forEach(suit => {
      const cardsOfSuit = deck.filter(card => card.suit === suit);
      expect(cardsOfSuit).toHaveLength(13);
    });
  });

  it('should have 4 cards of each rank', () => {
    const deck = createDeck();
    const ranks = Object.values(Rank);
    
    ranks.forEach(rank => {
      const cardsOfRank = deck.filter(card => card.rank === rank);
      expect(cardsOfRank).toHaveLength(4);
    });
  });

  it('should set correct values for each card', () => {
    const deck = createDeck();
    
    deck.forEach(card => {
      expect(card.value).toBe(getRankValue(card.rank));
    });
  });
});

describe('shuffle', () => {
  it('should return array of same length', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffle(original);
    expect(shuffled).toHaveLength(original.length);
  });

  it('should contain all original elements', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffle(original);
    
    original.forEach(item => {
      expect(shuffled).toContain(item);
    });
  });

  it('should not modify original array', () => {
    const original = [1, 2, 3, 4, 5];
    const originalCopy = [...original];
    shuffle(original);
    
    expect(original).toEqual(originalCopy);
  });

  it('should shuffle a deck', () => {
    const deck = createDeck();
    const shuffled = shuffle(deck);
    
    // Very unlikely to be in exact same order
    const isIdentical = deck.every((card, i) => 
      card.rank === shuffled[i].rank && card.suit === shuffled[i].suit
    );
    
    expect(isIdentical).toBe(false);
  });
});

describe('calculateHandValue', () => {
  const createCard = (rank: Rank, suit: Suit = Suit.HEARTS): Card => ({
    rank,
    suit,
    value: getRankValue(rank),
  });

  it('should calculate simple hand values', () => {
    const hand = [createCard(Rank.FIVE), createCard(Rank.SEVEN)];
    expect(calculateHandValue(hand)).toEqual({ total: 12, isSoft: false });
  });

  it('should recognize soft hands with ace', () => {
    const hand = [createCard(Rank.ACE), createCard(Rank.SIX)];
    const result = calculateHandValue(hand);
    expect(result.total).toBe(17);
    expect(result.isSoft).toBe(true);
  });

  it('should adjust ace from 11 to 1 when busting', () => {
    const hand = [createCard(Rank.ACE), createCard(Rank.KING), createCard(Rank.FIVE)];
    const result = calculateHandValue(hand);
    expect(result.total).toBe(16); // A=1, K=10, 5=5
    expect(result.isSoft).toBe(false);
  });

  it('should handle multiple aces', () => {
    const hand = [createCard(Rank.ACE), createCard(Rank.ACE), createCard(Rank.NINE)];
    const result = calculateHandValue(hand);
    expect(result.total).toBe(21); // A=11, A=1, 9=9
    expect(result.isSoft).toBe(true);
  });

  it('should handle blackjack', () => {
    const hand = [createCard(Rank.ACE), createCard(Rank.KING)];
    const result = calculateHandValue(hand);
    expect(result.total).toBe(21);
    expect(result.isSoft).toBe(true);
  });

  it('should handle bust', () => {
    const hand = [createCard(Rank.KING), createCard(Rank.QUEEN), createCard(Rank.FIVE)];
    const result = calculateHandValue(hand);
    expect(result.total).toBe(25);
    expect(result.isSoft).toBe(false);
  });

  it('should handle soft 21 with multiple aces', () => {
    const hand = [
      createCard(Rank.ACE),
      createCard(Rank.ACE),
      createCard(Rank.ACE),
      createCard(Rank.ACE),
      createCard(Rank.SEVEN)
    ];
    const result = calculateHandValue(hand);
    expect(result.total).toBe(21); // A=11, A=1, A=1, A=1, 7=7
    expect(result.isSoft).toBe(true);
  });
});

describe('isPair', () => {
  const createCard = (rank: Rank, suit: Suit = Suit.HEARTS): Card => ({
    rank,
    suit,
    value: getRankValue(rank),
  });

  it('should return true for matching ranks', () => {
    const hand = [createCard(Rank.EIGHT, Suit.HEARTS), createCard(Rank.EIGHT, Suit.CLUBS)];
    expect(isPair(hand)).toBe(true);
  });

  it('should return true for face card pairs', () => {
    const hand = [createCard(Rank.KING, Suit.HEARTS), createCard(Rank.KING, Suit.SPADES)];
    expect(isPair(hand)).toBe(true);
  });

  it('should return false for different ranks with same value', () => {
    // King and Queen both have value 10, but different ranks
    const hand = [createCard(Rank.KING), createCard(Rank.QUEEN)];
    expect(isPair(hand)).toBe(false);
  });

  it('should return false for King and 10', () => {
    const hand = [createCard(Rank.KING), createCard(Rank.TEN)];
    expect(isPair(hand)).toBe(false);
  });

  it('should return false for Queen and Jack', () => {
    const hand = [createCard(Rank.QUEEN), createCard(Rank.JACK)];
    expect(isPair(hand)).toBe(false);
  });

  it('should return false for hands with more than 2 cards', () => {
    const hand = [
      createCard(Rank.EIGHT),
      createCard(Rank.EIGHT),
      createCard(Rank.FIVE)
    ];
    expect(isPair(hand)).toBe(false);
  });

  it('should return false for hands with less than 2 cards', () => {
    const hand = [createCard(Rank.EIGHT)];
    expect(isPair(hand)).toBe(false);
  });

  it('should return false for different ranks', () => {
    const hand = [createCard(Rank.FIVE), createCard(Rank.SEVEN)];
    expect(isPair(hand)).toBe(false);
  });
});
