// ═══ STOCKS API: Full CRUD + Search + Filters ═══
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const sector = searchParams.get('sector') || '';
    const capCategory = searchParams.get('capCategory') || '';
    const sortBy = searchParams.get('sortBy') || 'marketCap';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const minPe = parseFloat(searchParams.get('minPe') || '0');
    const maxPe = parseFloat(searchParams.get('maxPe') || '9999');
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    const minMarketCap = parseFloat(searchParams.get('minMarketCap') || '0');
    const gainers = searchParams.get('gainers') === 'true';
    const losers = searchParams.get('losers') === 'true';
    const symbols = searchParams.get('symbols'); // comma-separated

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { symbol: { contains: search.toUpperCase() } },
        { name: { contains: search } },
        { sector: { contains: search } },
      ];
    }

    if (sector) where.sector = sector;
    if (capCategory) where.capCategory = capCategory;
    if (minPe > 0 || maxPe < 9999) {
      where.pe = { gte: minPe, lte: maxPe };
    }
    if (minPrice > 0 || maxPrice < 999999) {
      where.currentPrice = { gte: minPrice, lte: maxPrice };
    }
    if (minMarketCap > 0) {
      where.marketCap = { gte: minMarketCap };
    }
    if (gainers) where.changePercent = { gt: 0 };
    if (losers) where.changePercent = { lt: 0 };
    if (symbols) {
      where.symbol = { in: symbols.split(',') };
    }

    // Sort mapping
    const orderBy: Record<string, string> = {};
    const validSorts = ['marketCap', 'currentPrice', 'changePercent', 'pe', 'volume', 'name', 'symbol', 'roe', 'dividendYield'];
    const field = validSorts.includes(sortBy) ? sortBy : 'marketCap';
    orderBy[field] = sortOrder === 'asc' ? 'asc' : 'desc';

    const [stocks, total] = await Promise.all([
      prisma.stock.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, symbol: true, name: true, sector: true, industry: true,
          capCategory: true, currentPrice: true, change: true, changePercent: true,
          marketCap: true, pe: true, pb: true, eps: true, volume: true,
          weekHigh52: true, weekLow52: true, roe: true, dividendYield: true,
          dayHigh: true, dayLow: true,
        },
      }),
      prisma.stock.count({ where }),
    ]);

    return NextResponse.json({
      stocks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Stocks API error:', error);
    return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 });
  }
}
