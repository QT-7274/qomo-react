/**
 * EdgeOne Pages 边缘函数 - 保存模板
 * 将用户的模板保存到 KV 存储中
 */

export async function onRequest({ request, params, env, qomo }) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // 处理 OPTIONS 预检请求
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

  return handleSaveTemplate(request, env, qomo, corsHeaders);
}

/**
 * 处理保存模板请求
 */
async function handleSaveTemplate(request, env, qomo, corsHeaders) {
  try {
    // 检查 KV 存储是否可用
    if (!qomo) {
      return new Response(JSON.stringify({
        success: false,
        error: 'KV 存储未配置',
        details: {
          message: 'KV 命名空间 qomo 未找到',
          solution: '请在 EdgeOne Pages 控制台配置 KV 命名空间绑定 qomo'
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const templateData = await request.json();

    // 验证必要字段
    if (!templateData.id || !templateData.name) {
      return new Response(JSON.stringify({
        success: false,
        error: '缺少必要字段：id 或 name',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // 获取用户信息（可以从请求头或认证信息中获取）
    const userId = templateData.userId || 'anonymous';
    
    // 构建 KV 存储的键名
    const key = `template:${userId}:${templateData.id}`;
    
    // 准备存储的数据
    const dataToStore = {
      ...templateData,
      updatedAt: new Date().toISOString(),
      version: templateData.version || '1.0.0',
    };

    // 存储到 KV（使用 qomo 命名空间）
    await qomo.put(key, JSON.stringify(dataToStore), {
      metadata: {
        userId: userId,
        templateName: templateData.name,
        category: templateData.category || 'default',
        isPublic: templateData.isPublic || false,
        createdAt: new Date().toISOString(),
      }
    });

    // 如果是公开模板，也存储到公开区域
    if (templateData.isPublic) {
      const publicKey = `public:template:${templateData.id}`;
      await qomo.put(publicKey, JSON.stringify({
        ...dataToStore,
        publishedBy: userId,
        publishedAt: new Date().toISOString(),
      }), {
        metadata: {
          author: userId,
          category: templateData.category || 'default',
          publishedAt: new Date().toISOString(),
        }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: '模板保存成功',
      data: {
        id: templateData.id,
        key: key,
        isPublic: templateData.isPublic,
      }
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error) {
    console.error('保存模板失败:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: '保存模板失败: ' + error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}
