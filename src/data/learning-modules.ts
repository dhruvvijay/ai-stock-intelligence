import type { LearningModule } from '@/types/ai';

export const learningModules: LearningModule[] = [
  {
    id: 'basics', title: 'Stock Market Basics', description: 'Learn how the stock market works, key terminology, and how to get started with investing.', category: 'Fundamentals', difficulty: 'beginner', progress: 0, icon: '📊', estimatedTime: '45 min',
    lessons: [
      { id: 'b1', title: 'What is the Stock Market?', content: '# What is the Stock Market?\n\nThe stock market is a marketplace where buyers and sellers trade shares of publicly listed companies. When you buy a stock, you\'re purchasing a small ownership stake in that company.\n\n## Key Concepts\n\n- **NSE (National Stock Exchange)**: India\'s largest stock exchange\n- **BSE (Bombay Stock Exchange)**: Asia\'s oldest stock exchange\n- **SEBI**: Securities and Exchange Board of India — the regulatory body\n- **Demat Account**: Electronic account to hold your shares\n\n## How Does Trading Work?\n\n1. Companies list their shares on exchanges through an IPO\n2. Investors buy and sell these shares during market hours (9:15 AM - 3:30 PM)\n3. Prices are determined by supply and demand\n4. Settlements happen on T+1 basis', type: 'text', completed: false },
      { id: 'b2', title: 'Types of Stocks', content: '# Types of Stocks\n\n## By Market Capitalization\n\n- **Large Cap**: Companies with market cap > ₹20,000 Cr\n- **Mid Cap**: Market cap between ₹5,000 - ₹20,000 Cr\n- **Small Cap**: Market cap < ₹5,000 Cr\n\n## By Growth vs Value\n\n- **Growth Stocks**: Companies expected to grow faster than average\n- **Value Stocks**: Companies trading below their intrinsic value\n- **Blue Chip**: Well-established, financially stable companies', type: 'text', completed: false },
      { id: 'b3', title: 'Quiz: Stock Market Basics', content: '', type: 'quiz', completed: false, quizQuestions: [
        { id: 'q1', question: 'What is the primary stock exchange in India?', options: ['NYSE', 'NSE', 'LSE', 'HKSE'], correctAnswer: 1, explanation: 'NSE (National Stock Exchange) is India\'s largest stock exchange by trading volume.' },
        { id: 'q2', question: 'What does "Market Cap" refer to?', options: ['Maximum price of stock', 'Total value of company\'s shares', 'Daily trading volume', 'Profit margin'], correctAnswer: 1, explanation: 'Market Cap = Current Share Price × Total Number of Outstanding Shares' },
      ]},
    ],
  },
  {
    id: 'candlestick', title: 'Candlestick Patterns', description: 'Master the art of reading candlestick charts and identifying key reversal and continuation patterns.', category: 'Technical Analysis', difficulty: 'intermediate', progress: 0, icon: '🕯️', estimatedTime: '60 min',
    lessons: [
      { id: 'c1', title: 'Understanding Candlesticks', content: '# Understanding Candlesticks\n\nA candlestick shows 4 key price points:\n\n- **Open**: Starting price of the period\n- **High**: Highest price reached\n- **Low**: Lowest price reached\n- **Close**: Ending price of the period\n\n## Reading a Candle\n\n- **Green/Bullish**: Close > Open (buyers won)\n- **Red/Bearish**: Close < Open (sellers won)\n- **Body**: The thick part between open and close\n- **Wicks/Shadows**: Lines above and below the body\n\n## Key Insight\n\nLong bodies show strong buying/selling pressure. Long wicks show rejection of price levels.', type: 'text', completed: false },
      { id: 'c2', title: 'Reversal Patterns', content: '# Key Reversal Patterns\n\n## Bullish Reversals\n\n### Hammer\nSmall body at top with long lower wick. Appears after downtrend. Signals buyers are stepping in.\n\n### Morning Star\nThree-candle pattern: bearish → small body → bullish. Strong reversal signal.\n\n### Bullish Engulfing\nSmall red candle followed by larger green candle that "engulfs" it.\n\n## Bearish Reversals\n\n### Shooting Star\nSmall body at bottom with long upper wick. Appears after uptrend.\n\n### Evening Star\nThree-candle pattern: bullish → small body → bearish.\n\n### Bearish Engulfing\nSmall green candle followed by larger red candle.', type: 'text', completed: false },
    ],
  },
  {
    id: 'technical', title: 'Technical Analysis', description: 'Learn to use indicators like RSI, MACD, Moving Averages, and Bollinger Bands for trading decisions.', category: 'Technical Analysis', difficulty: 'intermediate', progress: 0, icon: '📈', estimatedTime: '90 min',
    lessons: [
      { id: 't1', title: 'Moving Averages', content: '# Moving Averages (MA)\n\nMoving averages smooth out price data to identify trends.\n\n## Simple Moving Average (SMA)\n\nAverage of closing prices over a set period.\n- **SMA 20**: Short-term trend\n- **SMA 50**: Medium-term trend\n- **SMA 200**: Long-term trend\n\n## Exponential Moving Average (EMA)\n\nGives more weight to recent prices, reacts faster.\n\n## Key Signals\n\n- **Golden Cross**: 50 SMA crosses above 200 SMA → Bullish\n- **Death Cross**: 50 SMA crosses below 200 SMA → Bearish\n- **Price above MA**: Uptrend\n- **Price below MA**: Downtrend', type: 'text', completed: false },
    ],
  },
  {
    id: 'fundamental', title: 'Fundamental Analysis', description: 'Understand financial statements, key ratios, and how to evaluate a company\'s true value.', category: 'Fundamentals', difficulty: 'intermediate', progress: 0, icon: '🏢', estimatedTime: '75 min',
    lessons: [
      { id: 'f1', title: 'Key Financial Ratios', content: '# Key Financial Ratios\n\n## Valuation Ratios\n- **P/E Ratio**: Price / Earnings per Share. Lower may indicate undervaluation.\n- **P/B Ratio**: Price / Book Value. Compares market price to net assets.\n- **EV/EBITDA**: Enterprise value relative to earnings.\n\n## Profitability Ratios\n- **ROE**: Return on Equity. Higher is better (>15% is good).\n- **ROCE**: Return on Capital Employed.\n- **Net Profit Margin**: How much profit per rupee of revenue.\n\n## Solvency Ratios\n- **Debt to Equity**: Lower is safer. <1 is generally good.\n- **Current Ratio**: Ability to pay short-term debts. >1.5 is healthy.\n- **Interest Coverage**: Ability to service debt from earnings.', type: 'text', completed: false },
    ],
  },
  {
    id: 'sip', title: 'SIP Investing', description: 'Learn Systematic Investment Plans — the power of compounding and disciplined investing.', category: 'Investment Strategy', difficulty: 'beginner', progress: 0, icon: '💰', estimatedTime: '30 min',
    lessons: [
      { id: 's1', title: 'What is SIP?', content: '# Systematic Investment Plan (SIP)\n\nSIP allows you to invest a fixed amount regularly in mutual funds.\n\n## Benefits\n- **Rupee Cost Averaging**: Buy more units when prices are low\n- **Compounding**: Returns generate returns over time\n- **Discipline**: Regular investing habit\n- **Flexibility**: Start with as low as ₹500/month\n\n## The Power of Compounding\n\n₹10,000/month for 20 years at 12% returns:\n- Total Invested: ₹24,00,000\n- Estimated Value: ₹99,91,479\n- Wealth Gained: ₹75,91,479 (3.2x your investment!)', type: 'text', completed: false },
    ],
  },
  {
    id: 'risk', title: 'Risk Management', description: 'Essential strategies for managing risk, position sizing, stop-losses, and portfolio protection.', category: 'Investment Strategy', difficulty: 'advanced', progress: 0, icon: '🛡️', estimatedTime: '60 min',
    lessons: [
      { id: 'r1', title: 'Understanding Risk', content: '# Understanding Risk in Markets\n\n## Types of Risk\n- **Market Risk**: Overall market decline (systematic)\n- **Company Risk**: Specific to one stock (unsystematic)\n- **Liquidity Risk**: Inability to sell at desired price\n- **Concentration Risk**: Too much in one stock/sector\n\n## Risk Mitigation Strategies\n\n### 1. Diversification\nSpread investments across sectors and asset classes.\n\n### 2. Position Sizing\nNever put more than 5-10% in a single stock.\n\n### 3. Stop Loss\nAlways set a stop loss. Rule of thumb: 7-10% for swing trades.\n\n### 4. Asset Allocation\nBalance between equity, debt, and gold based on risk profile.', type: 'text', completed: false },
    ],
  },
];
