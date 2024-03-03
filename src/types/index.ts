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
