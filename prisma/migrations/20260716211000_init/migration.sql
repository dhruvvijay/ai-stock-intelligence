-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "image" TEXT,
    "password" TEXT,
    "riskPreference" TEXT NOT NULL DEFAULT 'moderate',
    "goals" TEXT,
    "age" INTEGER,
    "salary" INTEGER,
    "monthlySavings" INTEGER,
    "emergencyFund" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "exchange" TEXT NOT NULL DEFAULT 'NSE',
    "sector" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "capCategory" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "ceo" TEXT,
    "employees" INTEGER,
    "headquarters" TEXT,
    "founded" TEXT,
    "isin" TEXT,
    "lotSize" INTEGER NOT NULL DEFAULT 1,
    "currentPrice" REAL NOT NULL,
    "previousClose" REAL NOT NULL,
    "open" REAL NOT NULL,
    "dayHigh" REAL NOT NULL,
    "dayLow" REAL NOT NULL,
    "weekHigh52" REAL NOT NULL,
    "weekLow52" REAL NOT NULL,
    "volume" INTEGER NOT NULL,
    "avgVolume" INTEGER NOT NULL,
    "marketCap" REAL NOT NULL,
    "pe" REAL NOT NULL DEFAULT 0,
    "pb" REAL NOT NULL DEFAULT 0,
    "eps" REAL NOT NULL DEFAULT 0,
    "dividendYield" REAL NOT NULL DEFAULT 0,
    "beta" REAL NOT NULL DEFAULT 1,
    "roe" REAL NOT NULL DEFAULT 0,
    "roce" REAL NOT NULL DEFAULT 0,
    "debtToEquity" REAL NOT NULL DEFAULT 0,
    "bookValue" REAL NOT NULL DEFAULT 0,
    "faceValue" REAL NOT NULL DEFAULT 10,
    "revenueGrowth" REAL NOT NULL DEFAULT 0,
    "profitGrowth" REAL NOT NULL DEFAULT 0,
    "revenueQoQ" REAL NOT NULL DEFAULT 0,
    "profitQoQ" REAL NOT NULL DEFAULT 0,
    "revenue" REAL NOT NULL DEFAULT 0,
    "netProfit" REAL NOT NULL DEFAULT 0,
    "operatingMargin" REAL NOT NULL DEFAULT 0,
    "netMargin" REAL NOT NULL DEFAULT 0,
    "promoterHolding" REAL NOT NULL DEFAULT 0,
    "fiiHolding" REAL NOT NULL DEFAULT 0,
    "diiHolding" REAL NOT NULL DEFAULT 0,
    "publicHolding" REAL NOT NULL DEFAULT 0,
    "change" REAL NOT NULL DEFAULT 0,
    "changePercent" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stockId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "open" REAL NOT NULL,
    "high" REAL NOT NULL,
    "low" REAL NOT NULL,
    "close" REAL NOT NULL,
    "volume" INTEGER NOT NULL,
    "timeframe" TEXT NOT NULL DEFAULT '1D',
    CONSTRAINT "PriceHistory_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuarterlyResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stockId" TEXT NOT NULL,
    "quarter" TEXT NOT NULL,
    "revenue" REAL NOT NULL,
    "netProfit" REAL NOT NULL,
    "eps" REAL NOT NULL,
    "operatingMargin" REAL NOT NULL DEFAULT 0,
    "yoyGrowth" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "QuarterlyResult_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MutualFund" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "amc" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subCategory" TEXT NOT NULL,
    "nav" REAL NOT NULL,
    "navDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aum" REAL NOT NULL,
    "expenseRatio" REAL NOT NULL,
    "exitLoad" TEXT NOT NULL DEFAULT '1% if redeemed within 1 year',
    "riskRating" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 3,
    "fundManager" TEXT,
    "launchDate" DATETIME,
    "benchmark" TEXT,
    "minSIP" INTEGER NOT NULL DEFAULT 500,
    "minLumpsum" INTEGER NOT NULL DEFAULT 5000,
    "return1Y" REAL NOT NULL DEFAULT 0,
    "return3Y" REAL NOT NULL DEFAULT 0,
    "return5Y" REAL NOT NULL DEFAULT 0,
    "return10Y" REAL NOT NULL DEFAULT 0,
    "returnSI" REAL NOT NULL DEFAULT 0,
    "topHoldings" TEXT,
    "sectorAllocation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "NewsArticle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT,
    "source" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aiSentiment" TEXT NOT NULL DEFAULT 'Neutral',
    "aiAnalysis" TEXT,
    "aiImpactScore" INTEGER NOT NULL DEFAULT 0,
    "bullishScore" INTEGER NOT NULL DEFAULT 50,
    "bearishScore" INTEGER NOT NULL DEFAULT 50,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "NewsStock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "newsId" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    CONSTRAINT "NewsStock_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "NewsArticle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NewsStock_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LearningModule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '📚',
    "difficulty" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "estimatedTime" TEXT NOT NULL DEFAULT '30 min',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "moduleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'article',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "estimatedTime" TEXT NOT NULL DEFAULT '10 min',
    CONSTRAINT "Lesson_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "LearningModule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "correctIndex" INTEGER NOT NULL,
    "explanation" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "QuizQuestion_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LearningProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER,
    "completedAt" DATETIME,
    CONSTRAINT "LearningProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LearningProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PortfolioHolding" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "avgPrice" REAL NOT NULL,
    "boughtAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    CONSTRAINT "PortfolioHolding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PortfolioHolding_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Watchlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'My Watchlist',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Watchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WatchlistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "watchlistId" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WatchlistItem_watchlistId_fkey" FOREIGN KEY ("watchlistId") REFERENCES "Watchlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WatchlistItem_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stockId" TEXT,
    "fundId" TEXT,
    "newsId" TEXT,
    "moduleId" TEXT,
    CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bookmark_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Bookmark_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "MutualFund" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Bookmark_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "NewsArticle" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Bookmark_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "LearningModule" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RiskProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "salary" INTEGER NOT NULL,
    "monthlySavings" INTEGER NOT NULL,
    "currentInvestments" REAL NOT NULL DEFAULT 0,
    "emergencyFund" REAL NOT NULL DEFAULT 0,
    "riskAppetite" TEXT NOT NULL,
    "goals" TEXT NOT NULL,
    "riskScore" REAL NOT NULL DEFAULT 0,
    "diversificationScore" REAL NOT NULL DEFAULT 0,
    "suggestions" TEXT,
    "projectedWealth" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RiskProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_symbol_key" ON "Stock"("symbol");

