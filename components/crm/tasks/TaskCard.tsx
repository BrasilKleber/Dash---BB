
import React from 'react';
import { Task } from '../../../types/crm';
import { 
  Calendar, Paperclip, MessageSquare, 
  AlertCircle
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700'
};

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente'
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  
  const isOverdue = new Date(task.finalDeadline) < new Date() && task.status !== 'done';
  const daysUntilDeadline = Math.ceil(
    (new Date(task.finalDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  
  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:shadow-md transition-all p-4">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-bold text-slate-900 text-sm leading-tight flex-1 pr-2">
          {task.title}
        </h4>
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${PRIORITY_COLORS[task.priority]}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>
      
      {/* Cliente + Campanha */}
      <div className="mb-3 space-y-1">
        <p className="text-xs font-semibold text-slate-700">
          {task.clientName}
        </p>
        <p className="text-xs text-slate-500">
          {task.campaignName}
        </p>
      </div>
      
      {/* Deadline */}
      <div className={`flex items-center gap-2 mb-3 text-xs font-semibold ${
        isOverdue ? 'text-red-600' : daysUntilDeadline <= 2 ? 'text-orange-600' : 'text-slate-600'
      }`}>
        {isOverdue ? (
          <AlertCircle size={14} />
        ) : (
          <Calendar size={14} />
        )}
        <span>
          {isOverdue 
            ? `Atrasada ${Math.abs(daysUntilDeadline)} dias`
            : daysUntilDeadline === 0
            ? 'Hoje'
            : daysUntilDeadline === 1
            ? 'Amanhã'
            : `${daysUntilDeadline} dias`
          }
        </span>
      </div>
      
      {/* Progresso */}
      {task.subtasks.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span className="font-semibold">Progresso</span>
            <span>{completedSubtasks}/{task.subtasks.length}</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${(completedSubtasks / task.subtasks.length) * 100}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        {/* Assignees */}
        <div className="flex -space-x-2">
          {task.assigneeNames.slice(0, 3).map((name, i) => (
            <div
              key={i}
              className="w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm"
              title={name}
            >
              {name.charAt(0)}
            </div>
          ))}
          {task.assigneeNames.length > 3 && (
            <div className="w-7 h-7 bg-slate-300 rounded-full border-2 border-white flex items-center justify-center text-slate-700 text-xs font-bold">
              +{task.assigneeNames.length - 3}
            </div>
          )}
        </div>
        
        {/* Indicators */}
        <div className="flex items-center gap-2 text-slate-400">
          {task.attachments.length > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <Paperclip size={14} />
              <span>{task.attachments.length}</span>
            </div>
          )}
          
          {task.comments.length > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <MessageSquare size={14} />
              <span>{task.comments.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
