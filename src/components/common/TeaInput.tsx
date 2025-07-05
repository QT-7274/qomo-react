import React from 'react';
import { Input as TeaInput } from 'tea-component';
import { cn } from '@/utils';
import Label from './Label';

/**
 * Tea Component Input 组件的变更上下文接口
 * 包含触发变更的事件信息
 */
interface ChangeContext<T = React.SyntheticEvent<Element, Event>> {
  /** 触发变更的事件对象 */
  event: T;
}

/**
 * 输入框组件属性接口
 * 基于 tea-component 的 Input 组件，提供统一的输入框体验
 */
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'children'> {
  /** 输入框标签文本 */
  label?: string;
  /** 占位符文本 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否只读 */
  readonly?: boolean;
  /** 最大输入长度 */
  maxLength?: number;
  /** 输入框尺寸，full 表示撑满容器宽度 */
  size?: 'xs' | 's' | 'm' | 'l' | 'full';
  /** 当前值 */
  value?: string;
  /** 默认值（非受控模式） */
  defaultValue?: string;
  /** 值变更回调，符合 tea-component 的回调格式 */
  onChange?: (value: string, context: ChangeContext<React.SyntheticEvent<Element, Event>>) => void;
  /** 按下回车键的回调 */
  onPressEnter?: (value: string, event: React.KeyboardEvent<Element>) => void;
  /** 自定义类名 */
  className?: string;
  /** 基础类名（不建议使用） */
  baseClassName?: string;
}

/**
 * 多行文本输入框组件属性接口
 * 基于 tea-component 的 TextArea 组件
 */
interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'size' | 'children'> {
  /** 输入框标签文本 */
  label?: string;
  /** 占位符文本 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否只读 */
  readonly?: boolean;
  /** 最大输入长度 */
  maxLength?: number;
  /** 输入框尺寸 */
  size?: 'xs' | 's' | 'm' | 'l' | 'full';
  /** 显示行数 */
  rows?: number;
  /** 是否显示字数统计 */
  showCount?: boolean;
  /** 当前值 */
  value?: string;
  /** 默认值（非受控模式） */
  defaultValue?: string;
  /** 值变更回调 */
  onChange?: (value: string, context: ChangeContext<React.SyntheticEvent<Element, Event>>) => void;
  /** 按下回车键的回调 */
  onPressEnter?: (value: string, event: React.KeyboardEvent<Element>) => void;
  /** 自定义类名 */
  className?: string;
}

/**
 * 输入框组件
 * 基于 tea-component 的 Input 组件封装，提供统一的标签布局和样式
 *
 * @example
 * ```tsx
 * <Input
 *   label="用户名"
 *   placeholder="请输入用户名"
 *   value={username}
 *   onChange={(value) => setUsername(value)}
 * />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    className,
    size = 'm', // 默认中等尺寸
    ...props
  }, ref) => {
    // 创建 tea-component 的 Input 元素
    const inputElement = (
      <TeaInput
        ref={ref}
        size={size}
        className={className}
        {...props}
      />
    );

    // 如果有标签，包装在带标签的容器中
    if (label) {
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          {inputElement}
        </div>
      );
    }

    // 没有标签时直接返回输入框
    return inputElement;
  }
);

/**
 * 多行文本输入框组件
 * 基于 tea-component 的 TextArea 组件封装
 *
 * @example
 * ```tsx
 * <Textarea
 *   label="描述"
 *   placeholder="请输入描述"
 *   rows={4}
 *   value={description}
 *   onChange={(value) => setDescription(value)}
 * />
 * ```
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    label,
    className,
    rows = 3, // 默认3行
    ...props
  }, ref) => {
    // 创建 tea-component 的 TextArea 元素
    const textareaElement = (
      <TeaInput.TextArea
        ref={ref}
        rows={rows}
        className={cn("w-full",className)}
        {...props}
      />
    );

    // 如果有标签，包装在带标签的容器中
    if (label) {
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          {textareaElement}
        </div>
      );
    }

    // 没有标签时直接返回文本框
    return textareaElement;
  }
);

Input.displayName = 'Input';
Textarea.displayName = 'Textarea';

export { Input, Textarea };
