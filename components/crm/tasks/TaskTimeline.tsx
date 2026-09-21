import React from 'react';
import { Task } from '../../../types/crm';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

interface TaskTimelineProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const TaskTimeline: React.FC<TaskTimelineProps> = ({ tasks, onTaskClick }) => {
  
  // Agrupa tarefas por mês
  const tasksByMonth = tasks.reduce((acc, task) => {
    const deadline = new Date(task.finalDeadline);
    const month = deadline.toLocaleDateString('pt-PT', { 
      year: 'numeric', 
      month: 'long' 
    });
    
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
  
  // Ordenar chaves de mês cronologicamente (aproximação simples)
  const sortedMonths = Object.keys(tasksByMonth).sort((a, b) => {
    // Isso assume que o formato "long" é parseável ou consistente. 
    // Em produção idealmente usaríamos timestamps das chaves.
    return 0; // Mantém ordem de inserção se já vier ordenado do backend/filtro
  });

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50">
      <div className="max-w-4xl mx-auto pb-20">
        
        {sortedMonths.map((month) => (
          <div key={month} className="mb-12 animate-in slide-in-from-bottom-4 duration-500">
            
            {/* Month Header */}
            <div className="flex items-center gap-4 mb-8 sticky top-0 bg-slate-50 py-4 z-10 border-b border-slate-200/50 backdrop-blur-sm">
              <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                <Calendar size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 capitalize tracking-tight">{month}</h3>
                <p className="text-sm text-slate-500 font-medium">
                  {tasksByMonth[month].length} {tasksByMonth[month].length === 1 ? 'entrega planeada' : 'entregas planeadas'}
                </p>
              </div>
            </div>
            
            {/* Timeline */}
            <div className="relative border-l-2 border-slate-200 ml-6 space-y-8 pb-4">
              {tasksByMonth[month]
                .sort((a, b) => new Date(a.finalDeadline).getTime() - new Date(b.finalDeadline).getTime())
                .map((task, idx) => {
                  const isOverdue = new Date(task.finalDeadline) < new Date() && task.status !== 'done';
                  const isDone = task.status === 'done' || task.status === 'approved';
                  
                  return (
                    <div
                      key={task.id}
                      onClick={() => onTaskClick(task)}
                      className="relative pl-10 cursor-pointer group"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      {/* Dot Indicator */}
                      <div className={`absolute -left-[9px] top-6 w-5 h-5 rounded-full border-4 border-slate-50 transition-all duration-300 z-10 ${
                        isDone 
                          ? 'bg-emerald-500 group-hover:scale-110' 
                          : isOverdue 
                          ? 'bg-red-500 group-hover:scale-110' 
                          : 'bg-blue-500 group-hover:scale-110'
                      }`} />
                      
                      {/* Line Connector Highlight */}
                      <div className={`absolute left-[-2px] top-6 w-[2px] h-full transition-colors duration-300 ${
                        isDone ? 'bg-emerald-200' : 'bg-transparent'
                      }`} style={{ height: 'calc(100% + 32px)', zIndex: 0 }} />
                      
                      {/* Card */}
                      <div className={`bg-white rounded-xl border p-5 transition-all duration-200 relative overflow-hidden ${
                        isOverdue && !isDone
                          ? 'border-red-200 shadow-sm hover:shadow-md hover:border-red-300'
                          : isDone
                          ? 'border-emerald-100 shadow-sm opacity-80 hover:opacity-100 hover:border-emerald-300'
                          : 'border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300'
                      }`}>
                        {/* Status Stripe */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                           isDone ? 'bg-emerald-500' : isOverdue ? 'bg-red-500' : 'bg-blue-500'
                        }`} />

                        <div className="flex items-start justify-between mb-3 pl-2">
                          <div className="flex-1 pr-4">
                            <div className="flex items-center gap-2 mb-1">
                              {isOverdue && !isDone && <AlertCircle size={14} className="text-red-500" />}
                              <h4 className={`font-bold text-base ${isDone ? 'text-slate-600 line-through decoration-slate-300' : 'text-slate-900'}`}>
                                {task.title}
                              </h4>
                            </div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                              {task.clientName} • {task.campaignName}
                            </p>
                          </div>
                          
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                            task.priority === 'urgent' 
                              ? 'bg-red-50 text-red-600 border border-red-100'
                              : task.priority === 'high'
                              ? 'bg-orange-50 text-orange-600 border border-orange-100'
                              : 'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between pl-2 mt-4 pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-2 text-slate-500">
                            <Clock size={14} />
                            <span className={`text-xs font-bold ${
                              isOverdue && !isDone ? 'text-red-600' : 'text-slate-600'
                            }`}>
                              {new Date(task.finalDeadline).toLocaleDateString('pt-PT', {
                                day: '2-digit',
                                month: 'short'
                              })}
                            </span>
                          </div>
                          
                          <div className="flex -space-x-2">
                            {task.assigneeNames.slice(0, 3).map((name, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 bg-white rounded-full border border-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600 shadow-sm"
                                title={name}
                              >
                                {name.charAt(0)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-32 opacity-50">
            <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-500">Sem tarefas para mostrar na timeline</p>
          </div>
        )}
      </div>
    </div>
  );
};