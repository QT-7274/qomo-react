/**
 * 国际化相关的 React Hooks
 * 提供便捷的多语言文本获取和语言切换功能
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18nStore, loadLanguagePackage, SupportedLanguage, LanguagePackage } from './index';

/**
 * 使用国际化的主要 Hook
 * 提供当前语言包、语言切换功能和加载状态
 */
export const useI18n = () => {
  const { currentLanguage, setLanguage, isLoading, setLoading } = useI18nStore();
  const [languagePackage, setLanguagePackage] = useState<LanguagePackage | null>(null);

  // 加载语言包
  const loadCurrentLanguage = useCallback(async () => {
    try {
      setLoading(true);
      const pkg = await loadLanguagePackage(currentLanguage);
      setLanguagePackage(pkg);
    } catch (error) {
      console.error('Failed to load language package:', error);
    } finally {
      setLoading(false);
    }
  }, [currentLanguage, setLoading]);

  // 切换语言
  const changeLanguage = useCallback(async (language: SupportedLanguage) => {
    try {
      setLoading(true);
      setLanguage(language);
      const pkg = await loadLanguagePackage(language);
      setLanguagePackage(pkg);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setLoading(false);
    }
  }, [setLanguage, setLoading]);

  // 翻译函数 - 简洁的 t() 函数，直接使用中文作为键
  const t = useCallback((chineseText: string): string => {
    if (!languagePackage) {
      return chineseText; // 如果语言包未加载，返回原文
    }
    return languagePackage[chineseText] || chineseText; // 返回翻译或原文
  }, [languagePackage]);

  // 初始化加载当前语言
  useEffect(() => {
    loadCurrentLanguage();
  }, [loadCurrentLanguage]);

  return {
    currentLanguage,
    languagePackage,
    changeLanguage,
    isLoading,
    t, // 简洁的翻译函数
  };
};

/**
 * 语言切换 Hook
 * 专门用于语言切换功能
 */
export const useLanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, isLoading } = useI18n();

  return {
    currentLanguage,
    changeLanguage,
    isLoading,
  };
};
