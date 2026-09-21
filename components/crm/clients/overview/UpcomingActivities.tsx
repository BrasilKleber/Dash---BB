
import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { ClientActivity } from '../../../../types/clientHub';

interface Props {
  activities: ClientActivity[];
  clientId: string;
  onRefresh: () => void;
}

export const UpcomingActivities = ({ activities, clientId, onRefresh }: Props) => {
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'meeting': return '📅';
      case 'call': return '📞';
      case 'deadline': return '⏰';
      case 'task': return '✅';
      default: return '📌';
    }
  };
  
  // Formatador de data simples sem date-fns para evitar dependências
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
          <Calendar className="w-4 h-4 text-blue-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Próximas Atividades</h2>
      </div>
      
      <div className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8 font-medium">
            Nenhuma atividade agendada
          </p>
        ) : (
          activities.map(activity => (
            <div
              key={activity.id}
              className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all hover:border-blue-200 bg-white group"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl group-hover:scale-110 transition-transform">{getActivityIcon(activity.type)}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">{activity.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(activity.date)}
                    </span>
                    {activity.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {activity.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
