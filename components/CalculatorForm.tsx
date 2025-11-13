import React, { useState, useEffect } from 'react';
import { calculateMonthlyContributionForGoal, calculatePeriodForGoal } from '../utils/calculator';

interface CalculatorFormProps {
  initialInvestment: number;
  setInitialInvestment: (value: number) => void;
  monthlyContribution: number;
  setMonthlyContribution: (value: number) => void;
  annualRate: number;
  setAnnualRate: (value: number) => void;
  periodYears: number;
  setPeriodYears: (value: number) => void;
}

const InputField: React.FC<{
  id: string;
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  readOnly?: boolean;
  isCalculated?: boolean;
}> = ({ id, label, value, onChange, prefix, suffix, step = 1, readOnly = false, isCalculated = false }) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="mb-2 font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <div className="relative">
      {prefix && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">{prefix}</span>}
      <input
        type="number"
        id={id}
        value={value}
        onChange={onChange}
        min="0"
        step={step}
        readOnly={readOnly}
        className={`w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${prefix ? 'pl-9' : 'pl-3'} ${suffix ? 'pr-12' : 'pr-3'} ${readOnly ? 'opacity-70 cursor-not-allowed' : ''} ${isCalculated ? 'border-blue-500 dark:border-blue-500' : ''}`}
      />
      {suffix && <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">{suffix}</span>}
    </div>
  </div>
);

const CalculatorForm: React.FC<CalculatorFormProps> = ({
  initialInvestment,
  setInitialInvestment,
  monthlyContribution,
  setMonthlyContribution,
  annualRate,
  setAnnualRate,
  periodYears,
  setPeriodYears,
}) => {
  const [mode, setMode] = useState<'simulation' | 'goal'>('simulation');
  const [goalTarget, setGoalTarget] = useState<'contribution' | 'period'>('contribution');
  const [goal, setGoal] = useState(1000000);
  const [calculatedResult, setCalculatedResult] = useState<string | null>(null);
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  useEffect(() => {
    if (mode === 'goal' && goalTarget === 'contribution' && periodYears > 0) {
      const result = calculateMonthlyContributionForGoal({ initialInvestment, annualRate, periodYears, goal });
      if (result !== null && result >= 0) {
        if (Math.abs(monthlyContribution - result) > 0.01) {
          setMonthlyContribution(result);
        }
        setCalculatedResult(`Para alcançar ${formatCurrency(goal)} em ${periodYears} anos, você precisa de um aporte mensal de ${formatCurrency(result)}.`);
      } else {
        setCalculatedResult('Não é possível alcançar a meta com os parâmetros atuais. Tente aumentar o prazo ou diminuir a meta.');
      }
    }
  }, [mode, goalTarget, goal, initialInvestment, annualRate, periodYears, monthlyContribution, setMonthlyContribution]);

  useEffect(() => {
    if (mode === 'goal' && goalTarget === 'period' && monthlyContribution > 0) {
      const result = calculatePeriodForGoal({ initialInvestment, annualRate, monthlyContribution, goal });
      if (result !== null && result >= 0) {
        if (Math.abs(periodYears - (result / 12)) > 0.01) {
          setPeriodYears(result / 12);
        }
        const years = Math.floor(result / 12);
        const months = Math.ceil(result % 12);
        setCalculatedResult(`Com aportes de ${formatCurrency(monthlyContribution)}, você alcançará ${formatCurrency(goal)} em ${years} anos e ${months} meses.`);
      } else {
        setCalculatedResult('Não é possível alcançar a meta com os parâmetros atuais. Tente aumentar o aporte ou diminuir a meta.');
      }
    }
  }, [mode, goalTarget, goal, initialInvestment, annualRate, monthlyContribution, periodYears, setPeriodYears]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex w-full rounded-lg bg-gray-200 dark:bg-gray-700 p-1 mb-6 text-sm font-semibold">
        <button onClick={() => setMode('simulation')} className={`w-1/2 p-2 rounded-md transition-colors ${mode === 'simulation' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}>Simulação</button>
        <button onClick={() => setMode('goal')} className={`w-1/2 p-2 rounded-md transition-colors ${mode === 'goal' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}>Planejar por Meta</button>
      </div>

      {mode === 'simulation' && (
        <>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Simulador de Investimentos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField id="initialInvestment" label="Valor Inicial" value={initialInvestment} onChange={(e) => setInitialInvestment(Number(e.target.value))} prefix="R$" step={100}/>
            <InputField id="monthlyContribution" label="Aporte Mensal" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} prefix="R$" step={50}/>
            <InputField id="annualRate" label="Taxa de Juros (anual)" value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value))} suffix="%" step={0.1}/>
            <InputField id="periodYears" label="Período (anos)" value={periodYears} onChange={(e) => setPeriodYears(Number(e.target.value))} suffix="anos"/>
          </div>
        </>
      )}

      {mode === 'goal' && (
        <>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Planejamento por Meta</h2>
          <div className="grid grid-cols-1 gap-6">
            <InputField id="goalAmount" label="Meta Financeira" value={goal} onChange={(e) => setGoal(Number(e.target.value))} prefix="R$" step={1000}/>
            <InputField id="initialInvestmentGoal" label="Valor Inicial" value={initialInvestment} onChange={(e) => setInitialInvestment(Number(e.target.value))} prefix="R$" step={100}/>
            <InputField id="annualRateGoal" label="Taxa de Juros (anual)" value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value))} suffix="%" step={0.1}/>
            
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="font-medium text-gray-700 dark:text-gray-300 mb-3">O que você quer calcular?</p>
                <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="goalTarget" checked={goalTarget === 'contribution'} onChange={() => setGoalTarget('contribution')} className="form-radio text-blue-600"/>
                        <span>Aporte Mensal</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="goalTarget" checked={goalTarget === 'period'} onChange={() => setGoalTarget('period')} className="form-radio text-blue-600"/>
                        <span>Período</span>
                    </label>
                </div>
            </div>

            {goalTarget === 'contribution' ? (
                <>
                    <InputField id="periodYearsGoal" label="Período para alcançar (anos)" value={periodYears} onChange={(e) => setPeriodYears(Number(e.target.value))} suffix="anos"/>
                    <InputField id="monthlyContributionGoal" label="Aporte Mensal Necessário" value={parseFloat(monthlyContribution.toFixed(2))} onChange={() => {}} prefix="R$" readOnly isCalculated/>
                </>
            ) : (
                 <>
                    <InputField id="monthlyContributionPeriod" label="Quanto pode investir por mês" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} prefix="R$" step={50}/>
                    <InputField id="periodYearsPeriod" label="Período Necessário (anos)" value={parseFloat(periodYears.toFixed(2))} onChange={() => {}} suffix="anos" readOnly isCalculated/>
                </>
            )}

            {calculatedResult && (
              <div className="p-4 text-center bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg">
                <p className="font-semibold text-blue-800 dark:text-blue-200">{calculatedResult}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CalculatorForm;
