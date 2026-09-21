import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, List, Calendar, Filter, Plus, Search,
  Download
} from 'lucide-react';
import { Task, TaskStatus, DEFAULT_KANBAN_COLUMNS } from '../../../types/crm';
import { TaskKanban } from './TaskKanban';
import { TaskList } from './TaskList';
import { TaskTimeline } from './TaskTimeline';
import { TaskFilters } from './TaskFilters';
import { TaskModal } from './TaskModal';
import { crmService } from '../../../services/crmService';

type ViewMode = 'kanban' | 'list' | 'timeline';

export const TasksPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtros
  const [filters, setFilters] = useState({
    clientIds: [] as string[],
    campaignIds: [] as string[],
    assigneeIds: [] as string[],
    statuses: [] as TaskStatus[],
    priorities: [] as string[],
    types: [] as string[],
  });
  
  // Carregar tarefas
  useEffect(() => {
    loadTasks();
  }, []);
  
  // Aplicar filtros
  useEffect(() => {
    applyFilters();
  }, [tasks, filters, searchQuery]);
  
  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const loadedTasks = await crmService.getTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFilters = () => {
    let filtered = [...tasks];
    
    // Search
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filtros
    if (filters.clientIds.length > 0) {
      filtered = filtered.filter(task => filters.clientIds.includes(task.clientId));
    }
    
    if (filters.campaignIds.length > 0) {
      filtered = filtered.filter(task => filters.campaignIds.includes(task.campaignId));
    }
    
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
    if (selectedTask) {
      await crmService.updateTask(task);
    } else {
      await crmService.createTask(task);
    }
    loadTasks();
    setShowTaskModal(false);
  };
  
  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Tens a certeza que queres eliminar esta tarefa?')) {
      await crmService.deleteTask(taskId);
      loadTasks();
    }
  };
  
  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    await crmService.updateTaskStatus(taskId, newStatus);
    loadTasks();
  };
  
  const handleExport = () => {
    crmService.exportTasks(filteredTasks);
  };
  
  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Checklist de Tarefas</h1>
            <p className="text-sm text-slate-600 mt-1">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'tarefa' : 'tarefas'}
              {tasks.length !== filteredTasks.length && ` de ${tasks.length} total`}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <Download size={18} />
              Exportar
            </button>
            
            <button
              onClick={handleCreateTask}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Plus size={20} />
              Nova Tarefa
            </button>
          </div>
        </div>
        
        {/* Barra de ferramentas */}
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar tarefas, clientes, campanhas..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all font-medium"
            />
          </div>
          
          <div className="flex items-center gap-3">
            {/* Filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
                showFilters 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter size={18} />
              Filtros
              {(filters.clientIds.length + filters.campaignIds.length + filters.statuses.length) > 0 && (
                <span className="w-5 h-5 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                  {filters.clientIds.length + filters.campaignIds.length + filters.statuses.length}
                </span>
              )}
            </button>
            
            {/* View Mode */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  viewMode === 'kanban' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Kanban"
              >
                <LayoutGrid size={18} />
              </button>
              
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Lista"
              >
                <List size={18} />
              </button>
              
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  viewMode === 'timeline' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Timeline"
              >
                <Calendar size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filtros (colapsável) */}
      {showFilters && (
        <TaskFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
      
      {/* Conteúdo principal */}
      <div className="flex-1 overflow-hidden relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 z-10">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">A carregar tarefas...</p>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'kanban' && (
              <TaskKanban
                tasks={filteredTasks}
                columns={DEFAULT_KANBAN_COLUMNS}
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
          </>
        )}
      </div>
      
      {/* Modal de Tarefa */}
      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          onSave={handleSaveTask}
          onClose={() => setShowTaskModal(false)}
        />
      )}
    </div>
  );
};