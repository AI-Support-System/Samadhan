// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
const AudioQuery: React.FC = () => {
const [isDarkMode, setIsDarkMode] = useState(false);
const [showScrollTop, setShowScrollTop] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 400);
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};
const [isListening, setIsListening] = useState(false);
const [isProcessing, setIsProcessing] = useState(false);
const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
const [currentQuery, setCurrentQuery] = useState('');
const [showNotification, setShowNotification] = useState(false);
const [aiResponse, setAiResponse] = useState(`You can check your account balance in several ways:
1. Log into your online banking portal
- Visit our secure website
- Enter your username and password
- Navigate to the Accounts section
- View real-time balance information
2. Use our mobile banking app
- Download our app from App Store or Google Play
- Log in using your credentials
- Enable biometric authentication for quick access
- Check balances with a simple tap
3. Visit any ATM
- Insert your card
- Enter your PIN
- Select "Balance Inquiry"
- Choose which account to check
- Print or view balance on screen
4. Call our automated banking line
- Dial 1-800-AI-BANK
- Enter your account number
- Follow voice prompts
- Get instant balance information
Additional Tips:
- Enable push notifications for balance alerts
- Set up daily or weekly balance summaries
- Use widgets for quick balance checks
- Enable overdraft protection
Security Reminders:
- Never share your login credentials
- Always use secure networks
- Regularly update your passwords
- Monitor your accounts frequently
Would you like me to guide you through any of these methods in detail?`);
const [showHumanSupportModal, setShowHumanSupportModal] = useState(false);
const [isWaiting, setIsWaiting] = useState(false);
const [waitProgress, setWaitProgress] = useState(0);
const [showCallbackForm, setShowCallbackForm] = useState(false);
const chartRef = useRef<HTMLDivElement>(null);
useEffect(() => {
if (chartRef.current) {
const chart = echarts.init(chartRef.current);
const option = {
animation: false,
series: [{
type: 'liquidFill',
data: [0.6],
radius: '80%',
color: ['#007AFF'],
backgroundStyle: {
color: 'transparent'
},
outline: {
show: false
}
}]
};
chart.setOption(option);
}
}, []);
const handleMicClick = () => {
setIsListening(!isListening);
if (!isListening) {
setCurrentQuery('');
setIsProcessing(true);
setTimeout(() => {
setCurrentQuery('How can I check my account balance?');
setIsProcessing(false);
setShowNotification(true);
setTimeout(() => {
setAiResponse('You can check your account balance in several ways:\n\n1. Log into your online banking portal\n2. Use our mobile banking app\n3. Visit any ATM\n4. Call our automated banking line\n\nWould you like me to guide you through any of these methods?');
}, 1000);
setTimeout(() => setShowNotification(false), 3000);
}, 2000);
}
};
return (
<div className={`min-h-screen ${isDarkMode ? 'bg-[#1A1F3D] text-white' : 'bg-white text-gray-800'} transition-colors duration-300`}>
<style>
{`
html {
  scroll-behavior: smooth;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.6);
  border-radius: 10px;
  transition: all 0.3s ease;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(67, 56, 202, 0.8);
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(79, 70, 229, 0.6) rgba(0, 0, 0, 0.05);
}
body {
  overflow-y: auto;
  scroll-behavior: smooth;
}
.scroll-to-top {
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}
.scroll-to-top.visible {
  opacity: 1;
  visibility: visible;
}
`}
</style>
{/* Navigation Bar */}
<nav className={`fixed w-full h-16 ${isDarkMode ? 'bg-[#242850]' : 'bg-white'} shadow-lg z-50 backdrop-blur-sm bg-opacity-90 transition-all duration-300`}>
<div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
<div className="flex items-center space-x-8">
<img src="https://public.readdy.ai/ai/img_res/1daa5dc14ff2037b5196620ece7c61e5.jpg"
alt="Bank Logo"
className="h-8" />
<div className="hidden md:flex space-x-6">
<button className="!rounded-button whitespace-nowrap hover:text-blue-500 transition-colors">Home</button>
<button className="!rounded-button whitespace-nowrap hover:text-blue-500 transition-colors">Transactions</button>
<button className="!rounded-button whitespace-nowrap hover:text-blue-500 transition-colors">Queries</button>
<button className="!rounded-button whitespace-nowrap hover:text-blue-500 transition-colors">Support</button>
</div>
</div>
<div className="flex items-center space-x-6">
<div className="relative">
<button
onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
className="!rounded-button whitespace-nowrap flex items-center space-x-2 hover:text-blue-500"
>
<i className="fas fa-globe"></i>
<span>EN</span>
<i className="fas fa-chevron-down text-xs"></i>
</button>
{showLanguageDropdown && (
<div className={`absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg ${isDarkMode ? 'bg-[#242850]' : 'bg-white'}`}>
<div className="py-2">
<button className="block w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white">English</button>
<button className="block w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white">Spanish</button>
<button className="block w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white">French</button>
</div>
</div>
)}
</div>
<button
onClick={() => setIsDarkMode(!isDarkMode)}
className="!rounded-button whitespace-nowrap w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
>
<i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
</button>
<button className="!rounded-button whitespace-nowrap w-10 h-10 rounded-full overflow-hidden">
<img
src="https://public.readdy.ai/ai/img_res/45cec1110f9f3a9ac5c26020b07f9dad.jpg"
alt="Profile"
className="w-full h-full object-cover"
/>
</button>
</div>
</div>
</nav>
{/* Main Content */}
<main className="pt-16 overflow-x-hidden">
{/* Hero Section */}
<div className="relative h-[600px] flex items-center justify-center overflow-hidden"
style={{
backgroundImage: "url('https://public.readdy.ai/ai/img_res/025b871f46b2a795afbc07611f3b9502.jpg')",
backgroundSize: 'cover',
backgroundPosition: 'center'
}}>
<div className="absolute inset-0 bg-gradient-to-r from-[#1A1F3D]/95 via-[#1A1F3D]/80 to-transparent"></div>
<div className="absolute inset-0 bg-[url('https://public.readdy.ai/ai/img_res/499f02b70575a9711219120b5413143c.jpg')] opacity-10"></div>
<div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-white">
<h1 className="text-5xl md:text-6xl font-bold mb-8 text-center leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">How can we assist you today?</h1>
<p className="text-xl text-blue-100 mb-12 text-center max-w-2xl">Experience the future of banking with our AI-powered assistant, ready to help you 24/7</p>
<div className="flex space-x-6">
<button
onClick={handleMicClick}
className={`!rounded-button whitespace-nowrap w-20 h-20 rounded-full flex items-center justify-center text-2xl transition-all relative
${isListening ? 'bg-red-500 scale-110' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'}`}
>
<div className={`absolute inset-0 rounded-full ${isListening ? 'animate-ping bg-red-500/30' : 'bg-blue-500/30'}`}></div>
<div className={`absolute inset-0 rounded-full ${isListening ? 'animate-pulse bg-red-500/20' : 'bg-blue-500/20'}`}></div>
<i className="fas fa-microphone relative z-10 text-3xl"></i>
</button>
</div>
{isProcessing && (
<div className="mt-8 flex items-center space-x-2">
<div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
<div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
<div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
<span className="ml-2">Processing...</span>
</div>
)}
{currentQuery && (
<div className={`mt-8 p-8 rounded-2xl ${isDarkMode ? 'bg-[#242850]' : 'bg-white'} max-w-3xl w-full shadow-2xl backdrop-blur-sm bg-opacity-95`}>
<div className="mb-6">
<div className="flex items-center space-x-3 mb-4">
<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
<p className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Your Query</p>
</div>
<p className="mt-2 text-lg leading-relaxed p-4 rounded-lg bg-opacity-50 bg-blue-50 dark:bg-blue-900/20">{currentQuery}</p>
</div>
{aiResponse && (
<div className="mt-8">
<div className="flex items-center space-x-3 mb-4">
<div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
<p className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">AI Assistant Response</p>
</div>
<div className="mt-2 max-h-[300px] overflow-y-auto custom-scrollbar transition-all duration-300 hover:shadow-inner">
<div className="whitespace-pre-line p-6 rounded-lg bg-opacity-50 bg-blue-50 dark:bg-blue-900/20 leading-relaxed shadow-inner backdrop-blur-sm transition-all duration-300 hover:bg-opacity-70">
{aiResponse}
</div>
</div>
</div>
)}
<div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
<div className="flex items-center space-x-2">
<div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
<div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
<div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
<span className="text-sm text-blue-500 font-medium ml-2">AI is composing response...</span>
</div>
<>
<button
onClick={() => setShowHumanSupportModal(true)}
className="!rounded-button whitespace-nowrap px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
>
Talk to Human (Est. Wait: 2min)
</button>
{showHumanSupportModal && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<div className={`relative w-full max-w-md p-6 rounded-xl shadow-xl ${isDarkMode ? 'bg-[#242850] text-white' : 'bg-white text-gray-800'}`}>
{!isWaiting ? (
<>
<h3 className="text-xl font-bold mb-4">Transfer to Human Support</h3>
<div className="space-y-4 mb-6">
<div className="flex items-center justify-between">
<span>Estimated Wait Time:</span>
<span className="font-semibold text-blue-500">2 minutes</span>
</div>
<div className="flex items-center justify-between">
<span>Current Queue Position:</span>
<span className="font-semibold text-blue-500">#3</span>
</div>
</div>
<div className="space-y-3">
<button
onClick={() => {
setIsWaiting(true);
setWaitProgress(0);
const interval = setInterval(() => {
setWaitProgress(prev => {
if (prev >= 100) {
clearInterval(interval);
return 100;
}
return prev + 1;
});
}, 1200);
}}
className="!rounded-button whitespace-nowrap w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
>
Wait in Queue
</button>
<button
onClick={() => setShowCallbackForm(true)}
className="!rounded-button whitespace-nowrap w-full py-2 border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-lg"
>
Request Callback
</button>
<button
onClick={() => setShowHumanSupportModal(false)}
className="!rounded-button whitespace-nowrap w-full py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
>
Continue with AI
</button>
</div>
</>
) : (
<div className="text-center">
<h3 className="text-xl font-bold mb-4">Connecting to Support...</h3>
<div className="w-full bg-gray-200 rounded-full h-2 mb-4">
<div
className="bg-blue-500 h-2 rounded-full transition-all duration-300"
style={{ width: `${waitProgress}%` }}
></div>
</div>
<p className="mb-4">Position in queue: #3</p>
<button
onClick={() => {
setIsWaiting(false);
setShowHumanSupportModal(false);
}}
className="!rounded-button whitespace-nowrap px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
>
Cancel
</button>
</div>
)}
{showCallbackForm && (
<div className="absolute inset-0 bg-white dark:bg-[#242850] rounded-xl p-6">
<h3 className="text-xl font-bold mb-4">Request Callback</h3>
<div className="space-y-4 mb-6">
<div>
<label className="block mb-2">Phone Number</label>
<input
type="tel"
className="w-full px-4 py-2 rounded-lg border focus:border-blue-500 outline-none"
placeholder="Enter your phone number"
/>
</div>
<div>
<label className="block mb-2">Preferred Time</label>
<select className="w-full px-4 py-2 rounded-lg border focus:border-blue-500 outline-none">
<option>As soon as possible</option>
<option>Within 1 hour</option>
<option>Within 4 hours</option>
<option>Within 24 hours</option>
</select>
</div>
</div>
<div className="space-y-3">
<button
onClick={() => {
setShowCallbackForm(false);
setShowHumanSupportModal(false);
setShowNotification(true);
setTimeout(() => setShowNotification(false), 3000);
}}
className="!rounded-button whitespace-nowrap w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
>
Submit Request
</button>
<button
onClick={() => setShowCallbackForm(false)}
className="!rounded-button whitespace-nowrap w-full py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
>
Back
</button>
</div>
</div>
)}
</div>
</div>
)}
</>
</div>
</div>
)}
</div>
</div>
{/* Recent Queries Section */}
<div className={`py-16 ${isDarkMode ? 'bg-[#1A1F3D]' : 'bg-gray-50'}`}>
<div className="max-w-7xl mx-auto px-6">
<div className="flex justify-between items-center mb-8">
<h2 className="text-3xl font-bold">Recent Queries</h2>
<div className="flex space-x-4">
<button className="!rounded-button whitespace-nowrap px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">Today</button>
<button className="!rounded-button whitespace-nowrap px-4 py-2 border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-lg">Last 7 Days</button>
<button className="!rounded-button whitespace-nowrap px-4 py-2 border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-lg">Custom Date</button>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
{[
{
query: "How do I set up international wire transfers?",
time: "2 hours ago",
status: "Resolved"
},
{
query: "What are the current mortgage rates?",
time: "Yesterday",
status: "Pending"
},
{
query: "How to dispute a transaction?",
time: "2 days ago",
status: "Resolved"
}
].map((item, index) => (
<div
key={index}
className={`p-6 rounded-lg ${isDarkMode ? 'bg-[#242850]' : 'bg-white'} shadow-lg transition-all duration-300 hover:shadow-xl hover:transform hover:scale-[1.02] cursor-pointer backdrop-blur-sm`}
>
<p className="text-lg font-medium mb-4">{item.query}</p>
<div className="flex justify-between items-center">
<span className="text-sm opacity-70">{item.time}</span>
<span className={`px-3 py-1 rounded-full text-sm ${
item.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
}`}>
{item.status}
</span>
</div>
</div>
))}
</div>
</div>
</div>
</main>
{/* Footer */}
<footer className={`py-12 ${isDarkMode ? 'bg-[#242850]' : 'bg-gray-900 text-white'}`}>
<div className="max-w-7xl mx-auto px-6">
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
<div>
<h3 className="text-lg font-bold mb-4">Quick Links</h3>
<div className="space-y-2">
<button className="!rounded-button whitespace-nowrap block hover:text-blue-500">FAQs</button>
<button className="!rounded-button whitespace-nowrap block hover:text-blue-500">Privacy Policy</button>
<button className="!rounded-button whitespace-nowrap block hover:text-blue-500">Terms of Service</button>
</div>
</div>
<div>
<h3 className="text-lg font-bold mb-4">Contact Support</h3>
<p>24/7 Customer Service</p>
<p className="mt-2">Email: support@aibank.com</p>
<p>Phone: 1-800-AI-BANK</p>
</div>
<div>
<h3 className="text-lg font-bold mb-4">Follow Us</h3>
<div className="flex space-x-4">
<button className="!rounded-button whitespace-nowrap w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center">
<i className="fab fa-twitter"></i>
</button>
<button className="!rounded-button whitespace-nowrap w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center">
<i className="fab fa-linkedin"></i>
</button>
<button className="!rounded-button whitespace-nowrap w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center">
<i className="fab fa-facebook"></i>
</button>
</div>
</div>
</div>
<div className="mt-8 pt-8 border-t border-gray-700 text-center">
<p>&copy; 2025 AI Banking Assistant. All rights reserved.</p>
</div>
</div>
</footer>
{/* Notification Toast */}
{showNotification && (
<div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 backdrop-blur-sm bg-opacity-90 animate-fade-in-up">
<div className="flex items-center space-x-2">
<i className="fas fa-check-circle"></i>
<span>Query processed successfully!</span>
</div>
</div>
)}

{/* Scroll to Top Button */}
<button 
  onClick={scrollToTop}
  className={`scroll-to-top fixed bottom-6 right-6 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-blue-600 z-50 ${showScrollTop ? 'visible' : ''}`}
>
  <i className="fas fa-arrow-up"></i>
</button>
</div>
);
};
export default AudioQuery;
