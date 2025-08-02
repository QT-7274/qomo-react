/**
 * EdgeOne Pages 边缘函数 - 环境变量调试
 * 帮助调试 KV 存储配置问题
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
        // 获取所有环境变量名称（不包含值，保护敏感信息）
        const envVarNames = Object.keys(env);
        
        // 检查 KV 存储配置
        const kvStatus = {
            qomoExists: !!qomo,
            qomoType: typeof qomo,
            qomoMethods: qomo ? Object.getOwnPropertyNames(Object.getPrototypeOf(qomo)) : [],
        };

        // 基本环境信息
        const envInfo = {
            timestamp: new Date().toISOString(),
            userAgent: request.headers.get('User-Agent'),
            cfRay: request.headers.get('CF-Ray'),
            cfCountry: request.headers.get('CF-IPCountry'),
            method: request.method,
            url: request.url,
        };

        // 尝试简单的 KV 操作（如果可用）
        let kvTest = null;
        if (qomo) {
            try {
                // 尝试读取一个不存在的键
                const testResult = await qomo.get('debug-test-key');
                kvTest = {
                    success: true,
                    message: 'KV 存储可用',
                    testResult: testResult === null ? 'null (正常)' : testResult,
                };
            } catch (error) {
                kvTest = {
                    success: false,
                    message: 'KV 存储不可用',
                    error: error.message,
                };
            }
        } else {
            kvTest = {
                success: false,
                message: 'KV 存储未配置',
                solution: '请在 EdgeOne Pages 控制台配置 KV 命名空间绑定 qomo',
            };
        }

        return new Response(JSON.stringify({
            success: true,
            message: '环境调试信息',
            data: {
                environment: {
                    availableEnvVars: envVarNames,
                    totalEnvVars: envVarNames.length,
                },
                kvStorage: kvStatus,
                kvTest: kvTest,
                request: envInfo,
                recommendations: generateRecommendations(kvStatus, envVarNames),
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
            error: '环境调试失败: ' + error.message,
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

/**
 * 生成配置建议
 */
function generateRecommendations(kvStatus, envVarNames) {
    const recommendations = [];

    if (!kvStatus.qomoExists) {
        recommendations.push({
            type: 'error',
            title: '缺少 KV 存储配置',
            message: '环境变量 qomo 未找到',
            action: '在 EdgeOne Pages 控制台添加环境变量 qomo，值为 KV 命名空间 ID',
        });
    } else if (kvStatus.qomoType !== 'object') {
        recommendations.push({
            type: 'warning',
            title: 'KV 存储类型异常',
            message: `qomo 类型为 ${kvStatus.qomoType}，应该为 object`,
            action: '检查 KV 命名空间 ID 是否正确',
        });
    } else {
        recommendations.push({
            type: 'success',
            title: 'KV 存储配置正常',
            message: '环境变量 qomo 已正确配置',
            action: '可以开始使用 KV 存储功能',
        });
    }

    if (envVarNames.length === 0) {
        recommendations.push({
            type: 'warning',
            title: '没有环境变量',
            message: '当前没有配置任何环境变量',
            action: '检查 EdgeOne Pages 项目配置',
        });
    }

    return recommendations;
}
