/**
 * EdgeOne Pages 边缘函数 - 查看所有 KV 键
 * 调试用：查看 KV 存储中的所有键名
 */

export async function onRequest({ request, params, env }) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
                error: 'KV 存储未配置'
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders,
                },
            });
        }

        // 获取所有键（限制数量避免超时）
        const allKeys = await qomo.list({ limit: 100 });
        
        // 按前缀分组
        const keysByPrefix = {};
        const otherKeys = [];
        
        for (const keyInfo of allKeys.keys) {
            const keyName = keyInfo.name;
            
            if (keyName.startsWith('template:')) {
                const parts = keyName.split(':');
                const userId = parts[1];
                const prefix = `template:${userId}`;
                
                if (!keysByPrefix[prefix]) {
                    keysByPrefix[prefix] = [];
                }
                keysByPrefix[prefix].push({
                    key: keyName,
                    metadata: keyInfo.metadata
                });
            } else if (keyName.startsWith('public:template:')) {
                if (!keysByPrefix['public:template']) {
                    keysByPrefix['public:template'] = [];
                }
                keysByPrefix['public:template'].push({
                    key: keyName,
                    metadata: keyInfo.metadata
                });
            } else {
                otherKeys.push({
                    key: keyName,
                    metadata: keyInfo.metadata
                });
            }
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'KV 存储键列表',
            data: {
                totalKeys: allKeys.keys.length,
                hasMore: !allKeys.list_complete,
                keysByPrefix: keysByPrefix,
                otherKeys: otherKeys,
                rawKeys: allKeys.keys.map(k => k.name),
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
            error: '获取键列表失败: ' + error.message,
            details: {
                errorType: error.constructor.name,
                errorMessage: error.message,
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
