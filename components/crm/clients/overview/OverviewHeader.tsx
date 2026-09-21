
import React from 'react';
import { TrendingUp, CheckCircle, AlertTriangle, Zap } from 'lucide-react';

interface Props {
  client: {
    id: string;
    name: string;
    health_score: number;
    contract_days_remaining: number;
    upcoming_actions_count: number;
  };
}

export const OverviewHeader = ({ client }: Props) => {
  const getHealthBadge = (score: number) => {
    if (score >= 80) return { 
      color: 'bg-green-100 text-green-800 border-green-200', 
      emoji: '🟢', 
      label: 'Excelente' 
    };
    if (score >= 60) return { 
      color: 'bg-blue-100 text-blue-800 border-blue-200', 
      emoji: '🔵', 
      label: 'Bom' 
    };
    if (score >= 40) return { 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      emoji: '🟡', 
      label: 'Atenção' 
    };
    return { 
      color: 'bg-red-100 text-red-800 border-red-200', 
      emoji: '🔴', 
      label: 'Crítico' 
    };
  };
  
  const getContractBadge = (days: number) => {
    if (days > 60) return { 
      color: 'bg-green-100 text-green-800', 
      icon: CheckCircle, 
      label: `${days} dias`,
      status: 'OK'
    };
    if (days > 30) return { 
      color: 'bg-yellow-100 text-yellow-800', 
      icon: AlertTriangle, 
      label: `${days} dias`,
      status: 'Renovar em breve'
    };
    if (days > 0) return { 
      color: 'bg-red-100 text-red-800', 
      icon: AlertTriangle, 
      label: `${days} dias`,
      status: 'URGENTE'
    };
    return { 
      color: 'bg-red-600 text-white', 
      icon: AlertTriangle, 
      label: 'Expirado',
      status: 'CRÍTICO'
    };
  };
  
  const healthBadge = getHealthBadge(client.health_score);
  const contractBadge = getContractBadge(client.contract_days_remaining);
  const ContractIcon = contractBadge.icon;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Health Score */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Health Score</p>
            <p className="text-3xl font-black text-slate-900 mt-2">{client.health_score}</p>
            <span className={`inline-block text-[10px] px-3 py-1 rounded-full border mt-2 font-bold uppercase tracking-widest ${healthBadge.color}`}>
              {healthBadge.emoji} {healthBadge.label}
            </span>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>
      
      {/* Contrato */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Contrato</p>
            <p className="text-2xl font-black text-slate-900 mt-2">{contractBadge.label}</p>
            <p className="text-xs text-slate-500 mt-1 font-semibold">{contractBadge.status}</p>
          </div>
          <div className={`p-4 rounded-xl ${contractBadge.color.includes('bg-') ? contractBadge.color.split(' ')[0] : 'bg-slate-100'}`}>
            <ContractIcon className={`w-8 h-8 ${contractBadge.color.includes('text-') ? contractBadge.color.split(' ')[1] : 'text-slate-600'}`} />
          </div>
        </div>
      </div>
      
      {/* Próximas Ações */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Próximas Ações</p>
            <p className="text-3xl font-black text-slate-900 mt-2">{client.upcoming_actions_count}</p>
            <p className="text-xs text-slate-500 mt-1 font-semibold">pendentes</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl">
            <Zap className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
