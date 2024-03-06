import React from 'react';

import { EnterIcon, LeaveIcon, PhoneIcon, UsersIcon } from './icons';
import { LifeLine } from '../layout/data';

type LifeLinesType = {
  gameStart: boolean;
  questionOptionsDisabled: boolean;
  lifelines: number[];
  handleLifeLineAction: (lifelineId: LifeLine) => void;
  showSidebarToggler?: boolean;
  visible?: boolean;
  toggleSidebar?: () => void;
  togglerRef?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: any;
  };
};

function LifeLines({
  gameStart,
  handleLifeLineAction,
  lifelines: activeLifeLines,
  questionOptionsDisabled,
  showSidebarToggler,
  togglerRef,
  toggleSidebar,
  visible, // if sidebar is visible
}: LifeLinesType) {
  const lifelines = React.useMemo(() => {
    const allDisabled = !gameStart || questionOptionsDisabled;
    return [
      {
        id: LifeLine.Fifty,
        disabled: allDisabled,
        children: <span className="small">50:50</span>,
        active: activeLifeLines.find((lifeline) => lifeline === LifeLine.Fifty),
        performAction: allDisabled ? undefined : () => handleLifeLineAction(LifeLine.Fifty),
      },
      {
        id: LifeLine.Phone,
        disabled: allDisabled,
        children: (
          <span className="lifeline-icon">
            <PhoneIcon />
          </span>
        ),
        active: activeLifeLines.find((lifeline) => lifeline === LifeLine.Phone),
        performAction: allDisabled ? undefined : () => handleLifeLineAction(LifeLine.Phone),
      },
      {
        id: LifeLine.Audience,
        disabled: allDisabled,
        children: (
          <span className="lifeline-icon">
            <UsersIcon />
          </span>
        ),
        active: activeLifeLines.find((lifeline) => lifeline === LifeLine.Audience),
        performAction: allDisabled ? undefined : () => handleLifeLineAction(LifeLine.Audience),
      },
    ];
  }, [activeLifeLines, gameStart, questionOptionsDisabled, handleLifeLineAction]);

  return (
    <ul className="lifelines">
      {lifelines.map((lifeline, index) => {
        return (
          <li
            key={index}
            onClick={() => {
              if (lifeline.active && !lifeline.disabled && lifeline.performAction) {
                lifeline.performAction();
              }
            }}
            className={`lifeline ${
              !lifeline.active ? 'used' : lifeline.disabled ? 'disabled' : 'active'
            }`}
          >
            {lifeline.children}
          </li>
        );
      })}
      {showSidebarToggler && (
        <li
          onClick={() => {
            if (toggleSidebar) toggleSidebar();
          }}
          ref={togglerRef?.ref || null}
          className="lifeline active"
        >
          <span className="lifeline-icon">{visible ? <LeaveIcon /> : <EnterIcon />}</span>
        </li>
      )}
    </ul>
  );
}

export default LifeLines;
