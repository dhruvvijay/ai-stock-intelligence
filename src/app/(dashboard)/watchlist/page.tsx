'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, Trash2, Search, ArrowUpRight, ArrowDownRight, Loader2, Edit3, X, Check } from 'lucide-react';
import Link from 'next/link';
import { cn, formatCurrency, formatPercent, formatLargeNumber, getChangeColor } from '@/lib/utils';
import { staggerContainer, fadeUpItem } from '@/lib/animations';
import { watchlistAPI, type WatchlistResponse } from '@/lib/api';

const container = staggerContainer(0.05);
const item = fadeUpItem;

export default function WatchlistPage() {
  const [data, setData] = useState<WatchlistResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [addSymbol, setAddSymbol] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const res = await watchlistAPI.get();
      setData(res);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddStock = async (watchlistId: string) => {
    if (!addSymbol.trim()) return;
    setAdding(true);
    try {
      await watchlistAPI.addStock(watchlistId, addSymbol.trim().toUpperCase());
      setAddSymbol('');
      fetchData();
    } catch (e: unknown) {
      alert((e as Error).message || 'Failed to add stock');
    }
    setAdding(false);
  };

  const handleRemoveStock = async (watchlistId: string, symbol: string) => {
    await watchlistAPI.removeStock(watchlistId, symbol);
    fetchData();
  };

  const handleRename = async (watchlistId: string) => {
    if (!newName.trim()) return;
    await watchlistAPI.renameList(watchlistId, newName.trim());
    setEditingName(null);
    fetchData();
  };

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;

  const watchlists = data?.watchlists || [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Star size={24} className="text-amber-400" /> Watchlist
          </h1>
          <p className="text-sm text-text-secondary mt-1">Track your favorite stocks</p>
        </div>
      </motion.div>

      {watchlists.map(wl => (
        <motion.div key={wl.id} variants={item} className="card-static overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            {editingName === wl.id ? (
              <div className="flex items-center gap-2">
                <input value={newName} onChange={e => setNewName(e.target.value)} className="rounded-lg border border-border bg-white/[0.03] px-3 py-1.5 text-sm text-text-primary outline-none" autoFocus />
                <button onClick={() => handleRename(wl.id)} className="text-emerald-400 hover:text-emerald-300"><Check size={16} /></button>
                <button onClick={() => setEditingName(null)} className="text-text-muted hover:text-text-primary"><X size={16} /></button>
              </div>
            ) : (
              <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                {wl.name}
                <span className="text-xs text-text-muted font-normal">({wl.items.length} stocks)</span>
                <button onClick={() => { setEditingName(wl.id); setNewName(wl.name); }} className="text-text-muted hover:text-accent"><Edit3 size={12} /></button>
              </h2>
            )}
            <div className="flex items-center gap-2">
              <input value={addSymbol} onChange={e => setAddSymbol(e.target.value)} placeholder="Add symbol..."
                onKeyDown={e => e.key === 'Enter' && handleAddStock(wl.id)}
                className="w-32 rounded-lg border border-border bg-white/[0.03] px-3 py-1.5 text-xs text-text-primary placeholder-text-muted outline-none focus:border-accent/30" />
              <button onClick={() => handleAddStock(wl.id)} disabled={adding}
                className="rounded-lg bg-accent/10 border border-accent/20 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 disabled:opacity-50">
                <Plus size={14} />
              </button>
            </div>
          </div>

          {wl.items.length === 0 ? (
            <div className="p-10 text-center text-text-muted text-sm">No stocks in this watchlist. Add a symbol above.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle">
                    {['Stock', 'Price', 'Change', 'Day Range', 'Volume', 'Market Cap', ''].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {wl.items.map(({ id, stock }) => {
                    const positive = stock.changePercent >= 0;
                    return (
                      <tr key={id} className="border-b border-border-subtle hover:bg-white/[0.02] transition-colors group">
                        <td className="px-4 py-3">
                          <Link href={`/stocks/${stock.symbol}`} className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent">{stock.symbol.slice(0, 2)}</div>
                            <div>
                              <p className="text-sm font-semibold text-text-primary group-hover:text-accent">{stock.symbol}</p>
                              <p className="text-[10px] text-text-muted truncate max-w-[120px]">{stock.name}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm font-bold tabular-nums text-text-primary">{formatCurrency(stock.currentPrice)}</td>
                        <td className="px-4 py-3">
                          <span className={cn('flex items-center gap-0.5 text-xs font-bold tabular-nums', getChangeColor(stock.changePercent))}>
                            {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {formatPercent(stock.changePercent)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-text-muted tabular-nums">
                          {(stock.dayLow || 0).toFixed(0)} – {(stock.dayHigh || 0).toFixed(0)}
                        </td>
                        <td className="px-4 py-3 text-xs tabular-nums text-text-secondary">{formatLargeNumber(stock.volume || 0)}</td>
                        <td className="px-4 py-3 text-xs text-text-secondary">{formatLargeNumber(stock.marketCap || 0)}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleRemoveStock(wl.id, stock.symbol)}
                            className="text-text-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
