'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, BarChart3, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn, formatCurrency, formatPercent, formatLargeNumber, getChangeColor, getChangeBg } from '@/lib/utils';
import { staggerContainer, fadeUpItem } from '@/lib/animations';
import { dashboardAPI, type DashboardData } from '@/lib/api';

const container = staggerContainer(0.05);
const item = fadeUpItem;

export default function MarketsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'overview' | 'gainers' | 'losers' | 'active'>('overview');

  useEffect(() => {
    dashboardAPI.getData().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  if (!data) return <div className="flex items-center justify-center h-[60vh]"><p className="text-text-muted">Failed to load market data</p></div>;

  const indices = [
    { name: 'NIFTY 50', ...data.indices.nifty50 },
    { name: 'SENSEX', ...data.indices.sensex },
    { name: 'BANK NIFTY', ...data.indices.bankNifty },
    { name: 'NIFTY IT', ...data.indices.niftyIT },
    { name: 'INDIA VIX', ...data.indices.indiaVix },
  ];

  const activeStocks = view === 'gainers' ? data.topGainers : view === 'losers' ? data.topLosers : view === 'active' ? data.mostActive : [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Activity size={24} className="text-accent" /> Markets
        </h1>
        <p className="text-sm text-text-secondary mt-1">Live market overview and sector analysis</p>
      </motion.div>

      {/* Index Cards */}
      <motion.div variants={item} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {indices.map(idx => {
          const positive = idx.change >= 0;
          return (
            <div key={idx.name} className={cn('card p-4', positive ? 'hover:border-emerald-500/20' : 'hover:border-red-500/20')}>
              <p className="text-xs font-semibold text-text-secondary">{idx.name}</p>
              <p className="text-xl font-bold text-text-primary tabular-nums mt-1">
                {idx.value.toLocaleString('en-IN')}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn('flex items-center gap-0.5 text-xs font-bold', getChangeColor(idx.change))}>
                  {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(idx.change).toFixed(2)}
                </span>
                <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-bold', getChangeBg(idx.changePercent))}>
                  {formatPercent(idx.changePercent)}
                </span>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Sector Performance */}
      <motion.div variants={item} className="card-static p-5">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2 mb-4">
          <BarChart3 size={18} className="text-accent" /> Sector Performance
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {data.sectorPerformance.map(sector => {
            const positive = sector.avgChange >= 0;
            const maxAbs = Math.max(...data.sectorPerformance.map(s => Math.abs(s.avgChange)), 0.01);
            const barWidth = (Math.abs(sector.avgChange) / maxAbs) * 100;
            return (
              <div key={sector.sector} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5 transition-colors">
                <span className="w-28 text-xs font-medium text-text-secondary truncate">{sector.sector}</span>
                <div className="flex-1 h-4 rounded-full bg-white/5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${barWidth}%` }} transition={{ duration: 0.8 }}
                    className={cn('h-full rounded-full', positive ? 'bg-gradient-to-r from-emerald-500/30 to-emerald-500/60' : 'bg-gradient-to-r from-red-500/30 to-red-500/60')} />
                </div>
                <span className={cn('w-14 text-right text-xs font-bold tabular-nums', getChangeColor(sector.avgChange))}>
                  {formatPercent(sector.avgChange)}
                </span>
                <span className="w-8 text-right text-[10px] text-text-muted">{sector.stockCount}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Tabs: Gainers / Losers / Active */}
      <motion.div variants={item}>
        <div className="flex items-center gap-1 mb-4">
          {[
            { key: 'gainers', label: 'Top Gainers', icon: <TrendingUp size={14} /> },
            { key: 'losers', label: 'Top Losers', icon: <TrendingDown size={14} /> },
            { key: 'active', label: 'Most Active', icon: <Activity size={14} /> },
          ].map(tab => (
            <button key={tab.key} onClick={() => setView(tab.key as typeof view)}
              className={cn('flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium transition-all',
                view === tab.key ? 'bg-accent/10 text-accent border border-accent/20' : 'text-text-muted hover:text-text-primary border border-transparent')}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {view !== 'overview' && (
          <div className="card-static overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['#', 'Stock', 'Price', 'Change', 'Volume', 'Sector'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeStocks.map((stock, i) => {
                  const positive = stock.changePercent >= 0;
                  return (
                    <tr key={stock.symbol} className="border-b border-border-subtle hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-2.5 text-xs text-text-muted">{i + 1}</td>
                      <td className="px-4 py-2.5">
                        <Link href={`/stocks/${stock.symbol}`} className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-[10px] font-bold text-accent">{stock.symbol.slice(0, 2)}</div>
                          <div>
                            <p className="text-sm font-semibold text-text-primary hover:text-accent">{stock.symbol}</p>
                            <p className="text-[10px] text-text-muted truncate max-w-[120px]">{stock.name}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-sm font-bold tabular-nums text-text-primary">{formatCurrency(stock.currentPrice)}</td>
                      <td className="px-4 py-2.5">
                        <span className={cn('flex items-center gap-0.5 text-xs font-bold', getChangeColor(stock.changePercent))}>
                          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {formatPercent(stock.changePercent)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-text-secondary">{formatLargeNumber(stock.volume || 0)}</td>
                      <td className="px-4 py-2.5 text-xs text-text-muted">{stock.sector}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
