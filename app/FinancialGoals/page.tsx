// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
"use client";

import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import "@fortawesome/fontawesome-free/css/all.min.css";
const App: React.FC = () => {
const [selectedGoal, setSelectedGoal] = useState<string>('all');
const [showNewGoalModal, setShowNewGoalModal] = useState(false);
const [goals, setGoals] = useState([
  {
    id: 1,
    name: 'Home Purchase',
    target: 40000000,
    current: 12000000,
    monthly: 200000,
    completion: '2027-06',
    progress: 30,
    type: 'home',
    imageUrl: 'https://public.readdy.ai/ai/img_res/d5b1462aa1b3764da64bf2dc3c46494d.jpg'
  },
  {
    id: 2,
    name: 'Retirement Fund',
    target: 150000000,
    current: 60000000,
    monthly: 400000,
    completion: '2045-12',
    progress: 40,
    type: 'retirement',
    imageUrl: 'https://public.readdy.ai/ai/img_res/8b0786e4c8176c7844fdf1fb8cd856eb.jpg'
  },
  {
    id: 3,
    name: 'Emergency Fund',
    target: 3000000,
    current: 2100000,
    monthly: 75000,
    completion: '2025-12',
    progress: 70,
    type: 'emergency',
    imageUrl: 'https://public.readdy.ai/ai/img_res/42e2e23284437fb6098390c234c29e71.jpg'
  }
]);
const [newGoal, setNewGoal] = useState({
  name: '',
  target: '',
  completion: '',
  monthly: '',
  type: 'home',
  imageUrl: 'https://readdy.ai/api/search-image?query=modern minimalist house with clean lines and large windows set against a dark moody background perfect for financial website hero section professional real estate photography&width=400&height=300&seq=4&orientation=landscape'
});
const [formErrors, setFormErrors] = useState({
name: '',
target: '',
completion: '',
monthly: ''
});
const validateForm = () => {
const errors = {
name: '',
target: '',
completion: '',
monthly: ''
};
let isValid = true;
if (!newGoal.name.trim()) {
errors.name = 'Goal name is required';
isValid = false;
}
if (!newGoal.target || Number(newGoal.target) <= 0) {
errors.target = 'Valid target amount is required';
isValid = false;
}
if (!newGoal.completion) {
errors.completion = 'Target date is required';
isValid = false;
}
if (!newGoal.monthly || Number(newGoal.monthly) <= 0) {
errors.monthly = 'Valid monthly contribution is required';
isValid = false;
}
setFormErrors(errors);
return isValid;
};
const handleSubmit = () => {
  if (validateForm()) {
    const newGoalObj = {
      id: goals.length + 1,
      name: newGoal.name,
      target: Number(newGoal.target),
      current: 0,
      monthly: Number(newGoal.monthly),
      completion: newGoal.completion,
      progress: 0,
      type: newGoal.type,
      imageUrl: newGoal.imageUrl
    };
    setGoals([...goals, newGoalObj]);
    setShowNewGoalModal(false);
    setNewGoal({
      name: '',
      target: '',
      completion: '',
      monthly: '',
      type: 'home',
      imageUrl: 'https://readdy.ai/api/search-image?query=modern minimalist house with clean lines and large windows set against a dark moody background perfect for financial website hero section professional real estate photography&width=400&height=300&seq=4&orientation=landscape'
    });
  }
};
const retirementChartRef = useRef<HTMLDivElement>(null);
const savingsChartRef = useRef<HTMLDivElement>(null);
const budgetChartRef = useRef<HTMLDivElement>(null);

useEffect(() => {
if (retirementChartRef.current) {
const chart = echarts.init(retirementChartRef.current);
const option = {
animation: false,
title: {
text: 'Retirement Projection',
textStyle: {
color: '#333',
fontSize: 16
}
},
tooltip: {
trigger: 'axis'
},
xAxis: {
type: 'category',
data: ['2025', '2030', '2035', '2040', '2045', '2050']
},
yAxis: {
type: 'value',
name: 'Amount ($)',
axisLabel: {
formatter: (value: number) => `₹${(value/100000).toFixed(1)}L`
}
},
series: [
{
name: 'Conservative',
type: 'line',
data: [8000000, 12000000, 16000000, 20000000, 25000000, 30000000],
lineStyle: { color: '#4CAF50' }
},
{
name: 'Moderate',
type: 'line',
data: [8000000, 14000000, 20000000, 28000000, 36000000, 45000000],
lineStyle: { color: '#2196F3' }
}
]
};
chart.setOption(option);
}
if (savingsChartRef.current) {
const chart = echarts.init(savingsChartRef.current);
const option = {
animation: false,
backgroundColor: '#1f2937',
title: {
text: 'Monthly Savings Analysis',
textStyle: {
color: '#f3f4f6',
fontSize: 16
}
},
tooltip: {
trigger: 'item'
},
series: [
{
name: 'Savings Distribution',
type: 'pie',
radius: ['40%', '70%'],
data: [
{ value: 250000, name: 'Home Fund' },
{ value: 500000, name: 'Retirement' },
{ value: 100000, name: 'Emergency' },
{ value: 150000, name: 'Travel' }
],
emphasis: {
itemStyle: {
shadowBlur: 10,
shadowOffsetX: 0,
shadowColor: 'rgba(0, 0, 0, 0.5)'
}
}
}
]
};
chart.setOption(option);
}
if (budgetChartRef.current) {
const chart = echarts.init(budgetChartRef.current);
const option = {
animation: false,
title: {
text: 'Budget Overview',
textStyle: {
color: '#333',
fontSize: 16
}
},
tooltip: {
trigger: 'axis',
axisPointer: {
type: 'shadow'
}
},
xAxis: {
type: 'value',
axisLabel: {
formatter: (value: number) => `₹${(value/1000).toFixed(0)}K`,
color: '#f3f4f6'
}
},
yAxis: {
type: 'category',
data: ['Housing', 'Transportation', 'Food', 'Utilities', 'Entertainment']
},
series: [
{
name: 'Budget',
type: 'bar',
data: [250000, 50000, 80000, 40000, 30000],
itemStyle: {
color: '#4CAF50'
}
},
{
name: 'Actual',
type: 'bar',
data: [240000, 45000, 75000, 38000, 35000],
itemStyle: {
color: '#2196F3'
}
}
]
};
chart.setOption(option);
}
}, []);
return (
<div className="min-h-screen bg-gray-900 text-gray-100">
{/* Header */}
<header className="bg-gray-800 shadow-lg">
<div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
<div className="flex items-center space-x-8">
<h1 className="text-2xl font-bold text-gray-100">Personal Finance</h1>
<nav className="hidden md:flex space-x-6">
<button className="text-gray-300 hover:text-white whitespace-nowrap cursor-pointer !rounded-button">Overview</button>
<button className="text-gray-300 hover:text-white whitespace-nowrap cursor-pointer !rounded-button">Savings</button>
<button className="text-gray-300 hover:text-white whitespace-nowrap cursor-pointer !rounded-button">Expenses</button>
</nav>
</div>
<div className="flex items-center space-x-4">
<button
className="bg-blue-600 text-white px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer"
onClick={() => setShowNewGoalModal(true)}
>
<i className="fas fa-plus mr-2"></i>New Goal
</button>
<button className="text-gray-700 hover:text-gray-900 cursor-pointer">
<i className="fas fa-bell text-xl"></i>
</button>
<button className="text-gray-700 hover:text-gray-900 cursor-pointer">
<i className="fas fa-user-circle text-xl"></i>
</button>
</div>
</div>
</header>
<main className="max-w-7xl mx-auto px-4 py-8">
{/* Goals Overview */}
<section className="mb-12">
<div className="flex items-center justify-between mb-6">
<h2 className="text-xl font-semibold text-gray-900">Financial Goals</h2>
<div className="flex space-x-4">
<button
className={`px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer ${selectedGoal === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
onClick={() => setSelectedGoal('all')}
>
All Goals
</button>
<button
className={`px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer ${selectedGoal === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
onClick={() => setSelectedGoal('active')}
>
Active
</button>
<button
className={`px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer ${selectedGoal === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
onClick={() => setSelectedGoal('completed')}
>
Completed
</button>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{goals.map(goal => (
<div key={goal.id} className="bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow border border-gray-700">
<div className="relative h-40 mb-4 rounded-lg overflow-hidden">
<img src={goal.imageUrl} alt={goal.name} className="w-full h-full object-cover object-top" />
</div>
<h3 className="text-lg font-semibold text-gray-100 mb-2">{goal.name}</h3>
<div className="flex justify-between items-center mb-2">
<span className="text-sm text-gray-400">Target</span>
<span className="font-medium">₹{(goal.target/10000000).toFixed(2)} Cr</span>
</div>
<div className="w-full bg-gray-200 rounded-full h-2 mb-4">
<div
className="bg-blue-600 h-2 rounded-full"
style={{ width: `${goal.progress}%` }}
></div>
</div>
<div className="flex justify-between items-center text-sm text-gray-600">
<span>Monthly: ₹{goal.monthly.toLocaleString()}</span>
<span>{goal.progress}% Complete</span>
</div>
</div>
))}
</div>
</section>
{/* Charts Section */}
<section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
<div className="bg-white p-6 rounded-lg shadow-sm">
<div ref={retirementChartRef} style={{ height: '400px' }}></div>
</div>
<div className="bg-white p-6 rounded-lg shadow-sm">
<div ref={savingsChartRef} style={{ height: '400px' }}></div>
</div>
</section>
{/* Budget Overview */}
<section className="bg-gray-800 p-6 rounded-lg shadow-lg mb-12 border border-gray-700">
<h2 className="text-xl font-semibold text-gray-100 mb-6">Monthly Budget</h2>
<div ref={budgetChartRef} style={{ height: '400px' }}></div>
</section>
{/* Quick Actions Sidebar */}
<aside className="fixed right-0 top-0 h-screen w-64 bg-gray-800 shadow-lg transform translate-x-64 transition-transform duration-200 ease-in-out border-l border-gray-700">
<div className="p-6">
<h3 className="text-lg font-semibold text-gray-100 mb-4">Quick Actions</h3>
<div className="space-y-4">
<button className="w-full bg-blue-600 text-white px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-plus mr-2"></i>Add Funds
</button>
<button className="w-full bg-gray-100 text-gray-700 px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-edit mr-2"></i>Edit Goals
</button>
</div>
</div>
</aside>
</main>
{/* New Goal Modal */}
{showNewGoalModal && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<div className="bg-gray-800 rounded-lg p-8 w-full max-w-md border border-gray-700">
<div className="flex justify-between items-center mb-6">
<h3 className="text-xl font-semibold text-gray-100">Create New Goal</h3>
<button
className="text-gray-400 hover:text-gray-200"
onClick={() => setShowNewGoalModal(false)}
>
<i className="fas fa-times"></i>
</button>
</div>
<div className="space-y-4">
<div>
<label className="block text-sm font-medium text-gray-300 mb-1">Goal Name</label>
<input
type="text"
className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
value={newGoal.name}
onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
/>
{formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
</div>
<div>
<label className="block text-sm font-medium text-gray-300 mb-1">Target Amount (₹)</label>
<input
type="number"
className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
value={newGoal.target}
onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
/>
{formErrors.target && <p className="mt-1 text-sm text-red-500">{formErrors.target}</p>}
</div>
<div>
<label className="block text-sm font-medium text-gray-300 mb-1">Target Date</label>
<input
type="date"
className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
value={newGoal.completion}
onChange={(e) => setNewGoal({...newGoal, completion: e.target.value})}
/>
{formErrors.completion && <p className="mt-1 text-sm text-red-500">{formErrors.completion}</p>}
</div>
<div>
<label className="block text-sm font-medium text-gray-300 mb-1">Monthly Contribution (₹)</label>
<input
type="number"
className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
value={newGoal.monthly}
onChange={(e) => setNewGoal({...newGoal, monthly: e.target.value})}
/>
{formErrors.monthly && <p className="mt-1 text-sm text-red-500">{formErrors.monthly}</p>}
</div>
<div>
<label className="block text-sm font-medium text-gray-300 mb-1">Goal Type</label>
<select
className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
value={newGoal.type}
onChange={(e) => setNewGoal({...newGoal, type: e.target.value})}
>
<option value="home">Home Purchase</option>
<option value="retirement">Retirement</option>
<option value="emergency">Emergency Fund</option>
<option value="travel">Travel</option>
<option value="education">Education</option>
</select>
</div>
<button
className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors !rounded-button whitespace-nowrap"
onClick={handleSubmit}
>
Create Goal
</button>
</div>
</div>
</div>
)}
</div>
);
};
export default App
