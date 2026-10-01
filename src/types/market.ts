export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  previousClose: number;
  aiSentiment: 'Bullish' | 'Bearish' | 'Neutral';
  sentimentScore: number;
  sparklineData: number[];
}

export interface SectorPerformance {
  name: string;
  changePercent: number;
  marketCap: number;
  topStock: string;
  stocks: number;
  color: string;
}

export interface HeatmapEntry {
  symbol: string;
  name: string;
  sector: string;
  changePercent: number;
  marketCap: number;
  value: number;
}

export interface TopMover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  sector: string;
}

export interface TrendingStock {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  reason: string;
  aiRating: number;
  searches: number;
}

export interface MarketSummary {
  indices: MarketIndex[];
  sectors: SectorPerformance[];
  heatmap: HeatmapEntry[];
  topGainers: TopMover[];
  topLosers: TopMover[];
  trending: TrendingStock[];
  mostBought: TopMover[];
  marketStatus: 'open' | 'closed' | 'pre-open';
  lastUpdated: string;
}