-- CreateIndex
CREATE INDEX "PriceHistory_stockId_date_idx" ON "PriceHistory"("stockId", "date");

-- CreateIndex
CREATE INDEX "PriceHistory_stockId_timeframe_date_idx" ON "PriceHistory"("stockId", "timeframe", "date");

-- CreateIndex
CREATE INDEX "QuarterlyResult_stockId_idx" ON "QuarterlyResult"("stockId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsStock_newsId_stockId_key" ON "NewsStock"("newsId", "stockId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningProgress_userId_lessonId_key" ON "LearningProgress"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "PortfolioHolding_userId_idx" ON "PortfolioHolding"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioHolding_userId_stockId_key" ON "PortfolioHolding"("userId", "stockId");

-- CreateIndex
CREATE INDEX "Watchlist_userId_idx" ON "Watchlist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_watchlistId_stockId_key" ON "WatchlistItem"("watchlistId", "stockId");

-- CreateIndex
CREATE INDEX "Bookmark_userId_type_idx" ON "Bookmark"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_type_stockId_key" ON "Bookmark"("userId", "type", "stockId");

-- CreateIndex
CREATE INDEX "ChatMessage_userId_createdAt_idx" ON "ChatMessage"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "RiskProfile_userId_idx" ON "RiskProfile"("userId");

-- CreateIndex
CREATE INDEX "Notification_userId_read_idx" ON "Notification"("userId", "read");
