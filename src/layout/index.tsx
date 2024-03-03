import React from 'react';
import { Outlet } from 'react-router-dom';

import { placeholderQuestionOptions, scores } from './data';
import Footer from './footer';
import Header from './header';
import QuestionOptions from './question-options';
import Sidebar from './sidebar';
import { useGetQuestions } from '../store/queries/questions';

import type { LayoutOutletContextType } from './context';

function Layout() {
  const [acceptedConditions, setAcceptedConditions] = React.useState(false);
  const [gameStart, setGameStart] = React.useState(false);

  const [scoreId, setScoreId] = React.useState(1);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);

  const {
    data: questions,
    loading: loadingQuestions,
    refetch,
  } = useGetQuestions({
    enabled: acceptedConditions,
    onError(error) {
      window.alert(error.message);
    },
  });

  const { activeScore, activeQuestion, currentScore } = React.useMemo(() => {
    const activeScore = scores.find((score) => score.id === scoreId); // score for current question
    const currentScore = activeScore
      ? scores.find((score) => score.id === activeScore.id - 1)
      : null; // score for previous question won
    const activeQuestion = gameStart
      ? questions.find((question) => question.id === activeScore?.id)
      : undefined;
    return { activeScore, activeQuestion, currentScore };
  }, [scoreId, questions, gameStart]);

  // start the game over again
  const startOver = React.useCallback(() => {
    setGameStart(false);
    setScoreId(1);
    setSelectedAnswer(null);
    refetch();
  }, [refetch]);

  // create a react router outlet context.
  // Didnt want to use react context. (just for fun)
  const outletContext: LayoutOutletContextType = React.useMemo(() => {
    return {
      acceptedConditions,
      setAcceptedConditions,

      selectedAnswer,
      setSelectedAnswer,

      activeQuestion,
      gameStart,
      scoreId,
      startOver,
      questions,
      loadingQuestions,
    };
  }, [
    acceptedConditions,
    activeQuestion,
    gameStart,
    questions,
    loadingQuestions,
    selectedAnswer,
    scoreId,
    startOver,
  ]);

  return (
    <div className="layout-wrapper">
      <div className="w-full">
        <div className="layout-container">
          <Header />
          <div className="main-container">
            <div className="app-outlet">
              <div className="app-screens">
                <Outlet context={outletContext} />
              </div>
              <QuestionOptions
                answer={selectedAnswer}
                setAnswer={setSelectedAnswer}
                options={activeQuestion?.choices || placeholderQuestionOptions}
              />
            </div>

            <Sidebar
              acceptedConditions={acceptedConditions}
              activeScore={activeScore}
              currentScore={currentScore}
              scoreId={scoreId}
              setScoreId={setScoreId}
              gameStart={gameStart}
              setGameStart={setGameStart}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
