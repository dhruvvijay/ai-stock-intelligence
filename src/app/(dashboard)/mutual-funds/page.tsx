'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Building2, Search, Star, ArrowUpRight, Loader2, ChevronLeft, ChevronRight, SlidersHorizontal, TrendingUp } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { staggerContainer, fadeUpItem, fadeUpItemSmall } from '@/lib/animations';
import { mutualFundsAPI, type MutualFund } from '@/lib/api';

const container = staggerContainer(0.04);
const item = fadeUpItem;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={10} className={cn(i <= rating ? 'text-amber-400 fill-amber-400' : 'text-white/10')} />
      ))}
    </div>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const colors: Record<string, string> = {
    'Low': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Moderate': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Moderately High': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'High': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Very High': 'bg-red-600/10 text-red-500 border-red-600/20',
  };
  return (
    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold border', colors[risk] || 'bg-white/5 text-text-muted border-border')}>
      {risk}
    </span>
  );
}

export default function MutualFundsPage() {
  const [funds, setFunds] = useState<MutualFund[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('aum');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [riskFilter, setRiskFilter] = useState('');
  const [minRating, setMinRating] = useState(0);

  const fetchFunds = useCallback(async () => {
    setLoading(true);
    try {
      const res = await mutualFundsAPI.list({
        page, limit: 30, search: search || undefined,
        subCategory: category || undefined, sortBy, sortOrder: 'desc',
        riskRating: riskFilter || undefined, minRating: minRating || undefined,
      });
      setFunds(res.funds);
      setTotalPages(res.pagination.totalPages);
      setTotalCount(res.pagination.total);
      if (res.filters?.categories) setCategories(res.filters.categories);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [page, search, category, sortBy, riskFilter, minRating]);

  useEffect(() => { fetchFunds(); }, [fetchFunds]);
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Building2 size={24} className="text-accent" /> Mutual Funds
          </h1>
          <p className="text-sm text-text-secondary mt-1">{totalCount} funds across all categories</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 rounded-xl bg-accent/10 border border-accent/20 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/20 transition-colors">
          <SlidersHorizontal size={14} /> Filters
        </button>
      </motion.div>

      {/* Search & Filters */}
      <motion.div variants={item} className="card-static p-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" placeholder="Search funds by name, AMC..." value={searchInput} onChange={e => setSearchInput(e.target.value)}
              className="w-full rounded-xl border border-border bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent/30" />
          </div>
          <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}
            className="rounded-lg border border-border bg-white/[0.03] px-3 py-2 text-xs text-text-secondary outline-none">
            <option value="aum">AUM</option>
            <option value="return1Y">1Y Returns</option>
            <option value="return3Y">3Y Returns</option>
            <option value="return5Y">5Y Returns</option>
            <option value="rating">Rating</option>
            <option value="expenseRatio">Expense Ratio</option>
            <option value="nav">NAV</option>
          </select>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border-subtle">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-text-muted block mb-1">Category</label>
              <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
                className="rounded-lg border border-border bg-white/[0.03] px-3 py-1.5 text-xs text-text-secondary outline-none">
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-text-muted block mb-1">Risk</label>
              <select value={riskFilter} onChange={e => { setRiskFilter(e.target.value); setPage(1); }}
                className="rounded-lg border border-border bg-white/[0.03] px-3 py-1.5 text-xs text-text-secondary outline-none">
                <option value="">All Risk</option>
                {['Low', 'Moderate', 'Moderately High', 'High', 'Very High'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-text-muted block mb-1">Min Rating</label>
              <select value={minRating} onChange={e => { setMinRating(parseInt(e.target.value)); setPage(1); }}
                className="rounded-lg border border-border bg-white/[0.03] px-3 py-1.5 text-xs text-text-secondary outline-none">
                <option value="0">Any</option>
                <option value="3">3★+</option>
                <option value="4">4★+</option>
                <option value="5">5★ Only</option>
              </select>
            </div>
          </div>
        )}
      </motion.div>

      {/* Fund Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
      ) : (
        <motion.div variants={item} className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {funds.map(fund => (
            <div key={fund.id} className="card group p-5 hover:border-accent/20 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-1">{fund.name}</h3>
                  <p className="text-[10px] text-text-muted mt-0.5">{fund.amc} • {fund.subCategory}</p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <StarRating rating={fund.rating} />
                  <RiskBadge risk={fund.riskRating} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-3">
                <div>
                  <p className="text-[10px] text-text-muted">NAV</p>
                  <p className="text-sm font-bold text-text-primary tabular-nums">₹{fund.nav.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted">1Y Return</p>
                  <p className={cn('text-sm font-bold tabular-nums', fund.return1Y >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                    {fund.return1Y >= 0 ? '+' : ''}{fund.return1Y.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted">3Y Return</p>
                  <p className={cn('text-sm font-bold tabular-nums', fund.return3Y >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                    {fund.return3Y >= 0 ? '+' : ''}{fund.return3Y.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted">5Y Return</p>
                  <p className={cn('text-sm font-bold tabular-nums', fund.return5Y >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                    {fund.return5Y >= 0 ? '+' : ''}{fund.return5Y.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-text-muted pt-2 border-t border-border-subtle">
                <span>AUM: ₹{(fund.aum / 100).toFixed(0)} Cr</span>
                <span>Expense: {fund.expenseRatio.toFixed(2)}%</span>
                <span>Min SIP: ₹{fund.minSIP}</span>
                <span>Manager: {fund.fundManager}</span>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:bg-white/5 disabled:opacity-30">
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs text-text-muted">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:bg-white/5 disabled:opacity-30">
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </motion.div>
  );
}
