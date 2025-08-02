/**
 * EdgeOne Pages 边缘函数 - AI 提示词优化
 * 利用边缘计算能力优化和增强用户的提示词
 */

export async function onRequest({ request, params, env }) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      success: false,
      error: '仅支持 POST 请求',
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return handleOptimizeRequest(request, env, corsHeaders);
}

/**
 * 处理优化请求
 */
async function handleOptimizeRequest(request, env, corsHeaders) {
  try {
    const { prompt, type = 'optimize', language = 'zh-CN' } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({
        success: false,
        error: '缺少 prompt 参数',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    let result;

    switch (type) {
      case 'optimize':
        result = await optimizePrompt(prompt, language, env);
        break;
      case 'translate':
        result = await translatePrompt(prompt, language, env);
        break;
      case 'analyze':
        result = await analyzePrompt(prompt, language, env);
        break;
      case 'suggest':
        result = await suggestImprovements(prompt, language, env);
        break;
      default:
        result = { success: false, error: '不支持的操作类型' };
    }

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

/**
 * 优化提示词
 */
async function optimizePrompt(prompt, language, env) {
  // 这里可以集成各种 AI 服务，如腾讯云 AI、OpenAI 等
  // 示例使用简单的规则优化
  
  const optimizations = [];
  let optimizedPrompt = prompt;

  // 1. 检查提示词长度
  if (prompt.length < 50) {
    optimizations.push({
      type: 'length',
      message: language === 'zh-CN' ? '提示词过短，建议添加更多细节' : 'Prompt too short, consider adding more details',
      suggestion: language === 'zh-CN' ? '添加具体的要求、格式说明或示例' : 'Add specific requirements, format instructions, or examples',
    });
  }

  // 2. 检查是否包含角色定义
  if (!prompt.includes('你是') && !prompt.includes('You are') && !prompt.includes('作为')) {
    optimizations.push({
      type: 'role',
      message: language === 'zh-CN' ? '建议添加角色定义' : 'Consider adding role definition',
      suggestion: language === 'zh-CN' ? '例如："你是一个专业的..."' : 'For example: "You are a professional..."',
    });
    
    // 自动添加角色定义
    const rolePrefix = language === 'zh-CN' ? '你是一个专业的助手。' : 'You are a professional assistant.';
    optimizedPrompt = `${rolePrefix}\n\n${optimizedPrompt}`;
  }

  // 3. 检查是否包含输出格式要求
  if (!prompt.includes('格式') && !prompt.includes('format') && !prompt.includes('输出')) {
    optimizations.push({
      type: 'format',
      message: language === 'zh-CN' ? '建议添加输出格式要求' : 'Consider adding output format requirements',
      suggestion: language === 'zh-CN' ? '明确指定输出的格式、结构或样式' : 'Specify the format, structure, or style of the output',
    });
  }

  // 4. 添加结构化标记
  if (!optimizedPrompt.includes('##') && !optimizedPrompt.includes('**')) {
    const structuredPrompt = optimizedPrompt
      .split('\n')
      .map(line => {
        if (line.trim() && !line.startsWith('#') && !line.startsWith('*')) {
          return line;
        }
        return line;
      })
      .join('\n');
    
    optimizedPrompt = structuredPrompt;
  }

  return {
    success: true,
    data: {
      original: prompt,
      optimized: optimizedPrompt,
      optimizations,
      score: calculatePromptScore(optimizedPrompt),
      suggestions: generateSuggestions(optimizedPrompt, language),
    },
  };
}

/**
 * 翻译提示词
 */
async function translatePrompt(prompt, targetLanguage, env) {
  // 简单的翻译逻辑，实际项目中可以集成翻译 API
  const translations = {
    'zh-CN': {
      'You are': '你是',
      'Please': '请',
      'Generate': '生成',
      'Create': '创建',
      'Write': '写',
      'Explain': '解释',
    },
    'en-US': {
      '你是': 'You are',
      '请': 'Please',
      '生成': 'Generate',
      '创建': 'Create',
      '写': 'Write',
      '解释': 'Explain',
    },
  };

  let translatedPrompt = prompt;
  const targetTranslations = translations[targetLanguage] || {};

  Object.entries(targetTranslations).forEach(([key, value]) => {
    translatedPrompt = translatedPrompt.replace(new RegExp(key, 'g'), value);
  });

  return {
    success: true,
    data: {
      original: prompt,
      translated: translatedPrompt,
      targetLanguage,
    },
  };
}

/**
 * 分析提示词
 */
async function analyzePrompt(prompt, language, env) {
  const analysis = {
    length: prompt.length,
    wordCount: prompt.split(/\s+/).length,
    hasRole: prompt.includes('你是') || prompt.includes('You are'),
    hasFormat: prompt.includes('格式') || prompt.includes('format'),
    hasExamples: prompt.includes('例如') || prompt.includes('example'),
    complexity: calculateComplexity(prompt),
    readability: calculateReadability(prompt),
  };

  return {
    success: true,
    data: analysis,
  };
}

/**
 * 建议改进
 */
async function suggestImprovements(prompt, language, env) {
  const suggestions = [];

  // 基于分析结果生成建议
  if (prompt.length < 100) {
    suggestions.push({
      type: 'detail',
      priority: 'high',
      message: language === 'zh-CN' ? '增加更多细节描述' : 'Add more detailed descriptions',
    });
  }

  if (!prompt.includes('步骤') && !prompt.includes('step')) {
    suggestions.push({
      type: 'structure',
      priority: 'medium',
      message: language === 'zh-CN' ? '考虑添加步骤化指导' : 'Consider adding step-by-step guidance',
    });
  }

  return {
    success: true,
    data: { suggestions },
  };
}

/**
 * 计算提示词评分
 */
function calculatePromptScore(prompt) {
  let score = 0;
  
  // 长度评分 (0-30分)
  if (prompt.length > 200) score += 30;
  else if (prompt.length > 100) score += 20;
  else if (prompt.length > 50) score += 10;

  // 结构评分 (0-25分)
  if (prompt.includes('你是') || prompt.includes('You are')) score += 10;
  if (prompt.includes('格式') || prompt.includes('format')) score += 10;
  if (prompt.includes('例如') || prompt.includes('example')) score += 5;

  // 清晰度评分 (0-25分)
  const sentences = prompt.split(/[。！？.!?]/).filter(s => s.trim());
  if (sentences.length > 3) score += 15;
  else if (sentences.length > 1) score += 10;

  // 专业性评分 (0-20分)
  const professionalWords = ['专业', '详细', '准确', 'professional', 'detailed', 'accurate'];
  const foundWords = professionalWords.filter(word => prompt.includes(word));
  score += Math.min(foundWords.length * 5, 20);

  return Math.min(score, 100);
}

/**
 * 计算复杂度
 */
function calculateComplexity(prompt) {
  const sentences = prompt.split(/[。！？.!?]/).filter(s => s.trim());
  const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
  
  if (avgLength > 50) return 'high';
  if (avgLength > 25) return 'medium';
  return 'low';
}

/**
 * 计算可读性
 */
function calculateReadability(prompt) {
  const words = prompt.split(/\s+/);
  const sentences = prompt.split(/[。！？.!?]/).filter(s => s.trim());
  const avgWordsPerSentence = words.length / sentences.length;
  
  if (avgWordsPerSentence > 20) return 'difficult';
  if (avgWordsPerSentence > 10) return 'moderate';
  return 'easy';
}

/**
 * 生成改进建议
 */
function generateSuggestions(prompt, language) {
  const suggestions = [];
  
  if (language === 'zh-CN') {
    suggestions.push('考虑添加具体的使用场景');
    suggestions.push('明确输出的格式要求');
    suggestions.push('提供一个具体的示例');
  } else {
    suggestions.push('Consider adding specific use cases');
    suggestions.push('Clarify output format requirements');
    suggestions.push('Provide a concrete example');
  }
  
  return suggestions;
}
