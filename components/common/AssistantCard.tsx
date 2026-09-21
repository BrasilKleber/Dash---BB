import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface AssistantCardProps {
  assistant: {
    name: string;
    description: string;
    icon: LucideIcon;
    gradient: string;
    examples: string[];
  };
  onClick: () => void;
}

export const AssistantCard: React.FC<AssistantCardProps> = ({ assistant, onClick }) => {
  const Icon = assistant.icon;
  
  return (
    <div 
      onClick={onClick}
      className="bg-slate-900 rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-slate-800 hover:border-slate-600 group shadow-lg flex flex-col h-full"
    >
      {/* Ícone */}
      <div className={`w-14 h-14 bg-gradient-to-br ${assistant.gradient} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-black/20`}>
        <Icon size={28} className="text-white" />
      </div>
      
      {/* Conteúdo */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
          {assistant.name}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
          {assistant.description}
        </p>
        
        {/* Exemplos (tags) */}
        <div className="flex flex-wrap gap-2 mb-6">
          {assistant.examples.slice(0, 3).map((example, i) => (
            <span key={i} className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-wide rounded-md">
              {example}
            </span>
          ))}
        </div>
      </div>
      
      {/* Botão */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={`w-full bg-gradient-to-r ${assistant.gradient} text-white py-3.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-white/5 transition-all flex items-center justify-center gap-2 group-hover:gap-3 mt-auto`}
      >
        Iniciar Conversa
        <ArrowRight size={16} strokeWidth={3} />
      </button>
    </div>
  );
};