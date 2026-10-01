// ═══ SCREENER API: Advanced stock screener ═══
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sectors = [],
      capCategories = [],
      peMin, peMax,
      pbMin, pbMax,
      roeMin, roeMax,
      debtToEquityMax,
      dividendYieldMin,
      marketCapMin, marketCapMax,
      priceMin, priceMax,
      changePercentMin, changePercentMax,
      revenueGrowthMin,
      profitGrowthMin,
      promoterHoldingMin,
      sortBy = 'marketCap',
      sortOrder = 'desc',
      page = 1,
      limit = 50,
    } = body;

    const where: Record<string, unknown> = {};
    
    if (sectors.length > 0) where.sector = { in: sectors };
    if (capCategories.length > 0) where.capCategory = { in: capCategories };
    
    if (peMin !== undefined || peMax !== undefined) {
      where.pe = {};
      if (peMin !== undefined) (where.pe as Record<string, unknown>).gte = peMin;
      if (peMax !== undefined) (where.pe as Record<string, unknown>).lte = peMax;
    }
    if (pbMin !== undefined || pbMax !== undefined) {
      where.pb = {};
      if (pbMin !== undefined) (where.pb as Record<string, unknown>).gte = pbMin;
      if (pbMax !== undefined) (where.pb as Record<string, unknown>).lte = pbMax;
    }
    if (roeMin !== undefined || roeMax !== undefined) {
      where.roe = {};
      if (roeMin !== undefined) (where.roe as Record<string, unknown>).gte = roeMin;
      if (roeMax !== undefined) (where.roe as Record<string, unknown>).lte = roeMax;
    }
    if (debtToEquityMax !== undefined) where.debtToEquity = { lte: debtToEquityMax };
    if (dividendYieldMin !== undefined) where.dividendYield = { gte: dividendYieldMin };
    if (marketCapMin !== undefined || marketCapMax !== undefined) {
      where.marketCap = {};
      if (marketCapMin !== undefined) (where.marketCap as Record<string, unknown>).gte = marketCapMin;
      if (marketCapMax !== undefined) (where.marketCap as Record<string, unknown>).lte = marketCapMax;
    }
    if (priceMin !== undefined || priceMax !== undefined) {
      where.currentPrice = {};
      if (priceMin !== undefined) (where.currentPrice as Record<string, unknown>).gte = priceMin;
      if (priceMax !== undefined) (where.currentPrice as Record<string, unknown>).lte = priceMax;
    }
    if (changePercentMin !== undefined || changePercentMax !== undefined) {
      where.changePercent = {};
      if (changePercentMin !== undefined) (where.changePercent as Record<string, unknown>).gte = changePercentMin;
      if (changePercentMax !== undefined) (where.changePercent as Record<string, unknown>).lte = changePercentMax;
    }
    if (revenueGrowthMin !== undefined) where.revenueGrowth = { gte: revenueGrowthMin };
    if (profitGrowthMin !== undefined) where.profitGrowth = { gte: profitGrowthMin };
    if (promoterHoldingMin !== undefined) where.promoterHolding = { gte: promoterHoldingMin };

    const orderBy: Record<string, string> = {};
    orderBy[sortBy] = sortOrder;

    const [stocks, total] = await Promise.all([
      prisma.stock.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.stock.count({ where }),
    ]);

    // Get available filter options
    const [sectorsOptions, capOptions] = await Promise.all([
      prisma.stock.findMany({ select: { sector: true }, distinct: ['sector'], orderBy: { sector: 'asc' } }),
      prisma.stock.findMany({ select: { capCategory: true }, distinct: ['capCategory'] }),
    ]);

    return NextResponse.json({
      stocks,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      filterOptions: {
        sectors: sectorsOptions.map(s => s.sector),
        capCategories: capOptions.map(c => c.capCategory),
      },
    });
  } catch (error) {
    console.error('Screener API error:', error);
    return NextResponse.json({ error: 'Screener failed' }, { status: 500 });
  }
}
