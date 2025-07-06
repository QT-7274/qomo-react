import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'tea-component';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Toast from '@/components/ui/Toast';
import Sidebar, { TopBar } from '@/components/layout/Sidebar';
import DevTools from '@/components/dev/DevTools';
import { useAppStore } from '@/store/useAppStore';

import EditorPage from '@/pages/EditorPage';
import LibraryPage from '@/pages/LibraryPage';
import ComponentsPage from '@/pages/ComponentsPage';
import SessionsPage from '@/pages/SessionsPage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { initStorage, loadTemplatesFromStorage, loadComponentsFromStorage } = useAppStore();

  // 初始化存储并加载数据
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initStorage();
        await loadTemplatesFromStorage();
        await loadComponentsFromStorage();
      } catch (error) {
        console.error('应用初始化失败:', error);
      }
    };

    initializeApp();
  }, [initStorage, loadTemplatesFromStorage, loadComponentsFromStorage]);

  return (
    <ConfigProvider>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <div className='min-h-screen bg-white'>
            <div className='flex h-screen'>
              {/* Sidebar */}
              <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />

              {/* Main Content */}
              <div className='flex-1 flex flex-col overflow-hidden'>
                {/* Top Bar */}
                <TopBar
                  sidebarOpen={sidebarOpen}
                  onToggleSidebar={() => setSidebarOpen(true)}
                />

                {/* Content Area */}
                <div className='flex-1 overflow-auto p-6 bg-gray-50'>
                  <div className='h-full'>
                    <Routes>
                      <Route path="/" element={<Navigate to="/editor?mode=use" replace />} />
                      <Route path="/editor" element={<EditorPage />} />
                      <Route path="/library" element={<LibraryPage />} />
                      <Route path="/components" element={<ComponentsPage />} />
                      <Route path="/sessions" element={<SessionsPage />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </div>

            {/* Toast Notifications */}
            <Toast />

            {/* Development Tools - Only shown in development */}
            <DevTools />
          </div>
        </Router>
      </DndProvider>
    </ConfigProvider>
  );
}

export default App;
