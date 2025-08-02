/**
 * 语言切换组件
 * 提供多语言切换功能，支持中英文切换
 */

import React from 'react';
import { Select } from 'tea-component';
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
  variant = 'text', // 保留以备将来使用
  showText = false, // 保留以备将来使用
}) => {
  // 暂时忽略未使用的参数警告
  void variant;
  void showText;
  const { currentLanguage, changeLanguage, isLoading } = useLanguageSwitcher();
  const { t } = useI18n();

  // 处理语言切换
  const handleLanguageChange = async (language: SupportedLanguage) => {
    try {
      await changeLanguage(language);

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
