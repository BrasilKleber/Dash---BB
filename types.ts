
export enum Platform {
  GOOGLE_ADS = 'google_ads',
  META_ADS = 'meta_ads',
}

export enum BackofficePlatform {
  WOOCOMMERCE = 'woocommerce',
  SHOPIFY = 'shopify',
}

export enum SystemStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  RUNNING = 'RUNNING',
}

export type ObjectiveType = 'followers' | 'leads' | 'sales' | 'hybrid';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  active: boolean;
  objective_primary: ObjectiveType;
  objective_secondary?: ObjectiveType[];
  kpi_preferences?: string[];
}

export interface DataSource {
  id: string;
  clientId: string;
  type: Platform | BackofficePlatform;
  active: boolean;
  credentialName: string;
}

export interface DateRange {
  start: Date;
  end: Date;
  label: string;
}

// Interface interna para cálculos (Schema Final_Daily)
export interface DailyMetric {
  date: string;
  investment_total: number;
  revenue_gross: number;
  revenue_net: number;
  orders: number;
  conversions_ads_total: number;
  clicks_total: number;
  impressions_total: number;
  roas_gross: number;
  cac: number;
  aov: number;
}

// Interface que o UI consome (Mapeada para compatibilidade)
export interface CampaignDailyStat {
  date: string;
  spend: number;
  conversions: number;
  revenue: number;
  // Adjusted to match usage in mock data and components
  sales?: number;
  leads?: number;
  followers?: number;
  profileVisits?: number;
  clicks?: number;
  reach?: number;
}

export interface CampaignData {
  id: string;
  name: string;
  platform: Platform;
  totals: {
    spend: number;
    revenue: number;
    conversions: number;
    followers: number;
    efficiency?: number;
  };
  // Fix: Added missing dailyStats property used in mock data
  dailyStats?: CampaignDailyStat[];
}

export interface SystemRun {
  runId: string;
  start: string;
  end: string;
  status: SystemStatus;
}

export interface SystemError {
  client: string;
  source: string;
  message: string;
  date: string;
}

export interface Attachment {
  name: string;
  type: string;
  size: number;
  data: string;
  preview?: string;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
}

export interface AIContext {
  client: Client;
  dateRange: { start: string; end: string; label: string };
  totals: any;
  series: any[];
  topCampaigns: any[];
}

export interface Assistant {
  id: string;
  name: string;
  description: string;
  icon: any; // LucideIcon
  color: string;
  gradient: string;
  systemPrompt: string;
  examples: string[];
}

export interface AssistantChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isGenerating: boolean;
}