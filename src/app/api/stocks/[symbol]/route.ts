// ═══ STOCK DETAIL API: Full stock data + analysis ═══
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ── Technical Analysis Engine ──
function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1] || 0;
  const slice = prices.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

function calculateEMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1] || 0;
  const k = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  return ema;
}

function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;
  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }
  const recentChanges = changes.slice(-period);
  const gains = recentChanges.filter(c => c > 0);
  const losses = recentChanges.filter(c => c < 0).map(c => Math.abs(c));
  const avgGain = gains.length > 0 ? gains.reduce((a, b) => a + b, 0) / period : 0;
  const avgLoss = losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / period : 0.001;
  const rs = avgGain / avgLoss;
  return +(100 - 100 / (1 + rs)).toFixed(2);
}

function calculateMACD(prices: number[]) {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macdLine = +(ema12 - ema26).toFixed(2);
  // Signal line approximation
  const signal = +(macdLine * 0.8).toFixed(2);
  return { macdLine, signal, histogram: +(macdLine - signal).toFixed(2) };
}

function detectCandlestickPatterns(ohlcv: Array<{ open: number; high: number; low: number; close: number }>) {
  if (ohlcv.length < 3) return [];
  const patterns: Array<{ name: string; type: string; description: string; reliability: string; tradeSetup: string }> = [];
  const last = ohlcv[ohlcv.length - 1];
  const prev = ohlcv[ohlcv.length - 2];
  const prev2 = ohlcv[ohlcv.length - 3];
  
  const bodySize = Math.abs(last.close - last.open);
  const upperShadow = last.high - Math.max(last.open, last.close);
  const lowerShadow = Math.min(last.open, last.close) - last.low;
  const range = last.high - last.low;

  // Hammer
  if (lowerShadow > bodySize * 2 && upperShadow < bodySize * 0.3 && range > 0) {
    patterns.push({ name: 'Hammer', type: 'bullish', description: 'Long lower shadow shows buyers stepping in at lows. Potential reversal from downtrend.', reliability: 'Moderate (60%)', tradeSetup: 'Buy above hammer high with stop loss below hammer low. Target: 1.5x risk-reward.' });
  }

  // Shooting Star
  if (upperShadow > bodySize * 2 && lowerShadow < bodySize * 0.3 && range > 0) {
    patterns.push({ name: 'Shooting Star', type: 'bearish', description: 'Long upper shadow shows sellers pushing price down from highs.', reliability: 'Moderate (59%)', tradeSetup: 'Sell below shooting star low. Stop loss above high. Target: Previous support.' });
  }

  // Doji
  if (bodySize < range * 0.1 && range > 0) {
    patterns.push({ name: 'Doji', type: 'neutral', description: 'Open and close nearly equal — market indecision. Watch for directional breakout.', reliability: 'Low (50%)', tradeSetup: 'Wait for confirmation candle. Trade in direction of breakout.' });
  }

  // Bullish Engulfing
  if (prev.close < prev.open && last.close > last.open && last.close > prev.open && last.open < prev.close) {
    patterns.push({ name: 'Bullish Engulfing', type: 'bullish', description: 'Current bullish candle completely engulfs previous bearish candle. Strong buying signal.', reliability: 'High (63%)', tradeSetup: 'Buy at close or next open. Stop loss below engulfing candle low. Target: Next resistance.' });
  }

  // Bearish Engulfing
  if (prev.close > prev.open && last.close < last.open && last.open > prev.close && last.close < prev.open) {
    patterns.push({ name: 'Bearish Engulfing', type: 'bearish', description: 'Current bearish candle engulfs previous bullish candle. Strong selling signal.', reliability: 'High (79%)', tradeSetup: 'Sell at close or next open. Stop loss above engulfing high. Target: Next support.' });
  }

  // Morning Star (3-candle)
  if (prev2.close < prev2.open && Math.abs(prev.close - prev.open) < (prev2.high - prev2.low) * 0.3 && last.close > last.open && last.close > (prev2.open + prev2.close) / 2) {
    patterns.push({ name: 'Morning Star', type: 'bullish', description: 'Three-candle reversal pattern. Bearish candle, small body, bullish candle closing above midpoint.', reliability: 'Very High (78%)', tradeSetup: 'Buy at close of 3rd candle. Stop loss below star (2nd candle) low. Target: 2x risk.' });
  }

  // Evening Star (3-candle)
  if (prev2.close > prev2.open && Math.abs(prev.close - prev.open) < (prev2.high - prev2.low) * 0.3 && last.close < last.open && last.close < (prev2.open + prev2.close) / 2) {
    patterns.push({ name: 'Evening Star', type: 'bearish', description: 'Three-candle reversal pattern at top. Bullish candle, small body, bearish candle.', reliability: 'Very High (72%)', tradeSetup: 'Sell at close of 3rd candle. Stop loss above star high. Target: Previous support.' });
  }

  // Inside Bar
  if (last.high < prev.high && last.low > prev.low) {
    patterns.push({ name: 'Inside Bar', type: 'neutral', description: 'Current candle entirely within previous candle range. Consolidation before breakout.', reliability: 'Moderate (55%)', tradeSetup: 'Buy above mother bar high or sell below mother bar low. Stop loss at opposite end.' });
  }

  return patterns;
}

