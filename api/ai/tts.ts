
import { GoogleGenAI, Modality } from "@google/genai";

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "IA não configurada." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { text } = await req.json();
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Lê isto com um tom profissional de consultor em Português de Portugal: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    return new Response(JSON.stringify({ audioData: base64Audio }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: "Erro ao gerar áudio." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
