
import React, { useState, useEffect } from 'react';
import { Edit, Plus, Rocket, Phone, Mail, Globe, Target } from 'lucide-react';
import { Client, Campaign } from '../../../types/crm';
import { crmService } from '../../../services/crmService';
import { Breadcrumb } from '../shared/Breadcrumb';
import { CampaignCard } from '../campaigns/CampaignCard';
import { CampaignModal } from '../campaigns/CampaignModal';
import { ClientOverviewTabOptimized } from './ClientOverviewTabOptimized';

interface ClientDetailPageProps {
  clientId: string;
  onNavigate: (page: any, params?: any) => void;
}

type TabType = 'overview' | 'info' | 'campaigns';

export const ClientDetailPage: React.FC<ClientDetailPageProps> = ({ clientId, onNavigate }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadClientData();
  }, [clientId]);
  
  const loadClientData = async () => {
    setIsLoading(true);
    try {
      const [clientData, allCampaigns] = await Promise.all([
        crmService.getClientById(clientId),
        crmService.getCampaigns()
      ]);
      
      if (clientData) {
        setClient(clientData);
        // Filtra campanhas deste cliente
        const clientCampaigns = allCampaigns.filter(c => c.clientId === clientId);
        setCampaigns(clientCampaigns);
      }
    } catch (error) {
      console.error('Erro ao carregar cliente:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateCampaign = async (campaign: Campaign) => {
    await crmService.createCampaign(campaign); 
    loadClientData();
    setShowCampaignModal(false);
  };
  
  if (isLoading || !client) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">A carregar cliente...</p>
        </div>
      </div>
    );
  }
  
  const activeCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'planning');
  const archivedCampaigns = campaigns.filter(c => c.status === 'completed' || c.status === 'cancelled');
  
  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <Breadcrumb
          items={[
            { label: 'CRM', onClick: () => onNavigate('crm-dashboard') },
            { label: 'Clientes', onClick: () => onNavigate('crm-clients') },
            { label: client.name }
          ]}
        />
        
        <div className="flex items-start justify-between mt-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl font-black text-white">
                {client.name.charAt(0)}
              </span>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{client.name}</h1>
              <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wide">{client.industry}</p>
            </div>
          </div>
          
          <button className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
            <Edit size={18} />
            Editar Cliente
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-8">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 font-bold text-sm border-b-2 transition-all uppercase tracking-wide ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`py-4 font-bold text-sm border-b-2 transition-all uppercase tracking-wide ${
              activeTab === 'campaigns'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Campanhas ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`py-4 font-bold text-sm border-b-2 transition-all uppercase tracking-wide ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Informações
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        
        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <ClientOverviewTabOptimized clientId={clientId} />
        )}

        {/* Tab: Info */}
        {activeTab === 'info' && (
          <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">Dados de Contacto</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><Globe size={20} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contacto</p>
                    <p className="text-sm font-semibold text-slate-900">{client.contactName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><Mail size={20} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                    <p className="text-sm font-semibold text-slate-900">{client.contactEmail}</p>
                  </div>
                </div>
                {client.contactPhone && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><Phone size={20} /></div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Telefone</p>
                      <p className="text-sm font-semibold text-slate-900">{client.contactPhone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">Contexto Estratégico</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500 mt-1 shrink-0"><Target size={20} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Objetivo</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{client.objective}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nicho</p>
                    <p className="text-sm font-medium text-slate-900">{client.niche}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mercado</p>
                    <p className="text-sm font-medium text-slate-900">{client.market}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Público-Alvo</p>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">{client.targetAudience}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Tab: Campanhas */}
        {activeTab === 'campaigns' && (
          <div className="pb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Campanhas</h2>
              <button
                onClick={() => setShowCampaignModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95"
              >
                <Plus size={20} />
                Nova Campanha
              </button>
            </div>
            
            {/* Campanhas Ativas */}
            {activeCampaigns.length > 0 && (
              <div className="mb-12 animate-in slide-in-from-bottom-2 duration-500">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  Em Curso ({activeCampaigns.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeCampaigns.map(campaign => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onClick={() => onNavigate('crm-campaign-detail', { campaignId: campaign.id })}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Campanhas Arquivadas */}
            {archivedCampaigns.length > 0 && (
              <div className="animate-in slide-in-from-bottom-2 duration-700">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-3">
                  <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                  Arquivo ({archivedCampaigns.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity">
                  {archivedCampaigns.map(campaign => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onClick={() => onNavigate('crm-campaign-detail', { campaignId: campaign.id })}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {campaigns.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Rocket size={32} className="text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium mb-1">Ainda não há campanhas para este cliente</p>
                <p className="text-slate-400 text-sm mb-6">Começa por criar uma nova estratégia.</p>
                <button
                  onClick={() => setShowCampaignModal(true)}
                  className="px-5 py-2.5 bg-white border border-slate-200 hover:border-purple-300 hover:text-purple-600 text-slate-600 rounded-xl font-bold text-sm transition-all shadow-sm"
                >
                  Criar Primeira Campanha
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Modal Nova Campanha */}
      {showCampaignModal && (
        <CampaignModal
          campaign={null}
          prefilledClientId={clientId}
          onSave={handleCreateCampaign}
          onClose={() => setShowCampaignModal(false)}
        />
      )}
    </div>
  );
};
