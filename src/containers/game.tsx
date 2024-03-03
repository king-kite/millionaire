import { Navigate } from 'react-router-dom';

import { Button } from '../components/controls';
import { HOME_PAGE, LOSE_GAME_PAGE } from '../config/routes';
import { useLayoutOutletContext } from '../layout/context';

function Game() {
  const {
    acceptedConditions,
    activeQuestion,
    checkAnswer,
    gameLost,
    gameStart,
    loadingQuestions: loading,
    selectedAnswer,
    setSelectedAnswer,
    startOver,
  } = useLayoutOutletContext();

  // Only start a game if the player accepts the terms
  if (!acceptedConditions) return <Navigate to={HOME_PAGE} />;

  if (gameLost) return <Navigate to={LOSE_GAME_PAGE} />;

  return (
    <div className="h-full p-4 relative w-full">
      {loading || !gameStart ? (
        <div className="flex h-full items-center justify-center w-full">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between">
          <h3 className="question-title">{activeQuestion?.title}</h3>

          <div className="flex justify-between items-center w-full">
            <div className="max-w-[8rem] w-full">
              <Button disabled={!!selectedAnswer} onClick={() => startOver()}>
                Start Again
              </Button>
            </div>
            <div className="max-w-[4rem] w-full">
              <Button
                disabled={!!selectedAnswer}
                onClick={() => {
                  window.location.href = 'https://www.github.com/king-kite/';
                }}
              >
                Quit
              </Button>
            </div>
          </div>

          {selectedAnswer && (
            <div className="absolute bg-gradient-to-tr border-2 border-solid border-primary-300 bottom-1/4 from-primary-500 left-1/4 p-4 max-w-[16rem] rounded-md shadow-primary-700 shadow-xl to-primary-400 w-full z-20">
              <small>
                <h3 className="question-title text-center">Is that your final answer?</h3>
              </small>
              <div className="flex justify-between items-center mt-8 w-full">
                <div className="max-w-[5rem] w-full">
                  <Button onClick={() => checkAnswer(selectedAnswer)}>Yes</Button>
                </div>
                <div className="max-w-[5rem] w-full">
                  <Button onClick={() => setSelectedAnswer(null)}>No</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Game;
