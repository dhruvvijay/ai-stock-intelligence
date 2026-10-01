'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Search, ArrowUpRight, ArrowDownRight, Loader2, ChevronLeft, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn, formatCurrency, formatPercent, formatLargeNumber, getChangeColor } from '@/lib/utils';
import { staggerContainer, fadeUpItem } from '@/lib/animations';
import { screenerAPI, type ScreenerFilters } from '@/lib/api';

const container = staggerContainer(0.05);
const item = fadeUpItem;

const presets: Record<string, { label: string; filters: Partial<ScreenerFilters> }> = {
  value: { label: '💎 Value Picks', filters: { peMax: 15, roeMin: 15, debtToEquityMax: 0.5 } },
  growth: { label: '🚀 Growth Stocks', filters: { revenueGrowthMin: 15, profitGrowthMin: 15, roeMin: 15 } },
  dividend: { label: '💰 Dividend Champions', filters: { dividendYieldMin: 2, peMax: 25, roeMin: 12 } },
  largecap: { label: '🏛️ Large Cap Quality', filters: { capCategories: ['Large Cap'], roeMin: 15, debtToEquityMax: 1 } },
  smallcap: { label: '🎯 Small Cap Growth', filters: { capCategories: ['Small Cap'], revenueGrowthMin: 20, profitGrowthMin: 20 } },
  lowdebt: { label: '🛡️ Low Debt Leaders', filters: { debtToEquityMax: 0.3, roeMin: 12 } },
  promoter: { label: '👑 High Promoter', filters: { promoterHoldingMin: 65, roeMin: 12 } },
};

const defaultFilters: ScreenerFilters = { sortBy: 'marketCap', sortOrder: 'desc', page: 1, limit: 50 };

