import type { NewsArticle } from '@/types/ai';

export const mockNews: NewsArticle[] = [
  {
    id: '1', title: 'Reliance Industries Posts Record Q1 Profit, Revenue Up 18%', summary: 'Reliance Industries reported a record quarterly net profit of ₹19,299 crore, beating analyst estimates by 5%.', content: '', source: 'Economic Times', url: '#', publishedAt: new Date(Date.now() - 3600000).toISOString(), category: 'earnings', relatedStocks: ['RELIANCE'], aiSentiment: 'Positive', aiImpactScore: 8, aiAnalysis: 'Strong earnings beat driven by O2C and digital services segments. Retail margins expanded 120bps YoY. This is significantly bullish for the stock in the short to medium term.', imageUrl: undefined
  },
  {
    id: '2', title: 'RBI Holds Repo Rate at 6.0%, Signals Accommodative Stance', summary: 'The Reserve Bank of India maintained the repo rate at 6.0% while shifting to an accommodative monetary policy stance.', content: '', source: 'Mint', url: '#', publishedAt: new Date(Date.now() - 7200000).toISOString(), category: 'rbi', relatedStocks: ['HDFCBANK', 'ICICIBANK', 'SBIN'], aiSentiment: 'Positive', aiImpactScore: 7, aiAnalysis: 'Accommodative stance signals potential rate cuts ahead, which is positive for banking and real estate sectors. NIMs may compress slightly but loan growth should accelerate.', imageUrl: undefined
  },
  {
    id: '3', title: 'IT Sector Faces Headwinds as US Client Spending Decelerates', summary: 'Major IT companies report cautious discretionary spending from US clients amid macro uncertainty.', content: '', source: 'Business Standard', url: '#', publishedAt: new Date(Date.now() - 14400000).toISOString(), category: 'market', relatedStocks: ['TCS', 'INFY', 'WIPRO'], aiSentiment: 'Negative', aiImpactScore: -6, aiAnalysis: 'Reduced discretionary spending is a near-term headwind for IT companies. Deal pipeline remains strong but conversion cycles are elongating. Watch for guidance updates in upcoming earnings calls.', imageUrl: undefined
  },
  {
    id: '4', title: 'Tata Motors: JLR Reports 25% Surge in Global Deliveries', summary: 'Jaguar Land Rover delivered 110,000 vehicles in Q1, up 25% YoY, driven by strong Range Rover demand.', content: '', source: 'CNBC TV18', url: '#', publishedAt: new Date(Date.now() - 21600000).toISOString(), category: 'company', relatedStocks: ['TATAMOTORS'], aiSentiment: 'Positive', aiImpactScore: 9, aiAnalysis: 'Exceptional delivery numbers indicate strong premium demand. Order book remains robust at 168,000 units. This is strongly bullish for Tata Motors stock.', imageUrl: undefined
  },
  {
    id: '5', title: 'Global Markets Rally as US Fed Signals Rate Cut in September', summary: 'Wall Street indices hit record highs following dovish Fed commentary, boosting global risk appetite.', content: '', source: 'Reuters', url: '#', publishedAt: new Date(Date.now() - 28800000).toISOString(), category: 'global', relatedStocks: [], aiSentiment: 'Positive', aiImpactScore: 7, aiAnalysis: 'Global liquidity boost from anticipated rate cuts typically benefits emerging markets including India. FII flows may accelerate. Positive for broad market sentiment.', imageUrl: undefined
  },
  {
    id: '6', title: 'HDFC Bank Asset Quality Improves, GNPA Falls to 1.17%', summary: 'HDFC Bank reported improvement in asset quality with gross NPA ratio declining to 1.17% from 1.26%.', content: '', source: 'Financial Express', url: '#', publishedAt: new Date(Date.now() - 36000000).toISOString(), category: 'earnings', relatedStocks: ['HDFCBANK'], aiSentiment: 'Positive', aiImpactScore: 7, aiAnalysis: 'Improving asset quality coupled with healthy loan growth indicates strong fundamental position. The merger integration is progressing well, removing a key overhang.', imageUrl: undefined
  },
  {
    id: '7', title: 'Crude Oil Drops Below $70 on Demand Concerns', summary: 'Brent crude fell below $70/barrel as Chinese economic data disappointed and OPEC+ maintained output plans.', content: '', source: 'Bloomberg', url: '#', publishedAt: new Date(Date.now() - 43200000).toISOString(), category: 'global', relatedStocks: ['RELIANCE', 'ONGC'], aiSentiment: 'Neutral', aiImpactScore: 3, aiAnalysis: 'Lower crude is positive for India (net importer) and helps control inflation. Mixed impact on oil companies - refining margins may benefit but upstream valuations face pressure.', imageUrl: undefined
  },
  {
    id: '8', title: 'Adani Group Wins ₹25,000 Crore Green Energy Contract', summary: 'Adani Green Energy wins a major 5GW solar + battery storage project from NTPC.', content: '', source: 'Moneycontrol', url: '#', publishedAt: new Date(Date.now() - 50400000).toISOString(), category: 'company', relatedStocks: ['ADANIENT'], aiSentiment: 'Positive', aiImpactScore: 8, aiAnalysis: 'This contract significantly boosts Adani Green\'s capacity pipeline. The inclusion of battery storage indicates premium pricing. Positive for the entire Adani group valuation.', imageUrl: undefined
  },
];
