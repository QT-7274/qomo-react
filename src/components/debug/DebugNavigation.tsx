/**
 * 调试页面导航组件
 * 只在调试分支中显示，提供调试页面的快速导航
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card } from 'tea-component';
import { Cloud, Database, Settings, Home } from 'lucide-react';
import { ROUTES } from '@/config/constants';

export const DebugNavigation: React.FC = () => {
  const location = useLocation();

  const debugRoutes = [
    {
      path: ROUTES.HOME,
      name: '返回首页',
      icon: Home,
      description: '返回应用主页'
    },
    {
      path: ROUTES.DEBUG_CLOUD,
      name: '云端同步调试',
      icon: Cloud,
      description: '管理云端模板，测试同步功能'
    },
    {
      path: ROUTES.DEBUG_KV,
      name: 'KV 存储测试',
      icon: Database,
      description: '测试 EdgeOne KV 存储功能'
    }
  ];

  // 检查是否在调试路由中
  const isDebugRoute = location.pathname.startsWith('/debug');

  if (!isDebugRoute) {
    return null;
  }

  return (
    <Card className="mb-6">
      <Card.Body>
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">调试导航</h3>
          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
            调试分支
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {debugRoutes.map((route) => {
            const isActive = location.pathname === route.path;
            const Icon = route.icon;
            
            return (
              <Link
                key={route.path}
                to={route.path}
                className={`block p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  isActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-6 h-6 mt-1 ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <div>
                    <h4 className={`font-medium ${
                      isActive ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {route.name}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      isActive ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                      {route.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-medium text-sm">调试分支说明</p>
              <p className="text-yellow-700 text-sm mt-1">
                这些调试页面只在特定的调试分支中可用，用于开发和测试云端功能。
                在主分支中，这些路由将不可访问。
              </p>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
