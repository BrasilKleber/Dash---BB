
import React from 'react';
import { FileText, Plus, ChevronRight } from 'lucide-react';
import { MeetingMinutesCompact } from '../../../../types/clientHub';

interface Props {
  meetings: MeetingMinutesCompact[];
  clientId: string;
  onRefresh: () => void;
}

export const MeetingMinutesCompactWidget = ({ meetings, clientId, onRefresh }: Props) => {
  const completionPercentage = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Atas</h3>
        </div>
        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
          {meetings.length}
        </span>
      </div>
      
      <button className="w-full mb-4 px-4 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
        <Plus className="w-3 h-3" />
        Nova Ata
      </button>
      
      {meetings.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-10 h-10 text-slate-200 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-medium">Nenhuma ata registrada</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
          {meetings.map(meeting => {
            const completion = completionPercentage(
              meeting.action_items_completed, 
              meeting.action_items_total
            );
            
            return (
              <div 
                key={meeting.id}
                className="border border-slate-200 rounded-xl p-3 hover:shadow-sm hover:border-blue-300 transition-all cursor-pointer bg-white group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 truncate pr-2 group-hover:text-blue-600 transition-colors">
                      {meeting.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      {formatDate(new Date(meeting.date))}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                </div>
                
                {/* Tópicos */}
                {meeting.key_topics.length > 0 && (
                  <div className="mb-3">
                    <ul className="text-[10px] text-slate-600 space-y-1">
                      {meeting.key_topics.slice(0, 3).map((topic, idx) => (
                        <li key={idx} className="truncate flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-slate-300 rounded-full flex-shrink-0"></span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Action Items Progress */}
                {meeting.action_items_total > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="font-bold text-slate-500 uppercase tracking-wider">Action Items</span>
                      <span className="font-bold text-slate-700">
                        {meeting.action_items_completed}/{meeting.action_items_total}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full transition-all ${
                          completion === 100 ? 'bg-green-500' :
                          completion >= 50 ? 'bg-blue-500' :
                          'bg-orange-400'
                        }`}
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {meetings.length > 0 && (
        <button className="w-full mt-3 text-xs text-blue-600 hover:text-blue-800 font-bold uppercase tracking-wider text-center py-2 hover:bg-blue-50 rounded-lg transition-all">
          Ver Todas as Atas
        </button>
      )}
    </div>
  );
};
