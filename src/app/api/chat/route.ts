// ═══ AI CHATBOT API ═══
// Rule-based intelligent responses + ready for OpenAI integration
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const USER_ID = 'default-user';

interface ChatContext {
  stocks: Array<{ symbol: string; name: string; currentPrice: number; changePercent: number; pe: number; roe: number; sector: string; marketCap: number }>;
  query: string;
}

async function findRelevantStocks(query: string): Promise<ChatContext['stocks']> {
  const keywords = query.toUpperCase().split(/\s+/);
  const stocks = await prisma.stock.findMany({
    where: {
      OR: [
        ...keywords.map(k => ({ symbol: { contains: k } })),
        ...keywords.map(k => ({ name: { contains: k } })),
        ...keywords.map(k => ({ sector: { contains: k } })),
      ],
    },
    take: 5,
    select: { symbol: true, name: true, currentPrice: true, changePercent: true, pe: true, roe: true, sector: true, marketCap: true },
  });
  return stocks;
}

function generateAIResponse(query: string, stocks: ChatContext['stocks']): string {
  const q = query.toLowerCase();

  // Stock-specific analysis
  if (stocks.length > 0 && (q.includes('analys') || q.includes('review') || q.includes('how is') || q.includes('tell me about') || q.includes('what about'))) {
    const s = stocks[0];
    const trend = s.changePercent >= 0 ? 'positive' : 'negative';
    const valuation = s.pe < 15 ? 'undervalued' : s.pe < 25 ? 'fairly valued' : s.pe < 40 ? 'premium valuation' : 'expensive';
    return `## ${s.name} (${s.symbol}) Analysis\n\n**Current Price:** ₹${s.currentPrice.toLocaleString()}\n**Day Change:** ${s.changePercent >= 0 ? '+' : ''}${s.changePercent.toFixed(2)}%\n**Market Cap:** ₹${(s.marketCap).toLocaleString()} Cr\n**P/E Ratio:** ${s.pe} (${valuation})\n**ROE:** ${s.roe}%\n**Sector:** ${s.sector}\n\n### Technical Outlook\nThe stock is showing ${trend} momentum today. ${s.pe < 20 ? 'The low P/E suggests potential value opportunity.' : s.pe > 40 ? 'The high P/E indicates growth expectations are already priced in.' : 'Valuation is in line with sector averages.'}\n\n### Key Points\n- ${s.roe > 20 ? '✅ Strong ROE indicates efficient capital utilization' : '⚠️ ROE could be improved'}\n- ${s.changePercent > 2 ? '📈 Strong positive momentum today' : s.changePercent < -2 ? '📉 Significant selling pressure' : '➡️ Trading in a narrow range'}\n- ${s.marketCap > 200000 ? '🏛️ Large cap — lower risk, stable returns' : s.marketCap > 50000 ? '📊 Mid cap — moderate risk-reward' : '🚀 Small cap — higher growth potential with higher risk'}\n\n> 💡 *This is AI-generated analysis for educational purposes. Always do your own research before investing.*`;
  }

  // Portfolio advice
  if (q.includes('portfolio') || q.includes('diversif') || q.includes('allocat')) {
    return `## Portfolio Strategy Recommendation\n\nBased on modern portfolio theory, here's a suggested allocation:\n\n### Asset Allocation\n| Asset Class | Allocation | Purpose |\n|------------|-----------|--------|\n| Large Cap Equity | 40% | Stability & growth |\n| Mid Cap Equity | 20% | Higher growth |\n| Small Cap Equity | 10% | Alpha generation |\n| Debt/Bonds | 20% | Capital protection |\n| Gold | 5% | Hedge against inflation |\n| Cash | 5% | Opportunities |\n\n### Sector Diversification\nDon't exceed 25% in any single sector. Recommended mix:\n- Banking & Finance: 20-25%\n- IT: 15-20%\n- FMCG: 10-15%\n- Pharma: 10%\n- Auto: 8-10%\n- Others: 15-20%\n\n### Rules of Thumb\n1. **Equity % = 100 - Your Age** (aggressive) or **80 - Your Age** (conservative)\n2. Never put more than 5% in a single stock\n3. Rebalance quarterly\n4. Keep 6 months expenses as emergency fund\n\n> 💡 *Customize based on your risk appetite, goals, and time horizon.*`;
  }

  // SIP advice
  if (q.includes('sip') || q.includes('systematic')) {
    return `## SIP (Systematic Investment Plan) Guide\n\n### What is SIP?\nSIP lets you invest a fixed amount regularly (monthly/weekly) in mutual funds. It leverages **rupee cost averaging** — buying more units when prices are low.\n\n### SIP Calculator\n| Monthly SIP | Duration | Expected Return | Corpus |\n|------------|----------|----------------|--------|\n| ₹5,000 | 10 years | 12% | ₹11.6 Lakhs |\n| ₹10,000 | 15 years | 12% | ₹50.5 Lakhs |\n| ₹15,000 | 20 years | 12% | ₹1.49 Crore |\n| ₹25,000 | 25 years | 12% | ₹4.7 Crore |\n\n### Top SIP Recommendations\n1. **Large Cap**: Mirae Asset Large Cap Fund (5★)\n2. **Mid Cap**: HDFC Mid-Cap Opportunities Fund (5★)\n3. **Small Cap**: SBI Small Cap Fund (5★)\n4. **ELSS (Tax Save)**: Mirae Asset Tax Saver Fund (5★)\n5. **Index**: UTI Nifty 50 Index Fund\n\n### SIP Best Practices\n- Start early — ₹5,000/month from age 25 beats ₹15,000/month from age 35\n- Step up SIP by 10% annually\n- Don't stop SIP during market crashes\n- Use SIP date between 1st-10th of month`;
  }

  // Technical analysis
  if (q.includes('rsi') || q.includes('macd') || q.includes('moving average') || q.includes('technical') || q.includes('indicator')) {
    return `## Technical Analysis Quick Reference\n\n### RSI (Relative Strength Index)\n- **> 70**: Overbought — potential reversal down\n- **< 30**: Oversold — potential reversal up\n- **Divergence**: Most powerful signal\n- Default period: 14\n\n### MACD\n- **Bullish**: MACD crosses above Signal Line\n- **Bearish**: MACD crosses below Signal Line\n- **Histogram**: Momentum strength\n- Settings: 12, 26, 9\n\n### Moving Averages\n- **Golden Cross**: 50 SMA > 200 SMA = BUY\n- **Death Cross**: 50 SMA < 200 SMA = SELL\n- Use EMA for short-term, SMA for long-term\n\n### Bollinger Bands\n- **Squeeze**: Low volatility, breakout coming\n- **Walking the band**: Strong trend\n- **Mean reversion**: Bounce off bands\n\n### Support & Resistance\n- More touches = stronger level\n- Broken support becomes resistance\n- Higher timeframe levels are stronger\n\n> 💡 *Always use multiple indicators for confirmation. No single indicator is 100% accurate.*`;
  }

  // Candlestick patterns
  if (q.includes('candlestick') || q.includes('pattern') || q.includes('hammer') || q.includes('doji') || q.includes('engulfing')) {
    return `## Candlestick Pattern Cheat Sheet\n\n### Bullish Reversal Patterns 🟢\n| Pattern | Reliability | Signal |\n|---------|------------|--------|\n| Hammer | 60% | Long lower shadow at bottom |\n| Morning Star | 78% | 3-candle pattern at bottom |\n| Bullish Engulfing | 63% | Large green engulfs previous red |\n| Three White Soldiers | 82% | 3 consecutive strong green candles |\n| Piercing Pattern | 64% | Green candle pierces prior red body |\n\n### Bearish Reversal Patterns 🔴\n| Pattern | Reliability | Signal |\n|---------|------------|--------|\n| Shooting Star | 59% | Long upper shadow at top |\n| Evening Star | 72% | 3-candle pattern at top |\n| Bearish Engulfing | 79% | Large red engulfs previous green |\n| Three Black Crows | 78% | 3 consecutive strong red candles |\n| Dark Cloud Cover | 60% | Red candle covers prior green |\n\n### Continuation/Neutral\n- **Doji**: Indecision, wait for next candle\n- **Inside Bar**: Consolidation before breakout\n- **Spinning Top**: Weak conviction\n\n> ⚠️ *Always confirm with volume and surrounding context.*`;
  }

  // Risk analysis
  if (q.includes('risk') || q.includes('safe') || q.includes('danger') || q.includes('careful')) {
    return `## Risk Management Guide\n\n### The 1% Rule\nNever risk more than 1% of your capital on a single trade.\n\n### Position Sizing Formula\n\`\`\`\nPosition Size = (Capital × Risk%) / (Entry - Stop Loss)\n\nExample: ₹5,00,000 × 1% / ₹20 risk = 250 shares\n\`\`\`\n\n### Risk-Reward Ratio\n- Minimum 1:2 (risk ₹1 to make ₹2)\n- Even 40% win rate is profitable at 1:2\n- Best traders aim for 1:3+\n\n### Portfolio Risk Rules\n- Max 5% in single stock\n- Max 25% in single sector\n- 15-25 stocks for diversification\n- 10-20% cash reserve\n- Use stop losses on every trade\n\n### Risk Categories\n| Risk Type | Mitigation |\n|-----------|------------|\n| Market Risk | Diversification |\n| Stock Risk | Position sizing |\n| Sector Risk | Sector limits |\n| Liquidity Risk | Avoid illiquid stocks |\n| Currency Risk | Hedging |\n\n> 🛡️ *Capital preservation is more important than capital appreciation.*`;
  }

  // Market overview
  if (q.includes('market') || q.includes('nifty') || q.includes('sensex') || q.includes('today')) {
    return `## Market Overview\n\n### Key Indices Today\n| Index | Level | Change |\n|-------|-------|--------|\n| NIFTY 50 | 24,150 | +0.85% |\n| SENSEX | 79,800 | +0.92% |\n| BANK NIFTY | 52,345 | +1.15% |\n| NIFTY IT | 38,450 | -0.45% |\n| INDIA VIX | 13.2 | -5.2% |\n\n### Market Breadth\n- Advances: 1,245 | Declines: 812 | Unchanged: 156\n- FII: Net buyers ₹2,450 Cr\n- DII: Net buyers ₹1,820 Cr\n\n### Sector Performance\n- 🟢 Banking (+1.5%), Auto (+1.2%), Pharma (+0.8%)\n- 🔴 IT (-0.5%), Metals (-0.3%)\n\n### Key Events This Week\n- RBI Policy: Thursday\n- US FOMC Minutes: Wednesday\n- Q3 Results: TCS, Infosys, HDFC Bank\n\n> 📊 *Data is indicative. Check live market for real-time updates.*`;
  }

  // Mutual funds
  if (q.includes('mutual fund') || q.includes('best fund') || q.includes('which fund')) {
    return `## Top Mutual Fund Recommendations\n\n### By Category\n\n#### Large Cap (Lower Risk)\n1. **Mirae Asset Large Cap Fund** — 5★, 17.5% 5Y return\n2. **SBI Blue Chip Fund** — 5★, 16.8% 5Y return\n3. **Canara Robeco Bluechip** — 5★, 16.2% 5Y return\n\n#### Mid Cap (Moderate Risk)\n1. **HDFC Mid-Cap Opportunities** — 5★, 20.5% 5Y return\n2. **Kotak Emerging Equity** — 5★, 22.5% 5Y return\n\n#### Small Cap (Higher Risk)\n1. **SBI Small Cap Fund** — 5★, 25.2% 5Y return\n2. **Nippon India Small Cap** — 5★, 28.5% 5Y return\n\n#### Tax Saving (ELSS)\n1. **Mirae Asset Tax Saver** — 5★, 18.5% 5Y return\n2. **Quant Tax Plan** — 5★, 28.5% 5Y return\n\n### How to Choose\n- Check 5Y and 10Y returns (not just 1Y)\n- Compare expense ratio (lower is better)\n- Verify fund manager track record\n- Always choose **Direct Growth** plan\n- Consistency > high returns`;
  }

  // Default intelligent response
  return `## How Can I Help?\n\nI'm your AI stock market assistant. Here's what I can help with:\n\n### 📈 Stock Analysis\nAsk me about any stock: *"Analyze Reliance"*, *"How is TCS?"*, *"Tell me about HDFC Bank"*\n\n### 📊 Technical Analysis\n*"Explain RSI"*, *"What is MACD?"*, *"How to read candlestick patterns?"*\n\n### 💼 Portfolio Advice\n*"Help me build a portfolio"*, *"How to diversify?"*, *"Asset allocation strategy"*\n\n### 🏦 Mutual Funds\n*"Best large cap funds?"*, *"SIP recommendations"*, *"Which ELSS to invest?"*\n\n### 🛡️ Risk Management\n*"How to manage risk?"*, *"Position sizing"*, *"Stop loss strategies"*\n\n### 📰 Market Updates\n*"Market overview"*, *"Nifty analysis"*, *"Sector performance"*\n\n### 📚 Learning\n*"Explain support and resistance"*, *"What is PE ratio?"*, *"Swing trading guide"*\n\n> Just type your question and I'll provide detailed, actionable insights!`;
}

export async function GET() {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { userId: USER_ID },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Chat GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

    // Save user message
    await prisma.chatMessage.create({
      data: { userId: USER_ID, role: 'user', content: message },
    });

    // Find relevant stocks
    const stocks = await findRelevantStocks(message);

    // Generate response
    const response = generateAIResponse(message, stocks);

    // Save assistant response
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        userId: USER_ID,
        role: 'assistant',
        content: response,
        metadata: JSON.stringify({ relatedStocks: stocks.map(s => s.symbol) }),
      },
    });

    return NextResponse.json({
      message: assistantMessage,
      relatedStocks: stocks,
    });
  } catch (error) {
    console.error('Chat POST error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await prisma.chatMessage.deleteMany({ where: { userId: USER_ID } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Chat DELETE error:', error);
    return NextResponse.json({ error: 'Failed to clear chat' }, { status: 500 });
  }
}
