
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ClientOverview, UpcomingAction, MeetingMinutes, ClientConfig } from '../../../types/clientHub';
import { OverviewHeader } from './overview/OverviewHeader';
import { UpcomingActivities } from './overview/UpcomingActivities';
import { MeetingMinutesList } from './overview/MeetingMinutesList';
import { DocumentsList } from './overview/DocumentsList';
import { ActiveCampaigns } from './overview/ActiveCampaigns';
import { PendingTasks } from './overview/PendingTasks';
import { ClientAlerts } from './overview/ClientAlerts';
import { QuickNotes } from './overview/QuickNotes';

interface Props {
  clientId: string;
}

export const ClientOverviewTab = ({ clientId }: Props) => {
  const [overview, setOverview] = useState<ClientOverview | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadClientOverview();
  }, [clientId]);
  
  const loadClientOverview = async () => {
    setLoading(true);
    try {
      // Simulação de delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockData = generateMockClientOverview(clientId);
      setOverview(mockData);
    } catch (error) {
      console.error('Erro ao carregar overview:', error);
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
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header com KPIs */}
      <OverviewHeader client={{
        id: overview.client.id,
        name: overview.client.name,
        health_score: overview.health_score,
        contract_days_remaining: overview.client.contract.days_remaining,
        upcoming_actions_count: overview.upcoming_activities.filter(a => a.status === 'scheduled').length + (overview.pending_tasks?.length || 0)
      }} />
      
      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda - 2/3 largura */}
        <div className="lg:col-span-2 space-y-6">
          {/* Calendário & Próximas Atividades */}
          <UpcomingActivities 
            activities={overview.upcoming_activities}
            clientId={clientId}
            onRefresh={loadClientOverview}
          />
          
          {/* Atas de Reuniões */}
          <MeetingMinutesList 
            meetings={overview.recent_meetings_full || []}
            clientId={clientId}
            onRefresh={loadClientOverview}
          />
          
          {/* Documentos */}
          <DocumentsList 
            documents={overview.recent_documents}
            clientId={clientId}
            onRefresh={loadClientOverview}
          />
        </div>
        
        {/* Coluna Direita - 1/3 largura */}
        <div className="space-y-6">
          {/* Campanhas Ativas */}
          <ActiveCampaigns 
            campaignsCount={overview.active_campaigns.length}
            clientId={clientId}
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
          
          {/* Notas Rápidas */}
          <QuickNotes 
            notes={overview.quick_notes || []}
            clientId={clientId}
            onRefresh={loadClientOverview}
          />
        </div>
      </div>
    </div>
  );
};

// MOCK DATA GENERATOR
const generateMockClientOverview = (clientId: string): ClientOverview => {
  const upcomingActions: UpcomingAction[] = [
    {
      id: '1',
      type: 'meeting',
      title: 'Reunião Mensal',
      date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // +2 dias
      priority: 'high',
      status: 'pending'
    },
    {
      id: '2',
      type: 'deadline',
      title: 'Entrega Proposta Q1',
      date: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000), // +10 dias
      priority: 'high',
      status: 'pending'
    },
    {
      id: '3',
      type: 'task',
      title: 'Aprovar Criativos',
      date: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // -2 dias
      priority: 'medium',
      status: 'in_progress'
    }
  ];

  // Configuração do contrato para ClientConfig
  const contract = {
    start_date: new Date(),
    end_date: new Date(new Date().getTime() + 45 * 24 * 60 * 60 * 1000),
    duration_months: 12,
    days_remaining: 45,
    progress_percentage: 85,
    status: 'active' as const,
    type: 'annual' as const,
    monthly_value: 5000
  };

  const clientConfig: ClientConfig = {
    id: clientId,
    name: 'EcoCommerce Portugal',
    email: 'contact@ecocommerce.pt',
    phone: '+351 999 999 999',
    account_manager: 'John Doe',
    industry: 'Retail',
    company_size: 'medium',
    monthly_budget: 5000,
    contract: contract,
    billing_day: 1,
    payment_method: 'Transfer'
  };

  const fullMeetings: MeetingMinutes[] = [
    {
      id: '1',
      client_id: clientId,
      date: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
      title: 'Reunião Mensal - Mês Passado',
      participants: [
        { name: 'João Silva', role: 'Account Manager', company: 'agency' },
        { name: 'Maria Costa', role: 'CEO', company: 'client' },
        { name: 'Pedro Santos', role: 'Marketing Director', company: 'client' }
      ],
      topics: [
        'Performance Ads',
        'Plano de Ação',
        'Budget Q1',
        'Novas Oportunidades'
      ],
      decisions: [
        'Aprovar budget Q1: €5.000/mês',
        'Lançar nova campanha dia 02',
        'Expandir para Google Shopping'
      ],
      action_items: [
        {
          id: '1',
          description: 'Preparar proposta detalhada Q1',
          responsible: 'João Silva',
          deadline: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000),
          status: 'done',
          priority: 'high'
        },
        {
          id: '2',
          description: 'Aprovar criativos da nova campanha',
          responsible: 'Maria Costa',
          deadline: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
          status: 'in_progress',
          priority: 'high'
        }
      ],
      notes: 'Cliente muito satisfeito com resultados. ROAS de 5.43x superou expectativas. Querem expandir investimento.',
      next_meeting: {
        date: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000),
        time: '10:00',
        location: 'Zoom'
      },
      created_by: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }
  ];
  
  return {
    client: clientConfig,
    health_score: 92,
    upcoming_activities: [
      {
        id: '1',
        client_id: clientId,
        type: 'meeting',
        title: 'Reunião Mensal',
        date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
        time: '10:00',
        duration: 60,
        location: 'Zoom',
        status: 'scheduled',
        priority: 'high',
        created_by: 'admin',
        created_at: new Date()
      },
      {
        id: '2',
        client_id: clientId,
        type: 'deadline',
        title: 'Entrega Proposta Q1',
        date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
        status: 'scheduled',
        priority: 'high',
        created_by: 'admin',
        created_at: new Date()
      },
      {
        id: '3',
        client_id: clientId,
        type: 'call',
        title: 'Follow-up Performance',
        date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        time: '15:00',
        duration: 30,
        status: 'scheduled',
        priority: 'medium',
        created_by: 'admin',
        created_at: new Date()
      }
    ],
    recent_meetings: fullMeetings.map(m => ({
      id: m.id,
      client_id: m.client_id,
      title: m.title,
      date: m.date,
      key_topics: m.topics,
      action_items_completed: m.action_items.filter(a => a.status === 'done').length,
      action_items_total: m.action_items.length,
      next_meeting: m.next_meeting ? {
        date: m.next_meeting.date,
        time: m.next_meeting.time
      } : undefined
    })),
    recent_meetings_full: fullMeetings,
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
        uploaded_at: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
        tags: ['contrato', '2025'],
        description: 'Contrato de serviços ano 2025'
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
        uploaded_at: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000),
        tags: ['proposta', 'Q1', '2025']
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
        uploaded_at: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000)
      }
    ],
    pending_tasks: [
      { id: '1', title: 'Aprovar Criativos Meta' },
      { id: '2', title: 'Enviar Relatório Semanal' }
    ],
    alerts: [
      { title: 'Contrato em Prazo de Ouro (45 dias)' }
    ],
    quick_notes: [
      {
        id: '1',
        client_id: clientId,
        content: 'Cliente pediu orçamento para expansão Google Shopping. Follow-up agendado.',
        created_by: 'admin',
        created_at: new Date(),
        pinned: true
      },
      {
        id: '2',
        client_id: clientId,
        content: 'Reunião correu muito bem. Cliente quer expandir budget em Q1.',
        created_by: 'admin',
        created_at: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        pinned: false
      }
    ],
    active_campaigns: [
      { id: '1', client_id: clientId, name: 'C1', status: 'active', progress: 0, roas: 0, budget_total: 0, budget_spent: 0, budget_remaining: 0, conversions: 0, cpl: 0, revenue: 0, impressions: 0, clicks: 0, ctr: 0, start_date: new Date(), last_updated: new Date() },
      { id: '2', client_id: clientId, name: 'C2', status: 'active', progress: 0, roas: 0, budget_total: 0, budget_spent: 0, budget_remaining: 0, conversions: 0, cpl: 0, revenue: 0, impressions: 0, clicks: 0, ctr: 0, start_date: new Date(), last_updated: new Date() }
    ],
  };
};
