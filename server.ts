import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { retrieveHospitalKnowledge } from './src/services/aiKnowledgeEngine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI Client lazily or safely
  function getGeminiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Hospital Copilot Ask Endpoint (Fast, Universal & Ultra-Concise)
  app.post('/api/ai/ask', async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ error: 'Pergunta obrigatória' });
      }

      // Universal hospital knowledge retrieval across all system datasets (exams, surgeries, ramais, portals, diárias)
      const knowledge = retrieveHospitalKnowledge(question);
      const ai = getGeminiClient();

      const systemPrompt = `Você é o Assistente Oficial e Inteligência Universal do Hospital Palmas Medical.
Você tem acesso a TODO o sistema do hospital:
- Exames (mais de 430 exames com códigos TUSS, valores e preparos)
- Diárias, Internações e Acomodações de TODOS os convênios
- Cirurgias, Procedimentos e Valores de Pacotes Hospitalares
- Ramais telefônicos internos e setores do hospital
- Portais de autorização, links e orientações
- Prontuários e kits de documentação

REGRA SUPREMA: SEJA EXTREMAMENTE SUCINTO, DIRETO E OBJETIVO.
1. Se o usuário pedir um código, ramal, valor, portal ou regra:
   - Responda APENAS com a informação solicitada.
   - NADA MAIS. NÃO adicione introduções ("Olá", "Com certeza"), NÃO adicione disclaimers, avisos de assinatura ou textos genéricos.
   Exemplo para código:
   **ANGIO RM ARTERIAL DE CRÂNIO**
   • **Código TUSS:** \`41101537\`
   • **Valor:** R$ 870,00 (Convênio) / R$ 685,00 (Particular)

   Exemplo para ramal:
   **UTI NEO**
   • **Ramal:** \`1887\`
   • **Local:** Bloco Crítico / 3º Andar

2. Responda em no máximo 1 a 3 linhas diretas.
3. Baseie-se ESTRITAMENTE nos dados oficiais do sistema abaixo:

${knowledge.groundingPromptText}`;

      let responseText = '';

      if (ai) {
        try {
          const geminiPromise = ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [{ text: `${systemPrompt}\n\nDúvida / Solicitação:\n${question}` }],
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
              temperature: 0.1
            }
          });

          // 4.5 seconds timeout race to guarantee ultra-fast response
          let timeoutHandle: NodeJS.Timeout;
          const timeoutPromise = new Promise<{ text?: string }>((resolve) => {
            timeoutHandle = setTimeout(() => resolve({ text: '' }), 4500);
          });

          const raceResult = await Promise.race([geminiPromise, timeoutPromise]);
          clearTimeout(timeoutHandle!);
          responseText = raceResult.text || '';

          if (!responseText) {
            responseText = formatGroundingAnswer(knowledge, question);
          }
        } catch (firstErr) {
          responseText = formatGroundingAnswer(knowledge, question);
        }
      } else {
        responseText = formatGroundingAnswer(knowledge, question);
      }

      res.json({
        answer: responseText,
        detectedConvenio: knowledge.detectedConvenio,
        matchedCategory: knowledge.matchedCategory,
        facts: knowledge.facts.slice(0, 5),
        model: 'gemini-3.8-flash'
      });
    } catch (err: any) {
      console.error('Error in /api/ai/ask:', err);
      res.status(500).json({ error: err.message || 'Erro ao processar solicitação com IA.' });
    }
  });

  // Helper for generating deterministic ground-truth answers when API is busy
  function formatGroundingAnswer(knowledge: ReturnType<typeof retrieveHospitalKnowledge>, question: string): string {
    if (knowledge.directAnswer) {
      return knowledge.directAnswer;
    }
    if (knowledge.facts.length > 0) {
      return knowledge.facts.map(f => `• **${f.title}:** ${f.details}`).join('\n');
    }
    return 'Informação não localizada na base institucional.';
  }

  // AI Medical Order / Glosas & Rules Audit Endpoint
  app.post('/api/ai/audit', async (req, res) => {
    try {
      const { convenio, tipoAtendimento, carater, pedidoTexto, codigosInformados } = req.body;
      if (!convenio || !pedidoTexto) {
        return res.status(400).json({ error: 'Convênio e texto do pedido são obrigatórios.' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: 'Chave do Gemini não configurada.',
          auditResult: {
            conformidade: 'Alerta',
            resumo: 'Auditoria automatizada indisponível sem GEMINI_API_KEY.',
            alertasCriticos: ['Verifique manualmente as regras do POP do convênio selecionado.'],
            codigosRecomendados: [],
            documentosExigidos: ['Pedido médico legível com CID', 'Documento com foto', 'Carteirinha válida']
          }
        });
      }

      const prompt = `Faça uma auditoria técnica e preventiva de autorização hospitalar para o seguinte caso no Hospital Palmas Medical:
- Convênio: ${convenio}
- Tipo de Atendimento: ${tipoAtendimento || 'Pronto-Socorro'}
- Caráter: ${carater || 'Urgência'}
- Texto / Hipótese Diagnóstica do Pedido Médico: "${pedidoTexto}"
- Códigos TUSS ou Pacotes já informados pelo operador: ${JSON.stringify(codigosInformados || [])}

Analise os riscos de glosa, falta de códigos associados (ex: anestesia em endoscopia/colonoscopia, agulha OPME em biópsias, intensivistas em UTI, contraste em tomografia), exigência de Token, e regras específicas do convênio ${convenio}.
Retorne sua resposta estritamente no formato JSON estruturado com o seguinte schema:
{
  "statusConformidade": "Aprovado" | "Alerta" | "Risco de Glosa",
  "pontuacaoRisco": number (de 0 a 100, onde 100 é risco máximo),
  "resumoExecutivo": "string explicativa",
  "alertasCriticos": ["alerta 1", "alerta 2"],
  "codigosSugeridos": [
    { "codigo": "string", "descricao": "string", "motivo": "string" }
  ],
  "documentosExigidos": ["doc 1", "doc 2"],
  "orientacaoOperador": "passo a passo para dar entrada no sistema sem erros"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ text: prompt }],
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ audit: parsed });
    } catch (err: any) {
      console.error('Error in /api/ai/audit:', err);
      res.status(500).json({ error: err.message || 'Erro na auditoria IA.' });
    }
  });

  // AI Pre-Guia & Clinical Justification Generator Endpoint
  app.post('/api/ai/pre-guia', async (req, res) => {
    try {
      const { convenio, procedimentoNome, cid, quadroClinico, carater } = req.body;
      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({ error: 'Gemini API Key não disponível.' });
      }

      const prompt = `Como médico auditor e especialista em TISS/faturamento hospitalar, elabore uma Justificativa Clínica Técnica e Fundamentada para solicitação de autorização no convênio ${convenio}:
- Procedimento Solicitado: ${procedimentoNome}
- CID-10 informado: ${cid || 'Não especificado'}
- Quadro Clínico / Queixa: ${quadroClinico || 'Paciente com indicação clínica urgente'}
- Caráter: ${carater || 'Urgência'}

Gere:
1. Uma justificativa clínica formal, técnica e robusta para anexar no portal TISS (cerca de 3 a 5 parágrafos técnicos).
2. O código TUSS mais provável e códigos complementares necessários (ex: anestesia, taxa, materiais).
3. Checklist de exames prévios ou laudos que devem ser anexados para evitar negativa.

Responda em formato JSON:
{
  "justificativaClinica": "texto completo formatado para colar na guia",
  "codigoPrincipal": { "codigo": "string", "descricao": "string" },
  "codigosComplementares": [ { "codigo": "string", "descricao": "string" } ],
  "checklistAnexos": [ "string" ],
  "observacoesAuditoria": "dicas para o operador"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ text: prompt }],
        config: {
          responseMimeType: 'application/json'
        }
      });

      res.json(JSON.parse(response.text || '{}'));
    } catch (err: any) {
      console.error('Error in /api/ai/pre-guia:', err);
      res.status(500).json({ error: err.message || 'Erro ao gerar pré-guia com IA.' });
    }
  });

  // Vite integration middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hospital Central de Autorizações Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
