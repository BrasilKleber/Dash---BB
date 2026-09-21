import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { ObjectiveType } from '../../types';
import { ShoppingCart } from 'lucide-react';

interface CampaignsGroupedChartProps {
  campaigns: any[];
  objective: ObjectiveType;
}

export const CampaignsGroupedChart: React.FC<CampaignsGroupedChartProps> = ({ campaigns, objective }) => {
  const config = {
    sales: { main: 'spend', secondary: 'revenue', efficiency: 'roas', label1: 'Custo', label2: 'Receita' },
    leads: { main: 'spend', secondary: 'conversions', efficiency: 'cpl', label1: 'Custo', label2: 'Leads' },
    followers: { main: 'spend', secondary: 'followers', efficiency: 'cpf', label1: 'Custo', label2: 'Seguidores' },
    hybrid: { main: 'spend', secondary: 'revenue', efficiency: 'roas', label1: 'Custo', label2: 'Receita' }
  };

  const activeConfig = config[objective as keyof typeof config] || config.sales;
  const colors = ['#004680', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#00A8E8'];

  const data = campaigns
    .map(c => ({
      name: c.name,
      spend: c.totals.spend,
      revenue: c.totals.revenue,
      conversions: c.totals.conversions,
      followers: c.totals.followers,
      efficiency: c.totals.efficiency
    }))
    .sort((a, b) => b[activeConfig.secondary as keyof typeof a] - a[activeConfig.secondary as keyof typeof a])
    .slice(0, 10);

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
            <ShoppingCart size={16} />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-0.5">Top 10 Campanhas por Volume</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Atribuição de resultados diretos</p>
          </div>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 30, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" hide />
            <YAxis yAxisId="left" orientation="left" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} fontWeight={700} />
            <YAxis yAxisId="right" orientation="right" stroke="#004680" fontSize={10} tickLine={false} axisLine={false} fontWeight={700} />
            <Tooltip 
              cursor={{ fill: '#f8fafc', opacity: 0.5 }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }} />
            <Bar yAxisId="left" dataKey={activeConfig.main} name={activeConfig.label1} fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar yAxisId="right" dataKey={activeConfig.secondary} name={activeConfig.label2} radius={[4, 4, 0, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};