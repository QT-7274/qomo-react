/**
 * EdgeOne Pages 边缘函数 - 删除模板
 * 从 KV 存储中删除指定的模板
 */

export async function onRequest({ request, params, env }) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // 处理 OPTIONS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'DELETE' && request.method !== 'POST') {
    return new Response(JSON.stringify({
      success: false,
      error: '仅支持 DELETE 或 POST 请求',
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return handleDeleteTemplate(request, corsHeaders);
}

/**
 * 处理删除模板请求
 */
async function handleDeleteTemplate(request, corsHeaders) {
  try {
    let templateId, userId;
    
    if (request.method === 'DELETE') {
      // 从 URL 参数获取
      const url = new URL(request.url);
      templateId = url.searchParams.get('id');
      userId = url.searchParams.get('userId') || 'anonymous';
    } else {
      // 从请求体获取
      const requestData = await request.json();
      templateId = requestData.templateId;
      userId = requestData.userId || 'anonymous';
    }

    if (!templateId) {
      return new Response(JSON.stringify({
        success: false,
        error: '缺少模板 ID',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // 构建 KV 存储的键名
    const userKey = `template:${userId}:${templateId}`;
    const publicKey = `public:template:${templateId}`;

    // 检查模板是否存在
    const templateData = await qomo.get(userKey);
    if (!templateData) {
      return new Response(JSON.stringify({
        success: false,
        error: '模板不存在',
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // 解析模板数据以检查是否为公开模板
    const template = JSON.parse(templateData);

    // 删除用户的模板
    await qomo.delete(userKey);

    // 如果是公开模板，也删除公开区域的副本
    if (template.isPublic) {
      try {
        await qomo.delete(publicKey);
      } catch (error) {
        console.warn('删除公开模板副本失败:', error);
        // 不中断主流程，因为用户模板已经删除成功
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: '模板删除成功',
      data: {
        templateId: templateId,
        deletedKeys: template.isPublic ? [userKey, publicKey] : [userKey],
      }
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error) {
    console.error('删除模板失败:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: '删除模板失败: ' + error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}
