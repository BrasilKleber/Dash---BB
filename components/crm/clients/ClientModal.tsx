
import React, { useState, useEffect } from 'react';
import { Client } from '../../../types/crm';
import { X, Save, Building2, User, Mail, Phone, Target } from 'lucide-react';

interface ClientModalProps {
  client: Client | null;
  onSave: (client: Client) => void;
  onClose: () => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({ client, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    industry: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    niche: '',
    market: '',
    tone: '',
    objective: '',
    targetAudience: '',
    status: 'active',
    campaigns: []
  });

  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: client?.id || '',
      ...formData as Client,
      createdAt: client?.createdAt || new Date(),
      updatedAt: new Date()
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{client ? 'Editar Cliente' : 'Novo Cliente'}</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">Preencha os detalhes da conta.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-all text-slate-500">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="space-y-8">
            
            {/* Dados da Empresa */}
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Building2 size={14} /> Empresa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nome da Empresa *</label>
                  <input
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                    placeholder="Ex: EcoCommerce Portugal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Indústria</label>
                  <input
                    value={formData.industry}
                    onChange={e => setFormData({...formData, industry: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-all text-sm"
                    placeholder="Ex: E-commerce"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-all text-sm cursor-pointer"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="paused">Pausado</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Contacto */}
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <User size={14} /> Contacto Principal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nome do Contacto</label>
                  <input
                    value={formData.contactName}
                    onChange={e => setFormData({...formData, contactName: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-all text-sm"
                    placeholder="Ex: Maria Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-all text-sm"
                      placeholder="maria@exemplo.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Telefone</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={e => setFormData({...formData, contactPhone: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-all text-sm"
                      placeholder="+351..."
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Contexto Estratégico */}
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Target size={14} /> Contexto Estratégico (IA)
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Objetivo Principal</label>
                  <input
                    value={formData.objective}
                    onChange={e => setFormData({...formData, objective: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-all text-sm"
                    placeholder="Ex: Aumentar vendas em 30%"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nicho de Mercado</label>
                    <input
                      value={formData.niche}
                      onChange={e => setFormData({...formData, niche: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tom de Voz</label>
                    <input
                      value={formData.tone}
                      onChange={e => setFormData({...formData, tone: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white pb-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold transition-all text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all shadow-lg text-sm flex items-center gap-2"
            >
              <Save size={18} />
              Guardar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
