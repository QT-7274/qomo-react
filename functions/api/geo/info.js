/**
 * EdgeOne Pages 边缘函数 - 地理位置信息获取
 * 根据用户的地理位置信息自动判断语言偏好
 */

export async function onRequest({ request }) {
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
        // 从 EdgeOne 获取地理位置信息
        const geo = request.eo?.geo || {};
        
        // 从请求头获取客户端IP（作为备用）
        const clientIp = request.headers.get('CF-Connecting-IP') || 
                        request.headers.get('X-Forwarded-For') || 
                        request.headers.get('X-Real-IP') || 
                        '未知';

        // 生成唯一标识符
        const uuid = Date.now().toString() + Math.random().toString(36).substr(2, 9);

        // 根据国家代码推荐语言
        const recommendedLanguage = getRecommendedLanguage(geo.countryCodeAlpha2);

        // 构建响应数据
        const responseData = {
            geo: {
                asn: geo.asn || null,
                countryName: geo.countryName || '未知',
                countryCodeAlpha2: geo.countryCodeAlpha2 || null,
                countryCodeAlpha3: geo.countryCodeAlpha3 || null,
                countryCodeNumeric: geo.countryCodeNumeric || null,
                regionName: geo.regionName || '未知',
                regionCode: geo.regionCode || null,
                cityName: geo.cityName || '未知',
                latitude: geo.latitude || null,
                longitude: geo.longitude || null,
                cisp: geo.cisp || '未知'
            },
            clientIp: clientIp,
            uuid: uuid,
            recommendedLanguage: recommendedLanguage,
            timestamp: new Date().toISOString()
        };

        return new Response(JSON.stringify(responseData), {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                ...corsHeaders,
            },
        });

    } catch (error) {
        console.error('获取地理位置信息失败:', error);
        
        return new Response(JSON.stringify({
            success: false,
            error: '获取地理位置信息失败: ' + error.message,
            details: {
                errorType: error.constructor.name,
                errorMessage: error.message,
            },
            // 提供默认值
            geo: {
                countryName: '未知',
                countryCodeAlpha2: null,
            },
            clientIp: '未知',
            uuid: Date.now().toString(),
            recommendedLanguage: 'zh-CN', // 默认中文
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                ...corsHeaders,
            },
        });
    }
}

/**
 * 根据国家代码推荐语言
 * @param {string} countryCode - 国家代码 (Alpha2)
 * @returns {string} 推荐的语言代码
 */
function getRecommendedLanguage(countryCode) {
    // 英语国家/地区
    const englishCountries = [
        'US', // 美国
        'GB', // 英国
        'CA', // 加拿大
        'AU', // 澳大利亚
        'NZ', // 新西兰
        'IE', // 爱尔兰
        'ZA', // 南非
        'SG', // 新加坡
        'IN', // 印度
        'PH', // 菲律宾
        'MY', // 马来西亚
        'HK', // 香港
    ];

    // 中文国家/地区
    const chineseCountries = [
        'CN', // 中国大陆
        'TW', // 台湾
        'MO', // 澳门
    ];

    if (!countryCode) {
        return 'zh-CN'; // 默认中文
    }

    const upperCountryCode = countryCode.toUpperCase();

    if (chineseCountries.includes(upperCountryCode)) {
        return 'zh-CN';
    }

    if (englishCountries.includes(upperCountryCode)) {
        return 'en-US';
    }

    // 其他国家默认使用英文
    return 'en-US';
}
