import React from 'react';

import Button from './button';

function Modal({
  children,
  title,
  onCancel,
  onConfirm,
}: {
  children?: React.ReactNode;
  title?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className="modal-wrapper" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
      <div className="modal-container">
        {children ? (
          children
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

export default Modal;
