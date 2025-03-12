import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import * as echarts from "echarts";
const UserDashboard: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState(false);
  const transactions = [
    {
      id: 1,
      type: "shopping",
      amount: -128.5,
      merchant: "Amazon Prime",
      date: "2025-03-11",
      icon: "fa-shopping-cart",
    },
    {
      id: 2,
      type: "travel",
      amount: -432.75,
      merchant: "United Airlines",
      date: "2025-03-10",
      icon: "fa-plane",
    },
    {
      id: 3,
      type: "income",
      amount: 3500.0,
      merchant: "Salary Deposit",
      date: "2025-03-09",
      icon: "fa-money-bill-wave",
    },
    {
      id: 4,
      type: "food",
      amount: -65.2,
      merchant: "Whole Foods Market",
      date: "2025-03-08",
      icon: "fa-utensils",
    },
    {
      id: 5,
      type: "bills",
      amount: -189.99,
      merchant: "Electric Company",
      date: "2025-03-07",
      icon: "fa-bolt",
    },
  ];
  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const option = {
        animation: false,
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)",
        },
        series: [
          {
            type: "pie",
            radius: ["50%", "70%"],
            itemStyle: {
              borderRadius: 10,
              borderColor: "#0A0A0F",
              borderWidth: 2,
            },
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: false,
              },
            },
            data: [
              { value: 35, name: "Shopping", itemStyle: { color: "#00F0FF" } },
              { value: 25, name: "Travel", itemStyle: { color: "#B026FF" } },
              { value: 20, name: "Food", itemStyle: { color: "#FF2E6C" } },
              { value: 15, name: "Bills", itemStyle: { color: "#36D399" } },
              { value: 5, name: "Others", itemStyle: { color: "#FFB86C" } },
            ],
          },
        ],
      };
      chart.setOption(option);
    }
  }, []);
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-[Rajdhani] p-6">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#00F0FF] to-[#B026FF] bg-clip-text text-transparent">
            NeoBank
          </div>
          <div className="flex items-center gap-6">
            <button
              className="!rounded-button cursor-pointer relative"
              onClick={() => setNotifications(!notifications)}
            >
              <i className="fas fa-bell text-[#00F0FF] text-xl"></i>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF2E6C] rounded-full"></div>
            </button>
            <div className="relative">
              <button
                className="flex items-center gap-2 !rounded-button cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#B026FF] p-[2px]">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src="https://public.readdy.ai/ai/img_res/d68144d338e6533dd1c4bdeeaa9458f4.jpg"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-[#00F0FF]">Alexander Mitchell</span>
                <i className="fas fa-chevron-down text-[#00F0FF] text-sm"></i>
              </button>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Balance Card */}
          <div className="col-span-8 bg-[#12121A] rounded-xl p-6 border border-[#1A1A2E] shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">Total Balance</h2>
              <button
                className="!rounded-button cursor-pointer"
                onClick={() => setShowBalance(!showBalance)}
              >
                <i
                  className={`fas ${showBalance ? "fa-eye" : "fa-eye-slash"} text-[#00F0FF]`}
                ></i>
              </button>
            </div>
            <div
              className={`text-4xl font-bold transition-all duration-300 ${showBalance ? "" : "blur-md"}`}
            >
              $87,429.65
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-[#1A1A2E] rounded-lg p-4">
                <div className="text-sm text-gray-400">Monthly Income</div>
                <div
                  className={`text-xl font-bold text-[#36D399] transition-all duration-300 ${showBalance ? "" : "blur-md"}`}
                >
                  +$12,500.00
                </div>
              </div>
              <div className="bg-[#1A1A2E] rounded-lg p-4">
                <div className="text-sm text-gray-400">Monthly Expenses</div>
                <div
                  className={`text-xl font-bold text-[#FF2E6C] transition-all duration-300 ${showBalance ? "" : "blur-md"}`}
                >
                  -$4,280.35
                </div>
              </div>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="col-span-4 bg-[#12121A] rounded-xl p-6 border border-[#1A1A2E] shadow-lg">
            <h2 className="text-xl mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <a
                href="https://readdy.ai/home/bbab4429-1404-4fc5-9164-78c5c802e19a/d673875f-1e6c-4a13-b4b4-7b8e014810f2"
                data-readdy="true"
                className="block"
              >
                <button className="bg-[#1A1A2E] p-4 rounded-lg text-center hover:bg-[#252538] transition-all !rounded-button cursor-pointer w-full">
                  <i className="fas fa-exchange-alt text-[#00F0FF] text-xl mb-2"></i>
                  <div className="text-sm">Transfer</div>
                </button>
              </a>
              <button className="bg-[#1A1A2E] p-4 rounded-lg text-center hover:bg-[#252538] transition-all !rounded-button cursor-pointer">
                <i className="fas fa-credit-card text-[#B026FF] text-xl mb-2"></i>
                <div className="text-sm">Pay Bills</div>
              </button>
              <button className="bg-[#1A1A2E] p-4 rounded-lg text-center hover:bg-[#252538] transition-all !rounded-button cursor-pointer">
                <i className="fas fa-piggy-bank text-[#FF2E6C] text-xl mb-2"></i>
                <div className="text-sm">Save</div>
              </button>
              <button className="bg-[#1A1A2E] p-4 rounded-lg text-center hover:bg-[#252538] transition-all !rounded-button cursor-pointer">
                <i className="fas fa-chart-line text-[#36D399] text-xl mb-2"></i>
                <div className="text-sm">Invest</div>
              </button>
            </div>
          </div>
          {/* Transactions */}
          <div className="col-span-8 bg-[#12121A] rounded-xl p-6 border border-[#1A1A2E] shadow-lg">
            <h2 className="text-xl mb-4">Recent Transactions</h2>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-[#1A1A2E] rounded-lg p-4 flex items-center justify-between hover:bg-[#252538] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#252538] flex items-center justify-center">
                      <i
                        className={`fas ${transaction.icon} text-[#00F0FF]`}
                      ></i>
                    </div>
                    <div>
                      <div className="font-medium">{transaction.merchant}</div>
                      <div className="text-sm text-gray-400">
                        {transaction.date}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`font-bold ${transaction.amount > 0 ? "text-[#36D399]" : "text-[#FF2E6C]"}`}
                  >
                    {transaction.amount > 0 ? "+" : ""}
                    {transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Expense Analytics */}
          <div className="col-span-4 bg-[#12121A] rounded-xl p-6 border border-[#1A1A2E] shadow-lg">
            <h2 className="text-xl mb-4">Expense Analytics</h2>
            <div ref={chartRef} className="w-full h-[300px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserDashboard;