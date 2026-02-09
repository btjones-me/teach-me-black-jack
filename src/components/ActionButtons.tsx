/**
 * ActionButtons - Player action buttons (Hit, Stand, Double, Split)
 */

import { Action } from '../game/types';

interface ActionButtonsProps {
  availableActions: Action[];
  onAction: (action: Action) => void;
  disabled?: boolean;
}

const ACTION_LABELS: Record<Action, string> = {
  [Action.HIT]: 'Hit',
  [Action.STAND]: 'Stand',
  [Action.DOUBLE]: 'Double Down',
  [Action.SPLIT]: 'Split',
};

const ACTION_ICONS: Record<Action, string> = {
  [Action.HIT]: '👆',
  [Action.STAND]: '✋',
  [Action.DOUBLE]: '×2',
  [Action.SPLIT]: '✂️',
};

export const ActionButtons = ({ 
  availableActions, 
  onAction, 
  disabled = false 
}: ActionButtonsProps) => {
  return (
    <div className="action-buttons">
      {availableActions.map((action) => (
        <button
          key={action}
          className={`action-button action-button--${action.toLowerCase()}`}
          onClick={() => onAction(action)}
          disabled={disabled}
          aria-label={ACTION_LABELS[action]}
        >
          <span className="action-button__icon" aria-hidden="true">
            {ACTION_ICONS[action]}
          </span>
          <span className="action-button__label">{ACTION_LABELS[action]}</span>
        </button>
      ))}
    </div>
  );
};
