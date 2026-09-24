import { TABELA_DIARIAS_DATA, ALL_DIARIAS_ITEMS, DiariaItem } from '../data/diariasData';
import { CONVENIOS_MASTER_LIST } from '../data/popsData';
import { PORTAIS_CREDENCIAIS, PORTAIS_RULES, PortalCredential } from '../data/portaisData';
import { PS_EXAM_DATA_ORIGINAL } from '../data/examData';
import { PROCEDIMENTOS_GERAIS, PROCEDIMENTOS_MEDICOS_ESPECIFICOS, PROCEDURES_METADATA } from '../data/proceduresData';
import { HOSPITAL_EXTENSIONS, HOSPITAL_REPORTS } from '../data/hospitalData';

export interface RetrievedSystemFact {
  category: 'exame' | 'diaria' | 'procedimento' | 'ramal' | 'portal' | 'prontuario' | 'regra_geral';
  title: string;
  code?: string;
  extraInfo?: string;
  details: string;
}

export type RetrievedHospitalFact = RetrievedSystemFact;

export interface UniversalKnowledgeResult {
  detectedConvenio?: string;
  matchedCategory: string;
  facts: RetrievedSystemFact[];
  groundingPromptText: string;
  directAnswer?: string;
}

function cleanStr(s: string): string {
  let cleaned = s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  // Normalize common phonetic typos & variations
  cleaned = cleaned
    .replace(/\bcinica\b/g, 'clinica')
    .replace(/\bcinico\b/g, 'clinico')
    .replace(/\bclinca\b/g, 'clinica')
    .replace(/\bclinco\b/g, 'clinico')
    .replace(/\binterancao\b/g, 'internacao')
    .replace(/\bintrnacao\b/g, 'internacao')
    .replace(/\bdiara\b/g, 'diaria')
    .replace(/\bcodgo\b/g, 'codigo')
    .replace(/\bcod\b/g, 'codigo')
    .replace(/\bservi\b/g, 'servir')
    .replace(/\bseriv\b/g, 'servir');

  return cleaned;
}

