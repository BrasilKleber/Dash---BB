import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Sparkles, User, Bot } from 'lucide-react';
import { aiService } from '../../services/aiService';

interface AssistantChatModalProps {
  assistant: {
    name: string;
    systemPrompt: string;
    gradient: string;
    icon: React.ElementType;
  };
  onClose: () => void;
}

export const AssistantChatModal: React.FC<AssistantChatModalProps> = ({ assistant, onClose }) => {
  const [messages, setMessages] = useState<Array<{role: string; content: string}>>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const Icon = assistant.icon;
  
  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    
    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput('');
    setIsGenerating(true);
    
    try {
      // Usa o serviço centralizado com Google Gemini em vez de fetch direto
      const responseText = await aiService.chatWithSpecialist(assistant.systemPrompt, newMessages);
      
      const aiMsg = { role: 'assistant', content: responseText };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Erro ao chamar IA:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Ocorreu um erro ao processar o pedido. Por favor tenta novamente." }]);
    } finally {
      setIsGenerating(false);
    }
  };
  
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);
  
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className={`bg-gradient-to-r ${assistant.gradient} p-6 text-white flex items-center justify-between shadow-md`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-inner">
              <Icon size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{assistant.name}</h2>
              <div className="flex items-center gap-2 opacity-90">
                <Sparkles size={12} />
                <p className="text-xs font-medium uppercase tracking-widest">Bluebolt Intelligence • Gemini 3.0 Pro</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all active:scale-95"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        
        {/* Chat Area */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 p-10">
              <Icon size={64} className="mb-4 text-slate-400" />
              <p className="text-lg font-medium text-slate-500">Como posso ajudar na tua estratégia hoje?</p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-slate-200 text-slate-600' 
                    : `bg-gradient-to-br ${assistant.gradient} text-white`
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble */}
                <div className={`p-5 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-white text-slate-700 border border-slate-200 rounded-tr-none' 
                    : 'bg-white text-slate-800 border-l-4 border-slate-100 rounded-tl-none shadow-md'
                }`}
                style={msg.role === 'assistant' ? { borderLeftColor: 'transparent' } : {}}
                >
                   {msg.content}
                </div>
              </div>
            </div>
          ))}
          
          {isGenerating && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm rounded-tl-none ml-11">
                <Loader2 size={18} className="animate-spin text-brand" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">A estruturar resposta...</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <div className="p-5 border-t border-slate-200 bg-white">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Descreve o que precisas..."
              disabled={isGenerating}
              className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all font-medium"
            />
            <button
              onClick={handleSend}
              disabled={isGenerating || !input.trim()}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                input.trim() 
                  ? `bg-gradient-to-r ${assistant.gradient} text-white hover:shadow-md active:scale-95` 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-400 font-medium mt-3">
            O assistente pode cometer erros. Revê sempre o conteúdo gerado antes de publicar.
          </p>
        </div>
      </div>
    </div>
  );
};