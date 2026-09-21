
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  alerts: any[];
  clientId: string;
}

export const ClientAlerts = ({ alerts, clientId }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-red-600" />
        </div>
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Alertas</h3>
      </div>
      
      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-sm text-green-700 font-bold">Tudo OK!</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Nenhum alerta ativo</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert, idx) => (
            <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs font-bold text-red-800">{alert.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
