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
      <button className={`${props.disabled ? 'disabled' : 'active'} button-box`} {...props}>
        {children}
      </button>
    </Container>
  );
}

export default Button;
