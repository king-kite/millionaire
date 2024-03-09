import { Navigate } from 'react-router-dom';

import { Button } from '../components/controls';
import { GAME_PAGE } from '../config/routes';
import { useLayoutOutletContext } from '../layout/context';

function Home() {
  const { acceptedConditions, toggleSidebar, setAcceptedConditions } = useLayoutOutletContext();

  // Only start a game if the player accepts the terms
  if (acceptedConditions) return <Navigate to={GAME_PAGE} />;

  return (
    <div className="p-3 md:p-4">
      <h3 className="mb-2 terms-title">Terms and Agreements</h3>
      <p className="terms-description">
        This is a "Demo-Only" presentation brought to you by KITE.{' '}
        <big>
          <b>NO</b>
        </big>{' '}
        real money can/will be made or earned by playing this game. KITE nor ABC Network is
        responsible for any misunderstandings of the aformentioned or following terms. KITE is in no
        way affliated with the ABC Network. <br />
        This game is intended to showcase the skills of KITE only. Any violation of these terms may
        result in a penalty of Federal Copyright Infringement. To continue playing this game, you
        must agree to the terms.
      </p>
      <h3 className="my-2 terms-title">Do you agree to these terms?</h3>
      <div className="flex gap-8 items-center justify-between max-w-xs mx-auto">
        <div className="max-w-[8rem] w-full">
          <Button
            onClick={() => {
              toggleSidebar('open');
              setAcceptedConditions(true);
            }}
          >
            Yes
          </Button>
        </div>
        <div className="max-w-[8rem] w-full">
          <Button
            onClick={() => {
              window.location.href = 'https://www.github.com/king-kite/';
            }}
          >
            No
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
