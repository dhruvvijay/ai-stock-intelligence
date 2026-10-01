'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Star, Share2,
  BarChart3, Sparkles, Target, Shield, AlertTriangle, Activity,
  Clock, Building2, Loader2, Brain, Zap, BookOpen, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { cn, formatCurrency, formatPercent, formatNumber, formatLargeNumber, getChangeColor, getChangeBg } from '@/lib/utils';
import { staggerContainer, fadeUpItemMedium } from '@/lib/animations';
import { stocksAPI, type StockDetailResponse } from '@/lib/api';

const container = staggerContainer(0.05);
const item = fadeUpItemMedium;

/* ── Mini Sparkline SVG ── */
function MiniChart({ data, positive }: { data: Array<{ close: number }>; positive: boolean }) {
  if (data.length < 2) return null;
  const closes = data.map(d => d.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;
  const w = 200;
  const h = 60;
  const points = closes.map((v, i) => `${(i / (closes.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="mt-2">
      <defs>
        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={positive ? '#34d399' : '#f87171'} stopOpacity="0.2" />
          <stop offset="100%" stopColor={positive ? '#34d399' : '#f87171'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${points} ${w},${h}`} fill="url(#chart-grad)" />
      <polyline points={points} fill="none" stroke={positive ? '#34d399' : '#f87171'} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GaugeBar({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 text-[10px] text-text-muted text-right">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-12 text-xs font-bold text-text-primary text-right tabular-nums">{value.toFixed(1)}</span>
    </div>
  );
}

export default function StockDetailPage() {
  const params = useParams();
  const symbol = (params.symbol as string)?.toUpperCase() || '';
  const [data, setData] = useState<StockDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'analysis' | 'fundamentals' | 'news'>('analysis');

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    stocksAPI.detail(symbol).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [symbol]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-sm text-text-muted">Loading {symbol} data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-lg text-text-muted">Stock &quot;{symbol}&quot; not found</p>
          <Link href="/stocks" className="text-sm text-accent hover:text-accent-hover mt-2 inline-flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Stocks
          </Link>
        </div>
      </div>
    );
  }

  const stock = data.stock as Record<string, number | string>;
  const { technicals, recommendation, peers, relatedNews, priceHistory } = data;
  const positive = (stock.change as number) >= 0;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      {/* Stock Header */}
      <motion.div variants={item} className="card-static p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-lg font-bold text-accent">
              {symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-text-primary">{stock.name as string}</h1>
                <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">{stock.exchange as string}</span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                <span className="flex items-center gap-1"><Building2 size={12} />{stock.sector as string}</span>
                <span>•</span>
                <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-bold',
                  stock.capCategory === 'Large Cap' ? 'bg-blue-500/10 text-blue-400' :
                  stock.capCategory === 'Mid Cap' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-purple-500/10 text-purple-400')}>
                  {stock.capCategory as string}
                </span>
                <span>•</span>
                <span>MCap: {formatLargeNumber(stock.marketCap as number)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-3xl font-bold tabular-nums text-text-primary">{formatCurrency(stock.currentPrice as number)}</p>
              <div className="flex items-center justify-end gap-2 mt-1">
                <span className={cn('flex items-center gap-0.5 text-sm font-bold', getChangeColor(stock.change as number))}>
                  {positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {Math.abs(stock.change as number).toFixed(2)}
                </span>
                <span className={cn('rounded-lg px-2 py-0.5 text-xs font-bold', getChangeBg(stock.changePercent as number))}>
                  {formatPercent(stock.changePercent as number)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8 pt-4 border-t border-border-subtle">
          {[
            { label: 'Day High', value: formatCurrency(stock.dayHigh as number) },
            { label: 'Day Low', value: formatCurrency(stock.dayLow as number) },
            { label: '52W High', value: formatCurrency(stock.weekHigh52 as number) },
            { label: '52W Low', value: formatCurrency(stock.weekLow52 as number) },
            { label: 'Volume', value: formatLargeNumber(stock.volume as number) },
            { label: 'P/E', value: (stock.pe as number)?.toFixed(1) || '-' },
            { label: 'ROE', value: `${(stock.roe as number)?.toFixed(1) || '-'}%` },
            { label: 'Div Yield', value: `${(stock.dividendYield as number)?.toFixed(1) || '0'}%` },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</p>
              <p className="text-sm font-bold tabular-nums text-text-primary mt-0.5">{stat.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Chart + AI Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Chart */}
        <motion.div variants={item} className="card-static p-5 lg:col-span-2">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2 mb-3">
            <BarChart3 size={18} className="text-accent" /> Price Chart
          </h2>
          <MiniChart data={priceHistory.slice(-90)} positive={positive} />
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-white/[0.03] p-2 text-center">
              <p className="text-[10px] text-text-muted">Open</p>
              <p className="text-xs font-bold text-text-primary">{formatCurrency(stock.open as number || stock.currentPrice as number)}</p>
            </div>
            <div className="rounded-lg bg-white/[0.03] p-2 text-center">
              <p className="text-[10px] text-text-muted">Prev Close</p>
              <p className="text-xs font-bold text-text-primary">{formatCurrency(stock.previousClose as number || (stock.currentPrice as number) - (stock.change as number))}</p>
            </div>
            <div className="rounded-lg bg-white/[0.03] p-2 text-center">
              <p className="text-[10px] text-text-muted">Avg Volume</p>
              <p className="text-xs font-bold text-text-primary">{formatLargeNumber(stock.avgVolume as number || 0)}</p>
            </div>
          </div>
        </motion.div>

        {/* AI Recommendation */}
        <motion.div variants={item} className="card-static p-5">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2 mb-4">
            <Brain size={18} className="text-accent" /> AI Analysis
          </h2>
          <div className="space-y-4">
            <div className="text-center">
              <span className={cn(
                'inline-block rounded-xl px-4 py-2 text-lg font-bold',
                recommendation.recommendation === 'Strong Buy' || recommendation.recommendation === 'Buy'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : recommendation.recommendation === 'Sell' || recommendation.recommendation === 'Strong Sell'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              )}>
                {recommendation.recommendation}
              </span>
              <p className="text-xs text-text-muted mt-1">Confidence: {recommendation.confidence}%</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Risk Level</span>
                <span className={cn('font-bold',
                  recommendation.riskLevel === 'Low' ? 'text-emerald-400' :
                  recommendation.riskLevel === 'Medium' ? 'text-amber-400' : 'text-red-400')}>
                  {recommendation.riskLevel}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Entry</span>
                <span className="font-bold text-text-primary">{formatCurrency(recommendation.entryPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Target</span>
                <span className="font-bold text-emerald-400">{formatCurrency(recommendation.targetPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Stop Loss</span>
                <span className="font-bold text-red-400">{formatCurrency(recommendation.stopLoss)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">R:R Ratio</span>
                <span className="font-bold text-accent">1:{recommendation.riskRewardRatio.toFixed(1)}</span>
              </div>
            </div>

            {/* Bull/Bear Scenarios */}
            <div className="pt-3 border-t border-border-subtle space-y-2">
              <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Bull</span>
                  <span className="text-xs font-bold text-emerald-400">{recommendation.bullScenario.probability}%</span>
                </div>
                <p className="text-[10px] text-text-muted mt-1">Target: {formatCurrency(recommendation.bullScenario.target)}</p>
              </div>
              <div className="rounded-lg bg-red-500/5 border border-red-500/10 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-red-400 uppercase">Bear</span>
                  <span className="text-xs font-bold text-red-400">{recommendation.bearScenario.probability}%</span>
                </div>
                <p className="text-[10px] text-text-muted mt-1">Target: {formatCurrency(recommendation.bearScenario.target)}</p>
              </div>
            </div>

            {/* Reasons */}
            <div className="pt-3 border-t border-border-subtle">
              <p className="text-[10px] font-bold text-text-muted uppercase mb-1.5">Key Reasons</p>
              <ul className="space-y-1">
                {recommendation.reasons.slice(0, 4).map((r, i) => (
                  <li key={i} className="text-[10px] text-text-secondary flex items-start gap-1.5">
                    <Sparkles size={8} className="text-accent mt-0.5 shrink-0" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Technical Indicators */}
      <motion.div variants={item} className="card-static p-5">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2 mb-4">
          <Activity size={18} className="text-accent" /> Technical Indicators
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-xl bg-white/[0.02] border border-border-subtle p-3">
            <p className="text-[10px] text-text-muted uppercase mb-1">RSI (14)</p>
            <p className={cn('text-xl font-bold tabular-nums',
              technicals.rsi > 70 ? 'text-red-400' : technicals.rsi < 30 ? 'text-emerald-400' : 'text-text-primary')}>
              {technicals.rsi.toFixed(1)}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">
              {technicals.rsi > 70 ? 'Overbought' : technicals.rsi < 30 ? 'Oversold' : 'Neutral'}
            </p>
          </div>
          <div className="rounded-xl bg-white/[0.02] border border-border-subtle p-3">
            <p className="text-[10px] text-text-muted uppercase mb-1">MACD</p>
            <p className={cn('text-xl font-bold tabular-nums', technicals.macd.histogram > 0 ? 'text-emerald-400' : 'text-red-400')}>
              {technicals.macd.macdLine.toFixed(2)}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">
              Signal: {technicals.macd.signal.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl bg-white/[0.02] border border-border-subtle p-3">
            <p className="text-[10px] text-text-muted uppercase mb-1">SMA 20/50/200</p>
            <div className="space-y-0.5 mt-1">
              <p className="text-xs tabular-nums text-text-primary">{formatCurrency(technicals.sma.sma20)}</p>
              <p className="text-xs tabular-nums text-text-secondary">{formatCurrency(technicals.sma.sma50)}</p>
              <p className="text-xs tabular-nums text-text-muted">{formatCurrency(technicals.sma.sma200)}</p>
            </div>
          </div>
          <div className="rounded-xl bg-white/[0.02] border border-border-subtle p-3">
            <p className="text-[10px] text-text-muted uppercase mb-1">Bollinger Bands</p>
            <div className="space-y-0.5 mt-1">
              <p className="text-xs text-red-400 tabular-nums">U: {formatCurrency(technicals.bollingerBands.upper)}</p>
              <p className="text-xs text-text-primary tabular-nums">M: {formatCurrency(technicals.bollingerBands.middle)}</p>
              <p className="text-xs text-emerald-400 tabular-nums">L: {formatCurrency(technicals.bollingerBands.lower)}</p>
            </div>
          </div>
          <div className="rounded-xl bg-white/[0.02] border border-border-subtle p-3">
            <p className="text-[10px] text-text-muted uppercase mb-1">EMA 12/26</p>
            <div className="space-y-0.5 mt-1">
              <p className="text-xs tabular-nums text-text-primary">12: {formatCurrency(technicals.ema.ema12)}</p>
              <p className="text-xs tabular-nums text-text-secondary">26: {formatCurrency(technicals.ema.ema26)}</p>
              <p className={cn('text-[10px] mt-1 font-bold', technicals.ema.ema12 > technicals.ema.ema26 ? 'text-emerald-400' : 'text-red-400')}>
                {technicals.ema.ema12 > technicals.ema.ema26 ? '↑ Bullish Crossover' : '↓ Bearish Crossover'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Candlestick Patterns */}
      {technicals.patterns.length > 0 && (
        <motion.div variants={item} className="card-static p-5">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2 mb-3">
            <Zap size={18} className="text-amber-400" /> Detected Patterns
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {technicals.patterns.map((p, i) => (
              <div key={i} className={cn('rounded-xl border p-3',
                p.type === 'bullish' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5')}>
                <div className="flex items-center justify-between mb-1">
                  <span className={cn('text-xs font-bold', p.type === 'bullish' ? 'text-emerald-400' : 'text-red-400')}>
                    {p.type === 'bullish' ? <TrendingUp size={12} className="inline mr-1" /> : <TrendingDown size={12} className="inline mr-1" />}
                    {p.name}
                  </span>
                  <span className="text-[10px] text-text-muted">{p.reliability}</span>
                </div>
                <p className="text-[10px] text-text-muted">{p.description}</p>
                <p className="text-[10px] text-text-secondary mt-1">{p.tradeSetup}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tabs: Fundamentals + News + Peers */}
      <motion.div variants={item}>
        <div className="flex items-center gap-1 border-b border-border mb-4">
          {[
            { key: 'analysis', label: 'Fundamentals', icon: <BookOpen size={14} /> },
            { key: 'news', label: 'Related News', icon: <Sparkles size={14} /> },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={cn('flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-all border-b-2',
                activeTab === tab.key ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text-primary')}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'analysis' && (
          <div className="card-static p-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {[
                { label: 'P/E Ratio', value: (stock.pe as number)?.toFixed(1) || '-' },
                { label: 'P/B Ratio', value: (stock.pb as number)?.toFixed(2) || '-' },
                { label: 'ROE', value: `${(stock.roe as number)?.toFixed(1)}%` },
                { label: 'ROCE', value: `${(stock.roce as number)?.toFixed(1)}%` },
                { label: 'D/E Ratio', value: (stock.debtToEquity as number)?.toFixed(2) || '-' },
                { label: 'EPS', value: `₹${(stock.eps as number)?.toFixed(2) || '-'}` },
                { label: 'Div Yield', value: `${(stock.dividendYield as number)?.toFixed(1) || '0'}%` },
                { label: 'Book Value', value: `₹${(stock.bookValue as number)?.toFixed(0) || '-'}` },
                { label: 'Rev Growth', value: `${(stock.revenueGrowth as number)?.toFixed(1) || '-'}%` },
                { label: 'Profit Growth', value: `${(stock.profitGrowth as number)?.toFixed(1) || '-'}%` },
                { label: 'Promoter %', value: `${(stock.promoterHolding as number)?.toFixed(1) || '-'}%` },
                { label: 'FII %', value: `${(stock.fiiHolding as number)?.toFixed(1) || '-'}%` },
              ].map(f => (
                <div key={f.label} className="rounded-lg bg-white/[0.02] p-3">
                  <p className="text-[10px] text-text-muted uppercase">{f.label}</p>
                  <p className="text-base font-bold text-text-primary tabular-nums mt-0.5">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-2">
            {relatedNews.length === 0 ? (
              <div className="card-static p-6 text-center text-text-muted text-sm">No related news found</div>
            ) : relatedNews.map(article => (
              <div key={article.id} className="card p-4 hover:border-accent/20 transition-all">
                <div className="flex items-start gap-2">
                  <span className={cn('shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase',
                    article.aiSentiment === 'Positive' ? 'bg-emerald-500/10 text-emerald-400' :
                    article.aiSentiment === 'Negative' ? 'bg-red-500/10 text-red-400' :
                    'bg-amber-500/10 text-amber-400')}>
                    {article.aiSentiment}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{article.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-text-muted">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>Impact: {article.aiImpactScore}/10</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Peers */}
      {peers.length > 0 && (
        <motion.div variants={item} className="card-static p-5">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-3">
            <Building2 size={16} className="text-accent" /> Sector Peers
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Stock', 'Price', 'Change', 'Market Cap', 'P/E'].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-[10px] font-bold uppercase text-text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {peers.slice(0, 8).map(p => (
                  <tr key={p.symbol} className="border-b border-border-subtle hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-2">
                      <Link href={`/stocks/${p.symbol}`} className="text-sm font-semibold text-text-primary hover:text-accent">
                        {p.symbol}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-xs font-bold tabular-nums">{formatCurrency(p.currentPrice)}</td>
                    <td className="px-3 py-2">
                      <span className={cn('text-xs font-bold tabular-nums', getChangeColor(p.changePercent))}>
                        {formatPercent(p.changePercent)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-text-secondary">{formatLargeNumber(p.marketCap || 0)}</td>
                    <td className="px-3 py-2 text-xs tabular-nums text-text-secondary">{(p.pe || 0).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
