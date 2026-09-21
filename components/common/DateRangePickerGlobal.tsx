import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { DateRange } from '../../types';

interface DateRangePickerGlobalProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  minimal?: boolean;
}

export const DateRangePickerGlobal: React.FC<DateRangePickerGlobalProps> = ({ value, onChange, minimal = false }) => {
  const options = [
    { label: 'Últimos 7 dias', days: 7 },
    { label: 'Últimos 30 dias', days: 30 },
    { label: 'Este mês', type: 'this_month' },
    { label: 'Mês passado', type: 'last_month' },
  ];

  const handleSelect = (opt: any) => {
    const end = new Date();
    let start = new Date();

    if (opt.days) {
      start.setDate(end.getDate() - opt.days);
    } else if (opt.type === 'this_month') {
      start = new Date(end.getFullYear(), end.getMonth(), 1);
    } else if (opt.type === 'last_month') {
      start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
      end.setDate(0); // Último dia do mês passado
    }

    onChange({ start, end, label: opt.label });
  };

  return (
    <div className="relative group">
      <button 
        className={
          minimal 
            ? "px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-sm font-semibold text-slate-700 transition-all flex items-center gap-2"
            : "flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        }
      >
        {!minimal && <Calendar size={16} className="text-blue-500" />}
        <span className={minimal ? "" : "font-medium"}>{value.label}</span>
        <ChevronDown size={14} className={minimal ? "" : "text-slate-400"} />
      </button>
      
      <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
        {options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => handleSelect(opt)}
            className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            {opt.label}
          </button>
        ))}
        <div className="border-t border-slate-100 my-1 pt-1">
          <button className="w-full text-left px-4 py-2.5 text-sm text-slate-400 rounded-lg">
            Personalizado...
          </button>
        </div>
      </div>
    </div>
  );
};