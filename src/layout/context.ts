import { useOutletContext } from 'react-router-dom';

import type { GetSetStateType, QuestionType } from '../types';
import type { ScoreType } from './data';

export type LayoutOutletContextType = {
  acceptedConditions: boolean;
  setAcceptedConditions: (accepted: LayoutOutletContextType['acceptedConditions']) => void;

  selectedAnswer: string | null;
  setSelectedAnswer: GetSetStateType<LayoutOutletContextType['selectedAnswer']>;

  activeQuestion?: QuestionType;
  checkAnswer: (answer: string) => void;
  currentScore?: ScoreType | null;
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
