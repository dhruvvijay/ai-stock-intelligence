// ═══ API Service Layer ═══
// Centralized fetch functions for all API routes

const API_BASE = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Dashboard ──
export const dashboardAPI = {
  getData: () => fetchJSON<DashboardData>(`${API_BASE}/dashboard`),
};

// ── Stocks ──
export const stocksAPI = {
  list: (params: StocksParams = {}) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') sp.set(k, String(v)); });
    return fetchJSON<StocksResponse>(`${API_BASE}/stocks?${sp}`);
  },
  detail: (symbol: string) => fetchJSON<StockDetailResponse>(`${API_BASE}/stocks/${symbol}`),
  history: (symbol: string, timeframe = '1D', limit = 365) =>
    fetchJSON<PriceHistoryResponse>(`${API_BASE}/stocks/${symbol}/history?timeframe=${timeframe}&limit=${limit}`),
};

// ── Portfolio ──
export const portfolioAPI = {
  get: () => fetchJSON<PortfolioResponse>(`${API_BASE}/portfolio`),
  add: (data: { symbol: string; quantity: number; avgPrice: number; notes?: string }) =>
    fetchJSON(`${API_BASE}/portfolio`, { method: 'POST', body: JSON.stringify(data) }),
  update: (data: { id: string; quantity?: number; avgPrice?: number; notes?: string }) =>
    fetchJSON(`${API_BASE}/portfolio`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => fetchJSON(`${API_BASE}/portfolio?id=${id}`, { method: 'DELETE' }),
};

// ── Watchlist ──
export const watchlistAPI = {
  get: () => fetchJSON<WatchlistResponse>(`${API_BASE}/watchlist`),
  createList: (name: string) =>
    fetchJSON(`${API_BASE}/watchlist`, { method: 'POST', body: JSON.stringify({ action: 'create-list', name }) }),
  addStock: (watchlistId: string, symbol: string) =>
    fetchJSON(`${API_BASE}/watchlist`, { method: 'POST', body: JSON.stringify({ action: 'add-stock', watchlistId, symbol }) }),
  removeStock: (watchlistId: string, symbol: string) =>
    fetchJSON(`${API_BASE}/watchlist`, { method: 'POST', body: JSON.stringify({ action: 'remove-stock', watchlistId, symbol }) }),
  renameList: (watchlistId: string, name: string) =>
    fetchJSON(`${API_BASE}/watchlist`, { method: 'POST', body: JSON.stringify({ action: 'rename-list', watchlistId, name }) }),
  deleteList: (watchlistId: string) =>
    fetchJSON(`${API_BASE}/watchlist`, { method: 'POST', body: JSON.stringify({ action: 'delete-list', watchlistId }) }),
};

// ── Bookmarks ──
export const bookmarksAPI = {
  get: (type?: string) => fetchJSON<BookmarksResponse>(`${API_BASE}/bookmarks${type ? `?type=${type}` : ''}`),
  add: (type: string, data: { stockSymbol?: string; fundId?: string; newsId?: string; moduleId?: string }) =>
    fetchJSON(`${API_BASE}/bookmarks`, { method: 'POST', body: JSON.stringify({ action: 'add', type, ...data }) }),
  remove: (bookmarkId?: string, type?: string, stockSymbol?: string) =>
    fetchJSON(`${API_BASE}/bookmarks`, { method: 'POST', body: JSON.stringify({ action: 'remove', bookmarkId, type, stockSymbol }) }),
};

// ── Mutual Funds ──
export const mutualFundsAPI = {
  list: (params: MutualFundsParams = {}) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') sp.set(k, String(v)); });
    return fetchJSON<MutualFundsResponse>(`${API_BASE}/mutual-funds?${sp}`);
  },
};

// ── News ──
export const newsAPI = {
  list: (params: NewsParams = {}) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') sp.set(k, String(v)); });
    return fetchJSON<NewsResponse>(`${API_BASE}/news?${sp}`);
  },
};

// ── Learning ──
export const learnAPI = {
  getModules: () => fetchJSON<LearnModulesResponse>(`${API_BASE}/learn`),
  getModule: (moduleId: string) => fetchJSON<LearnModuleResponse>(`${API_BASE}/learn?moduleId=${moduleId}`),
  getLesson: (lessonId: string) => fetchJSON<LearnLessonResponse>(`${API_BASE}/learn?lessonId=${lessonId}`),
  completeLesson: (lessonId: string, score?: number) =>
    fetchJSON(`${API_BASE}/learn`, { method: 'POST', body: JSON.stringify({ action: 'complete', lessonId, score }) }),
};

