
import { Client, Platform, ObjectiveType } from '../types';

export interface SheetConfig {
  spreadsheetId: string;
  sheetsUrl: string;
  useMock: boolean;
  status: 'unconfigured' | 'connecting' | 'connected' | 'error';
  lastError?: string;
  gids: {
    clients: string;
    sources: string;
    ads_daily: string;
    sales_daily: string;
    final_daily: string;
    social_daily: string;
    sync_log: string;
  };
}

const STORAGE_KEY = 'BLUEBOLT_CRM_CONFIG_V3';

const DEFAULT_CONFIG: SheetConfig = {
  spreadsheetId: '',
  sheetsUrl: '',
  useMock: true,
  status: 'unconfigured',
  gids: {
    clients: '0',
    sources: '',
    ads_daily: '',
    sales_daily: '',
    final_daily: '',
    social_daily: '',
    sync_log: ''
  }
};

export const getStoredConfig = (): SheetConfig => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return DEFAULT_CONFIG;
  try {
    return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
  } catch {
    return DEFAULT_CONFIG;
  }
};

export const saveConfig = (config: SheetConfig) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

export const extractIdFromUrl = (url: string): string | null => {
  if (!url) return null;
  const pubMatch = url.match(/spreadsheets\/d\/e\/([a-zA-Z0-9-_]{40,})/);
  if (pubMatch) return pubMatch[1];
  const standardMatch = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]{20,})/);
  if (standardMatch) return standardMatch[1];
  return null;
};

export const parseCSV = (csv: string) => {
  if (!csv || csv.trim() === '') return [];
  const cleanCsv = csv.replace(/^\uFEFF/, '').trim();
  const lines = cleanCsv.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 1) return [];

  const firstLine = lines[0];
  const separator = firstLine.includes(';') ? ';' : ',';
  const rawHeaders = firstLine.split(separator).map(h => h.trim().replace(/^["']|["']$/g, ''));
  
  return lines.slice(1).map((line) => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') inQuotes = !inQuotes;
      else if (char === separator && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row: any = {};
    rawHeaders.forEach((header, i) => {
      let val = values[i] || '';
      val = val.replace(/^["']|["']$/g, '');
      const key = header.toLowerCase().trim().replace(/[^a-z0-9_]/g, "");
      if (key) row[key] = val;
    });
    return row;
  });
};

export const sheetsService = {
  async fetchRemoteCsv(spreadsheetId: string, gid: string): Promise<any[]> {
    if (!spreadsheetId) throw new Error('ID do Google Sheets ausente.');
    let url = spreadsheetId.startsWith('2PACX') 
      ? `https://docs.google.com/spreadsheets/d/e/${spreadsheetId}/pub?gid=${gid || '0'}&output=csv`
      : `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid || '0'}`;
    
    try {
      const response = await fetch(url + `&t=${Date.now()}`);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const csvText = await response.text();
      return parseCSV(csvText);
    } catch (e: any) { throw e; }
  },

  async validateTab(spreadsheetId: string, gid: string, requiredColumns: string[]): Promise<{ success: boolean; error?: string }> {
    try {
      await this.fetchRemoteCsv(spreadsheetId, gid);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
};
