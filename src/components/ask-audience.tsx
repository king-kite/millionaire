import { Button, Modal } from './controls';
import { useLayoutOutletContext } from '../layout/context';

function AskAudience() {
  const { askAudience: audience, closeAudience } = useLayoutOutletContext();

  return (
    <div>
      <Modal>
        <div className="bg-primary-700 border border-gray-100 border-solid grid grid-cols-4 h-full font-bold rounded text-center text-gray-100 text-xs w-full md:text-sm">
          {audience?.map((item, index) => {
            return (
              <div
                key={index}
                className="border-r border-0 border-gray-100 border-solid last:border-r-0"
              >
                <div className="px-1 py-2">{item.percentage}%</div>
                <div className="border-y border-x-0 border-gray-100 border-solid grid grid-cols-2 h-[9rem] relative w-full">
                  <div className="border-0 border-r border-gray-100 border-solid h-full w-full">
                    {Array.from({ length: 10 }).map((_, j) => {
                      return (
                        <div
                          className="border-0 border-b border-gray-100 border-solid last:border-b-0 w-full"
                          style={{ height: 'calc(144px / 10)' }}
                          key={j}
                        ></div>
                      );
                    })}
                  </div>
                  <div className="border-0 border-gray-100 border-solid h-full w-full">
                    {Array.from({ length: 10 }).map((_, j) => {
                      return (
                        <div
                          className="border-0 border-b border-gray-100 border-solid last:border-b-0 w-full"
                          style={{ height: 'calc(144px / 10)' }}
                          key={j}
                        ></div>
                      );
                    })}
                  </div>
                  <div
                    className="absolute bottom-0 left-1/4 bg-gradient-to-r from-primary-500 via-primary-300 to-primary-600 w-1/2"
                    style={{ height: `${item.percentage}%` }}
                  />
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
