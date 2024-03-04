import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { placeholderQuestionOptions, scores } from './data';
import Footer from './footer';
import Header from './header';
import QuestionOptions from './question-options';
import Sidebar from './sidebar';
import { GAME_OVER_PAGE } from '../config/routes';
import WinScreen from '../containers/win-screen';
import { useGetQuestions } from '../store/queries/questions';

import type { LayoutOutletContextType } from './context';
import type { QuestionOptionsType } from '../types';

function Layout() {
  const [acceptedConditions, setAcceptedConditions] = React.useState(false);
  const [gameLost, setGameLost] = React.useState(false);
  const [gameStart, setGameStart] = React.useState(false);
  const [gameOver, setGameOver] = React.useState(false);
  const [questionChoices, setQuestionChoices] = React.useState<QuestionOptionsType['options']>([]);
  const [questionOptionsDisabled, setQuestionOptionsDisabled] = React.useState(false);
  const [scoreId, setScoreId] = React.useState(1);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);
  const [showWinScreen, setShowWinScreen] = React.useState(false);

  const navigate = useNavigate();

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
    const currentScore = scores.find((score) => score.id === scoreId - 1); // score for previous question won
    const activeQuestion = gameStart
      ? questions.find((question) => question.id === activeScore?.id)
      : undefined;
    return { activeScore, activeQuestion, currentScore };
  }, [scoreId, questions, gameStart]);

  // start the game over again
  const startOver = React.useCallback(() => {
    setGameLost(false);
    setGameStart(false);
    setGameOver(false);
    setQuestionOptionsDisabled(false);
    setScoreId(1);
    setSelectedAnswer(null);
    refetch();
  }, [refetch]);

  // end the same
  const endGame = React.useCallback(() => {
    setGameOver(true);
  }, []);

  // Handle Wrong Answer
  const handleWrongAnswer = React.useCallback(() => {
    setGameLost(true);
  }, []);

  console.log({ scoreId });

  // Handle Right Answer
  const handleRightAnswer = React.useCallback((prevScoreId: number) => {
    const nextId = prevScoreId + 1;
    if (nextId > scores.length) {
      setGameOver(true);
    }
    setScoreId(nextId);
    setQuestionOptionsDisabled(false);
    setShowWinScreen(false);
  }, []);

  // Check If Answer Is Correct Or Not
  const checkAnswer = React.useCallback(
    (answer: string) => {
      if (activeQuestion) {
        setQuestionOptionsDisabled(true);
        setSelectedAnswer(null);

        if (answer === activeQuestion.correct) {
          setShowWinScreen(true);
        } else handleWrongAnswer();

        setQuestionChoices((prevChoices) => {
          const newChoices = [...prevChoices];
          return newChoices.map((choice) => {
            const wasChosen = choice.id === answer;

            return {
              ...choice,
              right: choice.id === activeQuestion.correct,
              wrong: wasChosen && choice.id !== activeQuestion.correct,
            };
          });
        });
      }
    },
    [activeQuestion, handleWrongAnswer]
  );

  // create a react router outlet context.
  // Didnt want to use react context. (just for fun)
  const outletContext: LayoutOutletContextType = React.useMemo(() => {
    return {
      acceptedConditions,
      setAcceptedConditions,

      selectedAnswer,
      setSelectedAnswer,

      activeQuestion,
      checkAnswer,
      currentScore,
      endGame,
      gameLost,
      gameStart,
      gameOver,
      scoreId,
      startOver,
      questions,
      loadingQuestions,
    };
  }, [
    acceptedConditions,
    activeQuestion,
    checkAnswer,
    currentScore,
    endGame,
    gameLost,
    gameStart,
    gameOver,
    questions,
    loadingQuestions,
    selectedAnswer,
    scoreId,
    startOver,
  ]);

  React.useEffect(() => {
    const questionChoices = activeQuestion ? activeQuestion.choices : placeholderQuestionOptions;
    setQuestionChoices(questionChoices);
  }, [activeQuestion]);

  React.useEffect(() => {
    if (gameOver) navigate(GAME_OVER_PAGE);
  }, [gameOver, navigate]);

  return (
    <div className="layout-wrapper">
      <div className="w-full">
        <div className="layout-container">
          <Header />
          {gameOver ? (
            <Outlet context={outletContext} />
          ) : (
            <>
              <div className="main-container">
                <div className="app-outlet">
                  <div className="app-screens">
                    {showWinScreen ? (
                      <WinScreen
                        onFinish={() => {
                          handleRightAnswer(scoreId);
                        }}
                      />
                    ) : (
                      <Outlet context={outletContext} />
                    )}
                  </div>
                  <QuestionOptions
                    disabled={questionOptionsDisabled || !gameStart}
                    answer={selectedAnswer}
                    setAnswer={setSelectedAnswer}
                    options={questionChoices}
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
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
