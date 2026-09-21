
import React from 'react';
import { Campaign } from '../../../types/crm';
import { Rocket, Calendar, DollarSign } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
  onClick: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  launch: 'Lançamento',
  webinar: 'Webinar',
  course: 'Curso',
  seasonal: 'Sazonal',
  evergreen: 'Evergreen',
  other: 'Outro'
};

const STATUS_COLORS: Record<string, string> = {
  planning: 'bg-blue-100 text-blue-700 border-blue-200',
  active: 'bg-green-100 text-green-700 border-green-200',
  completed: 'bg-slate-100 text-slate-700 border-slate-200',
  paused: 'bg-orange-100 text-orange-700 border-orange-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200'
};

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onClick }) => {
  
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border-2 border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer p-6 group flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
          <Rocket size={24} className="text-white" />
        </div>
        
        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${STATUS_COLORS[campaign.status]}`}>
          {TYPE_LABELS[campaign.type] || campaign.type}
        </span>
      </div>
      
      {/* Campaign Info */}
      <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
        {campaign.name}
      </h3>
      
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex-1">{campaign.clientName}</p>
      
      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
          <span>Progresso</span>
          <span>{campaign.progress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all shadow-sm"
            style={{ width: `${campaign.progress}%` }}
          />
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-2 text-xs">
          <Calendar size={14} className="text-slate-400" />
          <span className="text-slate-700 font-medium">
            {campaign.dates.launchDate 
              ? new Date(campaign.dates.launchDate).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }) 
              : 'Sem data'}
          </span>
        </div>
        
        {campaign.budget !== undefined && (
          <div className="flex items-center gap-2 text-xs">
            <DollarSign size={14} className="text-slate-400" />
            <span className="text-slate-700 font-medium">
              {campaign.budget >= 1000 ? `${(campaign.budget / 1000).toFixed(0)}k€` : `${campaign.budget}€`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
