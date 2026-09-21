
import { Client } from '../types/crm';
import { sheetsService } from './sheetsService';

export class SheetsToCrmMapper {
  
  static async mapClients(spreadsheetId: string, gid: string): Promise<Client[]> {
    try {
      const rawData = await sheetsService.fetchRemoteCsv(spreadsheetId, gid);
      
      return rawData.map(row => ({
        id: row.client_id || row.clientid || '',
        name: row.client_name || row.clientname || '',
        industry: row.industry || 'Não especificado',
        contactName: row.contact_name || row.contactname || '',
        contactEmail: row.contact_email || row.contactemail || '',
        contactPhone: row.contact_phone || row.contactphone || '',
        niche: row.niche || '',
        market: row.market || '',
        tone: row.tone || '',
        objective: row.objective_primary || row.objective || '',
        targetAudience: row.target_audience || row.targetaudience || '',
        status: (row.status || 'active') as 'active' | 'inactive' | 'paused',
        campaigns: [],
        createdAt: row.created_at ? new Date(row.created_at) : new Date(),
        updatedAt: row.updated_at ? new Date(row.updated_at) : new Date()
      }));
    } catch (error) {
      console.error('Erro ao mapear Clients:', error);
      return [];
    }
  }
  
  static async mapSources(spreadsheetId: string, gid: string): Promise<any[]> {
    try {
      const rawData = await sheetsService.fetchRemoteCsv(spreadsheetId, gid);
      
      return rawData.map(row => ({
        client_id: row.client_id || row.clientid || '',
        client_name: row.client_name || row.clientname || '',
        timezone: row.timezone || 'Europe/Lisbon',
        meta_enabled: row.meta_enabled === 'TRUE' || row.metaenabled === 'TRUE',
        meta_ad_account_id: row.meta_ad_account_id || row.metaadaccountid || '',
        google_enabled: row.google_enabled === 'TRUE' || row.googleenabled === 'TRUE',
        google_customer_id: row.google_customer_id || row.googlecustomerid || '',
        woocommerce_enabled: row.woocommerce_enabled === 'TRUE' || row.woocommerceenabled === 'TRUE',
        woo_url: row.woo_url || row.woourl || '',
        shopify_enabled: row.shopify_enabled === 'TRUE' || row.shopifyenabled === 'TRUE',
        shopify_store_domain: row.shopify_store_domain || row.shopifystoredomain || '',
        currency: row.currency || 'EUR',
        notes: row.notes || ''
      }));
    } catch (error) {
      console.error('Erro ao mapear Sources:', error);
      return [];
    }
  }
  
  static async mapAdsDaily(spreadsheetId: string, gid: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    try {
      const rawData = await sheetsService.fetchRemoteCsv(spreadsheetId, gid);
      
      let filtered = rawData;
      
      if (startDate || endDate) {
        filtered = rawData.filter(row => {
          const rowDate = new Date(row.date);
          if (startDate && rowDate < startDate) return false;
          if (endDate && rowDate > endDate) return false;
          return true;
        });
      }
      
      return filtered.map(row => ({
        date: new Date(row.date),
        client_id: row.client_id || row.clientid || '',
        source_type: row.source_type || row.sourcetype || '',
        investment: parseFloat(row.investment) || 0,
        impressions: parseInt(row.impressions) || 0,
        clicks: parseInt(row.clicks) || 0,
        conversions: parseInt(row.conversions) || 0,
        ctr: row.clicks && row.impressions ? (parseInt(row.clicks) / parseInt(row.impressions)) * 100 : 0,
        cpc: row.investment && row.clicks ? parseFloat(row.investment) / parseInt(row.clicks) : 0,
      }));
    } catch (error) {
      console.error('Erro ao mapear Ads_Daily:', error);
      return [];
    }
  }
  
  static async mapSalesDaily(spreadsheetId: string, gid: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    try {
      const rawData = await sheetsService.fetchRemoteCsv(spreadsheetId, gid);
      
      let filtered = rawData;
      
      if (startDate || endDate) {
        filtered = rawData.filter(row => {
          const rowDate = new Date(row.date);
          if (startDate && rowDate < startDate) return false;
          if (endDate && rowDate > endDate) return false;
          return true;
        });
      }
      
      return filtered.map(row => ({
        date: new Date(row.date),
        client_id: row.client_id || row.clientid || '',
        platform: row.platform || '',
        revenue_gross: parseFloat(row.revenue_gross || row.revenuegross) || 0,
        revenue_net: parseFloat(row.revenue_net || row.revenuenet) || 0,
        orders: parseInt(row.orders) || 0,
        customers: parseInt(row.customers) || 0,
        refunds: parseFloat(row.refunds) || 0,
        aov: parseFloat(row.aov) || 0,
        currency: row.currency || 'EUR'
      }));
    } catch (error) {
      console.error('Erro ao mapear Sales_Daily:', error);
      return [];
    }
  }
  
