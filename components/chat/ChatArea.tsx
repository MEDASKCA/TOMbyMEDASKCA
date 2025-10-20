'use client';

import React, { useState } from 'react';
import { Video, Phone, Users, Paperclip, Send, Smile } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import MessageList from './MessageList';
import { useMessages } from '@/hooks/useMessages';

interface ChatAreaProps {
  teamId: string;
  channelId: string;
}

export default function ChatArea({ teamId, channelId }: ChatAreaProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const { messages, loading, error, sendMessage } = useMessages(teamId, channelId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    try {
      await sendMessage(
        message,
        user.uid,
        user.displayName || 'Anonymous',
        user.email || '',
        user.photoURL || ''
      );
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="h-16 border-b border-gray-300 px-6 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">#{channelId}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
            <Video size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
            <Phone size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
            <Users size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500">
          <p className="text-red-700 text-sm">Error loading messages: {error}</p>
        </div>
      )}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading messages...</div>
        </div>
      ) : (
        <MessageList messages={messages} />
      )}

      {/* Message Input */}
      <div className="border-t border-gray-300 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex-1 bg-white border border-gray-300 rounded-lg p-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message #${channelId}`}
              className="w-full resize-none focus:outline-none text-sm"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <div className="flex items-center space-x-2 mt-2">
              <button
                type="button"
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <Paperclip size={18} className="text-gray-500" />
              </button>
              <button
                type="button"
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <Smile size={18} className="text-gray-500" />
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg hover:from-blue-700 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
