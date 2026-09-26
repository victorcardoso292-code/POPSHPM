import { TABELA_DIARIAS_DATA, ALL_DIARIAS_ITEMS, DiariaItem } from '../data/diariasData';
import { 
  CONVENIOS_MASTER_LIST, 
  SERVIR_DATA, 
  POPS_PS_MATRIX_DATA, 
  GEAP_COVID_INFLUENZA_EXAMS, 
  POPS_PS_INSTITUTIONAL_HEADER 
} from '../data/popsData';
import { PORTAIS_CREDENCIAIS, PORTAIS_RULES, PortalCredential } from '../data/portaisData';
import { PS_EXAM_DATA_ORIGINAL, LAB_EXAM_DATA_ORIGINAL, AMOR_EXAM_DATA_ORIGINAL } from '../data/examData';
import { PROCEDIMENTOS_GERAIS, PROCEDIMENTOS_MEDICOS_ESPECIFICOS, PROCEDURES_METADATA } from '../data/proceduresData';
import { HOSPITAL_EXTENSIONS, HOSPITAL_REPORTS } from '../data/hospitalData';
import { PARECERES_CONVENIOS_DATA, PARECER_WORKFLOW_STEPS, ERROS_CRITICOS_GLOSA_PARECER } from '../data/pareceresData';

// ----------------------------------------------------
// UNIFIED HOSPITAL KNOWLEDGE ITEM SCHEMA
// ----------------------------------------------------
export interface HospitalUnifiedItem {
  id: string;
  convenioId?: string;       // e.g. "ASSEFAZ", "SERVIR", "CASSI", "BRADESCO", "GEAP", "UNIMED", "GERAL"
  convenioName?: string;     // e.g. "Assefaz", "Servir", etc.
  area: 'pronto_socorro' | 'internacao' | 'uti' | 'remocao' | 'sadt' | 'hemodinamica' | 'ortopedia' | 'exame' | 'procedimento' | 'ramal' | 'portal' | 'documento' | 'regra_geral';
  subarea?: string;          // e.g. 'acomodacao', 'diaria', 'taxa', 'parecer', 'mat_med', 'ex_lab', 'ex_rad', 'fisioterapia', 'pacote', 'contato', 'valor', 'kit_documentos', 'acesso_portal'
  code?: string;             // TUSS or internal code
  title: string;             // Name or headline
  description?: string;
  solicitarJunto?: string;
  parecer?: string;
  matMed?: string;
  exLab?: string;
  exRad?: string;
  fisioterapia?: string;
  documentos?: string[];
  alertas?: string[];
  valores?: {
    particular?: string;
    convenio?: string;
    medprev?: string;
    amorSaude?: string;
    diariasInclusas?: number | string;
  };
  contatos?: string[];
  portalUrl?: string;
  login?: string;
  senha?: string;
  responsavel?: string;
  searchTokens: string;
}

export interface RetrievedSystemFact {
  category: 'exame' | 'diaria' | 'procedimento' | 'ramal' | 'portal' | 'prontuario' | 'regra_geral' | 'pop';
  title: string;
  code?: string;
  extraInfo?: string;
  details: string;
  score?: number;
  convenioId?: string;
  area?: string;
}

export type RetrievedHospitalFact = RetrievedSystemFact;

export interface UniversalKnowledgeResult {
  detectedConvenio?: string;
  detectedArea?: string;
  matchedCategory: string;
  facts: RetrievedSystemFact[];
  groundingPromptText: string;
  directAnswer?: string;
  isClarification?: boolean;
}

// ----------------------------------------------------
// DIGIT & CODE NORMALIZATION HELPERS
// ----------------------------------------------------
export function extractDigits(str: string): string {
  if (!str) return '';
  return str.replace(/[^0-9]/g, '');
}

export function isCodeMatch(query: string, candidateCode?: string): boolean {
  if (!candidateCode) return false;
  const qClean = cleanStr(query);
  const cClean = cleanStr(candidateCode);

  if (qClean.includes(cClean) || cClean.includes(qClean)) return true;

  const qDigits = extractDigits(query);
  const cDigits = extractDigits(candidateCode);
  if (!cDigits || cDigits.length < 3) return false;

  if (qDigits === cDigits) return true;
  if (qDigits.includes(cDigits) && cDigits.length >= 4) return true;
  if (cDigits.includes(qDigits) && qDigits.length >= 6) return true;

  return false;
}

// ----------------------------------------------------
// ADVANCED TEXT NORMALIZATION & PHONETIC / TYPO CLEANER
// ----------------------------------------------------
export function cleanStr(s: string): string {
  if (!s) return '';
  let cleaned = s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const replacements: [RegExp, string][] = [
    // Imaging & graphics
    [/\btc\b/g, 'tomografia'],
    [/\brm\b/g, 'ressonancia'],
    [/\brx\b/g, 'radiografia'],
    [/\busg\b/g, 'ultrassonografia'],
    [/\bus\b/g, 'ultrassonografia'],
    [/\bultrasom\b/g, 'ultrassonografia'],
    [/\bultrassom\b/g, 'ultrassonografia'],
    [/\bangioto\b/g, 'angiotomografia'],
    [/\bangiotc\b/g, 'angiotomografia'],
    [/\bangiorm\b/g, 'angiorressonancia'],
    [/\becg\b/g, 'eletrocardiograma'],
    [/\beletro\b/g, 'eletrocardiograma'],
    [/\beco\b/g, 'ecocardiograma'],
    [/\bcolono\b/g, 'colonoscopia'],
    [/\bcolonoscpa\b/g, 'colonoscopia'],
    [/\bcolooscopia\b/g, 'colonoscopia'],
    [/\bendo\b/g, 'endoscopia'],
    [/\bendoscopya\b/g, 'endoscopia'],
    [/\beda\b/g, 'endoscopia digestiva alta'],
    
    // Anatomy synonyms
    [/\bcabeca\b/g, 'cranio'],
    [/\bbest\b/g, 'best saude'],
    
    // Sectors & accommodations
    [/\benf\b/g, 'enfermaria'],
    [/\benferm\b/g, 'enfermaria'],
    [/\benfermria\b/g, 'enfermaria'],
    [/\bapto\b/g, 'apartamento'],
    [/\bap\b/g, 'apartamento'],
    [/\baparto\b/g, 'apartamento'],
    [/\bapartamnto\b/g, 'apartamento'],
    [/\bcc\b/g, 'centro cirurgico'],
    [/\bps\b/g, 'pronto socorro'],
    [/\bpa\b/g, 'pronto socorro'],
    [/\bped\b/g, 'pediatrica'],
    [/\bpediatrico\b/g, 'pediatrica'],
    [/\bpediatrca\b/g, 'pediatrica'],
    [/\bad\b/g, 'adulto'],
    [/\bcti\b/g, 'uti'],
    [/\bterapia intensiva\b/g, 'uti'],

    // Procedures
    [/\blipo\b/g, 'lipoaspiracao'],
    [/\bmastopesia\b/g, 'mastopexia'],
    [/\bmastopexa\b/g, 'mastopexia'],
    [/\brino\b/g, 'rinoplastia'],
    [/\brinoplasia\b/g, 'rinoplastia'],
    [/\bblefaro\b/g, 'blefaroplastia'],
    [/\bprotese\b/g, 'proteses'],
    [/\bhernea\b/g, 'hernia'],
    [/\bvesicula\b/g, 'colecistectomia'],
    [/\bcesariana\b/g, 'cesarea'],
    [/\bparto normal\b/g, 'parto'],

    // Hospital terms
    [/\bzap\b/g, 'whatsapp'],
    [/\bwpp\b/g, 'whatsapp'],
    [/\bwhats\b/g, 'whatsapp'],
    [/\bwats\b/g, 'whatsapp'],
    [/\bportao\b/g, 'portal'],
    [/\braml\b/g, 'ramal'],
    [/\brmal\b/g, 'ramal'],
    [/\btel\b/g, 'ramal'],
    [/\btelefone\b/g, 'ramal'],
    [/\btelefones\b/g, 'ramal'],
    [/\bcontato\b/g, 'ramal'],
    [/\bcinica\b/g, 'clinica'],
    [/\bcinico\b/g, 'clinico'],
    [/\bclinca\b/g, 'clinica'],
    [/\bclinco\b/g, 'clinico'],
    [/\binterancao\b/g, 'internacao'],
    [/\bintrnacao\b/g, 'internacao'],
    [/\bintrenacao\b/g, 'internacao'],
    [/\binternamento\b/g, 'internacao'],
    [/\bdiara\b/g, 'diaria'],
    [/\bdaria\b/g, 'diaria'],
    [/\bdiaris\b/g, 'diaria'],
    [/\bcodgo\b/g, 'codigo'],
    [/\bambulancia\b/g, 'remocao'],
    [/\bresgate\b/g, 'remocao'],
    [/\btransferencia\b/g, 'remocao'],
    [/\bmatmed\b/g, 'materiais medicamentos'],
    [/\bmat med\b/g, 'materiais medicamentos'],
    [/\bremedio\b/g, 'medicamentos'],
    [/\bremedios\b/g, 'medicamentos'],
    [/\binterconsulta\b/g, 'parecer'],
    [/\bprontuario\b/g, 'documento'],
    [/\bprontuarios\b/g, 'documentos'],
    [/\bpapelada\b/g, 'documentos'],
    [/\bpart\b/g, 'particular'],
    [/\btuss\b/g, 'codigo tuss'],
    [/\bcasi\b/g, 'cassi'],
    [/\bpriscila\b/g, 'priscila'],
    [/\bpriscilla\b/g, 'priscila'],
    [/\bcontrate\b/g, 'contraste'],
    [/\bcontaste\b/g, 'contraste'],
    [/\bcontrste\b/g, 'contraste']
  ];

  for (const [regex, rep] of replacements) {
    cleaned = cleaned.replace(regex, rep);
  }

  return cleaned.trim();
}

