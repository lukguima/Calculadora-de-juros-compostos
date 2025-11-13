import { CalculationParams, CalculationResult, ChartDataPoint, TableDataPoint } from './types';

export const calculateCompoundInterest = (params: CalculationParams): CalculationResult => {
  const { initialInvestment, monthlyContribution, annualRate, periodYears } = params;

  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = periodYears * 12;

  const chartData: ChartDataPoint[] = [];
  const tableData: TableDataPoint[] = [];
  let currentBalance = initialInvestment;

  if (totalMonths === 0) {
    const result = {
        finalAmount: initialInvestment,
        totalInvested: initialInvestment,
        totalInterest: 0,
        chartData: [{ year: 0, invested: initialInvestment, total: initialInvestment, interest: 0 }],
        tableData: [{ month: 0, invested: initialInvestment, interest: 0, total: initialInvestment }],
    };
    return result;
  }

  for (let month = 1; month <= totalMonths; month++) {
    currentBalance *= (1 + monthlyRate);
    currentBalance += monthlyContribution;
    
    const totalInvested = initialInvestment + (monthlyContribution * month);
    const totalInterest = currentBalance - totalInvested;

    tableData.push({
      month,
      invested: parseFloat(totalInvested.toFixed(2)),
      interest: parseFloat(totalInterest.toFixed(2)),
      total: parseFloat(currentBalance.toFixed(2)),
    });
    
    if (month % 12 === 0) {
      const year = month / 12;
      chartData.push({
        year: year,
        invested: parseFloat(totalInvested.toFixed(2)),
        total: parseFloat(currentBalance.toFixed(2)),
        interest: parseFloat(totalInterest.toFixed(2)),
      });
    }
  }

  if (totalMonths % 12 !== 0) {
      const year = periodYears;
      const totalInvested = initialInvestment + (monthlyContribution * totalMonths);
      const totalInterest = currentBalance - totalInvested;
       chartData.push({
        year: parseFloat(year.toFixed(2)),
        invested: parseFloat(totalInvested.toFixed(2)),
        total: parseFloat(currentBalance.toFixed(2)),
        interest: parseFloat(totalInterest.toFixed(2)),
      });
  }

  const finalAmount = currentBalance;
  const totalInvested = initialInvestment + monthlyContribution * totalMonths;
  const totalInterest = finalAmount - totalInvested;

  return {
    finalAmount: parseFloat(finalAmount.toFixed(2)),
    totalInvested: parseFloat(totalInvested.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    chartData: chartData,
    tableData: tableData,
  };
};
