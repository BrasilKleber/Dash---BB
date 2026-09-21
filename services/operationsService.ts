
import { ClientHealth, Alert, OperationalThresholds } from '../types/operations';

const DEFAULT_THRESHOLDS: OperationalThresholds = {
  criticalRoas: 1.5,
  lowRoas: 2.5,
  targetRoas: 3.5,
  
  // CONTRATOS - REGRA DE OURO ⭐
  contractGoldenPeriodDays: 60,      // Início do prazo de ouro
  contractActionRequiredDays: 45,    // Ação necessária
  contractRenewalUrgentDays: 30,     // Urgente
  contractRenewalCriticalDays: 15,   // Crítico
  contractExpiredDays: 0,
  
  campaignDelayDays: 7,
  campaignStalledDays: 14,
  budgetWarning: 80,
  budgetCritical: 95,
  minConversionRate: 1,
  maxCacMultiplier: 2,
  inactivityDays: 15
};

export const calculateClientHealth = (clientData: any): ClientHealth => {
  const metrics = {
    roasScore: calculateRoasScore(clientData.roas),
    campaignActivityScore: calculateCampaignScore(clientData),
    budgetScore: calculateBudgetScore(clientData),
    contractScore: calculateContractScore(clientData),
    engagementScore: 10, // Mock
    growthScore: 10      // Mock
  };
  
  const totalScore = Object.values(metrics).reduce((sum, score) => sum + score, 0);
  
  let status: ClientHealth['status'];
  if (totalScore >= 80) status = 'excellent';
  else if (totalScore >= 60) status = 'healthy';
  else if (totalScore >= 40) status = 'warning';
  else status = 'critical';
  
  const alerts = generateAlerts(clientData, metrics);
  
  return {
    clientId: clientData.client_id,
    clientName: clientData.client_name,
    totalScore,
    status,
    metrics,
    alerts,
    roas: clientData.roas,
    budgetUsed: clientData.investment_total || 0,
    budgetTotal: clientData.budget_total || 5000,
    retainerFee: clientData.retainer_fee || 750, // Default 750 se não especificado
    contractDaysRemaining: clientData.contract_days !== undefined ? clientData.contract_days : 90,
    lastUpdated: new Date()
  };
};

const calculateRoasScore = (roas: number): number => {
  if (roas >= 4) return 25;
  if (roas >= 3.5) return 20;
  if (roas >= 2.5) return 15;
  if (roas >= 2) return 10;
  if (roas >= 1.5) return 5;
  return 0;
};

const calculateCampaignScore = (client: any): number => {
  return client.campaigns_active ? 20 : 0;
};

const calculateBudgetScore = (client: any): number => {
  const budgetUsedPercent = (client.investment_total / (client.budget_total || 5000)) * 100;
  
  if (budgetUsedPercent < 70) return 20;
  if (budgetUsedPercent < 85) return 15;
  if (budgetUsedPercent < 95) return 10;
  return 0;
};

const calculateContractScore = (client: any): number => {
  const daysRemaining = client.contract_days !== undefined ? client.contract_days : 90;
  
  if (daysRemaining > 60) return 15;
  if (daysRemaining > 30) return 10;
  if (daysRemaining > 7) return 5;
  return 0;
};

