/**
 * 国际化相关的 React Hooks
 * 提供便捷的多语言文本获取和语言切换功能
 */

import { useState, useEffect, useCallback } from 'react';
import { useI18nStore, loadLanguagePackage, SupportedLanguage, LanguagePackage } from './index';
import { getGeoInfo, shouldAutoSetLanguage, markLanguageAsUserSet, GeoResponse } from '@/services/geoService';

/**
 * 使用国际化的主要 Hook
 * 提供当前语言包、语言切换功能和加载状态
 */
export const useI18n = () => {
  const { currentLanguage, setLanguage, isLoading, setLoading, userSet, setUserSet } = useI18nStore();
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
    userSet,
    setUserSet,
    t, // 简洁的翻译函数
  };
};

/**
 * 语言切换 Hook
 * 专门用于语言切换功能
 */
export const useLanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, isLoading, setUserSet } = useI18n();

  // 手动切换语言时标记为用户设置
  const handleLanguageChange = useCallback(async (language: SupportedLanguage) => {
    await changeLanguage(language);
    setUserSet(true); // 标记为用户手动设置
    markLanguageAsUserSet(); // 向后兼容
  }, [changeLanguage, setUserSet]);

  return {
    currentLanguage,
    changeLanguage: handleLanguageChange,
    isLoading,
  };
};

/**
 * 地理位置自动语言检测 Hook
 * 根据用户地理位置自动设置语言偏好
 */
export const useGeoLanguageDetection = () => {
  const { changeLanguage, currentLanguage, userSet } = useI18n();
  const [geoInfo, setGeoInfo] = useState<GeoResponse | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [hasDetected, setHasDetected] = useState(false);

  // 执行地理位置检测和语言设置
  const detectAndSetLanguage = useCallback(async () => {
    if (hasDetected || isDetecting) return;

    try {
      setIsDetecting(true);

      // 检查是否应该自动设置语言（优先使用状态管理中的标记）
      if (userSet || !shouldAutoSetLanguage()) {
        console.log('用户已手动设置语言，跳过自动检测');
        setHasDetected(true);
        return;
      }

      // 获取地理位置信息
      const geoData = await getGeoInfo();
      setGeoInfo(geoData);

      if (geoData && geoData.recommendedLanguage && geoData.recommendedLanguage !== currentLanguage) {
        console.log(`根据地理位置 ${geoData.geo.countryName} 推荐语言: ${geoData.recommendedLanguage}`);
        await changeLanguage(geoData.recommendedLanguage);
        console.log(`语言已自动切换为: ${geoData.recommendedLanguage}`);
      }

      setHasDetected(true);
    } catch (error) {
      console.error('地理位置语言检测失败:', error);
      setHasDetected(true);
    } finally {
      setIsDetecting(false);
    }
  }, [changeLanguage, currentLanguage, userSet, hasDetected, isDetecting]);

  // 在组件挂载时执行检测
  useEffect(() => {
    detectAndSetLanguage();
  }, [detectAndSetLanguage]);

  return {
    geoInfo,
    isDetecting,
    hasDetected,
    detectAndSetLanguage,
  };
};
