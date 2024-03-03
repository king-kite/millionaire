import type { GetSetStateType } from '../types';

type QuestionOptionsType = {
  options: {
    id: 'A' | 'B' | 'C' | 'D';
    title: string;
  }[];
  answer: string | null;
  setAnswer: GetSetStateType<string | null>;
};

function QuestionOptions({ answer, setAnswer, options }: QuestionOptionsType) {
  return (
    <ul className="options-container">
      {options.map((option) => {
        return (
          <li
            onClick={() => {
              if (option.title) {
                setAnswer(option.id);
              }
            }}
            className={`question-option ${
              answer === option.id ? 'selected-answer' : option.title ? 'no-answer' : ''
            }`}
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
