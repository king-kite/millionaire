import React from 'react';

type ButtonType = React.ButtonHTMLAttributes<HTMLButtonElement>;

function GameOverButton({ children, ...props }: ButtonType) {
  return (
    <div className="flex items-center w-full">
      <div className="bg-primary-500 h-0.5 w-1/4" />
      <button className="game-over-button w-1/2" {...props}>
        {children}
      </button>
      <div className="bg-primary-500 h-0.5 w-1/4" />
    </div>
  );
}

export default GameOverButton;
