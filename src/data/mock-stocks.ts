import type { Stock, StockPrice, StockFundamentals, MarketDepth, AIStockAnalysis } from '@/types/stock';

export const mockStocks: Stock[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy', industry: 'Oil & Gas Refining', marketCap: 1920000000000, capCategory: 'Large Cap', currentPrice: 2847.50, previousClose: 2823.15, change: 24.35, changePercent: 0.86, dayHigh: 2865.00, dayLow: 2815.20, weekHigh52: 3024.90, weekLow52: 2220.30, volume: 12547832, avgVolume: 10234567, pe: 28.5, eps: 99.91, dividend: 10.00, dividendYield: 0.35, beta: 0.92, exchange: 'NSE' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'Technology', industry: 'IT Services', marketCap: 1450000000000, capCategory: 'Large Cap', currentPrice: 3956.80, previousClose: 3978.45, change: -21.65, changePercent: -0.54, dayHigh: 3990.00, dayLow: 3940.50, weekHigh52: 4256.00, weekLow52: 3310.00, volume: 3456789, avgVolume: 2890123, pe: 32.1, eps: 123.27, dividend: 75.00, dividendYield: 1.89, beta: 0.55, exchange: 'NSE' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Financial Services', industry: 'Banking', marketCap: 1280000000000, capCategory: 'Large Cap', currentPrice: 1678.90, previousClose: 1645.30, change: 33.60, changePercent: 2.04, dayHigh: 1695.00, dayLow: 1640.00, weekHigh52: 1794.00, weekLow52: 1363.55, volume: 18234567, avgVolume: 15678901, pe: 19.8, eps: 84.79, dividend: 19.50, dividendYield: 1.16, beta: 0.88, exchange: 'NSE' },
  { symbol: 'INFY', name: 'Infosys Ltd', sector: 'Technology', industry: 'IT Services', marketCap: 720000000000, capCategory: 'Large Cap', currentPrice: 1732.45, previousClose: 1748.90, change: -16.45, changePercent: -0.94, dayHigh: 1755.00, dayLow: 1720.30, weekHigh52: 1953.90, weekLow52: 1358.35, volume: 8765432, avgVolume: 7654321, pe: 27.6, eps: 62.77, dividend: 34.00, dividendYield: 1.96, beta: 0.68, exchange: 'NSE' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Financial Services', industry: 'Banking', marketCap: 890000000000, capCategory: 'Large Cap', currentPrice: 1265.35, previousClose: 1242.80, change: 22.55, changePercent: 1.81, dayHigh: 1278.00, dayLow: 1238.50, weekHigh52: 1362.35, weekLow52: 932.00, volume: 14567890, avgVolume: 12345678, pe: 18.2, eps: 69.52, dividend: 10.00, dividendYield: 0.79, beta: 1.05, exchange: 'NSE' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', sector: 'FMCG', industry: 'Consumer Products', marketCap: 560000000000, capCategory: 'Large Cap', currentPrice: 2385.60, previousClose: 2398.40, change: -12.80, changePercent: -0.53, dayHigh: 2410.00, dayLow: 2370.00, weekHigh52: 2859.30, weekLow52: 2172.05, volume: 2345678, avgVolume: 1987654, pe: 58.3, eps: 40.93, dividend: 42.00, dividendYield: 1.76, beta: 0.35, exchange: 'NSE' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Financial Services', industry: 'Banking', marketCap: 720000000000, capCategory: 'Large Cap', currentPrice: 808.75, previousClose: 785.90, change: 22.85, changePercent: 2.91, dayHigh: 815.00, dayLow: 782.50, weekHigh52: 912.10, weekLow52: 555.00, volume: 25678901, avgVolume: 22345678, pe: 10.5, eps: 77.02, dividend: 13.70, dividendYield: 1.69, beta: 1.22, exchange: 'NSE' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', sector: 'Telecom', industry: 'Telecom Services', marketCap: 850000000000, capCategory: 'Large Cap', currentPrice: 1505.20, previousClose: 1478.65, change: 26.55, changePercent: 1.80, dayHigh: 1520.00, dayLow: 1472.00, weekHigh52: 1779.00, weekLow52: 1098.00, volume: 6789012, avgVolume: 5678901, pe: 72.8, eps: 20.68, dividend: 4.00, dividendYield: 0.27, beta: 0.75, exchange: 'NSE' },
  { symbol: 'ITC', name: 'ITC Ltd', sector: 'FMCG', industry: 'Tobacco & Consumer', marketCap: 550000000000, capCategory: 'Large Cap', currentPrice: 440.85, previousClose: 445.20, change: -4.35, changePercent: -0.98, dayHigh: 447.00, dayLow: 438.00, weekHigh52: 528.50, weekLow52: 399.35, volume: 19876543, avgVolume: 18765432, pe: 24.1, eps: 18.29, dividend: 15.50, dividendYield: 3.52, beta: 0.62, exchange: 'NSE' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', sector: 'Automobile', industry: 'Auto Manufacturing', marketCap: 320000000000, capCategory: 'Large Cap', currentPrice: 872.40, previousClose: 845.70, change: 26.70, changePercent: 3.16, dayHigh: 885.00, dayLow: 840.20, weekHigh52: 1064.00, weekLow52: 612.70, volume: 21345678, avgVolume: 18901234, pe: 8.2, eps: 106.39, dividend: 6.00, dividendYield: 0.69, beta: 1.45, exchange: 'NSE' },
  { symbol: 'WIPRO', name: 'Wipro Ltd', sector: 'Technology', industry: 'IT Services', marketCap: 280000000000, capCategory: 'Large Cap', currentPrice: 535.20, previousClose: 540.80, change: -5.60, changePercent: -1.04, dayHigh: 545.00, dayLow: 530.00, weekHigh52: 576.75, weekLow52: 395.35, volume: 7654321, avgVolume: 6543210, pe: 24.8, eps: 21.58, dividend: 6.00, dividendYield: 1.12, beta: 0.72, exchange: 'NSE' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', sector: 'Financial Services', industry: 'NBFC', marketCap: 450000000000, capCategory: 'Large Cap', currentPrice: 7256.30, previousClose: 7180.50, change: 75.80, changePercent: 1.06, dayHigh: 7310.00, dayLow: 7150.00, weekHigh52: 8192.00, weekLow52: 5875.50, volume: 3456789, avgVolume: 2890123, pe: 35.7, eps: 203.27, dividend: 36.00, dividendYield: 0.50, beta: 1.15, exchange: 'NSE' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India', sector: 'Automobile', industry: 'Auto Manufacturing', marketCap: 380000000000, capCategory: 'Large Cap', currentPrice: 12145.60, previousClose: 12280.00, change: -134.40, changePercent: -1.09, dayHigh: 12300.00, dayLow: 12050.00, weekHigh52: 13680.00, weekLow52: 9737.65, volume: 987654, avgVolume: 876543, pe: 29.4, eps: 413.12, dividend: 125.00, dividendYield: 1.03, beta: 0.78, exchange: 'NSE' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd', sector: 'Conglomerate', industry: 'Diversified', marketCap: 360000000000, capCategory: 'Large Cap', currentPrice: 3156.80, previousClose: 3098.45, change: 58.35, changePercent: 1.88, dayHigh: 3190.00, dayLow: 3085.00, weekHigh52: 3743.90, weekLow52: 2025.00, volume: 5678901, avgVolume: 4567890, pe: 72.4, eps: 43.60, dividend: 1.30, dividendYield: 0.04, beta: 1.65, exchange: 'NSE' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', sector: 'Materials', industry: 'Paints', marketCap: 280000000000, capCategory: 'Large Cap', currentPrice: 2912.45, previousClose: 2935.80, change: -23.35, changePercent: -0.80, dayHigh: 2945.00, dayLow: 2898.00, weekHigh52: 3422.80, weekLow52: 2670.10, volume: 1234567, avgVolume: 1098765, pe: 52.6, eps: 55.37, dividend: 27.15, dividendYield: 0.93, beta: 0.58, exchange: 'NSE' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', sector: 'Healthcare', industry: 'Pharmaceuticals', marketCap: 380000000000, capCategory: 'Large Cap', currentPrice: 1578.90, previousClose: 1556.35, change: 22.55, changePercent: 1.45, dayHigh: 1590.00, dayLow: 1550.00, weekHigh52: 1960.35, weekLow52: 1208.00, volume: 4567890, avgVolume: 3890123, pe: 38.2, eps: 41.33, dividend: 5.50, dividendYield: 0.35, beta: 0.52, exchange: 'NSE' },
];

export function generateOHLCVData(basePrice: number, days: number): StockPrice[] {
  const data: StockPrice[] = [];
  let currentPrice = basePrice;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const volatility = currentPrice * 0.025;
    const open = currentPrice + (Math.random() - 0.48) * volatility;
    const close = open + (Math.random() - 0.47) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.floor(1000000 + Math.random() * 20000000);

    data.push({
      time: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });

    currentPrice = close;
  }
  return data;
}

