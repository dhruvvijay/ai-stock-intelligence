'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Loader2, Trash2, ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';
import Link from 'next/link';
import { cn, formatCurrency, formatPercent, getChangeColor } from '@/lib/utils';
import { staggerContainer, fadeUpItem } from '@/lib/animations';
import { bookmarksAPI, type BookmarksResponse } from '@/lib/api';

const container = staggerContainer(0.05);
const item = fadeUpItem;

export default function BookmarksPage() {
  const [data, setData] = useState<BookmarksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    bookmarksAPI.get(filter || undefined).then(res => { setData(res); setLoading(false); }).catch(() => setLoading(false));
  }, [filter]);

  const handleRemove = async (id: string) => {
    await bookmarksAPI.remove(id);
    const res = await bookmarksAPI.get(filter || undefined);
    setData(res);
  };

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;

  const bookmarks = data?.bookmarks || [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Bookmark size={24} className="text-accent" /> Bookmarks
        </h1>
        <p className="text-sm text-text-secondary mt-1">{bookmarks.length} saved items</p>
      </motion.div>

      <motion.div variants={item} className="flex items-center gap-2">
        {['', 'stock', 'fund', 'news', 'module'].map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={cn('rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
              filter === t ? 'bg-accent text-white' : 'text-text-muted hover:text-text-primary border border-border-subtle')}>
            {t || 'All'} {t === '' ? `(${bookmarks.length})` : ''}
          </button>
        ))}
      </motion.div>

      {bookmarks.length === 0 ? (
        <motion.div variants={item} className="card-static p-10 text-center">
          <Bookmark size={40} className="text-text-muted mx-auto mb-3 opacity-30" />
          <p className="text-text-muted">No bookmarks yet. Bookmark stocks, funds, news, or modules to save them here.</p>
        </motion.div>
      ) : (
        <motion.div variants={item} className="space-y-2">
          {bookmarks.map(bm => (
            <div key={bm.id} className="card group p-4 flex items-center gap-4 hover:border-accent/20 transition-all">
              <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                bm.type === 'stock' ? 'bg-accent/10 text-accent' :
                bm.type === 'fund' ? 'bg-emerald-500/10 text-emerald-400' :
                bm.type === 'news' ? 'bg-amber-500/10 text-amber-400' :
                'bg-purple-500/10 text-purple-400')}>
                {bm.type}
              </span>

              {bm.type === 'stock' && bm.stock && (
                <Link href={`/stocks/${bm.stock.symbol}`} className="flex-1 flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent">{bm.stock.symbol.slice(0, 2)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary group-hover:text-accent">{bm.stock.symbol} — {bm.stock.name}</p>
                    <p className="text-[10px] text-text-muted">{bm.stock.sector}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold tabular-nums text-text-primary">{formatCurrency(bm.stock.currentPrice)}</p>
                    <p className={cn('text-xs font-bold tabular-nums', getChangeColor(bm.stock.changePercent))}>
                      {bm.stock.changePercent >= 0 ? <ArrowUpRight size={10} className="inline" /> : <ArrowDownRight size={10} className="inline" />}
                      {formatPercent(bm.stock.changePercent)}
                    </p>
                  </div>
                </Link>
              )}

              {bm.type === 'fund' && bm.fund && (
                <Link href="/mutual-funds" className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary group-hover:text-accent truncate">{(bm.fund as Record<string, unknown>).name as string}</p>
                  <p className="text-[10px] text-text-muted">{(bm.fund as Record<string, unknown>).category as string}</p>
                </Link>
              )}

              {bm.type === 'news' && bm.news && (
                <Link href="/news" className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary group-hover:text-accent line-clamp-1">{bm.news.title}</p>
                  <p className="text-[10px] text-text-muted">{bm.news.source}</p>
                </Link>
              )}

              {bm.type === 'module' && bm.module && (
                <Link href="/learn" className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary group-hover:text-accent">{(bm.module as Record<string, unknown>).title as string}</p>
                  <p className="text-[10px] text-text-muted">{(bm.module as Record<string, unknown>).difficulty as string}</p>
                </Link>
              )}

              <button onClick={() => handleRemove(bm.id)}
                className="text-text-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
