export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  dayChange: number;
  dayChangePercent: number;
  sector: string;
  type: 'stock' | 'mutual_fund';
}

export interface Portfolio {
  totalInvested: number;
  currentValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  dayChange: number;
  dayChangePercent: number;
  cagr: number;
  holdings: PortfolioHolding[];
  allocation: AllocationEntry[];
  xirr: number;
}

export interface AllocationEntry {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface Watchlist {
  id: string;
  name: string;
  items: WatchlistItem[];
  createdAt: string;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  aiRating: number;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  addedAt: string;
}

export interface MutualFund {
  id: string;
  name: string;
  amc: string;
  category: string;
  subCategory: string;
  nav: number;
  navDate: string;
  expenseRatio: number;
  fundSize: number;
  riskRating: 'Low' | 'Moderate' | 'Moderately High' | 'High' | 'Very High';
  rating: number;
  returns: FundReturns;
  fundManager: string;
  benchmark: string;
  minSIP: number;
  minLumpsum: number;
  exitLoad: string;
}

export interface FundReturns {
  oneMonth: number;
  threeMonth: number;
  sixMonth: number;
  oneYear: number;
  threeYear: number;
  fiveYear: number;
  tenYear: number | null;
  sinceLaunch: number;
}

export interface SIPPlan {
  id: string;
  fundId: string;
  fundName: string;
  monthlyAmount: number;
  startDate: string;
  duration: number; // months
  expectedReturn: number;
  totalInvested: number;
  estimatedValue: number;
  estimatedReturns: number;
  status: 'active' | 'paused' | 'completed';
}

export interface SIPCalculation {
  monthlyInvestment: number;
  durationYears: number;
  expectedReturnRate: number;
  totalInvested: number;
  estimatedReturns: number;
  totalValue: number;
  yearWiseBreakdown: YearBreakdown[];
}

export interface YearBreakdown {
  year: number;
  invested: number;
  value: number;
  returns: number;
}

export interface AIPortfolioAdvice {
  diversificationScore: number;
  riskScore: number;
  overexposedSectors: string[];
  underexposedSectors: string[];
  suggestions: string[];
  rebalanceActions: RebalanceAction[];
}

export interface RebalanceAction {
  type: 'buy' | 'sell' | 'hold';
  symbol: string;
  reason: string;
  currentAllocation: number;
  suggestedAllocation: number;
}
