// ═══ PRODUCTION SEED DATA: 500+ Mutual Funds ═══

export interface SeedMutualFund {
  name: string; amc: string; category: string; subCategory: string;
  nav: number; aum: number; expenseRatio: number; exitLoad: string;
  riskRating: string; rating: number; fundManager: string; benchmark: string;
  minSIP: number; minLumpsum: number; return1Y: number; return3Y: number;
  return5Y: number; return10Y: number; returnSI: number;
  topHoldings: { name: string; weight: number }[];
  sectorAllocation: { sector: string; weight: number }[];
}

const amcs = ['SBI Mutual Fund', 'HDFC Mutual Fund', 'ICICI Prudential Mutual Fund', 'Axis Mutual Fund', 'Kotak Mahindra Mutual Fund', 'Nippon India Mutual Fund', 'Aditya Birla Sun Life Mutual Fund', 'UTI Mutual Fund', 'DSP Mutual Fund', 'Tata Mutual Fund', 'Mirae Asset Mutual Fund', 'Parag Parikh Mutual Fund', 'Canara Robeco Mutual Fund', 'Motilal Oswal Mutual Fund', 'Quant Mutual Fund', 'PGIM India Mutual Fund', 'Edelweiss Mutual Fund', 'Bandhan Mutual Fund', 'Invesco India Mutual Fund', 'Franklin Templeton Mutual Fund'];

const fundManagers = ['R. Srinivasan', 'Prashant Jain', 'Sankaran Naren', 'Jinesh Gopani', 'Harsha Upadhyaya', 'Manish Gunwani', 'Ankit Agarwal', 'Neelesh Surana', 'Vinit Sambre', 'Rahul Baijal', 'Gopal Agrawal', 'Rajeev Thakkar', 'Shridatta Bhandwaldar', 'Niket Shah', 'Sandeep Tandon', 'Aniruddha Naha', 'Radhika Gupta', 'Mahendra Kumar Jajoo', 'Pranav Gokhale', 'Ajay Tyagi'];

function rf(min: number, max: number, dec: number = 2): number { return +((Math.random() * (max - min) + min).toFixed(dec)); }
function ri(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }

