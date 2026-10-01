'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Loader2, Target, TrendingUp, TrendingDown, BarChart3, Zap } from 'lucide-react';
import { cn, formatCurrency, formatPercent, formatLargeNumber, getChangeColor } from '@/lib/utils';
import { staggerContainer, fadeUpItem } from '@/lib/animations';
import { portfolioAPI, type PortfolioResponse } from '@/lib/api';

const container = staggerContainer(0.05);
const item = fadeUpItem;

function RiskMeter({ score }: { score: number }) {
  const color = score < 30 ? 'text-emerald-400' : score < 60 ? 'text-amber-400' : 'text-red-400';
  const label = score < 30 ? 'Low Risk' : score < 60 ? 'Moderate Risk' : 'High Risk';
  const bg = score < 30 ? 'from-emerald-500' : score < 60 ? 'from-amber-500' : 'from-red-500';
  return (
    <div className="text-center">
      <div className="relative w-32 h-32 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor"
            strokeWidth="8" strokeLinecap="round" strokeDasharray={`${score * 2.64} 264`}
            className={color} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-3xl font-bold', color)}>{score}</span>
          <span className="text-[10px] text-text-muted">/100</span>
        </div>
      </div>
      <p className={cn('text-sm font-bold mt-2', color)}>{label}</p>
    </div>
  );
}

