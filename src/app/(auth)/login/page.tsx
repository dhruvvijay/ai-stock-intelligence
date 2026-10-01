'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Globe, Phone, ArrowRight, Sparkles, Shield, BarChart3, Brain, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type AuthStep = 'choose' | 'phone' | 'otp' | 'onboarding';

const features = [
  { icon: Brain, title: 'AI-Powered Analysis', desc: 'Get intelligent stock recommendations' },
  { icon: BarChart3, title: 'Advanced Charts', desc: 'TradingView-style interactive charts' },
  { icon: Shield, title: 'Risk Assessment', desc: 'Portfolio risk analysis & management' },
  { icon: Sparkles, title: 'Smart Insights', desc: 'Real-time market intelligence' },
];

export default function LoginPage() {
  const [step, setStep] = useState<AuthStep>('choose');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (phone.length >= 10) {
      setLoading(true);
      setTimeout(() => { setLoading(false); setStep('otp'); }, 1500);
    }
  };

  const handleVerifyOTP = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('onboarding'); }, 1200);
  };

  const handleOTPInput = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  return (
    <div className="min-h-screen auth-bg flex">
      {/* Left - Features (Desktop only) */}
      <div className="hidden w-1/2 flex-col justify-center px-12 lg:flex xl:px-20">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/25">
              <TrendingUp size={24} className="text-white" />
            </div>
            <span className="text-3xl font-bold text-text-primary">Stock<span className="gradient-text">AI</span></span>
          </div>
          <h2 className="text-4xl font-bold text-text-primary leading-tight mb-4">
            Intelligent Stock Market<br />Analysis Platform
          </h2>
          <p className="text-lg text-text-secondary mb-10">
            AI-powered insights, advanced charts, portfolio tracking, and smart recommendations — all in one premium platform.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="card p-4">
                <f.icon size={24} className="text-accent mb-2" />
                <p className="text-sm font-semibold text-text-primary">{f.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right - Auth */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-text-primary">Stock<span className="gradient-text">AI</span></span>
          </div>

          <AnimatePresence mode="wait">
            {step === 'choose' && (
              <motion.div key="choose" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-2xl font-bold text-text-primary mb-2">Welcome Back</h1>
                <p className="text-sm text-text-secondary mb-8">Sign in to access your AI-powered stock intelligence dashboard</p>

                <button className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-white/[0.03] px-6 py-4 text-sm font-semibold text-text-primary transition-all hover:bg-white/[0.06] hover:border-accent/20 mb-4">
                  <Globe size={20} className="text-text-primary" />
                  Continue with Google
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-border" /><span className="text-xs text-text-muted">or</span><div className="h-px flex-1 bg-border" />
                </div>

                <button onClick={() => setStep('phone')}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40">
                  <Phone size={18} />
                  Continue with Phone Number
                </button>

                <p className="mt-6 text-center text-xs text-text-muted">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </motion.div>
            )}

            {step === 'phone' && (
              <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setStep('choose')} className="text-xs text-accent mb-4">← Back</button>
                <h1 className="text-2xl font-bold text-text-primary mb-2">Enter Phone Number</h1>
                <p className="text-sm text-text-secondary mb-8">We&apos;ll send you a verification code</p>

                <div className="flex items-center gap-2 mb-6">
                  <div className="rounded-xl border border-border bg-white/[0.03] px-4 py-3.5 text-sm text-text-primary">+91</div>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98765 43210" maxLength={10}
                    className="flex-1 rounded-xl border border-border bg-white/[0.03] px-4 py-3.5 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent/30" autoFocus />
                </div>

                <button onClick={handleSendOTP} disabled={phone.length < 10 || loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 disabled:opacity-50">
                  {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <><span>Send OTP</span><ArrowRight size={16} /></>}
                </button>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setStep('phone')} className="text-xs text-accent mb-4">← Back</button>
                <h1 className="text-2xl font-bold text-text-primary mb-2">Verify OTP</h1>
                <p className="text-sm text-text-secondary mb-8">Enter the 6-digit code sent to +91 {phone}</p>

                <div className="flex justify-center gap-2 mb-6">
                  {otp.map((digit, i) => (
                    <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={(e) => handleOTPInput(i, e.target.value)}
                      className="h-14 w-12 rounded-xl border border-border bg-white/[0.03] text-center text-xl font-bold text-text-primary outline-none focus:border-accent/50" />
                  ))}
                </div>

                <button onClick={handleVerifyOTP} disabled={otp.some(d => !d) || loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 disabled:opacity-50">
                  {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Verify & Continue'}
                </button>
                <p className="mt-4 text-center text-xs text-text-muted">Didn&apos;t receive? <button className="text-accent">Resend OTP</button></p>
              </motion.div>
            )}

            {step === 'onboarding' && (
              <motion.div key="onboarding" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center justify-center mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
                    <CheckCircle size={32} className="text-emerald-400" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-text-primary text-center mb-2">Welcome! 🎉</h1>
                <p className="text-sm text-text-secondary text-center mb-8">Your account has been verified. Let&apos;s set up your profile.</p>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Full Name</label>
                    <input type="text" placeholder="Your name" className="w-full rounded-xl border border-border bg-white/[0.03] px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent/30" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Risk Preference</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Conservative', 'Moderate', 'Aggressive', 'Very Aggressive'].map(r => (
                        <button key={r} className="rounded-xl border border-border px-3 py-2.5 text-xs font-medium text-text-secondary hover:border-accent/30 hover:bg-accent/5 hover:text-accent transition-all">
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Investment Goals</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Wealth Creation', 'Retirement', 'Tax Saving', 'Education', 'Passive Income', 'Short-term Gains'].map(g => (
                        <button key={g} className="rounded-full border border-border px-3 py-1.5 text-[11px] font-medium text-text-secondary hover:border-accent/30 hover:bg-accent/5 hover:text-accent transition-all">
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Link href="/"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25">
                  Complete Setup & Enter Dashboard
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
