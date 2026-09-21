
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Overview } from './components/Overview';
import { Client, DateRange, User } from './types';
import { dataService } from './services/dataService';
import { getStoredConfig } from './services/sheetsService';
import { Loader2, Database } from 'lucide-react';

const App: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dummy User for Layout
  const [user] = useState<User>({
    id: '1',
    name: 'Ricardo Carneiro',
    email: 'ricardo@bluebolt.pt',
    role: 'admin',
    createdAt: new Date().toISOString()
  });
  
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    return { start, end, label: 'Últimos 30 dias' };
  });

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dataService.getClients();
      setClients(data);
      if (data.length > 0) {
        setSelectedClientId(data[0].id);
      } else {
        const config = getStoredConfig();
        if (!config.useMock) {
          setError("Ligação ativa, mas não foram encontrados clientes válidos no Google Sheets. Verifica os GIDs e os cabeçalhos.");
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const activeClient = clients.find(c => c.id === selectedClientId);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 gap-4">
          <Loader2 size={40} className="animate-spin text-blue-500" />
          <p className="font-medium">A sincronizar dados da Bluebolt...</p>
        </div>
      );
    }

    if (error || (clients.length === 0)) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 gap-6 max-w-md mx-auto text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <Database size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800">Sem dados para exibir</h3>
            <p className="text-sm leading-relaxed">{error || "Não encontrámos dados na tua folha de cálculo. Verifica as configurações de GID e se as colunas estão corretas."}</p>
          </div>
        </div>
      );
    }

    return activeClient ? (
      <Overview 
        activeClient={activeClient} 
        clients={clients} 
        onClientChange={setSelectedClientId} 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
    ) : null;
  };

  return (
    <Layout 
      activeTab="dashboard" 
      onTabChange={() => {}}
      user={user}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