// Core funds (real-inspired)
const coreFunds: Partial<SeedMutualFund>[] = [
  // Large Cap
  { name: 'SBI Blue Chip Fund', amc: 'SBI Mutual Fund', category: 'Equity', subCategory: 'Large Cap', nav: 82.45, aum: 45000, return1Y: 18.5, return3Y: 15.2, return5Y: 16.8, return10Y: 14.2, riskRating: 'Moderately High', rating: 5 },
  { name: 'Axis Blue Chip Fund', amc: 'Axis Mutual Fund', category: 'Equity', subCategory: 'Large Cap', nav: 58.92, aum: 35000, return1Y: 16.8, return3Y: 13.5, return5Y: 15.2, return10Y: 13.8, riskRating: 'Moderately High', rating: 5 },
  { name: 'Mirae Asset Large Cap Fund', amc: 'Mirae Asset Mutual Fund', category: 'Equity', subCategory: 'Large Cap', nav: 95.67, aum: 38000, return1Y: 19.2, return3Y: 16.1, return5Y: 17.5, return10Y: 15.8, riskRating: 'Moderately High', rating: 5 },
  { name: 'ICICI Prudential Blue Chip Fund', amc: 'ICICI Prudential Mutual Fund', category: 'Equity', subCategory: 'Large Cap', nav: 78.34, aum: 42000, return1Y: 20.5, return3Y: 17.8, return5Y: 16.2, return10Y: 14.5, riskRating: 'Moderately High', rating: 4 },
  { name: 'HDFC Top 100 Fund', amc: 'HDFC Mutual Fund', category: 'Equity', subCategory: 'Large Cap', nav: 102.56, aum: 28000, return1Y: 22.1, return3Y: 18.5, return5Y: 15.8, return10Y: 13.2, riskRating: 'Moderately High', rating: 4 },
  { name: 'Kotak Bluechip Fund', amc: 'Kotak Mahindra Mutual Fund', category: 'Equity', subCategory: 'Large Cap', nav: 52.34, aum: 8500, return1Y: 17.2, return3Y: 14.8, return5Y: 15.5, return10Y: 13.5, riskRating: 'Moderately High', rating: 4 },
  { name: 'Canara Robeco Bluechip Equity Fund', amc: 'Canara Robeco Mutual Fund', category: 'Equity', subCategory: 'Large Cap', nav: 56.78, aum: 12000, return1Y: 18.8, return3Y: 15.8, return5Y: 16.2, return10Y: 14.8, riskRating: 'Moderately High', rating: 5 },
  // Mid Cap
  { name: 'HDFC Mid-Cap Opportunities Fund', amc: 'HDFC Mutual Fund', category: 'Equity', subCategory: 'Mid Cap', nav: 128.45, aum: 52000, return1Y: 28.5, return3Y: 22.8, return5Y: 20.5, return10Y: 18.2, riskRating: 'High', rating: 5 },
  { name: 'Kotak Emerging Equity Fund', amc: 'Kotak Mahindra Mutual Fund', category: 'Equity', subCategory: 'Mid Cap', nav: 98.67, aum: 38000, return1Y: 32.5, return3Y: 25.8, return5Y: 22.5, return10Y: 19.8, riskRating: 'High', rating: 5 },
  { name: 'Axis Midcap Fund', amc: 'Axis Mutual Fund', category: 'Equity', subCategory: 'Mid Cap', nav: 85.23, aum: 25000, return1Y: 22.8, return3Y: 18.5, return5Y: 19.8, return10Y: 17.5, riskRating: 'High', rating: 4 },
  { name: 'DSP Midcap Fund', amc: 'DSP Mutual Fund', category: 'Equity', subCategory: 'Mid Cap', nav: 112.56, aum: 18000, return1Y: 26.5, return3Y: 20.2, return5Y: 18.8, return10Y: 16.5, riskRating: 'High', rating: 4 },
  { name: 'SBI Magnum Midcap Fund', amc: 'SBI Mutual Fund', category: 'Equity', subCategory: 'Mid Cap', nav: 198.45, aum: 20000, return1Y: 30.2, return3Y: 24.5, return5Y: 21.8, return10Y: 18.5, riskRating: 'High', rating: 5 },
  // Small Cap
  { name: 'SBI Small Cap Fund', amc: 'SBI Mutual Fund', category: 'Equity', subCategory: 'Small Cap', nav: 148.92, aum: 28000, return1Y: 35.8, return3Y: 28.5, return5Y: 25.2, return10Y: 22.8, riskRating: 'Very High', rating: 5 },
  { name: 'Nippon India Small Cap Fund', amc: 'Nippon India Mutual Fund', category: 'Equity', subCategory: 'Small Cap', nav: 165.34, aum: 42000, return1Y: 38.5, return3Y: 32.8, return5Y: 28.5, return10Y: 24.2, riskRating: 'Very High', rating: 5 },
  { name: 'Axis Small Cap Fund', amc: 'Axis Mutual Fund', category: 'Equity', subCategory: 'Small Cap', nav: 92.67, aum: 18000, return1Y: 28.2, return3Y: 22.5, return5Y: 24.8, return10Y: 20.5, riskRating: 'Very High', rating: 4 },
  { name: 'Quant Small Cap Fund', amc: 'Quant Mutual Fund', category: 'Equity', subCategory: 'Small Cap', nav: 232.56, aum: 22000, return1Y: 42.5, return3Y: 38.8, return5Y: 32.5, return10Y: 28.2, riskRating: 'Very High', rating: 5 },
  { name: 'HDFC Small Cap Fund', amc: 'HDFC Mutual Fund', category: 'Equity', subCategory: 'Small Cap', nav: 112.34, aum: 26000, return1Y: 32.8, return3Y: 26.5, return5Y: 23.8, return10Y: 20.5, riskRating: 'Very High', rating: 4 },
  // Index Funds
  { name: 'UTI Nifty 50 Index Fund', amc: 'UTI Mutual Fund', category: 'Equity', subCategory: 'Index Fund', nav: 145.67, aum: 18000, return1Y: 15.8, return3Y: 14.2, return5Y: 14.8, return10Y: 12.5, riskRating: 'Moderately High', rating: 4 },
  { name: 'HDFC Index Fund Nifty 50', amc: 'HDFC Mutual Fund', category: 'Equity', subCategory: 'Index Fund', nav: 198.23, aum: 15000, return1Y: 15.5, return3Y: 14.0, return5Y: 14.5, return10Y: 12.2, riskRating: 'Moderately High', rating: 4 },
  { name: 'Motilal Oswal Nifty 500 Index Fund', amc: 'Motilal Oswal Mutual Fund', category: 'Equity', subCategory: 'Index Fund', nav: 22.45, aum: 5000, return1Y: 18.5, return3Y: 15.8, return5Y: 0, return10Y: 0, riskRating: 'Moderately High', rating: 3 },
  { name: 'Nippon India Nifty Next 50 Junior BeES', amc: 'Nippon India Mutual Fund', category: 'Equity', subCategory: 'Index Fund', nav: 68.92, aum: 8000, return1Y: 22.5, return3Y: 18.2, return5Y: 16.8, return10Y: 14.5, riskRating: 'Moderately High', rating: 4 },
  // ELSS
  { name: 'Axis Long Term Equity Fund (ELSS)', amc: 'Axis Mutual Fund', category: 'Equity', subCategory: 'ELSS', nav: 78.45, aum: 35000, return1Y: 18.2, return3Y: 14.5, return5Y: 15.8, return10Y: 14.2, riskRating: 'Moderately High', rating: 4 },
  { name: 'Mirae Asset Tax Saver Fund', amc: 'Mirae Asset Mutual Fund', category: 'Equity', subCategory: 'ELSS', nav: 42.67, aum: 22000, return1Y: 20.5, return3Y: 17.2, return5Y: 18.5, return10Y: 0, riskRating: 'Moderately High', rating: 5 },
  { name: 'SBI Long Term Equity Fund', amc: 'SBI Mutual Fund', category: 'Equity', subCategory: 'ELSS', nav: 345.23, aum: 15000, return1Y: 16.8, return3Y: 13.5, return5Y: 14.2, return10Y: 12.8, riskRating: 'Moderately High', rating: 3 },
  { name: 'Quant Tax Plan', amc: 'Quant Mutual Fund', category: 'Equity', subCategory: 'ELSS', nav: 325.56, aum: 8000, return1Y: 35.2, return3Y: 32.8, return5Y: 28.5, return10Y: 22.5, riskRating: 'Moderately High', rating: 5 },
  { name: 'HDFC TaxSaver Fund', amc: 'HDFC Mutual Fund', category: 'Equity', subCategory: 'ELSS', nav: 1045.67, aum: 14000, return1Y: 22.5, return3Y: 19.8, return5Y: 16.5, return10Y: 14.8, riskRating: 'Moderately High', rating: 4 },
  // Hybrid
  { name: 'ICICI Prudential Equity & Debt Fund', amc: 'ICICI Prudential Mutual Fund', category: 'Hybrid', subCategory: 'Aggressive Hybrid', nav: 285.45, aum: 35000, return1Y: 18.5, return3Y: 15.2, return5Y: 14.8, return10Y: 13.5, riskRating: 'Moderately High', rating: 4 },
  { name: 'HDFC Balanced Advantage Fund', amc: 'HDFC Mutual Fund', category: 'Hybrid', subCategory: 'Balanced Advantage', nav: 345.67, aum: 65000, return1Y: 16.2, return3Y: 14.8, return5Y: 13.5, return10Y: 12.8, riskRating: 'Moderate', rating: 4 },
  { name: 'SBI Equity Hybrid Fund', amc: 'SBI Mutual Fund', category: 'Hybrid', subCategory: 'Aggressive Hybrid', nav: 225.34, aum: 42000, return1Y: 15.8, return3Y: 13.5, return5Y: 13.2, return10Y: 12.5, riskRating: 'Moderately High', rating: 4 },
  { name: 'Parag Parikh Flexi Cap Fund', amc: 'Parag Parikh Mutual Fund', category: 'Equity', subCategory: 'Flexi Cap', nav: 68.45, aum: 52000, return1Y: 22.8, return3Y: 20.5, return5Y: 22.8, return10Y: 18.5, riskRating: 'Moderately High', rating: 5 },
  // Debt
  { name: 'HDFC Short Term Debt Fund', amc: 'HDFC Mutual Fund', category: 'Debt', subCategory: 'Short Duration', nav: 28.45, aum: 18000, return1Y: 7.8, return3Y: 6.5, return5Y: 7.2, return10Y: 7.8, riskRating: 'Moderate', rating: 4 },
  { name: 'ICICI Prudential Corporate Bond Fund', amc: 'ICICI Prudential Mutual Fund', category: 'Debt', subCategory: 'Corporate Bond', nav: 25.67, aum: 28000, return1Y: 7.5, return3Y: 6.8, return5Y: 7.5, return10Y: 8.2, riskRating: 'Moderate', rating: 4 },
  { name: 'SBI Magnum Gilt Fund', amc: 'SBI Mutual Fund', category: 'Debt', subCategory: 'Gilt', nav: 58.34, aum: 8000, return1Y: 8.2, return3Y: 5.8, return5Y: 7.8, return10Y: 8.5, riskRating: 'Moderate', rating: 3 },
  { name: 'Axis Banking & PSU Debt Fund', amc: 'Axis Mutual Fund', category: 'Debt', subCategory: 'Banking & PSU', nav: 22.89, aum: 15000, return1Y: 7.2, return3Y: 6.2, return5Y: 7.0, return10Y: 7.5, riskRating: 'Low to Moderate', rating: 4 },
  // Liquid
  { name: 'HDFC Liquid Fund', amc: 'HDFC Mutual Fund', category: 'Debt', subCategory: 'Liquid', nav: 4856.78, aum: 62000, return1Y: 6.8, return3Y: 5.5, return5Y: 5.8, return10Y: 6.5, riskRating: 'Low', rating: 4, exitLoad: 'Graded exit load up to 7 days' },
  { name: 'SBI Liquid Fund', amc: 'SBI Mutual Fund', category: 'Debt', subCategory: 'Liquid', nav: 3567.89, aum: 72000, return1Y: 6.5, return3Y: 5.2, return5Y: 5.5, return10Y: 6.2, riskRating: 'Low', rating: 4, exitLoad: 'Graded exit load up to 7 days' },
  // Gold
  { name: 'SBI Gold Fund', amc: 'SBI Mutual Fund', category: 'Commodity', subCategory: 'Gold', nav: 18.45, aum: 3000, return1Y: 12.5, return3Y: 15.8, return5Y: 12.2, return10Y: 9.8, riskRating: 'Moderately High', rating: 3 },
  { name: 'HDFC Gold Fund', amc: 'HDFC Mutual Fund', category: 'Commodity', subCategory: 'Gold', nav: 19.67, aum: 2500, return1Y: 12.2, return3Y: 15.5, return5Y: 11.8, return10Y: 9.5, riskRating: 'Moderately High', rating: 3 },
  // International
  { name: 'Motilal Oswal Nasdaq 100 ETF', amc: 'Motilal Oswal Mutual Fund', category: 'Equity', subCategory: 'International', nav: 185.67, aum: 8000, return1Y: 25.5, return3Y: 12.8, return5Y: 22.5, return10Y: 18.8, riskRating: 'Very High', rating: 4 },
  { name: 'Franklin India Feeder US Opportunities Fund', amc: 'Franklin Templeton Mutual Fund', category: 'Equity', subCategory: 'International', nav: 78.45, aum: 4500, return1Y: 18.2, return3Y: 8.5, return5Y: 15.8, return10Y: 14.2, riskRating: 'Very High', rating: 3 },
  // Multi Cap / Flexi Cap
  { name: 'HDFC Flexi Cap Fund', amc: 'HDFC Mutual Fund', category: 'Equity', subCategory: 'Flexi Cap', nav: 398.56, aum: 45000, return1Y: 20.5, return3Y: 18.8, return5Y: 16.2, return10Y: 14.5, riskRating: 'Moderately High', rating: 4 },
  { name: 'SBI Flexicap Fund', amc: 'SBI Mutual Fund', category: 'Equity', subCategory: 'Flexi Cap', nav: 85.34, aum: 22000, return1Y: 18.8, return3Y: 15.2, return5Y: 15.8, return10Y: 13.8, riskRating: 'Moderately High', rating: 4 },
  { name: 'Kotak Flexicap Fund', amc: 'Kotak Mahindra Mutual Fund', category: 'Equity', subCategory: 'Flexi Cap', nav: 62.45, aum: 42000, return1Y: 17.5, return3Y: 14.8, return5Y: 14.5, return10Y: 13.2, riskRating: 'Moderately High', rating: 4 },
  { name: 'Nippon India Multi Cap Fund', amc: 'Nippon India Mutual Fund', category: 'Equity', subCategory: 'Multi Cap', nav: 245.67, aum: 32000, return1Y: 28.5, return3Y: 25.2, return5Y: 18.8, return10Y: 15.5, riskRating: 'High', rating: 5 },
  // Sector / Thematic
  { name: 'ICICI Prudential Technology Fund', amc: 'ICICI Prudential Mutual Fund', category: 'Equity', subCategory: 'Sectoral - IT', nav: 185.34, aum: 12000, return1Y: 15.8, return3Y: 8.5, return5Y: 22.5, return10Y: 18.2, riskRating: 'Very High', rating: 3 },
  { name: 'SBI Healthcare Opportunities Fund', amc: 'SBI Mutual Fund', category: 'Equity', subCategory: 'Sectoral - Pharma', nav: 345.67, aum: 3500, return1Y: 32.5, return3Y: 18.2, return5Y: 20.5, return10Y: 15.8, riskRating: 'Very High', rating: 4 },
  { name: 'ICICI Prudential Banking & Financial Services Fund', amc: 'ICICI Prudential Mutual Fund', category: 'Equity', subCategory: 'Sectoral - Banking', nav: 112.34, aum: 8500, return1Y: 18.5, return3Y: 15.8, return5Y: 12.2, return10Y: 14.5, riskRating: 'Very High', rating: 3 },
  { name: 'Nippon India Power & Infra Fund', amc: 'Nippon India Mutual Fund', category: 'Equity', subCategory: 'Sectoral - Infrastructure', nav: 285.45, aum: 6000, return1Y: 42.5, return3Y: 35.8, return5Y: 22.5, return10Y: 15.2, riskRating: 'Very High', rating: 4 },
  { name: 'Tata Digital India Fund', amc: 'Tata Mutual Fund', category: 'Equity', subCategory: 'Sectoral - IT', nav: 42.56, aum: 9500, return1Y: 12.5, return3Y: 6.8, return5Y: 20.5, return10Y: 0, riskRating: 'Very High', rating: 3 },
  { name: 'Quant Infrastructure Fund', amc: 'Quant Mutual Fund', category: 'Equity', subCategory: 'Sectoral - Infrastructure', nav: 38.45, aum: 3200, return1Y: 48.5, return3Y: 42.8, return5Y: 28.5, return10Y: 18.2, riskRating: 'Very High', rating: 5 },
];

