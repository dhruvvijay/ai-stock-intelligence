// ═══ GLOBAL SEARCH API (Fuzzy) ═══
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (q.length < 1) return NextResponse.json({ results: [] });

    // Search across all entities in parallel
    const [stocks, mutualFunds, news, modules] = await Promise.all([
      prisma.stock.findMany({
        where: {
          OR: [
            { symbol: { contains: q.toUpperCase() } },
            { name: { contains: q } },
            { sector: { contains: q } },
          ],
        },
        take: limit,
        select: { symbol: true, name: true, sector: true, currentPrice: true, changePercent: true, capCategory: true },
        orderBy: { marketCap: 'desc' },
      }),
      prisma.mutualFund.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { amc: { contains: q } },
            { subCategory: { contains: q } },
          ],
        },
        take: 5,
        select: { id: true, name: true, subCategory: true, nav: true, return1Y: true, rating: true },
        orderBy: { aum: 'desc' },
      }),
      prisma.newsArticle.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { summary: { contains: q } },
          ],
        },
        take: 5,
        select: { id: true, title: true, source: true, category: true, publishedAt: true, aiSentiment: true },
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.learningModule.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: 3,
        select: { id: true, title: true, icon: true, difficulty: true, category: true },
      }),
    ]);

    const results = [
      ...stocks.map(s => ({ id: s.symbol, type: 'stock' as const, title: s.symbol, subtitle: s.name, symbol: s.symbol, label: `${s.symbol} — ${s.name}`, sublabel: `₹${s.currentPrice} | ${s.sector}`, href: `/stocks/${s.symbol}`, data: s })),
      ...mutualFunds.map(f => ({ id: f.id, type: 'fund' as const, title: f.name, subtitle: f.subCategory, label: f.name, sublabel: `NAV: ₹${f.nav} | ${f.subCategory}`, href: '/mutual-funds', data: f })),
      ...news.map(n => ({ id: n.id, type: 'news' as const, title: n.title, subtitle: `${n.source} | ${n.category}`, label: n.title, sublabel: `${n.source} | ${n.category}`, href: '/news', data: n })),
      ...modules.map(m => ({ id: m.id, type: 'module' as const, title: `${m.icon} ${m.title}`, subtitle: m.difficulty, label: `${m.icon} ${m.title}`, sublabel: m.difficulty, href: '/learn', data: m })),
    ];

    return NextResponse.json({ results, query: q });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