// ----------------------------------------------------
// LEVENSHTEIN & TOKEN SIMILARITY ALGORITHM
// ----------------------------------------------------
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const aLen = a.length;
  const bLen = b.length;

  let prevRow = new Array(bLen + 1);
  let currRow = new Array(bLen + 1);

  for (let j = 0; j <= bLen; j++) {
    prevRow[j] = j;
  }

  for (let i = 1; i <= aLen; i++) {
    currRow[0] = i;
    const aChar = a.charAt(i - 1);
    for (let j = 1; j <= bLen; j++) {
      const cost = aChar === b.charAt(j - 1) ? 0 : 1;
      currRow[j] = Math.min(
        currRow[j - 1] + 1,
        prevRow[j] + 1,
        prevRow[j - 1] + cost
      );
    }
    const temp = prevRow;
    prevRow = currRow;
    currRow = temp;
  }

  return prevRow[bLen];
}

export function wordSimilarity(w1: string, w2: string): number {
  if (w1 === w2) return 1;
  if (!w1 || !w2) return 0;
  if (w1.length < 3 && w2.length < 3) return w1 === w2 ? 1 : 0;

  if (w1.includes(w2) || w2.includes(w1)) return 0.88;

  const maxLen = Math.max(w1.length, w2.length);
  const dist = levenshteinDistance(w1, w2);

  return 1 - dist / maxLen;
}

const STOP_WORDS = new Set([
  'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'para', 'com', 'sem',
  'o', 'a', 'os', 'as', 'um', 'uma', 'por', 'na', 'no', 'nas', 'nos',
  'qual', 'quais', 'quanto', 'quantos', 'que', 'como', 'onde', 'tem',
  'saber', 'gostaria', 'favor', 'porfavor', 'me', 'passa', 'passe',
  'informa', 'informe', 'informar', 'consigo', 'pode', 'ver', 'busca',
  'ola', 'oi', 'oii', 'oiii', 'bom', 'dia', 'boa', 'tarde', 'noite',
  'tudo', 'bem', 'ajuda', 'gentileza', 'preciso', 'codigo', 'valor',
  'dele', 'dela', 'desse', 'dessa', 'tabela', 'preco', 'custa', 'custo'
]);

export function extractMeaningfulTokens(text: string): string[] {
  return cleanStr(text)
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

export function computeMatchScore(queryNorm: string, targetText: string, exactCode?: string): number {
  if (!targetText) return 0;
  const targetNorm = cleanStr(targetText);

  if (exactCode && isCodeMatch(queryNorm, exactCode)) {
    return 3000;
  }

  if (queryNorm === targetNorm) {
    return 800;
  }

  if (targetNorm.startsWith(queryNorm)) {
    return 650;
  }

  if (targetNorm.includes(queryNorm) || queryNorm.includes(targetNorm)) {
    const lenDiff = Math.abs(targetNorm.length - queryNorm.length);
    return 500 + Math.min(queryNorm.length, 50) - Math.min(lenDiff * 2, 100);
  }

  const queryTokens = extractMeaningfulTokens(queryNorm);
  if (queryTokens.length === 0) return 0;

  const targetTokens = extractMeaningfulTokens(targetNorm);
  if (targetTokens.length === 0) return 0;

  let totalScore = 0;
  let matchedTokens = 0;

  for (const qToken of queryTokens) {
    let bestTokenScore = 0;

    for (const tToken of targetTokens) {
      if (qToken === tToken) {
        bestTokenScore = Math.max(bestTokenScore, 60);
      } else if (tToken.startsWith(qToken) || qToken.startsWith(tToken)) {
        bestTokenScore = Math.max(bestTokenScore, 45);
      } else {
        const sim = wordSimilarity(qToken, tToken);
        if (sim >= 0.75) {
          bestTokenScore = Math.max(bestTokenScore, 35 * sim);
        }
      }
    }

    if (bestTokenScore > 0) {
      totalScore += bestTokenScore;
      matchedTokens++;
    }
  }

  const matchRatio = matchedTokens / queryTokens.length;
  if (matchRatio >= 0.8) {
    totalScore += 100;
  } else if (matchRatio >= 0.5) {
    totalScore += 40;
  }

  return totalScore;
}

// ----------------------------------------------------
// CONVERSATIONAL INTENTS & GREETINGS
// ----------------------------------------------------
export function isGreeting(text: string): boolean {
  const norm = cleanStr(text);
  if (!norm) return false;
  const greetingPhrases = [
    'ola', 'oi', 'oii', 'oiii', 'opa', 'salve', 'hello', 'hi',
    'bom dia', 'boa tarde', 'boa noite', 'tudo bem', 'como vai',
    'como voce esta', 'e ai', 'fala ai'
  ];
  const hasHospitalKeyword = /c[oó]digo|tuss|exame|di[aá]ria|ramal|valor|pre[çc]o|conv[eê]nio|servir|unimed|amil|bradesco|procedimento|cirurgia|portal|senha/i.test(text);
  if (hasHospitalKeyword) return false;

  const tokens = norm.split(' ');
  if (tokens.length <= 5) {
    if (greetingPhrases.some(g => norm.startsWith(g) || norm === g || norm.includes(g))) return true;
  }
  return false;
}

export function isThanks(text: string): boolean {
  const norm = cleanStr(text);
  if (!norm) return false;
  const thanksWords = [
    'obrigado', 'obrigada', 'obg', 'valeu', 'vlw', 'agradecido', 'grato', 'show', 'top', 'perfeito'
  ];
  const hasHospitalKeyword = /c[oó]digo|tuss|exame|di[aá]ria|ramal|valor/i.test(text);
  if (hasHospitalKeyword) return false;

  const tokens = norm.split(' ');
  return tokens.length <= 4 && thanksWords.some(t => norm.includes(t));
}

export function isHelpQuestion(text: string): boolean {
  const norm = cleanStr(text);
  if (!norm) return false;
  const hasHospitalKeyword = /c[oó]digo|tuss|exame|di[aá]ria|ramal|valor|pre[çc]o|conv[eê]nio|servir|unimed|amil|bradesco|assefaz|cassi|geap|saude|procedimento|cirurgia|portal|senha|pronto socorro|ps|uti|internacao/i.test(text);
  if (hasHospitalKeyword) return false;

  return norm.includes('quem e voce') ||
    norm.includes('o que voce') ||
    norm.includes('como usar') ||
    norm.includes('como ajuda') ||
    norm.includes('como ajudar') ||
    norm.includes('suas funcoes') ||
    norm.includes('o que sabe') ||
    norm === 'ajuda' ||
    norm === 'help' ||
    norm === 'menu' ||
    (norm.includes('funciona') && norm.length <= 15);
}

// ----------------------------------------------------
// BUILD UNIFIED HOSPITAL KNOWLEDGE REPOSITORY
// ----------------------------------------------------
let UNIFIED_DATABASE_CACHE: HospitalUnifiedItem[] | null = null;

export function getUnifiedHospitalDatabase(): HospitalUnifiedItem[] {
  if (UNIFIED_DATABASE_CACHE) {
    return UNIFIED_DATABASE_CACHE;
  }

  const items: HospitalUnifiedItem[] = [];

  // 1. TABELA DE DIÁRIAS E ACOMODAÇÕES (29 Convênios)
  for (const conv of TABELA_DIARIAS_DATA) {
    // Convênio general rules
    items.push({
      id: `diaria-regra-${conv.convenioId}`,
      convenioId: conv.convenioId,
      convenioName: conv.convenioName,
      area: 'internacao',
      subarea: 'regras_gerais',
      title: `${conv.convenioName} — Regras Gerais de Internação`,
      description: `Categoria: ${conv.category}. Parecer: ${conv.parecer}. Mat/Med: ${conv.matMed}. Exames Laboratório: ${conv.exLab}. Exames Imagem: ${conv.exRad}. Fisioterapia: ${conv.fisioIntern}. ${conv.criticalRule ? `ALERTA CRÍTICO: ${conv.criticalRule}` : ''} ${conv.urgenciaRegra ? `Urgência: ${conv.urgenciaRegra}` : ''} ${conv.inclusoPacote ? conv.inclusoPacote.join('; ') : ''}`,
      parecer: conv.parecer,
      matMed: conv.matMed,
      exLab: conv.exLab,
      exRad: conv.exRad,
      fisioterapia: conv.fisioIntern,
      alertas: conv.criticalRule ? [conv.criticalRule] : undefined,
      searchTokens: `${conv.convenioId} ${conv.convenioName} internacao regras diarias parecer matmed fisioterapia exames`
    });

    // Every accommodation item
    for (const d of conv.itens) {
      const isUti = d.tipo === 'UTI';
      items.push({
        id: `diaria-item-${d.id}`,
        convenioId: d.convenioId,
        convenioName: d.convenioName,
        area: isUti ? 'uti' : 'internacao',
        subarea: d.tipo.toLowerCase(),
        code: d.code,
        title: `${d.acomodacao} (${d.convenioName})`,
        description: `Código TUSS: ${d.code} | Acomodação: ${d.acomodacao} | Tipo: ${d.tipo} | Solicitar Junto: ${d.solicitarJunto || 'Conforme regra do plano'} | Parecer: ${d.parecer || conv.parecer} | Mat/Med: ${d.matMed || conv.matMed} | Exames Lab: ${d.exLab || conv.exLab} | Exames Imagem: ${d.exRad || conv.exRad} | Fisioterapia: ${d.fisioIntern || conv.fisioIntern}`,
        solicitarJunto: d.solicitarJunto,
        parecer: d.parecer || conv.parecer,
        matMed: d.matMed || conv.matMed,
        exLab: d.exLab || conv.exLab,
        exRad: d.exRad || conv.exRad,
        fisioterapia: d.fisioIntern || conv.fisioIntern,
        searchTokens: `${d.convenioId} ${d.convenioName} ${d.code} ${d.acomodacao} ${d.tipo} diaria internacao acomodacao leito quarto ${d.solicitarJunto || ''}`
      });
    }
  }

  // 2. SERVIR DATA (Setores Especializados: UTI, PS, Remoção, SADT, Hemodinâmica, Ortopedia, Contatos)
  for (const [secName, cards] of Object.entries(SERVIR_DATA)) {
    let targetArea: HospitalUnifiedItem['area'] = 'internacao';
    const sNorm = cleanStr(secName);
    if (sNorm.includes('ps') || sNorm.includes('pronto')) targetArea = 'pronto_socorro';
    else if (sNorm.includes('uti')) targetArea = 'uti';
    else if (sNorm.includes('remocao')) targetArea = 'remocao';
    else if (sNorm.includes('sadt')) targetArea = 'sadt';
    else if (sNorm.includes('hemodinamica')) targetArea = 'hemodinamica';
    else if (sNorm.includes('ortopedia')) targetArea = 'ortopedia';
    else if (sNorm.includes('contato') || sNorm.includes('acesso')) targetArea = 'portal';

    for (const card of cards) {
      if (card.rows) {
        for (const [rCode, rDesc] of card.rows) {
          items.push({
            id: `servir-${rCode}-${cleanStr(rDesc).slice(0, 15)}`,
            convenioId: 'SERVIR',
            convenioName: 'Servir',
            area: targetArea,
            subarea: card.title.toLowerCase(),
            code: rCode,
            title: `${rDesc} (SERVIR)`,
            description: `Seção: ${secName} > ${card.title}. Código: ${rCode}. Descrição: ${rDesc}. ${card.info || ''} ${card.alerts ? card.alerts.join('; ') : ''}`,
            alertas: card.alerts,
            contatos: card.contacts,
            searchTokens: `servir plano to tocantins ${rCode} ${rDesc} ${secName} ${card.title} ${targetArea} ${card.info || ''}`
          });
        }
      } else {
        items.push({
          id: `servir-card-${cleanStr(card.title).slice(0, 20)}`,
          convenioId: 'SERVIR',
          convenioName: 'Servir',
          area: targetArea,
          subarea: card.title.toLowerCase(),
          title: `${card.title} (SERVIR)`,
          description: `Seção: ${secName}. ${card.info || ''} ${card.alerts ? card.alerts.join('; ') : ''} ${card.contacts ? `Contatos: ${card.contacts.join(', ')}` : ''}`,
          alertas: card.alerts,
          contatos: card.contacts,
          searchTokens: `servir plano to tocantins ${secName} ${card.title} ${targetArea} ${card.info || ''}`
        });
      }
    }
  }

  // 3. CONVENIOS MASTER LIST (31 Convênios com Seções, Códigos, Steps, TextItems)
  for (const c of CONVENIOS_MASTER_LIST) {
    if (c.pacotePs) {
      items.push({
        id: `cml-ps-${c.id}`,
        convenioId: c.id,
        convenioName: c.name,
        area: 'pronto_socorro',
        subarea: 'pacote_ps',
        code: c.pacotePs,
        title: `Pacote Consulta Pronto-Socorro (${c.name})`,
        description: `Código TUSS: ${c.pacotePs}. Convênio: ${c.name}. Exames Lab Urgência: ${c.labUrgencia}. Exames Imagem: ${c.imagemUrgencia}.`,
        exLab: c.labUrgencia,
        exRad: c.imagemUrgencia,
        searchTokens: `${c.id} ${c.name} ${c.pacotePs} pacote pronto socorro consulta ps urgencia`
      });
    }

    if (c.sections) {
      for (const [secKey, sec] of Object.entries(c.sections)) {
        let area: HospitalUnifiedItem['area'] = 'internacao';
        if (secKey === 'ps') area = 'pronto_socorro';
        else if (secKey === 'uti') area = 'uti';
        else if (secKey === 'exames') area = 'exame';
        else if (secKey === 'elegibilidade') area = 'portal';

        // Codes
        if (sec.codes) {
          for (const item of sec.codes) {
            items.push({
              id: `cml-${c.id}-${secKey}-${item.code}`,
              convenioId: c.id,
              convenioName: c.name,
              area,
              subarea: sec.label.toLowerCase(),
              code: item.code,
              title: `${item.label} (${c.name})`,
              description: `Convênio: ${c.name} | Setor: ${sec.label} | Código TUSS: ${item.code} | Descrição: ${item.label}`,
              searchTokens: `${c.id} ${c.name} ${sec.label} ${item.code} ${item.label} ${area}`
            });
          }
        }

        // Steps & TextItems
        if (sec.steps || sec.textItems) {
          const allTexts = [...(sec.steps || []), ...(sec.textItems || [])];
          items.push({
            id: `cml-${c.id}-${secKey}-orientacoes`,
            convenioId: c.id,
            convenioName: c.name,
            area,
            subarea: sec.label.toLowerCase(),
            title: `${c.name} — Orientações de ${sec.label}`,
            description: `Orientações e Passos para ${sec.label} (${c.name}):\n${allTexts.map((t, idx) => `• [Passo ${idx + 1}] ${t}`).join('\n')}`,
            searchTokens: `${c.id} ${c.name} ${sec.label} ${area} ${allTexts.join(' ')}`
          });
        }
      }
    }
  }

  // 4. POPS PRONTO SOCORRO - MATRIZ OFICIAL E DADOS INSTITUCIONAIS
  items.push({
    id: 'ps-institutional-header',
    area: 'pronto_socorro',
    subarea: 'dados_institucionais',
    code: '12955953000192',
    title: 'POPS PS - Diretrizes Oficiais e Dados Institucionais do Pronto-Socorro',
    description: `CNPJ Pronto-Socorro: 12.955.953/0001-92 | CBO Clínico Geral (Urgência/Emergência): 225125 | Plantões e Sobreavisos Médicos no PS: Urologista, Cardiologista, Nefrologista, Neurologista, Neurocirurgião. Diretrizes Gerais: 1) Exames fora de pacote solicitar autorização convênio. 2) Colher assinatura em todas as guias autorizadas e fichas de atendimento.`,
    searchTokens: 'cnpj cbo clinico geral 225125 sobreaviso urologista cardiologista nefrologista neurologista neurocirurgiao regras ps assinatura guia ficha'
  });

  for (const m of POPS_PS_MATRIX_DATA) {
    items.push({
      id: `ps-matriz-${cleanStr(m.convenio)}`,
      convenioId: m.convenio.toUpperCase(),
      convenioName: m.convenio,
      area: 'pronto_socorro',
      subarea: 'matriz_ps',
      code: m.pacotePsAdulto || m.pacotePsGeral || undefined,
      title: `Matriz PS Oficial — ${m.convenio}`,
      description: `Convênio: ${m.convenio} | Pacote Adulto: ${m.pacotePsAdulto || 'N/A'} | Pacote Pediatria: ${m.pacotePsPediatria || 'N/A'} | Pacote Geral: ${m.pacotePsGeral || 'N/A'} | Exames Laboratoriais PS: ${m.examesLaboratoriais} | Exames Imagem no Pacote (Imprimir Capa TASY): ${m.imagemPacoteCapaTasy}`,
      exLab: m.examesLaboratoriais,
      exRad: m.imagemPacoteCapaTasy,
      searchTokens: `${m.convenio} matriz ps pacote adulto pediatria ${m.pacotePsAdulto || ''} ${m.pacotePsPediatria || ''} ${m.pacotePsGeral || ''} exames laboratorio ${m.examesLaboratoriais} capa tasy ${m.imagemPacoteCapaTasy}`
    });
  }

  // 5. GEAP COVID E INFLUENZA
  for (const g of GEAP_COVID_INFLUENZA_EXAMS) {
    items.push({
      id: `geap-covid-${g.code}`,
      convenioId: 'GEAP',
      convenioName: 'GEAP',
      area: 'pronto_socorro',
      subarea: 'covid_influenza',
      code: g.code,
      title: `GEAP — ${g.description}`,
      description: `Tabela Amarela GEAP (Autorização Prévia Obrigatória no PS). Código TUSS: ${g.code} | Descrição: ${g.description} | Regra: Autorizar obrigatoriamente no portal antes da coleta.`,
      searchTokens: `geap covid influenza ${g.code} ${g.description} tabela amarela autorizacao previa`
    });
  }

  // 6. PORTAIS E SENHAS DOS CONVÊNIOS (20+ Portais)
  for (const p of PORTAIS_CREDENCIAIS) {
    items.push({
      id: `portal-${p.id}`,
      convenioId: p.convenio.toUpperCase(),
      convenioName: p.convenio,
      area: 'portal',
      subarea: p.category.toLowerCase(),
      title: `Portal e Acesso: ${p.convenio} (${p.siteName})`,
      description: `Convênio: ${p.convenio} | Hospital: ${p.hospital} | Categoria: ${p.category} | Site: ${p.siteName} | URL: ${p.portalUrl} | Login: ${p.login} | Senha: ${p.senha} | Responsável/Instruções: ${p.responsavel || p.notes || 'Padrão'}`,
      portalUrl: p.portalUrl,
      login: p.login,
      senha: p.senha,
      responsavel: p.responsavel,
      searchTokens: `portal site url link login usuario senha credencial ${p.convenio} ${p.siteName} ${p.notes || ''}`
    });
  }

  // 7. VALORES DE EXAMES (PS, Laboratório, Amor Saúde, MedPrev)
  // PS Exams (Imagem, Métodos Gráficos, ECG, EDA)
  for (const [code, desc, valConv, valPart, matrad] of PS_EXAM_DATA_ORIGINAL) {
    const dUpper = desc.toUpperCase();
    let modality = 'exame imagem';
    if (dUpper.includes('TC') || dUpper.includes('TOMOGRAFIA')) modality = 'tomografia tc tomografia computadorizada';
    else if (dUpper.includes('RM') || dUpper.includes('RESSONANCIA')) modality = 'ressonancia rm ressonancia magnetica';
    else if (dUpper.includes('RX') || dUpper.includes('RAIO')) modality = 'raio x rx radiografia';
    else if (dUpper.includes('US') || dUpper.includes('ULTRASSOM') || dUpper.includes('ECOGRAFIA')) modality = 'ultrassom usg ultrassonografia';
    else if (dUpper.includes('ECG') || dUpper.includes('ELETRO')) modality = 'eletrocardiograma ecg metodos graficos';
    else if (dUpper.includes('ENDOSCOPIA') || dUpper.includes('COLONOSCOPIA') || dUpper.includes('EDA')) modality = 'endoscopia colonoscopia digestiva';

    items.push({
      id: `exame-ps-${code || cleanStr(desc).slice(0, 15)}`,
      area: 'exame',
      subarea: 'imagem_graficos',
      code,
      title: desc,
      description: `Código TUSS: ${code || 'Sob consulta'} | Procedimento: ${desc} | Valor Convênio/MedPrev: R$ ${valConv} | Valor Particular: R$ ${valPart} ${matrad !== '*' ? `| MAT/RAD: R$ ${matrad}` : ''}`,
      valores: {
        particular: valPart,
        convenio: valConv,
        medprev: valConv
      },
      searchTokens: `${code} ${desc} ${modality} valor preco particular medprev conv`
    });
  }

  // Amor Saúde Exams
  for (const [code, desc, valAmor] of AMOR_EXAM_DATA_ORIGINAL) {
    const dUpper = desc.toUpperCase();
    let modality = 'amor saude exame';
    if (dUpper.includes('TC') || dUpper.includes('TOMOGRAFIA')) modality = 'amor saude tomografia tc tomografia computadorizada';
    else if (dUpper.includes('RM') || dUpper.includes('RNM') || dUpper.includes('RESSONANCIA')) modality = 'amor saude ressonancia rm ressonancia magnetica';
    else if (dUpper.includes('RX') || dUpper.includes('RAIO')) modality = 'amor saude raio x rx radiografia';
    else if (dUpper.includes('US') || dUpper.includes('ULTRASSOM')) modality = 'amor saude ultrassom usg ultrassonografia';
    else if (dUpper.includes('ECG') || dUpper.includes('ELETRO')) modality = 'amor saude eletrocardiograma ecg';

    items.push({
      id: `exame-amor-${code || cleanStr(desc).slice(0, 15)}`,
      area: 'exame',
      subarea: 'amor_saude',
      code,
      title: `${desc} (Tabela Amor Saúde)`,
      description: `Tabela Amor Saúde | Código TUSS: ${code || 'Sob consulta'} | Procedimento: ${desc} | Valor Amor Saúde: R$ ${valAmor}`,
      valores: {
        amorSaude: valAmor
      },
      searchTokens: `${code} ${desc} ${modality} valor preco particular amor saude`
    });
  }

  // Laboratório Exams
  for (const [code, desc, valConv, valPart] of LAB_EXAM_DATA_ORIGINAL) {
    items.push({
      id: `exame-lab-${code || cleanStr(desc).slice(0, 15)}`,
      area: 'exame',
      subarea: 'laboratorio',
      code,
      title: `${desc} (Exame Laboratorial)`,
      description: `Código TUSS: ${code} | Exame Laboratorial: ${desc} | Valor Convênio: R$ ${valConv} | Valor Particular: R$ ${valPart}`,
      valores: {
        particular: valPart,
        convenio: valConv
      },
      searchTokens: `${code} ${desc} laboratorio sangue urina fezes exame lab valor particular`
    });
  }

  // 8. PROCEDIMENTOS CIRÚRGICOS E PACOTES PARTICULARES
  const allProcs = [...PROCEDIMENTOS_GERAIS, ...PROCEDIMENTOS_MEDICOS_ESPECIFICOS];
  for (const pr of allProcs) {
    const isUtiProc = pr.description.toLowerCase().includes('uti');
    items.push({
      id: `proc-${pr.id}`,
      area: isUtiProc ? 'uti' : 'procedimento',
      subarea: pr.category,
      title: pr.description,
      description: `Procedimento: ${pr.description} | Categoria: ${pr.category} | Valor Hospitalar: R$ ${pr.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | Diárias Inclusas: ${pr.diarias} ${pr.notes ? `| Observação: ${pr.notes}` : ''}`,
      valores: {
        particular: pr.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
        diariasInclusas: pr.diarias
      },
      searchTokens: `${pr.description} ${pr.category} ${pr.notes || ''} cirurgia procedimento valor pacote diarias`
    });
  }

  // 9. RAMAIS E TELEFONES DO HOSPITAL
  for (const ext of HOSPITAL_EXTENSIONS) {
    items.push({
      id: `ramal-${ext.number}-${cleanStr(ext.sector)}`,
      area: 'ramal',
      subarea: ext.category,
      code: ext.number,
      title: `Ramal ${ext.number} — ${ext.sector}`,
      description: `Setor: ${ext.sector} | Ramal: ${ext.number} | Localização: ${ext.building} | Categoria: ${ext.category}`,
      contatos: [ext.number],
      searchTokens: `ramal telefone contato falar com ${ext.number} ${ext.sector} ${ext.building} ${ext.category}`
    });
  }

  // 10. KITS DE PRONTUÁRIOS E DOCUMENTAÇÃO OBRIGATÓRIA
  for (const rep of HOSPITAL_REPORTS) {
    items.push({
      id: `prontuario-${rep.classe}`,
      area: 'documento',
      subarea: rep.classe,
      title: `Kit de Documentos Prontuário — ${rep.tipo}`,
      description: `Tipo: ${rep.tipo} | ${rep.description}\nItens Obrigatórios:\n${Object.entries(rep.documentDetails).map(([k, v]) => `• Item ${k}: ${v}`).join('\n')}`,
      documentos: Object.values(rep.documentDetails),
      searchTokens: `prontuario documento kit documentos papelada pasta termo ${rep.tipo} ${rep.description}`
    });
  }

  // 11. FLUXO DE PARECERES & INTERCONSULTAS MÉDICAS
  for (const pr of PARECERES_CONVENIOS_DATA) {
    items.push({
      id: `parecer-${pr.convenioId}`,
      convenioId: pr.convenioId,
      convenioName: pr.convenioName,
      area: 'internacao',
      subarea: 'parecer',
      title: `Fluxo de Parecer Médico — ${pr.convenioName}`,
      code: `${pr.tussPs} / ${pr.tussInternacao}`,
      description: `Convênio: ${pr.convenioName} | TUSS PS: ${pr.tussPs} | TUSS Internação: ${pr.tussInternacao} | Exige Autorização: ${pr.requiresAuth} | Regra: ${pr.regraGeral} | Documentos: ${pr.documentosObrigatorios.join(', ')}`,
      parecer: pr.regraGeral,
      documentos: pr.documentosObrigatorios,
      alertas: pr.alertasCriticos,
      searchTokens: `parecer interconsulta medico especialista avaliacao ${pr.convenioId} ${pr.convenioName} ${pr.tussPs} ${pr.tussInternacao} ${pr.regraGeral}`
    });
  }

  // 12. PLANO DE CONTINGÊNCIA - FICHA DE ATENDIMENTO MANUAL (HPM.FM)
  items.push({
    id: 'contingencia-hpm-fm',
    convenioId: 'TODOS',
    convenioName: 'Hospital Palmas Medical (Kora Saúde)',
    area: 'pronto_socorro',
    subarea: 'kit_documentos',
    title: 'Plano de Contingência — Ficha de Atendimento Manual (HPM.FM)',
    code: 'HPM.FM (Versão 000)',
    description: 'Protocolo de contingência para atendimento manual quando o sistema TASY estiver fora do ar ou sem energia. Preenchimento obrigatório da Ficha HPM.FM com dados do paciente, responsável e assinatura. Cláusula mandatória: Caso o convênio esteja em carência ou procedimento negado, o atendimento será particular.',
    documentos: [
      'Ficha de Atendimento Manual HPM.FM impressa',
      'Assinatura do responsável ou beneficiário',
      'Assinatura legível do recepcionista',
      'Cópia da carteirinha e documento com foto do paciente'
    ],
    alertas: [
      'Em caso de queda do Tasy ou instabilidade de rede, abrir a aba Plano de Contingência no sistema.',
      'Preencher todos os campos (Nome, CPF, Mãe, Nascimento, Convênio, Carteirinha, Telefones).',
      'Coletar assinatura física antes do atendimento.',
      'Após o restabelecimento do Tasy, digitar as fichas retroativas imediatamente.'
    ],
    searchTokens: 'contingencia plano de contingencia tasy fora do ar sistema caiu queda energia ficha atendimento manual hpm fm kora recepcao'
  });

  UNIFIED_DATABASE_CACHE = items;
  return items;
}

// ----------------------------------------------------
// MULTI-TURN CONVERSATION CONTEXT RESOLVER
// ----------------------------------------------------
export function resolveQueryWithHistory(
  query: string,
  history?: { role: string; text: string }[]
): {
  searchTarget: string;
  previousConvenio?: string;
  previousArea?: string;
  previousItem?: string;
} {
  let searchTarget = query;
  let previousConvenio: string | undefined = undefined;
  let previousArea: string | undefined = undefined;
  let previousItem: string | undefined = undefined;

  if (history && history.length > 0) {
    const userTurns = history.filter(h => h.role === 'user' && h.text.trim().length > 1);
    
    // Look backwards through conversation history to find previous context
    for (let i = userTurns.length - 1; i >= 0; i--) {
      const turnNorm = cleanStr(userTurns[i].text);

      // Detect convênio in previous turn
      if (!previousConvenio) {
        for (const c of CONVENIOS_MASTER_LIST) {
          const cIdNorm = cleanStr(c.id);
          const cNameNorm = cleanStr(c.name);
          if (turnNorm.includes(cIdNorm) || turnNorm.includes(cNameNorm)) {
            previousConvenio = c.id;
            break;
          }
        }
      }

      // Detect area in previous turn
      if (!previousArea) {
        if (turnNorm.includes('internacao') || turnNorm.includes('internar')) previousArea = 'internacao';
        else if (turnNorm.includes('uti')) previousArea = 'uti';
        else if (turnNorm.includes('pronto socorro') || turnNorm.includes('ps')) previousArea = 'pronto_socorro';
        else if (turnNorm.includes('remocao') || turnNorm.includes('ambulancia')) previousArea = 'remocao';
        else if (turnNorm.includes('exame') || turnNorm.includes('tomografia') || turnNorm.includes('ressonancia')) previousArea = 'exame';
      }

      // Detect specific exam in previous turn
      if (!previousItem) {
        if (turnNorm.includes('tomografia') || turnNorm.includes('ressonancia') || turnNorm.includes('ecg') || turnNorm.includes('endoscopia')) {
          previousItem = userTurns[i].text;
        }
      }
    }

    const qNorm = cleanStr(query);
    const isFollowUp = (
      qNorm.length < 35 ||
      qNorm.startsWith('e ') ||
      qNorm.includes('como interna') ||
      qNorm.includes('como faco a internacao') ||
      qNorm.includes('e se for') ||
      qNorm.includes('e para uti') ||
      qNorm.includes('dele') || qNorm.includes('dela') ||
      qNorm.includes('desse') || qNorm.includes('dessa') ||
      qNorm.includes('quanto custa') || qNorm.includes('qual o valor') ||
      qNorm.includes('tem contraste') || qNorm.includes('precisa de autorizacao')
    );

    if (isFollowUp) {
      const enrichments: string[] = [query];
      if (previousConvenio && !qNorm.includes(cleanStr(previousConvenio))) {
        enrichments.push(previousConvenio);
      }
      if (previousArea && !qNorm.includes(cleanStr(previousArea))) {
        enrichments.push(previousArea);
      }
      if (previousItem && !qNorm.includes(cleanStr(previousItem))) {
        enrichments.push(previousItem);
      }
      searchTarget = enrichments.join(' ');
    }
  }

  return {
    searchTarget,
    previousConvenio,
    previousArea,
    previousItem
  };
}

// ----------------------------------------------------
// INCOMPLETE / AMBIGUOUS QUERY DETECTOR
// ----------------------------------------------------
export function checkIncompleteQuery(normQ: string, hasHistoryContext: boolean): string | null {
  if (hasHistoryContext) return null; // If user is in a context thread, do not trigger generic clarification

  // 1. Generic Tomografia question without region
  const isGenericTc = (
    normQ === 'qual o valor da tomografia' ||
    normQ === 'quanto custa uma tomografia' ||
    normQ === 'quanto custa tomografia' ||
    normQ === 'valor da tomografia' ||
    normQ === 'valor tomografia' ||
    normQ === 'preco tomografia' ||
    normQ === 'tomografia valor'
  );
  if (isGenericTc) {
    return 'Qual tipo de tomografia você precisa consultar? Ex.: Crânio, Tórax, Abdome Total, Coluna Lombar, Seios da Face etc. (Você também pode informar se é com ou sem contraste e se é Particular, Amor Saúde ou Convênio).';
  }

  // 2. Generic Ressonância question without region
  const isGenericRm = (
    normQ === 'qual o valor da ressonancia' ||
    normQ === 'quanto custa uma ressonancia' ||
    normQ === 'quanto custa ressonancia' ||
    normQ === 'valor da ressonancia' ||
    normQ === 'valor ressonancia' ||
    normQ === 'preco ressonancia'
  );
  if (isGenericRm) {
    return 'Qual região anatômica da ressonância você deseja consultar? Ex.: Joelho, Crânio/Encéfalo, Coluna Lombar, Ombro, Pelve etc.';
  }

  // 3. Generic Internação without convênio
  const isGenericInternacao = (
    normQ === 'como interna' ||
    normQ === 'como fazer internacao' ||
    normQ === 'como faco uma internacao' ||
    normQ === 'como funciona internacao' ||
    normQ === 'regras de internacao'
  );
  if (isGenericInternacao) {
    return 'Para qual convênio você deseja consultar as regras de internação? (Ex.: ASSEFAZ, SERVIR, CASSI, BRADESCO, GEAP, UNIMED, SAÚDE CAIXA etc.).';
  }

  return null;
}

// ----------------------------------------------------
// MAIN RETRIEVAL ENGINE WITH UNIVERSAL RAG
// ----------------------------------------------------
export function retrieveHospitalKnowledge(
  question: string,
  history?: { role: string; text: string }[]
): UniversalKnowledgeResult {
  // 1. Greetings & Social Intents
  if (isGreeting(question)) {
    return {
      matchedCategory: 'interacao',
      facts: [],
      groundingPromptText: 'Interação social amigável.',
      directAnswer: 'Olá! Sou a assistente inteligente da **Central de Autorizações & POPs Hospitalar** do Palmas Medical.\n\nComo posso te ajudar no seu atendimento hoje? Você pode me perguntar sobre:\n• Regras e POPs de internação, UTI, PS e remoções de qualquer convênio;\n• Códigos TUSS de exames, diárias e procedimentos;\n• Valores de exames (Particular, MedPrev e Amor Saúde);\n• Documentos necessários e orientações dos portais;\n• Ramais e contatos internos do hospital.'
    };
  }

  if (isThanks(question)) {
    return {
      matchedCategory: 'interacao',
      facts: [],
      groundingPromptText: 'Agradecimento cordial.',
      directAnswer: 'Por nada! Estou sempre à disposição para auxiliar com códigos, autorizações, POPs e procedimentos do hospital. Bom plantão!'
    };
  }

  if (isHelpQuestion(question)) {
    return {
      matchedCategory: 'interacao',
      facts: [],
      groundingPromptText: 'Menu de ajuda da Central de Autorizações.',
      directAnswer: 'Estou pronta para te ajudar com todo o ecossistema hospitalar:\n• **POPs e Regras de Convênios:** ASSEFAZ, SERVIR, CASSI, BRADESCO, GEAP, UNIMED e todos os demais planos (PS, Internação, UTI, Remoção e SADT).\n• **Códigos TUSS e Diárias:** Acomodações (Enfermaria, Apartamento, UTI), taxas e solicitações conjuntas.\n• **Valores de Exames e Cirurgias:** Imagem, gráficos (ECG), laboratório, procedimentos cirúrgicos e pacotes.\n• **Portais e Credenciais:** Links, logins, orientações de senha e contatos de autorização.\n• **Ramais e Documentos:** Setores do hospital e kits de prontuário obrigatórios.\n\nBasta me perguntar o que você precisa!'
    };
  }

  // 2. Resolve Multi-Turn Context with Conversation History
  const historyResolution = resolveQueryWithHistory(question, history);
  const searchTarget = historyResolution.searchTarget;
  const normQ = cleanStr(searchTarget);
  const rawClean = cleanStr(question);

  // 3. Check for Incomplete Query Disambiguation
  const clarificationPrompt = checkIncompleteQuery(rawClean, !!historyResolution.previousConvenio);
  if (clarificationPrompt) {
    return {
      matchedCategory: 'clarificacao',
      isClarification: true,
      facts: [],
      groundingPromptText: `Pergunta com informação incompleta. Solicitar dados faltantes ao usuário: ${clarificationPrompt}`,
      directAnswer: clarificationPrompt
    };
  }

  // 4. Identify Target Convênio and Clinical Area
  let detectedConvenio = historyResolution.previousConvenio;
  let bestConvScore = 0;
  for (const c of CONVENIOS_MASTER_LIST) {
    const cName = cleanStr(c.name);
    const cId = cleanStr(c.id);
    const score = computeMatchScore(normQ, `${cId} ${cName}`);
    if (score > 30 && score > bestConvScore) {
      bestConvScore = score;
      detectedConvenio = c.id;
    }
  }

  // Detect Area
  let detectedArea: string | undefined = undefined;
  if (normQ.includes('uti') || normQ.includes('cti')) detectedArea = 'uti';
  else if (normQ.includes('pronto socorro') || normQ.includes('ps') || normQ.includes('urgencia') || normQ.includes('emergencia')) detectedArea = 'pronto_socorro';
  else if (normQ.includes('remocao') || normQ.includes('ambulancia')) detectedArea = 'remocao';
  else if (normQ.includes('sadt') || normQ.includes('endoscopia') || normQ.includes('colonoscopia')) detectedArea = 'sadt';
  else if (normQ.includes('hemodinamica') || normQ.includes('cateterismo')) detectedArea = 'hemodinamica';
  else if (normQ.includes('ortopedia') || normQ.includes('gesso')) detectedArea = 'ortopedia';
  else if (normQ.includes('internacao') || normQ.includes('internar') || normQ.includes('enfermaria') || normQ.includes('apartamento') || normQ.includes('leito')) detectedArea = 'internacao';
  else if (normQ.includes('exame') || normQ.includes('tomografia') || normQ.includes('ressonancia') || normQ.includes('radiografia') || normQ.includes('ecg')) detectedArea = 'exame';
  else if (normQ.includes('ramal') || normQ.includes('telefone')) detectedArea = 'ramal';
  else if (normQ.includes('portal') || normQ.includes('senha') || normQ.includes('login') || normQ.includes('acesso')) detectedArea = 'portal';

  // 5. Query the Unified Knowledge Database
  const db = getUnifiedHospitalDatabase();
  const scoredItems: { item: HospitalUnifiedItem; score: number }[] = [];

  for (const item of db) {
    let score = 0;

    // Direct Code Match (Highest Priority)
    if (item.code && isCodeMatch(question, item.code)) {
      score = 3500;
    } else {
      const matchScore = computeMatchScore(normQ, item.searchTokens, item.code);
      score = matchScore;

      const isRamalQuery = normQ.includes('ramal') || normQ.includes('telefone') || normQ.includes('contato');
      const isValorQuery = normQ.includes('valor') || normQ.includes('preco') || normQ.includes('custa') || normQ.includes('quanto');

      // 1. RAMAL PRIORITY
      if (isRamalQuery) {
        if (item.area === 'ramal') {
          score += 3200;
        } else {
          score -= 1000; // Deprioritize accommodations if user asked for a phone extension
        }
      }

      // 2. VALUES / PRICES PRIORITY
      if (isValorQuery) {
        if (item.valores && (item.valores.particular || item.valores.convenio || item.valores.amorSaude)) {
          score += 2000;
        }
      }

      // 2.1 Penalize Angiotomografia/Angiorressonância if user just asked for standard TC/RM
      if (!normQ.includes('angio') && item.title.toLowerCase().includes('angio')) {
        score -= 200;
      }

      // 3. CONVÊNIO AFFINITY
      if (detectedConvenio && item.convenioId && item.convenioId.toUpperCase() === detectedConvenio.toUpperCase()) {
        score += 80;

        // Area Affinity for the Convênio
        if (detectedArea && item.area === detectedArea) {
          score += 250;
        }

        // Special UTI boost for convênio (only if not asking for a ramal)
        if (!isRamalQuery && normQ.includes('uti') && (item.area === 'uti' || item.subarea === 'uti')) {
          score += 2500;
        }
      } else if (!isRamalQuery && normQ.includes('uti') && item.area === 'uti') {
        score += 150;
      }

      // 4. DIRECT AREA AFFINITY
      if (detectedArea && item.area === detectedArea) {
        score += 100;
      }
    }

    if (score >= 35) {
      scoredItems.push({ item, score });
    }
  }

  // Sort descending by relevance score
  scoredItems.sort((a, b) => b.score - a.score);

  // 6. Map to RetrievedSystemFacts
  const facts: RetrievedSystemFact[] = scoredItems.slice(0, 8).map(({ item, score }) => {
    let cat: RetrievedSystemFact['category'] = 'pop';
    if (item.area === 'exame') cat = 'exame';
    else if (item.area === 'uti' || item.area === 'internacao') cat = 'diaria';
    else if (item.area === 'ramal') cat = 'ramal';
    else if (item.area === 'portal') cat = 'portal';
    else if (item.area === 'documento') cat = 'prontuario';
    else if (item.area === 'procedimento') cat = 'procedimento';
    else if (item.area === 'regra_geral') cat = 'regra_geral';

    return {
      category: cat,
      title: item.title,
      code: item.code,
      extraInfo: item.solicitarJunto ? `Solicitar Junto: ${item.solicitarJunto}` : (item.valores?.particular ? `Valor Particular: R$ ${item.valores.particular}` : undefined),
      details: item.description || item.title,
      score,
      convenioId: item.convenioId,
      area: item.area
    };
  });

  // 7. Synthesize Executive Hospital Direct Answer
  let directAnswer = '';
  let matchedCategory = facts.length > 0 ? facts[0].category : 'geral';

  // Strict Anti-Hallucination check for specific unregistered area of a convênio
  if (detectedConvenio && detectedArea && ['remocao', 'sadt', 'hemodinamica', 'ortopedia'].includes(detectedArea)) {
    const hasSpecificAreaItem = scoredItems.some(s => s.item.convenioId === detectedConvenio && s.item.area === detectedArea);
    if (!hasSpecificAreaItem) {
      const areaLabel = detectedArea === 'remocao' ? 'Remoção' : (detectedArea === 'sadt' ? 'SADT' : (detectedArea === 'hemodinamica' ? 'Hemodinâmica' : 'Ortopedia'));
      directAnswer = `Não encontrei regras específicas de **${areaLabel}** cadastradas para o convênio **${detectedConvenio}** na base da Central de Autorizações.\n\nPor favor, consulte o POP oficial da operadora ou solicite à coordenação a inclusão desta rotina no sistema.`;
      return {
        detectedConvenio,
        detectedArea,
        matchedCategory: 'pop',
        facts: [],
        groundingPromptText: `Não encontrei regras específicas de ${areaLabel} cadastradas para o convênio ${detectedConvenio} na base da Central de Autorizações.`,
        directAnswer
      };
    }
  }

  if (scoredItems.length > 0) {
    const top = scoredItems[0].item;

    // Cross-Entity Scenario: "Paciente ASSEFAZ vai internar na UTI..." or similar multi-faceted query
    if (detectedConvenio && (normQ.includes('uti') || normQ.includes('interna'))) {
      const convItems = scoredItems.filter(s => s.item.convenioId === detectedConvenio).map(s => s.item);
      const utiItem = convItems.find(i => i.area === 'uti' || i.subarea === 'uti');
      const internItem = convItems.find(i => i.area === 'internacao');
      const portalItem = db.find(i => i.convenioId === detectedConvenio && i.area === 'portal');
      const kitDoc = db.find(i => i.area === 'documento' && (normQ.includes('uti') ? i.title.includes('URGÊNCIA') : i.title.includes('CLÍNICA')));

      const isUtiRequest = normQ.includes('uti');
      const targetItem = isUtiRequest && utiItem ? utiItem : (internItem || top);

      directAnswer = `**${targetItem.convenioName || detectedConvenio} – ${isUtiRequest ? 'Internação em UTI' : 'Internação Hospitalar'}**\n\n`;
      
      if (targetItem.code) {
        directAnswer += `• **Acomodação:** ${targetItem.title}\n`;
        directAnswer += `• **Código TUSS:** \`${targetItem.code}\`\n`;
      }

      if (targetItem.solicitarJunto) {
        directAnswer += `• **Solicitar Junto:** ${targetItem.solicitarJunto}\n`;
      }

      if (targetItem.parecer && !targetItem.parecer.includes('Não informado')) {
        directAnswer += `• **Parecer Médico:** ${targetItem.parecer}\n`;
      }

      if (targetItem.fisioterapia && !targetItem.fisioterapia.includes('Não informado')) {
        directAnswer += `• **Fisioterapia:** ${targetItem.fisioterapia}\n`;
      }

      if (targetItem.matMed && !targetItem.matMed.includes('Não informado')) {
        directAnswer += `• **Mat/Med:** ${targetItem.matMed}\n`;
      }

      // Documentos
      directAnswer += `\n**Documentos necessários:**\n`;
      directAnswer += `• Pedido médico / laudo de internação com CID-10;\n`;
      directAnswer += `• Carteirinha do convênio ${targetItem.convenioName || detectedConvenio};\n`;
      directAnswer += `• Documento oficial com foto (RG/CPF);\n`;
      if (kitDoc && kitDoc.documentos) {
        directAnswer += `• Kit de Prontuário (${kitDoc.title}): Ficha de Admissão, Termo de Consentimento, Prescrição Médica e Checklist.\n`;
      }

      // Autorização / Portal
      if (portalItem) {
        directAnswer += `\n**Autorização & Portal:**\n`;
        directAnswer += `• **Portal:** ${portalItem.portalUrl || portalItem.title}\n`;
        if (portalItem.login) directAnswer += `• **Login:** \`${portalItem.login}\` | **Senha:** \`${portalItem.senha}\`\n`;
      }

      // Alertas
      if (targetItem.alertas && targetItem.alertas.length > 0) {
        directAnswer += `\n⚠️ **ATENÇÃO:** ${targetItem.alertas.join(' • ')}`;
      } else if (detectedConvenio === 'ASSEFAZ') {
        directAnswer += `\n⚠️ **ATENÇÃO:** Exames laboratoriais necessitam de autorização prévia no portal Assefaz; exames de imagem no PS (Raio-X) exigem impressão de Capa TASY na recepção.`;
      } else if (detectedConvenio === 'SERVIR') {
        directAnswer += `\n⚠️ **ATENÇÃO:** No SERVIR a UTI é Pacote Global (não precisa solicitar junto); exames laboratoriais e radiologia necessitam de autorização prévia.`;
      }
    } 
    // Scenario: Consulta de Exame / Valor
    else if (top.area === 'exame' || top.area === 'procedimento') {
      directAnswer = `**${top.title}**\n\n`;
      if (top.code) {
        directAnswer += `• **Código TUSS:** \`${top.code}\`\n`;
      }
      if (top.valores) {
        if (top.valores.particular) directAnswer += `• **Valor Particular:** R$ ${top.valores.particular}\n`;
        if (top.valores.convenio) directAnswer += `• **Valor Convênio / MedPrev:** R$ ${top.valores.convenio}\n`;
        if (top.valores.amorSaude) directAnswer += `• **Valor Amor Saúde:** R$ ${top.valores.amorSaude}\n`;
        if (top.valores.diariasInclusas !== undefined) directAnswer += `• **Diárias Hospitalares Inclusas:** ${top.valores.diariasInclusas}\n`;
      }
      if (top.description) {
        directAnswer += `• **Detalhes:** ${top.description}\n`;
      }

      // Check if there are related Amor Saúde or with-contrast variations among the top facts
      const otherVariants = scoredItems.slice(1, 4)
        .map(s => s.item)
        .filter(it => it.id !== top.id && it.valores && (it.valores.particular || it.valores.amorSaude));

      if (otherVariants.length > 0) {
        directAnswer += `\n**Outras opções / tabelas cadastradas:**\n`;
        for (const v of otherVariants) {
          const vPrice = v.valores?.amorSaude ? `Amor Saúde: R$ ${v.valores.amorSaude}` : `Particular: R$ ${v.valores?.particular}`;
          directAnswer += `• **${v.title}** ${v.code ? `(\`${v.code}\`)` : ''}: ${vPrice}\n`;
        }
      }
    }
    // Scenario: Consulta de Ramal
    else if (top.area === 'ramal') {
      directAnswer = `**${top.title}**\n\n• **Número do Ramal:** \`${top.code}\`\n• **Localização:** ${top.description}\n`;
    }
    // Scenario: Consulta de Portal / Senha
    else if (top.area === 'portal') {
      directAnswer = `**${top.title}**\n\n`;
      if (top.portalUrl) directAnswer += `• **Link de Acesso:** ${top.portalUrl}\n`;
      if (top.login) directAnswer += `• **Login:** \`${top.login}\`\n`;
      if (top.senha) directAnswer += `• **Senha:** \`${top.senha}\`\n`;
      if (top.responsavel) directAnswer += `• **Responsável / Orientações:** ${top.responsavel}\n`;
      if (top.contatos) directAnswer += `• **Contatos:** ${top.contatos.join(', ')}\n`;
    }
    // Scenario: Consulta de Remoção
    else if (top.area === 'remocao') {
      directAnswer = `**${top.title}**\n\n`;
      if (top.code) directAnswer += `• **Código:** \`${top.code}\`\n`;
      if (top.description) directAnswer += `• **Regras:** ${top.description}\n`;
      if (top.contatos) directAnswer += `• **Contatos e E-mails:** ${top.contatos.join(', ')}\n`;
      if (top.alertas) directAnswer += `\n⚠️ **ATENÇÃO:** ${top.alertas.join(' • ')}`;
    }
    // Scenario: Direct Code Search
    else if (top.code && isCodeMatch(question, top.code)) {
      directAnswer = `**Código Identificado: ${top.code}**\n\n`;
      directAnswer += `• **Procedimento / Item:** ${top.title}\n`;
      directAnswer += `• **Área / Setor:** ${top.area.toUpperCase()}\n`;
      if (top.convenioName) directAnswer += `• **Convênio:** ${top.convenioName}\n`;
      if (top.solicitarJunto) directAnswer += `• **Solicitar Junto:** ${top.solicitarJunto}\n`;
      if (top.description) directAnswer += `• **Orientações:** ${top.description}\n`;
    }
    // Fallback standard executive formatting
    else {
      directAnswer = `**${top.title}**\n\n`;
      if (top.code) directAnswer += `• **Código TUSS/POP:** \`${top.code}\`\n`;
      if (top.solicitarJunto) directAnswer += `• **Solicitar Junto:** ${top.solicitarJunto}\n`;
      if (top.description) directAnswer += `• ${top.description}\n`;
      if (top.alertas && top.alertas.length > 0) directAnswer += `\n⚠️ **ATENÇÃO:** ${top.alertas.join(' • ')}`;
    }
  }

  // Fallback if zero items match
  if (!directAnswer) {
    directAnswer = 'Não encontrei essa informação cadastrada na base da Central de Autorizações. Por favor, verifique o POP do convênio ou confirme com a coordenação.';
  }

  // 8. Grounding Context Prompt for Gemini
  const groundingPromptText = scoredItems.slice(0, 6).map((s, idx) => {
    const it = s.item;
    return `[REGISTRO ${idx + 1}] (${it.area.toUpperCase()}) ${it.title} | Código: ${it.code || 'N/A'} | Convênio: ${it.convenioName || 'Geral'} | Detalhes: ${it.description || ''} | Solicitar Junto: ${it.solicitarJunto || 'N/A'} | Alertas: ${it.alertas ? it.alertas.join('; ') : 'Nenhum'}`;
  }).join('\n\n') || 'Nenhum registro específico localizado no banco de dados para os termos digitados.';

  return {
    detectedConvenio,
    detectedArea,
    matchedCategory,
    facts,
    groundingPromptText,
    directAnswer
  };
}
