import React from 'react';
import { MessageSquare } from 'lucide-react';

const SessionsPage: React.FC = () => {
  return (
    <div className='text-center py-12'>
      <MessageSquare className='w-16 h-16 mx-auto mb-4 text-gray-400' />
      <h3 className='text-xl font-semibold text-gray-800 mb-2'>
        会话记录
      </h3>
      <p className='text-gray-600'>此功能正在开发中...</p>
    </div>
  );
};

export default SessionsPage;
