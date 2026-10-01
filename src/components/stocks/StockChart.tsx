'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createChart, ColorType, CandlestickSeries, LineSeries, AreaSeries, HistogramSeries } from 'lightweight-charts';
import { cn } from '@/lib/utils';
import type { StockPrice, ChartType, TimeFrame, IndicatorType } from '@/types/stock';

interface StockChartProps {
  data: StockPrice[];
  chartType: ChartType;
  indicators: IndicatorType[];
  height?: number;
}

function calculateSMA(data: StockPrice[], period: number): { time: string; value: number }[] {
  const result: { time: string; value: number }[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) sum += data[i - j].close;
    result.push({ time: data[i].time, value: parseFloat((sum / period).toFixed(2)) });
  }
  return result;
}

function calculateEMA(data: StockPrice[], period: number): { time: string; value: number }[] {
  const result: { time: string; value: number }[] = [];
  const multiplier = 2 / (period + 1);
  let ema = data.slice(0, period).reduce((s, d) => s + d.close, 0) / period;
  result.push({ time: data[period - 1].time, value: parseFloat(ema.toFixed(2)) });
  for (let i = period; i < data.length; i++) {
    ema = (data[i].close - ema) * multiplier + ema;
    result.push({ time: data[i].time, value: parseFloat(ema.toFixed(2)) });
  }
  return result;
}

