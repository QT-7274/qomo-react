/**
 * EdgeOne Pages 边缘函数 - KV 存储 API 代理
 * 处理 KV 存储的增删改查操作
 *
 * 路径示例：
 * - /api/kv/put
 * - /api/kv/get
 * - /api/kv/delete
 * - /api/kv/list
 */

export async function onRequest({ request, env, params }) {
  // 获取请求路径中的操作类型
  const action = params.action;

  // 设置 CORS 头
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // 处理 OPTIONS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  return handleRequest(request, action, corsHeaders);
}

/**
 * 处理具体的请求
 */
async function handleRequest(request, action, corsHeaders) {
  try {
    let result;

    switch (action) {
      case 'put':
        result = await handlePut(request);
        break;
      case 'get':
        result = await handleGet(request);
        break;
      case 'delete':
        result = await handleDelete(request);
        break;
      case 'list':
        result = await handleList(request);
        break;
      default:
        result = { success: false, error: '不支持的操作' };
    }

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

/**
 * 处理存储操作
 */
async function handlePut(request) {
  const { key, value, metadata } = await request.json();
  
  if (!key || !value) {
    return { success: false, error: '缺少必要参数' };
  }

  try {
    // 使用 EdgeOne KV 存储（qomo 命名空间）
    await qomo.put(key, value, {
      metadata: metadata || {},
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 处理获取操作
 */
async function handleGet(request) {
  const { key } = await request.json();

  if (!key) {
    return { success: false, error: '缺少 key 参数' };
  }

  try {
    const value = await qomo.get(key);

    if (value === null) {
      return { success: false, error: '数据不存在' };
    }

    return { success: true, data: value };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 处理删除操作
 */
async function handleDelete(request) {
  const { key } = await request.json();

  if (!key) {
    return { success: false, error: '缺少 key 参数' };
  }

  try {
    await qomo.delete(key);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 处理列表操作
 */
async function handleList(request) {
  const { prefix, limit = 100 } = await request.json();

  try {
    const options = { limit };
    if (prefix) {
      options.prefix = prefix;
    }

    const result = await qomo.list(options);

    return {
      success: true,
      data: {
        keys: result.keys,
        complete: result.complete,
        cursor: result.cursor,
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
