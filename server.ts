import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

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

  // AI Hospital Copilot Ask Endpoint
  app.post('/api/ai/ask', async (req, res) => {
    try {
      const { question, contextConvenio, contextSection } = req.body;
      if (!question) {
        return res.status(400).json({ error: 'Pergunta obrigatória' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: 'Chave do Gemini (GEMINI_API_KEY) não configurada no ambiente.',
          fallbackAnswer: 'Para utilizar a IA em tempo real, configure a chave da API no painel de configurações. Consulte as regras do POP nas abas institucionais ao lado.'
        });
      }

      const systemPrompt = `Você é o Assistente Inteligente Oficial de Autorizações e POPs Hospitalares do Hospital Palmas Medical.
Seu objetivo é orientar recepcionistas, enfermeiros, médicos e auditores hospitalares sobre:
1. Regras de autorização por convênio (AMIL, BRADESCO, CASSI, SERVIR, GEAP, SAÚDE CAIXA, ASSEFAZ, CONAB, E-VIDA, FUSEX, GAMA SAÚDE, GOLDEN CROSS, MARINHA, PASA/VALE, UNAFISCO, VIGIMED, etc.).
2. Validação de códigos TUSS / Pacotes próprios (ex: SERVIR 10101037, 70101401-412, AMIL 10101012, BRADESCO 84000406, GEAP 989100094/43, SAÚDE CAIXA 98800124 + 10101039).
3. Regras de Token, necessidade de anexar pedido médico, elegibilidade prévia, carência, e assinatura obrigatória do beneficiário.
4. Regras clínicas obrigatórias: Exames de Colonoscopia/Endoscopia sempre acompanhados de Anestesia (código 3.16.02.23-1), diárias de isolamento, diárias de UTI (intensivistas 10104020 x2 + 10104011), OPME na urgência vs eletivo.
5. Seja claro, objetivo, profissional, use formatação organizada em tópicos (Markdown) e destaque alertas em negrito.
${contextConvenio ? `O usuário está atualmente consultando o convênio: ${contextConvenio}.` : ''}
${contextSection ? `Seção ativa: ${contextSection}.` : ''}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          {
            text: `${systemPrompt}\n\nDúvida / Solicitação do Usuário:\n${question}`
          }
        ]
      });

      res.json({
        answer: response.text || 'Sem resposta gerada.',
        model: 'gemini-3.7-flash'
      });
    } catch (err: any) {
      console.error('Error in /api/ai/ask:', err);
      res.status(500).json({ error: err.message || 'Erro ao processar solicitação com IA.' });
    }
  });

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
        model: 'gemini-3.7-flash',
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
        model: 'gemini-3.7-flash',
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
