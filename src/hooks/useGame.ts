/**
 * useGame - Main game state management hook
 */

import { useState, useCallback } from 'react';
import type { GameState, HandResult } from '../game/types';
import { Action } from '../game/types';
import { dealHand, dealRandomCard, calculateHandValue } from '../game/deck';
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
    handInProgress: true,
    actionsThisHand: [],
    canDouble: true,
    canSplit: true,
  };
}

export function useGame(totalHands: number = DEFAULT_TOTAL_HANDS) {
  const [gameState, setGameState] = useState<GameState>(() => initializeGame(totalHands));

  const handleAction = useCallback((chosenAction: Action) => {
    setGameState((prevState) => {
      if (prevState.gameOver || !prevState.dealerCard || !prevState.handInProgress) {
        return prevState;
      }

      // Track this action
      const newActionsThisHand = [...prevState.actionsThisHand, chosenAction];
      let newPlayerCards = [...prevState.playerCards];
      let handComplete = false;
      let busted = false;

      // Handle HIT: deal a card and continue
      if (chosenAction === Action.HIT) {
        const newCard = dealRandomCard();
        newPlayerCards = [...prevState.playerCards, newCard];
        
        // Check for bust
        const handValue = calculateHandValue(newPlayerCards);
        if (handValue.total > 21) {
          handComplete = true;
          busted = true;
        }
        
        // After first action, can't double or split anymore
        const newCanDouble = false;
        const newCanSplit = false;
        
        if (!handComplete) {
          // Continue playing - update available actions
          const newAvailableActions = getAvailableActions(newPlayerCards, newCanDouble);
          
          return {
            ...prevState,
            playerCards: newPlayerCards,
            actionsThisHand: newActionsThisHand,
            canDouble: newCanDouble,
            canSplit: newCanSplit,
            availableActions: newAvailableActions,
          };
        }
      } else {
        // STAND, DOUBLE, or SPLIT ends the hand
        handComplete = true;
        
        if (chosenAction === Action.DOUBLE) {
          // Double adds one card
          const newCard = dealRandomCard();
          newPlayerCards = [...prevState.playerCards, newCard];
        }
        // Note: SPLIT is not fully implemented in this version, treated as hand-ending
      }

      // Hand is complete - evaluate and give feedback
      if (handComplete) {
        // Get optimal action for the FIRST decision point
        const optimalActions = getOptimalActions(
          prevState.playerCards,
          prevState.dealerCard,
          prevState.canDouble,
          prevState.canSplit
        );

        // For now, evaluate only the first action
        const firstAction = newActionsThisHand[0];
        const feedback = createFeedback(firstAction, optimalActions);

        // Record hand result
        const handResult: HandResult = {
          handNumber: prevState.currentHand,
          playerCards: newPlayerCards,
          dealerCard: prevState.dealerCard,
          chosen: firstAction,
          optimal: optimalActions[0].action,
          pointsEarned: feedback.pointsEarned,
        };

        // Update score and history
        const newScore = prevState.score + feedback.pointsEarned;
        const newHistory = [...prevState.history, handResult];

        return {
          ...prevState,
          playerCards: newPlayerCards,
          score: newScore,
          feedback,
          history: newHistory,
          handInProgress: false,
          actionsThisHand: newActionsThisHand,
        };
      }

      return prevState;
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
          handInProgress: false,
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
        handInProgress: true,
        actionsThisHand: [],
        canDouble: true,
        canSplit: true,
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
