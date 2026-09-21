
import React from 'react';
import { Client } from '../../../types/crm';
import { Building2, Rocket } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  onClick: () => void;
}

const STATUS_COLORS = {
  active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-100 text-slate-700 border-slate-200',
  paused: 'bg-orange-100 text-orange-700 border-orange-200'
};

const STATUS_LABELS = {
  active: 'Ativo',
  inactive: 'Inativo',
  paused: 'Pausado'
};

export const ClientCard: React.FC<ClientCardProps> = ({ client, onClick }) => {
  
  const campaignCount = client.campaigns?.length || 0;
  
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer p-6 group h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
          <Building2 size={24} className="text-white" />
        </div>
        
        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${STATUS_COLORS[client.status]}`}>
          {STATUS_LABELS[client.status]}
        </span>
      </div>
      
      {/* Client Info */}
      <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
        {client.name}
      </h3>
      
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex-1">{client.industry}</p>
      
      {/* Stats */}
      <div className="flex items-center gap-4 pt-4 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-2 text-sm bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
          <Rocket size={14} className="text-purple-600" />
          <span className="font-bold text-purple-900 text-xs">
            {campaignCount} {campaignCount === 1 ? 'campanha' : 'campanhas'}
          </span>
        </div>
      </div>
    </div>
  );
};
