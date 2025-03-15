// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useRef, useEffect } from 'react';
import * as echarts from 'echarts';
const App: React.FC = () => {
const [isRecording, setIsRecording] = useState(false);
const [query, setQuery] = useState('');
const [response, setResponse] = useState('');
const circleChartRef = useRef<HTMLDivElement>(null);
const [showResponse, setShowResponse] = useState(false);
const [wavePoints, setWavePoints] = useState<number[]>(Array(360).fill(1));
useEffect(() => {
document.body.style.backgroundColor = '#050714';
document.body.style.minHeight = '1024px';
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;700&family=Rajdhani:wght@300;400;700&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);
return () => {
document.head.removeChild(link);
};
}, []);
useEffect(() => {
if (!circleChartRef.current) return;
const chart = echarts.init(circleChartRef.current, null, { devicePixelRatio: 2 });
const generatePoints = () => {
if (!isRecording) {
return Array(360).fill(1);
}
return Array(360).fill(0).map((_, i) => {
const noise = Math.sin(Date.now() / 200 + i / 30) * 0.5;
return 1 + noise;
});
};
const updateAnimation = () => {
const points = generatePoints();
const data = points.map((r, angle) => [
r * Math.cos((angle * Math.PI) / 180),
r * Math.sin((angle * Math.PI) / 180)
]);
const option = {
animation: false,
backgroundColor: '#050714',
polar: {
radius: ['75%', '90%']
},
angleAxis: {
max: 360,
startAngle: 90,
splitLine: { show: false },
axisLine: { show: false },
axisTick: { show: false },
axisLabel: { show: false },
show: false
},
radiusAxis: {
type: 'value',
show: false
},
series: [
{
type: 'custom',
coordinateSystem: 'polar',
renderItem: (params: any, api: any) => {
const points = data.map(point => api.coord(point));
let path = `M ${points[0][0]} ${points[0][1]}`;
for (let i = 1; i < points.length; i++) {
path += ` L ${points[i][0]} ${points[i][1]}`;
}
path += 'Z';
return {
type: 'path',
shape: {
pathData: path
},
style: {
fill: 'none',
shadowBlur: 50,
shadowColor: 'rgba(0, 240, 255, 0.9)',
lineWidth: 6,
stroke: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
{ offset: 0, color: 'rgba(0, 240, 255, 0.9)' },
{ offset: 0.5, color: 'rgba(189, 0, 255, 0.9)' },
{ offset: 1, color: 'rgba(0, 240, 255, 0.9)' }
])
}
};
},
data: [0]
}
]
};
chart.setOption(option);
};
const timer = setInterval(updateAnimation, 16);
return () => {
clearInterval(timer);
chart.dispose();
};
}, [isRecording]);
const handleMicClick = () => {
setIsRecording(!isRecording);
if (!isRecording) {
setQuery('');
setResponse('');
setShowResponse(false);
} else {
const mockQuery = 'Tell me about the latest advancements in quantum computing and their potential impact on artificial intelligence.';
const mockResponse = 'Recent breakthroughs in quantum computing have shown remarkable progress, particularly in achieving quantum supremacy. IBM\'s latest quantum processor has reached 127 qubits, while Google\'s Sycamore demonstrated quantum advantage in specific calculations. These advancements are expected to revolutionize AI in several ways:\n\n1. Machine Learning Optimization: Quantum algorithms could exponentially speed up training of complex neural networks.\n\n2. Pattern Recognition: Quantum computers excel at identifying patterns in vast datasets, enhancing AI\'s analytical capabilities.\n\n3. Drug Discovery: The combination of quantum computing and AI is accelerating molecular simulation for pharmaceutical research.\n\n4. Cryptography: Quantum-resistant encryption methods are being developed to protect AI systems from future quantum threats.\n\nHowever, challenges remain in maintaining quantum coherence and scaling up qubit counts. Experts predict practical quantum-AI applications could become reality within 5-10 years.';
setTimeout(() => {
setQuery(mockQuery);
setTimeout(() => {
setShowResponse(true);
setResponse(mockResponse);
}, 1000);
}, 500);
}
};
return (
<div className="max-w-[1440px] mx-auto min-h-screen px-8 py-12 font-['Oxanium']">
<div className="absolute top-0 left-0 w-full h-full" style={{
background: 'radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.1) 0%, rgba(5, 7, 20, 0.95) 50%)',
pointerEvents: 'none'
}}></div>
<header className="text-center mb-16 relative">
<div className="flex items-center justify-center gap-3 mb-6">
<i className="fas fa-robot text-5xl text-[#00F0FF]" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.5))' }}></i>
<h1 className="text-5xl font-bold bg-gradient-to-r from-[#00F0FF] to-[#BD00FF] bg-clip-text text-transparent"
style={{ textShadow: '0 0 8px rgba(0, 240, 255, 0.3)' }}>
NOVA AI
</h1>
</div>
<p className="text-[#E0E0E0] text-xl">Your Advanced AI Assistant</p>
<div className="flex justify-center gap-6 mt-6">
<div className="flex items-center gap-2 text-[#00F0FF]">
<i className="fas fa-brain"></i>
<span>Advanced AI</span>
</div>
<div className="flex items-center gap-2 text-[#00F0FF]">
<i className="fas fa-language"></i>
<span>Natural Language</span>
</div>
<div className="flex items-center gap-2 text-[#00F0FF]">
<i className="fas fa-bolt"></i>
<span>Real-time Response</span>
</div>
</div>
</header>
<main>
<div className="flex flex-col items-center mb-12 relative">
<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#131836] rounded-full opacity-40 blur-2xl"></div>
<div className={`w-[500px] h-[500px] mb-8 relative ${isRecording ? 'animate-[pulse_1s_ease-in-out_infinite]' : ''}`}>
<div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF40] to-[#BD00FF40] rounded-full blur-lg"></div>
<div ref={circleChartRef} className="scale-125"></div>
</div>
<div className="relative">
<div className={`absolute -inset-8 bg-gradient-to-r from-[#00F0FF20] to-[#BD00FF20] rounded-full blur-xl transition-opacity duration-500 ${isRecording ? 'opacity-100' : 'opacity-0'}`}></div>
<button
onClick={handleMicClick}
className={`w-40 h-40 rounded-full cursor-pointer relative mb-6 !rounded-button transform transition-transform duration-300 hover:scale-105 ${
isRecording ? 'animate-pulse' : ''
}`}
style={{
background: 'linear-gradient(45deg, #131836, #1a1f4d)',
border: '3px solid transparent',
borderImage: 'linear-gradient(45deg, #00F0FF, #BD00FF) 1'
}}
>
<i className={`fas fa-microphone text-5xl ${
isRecording ? 'text-[#FF0099]' : 'text-[#00F0FF]'
}`} style={{ filter: 'drop-shadow(0 0 10px currentColor)' }}></i>
<div className={`absolute -inset-1 rounded-full ${
isRecording ? 'bg-[#FF0099]' : 'bg-[#00F0FF]'
} opacity-20 blur-md -z-10`}></div>
</button>
</div>
<div className="text-center">
<p className="text-[#E0E0E0] text-xl mb-2">
{isRecording ? 'Listening...' : 'Hey NOVA'}
</p>
<p className="text-[#8A8A8A] text-sm">
{isRecording ? 'Click to stop recording' : 'Click the button or say "Hey NOVA" to start'}
</p>
</div>
</div>
<div className="max-w-4xl mx-auto space-y-6">
{query && (
<div className="bg-[#131836] backdrop-blur-xl p-8 rounded-2xl border-2 border-[#00F0FF] relative overflow-hidden group transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]">
<div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#00F0FF] to-transparent"></div>
<div className="flex items-start gap-4">
<div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00F0FF20] to-[#00F0FF40] flex items-center justify-center">
<i className="fas fa-user text-[#00F0FF]"></i>
</div>
<div className="flex-1">
<h2 className="text-[#00F0FF] text-xl mb-3 font-['Rajdhani'] flex items-center gap-2">
You
<span className="text-sm text-[#00F0FF60]">•</span>
<span className="text-sm text-[#00F0FF60]">{new Date().toLocaleTimeString()}</span>
</h2>
<p className="text-white text-lg leading-relaxed">{query}</p>
</div>
</div>
</div>
)}
{showResponse && (
<div className="bg-[#131836] backdrop-blur-xl p-8 rounded-2xl border-2 border-[#BD00FF] relative overflow-hidden group transition-all duration-300 hover:shadow-[0_0_20px_rgba(189,0,255,0.2)]">
<div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#BD00FF] to-transparent"></div>
<div className="flex items-start gap-4">
<div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#BD00FF20] to-[#BD00FF40] flex items-center justify-center">
<i className="fas fa-robot text-[#BD00FF]"></i>
</div>
<div className="flex-1">
<h2 className="text-[#BD00FF] text-xl mb-3 font-['Rajdhani'] flex items-center gap-2">
NOVA
<span className="text-sm text-[#BD00FF60]">•</span>
<span className="text-sm text-[#BD00FF60]">{new Date().toLocaleTimeString()}</span>
</h2>
<p className="text-[#E0E0E0] text-lg leading-relaxed">{response}</p>
</div>
</div>
</div>
)}
</div>
</main>
</div>
);
};
export default App
