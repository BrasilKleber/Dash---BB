
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  color: 'blue' | 'purple' | 'green' | 'red' | 'orange';
  onClick?: () => void;
}

const COLOR_CLASSES = {
  blue: 'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-purple-600',
  green: 'from-green-500 to-green-600',
  red: 'from-red-500 to-red-600',
  orange: 'from-orange-500 to-orange-600'
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border-2 border-slate-200 p-6 ${
        onClick ? 'cursor-pointer hover:border-blue-300 hover:shadow-lg transition-all' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${COLOR_CLASSES[color]} rounded-xl flex items-center justify-center shadow-md`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      
      <h3 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">{value}</h3>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
    </div>
  );
};
