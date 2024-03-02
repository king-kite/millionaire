import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { PhoneIcon, UsersIcon } from '../components/icons';
import { GAME_PAGE } from '../config/routes';
import { useInterval } from '../hooks';

import type { LayoutOutletContextType } from './context';

const scores = [
  {
    id: 1,
    title: <>$100</>,
    amount: '100',
  },
  {
    id: 2,
    title: <>$200</>,
    amount: '200',
  },
  {
    id: 3,
    title: <>$300</>,
    amount: '300',
  },
  {
    id: 4,
    title: <>$500</>,
    amount: '500',
  },
  {
    id: 5,
    title: <>$1,000</>,
    price: '1,000',
  },
  {
    id: 6,
    title: <>$2,000</>,
    price: '2,000',
  },
  {
    id: 7,
    title: <>$4,000</>,
    price: '4,000',
  },
  {
    id: 8,
    title: <>$8,000</>,
    price: '8,000',
  },
  {
    id: 9,
    title: <>$16,000</>,
    price: '16,000',
  },
  {
    id: 10,
    title: <>$32,000</>,
    price: '32,000',
  },
  {
    id: 11,
    title: <>$64,000</>,
    price: '64,000',
  },
  {
    id: 12,
    title: <>$125,000</>,
    price: '125,000',
  },
  {
    id: 13,
    title: <>$250,000</>,
    price: '250,000',
  },
  {
    id: 14,
    title: <>$500,000</>,
    price: '500,000',
  },
  {
    id: 15,
    title: <>$1 MILLION</>,
    price: '1 MILLION',
  },
];

scores.reverse();

const scoresLength = scores.length;
const blinkCount = 12; // number of times to blink at the top
const startAnimationCounter = 100;

function Layout() {
  const [acceptedConditions, setAcceptedConditions] = React.useState(false);
  const [gameStart, setGameStart] = React.useState(false);
  const [questionOptions] = React.useState([
    {
      id: 'A',
      title: '',
    },
    {
      id: 'B',
      title: '',
    },
    {
      id: 'C',
      title: '',
    },
    {
      id: 'D',
      title: '',
    },
  ]);
  const [scoreId, setScoreId] = React.useState(1);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);
  const [scoreAnimate, setScoreAnimate] = React.useState(0); // track animation play/pause. Will stop if -2. go backworks if -1

  const navigate = useNavigate();

  const { activeScore, currentScore } = React.useMemo(() => {
    const activeScore = scores.find((score) => score.id === scoreId); // score for current question
    const currentScore = activeScore
      ? scores.find((score) => score.id === activeScore.id - 1)
      : null; // score for previous question won
    return { activeScore, currentScore };
  }, [scoreId]);

  // create a react router outlet context.
  // Didnt want to use react context. (just for fun)
  const outletContext: LayoutOutletContextType = React.useMemo(() => {
    return {
      acceptedConditions,
      setAcceptedConditions,
    };
  }, [acceptedConditions]);

  // Handle Game Start animation
  // where each score blinks at a specific interval
  const { status, toggleInterval, removeInterval } = useInterval(
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
      removeInterval();
      // start game once start animation is complete
      if (acceptedConditions) setGameStart(true);
    }

    // If game hasnt started, start
    if (status === 'pause' && acceptedConditions) {
      toggleInterval('play');
    }
  }, [acceptedConditions, removeInterval, scoreAnimate, status, toggleInterval]);

  // Only start a game if the player accepts the terms
  React.useEffect(() => {
    if (acceptedConditions) {
      navigate(GAME_PAGE);
    }
  }, [navigate, acceptedConditions]);

  return (
    <div className="layout-wrapper">
      <div className="w-full">
        <div className="layout-container">
          <div className="title-container">
            <span className="title-text">who</span>
            <span className="title-text">wants</span>
            <span className="title-text">to</span>
            <span className="title-text">be</span>
            <span className="title-text">a</span>
            <span className="title-text">
              <span className="title-text-big-first">m</span>illionaire
            </span>
          </div>
          <div className="main-container">
            <div className="app-outlet">
              <div className="app-screens">
                <Outlet context={outletContext} />
              </div>
              <ul className="options-container">
                {questionOptions.map((option) => {
                  return (
                    <li
                      onClick={() => {
                        if (option.title) {
                          setSelectedAnswer(option.id);
                        }
                      }}
                      className={`question-option ${
                        selectedAnswer === option.id
                          ? 'selected-answer'
                          : option.title
                          ? 'no-answer'
                          : ''
                      }`}
                      key={option.id}
                    >
                      {option.title ? (
                        <>
                          <p>
                            <span>{option.id}:</span> {option.title}
                          </p>
                        </>
                      ) : (
                        <></>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="side-container">
              <ul className="lifelines">
                <li className="lifeline">
                  <span className="small">50:50</span>
                </li>
                <li className="lifeline">
                  <span className="lifeline-icon">
                    <PhoneIcon />
                  </span>
                </li>
                <li className="lifeline">
                  <span className="lifeline-icon">
                    <UsersIcon />
                  </span>
                </li>
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
          </div>
        </div>
      </div>
      <div className="footer-container">
        <h1 className="footer-title">KITE WEB & Internet Development</h1>
        <div className="horizontal-line" />
        <p className="footer-description">
          <span>G</span>iving <span>y</span>ou <span>t</span>he <span>b</span>est <span>i</span>n{' '}
          <span>d</span>igital <span>s</span>ervices.
        </p>
      </div>
    </div>
  );
}

export default Layout;
