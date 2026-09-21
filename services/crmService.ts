
import { Task, Campaign, Client, TaskStatus, CRMStats, CampaignTemplate, KanbanColumn } from '../types/crm';

// Mock Data - Clientes
let MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'EcoCommerce Portugal',
    industry: 'E-commerce',
    contactName: 'Maria Silva',
    contactEmail: 'maria@ecocommerce.pt',
    contactPhone: '+351 912 345 678',
    niche: 'E-commerce de produtos sustentáveis',
    market: 'Portugal / Espanha',
    tone: 'Profissional mas acessível, com foco em sustentabilidade',
    objective: 'Aumentar vendas em 30% no Q1 2025',
    targetAudience: 'Millennials e Gen Z eco-conscientes, 25-40 anos',
    status: 'active',
    campaigns: ['1'],
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-12-20')
  },
  {
    id: '2',
    name: 'TechStart Consulting',
    industry: 'Consultoria',
    contactName: 'João Santos',
    contactEmail: 'joao@techstart.pt',
    contactPhone: '+351 913 456 789',
    niche: 'Consultoria em transformação digital',
    market: 'B2B - PMEs portuguesas',
    tone: 'Técnico mas didático, autoridade no setor',
    objective: 'Gerar 50 leads qualificados/mês',
    targetAudience: 'CEOs e CTOs de PMEs, 10-50 colaboradores',
    status: 'active',
    campaigns: ['2'],
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2024-12-18')
  },
  {
    id: '3',
    name: 'FitLife Academy',
    industry: 'Fitness Online',
    contactName: 'Ana Costa',
    contactEmail: 'ana@fitlife.pt',
    contactPhone: '+351 914 567 890',
    niche: 'Treinos online personalizados',
    market: 'Portugal, Brasil',
    tone: 'Motivacional, energético, próximo',
    objective: 'Lançar programa premium a 297€',
    targetAudience: 'Mulheres 30-45 anos, vida sedentária',
    status: 'active',
    campaigns: ['3'],
    createdAt: new Date('2024-09-20'),
    updatedAt: new Date('2024-12-15')
  }
];

// Mock Data - Campanhas
let MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'Lançamento Q1 2025',
    clientId: '1',
    clientName: 'EcoCommerce Portugal',
    type: 'launch',
    status: 'active',
    dates: {
      start: new Date('2025-01-05'),
      end: new Date('2025-03-31'),
      launchDate: new Date('2025-01-20')
    },
    budget: 15000,
    objectives: [
      'Aumentar vendas em 30%',
      'Lançar nova linha de produtos',
      'Expandir para mercado espanhol'
    ],
    kpis: [
      { metric: 'Vendas', target: 50000, current: 0 },
      { metric: 'Leads', target: 1000, current: 0 },
      { metric: 'ROAS', target: 4, current: 0 }
    ],
    taskIds: ['1', '2', '3', '4', '5'],
    progress: 25,
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-27')
  },
  {
    id: '2',
    name: 'Geração de Leads B2B',
    clientId: '2',
    clientName: 'TechStart Consulting',
    type: 'evergreen',
    status: 'active',
    dates: {
      start: new Date('2024-11-01'),
      end: new Date('2025-10-31')
    },
    budget: 24000,
    objectives: [
      'Gerar 50 leads qualificados/mês',
      'Estabelecer autoridade no setor',
      'Criar pipeline de vendas consistente'
    ],
    kpis: [
      { metric: 'Leads/mês', target: 50, current: 42 },
      { metric: 'Taxa conversão', target: 15, current: 12 },
      { metric: 'CPL', target: 80, current: 95 }
    ],
    taskIds: ['6', '7', '8'],
    progress: 60,
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-12-26')
  },
  {
    id: '3',
    name: 'Lançamento Programa Premium',
    clientId: '3',
    clientName: 'FitLife Academy',
    type: 'launch',
    status: 'planning',
    dates: {
      start: new Date('2025-02-01'),
      end: new Date('2025-03-15'),
      launchDate: new Date('2025-02-14')
    },
    budget: 8000,
    objectives: [
      'Lançar programa premium a 297€',
      'Vender 100 vagas',
      'Criar lista de espera para próxima turma'
    ],
    kpis: [
      { metric: 'Vendas', target: 29700, current: 0 },
      { metric: 'Inscritos', target: 100, current: 0 },
      { metric: 'Taxa conversão', target: 5, current: 0 }
    ],
    taskIds: ['9', '10'],
    progress: 10,
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-20')
  }
];

// Mock Data - Tarefas
let MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Landing Page - Lançamento Principal',
    description: 'Criar landing page de lançamento da nova linha de produtos sustentáveis',
    clientId: '1',
    clientName: 'EcoCommerce Portugal',
    campaignId: '1',
    campaignName: 'Lançamento Q1 2025',
    type: 'landing-page',
    status: 'doing',
    priority: 'high',
    assignees: ['1', '2'],
    assigneeNames: ['Daniela', 'Equipa Web'],
    createdAt: new Date('2024-12-15'),
    startDate: new Date('2024-12-18'),
    finalDeadline: new Date('2025-01-10'),
    subtasks: [
      { id: 's1', title: 'Wireframe aprovado', completed: true },
      { id: 's2', title: 'Copy escrito', completed: true },
      { id: 's3', title: 'Design finalizado', completed: false },
      { id: 's4', title: 'Desenvolvimento', completed: false },
      { id: 's5', title: 'Testes A/B configurados', completed: false }
    ],
    attachments: [],
    comments: [
      {
        id: 'c1',
        author: '1',
        authorName: 'Daniela',
        content: 'Copy focado em benefícios ambientais e economia a longo prazo',
        createdAt: new Date('2024-12-20')
      }
    ],
    tags: ['lançamento', 'prioridade-alta'],
    progress: 40,
    approvalWorkflow: {
      sentToClient: {
        date: new Date('2024-12-23'),
        sentBy: '1',
        sentByName: 'Daniela'
      }
    },
    timeTracking: {
      estimatedHours: 24,
      loggedHours: 12,
      logs: [
        {
          user: '1',
          userName: 'Daniela',
          hours: 6,
          date: new Date('2024-12-18'),
          description: 'Copy e estrutura'
        },
        {
          user: '2',
          userName: 'Equipa Web',
          hours: 6,
          date: new Date('2024-12-20'),
          description: 'Wireframe e início do design'
        }
      ]
    }
  },
  {
    id: '2',
    title: 'Sequência de Emails - Lançamento',
    description: '5 emails para sequência de lançamento (antecipação + vendas + último dia)',
    clientId: '1',
    clientName: 'EcoCommerce Portugal',
    campaignId: '1',
    campaignName: 'Lançamento Q1 2025',
    type: 'email',
    status: 'review',
    priority: 'high',
    assignees: ['1'],
    assigneeNames: ['Daniela'],
    createdAt: new Date('2024-12-16'),
    startDate: new Date('2024-12-17'),
    finalDeadline: new Date('2025-01-08'),
    sentToClientDate: new Date('2024-12-24'),
    feedbackDueDate: new Date('2024-12-27'),
    subtasks: [
      { id: 's6', title: 'Email 1 - Teaser (7 dias antes)', completed: true },
      { id: 's7', title: 'Email 2 - Anúncio (dia do lançamento)', completed: true },
      { id: 's8', title: 'Email 3 - Benefícios (dia 2)', completed: true },
      { id: 's9', title: 'Email 4 - Social Proof (dia 4)', completed: true },
      { id: 's10', title: 'Email 5 - Último Dia (urgência)', completed: false }
    ],
    attachments: [],
    comments: [],
    tags: ['lançamento', 'email-marketing'],
    progress: 80,
    approvalWorkflow: {
      sentToClient: {
        date: new Date('2024-12-24'),
        sentBy: '1',
        sentByName: 'Daniela'
      },
      feedbackReceived: {
        date: new Date('2024-12-26'),
        feedback: 'Adorei! Apenas ajustar o email 5 para incluir desconto de última hora de 10%',
        attachments: []
      }
    },
    timeTracking: {
      estimatedHours: 10,
      loggedHours: 8,
      logs: [
        {
          user: '1',
          userName: 'Daniela',
          hours: 8,
          date: new Date('2024-12-22'),
          description: 'Escrita dos 5 emails'
        }
      ]
    }
  },
  // ... outras tarefas mantidas (simplificado para o exemplo)
];

// Funções do serviço
class CRMService {
  
  // DASHBOARD
  async getStats(): Promise<CRMStats> {
    // Otimização: Parallel fetch em vez de sequencial
    // Reduzimos o delay artificial para ser quase instantâneo
    const [allTasks, allCampaigns, allClients] = await Promise.all([
      this.getTasks(),
      this.getCampaigns(),
      this.getClients()
    ]);
    
    return {
      totalClients: allClients.length,
      activeClients: allClients.filter(c => c.status === 'active').length,
      totalCampaigns: allCampaigns.length,
      activeCampaigns: allCampaigns.filter(c => c.status === 'active' || c.status === 'planning').length,
      totalTasks: allTasks.length,
      completedTasks: allTasks.filter(t => t.status === 'done').length,
      overdueTasks: allTasks.filter(t => 
        t.status !== 'done' && t.finalDeadline < new Date()
      ).length
    };
  }

  // TASKS
  async getTasks(): Promise<Task[]> {
    // Reduzido de 500ms para 100ms
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...MOCK_TASKS];
  }
  
  async getTaskById(id: string): Promise<Task | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return MOCK_TASKS.find(task => task.id === id) || null;
  }
  
  async createTask(task: Task): Promise<Task> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    MOCK_TASKS.push(newTask);
    return newTask;
  }
  
  async updateTask(task: Task): Promise<Task> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = MOCK_TASKS.findIndex(t => t.id === task.id);
    if (index !== -1) {
      MOCK_TASKS[index] = task;
    }
    return task;
  }
  
  async updateTaskStatus(taskId: string, newStatus: TaskStatus): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const task = MOCK_TASKS.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      if (newStatus === 'done') {
        task.completedAt = new Date();
        task.progress = 100;
      }
    }
  }
  
  async deleteTask(taskId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
    MOCK_TASKS = MOCK_TASKS.filter(t => t.id !== taskId);
  }
  
  // CAMPAIGNS
  async getCampaigns(): Promise<Campaign[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...MOCK_CAMPAIGNS];
  }
  
  async getCampaignById(id: string): Promise<Campaign | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return MOCK_CAMPAIGNS.find(c => c.id === id) || null;
  }

  async createCampaign(campaign: Campaign): Promise<Campaign> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newCampaign = {
      ...campaign,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    MOCK_CAMPAIGNS.push(newCampaign);
    return newCampaign;
  }

  async updateCampaign(campaign: Campaign): Promise<Campaign> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = MOCK_CAMPAIGNS.findIndex(c => c.id === campaign.id);
    if (index !== -1) {
      MOCK_CAMPAIGNS[index] = { ...campaign, updatedAt: new Date() };
    }
    return campaign;
  }

  async createCampaignWithTemplate(
    campaign: Campaign, 
    template: CampaignTemplate
  ): Promise<Campaign> {
    // Cria a campanha
    const createdCampaign = await this.createCampaign(campaign);
    
    // Cria tarefas a partir do template
    const startDate = campaign.dates.start;
    
    // Processamento em lote para ser mais rápido
    const tasksToCreate = template.taskTemplates.map((taskTemplate, i) => {
      const taskDate = new Date(startDate.getTime() + taskTemplate.dayOffset * 24 * 60 * 60 * 1000);
      
      return {
        id: (Date.now() + i).toString() + Math.random().toString().substr(2, 4),
        title: taskTemplate.title,
        description: taskTemplate.description,
        clientId: campaign.clientId,
        clientName: campaign.clientName,
        campaignId: createdCampaign.id,
        campaignName: createdCampaign.name,
        type: taskTemplate.type,
        status: 'todo',
        priority: taskTemplate.priority,
        assignees: [],
        assigneeNames: [],
        createdAt: new Date(),
        finalDeadline: taskDate,
        subtasks: (taskTemplate.subtasks || []).map((st, j) => ({
          id: `${Date.now()}-${i}-${j}`,
          title: st,
          completed: false
        })),
        attachments: [],
        comments: [],
        tags: [],
        progress: 0,
        approvalWorkflow: {},
        timeTracking: {
          estimatedHours: taskTemplate.estimatedHours,
          loggedHours: 0,
          logs: []
        }
      } as Task;
    });

    // Adiciona todas de uma vez ao mock
    MOCK_TASKS.push(...tasksToCreate);
    
    return createdCampaign;
  }
  
  // CLIENTS
  async getClients(): Promise<Client[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...MOCK_CLIENTS];
  }
  
  async getClientById(id: string): Promise<Client | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return MOCK_CLIENTS.find(c => c.id === id) || null;
  }

  async createClient(client: Client): Promise<Client> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newClient = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    MOCK_CLIENTS.push(newClient);
    return newClient;
  }

  async updateClient(client: Client): Promise<Client> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = MOCK_CLIENTS.findIndex(c => c.id === client.id);
    if (index !== -1) {
      MOCK_CLIENTS[index] = { ...client, updatedAt: new Date() };
    }
    return client;
  }
  
  // EXPORT
  exportTasks(tasks: Task[]): void {
    const headers = ['Tarefa', 'Cliente', 'Campanha', 'Responsável', 'Estado', 'Prioridade', 'Deadline', 'Progresso'];
    const rows = tasks.map(task => [
      task.title,
      task.clientName,
      task.campaignName,
      task.assigneeNames.join(', '),
      task.status,
      task.priority,
      task.finalDeadline.toLocaleDateString('pt-PT'),
      `${task.progress}%`
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tarefas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  // KANBAN COLUMNS
  getKanbanColumns(campaignId: string): KanbanColumn[] {
    const key = `kanban_columns_${campaignId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  saveKanbanColumns(campaignId: string, columns: KanbanColumn[]): void {
    const key = `kanban_columns_${campaignId}`;
    localStorage.setItem(key, JSON.stringify(columns));
  }
}

export const crmService = new CRMService();
