import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    animate = true,
    icon,
    removable = false,
    onRemove,
    children,
    ...props
  }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center font-medium rounded-full transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-1'
    );

    const variantClasses = {
      default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      primary: 'bg-primary-100 text-primary-800 hover:bg-primary-200',
      secondary: 'bg-secondary-100 text-secondary-800 hover:bg-secondary-200',
      success: 'bg-green-100 text-green-800 hover:bg-green-200',
      warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      danger: 'bg-red-100 text-red-800 hover:bg-red-200',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs gap-1',
      md: 'px-2.5 py-1 text-sm gap-1.5',
      lg: 'px-3 py-1.5 text-base gap-2',
    };

    const badgeClasses = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    const content = (
      <>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children && <span>{children}</span>}
        {removable && (
          <button
            onClick={onRemove}
            className="ml-1 flex-shrink-0 hover:bg-black/10 rounded-full p-0.5 transition-colors"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </>
    );

    if (animate) {
      // 过滤掉不兼容的props
      const {
        onDrag,
        onDragStart,
        onDragEnd,
        onAnimationStart,
        onAnimationEnd,
        onAnimationIteration,
        onTransitionEnd,
        ...motionProps
      } = props;
      return (
        <motion.div
          ref={ref}
          className={badgeClasses}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          {...motionProps}
        >
          {content}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={badgeClasses} {...props}>
        {content}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
