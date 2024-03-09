import React from 'react';

import { NODE_ENV } from './config';

const GameRoutes = React.lazy(() => import('./routes'));

function App() {
  const [canRun, setCanRun] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (NODE_ENV === 'dev') setCanRun(true);
    const location = window.location.href;
    if (location.toLowerCase().includes('kite')) {
      setCanRun(true);
    }
    setLoading(false);
  }, []);

  if (!canRun && !loading)
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <h1 className="text-gray-100 text-center text-base sm:text-lg">
          Sorry, Cannot view website. Contact the developer for more information.
        </h1>
      </div>
    );
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen w-full">
          <h1 className="animate-pulse duration-300 text-gray-100 text-center text-base sm:text-lg">
            Loading Game...
          </h1>
        </div>
      }
    >
      <GameRoutes />
    </React.Suspense>
  );
}

export default App;
