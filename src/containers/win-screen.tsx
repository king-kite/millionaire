import React from 'react';

const NEXT_QUESTION_DELAY = 10000;

function WinScreen({ onFinish }: { onFinish: () => void }) {
  React.useEffect(() => {
    setTimeout(() => {
      onFinish();
    }, NEXT_QUESTION_DELAY);
  }, [onFinish]);

  return <>Winning</>;
}

export default WinScreen;
