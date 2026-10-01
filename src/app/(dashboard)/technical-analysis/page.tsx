'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, BarChart3, Sparkles, TrendingUp, ArrowUp, ArrowDown, Activity, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn, formatCurrency, formatPercent, getChangeColor } from '@/lib/utils';
import { staggerContainer, fadeUpItemMedium } from '@/lib/animations';
import { stocksAPI, type StockDetailResponse, type StockSummary } from '@/lib/api';

const container = staggerContainer(0.05);
const item = fadeUpItemMedium;

function MiniChart({ data, positive }: { data: Array<{ close: number }>; positive: boolean }) {
  if (data.length < 2) return null;
  const closes = data.map(d => d.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;
  const w = 300;
  const h = 120;
  const points = closes.map((v, i) => `${(i / (closes.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="ta-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={positive ? '#34d399' : '#f87171'} stopOpacity="0.2" />
          <stop offset="100%" stopColor={positive ? '#34d399' : '#f87171'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${points} ${w},${h}`} fill="url(#ta-grad)" />
      <polyline points={points} fill="none" stroke={positive ? '#34d399' : '#f87171'} strokeWidth="2" />
    </svg>
  );
}

export default function TechnicalAnalysisPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('RELIANCE');
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<StockSummary[]>([]);
  const [stockData, setStockData] = useState<StockDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    stocksAPI.detail(selectedSymbol).then(d => { setStockData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [selectedSymbol]);

  useEffect(() => {
    if (searchInput.length < 1) { setSuggestions([]); return; }
    const timer = setTimeout(() => {
      stocksAPI.list({ search: searchInput, limit: 5 }).then(r => setSuggestions(r.stocks)).catch(() => {});
    }, 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const stock = stockData?.stock as Record<string, number | string> | undefined;
  const technicals = stockData?.technicals;
  const patterns = technicals?.patterns || [];
  const positive = stock ? (stock.changePercent as number) >= 0 : true;

  // Overall technical signal
  const techSignal = useMemo(() => {
    if (!technicals) return { signal: 'Neutral', score: 50 };
    let bullish = 0;
    let total = 0;
    // RSI
    total++;
    if (technicals.rsi < 30) bullish++;
    else if (technicals.rsi < 50) bullish += 0.5;
    // MACD
    total++;
    if (technicals.macd.histogram > 0) bullish++;
    // EMA crossover
    total++;
    if (technicals.ema.ema12 > technicals.ema.ema26) bullish++;
    // Price vs SMA200
    total++;
    if (stock && (stock.currentPrice as number) > technicals.sma.sma200) bullish++;
    // Bollinger position
    total++;
    if (stock && (stock.currentPrice as number) < technicals.bollingerBands.middle) bullish += 0.5;

    const score = Math.round((bullish / total) * 100);
    const signal = score >= 70 ? 'Strong Buy' : score >= 55 ? 'Buy' : score >= 45 ? 'Neutral' : score >= 30 ? 'Sell' : 'Strong Sell';
    return { signal, score };
  }, [technicals, stock]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Activity size={24} className="text-accent" /> Technical Analysis
          </h1>
          <p className="text-sm text-text-secondary mt-1">Real-time indicators, patterns, and signals</p>
        </div>
        <div className="relative w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search stock..."
            className="w-full rounded-xl border border-border bg-white/[0.03] py-2 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent/30" />
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-border bg-[#0a0f1a] shadow-xl z-50 overflow-hidden">
              {suggestions.map(s => (
                <button key={s.symbol} onClick={() => { setSelectedSymbol(s.symbol); setSearchInput(''); setSuggestions([]); }}
                  className="w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div>
                    <span className="text-sm font-semibold text-text-primary">{s.symbol}</span>
                    <span className="text-xs text-text-muted ml-2">{s.name}</span>
                  </div>
                  <span className={cn('text-xs font-bold', getChangeColor(s.changePercent))}>{formatPercent(s.changePercent)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
      ) : stockData && stock && technicals && (
        <>
          {/* Stock + Chart */}
          <motion.div variants={item} className="card-static p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-sm font-bold text-accent">{selectedSymbol.slice(0, 2)}</div>
                <div>
                  <Link href={`/stocks/${selectedSymbol}`} className="text-lg font-bold text-text-primary hover:text-accent">{stock.name as string}</Link>
                  <p className="text-xs text-text-muted">{stock.sector as string} • {stock.capCategory as string}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-text-primary tabular-nums">{formatCurrency(stock.currentPrice as number)}</p>
                <span className={cn('text-sm font-bold', getChangeColor(stock.changePercent as number))}>
                  {(stock.changePercent as number) >= 0 ? '+' : ''}{(stock.changePercent as number).toFixed(2)}%
                </span>
              </div>
            </div>
            <MiniChart data={stockData.priceHistory.slice(-90)} positive={positive} />
          </motion.div>

          {/* Overall Signal */}
          <motion.div variants={item} className="card-static p-5 text-center">
            <h3 className="text-sm font-bold text-text-muted uppercase mb-2">Overall Technical Signal</h3>
            <span className={cn(
              'inline-block rounded-xl px-6 py-3 text-xl font-bold',
              techSignal.signal.includes('Buy') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              techSignal.signal.includes('Sell') ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            )}>
              {techSignal.signal}
            </span>
            <p className="text-xs text-text-muted mt-2">Score: {techSignal.score}/100 bullish indicators</p>
          </motion.div>

          {/* Indicators Grid */}
          <motion.div variants={item} className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <div className="card p-4">
              <p className="text-[10px] text-text-muted uppercase">RSI (14)</p>
              <p className={cn('text-2xl font-bold mt-1',
                technicals.rsi > 70 ? 'text-red-400' : technicals.rsi < 30 ? 'text-emerald-400' : 'text-text-primary')}>
                {technicals.rsi.toFixed(1)}
              </p>
              <p className="text-[10px] text-text-muted">{technicals.rsi > 70 ? 'Overbought' : technicals.rsi < 30 ? 'Oversold' : 'Neutral'}</p>
            </div>
            <div className="card p-4">
              <p className="text-[10px] text-text-muted uppercase">MACD</p>
              <p className={cn('text-2xl font-bold mt-1', technicals.macd.histogram > 0 ? 'text-emerald-400' : 'text-red-400')}>
                {technicals.macd.macdLine.toFixed(1)}
              </p>
              <p className="text-[10px] text-text-muted">Signal: {technicals.macd.signal.toFixed(1)}</p>
            </div>
            <div className="card p-4">
              <p className="text-[10px] text-text-muted uppercase">SMA 20</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{formatCurrency(technicals.sma.sma20)}</p>
              <p className={cn('text-[10px]', (stock.currentPrice as number) > technicals.sma.sma20 ? 'text-emerald-400' : 'text-red-400')}>
                {(stock.currentPrice as number) > technicals.sma.sma20 ? 'Above' : 'Below'}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-[10px] text-text-muted uppercase">SMA 200</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{formatCurrency(technicals.sma.sma200)}</p>
              <p className={cn('text-[10px]', (stock.currentPrice as number) > technicals.sma.sma200 ? 'text-emerald-400' : 'text-red-400')}>
                {(stock.currentPrice as number) > technicals.sma.sma200 ? 'Bullish Trend' : 'Bearish Trend'}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-[10px] text-text-muted uppercase">Bollinger</p>
              <div className="mt-1 space-y-0.5">
                <p className="text-xs text-red-400">U: {formatCurrency(technicals.bollingerBands.upper)}</p>
                <p className="text-xs text-text-primary font-bold">M: {formatCurrency(technicals.bollingerBands.middle)}</p>
                <p className="text-xs text-emerald-400">L: {formatCurrency(technicals.bollingerBands.lower)}</p>
              </div>
            </div>
          </motion.div>

          {/* Candlestick Patterns */}
          {patterns.length > 0 && (
            <motion.div variants={item} className="card-static p-5">
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-amber-400" /> Detected Candlestick Patterns
              </h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {patterns.map((p, i) => (
                  <div key={i} className={cn('rounded-xl border p-3',
                    p.type === 'bullish' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5')}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn('text-xs font-bold', p.type === 'bullish' ? 'text-emerald-400' : 'text-red-400')}>
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

          {/* Support & Resistance */}
          <motion.div variants={item} className="card-static p-5">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-3">
              <BarChart3 size={16} className="text-accent" /> Key Levels
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-red-500/5 border border-red-500/10 p-3 text-center">
                <p className="text-[10px] text-red-400 uppercase font-bold">Resistance 2</p>
                <p className="text-base font-bold text-text-primary">{formatCurrency(technicals.bollingerBands.upper)}</p>
              </div>
              <div className="rounded-lg bg-red-500/5 border border-red-500/10 p-3 text-center">
                <p className="text-[10px] text-red-400 uppercase font-bold">Resistance 1</p>
                <p className="text-base font-bold text-text-primary">{formatCurrency(technicals.sma.sma20)}</p>
              </div>
              <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3 text-center">
                <p className="text-[10px] text-emerald-400 uppercase font-bold">Support 1</p>
                <p className="text-base font-bold text-text-primary">{formatCurrency(technicals.bollingerBands.lower)}</p>
              </div>
              <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3 text-center">
                <p className="text-[10px] text-emerald-400 uppercase font-bold">Support 2</p>
                <p className="text-base font-bold text-text-primary">{formatCurrency(technicals.sma.sma200)}</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
