// ═══ PORTFOLIO CRUD API ═══
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const USER_ID = 'default-user';

export async function GET() {
  try {
    const holdings = await prisma.portfolioHolding.findMany({
      where: { userId: USER_ID },
      include: {
        stock: {
          select: {
            symbol: true, name: true, sector: true, currentPrice: true,
            change: true, changePercent: true, marketCap: true, pe: true,
            dayHigh: true, dayLow: true,
          },
        },
      },
      orderBy: { boughtAt: 'desc' },
    });

    // Calculate portfolio metrics
    let totalInvested = 0;
    let totalCurrent = 0;
    const sectorAlloc: Record<string, number> = {};

    const enriched = holdings.map(h => {
      const invested = h.quantity * h.avgPrice;
      const current = h.quantity * h.stock.currentPrice;
      const pnl = current - invested;
      const pnlPercent = (pnl / invested) * 100;
      totalInvested += invested;
      totalCurrent += current;
      sectorAlloc[h.stock.sector] = (sectorAlloc[h.stock.sector] || 0) + current;

      return {
        id: h.id,
        stock: h.stock,
        quantity: h.quantity,
        avgPrice: h.avgPrice,
        invested: +invested.toFixed(2),
        currentValue: +current.toFixed(2),
        pnl: +pnl.toFixed(2),
        pnlPercent: +pnlPercent.toFixed(2),
        boughtAt: h.boughtAt,
        notes: h.notes,
      };
    });

    const totalPnl = totalCurrent - totalInvested;
    const sectorDistribution = Object.entries(sectorAlloc).map(([sector, value]) => ({
      sector,
      value: +value.toFixed(2),
      percentage: +((value / totalCurrent) * 100).toFixed(1),
    }));

    return NextResponse.json({
      holdings: enriched,
      summary: {
        totalInvested: +totalInvested.toFixed(2),
        currentValue: +totalCurrent.toFixed(2),
        totalPnl: +totalPnl.toFixed(2),
        totalPnlPercent: totalInvested > 0 ? +((totalPnl / totalInvested) * 100).toFixed(2) : 0,
        holdingsCount: holdings.length,
      },
      sectorDistribution,
    });
  } catch (error) {
    console.error('Portfolio GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbol, quantity, avgPrice, notes } = body;

    if (!symbol || !quantity || !avgPrice) {
      return NextResponse.json({ error: 'symbol, quantity, and avgPrice are required' }, { status: 400 });
    }

    const stock = await prisma.stock.findUnique({ where: { symbol: symbol.toUpperCase() } });
    if (!stock) return NextResponse.json({ error: 'Stock not found' }, { status: 404 });

    // Check if holding already exists (merge)
    const existing = await prisma.portfolioHolding.findUnique({
      where: { userId_stockId: { userId: USER_ID, stockId: stock.id } },
    });

    if (existing) {
      // Average out the price
      const totalQty = existing.quantity + quantity;
      const newAvgPrice = ((existing.quantity * existing.avgPrice) + (quantity * avgPrice)) / totalQty;
      const updated = await prisma.portfolioHolding.update({
        where: { id: existing.id },
        data: { quantity: totalQty, avgPrice: +newAvgPrice.toFixed(2), notes },
        include: { stock: { select: { symbol: true, name: true, currentPrice: true } } },
      });
      return NextResponse.json({ holding: updated, action: 'merged' });
    }

    const holding = await prisma.portfolioHolding.create({
      data: { userId: USER_ID, stockId: stock.id, quantity, avgPrice, notes },
      include: { stock: { select: { symbol: true, name: true, currentPrice: true } } },
    });
    return NextResponse.json({ holding, action: 'created' }, { status: 201 });
  } catch (error) {
    console.error('Portfolio POST error:', error);
    return NextResponse.json({ error: 'Failed to add holding' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, quantity, avgPrice, notes } = body;

    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const updated = await prisma.portfolioHolding.update({
      where: { id },
      data: {
        ...(quantity !== undefined && { quantity }),
        ...(avgPrice !== undefined && { avgPrice }),
        ...(notes !== undefined && { notes }),
      },
      include: { stock: { select: { symbol: true, name: true, currentPrice: true } } },
    });
    return NextResponse.json({ holding: updated });
  } catch (error) {
    console.error('Portfolio PUT error:', error);
    return NextResponse.json({ error: 'Failed to update holding' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    await prisma.portfolioHolding.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Portfolio DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete holding' }, { status: 500 });
  }
}
