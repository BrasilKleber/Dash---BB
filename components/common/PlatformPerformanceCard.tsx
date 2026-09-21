import React from 'react';
import { Search, Facebook, Instagram, Music2, Share2, HelpCircle, LucideIcon } from 'lucide-react';

interface PlatformPerformanceCardProps {
  platform: string;
  revenue: number;
  roas: number;
  investment: number;
  conversions: number;
}

export const PlatformPerformanceCard: React.FC<PlatformPerformanceCardProps> = ({ 
  platform, 
  revenue, 
  roas, 
  investment, 
  conversions 
}) => {
  const p = platform?.toLowerCase() || 'unknown';
  
  // Configuração padrão
  let config = {
    name: 'OUTRO CANAL',
    icon: HelpCircle,
    color: '#64748b', // slate-500
    lightBg: 'bg-slate-50'
  };

  if (p.includes('google')) {
    config = {
      name: 'GOOGLE ADS',
      icon: Search,
      color: '#4499ee',
      lightBg: 'bg-blue-50'
    };
  } else if (p.includes('meta') || p.includes('facebook')) {
    config = {
      name: 'META ADS',
      icon: Facebook,
      color: '#ac83ee',
      lightBg: 'bg-violet-50'
    };
  } else if (p.includes('instagram')) {
    config = {
      name: 'INSTAGRAM',
      icon: Instagram,
      color: '#e86b88',
      lightBg: 'bg-pink-50'
    };
  } else if (p.includes('tiktok')) {
    config = {
      name: 'TIKTOK',
      icon: Music2,
      color: '#000000',
      lightBg: 'bg-slate-100'
    };
  }

  const Icon = config.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
      {/* Barra colorida lateral */}
      <div className="flex">
        <div 
          className="w-1.5 flex-shrink-0 transition-all group-hover:w-2" 
          style={{ backgroundColor: config.color }}
        />
        
        <div className="flex-1 p-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div 
              className={`w-10 h-10 ${config.lightBg} rounded-lg flex items-center justify-center transition-colors`}
            >
              <Icon size={18} style={{ color: config.color }} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm tracking-tight">{config.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Canal Ativo</p>
            </div>
          </div>
          
          {/* Métricas em Grid */}
          <div className="grid grid-cols-4 gap-2">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Receita</p>
              <p className="text-xs font-bold text-slate-900 truncate" title={`${revenue.toLocaleString()} €`}>
                {Math.floor(revenue).toLocaleString()} €
              </p>
            </div>
            
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ROAS</p>
              <p 
                className="text-xs font-bold" 
                style={{ color: config.color }}
              >
                {roas.toFixed(2)}x
              </p>
            </div>
            
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Inv.</p>
              <p className="text-xs font-bold text-slate-900 truncate" title={`${investment.toLocaleString()} €`}>
                {Math.floor(investment).toLocaleString()} €
              </p>
            </div>
            
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Conv.</p>
              <p className="text-xs font-bold text-slate-900">
                {conversions}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};