import React from 'react';

export type StatsColorVariant = 'investment' | 'revenue' | 'roas' | 'sales' | 'aov' | 'cac';

interface StatsCardProps {
  label: string;
  value: string | number;
  variant: StatsColorVariant;
  comparison?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subValue?: string;
}

const colorSchemes: Record<StatsColorVariant, { 
  bg: string; 
  iconBg: string; 
  iconColor: string; 
  text: string; 
  value: string; 
  border: string 
}> = {
  investment: { 
    bg: 'bg-white',
    iconBg: 'bg-[#fbede7]',       // Fundo pastel coral
    iconColor: '#de6836',         // Ícone laranja vibrante
    text: 'text-slate-600',
    value: 'text-[#de6836]',
    border: 'border-slate-200'
  },
  revenue: { 
    bg: 'bg-white',
    iconBg: 'bg-[#ecf4fd]',       // Fundo pastel azul
    iconColor: '#4499ee',         // Ícone azul vibrante
    text: 'text-slate-600',
    value: 'text-[#4499ee]',
    border: 'border-slate-200'
  },
  roas: { 
    bg: 'bg-white',
    iconBg: 'bg-[#f4eefd]',       // Fundo pastel roxo
    iconColor: '#ac83ee',         // Ícone roxo vibrante
    text: 'text-slate-600',
    value: 'text-[#ac83ee]',
    border: 'border-slate-200'
  },
  sales: { 
    bg: 'bg-white',
    iconBg: 'bg-[#eef8f0]',       // Fundo pastel verde
    iconColor: '#52ba69',         // Ícone verde vibrante
    text: 'text-slate-600',
    value: 'text-[#52ba69]',
    border: 'border-slate-200'
  },
  aov: { 
    bg: 'bg-white',
    iconBg: 'bg-[#e8fafb]',       // Fundo pastel ciano
    iconColor: '#32c7ce',         // Ícone ciano vibrante
    text: 'text-slate-600',
    value: 'text-[#32c7ce]',
    border: 'border-slate-200'
  },
  cac: { 
    bg: 'bg-white',
    iconBg: 'bg-[#fee3e5]',       // Fundo pastel rosa
    iconColor: '#e86b88',         // Ícone rosa vibrante
    text: 'text-slate-600',
    value: 'text-[#e86b88]',
    border: 'border-slate-200'
  }
};

export const StatsCard: React.FC<StatsCardProps> = ({ 
  label, 
  value, 
  variant, 
  comparison, 
  subValue 
}) => {
  const scheme = colorSchemes[variant];
  
  return (
    <div className={`${scheme.bg} rounded-xl p-6 shadow-sm border ${scheme.border} hover:shadow-md transition-all duration-200 cursor-default group`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 ${scheme.iconBg} rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-300`}>
          {variant === 'investment' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={scheme.iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
          )}
          {variant === 'revenue' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={scheme.iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          )}
          {variant === 'roas' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={scheme.iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
          )}
          {variant === 'sales' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={scheme.iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          )}
          {variant === 'aov' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={scheme.iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          )}
          {variant === 'cac' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={scheme.iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          )}
        </div>
        
        {comparison && (
          <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
            comparison.trend === 'up' 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
              : comparison.trend === 'down' 
                ? 'bg-red-50 text-red-600 border-red-200' 
                : 'bg-slate-50 text-slate-600 border-slate-200'
          }`}>
            {comparison.trend === 'up' ? '↗' : comparison.trend === 'down' ? '↘' : '•'} {comparison.value}
          </span>
        )}
      </div>
      
      <p className={`text-xs font-semibold ${scheme.text} mb-2`}>
        {label}
      </p>
      <p className={`text-3xl font-bold ${scheme.value} tracking-tight`}>
        {value}
      </p>
      {subValue && (
        <p className="text-sm text-slate-500 mt-1 font-medium">{subValue}</p>
      )}
    </div>
  );
};