// Generate additional funds to reach 500+
const subCategories = ['Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'Multi Cap', 'ELSS', 'Index Fund', 'Aggressive Hybrid', 'Balanced Advantage', 'Sectoral - IT', 'Sectoral - Banking', 'Sectoral - Pharma', 'Sectoral - Infrastructure', 'Short Duration', 'Corporate Bond', 'Gilt', 'Liquid', 'Gold', 'International', 'Value', 'Contra', 'Focused', 'Dividend Yield', 'Large & Mid Cap'];
const riskRatings = ['Low', 'Low to Moderate', 'Moderate', 'Moderately High', 'High', 'Very High'];

function generateAdditionalFunds(count: number): SeedMutualFund[] {
  const result: SeedMutualFund[] = [];
  for (let i = 0; i < count; i++) {
    const amc = amcs[i % amcs.length];
    const sub = subCategories[i % subCategories.length];
    const isEquity = ['Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'Multi Cap', 'ELSS', 'Index Fund', 'Value', 'Contra', 'Focused', 'Dividend Yield', 'Large & Mid Cap'].includes(sub);
    const isDebt = ['Short Duration', 'Corporate Bond', 'Gilt', 'Liquid'].includes(sub);
    const category = sub.startsWith('Sectoral') ? 'Equity' : sub === 'Aggressive Hybrid' || sub === 'Balanced Advantage' ? 'Hybrid' : sub === 'Gold' ? 'Commodity' : sub === 'International' ? 'Equity' : isDebt ? 'Debt' : 'Equity';
    const riskIdx = isDebt ? ri(0, 2) : isEquity ? ri(3, 5) : ri(2, 4);
    const baseReturn = isDebt ? rf(5, 9, 1) : isEquity ? rf(10, 35, 1) : rf(8, 20, 1);

    result.push({
      name: `${amc.split(' ')[0]} ${sub.replace('Sectoral - ', '')} Fund ${['Growth', 'Direct Growth', 'Regular Growth'][i % 3]}`,
      amc,
      category,
      subCategory: sub,
      nav: rf(8, 500, 2),
      aum: ri(500, 80000),
      expenseRatio: rf(0.1, 2.5, 2),
      exitLoad: isDebt && sub === 'Liquid' ? 'Graded exit load up to 7 days' : ri(0, 1) ? '1% if redeemed within 1 year' : 'Nil',
      riskRating: riskRatings[riskIdx],
      rating: ri(2, 5),
      fundManager: fundManagers[i % fundManagers.length],
      benchmark: isEquity ? ['Nifty 50 TRI', 'Nifty Midcap 150 TRI', 'Nifty Smallcap 250 TRI', 'Nifty 500 TRI', 'BSE 500 TRI'][i % 5] : 'CRISIL Composite Bond Index',
      minSIP: [100, 500, 500, 1000, 1000][i % 5],
      minLumpsum: [500, 1000, 5000, 5000, 10000][i % 5],
      return1Y: +baseReturn.toFixed(1),
      return3Y: +(baseReturn * rf(0.6, 0.95, 2)).toFixed(1),
      return5Y: +(baseReturn * rf(0.5, 0.9, 2)).toFixed(1),
      return10Y: +(baseReturn * rf(0.4, 0.85, 2)).toFixed(1),
      returnSI: +(baseReturn * rf(0.5, 0.95, 2)).toFixed(1),
      topHoldings: [
        { name: 'Reliance Industries', weight: rf(3, 10, 1) },
        { name: 'HDFC Bank', weight: rf(2, 8, 1) },
        { name: 'ICICI Bank', weight: rf(2, 7, 1) },
        { name: 'Infosys', weight: rf(2, 6, 1) },
        { name: 'TCS', weight: rf(1, 5, 1) },
      ],
      sectorAllocation: [
        { sector: 'Banking', weight: rf(15, 35, 1) },
        { sector: 'IT', weight: rf(10, 25, 1) },
        { sector: 'Energy', weight: rf(5, 15, 1) },
        { sector: 'FMCG', weight: rf(3, 12, 1) },
        { sector: 'Auto', weight: rf(3, 10, 1) },
        { sector: 'Others', weight: rf(10, 25, 1) },
      ],
    });
  }
  return result;
}

function buildFullFund(partial: Partial<SeedMutualFund>): SeedMutualFund {
  return {
    name: partial.name || 'Fund',
    amc: partial.amc || amcs[0],
    category: partial.category || 'Equity',
    subCategory: partial.subCategory || 'Large Cap',
    nav: partial.nav || rf(10, 200, 2),
    aum: partial.aum || ri(1000, 50000),
    expenseRatio: partial.expenseRatio || rf(0.2, 2.2, 2),
    exitLoad: partial.exitLoad || '1% if redeemed within 1 year',
    riskRating: partial.riskRating || 'Moderately High',
    rating: partial.rating || ri(3, 5),
    fundManager: partial.fundManager || fundManagers[Math.floor(Math.random() * fundManagers.length)],
    benchmark: partial.benchmark || 'Nifty 50 TRI',
    minSIP: partial.minSIP || 500,
    minLumpsum: partial.minLumpsum || 5000,
    return1Y: partial.return1Y || rf(8, 25, 1),
    return3Y: partial.return3Y || rf(6, 20, 1),
    return5Y: partial.return5Y || rf(8, 22, 1),
    return10Y: partial.return10Y || rf(8, 18, 1),
    returnSI: partial.returnSI || rf(10, 20, 1),
    topHoldings: partial.topHoldings || [
      { name: 'Reliance', weight: rf(3, 10, 1) },
      { name: 'HDFC Bank', weight: rf(2, 8, 1) },
      { name: 'Infosys', weight: rf(2, 6, 1) },
    ],
    sectorAllocation: partial.sectorAllocation || [
      { sector: 'Banking', weight: rf(15, 30, 1) },
      { sector: 'IT', weight: rf(10, 25, 1) },
      { sector: 'Others', weight: rf(20, 40, 1) },
    ],
  };
}

export function generateAllMutualFunds(): SeedMutualFund[] {
  const coreBuilt = coreFunds.map(f => buildFullFund(f));
  const additional = generateAdditionalFunds(460);
  return [...coreBuilt, ...additional];
}
