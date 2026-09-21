
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { StatsCard } from './common/StatsCard';
import { Client, DateRange, AIContext, ChatMessage, Attachment } from '../types';
import { AdaptiveMultiSeriesChart } from './common/AdaptiveMultiSeriesChart';
import { 
  Sparkles, Loader2, RefreshCcw, Radio as RadioIcon, Send, Volume2, 
  Database, Terminal, ChevronDown, ChevronUp, Building2, Download,
  Pause, Copy, User, Paperclip, X, FileText, Image as ImageIcon,
  Settings as SettingsIcon, Globe
} from 'lucide-react';
import { aiService } from '../services/aiService';
import { PlatformPerformanceCard } from './common/PlatformPerformanceCard';
import { dataService, ChannelSummary, DataDiagnosis } from '../services/dataService';
import { FunnelPanel } from './common/FunnelPanel';
import { WelcomeBanner } from './common/WelcomeBanner';
import { DateRangePickerGlobal } from './common/DateRangePickerGlobal';
import { getWindsorConfig, saveWindsorConfig, windsorService } from '../services/windsorService';

interface OverviewProps {
  activeClient: Client;
  clients: Client[];
  onClientChange: (id: string) => void;
  dateRange: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
  onTabChange?: (tab: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({ activeClient, clients, onClientChange, dateRange, onDateRangeChange, onTabChange }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [audioState, setAudioState] = useState<{ msgIndex: number | null; playing: boolean }>({ msgIndex: null, playing: false });
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [showWindsorModal, setShowWindsorModal] = useState(false);
  const [windsorApiKey, setWindsorApiKey] = useState(getWindsorConfig().apiKey);
  const [useWindsor, setUseWindsor] = useState(getWindsorConfig().useWindsor);
  const [testStatus, setTestStatus] = useState<{ status: 'idle' | 'loading' | 'success' | 'error', message?: string }>({ status: 'idle' });
  
  const [dailyStats, setDailyStats] = useState<any[]>([]);
  const [rawRows, setRawRows] = useState<any[]>([]);
  const [channels, setChannels] = useState<ChannelSummary[]>([]);
  const [diagnosis, setDiagnosis] = useState<DataDiagnosis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasData = useMemo(() => dailyStats.length > 0, [dailyStats]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsResult, channelSummary] = await Promise.all([
        dataService.getDailyStats(activeClient.id, dateRange),
        dataService.getChannelSummary(activeClient.id, dateRange)
      ]);
      setDailyStats(statsResult.data || []);
      setRawRows(statsResult.rawRows || []);
      setDiagnosis(statsResult.diagnosis || null);
      setChannels(channelSummary || []);
    } catch (err) {
      setDailyStats([]);
      setRawRows([]);
      setChannels([]);
      setDiagnosis(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeClient.id, dateRange.label]);

  const handleSaveWindsor = () => {
    saveWindsorConfig({ apiKey: windsorApiKey, useWindsor });
    setShowWindsorModal(false);
    window.location.reload(); // Reload to apply changes in dataService
  };

  const handleTestWindsor = async () => {
    if (!windsorApiKey) {
      setTestStatus({ status: 'error', message: 'Insere uma API Key primeiro.' });
      return;
    }
    setTestStatus({ status: 'loading' });
    try {
      // Test with a 1-day range
      const testRange: DateRange = {
        start: new Date(new Date().setDate(new Date().getDate() - 2)),
        end: new Date(new Date().setDate(new Date().getDate() - 1)),
        label: 'Test'
      };
      
      // Temporary override for testing
      const originalConfig = getWindsorConfig();
      saveWindsorConfig({ apiKey: windsorApiKey, useWindsor: true });
      
      const data = await windsorService.fetchData(testRange);
      
      // Restore
      saveWindsorConfig(originalConfig);

      if (data && data.length > 0) {
        setTestStatus({ status: 'success', message: `Sucesso! Recebemos ${data.length} linhas de dados.` });
      } else {
        setTestStatus({ status: 'error', message: 'Ligação OK, mas não foram encontrados dados para ontem.' });
      }
    } catch (err) {
      setTestStatus({ status: 'error', message: 'Erro ao ligar à API. Verifica a chave.' });
    }
  };

  const statsTotals = useMemo(() => {
    if (!hasData) return { spend: 0, revenue: 0, sales: 0, leads: 0, followers: 0, visits: 0, clicks: 0, reach: 0 };
    return dailyStats.reduce((acc, curr) => ({
      spend: acc.spend + (curr.spend || 0),
      revenue: acc.revenue + (curr.revenue || 0),
      sales: acc.sales + (curr.sales || 0),
      leads: acc.leads + (curr.leads || 0),
      followers: acc.followers + (curr.followers || 0),
      visits: acc.visits + (curr.visits || 0),
      clicks: acc.clicks + (curr.clicks || 0),
      reach: acc.reach + (curr.reach || 0),
    }), { spend: 0, revenue: 0, sales: 0, leads: 0, followers: 0, visits: 0, clicks: 0, reach: 0 });
  }, [dailyStats, hasData]);

  const aiContext = useMemo<AIContext | null>(() => {
    if (!hasData) return null;
    return {
      client: activeClient,
      dateRange: { start: dateRange.start.toISOString().split('T')[0], end: dateRange.end.toISOString().split('T')[0], label: dateRange.label },
      totals: statsTotals,
      series: dailyStats,
      topCampaigns: channels
    };
  }, [activeClient, dateRange, statsTotals, dailyStats, channels, hasData]);

  useEffect(() => {
    const startInitialAnalysis = async () => {
      setChatMessages([]);
      if (!hasData) {
        setChatMessages([{ role: 'assistant', content: "Sem dados suficientes para análise estratégica.", timestamp: new Date() }]);
        return;
      }
      if (!aiContext) return;
      setIsGenerating(true);
      try {
        const summary = await aiService.generateExecutiveSummary(aiContext);
        setChatMessages([{ role: 'assistant', content: summary, timestamp: new Date() }]);
      } catch (error) {
        setChatMessages([{ role: 'assistant', content: "Erro ao carregar inteligência de performance.", timestamp: new Date() }]);
      } finally {
        setIsGenerating(false);
      }
    };
    if (!isLoading) startInitialAnalysis();
  }, [activeClient.id, dateRange.label, hasData, isLoading, aiContext]);

  useEffect(() => { if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight; }, [chatMessages, isGenerating]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Limite simples de tamanho (ex: 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("O ficheiro é demasiado grande. Máximo 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setAttachments(prev => [...prev, {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64,
          preview: file.type.startsWith('image/') ? base64 : undefined
        }]);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if ((!trimmed && attachments.length === 0) || !hasData || !aiContext || isGenerating) return;
    
    const userMsg: ChatMessage = { 
      role: 'user', 
      content: trimmed, 
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setAttachments([]); // Limpar anexos após envio
    setIsGenerating(true);

    try {
      const response = await aiService.chatWithAnalyst(aiContext, [...chatMessages, userMsg]);
      setChatMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
    } catch (err) { console.error(err); } finally { setIsGenerating(false); }
  };

  const handlePlayAudio = async (text: string, index: number) => {
    // Se já estiver a tocar a mesma mensagem, pausa/para
    if (audioState.playing && audioState.msgIndex === index) {
      if (audioSourceRef.current) {
        try { audioSourceRef.current.stop(); } catch(e){}
        audioSourceRef.current = null;
      }
      setAudioState({ msgIndex: null, playing: false });
      return;
    }

    // Para qualquer outra mensagem a tocar
    if (audioState.playing && audioSourceRef.current) {
       try { audioSourceRef.current.stop(); } catch(e){}
       audioSourceRef.current = null;
    }

    setAudioState({ msgIndex: index, playing: true });
    const audioData = await aiService.textToSpeech(text);
    if (!audioData) { setAudioState({ msgIndex: null, playing: false }); return; }
    try {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const ctx = audioContextRef.current;
      const bytes = new Uint8Array(atob(audioData).split("").map(c => c.charCodeAt(0)));
      const dataInt16 = new Int16Array(bytes.buffer);
      const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => {
        // Verifica se ainda é a fonte atual antes de atualizar estado
        if (audioSourceRef.current === source) {
          setAudioState({ msgIndex: null, playing: false });
          audioSourceRef.current = null;
        }
      };
      source.start();
      audioSourceRef.current = source;
    } catch (e) { setAudioState({ msgIndex: null, playing: false }); }
  };

  if (isLoading) return <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 gap-4"><Loader2 size={36} className="animate-spin text-brand" /><p className="text-[11px] font-extrabold uppercase tracking-widest opacity-60">Sincronizando Ecossistema...</p></div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner de Boas-vindas Rotativo */}
      <WelcomeBanner userName="Ricardo Carneiro" clientName={activeClient?.name} />

      {/* Nova Barra de Ferramentas e Seletor */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Lado esquerdo - Info do cliente e Datas */}
        <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
              <Building2 size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cliente Selecionado</p>
              <select 
                value={activeClient.id} 
                onChange={(e) => onClientChange(e.target.value)}
                className="text-base font-bold text-slate-900 bg-transparent border-none outline-none cursor-pointer p-0 w-full focus:ring-0"
              >
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-slate-200"></div>

          <div className="w-full md:w-auto">
             {onDateRangeChange && <DateRangePickerGlobal value={dateRange} onChange={onDateRangeChange} />}
          </div>
        </div>
        
        {/* Lado direito - Ações */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button 
            onClick={() => setShowWindsorModal(true)} 
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${useWindsor ? 'text-blue-600 bg-blue-50 border border-blue-200' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50'}`} 
            title="Configuração Windsor.ai"
          >
            <Globe size={16} />
          </button>
          <button onClick={fetchData} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Atualizar Dados">
            <RefreshCcw size={16} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Exportar Relatório">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Modal Windsor.ai */}
      {showWindsorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <Globe size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Windsor.ai</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Integração de Dados</p>
                  </div>
                </div>
                <button onClick={() => setShowWindsorModal(false)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Ativar Windsor.ai</p>
                    <p className="text-[10px] text-slate-500 font-medium">Substitui o Google Sheets como fonte</p>
                  </div>
                  <button 
                    onClick={() => setUseWindsor(!useWindsor)}
                    className={`w-12 h-6 rounded-full transition-all relative ${useWindsor ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${useWindsor ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">API Key Windsor</label>
                  <div className="flex gap-2">
                    <input 
                      type="password" 
                      value={windsorApiKey}
                      onChange={(e) => setWindsorApiKey(e.target.value)}
                      placeholder="Insere a tua API Key..."
                      className="flex-1 bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all placeholder:text-slate-300"
                    />
                    <button 
                      onClick={handleTestWindsor}
                      disabled={testStatus.status === 'loading'}
                      className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-xs transition-all disabled:opacity-50"
                    >
                      {testStatus.status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : 'Testar'}
                    </button>
                  </div>
                  {testStatus.message && (
                    <p className={`text-[10px] font-bold ml-1 ${testStatus.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                      {testStatus.message}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 font-medium ml-1 italic">
                    Podes encontrar a tua chave no dashboard do Windsor.ai
                  </p>
                </div>

                <button 
                  onClick={handleSaveWindsor}
                  className="w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-slate-200 active:scale-95"
                >
                  Guardar Configuração
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid de Stats Cards */}
      <div className={`grid gap-6 ${activeClient.objective_primary === 'sales' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
        <StatsCard 
          label="Investimento" 
          value={`${Math.floor(statsTotals.spend).toLocaleString()} €`} 
          variant="investment" 
          comparison={{ value: '12%', trend: 'down' }} 
        />
        <StatsCard 
          label="Receita" 
          value={`${Math.floor(statsTotals.revenue).toLocaleString()} €`} 
          variant="revenue" 
          comparison={{ value: '18%', trend: 'up' }} 
        />
        <StatsCard 
          label="Roas" 
          value={statsTotals.spend > 0 ? (statsTotals.revenue / statsTotals.spend).toFixed(2) : "0.00"} 
          variant="roas" 
          comparison={{ value: '0.4x', trend: 'up' }} 
        />
        <StatsCard 
          label="Vendas" 
          value={statsTotals.sales.toLocaleString()} 
          variant="sales" 
        />
        {activeClient.objective_primary === 'sales' && (
          <>
            <StatsCard 
              label="Ticket médio" 
              value={statsTotals.sales > 0 ? `${(statsTotals.revenue / statsTotals.sales).toFixed(2)} €` : "N/A"} 
              variant="aov" 
            />
            <StatsCard 
              label="Cac" 
              value={statsTotals.sales > 0 ? `${(statsTotals.spend / statsTotals.sales).toFixed(2)} €` : "N/A"} 
              variant="cac" 
            />
          </>
        )}
      </div>

      {!hasData ? (
        <div className="bg-white p-24 rounded-xl text-center shadow-sm border border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Database size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Sem dados sincronizados</h3>
          <p className="text-slate-500 mt-2 font-medium">Verifica as definições de Sheets ou Windsor.ai e altera o período.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-8 h-full">
              <AdaptiveMultiSeriesChart data={dailyStats} objective={activeClient.objective_primary} />
            </div>
            <div className="lg:col-span-4 h-full">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                    <RadioIcon size={18} className="text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Canais Ativos</h3>
                    <p className="text-xs text-slate-500 font-medium">Performance por origem</p>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-auto custom-scrollbar pr-1 pb-4">
                  {channels.map((chan, idx) => (
                    <PlatformPerformanceCard 
                      key={idx}
                      platform={chan.channel} 
                      revenue={chan.revenue}
                      roas={chan.roas}
                      investment={chan.spend}
                      conversions={chan.orders || chan.leads}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FunnelPanel rawRows={rawRows} objective={activeClient.objective_primary} />

            {/* Seção do Chat IA - MODERNIZADA COM ANEXOS */}
            <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-full">
              
              {/* Header Premium */}
              <div className="relative overflow-hidden">
                {/* Background decorativo */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-3xl" />
                
                <div className="relative px-6 py-5 border-b border-slate-200/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Avatar do assistente */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Sparkles size={20} className="text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        Analista IA Bluebolt
                        <span className="px-2 py-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                          PRO
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">Powered by Gemini 2.0</p>
                    </div>
                    
                    {/* Status indicator */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-semibold text-green-700">Online</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mensagens com scroll suave */}
              <div 
                ref={chatScrollRef} 
                className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar bg-gradient-to-b from-transparent to-slate-50/30"
                style={{ maxHeight: '450px', minHeight: '350px' }}
              >
                {/* Loading state animado */}
                {isGenerating && (
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100 w-fit">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      A pensar...
                    </span>
                  </div>
                )}
                
                {/* Mensagens */}
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
                        <Sparkles size={14} className="text-white" />
                      </div>
                    )}
                    
                    <div className={`max-w-[85%] ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-white text-slate-700 border border-slate-200 shadow-sm'
                    } rounded-2xl p-4 relative group`}>
                      
                      {/* Anexos na Mensagem */}
                      {msg.attachments && msg.attachments.length > 0 && (
                         <div className="flex flex-wrap gap-2 mb-3">
                           {msg.attachments.map((att, i) => (
                             <div key={i} className={`p-2 rounded-lg flex items-center gap-2 text-xs font-medium ${msg.role === 'user' ? 'bg-white/10 text-white border border-white/20' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                                {att.type.startsWith('image/') ? (
                                  <ImageIcon size={14} />
                                ) : (
                                  <FileText size={14} />
                                )}
                                <span className="max-w-[100px] truncate">{att.name}</span>
                             </div>
                           ))}
                         </div>
                      )}

                      {/* Texto da mensagem */}
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>
                      
                      {/* Footer com timestamp e ações */}
                      <div className={`flex items-center justify-between mt-3 pt-3 border-t ${msg.role === 'user' ? 'border-white/20' : 'border-slate-100/50'}`}>
                        <span className={`text-[10px] font-medium ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                          {msg.timestamp?.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        
                        {msg.role === 'assistant' && hasData && (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handlePlayAudio(msg.content, idx)}
                              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
                                audioState.playing && audioState.msgIndex === idx
                                  ? 'bg-cyan-500 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-cyan-100 hover:text-cyan-600'
                              }`}
                              title="Ouvir resposta"
                            >
                              {audioState.playing && audioState.msgIndex === idx ? (
                                <Pause size={14} />
                              ) : (
                                <Volume2 size={14} />
                              )}
                            </button>
                            
                            <button 
                              className="w-7 h-7 flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-all"
                              title="Copiar resposta"
                              onClick={() => navigator.clipboard.writeText(msg.content)}
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center ml-3 flex-shrink-0 shadow-md">
                        <User size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Input area sofisticada */}
              <div className="p-4 border-t border-slate-200 bg-white">
                
                {/* Área de Preview de Anexos */}
                {attachments.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-3 mb-1 scrollbar-hide">
                    {attachments.map((file, i) => (
                      <div key={i} className="relative group flex-shrink-0">
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col items-center justify-center relative">
                          {file.preview ? (
                            <img src={file.preview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <FileText size={24} className="text-slate-400 mb-1" />
                              <span className="text-[8px] text-slate-500 font-bold px-1 truncate w-full text-center">{file.name}</span>
                            </>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                        </div>
                        <button 
                          onClick={() => removeAttachment(i)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 z-10"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sugestões rápidas (opcional) */}
                {chatMessages.length <= 1 && attachments.length === 0 && (
                  <div className="mb-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['Resumir performance', 'Comparar canais', 'Sugerir otimizações', 'Analisar ROAS'].map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(suggestion)}
                        className="px-3 py-1.5 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-cyan-50 hover:to-blue-50 border border-slate-200 hover:border-cyan-300 rounded-lg text-xs font-semibold text-slate-600 hover:text-cyan-700 transition-all whitespace-nowrap"
                      >
                        ✨ {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="flex items-end gap-2">
                  {/* Botão de Anexo */}
                  <div className="relative">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      onChange={handleFileSelect}
                      accept="image/*, .csv, .txt, .json"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-12 h-[48px] flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 rounded-xl transition-all active:scale-95 border border-slate-200"
                      title="Anexar imagem ou documento"
                    >
                      <Paperclip size={18} />
                    </button>
                  </div>

                  {/* Input com contador de caracteres */}
                  <div className="flex-1 relative">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(inputValue);
                        }
                      }}
                      placeholder={attachments.length > 0 ? "Adiciona contexto ao anexo..." : "Faz uma pergunta estratégica..."}
                      className="w-full bg-slate-50 border-2 border-slate-200 focus:border-cyan-400 focus:bg-white rounded-xl px-4 py-3 pr-12 text-sm outline-none transition-all text-slate-900 font-medium resize-none placeholder:text-slate-400 custom-scrollbar"
                      rows={1}
                      style={{ minHeight: '48px', maxHeight: '120px' }}
                    />
                    
                    {/* Contador de caracteres */}
                    {inputValue.length > 0 && (
                      <span className="absolute bottom-3 right-3 text-[10px] font-semibold text-slate-400">
                        {inputValue.length}/500
                      </span>
                    )}
                  </div>
                  
                  {/* Botão de enviar premium */}
                  <button 
                    onClick={() => handleSendMessage(inputValue)} 
                    disabled={isGenerating || (!inputValue.trim() && attachments.length === 0)}
                    className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95 flex-shrink-0"
                    title="Enviar mensagem"
                  >
                    {isGenerating ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
                
                {/* Disclaimer */}
                <p className="text-[10px] text-slate-400 mt-2 text-center font-medium">
                  Suporta Imagens, CSV e TXT (max 5MB). 🔒 Os teus dados são privados.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="w-full pt-8 border-t border-slate-200/50">
        <button onClick={() => setShowDiagnosis(!showDiagnosis)} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-brand transition-colors mx-auto">
          <Terminal size={14} /> Monitorização de Dados {showDiagnosis ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showDiagnosis && diagnosis && (
          <div className="bg-slate-900 text-slate-400 p-6 rounded-xl font-mono text-[10px] mt-4 border border-slate-800 leading-relaxed shadow-lg max-w-2xl mx-auto">
            <p className="text-cyan-400 font-bold mb-2">// LOG DE SINCRONIZAÇÃO</p>
            <p><span className="text-slate-600">CLIENTE_ID:</span> {activeClient.id}</p>
            <p><span className="text-slate-600">PERÍODO:</span> {diagnosis.activePeriod}</p>
            <p><span className="text-slate-600">TOTAL_ROWS:</span> {diagnosis.totalRows}</p>
          </div>
        )}
      </div>
    </div>
  );
};
