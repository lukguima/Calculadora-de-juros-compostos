import React from 'react';

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
}> = ({ id, label, value, onChange, prefix, suffix, step = 1 }) => (
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
        className={`w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${prefix ? 'pl-9' : 'pl-3'} ${suffix ? 'pr-12' : 'pr-3'}`}
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
  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Simulador de Investimentos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          id="initialInvestment"
          label="Valor Inicial"
          value={initialInvestment}
          onChange={(e) => setInitialInvestment(Number(e.target.value))}
          prefix="R$"
          step={100}
        />
        <InputField
          id="monthlyContribution"
          label="Aporte Mensal"
          value={monthlyContribution}
          onChange={(e) => setMonthlyContribution(Number(e.target.value))}
          prefix="R$"
          step={50}
        />
        <InputField
          id="annualRate"
          label="Taxa de Juros (anual)"
          value={annualRate}
          onChange={(e) => setAnnualRate(Number(e.target.value))}
          suffix="%"
          step={0.1}
        />
        <InputField
          id="periodYears"
          label="Período (anos)"
          value={periodYears}
          onChange={(e) => setPeriodYears(Number(e.target.value))}
          suffix="anos"
        />
      </div>
    </div>
  );
};

export default CalculatorForm;