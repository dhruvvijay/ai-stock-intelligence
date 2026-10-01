// ═══ PRICE HISTORY API ═══
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '1D';
    const limit = parseInt(searchParams.get('limit') || '365');

    const stock = await prisma.stock.findUnique({ where: { symbol: symbol.toUpperCase() } });
    if (!stock) return NextResponse.json({ error: 'Stock not found' }, { status: 404 });

    const history = await prisma.priceHistory.findMany({
      where: { stockId: stock.id, timeframe },
      orderBy: { date: 'asc' },
      take: limit,
      select: { date: true, open: true, high: true, low: true, close: true, volume: true },
    });

    return NextResponse.json({ symbol, timeframe, data: history });
  } catch (error) {
    console.error('Price history error:', error);
    return NextResponse.json({ error: 'Failed to fetch price history' }, { status: 500 });
  }
}
