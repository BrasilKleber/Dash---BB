
import React from 'react';
import { Filter, ArrowDown } from 'lucide-react';

export interface FunnelStage {
  label: string;
  value: number;
  color: string;
  lightBg: string; // ex: 'bg-blue-50'
}

interface FunnelVisualProps {
  stages: FunnelStage[];
  totalLabel?: string;
  channels?: string[];
  selectedChannel?: string;
  onChannelChange?: (channel: string) => void;
}

export const FunnelVisual: React.FC<FunnelVisualProps> = ({ 
  stages, 
  totalLabel = "Pipeline Visual", 
  channels = [],
  selectedChannel = 'all',
  onChannelChange 
}) => {
  // Cálculo de largura (100% -> ~50%)
  const calculateWidth = (index: number, total: number) => {
    if (total <= 1) return 100;
    const maxReduction = 50; 
    const reductionPerStep = maxReduction / (total - 1);
    return 100 - (index * reductionPerStep);
  };

  // Helper para labels de conversão entre etapas
  const getConversionLabel = (index: number) => {
    if (index === 0) return 'CTR';
    if (index === 1) return 'Connect Rate';
    return 'Conv.';
  };
  
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm h-full flex flex-col justify-center">
      {/* Header - Margem ajustada para mb-4 (Equilíbrio) */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-violet-600">
              <path d="M3 3v18h18"/>
              <path d="m19 9-5 5-4-4-3 3"/>
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{totalLabel}</h3>
            <p className="text-xs text-slate-500 font-medium">Conversão ponta-a-ponta</p>
          </div>
        </div>
        
        {onChannelChange && (
          <div className="relative group">
            <select 
              value={selectedChannel}
              onChange={(e) => onChannelChange(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg pl-3 pr-8 py-2 outline-none focus:ring-2 focus:ring-violet-100 transition-all uppercase tracking-wide cursor-pointer hover:bg-slate-100"
            >
              <option value="all">TODOS OS CANAIS</option>
              {channels.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
            </select>
            <Filter size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600" />
          </div>
        )}
      </div>
      
      {/* Funil Visual CENTRALIZADO - Tamanho Médio */}
      <div className="space-y-0 flex-1 w-full flex flex-col justify-center items-center">
        {stages.map((stage, index) => {
          const widthPercentage = calculateWidth(index, stages.length);
          const nextStage = stages[index + 1];
          
          // Calcular a taxa entre o atual e o próximo para o conector
          // Mostra sempre, mesmo que seja 0.00%
          const connectorRate = nextStage 
            ? (stage.value > 0 
                ? ((nextStage.value / stage.value) * 100).toFixed(2) + '%' 
                : '0.00%')
            : null;
          
          return (
            <div key={index} className="flex flex-col items-center w-full group relative" style={{ maxWidth: '500px' }}>
              
              {/* Barra do funil */}
              <div 
                className={`${stage.lightBg} rounded-xl overflow-hidden transition-all duration-700 ease-out hover:shadow-md relative`}
                style={{ 
                  width: `${widthPercentage}%`,
                  minWidth: '220px'
                }}
              >
                {/* Accent bar Left */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: stage.color }} />
                {/* Accent bar Right */}
                <div className="absolute right-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: stage.color }} />

                {/* Padding médio: py-2 */}
                <div className="px-6 py-2 flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {stage.label}
                  </p>
                  <p className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                    {stage.value.toLocaleString()}
                  </p>
                </div>
              </div>
              
              {/* Conector com Métrica (Taxa de Conversão) - Altura aumentada para h-12 (dobro) */}
              {index < stages.length - 1 && connectorRate && (
                <div className="h-12 flex flex-col items-center justify-center my-0.5 relative w-full">
                   {/* Linha de fundo */}
                   <div className="absolute inset-0 flex items-center justify-center z-0">
                      <div className="w-px h-full bg-slate-200" />
                   </div>
                   
                   {/* Badge com a métrica */}
                   <div className="relative z-10 bg-slate-50 border border-slate-200 rounded-full px-2 py-0 shadow-sm flex items-center gap-1 scale-90 origin-center">
                      <ArrowDown size={8} className="text-slate-400" />
                      <span className="text-[9px] font-semibold text-slate-500">
                        {getConversionLabel(index)}: <span className="text-slate-700 font-bold">{connectorRate}</span>
                      </span>
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Footer com total - Margens médias (mt-4/pt-3) */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col items-center justify-center text-center">
        <div className="mb-1">
          <span className="text-slate-400 uppercase tracking-widest text-[10px] font-black">Taxa Global</span>
          <p className="text-3xl font-bold text-slate-900 mt-1 tracking-tight leading-tight">
             {stages.length > 0 && stages[0].value > 0 
                ? ((stages[stages.length - 1].value / stages[0].value) * 100).toFixed(2) 
                : '0.00'}%
          </p>
        </div>
        
        <div>
          <p className="text-[10px] font-bold text-slate-400 opacity-60">
            {stages[0]?.label} <span className="mx-1">→</span> {stages[stages.length - 1]?.label}
          </p>
        </div>
      </div>
    </div>
  );
};
