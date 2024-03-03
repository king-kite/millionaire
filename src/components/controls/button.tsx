import React from 'react';
import { Link } from 'react-router-dom';

type ButtonType = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  href?: string;
};

function Container({ children, href }: { children: React.ReactNode; href?: string }) {
  if (href) return <Link to={href}>{children}</Link>;
  return children;
}

function Button({ children, href, ...props }: ButtonType) {
  return (
    <Container href={href}>
      <button
        className="bg-primary-500 border border-primary-200 border-solid cursor-pointer font-semibold p-2 rounded text-gray-100 text-sm tracking-wide w-full hover:bg-transparent"
        {...props}
      >
        {children}
      </button>
    </Container>
  );
}

export default Button;
