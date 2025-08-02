/**
 * 语言切换组件
 * 提供多语言切换功能，支持中英文切换
 */

import React, { useState } from 'react';
import { Select, Button } from 'tea-component';
import { Globe } from 'lucide-react';
import { useLanguageSwitcher, useI18n } from '@/i18n/hooks';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/i18n';
import { cn } from '@/utils';

interface LanguageSwitcherProps {
  className?: string;
  size?: 'xs' | 's' | 'm' | 'l';
  variant?: 'primary' | 'weak' | 'text' | 'link';
  showText?: boolean; // 是否显示文本，默认只显示图标
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className,
  size = 's',
  variant = 'text',
  showText = false,
}) => {
  const { currentLanguage, changeLanguage, isLoading } = useLanguageSwitcher();
  const { t } = useI18n();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // 获取当前语言配置
  const currentLangConfig = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage);

  // 处理语言切换
  const handleLanguageChange = async (language: SupportedLanguage) => {
    try {
      await changeLanguage(language);
      setDropdownVisible(false);
      
      // 显示切换成功提示
      console.log('Language changed successfully');
    } catch (error) {
      console.error('Language change failed:', error);
    }
  };

  // 创建选择器选项
  const selectOptions = SUPPORTED_LANGUAGES.map(lang => ({
    value: lang.code,
    text: `${lang.flag} ${lang.nativeName}`,
  }));

  return (
    <div className={cn('relative', className)}>
      <Select
        value={currentLanguage}
        options={selectOptions}
        onChange={(value) => handleLanguageChange(value as SupportedLanguage)}
        size={size}
        disabled={isLoading}
        className={cn(
          'min-w-[120px]',
          isLoading && 'cursor-not-allowed opacity-50'
        )}
        placeholder={t('语言')}
      />
    </div>
  );
};

export default LanguageSwitcher;
