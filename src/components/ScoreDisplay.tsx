/**
 * ScoreDisplay - Show current score and hand progress
 */

interface ScoreDisplayProps {
  score: number;
  currentHand: number;
  totalHands: number;
}

export const ScoreDisplay = ({ score, currentHand, totalHands }: ScoreDisplayProps) => {
  const maxScore = totalHands * 3; // 3 points per hand max
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <div className="score-display">
      <div className="score-display__main">
        <div className="score-display__score">
          <span className="score-display__label">Score</span>
          <span className="score-display__value">{score}</span>
          <span className="score-display__max">/ {maxScore}</span>
        </div>
        <div className="score-display__percentage">
          {percentage}%
        </div>
      </div>
      <div className="score-display__progress">
        <span className="score-display__hand">
          Hand {currentHand} of {totalHands}
        </span>
        <div className="score-display__bar">
          <div
            className="score-display__bar-fill"
            style={{ width: `${(currentHand / totalHands) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
