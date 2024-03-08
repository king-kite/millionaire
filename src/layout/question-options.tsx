import React from 'react';

import type { QuestionOptionsType } from '../types';

function QuestionOptions({ answer, disabled, setAnswer, options }: QuestionOptionsType) {
  // Options Disabled
  // Return false if disabled else true
  const optionsDisabled = React.useMemo(() => {
    return disabled || answer;
  }, [answer, disabled]);

  return (
    <div className="options-wrapper">
      <ul className="options-container">
        {options.map((option) => {
          const optionDisabled = !option.title || option.title.trim() === '';

          const isDisabled = optionDisabled || optionsDisabled;

          return (
            <li
              onClick={() => {
                if (!isDisabled) {
                  setAnswer(option.id);
                }
              }}
              className={`question-option ${
                optionDisabled || optionsDisabled ? '!cursor-not-allowed' : ''
              } ${
                option.right
                  ? 'right-answer'
                  : option.wrong
                  ? 'wrong-answer'
                  : isDisabled && answer !== option.id // to prevent the bg on select answer to go transparent
                  ? '!cursor-not-allowed hover:!bg-transparent'
                  : 'no-answer'
              } ${answer === option.id ? 'selected-answer' : ''}`}
              key={option.id}
            >
              {option.title ? (
                <>
                  <p>
                    <span>{option.id}:</span> {option.title}
                  </p>
                </>
              ) : (
                <></>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default QuestionOptions;
