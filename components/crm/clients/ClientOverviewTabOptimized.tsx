
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ClientOverview } from '../../../types/clientHub';
import { OverviewHeaderOptimized } from './overview/OverviewHeaderOptimized';
import { UpcomingActivities } from './overview/UpcomingActivities';
import { CampaignsExpanded } from './overview/CampaignsExpanded';
import { DocumentsList } from './overview/DocumentsList';
import { MeetingMinutesCompactWidget } from './overview/MeetingMinutesCompact';
import { PendingTasks } from './overview/PendingTasks';
import { ClientAlerts } from './overview/ClientAlerts';
import { ClientConfigWidget } from './overview/ClientConfigWidget';

interface Props {
  clientId: string;
}

export const ClientOverviewTabOptimized = ({ clientId }: Props) => {
  const [overview, setOverview] = useState<ClientOverview | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadClientOverview();
  }, [clientId]);
  
  const loadClientOverview = async () => {
    setLoading(true);
    try {
      // Simulação de delay
      await new Promise(resolve => setTimeout(resolve, 600));
      const mockData = generateMockOverview(clientId);
      setOverview(mockData);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading || !overview) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }
  
  const upcomingActionsCount = overview.upcoming_activities
    .filter(a => a.status === 'scheduled')
    .length + overview.pending_tasks.length;
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER COM 3 KPIs */}
      <OverviewHeaderOptimized 
        health_score={overview.health_score}
        contract={overview.client.contract}
        upcoming_actions_count={upcomingActionsCount}
      />
      
      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* COLUNA ESQUERDA - 2/3 */}
        <div className="xl:col-span-2 space-y-6">
          {/* Próximas Atividades */}
          <UpcomingActivities 
            activities={overview.upcoming_activities}
            clientId={clientId}
            onRefresh={loadClientOverview}
          />
          
          {/* Campanhas Expandidas */}
          <CampaignsExpanded 
            campaigns={overview.active_campaigns}
            clientId={clientId}
          />
          
          {/* Documentos */}
          <DocumentsList 
            documents={overview.recent_documents}
            clientId={clientId}
            onRefresh={loadClientOverview}
          />
        </div>
        
        {/* COLUNA DIREITA - 1/3 SIDEBAR */}
        <div className="space-y-6">
          {/* Atas Compactas */}
          <MeetingMinutesCompactWidget 
            meetings={overview.recent_meetings}
            clientId={clientId}
            onRefresh={loadClientOverview}
          />
          
          {/* Tarefas Pendentes */}
          <PendingTasks 
            tasks={overview.pending_tasks}
            clientId={clientId}
            onRefresh={loadClientOverview}
          />
          
          {/* Alertas */}
          <ClientAlerts 
            alerts={overview.alerts}
            clientId={clientId}
          />
          
          {/* Configurações */}
          <ClientConfigWidget 
            config={overview.client}
          />
        </div>
      </div>
    </div>
  );
};

// MOCK DATA GENERATOR
const generateMockOverview = (clientId: string): ClientOverview => {
  const startDate = new Date('2024-07-01');
  const endDate = new Date('2025-01-01');
  const now = new Date();
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = now.getTime() - startDate.getTime();
  const progressPercentage = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    health_score: 92,
    client: {
      id: clientId,
      name: 'EcoCommerce Portugal',
      email: 'maria.costa@ecocommerce.pt',
      phone: '+351 912 345 678',
      account_manager: 'João Silva',
      industry: 'E-commerce',
      company_size: 'medium',
      monthly_budget: 5000,
      contract: {
        start_date: startDate,
        end_date: endDate,
        duration_months: 6,
        days_remaining: daysRemaining,
        progress_percentage: progressPercentage,
        status: daysRemaining > 60 ? 'active' : daysRemaining > 0 ? 'expiring_soon' : 'expired',
        type: 'biannual',
        monthly_value: 5000
      },
      billing_day: 1,
      payment_method: 'Transferência Bancária',
      website: 'https://ecocommerce.pt'
    },
    upcoming_activities: [
      {
        id: '1',
        client_id: clientId,
        type: 'meeting',
        title: 'Reunião Mensal',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        time: '10:00',
        duration: 60,
        location: 'Zoom',
        status: 'scheduled',
        priority: 'high'
      },
      {
        id: '2',
        client_id: clientId,
        type: 'deadline',
        title: 'Entrega Proposta Q1',
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        status: 'scheduled',
        priority: 'high'
      },
      {
        id: '3',
        client_id: clientId,
        type: 'call',
        title: 'Follow-up Performance',
        date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        time: '15:00',
        duration: 30,
        status: 'scheduled',
        priority: 'medium'
      }
    ],
    active_campaigns: [
      {
        id: '1',
        client_id: clientId,
        name: 'Lançamento Q1 2025',
        status: 'active',
        progress: 80,
        roas: 4.2,
        budget_total: 2500,
        budget_spent: 2000,
        budget_remaining: 500,
        conversions: 42,
        cpl: 59.52,
        revenue: 8400,
        impressions: 125000,
        clicks: 3200,
        ctr: 2.56,
        start_date: new Date('2024-12-01'),
        last_updated: new Date()
      },
      {
        id: '2',
        client_id: clientId,
        name: 'Google Shopping Test',
        status: 'launching',
        progress: 40,
        roas: 3.8,
        budget_total: 1000,
        budget_spent: 400,
        budget_remaining: 600,
        conversions: 18,
        cpl: 55.55,
        revenue: 1520,
        impressions: 45000,
        clicks: 980,
        ctr: 2.18,
        start_date: new Date('2024-12-20'),
        last_updated: new Date()
      }
    ],
    recent_meetings: [
      {
        id: '1',
        client_id: clientId,
        title: 'Reunião Mensal - Mês Passado',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        key_topics: [
          'Performance Novembro',
          'Plano de Ação Dezembro',
          'Budget Q1 2025'
        ],
        action_items_completed: 1,
        action_items_total: 3,
        next_meeting: {
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          time: '10:00'
        }
      }
    ],
    pending_tasks: [
      {
        id: '1',
        title: 'Aprovar Criativos Meta',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        priority: 'high'
      },
      {
        id: '2',
        title: 'Enviar Relatório Semanal',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        priority: 'medium'
      }
    ],
    alerts: [
      {
        id: '1',
        type: 'contract_action_required',
        severity: 'high',
        clientId: clientId,
        clientName: 'EcoCommerce Portugal',
        title: 'Contrato em Prazo de Ouro',
        description: `Contrato expira em ${daysRemaining} dias - Momento ideal para iniciar renovação`,
        createdAt: new Date(),
        actionRequired: 'Agendar reunião de renovação'
      }
    ],
    recent_documents: [
      {
        id: '1',
        client_id: clientId,
        name: 'Contrato 2025.pdf',
        type: 'contract',
        file_url: '#',
        file_size: 524288,
        file_type: 'application/pdf',
        uploaded_by: 'admin',
        uploaded_at: new Date('2024-11-28')
      },
      {
        id: '2',
        client_id: clientId,
        name: 'Proposta Q1 2025.pdf',
        type: 'proposal',
        file_url: '#',
        file_size: 1048576,
        file_type: 'application/pdf',
        uploaded_by: 'admin',
        uploaded_at: new Date('2024-12-15')
      },
      {
        id: '3',
        client_id: clientId,
        name: 'Briefing Campanha.docx',
        type: 'briefing',
        file_url: '#',
        file_size: 102400,
        file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        uploaded_by: 'admin',
        uploaded_at: new Date('2024-12-10')
      }
    ]
  };
};
