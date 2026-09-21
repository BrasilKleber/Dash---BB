import React, { useState, useEffect, useMemo } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area } from 'recharts';
import { ObjectiveType } from '../../types';
import { BarChart3, TrendingUp } from 'lucide-react';

interface AdaptiveMultiSeriesChartProps {
  data: any[];
  objective: ObjectiveType;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-slate-200 shadow-md rounded-lg z-50 min-w-[200px]">
        <p className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider border-b border-slate-100 pb-2">{label}</p>
        <div className="space-y-2">
          {payload.map((p: any, idx: number) => {
            const isRatio = p.dataKey === 'roas' || p.dataKey === 'cpl' || p.dataKey === 'cpf';
            return (
              <div key={`${p.dataKey}-${idx}`} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-tight">{p.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {typeof p.value === 'number' 
                    ? p.value.toLocaleString(undefined, { 
                        minimumFractionDigits: isRatio ? 2 : 0,
                        maximumFractionDigits: isRatio ? 2 : 0 
                      })
                    : p.value} 
                  {p.dataKey === 'roas' ? 'x' : (p.dataKey === 'cpl' || p.dataKey === 'cpf' || p.dataKey === 'spend' || p.dataKey === 'revenue') ? ' €' : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export const AdaptiveMultiSeriesChart: React.FC<AdaptiveMultiSeriesChartProps> = ({ data, objective }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const hasData = Array.isArray(data) && data.length > 0;

  // Cores Suaves (Pastel/Modern Theme)
  const colors = {
    spend: '#60A5FA',    // Blue-400
    revenue: '#34D399',  // Emerald-400
    roas: '#A78BFA',     // Violet-400
    leads: '#FB923C',    // Orange-400
    followers: '#F472B6' // Pink-400
  };

  const configMap = {
    sales: [
      { key: 'spend', label: 'Investimento', color: colors.spend, yAxisId: 'left' },
      { key: 'revenue', label: 'Receita', color: colors.revenue, yAxisId: 'left' },
      { key: 'roas', label: 'ROAS', color: colors.roas, yAxisId: 'right' }
    ],
    leads: [
      { key: 'spend', label: 'Investimento', color: colors.spend, yAxisId: 'left' },
      { key: 'leads', label: 'Leads', color: colors.leads, yAxisId: 'left' },
      { key: 'cpl', label: 'CPL', color: colors.roas, yAxisId: 'right' }
    ],
    followers: [
      { key: 'spend', label: 'Investimento', color: colors.spend, yAxisId: 'left' },
      { key: 'followers', label: 'Seguidores', color: colors.followers, yAxisId: 'left' },
      { key: 'cpf', label: 'CPF', color: colors.roas, yAxisId: 'right' }
    ],
    hybrid: [
      { key: 'spend', label: 'Investimento', color: colors.spend, yAxisId: 'left' },
      { key: 'revenue', label: 'Receita', color: colors.revenue, yAxisId: 'left' },
      { key: 'leads', label: 'Leads', color: colors.leads, yAxisId: 'right' },
      { key: 'followers', label: 'Seguidores', color: colors.followers, yAxisId: 'right' }
    ]
  };

  const currentSeries = configMap[objective] || configMap.sales;

  const processedData = useMemo(() => {
    if (!hasData) return [];
    return data.map(d => ({
      ...d,
      roas: (d.spend && d.spend > 0) ? d.revenue / d.spend : 0,
      cpl: (d.leads && d.leads > 0) ? d.spend / d.leads : 0,
      cpf: (d.followers && d.followers > 0) ? d.spend / d.followers : 0,
    }));
  }, [data, hasData]);

  const toggleSeries = (e: any) => {
    const key = e.dataKey;
    setHiddenKeys(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col h-full">
      <header className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
            <TrendingUp size={16} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-0.5">Tendência Temporal</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Evolução Diária de KPIs</p>
          </div>
        </div>
      </header>
      
      <div className="flex-1 w-full" style={{ minHeight: '400px', display: 'block' }}>
        {!hasData ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
             <BarChart3 size={32} strokeWidth={1.5} />
             <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-3">Sem dados históricos</p>
          </div>
        ) : (
          isMounted && (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="date" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10} 
                  tickFormatter={(str) => {
                    if (typeof str !== 'string') return '';
                    const parts = str.split('-');
                    return parts.length > 2 ? `${parts[2]}/${parts[1]}` : str;
                  }} 
                  stroke="#94a3b8" 
                  fontWeight={500} 
                />
                <YAxis yAxisId="left" fontSize={10} tickLine={false} axisLine={false} stroke="#94a3b8" fontWeight={500} />
                <YAxis yAxisId="right" orientation="right" fontSize={10} tickLine={false} axisLine={false} stroke="#A78BFA" fontWeight={500} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle" 
                  onClick={toggleSeries}
                  wrapperStyle={{ 
                    paddingBottom: '20px', 
                    fontSize: '10px', 
                    fontWeight: '700', 
                    textTransform: 'uppercase', 
                    cursor: 'pointer'
                  }} 
                  formatter={(value, entry: any) => (
                    <span style={{ color: hiddenKeys.includes(entry.dataKey) ? '#cbd5e1' : '#475569', paddingLeft: '4px' }}>
                      {value}
                    </span>
                  )}
                />
                <Area 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="none" 
                  fill="url(#colorMain)" 
                  hide={hiddenKeys.includes('revenue')} 
                  isAnimationActive={true}
                  animationDuration={1000}
                />
                {currentSeries.map((serie, idx) => (
                  <Line
                    key={`${serie.key}-${idx}`}
                    yAxisId={serie.yAxisId}
                    type="monotone"
                    dataKey={serie.key}
                    name={serie.label}
                    stroke={serie.color}
                    strokeWidth={2}
                    hide={hiddenKeys.includes(serie.key)}
                    dot={{ r: 3, fill: serie.color, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: serie.color, stroke: '#fff', strokeWidth: 2 }}
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationBegin={idx * 100}
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          )
        )}
      </div>
    </div>
  );
};