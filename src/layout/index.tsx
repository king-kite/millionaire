import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Difficulty, LifeLine, placeholderQuestionOptions, scores } from './data';
import Footer from './footer';
import Header from './header';
import QuestionOptions from './question-options';
import Sidebar from './sidebar';
import { GAME_OVER_PAGE } from '../config/routes';
import WinScreen from '../containers/win-screen';
import { useGetQuestions } from '../store/queries/questions';
import { getRandomNumber } from '../utils';

import type { LayoutOutletContextType } from './context';
import type { QuestionOptionsType } from '../types';

const defaultLifeLines = [LifeLine.Fifty, LifeLine.Phone, LifeLine.Audience];

function Layout() {
  const [acceptedConditions, setAcceptedConditions] = React.useState(false);
  const [gameLost, setGameLost] = React.useState(false);
  const [gameStart, setGameStart] = React.useState(false);
  const [gameOver, setGameOver] = React.useState(false);
  const [lifeLines, setLifeLines] = React.useState(defaultLifeLines);
  const [questionChoices, setQuestionChoices] = React.useState<QuestionOptionsType['options']>([]);
  const [questionOptionsDisabled, setQuestionOptionsDisabled] = React.useState(false);
  const [phoneFriend, setPhoneFriend] =
    React.useState<LayoutOutletContextType['phoneFriend']>(null);
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

  // Handle Question
  const handleNextQuestion = React.useCallback((prevScoreId: number) => {
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

        // handle right answer i.e. showing win screen
        if (answer === activeQuestion.correct) {
          setShowWinScreen(true);
        } else {
          // handle the wrong answer i.e. show game lost screen
          setGameLost(true);
        }

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
    [activeQuestion]
  );

  // start the game over again
  const startOver = React.useCallback(() => {
    setGameLost(false);
    setGameStart(false);
    setGameOver(false);
    setQuestionOptionsDisabled(false);
    setScoreId(1);
    setLifeLines(defaultLifeLines);
    setSelectedAnswer(null);
    refetch();
  }, [refetch]);

  // A function to handle the 50:50 lifeline
  const handle5050Lifeline = React.useCallback(() => {
    // Check if the 50:50 lifeline is still available
    // And the choices count is 4
    if (lifeLines.includes(LifeLine.Fifty) && questionChoices.length === 4) {
      // Get an array of the incorrect choices
      const incorrectChoices = questionChoices.filter(
        (choice) => choice.id !== activeQuestion?.correct
      );

      // Remove 2 random choices from the incorrect Choices
      // Get a random number between 0 and 2 inclusive
      const randomNumber = getRandomNumber(0, incorrectChoices.length - 1);
      const keptWrongChoice = incorrectChoices[randomNumber];

      // Update the choices
      setQuestionChoices((prevChoices) => {
        const newChoices = [...prevChoices];

        return newChoices.map((choice) => {
          // Keep the correct and wrong choice
          if (choice.id === activeQuestion?.correct || choice.id === keptWrongChoice.id)
            return choice;
          return {
            id: choice.id,
            title: '',
          };
        });
      });
    }
  }, [activeQuestion, lifeLines, questionChoices]);

  // A function to handle the phone a friend lifeline
  const handlePhoneAFriend = React.useCallback(() => {
    if (!activeQuestion || !lifeLines.includes(LifeLine.Phone)) return;

    const difficulty =
      activeQuestion.id >= 10
        ? Difficulty.Hard
        : activeQuestion.id >= 5
        ? Difficulty.Medium
        : Difficulty.Easy;

    // Calculate the probability based on the difficulty level
    let probability: number;
    switch (difficulty) {
      case Difficulty.Easy:
        probability = Math.random() * 30 + 70; // Range: 70-100%
        break;
      case Difficulty.Medium:
        probability = Math.random() * 40 + 60; // Range: 60-100%
        break;
      case Difficulty.Hard:
        probability = Math.random() * 50 + 50; // Range: 50-100%
        break;
      default:
        probability = 50; // Default probability
        break;
    }

    // Round the probability to two decimal places
    probability = parseFloat(probability.toFixed(2));

    // Generate a random response from the friend
    const correctAnswer = activeQuestion.correct;

    // Using questionChoices incase 50:50 has been used
    const incorrectChoices = questionChoices.filter(
      (choice) => choice.id !== activeQuestion.correct && choice.title.trim() !== ''
    );
    const incorrectAnswer = incorrectChoices[getRandomNumber(0, incorrectChoices.length - 1)].id;
    const showCorrectAnswer = Math.random() < probability / 100;
    const answer = showCorrectAnswer ? correctAnswer : incorrectAnswer;

    let title = '';

    if (probability >= 95) {
      title = `It's definitely ${answer}.`;
    } else if (probability >= 80) {
      title = `I'm pretty sure it's ${answer}`;
    } else if (probability >= 60) {
      title = `I believe it's ${answer}.`;
    } else {
      title = `I think it's ${answer}.`;
    }

    setPhoneFriend({
      title,
      probability: `I'm ${Math.round(probability)}% sure.`,
    });
  }, [activeQuestion, questionChoices, lifeLines]);

  // A function to handle all lifelines operations
  const handleLifeLineAction = React.useCallback(
    (lifeline: LifeLine) => {
      switch (lifeline) {
        case LifeLine.Fifty:
          handle5050Lifeline();
          break;
        case LifeLine.Phone:
          handlePhoneAFriend();
          break;
        case LifeLine.Audience:
          console.log(lifeline);
          break;
        default:
          break;
      }
      setLifeLines((prevActions) => prevActions.filter((item) => item !== lifeline));
    },
    [handle5050Lifeline, handlePhoneAFriend]
  );

  // create a react router outlet context.
  // Didnt want to use react context. (just for fun)
  const outletContext: LayoutOutletContextType = React.useMemo(() => {
    return {
      acceptedConditions,
      setAcceptedConditions,

      selectedAnswer,
      setSelectedAnswer,

      setQuestionOptionsDisabled,

      phoneFriend,
      endPhoneCall: () => setPhoneFriend(null),

      activeQuestion,
      checkAnswer,
      currentScore,
      endGame: () => {
        // A function to end the game
        setGameOver(true);
      },
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
    gameLost,
    gameStart,
    gameOver,
    phoneFriend,
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
                        guaranteed={activeScore ? activeScore.id % 5 === 0 : false}
                        scoreTitle={activeScore?.title || '$0'}
                        onFinish={() => {
                          handleNextQuestion(scoreId);
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
                  handleLifeLineAction={handleLifeLineAction}
                  lifelines={lifeLines}
                  questionOptionsDisabled={questionOptionsDisabled}
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
