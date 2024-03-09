import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Difficulty, LifeLine, placeholderQuestionOptions, scores } from './data';
import Footer from './footer';
import Header from './header';
import QuestionOptions from './question-options';
import Sidebar from './sidebar';
import LifeLines from '../components/life-lines';
import { GAME_OVER_PAGE } from '../config/routes';
import WinScreen from '../containers/win-screen';
import { useOutClick } from '../hooks';
import { useGetQuestions } from '../store/queries/questions';
import { getRandomNumber } from '../utils';

import type { LayoutOutletContextType } from './context';
import type { QuestionOptionsType } from '../types';

const defaultLifeLines = [LifeLine.Fifty, LifeLine.Phone, LifeLine.Audience];

function Layout() {
  const [acceptedConditions, setAcceptedConditions] = React.useState(false);
  const [askAudience, setAskAudience] =
    React.useState<LayoutOutletContextType['askAudience']>(null);
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

  // control the side container for mobile devices
  const sidebar = useOutClick();

  const navigate = useNavigate();

  const {
    data: questions,
    loading: loadingQuestions,
    refetch,
  } = useGetQuestions({
    enabled: acceptedConditions,
    onError(error) {
      // window.alert(error.message);
      console.log(error.message);
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
    sidebar.setVisible(true); // open sidebar for mobile devices to show the annimation
    refetch();
  }, [refetch, sidebar]);

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

  // A function to handle audience
  const handleAudience = React.useCallback(() => {
    if (!activeQuestion || !lifeLines.includes(LifeLine.Audience)) return;

    const DIVIDER = 10;

    let remainingPercentage = 100; // Remaining percentage to distribute among answer choices
    const totalParticipants = DIVIDER * remainingPercentage; // Total simulated audience participants

    // Initialize response array
    const audienceResponse = [];

    const difficulty =
      activeQuestion.id >= 10
        ? Difficulty.Hard
        : activeQuestion.id >= 5
        ? Difficulty.Medium
        : Difficulty.Easy;

    // Adjust the likelihood of the correct answer being chosen based on difficulty level
    let correctAnswerLikelihood;
    switch (difficulty) {
      case Difficulty.Easy:
        correctAnswerLikelihood = 0.8; // 80% likelihood for easy questions
        break;
      case Difficulty.Medium:
        correctAnswerLikelihood = 0.7; // 70% likelihood for medium questions
        break;
      case Difficulty.Hard:
        correctAnswerLikelihood = 0.6; // 60% likelihood for hard questions
        break;
      default:
        correctAnswerLikelihood = 0.6; // Default to easy difficulty
        break;
    }

    // get only active choices
    const choices = questionChoices.filter((choice) => choice.title !== '');

    // Assign percentages to each answer choice
    for (let i = 0; i < choices.length; i++) {
      let percentage;
      if (choices[i].id === activeQuestion.correct) {
        percentage =
          Math.random() < correctAnswerLikelihood
            ? Math.floor(Math.random() * 40) + 60
            : Math.floor(Math.random() * 60); // Correct answer gets 60-100% or 0-60%
      } else {
        if (remainingPercentage <= 0) {
          percentage = 0;
        } else {
          const minPercentage = 1; // Minimum percentage for incorrect choices to avoid zeros
          const maxPercentage = Math.min(remainingPercentage, 40); // Maximum percentage for incorrect choices to avoid negatives
          percentage = Math.random() * (maxPercentage - minPercentage) + minPercentage;
          // const minPercentage = Math.min(remainingPercentage, 10); // Minimum percentage for incorrect choices
          // percentage = Math.random() * (remainingPercentage - minPercentage) + minPercentage;
        }
      }
      remainingPercentage -= percentage;

      audienceResponse.push({
        id: choices[i].id,
        percentage: percentage,
      });
    }

    // Ensure the correct answer has a higher likelihood
    audienceResponse.sort((_, b) => (b.id === activeQuestion.correct ? 1 : -1));

    // Normalize the percentages to add up to 1000
    const totalPercentage = audienceResponse.reduce((acc, cur) => acc + cur.percentage, 0);
    const scale = totalParticipants / totalPercentage;
    audienceResponse.forEach((response) => {
      response.percentage = Math.round(response.percentage * scale);
    });

    const data = [
      {
        id: 'A',
        percentage: (audienceResponse.find((i) => i.id === 'A')?.percentage || 0) / DIVIDER,
      },
      {
        id: 'B',
        percentage: (audienceResponse.find((i) => i.id === 'B')?.percentage || 0) / DIVIDER,
      },
      {
        id: 'C',
        percentage: (audienceResponse.find((i) => i.id === 'C')?.percentage || 0) / DIVIDER,
      },
      {
        id: 'D',
        percentage: (audienceResponse.find((i) => i.id === 'D')?.percentage || 0) / DIVIDER,
      },
    ];

    setAskAudience(data);
  }, [activeQuestion, lifeLines, questionChoices]);

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
          handleAudience();
          break;
        default:
          break;
      }
      setLifeLines((prevActions) => prevActions.filter((item) => item !== lifeline));
    },
    [handle5050Lifeline, handleAudience, handlePhoneAFriend]
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

      askAudience,
      closeAudience: () => setAskAudience(null),

      phoneFriend,
      endPhoneCall: () => setPhoneFriend(null),

      toggleSidebar(value) {
        sidebar.setVisible(value === 'open');
      },

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
    askAudience,
    checkAnswer,
    currentScore,
    gameLost,
    gameStart,
    gameOver,
    phoneFriend,
    questions,
    loadingQuestions,
    selectedAnswer,
    sidebar,
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
      <div className="layout-container">
        <Header />
        {gameOver ? (
          <Outlet context={outletContext} />
        ) : (
          <>
            <div className="max-w-[14rem] mx-auto mb-2 sm:hidden">
              <LifeLines
                handleLifeLineAction={handleLifeLineAction}
                gameStart={gameStart}
                lifelines={lifeLines}
                questionOptionsDisabled={questionOptionsDisabled}
                showSidebarToggler
                toggleSidebar={() => {
                  sidebar.setVisible((prevValue) => !prevValue);
                }}
                togglerRef={{
                  ref: sidebar.buttonRef,
                }}
                visible={sidebar.visible}
              />
            </div>
            <div className="main-container">
              <div className="app-outlet">
                <div className="app-screens">
                  {showWinScreen ? (
                    <WinScreen
                      guaranteed={activeScore ? activeScore.id % 5 === 0 : false}
                      scoreTitle={activeScore?.amount || '0'}
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
                closeSidebar={() => sidebar.setVisible(false)}
                currentScore={currentScore}
                handleLifeLineAction={handleLifeLineAction}
                lifelines={lifeLines}
                questionOptionsDisabled={questionOptionsDisabled}
                scoreId={scoreId}
                setScoreId={setScoreId}
                gameStart={gameStart}
                setGameStart={setGameStart}
                ref={sidebar.ref}
                visible={sidebar.visible}
              />
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
