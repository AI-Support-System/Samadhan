import React, { useState, useRef, useEffect } from "react";
import { ChatbotConnector, ChatMessage } from "@/app/api/ChatbotConnector";

const ChatbotWidget: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Array<ChatMessage>>([
    { text: "Hello! How can I help you with your banking needs today?", sender: "bot" }
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatbotConnectorRef = useRef<ChatbotConnector | null>(null);

  useEffect(() => {
    // Initialize the ChatbotConnector
    const connector = new ChatbotConnector();
    chatbotConnectorRef.current = connector;
    
    // Connect and set up message handler
    connector.connect((message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });
    
    // Cleanup on unmount
    return () => {
      if (chatbotConnectorRef.current) {
        chatbotConnectorRef.current.disconnect();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === "") return;
    
    // Add user message
    const userMessage: ChatMessage = {
      text: inputText,
      sender: "user",
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Send message via connector
    if (chatbotConnectorRef.current) {
      chatbotConnectorRef.current.sendMessage(inputText);
    }
    
    setInputText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-32 right-6 w-96 h-[480px] bg-gradient-to-b from-[#12121A] to-[#1A1A2E] rounded-2xl border border-[#2A2A3A] shadow-2xl flex flex-col overflow-hidden" style={{animation: "float 4s ease-in-out infinite"}}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1A1A2E] to-[#252542] px-5 py-4 flex justify-between items-center border-b border-[#3A3A5E]/30">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#00A8FF] flex items-center justify-center relative">
            <div className="absolute inset-0 bg-blue-400 blur-sm rounded-full opacity-40"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div className="ml-3">
            <span className="text-white font-medium text-lg">NeoBank Assistant</span>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
              <span className="text-gray-400 text-xs">Online</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors h-8 w-8 rounded-full flex items-center justify-center hover:bg-[#ffffff15]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 bg-[#12121A]/50 backdrop-blur-sm">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.sender === "user" ? "flex justify-end" : "flex justify-start"
            }`}
          >
            {message.sender === "bot" && (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#00A8FF] flex items-center justify-center mr-2 self-end">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            )}
            <div
              className={`px-4 py-3 rounded-2xl max-w-[75%] ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-[#B026FF] to-[#9613E2] text-white rounded-br-none"
                  : "bg-gradient-to-r from-[#1A1A2E] to-[#252542] text-gray-200 rounded-bl-none border border-[#3A3A5E]/30"
              }`}
            >
              {message.text}
            </div>
            {message.sender === "user" && (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#B026FF] to-[#9613E2] flex items-center justify-center ml-2 self-end">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="bg-gradient-to-r from-[#1A1A2E] to-[#252542] px-5 py-4 border-t border-[#3A3A5E]/30">
        <div className="flex items-center bg-[#12121A]/70 rounded-full px-4 py-1 border border-[#3A3A5E]/30">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-transparent text-white py-2 focus:outline-none text-sm"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-gradient-to-r from-[#00F0FF] to-[#00A8FF] text-white rounded-full p-2 hover:shadow-lg hover:shadow-[#00F0FF]/20 transition-all focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add this style tag for the floating animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatbotWidget;