/**
 * Tests for strategy.ts - Basic strategy decisions
 */

import { describe, it, expect } from 'vitest';
import { getOptimalActions, getAvailableActions } from '../strategy';
import { Action, Rank, Suit } from '../types';
import type { Card } from '../types';

const createCard = (rank: Rank, suit: Suit = Suit.HEARTS): Card => ({
  rank,
  suit,
  value: rank === Rank.ACE ? 11 : 
         rank === Rank.TWO ? 2 :
         rank === Rank.THREE ? 3 :
         rank === Rank.FOUR ? 4 :
         rank === Rank.FIVE ? 5 :
         rank === Rank.SIX ? 6 :
         rank === Rank.SEVEN ? 7 :
         rank === Rank.EIGHT ? 8 :
         rank === Rank.NINE ? 9 : 10,
});

describe('getAvailableActions', () => {
  it('should always include HIT and STAND', () => {
    const cards = [createCard(Rank.TEN), createCard(Rank.FIVE)];
    const actions = getAvailableActions(cards, false);
    
    expect(actions).toContain(Action.HIT);
    expect(actions).toContain(Action.STAND);
  });

  it('should include DOUBLE on first action', () => {
    const cards = [createCard(Rank.TEN), createCard(Rank.FIVE)];
    const actions = getAvailableActions(cards, true);
    
    expect(actions).toContain(Action.DOUBLE);
  });

  it('should not include DOUBLE after first action', () => {
    const cards = [createCard(Rank.TEN), createCard(Rank.FIVE)];
    const actions = getAvailableActions(cards, false);
    
    expect(actions).not.toContain(Action.DOUBLE);
  });

  it('should include SPLIT for pairs on first action', () => {
    const cards = [createCard(Rank.EIGHT, Suit.HEARTS), createCard(Rank.EIGHT, Suit.CLUBS)];
    const actions = getAvailableActions(cards, true);
    
    expect(actions).toContain(Action.SPLIT);
  });

  it('should not include SPLIT for non-pairs', () => {
    const cards = [createCard(Rank.EIGHT), createCard(Rank.SEVEN)];
    const actions = getAvailableActions(cards, true);
    
    expect(actions).not.toContain(Action.SPLIT);
  });

  it('should not include SPLIT for same value but different rank', () => {
    const cards = [createCard(Rank.KING), createCard(Rank.QUEEN)];
    const actions = getAvailableActions(cards, true);
    
    expect(actions).not.toContain(Action.SPLIT);
  });
});

describe('getOptimalActions - Hard Hands', () => {
  it('should hit on hard 8 vs dealer 5', () => {
    const playerCards = [createCard(Rank.FIVE), createCard(Rank.THREE)];
    const dealerCard = createCard(Rank.FIVE);
    const optimal = getOptimalActions(playerCards, dealerCard, true, false);
    
    expect(optimal[0].action).toBe(Action.HIT);
  });

  it('should double on hard 11 vs dealer 6', () => {
    const playerCards = [createCard(Rank.SIX), createCard(Rank.FIVE)];
    const dealerCard = createCard(Rank.SIX);
    const optimal = getOptimalActions(playerCards, dealerCard, true, false);
    
    expect(optimal[0].action).toBe(Action.DOUBLE);
  });

  it('should stand on hard 17 vs dealer 7', () => {
    const playerCards = [createCard(Rank.TEN), createCard(Rank.SEVEN)];
    const dealerCard = createCard(Rank.SEVEN);
    const optimal = getOptimalActions(playerCards, dealerCard, false, false);
    
    expect(optimal[0].action).toBe(Action.STAND);
  });

  it('should stand on hard 12 vs dealer 4', () => {
    const playerCards = [createCard(Rank.TEN), createCard(Rank.TWO)];
    const dealerCard = createCard(Rank.FOUR);
    const optimal = getOptimalActions(playerCards, dealerCard, false, false);
    
    expect(optimal[0].action).toBe(Action.STAND);
  });

  it('should hit on hard 16 vs dealer 10', () => {
    const playerCards = [createCard(Rank.TEN), createCard(Rank.SIX)];
    const dealerCard = createCard(Rank.TEN);
    const optimal = getOptimalActions(playerCards, dealerCard, false, false);
    
    expect(optimal[0].action).toBe(Action.HIT);
  });
});

