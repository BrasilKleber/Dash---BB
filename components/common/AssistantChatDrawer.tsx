import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Send, Loader2, Copy, Sparkles, User, 
  Paperclip, Mic, RotateCcw, Info, ChevronDown,
  Maximize2, Minimize2, MessageSquare, Trash2, Clock
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

interface ChatHistory {
  id: string;
  clientId: string;
  clientName: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
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
  const [selectedClient, setSelectedClient] = useState<ClientContext | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Lista de clientes
  const clients: ClientContext[] = [
    {
      id: '1',
      name: 'EcoCommerce Portugal',
      niche: 'E-commerce de produtos sustentáveis',
      market: 'Portugal / Espanha',
      tone: 'Profissional mas acessível, com foco em sustentabilidade',
      objective: 'Aumentar vendas em 30% no Q1 2025',
      targetAudience: 'Millennials e Gen Z eco-conscientes, 25-40 anos'
    },
    {
      id: '2',
      name: 'TechStart Consulting',
      niche: 'Consultoria em transformação digital',
      market: 'B2B - PMEs portuguesas',
      tone: 'Técnico mas didático, autoridade no setor',
      objective: 'Gerar 50 leads qualificados/mês',
      targetAudience: 'CEOs e CTOs de PMEs, 10-50 colaboradores'
    },
    {
      id: '3',
      name: 'FitLife Academy',
      niche: 'Treinos online personalizados',
      market: 'Portugal, Brasil',
      tone: 'Motivacional, energético, próximo',
      objective: 'Lançar programa premium a 297€',
      targetAudience: 'Mulheres 30-45 anos, vida sedentária'
    }
  ];
  
  // Carregar histórico de chats ao abrir
  useEffect(() => {
    loadAllChatHistories();
  }, [assistant.id]);
  
  // Carregar chat quando seleciona cliente
  useEffect(() => {
    if (selectedClient) {
      const savedChat = loadChatHistory(assistant.id, selectedClient.id);
      if (savedChat.length > 0) {
        setMessages(savedChat);
      } else {
        const welcomeMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: getInitialPrompt(selectedClient),
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
        saveChatHistory(assistant.id, selectedClient.id, [welcomeMessage]);
      }
    }
  }, [selectedClient, assistant.id]);
  
  // Salvar quando mensagens mudam
  useEffect(() => {
    if (selectedClient && messages.length > 0) {
      saveChatHistory(assistant.id, selectedClient.id, messages);
      loadAllChatHistories(); // Atualiza lista de históricos
    }
  }, [messages, selectedClient, assistant.id]);
  
  // Persistência
  const saveChatHistory = (assistantId: string, clientId: string, msgs: ChatMessage[]) => {
    const key = `chat_${assistantId}_${clientId}`;
    localStorage.setItem(key, JSON.stringify(msgs));
  };
  
  const loadChatHistory = (assistantId: string, clientId: string): ChatMessage[] => {
    const key = `chat_${assistantId}_${clientId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  };
  
  const loadAllChatHistories = () => {
    const histories: ChatHistory[] = [];
    
    clients.forEach(client => {
      const key = `chat_${assistant.id}_${client.id}`;
      const saved = localStorage.getItem(key);
      
      if (saved) {
        try {
          const msgs: ChatMessage[] = JSON.parse(saved);
          if (msgs.length > 0) {
            const lastMsg = msgs[msgs.length - 1];
            histories.push({
              id: key,
              clientId: client.id,
              clientName: client.name,
              lastMessage: lastMsg.content.substring(0, 60) + (lastMsg.content.length > 60 ? '...' : ''),
              timestamp: new Date(lastMsg.timestamp),
              messageCount: msgs.length
            });
          }
        } catch (e) {
          // Ignora erros
        }
      }
    });
    
    // Ordena por data (mais recente primeiro)
    histories.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setChatHistories(histories);
  };
  
  const clearChatHistory = () => {
    if (selectedClient) {
      const key = `chat_${assistant.id}_${selectedClient.id}`;
      localStorage.removeItem(key);
      setMessages([]);
      loadAllChatHistories();
      
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: getInitialPrompt(selectedClient),
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };
  
  const deleteHistory = (historyId: string) => {
    localStorage.removeItem(historyId);
    loadAllChatHistories();
  };
  
  const loadHistoryById = (history: ChatHistory) => {
    const client = clients.find(c => c.id === history.clientId);
    if (client) {
      setSelectedClient(client);
      setShowHistory(false);
    }
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
  }, [selectedClient]);
  
  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);
  
  const getInitialPrompt = (client: ClientContext): string => {
    const assistantIntros: Record<string, string> = {
      'offer-creator': `Perfeito! Vamos criar uma oferta irresistível para **${client.name}**.

Para criar a melhor proposta, preciso de alguns detalhes:

1️⃣ **Qual é o produto/serviço específico** que vais oferecer?
2️⃣ **Preço pretendido** ou faixa de preço?
3️⃣ **Principal benefício** ou diferencial desta oferta?

Partilha essas informações e vou criar uma oferta estruturada pronta a usar! 🚀`,
      
      'carousel-writer': `Ótimo! Vamos criar um carrossel viral para **${client.name}**.

Para o melhor resultado, diz-me:

1️⃣ **Qual é o tema** do carrossel?
2️⃣ **Objetivo principal**: Educar? Gerar leads? Viralizar?
3️⃣ **CTA final**: Onde queres direcionar as pessoas?

Com isso, crio 10 slides prontos com sugestões visuais! 📱`,
      
      'nano-banana': `Vamos criar ganchos visuais de alto impacto para **${client.name}**! 🎯

Para criar os melhores hooks:

1️⃣ **Tipo de conteúdo**: Anúncio? VSL? Orgânico?
2️⃣ **Produto/serviço** a promover
3️⃣ **Emoção target**: Curiosidade? Urgência? FOMO?

Vou criar 3 variações com descrição frame-a-frame! 🎬`,
      
      'email-copywriter': `Vamos escrever emails de alta conversão para **${client.name}**! ✉️

Diz-me:

1️⃣ **Tipo de sequência**: Boas-vindas? Lançamento? Re-engajamento?
2️⃣ **Objetivo**: Vender? Educar? Agendar call?
3️⃣ **Quantos emails** pretendes?

Crio todos completos, prontos para copiar! 📧`,
      
      'video-scriptwriter': `Vamos criar roteiros matadores para **${client.name}**! 🎥

Para o melhor resultado:

1️⃣ **Tipo de vídeo**: VSL? Ad curto? Educativo?
2️⃣ **Duração pretendida**
3️⃣ **Objetivo**: Vender? Gerar leads? Educar?

Entrego roteiro completo com timings e visuais! 🎬`,
      
      'strategist': `Vamos planear uma campanha completa para **${client.name}**! 📊

Preciso de contexto:

1️⃣ **Tipo de campanha**: Lançamento? Evergreen? Sazonal?
2️⃣ **Budget disponível**
3️⃣ **Timeline**: Quando começa?

Crio plano completo com budget, timeline e KPIs! 🚀`
    };
    
    return assistantIntros[assistant.id] || `Olá! Como posso ajudar-te com **${client.name}**?`;
  };
  
  const buildContextPrompt = (): string => {
    if (!selectedClient) return '';
    
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
      
      {/* Container */}
      <div className={`fixed z-50 flex items-center justify-center transition-all duration-300 ${
        isMaximized ? 'inset-0 p-0' : 'inset-0 p-4'
      }`}>
        <div className={`bg-white shadow-2xl flex transition-all duration-300 ${
          isMaximized 
            ? 'w-full h-full rounded-none' 
            : 'rounded-2xl w-full max-w-4xl h-[85vh]'
        } animate-in zoom-in`}>
          
          {/* Sidebar de histórico */}
          {showHistory && (
            <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Histórico de Conversas
                </h3>
                <p className="text-xs text-slate-500">
                  {chatHistories.length} conversas guardadas
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {chatHistories.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare size={32} className="text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">Ainda não há conversas guardadas</p>
                  </div>
                ) : (
                  chatHistories.map((history) => (
                    <div
                      key={history.id}
                      className="bg-white rounded-lg p-3 border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
                      onClick={() => loadHistoryById(history)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-xs font-bold text-slate-900">{history.clientName}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHistory(history.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center hover:bg-red-50 rounded text-red-500"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-2">
                        {history.lastMessage}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {history.timestamp.toLocaleString('pt-PT', { 
                            day: '2-digit', 
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span>{history.messageCount} msgs</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Área principal */}
          <div className="flex-1 flex flex-col">
            
            {/* Header */}
            <div className={`bg-gradient-to-r ${assistant.gradient} px-6 py-5 ${isMaximized ? '' : 'rounded-t-2xl'}`}>
              <div className="flex items-center justify-between mb-4">
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
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className={`w-9 h-9 ${showHistory ? 'bg-white/30' : 'bg-white/20'} hover:bg-white/30 rounded-lg flex items-center justify-center transition-all`}
                    title="Histórico"
                  >
                    <MessageSquare size={18} className="text-white" />
                  </button>
                  
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
                    title={isMaximized ? "Restaurar" : "Maximizar"}
                  >
                    {isMaximized ? (
                      <Minimize2 size={18} className="text-white" />
                    ) : (
                      <Maximize2 size={18} className="text-white" />
                    )}
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
                  >
                    <X size={18} className="text-white" />
                  </button>
                </div>
              </div>
              
              {/* Dropdown */}
              <div className="flex items-center gap-2">
                <div className="relative" style={{ maxWidth: '400px', width: '100%' }}>
                  <select
                    value={selectedClient?.id || ''}
                    onChange={(e) => {
                      const client = clients.find(c => c.id === e.target.value);
                      setSelectedClient(client || null);
                    }}
                    className="w-full bg-white/10 backdrop-blur-md border-2 border-white/20 text-white text-sm font-semibold rounded-xl px-4 py-3 outline-none appearance-none cursor-pointer hover:bg-white/15 transition-all"
                  >
                    <option value="" className="text-slate-900">Selecione o cliente...</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id} className="text-slate-900 font-semibold">
                        {client.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 pointer-events-none" />
                </div>
                
                {selectedClient && (
                  <>
                    <button
                      onClick={() => setShowClientModal(true)}
                      className="w-11 h-11 bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded-xl flex items-center justify-center transition-all"
                      title="Ver detalhes"
                    >
                      <Info size={18} className="text-white" />
                    </button>
                    
                    <button
                      onClick={clearChatHistory}
                      className="w-11 h-11 bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded-xl flex items-center justify-center transition-all"
                      title="Limpar conversa"
                    >
                      <RotateCcw size={18} className="text-white" />
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* Mensagens */}
            <div 
              ref={chatRef}
              className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-gradient-to-b from-slate-50 to-white custom-scrollbar"
            >
              {!selectedClient ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles size={36} className="text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    Olá! 👋
                  </h3>
                  <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                    Seleciona um cliente no dropdown acima para começarmos.
                  </p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in group`}
                  >
                    {msg.role === 'assistant' && (
                      <div className={`w-9 h-9 bg-gradient-to-br ${assistant.gradient} rounded-xl flex items-center justify-center mr-3 flex-shrink-0 shadow-md text-white`}>
                        <Sparkles size={16} />
                      </div>
                    )}
                    
