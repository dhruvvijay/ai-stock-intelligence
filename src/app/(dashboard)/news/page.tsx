'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Search, TrendingUp, TrendingDown, Minus, Loader2, ChevronLeft, ChevronRight, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn, formatPercent, getChangeColor } from '@/lib/utils';
import { staggerContainer, fadeUpItem } from '@/lib/animations';
import { newsAPI, type NewsArticle } from '@/lib/api';

const container = staggerContainer(0.05);
const item = fadeUpItem;

const categories = ['all', 'market', 'stocks', 'economy', 'banking', 'technology', 'ipo', 'rbi', 'global', 'commodities', 'ai', 'budget', 'crypto'];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [sentiment, setSentiment] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await newsAPI.list({
        page,
        limit: 15,
        category: category !== 'all' ? category : undefined,
        sentiment: sentiment || undefined,
        search: search || undefined,
      });
      setArticles(res.articles);
      setTotalPages(res.pagination.totalPages);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [page, category, sentiment, search]);

  useEffect(() => { fetchNews(); }, [fetchNews]);
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const SentimentIcon = ({ s }: { s: string }) =>
    s === 'Positive' ? <TrendingUp size={12} className="text-emerald-400" /> :
    s === 'Negative' ? <TrendingDown size={12} className="text-red-400" /> :
    <Minus size={12} className="text-amber-400" />;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Newspaper size={24} className="text-accent" /> AI-Powered News
        </h1>
        <p className="text-sm text-text-secondary mt-1">Real-time market news with AI sentiment analysis</p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="card-static p-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" placeholder="Search news..." value={searchInput} onChange={e => setSearchInput(e.target.value)}
              className="w-full rounded-xl border border-border bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent/30" />
          </div>
          <div className="flex items-center gap-2">
            {['', 'Positive', 'Negative', 'Neutral'].map(s => (
              <button key={s} onClick={() => { setSentiment(s); setPage(1); }}
                className={cn('rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                  sentiment === s ? (s === 'Positive' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : s === 'Negative' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : s === 'Neutral' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-accent text-white') : 'text-text-muted hover:text-text-primary border border-transparent')}>
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map(c => (
            <button key={c} onClick={() => { setCategory(c); setPage(1); }}
              className={cn('rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider transition-all',
                category === c ? 'bg-accent/10 text-accent border border-accent/30' : 'text-text-muted hover:text-text-primary border border-border-subtle')}>
              {c}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Articles */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
      ) : (
        <motion.div variants={item} className="space-y-3">
          {articles.map(article => (
            <div key={article.id} className="card group p-5 hover:border-accent/20 transition-all cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                      article.aiSentiment === 'Positive' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      article.aiSentiment === 'Negative' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20')}>
                      <SentimentIcon s={article.aiSentiment} /> {article.aiSentiment}
                    </span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-text-muted uppercase">{article.category}</span>
                    <span className="flex items-center gap-1 text-[10px] text-text-muted"><Clock size={10} />{timeAgo(article.publishedAt)}</span>
                  </div>
                  <h3 className="text-base font-bold text-text-primary group-hover:text-accent transition-colors">{article.title}</h3>
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">{article.summary}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <span className="text-xs text-text-muted font-medium">{article.source}</span>
                    <span className="flex items-center gap-1 text-xs">
                      <Sparkles size={10} className="text-accent" />
                      Impact: <span className={cn('font-bold', article.aiImpactScore > 0 ? 'text-emerald-400' : article.aiImpactScore < 0 ? 'text-red-400' : 'text-text-secondary')}>
                        {article.aiImpactScore > 0 ? '+' : ''}{article.aiImpactScore}/10
                      </span>
                    </span>
                    {article.bullishScore !== undefined && (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: `${article.bullishScore}%` }} />
                        </div>
                        <span className="text-[10px] text-text-muted">{article.bullishScore}% Bull</span>
                      </div>
                    )}
                    {article.relatedStocks && article.relatedStocks.length > 0 && (
                      <div className="flex items-center gap-1">
                        {article.relatedStocks.slice(0, 3).map(s => (
                          <Link key={s.symbol} href={`/stocks/${s.symbol}`}
                            className="rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent hover:bg-accent/20 transition-colors">
                            {s.symbol}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:bg-white/5 disabled:opacity-30">
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs text-text-muted">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:bg-white/5 disabled:opacity-30">
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </motion.div>
  );
}
