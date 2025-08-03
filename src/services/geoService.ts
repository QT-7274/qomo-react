/**
 * 地理位置服务
 * 提供基于EdgeOne Functions的地理位置信息获取和语言推荐功能
 */

import { SupportedLanguage } from '@/i18n';

// 地理位置信息接口
export interface GeoInfo {
  asn: number | null;
  countryName: string;
  countryCodeAlpha2: string | null;
  countryCodeAlpha3: string | null;
  countryCodeNumeric: string | null;
  regionName: string;
  regionCode: string | null;
  cityName: string;
  latitude: number | null;
  longitude: number | null;
  cisp: string;
}

// 地理位置响应接口
export interface GeoResponse {
  geo: GeoInfo;
  clientIp: string;
  uuid: string;
  recommendedLanguage: SupportedLanguage;
  timestamp: string;
  success?: boolean;
  error?: string;
}

// 缓存键名
const GEO_CACHE_KEY = 'qomo-geo-cache';
const GEO_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时

/**
 * 获取地理位置信息和推荐语言
 */
export const getGeoInfo = async (): Promise<GeoResponse | null> => {
  try {
    // 检查缓存
    const cached = getCachedGeoInfo();
    if (cached) {
      console.log('使用缓存的地理位置信息:', cached);
      return cached;
    }

    // 调用EdgeOne Functions API
    const response = await fetch('/api/geo/info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const geoData: GeoResponse = await response.json();
    
    // 缓存结果
    setCachedGeoInfo(geoData);
    
    console.log('获取地理位置信息成功:', geoData);
    return geoData;

  } catch (error) {
    console.error('获取地理位置信息失败:', error);
    
    // 返回默认值
    return {
      geo: {
        asn: null,
        countryName: '未知',
        countryCodeAlpha2: null,
        countryCodeAlpha3: null,
        countryCodeNumeric: null,
        regionName: '未知',
        regionCode: null,
        cityName: '未知',
        latitude: null,
        longitude: null,
        cisp: '未知'
      },
      clientIp: '未知',
      uuid: Date.now().toString(),
      recommendedLanguage: 'zh-CN', // 默认中文
      timestamp: new Date().toISOString(),
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
};

/**
 * 获取缓存的地理位置信息
 */
const getCachedGeoInfo = (): GeoResponse | null => {
  try {
    const cached = localStorage.getItem(GEO_CACHE_KEY);
    if (!cached) return null;

    const data = JSON.parse(cached);
    const cacheTime = new Date(data.timestamp).getTime();
    const now = Date.now();

    // 检查缓存是否过期
    if (now - cacheTime > GEO_CACHE_DURATION) {
      localStorage.removeItem(GEO_CACHE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.error('读取地理位置缓存失败:', error);
    localStorage.removeItem(GEO_CACHE_KEY);
    return null;
  }
};

/**
 * 缓存地理位置信息
 */
const setCachedGeoInfo = (geoData: GeoResponse): void => {
  try {
    localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(geoData));
  } catch (error) {
    console.error('缓存地理位置信息失败:', error);
  }
};

/**
 * 清除地理位置缓存
 */
export const clearGeoCache = (): void => {
  try {
    localStorage.removeItem(GEO_CACHE_KEY);
    console.log('地理位置缓存已清除');
  } catch (error) {
    console.error('清除地理位置缓存失败:', error);
  }
};

/**
 * 检查是否应该根据地理位置自动设置语言
 * 只有在用户没有手动设置过语言时才自动设置
 */
export const shouldAutoSetLanguage = (): boolean => {
  try {
    // 检查是否存在用户手动设置的语言偏好
    const i18nStorage = localStorage.getItem('i18n-storage');
    if (!i18nStorage) return true;

    const data = JSON.parse(i18nStorage);

    // 检查是否有明确的用户设置标记
    // 如果没有userSet标记，说明是首次访问，可以自动设置
    return !data.state?.userSet;
  } catch (error) {
    console.error('检查语言设置状态失败:', error);
    return true; // 出错时默认允许自动设置
  }
};

/**
 * 标记语言为用户手动设置
 * 这个函数现在通过i18n store来设置，保持向后兼容
 */
export const markLanguageAsUserSet = (): void => {
  try {
    // 这个函数现在主要用于向后兼容
    // 实际的设置会通过 useI18nStore 的 setUserSet 方法来完成
    const i18nStorage = localStorage.getItem('i18n-storage');
    if (i18nStorage) {
      const data = JSON.parse(i18nStorage);
      data.state = data.state || {};
      data.state.userSet = true;
      localStorage.setItem('i18n-storage', JSON.stringify(data));
    }
  } catch (error) {
    console.error('标记语言设置状态失败:', error);
  }
};
