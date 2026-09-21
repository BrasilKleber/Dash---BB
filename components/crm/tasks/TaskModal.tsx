
import React, { useState, useEffect } from 'react';
import { 
  X, CheckSquare, MessageSquare, Send,
  Plus, Trash2, Save
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority, TaskType, Subtask, Comment } from '../../../types/crm';

interface TaskModalProps {
  task: Task | null;
  // Novos props opcionais para pré-preenchimento
  prefilledClientId?: string;
  prefilledClientName?: string;
  prefilledCampaignId?: string;
  prefilledCampaignName?: string;
  onSave: (task: Task) => void;
  onClose: () => void;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'doing', label: 'Em Progresso' },
  { value: 'review', label: 'Revisão Interna' },
  { value: 'client-review', label: 'Revisão Cliente' },
  { value: 'approved', label: 'Aprovado' },
  { value: 'done', label: 'Concluído' },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' },
];

const TYPE_OPTIONS: { value: TaskType; label: string }[] = [
  { value: 'landing-page', label: 'Landing Page' },
  { value: 'email', label: 'Email' },
  { value: 'video', label: 'Vídeo' },
  { value: 'copy', label: 'Copy' },
  { value: 'creative', label: 'Criativo' },
  { value: 'setup-tech', label: 'Setup Técnico' },
  { value: 'ads-launch', label: 'Lançamento Ads' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'other', label: 'Outro' },
];

