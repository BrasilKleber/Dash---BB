
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ text: "IA não configurada. Contacte o administrador." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { contents, systemInstruction, model, temperature } = await req.json();
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: model || 'gemini-3-pro-preview',
      contents: contents,
      config: {
        systemInstruction,
        temperature: temperature || 0.4,
      },
    });

    return new Response(JSON.stringify({ text: response.text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ text: "Erro ao processar o chat." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
