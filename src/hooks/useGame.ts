/**
 * useGame - Main game state management hook
 */

import { useState, useCallback } from 'react';
import type { GameState, HandResult } from '../game/types';
import { Action } from '../game/types';
import { dealHand } from '../game/deck';
import { getAvailableActions, getOptimalActions } from '../game/strategy';
import { createFeedback } from '../game/scoring';

const DEFAULT_TOTAL_HANDS = 20;

function initializeGame(hands: number): GameState {
  const { playerCards, dealerCard } = dealHand();
  const availableActions = getAvailableActions(playerCards, true);

  return {
    currentHand: 1,
    totalHands: hands,
    score: 0,
    playerCards,
    dealerCard,
    availableActions,
    feedback: null,
    history: [],
    gameOver: false,
  };
}

export function useGame(totalHands: number = DEFAULT_TOTAL_HANDS) {
  const [gameState, setGameState] = useState<GameState>(() => initializeGame(totalHands));

  const handleAction = useCallback((chosenAction: Action) => {
    setGameState((prevState) => {
      if (prevState.gameOver || !prevState.dealerCard) {
        return prevState;
      }

      // Get optimal actions for current situation
      const optimalActions = getOptimalActions(
        prevState.playerCards,
        prevState.dealerCard,
        true, // canDouble (first action)
        true  // canSplit
      );

      // Create feedback
      const feedback = createFeedback(chosenAction, optimalActions);

      // Record hand result
      const handResult: HandResult = {
        handNumber: prevState.currentHand,
        playerCards: prevState.playerCards,
        dealerCard: prevState.dealerCard,
        chosen: chosenAction,
        optimal: optimalActions[0].action,
        pointsEarned: feedback.pointsEarned,
      };

      // Update score and history
      const newScore = prevState.score + feedback.pointsEarned;
      const newHistory = [...prevState.history, handResult];

      return {
        ...prevState,
        score: newScore,
        feedback,
        history: newHistory,
      };
    });
  }, []);

  const nextHand = useCallback(() => {
    setGameState((prevState) => {
      // Check if game should end
      if (prevState.currentHand >= prevState.totalHands) {
        return {
          ...prevState,
          gameOver: true,
          feedback: null,
        };
      }

      // Deal new hand
      const { playerCards, dealerCard } = dealHand();
      const availableActions = getAvailableActions(playerCards, true);

      return {
        ...prevState,
        currentHand: prevState.currentHand + 1,
        playerCards,
        dealerCard,
        availableActions,
        feedback: null,
      };
    });
  }, []);

  const restartGame = useCallback(() => {
    setGameState(initializeGame(gameState.totalHands));
  }, [gameState.totalHands]);

  const clearFeedback = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      feedback: null,
    }));
  }, []);

  return {
    gameState,
    handleAction,
    nextHand,
    restartGame,
    clearFeedback,
  };
}
