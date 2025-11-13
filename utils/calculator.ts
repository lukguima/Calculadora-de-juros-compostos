import { CalculationParams, CalculationResult, ChartDataPoint, TableDataPoint, MonthlyContributionGoalParams, PeriodGoalParams } from '../types';

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
  
  // Use Math.round on totalMonths for the loop to handle float periodYears
  const roundedTotalMonths = Math.round(totalMonths);

  for (let month = 1; month <= roundedTotalMonths; month++) {
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

  if (roundedTotalMonths % 12 !== 0) {
      const year = periodYears;
      const totalInvested = initialInvestment + (monthlyContribution * roundedTotalMonths);
      const totalInterest = currentBalance - totalInvested;
       chartData.push({
        year: parseFloat(year.toFixed(2)),
        invested: parseFloat(totalInvested.toFixed(2)),
        total: parseFloat(currentBalance.toFixed(2)),
        interest: parseFloat(totalInterest.toFixed(2)),
      });
  }

  const finalAmount = currentBalance;
  const totalInvested = initialInvestment + (monthlyContribution * roundedTotalMonths);
  const totalInterest = finalAmount - totalInvested;

  return {
    finalAmount: parseFloat(finalAmount.toFixed(2)),
    totalInvested: parseFloat(totalInvested.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    chartData: chartData,
    tableData: tableData,
  };
};

export const calculateMonthlyContributionForGoal = (params: MonthlyContributionGoalParams): number | null => {
  const { initialInvestment, annualRate, periodYears, goal } = params;

  if (periodYears <= 0 || goal <= initialInvestment) return 0;

  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = periodYears * 12;

  if (monthlyRate === 0) {
    const requiredTotalContribution = goal - initialInvestment;
    return requiredTotalContribution / totalMonths;
  }
  
  const futureValueOfPV = initialInvestment * Math.pow(1 + monthlyRate, totalMonths);

  if (goal < futureValueOfPV) return 0;

  const numerator = goal - futureValueOfPV;
  const denominator = (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;

  if (denominator === 0) return null;

  return numerator / denominator;
};

export const calculatePeriodForGoal = (params: PeriodGoalParams): number | null => {
  const { initialInvestment, annualRate, monthlyContribution, goal } = params;
  
  if (goal <= initialInvestment) return 0;

  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) {
      if (monthlyContribution <= 0) return null;
      const requiredMonths = (goal - initialInvestment) / monthlyContribution;
      return requiredMonths;
  }

  const logNumerator = goal * monthlyRate + monthlyContribution;
  const logDenominator = initialInvestment * monthlyRate + monthlyContribution;
  
  if (logNumerator <= 0 || logDenominator <= 0 || logNumerator < logDenominator) {
    return null;
  }

  const numerator = Math.log(logNumerator / logDenominator);
  const denominator = Math.log(1 + monthlyRate);

  if (denominator === 0) return null;

  return numerator / denominator;
};
