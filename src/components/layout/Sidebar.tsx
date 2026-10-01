'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BarChart3, Briefcase, Wallet, Eye, Bookmark,
  Sparkles, SlidersHorizontal, PiggyBank, Calculator, GraduationCap,
  Newspaper, LineChart, Shield, ChevronLeft, ChevronRight, X, TrendingUp
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { type: 'section' as const, label: 'Overview' },
  { type: 'link' as const, href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { type: 'link' as const, href: '/markets', label: 'Market Overview', icon: BarChart3 },
  { type: 'section' as const, label: 'Portfolio' },
  { type: 'link' as const, href: '/portfolio', label: 'My Portfolio', icon: Briefcase },
  { type: 'link' as const, href: '/watchlist', label: 'Watchlist', icon: Eye },
  { type: 'link' as const, href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { type: 'section' as const, label: 'Intelligence' },
  { type: 'link' as const, href: '/ai-recommendations', label: 'AI Recommendations', icon: Sparkles },
  { type: 'link' as const, href: '/screener', label: 'Stock Screener', icon: SlidersHorizontal },
  { type: 'link' as const, href: '/technical-analysis', label: 'Technical Analysis', icon: LineChart },
  { type: 'link' as const, href: '/risk-analyzer', label: 'Risk Analyzer', icon: Shield },
  { type: 'section' as const, label: 'Investments' },
  { type: 'link' as const, href: '/mutual-funds', label: 'Mutual Funds', icon: PiggyBank },
  { type: 'link' as const, href: '/sip-planner', label: 'SIP Planner', icon: Calculator },
  { type: 'section' as const, label: 'Insights' },
  { type: 'link' as const, href: '/news', label: 'News Analysis', icon: Newspaper },
  { type: 'link' as const, href: '/learn', label: 'Learning Center', icon: GraduationCap },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, sidebarCollapsed, toggleSidebar, toggleSidebarCollapse } = useAppStore();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 bottom-0 z-40 flex flex-col border-r border-border bg-bg-sidebar backdrop-blur-xl transition-all duration-300',
          sidebarCollapsed ? 'w-[68px]' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Mobile Close Button */}
        <button
          onClick={toggleSidebar}
          className="absolute right-2 top-2 rounded-lg p-1.5 text-text-muted hover:bg-white/5 hover:text-text-primary lg:hidden"
        >
          <X size={18} />
        </button>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {sidebarItems.map((item, index) => {
            if (item.type === 'section') {
              if (sidebarCollapsed) {
                return <div key={index} className="my-2 h-px bg-border" />;
              }
              return (
                <p key={index} className="mb-1 mt-4 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted first:mt-0">
                  {item.label}
                </p>
              );
            }

            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => { if (sidebarOpen) toggleSidebar(); }}
                className={cn(
                  'group relative mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  sidebarCollapsed && 'justify-center px-0',
                  isActive
                    ? 'nav-active text-accent'
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-accent/10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon size={18} className="relative z-10 shrink-0" />
                {!sidebarCollapsed && (
                  <span className="relative z-10 truncate">{item.label}</span>
                )}

                {/* Tooltip for collapsed sidebar */}
                {sidebarCollapsed && (
                  <div className="pointer-events-none absolute left-full ml-2 hidden rounded-lg bg-bg-card px-3 py-1.5 text-xs font-medium text-text-primary shadow-xl border border-border group-hover:block">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* AI Assistant Quick Access */}
        {!sidebarCollapsed && (
          <div className="mx-3 mb-3">
            <Link
              href="/ai-assistant"
              className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 px-4 py-3 transition-all hover:from-indigo-500/20 hover:to-purple-500/20"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <Sparkles size={14} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">AI Assistant</p>
                <p className="text-xs text-text-muted">Ask anything about markets</p>
              </div>
            </Link>
          </div>
        )}

        {/* Collapse Toggle */}
        <div className="hidden border-t border-border p-2 lg:block">
          <button
            onClick={toggleSidebarCollapse}
            className="flex w-full items-center justify-center rounded-lg p-2 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>
    </>
  );
}
