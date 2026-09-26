// ========================================================
// BASE DE DADOS OFICIAL - FLUXO DE PARECERES & INTERCONSULTAS MÉDICAS
// HOSPITAL PALMAS MEDICAL • KORA SAÚDE
// ========================================================

export interface ParecerStep {
  step: number;
  title: string;
  responsible: string;
  description: string;
  keyAction: string;
  alerts: string[];
}

export interface ConvenioParecerRule {
  convenioId: string;
  convenioName: string;
  badge: string;
  category: 'Autogestão' | 'Seguradora' | 'Privado' | 'Militar' | 'Estadual' | 'Público';
  requiresAuth: 'SIM' | 'NÃO' | 'CONDICIONAL';
  tussPs: string;
  tussInternacao: string;
  tussUti?: string;
  regraGeral: string;
  portalUrl?: string;
  portalNome?: string;
  documentosObrigatorios: string[];
  alertasCriticos: string[];
}

export const PARECER_WORKFLOW_STEPS: ParecerStep[] = [
  {
    step: 1,
    title: 'Identificação & Solicitação Médica',
    responsible: 'Médico Assistente / Plantonista (PS ou Internação)',
    description: 'O médico que está atendendo o paciente identifica a necessidade clínica de avaliação especializada de outra disciplina (ex: Cardiologia, Cirurgia, Neurologia, Ortopedia).',
    keyAction: 'Abrir ordem formal de Parecer / Interconsulta no TASY ou Prontuário com CID-10, hipótese diagnóstica e motivo clínico fundamentado.',
    alerts: [
      'Proibido solicitar parecer genérico sem justificativa clínica.',
      'Especificar se a solicitação é Urgente (risco iminente) ou Eletiva/Rotina.'
    ]
  },
  {
    step: 2,
    title: 'Checagem de Elegibilidade & Convênio',
    responsible: 'Setor de Autorizações / Recepção / Posto de Enfermagem',
    description: 'Verificação prévia do convênio do paciente para identificar se há exigência de autorização no portal, token ou liberação direta sem burocracia.',
    keyAction: 'Consultar a Matriz de Pareceres para obter o código TUSS exato do plano (ex: 40601130 no Servir PS, 40601120 na Internação, 10102019 na Cassi/Geap, 10102011 no FA-Saúde).',
    alerts: [
      'AMIL: EXIGE AUTORIZAÇÃO PRÉVIA no portal antes da realização.',
      'BRADESCO, CASSI, GEAP e POSTAL: Liberação direta com guia assinada.'
    ]
  },
  {
    step: 3,
    title: 'Acionamento do Especialista Parecerista',
    responsible: 'Enfermagem / NIR (Núcleo Interno de Regulação)',
    description: 'Contato com o médico especialista da escala de sobreaviso ou equipe presencial do hospital.',
    keyAction: 'Comunicar o médico especialista, repassar leito/setor e registrar no TASY o horário exato do acionamento e confirmação.',
    alerts: [
      'Em caso de urgência no PS, o tempo de resposta deve seguir o protocolo institucional de gravidade.',
      'Confirmar se o especialista possui CRM/RQE ativo cadastrado no prestador.'
    ]
  },
  {
    step: 4,
    title: 'Emissão da Guia TISS & Coleta de Assinaturas',
    responsible: 'Recepção / Posto de Enfermagem / Operador de Guia',
    description: 'Preenchimento e impressão da Guia SP/SADT ou Guia de Honorários / Outras Despesas do convênio.',
    keyAction: 'Imprimir a guia com o código TUSS correto e colher a assinatura do paciente ou acompanhante responsável.',
    alerts: [
      'ALERTA VERMELHO: NUNCA DEIXAR GUIA SEM ASSINATURA DO PACIENTE OU RESPONSÁVEL (Gera Glosa Irreversível).',
      'Informar o número da carteirinha e nome completo exatamente como no cartão do plano.'
    ]
  },
  {
    step: 5,
    title: 'Avaliação Presencial & Evolução Clínica',
    responsible: 'Médico Especialista Parecerista',
    description: 'O especialista comparece ao leito ou box de atendimento, examina o paciente, define a conduta terapêutica e responde à solicitação.',
    keyAction: 'Registrar a evolução médica completa no prontuário/TASY, assinar e carimbar a guia física TISS com CRM legível.',
    alerts: [
      'A evolução médica em prontuário é pré-requisito legal e contratual da ANS/CFM.',
      'O carimbo deve conter nome do profissional, CRM e especialidade/RQE.'
    ]
  },
  {
    step: 6,
    title: 'Faturamento, Auditoria & Repasse Médico',
    responsible: 'Setor de Faturamento / Auditoria de Contas Hospitalares',
    description: 'Fechamento da conta hospitalar, envio do XML TISS à operadora e repasse dos honorários ao médico parecerista.',
    keyAction: 'Auditar o prontuário: conferir paridade entre guia física assinada, pedido do assistente e evolução do especialista antes do envio do faturamento.',
    alerts: [
      'Verificar se a data da guia coincide com a data da evolução médica no prontuário.',
      'Guardar cópia digitalizada no arquivo de contas faturadas.'
    ]
  }
];

