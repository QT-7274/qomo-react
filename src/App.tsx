import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfigProvider } from 'tea-component';
import {
  Wand2,
  BookOpen,
  MessageSquare,
  Settings,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useAppStore } from './store/useAppStore';
import { cn } from './utils';
import Button from './components/ui/Button';

import Toast from './components/ui/Toast';

import TemplateLibrary from './components/template/TemplateLibrary';
import TemplateEditor from './components/template/TemplateEditor';

function App() {
  const { ui, setActiveTab, user } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tabs = [
    { id: 'editor', label: '模板编辑器', icon: Wand2, color: 'primary' },
    { id: 'library', label: '模板库', icon: BookOpen, color: 'success' },
    { id: 'sessions', label: '会话记录', icon: MessageSquare, color: 'warning' },
  ];

  const getTabContent = () => {
    switch (ui.activeTab) {
      case 'editor':
        return <TemplateEditor />;
      case 'library':
        return <TemplateLibrary />;
      case 'sessions':
        return (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">会话记录</h3>
            <p className="text-gray-600">此功能正在开发中...</p>
          </div>
        );
      default:
        return <TemplateEditor />;
    }
  };

  return (
    <ConfigProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-white">

        <div className="flex h-screen">
          {/* Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-80 bg-gray-50 border-r border-gray-200"
              >
                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-gray-800">Qomo</h1>
                        <p className="text-xs text-gray-600">AI模板系统</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidebarOpen(false)}
                      icon={<X className="w-4 h-4" />}
                      className="lg:hidden"
                    />
                  </div>

                  {/* User Info */}
                  {user && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-gray-800 font-medium">{user.name}</h3>
                          <p className="text-gray-600 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = ui.activeTab === tab.id;

                      return (
                        <motion.button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                            'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                            isActive
                              ? 'bg-blue-50 text-blue-600 shadow-sm'
                              : 'text-gray-700 hover:text-gray-900'
                          )}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{tab.label}</span>
                          {isActive && (
                            <motion.div
                              layoutId="activeTab"
                              className="ml-auto w-2 h-2 bg-blue-600 rounded-full"
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </nav>

                  {/* Quick Stats */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-gray-800 font-medium mb-3">快速统计</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>已创建模板</span>
                        <span>3</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>模板库</span>
                        <span>12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {!sidebarOpen && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidebarOpen(true)}
                      icon={<Menu className="w-4 h-4" />}
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {tabs.find(tab => tab.id === ui.activeTab)?.label}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {ui.activeTab === 'editor' && '创建和编辑AI提示模板'}
                      {ui.activeTab === 'library' && '管理您的模板库'}
                      {ui.activeTab === 'sessions' && '查看历史会话记录'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Settings className="w-4 h-4" />}
                >
                  设置
                </Button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              <motion.div
                key={ui.activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {getTabContent()}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Toast Notifications */}
        <Toast />
        </div>
      </DndProvider>
    </ConfigProvider>
  );
}

export default App;