export default function ScreenerPage() {
  const [filters, setFilters] = useState<ScreenerFilters>(defaultFilters);
  const [stocks, setStocks] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sectorOptions, setSectorOptions] = useState<string[]>([]);
  const [capOptions, setCapOptions] = useState<string[]>([]);
  const [activePreset, setActivePreset] = useState('');

  const runScreen = useCallback(async () => {
    setLoading(true);
    try {
      const res = await screenerAPI.screen(filters);
      setStocks(res.stocks);
      setTotalCount(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
      if (res.filterOptions) {
        setSectorOptions(res.filterOptions.sectors);
        setCapOptions(res.filterOptions.capCategories);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [filters]);

  useEffect(() => { runScreen(); }, [runScreen]);

  const update = (key: string, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    setActivePreset('');
  };

  const applyPreset = (key: string) => {
    setFilters({ ...defaultFilters, ...presets[key].filters });
    setActivePreset(key);
  };

  const reset = () => {
    setFilters(defaultFilters);
    setActivePreset('');
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <SlidersHorizontal size={24} className="text-accent" /> Stock Screener
        </h1>
        <p className="text-sm text-text-secondary mt-1">Find stocks matching your criteria</p>
      </motion.div>

      {/* Presets */}
      <motion.div variants={item} className="flex flex-wrap gap-2">
        {Object.entries(presets).map(([key, preset]) => (
          <button key={key} onClick={() => applyPreset(key)}
            className={cn('rounded-xl border px-4 py-2 text-xs font-medium transition-all',
              activePreset === key ? 'bg-accent/10 border-accent/30 text-accent' : 'border-border text-text-muted hover:text-text-primary hover:border-accent/20')}>
            {preset.label}
          </button>
        ))}
        <button onClick={reset} className="rounded-xl border border-border px-3 py-2 text-xs text-text-muted hover:text-text-primary flex items-center gap-1">
          <RotateCcw size={12} /> Reset
        </button>
      </motion.div>

      {/* Filters Grid */}
      <motion.div variants={item} className="card-static p-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-text-muted mb-1 block">Sector</label>
            <select value={(filters.sectors || [])[0] || ''} onChange={e => update('sectors', e.target.value ? [e.target.value] : [])}
              className="w-full rounded-lg border border-border bg-white/[0.03] px-2 py-1.5 text-xs text-text-secondary outline-none">
              <option value="">All Sectors</option>
              {sectorOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-text-muted mb-1 block">Market Cap</label>
            <select value={(filters.capCategories || [])[0] || ''} onChange={e => update('capCategories', e.target.value ? [e.target.value] : [])}
              className="w-full rounded-lg border border-border bg-white/[0.03] px-2 py-1.5 text-xs text-text-secondary outline-none">
              <option value="">All</option>
              {capOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-text-muted mb-1 block">PE Max</label>
            <input type="number" value={filters.peMax || ''} onChange={e => update('peMax', e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="e.g. 25"
              className="w-full rounded-lg border border-border bg-white/[0.03] px-2 py-1.5 text-xs text-text-primary outline-none" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-text-muted mb-1 block">ROE Min (%)</label>
            <input type="number" value={filters.roeMin || ''} onChange={e => update('roeMin', e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="e.g. 15"
              className="w-full rounded-lg border border-border bg-white/[0.03] px-2 py-1.5 text-xs text-text-primary outline-none" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-text-muted mb-1 block">D/E Max</label>
            <input type="number" step="0.1" value={filters.debtToEquityMax || ''} onChange={e => update('debtToEquityMax', e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="e.g. 0.5"
              className="w-full rounded-lg border border-border bg-white/[0.03] px-2 py-1.5 text-xs text-text-primary outline-none" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-text-muted mb-1 block">Div Yield Min</label>
            <input type="number" step="0.1" value={filters.dividendYieldMin || ''} onChange={e => update('dividendYieldMin', e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="e.g. 2"
              className="w-full rounded-lg border border-border bg-white/[0.03] px-2 py-1.5 text-xs text-text-primary outline-none" />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between">
          <p className="text-xs text-text-muted">
            <Sparkles size={10} className="inline text-accent mr-1" />
            Found <span className="font-bold text-text-primary">{totalCount}</span> stocks matching your criteria
          </p>
          <select value={filters.sortBy} onChange={e => update('sortBy', e.target.value)}
            className="rounded-lg border border-border bg-white/[0.03] px-3 py-1.5 text-xs text-text-secondary outline-none">
            <option value="marketCap">Sort: Market Cap</option>
            <option value="changePercent">Sort: Change %</option>
            <option value="roe">Sort: ROE</option>
            <option value="pe">Sort: P/E</option>
            <option value="dividendYield">Sort: Div Yield</option>
            <option value="debtToEquity">Sort: D/E</option>
          </select>
        </div>
      </motion.div>

      {/* Results Table */}
      <motion.div variants={item} className="card-static overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Stock', 'Price', 'Change', 'Mkt Cap', 'P/E', 'P/B', 'ROE', 'ROCE', 'D/E', 'Div Yield', 'Promoter'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stocks.map((s: Record<string, unknown>) => {
                  const positive = (s.changePercent as number) >= 0;
                  return (
                    <tr key={s.symbol as string} className="border-b border-border-subtle hover:bg-white/[0.02] transition-colors group">
                      <td className="px-3 py-2.5">
                        <Link href={`/stocks/${s.symbol}`} className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-[10px] font-bold text-accent">{(s.symbol as string).slice(0, 2)}</div>
                          <div>
                            <p className="text-xs font-semibold text-text-primary group-hover:text-accent">{s.symbol as string}</p>
                            <p className="text-[9px] text-text-muted truncate max-w-[100px]">{s.name as string}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-3 py-2.5 text-xs font-bold tabular-nums text-text-primary">{formatCurrency(s.currentPrice as number)}</td>
                      <td className="px-3 py-2.5">
                        <span className={cn('text-xs font-bold tabular-nums', getChangeColor(s.changePercent as number))}>
                          {positive ? '+' : ''}{(s.changePercent as number).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-text-secondary">{formatLargeNumber(s.marketCap as number)}</td>
                      <td className="px-3 py-2.5 text-xs tabular-nums text-text-secondary">{(s.pe as number)?.toFixed(1) || '-'}</td>
                      <td className="px-3 py-2.5 text-xs tabular-nums text-text-secondary">{(s.pb as number)?.toFixed(1) || '-'}</td>
                      <td className="px-3 py-2.5 text-xs tabular-nums text-text-secondary">{(s.roe as number)?.toFixed(1) || '-'}%</td>
                      <td className="px-3 py-2.5 text-xs tabular-nums text-text-secondary">{(s.roce as number)?.toFixed(1) || '-'}%</td>
                      <td className="px-3 py-2.5 text-xs tabular-nums text-text-secondary">{(s.debtToEquity as number)?.toFixed(2) || '-'}</td>
                      <td className="px-3 py-2.5 text-xs tabular-nums text-text-secondary">{(s.dividendYield as number)?.toFixed(1) || '-'}%</td>
                      <td className="px-3 py-2.5 text-xs tabular-nums text-text-secondary">{(s.promoterHolding as number)?.toFixed(1) || '-'}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-text-muted">
              Showing {(((filters.page || 1) - 1) * 50) + 1}–{Math.min((filters.page || 1) * 50, totalCount)} of {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <button disabled={(filters.page || 1) <= 1} onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) - 1 }))}
                className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-white/5 disabled:opacity-30"><ChevronLeft size={14} /></button>
              <span className="text-xs text-text-muted">Page {filters.page} of {totalPages}</span>
              <button disabled={(filters.page || 1) >= totalPages} onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) + 1 }))}
                className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-white/5 disabled:opacity-30"><ChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
