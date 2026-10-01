# 🚀 AI Stock Intelligence Platform

A full-stack AI-powered stock market analysis platform built with Next.js, TypeScript, Prisma, and SQLite. Features real-time market data, AI-powered stock recommendations, portfolio management, and interactive learning modules.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 📊 Market Intelligence
- **Live Dashboard** — Market indices (NIFTY 50, SENSEX, BANK NIFTY), sector performance, top gainers/losers
- **Stock Screener** — Multi-criteria filtering with 7 preset strategies (Value, Growth, Dividend, etc.)
- **Technical Analysis** — RSI, MACD, SMA/EMA, Bollinger Bands, candlestick pattern detection
- **Markets Overview** — Sector heatmaps, most active stocks, breadth indicators

### 🤖 AI-Powered Insights
- **AI Stock Analyst** — Chat-based assistant for stock analysis, portfolio advice, and market education
- **AI Recommendations** — Automated buy/sell/hold signals with confidence scores, targets, and stop losses
- **Sentiment Analysis** — AI-analyzed news with bullish/bearish probability scores
- **Risk Analyzer** — Portfolio risk scoring with concentration, sector bias, and volatility metrics

### 💼 Portfolio & Tracking
- **Portfolio Management** — Add/remove holdings, real-time P&L, sector distribution, XIRR
- **Watchlist** — Multiple watchlists with add/remove/rename functionality
- **Bookmarks** — Save stocks, funds, news articles, and learning modules
- **SIP Calculator** — SIP/Lumpsum planner with step-up comparison and growth milestones

### 📰 Research & Learning
- **AI News Digest** — 200+ news articles with AI sentiment and impact scoring
- **Learning Center** — 20 structured modules with quizzes, progress tracking
- **Mutual Funds Explorer** — 500+ funds with filters, ratings, and performance data

### 🔍 500+ Indian Stocks
- 761 stocks across all sectors (IT, Banking, Pharma, Auto, FMCG, etc.)
- 85,000+ historical price records
- Fundamental data: P/E, P/B, ROE, ROCE, D/E, EPS, Dividend Yield
- Shareholding data: Promoter, FII, DII, Retail holdings

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Database** | SQLite via Prisma 7 |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **State** | Zustand |
| **Icons** | Lucide React |

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-stock-intelligence.git
cd ai-stock-intelligence

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Seed the database (creates dev.db with 761 stocks, 500+ MFs, 200+ news, 20 learning modules)
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL="file:./dev.db"
```

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (dashboard)/           # All dashboard pages
│   │   ├── page.tsx           # Dashboard
│   │   ├── stocks/            # Stocks list + [symbol] detail
│   │   ├── portfolio/         # Portfolio management
│   │   ├── watchlist/         # Watchlist management
│   │   ├── news/              # AI-powered news
│   │   ├── learn/             # Learning center
│   │   ├── ai-assistant/      # AI chat
│   │   ├── mutual-funds/      # MF explorer
│   │   ├── screener/          # Stock screener
│   │   ├── markets/           # Markets overview
│   │   ├── technical-analysis/# TA dashboard
│   │   ├── risk-analyzer/     # Risk analysis
│   │   ├── ai-recommendations/# AI picks
│   │   ├── bookmarks/         # Saved items
│   │   ├── sip-planner/       # SIP calculator
│   │   └── settings/          # User settings
│   └── api/                   # 14 API routes
│       ├── dashboard/
│       ├── stocks/
│       ├── portfolio/
│       ├── watchlist/
│       ├── bookmarks/
│       ├── mutual-funds/
│       ├── news/
│       ├── learn/
│       ├── chat/
│       ├── search/
│       ├── screener/
│       └── notifications/
├── components/
│   ├── layout/                # Sidebar, TopNavbar
│   └── stocks/                # StockChart component
├── lib/
│   ├── api.ts                 # Centralized API service layer
│   ├── prisma.ts              # Prisma client singleton
│   ├── utils.ts               # Utility functions
│   └── animations.ts          # Framer Motion variants
├── store/                     # Zustand stores
├── types/                     # TypeScript types
└── data/                      # Legacy mock data (unused)

prisma/
├── schema.prisma              # Database schema (15 models)
└── seed.ts                    # Database seeding script
```

## 🗃️ Database Schema

15 Prisma models: `User`, `Stock`, `PriceHistory`, `PortfolioHolding`, `Watchlist`, `WatchlistItem`, `Bookmark`, `MutualFund`, `NewsArticle`, `NewsStockRelation`, `LearningModule`, `Lesson`, `QuizQuestion`, `LearningProgress`, `ChatMessage`, `RiskProfile`, `Notification`

## 📄 License

MIT License — feel free to use, modify, and distribute.

## 🙏 Credits

Built with ❤️ by **Dhruv Vijay**
