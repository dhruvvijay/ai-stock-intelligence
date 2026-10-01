'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Trash2, Loader2, Bot, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { staggerContainer, fadeUpItem } from '@/lib/animations';
import { chatAPI, type ChatMessage } from '@/lib/api';

const container = staggerContainer(0.05);
const item = fadeUpItem;

// Simple markdown renderer for chat
function renderMarkdown(content: string) {
  // Split by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith('```')) {
      const code = part.replace(/```\w*\n?/g, '').replace(/```$/g, '');
      return <pre key={i} className="bg-white/5 rounded-lg p-3 text-xs overflow-x-auto my-2 font-mono text-text-secondary">{code}</pre>;
    }
    // Process inline formatting
    const lines = part.split('\n');
    return lines.map((line, li) => {
      if (line.startsWith('## ')) return <h2 key={`${i}-${li}`} className="text-base font-bold text-text-primary mt-3 mb-1">{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={`${i}-${li}`} className="text-sm font-bold text-text-primary mt-2 mb-1">{line.slice(4)}</h3>;
      if (line.startsWith('# ')) return <h1 key={`${i}-${li}`} className="text-lg font-bold text-text-primary mt-3 mb-1">{line.slice(2)}</h1>;
      if (line.startsWith('> ')) return <blockquote key={`${i}-${li}`} className="border-l-2 border-accent/30 pl-3 text-xs text-text-muted italic my-1">{line.slice(2)}</blockquote>;
      if (line.startsWith('- ') || line.startsWith('* ')) return <li key={`${i}-${li}`} className="text-xs text-text-secondary ml-4 list-disc">{formatInline(line.slice(2))}</li>;
      if (/^\d+\.\s/.test(line)) return <li key={`${i}-${li}`} className="text-xs text-text-secondary ml-4 list-decimal">{formatInline(line.replace(/^\d+\.\s/, ''))}</li>;
      if (line.startsWith('|')) {
        // Table row
        const cells = line.split('|').filter(Boolean).map(c => c.trim());
        if (cells.every(c => /^-+$/.test(c))) return null;
        return (
          <div key={`${i}-${li}`} className="flex gap-2 text-xs py-0.5">
            {cells.map((cell, ci) => (
              <span key={ci} className={cn('flex-1 text-text-secondary', li === 0 && 'font-bold text-text-primary')}>{cell}</span>
            ))}
          </div>
        );
      }
      if (line.trim() === '') return <br key={`${i}-${li}`} />;
      return <p key={`${i}-${li}`} className="text-xs text-text-secondary leading-relaxed">{formatInline(line)}</p>;
    });
  });
}

function formatInline(text: string): React.ReactNode {
  // Bold
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <strong key={i} className="font-bold text-text-primary">{p.slice(2, -2)}</strong>;
    }
    return p;
  });
}

const quickPrompts = [
  'Analyze Reliance Industries',
  'Help me build a portfolio',
  'Explain RSI indicator',
  'Best mutual funds for SIP',
  'What are candlestick patterns?',
  'Risk management strategies',
  'Market overview today',
  'SIP calculator and guide',
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatAPI.getHistory().then(res => {
      setMessages(res.messages);
      setHistoryLoading(false);
    }).catch(() => setHistoryLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    // Optimistically add user message
    const userMsg: ChatMessage = { id: `temp-${Date.now()}`, role: 'user', content: msg, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await chatAPI.sendMessage(msg);
      setMessages(prev => [...prev.filter(m => m.id !== userMsg.id), { ...userMsg, id: `user-${Date.now()}` }, res.message]);
    } catch (e) {
      setMessages(prev => [...prev, { id: `err-${Date.now()}`, role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', createdAt: new Date().toISOString() }]);
    }
    setLoading(false);
  };

  const clearChat = async () => {
    await chatAPI.clearHistory();
    setMessages([]);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-purple-500/20">
            <Bot size={20} className="text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">AI Stock Analyst</h1>
            <p className="text-xs text-text-muted">Ask about stocks, markets, investing, technical analysis</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted hover:text-red-400 hover:border-red-400/30 transition-colors flex items-center gap-1">
            <Trash2 size={12} /> Clear
          </button>
        )}
      </motion.div>

      {/* Messages */}
      <motion.div variants={item} className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
        {historyLoading ? (
          <div className="flex items-center justify-center h-full"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-purple-500/20">
              <Sparkles size={32} className="text-accent" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold text-text-primary">Welcome to AI Stock Analyst</h2>
              <p className="text-sm text-text-muted mt-1">Ask me anything about stocks, markets, and investing</p>
            </div>
            <div className="grid grid-cols-2 gap-2 max-w-lg">
              {quickPrompts.map(prompt => (
                <button key={prompt} onClick={() => sendMessage(prompt)}
                  className="rounded-xl border border-border p-3 text-left text-xs text-text-secondary hover:border-accent/30 hover:bg-white/5 transition-all">
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'assistant' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Bot size={14} className="text-accent" />
                </div>
              )}
              <div className={cn(
                'rounded-2xl px-4 py-3 max-w-[80%]',
                msg.role === 'user'
                  ? 'bg-accent text-white rounded-br-md'
                  : 'bg-white/[0.03] border border-border rounded-bl-md'
              )}>
                {msg.role === 'user' ? (
                  <p className="text-sm">{msg.content}</p>
                ) : (
                  <div className="space-y-0.5">{renderMarkdown(msg.content)}</div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                  <User size={14} className="text-accent" />
                </div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <Bot size={14} className="text-accent" />
            </div>
            <div className="rounded-2xl rounded-bl-md bg-white/[0.03] border border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-accent" />
                <span className="text-xs text-text-muted">Analyzing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </motion.div>

      {/* Input */}
      <motion.div variants={item} className="mt-4 flex items-center gap-3">
        <div className="relative flex-1">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about stocks, markets, investing..."
            className="w-full rounded-xl border border-border bg-white/[0.03] py-3 pl-4 pr-12 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent/30 transition-colors"
            disabled={loading}
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-accent p-2 text-white disabled:opacity-30 hover:bg-accent-hover transition-colors">
            <Send size={16} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
