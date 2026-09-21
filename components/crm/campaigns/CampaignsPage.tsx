
import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Campaign } from '../../../types/crm';
import { crmService } from '../../../services/crmService';
import { CampaignCard } from './CampaignCard';
import { CampaignModal } from './CampaignModal';

interface CampaignsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CampaignsPage: React.FC<CampaignsPageProps> = ({ onNavigate }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadCampaigns();
  }, []);
  
  useEffect(() => {
    if (searchQuery) {
      setFilteredCampaigns(
        campaigns.filter(c => 
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.clientName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredCampaigns(campaigns);
    }
  }, [searchQuery, campaigns]);
  
  const loadCampaigns = async () => {
    setIsLoading(true);
    try {
      const data = await crmService.getCampaigns();
      setFilteredCampaigns(data);
      setCampaigns(data);
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateCampaign = () => {
    setSelectedCampaign(null);
    setShowModal(true);
  };
  
  const handleSaveCampaign = async (campaign: Campaign) => {
    if (selectedCampaign) {
      await crmService.updateCampaign(campaign);
    } else {
      await crmService.createCampaign(campaign);
    }
    loadCampaigns();
    setShowModal(false);
  };
  
  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestão de Campanhas</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {filteredCampaigns.length} {filteredCampaigns.length === 1 ? 'campanha ativa' : 'campanhas ativas'}
            </p>
          </div>
          
          <button
            onClick={handleCreateCampaign}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Plus size={20} />
            Nova Campanha
          </button>
        </div>
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por nome ou cliente..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/10 transition-all font-medium"
          />
        </div>
      </div>
      
      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 font-medium">A carregar campanhas...</p>
            </div>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-60">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-purple-400" />
            </div>
            <p className="text-lg font-bold text-slate-500">Sem campanhas encontradas</p>
            <p className="text-sm text-slate-400">Tenta uma pesquisa diferente ou cria uma nova campanha.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {filteredCampaigns.map(campaign => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onClick={() => onNavigate('crm-campaign-detail', { campaignId: campaign.id })}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Modal */}
      {showModal && (
        <CampaignModal
          campaign={selectedCampaign}
          onSave={handleSaveCampaign}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
