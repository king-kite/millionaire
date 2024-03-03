import React from 'react';

export type ScoreType = {
  id: number;
  title: React.ReactNode;
  amount: string;
};

const scores: ScoreType[] = [
  {
    id: 1,
    title: <>$100</>,
    amount: '100',
  },
  {
    id: 2,
    title: <>$200</>,
    amount: '200',
  },
  {
    id: 3,
    title: <>$300</>,
    amount: '300',
  },
  {
    id: 4,
    title: <>$500</>,
    amount: '500',
  },
  {
    id: 5,
    title: <>$1,000</>,
    amount: '1,000',
  },
  {
    id: 6,
    title: <>$2,000</>,
    amount: '2,000',
  },
  {
    id: 7,
    title: <>$4,000</>,
    amount: '4,000',
  },
  {
    id: 8,
    title: <>$8,000</>,
    amount: '8,000',
  },
  {
    id: 9,
    title: <>$16,000</>,
    amount: '16,000',
  },
  {
    id: 10,
    title: <>$32,000</>,
    amount: '32,000',
  },
  {
    id: 11,
    title: <>$64,000</>,
    amount: '64,000',
  },
  {
    id: 12,
    title: <>$125,000</>,
    amount: '125,000',
  },
  {
    id: 13,
    title: <>$250,000</>,
    amount: '250,000',
  },
  {
    id: 14,
    title: <>$500,000</>,
    amount: '500,000',
  },
  {
    id: 15,
    title: <>$1 MILLION</>,
    amount: '1 MILLION',
  },
];

scores.reverse();

const placeholderQuestionOptions = [
  {
    id: 'A' as const,
    title: '',
  },
  {
    id: 'B' as const,
    title: '',
  },
  {
    id: 'C' as const,
    title: '',
  },
  {
    id: 'D' as const,
    title: '',
  },
];

export { scores, placeholderQuestionOptions };