  static async mapFinalDaily(spreadsheetId: string, gid: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    try {
      const rawData = await sheetsService.fetchRemoteCsv(spreadsheetId, gid);
      
      let filtered = rawData;
      
      if (startDate || endDate) {
        filtered = rawData.filter(row => {
          const rowDate = new Date(row.date);
          if (startDate && rowDate < startDate) return false;
          if (endDate && rowDate > endDate) return false;
          return true;
        });
      }
      
      return filtered.map(row => ({
        date: new Date(row.date),
        client_id: row.client_id || row.clientid || '',
        investment_total: parseFloat(row.investment_total || row.investmenttotal) || 0,
        clicks_total: parseInt(row.clicks_total || row.clickstotal) || 0,
        impressions_total: parseInt(row.impressions_total || row.impressionstotal) || 0,
        conversions_ads_total: parseInt(row.conversions_ads_total || row.conversionsadstotal) || 0,
        revenue_gross: parseFloat(row.revenue_gross || row.revenuegross) || 0,
        revenue_net: parseFloat(row.revenue_net || row.revenuenet) || 0,
        orders: parseInt(row.orders) || 0,
        roas_gross: parseFloat(row.roas_gross || row.roasgross) || 0,
        roas_net: parseFloat(row.roas_net || row.roasnet) || 0,
        cac: parseFloat(row.cac) || 0,
        aov: parseFloat(row.aov) || 0,
        currency: row.currency || 'EUR'
      }));
    } catch (error) {
      console.error('Erro ao mapear Final_Daily:', error);
      return [];
    }
  }
  
  static async mapSocialDaily(spreadsheetId: string, gid: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    try {
      const rawData = await sheetsService.fetchRemoteCsv(spreadsheetId, gid);
      
      let filtered = rawData;
      
      if (startDate || endDate) {
        filtered = rawData.filter(row => {
          const rowDate = new Date(row.date);
          if (startDate && rowDate < startDate) return false;
          if (endDate && rowDate > endDate) return false;
          return true;
        });
      }
      
      return filtered.map(row => ({
        date: new Date(row.date),
        client_id: row.client_id || row.clientid || '',
        followers_gained: parseInt(row.followers_gained || row.followersgained) || 0,
        profile_visits: parseInt(row.profile_visits || row.profilevisits) || 0,
        engagement: parseInt(row.engagement) || 0
      }));
    } catch (error) {
      console.error('Erro ao mapear Social_Daily:', error);
      return [];
    }
  }
  
  static async mapSyncLog(spreadsheetId: string, gid: string): Promise<any[]> {
    try {
      const rawData = await sheetsService.fetchRemoteCsv(spreadsheetId, gid);
      
      return rawData.map(row => ({
        run_id: row.run_id || row.runid || '',
        date: new Date(row.date),
        client_id: row.client_id || row.clientid || '',
        source_type: row.source_type || row.sourcetype || '',
        status: row.status || '',
        message: row.message || ''
      }));
    } catch (error) {
      console.error('Erro ao mapear Sync_Log:', error);
      return [];
    }
  }
  
  static async loadDashboardData(spreadsheetId: string, gids: any, dateRange?: { start: Date; end: Date }) {
    const [
      clients,
      adsDaily,
      salesDaily,
      finalDaily,
      socialDaily
    ] = await Promise.all([
      this.mapClients(spreadsheetId, gids.clients || '0'),
      this.mapAdsDaily(spreadsheetId, gids.ads_daily || '0', dateRange?.start, dateRange?.end),
      this.mapSalesDaily(spreadsheetId, gids.sales_daily || '0', dateRange?.start, dateRange?.end),
      this.mapFinalDaily(spreadsheetId, gids.final_daily || '0', dateRange?.start, dateRange?.end),
      this.mapSocialDaily(spreadsheetId, gids.social_daily || '0', dateRange?.start, dateRange?.end)
    ]);
    
    return {
      clients,
      adsDaily,
      salesDaily,
      finalDaily,
      socialDaily,
      stats: {
        totalClients: clients.length,
        activeClients: clients.filter(c => c.status === 'active').length,
        totalRevenue: finalDaily.reduce((sum, row) => sum + row.revenue_gross, 0),
        totalInvestment: finalDaily.reduce((sum, row) => sum + row.investment_total, 0),
        avgRoas: finalDaily.length > 0 
          ? finalDaily.reduce((sum, row) => sum + row.roas_gross, 0) / finalDaily.length 
          : 0
      }
    };
  }
}
