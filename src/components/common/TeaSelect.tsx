import React from 'react';
import { Select as TeaSelect } from 'tea-component';
import { cn } from '@/utils';
import { useI18n } from '@/i18n/hooks';
import Label from './Label';

interface SelectOption {
  value: string;
  text: React.ReactNode;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  options?: SelectOption[];
  size?: 'xs' | 's' | 'm' | 'l' | 'full';
  appearance?: 'default' | 'button' | 'link' | 'filter' | 'pure';
  clearable?: boolean;
  searchable?: boolean;
  onChange?: (value: string, context: { event: React.SyntheticEvent; option?: any }) => void;
  className?: string;
}

const Select = React.forwardRef<HTMLElement, SelectProps>(
  ({
    label,
    className,
    options = [],
    size = 'm',
    appearance = 'button',
    placeholder,
    ...props
  }, ref) => {
    const { t } = useI18n();
    const finalPlaceholder = placeholder || t('请选择');
    const selectElement = (
      <TeaSelect
        ref={ref}
        options={options}
        size={size}
        appearance={appearance}
        placeholder={finalPlaceholder}
        className={cn('min-w-0', className)} // 确保可以缩小
        {...props}
      />
    );

    if (label) {
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          {selectElement}
        </div>
      );
    }

    return selectElement;
  }
);

Select.displayName = 'Select';

export { Select };
export type { SelectOption };
