
export type AlertType = 
  | 'churn_risk'
  | 'contract_golden_period'      // 45-60 dias - Prazo de ouro ⭐
  | 'contract_action_required'    // 30-45 dias - Ação necessária
  | 'contract_renewal_urgent'     // 15-30 dias - Urgente
  | 'contract_renewal_critical'   // <15 dias - Crítico
  | 'contract_expired'
  | 'campaign_delayed'
  | 'low_roas'
  | 'campaign_stalled'
  | 'traffic_only'
  | 'budget_depleted'
  | 'low_conversion'
  | 'no_activity'
  | 'negative_trend'
  | 'high_cac';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

export type ClientHealthStatus = 'critical' | 'warning' | 'healthy' | 'excellent';

export interface QuickAction {
  label: string;
  icon: string;
  action: () => void;
  variant: 'primary' | 'secondary' | 'danger';
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  metric?: {
    label: string;
    value: string | number;
    threshold: string | number;
  };
  daysOverdue?: number;
  actionRequired: string;
  quickActions?: QuickAction[];
  createdAt: Date;
}

export interface ClientHealthMetrics {
  roasScore: number;           // 0-25 pontos
  campaignActivityScore: number; // 0-20 pontos
  budgetScore: number;          // 0-20 pontos
  contractScore: number;        // 0-15 pontos
  engagementScore: number;      // 0-10 pontos
  growthScore: number;          // 0-10 pontos
}

export interface ClientHealth {
  clientId: string;
  clientName: string;
  totalScore: number;           // 0-100
  status: ClientHealthStatus;
  metrics: ClientHealthMetrics;
  alerts: Alert[];
  roas: number;
  budgetUsed: number;
  budgetTotal: number;
  retainerFee: number;          // Avença Mensal
  contractDaysRemaining: number;
  lastUpdated: Date;
}

export interface OperationalThresholds {
  // ROAS
  criticalRoas: number;        
  lowRoas: number;             
  targetRoas: number;          
  
  // CONTRATOS
  contractGoldenPeriodDays: number;    // 60 dias
  contractActionRequiredDays: number;  // 45 dias
  contractRenewalUrgentDays: number;   // 30 dias
  contractRenewalCriticalDays: number; // 15 dias
  contractExpiredDays: number;         // 0 dias
  
  // CAMPANHAS
  campaignDelayDays: number;   
  campaignStalledDays: number; 
  
  // ORÇAMENTO
  budgetWarning: number;       
  budgetCritical: number;      
  
  // OUTROS
  minConversionRate: number;   
  maxCacMultiplier: number;    
  inactivityDays: number;      
}
