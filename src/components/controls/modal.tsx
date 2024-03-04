import Button from './button';

function Modal({
  title,
  onCancel,
  onConfirm,
}: {
  title: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div
      className="absolute flex items-end justify-center left-0 h-full p-4 pb-[20%] top-0 w-full z-20"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
    >
      <div className="bg-gradient-to-tr border-2 border-solid border-primary-300 from-primary-500 p-4 max-w-[16rem] rounded-md shadow-primary-700 shadow-xl to-primary-400 w-full">
        <small>
          <h3 className="question-title text-center">{title}</h3>
        </small>
        <div className="flex justify-between items-center mt-8 w-full">
          <div className="max-w-[5rem] w-full">
            <Button onClick={onConfirm}>Yes</Button>
          </div>
          <div className="max-w-[5rem] w-full">
            <Button onClick={onCancel}>No</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
