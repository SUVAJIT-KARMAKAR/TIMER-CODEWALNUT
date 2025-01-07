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

  // Determines styles based on the `variant` prop
  const getVariantStyles = (variant: ButtonProps['variant']) => {
    if (variant === 'primary') {
      return disabled || isLoading
        ? 'text-white bg-blue-400 cursor-not-allowed' 
        : 'text-white bg-blue-600 hover:bg-blue-700'; 
    } else if (variant === 'secondary') {
      return 'text-gray-700 bg-gray-100 hover:bg-gray-200';
    } else if (variant === 'danger') {
      return 'text-white bg-red-600 hover:bg-red-700';
    } else if (variant === 'icon') {
      return 'p-1 hover:bg-gray-100 rounded-full transition-colors';
    }
    return ''; 
  };

  // Determines styles based on the `size` prop
  const getSizeStyles = (size: ButtonProps['size']) => {
    if (size === 'sm') return 'px-3 py-1.5 text-sm';
    if (size === 'md') return 'px-4 py-2 text-sm';
    if (size === 'lg') return 'px-6 py-3 text-base';
    return ''; 
  };

  // Combines base, variant, size, and custom styles into one className string
  const getCombinedClassName = () => {
    const styles = [baseStyles, getVariantStyles(variant)];
    if (variant !== 'icon') styles.push(getSizeStyles(size)); 
    if (className) styles.push(className); 
    return styles.filter(Boolean).join(' '); 
  };

  return (
    <button
      className={getCombinedClassName()}
      disabled={disabled || isLoading} 
      {...props}
    >
      {children} 
    </button>
  );
};
