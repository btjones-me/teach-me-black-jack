/**
 * Tests for scoring.ts - Point calculations and feedback
 */

import { describe, it, expect } from 'vitest';
import { createFeedback } from '../scoring';
import { Action } from '../types';
import type { StrategyAction } from '../types';

describe('createFeedback', () => {
  it('should award 3 points for optimal action', () => {
    const chosen = Action.HIT;
    const optimalActions: StrategyAction[] = [
      { action: Action.HIT, rank: 1 },
      { action: Action.STAND, rank: 2 },
    ];

    const feedback = createFeedback(chosen, optimalActions);

    expect(feedback.pointsEarned).toBe(3);
    expect(feedback.chosen).toBe(Action.HIT);
    expect(feedback.optimal).toHaveLength(2);
  });

  it('should award 1 point for second-best action', () => {
    const chosen = Action.STAND;
    const optimalActions: StrategyAction[] = [
      { action: Action.HIT, rank: 1 },
      { action: Action.STAND, rank: 2 },
      { action: Action.DOUBLE, rank: 3 },
    ];

    const feedback = createFeedback(chosen, optimalActions);

    expect(feedback.pointsEarned).toBe(1);
    expect(feedback.chosen).toBe(Action.STAND);
  });

  it('should award 0 points for wrong action', () => {
    const chosen = Action.DOUBLE;
    const optimalActions: StrategyAction[] = [
      { action: Action.HIT, rank: 1 },
      { action: Action.STAND, rank: 2 },
    ];

    const feedback = createFeedback(chosen, optimalActions);

    expect(feedback.pointsEarned).toBe(0);
    expect(feedback.chosen).toBe(Action.DOUBLE);
  });

  it('should include optimal actions in feedback', () => {
    const chosen = Action.HIT;
    const optimalActions: StrategyAction[] = [
      { action: Action.HIT, rank: 1 },
      { action: Action.STAND, rank: 2 },
      { action: Action.DOUBLE, rank: 3 },
    ];

    const feedback = createFeedback(chosen, optimalActions);

    expect(feedback.optimal).toEqual(optimalActions);
  });

  it('should include Jack message', () => {
    const chosen = Action.HIT;
    const optimalActions: StrategyAction[] = [
      { action: Action.HIT, rank: 1 },
    ];

    const feedback = createFeedback(chosen, optimalActions);

    expect(feedback.jackMessage).toBeDefined();
    expect(typeof feedback.jackMessage).toBe('string');
    expect(feedback.jackMessage.length).toBeGreaterThan(0);
  });

  it('should have different Jack messages for different scores', () => {
    const optimalActions: StrategyAction[] = [
      { action: Action.HIT, rank: 1 },
      { action: Action.STAND, rank: 2 },
    ];

    const perfectFeedback = createFeedback(Action.HIT, optimalActions);
    const goodFeedback = createFeedback(Action.STAND, optimalActions);
    const wrongFeedback = createFeedback(Action.DOUBLE, optimalActions);

    // Messages should be different for different outcomes
    expect(perfectFeedback.jackMessage).not.toBe(wrongFeedback.jackMessage);
    expect(goodFeedback.jackMessage).not.toBe(wrongFeedback.jackMessage);
  });

  it('should handle single optimal action', () => {
    const chosen = Action.HIT;
    const optimalActions: StrategyAction[] = [
      { action: Action.HIT, rank: 1 },
    ];

    const feedback = createFeedback(chosen, optimalActions);

    expect(feedback.pointsEarned).toBe(3);
    expect(feedback.optimal).toHaveLength(1);
  });

  it('should handle all actions being ranked', () => {
    const chosen = Action.SPLIT;
    const optimalActions: StrategyAction[] = [
      { action: Action.HIT, rank: 1 },
      { action: Action.STAND, rank: 2 },
      { action: Action.DOUBLE, rank: 3 },
      { action: Action.SPLIT, rank: 4 },
    ];

    const feedback = createFeedback(chosen, optimalActions);

    expect(feedback.pointsEarned).toBe(0);
    expect(feedback.optimal).toHaveLength(4);
  });
});

describe('Point System', () => {
  it('should follow 3-1-0 point system', () => {
    const optimalActions: StrategyAction[] = [
      { action: Action.HIT, rank: 1 },
      { action: Action.STAND, rank: 2 },
      { action: Action.DOUBLE, rank: 3 },
    ];

    const perfect = createFeedback(Action.HIT, optimalActions);
    const good = createFeedback(Action.STAND, optimalActions);
    const wrong = createFeedback(Action.DOUBLE, optimalActions);

    expect(perfect.pointsEarned).toBe(3);
    expect(good.pointsEarned).toBe(1);
    expect(wrong.pointsEarned).toBe(0);
  });

  it('should award 3 points for any rank-1 action', () => {
    const actions: Action[] = [Action.HIT, Action.STAND, Action.DOUBLE, Action.SPLIT];

    actions.forEach(action => {
      const optimalActions: StrategyAction[] = [{ action, rank: 1 }];
      const feedback = createFeedback(action, optimalActions);
      
      expect(feedback.pointsEarned).toBe(3);
    });
  });

  it('should award 1 point for any rank-2 action', () => {
    // Test different actions as rank-2, ensuring they're different from rank-1
    const testCases: Array<{ rank1: Action; rank2: Action }> = [
      { rank1: Action.HIT, rank2: Action.STAND },
      { rank1: Action.STAND, rank2: Action.HIT },
      { rank1: Action.DOUBLE, rank2: Action.HIT },
      { rank1: Action.HIT, rank2: Action.SPLIT },
    ];

    testCases.forEach(({ rank1, rank2 }) => {
      const optimalActions: StrategyAction[] = [
        { action: rank1, rank: 1 },
        { action: rank2, rank: 2 },
      ];
      const feedback = createFeedback(rank2, optimalActions);
      
      expect(feedback.pointsEarned).toBe(1);
    });
  });
});
