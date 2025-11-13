import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { CalculationResult } from '../types';
import InfoIcon from './icons/InfoIcon';

interface ResultsDisplayProps {
  result: CalculationResult | null;
}

const StatCard: React.FC<{ title: string; value: string; color: string; tooltip: string }> = ({ title, value, color, tooltip }) => (
  <div className="relative group bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <InfoIcon className="text-gray-400" />
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
    <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
      {tooltip}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
        <p className="font-bold text-gray-800 dark:text-gray-200">{`Ano ${label}`}</p>
        <p className="text-indigo-500">{`Total Acumulado: ${formatCurrency(payload[0].value)}`}</p>
        <p className="text-green-500">{`Total Investido: ${formatCurrency(payload[1].value)}`}</p>
        <p className="text-blue-500">{`Total em Juros: ${formatCurrency(payload[0].payload.interest)}`}</p>
      </div>
    );
  }
  return null;
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  if (!result || result.finalAmount === 0 && result.totalInvested === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Aguardando simulação...</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Preencha os campos e adicione seus aportes para ver a mágica dos juros compostos.</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Resultados da Simulação</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard 
          title="Valor Final Bruto" 
          value={formatCurrency(result.finalAmount)} 
          color="text-indigo-500" 
          tooltip="Montante total ao final do período." 
        />
        <StatCard 
          title="Total Investido" 
          value={formatCurrency(result.totalInvested)} 
          color="text-green-500"
          tooltip="Soma do valor inicial com todos os aportes mensais e extras."
        />
        <StatCard 
          title="Total em Juros" 
          value={formatCurrency(result.totalInterest)} 
          color="text-blue-500"
          tooltip="O ganho real do seu investimento, gerado pelos juros."
        />
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={result.chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
            <XAxis dataKey="year" unit="a" stroke="rgb(156 163 175)" />
            <YAxis 
                stroke="rgb(156 163 175)"
                tickFormatter={(value) => `R$${(Number(value) / 1000).toLocaleString('pt-BR')}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="total" name="Total Acumulado" stroke="#8884d8" fillOpacity={1} fill="url(#colorTotal)" />
            <Area type="monotone" dataKey="invested" name="Total Investido" stroke="#82ca9d" fillOpacity={1} fill="url(#colorInvested)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Evolução Mês a Mês</h3>
        <div className="max-h-96 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 relative">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mês</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Investido</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total em Juros</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Acumulado</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {result.tableData.map((row) => (
                <tr key={row.month} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{row.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">{formatCurrency(row.invested)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">{formatCurrency(row.interest)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600 dark:text-indigo-400">{formatCurrency(row.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;