
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Rocket, CheckSquare, AlertCircle,
  ClipboardList, ArrowRight, TrendingUp
} from 'lucide-react';
import { crmService } from '../../../services/crmService';
import { CRMStats, Task, Client, Campaign } from '../../../types/crm';
import { StatsCard } from '../shared/StatsCard';

interface CRMDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

type TaskFilter = 'all' | 'mine' | 'overdue' | 'thisweek';

export const CRMDashboard: React.FC<CRMDashboardProps> = ({ onNavigate }) => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  useEffect(() => {
    filterTasks();
  }, [taskFilter, allTasks]);
  
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [tasksData, clientsData, campaignsData] = await Promise.all([
        crmService.getTasks(),
        crmService.getClients(),
        crmService.getCampaigns()
      ]);
      
      setAllTasks(tasksData.filter(t => t.status !== 'done'));
      setClients(clientsData);
      setCampaigns(campaignsData.filter(c => c.status === 'active' || c.status === 'planning'));
      
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = useMemo<CRMStats>(() => {
    const overdueCount = allTasks.filter(t => new Date(t.finalDeadline) < new Date()).length;
    
    return {
      totalClients: clients.length,
      activeClients: clients.filter(c => c.status === 'active').length,
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.length,
      totalTasks: allTasks.length,
      completedTasks: 0,
      overdueTasks: overdueCount
    };
  }, [clients, campaigns, allTasks]);
  
  const filterTasks = () => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    let filtered = [...allTasks];
    
    switch (taskFilter) {
      case 'mine':
        filtered = filtered.filter(t => t.assignees.includes('1'));
        break;
      case 'overdue':
        filtered = filtered.filter(t => new Date(t.finalDeadline) < now);
        break;
      case 'thisweek':
        filtered = filtered.filter(t => new Date(t.finalDeadline) <= sevenDaysFromNow);
        break;
      default:
        break;
    }
    
    filtered.sort((a, b) => new Date(a.finalDeadline).getTime() - new Date(b.finalDeadline).getTime());
    setFilteredTasks(filtered);
  };
  
  const getDeadlineInfo = (deadlineInput: Date | string) => {
    const deadline = new Date(deadlineInput);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return {
        label: `ATRASADA ${Math.abs(diffDays)} DIAS`,
        color: 'bg-red-100 text-red-600',
        isOverdue: true
      };
    } else if (diffDays === 0) {
      return {
        label: 'HOJE',
        color: 'bg-orange-100 text-orange-600',
        isOverdue: false
      };
    } else if (diffDays <= 3) {
      return {
        label: `${diffDays} DIAS`,
        color: 'bg-orange-100 text-orange-600',
        isOverdue: false
      };
    } else {
      return {
        label: `${diffDays} DIAS`,
        color: 'bg-slate-100 text-slate-600',
        isOverdue: false
      };
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">A carregar dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto h-full">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
            <ClipboardList size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview CRM</h1>
            <p className="text-sm text-slate-600 mt-1 font-medium">Visão geral do teu negócio e operações.</p>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            onClick={() => onNavigate('crm-clients')}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-105 transition-transform">
              <Users size={20} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900">{stats.totalClients}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Clientes</p>
            <p className="text-xs text-slate-400 mt-1">{stats.activeClients} ativos</p>
          </div>
          
          <div 
            onClick={() => onNavigate('crm-campaigns')}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-105 transition-transform">
              <Rocket size={20} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900">{stats.totalCampaigns}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Campanhas</p>
            <p className="text-xs text-slate-400 mt-1">Em curso</p>
          </div>
          
          <div 
            onClick={() => onNavigate('crm-tasks')}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-green-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-105 transition-transform">
              <CheckSquare size={20} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900">{stats.totalTasks}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Tarefas Ativas</p>
            <p className="text-xs text-slate-400 mt-1">Por concluir</p>
          </div>
          
          <div 
            onClick={() => onNavigate('crm-tasks')}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-red-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-105 transition-transform">
              <AlertCircle size={20} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900">{stats.overdueTasks}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Atrasadas</p>
            <p className="text-xs text-slate-400 mt-1">Requerem atenção</p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="px-8 pb-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column - Tarefas (2/3) */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full min-h-[500px]">
            {/* Header Tarefas */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <CheckSquare size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Tarefas</h2>
                  <p className="text-xs text-slate-500 font-medium">{filteredTasks.length} tarefas ativas</p>
                </div>
              </div>
              
              <div className="flex bg-slate-50 p-1 rounded-lg">
                <button onClick={() => setTaskFilter('all')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${taskFilter === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}>Todas</button>
                <button onClick={() => setTaskFilter('mine')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${taskFilter === 'mine' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}>Minhas</button>
                <button onClick={() => setTaskFilter('overdue')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${taskFilter === 'overdue' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500 hover:text-slate-900'}`}>Atrasadas</button>
                <button onClick={() => setTaskFilter('thisweek')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${taskFilter === 'thisweek' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}>Esta Semana</button>
              </div>
            </div>
            
            {/* Lista de Tarefas */}
            <div className="p-6 space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <CheckSquare size={32} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm font-medium">Nenhuma tarefa encontrada.</p>
                </div>
              ) : (
                filteredTasks.map(task => {
                  const deadlineInfo = getDeadlineInfo(task.finalDeadline);
                  const progressPercent = task.subtasks.length > 0 
                    ? (task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100 
                    : task.progress;

                  return (
                    <div key={task.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{task.title}</h4>
                          <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[9px] font-bold uppercase rounded border border-orange-200">
                            {task.priority === 'urgent' ? 'Urgente' : 'High'}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${deadlineInfo.color}`}>
                          {deadlineInfo.label}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-500 font-medium mb-3">
                        <span className="font-bold text-slate-700">{task.clientName}</span> • {task.campaignName}
                      </p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <div className="text-[10px] font-bold text-slate-400">
                          {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                        </div>
                        
                        <div className="flex -space-x-1.5">
                          {task.assigneeNames.length > 0 ? (
                            task.assigneeNames.slice(0, 2).map((name, i) => (
                              <div key={i} className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white border border-white" title={name}>
                                {name.charAt(0)}
                              </div>
                            ))
                          ) : (
                            <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-[9px] font-bold text-slate-500 border border-white">?</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column (1/3) */}
        <div className="space-y-6">
          
          {/* Widget Clientes */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <Users size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Clientes</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{clients.length} Total</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('crm-clients')}
                className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-blue-800 flex items-center gap-1"
              >
                Ver Todos <ArrowRight size={12} />
              </button>
            </div>
            
            <div className="space-y-4">
              {clients.slice(0, 3).map(client => (
                <div 
                  key={client.id}
                  onClick={() => onNavigate('crm-client-detail', { clientId: client.id })}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                    {client.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs truncate">{client.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">{client.industry}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Widget Campanhas */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                  <Rocket size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Campanhas Ativas</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{campaigns.length} em curso</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('crm-campaigns')}
                className="text-[10px] font-bold text-purple-600 uppercase tracking-widest hover:text-purple-800 flex items-center gap-1"
              >
                Ver Todas <ArrowRight size={12} />
              </button>
            </div>
            
            <div className="space-y-4">
              {campaigns.slice(0, 3).map(campaign => (
                <div 
                  key={campaign.id}
                  onClick={() => onNavigate('crm-campaign-detail', { campaignId: campaign.id })}
                  className="p-3 border border-slate-100 rounded-xl hover:border-purple-200 hover:shadow-sm transition-all cursor-pointer bg-white"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white shadow-sm flex-shrink-0">
                      <Rocket size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs truncate">{campaign.name}</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider truncate">{campaign.clientName}</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1 mt-1">
                    <div 
                      className="h-1 bg-purple-500 rounded-full" 
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className="text-[9px] font-bold text-purple-600">{campaign.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
