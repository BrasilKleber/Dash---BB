
import React from 'react';
import { TrendingUp, Calendar, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { ContractInfo } from '../../../../types/clientHub';

interface Props {
  health_score: number;
  contract: ContractInfo;
  upcoming_actions_count: number;
}

export const OverviewHeaderOptimized = ({ health_score, contract, upcoming_actions_count }: Props) => {
  const getHealthBadge = (score: number) => {
    if (score >= 80) return { color: 'bg-green-100 text-green-800 border-green-200', emoji: '🟢', label: 'Excelente' };
    if (score >= 60) return { color: 'bg-blue-100 text-blue-800 border-blue-200', emoji: '🔵', label: 'Bom' };
    if (score >= 40) return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', emoji: '🟡', label: 'Atenção' };
    return { color: 'bg-red-100 text-red-800 border-red-200', emoji: '🔴', label: 'Crítico' };
  };
  
  const getContractStatus = (days: number) => {
    if (days > 60) return { 
      color: 'bg-green-100 text-green-800 border-green-200', 
      icon: CheckCircle, 
      label: 'OK',
      badge: '✅'
    };
    if (days > 45) return { 
      color: 'bg-blue-100 text-blue-800 border-blue-200', 
      icon: Calendar, 
      label: 'Prazo de Ouro',
      badge: '⭐'
    };
    if (days > 30) return { 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      icon: AlertTriangle, 
      label: 'Ação Necessária',
      badge: '📋'
    };
    if (days > 0) return { 
      color: 'bg-red-100 text-red-800 border-red-200', 
      icon: AlertTriangle, 
      label: 'URGENTE',
      badge: '🔴'
    };
    return { 
      color: 'bg-red-600 text-white border-red-600', 
      icon: AlertTriangle, 
      label: 'EXPIRADO',
      badge: '🚨'
    };
  };
  
  const healthBadge = getHealthBadge(health_score);
  const contractStatus = getContractStatus(contract.days_remaining);
  const ContractIcon = contractStatus.icon;
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* HEALTH SCORE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Health Score</p>
            <p className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{health_score}</p>
            <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-bold uppercase tracking-wide ${healthBadge.color}`}>
              {healthBadge.emoji} {healthBadge.label}
            </span>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>
      
      {/* CONTRATO COM BARRA TEMPORAL */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Calendar className="w-4 h-4 text-slate-600" />
            </div>
            <p className="text-sm font-bold text-slate-700 uppercase tracking-wide">Contrato</p>
          </div>
          <div className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border font-black uppercase tracking-wide ${contractStatus.color}`}>
            <span>{contractStatus.badge}</span>
            <span>{contractStatus.label}</span>
          </div>
        </div>
        
        <div className="flex items-end gap-2 mb-3">
          <p className="text-2xl font-black text-slate-900 leading-none">
            {contract.days_remaining}
          </p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">dias restantes</p>
        </div>
        
        {/* BARRA DE PROGRESSO TEMPORAL */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
            <span>{contract.progress_percentage}% decorrido</span>
            <span>{contract.duration_months} meses</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                contract.progress_percentage > 85 ? 'bg-red-500' :
                contract.progress_percentage > 60 ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}
              style={{ width: `${Math.min(contract.progress_percentage, 100)}%` }}
            />
          </div>
        </div>
        
        {/* DATAS */}
        <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
          <span>📍 {formatDate(new Date(contract.start_date))}</span>
          <span>🏁 {formatDate(new Date(contract.end_date))}</span>
        </div>
      </div>
      
      {/* PRÓXIMAS AÇÕES */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Próximas Ações</p>
            <p className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{upcoming_actions_count}</p>
            <span className="inline-block text-xs text-slate-500 font-bold uppercase tracking-wider">
              Ações Pendentes
            </span>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl">
            <Zap className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
