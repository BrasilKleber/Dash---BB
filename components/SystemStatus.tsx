import React from 'react';
import { ShieldCheck, AlertTriangle, Clock, RefreshCcw } from 'lucide-react';
import { MOCK_RUNS, MOCK_ERRORS } from '../data/mockData';
import { SystemStatus as StatusEnum } from '../types';

export const SystemStatus: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Top Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass p-8 rounded-3xl border-l-8 border-emerald-500 shadow-card flex items-center gap-6">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 shadow-soft">
            <ShieldCheck size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ecosistema Global</p>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Operacional</h3>
          </div>
        </div>
        
        <div className="glass p-8 rounded-3xl border-l-8 border-brandAccent shadow-card flex items-center gap-6">
          <div className="p-4 bg-brandAccent/5 rounded-2xl text-brandAccent shadow-soft">
            <Clock size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Última Sincronização</p>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Há 12 minutos</h3>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border-l-8 border-amber-500 shadow-card flex items-center gap-6">
          <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 shadow-soft">
            <AlertTriangle size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Eventos Ativos</p>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">2 Alertas</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Runs History */}
        <div className="xl:col-span-7 glass rounded-3xl shadow-card overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-borderSoft flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
              <RefreshCcw size={18} className="text-brandAccent" />
              Logs de Arquitetura
            </h3>
            <button className="text-[10px] font-black text-brandAccent uppercase tracking-widest hover:underline">Ver Histórico</button>
          </div>
          <div className="flex-1 overflow-auto max-h-[500px] custom-scrollbar">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">PROTOCOLO_ID</th>
                  <th className="px-8 py-4">INÍCIO</th>
                  <th className="px-8 py-4 text-right">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_RUNS.map((run) => (
                  <tr key={run.runId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5 text-sm font-mono font-bold text-slate-700">{run.runId}</td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-500">{run.start}</td>
                    <td className="px-8 py-5 text-right">
                      <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        run.status === StatusEnum.SUCCESS ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {run.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Logs of Errors */}
        <div className="xl:col-span-5 glass rounded-3xl shadow-card overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-borderSoft bg-slate-900 text-white flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
              <AlertTriangle size={18} className="text-amber-400" />
              Eventos Críticos
            </h3>
            <span className="bg-white/10 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Prioridade: 0</span>
          </div>
          <div className="flex-1 overflow-auto max-h-[500px] custom-scrollbar p-6 space-y-5">
            {MOCK_ERRORS.map((err, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-rose-50/30 border border-rose-100/50 space-y-4 shadow-soft">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{err.client}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{err.source}</p>
                  </div>
                  <span className="text-[9px] font-black text-rose-600 bg-rose-100 px-2.5 py-1 rounded-lg">FALHA</span>
                </div>
                <p className="text-xs font-semibold text-rose-700 leading-relaxed">{err.message}</p>
                <div className="pt-3 border-t border-rose-100 flex items-center gap-2 text-rose-400">
                  <Clock size={12} />
                  <span className="text-[10px] font-bold">{err.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};