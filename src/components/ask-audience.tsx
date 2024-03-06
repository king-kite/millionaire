import { Button, Modal } from './controls';
import { useLayoutOutletContext } from '../layout/context';

function AudienceGrid({ isRight }: { isRight?: boolean }) {
  return (
    <div className={`audience-percentage-grid-wrapper ${isRight ? '!border-r' : ''}`}>
      {Array.from({ length: 10 }).map((_, j) => {
        return <div className="audience-grid-box" key={j}></div>;
      })}
    </div>
  );
}

function AskAudience() {
  const { askAudience: audience, closeAudience } = useLayoutOutletContext();

  return (
    <div>
      <Modal>
        <div className="audience-container">
          {audience?.map((item, index) => {
            return (
              <div key={index} className="audience-option-container">
                <div className="px-1 py-2">{item.percentage}%</div>
                <div className="audience-percentage-grid">
                  <AudienceGrid isRight />
                  <AudienceGrid />
                  <div className="audience-percentage" style={{ height: `${item.percentage}%` }} />
                </div>
                <div className="p-1">{item.id}</div>
              </div>
            );
          })}
        </div>
        <Button onClick={closeAudience}>
          <small>Done</small>
        </Button>
      </Modal>
    </div>
  );
}

export default AskAudience;
