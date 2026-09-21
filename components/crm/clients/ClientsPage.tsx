
import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Client } from '../../../types/crm';
import { crmService } from '../../../services/crmService';
import { ClientCard } from './ClientCard';
import { ClientModal } from './ClientModal';

interface ClientsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ClientsPage: React.FC<ClientsPageProps> = ({ onNavigate }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadClients();
  }, []);
  
  useEffect(() => {
    if (searchQuery) {
      setFilteredClients(
        clients.filter(c => 
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.industry.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredClients(clients);
    }
  }, [searchQuery, clients]);
  
  const loadClients = async () => {
    setIsLoading(true);
    try {
      const data = await crmService.getClients();
      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateClient = () => {
    setSelectedClient(null);
    setShowModal(true);
  };
  
  const handleSaveClient = async (client: Client) => {
    if (selectedClient) {
      await crmService.updateClient(client);
    } else {
      await crmService.createClient(client);
    }
    loadClients();
    setShowModal(false);
  };
  
  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestão de Clientes</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {filteredClients.length} {filteredClients.length === 1 ? 'cliente ativo' : 'clientes ativos'}
            </p>
          </div>
          
          <button
            onClick={handleCreateClient}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Plus size={20} />
            Novo Cliente
          </button>
        </div>
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por nome ou indústria..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all font-medium"
          />
        </div>
      </div>
      
      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 font-medium">A carregar clientes...</p>
            </div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-60">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-slate-400" />
            </div>
            <p className="text-lg font-bold text-slate-500">Sem clientes encontrados</p>
            <p className="text-sm text-slate-400">Tenta uma pesquisa diferente ou cria um novo cliente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {filteredClients.map(client => (
              <ClientCard
                key={client.id}
                client={client}
                onClick={() => onNavigate('crm-client-detail', { clientId: client.id })}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Modal */}
      {showModal && (
        <ClientModal
          client={selectedClient}
          onSave={handleSaveClient}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
