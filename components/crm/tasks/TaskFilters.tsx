import React from 'react';
import { X } from 'lucide-react';
import { TaskStatus } from '../../../types/crm';

interface TaskFiltersProps {
  filters: {
    clientIds: string[];
    campaignIds: string[];
    assigneeIds: string[];
    statuses: TaskStatus[];
    priorities: string[];
    types: string[];
  };
  onFiltersChange: (filters: any) => void;
  onClose: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose
}) => {
  
  const handleClearAll = () => {
    onFiltersChange({
      clientIds: [],
      campaignIds: [],
      assigneeIds: [],
      statuses: [],
      priorities: [],
      types: []
    });
  };
  
  const toggleFilter = (category: keyof typeof filters, value: string) => {
    const currentValues = filters[category] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...filters,
      [category]: newValues
    });
  };
  
  return (
    <div className="bg-white border-b border-slate-200 px-8 py-5 animate-in slide-in-from-top-2 duration-300 shadow-sm">
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
          Filtros Ativos
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={handleClearAll}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold uppercase tracking-wider hover:underline"
          >
            Limpar Tudo
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 hover:bg-slate-100 rounded-full flex items-center justify-center transition-all text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Estado */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Estado</p>
          <div className="space-y-2.5">
            {['todo', 'doing', 'review', 'client-review', 'approved', 'done'].map(status => (
              <label key={status} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  filters.statuses.includes(status as TaskStatus) 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-slate-300 group-hover:border-blue-400 bg-white'
                }`}>
                  {filters.statuses.includes(status as TaskStatus) && <X size={10} className="text-white rotate-45 stroke-[4px]" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={filters.statuses.includes(status as TaskStatus)}
                  onChange={() => toggleFilter('statuses', status)}
                />
                <span className={`text-sm font-medium ${filters.statuses.includes(status as TaskStatus) ? 'text-blue-600' : 'text-slate-600 group-hover:text-slate-900'}`}>
                  {status === 'todo' && 'To Do'}
                  {status === 'doing' && 'Em Progresso'}
                  {status === 'review' && 'Revisão Interna'}
                  {status === 'client-review' && 'Revisão Cliente'}
                  {status === 'approved' && 'Aprovado'}
                  {status === 'done' && 'Concluído'}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Prioridade */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Prioridade</p>
          <div className="space-y-2.5">
            {['urgent', 'high', 'medium', 'low'].map(priority => (
              <label key={priority} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  filters.priorities.includes(priority) 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-slate-300 group-hover:border-blue-400 bg-white'
                }`}>
                  {filters.priorities.includes(priority) && <X size={10} className="text-white rotate-45 stroke-[4px]" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={filters.priorities.includes(priority)}
                  onChange={() => toggleFilter('priorities', priority)}
                />
                <span className={`text-sm font-medium capitalize ${
                  priority === 'urgent' ? 'text-red-600' : 
                  priority === 'high' ? 'text-orange-600' : 
                  priority === 'medium' ? 'text-blue-600' : 'text-slate-600'
                }`}>
                  {priority === 'low' && 'Baixa'}
                  {priority === 'medium' && 'Média'}
                  {priority === 'high' && 'Alta'}
                  {priority === 'urgent' && 'Urgente'}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Cliente (Mock IDs) */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Cliente</p>
          <div className="space-y-2.5">
            {['c-1', 'c-2', 'c-3'].map(id => (
              <label key={id} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  filters.clientIds.includes(id) 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-slate-300 group-hover:border-blue-400 bg-white'
                }`}>
                  {filters.clientIds.includes(id) && <X size={10} className="text-white rotate-45 stroke-[4px]" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={filters.clientIds.includes(id)}
                  onChange={() => toggleFilter('clientIds', id)}
                />
                <span className={`text-sm font-medium ${filters.clientIds.includes(id) ? 'text-blue-600' : 'text-slate-600 group-hover:text-slate-900'}`}>
                  {id === 'c-1' && 'EcoCommerce Portugal'}
                  {id === 'c-2' && 'TechStart Consulting'}
                  {id === 'c-3' && 'FitLife Academy'}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Tipo */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tipo de Tarefa</p>
          <div className="space-y-2.5">
            {['landing-page', 'email', 'video', 'copy', 'creative', 'analytics'].map(type => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  filters.types.includes(type) 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-slate-300 group-hover:border-blue-400 bg-white'
                }`}>
                  {filters.types.includes(type) && <X size={10} className="text-white rotate-45 stroke-[4px]" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={filters.types.includes(type)}
                  onChange={() => toggleFilter('types', type)}
                />
                <span className={`text-sm font-medium capitalize ${filters.types.includes(type) ? 'text-blue-600' : 'text-slate-600 group-hover:text-slate-900'}`}>
                  {type.replace('-', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};