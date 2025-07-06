import React from 'react';
import { TagSelect as TeaTagSelect } from 'tea-component';

import Label from './Label';

interface TagOption {
  value: string;
  text: React.ReactNode;
  disabled?: boolean;
  removeable?: boolean;
}

interface TagSelectProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string[];
  defaultValue?: string[];
  options?: TagOption[];
  optionsOnly?: boolean;
  autoClearSearchValue?: boolean;
  hideCloseButton?: boolean;
  onChange?: (value: string[], context: { event: React.SyntheticEvent; option: any }) => void;
  onSearch?: (inputValue: string) => void;
  onDeleteTag?: (tag: any) => Promise<boolean> | boolean;
  className?: string;
}

const TagSelect = React.forwardRef<HTMLDivElement, TagSelectProps>(
  ({ 
    label, 
    className, 
    options = [],
    placeholder = '请选择',
    autoClearSearchValue = true,
    hideCloseButton = false,
    ...props 
  }, ref) => {
    const tagSelectElement = (
      <TeaTagSelect
        ref={ref}
        options={options}
        placeholder={placeholder}
        autoClearSearchValue={autoClearSearchValue}
        hideCloseButton={hideCloseButton}
        className={className}
        {...props}
      />
    );

    if (label) {
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          {tagSelectElement}
        </div>
      );
    }

    return tagSelectElement;
  }
);

TagSelect.displayName = 'TagSelect';

export { TagSelect };
export type { TagOption };
