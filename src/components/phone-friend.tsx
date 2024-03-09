import React from 'react';

import TypingEffect from './typing-effect';
import { Button, Modal } from './controls';
import { useInterval } from '../hooks';
import { useLayoutOutletContext } from '../layout/context';

const TIME_LIMIT = 30;

function PhoneFriend({ title, probability }: { title: string; probability: string }) {
  const [timeLimit, setTimeLimit] = React.useState(TIME_LIMIT);
  const [textPoint, setTextPoint] = React.useState(1);
  const { endPhoneCall } = useLayoutOutletContext();

  const { removeInterval } = useInterval(() => {
    const nextLimit = timeLimit - 1;
    setTimeLimit(nextLimit);
    if (nextLimit <= 0) endCall();
  }, 1000);

  const { removeInterval: removeTextPointInterval } = useInterval(() => {
    setTextPoint((prevPoint) => prevPoint + 1);
  }, 5000);

  const endCall = React.useCallback(() => {
    endPhoneCall();
    removeInterval();
  }, [endPhoneCall, removeInterval]);

  React.useEffect(() => {
    if (textPoint > 3) removeTextPointInterval();
  }, [removeTextPointInterval, textPoint]);

  return (
    <div>
      <Modal>
        <div className="phone-friend-container">{timeLimit}</div>
        <h1 className="description-text">
          <TypingEffect start={textPoint === 1} sentence={`Friend: ${title}`} />
        </h1>
        <br />
        <h1 className="description-text">
          <TypingEffect start={textPoint === 2} sentence="Me: How sure are you?" />
        </h1>
        <br />
        <h1 className="description-text">
          <TypingEffect start={textPoint === 3} sentence={`Friend: ${probability}`} />
        </h1>
        <div className="max-w-[8rem] mx-auto mt-4">
          <Button onClick={endCall}>
            <small>Hang Up</small>
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default PhoneFriend;
