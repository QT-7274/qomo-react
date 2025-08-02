/**
 * 国际化系统核心文件
 * 提供多语言支持和动态语言切换功能
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 支持的语言类型
export type SupportedLanguage = 'zh-CN' | 'en-US';

// 语言配置接口
export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

// 支持的语言列表
export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    flag: '🇨🇳',
  },
  {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English',
    flag: '🇺🇸',
  },
];

// 国际化状态接口
interface I18nState {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

// 创建国际化状态管理
export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      currentLanguage: 'zh-CN', // 默认语言
      setLanguage: (language: SupportedLanguage) => {
        set({ currentLanguage: language });
      },
      isLoading: false,
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'i18n-storage', // 本地存储键名
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ currentLanguage: state.currentLanguage }),
    }
  )
);

// 简洁的语言包类型定义 - 直接使用中文作为键
export interface LanguagePackage {
  [chineseText: string]: string;
}

// 语言包存储
const languagePackages: Record<SupportedLanguage, LanguagePackage | null> = {
  'zh-CN': null,
  'en-US': null,
};

// 动态加载语言包
export const loadLanguagePackage = async (language: SupportedLanguage): Promise<LanguagePackage> => {
  if (languagePackages[language]) {
    return languagePackages[language]!;
  }
  
  try {
    const module = await import(`./locales/${language}.ts`);
    languagePackages[language] = module.default;
    return module.default;
  } catch (error) {
    console.error(`Failed to load language package for ${language}:`, error);
    // 如果加载失败，返回中文作为后备
    if (language !== 'zh-CN') {
      return loadLanguagePackage('zh-CN');
    }
    throw error;
  }
};

// 获取当前语言包
export const getCurrentLanguagePackage = async (): Promise<LanguagePackage> => {
  const { currentLanguage } = useI18nStore.getState();
  return loadLanguagePackage(currentLanguage);
};
