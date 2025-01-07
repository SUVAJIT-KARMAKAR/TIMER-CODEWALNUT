import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'font-medium rounded-md transition-colors';
  
  const variantStyles = {
    primary: `text-white ${
      disabled || isLoading
        ? 'bg-blue-400 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700'
    }`,
    secondary: 'text-gray-700 bg-gray-100 hover:bg-gray-200',
    danger: 'text-white bg-red-600 hover:bg-red-700',
    icon: 'p-1 hover:bg-gray-100 rounded-full transition-colors',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${variant !== 'icon' ? sizeStyles[size] : ''}
    ${className}
  `.trim();

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {children}
    </button>
  );
};