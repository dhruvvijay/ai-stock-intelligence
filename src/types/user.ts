export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  mobile?: string;
  mobileVerified: boolean;
  riskPreference: RiskPreference;
  investmentGoals: InvestmentGoal[];
  experience: ExperienceLevel;
  age?: number;
  onboardingComplete: boolean;
  createdAt: string;
}

export type RiskPreference = 'conservative' | 'moderate' | 'aggressive' | 'very_aggressive';

export type InvestmentGoal =
  | 'wealth_creation'
  | 'retirement'
  | 'tax_saving'
  | 'education'
  | 'house_purchase'
  | 'emergency_fund'
  | 'passive_income'
  | 'short_term_gains';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Notification {
  id: string;
  type: 'price_alert' | 'news' | 'ai_recommendation' | 'portfolio' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  icon?: string;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  language: string;
  currency: string;
  notifications: NotificationSettings;
  defaultWatchlist: string;
}

export interface NotificationSettings {
  priceAlerts: boolean;
  newsAlerts: boolean;
  aiRecommendations: boolean;
  portfolioUpdates: boolean;
  email: boolean;
  push: boolean;
}