// ── Chat ──
export const chatAPI = {
  getHistory: () => fetchJSON<ChatHistoryResponse>(`${API_BASE}/chat`),
  sendMessage: (message: string) =>
    fetchJSON<ChatResponse>(`${API_BASE}/chat`, { method: 'POST', body: JSON.stringify({ message }) }),
  clearHistory: () => fetchJSON(`${API_BASE}/chat`, { method: 'DELETE' }),
};

// ── Search ──
export const searchAPI = {
  search: (q: string, limit = 10) => fetchJSON<SearchResponse>(`${API_BASE}/search?q=${encodeURIComponent(q)}&limit=${limit}`),
  global: async (q: string, limit = 10): Promise<SearchResponse> => {
    const res = await fetchJSON<SearchResponse>(`${API_BASE}/search?q=${encodeURIComponent(q)}&limit=${limit}`);
    return res;
  },
};

// ── Screener ──
export const screenerAPI = {
  screen: (filters: ScreenerFilters) =>
    fetchJSON<ScreenerResponse>(`${API_BASE}/screener`, { method: 'POST', body: JSON.stringify(filters) }),
};

// ── Notifications ──
export const notificationsAPI = {
  get: () => fetchJSON<NotificationsResponse>(`${API_BASE}/notifications`),
  markRead: (notificationId: string) =>
    fetchJSON(`${API_BASE}/notifications`, { method: 'POST', body: JSON.stringify({ action: 'read', notificationId }) }),
  markAllRead: () =>
    fetchJSON(`${API_BASE}/notifications`, { method: 'POST', body: JSON.stringify({ action: 'read-all' }) }),
  delete: (notificationId: string) =>
    fetchJSON(`${API_BASE}/notifications`, { method: 'POST', body: JSON.stringify({ action: 'delete', notificationId }) }),
};

// ═══ TYPES ═══
export interface DashboardData {
  indices: Record<string, { value: number; change: number; changePercent: number }>;
  topGainers: StockSummary[];
  topLosers: StockSummary[];
  mostActive: StockSummary[];
  week52Highs: StockSummary[];
  sectorPerformance: Array<{ sector: string; avgChange: number; stockCount: number }>;
  recentNews: NewsArticle[];
  portfolio: PortfolioSummary;
  counts: { stocks: number; mutualFunds: number };
}

export interface StockSummary {
  symbol: string; name: string; currentPrice: number; change: number; changePercent: number;
  sector?: string; volume?: number; avgVolume?: number; marketCap?: number; pe?: number;
  dayHigh?: number; dayLow?: number; weekHigh52?: number; weekLow52?: number;
}

export interface StocksParams {
  page?: number; limit?: number; search?: string; sector?: string; capCategory?: string;
  sortBy?: string; sortOrder?: string; gainers?: boolean; losers?: boolean; symbols?: string;
  minPe?: number; maxPe?: number; minPrice?: number; maxPrice?: number; minMarketCap?: number;
}

export interface StocksResponse {
  stocks: StockSummary[];
  pagination: Pagination;
}

export interface StockDetailResponse {
  stock: Record<string, unknown>;
  technicals: {
    rsi: number;
    macd: { macdLine: number; signal: number; histogram: number };
    sma: { sma20: number; sma50: number; sma200: number };
    ema: { ema12: number; ema26: number };
    bollingerBands: { upper: number; middle: number; lower: number };
    patterns: Array<{ name: string; type: string; description: string; reliability: string; tradeSetup: string }>;
  };
  recommendation: {
    recommendation: string; confidence: number; riskLevel: string; entryPrice: number;
    targetPrice: number; stopLoss: number; riskRewardRatio: number; reasons: string[];
    bullScenario: { probability: number; target: number; reason: string };
    bearScenario: { probability: number; target: number; reason: string };
  };
  peers: StockSummary[];
  relatedNews: NewsArticle[];
  priceHistory: Array<{ date: string; open: number; high: number; low: number; close: number; volume: number }>;
}

export interface PriceHistoryResponse {
  symbol: string; timeframe: string;
  data: Array<{ date: string; open: number; high: number; low: number; close: number; volume: number }>;
}

export interface PortfolioResponse {
  holdings: PortfolioHolding[];
  summary: PortfolioSummary;
  sectorDistribution: Array<{ sector: string; value: number; percentage: number }>;
}