export const mockFundamentals: Record<string, StockFundamentals> = {
  RELIANCE: {
    symbol: 'RELIANCE',
    revenueGrowth: 18.5,
    profitGrowth: 22.3,
    roe: 9.8,
    roce: 11.2,
    debtToEquity: 0.38,
    currentRatio: 1.24,
    bookValue: 1145.60,
    faceValue: 10,
    promoterHolding: 50.30,
    fiiHolding: 23.10,
    diiHolding: 14.80,
    publicHolding: 11.80,
    pledgedShares: 0,
    quarterlyResults: [
      { quarter: 'Q1 FY26', revenue: 248567, netProfit: 19299, eps: 28.52, yoyGrowth: 12.5 },
      { quarter: 'Q4 FY25', revenue: 239874, netProfit: 21243, eps: 31.39, yoyGrowth: 18.2 },
      { quarter: 'Q3 FY25', revenue: 232456, netProfit: 18567, eps: 27.44, yoyGrowth: 15.8 },
      { quarter: 'Q2 FY25', revenue: 225123, netProfit: 17890, eps: 26.44, yoyGrowth: 22.1 },
    ],
    dividendHistory: [
      { date: '2025-08-15', amount: 10.00, type: 'Final' },
      { date: '2024-08-20', amount: 9.00, type: 'Final' },
      { date: '2023-08-18', amount: 8.00, type: 'Final' },
    ],
  },
};

