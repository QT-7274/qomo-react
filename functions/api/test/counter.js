/**
 * EdgeOne Pages 边缘函数 - 访问计数器
 * 完全按照官方示例格式编写
 */

export async function onRequest({ request, params, env, qomo }) {
    // 设置 CORS 头
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
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

        // 获取 qomo KV 命名空间的 key
        let count = await qomo.get('visit_count');
        count = Number(count || 0) + 1;

        // 重新写入 visit_count 键值
        await qomo.put('visit_count', String(count));

        // 同时记录访问时间
        const now = new Date().toISOString();
        await qomo.put('last_visit', now);

        // 获取用户信息
        const userAgent = request.headers.get('User-Agent') || 'Unknown';
        const clientIP = request.headers.get('CF-Connecting-IP') || 'Unknown';

        return new Response(JSON.stringify({
            success: true,
            message: `欢迎访问 Qomo！这是第 ${count} 次访问`,
            data: {
                visitCount: count,
                lastVisit: now,
                userAgent: userAgent,
                clientIP: clientIP,
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
            error: '计数器更新失败: ' + error.message,
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders,
            },
        });
    }
}
