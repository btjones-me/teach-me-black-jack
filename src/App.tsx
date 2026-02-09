/**
 * Main App Component - Teach me Black, Jack
 */

import { useGame } from './hooks/useGame';
import { Hand } from './components/Hand';
import { ActionButtons } from './components/ActionButtons';
import { ScoreDisplay } from './components/ScoreDisplay';
import { FeedbackModal } from './components/FeedbackModal';
import { GameSummary } from './components/GameSummary';
import './styles/App.css';

function App() {
  const { gameState, handleAction, nextHand, restartGame } = useGame(20);

  // Show summary screen when game is over
  if (gameState.gameOver) {
    const maxScore = gameState.totalHands * 3;
    return (
      <div className="app app--summary">
        <GameSummary
          score={gameState.score}
          maxScore={maxScore}
          history={gameState.history}
          onRestart={restartGame}
        />
      </div>
    );
  }

  const handleActionClick = (action: string) => {
    handleAction(action as any);
  };

  const handleContinue = () => {
    nextHand();
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Teach me Black, Jack</h1>
        <ScoreDisplay
          score={gameState.score}
          currentHand={gameState.currentHand}
          totalHands={gameState.totalHands}
        />
      </header>

      <main className="app__main">
        {gameState.dealerCard && (
          <Hand
            cards={[gameState.dealerCard]}
            label="Dealer"
            showTotal={false}
            className="app__dealer-hand"
          />
        )}

        <Hand
          cards={gameState.playerCards}
          label="Your Hand"
          showTotal={true}
          className="app__player-hand"
        />

        <ActionButtons
          availableActions={gameState.availableActions}
          onAction={handleActionClick}
          disabled={!!gameState.feedback}
        />
      </main>

      {gameState.feedback && (
        <FeedbackModal feedback={gameState.feedback} onContinue={handleContinue} />
      )}
    </div>
  );
}

export default App;
