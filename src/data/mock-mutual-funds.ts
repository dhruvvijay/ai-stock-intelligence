import type { MutualFund } from '@/types/portfolio';

export const mockMutualFunds: MutualFund[] = [
  {
    id: 'mf1', name: 'Axis Bluechip Fund', amc: 'Axis Mutual Fund', category: 'Equity', subCategory: 'Large Cap', nav: 52.34, navDate: '2026-07-08', expenseRatio: 0.49, fundSize: 42000, riskRating: 'Moderately High', rating: 5,
    returns: { oneMonth: 2.1, threeMonth: 5.8, sixMonth: 8.2, oneYear: 15.4, threeYear: 14.2, fiveYear: 16.8, tenYear: 15.1, sinceLaunch: 14.5 },
    fundManager: 'Shreyash Devalkar', benchmark: 'NIFTY 50 TRI', minSIP: 500, minLumpsum: 5000, exitLoad: '1% if redeemed within 1 year',
  },
  {
    id: 'mf2', name: 'Parag Parikh Flexi Cap Fund', amc: 'PPFAS Mutual Fund', category: 'Equity', subCategory: 'Flexi Cap', nav: 78.65, navDate: '2026-07-08', expenseRatio: 0.63, fundSize: 58000, riskRating: 'High', rating: 5,
    returns: { oneMonth: 1.8, threeMonth: 6.2, sixMonth: 9.5, oneYear: 18.2, threeYear: 17.8, fiveYear: 20.1, tenYear: 18.5, sinceLaunch: 19.2 },
    fundManager: 'Rajeev Thakkar', benchmark: 'NIFTY 500 TRI', minSIP: 1000, minLumpsum: 5000, exitLoad: '2% if redeemed within 365 days',
  },
  {
    id: 'mf3', name: 'HDFC Mid-Cap Opportunities Fund', amc: 'HDFC Mutual Fund', category: 'Equity', subCategory: 'Mid Cap', nav: 142.30, navDate: '2026-07-08', expenseRatio: 0.72, fundSize: 48000, riskRating: 'High', rating: 4,
    returns: { oneMonth: 3.5, threeMonth: 8.1, sixMonth: 12.4, oneYear: 22.6, threeYear: 21.3, fiveYear: 23.5, tenYear: 19.8, sinceLaunch: 18.2 },
    fundManager: 'Chirag Setalvad', benchmark: 'NIFTY Midcap 150 TRI', minSIP: 500, minLumpsum: 5000, exitLoad: '1% if redeemed within 1 year',
  },
  {
    id: 'mf4', name: 'SBI Small Cap Fund', amc: 'SBI Mutual Fund', category: 'Equity', subCategory: 'Small Cap', nav: 168.90, navDate: '2026-07-08', expenseRatio: 0.66, fundSize: 28000, riskRating: 'Very High', rating: 5,
    returns: { oneMonth: 4.2, threeMonth: 10.5, sixMonth: 15.8, oneYear: 28.4, threeYear: 25.6, fiveYear: 28.2, tenYear: 24.1, sinceLaunch: 22.5 },
    fundManager: 'R. Srinivasan', benchmark: 'S&P BSE 250 SmallCap TRI', minSIP: 500, minLumpsum: 5000, exitLoad: '1% if redeemed within 1 year',
  },
  {
    id: 'mf5', name: 'ICICI Pru Balanced Advantage Fund', amc: 'ICICI Prudential MF', category: 'Hybrid', subCategory: 'Balanced Advantage', nav: 62.15, navDate: '2026-07-08', expenseRatio: 0.82, fundSize: 56000, riskRating: 'Moderate', rating: 4,
    returns: { oneMonth: 1.2, threeMonth: 3.8, sixMonth: 5.9, oneYear: 11.2, threeYear: 10.8, fiveYear: 12.4, tenYear: 11.5, sinceLaunch: 10.8 },
    fundManager: 'Sankaran Naren', benchmark: 'NIFTY 50 Hybrid Composite Debt 50:50', minSIP: 500, minLumpsum: 5000, exitLoad: 'Nil',
  },
  {
    id: 'mf6', name: 'UTI Nifty 50 Index Fund', amc: 'UTI Mutual Fund', category: 'Equity', subCategory: 'Index Fund', nav: 156.80, navDate: '2026-07-08', expenseRatio: 0.18, fundSize: 18000, riskRating: 'Moderately High', rating: 4,
    returns: { oneMonth: 1.5, threeMonth: 5.2, sixMonth: 7.8, oneYear: 14.5, threeYear: 13.8, fiveYear: 15.2, tenYear: 13.9, sinceLaunch: 12.8 },
    fundManager: 'Sharwan Goyal', benchmark: 'NIFTY 50 TRI', minSIP: 500, minLumpsum: 1000, exitLoad: 'Nil',
  },
  {
    id: 'mf7', name: 'Mirae Asset Large Cap Fund', amc: 'Mirae Asset MF', category: 'Equity', subCategory: 'Large Cap', nav: 98.45, navDate: '2026-07-08', expenseRatio: 0.52, fundSize: 38000, riskRating: 'Moderately High', rating: 5,
    returns: { oneMonth: 2.3, threeMonth: 6.5, sixMonth: 9.8, oneYear: 17.2, threeYear: 15.8, fiveYear: 17.5, tenYear: 16.2, sinceLaunch: 15.8 },
    fundManager: 'Gaurav Misra', benchmark: 'NIFTY 100 TRI', minSIP: 500, minLumpsum: 5000, exitLoad: '1% if redeemed within 1 year',
  },
  {
    id: 'mf8', name: 'Kotak Debt Hybrid Fund', amc: 'Kotak Mutual Fund', category: 'Hybrid', subCategory: 'Conservative Hybrid', nav: 48.20, navDate: '2026-07-08', expenseRatio: 0.95, fundSize: 8500, riskRating: 'Low', rating: 3,
    returns: { oneMonth: 0.8, threeMonth: 2.1, sixMonth: 3.5, oneYear: 7.8, threeYear: 7.2, fiveYear: 8.5, tenYear: 8.1, sinceLaunch: 8.8 },
    fundManager: 'Deepak Agrawal', benchmark: 'CRISIL Hybrid 85+15 Conservative', minSIP: 500, minLumpsum: 5000, exitLoad: '1% if redeemed within 1 year',
  },
];
