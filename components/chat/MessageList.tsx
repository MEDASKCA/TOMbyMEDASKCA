'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: Date;
  avatar?: string;
}

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className="flex space-x-3">
            <div className="flex-shrink-0">
              {msg.avatar ? (
                <div className="relative w-10 h-10">
                  <Image
                    src={msg.avatar}
                    alt={msg.userName}
                    fill
                    className="rounded-full object-cover"
                    sizes="40px"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white font-semibold shadow-md">
                  {msg.userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline space-x-2">
                <span className="font-semibold text-sm">{msg.userName}</span>
                <span className="text-xs text-gray-500">
                  {format(new Date(msg.timestamp), 'h:mm a')}
                </span>
              </div>
              <p className="text-sm mt-1 text-gray-800">{msg.text}</p>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
