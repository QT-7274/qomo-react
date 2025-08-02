/**
 * AI 优化 Hook
 * 利用 EdgeOne 边缘函数提供 AI 提示词优化功能
 */

import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface OptimizationResult {
  original: string;
  optimized: string;
  optimizations: Array<{
    type: string;
    message: string;
    suggestion: string;
  }>;
  score: number;
  suggestions: string[];
}

interface AnalysisResult {
  length: number;
  wordCount: number;
  hasRole: boolean;
  hasFormat: boolean;
  hasExamples: boolean;
  complexity: 'low' | 'medium' | 'high';
  readability: 'easy' | 'moderate' | 'difficult';
}

interface AIOptimizeState {
  isOptimizing: boolean;
  isAnalyzing: boolean;
  isTranslating: boolean;
  error: string | null;
}

export const useAIOptimize = () => {
  const { showNotification } = useAppStore();
  const [state, setState] = useState<AIOptimizeState>({
    isOptimizing: false,
    isAnalyzing: false,
    isTranslating: false,
    error: null,
  });

  /**
   * 优化提示词
   */
  const optimizePrompt = useCallback(async (
    prompt: string,
    language: string = 'zh-CN'
  ): Promise<OptimizationResult | null> => {
    if (!prompt.trim()) {
      showNotification({
        type: 'warning',
        title: '提示',
        message: '请输入要优化的提示词',
      });
      return null;
    }

    setState(prev => ({ ...prev, isOptimizing: true, error: null }));

    try {
      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          type: 'optimize',
          language,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '优化失败');
      }

      showNotification({
        type: 'success',
        title: '优化完成',
        message: `提示词评分：${result.data.score}/100`,
      });

      return result.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '优化失败';
      setState(prev => ({ ...prev, error: errorMessage }));
      
      showNotification({
        type: 'error',
        title: '优化失败',
        message: errorMessage,
      });
      
      return null;
    } finally {
      setState(prev => ({ ...prev, isOptimizing: false }));
    }
  }, [showNotification]);

  /**
   * 分析提示词
   */
  const analyzePrompt = useCallback(async (
    prompt: string,
    language: string = 'zh-CN'
  ): Promise<AnalysisResult | null> => {
    if (!prompt.trim()) {
      return null;
    }

    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          type: 'analyze',
          language,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '分析失败');
      }

      return result.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '分析失败';
      setState(prev => ({ ...prev, error: errorMessage }));
      return null;
    } finally {
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  }, []);

  /**
   * 翻译提示词
   */
  const translatePrompt = useCallback(async (
    prompt: string,
    targetLanguage: string = 'en-US'
  ): Promise<string | null> => {
    if (!prompt.trim()) {
      showNotification({
        type: 'warning',
        title: '提示',
        message: '请输入要翻译的提示词',
      });
      return null;
    }

    setState(prev => ({ ...prev, isTranslating: true, error: null }));

    try {
      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          type: 'translate',
          language: targetLanguage,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '翻译失败');
      }

      showNotification({
        type: 'success',
        title: '翻译完成',
        message: '提示词已翻译',
      });

      return result.data.translated;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '翻译失败';
      setState(prev => ({ ...prev, error: errorMessage }));
      
      showNotification({
        type: 'error',
        title: '翻译失败',
        message: errorMessage,
      });
      
      return null;
    } finally {
      setState(prev => ({ ...prev, isTranslating: false }));
    }
  }, [showNotification]);

  /**
   * 获取改进建议
   */
  const getSuggestions = useCallback(async (
    prompt: string,
    language: string = 'zh-CN'
  ): Promise<string[] | null> => {
    if (!prompt.trim()) {
      return null;
    }

    try {
      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          type: 'suggest',
          language,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '获取建议失败');
      }

      return result.data.suggestions.map((s: any) => s.message);
    } catch (error) {
      console.error('获取建议失败:', error);
      return null;
    }
  }, []);

  /**
   * 批量优化模板中的所有组件
   */
  const optimizeTemplate = useCallback(async (
    templateComponents: Array<{ content: string; type: string }>,
    language: string = 'zh-CN'
  ) => {
    const optimizedComponents = [];
    
    setState(prev => ({ ...prev, isOptimizing: true, error: null }));

    try {
      for (const component of templateComponents) {
        if (component.content.trim()) {
          const result = await optimizePrompt(component.content, language);
          if (result) {
            optimizedComponents.push({
              ...component,
              content: result.optimized,
              originalContent: result.original,
              optimizations: result.optimizations,
            });
          } else {
            optimizedComponents.push(component);
          }
        } else {
          optimizedComponents.push(component);
        }
      }

      showNotification({
        type: 'success',
        title: '模板优化完成',
        message: `已优化 ${optimizedComponents.length} 个组件`,
      });

      return optimizedComponents;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '模板优化失败';
      setState(prev => ({ ...prev, error: errorMessage }));
      
      showNotification({
        type: 'error',
        title: '模板优化失败',
        message: errorMessage,
      });
      
      return templateComponents;
    } finally {
      setState(prev => ({ ...prev, isOptimizing: false }));
    }
  }, [optimizePrompt, showNotification]);

  return {
    // 状态
    ...state,
    
    // 操作方法
    optimizePrompt,
    analyzePrompt,
    translatePrompt,
    getSuggestions,
    optimizeTemplate,
    
    // 工具方法
    isLoading: state.isOptimizing || state.isAnalyzing || state.isTranslating,
    hasError: !!state.error,
  };
};
