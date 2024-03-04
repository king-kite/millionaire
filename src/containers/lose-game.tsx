import React from 'react';
import { Navigate } from 'react-router-dom';

import { GameOverButton, Modal } from '../components/controls';
import { GAME_PAGE, QUIT_URL } from '../config/routes';
import { useLayoutOutletContext } from '../layout/context';
import { scores } from '../layout/data';

function LostGame() {
  const [canQuit, setCanQuit] = React.useState(false);
  const { currentScore, gameLost, startOver } = useLayoutOutletContext();

  const finalAmount = React.useMemo(() => {
    let amount = '0';

    if (currentScore) {
      // Get the last breakpoint
      for (let i = currentScore.id; i > 0 && amount === '0'; i--) {
        // Re-reverse the scores array
        const newScores = [...scores].reverse();
        const score = newScores[i - 1]; // score id starts from 1 so minus for index to get 0
        if (score.id % 5 === 0) amount = score.amount;
      }
    }

    return amount;
  }, [currentScore]);

  if (!gameLost) return <Navigate to={GAME_PAGE} />;

  return (
    <div className="h-full relative">
      <h3 className="question-title p-4">
        Sorry, that was not the correct answer. <br />
        You are leaving with $ {finalAmount}.
      </h3>

      <div className="mt-6">
        <GameOverButton onClick={() => startOver()}>
          <big>Play Again</big>
        </GameOverButton>
      </div>

      <div className="mt-8">
        <GameOverButton onClick={() => setCanQuit(true)}>
          <big>Exit Game</big>
        </GameOverButton>
      </div>

      {canQuit && (
        <Modal
          title="Are you sure?"
          onCancel={() => setCanQuit(false)}
          onConfirm={() => {
            window.location.href = QUIT_URL;
            setCanQuit(false);
          }}
        />
      )}
    </div>
  );
}

export default LostGame;
