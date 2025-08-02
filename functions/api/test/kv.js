/**
 * EdgeOne Pages 边缘函数 - KV 存储测试
 * 测试 KV 存储的基本功能
 */

export async function onRequest({ request, params, env, qomo }) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // 处理 OPTIONS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

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
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // 测试写入
    const testKey = 'test:' + Date.now();
    const testValue = JSON.stringify({
      message: 'Hello from EdgeOne KV!',
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('User-Agent'),
    });

    await qomo.put(testKey, testValue, {
      metadata: {
        type: 'test',
        createdAt: new Date().toISOString(),
      }
    });

    // 测试读取
    const retrievedValue = await qomo.get(testKey);
    const parsedValue = JSON.parse(retrievedValue);

    // 测试列表
    const listResult = await qomo.list({
      prefix: 'test:',
      limit: 5,
    });

    // 清理测试数据
    await qomo.delete(testKey);

    return new Response(JSON.stringify({
      success: true,
      message: 'KV 存储测试成功！',
      data: {
        testKey: testKey,
        storedValue: parsedValue,
        listCount: listResult.keys.length,
        testResults: {
          write: '✅ 写入成功',
          read: '✅ 读取成功',
          list: '✅ 列表成功',
          delete: '✅ 删除成功',
        }
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'KV 存储测试失败: ' + error.message,
      details: {
        errorType: error.constructor.name,
        errorMessage: error.message,
        stack: error.stack,
      }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}
