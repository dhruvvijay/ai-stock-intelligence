// ═══ MUTUAL FUNDS API ═══
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const subCategory = searchParams.get('subCategory') || '';
    const amc = searchParams.get('amc') || '';
    const riskRating = searchParams.get('riskRating') || '';
    const minRating = parseInt(searchParams.get('minRating') || '0');
    const sortBy = searchParams.get('sortBy') || 'aum';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { amc: { contains: search } },
        { subCategory: { contains: search } },
      ];
    }
    if (category) where.category = category;
    if (subCategory) where.subCategory = subCategory;
    if (amc) where.amc = amc;
    if (riskRating) where.riskRating = riskRating;
    if (minRating > 0) where.rating = { gte: minRating };

    const orderBy: Record<string, string> = {};
    const validSorts = ['aum', 'nav', 'return1Y', 'return3Y', 'return5Y', 'expenseRatio', 'rating', 'name'];
    orderBy[validSorts.includes(sortBy) ? sortBy : 'aum'] = sortOrder === 'asc' ? 'asc' : 'desc';

    const [funds, total] = await Promise.all([
      prisma.mutualFund.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }),
      prisma.mutualFund.count({ where }),
    ]);

    // Parse JSON fields
    const parsed = funds.map(f => ({
      ...f,
      topHoldings: f.topHoldings ? JSON.parse(f.topHoldings) : [],
      sectorAllocation: f.sectorAllocation ? JSON.parse(f.sectorAllocation) : [],
    }));

    // Get distinct categories and AMCs for filters
    const categories = await prisma.mutualFund.findMany({ select: { subCategory: true }, distinct: ['subCategory'], orderBy: { subCategory: 'asc' } });
    const amcs = await prisma.mutualFund.findMany({ select: { amc: true }, distinct: ['amc'], orderBy: { amc: 'asc' } });

    return NextResponse.json({
      funds: parsed,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      filters: {
        categories: categories.map(c => c.subCategory),
        amcs: amcs.map(a => a.amc),
      },
    });
  } catch (error) {
    console.error('Mutual Funds API error:', error);
    return NextResponse.json({ error: 'Failed to fetch mutual funds' }, { status: 500 });
  }
}
