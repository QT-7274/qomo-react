/**
 * EdgeOne Pages 边缘函数 - 获取模板列表
 * 从 KV 存储中获取用户的模板列表或公开模板
 */

export async function onRequest({ request, params, env }) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // 处理 OPTIONS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  return handleListTemplates(request, corsHeaders);
}

/**
 * 处理获取模板列表请求
 */
async function handleListTemplates(request, corsHeaders) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId') || 'anonymous';
    const type = url.searchParams.get('type') || 'user'; // 'user' 或 'public'
    const category = url.searchParams.get('category');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let prefix;
    if (type === 'public') {
      prefix = 'public:template:';
    } else {
      prefix = `template:${userId}:`;
    }

    // 从 KV 存储获取模板列表
    const listResult = await qomo.list({
      prefix: prefix,
      limit: limit,
    });

    // 调试信息
    console.log('Debug info:', {
      userId,
      type,
      prefix,
      foundKeys: listResult.keys?.length || 0,
      keys: listResult.keys?.map(k => k.name) || []
    });

    const templates = [];

    // 批量获取模板详细数据
    for (const item of listResult.keys) {
      try {
        const templateData = await qomo.get(item.name);
        if (templateData) {
          const template = JSON.parse(templateData);
          
          // 如果指定了分类，进行过滤
          if (!category || template.category === category) {
            // 添加元数据信息
            templates.push({
              ...template,
              metadata: item.metadata,
              key: item.name,
            });
          }
        }
      } catch (error) {
        console.error(`解析模板数据失败 ${item.name}:`, error);
        // 继续处理其他模板，不中断整个流程
      }
    }

    // 按更新时间排序（最新的在前）
    templates.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return new Response(JSON.stringify({
      success: true,
      data: {
        templates: templates,
        total: templates.length,
        hasMore: !listResult.list_complete,
        cursor: listResult.cursor,
      },
      debug: {
        userId,
        type,
        prefix,
        foundKeys: listResult.keys?.length || 0,
        rawKeys: listResult.keys?.map(k => k.name) || []
      }
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error) {
    console.error('获取模板列表失败:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: '获取模板列表失败: ' + error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}
