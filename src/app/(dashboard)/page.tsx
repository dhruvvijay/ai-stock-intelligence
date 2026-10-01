'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Zap, BarChart3, ArrowUpRight, ArrowDownRight, Sparkles, Eye, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn, formatCurrency, formatPercent, formatNumber, formatLargeNumber, getChangeColor, getChangeBg } from '@/lib/utils';
import { staggerContainer, fadeUpItem } from '@/lib/animations';
import { dashboardAPI, type DashboardData, type StockSummary } from '@/lib/api';

const container = staggerContainer(0.06);
const item = fadeUpItem;

/* ── Sparkline SVG ── */
function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 32;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} className={positive ? 'sparkline-bullish' : 'sparkline-bearish'}>
      <defs>
        <linearGradient id={`sg-${positive ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={positive ? '#34d399' : '#f87171'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={positive ? '#34d399' : '#f87171'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${points} ${w},${h}`}
        fill={`url(#sg-${positive ? 'up' : 'down'})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={positive ? '#34d399' : '#f87171'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Generate deterministic sparkline data from a seed ── */
function generateSparkline(seed: number, points = 20): number[] {
  const data: number[] = [];
  let val = seed;
  for (let i = 0; i < points; i++) {
    val += (Math.sin(seed * (i + 1) * 0.3) + Math.cos(i * 0.7)) * (seed % 100);
    data.push(val);
  }
  return data;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    dashboardAPI.getData().then(d => {
      setData(d);
      setLoading(false);
      setLastUpdated(new Date());
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-sm text-text-muted">Loading market data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-text-muted">Failed to load dashboard data. Please refresh.</p>
      </div>
    );
  }

  const indices = [
    { name: 'NIFTY 50', symbol: 'NIFTY', ...data.indices.nifty50, aiSentiment: data.indices.nifty50.changePercent >= 0 ? 'Bullish' : 'Bearish' },
    { name: 'SENSEX', symbol: 'SENSEX', ...data.indices.sensex, aiSentiment: data.indices.sensex.changePercent >= 0 ? 'Bullish' : 'Bearish' },
    { name: 'BANK NIFTY', symbol: 'BANKNIFTY', ...data.indices.bankNifty, aiSentiment: data.indices.bankNifty.changePercent >= 0 ? 'Bullish' : 'Bearish' },
    { name: 'INDIA VIX', symbol: 'INDIAVIX', ...data.indices.indiaVix, aiSentiment: data.indices.indiaVix.changePercent <= 0 ? 'Bullish' : 'Bearish' },
  ];

  const timeSinceUpdate = Math.round((Date.now() - lastUpdated.getTime()) / 1000);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary lg:text-3xl">
            {getGreeting()}! 👋
          </h1>
          <p className="text-sm text-text-secondary">
            Here&apos;s your market overview for today &mdash; {data.counts.stocks} stocks &bull; {data.counts.mutualFunds} mutual funds tracked
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Market Open
          </span>
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Clock size={12} />Last updated: {timeSinceUpdate}s ago
          </span>
        </div>
      </motion.div>

      {/* Portfolio Summary Bar */}
      {data.portfolio.holdingsCount > 0 && (
        <motion.div variants={item}>
          <Link href="/portfolio" className="card group relative overflow-hidden p-4 flex items-center justify-between hover:border-accent/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-text-muted">Portfolio Value</p>
                <p className="text-xl font-bold text-text-primary tabular-nums">{formatCurrency(data.portfolio.currentValue)}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-text-muted">Total P&L</p>
                <p className={cn('text-lg font-bold tabular-nums', data.portfolio.totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                  {data.portfolio.totalPnl >= 0 ? '+' : ''}{formatCurrency(data.portfolio.totalPnl)}
                  <span className="text-xs ml-1">({data.portfolio.totalPnlPercent >= 0 ? '+' : ''}{data.portfolio.totalPnlPercent}%)</span>
                </p>
              </div>
              <div className="h-8 w-px bg-border hidden sm:block" />
              <div className="hidden sm:block">
                <p className="text-[10px] uppercase tracking-wider text-text-muted">Day P&L</p>
                <p className={cn('text-sm font-bold tabular-nums', (data.portfolio.dayPnl || 0) >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                  {(data.portfolio.dayPnl || 0) >= 0 ? '+' : ''}{formatCurrency(data.portfolio.dayPnl || 0)}
                </p>
              </div>
            </div>
            <div className="relative z-10 text-xs text-accent font-medium group-hover:text-accent-hover transition-colors">
              {data.portfolio.holdingsCount} holdings →
            </div>
          </Link>
        </motion.div>
      )}

      {/* Market Index Cards */}
      <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {indices.map((index, idx) => {
          const positive = index.change >= 0;
          const sparkData = generateSparkline(index.value + idx * 1000);
          return (
            <div
              key={index.symbol}
              className={cn(
                'card group relative overflow-hidden p-5',
                positive ? 'hover:border-emerald-500/20' : 'hover:border-red-500/20'
              )}
            >
              <div className={cn(
                'absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100',
                positive ? 'bg-gradient-to-br from-emerald-500/5 to-transparent' : 'bg-gradient-to-br from-red-500/5 to-transparent'
              )} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg',
                      positive ? 'bg-emerald-500/10' : 'bg-red-500/10'
                    )}>
                      {positive ? <TrendingUp size={16} className="text-emerald-400" /> : <TrendingDown size={16} className="text-red-400" />}
                    </div>
                    <span className="text-sm font-semibold text-text-primary">{index.name}</span>
                  </div>
                  <span className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-bold',
                    index.aiSentiment === 'Bullish' ? 'badge-bullish' : index.aiSentiment === 'Bearish' ? 'badge-bearish' : 'badge-neutral'
                  )}>
                    {index.aiSentiment}
                  </span>
                </div>

                <p className="text-2xl font-bold text-text-primary tabular-nums">
                  {index.value.toLocaleString('en-IN', { minimumFractionDigits: index.name === 'INDIA VIX' ? 1 : 0 })}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <span className={cn('flex items-center gap-0.5 text-sm font-semibold', getChangeColor(index.change))}>
                    {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(index.change).toFixed(2)}
                  </span>
                  <span className={cn('rounded-md px-1.5 py-0.5 text-xs font-bold', getChangeBg(index.change))}>
                    {formatPercent(index.changePercent)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-end">
                  <Sparkline data={sparkData} positive={positive} />
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Sector Performance + Heatmap Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Sector Performance */}
        <motion.div variants={item} className="card-static p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <BarChart3 size={18} className="text-accent" />
              Sector Performance
            </h2>
            <span className="text-xs text-text-muted">Today</span>
          </div>
          <div className="space-y-2.5">
            {data.sectorPerformance.slice(0, 12).map((sector) => {
              const positive = sector.avgChange >= 0;
              const maxAbs = Math.max(...data.sectorPerformance.map(s => Math.abs(s.avgChange)), 0.01);
              const barWidth = (Math.abs(sector.avgChange) / maxAbs) * 100;
              return (
                <div key={sector.sector} className="group flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5">
                  <span className="w-24 text-xs font-medium text-text-secondary truncate">{sector.sector}</span>
                  <div className="flex-1 relative h-5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' as const, delay: 0.2 }}
                      className={cn(
                        'absolute left-0 top-0 h-full rounded-full',
                        positive ? 'bg-gradient-to-r from-emerald-500/30 to-emerald-500/60' : 'bg-gradient-to-r from-red-500/30 to-red-500/60'
                      )}
                    />
                  </div>
                  <span className={cn('w-16 text-right text-xs font-bold tabular-nums', getChangeColor(sector.avgChange))}>
                    {formatPercent(sector.avgChange)}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Market Heatmap - from top gainers + losers */}
        <motion.div variants={item} className="card-static p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Activity size={18} className="text-accent" />
              Market Heatmap
            </h2>
            <span className="text-xs text-text-muted">By Change %</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {[...data.topGainers.slice(0, 10), ...data.topLosers.slice(0, 10)].map((stock) => {
              const positive = stock.changePercent >= 0;
              const intensity = Math.min(Math.abs(stock.changePercent) / 3, 1);
              return (
                <Link
                  key={stock.symbol}
                  href={`/stocks/${stock.symbol}`}
                  className="group relative flex flex-col items-center justify-center rounded-lg p-2.5 transition-all hover:scale-105 hover:z-10"
                  style={{
                    background: positive
                      ? `rgba(34, 197, 94, ${0.08 + intensity * 0.25})`
                      : `rgba(239, 68, 68, ${0.08 + intensity * 0.25})`,
                    border: `1px solid ${positive ? `rgba(34,197,94,${0.1 + intensity * 0.2})` : `rgba(239,68,68,${0.1 + intensity * 0.2})`}`,
                  }}
                >
                  <span className="text-[10px] font-bold text-text-primary truncate w-full text-center">{stock.symbol}</span>
                  <span className={cn('text-[10px] font-bold tabular-nums', getChangeColor(stock.changePercent))}>
                    {formatPercent(stock.changePercent)}
                  </span>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Top Gainers & Losers */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Top Gainers */}
        <motion.div variants={item} className="card-static p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-400" />
              Top Gainers
            </h2>
            <Link href="/stocks" className="text-xs font-medium text-accent hover:text-accent-hover transition-colors">View All →</Link>
          </div>
          <div className="space-y-1">
            {data.topGainers.slice(0, 6).map((stock, i) => (
              <Link
                key={stock.symbol}
                href={`/stocks/${stock.symbol}`}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5 group"
              >
                <span className="w-5 text-xs font-medium text-text-muted">{i + 1}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-400">
                  {stock.symbol.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{stock.name}</p>
                  <p className="text-[10px] text-text-muted">{stock.sector}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold tabular-nums text-text-primary">{formatCurrency(stock.currentPrice)}</p>
                  <p className="text-xs font-semibold text-emerald-400 tabular-nums">{formatPercent(stock.changePercent)}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Top Losers */}
        <motion.div variants={item} className="card-static p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <TrendingDown size={18} className="text-red-400" />
              Top Losers
            </h2>
            <Link href="/stocks" className="text-xs font-medium text-accent hover:text-accent-hover transition-colors">View All →</Link>
          </div>
          <div className="space-y-1">
            {data.topLosers.slice(0, 6).map((stock, i) => (
              <Link
                key={stock.symbol}
                href={`/stocks/${stock.symbol}`}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5 group"
              >
                <span className="w-5 text-xs font-medium text-text-muted">{i + 1}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-xs font-bold text-red-400">
                  {stock.symbol.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{stock.name}</p>
                  <p className="text-[10px] text-text-muted">{stock.sector}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold tabular-nums text-text-primary">{formatCurrency(stock.currentPrice)}</p>
                  <p className="text-xs font-semibold text-red-400 tabular-nums">{formatPercent(stock.changePercent)}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Most Active + AI News */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Most Active Stocks */}
        <motion.div variants={item} className="card-static p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Zap size={18} className="text-amber-400" />
              Most Active Stocks
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {data.mostActive.slice(0, 6).map((stock) => (
              <Link
                key={stock.symbol}
                href={`/stocks/${stock.symbol}`}
                className="group flex items-start gap-3 rounded-xl border border-border p-4 transition-all hover:border-accent/20 hover:bg-white/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-sm font-bold text-accent">
                  {stock.symbol.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-text-primary">{stock.symbol}</p>
                    <span className={cn('text-xs font-bold tabular-nums', getChangeColor(stock.changePercent))}>
                      {formatPercent(stock.changePercent)}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5 truncate">{stock.name}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] text-text-muted">
                      <Activity size={10} className="text-amber-400" /> Vol: {formatLargeNumber(stock.volume || 0)}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-text-muted">
                      ₹{formatCurrency(stock.currentPrice)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Latest News */}
        <motion.div variants={item} className="card-static p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Sparkles size={18} className="text-accent" />
              AI News Digest
            </h2>
            <Link href="/news" className="text-xs font-medium text-accent hover:text-accent-hover transition-colors">All →</Link>
          </div>
          <div className="space-y-3">
            {data.recentNews.slice(0, 4).map((article) => (
              <Link
                key={article.id}
                href="/news"
                className="group block rounded-xl border border-border-subtle p-3 transition-all hover:border-accent/20 hover:bg-white/5 cursor-pointer"
              >
                <div className="flex items-start gap-2">
                  <span className={cn(
                    'mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase',
                    article.aiSentiment === 'Positive' ? 'bg-emerald-500/10 text-emerald-400' :
                    article.aiSentiment === 'Negative' ? 'bg-red-500/10 text-red-400' :
                    'bg-amber-500/10 text-amber-400'
                  )}>
                    {article.aiSentiment}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary line-clamp-2 leading-relaxed">{article.title}</p>
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] text-text-muted">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>Impact: {article.aiImpactScore > 0 ? '+' : ''}{article.aiImpactScore}/10</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
