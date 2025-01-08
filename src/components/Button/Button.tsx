// components/Button.tsx
import { ButtonHTMLAttributes } from 'react';
import { useTimerStore } from '../store/useTimerStore';
import { getThemeClass } from '../utils/theme';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) => {
  const { theme } = useTimerStore();
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2',
    lg: 'px-4 py-2 text-lg'
  };

  const themeClass = getThemeClass('button', variant, theme);
  
  return (
    <button
      className={`${themeClass} ${sizeClasses[size]} rounded-lg transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};