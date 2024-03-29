import React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import cls from 'classnames';

type ButtonProps = {
  text?: string | undefined;
  className?: string | undefined;
  onClick?: (() => void) | undefined;
  size?: string | undefined;
  solid?: boolean | undefined;
  primary?: boolean;
  rounded?: string | undefined;
  full?: boolean | undefined;
  type?: 'button' | 'submit' | 'reset' | undefined;
  loading?: boolean | undefined;
  icon?: any;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  text = 'Button',
  className = '',
  onClick = () => {},
  size = 'md',
  solid = false,
  rounded = '',
  full = false,
  type = 'button',
  loading = false,
  icon,
  disabled = false,
  primary,
}) => {
  const { resolvedTheme: theme } = useTheme();
  return (
    <button
      type={type}
      onClick={onClick}
      className={cls(
        'font-semibold border mx-1 flex text-center',
        theme,
        size === 'sm' ? 'py-2 px-4' : size === 'md' ? 'p-3.5' : 'p-4',
        primary
          ? 'bg-primary hover:bg-blue-700 text-white border-primary hover:border-blue-700'
          : solid
          ? 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600 hover:border-gray-700'
          : 'bg-transparent border-[1px] text-gray-700 hover:text-white border-gray-200 dark:border-gray-200-dark hover:border-gray-300',
        rounded === 'right' ? 'rounded-r' : rounded === 'left' ? 'rounded-l' : 'rounded-lg',
        full ? 'w-full' : '',
        loading || disabled
          ? 'text-gray-500 dark:text-gray-500-dark bg-gray-200 dark:bg-gray-200-dark border-gray-200 dark:border-gray-200-dark hover:bg-gray-200 dark:hover:bg-gray-200-dark hover:border-gray-200 dark:hover:border-gray-200-dark'
          : '',
        className
      )}
      disabled={disabled || loading}
    >
      {!!icon && (
        <div className={cls('w-6 h-6 ml-auto', text ? 'mr-3' : 'mr-auto')}>
          <Image src={icon} alt="button icon" />
        </div>
      )}
      {!!text && (
        <div className={cls('mr-auto', !icon && 'ml-auto')}>{loading ? 'Loading...' : text}</div>
      )}
    </button>
  );
};

export default Button;
