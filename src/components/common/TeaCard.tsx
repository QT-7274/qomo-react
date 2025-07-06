import React from 'react';
import { Card as TeaCard } from 'tea-component';
import { cn } from '@/utils';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  animate?: boolean;
  bordered?: boolean;
  full?: boolean | "withHeader";
}

interface CardHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children?: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  operation?: React.ReactNode;
}

interface CardFooterProps {
  children?: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children?: React.ReactNode;
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, bordered = false, full = false, hover, animate, ...props }, ref) => {
    return (
      <TeaCard
        ref={ref}
        className={cn(
          'p-6 rounded-xl shadow-sm border border-gray-200', // 恢复默认内边距 p-6
          hover && 'hover:shadow-md transition-shadow duration-200',
          animate && 'transition-all duration-200',
          className
        )}
        bordered={bordered}
        full={full}
        {...props}
      >
        {children}
      </TeaCard>
    );
  }
);

const CardHeader = React.forwardRef<HTMLElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <TeaCard.Header
        ref={ref}
        className={cn(
          'border-b-0 pb-4', // 移除下边框，添加底部间距
          className
        )}
        {...props}
      >
        {children}
      </TeaCard.Header>
    );
  }
);

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, title, subtitle, operation, ...props }, ref) => {
    return (
      <TeaCard.Body
        ref={ref}
        className={cn('pt-0', className)} // 移除顶部间距，因为 Card 已经有了内边距
        title={title}
        subtitle={subtitle}
        operation={operation}
        {...props}
      >
        {children}
      </TeaCard.Body>
    );
  }
);

const CardFooter = React.forwardRef<HTMLElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <TeaCard.Footer ref={ref} className={className} {...props}>
        {children}
      </TeaCard.Footer>
    );
  }
);

const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('text-lg font-semibold', className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';
CardTitle.displayName = 'CardTitle';

export { Card, CardHeader, CardContent, CardFooter, CardTitle };
