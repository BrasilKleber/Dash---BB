
// CONTRATO COM PROGRESSO TEMPORAL
export interface ContractInfo {
  start_date: Date;
  end_date: Date;
  duration_months: number;
  days_remaining: number;
  progress_percentage: number;
  status: 'active' | 'expiring_soon' | 'expired';
  type: 'monthly' | 'quarterly' | 'biannual' | 'annual';
  monthly_value: number;
}

// CAMPANHA COM MÉTRICAS COMPLETAS
export interface CampaignMetrics {
  id: string;
  client_id: string;
  name: string;
  status: 'launching' | 'active' | 'paused' | 'completed';
  progress: number;
  
  // Métricas financeiras
  roas: number;
  budget_total: number;
  budget_spent: number;
  budget_remaining: number;
  
  // Métricas de performance
  conversions: number;
  cpl: number;
  revenue: number;
  
  // Métricas de tráfego
  impressions: number;
  clicks: number;
  ctr: number;
  
  // Datas
  start_date: Date;
  end_date?: Date;
  last_updated: Date;
}

// ATAS COMPACTAS (RESUMO)
export interface MeetingMinutesCompact {
  id: string;
  client_id: string;
  title: string;
  date: Date;
  key_topics: string[];
  action_items_completed: number;
  action_items_total: number;
  next_meeting?: {
    date: Date;
    time: string;
  };
}

// CONFIGURAÇÕES DO CLIENTE
export interface ClientConfig {
  id: string;
  name: string;
  email: string;
  phone: string;
  account_manager: string;
  industry: string;
  company_size: 'small' | 'medium' | 'large';
  monthly_budget: number;
  contract: ContractInfo;
  billing_day: number;
  payment_method: string;
  website?: string;
  address?: string;
}

// ATIVIDADES
export interface ClientActivity {
  id: string;
  client_id: string;
  type: 'meeting' | 'task' | 'call' | 'deadline' | 'event' | 'reminder';
  title: string;
  description?: string;
  date: Date;
  time?: string;
  duration?: number;
  location?: string;
  participants?: string[];
  notes?: string;
  reminder?: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  priority: 'low' | 'medium' | 'high';
  created_by?: string;
  created_at?: Date;
}

// DOCUMENTOS
export interface ClientDocument {
  id: string;
  client_id: string;
  name: string;
  type: 'contract' | 'proposal' | 'report' | 'briefing' | 'presentation' | 'other';
  file_url: string;
  file_size: number;
  file_type: string;
  uploaded_by: string;
  uploaded_at: Date;
  tags?: string[];
  description?: string;
}

// TIPOS EXISTENTES (Mantidos/Adaptados para compatibilidade)
export interface MeetingMinutes {
  id: string;
  client_id: string;
  date: Date;
  title: string;
  participants: any[];
  topics: string[];
  decisions: string[];
  action_items: any[];
  notes: string;
  next_meeting?: { date: Date; time: string; location: string };
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface QuickNote {
  id: string;
  client_id: string;
  content: string;
  created_by: string;
  created_at: Date;
  updated_at?: Date;
  pinned?: boolean;
}

export interface UpcomingAction {
  id: string;
  type: 'task' | 'meeting' | 'deadline' | 'action_item';
  title: string;
  date: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'done';
}

// OVERVIEW COMPLETO OTIMIZADO
export interface ClientOverview {
  client: ClientConfig;
  health_score: number;
  upcoming_activities: ClientActivity[];
  active_campaigns: CampaignMetrics[];
  recent_meetings: MeetingMinutesCompact[];
  pending_tasks: any[];
  alerts: any[];
  recent_documents: ClientDocument[];
  // Campos legados para compatibilidade com componentes antigos se necessário
  quick_notes?: QuickNote[];
  recent_meetings_full?: MeetingMinutes[];
}
