import React from 'react';

import { scores, type ScoreType } from './data';
import { PhoneIcon, UsersIcon } from '../components/icons';
import { useInterval } from '../hooks';

import type { GetSetStateType } from '../types';

const scoresLength = scores.length;
const blinkCount = 8; // number of times to blink at the top
const startAnimationCounter = 100;

type SidebarProps = {
  acceptedConditions: boolean;
  activeScore?: ScoreType | null;
  currentScore?: ScoreType | null;
  questionOptionsDisabled: boolean;
  scoreId: number;
  setScoreId: GetSetStateType<number>;
  gameStart: boolean;
  setGameStart: GetSetStateType<boolean>;
};

function Sidebar({
  acceptedConditions,
  activeScore,
  currentScore,
  gameStart,
  questionOptionsDisabled,
  scoreId,
  setScoreId,
  setGameStart,
}: SidebarProps) {
  const [scoreAnimate, setScoreAnimate] = React.useState(0); // track animation play/pause. Will stop if -2. go backworks if -1

  const [activeLifeLines, setActiveLifeLines] = React.useState([1, 2, 3]);

  const lifelines = React.useMemo(() => {
    const allDisabled = !gameStart || questionOptionsDisabled;
    return [
      {
        id: 1,
        disabled: allDisabled,
        children: <span className="small">50:50</span>,
        active: activeLifeLines.find((lifeline) => lifeline === 1),
        performAction: () => console.log('50/50'),
      },
      {
        id: 2,
        disabled: allDisabled,
        children: (
          <span className="lifeline-icon">
            <PhoneIcon />
          </span>
        ),
        active: activeLifeLines.find((lifeline) => lifeline === 2),
        performAction: () => console.log('Call A friend'),
      },
      {
        id: 3,
        disabled: allDisabled,
        children: (
          <span className="lifeline-icon">
            <UsersIcon />
          </span>
        ),
        active: activeLifeLines.find((lifeline) => lifeline === 3),
        performAction: () => console.log('Ask the audience'),
      },
    ];
  }, [activeLifeLines, gameStart, questionOptionsDisabled]);

  // Handle Game Start animation
  // where each score blinks at a specific interval
  const { status, toggleInterval } = useInterval(
    function () {
      if (scoreId >= scoresLength) {
        // If the blinker is at the top
        if (scoreAnimate < blinkCount * 2) {
          // hasnt blinked up to the blink count.
          setScoreAnimate((prevAnimate) => prevAnimate + 1); // increase the animate counter
          if (scoreId > scoresLength)
            setScoreId(scoresLength); // set back to the last score if greater
          else setScoreId(scoresLength + 1); // set the next greater score although that score doesnt exist. Just to make a blink effect.
        } else {
          // top animation has blinked six times
          setScoreAnimate(-1); // go backwards
          setScoreId(scoresLength - 1); // Set the scoreId to less than scores count to ignore the first 'if' condition
        }
      } else {
        // Going backwards
        if (scoreAnimate < 0) {
          if (scoreId > 1) {
            setScoreId(scoreId - 1);
          } else {
            // Has reached 1
            setScoreAnimate(-2); // Stop animation
          }
        } else {
          setScoreId((prevId) => prevId + 1); // go forwards if not going backwards
        }
      }
    },
    startAnimationCounter,
    {
      status: 'pause',
    }
  );

  React.useEffect(() => {
    // Stop animation if scoreAnimate < -1
    if (scoreAnimate < -1) {
      toggleInterval('pause');
      // start game once start animation is complete
      if (acceptedConditions) setGameStart(true);
    }

    // If game hasnt started, start
    if (status === 'pause' && acceptedConditions && !gameStart) {
      setScoreAnimate(0);
      setGameStart(false);
      toggleInterval('play');
    }
  }, [acceptedConditions, gameStart, scoreAnimate, setGameStart, status, toggleInterval]);

  return (
    <div className="side-container">
      <ul className="lifelines">
        {lifelines.map((lifeline, index) => {
          return (
            <li
              key={index}
              onClick={() => {
                if (lifeline.active && !lifeline.disabled) {
                  lifeline.performAction();
                  setActiveLifeLines((prevActions) =>
                    prevActions.filter((item) => item !== lifeline.id)
                  );
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
      </ul>
      <h3 className="font-extrabold my-2 px-4 py-1 text-base text-gray-100">Your Score</h3>
      <div className="score-container">
        <p className="score">
          $&nbsp;&nbsp;
          {gameStart ? currentScore?.amount || '0' : ''}
        </p>
      </div>
      <ul className="scores-list">
        {scores.map((score, index) => {
          const isBreakPoint = score.id % 5 === 0;

          return (
            <li
              className={`score-option ${
                score.id === activeScore?.id ? 'active' : isBreakPoint ? 'breakpoint' : ''
              }`}
              key={index}
            >
              <span>{score.id}</span>
              <span>{score.title}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