function calculateRSI(data: StockPrice[], period = 14): { time: string; value: number }[] {
  const result: { time: string; value: number }[] = [];
  const changes = data.map((d, i) => (i === 0 ? 0 : d.close - data[i - 1].close));
  let avgGain = 0, avgLoss = 0;
  for (let i = 1; i <= period; i++) {
    if (changes[i] > 0) avgGain += changes[i];
    else avgLoss += Math.abs(changes[i]);
  }
  avgGain /= period;
  avgLoss /= period;
  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  result.push({ time: data[period].time, value: parseFloat((100 - 100 / (1 + rs)).toFixed(2)) });
  for (let i = period + 1; i < data.length; i++) {
    const change = changes[i];
    avgGain = (avgGain * (period - 1) + (change > 0 ? change : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (change < 0 ? Math.abs(change) : 0)) / period;
    const newRs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    result.push({ time: data[i].time, value: parseFloat((100 - 100 / (1 + newRs)).toFixed(2)) });
  }
  return result;
}

function calculateBollingerBands(data: StockPrice[], period = 20, multiplier = 2): { time: string; upper: number; middle: number; lower: number }[] {
  const result: { time: string; upper: number; middle: number; lower: number }[] = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const mean = slice.reduce((s, d) => s + d.close, 0) / period;
    const variance = slice.reduce((s, d) => s + Math.pow(d.close - mean, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    result.push({
      time: data[i].time,
      upper: parseFloat((mean + multiplier * stdDev).toFixed(2)),
      middle: parseFloat(mean.toFixed(2)),
      lower: parseFloat((mean - multiplier * stdDev).toFixed(2)),
    });
  }
  return result;
}

export default function StockChart({ data, chartType, indicators, height = 500 }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const [crosshairData, setCrosshairData] = useState<{ time: string; open: number; high: number; low: number; close: number; volume: number } | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    // Clear previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
        fontFamily: 'Inter, sans-serif',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(99, 102, 241, 0.04)' },
        horzLines: { color: 'rgba(99, 102, 241, 0.04)' },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: 'rgba(99, 102, 241, 0.3)', width: 1, style: 2, labelBackgroundColor: '#6366f1' },
        horzLine: { color: 'rgba(99, 102, 241, 0.3)', width: 1, style: 2, labelBackgroundColor: '#6366f1' },
      },
      rightPriceScale: {
        borderColor: 'rgba(99, 102, 241, 0.1)',
        scaleMargins: { top: 0.1, bottom: 0.2 },
      },
      timeScale: {
        borderColor: 'rgba(99, 102, 241, 0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Main series
    if (chartType === 'candlestick') {
      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderUpColor: '#22c55e',
        borderDownColor: '#ef4444',
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      });
      candleSeries.setData(data.map(d => ({ time: d.time, open: d.open, high: d.high, low: d.low, close: d.close })));
    } else if (chartType === 'line') {
      const lineSeries = chart.addSeries(LineSeries, {
        color: '#818cf8',
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        crosshairMarkerBackgroundColor: '#818cf8',
      });
      lineSeries.setData(data.map(d => ({ time: d.time, value: d.close })));
    } else {
      const areaSeries = chart.addSeries(AreaSeries, {
        lineColor: '#818cf8',
        topColor: 'rgba(129, 140, 248, 0.3)',
        bottomColor: 'rgba(129, 140, 248, 0.02)',
        lineWidth: 2,
      });
      areaSeries.setData(data.map(d => ({ time: d.time, value: d.close })));
    }

    // Volume
    if (indicators.includes('Volume')) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
      });
      chart.priceScale('volume').applyOptions({
        scaleMargins: { top: 0.85, bottom: 0 },
      });
      volumeSeries.setData(
        data.map(d => ({
          time: d.time,
          value: d.volume,
          color: d.close >= d.open ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
        }))
      );
    }

    // SMA
    if (indicators.includes('SMA')) {
      const sma20 = calculateSMA(data, 20);
      const sma50 = calculateSMA(data, 50);
      const sma20Series = chart.addSeries(LineSeries, { color: '#f59e0b', lineWidth: 1, title: 'SMA 20' });
      sma20Series.setData(sma20);
      if (sma50.length > 0) {
        const sma50Series = chart.addSeries(LineSeries, { color: '#ec4899', lineWidth: 1, title: 'SMA 50' });
        sma50Series.setData(sma50);
      }
    }

    // EMA
    if (indicators.includes('EMA')) {
      const ema12 = calculateEMA(data, 12);
      const ema26 = calculateEMA(data, 26);
      const ema12Series = chart.addSeries(LineSeries, { color: '#06b6d4', lineWidth: 1, title: 'EMA 12' });
      ema12Series.setData(ema12);
      if (ema26.length > 0) {
        const ema26Series = chart.addSeries(LineSeries, { color: '#a855f7', lineWidth: 1, title: 'EMA 26' });
        ema26Series.setData(ema26);
      }
    }

    // Bollinger Bands
    if (indicators.includes('BB')) {
      const bb = calculateBollingerBands(data);
      const upperSeries = chart.addSeries(LineSeries, { color: 'rgba(99,102,241,0.4)', lineWidth: 1, title: 'BB Upper' });
      upperSeries.setData(bb.map(b => ({ time: b.time, value: b.upper })));
      const middleSeries = chart.addSeries(LineSeries, { color: 'rgba(99,102,241,0.6)', lineWidth: 1, lineStyle: 2, title: 'BB Middle' });
      middleSeries.setData(bb.map(b => ({ time: b.time, value: b.middle })));
      const lowerSeries = chart.addSeries(LineSeries, { color: 'rgba(99,102,241,0.4)', lineWidth: 1, title: 'BB Lower' });
      lowerSeries.setData(bb.map(b => ({ time: b.time, value: b.lower })));
    }

    // Crosshair move
    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.point) {
        setCrosshairData(null);
        return;
      }
      const idx = data.findIndex(d => d.time === param.time);
      if (idx >= 0) {
        setCrosshairData(data[idx]);
      }
    });

    // Resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    chart.timeScale().fitContent();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartRef.current = null;
    };
  }, [data, chartType, indicators, height]);

  return (
    <div className="relative">
      {/* Crosshair Data Overlay */}
      {crosshairData && (
        <div className="absolute left-4 top-4 z-10 flex items-center gap-4 rounded-lg bg-bg-card/90 px-3 py-1.5 text-[11px] backdrop-blur-sm border border-border">
          <span className="text-text-muted">O: <span className="text-text-primary font-medium">{crosshairData.open.toFixed(2)}</span></span>
          <span className="text-text-muted">H: <span className="text-emerald-400 font-medium">{crosshairData.high.toFixed(2)}</span></span>
          <span className="text-text-muted">L: <span className="text-red-400 font-medium">{crosshairData.low.toFixed(2)}</span></span>
          <span className="text-text-muted">C: <span className={cn('font-medium', crosshairData.close >= crosshairData.open ? 'text-emerald-400' : 'text-red-400')}>{crosshairData.close.toFixed(2)}</span></span>
          <span className="text-text-muted">V: <span className="text-text-primary font-medium">{(crosshairData.volume / 1e6).toFixed(1)}M</span></span>
        </div>
      )}
      <div ref={chartContainerRef} className="chart-container" />
    </div>
  );
}
