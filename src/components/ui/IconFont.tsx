import React from 'react';
import { cn } from '@/utils';

interface IconFontProps extends React.SVGAttributes<SVGSVGElement> {
  // 对应 iconfont.json 里的 font_class（无需带前缀 icon-）
  name: string;
  size?: number; // 以 tailwind class 为主；该属性仅作为内联宽高的便捷写法
}

const IconFont: React.FC<IconFontProps> = ({ name, className, size, ...props }) => {
  const style = size ? { width: size, height: size, ...(props.style || {}) } : props.style;
  return (
    <svg
      aria-hidden="true"
      className={cn('inline-block align-[-0.125em] fill-current stroke-current text-current', className)}
      style={style}
      {...props}
    >
      <use xlinkHref={`#icon-${name}`} />
    </svg>
  );
};

export default IconFont;