export const TaskModal: React.FC<TaskModalProps> = ({ 
  task, 
  prefilledClientId,
  prefilledClientName,
  prefilledCampaignId,
  prefilledCampaignName,
  onSave, 
  onClose 
}) => {
  
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    clientId: prefilledClientId || '',
    clientName: prefilledClientName || '',
    campaignId: prefilledCampaignId || '',
    campaignName: prefilledCampaignName || '',
    type: 'other',
    status: 'todo',
    priority: 'medium',
    assignees: [],
    assigneeNames: [],
    finalDeadline: new Date(),
    subtasks: [],
    attachments: [],
    comments: [],
    tags: [],
    progress: 0,
    approvalWorkflow: {},
    timeTracking: {
      loggedHours: 0,
      logs: []
    }
  });
  
  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'subtasks' | 'workflow' | 'comments'>('details');
  
  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      // Aplica prefills se for nova tarefa
      setFormData(prev => ({
        ...prev,
        clientId: prefilledClientId || prev.clientId,
        clientName: prefilledClientName || prev.clientName,
        campaignId: prefilledCampaignId || prev.campaignId,
        campaignName: prefilledCampaignName || prev.campaignName
      }));
    }
  }, [task, prefilledClientId, prefilledClientName, prefilledCampaignId, prefilledCampaignName]);
  
  const handleSave = () => {
    const taskToSave: Task = {
      id: task?.id || Date.now().toString(),
      title: formData.title || '',
      description: formData.description,
      clientId: formData.clientId || '',
      clientName: formData.clientName || '',
      campaignId: formData.campaignId || '',
      campaignName: formData.campaignName || '',
      type: formData.type || 'other',
      status: formData.status || 'todo',
      priority: formData.priority || 'medium',
      assignees: formData.assignees || [],
      assigneeNames: formData.assigneeNames || [],
      createdAt: task?.createdAt || new Date(),
      finalDeadline: formData.finalDeadline || new Date(),
      subtasks: formData.subtasks || [],
      attachments: formData.attachments || [],
      comments: formData.comments || [],
      tags: formData.tags || [],
      progress: formData.progress || 0,
      approvalWorkflow: formData.approvalWorkflow || {},
      timeTracking: formData.timeTracking || { loggedHours: 0, logs: [] }
    };
    
    onSave(taskToSave);
  };
  
  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    
    const subtask: Subtask = {
      id: Date.now().toString(),
      title: newSubtask,
      completed: false
    };
    
    setFormData({
      ...formData,
      subtasks: [...(formData.subtasks || []), subtask]
    });
    setNewSubtask('');
  };
  
  const toggleSubtask = (subtaskId: string) => {
    setFormData({
      ...formData,
      subtasks: formData.subtasks?.map(st => 
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )
    });
  };
  
  const deleteSubtask = (subtaskId: string) => {
    setFormData({
      ...formData,
      subtasks: formData.subtasks?.filter(st => st.id !== subtaskId)
    });
  };
  
  const addComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: 'current-user', // Deve vir do contexto de autenticação
      authorName: 'Tu', // Deve vir do contexto
      content: newComment,
      createdAt: new Date()
    };
    
    setFormData({
      ...formData,
      comments: [...(formData.comments || []), comment]
    });
    setNewComment('');
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-all"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Detalhes
          </button>
          <button
            onClick={() => setActiveTab('subtasks')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'subtasks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Subtarefas ({formData.subtasks?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'workflow'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Aprovação
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'comments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Comentários ({formData.comments?.length || 0})
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          
          {/* Tab: Detalhes */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              
              {/* Título */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Título da Tarefa *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Landing Page Copy 1"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all text-sm font-medium"
                />
              </div>
              
              {/* Descrição */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalhes adicionais sobre a tarefa..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all resize-none text-sm"
                />
              </div>
              
              {/* Grid: Cliente + Campanha (Desabilitado se preenchido via props) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Cliente *
                  </label>
                  {prefilledClientId ? (
                    <input 
                      disabled
                      value={formData.clientName}
                      className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 rounded-xl text-slate-500 text-sm font-medium cursor-not-allowed"
                    />
                  ) : (
                    <select
                      value={formData.clientId}
                      onChange={(e) => {
                        const clientId = e.target.value;
                        const clientName = e.target.selectedOptions[0]?.text || '';
                        setFormData({ ...formData, clientId, clientName });
                      }}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 transition-all text-sm"
                    >
                      <option value="">Selecione...</option>
                      <option value="1">EcoCommerce Portugal</option>
                      <option value="2">TechStart Consulting</option>
                      <option value="3">FitLife Academy</option>
                    </select>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Campanha *
                  </label>
                  {prefilledCampaignId ? (
                    <input 
                      disabled
                      value={formData.campaignName}
                      className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 rounded-xl text-slate-500 text-sm font-medium cursor-not-allowed"
                    />
                  ) : (
                    <select
                      value={formData.campaignId}
                      onChange={(e) => {
                        const campaignId = e.target.value;
                        const campaignName = e.target.selectedOptions[0]?.text || '';
                        setFormData({ ...formData, campaignId, campaignName });
                      }}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 transition-all text-sm"
                    >
                      <option value="">Selecione...</option>
                      <option value="1">Lançamento Q1 2025</option>
                      <option value="2">Black Friday 2024</option>
                      <option value="3">Evergreen</option>
                    </select>
                  )}
                </div>
              </div>
              
              {/* Grid: Tipo + Estado + Prioridade */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as TaskType })}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 transition-all text-sm"
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
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 transition-all text-sm"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Prioridade
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 transition-all text-sm"
                  >
                    {PRIORITY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Deadline */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Deadline Final *
                </label>
                <input
                  type="date"
                  value={formData.finalDeadline instanceof Date ? formData.finalDeadline.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, finalDeadline: new Date(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 transition-all text-sm"
                />
              </div>
              
              {/* Link Material Final */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Link do Material Final
                </label>
                <input
                  type="url"
                  value={formData.finalMaterialLink || ''}
                  onChange={(e) => setFormData({ ...formData, finalMaterialLink: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 transition-all text-sm"
                />
              </div>
            </div>
          )}
          
          {/* Tab: Subtarefas */}
          {activeTab === 'subtasks' && (
            <div className="space-y-4">
              
              {/* Add Subtask */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
                  placeholder="Nova subtarefa..."
                  className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 transition-all text-sm"
                />
                <button
                  onClick={addSubtask}
                  className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              {/* Lista Subtarefas */}
              <div className="space-y-2">
                {formData.subtasks?.length === 0 ? (
                  <p className="text-center py-12 text-slate-400 text-sm">
                    Ainda não há subtarefas
                  </p>
                ) : (
                  formData.subtasks?.map(subtask => (
                    <div
                      key={subtask.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all group"
                    >
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => toggleSubtask(subtask.id)}
                        className="w-5 h-5 rounded border-2 border-slate-300 cursor-pointer text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {subtask.title}
                      </span>
                      <button
                        onClick={() => deleteSubtask(subtask.id)}
                        className="w-8 h-8 hover:bg-red-100 rounded-lg flex items-center justify-center text-red-500 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Tab: Workflow de Aprovação */}
          {activeTab === 'workflow' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <CheckSquare size={18} />
                  Workflow de Aprovação
                </h3>
                
                <div className="space-y-6">
                  {/* Enviado ao Cliente */}
                  {formData.approvalWorkflow?.sentToClient ? (
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <CheckSquare size={14} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Enviado ao Cliente</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formData.approvalWorkflow.sentToClient.date.toLocaleString('pt-PT')} por <span className="font-semibold text-slate-700">{formData.approvalWorkflow.sentToClient.sentByName}</span>
                        </p>
                      </div>
                    </div>
                  ) : (
                     <div className="flex items-start gap-4 opacity-50">
                      <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <Send size={14} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Por enviar ao Cliente</p>
                        <p className="text-xs text-slate-500 mt-1">Aguardando envio...</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Feedback Recebido */}
                  {formData.approvalWorkflow?.feedbackReceived && (
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <MessageSquare size={14} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm">Feedback Recebido</p>
                        <p className="text-xs text-slate-500 mb-2">
                          {formData.approvalWorkflow.feedbackReceived.date.toLocaleString('pt-PT')}
                        </p>
                        <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 italic">
                          "{formData.approvalWorkflow.feedbackReceived.feedback}"
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Alterações Feitas */}
                  {formData.approvalWorkflow?.revisionsMade && formData.approvalWorkflow.revisionsMade.length > 0 && (
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <CheckSquare size={14} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm mb-2">Histórico de Revisões</p>
                        <div className="space-y-2">
                          {formData.approvalWorkflow.revisionsMade.map((revision, i) => (
                            <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-slate-700">Versão {revision.version}</span>
                                <span className="text-slate-400">{revision.date.toLocaleDateString('pt-PT')}</span>
                              </div>
                              <p className="text-slate-600">por {revision.changedByName}</p>
                              {revision.notes && (
                                <p className="text-slate-500 mt-1 border-t border-slate-100 pt-1">{revision.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Aprovação Final */}
                  {formData.approvalWorkflow?.finalApproval && (
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <CheckSquare size={14} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-emerald-700 text-sm">Aprovação Final</p>
                        <p className="text-xs text-slate-600 mt-1">
                          {formData.approvalWorkflow.finalApproval.date.toLocaleString('pt-PT')} por <span className="font-semibold">{formData.approvalWorkflow.finalApproval.approvedByName}</span>
                        </p>
                        {formData.approvalWorkflow.finalApproval.comments && (
                          <p className="text-xs text-emerald-800 mt-2 bg-emerald-100/50 p-2 rounded border border-emerald-200">
                            {formData.approvalWorkflow.finalApproval.comments}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Tab: Comentários */}
          {activeTab === 'comments' && (
            <div className="space-y-4 h-full flex flex-col">
              
              {/* Lista Comentários */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {formData.comments?.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
                    <MessageSquare size={32} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">Ainda não há comentários</p>
                  </div>
                ) : (
                  formData.comments?.map(comment => (
                    <div key={comment.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                          {comment.authorName.charAt(0)}
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                          <p className="font-bold text-slate-900 text-xs">{comment.authorName}</p>
                          <p className="text-[10px] text-slate-400">
                            {comment.createdAt.toLocaleString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed pl-8">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
              
              {/* Add Comentário */}
              <div className="flex gap-2 border-t border-slate-100 pt-4 mt-auto">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escreve um comentário..."
                  rows={2}
                  className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 transition-all resize-none text-sm"
                />
                <button
                  onClick={addComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all h-auto flex items-center justify-center"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-5 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-bold transition-all text-sm"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleSave}
            disabled={!formData.title || !formData.clientId || !formData.campaignId}
            className="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg text-sm"
          >
            <Save size={18} />
            Guardar Tarefa
          </button>
        </div>
      </div>
    </div>
  );
};