// ── AI Recommendation Engine ──
function generateRecommendation(stock: Record<string, unknown>, rsi: number, macd: { macdLine: number; histogram: number }, sma20: number, sma50: number, sma200: number) {
  const price = stock.currentPrice as number;
  let score = 50; // Neutral start
  const reasons: string[] = [];

  // RSI Analysis
  if (rsi < 30) { score += 15; reasons.push(`RSI at ${rsi} — Oversold territory, potential bounce`); }
  else if (rsi < 40) { score += 8; reasons.push(`RSI at ${rsi} — Approaching oversold, accumulation zone`); }
  else if (rsi > 70) { score -= 15; reasons.push(`RSI at ${rsi} — Overbought, potential pullback`); }
  else if (rsi > 60) { score -= 5; reasons.push(`RSI at ${rsi} — Strong momentum but extended`); }
  else { reasons.push(`RSI at ${rsi} — Neutral momentum zone`); }

  // MACD Analysis
  if (macd.macdLine > 0 && macd.histogram > 0) { score += 10; reasons.push('MACD bullish crossover with rising histogram'); }
  else if (macd.macdLine < 0 && macd.histogram < 0) { score -= 10; reasons.push('MACD bearish with falling histogram'); }
  else if (macd.histogram > 0) { score += 5; reasons.push('MACD histogram turning positive — momentum improving'); }

  // Moving Average Analysis
  if (price > sma20 && price > sma50 && price > sma200) { score += 12; reasons.push('Price above all key moving averages — strong uptrend'); }
  else if (price > sma20 && price > sma50) { score += 8; reasons.push('Price above SMA20 and SMA50 — medium-term uptrend'); }
  else if (price < sma20 && price < sma50 && price < sma200) { score -= 12; reasons.push('Price below all moving averages — downtrend'); }
  else if (price < sma20 && price < sma50) { score -= 8; reasons.push('Price below SMA20 and SMA50 — weakening trend'); }

  // Golden/Death Cross
  if (sma50 > sma200) { score += 5; reasons.push('Golden Cross active (SMA50 > SMA200) — bullish long-term'); }
  else if (sma50 < sma200) { score -= 5; reasons.push('Death Cross active (SMA50 < SMA200) — bearish long-term'); }

  // Fundamental Analysis
  const pe = stock.pe as number;
  const roe = stock.roe as number;
  const debtToEquity = stock.debtToEquity as number;
  
  if (pe < 15 && pe > 0) { score += 8; reasons.push(`Low P/E ratio of ${pe} — potentially undervalued`); }
  else if (pe > 50) { score -= 5; reasons.push(`High P/E ratio of ${pe} — expensive valuation`); }
  
  if (roe > 20) { score += 5; reasons.push(`Strong ROE of ${roe}% — efficient capital utilization`); }
  if (debtToEquity < 0.5) { score += 3; reasons.push(`Low debt-to-equity of ${debtToEquity} — strong balance sheet`); }
  else if (debtToEquity > 2) { score -= 5; reasons.push(`High debt-to-equity of ${debtToEquity} — leverage risk`); }

  // Clamp score
  score = Math.max(5, Math.min(95, score));

  const recommendation = score >= 70 ? 'BUY' : score >= 55 ? 'HOLD' : 'SELL';
  const riskLevel = score >= 70 ? 'Low' : score >= 40 ? 'Medium' : 'High';
  
  // Price targets
  const targetUpside = price * (1 + (score / 100) * 0.15);
  const stopLoss = price * (1 - (1 - score / 100) * 0.08);

  return {
    recommendation,
    confidence: score,
    riskLevel,
    entryPrice: price,
    targetPrice: +targetUpside.toFixed(2),
    stopLoss: +stopLoss.toFixed(2),
    riskRewardRatio: +((targetUpside - price) / (price - stopLoss)).toFixed(2),
    reasons,
    bullScenario: { probability: Math.min(score + 10, 90), target: +(price * 1.2).toFixed(2), reason: 'Sustained buying with positive momentum and strong fundamentals' },
    bearScenario: { probability: Math.min(100 - score + 10, 90), target: +(price * 0.85).toFixed(2), reason: 'Profit booking, sector rotation, or broader market weakness' },
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;

    const stock = await prisma.stock.findUnique({
      where: { symbol: symbol.toUpperCase() },
      include: {
        quarterlyResults: { orderBy: { quarter: 'desc' } },
      },
    });

    if (!stock) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
    }

    // Get price history
    const priceHistory = await prisma.priceHistory.findMany({
      where: { stockId: stock.id, timeframe: '1D' },
      orderBy: { date: 'asc' },
      take: 365,
    });

    // Calculate technical indicators
    const closePrices = priceHistory.map(p => p.close);
    const rsi = calculateRSI(closePrices);
    const macd = calculateMACD(closePrices);
    const sma20 = calculateSMA(closePrices, 20);
    const sma50 = calculateSMA(closePrices, 50);
    const sma200 = calculateSMA(closePrices, 200);
    const ema12 = calculateEMA(closePrices, 12);
    const ema26 = calculateEMA(closePrices, 26);

    // Bollinger Bands
    const sma20Arr = closePrices.slice(-20);
    const stdDev = Math.sqrt(sma20Arr.reduce((sum, p) => sum + Math.pow(p - sma20, 2), 0) / 20);
    const bollingerUpper = +(sma20 + 2 * stdDev).toFixed(2);
    const bollingerLower = +(sma20 - 2 * stdDev).toFixed(2);

    // Detect candlestick patterns
    const recentOHLCV = priceHistory.slice(-5);
    const patterns = detectCandlestickPatterns(recentOHLCV);

    // Generate AI recommendation
    const recommendation = generateRecommendation(stock as unknown as Record<string, unknown>, rsi, macd, sma20, sma50, sma200);

    // Get peer stocks
    const peers = await prisma.stock.findMany({
      where: { sector: stock.sector, symbol: { not: stock.symbol } },
      take: 5,
      orderBy: { marketCap: 'desc' },
      select: {
        symbol: true, name: true, currentPrice: true, changePercent: true,
        marketCap: true, pe: true, roe: true,
      },
    });

    // Get related news
    const relatedNews = await prisma.newsArticle.findMany({
      where: {
        relatedStocks: { some: { stockId: stock.id } },
      },
      take: 5,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true, title: true, summary: true, source: true,
        publishedAt: true, aiSentiment: true, aiImpactScore: true,
      },
    });

    return NextResponse.json({
      stock,
      technicals: {
        rsi,
        macd,
        sma: { sma20: +sma20.toFixed(2), sma50: +sma50.toFixed(2), sma200: +sma200.toFixed(2) },
        ema: { ema12: +ema12.toFixed(2), ema26: +ema26.toFixed(2) },
        bollingerBands: { upper: bollingerUpper, middle: +sma20.toFixed(2), lower: bollingerLower },
        patterns,
      },
      recommendation,
      peers,
      relatedNews,
      priceHistory: priceHistory.map(p => ({
        date: p.date, open: p.open, high: p.high, low: p.low, close: p.close, volume: p.volume,
      })),
    });
  } catch (error) {
    console.error('Stock detail API error:', error);
    return NextResponse.json({ error: 'Failed to fetch stock' }, { status: 500 });
  }
}
