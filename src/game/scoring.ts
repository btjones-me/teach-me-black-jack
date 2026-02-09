/**
 * Scoring system and Jack's feedback generation
 */

import type { FeedbackResult, StrategyAction } from './types';
import { Action } from './types';

/**
 * Calculate points earned for chosen action
 * - 3 points: Optimal action (rank 1)
 * - 1 point: Second-best action (rank 2)
 * - 0 points: Wrong action
 */
export function calculatePoints(chosen: Action, optimalActions: StrategyAction[]): number {
  const chosenAction = optimalActions.find((sa) => sa.action === chosen);

  if (!chosenAction) return 0; // Shouldn't happen if UI limits choices

  switch (chosenAction.rank) {
    case 1:
      return 3; // Perfect!
    case 2:
      return 1; // Second-best
    default:
      return 0; // Wrong
  }
}

/**
 * Generate Jack's feedback message based on performance
 */
export function generateJackMessage(
  chosen: Action,
  optimalActions: StrategyAction[],
  pointsEarned: number
): string {
  const optimal = optimalActions[0];
  const secondBest = optimalActions[1];

  // Perfect play!
  if (pointsEarned === 3) {
    return getOptimalMessage(chosen);
  }

  // Second-best play
  if (pointsEarned === 1) {
    return getSecondBestMessage(chosen, optimal.action);
  }

  // Wrong play
  return getWrongMessage(chosen, optimal.action, secondBest?.action);
}

/**
 * Messages for optimal play (3 points)
 */
function getOptimalMessage(action: Action): string {
  const messages: Record<Action, string[]> = {
    [Action.HIT]: [
      "Perfect! Hitting was the right call here.",
      "That's it! The math says to hit in this spot.",
      "Nicely done! Hit was the optimal play.",
      "Excellent! You're following basic strategy perfectly.",
    ],
    [Action.STAND]: [
      "That's the play! Standing gives you the best odds here.",
      "Perfect! The dealer's likely to bust with that card showing.",
      "Exactly right! Standing is the way to go.",
      "Spot on! No need to risk busting.",
    ],
    [Action.DOUBLE]: [
      "Beautiful! Doubling down squeezes maximum value from this hand.",
      "Perfect! This is a prime doubling opportunity.",
      "That's the advanced play! Double down was optimal.",
      "Excellent! You're maximizing your edge here.",
    ],
    [Action.SPLIT]: [
      "Great decision! Splitting gives you two strong hands.",
      "Perfect! This pair should definitely be split.",
      "That's it! Splitting is the way to maximize value here.",
      "Excellent! You turned one hand into two winners.",
    ],
  };

  const actionMessages = messages[action];
  return actionMessages[Math.floor(Math.random() * actionMessages.length)];
}

/**
 * Messages for second-best play (1 point)
 */
function getSecondBestMessage(chosen: Action, optimal: Action): string {
  const messages = [
    `Not bad! ${formatAction(chosen)} works, but ${formatAction(optimal)} squeezes a bit more value.`,
    `Close! ${formatAction(optimal)} is slightly better here, but ${formatAction(chosen)} isn't terrible.`,
    `You're on the right track! ${formatAction(optimal)} is the optimal play, though.`,
    `Decent choice! The math favors ${formatAction(optimal)} by a small margin.`,
    `Almost there! ${formatAction(chosen)} is reasonable, but ${formatAction(optimal)} is best.`,
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Messages for wrong play (0 points)
 */
function getWrongMessage(chosen: Action, optimal: Action, secondBest?: Action): string {
  const baseMessages = [
    `The math says to ${formatAction(optimal)} here. ${getReasonForAction(optimal, chosen)}`,
    `Tough one! ${formatAction(optimal)} is the play that wins over the long run.`,
    `Not quite! ${formatAction(optimal)} gives you the best shot at this hand.`,
    `That's a common mistake! ${formatAction(optimal)} is actually optimal here.`,
    `Let's review this one. ${formatAction(optimal)} is what basic strategy calls for.`,
  ];

  let message = baseMessages[Math.floor(Math.random() * baseMessages.length)];

  // Add second-best context if available
  if (secondBest) {
    message += ` ${formatAction(secondBest)} would be second-best.`;
  }

  return message;
}

/**
 * Format action for display in messages
 */
function formatAction(action: Action): string {
  switch (action) {
    case Action.HIT:
      return 'hit';
    case Action.STAND:
      return 'stand';
    case Action.DOUBLE:
      return 'double down';
    case Action.SPLIT:
      return 'split';
  }
}

/**
 * Get reasoning for why an action is correct
 */
function getReasonForAction(optimal: Action, chosen: Action): string {
  if (optimal === Action.STAND && chosen === Action.HIT) {
    return "The dealer's up card makes busting likely for them.";
  }
  if (optimal === Action.HIT && chosen === Action.STAND) {
    return "Your total is too low to stand with the dealer showing strength.";
  }
  if (optimal === Action.DOUBLE && chosen === Action.HIT) {
    return "This is a prime doubling opportunity to maximize your edge.";
  }
  if (optimal === Action.SPLIT && chosen !== Action.SPLIT) {
    return "Splitting creates two strong starting hands.";
  }
  return "Trust the math—basic strategy is proven over millions of hands.";
}

/**
 * Create feedback result for display
 */
export function createFeedback(
  chosen: Action,
  optimalActions: StrategyAction[]
): FeedbackResult {
  const pointsEarned = calculatePoints(chosen, optimalActions);
  const jackMessage = generateJackMessage(chosen, optimalActions, pointsEarned);

  return {
    chosen,
    optimal: optimalActions,
    pointsEarned,
    jackMessage,
  };
}
