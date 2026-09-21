
import { CampaignTemplate } from '../../../types/crm';

export const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  {
    id: 'product-launch',
    name: 'Lançamento de Produto',
    type: 'launch',
    description: 'Template completo para lançamento de produto com landing page, emails, vídeo VSL, ads e analytics.',
    estimatedDays: 45,
    taskTemplates: [
      {
        title: 'Briefing com Cliente',
        type: 'other',
        description: 'Reunião inicial para alinhar objetivos, público-alvo e mensagem',
        priority: 'high',
        estimatedHours: 2,
        dayOffset: 0,
        subtasks: ['Definir objetivos', 'Mapear público-alvo', 'Estabelecer KPIs', 'Aprovar timeline']
      },
      {
        title: 'Landing Page - Copy',
        type: 'copy',
        description: 'Escrever copy persuasivo para landing page de conversão',
        priority: 'high',
        estimatedHours: 6,
        dayOffset: 3,
        subtasks: ['Headline principal', 'Benefícios', 'Social proof', 'CTA']
      },
      {
        title: 'Landing Page - Design',
        type: 'landing-page',
        description: 'Design visual da landing page',
        priority: 'high',
        estimatedHours: 8,
        dayOffset: 7,
        subtasks: ['Wireframe', 'Design desktop', 'Design mobile', 'Assets visuais']
      },
      {
        title: 'Landing Page - Desenvolvimento',
        type: 'landing-page',
        description: 'Desenvolvimento e implementação da landing page',
        priority: 'high',
        estimatedHours: 12,
        dayOffset: 14,
        subtasks: ['HTML/CSS', 'Responsivo', 'Formulários', 'Integrações']
      },
      {
        title: 'Sequência de 5 Emails',
        type: 'email',
        description: 'Sequência de emails para nutrir e converter leads',
        priority: 'high',
        estimatedHours: 8,
        dayOffset: 10,
        subtasks: ['Email 1 - Teaser', 'Email 2 - Lançamento', 'Email 3 - Benefícios', 'Email 4 - Social Proof', 'Email 5 - Urgência']
      },
      {
        title: 'Criativos Meta Ads - 5 Variações',
        type: 'creative',
        description: 'Criar múltiplas variações de criativos para testes A/B',
        priority: 'high',
        estimatedHours: 10,
        dayOffset: 12,
        subtasks: ['Variação 1 - Benefício', 'Variação 2 - Social Proof', 'Variação 3 - Urgência', 'Variação 4 - Curiosidade', 'Variação 5 - Antes/Depois']
      },
      {
        title: 'Vídeo VSL',
        type: 'video',
        description: 'Roteiro e produção de Video Sales Letter',
        priority: 'medium',
        estimatedHours: 20,
        dayOffset: 15,
        subtasks: ['Roteiro', 'Gravação', 'Edição', 'Legendas', 'Thumbnails']
      },
      {
        title: 'Setup Pixel + Google Analytics',
        type: 'setup-tech',
        description: 'Configurar tracking completo',
        priority: 'high',
        estimatedHours: 4,
        dayOffset: 18,
        subtasks: ['Meta Pixel', 'Google Analytics 4', 'Eventos de conversão', 'Testes']
      },
      {
        title: 'Configuração Testes A/B',
        type: 'ads-launch',
        description: 'Estruturar campanhas para testes A/B',
        priority: 'medium',
        estimatedHours: 6,
        dayOffset: 25,
        subtasks: ['Definir variáveis', 'Criar audiences', 'Configurar budgets', 'Estabelecer métricas']
      },
      {
        title: 'Lançamento de Anúncios',
        type: 'ads-launch',
        description: 'Lançar campanhas de Meta Ads e Google Ads',
        priority: 'urgent',
        estimatedHours: 4,
        dayOffset: 30,
        subtasks: ['Revisão final', 'Ativar campanhas', 'Monitorizar primeiras horas', 'Ajustes iniciais']
      },
      {
        title: 'Emails Pós-Lançamento',
        type: 'email',
        description: 'Sequência de nutrição pós-lançamento',
        priority: 'low',
        estimatedHours: 4,
        dayOffset: 35,
        subtasks: ['Email thank you', 'Email onboarding', 'Email upsell']
      },
      {
        title: 'Relatório Final de Campanha',
        type: 'analytics',
        description: 'Análise completa de resultados e learnings',
        priority: 'medium',
        estimatedHours: 6,
        dayOffset: 45,
        subtasks: ['Coletar dados', 'Analisar performance', 'Identificar learnings', 'Apresentar resultados']
      }
    ]
  },
  {
    id: 'webinar-funnel',
    name: 'Funil de Webinar',
    type: 'webinar',
    description: 'Estrutura completa para webinar de vendas: página de inscrição, emails, webinar e follow-up.',
    estimatedDays: 30,
    taskTemplates: [
      {
        title: 'Landing Page Inscrição',
        type: 'landing-page',
        description: 'Página de captura para inscrições no webinar',
        priority: 'high',
        estimatedHours: 8,
        dayOffset: 0
      },
      {
        title: 'Roteiro do Webinar',
        type: 'copy',
        description: 'Estrutura e roteiro completo do webinar',
        priority: 'high',
        estimatedHours: 10,
        dayOffset: 5
      },
      {
        title: 'Slides do Webinar',
        type: 'creative',
        description: 'Design dos slides de apresentação',
        priority: 'high',
        estimatedHours: 12,
        dayOffset: 10
      },
      {
        title: 'Sequência de Confirmação',
        type: 'email',
        description: '3 emails: confirmação, lembrete -24h, lembrete -1h',
        priority: 'high',
        estimatedHours: 4,
        dayOffset: 3
      },
      {
        title: 'Anúncios de Tráfego',
        type: 'ads-launch',
        description: 'Campanhas para gerar inscrições',
        priority: 'high',
        estimatedHours: 6,
        dayOffset: 7
      },
      {
        title: 'Página de Replay',
        type: 'landing-page',
        description: 'Página para assistir gravação',
        priority: 'medium',
        estimatedHours: 4,
        dayOffset: 20
      },
      {
        title: 'Sequência de Vendas Pós-Webinar',
        type: 'email',
        description: '5 emails de follow-up com oferta',
        priority: 'high',
        estimatedHours: 6,
        dayOffset: 21
      },
      {
        title: 'Relatório de Performance',
        type: 'analytics',
        description: 'Análise de inscritos, presença, vendas',
        priority: 'medium',
        estimatedHours: 4,
        dayOffset: 30
      }
    ]
  },
  {
    id: 'evergreen-content',
    name: 'Campanha Evergreen',
    type: 'evergreen',
    description: 'Estrutura de conteúdo orgânico evergreen para geração contínua de leads.',
    estimatedDays: 60,
    taskTemplates: [
      {
        title: 'Lead Magnet - eBook/PDF',
        type: 'creative',
        description: 'Criar isca digital de alto valor',
        priority: 'high',
        estimatedHours: 16,
        dayOffset: 0
      },
      {
        title: 'Landing Page de Captura',
        type: 'landing-page',
        description: 'Página para download do lead magnet',
        priority: 'high',
        estimatedHours: 6,
        dayOffset: 10
      },
      {
        title: 'Sequência de Email Nutrição',
        type: 'email',
        description: '7 emails educacionais + pitch de venda',
        priority: 'high',
        estimatedHours: 10,
        dayOffset: 15
      },
      {
        title: 'Blog Posts SEO (5 artigos)',
        type: 'copy',
        description: 'Artigos otimizados para SEO',
        priority: 'medium',
        estimatedHours: 20,
        dayOffset: 20
      },
      {
        title: 'Carrosséis Instagram (10 posts)',
        type: 'creative',
        description: 'Conteúdo visual para redes sociais',
        priority: 'medium',
        estimatedHours: 12,
        dayOffset: 30
      },
      {
        title: 'Vídeos Curtos (5 unidades)',
        type: 'video',
        description: 'Reels/Shorts educacionais',
        priority: 'low',
        estimatedHours: 15,
        dayOffset: 40
      },
      {
        title: 'Otimização SEO On-Page',
        type: 'setup-tech',
        description: 'Otimizar todo o conteúdo para motores de busca',
        priority: 'medium',
        estimatedHours: 8,
        dayOffset: 50
      }
    ]
  }
];
