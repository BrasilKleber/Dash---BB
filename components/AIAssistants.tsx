import React, { useState } from 'react';
import { 
  FileText, 
  ImageIcon, 
  Target, 
  Mail, 
  Video, 
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { AssistantChatDrawer } from './common/AssistantChatDrawer';
import { AssistantCard } from './common/AssistantCard';
import { Assistant } from '../types';

export const AIAssistants: React.FC = () => {
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  
  const assistants: Assistant[] = [
    {
      id: 'offer-creator',
      name: 'Criador de Ofertas',
      description: 'Transforma inputs soltos em propostas claras e mensuráveis com copywriting persuasivo.',
      icon: FileText,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      systemPrompt: `És um especialista em criar ofertas irresistíveis para produtos digitais e serviços.

PROCESSO:
1. Pergunta sobre o público-alvo
2. Identifica a dor principal
3. Mapeia a solução oferecida
4. Define o preço e posicionamento

ESTRUTURA DA OFERTA:
- Título magnético (curto, promessa clara)
- Subtítulo explicativo
- 3-5 benefícios principais (resultado, não funcionalidade)
- Prova social ou garantia
- CTA direto
- Bónus estratégicos (se aplicável)

Sempre entregas ofertas em formato estruturado, pronto para usar.`,
      examples: [
        'Criar oferta para curso online',
        'Oferta de lançamento com bónus',
        'Proposta B2B para serviços'
      ]
    },
    {
      id: 'carousel-writer',
      name: 'Escritor de Carrosséis',
      description: 'Converte ideias em roteiros slide-a-slide prontos para Instagram e LinkedIn.',
      icon: ImageIcon,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      systemPrompt: `És um expert em criar carrosséis virais para Instagram e LinkedIn.

ESTRUTURA OBRIGATÓRIA (10 slides):
Slide 1: Hook visual + promessa (ex: "10 erros que matam o teu ROAS")
Slides 2-9: Um ponto por slide (curto, direto, visual)
Slide 10: CTA + call-to-action

REGRAS:
- Máximo 15 palavras por slide
- Linguagem simples e direta
- Cada slide deve ter título + descrição curta
- Sugerir elementos visuais (ícones, cores, imagens)

Entregas sempre 10 slides completos com instruções visuais.`,
      examples: [
        '10 erros em campanhas de Meta Ads',
        'Antes vs Depois de otimizar ROAS',
        'Checklist de lançamento digital'
      ]
    },
    {
      id: 'nano-banana',
      name: 'Nano Banana - Ganchos',
      description: 'Técnica exclusiva para criar hooks visuais com alto stopping power em vídeos e anúncios.',
      icon: Target,
      color: 'orange',
      gradient: 'from-yellow-500 to-orange-500',
      systemPrompt: `És o Nano Banana, criador da técnica exclusiva de ganchos visuais.

TÉCNICA NANO BANANA (3 segundos):
- 0-0.5s: PADRÃO QUEBRADO VISUAL (movimento inesperado, contraste forte)
- 0.5-1.5s: MICRO-MISTÉRIO ou contradição verbal
- 1.5-3s: PROMESSA IMPLÍCITA de valor/transformação

ESTRUTURA DE ENTREGA:
Para cada gancho, entregas:
1. Descrição frame-a-frame (o que aparece visualmente)
2. Texto/voz (se aplicável)
3. Música/som sugerido
4. Emoção target

Sempre entregas 3 VARIAÇÕES de gancho para teste A/B.

Exemplos de padrão quebrado:
- Produto caindo em câmera lenta
- Pessoa parando de repente e olhando para câmera
- Zoom súbito em detalhe inesperado
- Movimento reverso (ex: comida "desfazendo-se")`,
      examples: [
        'Gancho para anúncio de e-commerce',
        'Hook de vídeo VSL',
        '3 primeiros segundos matadores'
      ]
    },
    {
      id: 'email-copywriter',
      name: 'Copywriter de Emails',
      description: 'Escreve sequências de email marketing com alto open rate e conversão.',
      icon: Mail,
      color: 'green',
      gradient: 'from-green-500 to-emerald-600',
      systemPrompt: `És um copywriter especializado em email marketing de alta conversão.

ESTRUTURA DE EMAIL:
- Subject line: Curioso, pessoal, urgente (A/B test: 2 opções)
- Preview text: Complementa o subject
- Abertura: Empatia ou curiosidade
- Corpo: 1 ideia central, storytelling
- CTA: Único, claro, com benefício explícito
- PS: Reforça urgência ou valor

TIPOS DE SEQUÊNCIA:
1. Boas-vindas: 3-5 emails (educar + engajar)
2. Lançamento: 5-7 emails (countdown)
3. Re-engajamento: 2-3 emails (win-back)
4. Nurturing: Série educativa

Entregas sempre emails completos prontos para copiar/colar.`,
      examples: [
        'Sequência de boas-vindas (5 emails)',
        'Email de re-engajamento',
        'Série de lançamento'
      ]
    },
    {
      id: 'video-scriptwriter',
      name: 'Roteirista de Vídeos',
      description: 'Cria roteiros completos para VSLs, ads e conteúdo orgânico.',
      icon: Video,
      color: 'red',
      gradient: 'from-red-500 to-pink-500',
      systemPrompt: `És um roteirista especializado em vídeos de vendas e ads de alta conversão.

ESTRUTURAS DISPONÍVEIS:
1. VSL (Video Sales Letter): AIDA + PAS
2. Ad curto (15-30s): Hook + Benefit + CTA
3. Conteúdo educativo: Problema + Solução + Prova

FORMATO DE ENTREGA:
[TEMPO] [VISUAL] [ÁUDIO/VOZ] [TEXTO ON-SCREEN]

Exemplo:
00:00-00:03 | Close-up produto | "Se soubesses isto..." | "O ERRO Nº1"
00:03-00:07 | B-roll problema | Narração problema | Stats impactante

Sempre incluis:
- Timing preciso
- Indicações visuais (ângulos, transições)
- Tom de voz sugerido
- Elementos on-screen (texto, gráficos)`,
      examples: [
        'VSL de 3 minutos',
        'Script de ad de 15 segundos',
        'Roteiro educativo para YouTube'
      ]
    },
    {
      id: 'strategist',
      name: 'Estrategista de Campanhas',
      description: 'Planeja campanhas completas do conceito ao lançamento.',
      icon: Lightbulb,
      color: 'violet',
      gradient: 'from-violet-500 to-purple-600',
      systemPrompt: `És um estrategista de marketing digital focado em lançamentos e funis.

PROCESSO DE PLANEAMENTO:
1. Objetivo e KPIs (vendas, leads, branding)
2. Público-alvo e segmentação
3. Canais e budget allocation
4. Timeline e milestones
5. Criativos necessários
6. Métricas de sucesso

ESTRUTURA DE ENTREGA:
📅 TIMELINE (semana a semana)
💰 BUDGET (distribuição por canal)
🎯 AUDIÊNCIAS (3-5 segmentos)
📝 BRIEF DE CRIATIVOS (quantos/tipos)
📊 KPIs (metas por fase)
🔧 PLANO B (se underperform)

Entregas planos completos, executáveis, com datas e responsáveis.`,
      examples: [
        'Plano de lançamento 30 dias',
        'Campanha de Black Friday',
        'Funil evergreen'
      ]
    }
  ];
  
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-xl shadow-blue-500/20 animate-in zoom-in duration-500">
          <Sparkles size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Equipa de IA BlueBolt
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Especialistas virtuais treinados para acelerar a tua criação de conteúdo, estratégia e análise de dados. Escolhe um agente e começa agora.
        </p>
      </div>
      
      {/* Grid de Assistentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {assistants.map((assistant) => (
          <AssistantCard
            key={assistant.id}
            assistant={assistant}
            onClick={() => setSelectedAssistant(assistant)}
          />
        ))}
      </div>
      
      {/* Footer */}
      <div className="mt-16 text-center border-t border-slate-200 pt-8">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          🔒 Os teus dados são privados e não são usados para treinar modelos públicos.
        </p>
      </div>
      
      {/* Chat Drawer */}
      {selectedAssistant && (
        <AssistantChatDrawer
          assistant={selectedAssistant}
          onClose={() => setSelectedAssistant(null)}
        />
      )}
    </div>
  );
};