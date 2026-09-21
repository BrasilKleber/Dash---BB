
import React, { useState } from 'react';
import { ArrowUpDown, ExternalLink } from 'lucide-react';
import { ClientHealth } from '../../types/operations';

interface Props {
  clients: ClientHealth[];
}

export const ClientHealthTable = ({ clients }: Props) => {
  const [sortBy, setSortBy] = useState<'health' | 'roas' | 'retainer'>('health');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
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
  
  const sortedClients = [...clients].sort((a, b) => {
    let comparison = 0;
    
    switch(sortBy) {
      case 'health':
        comparison = a.totalScore - b.totalScore;
        break;
      case 'roas':
        comparison = a.roas - b.roas;
        break;
      case 'retainer':
        comparison = a.retainerFee - b.retainerFee;
        break;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
  
  const handleSort = (column: 'health' | 'roas' | 'retainer') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 bg-slate-50 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">📊 Saúde da Carteira</h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">Clique nas colunas para ordenar</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">
                Cliente
              </th>
              <th 
                className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleSort('health')}
              >
                <div className="flex items-center justify-center gap-1">
                  Health Score
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleSort('roas')}
              >
                <div className="flex items-center justify-center gap-1">
                  ROAS
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleSort('retainer')}
              >
                <div className="flex items-center justify-center gap-1">
                  Avença
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest">
                Contrato
              </th>
              <th className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest">
                Alertas
              </th>
              <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedClients.map(client => {
              const healthBadge = getHealthBadge(client.totalScore);
              
              return (
                <tr key={client.clientId} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-900">{client.clientName}</div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase mt-0.5">{client.clientId}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl filter drop-shadow-sm">{healthBadge.emoji}</span>
                      <div className="text-center">
                        <div className="text-lg font-black text-slate-900 leading-none">{client.totalScore}</div>
                        <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full border mt-1 font-bold uppercase tracking-wide ${healthBadge.color}`}>
                          {healthBadge.label}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-black text-slate-900">
                      {client.roas.toFixed(2)}x
                    </div>
                    <div className="text-[10px] font-bold mt-1">
                      {client.roas >= 3.5 ? <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded">ALTO</span> : 
                       client.roas >= 2.5 ? <span className="text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">MÉDIO</span> : 
                       <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded">BAIXO</span>}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-black text-slate-900">
                      {client.retainerFee.toLocaleString()} €
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Mensal
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className={`text-sm font-bold ${
                      client.contractDaysRemaining <= 0 ? 'text-red-600' : 
                      client.contractDaysRemaining <= 15 ? 'text-red-500' :
                      client.contractDaysRemaining <= 30 ? 'text-orange-500' :
                      client.contractDaysRemaining <= 45 ? 'text-yellow-600' :
                      client.contractDaysRemaining <= 60 ? 'text-blue-600' : 'text-slate-900'
                    }`}>
                      {client.contractDaysRemaining > 0 ? `${client.contractDaysRemaining} dias` : 'Expirado'}
                    </div>
                    {client.contractDaysRemaining <= 60 && client.contractDaysRemaining > 45 && (
                      <span className="inline-block text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wide mt-1">
                        Prazo Ouro
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {client.alerts.length > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                        {client.alerts.length} {client.alerts.length === 1 ? 'alerta' : 'alertas'}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-300 font-bold">—</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-blue-50 px-3 py-1.5 rounded-lg">
                      Detalhes
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
