/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import type { QuestionType } from '../../types';

type ErrorType = {
  message: string;
};

const choices = [
  {
    id: 'A' as const,
    title: 'Option A',
  },
  {
    id: 'B' as const,
    title: 'Option B',
  },
  {
    id: 'C' as const,
    title: 'Option C',
  },
  {
    id: 'D' as const,
    title: 'Option D',
  },
];

const questionsData: QuestionType[] = Array.from({ length: 15 }).map((_, j) => {
  return {
    id: j + 1,
    title: 'Question ' + (j + 1),
    choices,
    correct: 'B',
  };
});

const getQuestions = () => {
  return new Promise<QuestionType[]>((resolve) => {
    setTimeout(() => {
      resolve(questionsData);
    }, 1500);
  });
};

async function getData(options: {
  onSuccess: (data: any) => void;
  onError: (data: any) => void;
  onSettled: () => void;
}) {
  try {
    const data = await getQuestions();
    options.onSuccess(data);
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
    if (enabled && data.length === 0) {
      setLoading(true);
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
    } else setLoading(false);
  }, [onError, data, enabled]);

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
