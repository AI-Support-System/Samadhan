import React, { useState, useEffect, useRef } from 'react';

// Define message type
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

interface ChatbotWidgetProps {
  onClose: () => void;
}

// Main component
const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your AI assistant. How can I help you today?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('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');
  const [apiKeySet, setApiKeySet] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close chat when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setApiKeySet(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // API call logic here
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling API:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error processing your request. Please check your API key and try again.',
          timestamp: Date.now()
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      ref={chatRef}
      className="fixed bottom-24 right-6 w-80 h-96 bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden z-50"
      style={{
        animation: "fadeIn 0.3s ease-out forwards",
      }}
    >
      {!apiKeySet ? (
        <div className="flex items-center justify-center w-full h-full p-4">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 w-full">
            <div className="mb-4 flex justify-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Enter API Key</h2>
            <form onSubmit={handleSubmitApiKey}>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg mb-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="API key..."
              />
              <button
                type="submit"
                className="w-full p-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-all focus:outline-none text-sm"
              >
                Start Chatting
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="bg-gray-800 p-3 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">AI Assistant</h1>
                <div className="flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400 mr-1"></div>
                  <span className="text-gray-400 text-xs">Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-900">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mr-1.5 self-end">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                )}
                <div
                  className={`px-3 py-2 rounded-xl max-w-[80%] text-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none'
                      : 'bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center ml-1.5 self-end">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mr-1.5 self-end">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="px-3 py-2 rounded-xl max-w-[80%] bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700">
                  <div className="flex space-x-1.5">
                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="bg-gray-800 p-3 border-t border-gray-700">
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-900 text-white p-2 text-sm rounded-l-lg focus:outline-none border border-gray-700"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`bg-gradient-to-r from-purple-500 to-blue-500 text-white p-2 rounded-r-lg ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                }`}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatbotWidget;