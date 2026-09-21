
import React from 'react';
import { Task } from '../../../types/crm';
import { 
  CheckCircle2, Circle, Calendar
} from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

const STATUS_LABELS: Record<string, string> = {
  'todo': 'To Do',
  'doing': 'Em Progresso',
  'review': 'Revisão Interna',
  'client-review': 'Revisão Cliente',
  'approved': 'Aprovado',
  'done': 'Concluído'
};

const STATUS_COLORS: Record<string, string> = {
  'todo': 'bg-slate-100 text-slate-700',
  'doing': 'bg-blue-100 text-blue-700',
  'review': 'bg-purple-100 text-purple-700',
  'client-review': 'bg-orange-100 text-orange-700',
  'approved': 'bg-green-100 text-green-700',
  'done': 'bg-emerald-100 text-emerald-700'
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-slate-500',
  medium: 'text-blue-600',
  high: 'text-orange-600',
  urgent: 'text-red-600 font-bold'
};

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskClick
}) => {
  
  // Ordenação simples por deadline por defeito
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.finalDeadline).getTime() - new Date(b.finalDeadline).getTime());
  
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 m-6 overflow-hidden">
      
      {/* Table Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
        <div className="grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-1 flex items-center">
            Status
          </div>
          <div className="col-span-4">Tarefa</div>
          <div className="col-span-2">Cliente</div>
          <div className="col-span-2">Campanha</div>
          <div className="col-span-1">Resp.</div>
          <div className="col-span-1">Prior.</div>
          <div className="col-span-1">Deadline</div>
        </div>
      </div>
      
      {/* Table Body */}
      <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            Sem tarefas para mostrar
          </div>
        ) : (
          sortedTasks.map(task => {
            const isOverdue = new Date(task.finalDeadline) < new Date() && task.status !== 'done';
            const deadline = new Date(task.finalDeadline);
            
            return (
              <div
                key={task.id}
                onClick={() => onTaskClick(task)}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 hover:bg-blue-50/50 transition-all cursor-pointer group items-center"
              >
                {/* Status Icon */}
                <div className="col-span-1">
                  {task.status === 'done' ? (
                    <CheckCircle2 size={20} className="text-emerald-500" />
                  ) : (
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit ${STATUS_COLORS[task.status]}`}>
                      {STATUS_LABELS[task.status].split(' ')[0]}
                    </div>
                  )}
                </div>
                
                {/* Tarefa */}
                <div className="col-span-4">
                  <p className="font-semibold text-slate-900 text-sm">
                    {task.title}
                  </p>
                  {task.subtasks.length > 0 && (
                    <p className="text-xs text-slate-500 mt-1">
                      {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtarefas
                    </p>
                  )}
                </div>
                
                {/* Cliente */}
                <div className="col-span-2">
                  <p className="text-sm font-medium text-slate-700">
                    {task.clientName}
                  </p>
                </div>
                
                {/* Campanha */}
                <div className="col-span-2">
                  <p className="text-sm text-slate-500">
                    {task.campaignName}
                  </p>
                </div>
                
                {/* Responsável */}
                <div className="col-span-1">
                  <div className="flex -space-x-2">
                    {task.assigneeNames.slice(0, 2).map((name, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                        title={name}
                      >
                        {name.charAt(0)}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Prioridade */}
                <div className="col-span-1">
                  <span className={`text-xs font-semibold ${PRIORITY_COLORS[task.priority]}`}>
                    {task.priority === 'urgent' && '🔥 '}
                    {task.priority.toUpperCase()}
                  </span>
                </div>
                
                {/* Deadline */}
                <div className="col-span-1">
                  <div className={`flex items-center gap-2 text-xs font-semibold ${
                    isOverdue ? 'text-red-600' : 'text-slate-600'
                  }`}>
                    <Calendar size={14} />
                    <span>
                      {deadline.toLocaleDateString('pt-PT', { 
                        day: '2-digit', 
                        month: 'short' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
