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
import LoseGamePage from './pages/lose-game';
import HomePage from './pages/index';

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
    </Route>
  )
);

function Routes() {
  return <RouterProvider router={router} />;
}

export default Routes;
