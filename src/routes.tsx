import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  ScrollRestoration,
} from 'react-router-dom';

import * as routes from './config/routes';

import Layout from './layout';

import GamePage from './pages/game';
import HomePage from './pages/index';
import LoseGamePage from './pages/lose-game';
import GameOverPage from './pages/over';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <>
          <Layout />
          <ScrollRestoration />
        </>
      }
    >
      <Route path={routes.HOME_PAGE} element={<HomePage />} />
      <Route path={routes.GAME_PAGE} element={<GamePage />} />
      <Route path={routes.LOSE_GAME_PAGE} element={<LoseGamePage />} />
      <Route path={routes.GAME_OVER_PAGE} element={<GameOverPage />} />
    </Route>
  )
);

function Routes() {
  return <RouterProvider router={router} />;
}

export default Routes;
