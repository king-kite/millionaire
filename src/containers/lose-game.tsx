import { Navigate } from 'react-router-dom';

import { GAME_PAGE } from '../config/routes';
import { useLayoutOutletContext } from '../layout/context';

function LostGame() {
  const { currentScore, gameLost } = useLayoutOutletContext();

  if (!gameLost) return <Navigate to={GAME_PAGE} />;

  return (
    <div className="p-4">
      <h3 className="question-title">
        Sorry, that was not the correct answer. <br />
        You are leaving with $ {currentScore?.amount || 0}.
      </h3>
    </div>
  );
}

export default LostGame;