export default function RiskAnalyzerPage() {
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portfolioAPI.get().then(d => { setPortfolio(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const analysis = useMemo(() => {
    if (!portfolio || portfolio.holdings.length === 0) return null;
    const h = portfolio.holdings;

    // Concentration risk
    const maxWeight = Math.max(...h.map(x => x.currentValue / portfolio.summary.currentValue * 100));
    const concentrationScore = maxWeight > 20 ? 80 : maxWeight > 10 ? 50 : 20;

    // Sector diversification
    const sectors = portfolio.sectorDistribution;
    const maxSectorWeight = Math.max(...sectors.map(s => s.percentage));
    const sectorScore = maxSectorWeight > 40 ? 75 : maxSectorWeight > 25 ? 45 : 15;

    // Holdings count
    const countScore = h.length < 5 ? 70 : h.length < 10 ? 40 : h.length < 20 ? 20 : 10;

    // Volatility proxy (use changePercent spread)
    const changes = h.map(x => Math.abs(x.stock.changePercent));
    const avgVolatility = changes.reduce((a, b) => a + b, 0) / changes.length;
    const volatilityScore = avgVolatility > 3 ? 80 : avgVolatility > 1.5 ? 50 : 20;

    const overallScore = Math.round((concentrationScore * 0.3 + sectorScore * 0.25 + countScore * 0.2 + volatilityScore * 0.25));

    // Recommendations
    const recs: string[] = [];
    if (maxWeight > 20) recs.push(`⚠️ ${h.sort((a, b) => b.currentValue - a.currentValue)[0].stock.symbol} exceeds 20% portfolio weight. Consider rebalancing.`);
    if (maxSectorWeight > 35) recs.push(`⚠️ ${sectors.sort((a, b) => b.percentage - a.percentage)[0].sector} sector is overweighted at ${maxSectorWeight.toFixed(0)}%.`);
    if (h.length < 8) recs.push('💡 Portfolio has fewer than 8 stocks. Consider adding more for diversification.');
    if (h.length > 25) recs.push('💡 Portfolio has 25+ stocks. Consider consolidating to avoid over-diversification.');
    const losers = h.filter(x => x.pnlPercent < -15);
    if (losers.length > 0) recs.push(`🔴 ${losers.length} holding(s) down >15%. Review exit strategy.`);
    const winners = h.filter(x => x.pnlPercent > 50);
    if (winners.length > 0) recs.push(`🟢 ${winners.length} holding(s) up >50%. Consider partial profit booking.`);
    if (recs.length === 0) recs.push('✅ Portfolio appears well balanced.');

    return {
      overallScore,
      concentrationScore, sectorScore, countScore, volatilityScore,
      maxWeight: { symbol: h.sort((a, b) => b.currentValue - a.currentValue)[0].stock.symbol, weight: maxWeight },
      recommendations: recs,
    };
  }, [portfolio]);

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Shield size={24} className="text-accent" /> Portfolio Risk Analyzer
        </h1>
        <p className="text-sm text-text-secondary mt-1">AI-powered risk assessment of your portfolio</p>
      </motion.div>

      {!portfolio || portfolio.holdings.length === 0 ? (
        <motion.div variants={item} className="card-static p-10 text-center">
          <Shield size={48} className="text-text-muted mx-auto mb-3 opacity-30" />
          <p className="text-text-muted text-sm">Add stocks to your portfolio first to run risk analysis.</p>
        </motion.div>
      ) : analysis && (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Risk Score */}
            <motion.div variants={item} className="card-static p-6 flex flex-col items-center justify-center">
              <h3 className="text-sm font-bold text-text-primary mb-4">Overall Risk Score</h3>
              <RiskMeter score={analysis.overallScore} />
            </motion.div>

            {/* Risk Breakdown */}
            <motion.div variants={item} className="card-static p-6">
              <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <BarChart3 size={16} className="text-accent" /> Risk Breakdown
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Concentration', score: analysis.concentrationScore, desc: `Max: ${analysis.maxWeight.symbol} (${analysis.maxWeight.weight.toFixed(1)}%)` },
                  { label: 'Sector Bias', score: analysis.sectorScore, desc: `${portfolio.sectorDistribution.length} sectors` },
                  { label: 'Diversification', score: analysis.countScore, desc: `${portfolio.holdings.length} stocks` },
                  { label: 'Volatility', score: analysis.volatilityScore, desc: 'Based on day change' },
                ].map(r => (
                  <div key={r.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">{r.label}</span>
                      <span className={cn('font-bold', r.score < 30 ? 'text-emerald-400' : r.score < 60 ? 'text-amber-400' : 'text-red-400')}>{r.score}/100</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className={cn('h-full rounded-full',
                        r.score < 30 ? 'bg-emerald-500' : r.score < 60 ? 'bg-amber-500' : 'bg-red-500')}
                        style={{ width: `${r.score}%` }} />
                    </div>
                    <p className="text-[10px] text-text-muted mt-0.5">{r.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div variants={item} className="card-static p-6">
              <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <Zap size={16} className="text-amber-400" /> AI Recommendations
              </h3>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className="rounded-lg bg-white/[0.02] border border-border-subtle p-3">
                    <p className="text-xs text-text-secondary leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Holdings Risk Table */}
          <motion.div variants={item} className="card-static overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-bold text-text-primary">Holdings Risk Profile</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Stock', 'Weight', 'Invested', 'Current', 'P&L', 'P&L %', 'Day Change', 'Risk'].map(h => (
                      <th key={h} className="px-3 py-2 text-left text-[10px] font-bold uppercase text-text-muted">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {portfolio.holdings.sort((a, b) => b.currentValue - a.currentValue).map(h => {
                    const weight = (h.currentValue / portfolio.summary.currentValue) * 100;
                    const risk = weight > 15 ? 'High' : weight > 8 ? 'Med' : 'Low';
                    return (
                      <tr key={h.id} className="border-b border-border-subtle hover:bg-white/[0.02]">
                        <td className="px-3 py-2 text-sm font-semibold text-text-primary">{h.stock.symbol}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 rounded-full bg-white/5 overflow-hidden">
                              <div className="h-full bg-accent rounded-full" style={{ width: `${weight}%` }} />
                            </div>
                            <span className="text-xs text-text-secondary">{weight.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-xs text-text-secondary">{formatCurrency(h.invested)}</td>
                        <td className="px-3 py-2 text-xs font-bold text-text-primary">{formatCurrency(h.currentValue)}</td>
                        <td className="px-3 py-2">
                          <span className={cn('text-xs font-bold', h.pnl >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                            {h.pnl >= 0 ? '+' : ''}{formatCurrency(h.pnl)}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={cn('text-xs font-bold', getChangeColor(h.pnlPercent))}>
                            {formatPercent(h.pnlPercent)}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={cn('text-xs font-bold', getChangeColor(h.stock.changePercent))}>
                            {formatPercent(h.stock.changePercent)}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold',
                            risk === 'High' ? 'bg-red-500/10 text-red-400' : risk === 'Med' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400')}>
                            {risk}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