describe('getOptimalActions - Soft Hands', () => {
  it('should hit on soft 17 vs dealer 7', () => {
    const playerCards = [createCard(Rank.ACE), createCard(Rank.SIX)];
    const dealerCard = createCard(Rank.SEVEN);
    const optimal = getOptimalActions(playerCards, dealerCard, true, false);
    
    expect(optimal[0].action).toBe(Action.HIT);
  });

  it('should double on soft 18 vs dealer 6', () => {
    const playerCards = [createCard(Rank.ACE), createCard(Rank.SEVEN)];
    const dealerCard = createCard(Rank.SIX);
    const optimal = getOptimalActions(playerCards, dealerCard, true, false);
    
    expect(optimal[0].action).toBe(Action.DOUBLE);
  });

  it('should stand on soft 19 vs dealer 10', () => {
    const playerCards = [createCard(Rank.ACE), createCard(Rank.EIGHT)];
    const dealerCard = createCard(Rank.TEN);
    const optimal = getOptimalActions(playerCards, dealerCard, false, false);
    
    expect(optimal[0].action).toBe(Action.STAND);
  });
});

describe('getOptimalActions - Pairs', () => {
  it('should always split Aces', () => {
    const playerCards = [createCard(Rank.ACE, Suit.HEARTS), createCard(Rank.ACE, Suit.CLUBS)];
    const dealerCard = createCard(Rank.TEN);
    const optimal = getOptimalActions(playerCards, dealerCard, true, true);
    
    expect(optimal[0].action).toBe(Action.SPLIT);
  });

  it('should always split 8s', () => {
    const playerCards = [createCard(Rank.EIGHT, Suit.HEARTS), createCard(Rank.EIGHT, Suit.CLUBS)];
    const dealerCard = createCard(Rank.TEN);
    const optimal = getOptimalActions(playerCards, dealerCard, true, true);
    
    expect(optimal[0].action).toBe(Action.SPLIT);
  });

  it('should never split 10s', () => {
    const playerCards = [createCard(Rank.TEN, Suit.HEARTS), createCard(Rank.TEN, Suit.CLUBS)];
    const dealerCard = createCard(Rank.SIX);
    const optimal = getOptimalActions(playerCards, dealerCard, true, true);
    
    expect(optimal[0].action).not.toBe(Action.SPLIT);
    expect(optimal[0].action).toBe(Action.STAND);
  });

  it('should split 9s vs dealer 6', () => {
    const playerCards = [createCard(Rank.NINE, Suit.HEARTS), createCard(Rank.NINE, Suit.CLUBS)];
    const dealerCard = createCard(Rank.SIX);
    const optimal = getOptimalActions(playerCards, dealerCard, true, true);
    
    expect(optimal[0].action).toBe(Action.SPLIT);
  });

  it('should not split 9s vs dealer 7', () => {
    const playerCards = [createCard(Rank.NINE, Suit.HEARTS), createCard(Rank.NINE, Suit.CLUBS)];
    const dealerCard = createCard(Rank.SEVEN);
    const optimal = getOptimalActions(playerCards, dealerCard, true, true);
    
    expect(optimal[0].action).toBe(Action.STAND);
  });
});

describe('getOptimalActions - Return Values', () => {
  it('should return actions ranked by optimality', () => {
    const playerCards = [createCard(Rank.TEN), createCard(Rank.FIVE)];
    const dealerCard = createCard(Rank.SIX);
    const optimal = getOptimalActions(playerCards, dealerCard, true, false);
    
    expect(optimal).toBeInstanceOf(Array);
    expect(optimal.length).toBeGreaterThan(0);
    expect(optimal[0]).toHaveProperty('action');
    expect(optimal[0]).toHaveProperty('rank');
    expect(optimal[0].rank).toBe(1); // First action should be rank 1
  });

  it('should have ascending rank values', () => {
    const playerCards = [createCard(Rank.TEN), createCard(Rank.FIVE)];
    const dealerCard = createCard(Rank.SIX);
    const optimal = getOptimalActions(playerCards, dealerCard, true, false);
    
    for (let i = 1; i < optimal.length; i++) {
      expect(optimal[i].rank).toBeGreaterThan(optimal[i - 1].rank);
    }
  });
});
