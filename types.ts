// Fix: Add and export the ExtraContribution interface.
export interface ExtraContribution {
  month: number;
  amount: number;
}

export interface CalculationParams {
  initialInvestment: number;
  monthlyContribution: number;
  annualRate: number;
  periodYears: number;
}

export interface ChartDataPoint {
  year: number;
  invested: number;
  total: number;
  interest: number;
}

export interface TableDataPoint {
  month: number;
  invested: number;
  interest: number;
  total: number;
}

export interface CalculationResult {
  finalAmount: number;
  totalInvested: number;
  totalInterest: number;
  chartData: ChartDataPoint[];
  tableData: TableDataPoint[];
}

export interface GoalParams {
  initialInvestment: number;
  annualRate: number;
  goal: number;
}

export interface MonthlyContributionGoalParams extends GoalParams {
  periodYears: number;
}

export interface PeriodGoalParams extends GoalParams {
  monthlyContribution: number;
}
