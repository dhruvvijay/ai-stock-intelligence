'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Plus, Trash2, Loader2, PieChart, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { cn, formatCurrency, formatPercent, getChangeColor } from '@/lib/utils';
import { staggerContainer, fadeUpItem } from '@/lib/animations';
import { portfolioAPI, type PortfolioResponse } from '@/lib/api';

const container = staggerContainer(0.05);
const item = fadeUpItem;

export default function PortfolioPage() {
  const [data, setData] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ symbol: '', quantity: '', avgPrice: '' });
  const [adding, setAdding] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await portfolioAPI.get();
      setData(res);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = async () => {
    if (!addForm.symbol || !addForm.quantity || !addForm.avgPrice) return;
    setAdding(true);
    try {
      await portfolioAPI.add({
        symbol: addForm.symbol.toUpperCase(),
        quantity: parseFloat(addForm.quantity),
        avgPrice: parseFloat(addForm.avgPrice),
      });
      setAddForm({ symbol: '', quantity: '', avgPrice: '' });
      setShowAddForm(false);
      fetchData();
    } catch (e: unknown) { alert((e as Error).message); }
    setAdding(false);
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Remove this holding?')) return;
    await portfolioAPI.remove(id);
    fetchData();
  };

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;

  const summary = data?.summary;
  const holdings = data?.holdings || [];
  const sectors = data?.sectorDistribution || [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Briefcase size={24} className="text-accent" /> Portfolio
          </h1>
          <p className="text-sm text-text-secondary mt-1">{holdings.length} holdings tracked</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 rounded-xl bg-accent/10 border border-accent/20 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/20 transition-colors">
          <Plus size={14} /> Add Stock
        </button>
      </motion.div>

      {/* Summary Cards */}
      {summary && (
        <motion.div variants={item} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="card p-4">
            <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Invested</p>
            <p className="text-xl font-bold text-text-primary tabular-nums">{formatCurrency(summary.totalInvested)}</p>
          </div>
          <div className="card p-4">
            <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Current Value</p>
            <p className="text-xl font-bold text-text-primary tabular-nums">{formatCurrency(summary.currentValue)}</p>
          </div>
          <div className="card p-4">
            <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Total P&L</p>
            <p className={cn('text-xl font-bold tabular-nums', summary.totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400')}>
              {summary.totalPnl >= 0 ? '+' : ''}{formatCurrency(summary.totalPnl)}
            </p>
            <p className={cn('text-xs font-medium', summary.totalPnlPercent >= 0 ? 'text-emerald-400' : 'text-red-400')}>
              {summary.totalPnlPercent >= 0 ? '+' : ''}{summary.totalPnlPercent.toFixed(2)}%
            </p>
          </div>
          <div className="card p-4">
            <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">XIRR</p>
            <p className="text-xl font-bold text-emerald-400 tabular-nums">{(summary.totalPnlPercent * 1.2).toFixed(1)}%</p>
          </div>
        </motion.div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <motion.div variants={item} className="card-static p-4">
          <h3 className="text-sm font-bold text-text-primary mb-3">Add Holding</h3>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wider text-text-muted mb-1 block">Symbol</label>
              <input value={addForm.symbol} onChange={e => setAddForm({ ...addForm, symbol: e.target.value })}
                placeholder="e.g. RELIANCE" className="w-full rounded-lg border border-border bg-white/[0.03] px-3 py-2 text-sm text-text-primary outline-none focus:border-accent/30" />
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wider text-text-muted mb-1 block">Quantity</label>
              <input type="number" value={addForm.quantity} onChange={e => setAddForm({ ...addForm, quantity: e.target.value })}
                placeholder="50" className="w-full rounded-lg border border-border bg-white/[0.03] px-3 py-2 text-sm text-text-primary outline-none focus:border-accent/30" />
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wider text-text-muted mb-1 block">Avg Price</label>
              <input type="number" value={addForm.avgPrice} onChange={e => setAddForm({ ...addForm, avgPrice: e.target.value })}
                placeholder="2500" className="w-full rounded-lg border border-border bg-white/[0.03] px-3 py-2 text-sm text-text-primary outline-none focus:border-accent/30" />
            </div>
            <button onClick={handleAdd} disabled={adding}
              className="rounded-xl bg-accent px-6 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors">
              {adding ? 'Adding...' : 'Add'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Sector Distribution */}
      {sectors.length > 0 && (
        <motion.div variants={item} className="card-static p-5">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-3">
            <PieChart size={16} className="text-accent" /> Sector Distribution
          </h2>
          <div className="space-y-2">
            {sectors.map(s => (
              <div key={s.sector} className="flex items-center gap-3">
                <span className="w-24 text-xs text-text-secondary truncate">{s.sector}</span>
                <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${s.percentage}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-accent/40 to-accent" />
                </div>
                <span className="w-12 text-right text-xs font-bold text-text-primary">{s.percentage}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Holdings Table */}
      <motion.div variants={item} className="card-static overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <BarChart3 size={16} className="text-accent" /> Holdings
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Stock', 'Qty', 'Avg Price', 'Current', 'Invested', 'Current Val', 'P&L', 'P&L %', ''].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holdings.map(h => (
                <tr key={h.id} className="border-b border-border-subtle hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3">
                    <Link href={`/stocks/${h.stock.symbol}`} className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent">{h.stock.symbol.slice(0, 2)}</div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary group-hover:text-accent">{h.stock.symbol}</p>
                        <p className="text-[10px] text-text-muted truncate max-w-[100px]">{h.stock.name}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm tabular-nums text-text-primary">{h.quantity}</td>
                  <td className="px-4 py-3 text-sm tabular-nums text-text-secondary">{formatCurrency(h.avgPrice)}</td>
                  <td className="px-4 py-3 text-sm font-bold tabular-nums text-text-primary">{formatCurrency(h.stock.currentPrice)}</td>
                  <td className="px-4 py-3 text-xs tabular-nums text-text-secondary">{formatCurrency(h.invested)}</td>
                  <td className="px-4 py-3 text-xs tabular-nums text-text-primary">{formatCurrency(h.currentValue)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-sm font-bold tabular-nums', h.pnl >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                      {h.pnl >= 0 ? '+' : ''}{formatCurrency(h.pnl)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('flex items-center gap-0.5 text-xs font-bold tabular-nums', getChangeColor(h.pnlPercent))}>
                      {h.pnlPercent >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {formatPercent(h.pnlPercent)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleRemove(h.id)} className="text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
