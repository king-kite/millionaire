import { useOutletContext } from 'react-router-dom';

import type { GetSetStateType, QuestionType } from '../types';

export type LayoutOutletContextType = {
  acceptedConditions: boolean;
  setAcceptedConditions: (accepted: LayoutOutletContextType['acceptedConditions']) => void;

  selectedAnswer: string | null;
  setSelectedAnswer: GetSetStateType<LayoutOutletContextType['selectedAnswer']>;

  activeQuestion?: QuestionType;
  checkAnswer: (answer: string) => void;
  gameLost: boolean;
  gameStart: boolean;
  loadingQuestions: boolean;
  questions: QuestionType[];
  scoreId: number;
  startOver: () => void;
};

export function useLayoutOutletContext() {
  return useOutletContext() as LayoutOutletContextType;
}
