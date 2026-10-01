'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, TrendingUp, ArrowUpRight, ArrowDownRight, Sparkles, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatCurrency, formatPercent, formatLargeNumber, getChangeColor, getChangeBg } from '@/lib/utils';
import { staggerContainer, fadeUpItemSmall } from '@/lib/animations';
import { stocksAPI, type StockSummary } from '@/lib/api';

const container = staggerContainer(0.03);
const item = fadeUpItemSmall;

export default function StocksPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('marketCap');
  const [filterCap, setFilterCap] = useState<string>('all');
  const [stocks, setStocks] = useState<StockSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await stocksAPI.list({
        page,
        limit: 50,
        search: search || undefined,
        capCategory: filterCap !== 'all' ? filterCap : undefined,
        sortBy,
        sortOrder: 'desc',
      });
      setStocks(res.stocks);
      setTotalPages(res.pagination.totalPages);
      setTotalCount(res.pagination.total);
    } catch (error) {
      console.error('Failed to fetch stocks:', error);
    }
    setLoading(false);
  }, [page, search, filterCap, sortBy]);

  useEffect(() => { fetchStocks(); }, [fetchStocks]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1); }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Stocks</h1>
          <p className="text-sm text-text-secondary">Explore and analyze {totalCount} listed stocks</p>
        </div>
        <Link href="/screener" className="inline-flex items-center gap-2 rounded-xl bg-accent/10 border border-accent/20 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/20 transition-colors">
          <SlidersHorizontal size={14} /> Stock Screener
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="card-static p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text" placeholder="Search by name or symbol..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-xl border border-border bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg bg-white/[0.03] p-0.5">
              {['all', 'Large Cap', 'Mid Cap', 'Small Cap'].map(cap => (
                <button key={cap} onClick={() => { setFilterCap(cap); setPage(1); }}
                  className={cn('rounded-md px-3 py-1.5 text-xs font-medium transition-all', filterCap === cap ? 'bg-accent text-white' : 'text-text-muted hover:text-text-primary')}>
                  {cap === 'all' ? 'All' : cap}
                </button>
              ))}
            </div>
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="rounded-lg border border-border bg-white/[0.03] px-3 py-1.5 text-xs text-text-secondary outline-none">
              <option value="marketCap">Market Cap</option>
              <option value="changePercent">% Change</option>
              <option value="currentPrice">Price</option>
              <option value="name">Name</option>
              <option value="pe">P/E Ratio</option>
              <option value="roe">ROE</option>
              <option value="volume">Volume</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stock Table */}
      <motion.div variants={item} className="card-static overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Stock', 'Price', 'Change', 'Day H/L', 'Volume', 'Market Cap', 'P/E', 'Sector', 'AI'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => {
                  const positive = stock.changePercent >= 0;
                  return (
                    <tr key={stock.symbol}
                      className="border-b border-border-subtle transition-colors hover:bg-white/[0.02] cursor-pointer group">
                      <td className="px-4 py-3">
                        <Link href={`/stocks/${stock.symbol}`} className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent">
                            {stock.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">{stock.symbol}</p>
                            <p className="text-[10px] text-text-muted truncate max-w-[150px]">{stock.name}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold tabular-nums text-text-primary">{formatCurrency(stock.currentPrice)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={cn('flex items-center gap-0.5 text-xs font-bold tabular-nums', getChangeColor(stock.changePercent))}>
                            {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {formatPercent(stock.changePercent)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-text-muted tabular-nums">
                        <span className="text-emerald-400">{(stock.dayHigh || 0).toFixed(0)}</span> / <span className="text-red-400">{(stock.dayLow || 0).toFixed(0)}</span>
                      </td>
                      <td className="px-4 py-3 text-xs tabular-nums text-text-secondary">{formatLargeNumber(stock.volume || 0)}</td>
                      <td className="px-4 py-3 text-xs font-medium text-text-secondary">{formatLargeNumber(stock.marketCap || 0)}</td>
                      <td className="px-4 py-3 text-xs tabular-nums text-text-secondary">{(stock.pe || 0).toFixed(1)}</td>
                      <td className="px-4 py-3 text-xs text-text-muted">{stock.sector}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-xs text-accent"><Sparkles size={10} />{70 + (stock.symbol.charCodeAt(0) % 20)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-text-muted">
              Showing {((page - 1) * 50) + 1}–{Math.min(page * 50, totalCount)} of {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page + i - 2;
                if (p < 1 || p > totalPages) return null;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={cn('rounded-lg px-3 py-1.5 text-xs font-medium', p === page ? 'bg-accent text-white' : 'text-text-muted hover:bg-white/5')}>
                    {p}
                  </button>
                );
              })}
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
