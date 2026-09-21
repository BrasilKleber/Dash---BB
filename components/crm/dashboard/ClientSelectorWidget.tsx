
import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface ClientPreview {
  id: string;
  name: string;
  health_score: number;
  contract_days_remaining: number;
}

interface ClientSelectorWidgetProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ClientSelectorWidget: React.FC<ClientSelectorWidgetProps> = ({ onNavigate }) => {
  const [selectedClient, setSelectedClient] = useState<ClientPreview | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock data - substituir por dados reais
  const clients: ClientPreview[] = [
    { id: '1', name: 'EcoCommerce Portugal', health_score: 92, contract_days_remaining: 45 },
    { id: '2', name: 'TechStart Consulting', health_score: 85, contract_days_remaining: 120 },
    { id: '3', name: 'FitLife Academy', health_score: 65, contract_days_remaining: 15 }
  ];
  
  const getHealthBadge = (score: number) => {
    if (score >= 80) return { color: 'bg-green-100 text-green-800', emoji: '🟢', label: 'Excelente' };
    if (score >= 60) return { color: 'bg-blue-100 text-blue-800', emoji: '🔵', label: 'Bom' };
    if (score >= 40) return { color: 'bg-yellow-100 text-yellow-800', emoji: '🟡', label: 'Atenção' };
    return { color: 'bg-red-100 text-red-800', emoji: '🔴', label: 'Crítico' };
  };
  
  const getContractStatus = (days: number) => {
    if (days > 60) return { color: 'text-green-600', label: `${days} dias` };
    if (days > 30) return { color: 'text-yellow-600', label: `${days} dias` };
    return { color: 'text-red-600', label: `${days} dias` };
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-xl">👥</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Clientes</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{clients.length} total</p>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('crm-clients')}
          className="text-xs text-blue-600 hover:text-blue-800 font-bold uppercase tracking-wider hover:underline"
        >
          Ver Todos →
        </button>
      </div>
      
      {/* Dropdown Selector */}
      <div className="relative mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 rounded-xl hover:border-blue-300 transition-all bg-slate-50 focus:bg-white text-sm font-medium"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span className={selectedClient ? "text-slate-900 font-bold" : "text-slate-500"}>
              {selectedClient ? selectedClient.name : 'Selecionar cliente...'}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {clients.map(client => {
              const healthBadge = getHealthBadge(client.health_score);
              const contractStatus = getContractStatus(client.contract_days_remaining);
              
              return (
                <button
                  key={client.id}
                  onClick={() => {
                    setSelectedClient(client);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 hover:bg-slate-50 text-left border-b border-slate-100 last:border-b-0 transition-colors"
                >
                  <p className="font-bold text-sm text-slate-900">{client.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                      Health: <span className="font-bold text-slate-700">{client.health_score}</span> {healthBadge.emoji}
                    </span>
                    <span className={`text-[10px] font-bold ${contractStatus.color}`}>
                      Contrato: {contractStatus.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Selected Client Preview */}
      <div className="flex-1">
        {selectedClient ? (
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-sm font-bold text-blue-600 mb-2">
                  {selectedClient.name.charAt(0)}
                </div>
                <h4 className="font-bold text-slate-900 text-sm leading-tight">{selectedClient.name}</h4>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contrato</p>
                <p className={`text-sm font-black ${getContractStatus(selectedClient.contract_days_remaining).color}`}>
                  {selectedClient.contract_days_remaining} dias
                </p>
              </div>
            </div>
            
            <div className="mt-auto">
              <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider mb-3 ${getHealthBadge(selectedClient.health_score).color}`}>
                {getHealthBadge(selectedClient.health_score).emoji}
                {getHealthBadge(selectedClient.health_score).label}
              </div>
              
              <button
                onClick={() => onNavigate('crm-client-detail', { clientId: selectedClient.id })}
                className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md active:scale-95"
              >
                Ver Overview Completo →
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-60 border-2 border-dashed border-slate-200 rounded-xl p-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Selecione um cliente</p>
          </div>
        )}
      </div>
    </div>
  );
};