export const PARECERES_CONVENIOS_DATA: ConvenioParecerRule[] = [
  {
    convenioId: 'SERVIR',
    convenioName: 'SERVIR (Plano de Saúde TO)',
    badge: 'SR',
    category: 'Estadual',
    requiresAuth: 'CONDICIONAL',
    tussPs: '40601130',
    tussInternacao: '40601120',
    tussUti: '40601130',
    regraGeral: 'Possui códigos próprios regulados: no PS utilizar 40601130 (Parecer Médico Especialista U/E). Na Internação utilizar 40601120 (Parecer Especialista U/E na Internação). Para UTI usar 40601130. Paciente tem direito apenas a enfermaria.',
    portalUrl: 'https://servir.sefaz.to.gov.br/',
    portalNome: 'Portal SERVIR Tocantins',
    documentosObrigatorios: [
      'Guia SP/SADT emitida no portal Servir',
      'Assinatura do paciente ou responsável',
      'Assinatura e carimbo do médico solicitante',
      'Assinatura e carimbo do especialista parecerista',
      'Evolução do parecerista impressa no prontuário'
    ],
    alertasCriticos: [
      'Não usar código ambulatorial 10101012 pelo Servir.',
      'No PS é obrigatório usar 40601130 e na Internação 40601120.',
      'Verificar matrícula e biometria/elegibilidade no sistema do Governo do Estado.'
    ]
  },
  {
    convenioId: 'CASSI',
    convenioName: 'CASSI (Banco do Brasil)',
    badge: 'CA',
    category: 'Autogestão',
    requiresAuth: 'NÃO',
    tussPs: '10102019',
    tussInternacao: '10102019',
    tussUti: '10102019',
    regraGeral: 'Código padrão TUSS 10102019 (Visita hospitalar / Parecer de especialista). Não precisa de autorização prévia para pareceres em urgência e internação. Faturado com evolução médica em prontuário.',
    portalUrl: 'https://www.cassi.com.br/prestador/',
    portalNome: 'Portal CASSI Prestadores',
    documentosObrigatorios: [
      'Guia TISS SP/SADT ou Honorário Individual',
      'Assinatura obrigatória do paciente',
      'Evolução clínica do parecerista no prontuário',
      'Carimbo e CRM legível'
    ],
    alertasCriticos: [
      'Não exige senha prévia, liberação direta no faturamento.',
      'A evolução do parecer deve justificar a conduta adotada.'
    ]
  },
  {
    convenioId: 'GEAP',
    convenioName: 'GEAP Saúde',
    badge: 'GP',
    category: 'Autogestão',
    requiresAuth: 'NÃO',
    tussPs: '10102019',
    tussInternacao: '10102019',
    tussUti: '10102019',
    regraGeral: 'Código TUSS 10102019. Não necessita de autorização prévia para parecer de especialista. Lançar no faturamento com a guia assinada.',
    portalUrl: 'https://geap.com.br/',
    portalNome: 'Portal GEAP',
    documentosObrigatorios: [
      'Guia SP/SADT',
      'Assinatura do beneficiário',
      'Carimbo do parecerista com CRM',
      'Evolução médica detalhada'
    ],
    alertasCriticos: [
      'Máximo de 1 parecer por especialidade ao dia, salvo intercorrência grave descrita.'
    ]
  },
  {
    convenioId: 'PRO TOCANTINS',
    convenioName: 'FA-SAUDE (PRO-TOCANTINS)',
    badge: 'FS',
    category: 'Estadual',
    requiresAuth: 'CONDICIONAL',
    tussPs: '10101039',
    tussInternacao: '10102011',
    tussUti: '10102011',
    regraGeral: 'Solicita com o código 10102011 (Visita hospitalar / Parecer em enfermaria). Paciente só tem direito a acomodação de enfermaria. Solicitar através do novo portal FA Saúde.',
    portalUrl: 'https://servicos.fasaudefpto.com.br/prestador/index.php',
    portalNome: 'Portal Prestador FA Saúde Novo',
    documentosObrigatorios: [
      'Guia gerada no portal FA Saúde com código 10102011',
      'Assinatura do militar ou dependente',
      'Evolução e laudo de parecer'
    ],
    alertasCriticos: [
      'Utilizar login MEDICAL e senha no novo portal.',
      'Sempre selecionar enfermaria, plano militar não cobre apartamento.'
    ]
  },
  {
    convenioId: 'AMIL',
    convenioName: 'AMIL',
    badge: 'AM',
    category: 'Privado',
    requiresAuth: 'SIM',
    tussPs: '40601130',
    tussInternacao: '10102019',
    tussUti: '10102019',
    regraGeral: 'PRECISA DE AUTORIZAÇÃO PRÉVIA. É mandatório abrir solicitação de parecer no portal Amil antes do faturamento, anexando o pedido com a justificativa médica do médico assistente.',
    portalUrl: 'https://www.amil.com.br/prestador/',
    portalNome: 'Portal Amil Prestadores',
    documentosObrigatorios: [
      'Número do Token / Protocolo de Autorização Amil',
      'Pedido do médico assistente justificando a interconsulta',
      'Guia TISS assinada pelo paciente e pelo especialista',
      'Evolução em prontuário'
    ],
    alertasCriticos: [
      'NÃO REALIZAR/FATURAR SEM AUTORIZAÇÃO no portal Amil sob pena de glosa total imediata.',
      'Verificar carência e elegibilidade do plano do beneficiário.'
    ]
  },
  {
    convenioId: 'BRADESCO',
    convenioName: 'Bradesco Saúde',
    badge: 'BR',
    category: 'Seguradora',
    requiresAuth: 'NÃO',
    tussPs: '10101039',
    tussInternacao: '10102019',
    tussUti: '10102019',
    regraGeral: 'NÃO PRECISA DE AUTORIZAÇÃO PRÉVIA. Liberação direta para pareceres de pacientes internados ou em atendimento de urgência com código 10102019.',
    portalUrl: 'https://www.bradescoseguros.com.br/prestadores',
    portalNome: 'Portal Bradesco Prestador',
    documentosObrigatorios: [
      'Guia SP/SADT devidamente assinada',
      'Evolução médica no prontuário do paciente',
      'Carimbo e assinatura do parecerista'
    ],
    alertasCriticos: [
      'Passar o cartão ou token no leitor Bradesco para validar elegibilidade.',
      'Manter cópia da evolução clínica anexa à guia.'
    ]
  },
  {
    convenioId: 'POSTAL SAÚDE',
    convenioName: 'Postal Saúde (Correios)',
    badge: 'PS',
    category: 'Autogestão',
    requiresAuth: 'NÃO',
    tussPs: '10101039',
    tussInternacao: '10102019',
    tussUti: '10102019',
    regraGeral: 'NÃO PRECISA DE AUTORIZAÇÃO PRÉVIA. Pareceres médicos são cobertos diretamente com código 10102019 e evolução clínica comprobatória.',
    portalUrl: 'https://www.postalsaude.com.br/',
    portalNome: 'Portal Postal Saúde',
    documentosObrigatorios: [
      'Guia SP/SADT assinada pelo beneficiário',
      'Evolução detalhada do parecerista',
      'Carimbo com CRM legível'
    ],
    alertasCriticos: [
      'Cobrança direta sem necessidade de autorização prévia da operadora.'
    ]
  },
  {
    convenioId: 'BEST SAÚDE',
    convenioName: 'Best Saúde',
    badge: 'BS',
    category: 'Privado',
    requiresAuth: 'NÃO',
    tussPs: '10101039',
    tussInternacao: '10102019',
    tussUti: '10102019',
    regraGeral: 'NÃO PRECISA DE AUTORIZAÇÃO. Cobertura direta com código TUSS 10102019.',
    portalUrl: 'https://www.bestsaude.com.br/',
    portalNome: 'Portal Best Saúde',
    documentosObrigatorios: [
      'Guia SP/SADT assinada',
      'Evolução do especialista no prontuário'
    ],
    alertasCriticos: [
      'Sem burocracia de senha prévia.'
    ]
  },
  {
    convenioId: 'ASSEFAZ',
    convenioName: 'ASSEFAZ',
    badge: 'AF',
    category: 'Autogestão',
    requiresAuth: 'CONDICIONAL',
    tussPs: '10101039',
    tussInternacao: '10102019',
    tussUti: '10102019',
    regraGeral: 'Para paciente internado, usar 10102019 na conta hospitalar. No PS, se parecer extra, lançar no WebPlan informando o número da carteirinha.',
    portalUrl: 'https://www.assefaz.org.br/webplan/',
    portalNome: 'Portal WebPlan Assefaz',
    documentosObrigatorios: [
      'Guia WebPlan',
      'Assinatura do paciente',
      'Evolução clínica do especialista'
    ],
    alertasCriticos: [
      'No campo "Nº Guia no Prestador" informar a carteirinha.'
    ]
  },
  {
    convenioId: 'SAÚDE CAIXA',
    convenioName: 'Saúde Caixa',
    badge: 'SC',
    category: 'Autogestão',
    requiresAuth: 'CONDICIONAL',
    tussPs: '10101039',
    tussInternacao: '10102019',
    tussUti: '10102019',
    regraGeral: 'Código 10102019. Anexar à conta a solicitação do médico assistente e a evolução do parecerista. Não exige autorização prévia emergencial durante a internação clínica.',
    portalUrl: 'https://www.centralsaudecaixa.com.br/',
    portalNome: 'Portal Saúde Caixa',
    documentosObrigatorios: [
      'Guia de Outras Despesas ou SP/SADT assinada',
      'Relatório médico justificando o parecer'
    ],
    alertasCriticos: [
      'Beneficiário deve assinar a guia.'
    ]
  },
  {
    convenioId: 'SUL AMÉRICA',
    convenioName: 'Sul América Saúde',
    badge: 'SA',
    category: 'Seguradora',
    requiresAuth: 'NÃO',
    tussPs: '10101039',
    tussInternacao: '10102019',
    tussUti: '10102019',
    regraGeral: 'Código 10102019. Liberação direta em regime de internação. No PS usar consulta de urgência 10101039 se atendido no box.',
    portalUrl: 'https://saude.sulamerica.com.br/',
    portalNome: 'Portal SulAmérica Saúde',
    documentosObrigatorios: [
      'Guia TISS assinada',
      'Evolução médica'
    ],
    alertasCriticos: [
      'Validar biometria/token se solicitado pelo sistema.'
    ]
  },
  {
    convenioId: 'UNIMED',
    convenioName: 'Unimed Palmas / Central',
    badge: 'UN',
    category: 'Privado',
    requiresAuth: 'CONDICIONAL',
    tussPs: '10101039',
    tussInternacao: '10102019',
    tussUti: '10102019',
    regraGeral: 'Código 10102019. Passar biometria facial ou cartão no autorizador Unimed. Para interconsultas em UTI, lançar na guia de internação diária.',
    portalUrl: 'https://www.unimedpalmas.com.br/',
    portalNome: 'Portal Unimed Palmas',
    documentosObrigatorios: [
      'Comprovante do leitor biométrico / Guia TISS',
      'Assinatura do paciente'
    ],
    alertasCriticos: [
      'Unimed Intercâmbio exige verificação de autorização eletrônica.'
    ]
  },
  {
    convenioId: 'LIFE EMPRESARIAL',
    convenioName: 'Life Empresarial',
    badge: 'LE',
    category: 'Privado',
    requiresAuth: 'CONDICIONAL',
    tussPs: '10101039',
    tussInternacao: '10102019',
    tussUti: '10102019',
    regraGeral: 'Conforme regulação Life Empresarial. Consultar portal para validação da guia de parecer.',
    portalUrl: 'https://www.lifeempresarial.com.br/',
    portalNome: 'Portal Life Empresarial',
    documentosObrigatorios: ['Guia SP/SADT', 'Evolução clínica'],
    alertasCriticos: ['Verificar status de carência no portal.']
  },
  {
    convenioId: 'FUSEX',
    convenioName: 'Fusex (Exército Brasileiro)',
    badge: 'FX',
    category: 'Militar',
    requiresAuth: 'CONDICIONAL',
    tussPs: '10101039',
    tussInternacao: '10102019',
    tussUti: '10102019',
    regraGeral: 'Código 10102019. Exige guia de encaminhamento militar do 22º BI e parecer devidamente assinado com carimbo militar/médico.',
    documentosObrigatorios: ['Guia de Encaminhamento Fusex', 'Assinatura do titular'],
    alertasCriticos: ['Soldado tem direito apenas a enfermaria.']
  },
  {
    convenioId: 'PARTICULAR',
    convenioName: 'Particular (Palmas Medical)',
    badge: 'PA',
    category: 'Privado',
    requiresAuth: 'NÃO',
    tussPs: '10101039',
    tussInternacao: '10102019',
    tussUti: '10102019',
    regraGeral: 'Cobrança particular de Parecer Médico Especializado conforme tabela de honorários do hospital. Pagamento via recepção/financeiro.',
    documentosObrigatorios: ['Termo de Consentimento Particular', 'Comprovante de pagamento'],
    alertasCriticos: ['Informar o valor previamente ao paciente/família.']
  }
];

export const ESPECIALIDADES_PARECER: string[] = [
  'Cardiologia Clínica',
  'Cirurgia Geral',
  'Cirurgia Vascular',
  'Ortopedia & Traumatologia',
  'Neurologia Clínica',
  'Neurocirurgia',
  'Nefrologia',
  'Infectologia',
  'Pneumologia',
  'Gastroenterologia',
  'Pediatria Especializada',
  'Ginecologia & Obstetrícia',
  'Urologia',
  'Hematologia',
  'Endocrinologia',
  'Psiquiatria',
  'Dermatologia',
  'Otorrinolaringologia',
  'Oftalmologia',
  'Medicina Intensiva (Intensivista)'
];

export const ERROS_CRITICOS_GLOSA_PARECER: { title: string; desc: string; prevention: string }[] = [
  {
    title: 'Falta de Assinatura do Paciente na Guia TISS',
    desc: 'O convênio recusa e glosa integralmente o parecer alegando ausência de comprovação de que o atendimento ocorreu.',
    prevention: 'Coletar a assinatura do paciente ou responsável legal imediatamente na entrega da guia no leito ou box.'
  },
  {
    title: 'Parecer sem Hipótese Diagnóstica (CID) e Justificativa',
    desc: 'Auditoria do plano glosa quando o pedido do assistente apenas diz "solicito parecer" sem relatar motivo clínico.',
    prevention: 'O médico assistente deve obrigatoriamente registrar o quadro clínico, hipótese diagnóstica e a dúvida especializada no TASY.'
  },
  {
    title: 'Utilização de Código Incorreto (ex: Consulta Ambulatorial)',
    desc: 'Lançar o código ambulatorial 10101012 para paciente internado ou no Servir gera recusa sistêmica.',
    prevention: 'Usar estritamente 40601130 (Servir PS), 40601120 (Servir Internação), 10102011 (FA-Saúde) e 10102019 (Demais planos).'
  },
  {
    title: 'Duplicidade de Parecer da Mesma Especialidade no Mesmo Dia',
    desc: 'Mais de uma avaliação da mesma especialidade em 24h é barrada na maioria dos convênios.',
    prevention: 'Se houver nova intercorrência grave justificando segunda visita no dia, registrar como "Visita de Urgência por Descompensação Clínica" com relatório minucioso.'
  },
  {
    title: 'Carimbo Ilegível ou sem CRM do Parecerista',
    desc: 'A operadora glosa o repasse médico se o CRM e o nome do parecerista não puderem ser validados.',
    prevention: 'Exigir carimbo nítido com CRM, RQE e assinatura idêntica ao cadastro do prestador.'
  }
];
