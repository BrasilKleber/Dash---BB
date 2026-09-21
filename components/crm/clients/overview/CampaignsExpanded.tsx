
import React from 'react';
import { Rocket, TrendingUp, DollarSign, Target, Eye, MousePointer } from 'lucide-react';
import { CampaignMetrics } from '../../../../types/clientHub';

interface Props {
  campaigns: CampaignMetrics[];
  clientId: string;
}

export const CampaignsExpanded = ({ campaigns, clientId }: Props) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'launching': return { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Lançamento', icon: '🚀' };
      case 'active': return { color: 'bg-green-100 text-green-800 border-green-200', label: 'Ativa', icon: '✅' };
      case 'paused': return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pausada', icon: '⏸️' };
      case 'completed': return { color: 'bg-slate-100 text-slate-800 border-slate-200', label: 'Concluída', icon: '🏁' };
      default: return { color: 'bg-slate-100 text-slate-800 border-slate-200', label: status, icon: '📋' };
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };
  
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-PT', { notation: "compact", compactDisplay: "short" }).format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
            <Rocket className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Campanhas Ativas ({campaigns.length})
          </h2>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-xs font-bold uppercase tracking-wider shadow-sm active:scale-95">
          + Nova Campanha
        </button>
      </div>
      
      {campaigns.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <Rocket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium text-sm">Nenhuma campanha ativa</p>
          <button className="mt-4 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-purple-600 hover:border-purple-200 rounded-lg transition-all text-xs font-bold uppercase tracking-wide">
            Criar Primeira Campanha
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {campaigns.map(campaign => {
            const statusBadge = getStatusBadge(campaign.status);
            const budgetPercentage = (campaign.budget_spent / campaign.budget_total) * 100;
            
            return (
              <div 
                key={campaign.id}
                className="border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-purple-200 transition-all bg-slate-50/30"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {campaign.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide border ${statusBadge.color}`}>
                        <span>{statusBadge.icon}</span>
                        <span>{statusBadge.label}</span>
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                        Início: {formatDate(new Date(campaign.start_date))}
                      </span>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-wider hover:underline">
                    Ver Detalhes →
                  </button>
                </div>
                
                {/* Progresso */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-600 uppercase tracking-wider">Progresso do Objetivo</span>
                    <span className="font-bold text-slate-900">{campaign.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2.5 rounded-full transition-all"
                      style={{ width: `${Math.min(100, campaign.progress)}%` }}
                    />
                  </div>
                </div>
                
                {/* Métricas em Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {/* ROAS */}
                  <div className="bg-white border border-green-100 rounded-xl p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">ROAS</span>
                    </div>
                    <p className="text-xl font-black text-slate-900">{campaign.roas.toFixed(2)}x</p>
                    <p className="text-[10px] font-medium text-slate-500">
                      {formatCurrency(campaign.revenue)} receita
                    </p>
                  </div>
                  
                  {/* Budget */}
                  <div className="bg-white border border-blue-100 rounded-xl p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Budget</span>
                    </div>
                    <p className="text-xl font-black text-slate-900">{budgetPercentage.toFixed(0)}%</p>
                    <p className="text-[10px] font-medium text-slate-500">
                      {formatCurrency(campaign.budget_spent)} / {formatCurrency(campaign.budget_total)}
                    </p>
                  </div>
                  
                  {/* Conversões */}
                  <div className="bg-white border border-purple-100 rounded-xl p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-3.5 h-3.5 text-purple-600" />
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Conversões</span>
                    </div>
                    <p className="text-xl font-black text-slate-900">{formatNumber(campaign.conversions)}</p>
                    <p className="text-[10px] font-medium text-slate-500">
                      CPL: {formatCurrency(campaign.cpl)}
                    </p>
                  </div>
                  
                  {/* CTR */}
                  <div className="bg-white border border-orange-100 rounded-xl p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <MousePointer className="w-3.5 h-3.5 text-orange-600" />
                      <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">CTR</span>
                    </div>
                    <p className="text-xl font-black text-slate-900">{campaign.ctr.toFixed(2)}%</p>
                    <p className="text-[10px] font-medium text-slate-500">
                      {formatNumber(campaign.clicks)} clicks
                    </p>
                  </div>
                </div>
                
                {/* Métricas Adicionais */}
                <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{formatNumber(campaign.impressions)} impressões</span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Restante: <span className="text-slate-700">{formatCurrency(campaign.budget_remaining)}</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-medium text-slate-400">
                    Atualizado: {new Date(campaign.last_updated).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
