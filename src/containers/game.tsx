import { Navigate } from 'react-router-dom';

import { Button } from '../components/controls';
import { HOME_PAGE } from '../config/routes';
import { useLayoutOutletContext } from '../layout/context';

function Game() {
  const {
    acceptedConditions,
    activeQuestion,
    gameStart,
    loadingQuestions: loading,
  } = useLayoutOutletContext();

  // Only start a game if the player accepts the terms
  if (!acceptedConditions) return <Navigate to={HOME_PAGE} />;

  return (
    <div className="h-full p-4 w-full">
      {loading || !gameStart ? (
        <div className="flex h-full items-center justify-center w-full">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between">
          <h3 className="font-semibold text-sm text-gray-100 md:text-base">
            {activeQuestion?.title}
          </h3>

          <div className="flex justify-between items-center w-full">
            <div className="max-w-[8rem]">
              <Button>Start Again</Button>
            </div>
            <div className="max-w-[4rem]">
              <Button>Quit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
