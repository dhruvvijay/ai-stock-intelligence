'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, TrendingDown, Target, Shield, Loader2, ArrowUpRight, ArrowDownRight, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import { cn, formatCurrency, formatPercent, getChangeColor } from '@/lib/utils';
import { staggerContainer, fadeUpItem } from '@/lib/animations';
import { stocksAPI, type StockSummary } from '@/lib/api';

const container = staggerContainer(0.05);
const item = fadeUpItem;

interface AIRec {
  stock: StockSummary;
  recommendation: string;
  confidence: number;
  riskLevel: string;
  targetPrice: number;
  stopLoss: number;
  reasons: string[];
}

export default function AIRecommendationsPage() {
  const [recs, setRecs] = useState<AIRec[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Fetch top stocks and generate recommendations
    async function loadRecs() {
      try {
        const [gainers, losers] = await Promise.all([
          stocksAPI.list({ limit: 10, sortBy: 'changePercent', sortOrder: 'desc' }),
          stocksAPI.list({ limit: 5, sortBy: 'changePercent', sortOrder: 'asc' }),
        ]);

        const allStocks = [...gainers.stocks, ...losers.stocks];
        const recommendations: AIRec[] = [];

        for (const stock of allStocks.slice(0, 12)) {
          try {
            const detail = await stocksAPI.detail(stock.symbol);
            const r = detail.recommendation;
            recommendations.push({
              stock,
              recommendation: r.recommendation,
              confidence: r.confidence,
              riskLevel: r.riskLevel,
              targetPrice: r.targetPrice,
              stopLoss: r.stopLoss,
              reasons: r.reasons,
            });
          } catch { /* skip */ }
        }

        setRecs(recommendations);
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    loadRecs();
  }, []);

  const filtered = filter === 'all' ? recs
    : filter === 'buy' ? recs.filter(r => r.recommendation.includes('Buy'))
    : filter === 'sell' ? recs.filter(r => r.recommendation.includes('Sell'))
    : recs.filter(r => r.recommendation === 'Hold');

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
      <p className="text-sm text-text-muted">Generating AI recommendations...</p>
      <p className="text-xs text-text-muted">Analyzing fundamentals & technicals for top stocks</p>
    </div>
  );

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Brain size={24} className="text-accent" /> AI Recommendations
        </h1>
        <p className="text-sm text-text-secondary mt-1">{recs.length} stocks analyzed with AI-powered insights</p>
      </motion.div>

      <motion.div variants={item} className="flex items-center gap-2">
        {['all', 'buy', 'sell', 'hold'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('rounded-xl px-4 py-2 text-xs font-medium transition-all capitalize',
              filter === f ? 'bg-accent text-white' : 'text-text-muted border border-border hover:text-text-primary')}>
            {f === 'all' ? `All (${recs.length})` : f}
          </button>
        ))}
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map(rec => (
          <div key={rec.stock.symbol} className="card group p-5 hover:border-accent/20 transition-all">
            <div className="flex items-start justify-between mb-3">
              <Link href={`/stocks/${rec.stock.symbol}`} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-sm font-bold text-accent">
                  {rec.stock.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary group-hover:text-accent">{rec.stock.symbol}</p>
                  <p className="text-[10px] text-text-muted truncate max-w-[150px]">{rec.stock.name}</p>
                </div>
              </Link>
              <span className={cn(
                'rounded-xl px-3 py-1.5 text-xs font-bold',
                rec.recommendation.includes('Buy') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                rec.recommendation.includes('Sell') ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              )}>
                {rec.recommendation}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-3">
              <div>
                <p className="text-[10px] text-text-muted">Price</p>
                <p className="text-sm font-bold text-text-primary">{formatCurrency(rec.stock.currentPrice)}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted">Target</p>
                <p className="text-sm font-bold text-emerald-400">{formatCurrency(rec.targetPrice)}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted">Stop Loss</p>
                <p className="text-sm font-bold text-red-400">{formatCurrency(rec.stopLoss)}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted">Confidence</p>
                <p className="text-sm font-bold text-accent">{rec.confidence}%</p>
              </div>
            </div>

            <div className="space-y-1">
              {rec.reasons.slice(0, 3).map((r, i) => (
                <p key={i} className="text-[10px] text-text-muted flex items-start gap-1.5">
                  <Sparkles size={8} className="text-accent mt-0.5 shrink-0" /> {r}
                </p>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-border-subtle flex items-center justify-between">
              <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold',
                rec.riskLevel === 'Low' ? 'bg-emerald-500/10 text-emerald-400' :
                rec.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                'bg-red-500/10 text-red-400')}>
                {rec.riskLevel} Risk
              </span>
              <span className={cn('text-xs font-bold', getChangeColor(rec.stock.changePercent))}>
                {(rec.stock.changePercent >= 0 ? '+' : '')}{rec.stock.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
