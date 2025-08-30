'use client';
import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { Send, MessageSquare, Sun, Moon, Trash2, Sparkles, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
  });
  const [theme, setTheme] = useState('dark');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const clearChat = () => {
    setMessages([]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const isDark = theme === 'dark';

  // Helper function to convert pipe-separated text to markdown table
  const convertToMarkdownTable = (text) => {
    const rows = text.split('||').map(row => row.trim().split(' | '));
    if (rows.length <= 1) return text;
    const headers = rows[0];
    const separator = `|${headers.map(() => '---').join('|')}|\n`;
    const body = rows.slice(1).map(row => `|${row.join('|')}|\n`).join('');
    return `|${headers.join('|')}|\n${separator}${body}`;
  };

  // Custom markdown components for better styling
  const markdownComponents = {
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className={`min-w-full border-collapse ${
          isDark ? 'border-gray-600' : 'border-gray-300'
        } text-sm`}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className={`${
        isDark ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className={`${
        isDark ? 'bg-gray-800/50' : 'bg-white'
      }`}>
        {children}
      </tbody>
    ),
    th: ({ children }) => (
      <th className={`px-4 py-2 text-left font-semibold border ${
        isDark 
          ? 'border-gray-600 text-gray-200' 
          : 'border-gray-300 text-gray-800'
      }`}>
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className={`px-4 py-2 border ${
        isDark 
          ? 'border-gray-600 text-gray-300' 
          : 'border-gray-300 text-gray-700'
      }`}>
        {children}
      </td>
    ),
    code: ({ inline, children }) => (
      <code className={`${
        inline 
          ? `px-1 py-0.5 rounded text-sm ${
              isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
            }`
          : `block p-4 rounded-lg text-sm ${
              isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
            }`
      }`}>
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className={`p-4 rounded-lg overflow-x-auto my-4 ${
        isDark ? 'bg-gray-700' : 'bg-gray-200'
      }`}>
        {children}
      </pre>
    ),
  };

  return (
    <div className={`h-screen flex flex-col transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl animate-pulse ${
          isDark ? 'bg-blue-500' : 'bg-blue-300'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl animate-pulse delay-1000 ${
          isDark ? 'bg-purple-500' : 'bg-purple-300'
        }`}></div>
      </div>

      {/* Header */}
      <header className={`relative z-10 backdrop-blur-xl border-b transition-all duration-300 ${
        isDark 
          ? 'bg-gray-900/80 border-gray-700/50' 
          : 'bg-white/80 border-gray-200/50'
      }`}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl transition-all duration-300 ${
              isDark ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold transition-colors ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                AI Assistant
              </h1>
              <p className={`text-sm transition-colors ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Powered by AI
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={clearChat}
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-red-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-red-500'
              }`}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 relative z-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-6 space-y-6 pb-32">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className={`text-center transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <Sparkles className={`w-12 h-12 mx-auto mb-4 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <p className="text-lg">Start a conversation!</p>
                  <p className="text-sm mt-2">Ask me anything and I'll be happy to help.</p>
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-4 animate-fadeIn ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  message.role === 'user'
                    ? isDark 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-green-400 to-emerald-400'
                    : isDark 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                      : 'bg-gradient-to-r from-blue-400 to-purple-400'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`max-w-[80%] rounded-2xl px-6 py-4 transition-all duration-300 backdrop-blur-sm ${
                  message.role === 'user'
                    ? isDark
                      ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30'
                      : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
                    : isDark
                      ? 'bg-gray-800/50 border border-gray-700/50'
                      : 'bg-white/80 border border-gray-200/50 shadow-sm'
                }`}>
                  <div className={`text-sm leading-relaxed transition-colors ${
                    isDark ? 'text-gray-100' : 'text-gray-800'
                  }`}>
                    {message.role === 'assistant' ? (
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                      >
                        {message.content.includes('|') && !message.content.includes('---')
                          ? convertToMarkdownTable(message.content)
                          : message.content}
                      </ReactMarkdown>
                    ) : (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-start space-x-4 animate-fadeIn">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  isDark 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                    : 'bg-gradient-to-r from-blue-400 to-purple-400'
                }`}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className={`rounded-2xl px-6 py-4 backdrop-blur-sm ${
                  isDark
                    ? 'bg-gray-800/50 border border-gray-700/50'
                    : 'bg-white/80 border border-gray-200/50 shadow-sm'
                }`}>
                  <div className="flex space-x-1">
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      isDark ? 'bg-gray-400' : 'bg-gray-500'
                    }`}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce delay-100 ${
                      isDark ? 'bg-gray-400' : 'bg-gray-500'
                    }`}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce delay-200 ${
                      isDark ? 'bg-gray-400' : 'bg-gray-500'
                    }`}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Fixed Input Area */}
      <div className={`fixed bottom-0 left-0 right-0 z-20 backdrop-blur-xl border-t transition-all duration-300 ${
        isDark 
          ? 'bg-gray-900/80 border-gray-700/50' 
          : 'bg-white/80 border-gray-200/50'
      }`}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="relative">
            <div className={`relative backdrop-blur-xl rounded-2xl border transition-all duration-300 focus-within:ring-2 ${
              isDark 
                ? 'bg-gray-800/80 border-gray-700/50 focus-within:ring-blue-500/50' 
                : 'bg-white/80 border-gray-200/50 focus-within:ring-blue-400/50'
            }`}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Type your message"
                disabled={isLoading}
                rows={1}
                className={`w-full px-6 py-4 pr-14 bg-transparent rounded-2xl focus:outline-none resize-none transition-colors placeholder:transition-colors ${
                  isDark 
                    ? 'text-white placeholder:text-gray-400' 
                    : 'text-gray-800 placeholder:text-gray-500'
                }`}
                style={{ minHeight: '56px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
                className={`absolute right-2 bottom-2 p-2 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 ${
                  isDark 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400'
                }`}
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}


// // app/page.js
// import ChatInterface from '../components/ChatInterface';

// export default function Home() {
//   return <ChatInterface />;
// }