export interface PortfolioHolding {
  id: string;
  stock: StockSummary;
  quantity: number; avgPrice: number; invested: number; currentValue: number;
  pnl: number; pnlPercent: number; boughtAt: string; notes?: string;
}

export interface PortfolioSummary {
  totalInvested: number; currentValue: number; totalPnl: number;
  totalPnlPercent: number; holdingsCount: number; dayPnl?: number;
}

export interface WatchlistResponse {
  watchlists: Array<{
    id: string; name: string; sortOrder: number;
    items: Array<{ id: string; stock: StockSummary }>;
  }>;
}

export interface BookmarksResponse {
  bookmarks: Array<{
    id: string; type: string; createdAt: string;
    stock?: StockSummary; fund?: Record<string, unknown>;
    news?: NewsArticle; module?: Record<string, unknown>;
  }>;
}

export interface MutualFundsParams {
  page?: number; limit?: number; search?: string; category?: string;
  subCategory?: string; amc?: string; riskRating?: string; minRating?: number;
  sortBy?: string; sortOrder?: string;
}

export interface MutualFundsResponse {
  funds: MutualFund[];
  pagination: Pagination;
  filters: { categories: string[]; amcs: string[] };
}

export interface MutualFund {
  id: string; name: string; amc: string; category: string; subCategory: string;
  nav: number; aum: number; expenseRatio: number; exitLoad: string;
  riskRating: string; rating: number; fundManager: string; benchmark: string;
  minSIP: number; minLumpsum: number;
  return1Y: number; return3Y: number; return5Y: number; return10Y?: number | null; returnSI: number;
  topHoldings: Array<{ name: string; percentage: number }>;
  sectorAllocation: Array<{ sector: string; percentage: number }>;
}

export interface NewsParams {
  page?: number; limit?: number; category?: string; sentiment?: string; search?: string;
}

export interface NewsResponse {
  articles: NewsArticle[];
  pagination: Pagination;
}

export interface NewsArticle {
  id: string; title: string; summary: string; content?: string; source: string;
  category: string; publishedAt: string; aiSentiment: string; aiAnalysis?: string;
  aiImpactScore: number; bullishScore?: number; bearishScore?: number;
  relatedStocks?: Array<{ symbol: string; name: string; changePercent: number }>;
}

export interface LearnModulesResponse {
  modules: LearnModule[];
}

export interface LearnModule {
  id: string; title: string; description: string; icon: string;
  difficulty: string; category: string; estimatedTime: string;
  lessonsCount: number; progress: { completed: number; total: number; percentage: number };
}

export interface LearnModuleResponse {
  module: LearnModule & { lessons: Array<{ id: string; title: string; type: string; estimatedTime: string; sortOrder: number; quizCount: number; isCompleted: boolean; score?: number | null }> };
}

export interface LearnLessonResponse {
  lesson: { id: string; title: string; content: string; type: string; estimatedTime: string;
    module: { id: string; title: string }; isCompleted: boolean; score?: number | null;
    quizQuestions: Array<{ id: string; question: string; options: string[]; correctIndex: number; explanation: string; sortOrder: number }>;
  };
}

export interface ChatHistoryResponse {
  messages: ChatMessage[];
}

export interface ChatResponse {
  message: ChatMessage;
  relatedStocks: StockSummary[];
}

export interface ChatMessage {
  id: string; role: string; content: string; createdAt: string; metadata?: string;
}

export interface SearchResult {
  id: string; type: string; title: string; subtitle?: string; symbol?: string;
  label?: string; sublabel?: string; href?: string; data?: Record<string, unknown>;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
}

export interface ScreenerFilters {
  sectors?: string[]; capCategories?: string[];
  peMin?: number; peMax?: number; pbMin?: number; pbMax?: number;
  roeMin?: number; roeMax?: number; debtToEquityMax?: number;
  dividendYieldMin?: number; marketCapMin?: number; marketCapMax?: number;
  priceMin?: number; priceMax?: number; changePercentMin?: number; changePercentMax?: number;
  revenueGrowthMin?: number; profitGrowthMin?: number; promoterHoldingMin?: number;
  sortBy?: string; sortOrder?: string; page?: number; limit?: number;
}

export interface ScreenerResponse {
  stocks: Record<string, unknown>[];
  pagination: Pagination;
  filterOptions: { sectors: string[]; capCategories: string[] };
}

export interface NotificationItem {
  id: string; title: string; message: string; type: string; read: boolean; createdAt: string;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  unreadCount: number;
}

export interface Pagination {
  page: number; limit: number; total: number; totalPages: number;
}
