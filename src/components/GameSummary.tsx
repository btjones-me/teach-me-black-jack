/**
 * GameSummary - End-of-session results
 */

import type { HandResult } from '../game/types';
import { Jack } from './Jack';

interface GameSummaryProps {
  score: number;
  maxScore: number;
  history: HandResult[];
  onRestart: () => void;
}

export const GameSummary = ({ score, maxScore, history, onRestart }: GameSummaryProps) => {
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const perfectHands = history.filter((h) => h.pointsEarned === 3).length;
  const goodHands = history.filter((h) => h.pointsEarned === 1).length;
  const wrongHands = history.filter((h) => h.pointsEarned === 0).length;

  // Determine performance level
  const getPerformanceLevel = () => {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 75) return 'great';
    if (percentage >= 60) return 'good';
    if (percentage >= 40) return 'fair';
    return 'needswork';
  };

  const getJackMessage = () => {
    const level = getPerformanceLevel();
    switch (level) {
      case 'excellent':
        return "Outstanding! You've mastered basic strategy. You're ready for the real tables!";
      case 'great':
        return "Fantastic work! You're following basic strategy very well. Keep it up!";
      case 'good':
        return "Nice job! You're getting the hang of basic strategy. A bit more practice and you'll be sharp.";
      case 'fair':
        return "Not bad! You're learning. Review the tough hands and try again.";
      default:
        return "Keep practicing! Basic strategy takes time to memorize. Focus on the fundamentals.";
    }
  };

  const getJackMood = () => {
    const level = getPerformanceLevel();
    return level === 'excellent' || level === 'great' ? 'happy' : 'encouraging';
  };

  return (
    <div className="game-summary">
      <div className="game-summary__header">
        <h1 className="game-summary__title">Session Complete!</h1>
      </div>

      <div className="game-summary__score">
        <div className="game-summary__score-main">
          <span className="game-summary__score-value">{score}</span>
          <span className="game-summary__score-max">/ {maxScore}</span>
        </div>
        <div className="game-summary__score-percentage">
          {percentage}%
        </div>
      </div>

      <div className="game-summary__stats">
        <div className="game-summary__stat game-summary__stat--perfect">
          <span className="game-summary__stat-icon">🥇</span>
          <span className="game-summary__stat-value">{perfectHands}</span>
          <span className="game-summary__stat-label">Perfect</span>
        </div>
        <div className="game-summary__stat game-summary__stat--good">
          <span className="game-summary__stat-icon">🥈</span>
          <span className="game-summary__stat-value">{goodHands}</span>
          <span className="game-summary__stat-label">Good</span>
        </div>
        <div className="game-summary__stat game-summary__stat--wrong">
          <span className="game-summary__stat-icon">❌</span>
          <span className="game-summary__stat-value">{wrongHands}</span>
          <span className="game-summary__stat-label">Wrong</span>
        </div>
      </div>

      <div className="game-summary__jack">
        <Jack size={120} mood={getJackMood()} />
        <p className="game-summary__jack-message">{getJackMessage()}</p>
      </div>

      <div className="game-summary__actions">
        <button className="game-summary__button" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
};
