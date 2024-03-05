import type { QuestionOptionsType } from '../types';

function QuestionOptions({ answer, disabled, setAnswer, options }: QuestionOptionsType) {
  return (
    <ul className="options-container">
      {options.map((option) => {
        return (
          <li
            onClick={() => {
              if (option.title && !disabled && !answer) {
                setAnswer(option.id);
              }
            }}
            className={`question-option ${
              !option.title || option.title === '' || disabled || !!answer
                ? '!cursor-not-allowed'
                : ''
            } ${
              option.right
                ? 'right-answer'
                : option.wrong
                ? 'wrong-answer'
                : disabled || !option.title || option.title === ''
                ? '!cursor-not-allowed hover:!bg-transparent'
                : 'no-answer'
            } ${answer === option.id ? 'selected-answer' : !answer && option.title ? '' : ''}`}
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
  );
}

export default QuestionOptions;
