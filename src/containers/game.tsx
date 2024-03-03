import React from 'react';
import { useNavigate } from 'react-router-dom';

import { HOME_PAGE } from '../config/routes';
import { useLayoutOutletContext } from '../layout/context';

function Game() {
  const navigate = useNavigate();

  const {
    acceptedConditions,
    activeQuestion,
    gameStart,
    loadingQuestions: loading,
  } = useLayoutOutletContext();

  React.useEffect(() => {
    if (!acceptedConditions) {
      navigate(HOME_PAGE);
    }
  }, [navigate, acceptedConditions]);

  return (
    <div className="p-4">
      {loading || !gameStart ? <div>loading</div> : <div>{activeQuestion?.title}</div>}
    </div>
  );
}

export default Game;
