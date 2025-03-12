// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import '@fortawesome/fontawesome-free/css/all.min.css';
const Home: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [balance, setBalance] = useState('184,392.75');
  const [isFaceScanning, setIsFaceScanning] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const option = {
        animation: false,
        backgroundColor: 'transparent',
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisLine: { lineStyle: { color: '#00F0FF' } },
          axisLabel: { color: '#fff' }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#00F0FF' } },
          axisLabel: { color: '#fff' }
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
          lineStyle: { color: '#BA01FF', width: 4 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(186, 1, 255, 0.4)'
              }, {
                offset: 1, color: 'rgba(186, 1, 255, 0)'
              }]
            }
          }
        }]
      };
      chart.setOption(option);
    }
  }, []);

  const quickActions = [
    { icon: 'fa-money-bill-transfer', label: 'Transfer' },
    { icon: 'fa-credit-card', label: 'Cards' },
    { icon: 'fa-piggy-bank', label: 'Savings' },
    { icon: 'fa-chart-line', label: 'Invest' }
  ];

  const recentTransactions = [
    { id: 1, merchant: 'Apple Store', amount: '-$999.00', date: 'Today', icon: 'fa-apple' },
    { id: 2, merchant: 'Tesla Supercharge', amount: '-$45.50', date: 'Yesterday', icon: 'fa-bolt' },
    { id: 3, merchant: 'Starbucks Coffee', amount: '-$6.75', date: 'Yesterday', icon: 'fa-mug-hot' },
    { id: 4, merchant: 'Amazon Prime', amount: '-$14.99', date: 'Mar 10', icon: 'fa-shopping-cart' }
  ];

  const features = [
    {
      title: 'Facial Authentication',
      description: 'Secure your account with advanced biometric verification',
      icon: 'fa-face-viewfinder',
      action: () => setIsFaceScanning(true)
    },
    {
      title: 'AI Assistant',
      description: 'Get instant help with our AI-powered chat support',
      icon: 'fa-robot',
      action: () => setShowAIChat(true)
    },
    {
      title: 'Voice Banking',
      description: 'Manage your finances hands-free with voice commands',
      icon: 'fa-microphone',
      action: () => setShowVoiceInput(true)
    }
  ];

  const heroBackgroundUrl = 'https://public.readdy.ai/ai/img_res/67cdc5c6fc4580df96eeb4a10f945129.jpg';

  const featureImageUrl = 'https://public.readdy.ai/ai/img_res/2b9b5eb3991fe34ce7e8b4e4a55868b3.jpg';

  return (
    <div className="min-h-screen bg-[#080810] text-white font-sans">
      {/* Hero Section */}
      <div 
        className="relative h-[600px] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackgroundUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#080810] via-[#08081099] to-transparent">
          <div className="container mx-auto px-8 py-16">
            <nav className="flex items-center justify-between mb-16">
              <div className="text-2xl font-bold text-white flex items-center gap-2">
                <i className="fas fa-cube text-[#00F0FF]"></i>
                <span>NeoBank</span>
              </div>
              <div className="flex items-center gap-8">
                {['Features', 'Security', 'Support', 'About'].map((item) => (
                  <button key={item} className="text-white hover:text-[#00F0FF] transition-colors cursor-pointer whitespace-nowrap !rounded-button">
                    {item}
                  </button>
                ))}
                <button className="bg-[#00F0FF] text-black px-6 py-2 font-semibold hover:bg-[#32FFBD] transition-colors cursor-pointer whitespace-nowrap !rounded-button">
                  Sign In
                </button>
              </div>
            </nav>

            <div className="max-w-2xl">
              <h1 className="text-6xl font-bold mb-6 leading-tight">
                Banking Reimagined for the Digital Age
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Experience the future of finance with AI-powered insights, seamless transactions, and unparalleled security.
              </p>
              <div className="flex gap-4">
                <button className="bg-[#BA01FF] px-8 py-3 font-semibold hover:bg-[#32FFBD] transition-colors cursor-pointer whitespace-nowrap !rounded-button">
                  Get Started
                </button>
                <button className="border-2 border-[#00F0FF] px-8 py-3 font-semibold hover:bg-[#00F0FF] hover:text-black transition-all cursor-pointer whitespace-nowrap !rounded-button">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Next-Generation Banking Features</h2>
          <p className="text-xl text-gray-400">Experience banking that's smarter, faster, and more secure</p>
        </div>

        <div className="grid grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-[#ffffff0d] backdrop-blur-lg rounded-xl p-6 hover:bg-[#ffffff1a] transition-all cursor-pointer"
                onClick={feature.action}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#BA01FF] flex items-center justify-center">
                    <i className={`fas ${feature.icon} text-2xl text-white`}></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="relative">
            <img 
              src={featureImageUrl} 
              alt="Banking Features" 
              className="rounded-xl w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080810] to-transparent rounded-xl"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 py-16">
        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-6 mb-16">
          {quickActions.map((action) => (
            <div key={action.label} className="bg-[#ffffff0d] backdrop-blur-lg rounded-xl p-6 hover:bg-[#ffffff1a] transition-all cursor-pointer group">
              <i className={`fas ${action.icon} text-4xl text-[#00F0FF] group-hover:text-[#32FFBD] mb-4`}></i>
              <h3 className="text-xl font-semibold">{action.label}</h3>
            </div>
          ))}
        </div>

        {/* Analytics and Transactions */}
        <div className="grid grid-cols-2 gap-8">
          {/* Chart */}
          <div className="bg-[#ffffff0d] backdrop-blur-lg rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Spending Analytics</h2>
            <div ref={chartRef} className="h-[300px] w-full"></div>
          </div>

          {/* Transactions */}
          <div className="bg-[#ffffff0d] backdrop-blur-lg rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Recent Transactions</h2>
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-[#ffffff0d] rounded-lg hover:bg-[#ffffff1a] transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#BA01FF] flex items-center justify-center">
                      <i className={`fas ${tx.icon} text-white`}></i>
                    </div>
                    <div>
                      <div className="font-semibold">{tx.merchant}</div>
                      <div className="text-sm text-gray-400">{tx.date}</div>
                    </div>
                  </div>
                  <div className="font-mono">{tx.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#ffffff0d] mt-16 py-16">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                <i className="fas fa-cube text-[#00F0FF]"></i>
                <span>NeoBank</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing banking for the digital age with cutting-edge technology and security.
              </p>
            </div>
            {['Products', 'Company', 'Resources', 'Legal'].map((section) => (
              <div key={section}>
                <h3 className="font-semibold mb-6">{section}</h3>
                <ul className="space-y-3">
                  {['Features', 'Security', 'Support', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-400 hover:text-[#00F0FF] transition-colors cursor-pointer">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>

      {/* Modal Overlays */}
      {isFaceScanning && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-[#ffffff0d] backdrop-blur-lg rounded-xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <i className="fas fa-face-viewfinder text-[#00F0FF] text-6xl animate-pulse"></i>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Face Authentication</h3>
              <p className="text-gray-400 mb-6">Please position your face within the frame</p>
              <button 
                onClick={() => setIsFaceScanning(false)}
                className="bg-[#BA01FF] px-6 py-2 rounded-lg hover:bg-[#32FFBD] transition-colors cursor-pointer whitespace-nowrap !rounded-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAIChat && (
        <div className="fixed bottom-8 right-8 bg-[#ffffff0d] backdrop-blur-lg rounded-xl p-6 w-96 z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">AI Assistant</h3>
            <button 
              onClick={() => setShowAIChat(false)}
              className="text-gray-400 hover:text-white"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="h-80 overflow-y-auto mb-4 bg-[#ffffff0d] rounded-lg p-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-[#00F0FF] flex items-center justify-center">
                  <i className="fas fa-robot text-black"></i>
                </div>
                <div className="bg-[#ffffff1a] rounded-lg p-3 max-w-[80%]">
                  Hello! How can I assist you today?
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Type your message..."
              className="flex-1 bg-[#ffffff1a] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00F0FF]"
            />
            <button className="bg-[#00F0FF] text-black p-2 rounded-lg hover:bg-[#32FFBD] transition-colors cursor-pointer whitespace-nowrap !rounded-button">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}

      {showVoiceInput && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-[#ffffff0d] backdrop-blur-lg rounded-xl p-8 max-w-md w-full text-center">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <i className="fas fa-microphone text-[#00F0FF] text-6xl animate-pulse"></i>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Voice Banking</h3>
            <p className="text-gray-400 mb-6">Listening for your command...</p>
            <button 
              onClick={() => setShowVoiceInput(false)}
              className="bg-[#BA01FF] px-6 py-2 rounded-lg hover:bg-[#32FFBD] transition-colors cursor-pointer whitespace-nowrap !rounded-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

