export type GetSetStateType<T> = (value: T | ((prevValue: T) => T)) => void;

export type QuestionType = {
  id: number;
  title: string;
  choices: {
    id: 'A' | 'B' | 'C' | 'D';
    title: string;
  }[];
  correct: string;
};

export type QuestionOptionsType = {
  disabled?: boolean;
  options: {
    id: 'A' | 'B' | 'C' | 'D';
    title: string;
    wrong?: boolean;
    right?: boolean;
  }[];
  answer: string | null;
  setAnswer: GetSetStateType<string | null>;
};
