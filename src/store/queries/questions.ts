/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import type { QuestionType } from '../../types';

type ErrorType = {
  message: string;
};

type DataResponseType = {
  category: string;
  id: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  question: {
    text: string;
  };
  tags: string[];
  type: 'text_choice' | 'image_choice';
  difficulty: 'easy' | 'medium' | 'hard';
  regions: string[];
  isNiche: boolean;
};

const URL = 'https://the-trivia-api.com/v2/questions?limit=5&types=text_choice';

const EASY_URL = URL + '&difficulty=easy';
const MEDIUM_URL = URL + '&difficulty=medium';
const HARD_URL = URL + '&difficulty=hard';

async function getData(options: {
  onSuccess: (data: any) => void;
  onError: (data: any) => void;
  onSettled: () => void;
}) {
  try {
    const easyResponse = await fetch(EASY_URL, { method: 'GET' });
    const easyData: DataResponseType[] = await easyResponse.json();

    const mediumResponse = await fetch(MEDIUM_URL, { method: 'GET' });
    const mediumData: DataResponseType[] = await mediumResponse.json();

    const hardResponse = await fetch(HARD_URL, { method: 'GET' });
    const hardData: DataResponseType[] = await hardResponse.json();

    const data: DataResponseType[] = [...easyData, ...mediumData, ...hardData];

    const questions = data.map((item, index) => {
      const choices = [
        {
          id: 'A',
          title: item.incorrectAnswers[0],
        },
        {
          id: 'B',
          title: item.correctAnswer,
        },
        {
          id: 'C',
          title: item.incorrectAnswers[1],
        },
        {
          id: 'D',
          title: item.incorrectAnswers[2],
        },
      ];

      return {
        id: index + 1,
        title: item.question.text,
        correct: choices.find((choice) => choice.title === item.correctAnswer)?.id || 'A',
        choices,
      };
    });

    options.onSuccess(questions);
  } catch (error) {
    options.onError({ message: (error as any).message });
  } finally {
    options.onSettled();
  }
}

export function useGetQuestions(options?: {
  enabled?: boolean;
  onError?: (error: { message: string }) => void;
}) {
  const { enabled, onError } = options || {};

  const [data, setData] = React.useState<QuestionType[]>([]);
  const [error, setError] = React.useState<ErrorType | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (error && onError) {
      setError(error);
    }
  }, [error, onError]);

  React.useEffect(() => {
    if (enabled) {
      setLoading(true);
      getData({
        onError(data) {
          setError(data);
        },
        onSuccess(data) {
          setData(data);
        },
        onSettled() {
          setLoading(false);
        },
      });
    } else setLoading(false);
  }, [enabled]);

  const refetch = React.useCallback(() => {
    setLoading(true);
    setData([]);
    getData({
      onError(data) {
        setError(data);
        if (onError) onError(data);
      },
      onSuccess(data) {
        setData(data);
      },
      onSettled() {
        setLoading(false);
      },
    });
  }, [onError]);

  return {
    data,
    error,
    loading,
    refetch,
  };
}
