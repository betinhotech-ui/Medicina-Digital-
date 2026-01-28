
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const refineMedicalText = async (text: string, type: 'atestado' | 'receita') => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Refine o seguinte texto médico para ser formal e profissional em português brasileiro para um ${type}. Seja conciso e ético. Texto: ${text}`,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao refinar texto com Gemini:", error);
    return text;
  }
};

export const generateProfessionalCertificate = async (diagnosis: string, observations: string, days: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Como um assistente médico profissional, redija o corpo de um atestado médico formal.
      Diagnóstico/Quadro: ${diagnosis}
      Observações Adicionais: ${observations}
      Dias de Afastamento: ${days}
      
      O texto deve ser em Português Brasileiro, altamente profissional, ético e adequado para um documento oficial. Não inclua cabeçalhos ou assinaturas, apenas o parágrafo descritivo do quadro e a justificativa do afastamento.`,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar atestado com Gemini:", error);
    return "";
  }
};
