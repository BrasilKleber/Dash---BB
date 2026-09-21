
import { Client, Platform, BackofficePlatform, ObjectiveType, DateRange, DataSource } from '../types';
import { MOCK_CLIENTS, MOCK_DAILY_STATS, MOCK_CAMPAIGNS, MOCK_SOURCES } from '../data/mockData';
import { getStoredConfig, sheetsService } from './sheetsService';
import { windsorService, getWindsorConfig } from './windsorService';

const parseNum = (val: any): number => {
  if (val === undefined || val === null || val === '') return 0;
  const s = val.toString().trim().replace(/[^\d,.-]/g, '').replace(',', '.');
  const num = parseFloat(s);
  return isNaN(num) ? 0 : num;
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const parseToLocalDate = (input: any): Date | null => {
  if (!input || input === '') return null;
  const s = String(input).trim();
  let d: Date;
  // Suporta YYYY-MM-DD e DD/MM/YYYY
  if (s.includes('-')) {
    const p = s.split('-');
    if (p[0].length === 4) d = new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]));
    else d = new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0]));
  } else if (s.includes('/')) {
    const p = s.split('/');
    d = new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0]));
  } else {
    d = new Date(s);
  }
  if (isNaN(d.getTime())) return null;
  d.setHours(0,0,0,0);
  return d;
};

export interface ChannelSummary {
  channel: string;
  spend: number;
  revenue: number;
  orders: number;
  leads: number;
  followers: number;
  roas: number;
}

export interface DataDiagnosis {
  totalRows: number;
  matchedClient: number;
  matchedDate: number;
  activePeriod: string;
}

export const dataService = {
  async getClients(): Promise<Client[]> {
    const windsorConfig = getWindsorConfig();
    if (windsorConfig.useWindsor) {
      return [{ id: 'windsor_all', name: 'Windsor All Accounts', active: true, objective_primary: 'sales' }];
    }

    const config = getStoredConfig();
    if (config.useMock) return MOCK_CLIENTS;
    try {
      const raw = await sheetsService.fetchRemoteCsv(config.spreadsheetId, config.gids.clients || '0');
      return raw.map(item => ({
        id: (item.client_id || item.id || '').toString(),
        name: (item.client_name || item.name || 'Sem Nome').toString(),
        active: true,
        objective_primary: (item.objective || 'sales') as ObjectiveType
      })).filter(c => c.id);
    } catch (e) { throw e; }
  },

  async getSources(): Promise<DataSource[]> {
    const windsorConfig = getWindsorConfig();
    if (windsorConfig.useWindsor) return [];

    const config = getStoredConfig();
    if (config.useMock) return MOCK_SOURCES;
    try {
      const raw = await sheetsService.fetchRemoteCsv(config.spreadsheetId, config.gids.sources || '');
      return raw.map(item => ({
        id: Math.random().toString(),
        clientId: (item.client_id || '').toString(),
        type: (item.source_type || item.type) as any,
        active: true,
        credentialName: 'Ref-Only'
      })).filter(s => s.clientId);
    } catch (e) { return []; }
  },

  async getDailyStats(clientId: string, dateRange: DateRange): Promise<{ data: any[], rawRows?: any[], diagnosis?: DataDiagnosis }> {
    const windsorConfig = getWindsorConfig();
    const start = parseToLocalDate(dateRange.start);
    const end = parseToLocalDate(dateRange.end);

    if (windsorConfig.useWindsor) {
      const raw = await windsorService.fetchData(dateRange);
      const statsMap: Record<string, any> = {};
      
      raw.forEach(row => {
        const d = parseToLocalDate(row.date);
        if (!d) return;
        const iso = formatDate(d);
        if (!statsMap[iso]) {
          statsMap[iso] = { date: iso, spend: 0, revenue: 0, sales: 0, leads: 0, clicks: 0, reach: 0, followers: 0 };
        }
        
        // Windsor fields can vary slightly, we try to map them robustly
        const spend = parseNum(row.spend || row.investment || 0);
        const revenue = parseNum(row.revenue || row.sales_value || 0);
        const conversions = parseNum(row.conversions || row.leads || row.orders || 0);
        const clicks = parseNum(row.clicks || 0);
        const impressions = parseNum(row.impressions || 0);

        statsMap[iso].spend += spend;
        statsMap[iso].revenue += revenue;
        statsMap[iso].sales += Math.floor(conversions); // Use conversions as sales/leads fallback
        statsMap[iso].leads += conversions;
        statsMap[iso].clicks += clicks;
        statsMap[iso].reach += impressions;
      });

      const result = Object.values(statsMap).sort((a: any, b: any) => a.date.localeCompare(b.date));
      return { 
        data: result, 
        rawRows: raw,
        diagnosis: {
          totalRows: raw.length,
          matchedClient: result.length,
          matchedDate: result.length,
          activePeriod: `${formatDate(start!)} a ${formatDate(end!)}`
        }
      };
    }

    const config = getStoredConfig();
    if (config.useMock) {
      const filtered = MOCK_DAILY_STATS.filter(d => {
        const dDate = parseToLocalDate(d.date);
        return dDate && start && end && dDate >= start && dDate <= end;
      });
      return { data: filtered, rawRows: filtered };
    }

    try {
      // 1. Carregar todas as abas necessárias
      const [finalRaw, adsRaw, salesRaw] = await Promise.all([
        config.gids.final_daily ? sheetsService.fetchRemoteCsv(config.spreadsheetId, config.gids.final_daily) : Promise.resolve([]),
        config.gids.ads_daily ? sheetsService.fetchRemoteCsv(config.spreadsheetId, config.gids.ads_daily) : Promise.resolve([]),
        config.gids.sales_daily ? sheetsService.fetchRemoteCsv(config.spreadsheetId, config.gids.sales_daily) : Promise.resolve([])
      ]);

      const statsMap: Record<string, any> = {};

      // 2. Processar Final_Daily como fonte primária
      finalRaw.forEach(row => {
        if (row.client_id?.toString() !== clientId.toString()) return;
        const d = parseToLocalDate(row.date);
        if (!d || !start || !end || d < start || d > end) return;

        const iso = formatDate(d);
        statsMap[iso] = {
          date: iso,
          spend: parseNum(row.investment_total),
          revenue: parseNum(row.revenue_gross),
          revenue_net: parseNum(row.revenue_net),
          sales: Math.floor(parseNum(row.orders)),
          leads: parseNum(row.conversions_ads_total),
          clicks: parseNum(row.clicks_total),
          reach: parseNum(row.impressions_total),
          followers: 0 // Social pode vir de outra aba se necessário
        };
      });

      // 3. Fallback Engine: Se Final_Daily está vazio para o período, reconstruir via Ads e Sales
      const current = new Date(start!);
      while (current <= end!) {
        const iso = formatDate(current);
        if (!statsMap[iso]) {
          const dayAds = adsRaw.filter(r => r.client_id?.toString() === clientId.toString() && r.date === iso);
          const daySales = salesRaw.filter(r => r.client_id?.toString() === clientId.toString() && r.date === iso);

          if (dayAds.length > 0 || daySales.length > 0) {
            statsMap[iso] = {
              date: iso,
              spend: dayAds.reduce((sum, r) => sum + parseNum(r.investment), 0),
              revenue: daySales.reduce((sum, r) => sum + parseNum(r.revenue_gross), 0),
              sales: daySales.reduce((sum, r) => sum + parseNum(r.orders), 0),
              leads: dayAds.reduce((sum, r) => sum + parseNum(r.conversions), 0),
              clicks: dayAds.reduce((sum, r) => sum + parseNum(r.clicks), 0),
              reach: dayAds.reduce((sum, r) => sum + parseNum(r.impressions), 0),
              followers: 0
            };
          }
        }
        current.setDate(current.getDate() + 1);
      }

      const result = Object.values(statsMap).sort((a: any, b: any) => a.date.localeCompare(b.date));
      return { 
        data: result, 
        rawRows: adsRaw.filter(r => r.client_id?.toString() === clientId.toString()),
        diagnosis: {
          totalRows: finalRaw.length + adsRaw.length + salesRaw.length,
          matchedClient: result.length,
          matchedDate: result.length,
          activePeriod: `${formatDate(start!)} a ${formatDate(end!)}`
        }
      };
    } catch (e) {
      console.error("[DataService] Erro fatal:", e);
      return { data: [] };
    }
  },

  async getChannelSummary(clientId: string, dateRange: DateRange): Promise<ChannelSummary[]> {
    const windsorConfig = getWindsorConfig();
    const start = parseToLocalDate(dateRange.start);
    const end = parseToLocalDate(dateRange.end);

    if (windsorConfig.useWindsor) {
      const raw = await windsorService.fetchData(dateRange);
      const channels: Record<string, ChannelSummary> = {};
      
      raw.forEach(row => {
        const type = row.source?.toLowerCase() || 'unknown';
        if (!channels[type]) {
          channels[type] = { channel: type, spend: 0, revenue: 0, orders: 0, leads: 0, followers: 0, roas: 0 };
        }
        const spend = parseNum(row.spend || row.investment || 0);
        const revenue = parseNum(row.revenue || row.sales_value || 0);
        const conversions = parseNum(row.conversions || row.leads || row.orders || 0);

        channels[type].spend += spend;
        channels[type].revenue += revenue;
        channels[type].orders += Math.floor(conversions);
        channels[type].leads += conversions;
        channels[type].roas = channels[type].spend > 0 ? channels[type].revenue / channels[type].spend : 0;
      });

      return Object.values(channels).sort((a, b) => b.spend - a.spend);
    }

    const config = getStoredConfig();
    if (config.useMock) {
      return [
        { channel: 'google_ads', spend: 4500, revenue: 18000, orders: 120, leads: 45, followers: 0, roas: 4 },
        { channel: 'meta_ads', spend: 3200, revenue: 12800, orders: 85, leads: 30, followers: 150, roas: 4 }
      ];
    }

    try {
      const adsRaw = await sheetsService.fetchRemoteCsv(config.spreadsheetId, config.gids.ads_daily);
      const salesRaw = await sheetsService.fetchRemoteCsv(config.spreadsheetId, config.gids.sales_daily);
      
      const channels: Record<string, ChannelSummary> = {};
      let totalSalesRevenue = 0;
      let totalAdsSpend = 0;

      // Agrupar Investimento por Canal (source_type)
      adsRaw.forEach(r => {
        if (r.client_id?.toString() !== clientId.toString()) return;
        const d = parseToLocalDate(r.date);
        if (!d || !start || !end || d < start || d > end) return;

        const type = r.source_type?.toLowerCase() || 'unknown';
        if (!channels[type]) {
          channels[type] = { channel: type, spend: 0, revenue: 0, orders: 0, leads: 0, followers: 0, roas: 0 };
        }
        const spend = parseNum(r.investment);
        channels[type].spend += spend;
        channels[type].leads += parseNum(r.conversions);
        totalAdsSpend += spend;
      });

      // Atribuição de Receita (Proporcional ao investimento se não houver canal na Sales_Daily)
      salesRaw.forEach(r => {
        if (r.client_id?.toString() !== clientId.toString()) return;
        const d = parseToLocalDate(r.date);
        if (!d || !start || !end || d < start || d > end) return;
        totalSalesRevenue += parseNum(r.revenue_gross);
      });

      if (totalAdsSpend > 0) {
        Object.keys(channels).forEach(k => {
          const chan = channels[k];
          chan.revenue = totalSalesRevenue * (chan.spend / totalAdsSpend);
          chan.roas = chan.spend > 0 ? chan.revenue / chan.spend : 0;
        });
      }

      return Object.values(channels).sort((a, b) => b.spend - a.spend);
    } catch (e) { return []; }
  },

  async getCampaigns(clientId: string, dateRange: DateRange): Promise<any[]> {
    const windsorConfig = getWindsorConfig();
    const start = parseToLocalDate(dateRange.start);
    const end = parseToLocalDate(dateRange.end);

    if (windsorConfig.useWindsor) {
      const raw = await windsorService.fetchData(dateRange);
      const campaignMap: Record<string, any> = {};

      raw.forEach(d => {
        const name = d.campaign || d.source?.toUpperCase() || 'MARKETING';
        const platform = (d.source?.toLowerCase().includes('meta') || d.source?.toLowerCase().includes('facebook') ? Platform.META_ADS : Platform.GOOGLE_ADS);
        
        if (!campaignMap[name]) {
          campaignMap[name] = { id: name, name, platform, totals: { spend: 0, revenue: 0, conversions: 0, followers: 0 } };
        }
        
        const spend = parseNum(d.spend || d.investment || 0);
        const revenue = parseNum(d.revenue || d.sales_value || 0);
        const conversions = parseNum(d.conversions || d.leads || d.orders || 0);

        campaignMap[name].totals.spend += spend;
        campaignMap[name].totals.conversions += conversions;
        campaignMap[name].totals.revenue += revenue;
      });

      return Object.values(campaignMap);
    }

    const config = getStoredConfig();
    if (config.useMock) return MOCK_CAMPAIGNS;

    try {
      const adsRaw = await sheetsService.fetchRemoteCsv(config.spreadsheetId, config.gids.ads_daily);
      const campaignMap: Record<string, any> = {};

      adsRaw.forEach(d => {
        if (d.client_id?.toString() !== clientId.toString()) return;
        const dDate = parseToLocalDate(d.date);
        if (!dDate || !start || !end || dDate < start || dDate > end) return;

        // Como a Ads_Daily é agregada por Canal, tratamos o canal como "campanha mestre"
        const name = d.source_type?.toUpperCase() || 'MARKETING';
        const platform = (d.source_type === 'meta_ads' ? Platform.META_ADS : Platform.GOOGLE_ADS);
        
        if (!campaignMap[name]) {
          campaignMap[name] = { id: name, name, platform, totals: { spend: 0, revenue: 0, conversions: 0, followers: 0 } };
        }
        
        campaignMap[name].totals.spend += parseNum(d.investment);
        campaignMap[name].totals.conversions += parseNum(d.conversions);
      });

      return Object.values(campaignMap);
    } catch (e) { return []; }
  }
};
