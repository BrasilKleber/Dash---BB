
import React from 'react';
import { Task, TaskStatus, KanbanColumn } from '../../../types/crm';
import { TaskCard } from './TaskCard';

interface TaskKanbanProps {
  tasks: Task[];
  columns: KanbanColumn[];
  onTaskClick: (task: Task) => void;
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export const TaskKanban: React.FC<TaskKanbanProps> = ({
  tasks,
  columns,
  onTaskClick,
  onTaskStatusChange
}) => {
  
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onTaskStatusChange(taskId, status);
    }
  };
  
  // Ordena colunas por order
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
  
  return (
    <div className="flex gap-4 p-6 h-full overflow-x-auto">
      {sortedColumns.map(column => {
        const columnTasks = tasks.filter(task => task.status === column.status);
        
        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-80 flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            {/* Column Header */}
            <div 
              className="rounded-t-xl px-4 py-3 flex items-center justify-between border-2"
              style={{ 
                backgroundColor: `${column.color}20`, // 20% opacity
                borderColor: `${column.color}40`
              }}
            >
              <h3 
                className="font-bold text-sm uppercase tracking-wider"
                style={{ color: column.color }}
              >
                {column.label}
              </h3>
              <span 
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ 
                  backgroundColor: `${column.color}30`,
                  color: column.color
                }}
              >
                {columnTasks.length}
              </span>
            </div>
            
            {/* Cards */}
            <div className="flex-1 bg-slate-100/50 border-2 border-slate-200 border-t-0 rounded-b-xl p-3 space-y-3 overflow-y-auto custom-scrollbar">
              {columnTasks.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  Sem tarefas
                </div>
              ) : (
                columnTasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={() => onTaskClick(task)}
                    className="cursor-pointer"
                  >
                    <TaskCard task={task} />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
