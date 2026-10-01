// ═══ NEWS API ═══
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category') || '';
    const sentiment = searchParams.get('sentiment') || '';
    const search = searchParams.get('search') || '';

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (sentiment) where.aiSentiment = sentiment;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { summary: { contains: search } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          relatedStocks: {
            include: { stock: { select: { symbol: true, name: true, changePercent: true } } },
          },
        },
      }),
      prisma.newsArticle.count({ where }),
    ]);

    return NextResponse.json({
      articles: articles.map(a => ({
        ...a,
        relatedStocks: a.relatedStocks.map(rs => rs.stock),
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
