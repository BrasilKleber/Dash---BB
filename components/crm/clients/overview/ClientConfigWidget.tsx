
import React from 'react';
import { Settings, Mail, Phone, User, Briefcase, DollarSign, Edit, ExternalLink } from 'lucide-react';
import { ClientConfig } from '../../../../types/clientHub';

interface Props {
  config: ClientConfig;
}

export const ClientConfigWidget = ({ config }: Props) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };
  
  const getContractTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      monthly: 'Mensal',
      quarterly: 'Trimestral',
      biannual: 'Semestral',
      annual: 'Anual'
    };
    return labels[type] || type;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-slate-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Info</h3>
        </div>
        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
          <Edit className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-5">
        {/* Contacto */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email</p>
              <a href={`mailto:${config.email}`} className="text-xs font-bold text-blue-600 hover:text-blue-800 truncate block">
                {config.email}
              </a>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Telefone</p>
              <a href={`tel:${config.phone}`} className="text-xs font-bold text-blue-600 hover:text-blue-800">
                {config.phone}
              </a>
            </div>
          </div>
        </div>
        
        {/* Dados Empresa */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-start gap-3">
            <User className="w-4 h-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Account Manager</p>
              <p className="text-xs font-bold text-slate-900">{config.account_manager}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Briefcase className="w-4 h-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Indústria</p>
              <p className="text-xs font-bold text-slate-900">{config.industry}</p>
            </div>
          </div>
        </div>
        
        {/* Financeiro */}
        <div className="pt-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Financeiro</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600 font-medium">Budget Mensal</span>
                <span className="text-sm font-black text-slate-900">{formatCurrency(config.monthly_budget)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600 font-medium">Contrato</span>
                <span className="text-xs font-bold text-slate-800">{getContractTypeLabel(config.contract.type)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600 font-medium">Faturação</span>
                <span className="text-xs font-bold text-slate-800">Dia {config.billing_day}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Website (opcional) */}
        {config.website && (
          <a 
            href={config.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all uppercase tracking-wide"
          >
            Visitar Website
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
