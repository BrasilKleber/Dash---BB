
import React, { useState, useEffect } from 'react';
import { 
  Edit, Plus, Calendar, DollarSign, 
  Target, TrendingUp, LayoutGrid, List, Clock, Settings
} from 'lucide-react';
import { Campaign, Task, TaskStatus, KanbanColumn, DEFAULT_KANBAN_COLUMNS } from '../../../types/crm';
import { crmService } from '../../../services/crmService';
import { Breadcrumb } from '../shared/Breadcrumb';
import { TaskKanban } from '../tasks/TaskKanban';
import { TaskList } from '../tasks/TaskList';
import { TaskTimeline } from '../tasks/TaskTimeline';
import { TaskModal } from '../tasks/TaskModal';
import { ColumnManager } from '../tasks/ColumnManager';

interface CampaignDetailPageProps {
  campaignId: string;
  onNavigate: (page: any, params?: any) => void;
}

type TabType = 'overview' | 'tasks';
type ViewMode = 'kanban' | 'list' | 'timeline';

export const CampaignDetailPage: React.FC<CampaignDetailPageProps> = ({ 
  campaignId, 
  onNavigate 
}) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>(DEFAULT_KANBAN_COLUMNS);
  const [showColumnManager, setShowColumnManager] = useState(false);
  
  // Filtros simples (expansível futuramente)
  const [filters] = useState({
    assigneeIds: [] as string[],
    statuses: [] as TaskStatus[],
    priorities: [] as string[],
    types: [] as string[]
  });
  
  useEffect(() => {
    loadCampaignData();
    
    // Load custom columns if available
    const savedColumns = crmService.getKanbanColumns(campaignId);
    if (savedColumns.length > 0) {
      setKanbanColumns(savedColumns);
    } else {
      setKanbanColumns(DEFAULT_KANBAN_COLUMNS);
    }
  }, [campaignId]);
  
  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);
  
  const loadCampaignData = async () => {
    setIsLoading(true);
    try {
      const [campaignData, allTasks] = await Promise.all([
        crmService.getCampaignById(campaignId),
        crmService.getTasks()
      ]);
      
      if (campaignData) {
        setCampaign(campaignData);
        // Filtra tarefas desta campanha
        const campaignTasks = allTasks.filter(t => t.campaignId === campaignId);
        setTasks(campaignTasks);
      }
    } catch (error) {
      console.error('Erro ao carregar campanha:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFilters = () => {
    let filtered = [...tasks];
    
    if (filters.assigneeIds.length > 0) {
      filtered = filtered.filter(task => 
        task.assignees.some(assignee => filters.assigneeIds.includes(assignee))
      );
    }
    
    if (filters.statuses.length > 0) {
      filtered = filtered.filter(task => filters.statuses.includes(task.status));
    }
    
    if (filters.priorities.length > 0) {
      filtered = filtered.filter(task => filters.priorities.includes(task.priority));
    }
    
    if (filters.types.length > 0) {
      filtered = filtered.filter(task => filters.types.includes(task.type));
    }
    
    setFilteredTasks(filtered);
  };
  
  const handleCreateTask = () => {
    setSelectedTask(null);
    setShowTaskModal(true);
  };
  
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };
  
  const handleSaveTask = async (task: Task) => {
    // Auto-preenche campanha e cliente se disponíveis
    if (campaign) {
      task.campaignId = campaign.id;
      task.campaignName = campaign.name;
      task.clientId = campaign.clientId;
      task.clientName = campaign.clientName;
    }
    
    if (selectedTask) {
      await crmService.updateTask(task);
    } else {
      await crmService.createTask(task);
    }
    
    loadCampaignData();
    setShowTaskModal(false);
  };
  
  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Tens a certeza que queres eliminar esta tarefa?')) {
      await crmService.deleteTask(taskId);
      loadCampaignData();
    }
  };
  
  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    await crmService.updateTaskStatus(taskId, newStatus);
    loadCampaignData();
  };
  
  const handleUpdateColumns = (columns: KanbanColumn[]) => {
    setKanbanColumns(columns);
    crmService.saveKanbanColumns(campaignId, columns);
  };
  
  if (isLoading || !campaign) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">A carregar campanha...</p>
        </div>
      </div>
    );
  }
  
  const STATUS_COLORS: Record<string, string> = {
    planning: 'bg-blue-100 text-blue-700 border-blue-200',
    active: 'bg-green-100 text-green-700 border-green-200',
    completed: 'bg-slate-100 text-slate-700 border-slate-200',
    paused: 'bg-orange-100 text-orange-700 border-orange-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200'
  };
  
  const STATUS_LABELS: Record<string, string> = {
    planning: 'Planeamento',
    active: 'Ativa',
    completed: 'Concluída',
    paused: 'Pausada',
    cancelled: 'Cancelada'
  };
  
  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <Breadcrumb
          items={[
            { label: 'CRM', onClick: () => onNavigate('crm-dashboard') },
            { label: 'Clientes', onClick: () => onNavigate('crm-clients') },
            { label: campaign.clientName, onClick: () => onNavigate('crm-client-detail', { clientId: campaign.clientId }) },
            { label: campaign.name }
          ]}
        />
        
        <div className="flex items-start justify-between mt-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{campaign.name}</h1>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${STATUS_COLORS[campaign.status]}`}>
                {STATUS_LABELS[campaign.status]}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">
              Tipo: <span className="text-slate-900 capitalize">{campaign.type}</span>
            </p>
          </div>
          
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-all uppercase tracking-wide">
            <Edit size={14} />
            Editar
          </button>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-8">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Calendar size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Lançamento</span>
            </div>
            <p className="text-sm font-bold text-slate-900">
              {campaign.dates.launchDate ? new Date(campaign.dates.launchDate).toLocaleDateString('pt-PT') : 'Sem data'}
            </p>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <DollarSign size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Budget</span>
            </div>
            <p className="text-sm font-bold text-slate-900">
              {campaign.budget ? `${campaign.budget.toLocaleString('pt-PT')}€` : 'N/D'}
            </p>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Target size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Tarefas</span>
            </div>
            <p className="text-sm font-bold text-slate-900">
              {tasks.filter(t => t.status === 'done').length}/{tasks.length} concluídas
            </p>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <TrendingUp size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Progresso</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{campaign.progress}%</p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-8">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-4 font-bold text-sm border-b-2 transition-all uppercase tracking-wide ${
              activeTab === 'tasks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Tarefas ({tasks.length})
          </button>
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 font-bold text-sm border-b-2 transition-all uppercase tracking-wide ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Visão Geral
          </button>
        </div>
      </div>
      
      {/* Content */}
      {activeTab === 'overview' && (
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Objetivos */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2 text-xs uppercase tracking-widest border-b border-slate-100 pb-4">
                <Target size={16} className="text-purple-500" />
                Objetivos da Campanha
              </h3>
              {campaign.objectives.length > 0 ? (
                <ul className="space-y-4">
                  {campaign.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-4 p-3 bg-slate-50 rounded-xl">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        <span className="text-[10px] font-bold text-purple-700">{i + 1}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-700">{obj}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 text-sm italic">Sem objetivos definidos.</p>
              )}
            </div>
            
            {/* KPIs */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2 text-xs uppercase tracking-widest border-b border-slate-100 pb-4">
                <TrendingUp size={16} className="text-green-500" />
                Indicadores Chave
              </h3>
              {campaign.kpis.length > 0 ? (
                <div className="space-y-5">
                  {campaign.kpis.map((kpi, i) => {
                    const percentage = kpi.current ? (kpi.current / kpi.target) * 100 : 0;
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{kpi.metric}</span>
                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {kpi.current || 0} / {kpi.target}
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all shadow-sm"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">Sem KPIs definidos.</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'tasks' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Toolbar */}
          <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm z-10">
            <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-2 rounded-md transition-all flex items-center gap-2 ${
                  viewMode === 'kanban' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Kanban"
              >
                <LayoutGrid size={16} />
                <span className="text-xs font-bold uppercase tracking-wider hidden md:inline">Kanban</span>
              </button>
              
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md transition-all flex items-center gap-2 ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Lista"
              >
                <List size={16} />
                <span className="text-xs font-bold uppercase tracking-wider hidden md:inline">Lista</span>
              </button>
              
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-2 rounded-md transition-all flex items-center gap-2 ${
                  viewMode === 'timeline' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Timeline"
              >
                <Clock size={16} />
                <span className="text-xs font-bold uppercase tracking-wider hidden md:inline">Timeline</span>
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              {viewMode === 'kanban' && (
                <button
                  onClick={() => setShowColumnManager(true)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-all uppercase tracking-wide"
                >
                  <Settings size={16} />
                  Configurar Colunas
                </button>
              )}
              
              <button
                onClick={handleCreateTask}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95 uppercase tracking-wide"
              >
                <Plus size={16} />
                Nova Tarefa
              </button>
            </div>
          </div>
          
          {/* Tasks View */}
          <div className="flex-1 overflow-hidden bg-slate-50 relative">
            {viewMode === 'kanban' && (
              <TaskKanban
                tasks={filteredTasks}
                columns={kanbanColumns}
                onTaskClick={handleEditTask}
                onTaskStatusChange={handleUpdateTaskStatus}
              />
            )}
            
            {viewMode === 'list' && (
              <TaskList
                tasks={filteredTasks}
                onTaskClick={handleEditTask}
                onTaskDelete={handleDeleteTask}
              />
            )}
            
            {viewMode === 'timeline' && (
              <TaskTimeline
                tasks={filteredTasks}
                onTaskClick={handleEditTask}
              />
            )}
          </div>
        </div>
      )}
      
      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          // @ts-ignore - props adicionadas na atualização do TaskModal
          prefilledCampaignId={campaignId}
          prefilledClientId={campaign.clientId}
          prefilledCampaignName={campaign.name}
          prefilledClientName={campaign.clientName}
          onSave={handleSaveTask}
          onClose={() => setShowTaskModal(false)}
        />
      )}
      
      {/* Column Manager Modal */}
      {showColumnManager && (
        <ColumnManager
          columns={kanbanColumns}
          onUpdateColumns={handleUpdateColumns}
          onClose={() => setShowColumnManager(false)}
        />
      )}
    </div>
  );
};