// Lógica de Alertas de Contrato com PRAZO DE OURO
const generateContractAlerts = (client: any, daysRemaining: number): Alert[] => {
  const alerts: Alert[] = [];
  
  // 1. CONTRATO EXPIRADO (Emergência) 🚨
  if (daysRemaining <= DEFAULT_THRESHOLDS.contractExpiredDays) {
    alerts.push({
      id: `${client.client_id}_contract_expired_${Date.now()}`,
      type: 'contract_expired',
      severity: 'critical',
      clientId: client.client_id,
      clientName: client.client_name,
      title: '🚨 Contrato Expirado - EMERGÊNCIA',
      description: `Contrato expirou há ${Math.abs(daysRemaining)} dias`,
      metric: {
        label: 'Status',
        value: 'EXPIRADO',
        threshold: 'Ativo'
      },
      daysOverdue: Math.abs(daysRemaining),
      actionRequired: '🚨 URGENTE: Renovar contrato IMEDIATAMENTE ou suspender serviços',
      quickActions: [
        {
          label: '🔥 Renovar AGORA',
          icon: 'AlertCircle',
          action: () => console.log('Emergency renewal'),
          variant: 'danger'
        },
        {
          label: 'Ligar Cliente',
          icon: 'Phone',
          action: () => console.log('Call client'),
          variant: 'primary'
        }
      ],
      createdAt: new Date()
    });
  }
  
  // 2. CRÍTICO: Menos de 15 dias 🔴
  else if (daysRemaining > 0 && daysRemaining <= DEFAULT_THRESHOLDS.contractRenewalCriticalDays) {
    alerts.push({
      id: `${client.client_id}_contract_critical_${Date.now()}`,
      type: 'contract_renewal_critical',
      severity: 'critical',
      clientId: client.client_id,
      clientName: client.client_name,
      title: '🔴 Contrato Expira em Menos de 15 Dias',
      description: `Contrato expira em apenas ${daysRemaining} dias - Ação CRÍTICA necessária`,
      metric: {
        label: 'Dias restantes',
        value: `${daysRemaining} dias`,
        threshold: '15+ dias'
      },
      daysOverdue: DEFAULT_THRESHOLDS.contractRenewalCriticalDays - daysRemaining,
      actionRequired: '🔴 CRÍTICO: Agendar reunião para finalizar renovação imediatamente',
      quickActions: [
        {
          label: 'Agendar Reunião',
          icon: 'Calendar',
          action: () => console.log('Schedule meeting'),
          variant: 'danger'
        },
        {
          label: 'Contactar AGORA',
          icon: 'Phone',
          action: () => console.log('Contact now'),
          variant: 'primary'
        }
      ],
      createdAt: new Date()
    });
  }
  
  // 3. URGENTE: 15-30 dias ⚠️
  else if (daysRemaining > DEFAULT_THRESHOLDS.contractRenewalCriticalDays && 
           daysRemaining <= DEFAULT_THRESHOLDS.contractRenewalUrgentDays) {
    alerts.push({
      id: `${client.client_id}_contract_urgent_${Date.now()}`,
      type: 'contract_renewal_urgent',
      severity: 'critical',
      clientId: client.client_id,
      clientName: client.client_name,
      title: '⚠️ Contrato Expira em Menos de 1 Mês',
      description: `Contrato expira em ${daysRemaining} dias - Renovação URGENTE`,
      metric: {
        label: 'Dias restantes',
        value: `${daysRemaining} dias`,
        threshold: '30+ dias'
      },
      actionRequired: '⚠️ URGENTE: Agendar reunião para apresentar proposta',
      quickActions: [
        {
          label: 'Agendar Reunião',
          icon: 'Calendar',
          action: () => console.log('Schedule meeting'),
          variant: 'primary'
        },
        {
          label: 'Enviar Proposta',
          icon: 'Send',
          action: () => console.log('Send proposal'),
          variant: 'secondary'
        }
      ],
      createdAt: new Date()
    });
  }
  
  // 4. AÇÃO NECESSÁRIA: 30-45 dias 📋
  else if (daysRemaining > DEFAULT_THRESHOLDS.contractRenewalUrgentDays && 
           daysRemaining <= DEFAULT_THRESHOLDS.contractActionRequiredDays) {
    alerts.push({
      id: `${client.client_id}_contract_action_${Date.now()}`,
      type: 'contract_action_required',
      severity: 'high',
      clientId: client.client_id,
      clientName: client.client_name,
      title: '📋 Contrato Expira em 1-1.5 Meses',
      description: `Contrato expira em ${daysRemaining} dias - Iniciar processo de renovação`,
      metric: {
        label: 'Dias restantes',
        value: `${daysRemaining} dias`,
        threshold: '45+ dias'
      },
      actionRequired: '📋 Iniciar preparação da proposta de renovação',
      quickActions: [
        {
          label: 'Criar Proposta',
          icon: 'FileEdit',
          action: () => console.log('Create proposal'),
          variant: 'primary'
        },
        {
          label: 'Analisar Performance',
          icon: 'TrendingUp',
          action: () => console.log('Analyze performance'),
          variant: 'secondary'
        }
      ],
      createdAt: new Date()
    });
  }
  
  // 5. PRAZO DE OURO: 45-60 dias ⭐
  else if (daysRemaining > DEFAULT_THRESHOLDS.contractActionRequiredDays && 
           daysRemaining <= DEFAULT_THRESHOLDS.contractGoldenPeriodDays) {
    alerts.push({
      id: `${client.client_id}_contract_golden_${Date.now()}`,
      type: 'contract_golden_period',
      severity: 'high',
      clientId: client.client_id,
      clientName: client.client_name,
      title: '⭐ PRAZO DE OURO - Renovação de Contrato',
      description: `Contrato expira em ${daysRemaining} dias - Momento IDEAL para negociar renovação`,
      metric: {
        label: 'Dias restantes',
        value: `${daysRemaining} dias`,
        threshold: 'Prazo de Ouro'
      },
      actionRequired: '⭐ PRAZO DE OURO: Momento perfeito para preparar renovação com calma e estratégia',
      quickActions: [
        {
          label: '⭐ Agendar Reunião',
          icon: 'Calendar',
          action: () => console.log('Schedule meeting'),
          variant: 'primary'
        },
        {
          label: 'Revisar Performance',
          icon: 'BarChart',
          action: () => console.log('Review performance'),
          variant: 'secondary'
        }
      ],
      createdAt: new Date()
    });
  }
  
  return alerts;
};

