import React from 'react';
import { Navigate } from 'react-router-dom';

import { GameOverButton, Modal } from '../components/controls';
import { GAME_PAGE, QUIT_URL } from '../config/routes';
import { useLayoutOutletContext } from '../layout/context';

function GameOver() {
  const [canQuit, setCanQuit] = React.useState(false);
  const { currentScore, gameOver, startOver } = useLayoutOutletContext();

  if (!gameOver) return <Navigate to={GAME_PAGE} />;

  return (
    <div className="h-full relative py-6 pb-16 w-full">
      <h3 className="question-title p-4 text-center">
        You walked away with $ {currentScore?.amount || 0}.
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

export default GameOver;
