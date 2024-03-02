import React from 'react';
import { useNavigate } from 'react-router-dom';

import { HOME_PAGE } from '../config/routes';
import { useLayoutOutletContext } from '../layout/context';

function Game() {
  const { acceptedConditions } = useLayoutOutletContext();

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!acceptedConditions) {
      navigate(HOME_PAGE);
    }
  }, [navigate, acceptedConditions]);

  return <div className="p-4"></div>;
}

export default Game;
