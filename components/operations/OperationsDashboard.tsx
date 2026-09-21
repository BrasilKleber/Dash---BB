
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { ClientHealth } from '../../types/operations';
import { generateMockOperationalData } from '../../services/operationsService';
import { ExecutiveSummary } from './ExecutiveSummary';
import { CriticalAlerts } from './CriticalAlerts';
import { ClientHealthTable } from './ClientHealthTable';

export const OperationsDashboard = () => {
  const [clients, setClients] = useState<ClientHealth[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadOperationsData();
  }, []);
  
  const loadOperationsData = () => {
    setLoading(true);
    try {
      const data = generateMockOperationalData();
      setClients(data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const allAlerts = clients.flatMap(c => c.alerts);
  const criticalAlerts = allAlerts.filter(a => 
    a.severity === 'critical' || 
    a.severity === 'high'
  ).sort((a, b) => {
    // Ordenar por severidade (critical primeiro) e depois por tipo
    if (a.severity === 'critical' && b.severity !== 'critical') return -1;
    if (a.severity !== 'critical' && b.severity === 'critical') return 1;
    return 0;
  });
  
  const criticalCount = clients.filter(c => c.status === 'critical').length;
  const warningCount = clients.filter(c => c.status === 'warning').length;
  const healthyCount = clients.filter(c => c.status === 'healthy' || c.status === 'excellent').length;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">A carregar operações...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestão Operacional</h1>
          <p className="text-slate-500 mt-2 font-medium">Visão geral da saúde da carteira e alertas contratuais.</p>
        </div>
        <button
          onClick={loadOperationsData}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md font-bold text-sm transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar Dados
        </button>
      </div>
      
      {/* Executive Summary */}
      <ExecutiveSummary
        totalClients={clients.length}
        criticalCount={criticalCount}
        warningCount={warningCount}
        healthyCount={healthyCount}
      />
      
      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <CriticalAlerts alerts={criticalAlerts} />
      )}
      
      {/* Client Health Table */}
      <ClientHealthTable clients={clients} />
    </div>
  );
};
