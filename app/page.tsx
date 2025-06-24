'use client';

import React from 'react';
import ChatInterface from '@/components/chat-interface';

const ChatPage: React.FC = () => {
  return (
    <div className="fixed-width-container">
      <ChatInterface />
    </div>
  );
};

export default ChatPage;