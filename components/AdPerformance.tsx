import React, { useState, useMemo, useEffect } from 'react';
import { Platform, Client, ObjectiveType, DateRange } from '../types';
import { Search, ExternalLink, Loader2, Filter } from 'lucide-react';
import { CampaignsGroupedChart } from './common/CampaignsGroupedChart';
import { dataService } from '../services/dataService';

interface AdPerformanceProps {
  activeClient: Client;
  dateRange: DateRange;
}

export const AdPerformance: React.FC<AdPerformanceProps> = ({ activeClient, dateRange }) => {
  const [filter, setFilter] = useState<Platform | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ObjectiveType>(
    activeClient.objective_primary === 'hybrid' 
    ? (activeClient.objective_secondary?.[0] || 'sales') 
    : activeClient.objective_primary
  );

  useEffect(() => {
    setViewMode(activeClient.objective_primary === 'hybrid' ? (activeClient.objective_secondary?.[0] || 'sales') : activeClient.objective_primary);
  }, [activeClient]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        const data = await dataService.getCampaigns(activeClient.id, dateRange);
        setCampaigns(data || []);
      } catch (err) { setCampaigns([]); } finally { setIsLoading(false); }
    };
    fetchCampaigns();
  }, [activeClient, dateRange]);

  const filteredCampaigns = useMemo(() => {
    if (!campaigns) return [];
    return campaigns.filter(c => {
      if (!c || !c.totals) return false;
      const matchPlatform = filter === 'all' || c.platform === filter;
      const matchSearch = (c.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      if (viewMode === 'sales') c.totals.efficiency = c.totals.spend > 0 ? c.totals.revenue / c.totals.spend : 0;
      else if (viewMode === 'leads') c.totals.efficiency = c.totals.conversions > 0 ? c.totals.spend / c.totals.conversions : 0;
      else if (viewMode === 'followers') c.totals.efficiency = c.totals.followers > 0 ? c.totals.spend / c.totals.followers : 0;
      return matchPlatform && matchSearch;
    });
  }, [campaigns, filter, searchTerm, viewMode]);

  if (isLoading) return <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 gap-4"><Loader2 size={36} className="animate-spin text-brand" /><p className="text-[11px] font-extrabold uppercase tracking-widest opacity-60">Analisando Campanhas...</p></div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      {activeClient.objective_primary === 'hybrid' && (
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm w-fit">
          {(activeClient.objective_secondary || ['sales', 'leads', 'followers']).map(obj => (
            <button
              key={obj}
              onClick={() => setViewMode(obj)}
              className={`px-6 py-2 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${
                viewMode === obj ? 'bg-brand text-white shadow-sm' : 'text-slate-500 hover:text-brand hover:bg-slate-50'
              }`}
            >
              {obj}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <CampaignsGroupedChart campaigns={filteredCampaigns} objective={viewMode} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-white p-1 rounded-lg shadow-sm border border-slate-200">
          <button onClick={() => setFilter('all')} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${filter === 'all' ? 'bg-slate-100 text-brand' : 'text-slate-400'}`}>Todos</button>
          <button onClick={() => setFilter(Platform.GOOGLE_ADS)} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${filter === Platform.GOOGLE_ADS ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}>Google</button>
          <button onClick={() => setFilter(Platform.META_ADS)} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${filter === Platform.META_ADS ? 'bg-purple-50 text-purple-600' : 'text-slate-400'}`}>Meta</button>
        </div>

        <div className="relative flex-1 md:max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input type="text" placeholder="Procurar campanha estratégica..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-6 py-3 text-sm focus:ring-2 focus:ring-brand/10 focus:border-brand outline-none transition-all shadow-sm font-medium" />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Campanha</th>
              <th className="px-8 py-5">Canal</th>
              <th className="px-8 py-5 text-right">Investimento</th>
              <th className="px-8 py-5 text-right">Eficiência ({viewMode === 'sales' ? 'ROAS' : viewMode === 'leads' ? 'CPL' : 'CPF'})</th>
              <th className="px-8 py-5 text-center">Abrir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCampaigns.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-4 font-bold text-slate-900 text-sm">{c.name}</td>
                <td className="px-8 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${c.platform === Platform.GOOGLE_ADS ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {c.platform?.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-8 py-4 text-sm text-slate-600 text-right font-bold">{Math.floor(c.totals?.spend || 0).toLocaleString()} €</td>
                <td className="px-8 py-4 text-right font-black text-slate-900 text-sm">
                  {viewMode === 'sales' ? (c.totals?.efficiency || 0).toFixed(2) : `${(c.totals?.efficiency || 0).toFixed(2)} €`}
                </td>
                <td className="px-8 py-4 text-center">
                  <button className="text-slate-300 hover:text-brand transition-colors"><ExternalLink size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};