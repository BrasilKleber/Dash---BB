
export type TaskStatus = 'todo' | 'doing' | 'review' | 'client-review' | 'approved' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskType = 'landing-page' | 'email' | 'video' | 'copy' | 'creative' | 'setup-tech' | 'ads-launch' | 'analytics' | 'other';
export type CampaignType = 'launch' | 'webinar' | 'course' | 'seasonal' | 'evergreen' | 'other';
export type CampaignStatus = 'planning' | 'active' | 'completed' | 'paused' | 'cancelled';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  assignee?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: Date;
}

export interface Comment {
  id: string;
  author: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

export interface TimeLog {
  user: string;
  userName: string;
  hours: number;
  date: Date;
  description?: string;
}

export interface ApprovalWorkflow {
  sentToClient?: {
    date: Date;
    sentBy: string;
    sentByName: string;
  };
  feedbackReceived?: {
    date: Date;
    feedback: string;
    attachments?: string[];
  };
  revisionsMade?: {
    date: Date;
    version: number;
    changedBy: string;
    changedByName: string;
    notes: string;
  }[];
  finalApproval?: {
    date: Date;
    approvedBy: string;
    approvedByName: string;
    comments?: string;
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  
  // Relacionamentos
  clientId: string;
  clientName: string;
  campaignId: string;
  campaignName: string;
  
  // Classificação
  type: TaskType;
  
  // Estado
  status: TaskStatus;
  priority: TaskPriority;
  
  // Responsáveis (IDs dos membros da equipa)
  assignees: string[];
  assigneeNames: string[];
  
  // Datas
  createdAt: Date;
  startDate?: Date;
  deadlineInternal?: Date;
  sentToClientDate?: Date;
  feedbackDueDate?: Date;
  finalDeadline: Date;
  completedAt?: Date;
  
  // Workflow
  approvalWorkflow: ApprovalWorkflow;
  
  // Subtarefas
  subtasks: Subtask[];
  
  // Anexos
  attachments: Attachment[];
  finalMaterialLink?: string;
  
  // Comentários
  comments: Comment[];
  
  // Time Tracking
  timeTracking: {
    estimatedHours?: number;
    loggedHours: number;
    logs: TimeLog[];
  };
  
  // Tags
  tags: string[];
  
  // Progresso (0-100)
  progress: number;
}

export interface Campaign {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  
  type: CampaignType;
  status: CampaignStatus;
  
  dates: {
    start: Date;
    end?: Date;
    launchDate?: Date;
  };
  
  budget?: number;
  
  objectives: string[];
  
  kpis: {
    metric: string;
    target: number;
    current?: number;
  }[];
  
  taskIds: string[];
  
  progress: number;
  
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  
  // Contexto (do AssistantChatDrawer)
  niche: string;
  market: string;
  tone: string;
  objective: string;
  targetAudience: string;
  
  status: 'active' | 'inactive' | 'paused';
  
  campaigns: string[]; // IDs
  
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignTemplate {
  id: string;
  name: string;
  type: CampaignType;
  description: string;
  estimatedDays: number;
  taskTemplates: {
    title: string;
    type: TaskType;
    description: string;
    priority: TaskPriority;
    estimatedHours: number;
    dayOffset: number; // dias após início da campanha
    subtasks?: string[];
  }[];
}

export interface CRMStats {
  totalClients: number;
  activeClients: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export interface KanbanColumn {
  id: string;
  label: string;
  status: TaskStatus;
  color: string; // hex color
  order: number;
  isDefault: boolean; // não pode ser apagada
}

export interface CampaignKanbanSettings {
  campaignId: string;
  columns: KanbanColumn[];
}

// Colunas padrão
export const DEFAULT_KANBAN_COLUMNS: KanbanColumn[] = [
  { 
    id: 'todo', 
    label: 'To Do', 
    status: 'todo', 
    color: '#64748b', // slate
    order: 1,
    isDefault: true 
  },
  { 
    id: 'doing', 
    label: 'Em Progresso', 
    status: 'doing', 
    color: '#3b82f6', // blue
    order: 2,
    isDefault: true 
  },
  { 
    id: 'review', 
    label: 'Revisão Interna', 
    status: 'review', 
    color: '#8b5cf6', // purple
    order: 3,
    isDefault: true 
  },
  { 
    id: 'client-review', 
    label: 'Revisão Cliente', 
    status: 'client-review', 
    color: '#f59e0b', // orange
    order: 4,
    isDefault: true 
  },
  { 
    id: 'approved', 
    label: 'Aprovado', 
    status: 'approved', 
    color: '#10b981', // green
    order: 5,
    isDefault: true 
  },
  { 
    id: 'done', 
    label: 'Concluído', 
    status: 'done', 
    color: '#059669', // emerald
    order: 6,
    isDefault: true 
  }
];
