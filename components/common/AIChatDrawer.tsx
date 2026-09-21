import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Send, Loader2, Copy, Sparkles, User, 
  Paperclip, Mic, RotateCcw, ChevronDown, Info
} from 'lucide-react';
import { ChatMessage, Assistant } from '../../types';
import { aiService } from '../../services/aiService';

interface ClientContext {
  id: string;
  name: string;
  niche: string;
  market: string;
  tone: string;
  objective: string;
  targetAudience: string;
}

interface AssistantChatDrawerProps {
  assistant: Assistant;
  onClose: () => void;
}

export const AssistantChatDrawer: React.FC<AssistantChatDrawerProps> = ({ 
  assistant, 
  onClose 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showClientInfo, setShowClientInfo] = useState(true);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Dados de exemplo do cliente (depois virá de props ou state global)
  const selectedClient: ClientContext = {
    id: '1',
    name: 'EcoCommerce Portugal',
    niche: 'E-commerce de produtos sustentáveis',
    market: 'Portugal / Espanha',
    tone: 'Profissional mas acessível, com foco em sustentabilidade',
    objective: 'Aumentar vendas em 30% no Q1 2025',
    targetAudience: 'Millennials e Gen Z eco-conscientes, 25-40 anos'
  };
  
  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);
  
  // Focus no input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);
  
  const buildContextPrompt = () => {
    return `
CONTEXTO DO CLIENTE:
- Nome: ${selectedClient.name}
- Nicho: ${selectedClient.niche}
- Mercado: ${selectedClient.market}
- Tom de voz: ${selectedClient.tone}
- Objetivo: ${selectedClient.objective}
- Público-alvo: ${selectedClient.targetAudience}

Usa estas informações para personalizar todas as respostas.
`;
  };
  
  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isGenerating) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);
    
    try {
      const contextualPrompt = assistant.systemPrompt + '\n\n' + buildContextPrompt();
      
      const historyForAI = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));
      
      const responseText = await aiService.chatWithSpecialist(contextualPrompt, historyForAI);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Erro:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Erro ao gerar resposta. Tenta novamente.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleRegenerate = () => {
    if (messages.length < 2) return;
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      setMessages(prev => prev.slice(0, -1));
      handleSend(lastUserMessage.content);
    }
  };
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-3/5 xl:w-1/2 bg-white shadow-2xl z-50 flex animate-slide-in-right">
        
        {/* Painel lateral de contexto */}
        {showClientInfo && (
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto flex-shrink-0 custom-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Contexto Cliente
              </h3>
              <button 
                onClick={() => setShowClientInfo(false)}
                className="w-6 h-6 hover:bg-slate-200 rounded transition-all flex items-center justify-center"
                title="Ocultar painel"
              >
                <ChevronDown size={14} className="text-slate-400 rotate-90" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Cliente</p>
                <p className="text-sm font-bold text-slate-900">{selectedClient.name}</p>
              </div>
              
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Nicho</p>
                <p className="text-xs text-slate-700 leading-relaxed">{selectedClient.niche}</p>
              </div>
              
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Mercado</p>
                <p className="text-xs text-slate-700">{selectedClient.market}</p>
              </div>
              
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tom de Voz</p>
                <p className="text-xs text-slate-700 leading-relaxed">{selectedClient.tone}</p>
              </div>
              
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Objetivo</p>
                <p className="text-xs text-slate-700 leading-relaxed">{selectedClient.objective}</p>
              </div>
              
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Público-Alvo</p>
                <p className="text-xs text-slate-700 leading-relaxed">{selectedClient.targetAudience}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Área principal do chat */}
        <div className="flex-1 flex flex-col">
          
          {/* Header */}
          <div className={`bg-gradient-to-r ${assistant.gradient} px-6 py-5`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <Sparkles size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">{assistant.name}</h2>
                  <p className="text-xs text-white/80 font-medium">Powered by Gemini 3.0 Pro</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {!showClientInfo && (
                  <button
                    onClick={() => setShowClientInfo(true)}
                    className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
                    title="Mostrar contexto"
                  >
                    <Info size={18} className="text-white" />
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Sugestões rápidas */}
          {messages.length === 0 && (
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-widest">
                Experimenta estas perguntas:
              </p>
              <div className="flex flex-wrap gap-2">
                {assistant.examples.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(example)}
                    className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-all"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Mensagens */}
          <div 
            ref={chatRef}
            className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-gradient-to-b from-white to-slate-50/50 custom-scrollbar"
          >
            {messages.length === 0 && (
              <div className="text-center py-12 opacity-60">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={28} className="text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">
                  Como posso ajudar-te com {selectedClient.name}?
                </p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in group`}
              >
                {msg.role === 'assistant' && (
                  <div className={`w-8 h-8 bg-gradient-to-br ${assistant.gradient} rounded-lg flex items-center justify-center mr-3 flex-shrink-0 shadow-sm text-white`}>
                    <Sparkles size={14} />
                  </div>
                )}
                
                <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                  msg.role === 'user'
                    ? `bg-gradient-to-r ${assistant.gradient} text-white rounded-tr-none`
                    : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none'
                }`}>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>
                  
                  <div className={`flex items-center justify-between mt-3 pt-3 border-t ${msg.role === 'user' ? 'border-white/20' : 'border-slate-100'}`}>
                    <span className={`text-[10px] ${msg.role === 'user' ? 'opacity-80' : 'text-slate-400'}`}>
                      {msg.timestamp.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigator.clipboard.writeText(msg.content)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded transition-all text-slate-400 hover:text-slate-600"
                          title="Copiar"
                        >
                          <Copy size={12} />
                        </button>
                        
                        {idx === messages.length - 1 && (
                          <button
                            onClick={handleRegenerate}
                            className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded transition-all text-slate-400 hover:text-slate-600"
                            title="Regenerar resposta"
                          >
                            <RotateCcw size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center ml-3 flex-shrink-0 shadow-sm text-white">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}
            
            {isGenerating && (
              <div className="flex justify-start">
                <div className={`w-8 h-8 bg-gradient-to-br ${assistant.gradient} rounded-lg flex items-center justify-center mr-3 opacity-50`}>
                  <Sparkles size={14} className="text-white" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-2 rounded-tl-none shadow-sm">
                  <Loader2 size={16} className="animate-spin text-slate-400" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">A pensar...</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Input área - BEM POSICIONADA COM PADDING GENEROSO */}
          <div className="px-6 py-6 bg-white border-t border-slate-200">
            <div className="flex gap-3 items-end">
              {/* Botões de ferramentas laterais */}
              <div className="flex flex-col gap-2">
                <button
                  className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all"
                  title="Anexar ficheiro"
                >
                  <Paperclip size={18} />
                </button>
                
                <button
                  className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all"
                  title="Gravar áudio"
                >
                  <Mic size={18} />
                </button>
              </div>
              
              {/* Textarea com auto-resize */}
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Escreve a tua pergunta... (Enter para enviar)"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 rounded-xl outline-none resize-none text-sm transition-all custom-scrollbar placeholder:text-slate-400 text-slate-900"
                  rows={1}
                  style={{ minHeight: '48px' }}
                />
                
                {/* Contador de caracteres */}
                {input.length > 0 && (
                  <span className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-semibold">
                    {input.length}/2000
                  </span>
                )}
              </div>
              
              {/* Botão enviar */}
              <button
                onClick={() => handleSend()}
                disabled={isGenerating || !input.trim()}
                className={`w-12 h-12 flex items-center justify-center bg-gradient-to-r ${assistant.gradient} text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:scale-105 active:scale-95 flex-shrink-0 shadow-md`}
              >
                {isGenerating ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
            
            {/* Dicas de atalhos */}
            <p className="text-[10px] text-slate-400 mt-3 text-center font-medium">
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono text-[9px]">Enter</kbd> envia · 
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono text-[9px] ml-1">Shift+Enter</kbd> nova linha
            </p>
          </div>
        </div>
      </div>
    </>
  );
};