const generateAlerts = (client: any, metrics: any): Alert[] => {
  const alerts: Alert[] = [];
  
  // Alerta ROAS Crítico
  if (client.roas < DEFAULT_THRESHOLDS.criticalRoas) {
    alerts.push({
      id: `${client.client_id}_low_roas_${Date.now()}`,
      type: 'low_roas',
      severity: 'critical',
      clientId: client.client_id,
      clientName: client.client_name,
      title: 'ROAS Crítico',
      description: `ROAS está muito abaixo do target (${DEFAULT_THRESHOLDS.targetRoas}x)`,
      metric: {
        label: 'ROAS Atual',
        value: `${client.roas.toFixed(2)}x`,
        threshold: `${DEFAULT_THRESHOLDS.targetRoas}x`
      },
      actionRequired: 'Otimizar campanhas ou ajustar estratégia',
      quickActions: [
        {
          label: 'Ver Campanhas',
          icon: 'TrendingUp',
          action: () => console.log('Navigate to campaigns'),
          variant: 'primary'
        }
      ],
      createdAt: new Date()
    });
  }
  
  // Alertas de Contrato
  const daysRemaining = client.contract_days !== undefined ? client.contract_days : 90;
  const contractAlerts = generateContractAlerts(client, daysRemaining);
  alerts.push(...contractAlerts);
  
  // Alerta Budget
  const budgetPercent = (client.investment_total / (client.budget_total || 5000)) * 100;
  if (budgetPercent > DEFAULT_THRESHOLDS.budgetCritical) {
    alerts.push({
      id: `${client.client_id}_budget_${Date.now()}`,
      type: 'budget_depleted',
      severity: 'critical',
      clientId: client.client_id,
      clientName: client.client_name,
      title: 'Orçamento Esgotado',
      description: `${budgetPercent.toFixed(1)}% do orçamento utilizado`,
      metric: {
        label: 'Budget Usado',
        value: `${budgetPercent.toFixed(1)}%`,
        threshold: '95%'
      },
      actionRequired: 'Solicitar aumento de orçamento',
      createdAt: new Date()
    });
  }
  
  return alerts;
};

export const generateMockOperationalData = (): ClientHealth[] => {
  const mockClients = [
    // Cliente 1: PRAZO DE OURO (55 dias) ⭐
    {
      client_id: 'maria_comidas',
      client_name: 'Maria das Comidas',
      roas: 5.43,
      investment_total: 2179.52,
      budget_total: 5000,
      retainer_fee: 750,
      contract_days: 55,
      campaigns_active: true
    },
    // Cliente 2: AÇÃO NECESSÁRIA (32 dias) 📋
    {
      client_id: 'viva_saudavel',
      client_name: 'Viva Saudável',
      roas: 3.93,
      investment_total: 1992.45,
      budget_total: 2500,
      retainer_fee: 750, 
      contract_days: 32,
      campaigns_active: true
    },
    // Cliente 3: SAUDÁVEL (120 dias) - Alerta de contrato expirado removido
    {
      client_id: 'fitlife_academy',
      client_name: 'FitLife Academy',
      roas: 3.2,
      investment_total: 4800,
      budget_total: 5000,
      retainer_fee: 1000,
      contract_days: 120, // Prazo saudável
      campaigns_active: true
    },
    // Cliente 4: AÇÃO NECESSÁRIA (38 dias) 📋
    {
      client_id: 'techstart_consulting',
      client_name: 'TechStart Consulting',
      roas: 4.2,
      investment_total: 1800,
      budget_total: 2500,
      retainer_fee: 1500,
      contract_days: 38,
      campaigns_active: true
    },
    // Cliente 5: CRÍTICO (8 dias) 🔴
    {
      client_id: 'ecocommerce_pt',
      client_name: 'EcoCommerce Portugal',
      roas: 5.43,
      investment_total: 2180,
      budget_total: 5000,
      retainer_fee: 750,
      contract_days: 8,
      campaigns_active: true
    }
  ];
  
  return mockClients.map(calculateClientHealth);
};
