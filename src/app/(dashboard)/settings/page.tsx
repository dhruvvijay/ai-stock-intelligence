'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Palette, Shield, Database, Moon, Sun, Monitor, Save, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { staggerContainer, fadeUpItem } from '@/lib/animations';

const container = staggerContainer(0.05);
const item = fadeUpItem;

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    emailAlerts: false,
    priceAlerts: true,
    newsDigest: true,
    defaultCurrency: 'INR',
    chartType: 'candlestick',
    defaultTimeframe: '1D',
    language: 'en',
  });

  const update = (key: string, value: unknown) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('app-settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-3xl">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Settings size={24} className="text-accent" /> Settings
        </h1>
        <p className="text-sm text-text-secondary mt-1">Customize your experience</p>
      </motion.div>

      {/* Appearance */}
      <motion.div variants={item} className="card-static p-5">
        <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-4">
          <Palette size={16} className="text-accent" /> Appearance
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-text-muted block mb-2">Theme</label>
            <div className="flex items-center gap-2">
              {[
                { key: 'dark', label: 'Dark', icon: <Moon size={14} /> },
                { key: 'light', label: 'Light', icon: <Sun size={14} /> },
                { key: 'system', label: 'System', icon: <Monitor size={14} /> },
              ].map(t => (
                <button key={t.key} onClick={() => update('theme', t.key)}
                  className={cn('flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all',
                    settings.theme === t.key ? 'bg-accent text-white' : 'border border-border text-text-muted hover:text-text-primary')}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-2">Default Chart Type</label>
            <select value={settings.chartType} onChange={e => update('chartType', e.target.value)}
              className="rounded-lg border border-border bg-white/[0.03] px-3 py-2 text-sm text-text-primary outline-none">
              <option value="candlestick">Candlestick</option>
              <option value="line">Line</option>
              <option value="area">Area</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-2">Default Timeframe</label>
            <select value={settings.defaultTimeframe} onChange={e => update('defaultTimeframe', e.target.value)}
              className="rounded-lg border border-border bg-white/[0.03] px-3 py-2 text-sm text-text-primary outline-none">
              {['1m', '5m', '15m', '1H', '1D', '1W', '1M'].map(tf => <option key={tf} value={tf}>{tf}</option>)}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={item} className="card-static p-5">
        <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-4">
          <Bell size={16} className="text-accent" /> Notifications
        </h2>
        <div className="space-y-3">
          {[
            { key: 'notifications', label: 'Push Notifications', desc: 'Get alerts on your device' },
            { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive alerts via email' },
            { key: 'priceAlerts', label: 'Price Alerts', desc: 'Notify when stocks hit target prices' },
            { key: 'newsDigest', label: 'Daily News Digest', desc: 'Morning summary of market news' },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between rounded-lg p-3 hover:bg-white/[0.02] transition-colors">
              <div>
                <p className="text-sm font-medium text-text-primary">{n.label}</p>
                <p className="text-[10px] text-text-muted">{n.desc}</p>
              </div>
              <button onClick={() => update(n.key, !(settings as Record<string, unknown>)[n.key])}
                className={cn('relative h-6 w-11 rounded-full transition-colors',
                  (settings as Record<string, unknown>)[n.key] ? 'bg-accent' : 'bg-white/10')}>
                <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                  (settings as Record<string, unknown>)[n.key] ? 'left-[22px]' : 'left-0.5')} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Data */}
      <motion.div variants={item} className="card-static p-5">
        <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-4">
          <Database size={16} className="text-accent" /> Data & Privacy
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg p-3">
            <div>
              <p className="text-sm font-medium text-text-primary">Default Currency</p>
              <p className="text-[10px] text-text-muted">Currency for displaying prices</p>
            </div>
            <select value={settings.defaultCurrency} onChange={e => update('defaultCurrency', e.target.value)}
              className="rounded-lg border border-border bg-white/[0.03] px-3 py-1.5 text-xs text-text-secondary outline-none">
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
            </select>
          </div>
          <div className="flex items-center justify-between rounded-lg p-3">
            <div>
              <p className="text-sm font-medium text-text-primary">Language</p>
              <p className="text-[10px] text-text-muted">Interface language</p>
            </div>
            <select value={settings.language} onChange={e => update('language', e.target.value)}
              className="rounded-lg border border-border bg-white/[0.03] px-3 py-1.5 text-xs text-text-secondary outline-none">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Save */}
      <motion.div variants={item}>
        <button onClick={handleSave}
          className={cn('rounded-xl px-6 py-3 text-sm font-medium transition-all flex items-center gap-2',
            saved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-accent text-white hover:bg-accent-hover')}>
          {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Settings</>}
        </button>
      </motion.div>
    </motion.div>
  );
}