export function retrieveHospitalKnowledge(
  question: string
): UniversalKnowledgeResult {
  const normQ = cleanStr(question);
  const facts: RetrievedSystemFact[] = [];
  let detectedConvenio: string | undefined = undefined;

  // 1. Detect if any convênio is mentioned in the query
  for (const c of CONVENIOS_MASTER_LIST) {
    const cName = cleanStr(c.name);
    const cId = cleanStr(c.id);
    if (normQ.includes(cId) || normQ.includes(cName)) {
      detectedConvenio = c.id;
      break;
    }
  }

  // ----------------------------------------------------
  // 2. SEARCH HOSPITAL EXTENSIONS (RAMAIS / CONTATOS)
  // ----------------------------------------------------
  const isExtensionQuery = normQ.includes('ramal') || normQ.includes('telefone') || normQ.includes('numero') || normQ.includes('contato');
  if (isExtensionQuery) {
    for (const ext of HOSPITAL_EXTENSIONS) {
      const sNorm = cleanStr(ext.sector);
      const bNorm = cleanStr(ext.building);
      if (normQ.includes(ext.number) || normQ.includes(sNorm) || normQ.includes(bNorm)) {
        facts.push({
          category: 'ramal',
          title: ext.sector,
          code: ext.number,
          extraInfo: ext.building,
          details: `Ramal: ${ext.number} • Local: ${ext.building}`
        });
      }
    }
  }

  // ----------------------------------------------------
  // 3. SEARCH PORTALS, PASSWORDS & CREDENTIALS
  // ----------------------------------------------------
  const isPortalQuery = normQ.includes('portal') || normQ.includes('senha') || normQ.includes('login') || normQ.includes('site') || normQ.includes('link') || normQ.includes('url') || normQ.includes('priscila') || normQ.includes('whatsapp') || normQ.includes('orizon') || normQ.includes('acesso');
  if (isPortalQuery) {
    if (normQ.includes('priscila') || normQ.includes('whatsapp')) {
      facts.push({
        category: 'portal',
        title: 'WhatsApp Priscila (Senhas & Cadastros)',
        code: PORTAIS_RULES.whatsappPriscila,
        details: PORTAIS_RULES.warningWhatsapp
      });
    }

    for (const p of PORTAIS_CREDENCIAIS) {
      const pConv = cleanStr(p.convenio);
      const pSite = cleanStr(p.siteName);
      if (
        (detectedConvenio && cleanStr(detectedConvenio) === pConv) ||
        normQ.includes(pConv) ||
        normQ.includes(pSite)
      ) {
        facts.push({
          category: 'portal',
          title: `${p.convenio} (${p.siteName})`,
          code: `Login: ${p.login}`,
          extraInfo: p.portalUrl,
          details: `URL: ${p.portalUrl} | Login: ${p.login} | Senha: ${p.senha} ${p.notes ? `| Obs: ${p.notes}` : ''}`
        });
      }
    }
  }

  // ----------------------------------------------------
  // 4. SEARCH EXAMS (430+ EXAMES, TUSS, VALORES, PREPAROS)
  // ----------------------------------------------------
  // Search by code or description
  for (const row of PS_EXAM_DATA_ORIGINAL) {
    const [code, desc, val1, val2] = row;
    const descNorm = cleanStr(desc);
    const codeMatch = normQ.includes(code);
    
    // Check if query matches description keywords
    const isExamMention = codeMatch || (
      normQ.length >= 3 && descNorm.includes(normQ)
    ) || (
      normQ.includes('angiotomografia') && descNorm.includes('angiotomografia')
    ) || (
      normQ.includes('angio rm') && descNorm.includes('angio rm')
    ) || (
      normQ.includes('doppler') && descNorm.includes('doppler') && descNorm.includes(normQ.replace('doppler', '').trim())
    ) || (
      normQ.includes('biopsia') && descNorm.includes('biopsia')
    ) || (
      normQ.includes('puncao') && descNorm.includes('puncao')
    );

    if (isExamMention) {
      facts.push({
        category: 'exame',
        title: desc,
        code: code,
        extraInfo: `Valor: R$ ${val1} (Conv) / R$ ${val2} (Part)`,
        details: `Código TUSS: ${code} | Descrição: ${desc} | Preço Convênio: R$ ${val1} | Preço Particular: R$ ${val2}`
      });
      if (facts.length >= 6) break;
    }
  }

  // ----------------------------------------------------
  // 5. SEARCH SURGERIES & PROCEDURES (TABELA DE PREÇOS)
  // ----------------------------------------------------
  const allProcs = [...PROCEDIMENTOS_GERAIS, ...PROCEDIMENTOS_MEDICOS_ESPECIFICOS];
  for (const proc of allProcs) {
    const pDesc = cleanStr(proc.description);
    if (normQ.length >= 4 && (pDesc.includes(normQ) || normQ.includes(pDesc))) {
      facts.push({
        category: 'procedimento',
        title: proc.description,
        code: `R$ ${proc.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        extraInfo: `Diárias: ${proc.diarias}`,
        details: `Procedimento: ${proc.description} | Valor Hospitalar: R$ ${proc.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | Diárias inclusas: ${proc.diarias} | Categoria: ${proc.category}`
      });
      if (facts.length >= 8) break;
    }
  }

  // ----------------------------------------------------
  // 6. SEARCH HOSPITAL REPORTS & DOCUMENTATION (PRONTUÁRIOS)
  // ----------------------------------------------------
  if (normQ.includes('prontuario') || normQ.includes('documento') || normQ.includes('relatorio') || normQ.includes('pasta') || normQ.includes('termo')) {
    for (const rep of HOSPITAL_REPORTS) {
      if (normQ.includes(cleanStr(rep.tipo)) || normQ.includes(cleanStr(rep.classe))) {
        facts.push({
          category: 'prontuario',
          title: `Kit de Documentos: ${rep.tipo}`,
          details: `${rep.description} Itens: ${Object.values(rep.documentDetails).slice(0, 5).join('; ')}`
        });
      }
    }
  }

  // ----------------------------------------------------
  // 7. SEARCH DIÁRIAS, ACOMODAÇÕES E CONVÊNIOS
  // ----------------------------------------------------
  const isDiariaOrInternacaoQuery = (
    normQ.includes('diaria') ||
    normQ.includes('internacao') ||
    normQ.includes('internamento') ||
    normQ.includes('leito') ||
    normQ.includes('clinica') ||
    normQ.includes('clinico') ||
    normQ.includes('uti') ||
    normQ.includes('acomodacao') ||
    normQ.includes('enferm') ||
    normQ.includes('apartamento') ||
    normQ.includes('apto')
  );

  const pool = detectedConvenio 
    ? ALL_DIARIAS_ITEMS.filter(it => it.convenioId.toUpperCase() === detectedConvenio!.toUpperCase())
    : ALL_DIARIAS_ITEMS;

  const isUtiQuery = normQ.includes('uti');
  const isClinica = normQ.includes('clinica') || normQ.includes('clinico') || normQ.includes('enferm') || (normQ.includes('internacao') && !isUtiQuery);
  const isAptoQuery = normQ.includes('apartamento') || normQ.includes('apto');

  for (const it of pool) {
    const itAcom = cleanStr(it.acomodacao);
    const codeMatch = it.code && normQ.includes(it.code);
    
    // In SERVIR, patient has right exclusively to enfermaria for clinical admission (60000783)
    const isServirClinicalMatch = (detectedConvenio === 'SERVIR' && isClinica && !isUtiQuery && it.code === '60000783');

    const acomMatch = (
      (isUtiQuery && it.tipo === 'UTI') ||
      (isClinica && (it.tipo === 'Enfermaria' || itAcom.includes('clinico') || itAcom.includes('enfermaria'))) ||
      (isAptoQuery && it.tipo === 'Apartamento') ||
      (normQ.includes('isolamento') && it.tipo === 'Isolamento') ||
      (normQ.includes('bercario') && it.tipo === 'Berçário') ||
      (normQ.includes('hospital dia') && it.tipo === 'Hospital Dia') ||
      isServirClinicalMatch ||
      (itAcom && (normQ.includes(itAcom) || itAcom.includes(normQ)))
    );

    if (codeMatch || acomMatch) {
      let extra = it.solicitarJunto ? `Solicitar Junto: ${it.solicitarJunto}` : undefined;
      if (detectedConvenio === 'SERVIR' && it.code === '60000783') {
        extra = 'No SERVIR o paciente tem direito exclusivamente a Enfermaria para internação clínica. Solicitar Junto: Não precisa.';
      }

      facts.push({
        category: 'diaria',
        title: `${it.acomodacao} (${it.convenioName})`,
        code: it.code,
        extraInfo: extra,
        details: `Código: ${it.code} | Acomodação: ${it.acomodacao} | Convênio: ${it.convenioName} ${extra ? `| ${extra}` : ''}`
      });
      if (facts.length >= 6) break;
    }
  }

  // Fallback: If user asked about a convênio's diaria/internação and nothing matched yet, grab primary inpatient items
  if (facts.length === 0 && detectedConvenio && isDiariaOrInternacaoQuery && pool.length > 0) {
    for (const it of pool.slice(0, 2)) {
      facts.push({
        category: 'diaria',
        title: `${it.acomodacao} (${it.convenioName})`,
        code: it.code,
        extraInfo: it.solicitarJunto ? `Solicitar Junto: ${it.solicitarJunto}` : undefined,
        details: `Código: ${it.code} | Acomodação: ${it.acomodacao} | Convênio: ${it.convenioName} ${it.solicitarJunto ? `| Solicitar Junto: ${it.solicitarJunto}` : ''}`
      });
    }
  }

  // ----------------------------------------------------
  // 8. GENERATE DIRECT SUCCINCT ANSWER (ZERO LATENCY)
  // ----------------------------------------------------
  let directAnswer: string | undefined = undefined;
  if (facts.length > 0) {
    const f = facts[0];
    if (f.category === 'ramal') {
      directAnswer = `**${f.title}**\n• **Ramal:** \`${f.code}\`\n• **Local:** ${f.extraInfo || 'Hospital Palmas Medical'}`;
    } else if (f.category === 'portal') {
      directAnswer = `**${f.title}**\n• **Portal:** ${f.extraInfo || 'Acesso Web'}\n• **Credencial:** \`${f.code}\``;
    } else if (f.category === 'exame') {
      directAnswer = `**${f.title}**\n• **Código TUSS:** \`${f.code}\`\n• **${f.extraInfo}**`;
    } else if (f.category === 'procedimento') {
      directAnswer = `**${f.title}**\n• **Valor:** \`${f.code}\`\n• **${f.extraInfo}**`;
    } else if (f.category === 'diaria') {
      directAnswer = `**${f.title}**\n• **Código TUSS:** \`${f.code}\``;
      if (f.extraInfo) {
        directAnswer += `\n• ${f.extraInfo}`;
      }
    }
  }

  // Build grounding text for Gemini
  let groundingPromptText = `DADOS OFICIAIS DO SISTEMA HOSPITALAR PALMAS MEDICAL:\n`;
  if (facts.length > 0) {
    for (const f of facts.slice(0, 5)) {
      groundingPromptText += `• [${f.category.toUpperCase()}] ${f.details}\n`;
    }
  } else {
    groundingPromptText += `Nenhum item específico encontrado na busca rápida. Forneça orientação institucional padrão do hospital.\n`;
  }

  return {
    detectedConvenio,
    matchedCategory: facts[0]?.category || 'geral',
    facts,
    groundingPromptText,
    directAnswer
  };
}
