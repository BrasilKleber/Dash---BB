
import React from 'react';
import { Rocket } from 'lucide-react';

interface Props {
  campaignsCount: number;
  clientId: string;
}

export const ActiveCampaigns = ({ campaignsCount, clientId }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none"></div>
      
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
          <Rocket className="w-4 h-4 text-purple-600" />
        </div>
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Campanhas Ativas</h3>
      </div>
      
      <div className="text-center py-4 relative z-10">
        <p className="text-5xl font-black text-purple-600 tracking-tighter">{campaignsCount}</p>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Em Curso</p>
        <button className="mt-4 text-purple-600 hover:text-purple-800 text-xs font-bold uppercase tracking-widest hover:underline">
          Ver Todas →
        </button>
      </div>
    </div>
  );
};
