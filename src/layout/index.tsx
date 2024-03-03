import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { placeholderQuestionOptions, scores } from './data';
import Footer from './footer';
import Header from './header';
import QuestionOptions from './question-options';
import Sidebar from './sidebar';
import { GAME_PAGE } from '../config/routes';
import { useGetQuestions } from '../store/queries/questions';

import type { LayoutOutletContextType } from './context';

function Layout() {
  const [acceptedConditions, setAcceptedConditions] = React.useState(false);
  const [gameStart, setGameStart] = React.useState(false);

  const [scoreId, setScoreId] = React.useState(1);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);

  const navigate = useNavigate();

  const { data: questions, loading: loadingQuestions } = useGetQuestions({
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

  // create a react router outlet context.
  // Didnt want to use react context. (just for fun)
  const outletContext: LayoutOutletContextType = React.useMemo(() => {
    return {
      acceptedConditions,
      setAcceptedConditions,
      activeQuestion,
      gameStart,
      scoreId,
      questions,
      loadingQuestions,
    };
  }, [acceptedConditions, activeQuestion, gameStart, questions, loadingQuestions, scoreId]);

  // Only start a game if the player accepts the terms
  React.useEffect(() => {
    if (acceptedConditions) {
      navigate(GAME_PAGE);
    }
  }, [navigate, acceptedConditions]);

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
