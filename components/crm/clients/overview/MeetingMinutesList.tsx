
import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { MeetingMinutes } from '../../../../types/clientHub';

interface Props {
  meetings: MeetingMinutes[];
  clientId: string;
  onRefresh: () => void;
}

export const MeetingMinutesList = ({ meetings, clientId, onRefresh }: Props) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Atas de Reuniões ({meetings.length})</h2>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all text-xs font-bold uppercase tracking-wider">
          <Plus className="w-3 h-3" />
          Nova Ata
        </button>
      </div>
      
      {meetings.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8 font-medium">Nenhuma ata registrada</p>
      ) : (
        <div className="space-y-4">
          {meetings.map(meeting => (
            <div key={meeting.id} className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-all bg-slate-50/30">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-slate-900 text-sm">{meeting.title}</h3>
                <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                  {formatDate(meeting.date)}
                </span>
              </div>
              
              {/* Tópicos */}
              {meeting.topics.length > 0 && (
                <div className="mt-3 bg-white p-3 rounded-lg border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tópicos</p>
                  <ul className="text-xs text-slate-600 space-y-1 pl-1">
                    {meeting.topics.map((topic, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Action Items */}
              {meeting.action_items.length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">
                    Action Items: {meeting.action_items.filter(a => a.status === 'done').length}/{meeting.action_items.length}
                  </p>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${(meeting.action_items.filter(a => a.status === 'done').length / meeting.action_items.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
