import React, { useState } from 'react';
import { ExtraContribution } from '../types';

interface ExtraContributionsProps {
    contributions: ExtraContribution[];
    onAdd: (contribution: ExtraContribution) => void;
    onRemove: (index: number) => void;
    maxMonths: number;
}

const ExtraContributions: React.FC<ExtraContributionsProps> = ({ contributions, onAdd, onRemove, maxMonths }) => {
    const [month, setMonth] = useState('1');
    const [amount, setAmount] = useState('1000');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const monthNum = Number(month);
        const amountNum = Number(amount);

        if (!isNaN(monthNum) && Number.isInteger(monthNum) && monthNum > 0 && monthNum <= maxMonths && !isNaN(amountNum) && amountNum > 0) {
            onAdd({ month: monthNum, amount: amountNum });
            setMonth('1');
            setAmount('1000');
        } else if (!isNaN(monthNum) && monthNum > maxMonths) {
            alert(`O mês do aporte não pode ser maior que o período total (${maxMonths} meses).`);
        } else {
            alert('Por favor, insira um mês (número inteiro) e um valor de aporte válidos e positivos.');
        }
    };
    
    const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);


    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Aportes Extras</h2>
            <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end mb-6">
                <div>
                    <label htmlFor="extraMonth" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Mês do Aporte</label>
                    <input 
                        type="number" 
                        id="extraMonth"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        min="1"
                        step="1"
                        max={maxMonths > 0 ? maxMonths : 1}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                </div>
                 <div>
                    <label htmlFor="extraAmount" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Valor do Aporte</label>
                    <div className="relative">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">R$</span>
                        <input 
                            type="number" 
                            id="extraAmount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="1"
                            step="1"
                             className="w-full p-3 pl-9 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>
                <div className="sm:col-span-2">
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        Adicionar Aporte
                    </button>
                </div>
            </form>
            
            {contributions.length > 0 && (
                <div className="max-h-48 overflow-y-auto pr-2">
                    <ul className="space-y-2">
                        {contributions.map((c, index) => (
                            <li key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Mês {c.month}: <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(c.amount)}</span></span>
                                <button onClick={() => onRemove(index)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 font-semibold text-xs">REMOVER</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ExtraContributions;