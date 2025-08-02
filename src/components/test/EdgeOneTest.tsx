/**
 * EdgeOne 功能测试组件
 * 用于测试 EdgeOne Pages 的 KV 存储和边缘函数功能
 */

import React, { useState } from 'react';
import { Card } from 'tea-component';
import { useAppStore } from '@/store/useAppStore';
import TeaButton from '@/components/common/TeaButton';
import { Input, Textarea } from '@/components/common/TeaInput';

interface TestResult {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

const EdgeOneTest: React.FC = () => {
  const { showNotification } = useAppStore();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [templateData, setTemplateData] = useState({
    name: '测试模板',
    description: '这是一个测试模板',
    category: 'test',
    isPublic: false,
  });

  /**
   * 执行测试请求
   */
  const executeTest = async (testName: string, url: string, options?: RequestInit) => {
    setLoading(prev => ({ ...prev, [testName]: true }));

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // 检查响应内容类型
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        if (text.includes('<!doctype') || text.includes('<html')) {
          throw new Error('API 端点不存在 - 请确保已部署 EdgeOne Pages 函数');
        }
        throw new Error(`响应不是 JSON 格式: ${contentType}`);
      }

      const result = await response.json();

      setResults(prev => ({ ...prev, [testName]: result }));

      if (result.success) {
        showNotification({
          type: 'success',
          title: '测试成功',
          message: `${testName} 测试通过`,
        });
      } else {
        showNotification({
          type: 'error',
          title: '测试失败',
          message: result.error || `${testName} 测试失败`,
        });
      }
    } catch (error) {
      let errorMessage = '网络错误';

      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = '无法连接到服务器 - 请检查网络连接';
        } else if (error.message.includes('API 端点不存在')) {
          errorMessage = 'EdgeOne Pages 函数未部署 - 请先部署 functions 文件夹';
        } else {
          errorMessage = error.message;
        }
      }

      const errorResult = {
        success: false,
        error: errorMessage,
        details: error instanceof Error ? error.message : String(error),
      };

      setResults(prev => ({ ...prev, [testName]: errorResult }));

      showNotification({
        type: 'error',
        title: '测试失败',
        message: errorMessage,
      });
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  /**
   * 模拟测试结果（用于本地开发）
   */
  const simulateTest = (testName: string, mockData: any) => {
    setLoading(prev => ({ ...prev, [testName]: true }));

    setTimeout(() => {
      setResults(prev => ({ ...prev, [testName]: mockData }));
      setLoading(prev => ({ ...prev, [testName]: false }));

      showNotification({
        type: mockData.success ? 'success' : 'error',
        title: mockData.success ? '模拟测试成功' : '模拟测试失败',
        message: `${testName} - ${mockData.message}`,
      });
    }, 1000);
  };

  /**
   * 测试 KV 存储基本功能
   */
  const testKVStorage = () => {
    // 检查是否为本地开发环境
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      simulateTest('KV存储', {
        success: true,
        message: 'KV 存储测试成功！（模拟）',
        data: {
          testKey: 'test:' + Date.now(),
          storedValue: {
            message: 'Hello from EdgeOne KV! (Mock)',
            timestamp: new Date().toISOString(),
          },
          testResults: {
            write: '✅ 写入成功（模拟）',
            read: '✅ 读取成功（模拟）',
            list: '✅ 列表成功（模拟）',
            delete: '✅ 删除成功（模拟）',
          }
        }
      });
    } else {
      executeTest('KV存储', '/api/test/kv');
    }
  };

  /**
   * 测试访问计数器
   */
  const testCounter = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      simulateTest('访问计数器', {
        success: true,
        message: `欢迎访问 Qomo！这是第 ${Math.floor(Math.random() * 100) + 1} 次访问（模拟）`,
        data: {
          visitCount: Math.floor(Math.random() * 100) + 1,
          lastVisit: new Date().toISOString(),
          userAgent: navigator.userAgent,
          clientIP: '127.0.0.1 (本地)',
        }
      });
    } else {
      executeTest('访问计数器', '/api/test/counter');
    }
  };

  /**
   * 测试保存模板
   */
  const testSaveTemplate = () => {
    const template = {
      id: 'test-' + Date.now(),
      ...templateData,
      userId: 'test-user',
      components: [
        {
          id: 'comp-1',
          type: 'basic_info',
          content: '这是测试内容',
        }
      ],
    };

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      simulateTest('保存模板', {
        success: true,
        message: '模板保存成功',
        data: {
          id: template.id,
          key: `template:test-user:${template.id}`,
          isPublic: template.isPublic,
        }
      });
    } else {
      executeTest('保存模板', '/api/templates/save', {
        method: 'POST',
        body: JSON.stringify(template),
      });
    }
  };

  /**
   * 测试获取模板列表
   */
  const testGetTemplates = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      simulateTest('获取模板', {
        success: true,
        data: {
          templates: [
            {
              id: 'test-1',
              name: '测试模板 1',
              description: '这是一个测试模板',
              category: 'test',
              updatedAt: new Date().toISOString(),
              components: [{ id: 'comp-1', type: 'basic_info', content: '测试内容' }]
            },
            {
              id: 'test-2',
              name: '测试模板 2',
              description: '另一个测试模板',
              category: 'productivity',
              updatedAt: new Date(Date.now() - 86400000).toISOString(),
              components: [{ id: 'comp-2', type: 'question_slot', content: '问题内容' }]
            }
          ],
          total: 2,
          hasMore: false,
        }
      });
    } else {
      executeTest('获取模板', '/api/templates/list?userId=test-user&type=user');
    }
  };

  /**
   * 渲染测试结果
   */
  const renderResult = (testName: string) => {
    const result = results[testName];
    if (!result) return null;

    return (
      <div className="mt-2 p-3 bg-gray-50 rounded">
        <div className={`font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
          {result.success ? '✅ 成功' : '❌ 失败'}
        </div>
        {result.message && (
          <div className="text-sm text-gray-600 mt-1">{result.message}</div>
        )}
        {result.error && (
          <div className="text-sm text-red-600 mt-1">{result.error}</div>
        )}
        {result.data && (
          <details className="mt-2">
            <summary className="text-sm text-blue-600 cursor-pointer">查看详细数据</summary>
            <pre className="text-xs bg-white p-2 mt-1 rounded border overflow-auto">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <Card.Body>
          <h2 className="text-xl font-bold mb-4">EdgeOne Pages 功能测试</h2>
          <p className="text-gray-600 mb-4">
            测试 EdgeOne Pages 的 KV 存储和边缘函数功能。请确保已正确配置 KV 命名空间。
          </p>

          {/* 开发环境提示 */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 text-lg">ℹ️</div>
              <div>
                <h3 className="font-medium text-blue-800 mb-2">测试环境说明</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• <strong>本地环境</strong>：使用模拟数据进行功能演示</p>
                  <p>• <strong>生产环境</strong>：连接真实的 EdgeOne Pages 函数</p>
                  <p>• 部署时需要将 <code className="bg-blue-100 px-1 rounded">functions</code> 文件夹上传到 EdgeOne Pages</p>
                  <p>• 配置环境变量：<code className="bg-blue-100 px-1 rounded">qomo = your-kv-namespace-id</code></p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* 基础功能测试 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">基础功能测试</h3>
              <div className="flex flex-wrap gap-3">
                <TeaButton
                  variant="primary"
                  loading={loading['KV存储']}
                  onClick={testKVStorage}
                >
                  测试 KV 存储
                </TeaButton>
                <TeaButton
                  variant="primary"
                  loading={loading['访问计数器']}
                  onClick={testCounter}
                >
                  测试访问计数器
                </TeaButton>
              </div>

              {renderResult('KV存储')}
              {renderResult('访问计数器')}
            </div>

            {/* 分割线 */}
            <div className="border-t border-gray-200"></div>

            {/* 模板功能测试 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">模板功能测试</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">模板名称</label>
                  <Input
                    value={templateData.name}
                    onChange={(value) => setTemplateData(prev => ({ ...prev, name: value }))}
                    placeholder="输入模板名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">分类</label>
                  <Input
                    value={templateData.category}
                    onChange={(value) => setTemplateData(prev => ({ ...prev, category: value }))}
                    placeholder="输入分类"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">描述</label>
                <Textarea
                  value={templateData.description}
                  onChange={(value) => setTemplateData(prev => ({ ...prev, description: value }))}
                  placeholder="输入模板描述"
                  rows={3}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <TeaButton
                  variant="primary"
                  loading={loading['保存模板']}
                  onClick={testSaveTemplate}
                >
                  测试保存模板
                </TeaButton>
                <TeaButton
                  variant="weak"
                  loading={loading['获取模板']}
                  onClick={testGetTemplates}
                >
                  测试获取模板
                </TeaButton>
              </div>

              {renderResult('保存模板')}
              {renderResult('获取模板')}
            </div>

            {/* 分割线 */}
            <div className="border-t border-gray-200"></div>

            {/* 测试说明 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">测试说明</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• <strong>KV 存储测试</strong>：测试基本的增删改查功能</p>
                <p>• <strong>访问计数器</strong>：简单的计数器，验证 KV 读写</p>
                <p>• <strong>保存模板</strong>：测试模板保存到云端功能</p>
                <p>• <strong>获取模板</strong>：测试从云端获取模板列表</p>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EdgeOneTest;
