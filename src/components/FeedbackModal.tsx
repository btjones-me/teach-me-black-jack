/**
 * FeedbackModal - Show Jack's feedback after each hand
 */

import { FeedbackResult } from '../game/types';
import { JackDialogue } from './Jack';

interface FeedbackModalProps {
  feedback: FeedbackResult;
  onContinue: () => void;
}

export const FeedbackModal = ({ feedback, onContinue }: FeedbackModalProps) => {
  // Determine Jack's mood based on points earned
  const getMood = () => {
    if (feedback.pointsEarned === 3) return 'happy';
    if (feedback.pointsEarned === 1) return 'encouraging';
    return 'thinking';
  };

  const getPointsColor = () => {
    if (feedback.pointsEarned === 3) return 'perfect';
    if (feedback.pointsEarned === 1) return 'good';
    return 'wrong';
  };

  return (
    <div className="feedback-modal" role="dialog" aria-modal="true">
      <div className="feedback-modal__overlay" onClick={onContinue} />
      <div className="feedback-modal__content">
        <div className="feedback-modal__header">
          <div className={`feedback-modal__points feedback-modal__points--${getPointsColor()}`}>
            <span className="feedback-modal__points-value">
              +{feedback.pointsEarned}
            </span>
            <span className="feedback-modal__points-label">
              {feedback.pointsEarned === 3 ? 'Perfect!' : 
               feedback.pointsEarned === 1 ? 'Not bad!' : 
               'Oops!'}
            </span>
          </div>
        </div>

        <JackDialogue
          message={feedback.jackMessage}
          mood={getMood()}
          onClose={onContinue}
        />

        <div className="feedback-modal__strategy">
          <h3 className="feedback-modal__strategy-title">Strategy</h3>
          <ol className="feedback-modal__strategy-list">
            {feedback.optimal.map((action, index) => (
              <li
                key={action.action}
                className={`feedback-modal__strategy-item ${
                  action.action === feedback.chosen
                    ? 'feedback-modal__strategy-item--chosen'
                    : ''
                }`}
              >
                <span className="feedback-modal__strategy-rank">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </span>
                <span className="feedback-modal__strategy-action">
                  {action.action}
                </span>
                {action.action === feedback.chosen && (
                  <span className="feedback-modal__strategy-badge">Your choice</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};
