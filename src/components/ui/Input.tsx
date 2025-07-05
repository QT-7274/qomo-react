import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'filled' | 'outline';
  animate?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    label,
    error,
    icon,
    iconPosition = 'left',
    variant = 'default',
    animate = true,
    ...props
  }, ref) => {
    const [focused, setFocused] = React.useState(false);

    const baseClasses = cn(
      'w-full rounded-lg border transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      {
        'pl-10': icon && iconPosition === 'left',
        'pr-10': icon && iconPosition === 'right',
        'pl-4 pr-4': !icon,
      }
    );

    const variantClasses = {
      default: cn(
        'border-gray-300 bg-white py-2.5',
        'focus:border-primary-500 focus:ring-primary-500',
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
      ),
      filled: cn(
        'border-transparent bg-gray-100 py-2.5',
        'focus:bg-white focus:border-primary-500 focus:ring-primary-500',
        error ? 'bg-red-50 focus:border-red-500 focus:ring-red-500' : ''
      ),
      outline: cn(
        'border-2 border-gray-300 bg-transparent py-2',
        'focus:border-primary-500 focus:ring-primary-500',
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
      ),
    };

    const inputClasses = cn(baseClasses, variantClasses[variant], className);

    const inputElement = (
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
    );

    const content = (
      <div className="space-y-1">
        {label && (
          <label className={cn(
            'block text-sm font-medium transition-colors duration-200',
            focused ? 'text-primary-600' : 'text-gray-700',
            error ? 'text-red-600' : ''
          )}>
            {label}
          </label>
        )}
        {animate ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {inputElement}
          </motion.div>
        ) : (
          inputElement
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
      </div>
    );

    return content;
  }
);

Input.displayName = 'Input';

// Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'filled' | 'outline';
  animate?: boolean;
  resize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    label,
    error,
    variant = 'default',
    animate = true,
    resize = true,
    ...props
  }, ref) => {
    const [focused, setFocused] = React.useState(false);

    const baseClasses = cn(
      'w-full rounded-lg border px-4 py-2.5 transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      resize ? 'resize-y' : 'resize-none'
    );

    const variantClasses = {
      default: cn(
        'border-gray-300 bg-white',
        'focus:border-primary-500 focus:ring-primary-500',
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
      ),
      filled: cn(
        'border-transparent bg-gray-100',
        'focus:bg-white focus:border-primary-500 focus:ring-primary-500',
        error ? 'bg-red-50 focus:border-red-500 focus:ring-red-500' : ''
      ),
      outline: cn(
        'border-2 border-gray-300 bg-transparent',
        'focus:border-primary-500 focus:ring-primary-500',
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
      ),
    };

    const textareaClasses = cn(baseClasses, variantClasses[variant], className);

    const textareaElement = (
      <textarea
        ref={ref}
        className={textareaClasses}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
    );

    return (
      <div className="space-y-1">
        {label && (
          <label className={cn(
            'block text-sm font-medium transition-colors duration-200',
            focused ? 'text-primary-600' : 'text-gray-700',
            error ? 'text-red-600' : ''
          )}>
            {label}
          </label>
        )}
        {animate ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {textareaElement}
          </motion.div>
        ) : (
          textareaElement
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea };
