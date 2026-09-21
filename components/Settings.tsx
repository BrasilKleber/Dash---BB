import React, { useState, useEffect } from 'react';
import { 
  Database, RefreshCw, CheckCircle, XCircle, 
  AlertCircle, ExternalLink, Download, Eye,
  Loader, Calendar, TrendingUp, Users,
  DollarSign, BarChart3, Settings as SettingsIcon
} from 'lucide-react';
import { sheetsService, SheetConfig, getStoredConfig, saveConfig, extractIdFromUrl } from '../services/sheetsService';
import { Client } from '../types';

type Tab = 'database' | 'general' | 'notifications';

interface TabData {
  name: string;
  rows: number;
  status: 'loading' | 'success' | 'error';
  error?: string;
  preview?: any[];
}

interface SettingsProps {
  clients?: Client[];
  onUpdateClient?: (client: Client) => void;
  onDataReset?: () => Promise<void>;
}

export const Settings: React.FC<SettingsProps> = ({ clients, onUpdateClient, onDataReset }) => {
  const [activeTab, setActiveTab] = useState<Tab>('database');
  const [config, setConfig] = useState<SheetConfig>(getStoredConfig());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  
  const [tabsData, setTabsData] = useState<Record<string, TabData>>({});
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  
  const TABS_CONFIG = [
    { key: 'clients', name: 'Clients', icon: Users, gidKey: 'clients' as const },
    { key: 'sources', name: 'Sources', icon: SettingsIcon, gidKey: 'sources' as const },
    { key: 'ads_daily', name: 'Ads Daily', icon: TrendingUp, gidKey: 'ads_daily' as const },
    { key: 'sales_daily', name: 'Sales Daily', icon: DollarSign, gidKey: 'sales_daily' as const },
    { key: 'final_daily', name: 'Final Daily', icon: BarChart3, gidKey: 'final_daily' as const },
    { key: 'social_daily', name: 'Social Daily', icon: Users, gidKey: 'social_daily' as const },
    { key: 'sync_log', name: 'Sync Log', icon: Calendar, gidKey: 'sync_log' as const },
  ];
  
  useEffect(() => {
    const saved = getStoredConfig();
    setConfig(saved);
  }, []);
  
  const handleUrlChange = (url: string) => {
    const extractedId = extractIdFromUrl(url);
    setConfig({
      ...config,
      sheetsUrl: url,
      spreadsheetId: extractedId || '',
      status: extractedId ? 'unconfigured' : 'error',
      lastError: extractedId ? undefined : 'URL inválido'
    });
  };
  
  const handleGidChange = (key: keyof SheetConfig['gids'], value: string) => {
    setConfig({
      ...config,
      gids: {
        ...config.gids,
        [key]: value
      }
    });
  };
  
  const testConnection = async () => {
    if (!config.spreadsheetId) {
      setTestResult({
        success: false,
        message: 'Por favor, insere o URL do Google Sheets primeiro'
      });
      return;
    }
    
    setIsTesting(true);
    setTestResult(null);
    setTabsData({});
    
    try {
      const results: Record<string, TabData> = {};
      
      for (const tab of TABS_CONFIG) {
        const gid = config.gids[tab.gidKey] || '0';
        results[tab.key] = {
          name: tab.name,
          rows: 0,
          status: 'loading'
        };
        setTabsData({ ...results });
        
        try {
          const data = await sheetsService.fetchRemoteCsv(config.spreadsheetId, gid);
          results[tab.key] = {
            name: tab.name,
            rows: data.length,
            status: 'success',
            preview: data.slice(0, 5)
          };
        } catch (error: any) {
          results[tab.key] = {
            name: tab.name,
            rows: 0,
            status: 'error',
            error: error.message
          };
        }
        
        setTabsData({ ...results });
      }
      
      const clientsSuccess = results.clients.status === 'success';
      
      if (clientsSuccess) {
        const updatedConfig = {
          ...config,
          status: 'connected' as const,
          useMock: false
        };
        
        setConfig(updatedConfig);
        saveConfig(updatedConfig);
        
        if (onDataReset) {
          onDataReset();
        }
        
        setTestResult({
          success: true,
          message: `✅ Conexão bem-sucedida! ${results.clients.rows} clientes encontrados.`,
          details: results
        });
      } else {
        throw new Error('Falha ao carregar aba Clients');
      }
      
    } catch (error: any) {
      setTestResult({
        success: false,
        message: `❌ Erro: ${error.message}`
      });
      
      setConfig({
        ...config,
        status: 'error',
        lastError: error.message
      });
    } finally {
      setIsTesting(false);
    }
  };
  
  const loadTabPreview = async (tabKey: string) => {
    const tab = TABS_CONFIG.find(t => t.key === tabKey);
    if (!tab || !config.spreadsheetId) return;
    
    setSelectedTab(tabKey);
    
    const gid = config.gids[tab.gidKey] || '0';
    const currentData = tabsData[tabKey];
    
    if (currentData?.preview) return;
    
    try {
      const data = await sheetsService.fetchRemoteCsv(config.spreadsheetId, gid);
      setTabsData({
        ...tabsData,
        [tabKey]: {
          ...currentData,
          preview: data.slice(0, 10)
        }
      });
    } catch (error) {
      console.error('Erro ao carregar preview:', error);
    }
  };
  
  const saveSettings = async () => {
    saveConfig(config);
    alert('✅ Configurações guardadas com sucesso!');
    if (onDataReset) {
      await onDataReset();
    }
  };
  
  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
        <p className="text-sm text-slate-600 mt-1">Gere as configurações do CRM</p>
      </div>
      
      <div className="bg-white border-b border-slate-200 px-8">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'database'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="inline mr-2" size={16} />
            Base de Dados
          </button>
          
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Geral
          </button>
          
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'notifications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Notificações
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8">
        
        {activeTab === 'database' && (
          <div className="max-w-6xl">
            
            <div className={`rounded-xl border-2 p-6 mb-6 ${
              config.status === 'connected' 
                ? 'bg-green-50 border-green-200' 
                : config.status === 'error'
                ? 'bg-red-50 border-red-200'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center gap-3">
                {config.status === 'connected' ? (
                  <CheckCircle size={24} className="text-green-600" />
                ) : config.status === 'error' ? (
                  <XCircle size={24} className="text-red-600" />
                ) : (
                  <AlertCircle size={24} className="text-blue-600" />
                )}
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg">
                    {config.status === 'connected' ? '✅ Conectado' : 
                     config.status === 'error' ? '❌ Erro de Conexão' : 
                     'ℹ️ Não Configurado'}
                  </h3>
                  <p className="text-sm mt-1">
                    {config.status === 'connected' 
                      ? 'Google Sheets conectado e a funcionar'
                      : config.status === 'error'
                      ? config.lastError || 'Erro desconhecido'
                      : 'Configure o URL do Google Sheets abaixo'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border-2 border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Configuração do Google Sheets
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  URL do Google Sheets *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={config.sheetsUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all"
                  />
                  
                  <a
                    href={config.sheetsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 rounded-xl transition-all flex items-center gap-2"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
                {config.spreadsheetId && (
                  <p className="text-xs text-green-600 mt-2">
                    ✓ ID extraído: {config.spreadsheetId}
                  </p>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-700 mb-3">
                  IDs das Abas (GIDs) - Opcional
                </h3>
                <p className="text-xs text-slate-600 mb-4">
                  Por padrão usa GID=0 para Clients. Configure os outros GIDs se necessário.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {TABS_CONFIG.map(tab => (
                    <div key={tab.key}>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        {tab.name}
                      </label>
                      <input
                        type="text"
                        value={config.gids[tab.gidKey]}
                        onChange={(e) => handleGidChange(tab.gidKey, e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-blue-400 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={testConnection}
                  disabled={isTesting || !config.spreadsheetId}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
                >
                  {isTesting ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      A testar...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={20} />
                      Testar Conexão
                    </>
                  )}
                </button>
                
                <button
                  onClick={saveSettings}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <Download size={20} />
                  Guardar Configuração
                </button>
              </div>
            </div>
            
            {testResult && (
              <div className={`rounded-xl border-2 p-6 mb-6 ${
                testResult.success 
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className="font-semibold">{testResult.message}</p>
              </div>
            )}
            
            {Object.keys(tabsData).length > 0 && (
              <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Dados das Abas
                </h2>
                
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {TABS_CONFIG.map(tab => {
                    const data = tabsData[tab.key];
                    if (!data) return null;
                    
                    const Icon = tab.icon;
                    
                    return (
                      <button
                        key={tab.key}
                        onClick={() => loadTabPreview(tab.key)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedTab === tab.key
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon size={20} className={
                            data.status === 'success' ? 'text-green-500' :
                            data.status === 'error' ? 'text-red-500' :
                            'text-blue-500'
                          } />
                          {data.status === 'success' ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : data.status === 'error' ? (
                            <XCircle size={16} className="text-red-500" />
                          ) : (
                            <Loader size={16} className="text-blue-500 animate-spin" />
                          )}
                        </div>
                        
                        <h4 className="font-bold text-sm text-slate-900 mb-1">
                          {tab.name}
                        </h4>
                        
                        {data.status === 'success' ? (
                          <p className="text-xs text-green-600">
                            {data.rows} registos
                          </p>
                        ) : data.status === 'error' ? (
                          <p className="text-xs text-red-600">Erro</p>
                        ) : (
                          <p className="text-xs text-blue-600">A carregar...</p>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {selectedTab && tabsData[selectedTab]?.preview && (
                  <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Eye size={18} />
                        Preview: {TABS_CONFIG.find(t => t.key === selectedTab)?.name}
                      </h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            {Object.keys(tabsData[selectedTab].preview![0] || {}).map(key => (
                              <th key={key} className="px-4 py-3 text-left font-bold text-slate-700 text-xs uppercase">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {tabsData[selectedTab].preview!.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                              {Object.values(row).map((val: any, j) => (
                                <td key={j} className="px-4 py-3 text-slate-700">
                                  {String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'general' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Configurações Gerais
              </h2>
              <p className="text-slate-600">Em breve...</p>
            </div>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Notificações
              </h2>
              <p className="text-slate-600">Em breve...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
