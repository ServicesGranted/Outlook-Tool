'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';
import gsLogo from './GSHAND_HIRES_WHITE.png';
import TimestampDisplay from '@/components/timestamp-display';
import { useAuth } from '@/components/auth-context';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const { token, isAuthenticated, login, logout } = useAuth();
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Email Assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!prompt.trim()) return;

    // 1) Show the user's message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: prompt,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setIsLoading(true);

    let replyText = '';
    let raw = ''; // Moved outside try block
    try {
      const res = await fetch('/api/n8n', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          query: prompt,
          userCredentials: token
            ? { id: 'nFRdh6ECDj2XCXiy', name: 'Microsoft Outlook account', token }
            : null,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

      // Grab the raw text
      raw = await res.text();

      // Parse JSON and extract the message
      const data = JSON.parse(raw);
      if (Array.isArray(data) && data[0]?.message?.content?.message) {
        replyText = data[0].message.content.message;
      } else {
        replyText = raw; // Fallback to raw response if parsing fails
      }
    } catch (e: any) {
      replyText = `Error: ${e.message}`;
      if (/401|403/.test(e.message)) {
        replyText += ' Please authenticate with Outlook.';
      }
      console.log('Error details:', e.message, 'Raw response:', raw);
    }

    // 2) Show the assistant’s reply
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: replyText,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-[90vw] max-w-4xl mx-auto glass-container fade-in">
        <div className="p-6 border-b border-white/10 flex justify-center">
          <img src={gsLogo.src} alt="GS Logo" className="w-1/2 h-auto object-contain" />
        </div>
        <div className="h-96 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} slide-up`}
            >
              <div className="flex items-start gap-3 max-w-[80%]">
                {!msg.isUser && (
                  <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                    <Bot className="w-4 h-4 text-blue-400" />
                  </div>
                )}
                <div
                  className={`message-bubble p-4 whitespace-pre-wrap ${
                    Date.now() - msg.timestamp.getTime() < 5000 ? 'message-recent' : ''
                  }`}
                >
                  {msg.text}
                  <TimestampDisplay
                    timestamp={msg.timestamp}
                    className="text-xs text-gray-500 mt-2 self-end"
                  />
                </div>
                {msg.isUser && (
                  <div className="p-2 rounded-full bg-blue-500/20 backdrop-blur-sm">
                    <User className="w-4 h-4 text-blue-400" />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-6 border-t border-white/10">
          <form onSubmit={handleSubmit} className="flex items-start gap-4 mb-4">
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={2}
              disabled={isLoading}
              className="glass-input resize-none flex-1 min-h-[56px] max-h-[96px] p-3 focus:outline-none focus:drop-shadow-[0_0_8px_rgba(59,130,246,1)]"
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim() || !isAuthenticated}
              className="glass-button send-button px-10 py-5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </form>
          <div className="flex justify-center">
            <button
              onClick={isAuthenticated ? logout : login}
              className="glass-button action-button px-10 py-5"
            >
              {isAuthenticated ? 'Sign Out' : 'Login with Outlook'}
            </button>
          </div>
          <div className="mt-4 text-center">
            <span className="text-xs text-gray-500">
              {isAuthenticated ? (
                <span className="text-green-400">✓ Authenticated</span>
              ) : (
                <span className="text-red-400">⚠ Not signed in</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;