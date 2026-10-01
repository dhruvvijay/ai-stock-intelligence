'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, IndianRupee, Clock, Target, Sparkles } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { staggerContainer, fadeUpItem } from '@/lib/animations';

const container = staggerContainer(0.05);
const item = fadeUpItem;

function calculateSIP(monthly: number, years: number, rate: number) {
  const n = years * 12;
  const r = rate / 100 / 12;
  if (r === 0) return { corpus: monthly * n, invested: monthly * n, gains: 0 };
  const corpus = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = monthly * n;
  return { corpus: Math.round(corpus), invested, gains: Math.round(corpus - invested) };
}

function calculateLumpsum(amount: number, years: number, rate: number) {
  const corpus = amount * Math.pow(1 + rate / 100, years);
  return { corpus: Math.round(corpus), invested: amount, gains: Math.round(corpus - amount) };
}

export default function SIPPlannerPage() {
  const [mode, setMode] = useState<'sip' | 'lumpsum'>('sip');
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);
  const [stepUp, setStepUp] = useState(10);
  const [lumpsum, setLumpsum] = useState(500000);

  const result = useMemo(() => {
    if (mode === 'lumpsum') return calculateLumpsum(lumpsum, years, rate);
    return calculateSIP(monthly, years, rate);
  }, [mode, monthly, lumpsum, years, rate]);

  // Step-up SIP
  const stepUpResult = useMemo(() => {
    let total = 0;
    let invested = 0;
    let currentSIP = monthly;
    for (let y = 0; y < years; y++) {
      for (let m = 0; m < 12; m++) {
        invested += currentSIP;
        total = (total + currentSIP) * (1 + rate / 100 / 12);
      }
      currentSIP = Math.round(currentSIP * (1 + stepUp / 100));
    }
    return { corpus: Math.round(total), invested: Math.round(invested), gains: Math.round(total - invested) };
  }, [monthly, years, rate, stepUp]);

  // Milestones
  const milestones = useMemo(() => {
    const ms: Array<{ year: number; corpus: number }> = [];
    for (const y of [1, 3, 5, 10, 15, 20, 25, 30]) {
      if (y <= years) {
        const c = mode === 'sip' ? calculateSIP(monthly, y, rate) : calculateLumpsum(lumpsum, y, rate);
        ms.push({ year: y, corpus: c.corpus });
      }
    }
    return ms;
  }, [mode, monthly, lumpsum, years, rate]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Calculator size={24} className="text-accent" /> SIP & Investment Planner
        </h1>
        <p className="text-sm text-text-secondary mt-1">Plan your wealth creation journey</p>
      </motion.div>

      {/* Mode Toggle */}
      <motion.div variants={item} className="flex items-center gap-2">
        <button onClick={() => setMode('sip')} className={cn('rounded-xl px-4 py-2 text-sm font-medium transition-all', mode === 'sip' ? 'bg-accent text-white' : 'text-text-muted border border-border')}>SIP</button>
        <button onClick={() => setMode('lumpsum')} className={cn('rounded-xl px-4 py-2 text-sm font-medium transition-all', mode === 'lumpsum' ? 'bg-accent text-white' : 'text-text-muted border border-border')}>Lumpsum</button>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <motion.div variants={item} className="card-static p-6 space-y-6">
          {mode === 'sip' ? (
            <div>
              <label className="text-xs font-bold text-text-secondary flex items-center justify-between mb-2">
                Monthly Investment <span className="text-accent">{formatCurrency(monthly)}</span>
              </label>
              <input type="range" min="500" max="200000" step="500" value={monthly} onChange={e => setMonthly(parseInt(e.target.value))}
                className="w-full accent-accent" />
              <div className="flex justify-between text-[10px] text-text-muted mt-1"><span>₹500</span><span>₹2,00,000</span></div>
            </div>
          ) : (
            <div>
              <label className="text-xs font-bold text-text-secondary flex items-center justify-between mb-2">
                Investment Amount <span className="text-accent">{formatCurrency(lumpsum)}</span>
              </label>
              <input type="range" min="10000" max="10000000" step="10000" value={lumpsum} onChange={e => setLumpsum(parseInt(e.target.value))}
                className="w-full accent-accent" />
              <div className="flex justify-between text-[10px] text-text-muted mt-1"><span>₹10K</span><span>₹1 Cr</span></div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-text-secondary flex items-center justify-between mb-2">
              Time Period <span className="text-accent">{years} years</span>
            </label>
            <input type="range" min="1" max="30" value={years} onChange={e => setYears(parseInt(e.target.value))}
              className="w-full accent-accent" />
            <div className="flex justify-between text-[10px] text-text-muted mt-1"><span>1Y</span><span>30Y</span></div>
          </div>

          <div>
            <label className="text-xs font-bold text-text-secondary flex items-center justify-between mb-2">
              Expected Return <span className="text-accent">{rate}% p.a.</span>
            </label>
            <input type="range" min="1" max="30" step="0.5" value={rate} onChange={e => setRate(parseFloat(e.target.value))}
              className="w-full accent-accent" />
            <div className="flex justify-between text-[10px] text-text-muted mt-1"><span>1%</span><span>30%</span></div>
          </div>

          {mode === 'sip' && (
            <div>
              <label className="text-xs font-bold text-text-secondary flex items-center justify-between mb-2">
                Annual Step-Up <span className="text-accent">{stepUp}%</span>
              </label>
              <input type="range" min="0" max="25" value={stepUp} onChange={e => setStepUp(parseInt(e.target.value))}
                className="w-full accent-accent" />
              <div className="flex justify-between text-[10px] text-text-muted mt-1"><span>0%</span><span>25%</span></div>
            </div>
          )}
        </motion.div>

        {/* Results */}
        <motion.div variants={item} className="space-y-4">
          <div className="card-static p-6">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-4">
              <Target size={16} className="text-accent" />
              {mode === 'sip' ? 'SIP' : 'Lumpsum'} Results
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Invested</p>
                <p className="text-lg font-bold text-text-primary tabular-nums">{formatCurrency(result.invested)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Gains</p>
                <p className="text-lg font-bold text-emerald-400 tabular-nums">+{formatCurrency(result.gains)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Corpus</p>
                <p className="text-xl font-bold text-accent tabular-nums">{formatCurrency(result.corpus)}</p>
              </div>
            </div>
            {/* Visual bar */}
            <div className="h-4 rounded-full bg-white/5 overflow-hidden flex">
              <div className="h-full bg-accent/40" style={{ width: `${(result.invested / result.corpus) * 100}%` }} />
              <div className="h-full bg-emerald-500/60" style={{ width: `${(result.gains / result.corpus) * 100}%` }} />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-text-muted">
              <span>Invested ({((result.invested / result.corpus) * 100).toFixed(0)}%)</span>
              <span>Gains ({((result.gains / result.corpus) * 100).toFixed(0)}%)</span>
            </div>
          </div>

          {/* Step-Up Comparison */}
          {mode === 'sip' && stepUp > 0 && (
            <div className="card-static p-5 border-l-2 border-emerald-500/30">
              <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-1 mb-3">
                <Sparkles size={12} /> With {stepUp}% Annual Step-Up
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] text-text-muted">Invested</p>
                  <p className="text-sm font-bold text-text-primary">{formatCurrency(stepUpResult.invested)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted">Gains</p>
                  <p className="text-sm font-bold text-emerald-400">+{formatCurrency(stepUpResult.gains)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted">Corpus</p>
                  <p className="text-base font-bold text-accent">{formatCurrency(stepUpResult.corpus)}</p>
                </div>
              </div>
              <p className="text-[10px] text-emerald-400/80 mt-2">
                📈 {((stepUpResult.corpus / result.corpus - 1) * 100).toFixed(0)}% more than regular SIP!
              </p>
            </div>
          )}

          {/* Milestones */}
          <div className="card-static p-5">
            <h3 className="text-xs font-bold text-text-primary flex items-center gap-2 mb-3">
              <Clock size={14} className="text-accent" /> Growth Milestones
            </h3>
            <div className="space-y-2">
              {milestones.map(m => (
                <div key={m.year} className="flex items-center gap-3">
                  <span className="w-10 text-xs font-medium text-text-muted">{m.year}Y</span>
                  <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((m.corpus / (milestones[milestones.length - 1]?.corpus || 1)) * 100, 100)}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full bg-gradient-to-r from-accent/40 to-accent" />
                  </div>
                  <span className="w-24 text-right text-xs font-bold text-text-primary tabular-nums">{formatCurrency(m.corpus)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
