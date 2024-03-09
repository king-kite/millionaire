import React from 'react';

import { useInterval } from '../hooks';

const NEXT_QUESTION_DELAY = 10 * 1000;

const classes = 'win-screen-text';

function WinScreen({
  scoreTitle,
  onFinish,
  guaranteed,
}: {
  scoreTitle: string;
  onFinish: () => void;
  guaranteed: boolean;
}) {
  const [count, setCount] = React.useState(1);
  const [screenId, setScreenId] = React.useState(1);

  const { removeInterval } = useInterval(() => {
    setScreenId((prevId) => {
      const nextId = prevId + 1;
      // Show 2nd screen which will be guaranteed screen for more time.
      // 3rd screen wont show for guaranteed scores
      if (nextId === 3 && guaranteed) return 2;
      return nextId;
    });
    setCount((prevCount) => prevCount + 1);
  }, NEXT_QUESTION_DELAY / 3);

  React.useEffect(() => {
    if (count > 3) {
      removeInterval();
      onFinish();
    }
  }, [count, removeInterval, onFinish]);

  return (
    <div
      className="h-full w-full"
      style={{
        backgroundImage: 'url(/static/images/logo.png)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        className="win-screen-container"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        {screenId === 1 ? (
          <h1 className={classes}>You're Right</h1>
        ) : screenId === 2 ? (
          <>
            {guaranteed ? (
              <h1 className={classes}>
                You are <br />
                guaranteed <br />$ {scoreTitle}
              </h1>
            ) : (
              <h1 className={classes}>
                You just won <br />$ {scoreTitle}
              </h1>
            )}
          </>
        ) : (
          <h1 className={classes}>
            Get ready for <br />
            the next round!
          </h1>
        )}
      </div>
    </div>
  );
}

export default WinScreen;
