// ═══ MAIN SEED SCRIPT ═══
import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { generateAllStocks, generatePriceHistory, generateQuarterlyResults } from './seed-data/stocks.js';
import { generateAllMutualFunds } from './seed-data/mutual-funds.js';
import { generateAllNews } from './seed-data/news.js';
import { generateLearningModules } from './seed-data/learning.js';

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Starting production seed...\n');

  // ── Clean existing data ──
  console.log('🧹 Cleaning existing data...');
  await prisma.quizQuestion.deleteMany();
  await prisma.learningProgress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.learningModule.deleteMany();
  await prisma.newsStock.deleteMany();
  await prisma.newsArticle.deleteMany();
  await prisma.watchlistItem.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.portfolioHolding.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.riskProfile.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.quarterlyResult.deleteMany();
  await prisma.mutualFund.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Clean complete\n');

  // ── Create default user ──
  console.log('👤 Creating default user...');
  const user = await prisma.user.create({
    data: {
      id: 'default-user',
      name: 'Investor',
      email: 'investor@stockai.app',
      riskPreference: 'moderate',
      age: 30,
      salary: 120000,
      monthlySavings: 40000,
      emergencyFund: 300000,
    },
  });
  console.log(`✅ Created user: ${user.name}\n`);

  // ── Seed Stocks ──
  console.log('📈 Seeding stocks...');
  const stocksData = generateAllStocks();
  console.log(`   Generating ${stocksData.length} stocks...`);

  // Batch insert stocks
  const BATCH = 50;
  const stockMap = new Map<string, string>(); // symbol -> id
  for (let i = 0; i < stocksData.length; i += BATCH) {
    const batch = stocksData.slice(i, i + BATCH);
    for (const s of batch) {
      const vol = Math.round(s.marketCap * 100000 / s.currentPrice * (Math.random() * 0.1 + 0.01));
      const avgVol = Math.round(vol * (0.8 + Math.random() * 0.4));
      const change = +(s.currentPrice * (Math.random() - 0.48) * 0.03).toFixed(2);
      const changePercent = +((change / s.currentPrice) * 100).toFixed(2);
      const stock = await prisma.stock.create({
        data: {
          symbol: s.symbol,
          name: s.name,
          sector: s.sector,
          industry: s.industry,
          capCategory: s.capCategory,
          description: s.description,
          website: s.website,
          ceo: s.ceo,
          employees: s.employees,
          headquarters: s.headquarters,
          founded: s.founded,
          currentPrice: s.currentPrice,
          previousClose: +(s.currentPrice - change).toFixed(2),
          open: +(s.currentPrice * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2),
          dayHigh: +(s.currentPrice * (1 + Math.random() * 0.02)).toFixed(2),
          dayLow: +(s.currentPrice * (1 - Math.random() * 0.02)).toFixed(2),
          weekHigh52: s.weekHigh52,
          weekLow52: s.weekLow52,
          volume: vol,
          avgVolume: avgVol,
          marketCap: s.marketCap,
          pe: s.pe,
          pb: s.pb,
          eps: s.eps,
          dividendYield: s.dividendYield,
          beta: s.beta,
          roe: s.roe,
          roce: s.roce,
          debtToEquity: s.debtToEquity,
          bookValue: s.bookValue,
          revenue: s.revenue,
          netProfit: s.netProfit,
          operatingMargin: s.operatingMargin,
          netMargin: s.netMargin,
          promoterHolding: s.promoterHolding,
          fiiHolding: s.fiiHolding,
          diiHolding: s.diiHolding,
          publicHolding: s.publicHolding,
          revenueGrowth: s.revenueGrowth,
          profitGrowth: s.profitGrowth,
          faceValue: 10,
          change,
          changePercent,
        },
      });
      stockMap.set(s.symbol, stock.id);
    }
    process.stdout.write(`   Stocks: ${Math.min(i + BATCH, stocksData.length)}/${stocksData.length}\r`);
  }
  console.log(`\n✅ Seeded ${stocksData.length} stocks\n`);

  // ── Seed Price History (top 100 stocks get full history) ──
  console.log('📊 Seeding price history...');
  const topStocks = stocksData.slice(0, 100);
  let priceCount = 0;
  for (let si = 0; si < topStocks.length; si++) {
    const s = topStocks[si];
    const stockId = stockMap.get(s.symbol);
    if (!stockId) continue;

    // Daily: 365 days
    const daily = generatePriceHistory(s.currentPrice, 365, '1D');
    for (let i = 0; i < daily.length; i += 50) {
      const chunk = daily.slice(i, i + 50);
      await prisma.priceHistory.createMany({
        data: chunk.map(d => ({
          stockId,
          date: d.date,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          volume: d.volume,
          timeframe: '1D',
        })),
      });
    }
    priceCount += daily.length;

    // Weekly: 104 weeks
    const weekly = generatePriceHistory(s.currentPrice, 104, '1W');
    await prisma.priceHistory.createMany({
      data: weekly.map(d => ({
        stockId,
        date: d.date,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
        volume: d.volume,
        timeframe: '1W',
      })),
    });
    priceCount += weekly.length;

    // Monthly: 60 months
    const monthly = generatePriceHistory(s.currentPrice, 60, '1M');
    await prisma.priceHistory.createMany({
      data: monthly.map(d => ({
        stockId,
        date: d.date,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
        volume: d.volume,
        timeframe: '1M',
      })),
    });
    priceCount += monthly.length;

    process.stdout.write(`   Price history: ${si + 1}/${topStocks.length} stocks\r`);
  }

  // Remaining stocks get 90 days of daily data
  for (let si = 100; si < stocksData.length; si += 10) {
    const batch = stocksData.slice(si, Math.min(si + 10, stocksData.length));
    for (const s of batch) {
      const stockId = stockMap.get(s.symbol);
      if (!stockId) continue;
      const daily = generatePriceHistory(s.currentPrice, 90, '1D');
      await prisma.priceHistory.createMany({
        data: daily.map(d => ({
          stockId,
          date: d.date,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          volume: d.volume,
          timeframe: '1D',
        })),
      });
      priceCount += daily.length;
    }
    process.stdout.write(`   Price history remaining: ${Math.min(si + 10, stocksData.length)}/${stocksData.length}\r`);
  }
  console.log(`\n✅ Seeded ${priceCount} price history records\n`);

  // ── Seed Quarterly Results (top 200 stocks) ──
  console.log('📋 Seeding quarterly results...');
  for (let i = 0; i < Math.min(200, stocksData.length); i++) {
    const s = stocksData[i];
    const stockId = stockMap.get(s.symbol);
    if (!stockId) continue;
    const results = generateQuarterlyResults(s);
    await prisma.quarterlyResult.createMany({
      data: results.map(r => ({ stockId, ...r })),
    });
  }
  console.log(`✅ Seeded quarterly results\n`);

  // ── Seed Mutual Funds ──
  console.log('🏦 Seeding mutual funds...');
  const fundsData = generateAllMutualFunds();
  for (let i = 0; i < fundsData.length; i += BATCH) {
    const batch = fundsData.slice(i, i + BATCH);
    await prisma.mutualFund.createMany({
      data: batch.map(f => ({
        name: f.name,
        amc: f.amc,
        category: f.category,
        subCategory: f.subCategory,
        nav: f.nav,
        aum: f.aum,
        expenseRatio: f.expenseRatio,
        exitLoad: f.exitLoad,
        riskRating: f.riskRating,
        rating: f.rating,
        fundManager: f.fundManager,
        benchmark: f.benchmark,
        minSIP: f.minSIP,
        minLumpsum: f.minLumpsum,
        return1Y: f.return1Y,
        return3Y: f.return3Y,
        return5Y: f.return5Y,
        return10Y: f.return10Y,
        returnSI: f.returnSI,
        topHoldings: JSON.stringify(f.topHoldings),
        sectorAllocation: JSON.stringify(f.sectorAllocation),
      })),
    });
    process.stdout.write(`   MFs: ${Math.min(i + BATCH, fundsData.length)}/${fundsData.length}\r`);
  }
  console.log(`\n✅ Seeded ${fundsData.length} mutual funds\n`);

  // ── Seed News ──
  console.log('📰 Seeding news...');
  const newsData = generateAllNews();
  for (let i = 0; i < newsData.length; i++) {
    const n = newsData[i];
    const article = await prisma.newsArticle.create({
      data: {
        title: n.title,
        summary: n.summary,
        content: n.content,
        source: n.source,
        category: n.category,
        imageUrl: n.imageUrl,
        publishedAt: n.publishedAt,
        aiSentiment: n.aiSentiment,
        aiAnalysis: n.aiAnalysis,
        aiImpactScore: n.aiImpactScore,
        bullishScore: n.bullishScore,
        bearishScore: n.bearishScore,
      },
    });

    // Link related stocks
    for (const sym of n.relatedStockSymbols) {
      const stockId = stockMap.get(sym);
      if (stockId) {
        await prisma.newsStock.create({
          data: { newsId: article.id, stockId },
        }).catch(() => {}); // Ignore if stock symbol not found
      }
    }
    process.stdout.write(`   News: ${i + 1}/${newsData.length}\r`);
  }
  console.log(`\n✅ Seeded ${newsData.length} news articles\n`);

  // ── Seed Learning ──
  console.log('📚 Seeding learning modules...');
  const modules = generateLearningModules();
  for (const mod of modules) {
    const module = await prisma.learningModule.create({
      data: {
        title: mod.title,
        description: mod.description,
        icon: mod.icon,
        difficulty: mod.difficulty,
        category: mod.category,
        estimatedTime: mod.estimatedTime,
        sortOrder: mod.sortOrder,
      },
    });

    for (const les of mod.lessons) {
      const lesson = await prisma.lesson.create({
        data: {
          moduleId: module.id,
          title: les.title,
          content: les.content,
          type: les.type,
          sortOrder: les.sortOrder,
          estimatedTime: les.estimatedTime,
        },
      });

      if (les.quizQuestions) {
        await prisma.quizQuestion.createMany({
          data: les.quizQuestions.map(q => ({
            lessonId: lesson.id,
            question: q.question,
            options: JSON.stringify(q.options),
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            sortOrder: q.sortOrder,
          })),
        });
      }
    }
  }
  console.log(`✅ Seeded ${modules.length} learning modules\n`);

  // ── Create default watchlist with some stocks ──
  console.log('⭐ Creating default watchlist...');
  const watchlist = await prisma.watchlist.create({
    data: {
      userId: user.id,
      name: 'My Watchlist',
    },
  });
  const watchlistSymbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'ITC', 'SBIN', 'BHARTIARTL', 'LT', 'TATAMOTORS'];
  for (const sym of watchlistSymbols) {
    const stockId = stockMap.get(sym);
    if (stockId) {
      await prisma.watchlistItem.create({
        data: { watchlistId: watchlist.id, stockId },
      });
    }
  }
  console.log(`✅ Created watchlist with ${watchlistSymbols.length} stocks\n`);

  // ── Create sample portfolio ──
  console.log('💼 Creating sample portfolio...');
  const portfolioItems = [
    { symbol: 'RELIANCE', qty: 50, avgPrice: 2650 },
    { symbol: 'TCS', qty: 25, avgPrice: 3780 },
    { symbol: 'HDFCBANK', qty: 100, avgPrice: 1580 },
    { symbol: 'INFY', qty: 75, avgPrice: 1650 },
    { symbol: 'ICICIBANK', qty: 80, avgPrice: 1180 },
    { symbol: 'ITC', qty: 500, avgPrice: 425 },
    { symbol: 'SBIN', qty: 150, avgPrice: 750 },
    { symbol: 'TATAMOTORS', qty: 200, avgPrice: 780 },
    { symbol: 'TITAN', qty: 30, avgPrice: 3100 },
    { symbol: 'BAJFINANCE', qty: 15, avgPrice: 6800 },
  ];
  for (const item of portfolioItems) {
    const stockId = stockMap.get(item.symbol);
    if (stockId) {
      await prisma.portfolioHolding.create({
        data: {
          userId: user.id,
          stockId,
          quantity: item.qty,
          avgPrice: item.avgPrice,
          boughtAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        },
      });
    }
  }
  console.log(`✅ Created portfolio with ${portfolioItems.length} holdings\n`);

  // ── Create bookmarks ──
  console.log('🔖 Creating bookmarks...');
  for (const sym of ['RELIANCE', 'TCS', 'HDFCBANK', 'HAL', 'BEL']) {
    const stockId = stockMap.get(sym);
    if (stockId) {
      await prisma.bookmark.create({
        data: { userId: user.id, type: 'stock', stockId },
      });
    }
  }
  console.log('✅ Created bookmarks\n');

  // ── Create notifications ──
  console.log('🔔 Creating notifications...');
  await prisma.notification.createMany({
    data: [
      { userId: user.id, title: 'RELIANCE hit 52-week high', message: 'Reliance Industries has crossed ₹2,850 — a new 52-week high. AI Score: 82/100.', type: 'price' },
      { userId: user.id, title: 'AI Alert: Bullish pattern on HDFCBANK', message: 'Morning Star pattern detected on HDFC Bank daily chart. Historical success rate: 78%.', type: 'ai' },
      { userId: user.id, title: 'Market Update: Nifty at All-Time High', message: 'Nifty 50 has crossed 24,000 for the first time. FII flows remain positive.', type: 'market' },
      { userId: user.id, title: 'Portfolio Update', message: 'Your portfolio gained ₹12,450 today (+0.8%). Top performer: TATAMOTORS (+2.5%).', type: 'system' },
      { userId: user.id, title: 'TCS Q3 results tomorrow', message: 'TCS Q3 FY25 results will be announced tomorrow. Consensus expects 2.1% QoQ revenue growth.', type: 'ai' },
    ],
  });
  console.log('✅ Created notifications\n');

  console.log('═══════════════════════════════════════');
  console.log('✅ SEED COMPLETE!');
  console.log(`   📈 ${stocksData.length} Stocks`);
  console.log(`   📊 ${priceCount} Price Records`);
  console.log(`   🏦 ${fundsData.length} Mutual Funds`);
  console.log(`   📰 ${newsData.length} News Articles`);
  console.log(`   📚 ${modules.length} Learning Modules`);
  console.log('═══════════════════════════════════════');
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
