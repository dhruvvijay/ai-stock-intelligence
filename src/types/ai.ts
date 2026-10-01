export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: ChatMetadata;
}

export interface ChatMetadata {
  stocks?: string[];
  charts?: boolean;
  confidence?: number;
  sources?: string[];
}

export interface AIRecommendation {
  id: string;
  type: 'stock' | 'mutual_fund' | 'sip' | 'portfolio';
  title: string;
  description: string;
  confidence: number;
  createdAt: string;
  data: StockRecommendation | FundRecommendation | SIPRecommendation;
}

export interface StockRecommendation {
  symbol: string;
  name: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  reasons: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  timeHorizon: string;
}

export interface FundRecommendation {
  fundId: string;
  fundName: string;
  category: string;
  expectedReturn: number;
  reasons: string[];
  riskLevel: string;
  minInvestment: number;
}

export interface SIPRecommendation {
  monthlyAmount: number;
  duration: string;
  funds: { name: string; allocation: number }[];
  expectedReturn: number;
  goal: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  url: string;
  publishedAt: string;
  category: 'company' | 'market' | 'global' | 'earnings' | 'rbi' | 'economic';
  relatedStocks: string[];
  aiSentiment: 'Positive' | 'Negative' | 'Neutral';
  aiImpactScore: number; // -10 to 10
  aiAnalysis: string;
  imageUrl?: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lessons: Lesson[];
  progress: number;
  icon: string;
  estimatedTime: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'interactive' | 'quiz';
  completed: boolean;
  quizQuestions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
