import { Button, Modal } from './controls';
import { useLayoutOutletContext } from '../layout/context';

function AskAudience() {
  const { askAudience: audience, closeAudience } = useLayoutOutletContext();

  console.log(audience);

  return (
    <div>
      <Modal>
        AUDIENCE
        <div className="max-w-[8rem] mx-auto mt-4">
          <Button onClick={closeAudience}>
            <small>Hang Up</small>
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default AskAudience;
