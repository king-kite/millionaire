import React from 'react';
import { Navigate } from 'react-router-dom';

import { Button, Modal } from '../components/controls';
import PhoneFriend from '../components/phone-friend';
import { HOME_PAGE, LOSE_GAME_PAGE } from '../config/routes';
import { useLayoutOutletContext } from '../layout/context';

function Game() {
  const {
    acceptedConditions,
    activeQuestion,
    checkAnswer,
    endGame,
    gameLost,
    gameStart,
    loadingQuestions: loading,
    phoneFriend,
    setQuestionOptionsDisabled,
    selectedAnswer,
    setSelectedAnswer,
    startOver,
  } = useLayoutOutletContext();

  const [canStartOver, setCanStartOver] = React.useState(false);
  const [canQuit, setCanQuit] = React.useState(false);

  React.useEffect(() => {
    // Disable the question options if any other modal is opened
    if (canQuit || canStartOver || phoneFriend !== null) {
      setQuestionOptionsDisabled(true);
    } else {
      setQuestionOptionsDisabled(false);
    }
  }, [canQuit, canStartOver, phoneFriend, setQuestionOptionsDisabled]);

  // Only start a game if the player accepts the terms
  if (!acceptedConditions) return <Navigate to={HOME_PAGE} />;

  if (gameLost) return <Navigate to={LOSE_GAME_PAGE} />;

  return (
    <div className="h-full p-4 relative w-full">
      {loading || !gameStart ? (
        <div className="flex h-full items-center justify-center w-full">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between">
          <h3 className="question-title">{activeQuestion?.title}</h3>

          {activeQuestion && activeQuestion.id > 1 && (
            <div className="flex justify-between items-center w-full">
              <div className="max-w-[8rem] w-full">
                <Button disabled={!!selectedAnswer} onClick={() => setCanStartOver(true)}>
                  Start Over
                </Button>
              </div>
              <div className="max-w-[8rem] w-full">
                <Button disabled={!!selectedAnswer} onClick={() => setCanQuit(true)}>
                  Walk Away
                </Button>
              </div>
            </div>
          )}

          {selectedAnswer && (
            <Modal
              title="Is that your final answer?"
              onCancel={() => setSelectedAnswer(null)}
              onConfirm={() => checkAnswer(selectedAnswer)}
            />
          )}

          {(canStartOver || canQuit) && (
            <Modal
              title="Are you sure?"
              onCancel={() => (canStartOver ? setCanStartOver(false) : setCanQuit(false))}
              onConfirm={() => {
                if (canStartOver) startOver();
                else endGame();
                if (canStartOver) setCanStartOver(false);
                else setCanQuit(false);
              }}
            />
          )}

          {phoneFriend && <PhoneFriend {...phoneFriend} />}
        </div>
      )}
    </div>
  );
}

export default Game;
