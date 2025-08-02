/**
 * EdgeOne Pages 边缘函数 - 访问计数器
 * 完全按照官方示例格式编写
 */

export async function onRequest({ request, params, env }) {
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
        // 获取变量名为 qomo 的命名空间 key
        let count = await env.qomo.get('visit_count');
        count = Number(count || 0) + 1;
        
        // 重新写入 visit_count 键值
        await env.qomo.put('visit_count', String(count));

        // 同时记录访问时间
        const now = new Date().toISOString();
        await env.qomo.put('last_visit', now);

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
