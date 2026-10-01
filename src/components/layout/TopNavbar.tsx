'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, Bookmark, Settings, Menu, X, Moon, Sun,
  TrendingUp, ChevronDown, Sparkles, User, LogOut
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';
import { searchAPI, notificationsAPI, type SearchResult, type NotificationItem } from '@/lib/api';

const navLinks = [
  { href: '/', label: 'Dashboard' },
  { href: '/markets', label: 'Markets' },
  { href: '/stocks', label: 'Stocks' },
  { href: '/mutual-funds', label: 'Mutual Funds' },
  { href: '/learn', label: 'Learn' },
  { href: '/ai-assistant', label: 'AI Assistant', icon: Sparkles },
];

export default function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSidebar, theme, setTheme, setSearchOpen, searchOpen } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setSearchOpen(false);
        setShowProfile(false);
        setShowNotifications(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    notificationsAPI.get().then(res => {
      setNotifications(res.notifications);
      setUnreadCount(res.unreadCount);
    }).catch(() => {});
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 1) { setSearchResults([]); return; }
    const timer = setTimeout(() => {
      searchAPI.global(searchQuery).then(res => setSearchResults(res.results)).catch(() => {});
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSelect = (result: SearchResult) => {
    setShowSearch(false);
    setSearchQuery('');
    if (result.type === 'stock') router.push(`/stocks/${result.symbol || result.title}`);
    else if (result.type === 'fund') router.push('/mutual-funds');
    else if (result.type === 'news') router.push('/news');
    else if (result.type === 'module') router.push('/learn');
  };

  const handleMarkAllRead = async () => {
    await notificationsAPI.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-bg-navbar backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-2 lg:gap-6">
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 transition-colors hover:bg-white/5 lg:hidden"
          >
            <Menu size={20} className="text-text-secondary" />
          </button>

          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
              <TrendingUp size={18} className="text-white" />
              <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-bg-primary" />
            </div>
            <span className="hidden text-lg font-bold tracking-tight text-text-primary lg:block">
              Stock<span className="gradient-text">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                  pathname === link.href
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                )}
              >
                {link.icon && <link.icon size={14} />}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center - Search */}
        <div className="relative mx-4 hidden max-w-md flex-1 md:block" ref={searchRef}>
          <div
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-bg-card px-4 py-2.5 transition-all hover:border-accent/30 hover:bg-bg-card-hover"
            onClick={() => setShowSearch(true)}
          >
            <Search size={16} className="text-text-muted" />
            <span className="flex-1 text-sm text-text-muted">
              Search stocks, mutual funds, sectors...
            </span>
            <kbd className="hidden rounded-md border border-border bg-bg-secondary px-2 py-0.5 text-[10px] font-medium text-text-muted lg:inline-block">
              ⌘K
            </kbd>
          </div>

          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-border bg-bg-card shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <Search size={18} className="text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search stocks, mutual funds, companies..."
                    className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-text-muted hover:text-text-primary">
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto p-2">
                  {searchResults.length === 0 && searchQuery.length > 0 ? (
                    <p className="px-3 py-4 text-center text-sm text-text-muted">No results found</p>
                  ) : searchResults.length === 0 ? (
                    <p className="px-3 py-4 text-center text-sm text-text-muted">Start typing to search...</p>
                  ) : (
                    searchResults.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleSearchSelect(result)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                      >
                        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg',
                          result.type === 'stock' ? 'bg-accent/10' :
                          result.type === 'fund' ? 'bg-emerald-500/10' :
                          result.type === 'news' ? 'bg-amber-500/10' : 'bg-purple-500/10')}>
                          <TrendingUp size={14} className={cn(
                            result.type === 'stock' ? 'text-accent' :
                            result.type === 'fund' ? 'text-emerald-400' :
                            result.type === 'news' ? 'text-amber-400' : 'text-purple-400')} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{result.title}</p>
                          {result.subtitle && <p className="text-xs text-text-muted truncate">{result.subtitle}</p>}
                        </div>
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase text-text-muted">
                          {result.type}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className="rounded-lg p-2.5 text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-lg p-2.5 text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-bg-primary" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-bg-card shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <h3 className="text-sm font-semibold text-text-primary">
                      Notifications {unreadCount > 0 && <span className="text-xs text-accent">({unreadCount})</span>}
                    </h3>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-xs text-accent hover:text-accent-hover">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-text-muted">No notifications</div>
                    ) : notifications.map((n) => (
                      <div key={n.id} className={cn(
                        'flex gap-3 border-b border-border-subtle px-4 py-3 transition-colors hover:bg-white/5',
                        !n.read && 'bg-accent/[0.03]'
                      )}>
                        <div className={cn(
                          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                          n.type === 'price' ? 'bg-emerald-500/10' : n.type === 'ai' ? 'bg-indigo-500/10' : 'bg-amber-500/10'
                        )}>
                          {n.type === 'price' ? <TrendingUp size={14} className="text-emerald-400" /> :
                           n.type === 'ai' ? <Sparkles size={14} className="text-indigo-400" /> :
                           <Bell size={14} className="text-amber-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{n.title}</p>
                          <p className="text-xs text-text-muted">{n.message}</p>
                          <p className="mt-1 text-xs text-text-muted">{timeAgo(n.createdAt)}</p>
                        </div>
                        {!n.read && <div className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/bookmarks" className="hidden rounded-lg p-2.5 text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary sm:block">
            <Bookmark size={18} />
          </Link>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="ml-1 flex items-center gap-2 rounded-xl border border-border bg-bg-card px-2 py-1.5 transition-all hover:border-accent/30 hover:bg-bg-card-hover"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <User size={14} className="text-white" />
              </div>
              <ChevronDown size={14} className="hidden text-text-muted sm:block" />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-bg-card shadow-2xl backdrop-blur-xl"
                >
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-sm font-semibold text-text-primary">Guest User</p>
                    <p className="text-xs text-text-muted">guest@stockai.com</p>
                  </div>
                  <div className="p-1.5">
                    <Link href="/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary">
                      <Settings size={14} /> Settings
                    </Link>
                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/5">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
