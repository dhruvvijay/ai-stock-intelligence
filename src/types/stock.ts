export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: number;
  capCategory: 'Large Cap' | 'Mid Cap' | 'Small Cap';
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  weekHigh52: number;
  weekLow52: number;
  volume: number;
  avgVolume: number;
  pe: number;
  eps: number;
  dividend: number;
  dividendYield: number;
  beta: number;
  exchange: 'NSE' | 'BSE';
}

export interface StockPrice {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockFundamentals {
  symbol: string;
  revenueGrowth: number;
  profitGrowth: number;
  roe: number;
  roce: number;
  debtToEquity: number;
  currentRatio: number;
  bookValue: number;
  faceValue: number;
  promoterHolding: number;
  fiiHolding: number;
  diiHolding: number;
  publicHolding: number;
  pledgedShares: number;
  quarterlyResults: QuarterlyResult[];
  dividendHistory: DividendRecord[];
}

export interface QuarterlyResult {
  quarter: string;
  revenue: number;
  netProfit: number;
  eps: number;
  yoyGrowth: number;
}

export interface DividendRecord {
  date: string;
  amount: number;
  type: 'Interim' | 'Final';
}

export interface MarketDepthEntry {
  price: number;
  quantity: number;
  orders: number;
}

export interface MarketDepth {
  buy: MarketDepthEntry[];
  sell: MarketDepthEntry[];
  totalBuyQty: number;
  totalSellQty: number;
}

export interface CandlestickPattern {
  name: string;
  type: 'bullish' | 'bearish' | 'neutral';
  description: string;
  probability: number;
  confirmation: string;
  suggestedStopLoss: number;
  suggestedTarget: number;
  detected: boolean;
  index: number;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  description: string;
}

export interface AIStockAnalysis {
  symbol: string;
  recommendation: 'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG SELL';
  confidence: number;
  reasons: string[];
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  timeHorizon: string;
  bullishCase: ScenarioAnalysis;
  bearishCase: ScenarioAnalysis;
  patterns: CandlestickPattern[];
  indicators: TechnicalIndicator[];
  sentiment: number; // -100 to 100
}

export interface ScenarioAnalysis {
  probability: number;
  expectedMovement: number;
  reasons: string[];
  targetPrice: number;
}

export type ChartType = 'candlestick' | 'line' | 'area';
export type TimeFrame = '1m' | '5m' | '15m' | '30m' | '1h' | '1D' | '1W' | '1M';
export type IndicatorType = 'SMA' | 'EMA' | 'RSI' | 'MACD' | 'BB' | 'VWAP' | 'Volume';
