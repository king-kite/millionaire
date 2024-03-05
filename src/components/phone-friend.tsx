import React from 'react';

import { Button, Modal } from './controls';
import { useInterval } from '../hooks';
import { useLayoutOutletContext } from '../layout/context';

const TIME_LIMIT = 30;

function PhoneFriend({ title, probability }: { title: string; probability: string }) {
  const [timeLimit, setTimeLimit] = React.useState(TIME_LIMIT);
  const { endPhoneCall } = useLayoutOutletContext();

  const { removeInterval } = useInterval(() => {
    const nextLimit = timeLimit - 1;
    setTimeLimit(nextLimit);
    if (nextLimit <= 0) endCall();
  }, 1000);

  const endCall = React.useCallback(() => {
    endPhoneCall();
    removeInterval();
  }, [endPhoneCall, removeInterval]);

  return (
    <div>
      <Modal>
        <div className="bg-primary-600 border-2 border-gray-100 border-solid flex font-extrabold items-center justify-center h-16 mb-4 mx-auto rounded-full text-xl text-gray-100 w-16">
          {timeLimit}
        </div>
        <h1 className="description-text">Friend: {title}</h1>
        <br />
        <h1 className="description-text">Me: How sure are you?</h1>
        <br />
        <h1 className="description-text">Friend: {probability}</h1>
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
