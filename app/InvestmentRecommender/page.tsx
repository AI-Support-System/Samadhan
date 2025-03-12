import React, { useState } from 'react';

const InvestmentRecommender = () => {
  // State for form inputs
  const [savings, setSavings] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [riskTolerance, setRiskTolerance] = useState('medium');
  const [investmentGoal, setInvestmentGoal] = useState('growth');
  const [timeHorizon, setTimeHorizon] = useState('medium');
  const [recommendations, setRecommendations] = useState(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [customAllocations, setCustomAllocations] = useState({});
  const [isCustomizing, setIsCustomizing] = useState(false);
  
  // Currency symbols and conversion rates (relative to USD)
  const currencies = {
    USD: { symbol: '$', rate: 1, name: 'US Dollar' },
    INR: { symbol: '₹', rate: 0.012, name: 'Indian Rupee' },
    EUR: { symbol: '€', rate: 1.09, name: 'Euro' },
    GBP: { symbol: '£', rate: 1.29, name: 'British Pound' },
    JPY: { symbol: '¥', rate: 0.0067, name: 'Japanese Yen' }
  };
  
  // Investment goals
  const investmentGoals = {
    growth: { name: 'Wealth Growth', description: 'Focus on growing wealth over time', icon: '📈' },
    retirement: { name: 'Retirement', description: 'Planning for retirement years', icon: '🏖️' },
    education: { name: 'Education', description: 'Saving for education expenses', icon: '🎓' },
    home: { name: 'Home Purchase', description: 'Saving for a home down payment', icon: '🏠' },
    emergency: { name: 'Emergency Fund', description: 'Building a safety net', icon: '🛡️' }
  };
  
  // Time horizons
  const timeHorizons = {
    short: { name: 'Short-term (0-2 years)', expectedReturn: { low: 2, medium: 4, high: 7 } },
    medium: { name: 'Medium-term (3-7 years)', expectedReturn: { low: 4, medium: 7, high: 12 } },
    long: { name: 'Long-term (8+ years)', expectedReturn: { low: 6, medium: 10, high: 15 } }
  };
  
  // Mock market conditions - in a real app, this would come from an API
  const marketConditions = {
    gold: { trend: 'falling', opportunity: 'high', description: 'Gold prices have fallen recently, presenting a buying opportunity', historicalReturn: 3.5 },
    stocks: { trend: 'rising', opportunity: 'medium', description: 'Stock market has been on an upward trend with moderate volatility', historicalReturn: 10 },
    bonds: { trend: 'stable', opportunity: 'low', description: 'Government bonds offer stable but lower returns', historicalReturn: 5 },
    realEstate: { trend: 'stable', opportunity: 'medium', description: 'Real estate market is stable with good long-term outlook', historicalReturn: 7 },
    mutualFunds: { trend: 'mixed', opportunity: 'medium', description: 'Mutual funds offer diversified exposure with varying returns', historicalReturn: 8 },
    crypto: { trend: 'volatile', opportunity: 'high', description: 'Cryptocurrency market shows high volatility and risk', historicalReturn: 15 },
    fixedDeposits: { trend: 'stable', opportunity: 'low', description: 'Fixed deposits provide secure returns with low risk', historicalReturn: 3 }
  };

  // Current economic indicators
  const economicIndicators = {
    inflation: '2.7%',
    interestRate: '3.2%',
    gdpGrowth: '1.9%',
    marketSentiment: 'Neutral',
    lastUpdated: 'March 8, 2025'
  };
  
  // Function to adjust allocations based on goals and time horizon
  const getBaseInvestments = (risk, goal, horizon) => {
    let baseInvestments = [];
    
    // Base allocations by risk
    if (risk === 'low') {
      baseInvestments = [
        { type: 'Government Bonds', percentage: 50, marketInfo: marketConditions.bonds },
        { type: 'Fixed Deposits', percentage: 30, marketInfo: marketConditions.fixedDeposits },
        { type: 'Gold', percentage: 20, marketInfo: marketConditions.gold }
      ];
    } else if (risk === 'medium') {
      baseInvestments = [
        { type: 'Mutual Funds', percentage: 40, marketInfo: marketConditions.mutualFunds },
        { type: 'Blue-chip Stocks', percentage: 30, marketInfo: marketConditions.stocks },
        { type: 'Government Bonds', percentage: 20, marketInfo: marketConditions.bonds },
        { type: 'Gold', percentage: 10, marketInfo: marketConditions.gold }
      ];
    } else {
      baseInvestments = [
        { type: 'Growth Stocks', percentage: 50, marketInfo: marketConditions.stocks },
        { type: 'Real Estate Investment Trusts', percentage: 20, marketInfo: marketConditions.realEstate },
        { type: 'Cryptocurrency', percentage: 15, marketInfo: marketConditions.crypto },
        { type: 'Mutual Funds', percentage: 15, marketInfo: marketConditions.mutualFunds }
      ];
    }
    
    // Adjust based on goal
    if (goal === 'retirement' && horizon === 'long') {
      // Increase stocks for long-term retirement
      baseInvestments = baseInvestments.map(inv => {
        if (inv.type.includes('Stocks') || inv.type.includes('Mutual Funds')) {
          return { ...inv, percentage: Math.min(inv.percentage + 5, 100) };
        } else if (inv.type.includes('Bonds') || inv.type.includes('Deposits')) {
          return { ...inv, percentage: Math.max(inv.percentage - 5, 0) };
        }
        return inv;
      });
    } else if (goal === 'education' && horizon === 'medium') {
      // More balanced for education
      baseInvestments = baseInvestments.map(inv => {
        if (inv.type.includes('Mutual Funds')) {
          return { ...inv, percentage: Math.min(inv.percentage + 5, 100) };
        } else if (inv.type.includes('Crypto')) {
          return { ...inv, percentage: Math.max(inv.percentage - 5, 0) };
        }
        return inv;
      });
    } else if (goal === 'home' && horizon === 'short') {
      // More conservative for home purchase
      baseInvestments = baseInvestments.map(inv => {
        if (inv.type.includes('Bonds') || inv.type.includes('Deposits')) {
          return { ...inv, percentage: Math.min(inv.percentage + 10, 100) };
        } else if (inv.type.includes('Stocks') || inv.type.includes('Crypto')) {
          return { ...inv, percentage: Math.max(inv.percentage - 10, 0) };
        }
        return inv;
      });
    } else if (goal === 'emergency') {
      // Very liquid and safe for emergency fund
      baseInvestments = baseInvestments.map(inv => {
        if (inv.type.includes('Deposits') || inv.type.includes('Bonds')) {
          return { ...inv, percentage: Math.min(inv.percentage + 15, 100) };
        } else if (inv.type.includes('Stocks') || inv.type.includes('Crypto') || inv.type.includes('Real Estate')) {
          return { ...inv, percentage: Math.max(inv.percentage - 15, 0) };
        }
        return inv;
      });
    }
    
    // Normalize percentages to ensure they sum to 100%
    const total = baseInvestments.reduce((sum, inv) => sum + inv.percentage, 0);
    return baseInvestments.map(inv => ({
      ...inv,
      percentage: Math.round((inv.percentage / total) * 100)
    }));
  };
  
  // Calculate expected returns based on allocation and time horizon
  const calculateExpectedReturns = (investments, horizon) => {
    const years = horizon === 'short' ? 2 : horizon === 'medium' ? 5 : 10;
    
    const weightedAnnualReturn = investments.reduce((sum, inv) => {
      const annualReturn = inv.marketInfo ? inv.marketInfo.historicalReturn : 3; // Default to 3% if no data
      return sum + (annualReturn * (inv.percentage / 100));
    }, 0);
    
    // Compound annual growth rate formula
    const futureValue = (amount) => amount * Math.pow(1 + (weightedAnnualReturn / 100), years);
    const totalGrowth = (amount) => futureValue(amount) - amount;
    const annualizedReturn = weightedAnnualReturn.toFixed(2);
    
    return {
      years,
      annualizedReturn,
      futureValue,
      totalGrowth,
      weightedAnnualReturn
    };
  };
  
  // Initialize custom allocations when investments change
  const initCustomAllocations = (investments) => {
    const newCustomAllocations = {};
    investments.forEach(inv => {
      newCustomAllocations[inv.type] = inv.percentage;
    });
    setCustomAllocations(newCustomAllocations);
  };
  
  // Handle slider change for custom allocations
  const handleAllocationChange = (type, value) => {
    setCustomAllocations({
      ...customAllocations,
      [type]: parseInt(value)
    });
  };
  
  // Apply custom allocations
  const applyCustomAllocations = () => {
    // Check if allocations sum to 100%
    const total = Object.values(customAllocations).reduce((sum, val) => sum + val, 0);
    if (total !== 100) {
      alert(`Total allocation must equal 100%. Current total: ${total}%`);
      return;
    }
    
    // Update recommendations with custom allocations
    const updatedInvestments = recommendations.investments.map(inv => ({
      ...inv,
      percentage: customAllocations[inv.type],
      amountLocal: (recommendations.totalAmountLocal * customAllocations[inv.type] / 100).toFixed(2),
      amountUSD: (recommendations.totalAmountUSD * customAllocations[inv.type] / 100).toFixed(2)
    }));
    
    const updatedReturns = calculateExpectedReturns(updatedInvestments, timeHorizon);
    
    setRecommendations({
      ...recommendations,
      investments: updatedInvestments,
      returns: updatedReturns,
      isCustomized: true
    });
    
    setIsCustomizing(false);
  };
  
  // Generate investment recommendations based on inputs
  const generateRecommendations = () => {
    if (!savings || isNaN(parseFloat(savings))) {
      alert('Please enter a valid savings amount');
      return;
    }
    
    const amountInLocalCurrency = parseFloat(savings);
    // Convert to USD for calculations
    const amountInUSD = amountInLocalCurrency * currencies[currency].rate;
    
    // Get base investments adjusted for goals and time horizon
    const investments = getBaseInvestments(riskTolerance, investmentGoal, timeHorizon);
    
    // Calculate amounts based on percentages (in local currency)
    const calculatedInvestments = investments.map(inv => ({
      ...inv,
      amountUSD: (amountInUSD * inv.percentage / 100).toFixed(2),
      amountLocal: (amountInLocalCurrency * inv.percentage / 100).toFixed(2)
    }));
    
    // Calculate expected returns
    const returns = calculateExpectedReturns(calculatedInvestments, timeHorizon);
    
    // Find special opportunities based on market conditions
    const opportunities = Object.entries(marketConditions)
      .filter(([_, condition]) => condition.opportunity === 'high')
      .map(([asset, condition]) => ({ asset, condition }));
    
    const newRecommendations = { 
      investments: calculatedInvestments, 
      opportunities, 
      totalAmountUSD: amountInUSD,
      totalAmountLocal: amountInLocalCurrency,
      selectedCurrency: currency,
      returns,
      isCustomized: false,
      goal: investmentGoal,
      horizon: timeHorizon
    };
    
    setRecommendations(newRecommendations);
    initCustomAllocations(calculatedInvestments);
  };
  
  // Reset form
  const resetForm = () => {
    setSavings('');
    setRiskTolerance('medium');
    setInvestmentGoal('growth');
    setTimeHorizon('medium');
    setRecommendations(null);
    setIsCustomizing(false);
    setShowAdvancedOptions(false);
  };
  
  // Format currency
  const formatCurrency = (amount, currencyCode) => {
    return `${currencies[currencyCode].symbol}${parseFloat(amount).toFixed(2)}`;
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-blue-800">Investment Advisor</h2>
      <p className="text-gray-600 mb-6">Smart recommendations based on your goals and market conditions</p>
      
      {!recommendations ? (
        <>
          <div className="mb-8 bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700">Tell us about your savings and investment preferences, and we'll recommend an investment strategy tailored to your needs and current market conditions.</p>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Investment Goal
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(investmentGoals).map(([key, goal]) => (
                    <div 
                      key={key}
                      className={`p-3 border rounded-md cursor-pointer flex items-center ${investmentGoal === key ? 'bg-blue-50 border-blue-500' : 'border-gray-300'}`}
                      onClick={() => setInvestmentGoal(key)}
                    >
                      <span className="text-xl mr-3">{goal.icon}</span>
                      <div>
                        <h3 className="font-medium">{goal.name}</h3>
                        <p className="text-xs text-gray-600">{goal.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Time Horizon
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(e.target.value)}
                  >
                    {Object.entries(timeHorizons).map(([key, horizon]) => (
                      <option key={key} value={key}>{horizon.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Risk Tolerance
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div 
                      className={`p-3 border rounded-md text-center cursor-pointer ${riskTolerance === 'low' ? 'bg-green-100 border-green-500' : 'border-gray-300'}`}
                      onClick={() => setRiskTolerance('low')}
                    >
                      <h3 className="font-medium">Low</h3>
                      <p className="text-xs text-gray-600">Safe returns</p>
                    </div>
                    <div 
                      className={`p-3 border rounded-md text-center cursor-pointer ${riskTolerance === 'medium' ? 'bg-yellow-100 border-yellow-500' : 'border-gray-300'}`}
                      onClick={() => setRiskTolerance('medium')}
                    >
                      <h3 className="font-medium">Medium</h3>
                      <p className="text-xs text-gray-600">Balanced</p>
                    </div>
                    <div 
                      className={`p-3 border rounded-md text-center cursor-pointer ${riskTolerance === 'high' ? 'bg-red-100 border-red-500' : 'border-gray-300'}`}
                      onClick={() => setRiskTolerance('high')}
                    >
                      <h3 className="font-medium">High</h3>
                      <p className="text-xs text-gray-600">Growth focus</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label htmlFor="savings" className="block text-gray-700 font-medium mb-2">
                  Available Savings Amount
                </label>
                <input
                  type="number"
                  id="savings"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={savings}
                  onChange={(e) => setSavings(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label htmlFor="currency" className="block text-gray-700 font-medium mb-2">
                  Currency
                </label>
                <select
                  id="currency"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {Object.entries(currencies).map(([code, { name }]) => (
                    <option key={code} value={code}>
                      {code} - {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              onClick={generateRecommendations}
            >
              Get Investment Recommendations
            </button>
          </div>
        </>
      ) : (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-blue-800">Your Personalized Investment Plan</h3>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-300"
                onClick={resetForm}
              >
                New Plan
              </button>
              <button
                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition duration-300"
                onClick={() => window.print()}
              >
                Print/Save
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold text-blue-800 mb-2">Investment Summary</h4>
              <p className="text-gray-700">
                Amount: <span className="font-bold">
                  {formatCurrency(recommendations.totalAmountLocal, recommendations.selectedCurrency)}
                </span>
                {recommendations.selectedCurrency !== 'USD' && (
                  <span className="text-sm text-gray-500"> (approx. ${recommendations.totalAmountUSD.toFixed(2)} USD)</span>
                )}
              </p>
              <p className="text-gray-700 mt-1">Goal: <span className="font-bold">{investmentGoals[recommendations.goal].name}</span></p>
              <p className="text-gray-700 mt-1">Horizon: <span className="font-bold">{timeHorizons[recommendations.horizon].name}</span></p>
              <p className="text-gray-700 mt-1">Risk Profile: <span className="font-bold capitalize">{riskTolerance}</span></p>
              {recommendations.isCustomized && (
                <div className="mt-2 text-xs inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded">Custom Allocation</div>
              )}
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-bold text-green-800 mb-2">Expected Returns</h4>
              <p className="text-gray-700">Annual Return: <span className="font-bold">{recommendations.returns.annualizedReturn}%</span></p>
              <p className="text-gray-700 mt-1">
                After {recommendations.returns.years} years: <span className="font-bold">
                  {formatCurrency(recommendations.returns.futureValue(recommendations.totalAmountLocal), recommendations.selectedCurrency)}
                </span>
              </p>
              <p className="text-gray-700 mt-1">
                Total Growth: <span className="font-bold text-green-700">
                  {formatCurrency(recommendations.returns.totalGrowth(recommendations.totalAmountLocal), recommendations.selectedCurrency)}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-2">*Based on historical performance, not guaranteed</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-bold text-yellow-800 mb-2">Market Insights</h4>
              <p className="text-gray-700 text-sm mb-1">Inflation: <span className="font-medium">{economicIndicators.inflation}</span></p>
              <p className="text-gray-700 text-sm mb-1">Interest Rate: <span className="font-medium">{economicIndicators.interestRate}</span></p>
              <p className="text-gray-700 text-sm mb-1">GDP Growth: <span className="font-medium">{economicIndicators.gdpGrowth}</span></p>
              <p className="text-gray-700 text-sm mb-1">Market Sentiment: <span className="font-medium">{economicIndicators.marketSentiment}</span></p>
              <p className="text-xs text-gray-500 mt-2">Last updated: {economicIndicators.lastUpdated}</p>
            </div>
          </div>
          
          {recommendations.opportunities.length > 0 && (
            <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-bold text-yellow-800 mb-2">Current Market Opportunities</h4>
              <ul className="list-disc pl-5 space-y-1">
                {recommendations.opportunities.map((opportunity, idx) => (
                  <li key={idx} className="text-gray-700">
                    <span className="font-medium capitalize">{opportunity.asset}</span>: {opportunity.condition.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mb-4 flex justify-between items-center">
            <h4 className="font-bold text-gray-800">Portfolio Allocation</h4>
            {!isCustomizing ? (
              <button
                className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition duration-300"
                onClick={() => setIsCustomizing(true)}
              >
                Customize Allocation
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-300"
                  onClick={() => setIsCustomizing(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition duration-300"
                  onClick={applyCustomAllocations}
                >
                  Apply Changes
                </button>
              </div>
            )}
          </div>
          
          <div className="overflow-hidden rounded-lg border border-gray-200 mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount ({currencies[recommendations.selectedCurrency].symbol})</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Annual Return</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Trend</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recommendations.investments.map((investment, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{investment.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isCustomizing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={customAllocations[investment.type]}
                            onChange={(e) => handleAllocationChange(investment.type, e.target.value)}
                            className="w-24"
                          />
                          <span>{customAllocations[investment.type]}%</span>
                        </div>
                      ) : (
                        `${investment.percentage}%`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(investment.amountLocal, recommendations.selectedCurrency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {investment.marketInfo ? `${investment.marketInfo.historicalReturn}%` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {investment.marketInfo ? (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${investment.marketInfo.trend === 'rising' ? 'bg-green-100 text-green-800' : 
                            investment.marketInfo.trend === 'falling' ? 'bg-red-100 text-red-800' : 
                            investment.marketInfo.trend === 'volatile' ? 'bg-purple-100 text-purple-800' : 
                            'bg-blue-100 text-blue-800'}`
                        }>
                          {investment.marketInfo.trend.charAt(0).toUpperCase() + investment.marketInfo.trend.slice(1)}
                        </span>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 p-4 border-t pt-4 text-gray-600 text-sm">
            <h4 className="font-bold text-gray-700 mb-2">Important Information</h4>
            <p>These recommendations are based on current market conditions and your specified preferences. Past performance does not guarantee future results.</p>
            <p className="mt-1">Consider consulting with a financial advisor before making investment decisions. The expected returns are projections based on historical data and actual results may vary.</p>
            <p className="mt-1">Risk Warning: Investments can go up and down in value, and you may get back less than you invest.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentRecommender;