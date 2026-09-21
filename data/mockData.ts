

import { Client, Platform, DataSource, CampaignData, SystemRun, SystemStatus, SystemError } from '../types';

// Função auxiliar para gerar datas
const getDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'EcoCommerce Portugal', active: true, objective_primary: 'sales', kpi_preferences: ['spend', 'revenue', 'roas'] },
  { id: '2', name: 'FitGlobal Nutrition', active: true, objective_primary: 'leads', kpi_preferences: ['spend', 'leads', 'cpl'] },
  { id: '3', name: 'Influencer Brand UX', active: true, objective_primary: 'followers', kpi_preferences: ['spend', 'followers', 'cpf'] },
  { id: '4', name: 'Imobiliária Prime LX', active: true, objective_primary: 'hybrid', objective_secondary: ['leads', 'sales'], kpi_preferences: ['spend', 'revenue', 'leads'] },
];

export const MOCK_SOURCES: DataSource[] = [
  { id: 's1', clientId: '1', type: Platform.GOOGLE_ADS, credentialName: 'google-eco-prod', active: true },
  { id: 's2', clientId: '1', type: Platform.META_ADS, credentialName: 'meta-eco-prod', active: true },
];

// Gerar 60 dias de estatísticas diárias
export const MOCK_DAILY_STATS = Array.from({ length: 60 }).map((_, i) => {
  const date = getDate(59 - i);
  const baseSpend = 400 + Math.random() * 200;
  const visits = Math.floor(baseSpend * 5);
  return {
    date,
    spend: baseSpend,
    revenue: baseSpend * (4 + Math.random() * 2),
    sales: Math.floor(baseSpend / 15),
    leads: Math.floor(baseSpend / 12),
    followers: Math.floor(baseSpend / 0.8),
    visits: visits,
    clicks: Math.floor(visits * 0.8),
    reach: Math.floor(visits * 10),
  };
});

// Campanhas com dados diários reais para agregação
// Fix: Added missing 'totals' property for each CampaignData object to match the interface
export const MOCK_CAMPAIGNS: CampaignData[] = [
  {
    id: 'c1',
    name: 'Search - Brand - PT',
    platform: Platform.GOOGLE_ADS,
    totals: {
      spend: 3500,
      revenue: 14000,
      conversions: 150,
      followers: 0
    },
    dailyStats: MOCK_DAILY_STATS.map(s => ({
      date: s.date,
      spend: s.spend * 0.2,
      conversions: Math.floor(s.sales * 0.3),
      revenue: s.revenue * 0.3,
      followers: 0,
      profileVisits: Math.floor(s.visits * 0.1)
    }))
  },
  {
    id: 'c2',
    name: 'PMax - Prospecting',
    platform: Platform.GOOGLE_ADS,
    totals: {
      spend: 7000,
      revenue: 28000,
      conversions: 220,
      followers: 0
    },
    dailyStats: MOCK_DAILY_STATS.map(s => ({
      date: s.date,
      spend: s.spend * 0.4,
      conversions: Math.floor(s.sales * 0.35),
      revenue: s.revenue * 0.4,
      followers: 0,
      profileVisits: Math.floor(s.visits * 0.2)
    }))
  },
  {
    id: 'c3',
    name: 'Meta - Advantage+ Shopping',
    platform: Platform.META_ADS,
    totals: {
      spend: 5500,
      revenue: 19000,
      conversions: 180,
      followers: 400
    },
    dailyStats: MOCK_DAILY_STATS.map(s => ({
      date: s.date,
      spend: s.spend * 0.3,
      conversions: Math.floor(s.sales * 0.25),
      revenue: s.revenue * 0.2,
      followers: Math.floor(s.followers * 0.5),
      profileVisits: Math.floor(s.visits * 0.4)
    }))
  },
  {
    id: 'c4',
    name: 'Meta - Retargeting DPA',
    platform: Platform.META_ADS,
    totals: {
      spend: 1800,
      revenue: 6500,
      conversions: 80,
      followers: 120
    },
    dailyStats: MOCK_DAILY_STATS.map(s => ({
      date: s.date,
      spend: s.spend * 0.1,
      conversions: Math.floor(s.sales * 0.1),
      revenue: s.revenue * 0.1,
      followers: Math.floor(s.followers * 0.5),
      profileVisits: Math.floor(s.visits * 0.3)
    }))
  }
];

export const MOCK_RUNS: SystemRun[] = [
  { runId: 'run_9821', start: '2024-05-15 08:00', end: '2024-05-15 08:12', status: SystemStatus.SUCCESS },
];

export const MOCK_ERRORS: SystemError[] = [
  { client: 'TechSolutions SaaS', source: 'Google Ads', message: 'Authentication token expired', date: '2024-05-15 06:04' },
];
