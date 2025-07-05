import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'tea-component';

import Toast from '@/components/ui/Toast';
import Sidebar, { TopBar } from '@/components/layout/Sidebar';

import EditorPage from '@/pages/EditorPage';
import LibraryPage from '@/pages/LibraryPage';
import SessionsPage from '@/pages/SessionsPage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ConfigProvider>
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
                    <Route path="/" element={<Navigate to="/editor" replace />} />
                    <Route path="/editor" element={<EditorPage />} />
                    <Route path="/library" element={<LibraryPage />} />
                    <Route path="/sessions" element={<SessionsPage />} />
                  </Routes>
                </div>
              </div>
            </div>
          </div>

          {/* Toast Notifications */}
          <Toast />
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
