
import { DateRange } from '../types';

export interface WindsorConfig {
  apiKey: string;
  useWindsor: boolean;
}

const STORAGE_KEY = 'BLUEBOLT_WINDSOR_CONFIG';

export const getWindsorConfig = (): WindsorConfig => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return { apiKey: '', useWindsor: false };
  try {
    return JSON.parse(saved);
  } catch {
    return { apiKey: '', useWindsor: false };
  }
};

export const saveWindsorConfig = (config: WindsorConfig) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

export const windsorService = {
  async fetchData(dateRange: DateRange, connector: string = 'all'): Promise<any[]> {
    const config = getWindsorConfig();
    const apiKey = config.apiKey || (import.meta as any).env.VITE_WINDSOR_API_KEY;
    
    if (!apiKey) {
      console.error("Windsor API Key not found. Please configure it in the settings modal.");
      return [];
    }

    const dateFrom = dateRange.start.toISOString().split('T')[0];
    const dateTo = dateRange.end.toISOString().split('T')[0];
    
    // Default fields for Windsor.ai - using common normalized fields
    const fields = [
      'date',
      'source',
      'campaign',
      'clicks',
      'impressions',
      'spend',
      'revenue',
      'conversions'
    ].join(',');

    const url = `https://connectors.windsor.ai/${connector}?api_key=${apiKey}&date_from=${dateFrom}&date_to=${dateTo}&fields=${fields}&_renderer=json`;

    console.log(`[Windsor] Fetching data from ${dateFrom} to ${dateTo}...`);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Windsor] API Error: ${response.status}`, errorText);
        return [];
      }
      const json = await response.json();
      
      if (!json.data || json.data.length === 0) {
        console.warn("[Windsor] No data returned for this period. Check if your API Key has access to the selected accounts.");
        return [];
      }

      console.log(`[Windsor] Successfully fetched ${json.data.length} rows.`);
      return json.data;
    } catch (error) {
      console.error("[Windsor] Network error:", error);
      return [];
    }
  }
};
