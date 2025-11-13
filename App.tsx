import React, { useState, useEffect, useMemo } from 'react';
import CalculatorForm from './components/CalculatorForm';
import ResultsDisplay from './components/ResultsDisplay';
import { CalculationResult } from './types';
import { calculateCompoundInterest } from './utils/calculator';

const App: React.FC = () => {
  const [initialInvestment, setInitialInvestment] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRate, setAnnualRate] = useState(10);
  const [periodYears, setPeriodYears] = useState(10);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculationParams = useMemo(() => ({
    initialInvestment: isNaN(initialInvestment) ? 0 : initialInvestment,
    monthlyContribution: isNaN(monthlyContribution) ? 0 : monthlyContribution,
    annualRate: isNaN(annualRate) ? 0 : annualRate,
    periodYears: isNaN(periodYears) ? 0 : periodYears,
  }), [initialInvestment, monthlyContribution, annualRate, periodYears]);


  useEffect(() => {
    const newResult = calculateCompoundInterest(calculationParams);
    setResult(newResult);
  }, [calculationParams]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            Calculadora de Juros Compostos
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Descubra o poder dos juros compostos e visualize o crescimento do seu patrimônio ao longo do tempo.
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <CalculatorForm
            initialInvestment={initialInvestment}
            setInitialInvestment={setInitialInvestment}
            monthlyContribution={monthlyContribution}
            setMonthlyContribution={setMonthlyContribution}
            annualRate={annualRate}
            setAnnualRate={setAnnualRate}
            periodYears={periodYears}
            setPeriodYears={setPeriodYears}
          />
          <ResultsDisplay result={result} />
        </div>
        
        <footer className="text-center mt-12 text-gray-500 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} - Simulação de Juros Compostos. Todos os direitos reservados.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;