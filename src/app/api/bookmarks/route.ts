// ═══ BOOKMARKS CRUD API ═══
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const USER_ID = 'default-user';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || '';

    const where: Record<string, unknown> = { userId: USER_ID };
    if (type) where.type = type;

    const bookmarks = await prisma.bookmark.findMany({
      where,
      include: {
        stock: { select: { id: true, symbol: true, name: true, sector: true, currentPrice: true, change: true, changePercent: true, marketCap: true } },
        fund: { select: { id: true, name: true, category: true, subCategory: true, nav: true, return1Y: true, rating: true } },
        news: { select: { id: true, title: true, summary: true, source: true, publishedAt: true, aiSentiment: true } },
        module: { select: { id: true, title: true, description: true, icon: true, difficulty: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error('Bookmarks GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, type, stockSymbol, fundId, newsId, moduleId } = body;

    if (action === 'add') {
      let stockId: string | undefined;
      if (type === 'stock' && stockSymbol) {
        const stock = await prisma.stock.findUnique({ where: { symbol: stockSymbol.toUpperCase() } });
        if (!stock) return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
        stockId = stock.id;
      }

      // Check for existing bookmark
      const existingWhere: Record<string, unknown> = { userId: USER_ID, type };
      if (stockId) existingWhere.stockId = stockId;
      const existing = await prisma.bookmark.findFirst({ where: existingWhere });
      if (existing) return NextResponse.json({ error: 'Already bookmarked' }, { status: 409 });

      const bookmark = await prisma.bookmark.create({
        data: {
          userId: USER_ID, type,
          ...(stockId && { stockId }),
          ...(fundId && { fundId }),
          ...(newsId && { newsId }),
          ...(moduleId && { moduleId }),
        },
      });
      return NextResponse.json({ bookmark }, { status: 201 });
    }

    if (action === 'remove') {
      const { bookmarkId } = body;
      if (bookmarkId) {
        await prisma.bookmark.delete({ where: { id: bookmarkId } });
      } else if (type === 'stock' && stockSymbol) {
        const stock = await prisma.stock.findUnique({ where: { symbol: stockSymbol.toUpperCase() } });
        if (stock) {
          await prisma.bookmark.deleteMany({ where: { userId: USER_ID, type: 'stock', stockId: stock.id } });
        }
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Bookmarks POST error:', error);
    return NextResponse.json({ error: 'Failed to update bookmark' }, { status: 500 });
  }
}
