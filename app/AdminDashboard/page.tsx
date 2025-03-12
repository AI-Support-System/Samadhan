// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';

const AdminDashboard: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);
  const [showChatbot, setShowChatbot] = useState<boolean>(false);

  const departments = [
    {
      name: 'Loan Department',
      description: 'Manage loan applications and processing',
      icon: 'fa-money-bill-wave'
    },
    {
      name: 'Fraud Detection',
      description: 'Monitor and investigate suspicious activities',
      icon: 'fa-shield-alt'
    },
    {
      name: 'Customer Support',
      description: 'Handle customer queries and complaints',
      icon: 'fa-headset'
    }
  ];

  const queries = [
    {
      id: 1,
      customerName: 'James Wilson',
      queryType: 'Loan Application',
      dateSubmitted: '2025-03-04',
      status: 'Pending',
      priority: 'High'
    },
    {
      id: 2,
      customerName: 'Emily Thompson',
      queryType: 'Account Security',
      dateSubmitted: '2025-03-03',
      status: 'In Progress',
      priority: 'Medium'
    },
    {
      id: 3,
      customerName: 'Michael Anderson',
      queryType: 'Transaction Dispute',
      dateSubmitted: '2025-03-02',
      status: 'Resolved',
      priority: 'Low'
    },
    {
      id: 4,
      customerName: 'Sarah Johnson',
      queryType: 'Credit Card Issue',
      dateSubmitted: '2025-03-01',
      status: 'Pending',
      priority: 'High'
    },
    {
      id: 5,
      customerName: 'Robert Davis',
      queryType: 'Mobile Banking',
      dateSubmitted: '2025-02-29',
      status: 'In Progress',
      priority: 'Medium'
    }
  ];

  const initCharts = () => {
    const statusChartDom = document.getElementById('statusChart');
    const timeChartDom = document.getElementById('timeChart');
    
    if (statusChartDom && timeChartDom) {
      const statusChart = echarts.init(statusChartDom);
      const timeChart = echarts.init(timeChartDom);

      const statusOption = {
        animation: false,
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Query Status',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 35, name: 'Pending' },
              { value: 45, name: 'In Progress' },
              { value: 20, name: 'Resolved' }
            ]
          }
        ]
      };

      const timeOption = {
        animation: false,
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [12, 15, 8, 10, 14],
            type: 'bar',
            barWidth: '60%',
            itemStyle: {
              color: '#1a73e8'
            }
          }
        ]
      };

      statusChart.setOption(statusOption);
      timeChart.setOption(timeOption);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      initCharts();
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedDepartment('');
  };

  if (!selectedDepartment) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">SecureBank Admin Portal</h1>
            <p className="text-xl text-gray-600">Select Your Department to Continue</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {departments.map((dept) => (
              <div
                key={dept.name}
                className="bg-white rounded-lg shadow-lg p-8 cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => setSelectedDepartment(dept.name)}
              >
                <i className={`fas ${dept.icon} text-4xl text-blue-600 mb-4`}></i>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{dept.name}</h2>
                <p className="text-gray-600">{dept.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">{selectedDepartment}</h2>
          <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Employee ID
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </form>
            <div className="mt-6">
              <button
                onClick={() => setSelectedDepartment('')}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-500"
              >
                Back to Department Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex items-center justify-between">
          <h1 className={`text-xl font-bold text-blue-600 ${!isSidebarOpen && 'hidden'}`}>SecureBank</h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:text-gray-700">
            <i className={`fas fa-${isSidebarOpen ? 'times' : 'bars'}`}></i>
          </button>
        </div>
        <nav className="mt-8">
          <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600">
            <i className="fas fa-home w-8"></i>
            {isSidebarOpen && <span>Dashboard</span>}
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600">
            <i className="fas fa-tasks w-8"></i>
            {isSidebarOpen && <span>Queries</span>}
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600">
            <i className="fas fa-chart-bar w-8"></i>
            {isSidebarOpen && <span>Analytics</span>}
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600">
            <i className="fas fa-cog w-8"></i>
            {isSidebarOpen && <span>Settings</span>}
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Navbar */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex-1 flex items-center">
                <div className="w-full max-w-lg lg:max-w-xs">
                  <label htmlFor="search" className="sr-only">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-search text-gray-400"></i>
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <i className="fas fa-bell"></i>
                </button>
                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex items-center max-w-xs bg-white rounded-full focus:outline-none"
                    >
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://public.readdy.ai/ai/img_res/67499d3fd34330c6953ac7d6fc88bc9b.jpg"
                        alt="Profile"
                      />
                    </button>
                  </div>
                  {showProfileDropdown && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <i className="fas fa-ticket-alt text-white"></i>
                </div>
                <div className="ml-5">
                  <p className="text-gray-500 text-sm font-medium">Total Queries</p>
                  <p className="text-2xl font-semibold text-gray-900">1,284</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <i className="fas fa-check-circle text-white"></i>
                </div>
                <div className="ml-5">
                  <p className="text-gray-500 text-sm font-medium">Resolved</p>
                  <p className="text-2xl font-semibold text-gray-900">854</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <i className="fas fa-clock text-white"></i>
                </div>
                <div className="ml-5">
                  <p className="text-gray-500 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">430</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <i className="fas fa-stopwatch text-white"></i>
                </div>
                <div className="ml-5">
                  <p className="text-gray-500 text-sm font-medium">Avg. Response</p>
                  <p className="text-2xl font-semibold text-gray-900">2.4h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Query Status Distribution</h3>
              <div id="statusChart" style={{ height: '300px' }}></div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resolution Time Trend</h3>
              <div id="timeChart" style={{ height: '300px' }}></div>
            </div>
          </div>

          {/* Queries Table */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Queries</h3>
                <div className="relative">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                  >
                    {selectedStatus === 'all' ? 'All Status' : selectedStatus}
                    <i className="fas fa-chevron-down ml-2"></i>
                  </button>
                  {showStatusDropdown && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        {['all', 'Pending', 'In Progress', 'Resolved'].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setSelectedStatus(status);
                              setShowStatusDropdown(false);
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            {status === 'all' ? 'All Status' : status}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Query Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {queries.map((query) => (
                    <tr key={query.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{query.customerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{query.queryType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{query.dateSubmitted}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${query.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          query.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}>
                          {query.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${query.priority === 'High' ? 'bg-red-100 text-red-800' : 
                          query.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'}`}>
                          {query.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="text-green-600 hover:text-green-900 mr-4">
                          <i className="fas fa-check"></i>
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Chatbot */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setShowChatbot(!showChatbot)}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
        >
          <i className={`fas fa-${showChatbot ? 'times' : 'comments'}`}></i>
        </button>
        {showChatbot && (
          <div className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-xl">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">AI Assistant</h3>
            </div>
            <div className="h-96 overflow-y-auto p-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-end">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm">Hello! How can I help you today?</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

