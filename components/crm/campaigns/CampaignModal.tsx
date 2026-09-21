
import React, { useState, useEffect } from 'react';
import { X, Save, Rocket, Calendar, DollarSign, Target } from 'lucide-react';
import { Campaign, CampaignType, CampaignStatus, Client } from '../../../types/crm';
import { crmService } from '../../../services/crmService';
import { CAMPAIGN_TEMPLATES } from './CampaignTemplates';

interface CampaignModalProps {
  campaign: Campaign | null;
  prefilledClientId?: string;
  onSave: (campaign: Campaign) => void;
  onClose: () => void;
}

const TYPE_OPTIONS: { value: CampaignType; label: string }[] = [
  { value: 'launch', label: 'Lançamento' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'course', label: 'Curso' },
  { value: 'seasonal', label: 'Sazonal' },
  { value: 'evergreen', label: 'Evergreen' },
  { value: 'other', label: 'Outro' },
];

const STATUS_OPTIONS: { value: CampaignStatus; label: string }[] = [
  { value: 'planning', label: 'Planeamento' },
  { value: 'active', label: 'Ativa' },
  { value: 'paused', label: 'Pausada' },
  { value: 'completed', label: 'Concluída' },
  { value: 'cancelled', label: 'Cancelada' },
];

export const CampaignModal: React.FC<CampaignModalProps> = ({ 
  campaign, 
  prefilledClientId,
  onSave, 
  onClose 
}) => {
  
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState<Partial<Campaign>>({
    name: '',
    clientId: prefilledClientId || '',
    clientName: '',
    type: 'launch',
    status: 'planning',
    dates: {
      start: new Date(),
      end: undefined,
      launchDate: undefined
    },
    budget: undefined,
    objectives: [],
    kpis: [],
    taskIds: [],
    progress: 0
  });
  
  const [newObjective, setNewObjective] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  useEffect(() => {
    loadClients();
    if (campaign) {
      setFormData(campaign);
    }
  }, [campaign]);
  
  const loadClients = async () => {
    const data = await crmService.getClients();
    setClients(data);
    
    // Se tem cliente pré-preenchido, preenche o nome
    if (prefilledClientId) {
      const client = data.find(c => c.id === prefilledClientId);
      if (client) {
        setFormData(prev => ({ ...prev, clientName: client.name }));
      }
    }
  };
  
  const handleSave = async () => {
    const campaignToSave: Campaign = {
      id: campaign?.id || Date.now().toString(),
      name: formData.name || '',
      clientId: formData.clientId || '',
      clientName: formData.clientName || '',
      type: formData.type || 'other',
      status: formData.status || 'planning',
      dates: formData.dates || { start: new Date() },
      budget: formData.budget,
      objectives: formData.objectives || [],
      kpis: formData.kpis || [],
      taskIds: formData.taskIds || [],
      progress: formData.progress || 0,
      createdAt: campaign?.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    // Se selecionou template, cria tarefas automaticamente
    if (selectedTemplate && !campaign) {
      const template = CAMPAIGN_TEMPLATES.find(t => t.id === selectedTemplate);
      if (template) {
        await crmService.createCampaignWithTemplate(campaignToSave, template);
      } else {
        onSave(campaignToSave);
      }
    } else {
      onSave(campaignToSave);
    }
  };
  
  const addObjective = () => {
    if (!newObjective.trim()) return;
    setFormData({
      ...formData,
      objectives: [...(formData.objectives || []), newObjective]
    });
    setNewObjective('');
  };
  
  const removeObjective = (index: number) => {
    setFormData({
      ...formData,
      objectives: formData.objectives?.filter((_, i) => i !== index)
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {campaign ? 'Editar Campanha' : 'Nova Campanha'}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-all"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="space-y-6">
            
            {/* Cliente */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Cliente *
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => {
                  const clientId = e.target.value;
                  const client = clients.find(c => c.id === clientId);
                  setFormData({ 
                    ...formData, 
                    clientId,
                    clientName: client?.name || ''
                  });
                }}
                disabled={!!prefilledClientId}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 transition-all disabled:opacity-50"
              >
                <option value="">Selecione...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            
            {/* Nome */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Nome da Campanha *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Lançamento Q1 2025"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all"
              />
            </div>
            
            {/* Grid: Tipo + Estado */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Tipo de Campanha *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as CampaignType })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 transition-all"
                >
                  {TYPE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as CampaignStatus })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 transition-all"
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Datas */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Data Início *
                </label>
                <input
                  type="date"
                  value={formData.dates?.start?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    dates: { ...formData.dates!, start: new Date(e.target.value) }
                  })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={formData.dates?.end?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    dates: { ...formData.dates!, end: new Date(e.target.value) }
                  })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Lançamento
                </label>
                <input
                  type="date"
                  value={formData.dates?.launchDate?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    dates: { ...formData.dates!, launchDate: new Date(e.target.value) }
                  })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 transition-all"
                />
              </div>
            </div>
            
            {/* Budget */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Budget (€)
              </label>
              <input
                type="number"
                value={formData.budget || ''}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                placeholder="Ex: 15000"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 transition-all"
              />
            </div>
            
            {/* Objetivos */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Objetivos
              </label>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addObjective()}
                  placeholder="Adicionar objetivo..."
                  className="flex-1 px-4 py-2 bg-slate-50 border-2 border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-400 transition-all text-sm"
                />
                <button
                  onClick={addObjective}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-sm transition-all"
                >
                  Adicionar
                </button>
              </div>
              
              <div className="space-y-2">
                {formData.objectives?.map((obj, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                    <Target size={16} className="text-purple-500 flex-shrink-0" />
                    <span className="flex-1 text-sm text-slate-700">{obj}</span>
                    <button
                      onClick={() => removeObjective(i)}
                      className="w-7 h-7 hover:bg-red-100 rounded-lg flex items-center justify-center text-red-500 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Template (só ao criar) */}
            {!campaign && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <Rocket size={20} />
                  Usar Template de Campanha?
                </h3>
                <p className="text-sm text-purple-700 mb-4">
                  Os templates criam automaticamente tarefas pré-configuradas para a campanha
                </p>
                
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-purple-300 rounded-xl outline-none focus:border-purple-500 transition-all"
                >
                  <option value="">Sem template (campanha vazia)</option>
                  {CAMPAIGN_TEMPLATES.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.taskTemplates.length} tarefas, ~{template.estimatedDays} dias)
                    </option>
                  ))}
                </select>
                
                {selectedTemplate && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
                    {CAMPAIGN_TEMPLATES.find(t => t.id === selectedTemplate)?.description}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-5 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white hover:bg-slate-100 border-2 border-slate-200 text-slate-700 rounded-xl font-bold transition-all"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleSave}
            disabled={!formData.name || !formData.clientId}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
          >
            <Save size={20} />
            {campaign ? 'Guardar Alterações' : 'Criar Campanha'}
          </button>
        </div>
      </div>
    </div>
  );
};