                    <div className={`max-w-[75%] rounded-2xl p-5 shadow-sm ${
                      msg.role === 'user'
                        ? `bg-gradient-to-r ${assistant.gradient} text-white rounded-tr-md`
                        : 'bg-white border-2 border-slate-200 text-slate-900 rounded-tl-md'
                    }`}>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>
                      
                      <div className={`flex items-center justify-between mt-4 pt-4 border-t ${msg.role === 'user' ? 'border-white/20' : 'border-slate-100'}`}>
                        <span className={`text-[10px] font-semibold ${msg.role === 'user' ? 'opacity-70' : 'text-slate-400'}`}>
                          {msg.timestamp.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => navigator.clipboard.writeText(msg.content)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-all text-slate-400 hover:text-slate-600"
                              title="Copiar"
                            >
                              <Copy size={14} />
                            </button>
                            
                            {idx === messages.length - 1 && (
                              <button
                                onClick={handleRegenerate}
                                className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-all text-slate-400 hover:text-slate-600"
                                title="Regenerar"
                              >
                                <RotateCcw size={14} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {msg.role === 'user' && (
                      <div className="w-9 h-9 bg-slate-700 rounded-xl flex items-center justify-center ml-3 flex-shrink-0 shadow-md text-white">
                        <User size={16} />
                      </div>
                    )}
                  </div>
                ))
              )}
              
              {isGenerating && (
                <div className="flex justify-start">
                  <div className={`w-9 h-9 bg-gradient-to-br ${assistant.gradient} rounded-xl flex items-center justify-center mr-3 opacity-60`}>
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 flex items-center gap-3 rounded-tl-md shadow-sm">
                    <Loader2 size={18} className="animate-spin text-slate-400" />
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">A pensar...</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input */}
            <div className={`px-8 py-6 bg-white border-t-2 border-slate-100 ${isMaximized ? '' : 'rounded-b-2xl'}`}>
              <div className="flex gap-3 items-end">
                <div className="flex flex-col gap-2">
                  <button
                    disabled={!selectedClient}
                    className="w-11 h-11 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Paperclip size={19} />
                  </button>
                  
                  <button
                    disabled={!selectedClient}
                    className="w-11 h-11 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Mic size={19} />
                  </button>
                </div>
                
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && selectedClient) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={selectedClient ? "Escreve aqui... (Enter para enviar)" : "Seleciona um cliente primeiro"}
                    disabled={!selectedClient}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 rounded-xl outline-none resize-none text-sm transition-all custom-scrollbar placeholder:text-slate-400 text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    rows={1}
                    style={{ minHeight: '56px' }}
                  />
                  
                  {input.length > 0 && (
                    <span className="absolute bottom-3 right-4 text-[10px] text-slate-400 font-bold">
                      {input.length}/2000
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => handleSend()}
                  disabled={isGenerating || !input.trim() || !selectedClient}
                  className={`w-14 h-14 flex items-center justify-center bg-gradient-to-r ${assistant.gradient} text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-xl hover:scale-105 active:scale-95 flex-shrink-0 shadow-lg`}
                >
                  {isGenerating ? (
                    <Loader2 size={22} className="animate-spin" />
                  ) : (
                    <Send size={22} />
                  )}
                </button>
              </div>
              
              <p className="text-[11px] text-slate-400 mt-3 text-center font-medium">
                <kbd className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-mono text-[10px]">Enter</kbd> envia · 
                <kbd className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-mono text-[10px] ml-1">Shift+Enter</kbd> nova linha
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal info cliente */}
      {showClientModal && selectedClient && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowClientModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Informações do Cliente</h3>
              <button
                onClick={() => setShowClientModal(false)}
                className="w-8 h-8 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-all"
              >
                <X size={18} className="text-slate-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Cliente</p>
                <p className="text-sm font-bold text-slate-900">{selectedClient.name}</p>
              </div>
              
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Nicho</p>
                <p className="text-sm text-slate-700">{selectedClient.niche}</p>
              </div>
              
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Mercado</p>
                <p className="text-sm text-slate-700">{selectedClient.market}</p>
              </div>
              
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Tom de Voz</p>
                <p className="text-sm text-slate-700">{selectedClient.tone}</p>
              </div>
              
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Objetivo</p>
                <p className="text-sm text-slate-700">{selectedClient.objective}</p>
              </div>
              
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Público-Alvo</p>
                <p className="text-sm text-slate-700">{selectedClient.targetAudience}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};