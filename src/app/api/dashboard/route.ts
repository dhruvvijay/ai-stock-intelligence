// ═══ DASHBOARD API: Market overview data ═══
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [
      topGainers,
      topLosers,
      mostActive,
      week52Highs,
      sectorPerformance,
      recentNews,
      portfolioSummary,
      totalStocks,
      totalFunds,
    ] = await Promise.all([
      // Top gainers
      prisma.stock.findMany({
        where: { changePercent: { gt: 0 } },
        orderBy: { changePercent: 'desc' },
        take: 10,
        select: { symbol: true, name: true, currentPrice: true, change: true, changePercent: true, sector: true, volume: true },
      }),
      // Top losers
      prisma.stock.findMany({
        where: { changePercent: { lt: 0 } },
        orderBy: { changePercent: 'asc' },
        take: 10,
        select: { symbol: true, name: true, currentPrice: true, change: true, changePercent: true, sector: true, volume: true },
      }),
      // Most active by volume
      prisma.stock.findMany({
        orderBy: { volume: 'desc' },
        take: 10,
        select: { symbol: true, name: true, currentPrice: true, change: true, changePercent: true, volume: true, avgVolume: true },
      }),
      // 52-week highs
      prisma.stock.findMany({
        where: { currentPrice: { gte: prisma.stock.fields.weekHigh52 as unknown as number } },
        take: 10,
        orderBy: { marketCap: 'desc' },
        select: { symbol: true, name: true, currentPrice: true, weekHigh52: true, changePercent: true },
      }).catch(() => []),
      // Sector performance (aggregate)
      prisma.stock.groupBy({
        by: ['sector'],
        _avg: { changePercent: true },
        _count: true,
        orderBy: { _avg: { changePercent: 'desc' } },
      }),
      // Recent news
      prisma.newsArticle.findMany({
        take: 5,
        orderBy: { publishedAt: 'desc' },
        select: { id: true, title: true, summary: true, source: true, category: true, publishedAt: true, aiSentiment: true, aiImpactScore: true, bullishScore: true, bearishScore: true },
      }),
      // Portfolio summary
      prisma.portfolioHolding.findMany({
        where: { userId: 'default-user' },
        include: { stock: { select: { currentPrice: true, changePercent: true, symbol: true } } },
      }),
      // Total counts
      prisma.stock.count(),
      prisma.mutualFund.count(),
    ]);

    // Calculate portfolio
    let invested = 0, current = 0, dayPnl = 0;
    for (const h of portfolioSummary) {
      const inv = h.quantity * h.avgPrice;
      const cur = h.quantity * h.stock.currentPrice;
      invested += inv;
      current += cur;
      dayPnl += cur * (h.stock.changePercent / 100);
    }

    // Market indices (simulated from aggregate data)
    const avgChange = sectorPerformance.reduce((sum, s) => sum + (s._avg.changePercent || 0), 0) / sectorPerformance.length;
    const niftyBase = 24150;
    const sensexBase = 79800;

    return NextResponse.json({
      indices: {
        nifty50: { value: +(niftyBase * (1 + avgChange / 100)).toFixed(0), change: +(niftyBase * avgChange / 100).toFixed(0), changePercent: +avgChange.toFixed(2) },
        sensex: { value: +(sensexBase * (1 + avgChange / 100)).toFixed(0), change: +(sensexBase * avgChange / 100).toFixed(0), changePercent: +avgChange.toFixed(2) },
        bankNifty: { value: 52345, change: 235, changePercent: 0.45 },
        niftyIT: { value: 38450, change: -120, changePercent: -0.31 },
        indiaVix: { value: 13.2, change: -0.65, changePercent: -4.7 },
      },
      topGainers,
      topLosers,
      mostActive,
      week52Highs,
      sectorPerformance: sectorPerformance.map(s => ({
        sector: s.sector,
        avgChange: +(s._avg.changePercent || 0).toFixed(2),
        stockCount: s._count,
      })),
      recentNews,
      portfolio: {
        totalInvested: +invested.toFixed(0),
        currentValue: +current.toFixed(0),
        totalPnl: +(current - invested).toFixed(0),
        totalPnlPercent: invested > 0 ? +((current - invested) / invested * 100).toFixed(2) : 0,
        dayPnl: +dayPnl.toFixed(0),
        holdingsCount: portfolioSummary.length,
      },
      counts: { stocks: totalStocks, mutualFunds: totalFunds },
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
