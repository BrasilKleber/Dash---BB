
import React from 'react';
import { AlertCircle, TrendingDown, Calendar, Clock, Star, ClipboardList, AlertTriangle } from 'lucide-react';
import { Alert } from '../../types/operations';

interface Props {
  alerts: Alert[];
}

export const CriticalAlerts = ({ alerts }: Props) => {
  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'low_roas': return <TrendingDown className="w-5 h-5" />;
      case 'contract_expired':
      case 'contract_renewal_critical': return <AlertCircle className="w-5 h-5" />;
      case 'contract_renewal_urgent': return <AlertTriangle className="w-5 h-5" />;
      case 'contract_action_required': return <ClipboardList className="w-5 h-5" />;
      case 'contract_golden_period': return <Star className="w-5 h-5" />;
      case 'campaign_delayed':
      case 'campaign_stalled': return <Clock className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };
  
  const getAlertColor = (type: string, severity: string) => {
    if (type === 'contract_golden_period') return 'blue';
    if (type === 'contract_action_required') return 'yellow';
    if (type === 'contract_renewal_urgent') return 'orange';
    if (severity === 'critical') return 'red';
    return 'gray';
  };
  
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle className="w-6 h-6 text-slate-800" />
        <h2 className="text-xl font-bold text-slate-900">
          Alertas de Gestão ({alerts.length})
        </h2>
      </div>
      
      <div className="space-y-4">
        {alerts.map(alert => {
          const color = getAlertColor(alert.type, alert.severity);
          
          let borderColor = 'border-l-slate-400';
          let iconColor = 'text-slate-600';
          let bgColor = 'bg-slate-50';
          
          if (color === 'red') {
            borderColor = 'border-l-red-500';
            iconColor = 'text-red-600';
            bgColor = 'bg-red-50/50';
          } else if (color === 'orange') {
            borderColor = 'border-l-orange-500';
            iconColor = 'text-orange-600';
            bgColor = 'bg-orange-50/50';
          } else if (color === 'yellow') {
            borderColor = 'border-l-yellow-500';
            iconColor = 'text-yellow-600';
            bgColor = 'bg-yellow-50/50';
          } else if (color === 'blue') {
            borderColor = 'border-l-blue-500';
            iconColor = 'text-blue-600';
            bgColor = 'bg-blue-50/50';
          }

          return (
            <div 
              key={alert.id}
              className={`rounded-lg p-5 border-l-4 shadow-sm hover:shadow-md transition-all ${borderColor} ${bgColor} border-t border-r border-b border-slate-100`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Content */}
                <div className="flex gap-4 flex-1">
                  <div className={`${iconColor} mt-1`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-base">
                        {alert.clientName}
                      </h3>
                      {alert.type === 'contract_golden_period' && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded-full">
                          Prazo de Ouro
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm font-semibold text-slate-800 mb-1">
                      {alert.title}
                    </p>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      {alert.description}
                    </p>
                    
                    {alert.metric && (
                      <div className="flex flex-wrap gap-3 mb-3">
                        <span className="inline-flex items-center text-xs bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
                          <span className="text-slate-500 mr-2">{alert.metric.label}:</span>
                          <span className="font-bold text-slate-900">{alert.metric.value}</span>
                        </span>
                      </div>
                    )}
                    
                    <div className={`mt-2 text-xs p-2 rounded-md font-medium inline-block border ${
                      color === 'red' ? 'bg-red-100 text-red-800 border-red-200' :
                      color === 'orange' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                      color === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      color === 'blue' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      'bg-slate-100 text-slate-800 border-slate-200'
                    }`}>
                      <strong>Ação:</strong> {alert.actionRequired}
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex flex-col gap-2 min-w-[140px]">
                  {alert.quickActions?.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={action.action}
                      className={`
                        px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm
                        ${action.variant === 'primary' 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : action.variant === 'danger'
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'}
                      `}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
