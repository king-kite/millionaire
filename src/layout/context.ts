import { useOutletContext } from 'react-router-dom';

import type { GetSetStateType, QuestionType } from '../types';
import type { ScoreType } from './data';

export type LayoutOutletContextType = {
  acceptedConditions: boolean;
  setAcceptedConditions: (accepted: LayoutOutletContextType['acceptedConditions']) => void;

  selectedAnswer: string | null;
  setSelectedAnswer: GetSetStateType<LayoutOutletContextType['selectedAnswer']>;

  setQuestionOptionsDisabled: (state: boolean) => void;

  phoneFriend: {
    title: string;
    probability: string;
  } | null;
  endPhoneCall: () => void;

  askAudience:
    | {
        id: string;
        percentage: number;
      }[]
    | null;
  closeAudience: () => void;

  toggleSidebar: (value: 'open' | 'close') => void;

  activeQuestion?: QuestionType;
  checkAnswer: (answer: string) => void;
  currentScore?: ScoreType | null;
  endGame: () => void;
  gameLost: boolean;
  gameStart: boolean;
  gameOver: boolean;
  loadingQuestions: boolean;

  questions: QuestionType[];
  scoreId: number;
  startOver: () => void;
};

export function useLayoutOutletContext() {
  return useOutletContext() as LayoutOutletContextType;
}
