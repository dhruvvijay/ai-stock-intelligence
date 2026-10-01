// ═══ WATCHLIST CRUD API ═══
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const USER_ID = 'default-user';

export async function GET() {
  try {
    const watchlists = await prisma.watchlist.findMany({
      where: { userId: USER_ID },
      include: {
        items: {
          include: {
            stock: {
              select: {
                id: true, symbol: true, name: true, sector: true, currentPrice: true,
                change: true, changePercent: true, marketCap: true, pe: true,
                dayHigh: true, dayLow: true, volume: true, weekHigh52: true, weekLow52: true,
              },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ watchlists });
  } catch (error) {
    console.error('Watchlist GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch watchlists' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create-list') {
      const { name } = body;
      const watchlist = await prisma.watchlist.create({
        data: { userId: USER_ID, name: name || 'New Watchlist' },
        include: { items: true },
      });
      return NextResponse.json({ watchlist }, { status: 201 });
    }

    if (action === 'add-stock') {
      const { watchlistId, symbol } = body;
      if (!watchlistId || !symbol) return NextResponse.json({ error: 'watchlistId and symbol required' }, { status: 400 });
      const stock = await prisma.stock.findUnique({ where: { symbol: symbol.toUpperCase() } });
      if (!stock) return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
      const existing = await prisma.watchlistItem.findUnique({
        where: { watchlistId_stockId: { watchlistId, stockId: stock.id } },
      });
      if (existing) return NextResponse.json({ error: 'Stock already in watchlist' }, { status: 409 });
      const item = await prisma.watchlistItem.create({
        data: { watchlistId, stockId: stock.id },
        include: { stock: { select: { symbol: true, name: true, currentPrice: true, changePercent: true } } },
      });
      return NextResponse.json({ item }, { status: 201 });
    }

    if (action === 'remove-stock') {
      const { watchlistId, symbol } = body;
      const stock = await prisma.stock.findUnique({ where: { symbol: symbol.toUpperCase() } });
      if (!stock) return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
      await prisma.watchlistItem.deleteMany({ where: { watchlistId, stockId: stock.id } });
      return NextResponse.json({ success: true });
    }

    if (action === 'rename-list') {
      const { watchlistId, name } = body;
      const updated = await prisma.watchlist.update({ where: { id: watchlistId }, data: { name } });
      return NextResponse.json({ watchlist: updated });
    }

    if (action === 'delete-list') {
      const { watchlistId } = body;
      await prisma.watchlist.delete({ where: { id: watchlistId } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Watchlist POST error:', error);
    return NextResponse.json({ error: 'Failed to update watchlist' }, { status: 500 });
  }
}
