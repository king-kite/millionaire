import React from 'react';

import { useInterval } from '../hooks';

const TypingEffect = ({ sentence, start }: { sentence: string; start?: boolean }) => {
  const [text, setText] = React.useState('');
  const [index, setIndex] = React.useState(0);
  const words = React.useMemo(() => sentence.split(''), [sentence]);

  const { toggleInterval, removeInterval } = useInterval(
    () => {
      setText((prevText) => prevText + words[index]);
      setIndex((prevIndex) => prevIndex + 1);
    },
    75,
    {
      status: 'pause',
    }
  );

  React.useEffect(() => {
    if (start) toggleInterval('play');
    else toggleInterval('pause');
  }, [start, toggleInterval]);

  React.useEffect(() => {
    if (index === words.length) removeInterval();
  }, [words, removeInterval, index]);

  return <>{text}&nbsp;</>;
};

export default TypingEffect;
