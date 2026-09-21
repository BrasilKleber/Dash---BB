
import React from 'react';
import { Users, AlertTriangle, CheckCircle } from 'lucide-react';

interface Props {
  totalClients: number;
  criticalCount: number;
  warningCount: number;
  healthyCount: number;
}

export const ExecutiveSummary = ({ 
  totalClients, 
  criticalCount, 
  warningCount, 
  healthyCount 
}: Props) => {
  const criticalPercentage = totalClients > 0 
    ? ((criticalCount / totalClients) * 100).toFixed(1) 
    : '0.0';
  const healthyPercentage = totalClients > 0 
    ? ((healthyCount / totalClients) * 100).toFixed(1) 
    : '0.0';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Clientes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Clientes</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{totalClients}</p>
            <p className="text-xs text-gray-500 mt-1">Carteira completa</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-full">
            <Users className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>
      
      {/* Críticos */}
      <div className="bg-red-50 rounded-lg shadow-sm border-2 border-red-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-red-700">🔴 CRÍTICOS</p>
            <p className="text-3xl font-bold text-red-800 mt-2">{criticalCount}</p>
            <p className="text-xs text-red-600 mt-1">{criticalPercentage}% da carteira</p>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="mt-4">
          <span className="inline-block text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
            Ação Imediata Necessária
          </span>
        </div>
      </div>
      
      {/* Avisos */}
      <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-yellow-700">⚠️ ATENÇÃO</p>
            <p className="text-3xl font-bold text-yellow-800 mt-2">{warningCount}</p>
            <p className="text-xs text-yellow-600 mt-1">Requer monitoramento</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>
      
      {/* Saudáveis */}
      <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-green-700">✅ SAUDÁVEL</p>
            <p className="text-3xl font-bold text-green-800 mt-2">{healthyCount}</p>
            <p className="text-xs text-green-600 mt-1">{healthyPercentage}% da carteira</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
