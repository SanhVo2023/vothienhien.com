import { type ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
}

const variants = {
  primary:
    'bg-accent text-primary hover:bg-accent-secondary border border-accent hover:border-accent-secondary',
  outline:
    'bg-transparent text-accent border border-accent hover:bg-accent hover:text-primary',
  ghost:
    'bg-transparent text-text-primary hover:text-accent border border-transparent',
};

const sizes = {
  sm: 'px-5 py-2 text-sm',
  md: 'px-7 py-3 text-sm',
  lg: 'px-10 py-4 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  type = 'button',
  onClick,
  disabled = false,
}: ButtonProps) {
  const baseClasses = `inline-flex items-center justify-center font-medium tracking-wider uppercase transition-all duration-300 ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={baseClasses}>
      {children}
    </button>
  );
}
