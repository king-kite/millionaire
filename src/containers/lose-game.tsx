import { Navigate } from 'react-router-dom';

import { GAME_PAGE } from '../config/routes';
import { useLayoutOutletContext } from '../layout/context';

function LostGame() {
  const { gameLost } = useLayoutOutletContext();

  if (!gameLost) return <Navigate to={GAME_PAGE} />;

  return <div>Game Lost</div>;
}

export default LostGame;
