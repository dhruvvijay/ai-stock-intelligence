import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "INR"): string {
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

export function formatNumber(value: number): string {
  if (Math.abs(value) >= 1e7) {
    return `${(value / 1e7).toFixed(2)} Cr`;
  }
  if (Math.abs(value) >= 1e5) {
    return `${(value / 1e5).toFixed(2)} L`;
  }
  if (Math.abs(value) >= 1e3) {
    return `${(value / 1e3).toFixed(2)} K`;
  }
  return value.toFixed(2);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `₹${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `₹${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e7) return `₹${(value / 1e7).toFixed(2)}Cr`;
  if (value >= 1e5) return `₹${(value / 1e5).toFixed(2)}L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export function getChangeColor(value: number): string {
  if (value > 0) return "text-emerald-400";
  if (value < 0) return "text-red-400";
  return "text-slate-400";
}

export function getChangeBg(value: number): string {
  if (value > 0) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (value < 0) return "bg-red-500/10 text-red-400 border-red-500/20";
  return "bg-slate-500/10 text-slate-400 border-slate-500/20";
}

export function getSentimentColor(sentiment: string): string {
  switch (sentiment) {
    case "Bullish":
    case "Positive":
      return "text-emerald-400";
    case "Bearish":
    case "Negative":
      return "text-red-400";
    default:
      return "text-amber-400";
  }
}

export function timeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return past.toLocaleDateString("en-IN");
}

export function generateSparklineData(length = 20, base = 100): number[] {
  const data: number[] = [base];
  for (let i = 1; i < length; i++) {
    const change = (Math.random() - 0.48) * 3;
    data.push(data[i - 1] + change);
  }
  return data;
}
