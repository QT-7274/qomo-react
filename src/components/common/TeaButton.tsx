import React from 'react';
import { Button as TeaButton } from 'tea-component';
import { cn } from '@/utils';

interface TeaButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'weak' | 'pay' | 'error' | 'text' | 'link' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode | string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  tooltip?: React.ReactNode;
  animate?: boolean;
  htmlType?: 'button' | 'submit' | 'reset';
  onClick?: (e?: React.MouseEvent<Element, MouseEvent>) => void;
}

const Button = React.forwardRef<HTMLButtonElement, TeaButtonProps>(
  ({
    className,
    variant = 'weak',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    tooltip,
    animate = true,
    htmlType = 'button',
    children,
    disabled,
    onClick,
    ...props
  }, ref) => {
    // 映射 variant 到 tea-component 的 type
    const getTeaType = (variant: string) => {
      const mapping = {
        primary: 'primary',
        secondary: 'primary', 
        outline: 'weak',      
        ghost: 'text',        
        danger: 'error',      
        weak: 'weak',
        pay: 'pay',
        error: 'error',
        text: 'text',
        link: 'link',
        icon: 'icon'
      };
      return mapping[variant as keyof typeof mapping] || 'weak';
    };

    // 处理图标
    const getIconString = (icon: React.ReactNode | string) => {
      if (typeof icon === 'string') {
        return icon;
      }
      // 如果是 React 节点，我们不能直接传给 tea-component
      // 这种情况下返回 undefined，让 tea-component 不显示图标
      return undefined;
    };

    // Tea Component 自己处理尺寸，我们只需要处理自定义样式
    const buttonClasses = cn(
      {
        'w-full': fullWidth,
      },
      className
    );

    // 如果图标是 React 节点，我们需要自己处理布局
    if (icon && typeof icon !== 'string') {
      return (
        <TeaButton
          ref={ref}
          type={getTeaType(variant) as any}
          className={buttonClasses}
          disabled={disabled || loading}
          loading={loading}
          tooltip={tooltip}
          onClick={onClick}
          htmlType={htmlType}
          {...props}
        >
          <div className="flex items-center gap-2">
            {iconPosition === 'left' && icon}
            {children}
            {iconPosition === 'right' && icon}
          </div>
        </TeaButton>
      );
    }

    return (
      <TeaButton
        ref={ref}
        type={getTeaType(variant) as any}
        className={buttonClasses}
        disabled={disabled || loading}
        loading={loading}
        icon={getIconString(icon)}
        tooltip={tooltip}
        onClick={onClick}
        htmlType={htmlType}
        {...props}
      >
        {children}
      </TeaButton>
    );
  }
);

Button.displayName = 'TeaButton';

export default Button;
