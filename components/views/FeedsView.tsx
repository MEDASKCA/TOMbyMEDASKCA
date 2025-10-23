'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  Clock,
  Users,
  Activity,
  Award,
  Calendar,
  X,
  Send,
  Sparkles,
  Package,
  ClipboardList
} from 'lucide-react';

// TOM AI Panel Component
function TomAIPanel() {
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    { icon: Package, text: "Do we need any implants next week?" },
    { icon: ClipboardList, text: "What's needed for Mr. Smith's procedure?" },
    { icon: Calendar, text: "Show tomorrow's schedule" },
    { icon: Users, text: "Who's available for emergencies tonight?" }
  ];

  const handleAIQuery = (promptText?: string) => {
    const textToSend = promptText || aiInput;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setAiMessages(prev => [...prev, userMessage]);
    setAiInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm TOM AI, your Theatre Operations Manager assistant. I'm currently in development and will soon help with scheduling, inventory, staffing, and procedures!",
        timestamp: new Date()
      };
      setAiMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3 border-b border-teal-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">TOM AI</h2>
            <p className="text-xs text-teal-100">Your Operations Assistant</p>
          </div>
        </div>
      </div>

      {/* Messages or Quick Prompts */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {aiMessages.length === 0 ? (
          <div>
            <p className="text-xs text-gray-600 mb-3 text-center">Ask me anything about theatre operations:</p>
            <div className="space-y-2">
              {quickPrompts.map((prompt, index) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleAIQuery(prompt.text)}
                    className="w-full text-left p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors group"
                  >
                    <div className="flex items-start space-x-2">
                      <Icon className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-700 group-hover:text-gray-900">{prompt.text}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {aiMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    message.role === 'user'
                      ? 'bg-teal-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-1 mb-1">
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      <span className="text-[10px] font-semibold text-gray-600">TOM AI</span>
                    </div>
                  )}
                  <p className="text-xs leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-1 mb-1">
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    <span className="text-[10px] font-semibold text-gray-600">TOM AI</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-3 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAIQuery();
              }
            }}
            placeholder="Ask TOM AI..."
            className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <button
            onClick={() => handleAIQuery()}
            disabled={!aiInput.trim() || isTyping}
            className={`p-2 rounded-lg transition-colors ${
              aiInput.trim() && !isTyping
                ? 'bg-teal-600 hover:bg-teal-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeedsView() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [showComments, setShowComments] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');

  // Current user info - would come from auth context in production
  const currentUser = {
    name: 'Alexander Monterubio',
    initials: 'AM',
    role: 'Theatre Operations Manager'
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleComment = (postId: number) => {
    if (!commentText.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...(post.comments || []), {
            id: Date.now(),
            author: currentUser.name,
            text: commentText,
            timestamp: 'Just now'
          }]
        };
      }
      return post;
    }));
    setCommentText('');
  };
  const feedItems = [
    {
      id: 1,
      type: 'announcement',
      icon: Info,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      author: 'Theatre Management',
      authorRole: 'Admin',
      timestamp: '2 hours ago',
      title: 'New Equipment Installed in Main Theatre 7',
      content: 'We have successfully installed the new Da Vinci Xi Robotic System in Main Theatre 7. All staff are invited to attend the training session on Friday at 14:00.',
      image: null,
      likes: 24,
      comments: 7,
      shares: 3
    },
    {
      id: 2,
      type: 'alert',
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      author: 'Clinical Operations',
      authorRole: 'Manager',
      timestamp: '3 hours ago',
      title: 'Theatre 9 Closure Extended',
      content: 'Due to ongoing HVAC repairs, Main Theatre 9 will remain closed until Monday 28th October. All scheduled cases have been redistributed to other theatres.',
      image: null,
      likes: 12,
      comments: 15,
      shares: 5
    },
    {
      id: 3,
      type: 'achievement',
      icon: Award,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      author: 'Quality Assurance',
      authorRole: 'Department',
      timestamp: '5 hours ago',
      title: 'Outstanding Performance - October Week 3',
      content: 'Congratulations to the entire theatre team! We achieved 98% on-time starts this week and maintained zero SSI (Surgical Site Infections) for the 6th consecutive month. Special recognition to Main Theatre 3 Cardiac team for 100% efficiency.',
      image: null,
      likes: 89,
      comments: 23,
      shares: 12
    },
    {
      id: 4,
      type: 'update',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      author: 'Dr. Sarah Mitchell',
      authorRole: 'Anaesthetist',
      timestamp: '6 hours ago',
      title: 'New Anaesthetic Protocol Approved',
      content: 'The updated Enhanced Recovery After Surgery (ERAS) protocol has been approved and will be implemented from next Monday. Digital copies are available on the staff portal.',
      image: null,
      likes: 45,
      comments: 18,
      shares: 8
    },
    {
      id: 5,
      type: 'stats',
      icon: TrendingUp,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      author: 'Analytics Team',
      authorRole: 'Data',
      timestamp: '8 hours ago',
      title: 'Weekly Performance Summary',
      content: 'This week: 247 procedures completed, 18min average turnover time (target 20min), 94% theatre utilisation, 12 emergency cases handled. Excellent work team!',
      image: null,
      likes: 67,
      comments: 11,
      shares: 6
    },
    {
      id: 6,
      type: 'announcement',
      icon: Calendar,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      author: 'HR Department',
      authorRole: 'Admin',
      timestamp: '1 day ago',
      title: 'Staff Social Event - Halloween Party',
      content: 'Join us this Friday 25th October at 18:00 in the Staff Recreation Area for our annual Halloween party! Costumes encouraged. Food and refreshments provided.',
      image: null,
      likes: 156,
      comments: 42,
      shares: 28
    }
  ];

  return (
    <div className="h-full flex bg-gray-50">
      {/* Left Panel - Huddle Feed (Full width on mobile, 60% on desktop) */}
      <div className="flex-1 md:w-[60%] flex flex-col border-r border-gray-200">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-900">Huddle Feed</h1>
          <p className="text-xs text-gray-600">Team Communications & Operations Updates</p>
        </div>

        {/* Feed Content */}
        <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {/* Create Post Section */}
        <div className="bg-white border-b border-gray-200 p-4 mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
              {currentUser.initials}
            </div>
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex-1 text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-gray-600 text-sm transition-colors"
            >
              Share an update with your team...
            </button>
          </div>
        </div>

        {/* Feed Items */}
        <div className="space-y-2 px-3 py-2">
          {/* User Created Posts */}
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {/* Post Header */}
              <div className="flex items-start p-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                  {currentUser.initials}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-600">{currentUser.role}</p>
                    </div>
                    <p className="text-xs text-gray-500">{post.timestamp}</p>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-3">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{post.content}</p>
              </div>

              {/* Engagement Section */}
              <div className="px-3 py-2 border-t border-gray-100">
                <div className="flex items-center space-x-4 mb-2">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-1.5 transition-colors ${
                      post.liked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                    <span className="text-xs">{post.likes > 0 ? `${post.likes} Like${post.likes > 1 ? 's' : ''}` : 'Like'}</span>
                  </button>
                  <button
                    onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                    className="flex items-center space-x-1.5 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs">{post.comments?.length > 0 ? `${post.comments.length} Comment${post.comments.length > 1 ? 's' : ''}` : 'Comment'}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {showComments === post.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {/* Existing Comments */}
                    {post.comments?.map((comment: any) => (
                      <div key={comment.id} className="mb-3 flex space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {currentUser.initials}
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-lg p-2">
                          <p className="text-xs font-semibold text-gray-900">{comment.author}</p>
                          <p className="text-xs text-gray-700 mt-0.5">{comment.text}</p>
                          <p className="text-[10px] text-gray-500 mt-1">{comment.timestamp}</p>
                        </div>
                      </div>
                    ))}

                    {/* Add Comment */}
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {currentUser.initials}
                      </div>
                      <div className="flex-1 flex space-x-2">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleComment(post.id);
                            }
                          }}
                          placeholder="Write a comment..."
                          className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleComment(post.id)}
                          disabled={!commentText.trim()}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                            commentText.trim()
                              ? 'bg-teal-600 hover:bg-teal-700 text-white'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Default Feed Items */}
          {feedItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                {/* Post Header */}
                <div className="flex items-start p-3 border-b border-gray-100">
                  <div className={`w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item.author}</p>
                        <p className="text-xs text-gray-600">{item.authorRole}</p>
                      </div>
                      <span className="text-xs text-gray-500">{item.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-3">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{item.content}</p>
                </div>

                {/* Engagement Stats */}
                <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                  <span>{item.likes} likes</span>
                  <div className="flex space-x-3">
                    <span>{item.comments} comments</span>
                    <span>{item.shares} shares</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-200 grid grid-cols-3 divide-x divide-gray-200">
                  <button className="flex items-center justify-center py-2 space-x-1 text-gray-600 hover:bg-gray-50 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-xs font-semibold">Like</span>
                  </button>
                  <button className="flex items-center justify-center py-2 space-x-1 text-gray-600 hover:bg-gray-50 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs font-semibold">Comment</span>
                  </button>
                  <button className="flex items-center justify-center py-2 space-x-1 text-gray-600 hover:bg-gray-50 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span className="text-xs font-semibold">Share</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>

      {/* Right Panel - TOM AI (Hidden on mobile, 40% on desktop) */}
      <div className="hidden md:flex md:w-[40%] flex-col bg-white">
        <TomAIPanel />
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Create Post</h3>
              <button
                onClick={() => {
                  setShowCreatePost(false);
                  setPostContent('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                  {currentUser.initials}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-600">{currentUser.role}</p>
                </div>
              </div>

              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                rows={6}
                autoFocus
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  if (postContent.trim()) {
                    const newPost = {
                      id: Date.now(),
                      content: postContent,
                      timestamp: 'Just now',
                      likes: 0,
                      liked: false,
                      comments: []
                    };
                    setPosts([newPost, ...posts]);
                    setPostContent('');
                    setShowCreatePost(false);
                  }
                }}
                disabled={!postContent.trim()}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  postContent.trim()
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Post</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