export function generateMarketDepth(price: number): MarketDepth {
  const buy: { price: number; quantity: number; orders: number }[] = [];
  const sell: { price: number; quantity: number; orders: number }[] = [];

  for (let i = 0; i < 5; i++) {
    buy.push({
      price: parseFloat((price - (i + 1) * 0.5).toFixed(2)),
      quantity: Math.floor(Math.random() * 50000) + 5000,
      orders: Math.floor(Math.random() * 200) + 10,
    });
    sell.push({
      price: parseFloat((price + (i + 1) * 0.5).toFixed(2)),
      quantity: Math.floor(Math.random() * 50000) + 5000,
      orders: Math.floor(Math.random() * 200) + 10,
    });
  }

  return {
    buy,
    sell,
    totalBuyQty: buy.reduce((s, b) => s + b.quantity, 0),
    totalSellQty: sell.reduce((s, b) => s + b.quantity, 0),
  };
}

export function generateMockAnalysis(stock: Stock): AIStockAnalysis {
  const bullish = stock.changePercent >= 0;
  const confidence = 60 + Math.floor(Math.random() * 30);
  const riskLevels: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];

  return {
    symbol: stock.symbol,
    recommendation: confidence > 80 ? (bullish ? 'STRONG BUY' : 'STRONG SELL') : bullish ? 'BUY' : 'HOLD',
    confidence,
    reasons: [
      bullish ? 'Strong earnings growth trajectory' : 'Earnings below expectations',
      bullish ? 'Bullish technical pattern forming' : 'Bearish divergence on RSI',
      bullish ? 'Positive sector momentum' : 'Sector facing headwinds',
      `Institutional ${bullish ? 'accumulation' : 'distribution'} detected`,
    ],
    entryPrice: parseFloat((stock.currentPrice * (bullish ? 0.98 : 1.02)).toFixed(2)),
    targetPrice: parseFloat((stock.currentPrice * (bullish ? 1.15 : 0.90)).toFixed(2)),
    stopLoss: parseFloat((stock.currentPrice * (bullish ? 0.95 : 1.05)).toFixed(2)),
    riskLevel: riskLevels[Math.floor(Math.random() * 3)],
    timeHorizon: '3-6 months',
    bullishCase: {
      probability: bullish ? 65 + Math.floor(Math.random() * 20) : 30 + Math.floor(Math.random() * 15),
      expectedMovement: parseFloat((stock.currentPrice * 0.15).toFixed(2)),
      reasons: ['Positive quarterly results expected', 'New product launch catalyst', 'Sector rotation favoring this space'],
      targetPrice: parseFloat((stock.currentPrice * 1.18).toFixed(2)),
    },
    bearishCase: {
      probability: bullish ? 15 + Math.floor(Math.random() * 15) : 50 + Math.floor(Math.random() * 20),
      expectedMovement: parseFloat((stock.currentPrice * -0.10).toFixed(2)),
      reasons: ['Global macro uncertainty', 'Rising input costs', 'Competitive pressure increasing'],
      targetPrice: parseFloat((stock.currentPrice * 0.88).toFixed(2)),
    },
    patterns: [
      {
        name: bullish ? 'Hammer' : 'Shooting Star',
        type: bullish ? 'bullish' : 'bearish',
        description: bullish
          ? 'Buyers entered after strong selling pressure. Long lower shadow indicates demand.'
          : 'Sellers emerged after failed rally. Long upper shadow indicates supply.',
        probability: 65 + Math.floor(Math.random() * 20),
        confirmation: bullish
          ? 'Next candle should close above the hammer high.'
          : 'Next candle should close below the shooting star low.',
        suggestedStopLoss: parseFloat((stock.currentPrice * (bullish ? 0.96 : 1.04)).toFixed(2)),
        suggestedTarget: parseFloat((stock.currentPrice * (bullish ? 1.08 : 0.92)).toFixed(2)),
        detected: true,
        index: -1,
      },
    ],
    indicators: [
      { name: 'RSI (14)', value: bullish ? 45 + Math.random() * 20 : 25 + Math.random() * 15, signal: bullish ? 'buy' : 'sell', description: bullish ? 'RSI is neutral, room for upside' : 'RSI approaching oversold territory' },
      { name: 'MACD', value: bullish ? 2.5 : -1.8, signal: bullish ? 'buy' : 'sell', description: bullish ? 'MACD line above signal line' : 'MACD line below signal line' },
      { name: 'SMA 50', value: stock.currentPrice * 0.97, signal: stock.currentPrice > stock.currentPrice * 0.97 ? 'buy' : 'sell', description: 'Price relative to 50-day moving average' },
    ],
    sentiment: bullish ? 40 + Math.floor(Math.random() * 40) : -20 - Math.floor(Math.random() * 40),
  };
}
