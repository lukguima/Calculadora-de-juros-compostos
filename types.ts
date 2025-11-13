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
