import React from 'react';
import { cn } from '@/utils';

/**
 * 标签组件属性接口
 * 继承原生 label 元素的所有属性
 */
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** 标签内容 */
  children: React.ReactNode;
  /** 是否为必填项，会在标签后显示红色星号 */
  required?: boolean;
  /** 标签尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 标签样式变体 */
  variant?: 'default' | 'muted' | 'accent';
  /** 自定义类名 */
  className?: string;
}

/**
 * 可复用的标签组件
 * 提供统一的标签样式和行为，支持多种尺寸和样式变体
 *
 * @example
 * ```tsx
 * <Label required size="md" variant="default">
 *   用户名
 * </Label>
 * ```
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({
    children,
    required = false,
    size = 'md',
    variant = 'default',
    className,
    ...props
  }, ref) => {
    // 不同尺寸对应的样式类
    const sizeClasses = {
      sm: 'text-xs',    // 小号：12px
      md: 'text-sm',    // 中号：14px (默认)
      lg: 'text-base',  // 大号：16px
    };

    // 不同样式变体对应的颜色类
    const variantClasses = {
      default: 'text-gray-700',  // 默认：深灰色
      muted: 'text-gray-500',    // 静音：浅灰色
      accent: 'text-blue-600',   // 强调：蓝色
    };

    return (
      <label
        ref={ref}
        className={cn(
          'block font-medium mt-2', // 基础样式：块级、中等字重、顶部间距
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
        {/* 如果是必填项，显示红色星号 */}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';

export default Label;
