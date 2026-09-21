
import React from 'react';
import { CheckSquare } from 'lucide-react';

interface Props {
  tasks: any[];
  clientId: string;
  onRefresh: () => void;
}

export const PendingTasks = ({ tasks, clientId, onRefresh }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
          <CheckSquare className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Tarefas Pendentes</h3>
      </div>
      
      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckSquare className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-xs text-slate-500 font-medium">Tudo em dia!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task, idx) => (
            <div key={idx} className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-all bg-slate-50/50">
              <p className="text-xs font-bold text-slate-700">{task.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
