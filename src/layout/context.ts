import { useOutletContext } from 'react-router-dom';

import type { QuestionType } from '../types';

export type LayoutOutletContextType = {
  acceptedConditions: boolean;
  setAcceptedConditions: (accepted: boolean) => void;

  activeQuestion?: QuestionType;
  gameStart: boolean;
  loadingQuestions: boolean;
  questions: QuestionType[];
  scoreId: number;
};

export function useLayoutOutletContext() {
  return useOutletContext() as LayoutOutletContextType;
}
