'use client';
import React, { useState } from 'react';
import "@/app/styles/Investment.css"

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
  type RiskLevel = 'low' | 'medium' | 'high';
  type GoalType = 'retirement' | 'education' | 'home' | 'emergency';
  type TimeHorizon = 'short' | 'medium' | 'long';
  // Function to adjust allocations based on goals and time horizon
  const getBaseInvestments = ( risk: RiskLevel,  // Explicitly defining the type here
    goal: GoalType,
    horizon: TimeHorizon) => {
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

  interface MarketInfo {
    trend: string;
    volatility: number;
    historicalReturn: number;  // Add this property
    // Any other properties you need
  }
  
  type Investment = {
    type: string;
    percentage: number;
    amountLocal: string;
    amountUSD: string;
    marketInfo: MarketInfo;
  };
  
  // Define the investments array type
  type Investments = Investment[];
  // Calculate expected returns based on allocation and time horizon
  const calculateExpectedReturns = (investments: Investments, horizon: TimeHorizon) => {
    const years = horizon === 'short' ? 2 : horizon === 'medium' ? 5 : 10;
    
    const weightedAnnualReturn = investments.reduce((sum, inv) => {
      const annualReturn = inv.marketInfo ? inv.marketInfo.historicalReturn : 3; // Default to 3% if no data
      return sum + (annualReturn * (inv.percentage / 100));
    }, 0);
    
    // Compound annual growth rate formula
    const futureValue = (amount:number) => amount * Math.pow(1 + (weightedAnnualReturn / 100), years);
    const totalGrowth = (amount:number) => futureValue(amount) - amount;
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
  const initCustomAllocations = (investments: Investments) => {
    // Define the correct type for the object
    const newCustomAllocations: Record<string, number> = {};
    
    investments.forEach(inv => {
      newCustomAllocations[inv.type] = inv.percentage;
    });
    
    setCustomAllocations(newCustomAllocations);
  };
  
  // Handle slider change for custom allocations
  const handleAllocationChange = (type: string, value: string | number) => {
    const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
    
    setCustomAllocations({
      ...customAllocations,
      [type]: numericValue
    });
  };
  
  interface Recommendations {
    investments: Investment[];
    totalAmountLocal: number;
    totalAmountUSD: number;
    returns: ReturnEstimates;
    isCustomized: boolean;
    // Add other properties as needed
  }

  interface ReturnEstimates {
    // Define properties for your return estimates
    expected: number;
    conservative: number;
    aggressive: number;
    // Add other properties as needed
  }
 

  // Apply custom allocations
  const applyCustomAllocations = () => {
    // Check if allocations sum to 100%
    const total = (Object.values(customAllocations) as number[]).reduce((sum, val) => sum + val, 0);
    if (total !== 100) {
      alert(`Total allocation must equal 100%. Current total: ${total}%`);
      return;
    }
    
    if (!recommendations) {
      // Handle the null case - maybe show an error or return early
      alert('No recommendations available');
      return;
    }
  
    // Update recommendations with custom allocations
    const updatedInvestments: Investment[] = recommendations.investments.map((inv: Investment) => ({
      ...inv,
      percentage: customAllocations[inv.type] ?? 0, // Use nullish coalescing for safety
      amountLocal: (recommendations.totalAmountLocal * (customAllocations[inv.type] ?? 0) / 100).toFixed(2),
      amountUSD: (recommendations.totalAmountUSD * (customAllocations[inv.type] ?? 0) / 100).toFixed(2)
    }));
    
    const updatedReturns = calculateExpectedReturns(updatedInvestments, horizon);
    
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
    <div className="investment-advisor-container">
  <h2 className="advisor-title">Investment Advisor</h2>
  <p className="advisor-subtitle">Smart recommendations based on your goals and market conditions</p>
  
  {!recommendations ? (
    <>
      <div className="intro-panel">
        <p className="intro-text">Tell us about your savings and investment preferences, and we'll recommend an investment strategy tailored to your needs and current market conditions.</p>
      </div>
      
      <div className="form-container">
        <div className="form-grid">
          <div className="goal-column">
            <label className="form-label">
              Investment Goal
            </label>
            <div className="goal-options">
              {Object.entries(investmentGoals).map(([key, goal]) => (
                <div 
                  key={key}
                  className={`goal-option ${investmentGoal === key ? 'goal-option-selected' : ''}`}
                  onClick={() => setInvestmentGoal(key)}
                >
                  <span className="goal-icon">{goal.icon}</span>
                  <div>
                    <h3 className="goal-name">{goal.name}</h3>
                    <p className="goal-description">{goal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="timeframe-column">
            <div className="time-horizon-container">
              <label className="form-label">
                Time Horizon
              </label>
              <select
                className="form-select"
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(e.target.value)}
              >
                {Object.entries(timeHorizons).map(([key, horizon]) => (
                  <option key={key} value={key}>{horizon.name}</option>
                ))}
              </select>
            </div>
            
            <div className="risk-container">
              <label className="form-label">
                Risk Tolerance
              </label>
              <div className="risk-options">
                <div 
                  className={`risk-option ${riskTolerance === 'low' ? 'risk-low-selected' : ''}`}
                  onClick={() => setRiskTolerance('low')}
                >
                  <h3 className="risk-level-name">Low</h3>
                  <p className="risk-level-description">Safe returns</p>
                </div>
                <div 
                  className={`risk-option ${riskTolerance === 'medium' ? 'risk-medium-selected' : ''}`}
                  onClick={() => setRiskTolerance('medium')}
                >
                  <h3 className="risk-level-name">Medium</h3>
                  <p className="risk-level-description">Balanced</p>
                </div>
                <div 
                  className={`risk-option ${riskTolerance === 'high' ? 'risk-high-selected' : ''}`}
                  onClick={() => setRiskTolerance('high')}
                >
                  <h3 className="risk-level-name">High</h3>
                  <p className="risk-level-description">Growth focus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="savings-grid">
          <div className="savings-amount-container">
            <label htmlFor="savings" className="form-label">
              Available Savings Amount
            </label>
            <input
              type="number"
              id="savings"
              className="form-input"
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          <div className="currency-container">
            <label htmlFor="currency" className="form-label">
              Currency
            </label>
            <select
              id="currency"
              className="form-select"
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
          className="submit-button"
          onClick={generateRecommendations}
        >
          Get Investment Recommendations
        </button>
      </div>
    </>
  ) : (
    <div>
      <div className="results-header">
        <h3 className="results-title">Your Personalized Investment Plan</h3>
        <div className="results-buttons">
          <button
            className="reset-button"
            onClick={resetForm}
          >
            New Plan
          </button>
          <button
            className="print-button"
            onClick={() => window.print()}
          >
            Print/Save
          </button>
        </div>
      </div>
      
      <div className="summary-grid">
        <div className="summary-card investment-summary">
          <h4 className="card-title">Investment Summary</h4>
          <p className="summary-text">
            Amount: <span className="bold-text">
              {formatCurrency(recommendations.totalAmountLocal, recommendations.selectedCurrency)}
            </span>
            {recommendations.selectedCurrency !== 'USD' && (
              <span className="usd-conversion"> (approx. ${recommendations.totalAmountUSD.toFixed(2)} USD)</span>
            )}
          </p>
          <p className="summary-text">Goal: <span className="bold-text">{investmentGoals[recommendations.goal].name}</span></p>
          <p className="summary-text">Horizon: <span className="bold-text">{timeHorizons[recommendations.horizon].name}</span></p>
          <p className="summary-text">Risk Profile: <span className="bold-text capitalize">{riskTolerance}</span></p>
          {recommendations.isCustomized && (
            <div className="custom-allocation-badge">Custom Allocation</div>
          )}
        </div>
        
        <div className="summary-card returns-summary">
          <h4 className="card-title returns-title">Expected Returns</h4>
          <p className="summary-text">Annual Return: <span className="bold-text">{recommendations.returns.annualizedReturn}%</span></p>
          <p className="summary-text">
            After {recommendations.returns.years} years: <span className="bold-text">
              {formatCurrency(recommendations.returns.futureValue(recommendations.totalAmountLocal), recommendations.selectedCurrency)}
            </span>
          </p>
          <p className="summary-text">
            Total Growth: <span className="growth-text">
              {formatCurrency(recommendations.returns.totalGrowth(recommendations.totalAmountLocal), recommendations.selectedCurrency)}
            </span>
          </p>
          <p className="disclaimer-text">*Based on historical performance, not guaranteed</p>
        </div>
        
        <div className="summary-card market-insights">
          <h4 className="card-title insights-title">Market Insights</h4>
          <p className="insight-item">Inflation: <span className="medium-text">{economicIndicators.inflation}</span></p>
          <p className="insight-item">Interest Rate: <span className="medium-text">{economicIndicators.interestRate}</span></p>
          <p className="insight-item">GDP Growth: <span className="medium-text">{economicIndicators.gdpGrowth}</span></p>
          <p className="insight-item">Market Sentiment: <span className="medium-text">{economicIndicators.marketSentiment}</span></p>
          <p className="update-timestamp">Last updated: {economicIndicators.lastUpdated}</p>
        </div>
      </div>
      
      {recommendations.opportunities.length > 0 && (
        <div className="opportunities-panel">
          <h4 className="opportunities-title">Current Market Opportunities</h4>
          <ul className="opportunities-list">
            {recommendations.opportunities.map((opportunity, idx) => (
              <li key={idx} className="opportunity-item">
                <span className="opportunity-asset">{opportunity.asset}</span>: {opportunity.condition.description}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="allocation-header">
        <h4 className="allocation-title">Portfolio Allocation</h4>
        {!isCustomizing ? (
          <button
            className="customize-button"
            onClick={() => setIsCustomizing(true)}
          >
            Customize Allocation
          </button>
        ) : (
          <div className="customize-actions">
            <button
              className="cancel-button"
              onClick={() => setIsCustomizing(false)}
            >
              Cancel
            </button>
            <button
              className="apply-button"
              onClick={applyCustomAllocations}
            >
              Apply Changes
            </button>
          </div>
        )}
      </div>
      
      <div className="allocation-table-container">
        <table className="allocation-table">
          <thead className="table-header">
            <tr>
              <th className="table-heading">Investment Type</th>
              <th className="table-heading">Allocation</th>
              <th className="table-heading">Amount ({currencies[recommendations.selectedCurrency].symbol})</th>
              <th className="table-heading">Est. Annual Return</th>
              <th className="table-heading">Market Trend</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {recommendations.investments.map((investment, idx) => (
              <tr key={idx} className="table-row">
                <td className="cell investment-type">{investment.type}</td>
                <td className="cell allocation-cell">
                  {isCustomizing ? (
                    <div className="allocation-slider-container">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={customAllocations[investment.type]}
                        onChange={(e) => handleAllocationChange(investment.type, e.target.value)}
                        className="allocation-slider"
                      />
                      <span className="allocation-percentage">{customAllocations[investment.type]}%</span>
                    </div>
                  ) : (
                    `${investment.percentage}%`
                  )}
                </td>
                <td className="cell amount-cell">
                  {formatCurrency(investment.amountLocal, recommendations.selectedCurrency)}
                </td>
                <td className="cell return-cell">
                  {investment.marketInfo ? `${investment.marketInfo.historicalReturn}%` : 'N/A'}
                </td>
                <td className="cell trend-cell">
                  {investment.marketInfo ? (
                    <span className={`trend-badge trend-${investment.marketInfo.trend}`}>
                      {investment.marketInfo.trend.charAt(0).toUpperCase() + investment.marketInfo.trend.slice(1)}
                    </span>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="disclaimer-section">
        <h4 className="disclaimer-heading">Important Information</h4>
        <p className="disclaimer-paragraph">These recommendations are based on current market conditions and your specified preferences. Past performance does not guarantee future results.</p>
        <p className="disclaimer-paragraph">Consider consulting with a financial advisor before making investment decisions. The expected returns are projections based on historical data and actual results may vary.</p>
        <p className="disclaimer-paragraph">Risk Warning: Investments can go up and down in value, and you may get back less than you invest.</p>
      </div>
    </div>
  )}
</div>
  );
};

export default InvestmentRecommender;