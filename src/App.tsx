// 导入 React Hooks 和必要的库
import { useState, useEffect } from 'react'; // useState 用于管理组件状态，useEffect 用于处理副作用
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // React Router 库用于管理路由
import { ConfigProvider } from 'tea-component'; // tea-component 提供的全局配置组件
import { DndProvider } from 'react-dnd'; // 拖放功能的提供者
import { HTML5Backend } from 'react-dnd-html5-backend'; // HTML5 拖放后端实现

// 导入自定义组件
import Toast from '@/components/ui/Toast'; // 提示框组件
import Sidebar from '@/components/layout/Sidebar'; // 侧边栏组件
import TopBar from '@/components/layout/TopBar'; // 顶部导航栏组件
import DevTools from '@/components/dev/DevTools'; // 开发工具组件
import { useAppStore } from '@/store/useAppStore'; // 自定义状态管理
import { useI18n } from '@/i18n/hooks'; // 国际化Hook

// 导入页面组件
import EditorPage from '@/pages/EditorPage'; // 编辑器页面
import LibraryPage from '@/pages/LibraryPage'; // 资源库页面
import ComponentsPage from '@/pages/ComponentsPage'; // 组件页面
import I18nDemo from '@/components/demo/I18nDemo'; // 国际化演示页面
import EdgeOneTest from '@/components/test/EdgeOneTest'; // EdgeOne 功能测试页面
import { CloudSyncDemo } from '@/components/cloud/CloudSyncDemo'; // 云端同步演示页面
import { ROUTES, EDITOR_MODES } from '@/config/constants'; // 配置化的路由和编辑器模式

// 主应用组件
function App() {
  // 使用 useState 声明 sidebarOpen 状态，初始值为 true
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // 从状态管理中获取初始化和加载函数
  const { initStorage, loadTemplatesFromStorage, loadComponentsFromStorage } = useAppStore();
  // 初始化国际化系统
  const { isLoading: i18nLoading } = useI18n();

  // 组件加载时初始化存储和加载数据
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 初始化存储
        await initStorage();
        // 从存储中加载模板
        await loadTemplatesFromStorage();
        // 从存储中加载组件
        await loadComponentsFromStorage();
      } catch (error) {
        // 如果初始化失败，打印错误信息
        console.error('应用初始化失败:', error);
      }
    };

    // 调用初始化函数
    initializeApp();
  }, [initStorage, loadTemplatesFromStorage, loadComponentsFromStorage]); // 依赖项，确保函数在这些变化时重新执行

  return (
    <ConfigProvider> {/* tea-component 的全局配置提供器 */}
      <DndProvider backend={HTML5Backend}> {/* 拖放功能提供者，使用 HTML5 后端 */}
        <Router> {/* 路由器，管理页面导航 */}
          <div className='min-h-screen bg-white'> {/* 设置最小高度和背景色 */}
            <div className='flex h-screen'> {/* 使用弹性布局 */}
              {/* 侧边栏组件 */}
              <Sidebar
                isOpen={sidebarOpen} // 侧边栏是否打开
                onClose={() => setSidebarOpen(false)} // 关闭侧边栏的函数
              />

              {/* 主内容区域 */}
              <div className='flex-1 flex flex-col overflow-hidden'> {/* 弹性布局，允许主内容区域扩展 */}
                {/* 顶部导航栏 */}
                <TopBar
                  sidebarOpen={sidebarOpen} // 传递侧边栏状态
                  onToggleSidebar={() => setSidebarOpen(true)} // 切换侧边栏的函数
                />

                {/* 内容区域 */}
                <div className='flex-1 overflow-auto p-3 bg-gray-50'> {/* 自适应布局，添加内边距和背景色 */}
                  <div className='h-full'> {/* 设置高度为 100% */}
                    <Routes> {/* 路由配置 - 使用配置化的路由常量 */}
                      {/* 默认重定向到编辑器页面的使用模式 */}
                      <Route path={ROUTES.HOME} element={<Navigate to={`${ROUTES.EDITOR}?mode=${EDITOR_MODES.USE}`} replace />} />
                      {/* 编辑器页面路由 */}
                      <Route path={ROUTES.EDITOR} element={<EditorPage />} />
                      {/* 模板库页面路由 */}
                      <Route path={ROUTES.LIBRARY} element={<LibraryPage />} />
                      {/* 组件库页面路由 */}
                      <Route path={ROUTES.COMPONENTS} element={<ComponentsPage />} />
                      {/* 国际化演示页面路由 */}
                      <Route path={ROUTES.I18N_DEMO} element={<I18nDemo />} />
                      {/* EdgeOne 功能测试页面路由 */}
                      <Route path={ROUTES.EDGEONE_TEST} element={<EdgeOneTest />} />
                      {/* 云端同步演示页面路由 */}
                      <Route path="/cloud-sync" element={<CloudSyncDemo />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </div>

            {/* 提示框组件，用于显示通知 */}
            <Toast />

            {/* 开发工具组件，仅在开发模式下显示 */}
            <DevTools />
          </div>
        </Router>
      </DndProvider>
    </ConfigProvider>
  );
}

export default App; // 导出 App 组件
