
import { GoogleGenAI, Modality } from "@google/genai";
import { AIContext, ChatMessage } from '../types';

// Inicialização do cliente Google GenAI para Vite
// A chave deve estar no arquivo .env com o nome VITE_GEMINI_API_KEY
// Usa optional chaining para evitar crash se env for undefined
const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const aiService = {
  /**
   * Gera um ponto de situação estratégico inicial
   * Usa Gemini 3 Flash para rapidez e eficiência
   */
  async generateExecutiveSummary(context: AIContext): Promise<string> {
    if (!apiKey) return "⚠️ Chave de API não configurada. Adicione VITE_GEMINI_API_KEY ao .env";

    try {
      const prompt = `Analise os dados de performance do cliente ${context.client.name} para o período de ${context.dateRange.label}:
        
        Dados Consolidados: ${JSON.stringify(context.totals)}
        Performance por Canal: ${JSON.stringify(context.topCampaigns)}
        Objetivo do Cliente: ${context.client.objective_primary}
        
        Instruções de Resposta:
        - Responde obrigatoriamente em Português de Portugal (PT-PT).
        - Não uses apresentações ("Olá", "Sou o analista").
        - Começa diretamente com a análise do desempenho atual.
        - Usa um tom consultivo, focado em resultados de negócio e humano.
        - Evita termos excessivamente robóticos ou listas de tópicos secas.
        - Termina com um comentário sobre a tendência futura ou uma sugestão tática.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "És o Analista de Performance da Bluebolt. O teu foco é marketing digital baseado em dados. Toda a tua comunicação é em Português de Portugal (PT-PT), de forma natural e profissional.",
          temperature: 0.7,
        },
      });

      return response.text || "Não foi possível gerar a análise estratégica neste momento.";
    } catch (error) {
      console.error("Erro na geração do resumo:", error);
      return "O sistema encontrou um erro ao tentar processar os dados do período. Verifique a configuração da IA.";
    }
  },

  /**
   * Responde a perguntas no chat mantendo o histórico, contexto e suportando anexos
   * Usa Gemini 3 Pro para raciocínio complexo
   */
  async chatWithAnalyst(context: AIContext, messages: ChatMessage[]): Promise<string> {
    if (!apiKey) return "⚠️ Chave de API não configurada.";

    try {
      const lastMessage = messages[messages.length - 1];
      const parts: any[] = [];

      // Adicionar contexto e histórico como texto
      const historyFormatted = messages.slice(0, -1).map(m => `${m.role === 'user' ? 'Utilizador' : 'Analista'}: ${m.content}`).join('\n');
      
      parts.push({ 
        text: `Contexto do Cliente: ${context.client.name} (Objetivo: ${context.client.objective_primary})\nDados do Período: ${JSON.stringify(context.totals)}\n\nHistórico da Conversa:\n${historyFormatted}\n\nÚltima Mensagem do Utilizador: ${lastMessage.content}` 
      });

      // Adicionar anexos da última mensagem se existirem
      if (lastMessage.attachments) {
        lastMessage.attachments.forEach(att => {
          if (att.type.startsWith('image/')) {
            // Imagens são enviadas nativamente como inlineData (base64 sem prefixo)
            try {
              // Remove o prefixo data:image/xxx;base64, se existir
              const base64Data = att.data.includes(',') ? att.data.split(',')[1] : att.data;
              parts.push({
                inlineData: {
                  data: base64Data,
                  mimeType: att.type
                }
              });
            } catch (e) {
              console.error("Erro ao processar imagem", e);
            }
          } else if (att.type.includes('text') || att.type.includes('json') || att.type.includes('csv') || att.name.endsWith('.csv') || att.name.endsWith('.txt')) {
             // Documentos de texto são descodificados e anexados como texto
             try {
                const base64Content = att.data.includes(',') ? att.data.split(',')[1] : att.data;
                const textContent = atob(base64Content);
                parts.push({ text: `\n[Conteúdo do Ficheiro Anexado: ${att.name}]\n${textContent}\n[Fim do Ficheiro]` });
             } catch (e) {
                parts.push({ text: `[Anexo: ${att.name} (${att.type}) - Não foi possível ler o conteúdo]` });
             }
          } else {
            // Outros tipos apenas referência
            parts.push({ text: `[Anexo não processável: ${att.name} (${att.type})]` });
          }
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts },
        config: {
          systemInstruction: "És o Analista IA da Bluebolt. Analisas dados de marketing e anexos enviados pelo utilizador. Comunica exclusivamente em Português de Portugal. Se receberes ficheiros CSV ou de texto, analisa o seu conteúdo em detalhe.",
          temperature: 0.4
        }
      });

      return response.text || "Lamento, não consegui processar essa análise agora.";
    } catch (error) {
      console.error("Erro no chat IA:", error);
      return "Erro de ligação com o servidor de inteligência artificial. Verifica a tua chave de API.";
    }
  },

  /**
   * Chat especializado para os Assistentes IA (Criador de Ofertas, Copywriter, etc)
   */
  async chatWithSpecialist(systemInstruction: string, messages: {role: string, content: string}[]): Promise<string> {
    if (!apiKey) return "⚠️ Chave de API não configurada.";

    try {
      // Constrói o histórico
      const historyText = messages.slice(0, -1).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
      const lastMessage = messages[messages.length - 1].content;
      
      const prompt = `${historyText}\nUser: ${lastMessage}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: `${systemInstruction}\n\nIMPORTANTE: Responde sempre em Português de Portugal (PT-PT). Mantém a formatação Markdown limpa e estruturada.`,
          temperature: 0.8
        }
      });

      return response.text || "Não consegui gerar uma resposta criativa neste momento.";
    } catch (error) {
      console.error("Erro no chat especialista:", error);
      return "Erro ao comunicar com o especialista IA. Por favor tenta novamente.";
    }
  },

  /**
   * Converte texto em fala usando o modelo TTS do Gemini
   */
  async textToSpeech(text: string): Promise<string | null> {
    if (!apiKey) return null;

    try {
      // Limita o tamanho do texto para o TTS para evitar timeouts ou erros
      const textToRead = text.length > 500 ? text.substring(0, 500) + "..." : text;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Lê isto com um tom profissional de consultor em Português de Portugal: ${textToRead}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      // O SDK retorna base64 diretamente na propriedade inlineData
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      return base64Audio || null;
    } catch (error) {
      console.error("Erro no TTS:", error);
      return null;
    }
  }
};
