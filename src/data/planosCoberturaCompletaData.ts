export interface ExameStatusDetalhe {
  status: 'ATENDE' | 'NAO_ATENDE' | 'PACOTE_PS' | 'COM_ESPECIFICIDADE' | 'SOMENTE_URGENCIA' | 'SOMENTE_ELETIVO' | 'PARTICULAR' | 'SEM_INFORMACAO' | 'AGUARDANDO_RETORNO' | 'SUSPENSO';
  descricao: string;
  codigo?: string;
  detalhe?: string;
}

export interface PlanoCoberturaCompleta {
  id: string;
  nome: string;
  nomeExibicao: string;
  badge: string;
  categoria: 'Seguradora' | 'Autogestão' | 'Estadual / Regional' | 'Privado' | 'Militar' | 'Clínica / Cartão' | 'Público';
  situacao: 'ATIVO' | 'SUSPENSO' | 'DESCREDENCIADO' | 'PARTICULAR_SOMENTE';
  
  // Planilha 1: Estrutura Geral & Hospitalar
  santaThereza: {
    prontoAtendimento: string;
    internacao: string;
  };
  consultaEletiva: string;
  psAdulto: string;
  psInfantil: string;
  uti: string;
  oftalmologia: string;
  laboratorio: string;
  mamografia: string;
  quimioterapia: string;
  hemodialise: string;
  ambulancia: string;
  observacoesGerais: string[];

  // Planilha 2: Matriz Específica de Exames & Diagnóstico
  exames: {
    rm: ExameStatusDetalhe;
    tc: ExameStatusDetalhe;
    raioX: ExameStatusDetalhe;
    colonoscopia: ExameStatusDetalhe;
    retossigmoidoscopia: ExameStatusDetalhe;
    endoscopia: ExameStatusDetalhe;
    usg: ExameStatusDetalhe;
    eco: ExameStatusDetalhe;
  };

  // Códigos de contrato e referências
  codigosContrato?: {
    urgencia?: string;
    eletivo?: string;
    prestador?: string;
    especificos?: { titulo: string; codigo: string }[];
  };

  // Contatos úteis
  contatosUteis?: string[];
}

export const REGRA_GERAL_PLANILHAS = "Para qualquer item sem informação registrada ou em branco, a regra institucional da Planilha determina: 'Perguntar para a Priscila antes do atendimento'.";

export const PLANOS_COBERTURA_COMPLETA: PlanoCoberturaCompleta[] = [
  // 1. ALLIANZ
  {
    id: 'ALLIANZ',
    nome: 'ALLIANZ SAÚDE',
    nomeExibicao: '1. ALLIANZ',
    badge: 'AL',
    categoria: 'Seguradora',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'OK - Atende Pronto Atendimento no Santa Thereza.',
      internacao: 'OK - Atende Internação no Santa Thereza.'
    },
    consultaEletiva: 'Não atende consulta eletiva no Medical.',
    psAdulto: 'Não atende PS Adulto no Medical.',
    psInfantil: 'Não atende PS Infantil no Medical.',
    uti: 'Somente no Santa Thereza para UTI Neonatal e UTI Adulto. Não possui credenciamento para UTI Pediátrica.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Não atende laboratório.',
    mamografia: 'Não atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Não atende serviço de ambulância.',
    observacoesGerais: [
      'Santa Thereza: Pronto Atendimento e Internação OK.',
      'Medical: Não atende consultas, PS, exames ou procedimentos.',
      'UTI: apenas Neonatal e Adulto no Santa Thereza. Sem UTI Pediátrica.'
    ],
    exames: {
      rm: { status: 'NAO_ATENDE', descricao: 'Não atende no Medical.' },
      tc: { status: 'NAO_ATENDE', descricao: 'Não atende no Medical.' },
      raioX: { status: 'NAO_ATENDE', descricao: 'Não atende no Medical.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      eco: { status: 'NAO_ATENDE', descricao: 'ECO / Parecer / Risco Cirúrgico: não atende.' }
    }
  },

  // 2. ABRAMGE
  {
    id: 'ABRAMGE',
    nome: 'ABRAMGE',
    nomeExibicao: '2. ABRAMGE',
    badge: 'AB',
    categoria: 'Privado',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Verificar no ato.',
      internacao: 'Não atende internação no Santa Thereza.'
    },
    consultaEletiva: 'Não atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Verificar individualmente conforme o convênio de origem do beneficiário.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Somente em urgência.',
    mamografia: 'Não atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Somente urgência e pegar a primeira autorização.',
    ambulancia: 'Cobrar particular. Entre HST e HPM, verificar com João.',
    observacoesGerais: [
      'Atende PS Adulto e Infantil.',
      'Exames de imagem e laboratório: restritos a casos de urgência.',
      'Hemodiálise: somente urgência com 1ª autorização.',
      'Ambulância entre hospitais: verificar com João.'
    ],
    exames: {
      rm: { status: 'SOMENTE_URGENCIA', descricao: 'Somente em urgência.' },
      tc: { status: 'SOMENTE_URGENCIA', descricao: 'Somente em urgência.' },
      raioX: { status: 'SOMENTE_URGENCIA', descricao: 'Somente em urgência.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'SOMENTE_URGENCIA', descricao: 'Somente em caso de urgência.' },
      usg: { status: 'ATENDE', descricao: 'Pegar autorização prévia.' },
      eco: { status: 'NAO_ATENDE', descricao: 'ECO / Parecer / Risco: não atende.' }
    }
  },

  // 3. AMIL
  {
    id: 'AMIL',
    nome: 'AMIL SAÚDE',
    nomeExibicao: '3. AMIL',
    badge: 'AM',
    categoria: 'Seguradora',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Atende.',
      internacao: 'Atende internação no Santa Thereza, exceto UTI.'
    },
    consultaEletiva: 'Atende Oftalmologia, Cirurgia Geral, Otorrino, Ortopedia, Ginecologia, Cirurgia Cardiovascular, Neurocirurgia e Pediatria.',
    psAdulto: 'Pacote com tudo incluso.',
    psInfantil: 'Pacote com tudo incluso.',
    uti: 'Usar códigos de diária 60001038, 60001054 ou 60001062 (conforme o caso) e ACRESCENTAR: 10104011 (Intensivista Diarista: 1x/dia/paciente) e 10104020 (Intensivista UTI Geral/Pediátrica - plantão 12h: 2x).',
    oftalmologia: 'Atende consulta e exames oftalmológicos.',
    laboratorio: 'Atende exames laboratoriais.',
    mamografia: 'Atende mamografia.',
    quimioterapia: 'Atende quimioterapia.',
    hemodialise: 'Não atende hemodiálise.',
    ambulancia: 'Não possui serviço de ambulância próprio. Cobrar particular; caso seja UTI, acionar CARE MED e informar a Priscila pelo WhatsApp.',
    observacoesGerais: [
      'PS com tudo incluso no pacote.',
      'RM atende inclusive eletivo (conferir no POPs quais RMs estão contempladas).',
      'TC atende na urgência; não atende eletivo.',
      'ECO / Parecer / Risco: somente paciente internado com autorização prévia; particular deve ser cobrado.',
      'Ambulância UTI: acionar CARE MED e avisar Priscila.'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende, inclusive eletivo. Verificar no POPs quais RMs estão contempladas.' },
      tc: { status: 'ATENDE', descricao: 'Atende; não atende no eletivo.' },
      raioX: { status: 'ATENDE', descricao: 'Atende inclusive eletivo.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      eco: { status: 'NAO_ATENDE', descricao: 'Não atende eletivo. Somente paciente internado com autorização prévia; particular deve ser cobrado.' }
    }
  },

  // 4. ASSEFAZ
  {
    id: 'ASSEFAZ',
    nome: 'ASSEFAZ',
    nomeExibicao: '4. ASSEFAZ',
    badge: 'AS',
    categoria: 'Autogestão',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Atende.',
      internacao: 'Rede JADE não é habilitada no HPM, somente no HST (Santa Thereza).'
    },
    consultaEletiva: 'Atende consultas eletivas.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: '60000260 (Diária Compacta UTI Adulto Geral); 60001034 (Diária UTI Infantil); 600001062 (Diária UTI Neonatal). Adicionar 10104011 (1x) e 10104020 (2x).',
    oftalmologia: 'Atende.',
    laboratorio: 'Atende.',
    mamografia: 'Atende.',
    quimioterapia: 'Não atende quimioterapia.',
    hemodialise: 'Registrado como OK conforme e-mails citados em 21/02/2024 e 22/02/2024.',
    ambulancia: 'Não possui serviço; cobrar particular e, se for UTI, acionar CARE MED.',
    observacoesGerais: [
      'Rede JADE habilitada apenas no Santa Thereza (HST), não no HPM.',
      'Colonoscopia, Reto e Endoscopia: atende (referência de autorização por e-mail 21 e 22/02/2024).',
      'ECO: sem informação registrada na Planilha 2 (consultar Priscila).'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende.' },
      tc: { status: 'ATENDE', descricao: 'Atende.' },
      raioX: { status: 'ATENDE', descricao: 'Atende.' },
      colonoscopia: { status: 'ATENDE', descricao: 'Atende; referência de autorização informada por e-mail em 21/02/2024 e 22/02/2024.' },
      retossigmoidoscopia: { status: 'ATENDE', descricao: 'Atende; autorização por e-mail (fev/2024).' },
      endoscopia: { status: 'ATENDE', descricao: 'Atende; autorização por e-mail (fev/2024).' },
      usg: { status: 'ATENDE', descricao: 'Atende.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na Planilha 2. Perguntar para a Priscila.' }
    }
  },

  // 5. BEST SAÚDE
  {
    id: 'BEST_SAUDE',
    nome: 'BEST SAÚDE',
    nomeExibicao: '5. BEST SAÚDE',
    badge: 'BS',
    categoria: 'Privado',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'PA: atende.',
      internacao: 'Atende internação e cirurgias eletivas.'
    },
    consultaEletiva: 'Atende consultas eletivas.',
    psAdulto: 'Pacote 10101039 - Consulta em Pronto-Socorro, incluindo pequenos procedimentos de PS, laboratório simples com valor unitário até R$ 50,00, ECG e Raio-X. Em dúvida, autorizar os procedimentos.',
    psInfantil: '10101039.',
    uti: '90000044 (Diária Isolamento UTI Adulto Geral); 90000045 (Diária Compacta UTI Adulto Geral); 90000046 (Diária Compacta UTI Neonatal). Se não aparecer, utilizar o código disponível no site. Solicitar também 10104011 (1x) e 10104020 (2x).',
    oftalmologia: 'Sem informação confirmada na planilha.',
    laboratorio: 'Atende exames laboratoriais.',
    mamografia: 'Atende.',
    quimioterapia: 'Atende.',
    hemodialise: 'Não consta em contrato; verificar com Erichson.',
    ambulancia: 'Enviar mensagem para CARE MED - Telefone: (63) 3322-1423.',
    observacoesGerais: [
      'PS Adulto: pacote 10101039 inclui laboratório até R$ 50, ECG e Raio-X.',
      'Colonoscopia, Reto e Endoscopia: pegar autorização em nome da Clínica do Dr. Renato.',
      'Hemodiálise: verificar com Erichson antes.',
      'Ambulância: CARE MED (63) 3322-1423.'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende.' },
      tc: { status: 'ATENDE', descricao: 'Atende.' },
      raioX: { status: 'ATENDE', descricao: 'Atende (incluso no pacote do PS).' },
      colonoscopia: { status: 'ATENDE', descricao: 'Pegar autorização em nome da Clínica do Dr. Renato.' },
      retossigmoidoscopia: { status: 'ATENDE', descricao: 'Pegar autorização em nome da Clínica do Dr. Renato.' },
      endoscopia: { status: 'ATENDE', descricao: 'Pegar autorização em nome da Clínica do Dr. Renato.' },
      usg: { status: 'ATENDE', descricao: 'Atende.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 6. BRADESCO
  {
    id: 'BRADESCO',
    nome: 'BRADESCO SAÚDE',
    nomeExibicao: '6. BRADESCO',
    badge: 'BR',
    categoria: 'Seguradora',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Código 446912 / 84000406 - Atendimento em Pronto-Socorro Adulto.',
      internacao: 'Atende internação clínica e cirúrgica.'
    },
    consultaEletiva: 'Cardiologia, Cirurgia Oncológica, Clínica Médica, Gastroenterologia, Endocrinologia, Ortopedia e Traumatologia, Cirurgia Plástica, Neurocirurgia e Cirurgia Pediátrica. Referência 87402.',
    psAdulto: 'Pacote 84000406 para Clínica Médica, Ortopedia/Traumatologia e Pediatria.',
    psInfantil: 'Pacote 84000147.',
    uti: 'Marcar opção UTI e acrescentar 10104011 (1x) e 10104020 (2x).',
    oftalmologia: 'Não atende.',
    laboratorio: 'Pacote no PS. Na internação não precisa autorização. Eletivo pela Orizon. Não realizar exames laboratoriais no Santa Thereza.',
    mamografia: 'Atende.',
    quimioterapia: 'Atende. Medicamentos especiais/quimioterápicos: quando não há acordo, como exemplo citado Pirtobrutinibe, NÃO liberar dispensação.',
    hemodialise: 'Atende com autorização.',
    ambulancia: 'Não tem ambulância.',
    observacoesGerais: [
      'ATENÇÃO: Plano FLEX NÃO ATENDE.',
      'RM: Código do contrato para Urgência: 0000417815; Código do contrato para Eletivo: 0000810479.',
      'TC e Raio-X: pacote no PS. Não atender TC ou Raio-X no eletivo pela planilha 2.',
      'Endoscopia: atende somente eletivo. Código: 84231254 | Código do contratado: 000810479 (exclusivo Orizon).',
      'Colonoscopia: atende pelo código 40201082 (exclusivo Orizon). Reto: não atende.',
      'USG: atender no Diagnóstico utilizando o código do pacote de consulta do PS.',
      'ECO: não credenciado / sem informação.'
    ],
    codigosContrato: {
      urgencia: '0000417815',
      eletivo: '0000810479',
      especificos: [
        { titulo: 'RM Contrato Urgência', codigo: '0000417815' },
        { titulo: 'RM Contrato Eletivo', codigo: '0000810479' },
        { titulo: 'PS Adulto Pacote', codigo: '84000406' },
        { titulo: 'PS Infantil Pacote', codigo: '84000147' },
        { titulo: 'Colonoscopia Código', codigo: '40201082' },
        { titulo: 'Endoscopia Código', codigo: '84231254' },
        { titulo: 'Endoscopia Código Contratado', codigo: '000810479' }
      ]
    },
    exames: {
      rm: { 
        status: 'COM_ESPECIFICIDADE', 
        descricao: 'Atende com especificidade: código do contrato para Urgência: 0000417815; código do contrato para Eletivo: 0000810479.',
        codigo: '0000417815 / 0000810479'
      },
      tc: { status: 'PACOTE_PS', descricao: 'Pacote no PS. Não atender no eletivo.' },
      raioX: { status: 'PACOTE_PS', descricao: 'Pacote no PS. Não atender no eletivo.' },
      colonoscopia: { status: 'ATENDE', descricao: 'Atende. Código: 40201082 (solicitar exclusivamente pela Orizon e executar).', codigo: '40201082' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { 
        status: 'SOMENTE_ELETIVO', 
        descricao: 'Atende somente eletivo. Código da Endoscopia: 84231254. Código do contratado: 000810479 (exclusivo Orizon).', 
        codigo: '84231254' 
      },
      usg: { status: 'ATENDE', descricao: 'Atender no Diagnóstico utilizando o código do pacote de consulta do PS.' },
      eco: { status: 'NAO_ATENDE', descricao: 'ECO não credenciado. Sem informação registrada na Planilha 2.' }
    }
  },

  // 7. BRASIL MED
  {
    id: 'BRASIL_MED',
    nome: 'BRASIL MED',
    nomeExibicao: '7. BRASIL MED',
    badge: 'BM',
    categoria: 'Privado',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Não atende.',
      internacao: 'Não atende internação.'
    },
    consultaEletiva: 'Não atende consulta eletiva.',
    psAdulto: 'Atende, valor indicado de R$ 150,00 pago ao hospital.',
    psInfantil: 'Atende, valor indicado de R$ 150,00 pago ao hospital.',
    uti: 'Não atende UTI.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Não atende.',
    mamografia: 'Não atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Não possui serviço.',
    observacoesGerais: [
      'Atende SOMENTE PS Adulto e Infantil (valor fixo R$ 150,00 pago ao hospital).',
      'Não atende internação, UTI, consultas eletivas ou exames.'
    ],
    exames: {
      rm: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na Planilha 2 / Não atende.' },
      tc: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na Planilha 2 / Não atende.' },
      raioX: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na Planilha 2 / Não atende.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      eco: { status: 'NAO_ATENDE', descricao: 'Não atende.' }
    }
  },

  // 8. CAPESESP
  {
    id: 'CAPESESP',
    nome: 'CAPESESP',
    nomeExibicao: '8. CAPESESP',
    badge: 'CP',
    categoria: 'Autogestão',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Atende.',
      internacao: 'Não atende internação.'
    },
    consultaEletiva: 'Atende consultas eletivas.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Atende UTI.',
    oftalmologia: 'Atende oftalmologia.',
    laboratorio: 'Sim, atende laboratório.',
    mamografia: 'Atende.',
    quimioterapia: 'Não atende quimioterapia.',
    hemodialise: 'Não atende.',
    ambulancia: 'Não possui serviço; cobrar particular e, se UTI, acionar CARE MED e informar Priscila.',
    observacoesGerais: [
      'Internação geral: não atende (apenas UTI atende).',
      'RM, TC e Raio-X: atende.',
      'Ambulância UTI: CARE MED e avisar Priscila.'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende.' },
      tc: { status: 'ATENDE', descricao: 'Atende.' },
      raioX: { status: 'ATENDE', descricao: 'Atende.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na Planilha 2. Perguntar para Priscila.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na Planilha 2. Perguntar para Priscila.' }
    }
  },

  // 9. CASSI
  {
    id: 'CASSI',
    nome: 'CASSI (Banco do Brasil)',
    nomeExibicao: '9. CASSI',
    badge: 'CS',
    categoria: 'Autogestão',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Atende.',
      internacao: 'Não atende internação no HPM segundo Planilha 1.'
    },
    consultaEletiva: 'Atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Atende UTI.',
    oftalmologia: 'Atende oftalmologia.',
    laboratorio: 'Sim, atende laboratório.',
    mamografia: 'Atende mamografia.',
    quimioterapia: 'Atende quimioterapia.',
    hemodialise: 'Atende.',
    ambulancia: 'Contatos CASSI: 0800 729 0080 / 4004-4550 / 0800 729 0090.',
    observacoesGerais: [
      'RM: atende.',
      'TC e Raio-X: sem informação registrada na Planilha 2 (consultar Priscila).',
      'Colonoscopia, Reto e Endoscopia: não atende.',
      'Telefones úteis: 0800 729 0080 / 4004-4550 / 0800 729 0090.'
    ],
    contatosUteis: [
      'Central CASSI: 0800 729 0080',
      'Autorizações CASSI: 0800 729 0090',
      'Suporte Orizon: 4004-4550'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende.' },
      tc: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na Planilha 2. Perguntar para Priscila.' },
      raioX: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na Planilha 2. Perguntar para Priscila.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'ATENDE', descricao: 'Atende (conforme Planilha 1). Planilha 2 sem informação.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada. Perguntar para Priscila.' }
    }
  },

  // 10. CLÍNICA AMOR SAÚDE / CARTÃO DE TODOS
  {
    id: 'AMOR_SAUDE',
    nome: 'CLÍNICA AMOR SAÚDE / CARTÃO DE TODOS',
    nomeExibicao: '10. CLÍNICA AMOR SAÚDE',
    badge: 'AS',
    categoria: 'Clínica / Cartão',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Não atende.',
      internacao: 'Não atende internação.'
    },
    consultaEletiva: 'Não atende consulta eletiva pelo convênio.',
    psAdulto: 'Não atende PS.',
    psInfantil: 'Não atende PS.',
    uti: 'Não atende UTI.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Não atende laboratório.',
    mamografia: 'Não atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Não possui serviço.',
    observacoesGerais: [
      'Não atende internação, consulta eletiva ou PS.',
      'RM, TC e Raio-X: atende.',
      'Colonoscopia, Reto, Endoscopia e USG: pode realizar, porém COBRAR DO PACIENTE (tabela Amor Saúde).'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende.' },
      tc: { status: 'ATENDE', descricao: 'Atende.' },
      raioX: { status: 'ATENDE', descricao: 'Atende.' },
      colonoscopia: { status: 'PARTICULAR', descricao: 'Pode realizar, porém cobrar do paciente (tabela Amor Saúde).' },
      retossigmoidoscopia: { status: 'PARTICULAR', descricao: 'Pode realizar, porém cobrar do paciente.' },
      endoscopia: { status: 'PARTICULAR', descricao: 'Pode realizar, porém cobrar do paciente.' },
      usg: { status: 'PARTICULAR', descricao: 'Pode realizar, porém cobrar do paciente. Planilha 2: não atende faturado.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na Planilha 2. Perguntar para Priscila.' }
    }
  },

  // 11. CLÍNICA DA CIDADE
  {
    id: 'CLINICA_CIDADE',
    nome: 'CLÍNICA DA CIDADE',
    nomeExibicao: '11. CLÍNICA DA CIDADE',
    badge: 'CC',
    categoria: 'Clínica / Cartão',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Não atende.',
      internacao: 'Não atende internação.'
    },
    consultaEletiva: 'Não atende.',
    psAdulto: 'Não atende.',
    psInfantil: 'Não atende.',
    uti: 'Não atende.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Não atende laboratório.',
    mamografia: 'Não atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Não possui serviço.',
    observacoesGerais: [
      'Não atende internação, consulta eletiva ou PS.',
      'RM, TC e Raio-X: atende.',
      'Colonoscopia, Reto e Endoscopia: não atende.'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende.' },
      tc: { status: 'ATENDE', descricao: 'Atende.' },
      raioX: { status: 'ATENDE', descricao: 'Atende.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 12. CONAB
  {
    id: 'CONAB',
    nome: 'CONAB',
    nomeExibicao: '12. CONAB',
    badge: 'CN',
    categoria: 'Autogestão',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Atende.',
      internacao: 'Atende internação.'
    },
    consultaEletiva: 'Não atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Atende UTI.',
    oftalmologia: 'Informação não confirmada.',
    laboratorio: 'Atende laboratório.',
    mamografia: 'Atende mamografia.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Telefones e e-mail CONAB: (63) 3228-8412 / 3228-8433 / to.seade@conab.gov.br.',
    observacoesGerais: [
      'Internação e PS Adulto/Infantil: atende.',
      'RM, TC e Raio-X: atende.',
      'ECO / Parecer / Risco: somente internado e com autorização prévia; particular deve pagar.',
      'Colonoscopia, Reto, Endoscopia e USG: não atende.'
    ],
    contatosUteis: [
      'CONAB Tocantins: (63) 3228-8412',
      'CONAB Ramal: (63) 3228-8433',
      'E-mail: to.seade@conab.gov.br'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende.' },
      tc: { status: 'ATENDE', descricao: 'Atende.' },
      raioX: { status: 'ATENDE', descricao: 'Atende.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      eco: { status: 'SOMENTE_URGENCIA', descricao: 'ECO / Parecer / Risco: somente internado e com autorização prévia; particular deve pagar.' }
    }
  },

  // 13. CORREIOS / POSTAL SAÚDE
  {
    id: 'CORREIOS',
    nome: 'CORREIOS / POSTAL SAÚDE',
    nomeExibicao: '13. CORREIOS / POSTAL SAÚDE',
    badge: 'CR',
    categoria: 'Autogestão',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Atende.',
      internacao: 'Não atende internação no HPM segundo Planilha 1.'
    },
    consultaEletiva: 'Atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Atende.',
    oftalmologia: 'Atende oftalmologia.',
    laboratorio: 'Sim, atende laboratório.',
    mamografia: 'Atende mamografia.',
    quimioterapia: 'Atende quimioterapia.',
    hemodialise: 'Atende.',
    ambulancia: 'Solicitar em centralderemocao@postalsaude.com.br, telefone (63) 3213-4000 ou 0800 888 8116, atendimento 24h/7 dias.',
    observacoesGerais: [
      'PS e Consulta Eletiva: atende.',
      'Raio-X: incluso no pacote PS.',
      'RM: atende.',
      'TC e Raio-X no eletivo: sem informação na Planilha 2 (consultar Priscila).',
      'Ambulância Postal: 0800 888 8116 / (63) 3213-4000 / centralderemocao@postalsaude.com.br.'
    ],
    contatosUteis: [
      'Central Postal Saúde: 0800 888 8116',
      'Remoção Postal Saúde: (63) 3213-4000',
      'E-mail Remoção: centralderemocao@postalsaude.com.br'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende.' },
      tc: { status: 'SEM_INFORMACAO', descricao: 'Planilha 1: atende. Planilha 2: sem informação registrada. Confirmar com Priscila.' },
      raioX: { status: 'PACOTE_PS', descricao: 'Incluso no pacote do PS. Planilha 2: sem informação registrada fora do PS.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada. Perguntar para Priscila.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada. Perguntar para Priscila.' }
    }
  },

  // 14. E-VIDA / ELETRONORTE
  {
    id: 'E_VIDA',
    nome: 'E-VIDA / ELETRONORTE',
    nomeExibicao: '14. E-VIDA / ELETRONORTE',
    badge: 'EV',
    categoria: 'Autogestão',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'PA Santa Thereza atende.',
      internacao: 'Atende internação.'
    },
    consultaEletiva: 'Atende consultas eletivas.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Atende UTI.',
    oftalmologia: 'Atende.',
    laboratorio: 'Sim, atende laboratório.',
    mamografia: 'Atende.',
    quimioterapia: 'Atende quimioterapia.',
    hemodialise: 'Atende.',
    ambulancia: 'Cobrar particular; em UTI acionar CARE MED e informar Priscila.',
    observacoesGerais: [
      'Santa Thereza PA, Internação, Consulta Eletiva e PS Adulto: atende.',
      'RM, TC e Raio-X: atende.',
      'Colonoscopia, Reto e Endoscopia: não atende.',
      'USG e ECO: sem informação registrada na planilha (consultar Priscila).'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende.' },
      tc: { status: 'ATENDE', descricao: 'Atende.' },
      raioX: { status: 'ATENDE', descricao: 'Atende.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 15. FUSEX
  {
    id: 'FUSEX',
    nome: 'FUSEX (Exército Brasileiro)',
    nomeExibicao: '15. FUSEX',
    badge: 'FX',
    categoria: 'Militar',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'PA atende.',
      internacao: 'Internação atende.'
    },
    consultaEletiva: 'Atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Atende UTI.',
    oftalmologia: 'Atende oftalmologia.',
    laboratorio: 'Atende laboratório.',
    mamografia: 'Atende mamografia.',
    quimioterapia: 'Atende quimioterapia.',
    hemodialise: 'Atende, com autorização prévia.',
    ambulancia: 'E-mail: fusexpalmasinternacao@gmail.com. Informar Betânia: (63) 98136-6947 ou (62) 9952-5247. CARE MED é credenciada.',
    observacoesGerais: [
      'PA, internação, consulta eletiva, PS Adulto/Infantil e UTI: atende.',
      'RM, TC e Raio-X: atende.',
      'USG: atende; eletivo vem com guia autorizada.',
      'Colonoscopia, Reto e Endoscopia: não atende.',
      'Ambulância credenciada: CARE MED (avisar Betânia).'
    ],
    contatosUteis: [
      'FUSEX Internação: fusexpalmasinternacao@gmail.com',
      'Betânia FUSEX: (63) 98136-6947',
      'Betânia Plantão: (62) 9952-5247'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende.' },
      tc: { status: 'ATENDE', descricao: 'Atende.' },
      raioX: { status: 'ATENDE', descricao: 'Atende.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'ATENDE', descricao: 'Atende; eletivo vem com guia autorizada.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na Planilha 2. Perguntar para Priscila.' }
    }
  },

  // 16. GAMA SAÚDE
  {
    id: 'GAMA_SAUDE',
    nome: 'GAMA SAÚDE',
    nomeExibicao: '16. GAMA SAÚDE',
    badge: 'GM',
    categoria: 'Seguradora',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Não.',
      internacao: 'Não atende internação.'
    },
    consultaEletiva: 'Atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Não consta em contrato.',
    uti: 'NÃO ATENDER; não consta em contrato.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Sim, atende laboratório.',
    mamografia: 'Não atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Particular; em caso de UTI acionar CARE MED.',
    observacoesGerais: [
      'ALERTA CRÍTICO: NÃO CONSTA DIÁRIA DE UTI EM CONTRATO. Proibido internar em UTI.',
      'PS Infantil: NÃO CONSTA EM CONTRATO.',
      'Colonoscopia, Reto e Endoscopia: equipe do Dr. Renato NÃO atende.',
      'USG: atende.'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende.' },
      tc: { status: 'ATENDE', descricao: 'Atende.' },
      raioX: { status: 'ATENDE', descricao: 'Atende.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende (equipe do Dr. Renato não atende).' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende (equipe do Dr. Renato não atende).' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende (equipe do Dr. Renato não atende).' },
      usg: { status: 'ATENDE', descricao: 'Atende.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 17. GEAP
  {
    id: 'GEAP',
    nome: 'GEAP SAÚDE',
    nomeExibicao: '17. GEAP',
    badge: 'GP',
    categoria: 'Autogestão',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Atende.',
      internacao: 'Internação atende.'
    },
    consultaEletiva: 'Atende consulta eletiva.',
    psAdulto: 'Código: 98910094.',
    psInfantil: 'Código: 98910043, NÃO precisa autorização.',
    uti: 'UTI Pediátrica: NÃO ATENDE; UTI Neonatal: ATENDE.',
    oftalmologia: 'Atende oftalmologia.',
    laboratorio: 'Atende com autorização.',
    mamografia: 'Atende.',
    quimioterapia: 'Atende.',
    hemodialise: 'Atende.',
    ambulancia: 'CARE MED. No Plano BASE, a remoção é pela LISS CARE.',
    observacoesGerais: [
      'PS Adulto: código 98910094.',
      'PS Infantil: código 98910043 (não precisa autorização prévia).',
      'UTI Pediátrica: NÃO atende. UTI Neonatal e Adulto: atende.',
      'RM, TC e Raio-X: atende com autorização.',
      'Remoção Plano BASE: LISS CARE. Demais planos: CARE MED.',
      'Há indicação na planilha de novos códigos de diárias.'
    ],
    codigosContrato: {
      especificos: [
        { titulo: 'PS Adulto Código', codigo: '98910094' },
        { titulo: 'PS Infantil Código', codigo: '98910043' }
      ]
    },
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende com autorização.' },
      tc: { status: 'ATENDE', descricao: 'Atende com autorização.' },
      raioX: { status: 'ATENDE', descricao: 'Atende com autorização.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na Planilha 2. Perguntar para Priscila.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na Planilha 2. Perguntar para Priscila.' }
    }
  },

  // 18. GOLDEN CROSS
  {
    id: 'GOLDEN_CROSS',
    nome: 'GOLDEN CROSS',
    nomeExibicao: '18. GOLDEN CROSS',
    badge: 'GC',
    categoria: 'Seguradora',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Não.',
      internacao: 'Não atende internação.'
    },
    consultaEletiva: 'Não atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Não atende.',
    uti: 'Não atende.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Não atende.',
    mamografia: 'Não atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Particular; se for UTI, CARE MED.',
    observacoesGerais: [
      'Atende SOMENTE PS Adulto.',
      'Internação, consulta eletiva, laboratório e procedimentos: não atende.',
      'RM, TC e Raio-X: sem informação registrada na planilha (consultar Priscila).'
    ],
    exames: {
      rm: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada. Perguntar para Priscila.' },
      tc: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada. Perguntar para Priscila.' },
      raioX: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada. Perguntar para Priscila.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 19. IDEAL SAÚDE
  {
    id: 'IDEAL_SAUDE',
    nome: 'IDEAL SAÚDE',
    nomeExibicao: '19. IDEAL SAÚDE',
    badge: 'ID',
    categoria: 'Privado',
    situacao: 'SUSPENSO',
    santaThereza: {
      prontoAtendimento: 'Consta como suspenso.',
      internacao: 'Não atende internação.'
    },
    consultaEletiva: 'Consta como suspenso.',
    psAdulto: 'Consta como suspenso.',
    psInfantil: 'Consta como suspenso.',
    uti: 'Não atende.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Não atende.',
    mamografia: 'Não atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Não possui serviço.',
    observacoesGerais: [
      'ALERTA CRÍTICO: CONVÊNIO CONSTA COMO SUSPENSO NA PLANILHA.',
      'Não realizar atendimentos sem autorização prévia da diretoria/Priscila.',
      'USG: pegar autorização primeiro antes de agendar.'
    ],
    exames: {
      rm: { status: 'SUSPENSO', descricao: 'Atende quando ativo, porém convênio consta como SUSPENSO.' },
      tc: { status: 'SUSPENSO', descricao: 'Atende quando ativo, porém convênio consta como SUSPENSO.' },
      raioX: { status: 'SUSPENSO', descricao: 'Atende quando ativo, porém convênio consta como SUSPENSO.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'COM_ESPECIFICIDADE', descricao: 'Pegar autorização primeiro antes de agendar (se liberado da suspensão).' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 20. INFRAERO
  {
    id: 'INFRAERO',
    nome: 'INFRAERO',
    nomeExibicao: '20. INFRAERO',
    badge: 'IN',
    categoria: 'Público',
    situacao: 'DESCREDENCIADO',
    santaThereza: {
      prontoAtendimento: 'Descredenciado.',
      internacao: 'Descredenciado.'
    },
    consultaEletiva: 'Descredenciado.',
    psAdulto: 'PS Adulto consta como OK na planilha, porém o próprio registro informa expressamente: "DESCREDENCIADO".',
    psInfantil: 'Descredenciado.',
    uti: 'Descredenciado.',
    oftalmologia: 'Descredenciado.',
    laboratorio: 'Descredenciado.',
    mamografia: 'Descredenciado.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Não atende.',
    observacoesGerais: [
      'SITUAÇÃO GERAL: DESCREDENCIADO.',
      'Apesar de constar OK para PS Adulto em uma coluna, o texto oficial esclarece que o plano está descredenciado.',
      'Cobrar atendimento como Particular ou encaminhar para outro serviço.'
    ],
    exames: {
      rm: { status: 'SEM_INFORMACAO', descricao: 'Descredenciado. Sem informação registrada na Planilha 2.' },
      tc: { status: 'SEM_INFORMACAO', descricao: 'Descredenciado. Sem informação registrada na Planilha 2.' },
      raioX: { status: 'SEM_INFORMACAO', descricao: 'Descredenciado. Sem informação registrada na Planilha 2.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha.' }
    }
  },

  // 21. IPASGU
  {
    id: 'IPASGU',
    nome: 'IPASGU',
    nomeExibicao: '21. IPASGU',
    badge: 'IP',
    categoria: 'Estadual / Regional',
    situacao: 'SUSPENSO',
    santaThereza: {
      prontoAtendimento: 'Suspenso.',
      internacao: 'Não atende / suspenso.'
    },
    consultaEletiva: 'Aparece como OK na planilha, porém SUSPENSO.',
    psAdulto: 'Aparece como OK, porém SUSPENSO. Verificar coparticipação.',
    psInfantil: 'Aparece como OK, porém SUSPENSO. Verificar coparticipação.',
    uti: 'SUSPENSA e o convênio NÃO cobre UTI.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Consta sim, porém SUSPENSO.',
    mamografia: 'Suspenso.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Suspensa.',
    ambulancia: 'Cobrar qualquer tipo de remoção.',
    observacoesGerais: [
      'SITUAÇÃO GERAL REGISTRADA: SUSPENSO.',
      'NÃO REALIZAR SEM CONFIRMAR A SUSPENSÃO COM A DIRETORIA / PRISCILA.',
      'PS e TC/Raio-X: verificar coparticipação (suspensos).',
      'UTI: suspensa e o convênio não tem cobertura para UTI.',
      'Remoção: cobrar qualquer tipo de remoção.'
    ],
    exames: {
      rm: { status: 'SUSPENSO', descricao: 'Sem informação registrada nesta planilha / Suspenso.' },
      tc: { status: 'SUSPENSO', descricao: 'Verificar coparticipação; suspenso.' },
      raioX: { status: 'SUSPENSO', descricao: 'Verificar coparticipação; suspenso.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'SUSPENSO', descricao: 'Suspenso.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada.' }
    }
  },

  // 22. LIFE EMPRESARIAL
  {
    id: 'LIFE_EMPRESARIAL',
    nome: 'LIFE EMPRESARIAL',
    nomeExibicao: '22. LIFE EMPRESARIAL',
    badge: 'LE',
    categoria: 'Privado',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Atende.',
      internacao: 'Não atende internação.'
    },
    consultaEletiva: 'Atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Não consta.',
    uti: 'Não atende.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Sim, atende laboratório.',
    mamografia: 'Atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Particular; UTI via CARE MED.',
    observacoesGerais: [
      'Internação: não atende.',
      'Consulta Eletiva e PS Adulto: atende.',
      'RM, TC e Raio-X: atende.',
      'USG: atende.',
      'Colonoscopia, Reto e Endoscopia: não atende.'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende.' },
      tc: { status: 'ATENDE', descricao: 'Atende.' },
      raioX: { status: 'ATENDE', descricao: 'Atende.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'ATENDE', descricao: 'Atende.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 23. MARINHA
  {
    id: 'MARINHA',
    nome: 'MARINHA DO BRASIL',
    nomeExibicao: '23. MARINHA',
    badge: 'MB',
    categoria: 'Militar',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Atende.',
      internacao: 'Não atende internação geral.'
    },
    consultaEletiva: 'Atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Atende UTI.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Sim, atende laboratório.',
    mamografia: 'Atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Solicitar à CARE MED.',
    observacoesGerais: [
      'Consulta eletiva, PS Adulto/Infantil e UTI: atende.',
      'TC: atende.',
      'RM: aguardando retorno.',
      'Colonoscopia, Reto e Endoscopia: não atende.',
      'Ambulância: solicitar à CARE MED.'
    ],
    exames: {
      rm: { status: 'AGUARDANDO_RETORNO', descricao: 'Aguardando retorno da operadora.' },
      tc: { status: 'ATENDE', descricao: 'Atende.' },
      raioX: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na Planilha 2. Perguntar para Priscila.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 24. MED PREV
  {
    id: 'MED_PREV',
    nome: 'MED PREV',
    nomeExibicao: '24. MED PREV',
    badge: 'MP',
    categoria: 'Clínica / Cartão',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Não.',
      internacao: 'Não atende internação.'
    },
    consultaEletiva: 'Consulta eletiva Medical: verificar com o médico; Medical não atende direto.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Não atende UTI.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Sim, atende laboratório.',
    mamografia: 'Atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Não possui serviço.',
    observacoesGerais: [
      'RM, TC e Raio-X: atende, PORÉM DEVE APRESENTAR GUIA ORIGINAL.',
      'Colonoscopia, Reto, Endoscopia e USG: atende.',
      'Internação: não atende.'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende, mas deve apresentar guia original do paciente.' },
      tc: { status: 'ATENDE', descricao: 'Atende, mas deve apresentar guia original do paciente.' },
      raioX: { status: 'ATENDE', descricao: 'Atende, mas deve apresentar guia original do paciente.' },
      colonoscopia: { status: 'ATENDE', descricao: 'Atende.' },
      retossigmoidoscopia: { status: 'ATENDE', descricao: 'Atende.' },
      endoscopia: { status: 'ATENDE', descricao: 'Atende.' },
      usg: { status: 'ATENDE', descricao: 'Atende.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 25. MED SERVICE
  {
    id: 'MED_SERVICE',
    nome: 'MED SERVICE',
    nomeExibicao: '25. MED SERVICE',
    badge: 'MS',
    categoria: 'Privado',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Não.',
      internacao: 'Atende internação.'
    },
    consultaEletiva: 'Não atende consulta eletiva.',
    psAdulto: 'Não atende PS Adulto.',
    psInfantil: 'Não atende PS Infantil.',
    uti: 'Atende.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Não atende.',
    mamografia: 'Não atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Particular; UTI via CARE MED.',
    observacoesGerais: [
      'Atende SOMENTE Internação.',
      'Não atende PS, consultas eletivas, laboratório ou oftalmologia.',
      'RM, TC e Raio-X: sem informação registrada na Planilha 2 (consultar Priscila).'
    ],
    exames: {
      rm: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' },
      tc: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' },
      raioX: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 26. NOTREDAME
  {
    id: 'NOTREDAME',
    nome: 'NOTREDAME INTERMÉDICA',
    nomeExibicao: '26. NOTREDAME',
    badge: 'ND',
    categoria: 'Seguradora',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Atende.',
      internacao: 'Não atende internação.'
    },
    consultaEletiva: 'Atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Não atende.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Atende laboratório.',
    mamografia: 'Atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Particular; UTI via CARE MED.',
    observacoesGerais: [
      'Consulta eletiva, PS Adulto e Infantil: atende.',
      'TC: atende.',
      'RM: aguardando retorno da operadora.',
      'Raio-X: sem informação registrada na Planilha 2 (consultar Priscila).',
      'Internação: não atende.'
    ],
    exames: {
      rm: { status: 'AGUARDANDO_RETORNO', descricao: 'Aguardando retorno da operadora.' },
      tc: { status: 'ATENDE', descricao: 'Atende.' },
      raioX: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na Planilha 2. Perguntar para Priscila.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 27. OMINT
  {
    id: 'OMINT',
    nome: 'OMINT',
    nomeExibicao: '27. OMINT',
    badge: 'OM',
    categoria: 'Seguradora',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Atende.',
      internacao: 'Não atende internação.'
    },
    consultaEletiva: 'Não atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Não atende.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Sim, atende laboratório.',
    mamografia: 'Atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Particular; se UTI, CARE MED.',
    observacoesGerais: [
      'Atende PS Adulto e Infantil.',
      'USG: atende.',
      'RM, TC e Raio-X: sem informação registrada na Planilha 2 (não atende na Planilha 1).',
      'Internação e consulta eletiva: não atende.'
    ],
    exames: {
      rm: { status: 'NAO_ATENDE', descricao: 'Não atende (Planilha 1). Planilha 2: sem informação registrada.' },
      tc: { status: 'NAO_ATENDE', descricao: 'Não atende (Planilha 1). Planilha 2: sem informação registrada.' },
      raioX: { status: 'NAO_ATENDE', descricao: 'Não atende (Planilha 1). Planilha 2: sem informação registrada.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'ATENDE', descricao: 'Atende.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 28. PETROBRÁS
  {
    id: 'PETROBRAS',
    nome: 'PETROBRÁS / AMS',
    nomeExibicao: '28. PETROBRÁS',
    badge: 'PB',
    categoria: 'Autogestão',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Atende.',
      internacao: 'Não atende internação.'
    },
    consultaEletiva: 'Atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Atende.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Atende laboratório.',
    mamografia: 'Atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Particular; UTI via CARE MED.',
    observacoesGerais: [
      'Consulta eletiva, PS Adulto e Infantil: atende.',
      'RM, TC e Raio-X: atende na Planilha 1. Planilha 2 sem informação registrada (consultar Priscila).',
      'USG: atende.',
      'Internação: não atende.'
    ],
    exames: {
      rm: { status: 'SEM_INFORMACAO', descricao: 'Planilha 1: atende. Planilha 2: sem informação registrada. Confirmar com Priscila.' },
      tc: { status: 'SEM_INFORMACAO', descricao: 'Planilha 1: atende. Planilha 2: sem informação registrada. Confirmar com Priscila.' },
      raioX: { status: 'SEM_INFORMACAO', descricao: 'Planilha 1: atende. Planilha 2: sem informação registrada. Confirmar com Priscila.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'ATENDE', descricao: 'Atende.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 29. PLAN ASSISTE
  {
    id: 'PLAN_ASSISTE',
    nome: 'PLAN ASSISTE (Ministério Público Federal)',
    nomeExibicao: '29. PLAN ASSISTE',
    badge: 'PA',
    categoria: 'Autogestão',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Atende.',
      internacao: 'Atende internação.'
    },
    consultaEletiva: 'Atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Atende.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Sim, atende laboratório.',
    mamografia: 'Atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Remoção: solicitar pelos telefones (61) 3105-6634 / 6632 / 6670 / (61) 99297-8659, segunda a sexta, ou 0800 591 5601. Em UTI, acionar LISS CARE pelo Medical.',
    observacoesGerais: [
      'ALERTA: A própria anotação contém indicação "SUSPENSO", portanto precisa ser confirmada antes do atendimento.',
      'Internação, consulta eletiva, PS Adulto e Infantil: atende quando ativo.',
      'RM: atende.',
      'TC e Raio-X: sem informação registrada na Planilha 2 (consultar Priscila).',
      'Remoção UTI: acionar LISS CARE pelo Medical.'
    ],
    contatosUteis: [
      'Remoção Plan Assiste: (61) 3105-6634 / 6632 / 6670',
      'Plantão Remoção: (61) 99297-8659',
      'Central 0800: 0800 591 5601'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende.' },
      tc: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na Planilha 2. Perguntar para Priscila.' },
      raioX: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na Planilha 2. Perguntar para Priscila.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 30. PREFEITURA MONTE SANTO
  {
    id: 'PREF_MONTE_SANTO',
    nome: 'PREFEITURA MONTE SANTO',
    nomeExibicao: '30. PREFEITURA MONTE SANTO',
    badge: 'MS',
    categoria: 'Público',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Não atende.',
      internacao: 'Não atende.'
    },
    consultaEletiva: 'Não atende.',
    psAdulto: 'Não atende.',
    psInfantil: 'Não atende.',
    uti: 'Não atende.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Não atende.',
    mamografia: 'Não atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Não atende.',
    observacoesGerais: [
      'Praticamente todos os atendimentos registrados como NÃO.',
      'RM e TC: constam como OK na Planilha 1.',
      'Não atende internação, consulta eletiva, PS, UTI, Raio-X, Oftalmologia, Laboratório, Mamografia, Colonoscopia, Reto, Endoscopia, USG, ECO, Quimioterapia, Hemodiálise ou Ambulância.'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Consta como OK na Planilha 1.' },
      tc: { status: 'ATENDE', descricao: 'Consta como OK na Planilha 1.' },
      raioX: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      eco: { status: 'NAO_ATENDE', descricao: 'Não atende.' }
    }
  },

  // 31. PRÓ-SOCIAL
  {
    id: 'PRO_SOCIAL',
    nome: 'PRÓ-SOCIAL (TRF 1ª Região)',
    nomeExibicao: '31. PRÓ-SOCIAL',
    badge: 'PS',
    categoria: 'Autogestão',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'PA Santa Thereza atende.',
      internacao: 'Internação Santa Thereza atende.'
    },
    consultaEletiva: 'Não atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Atende.',
    oftalmologia: 'Atende oftalmologia.',
    laboratorio: 'Sim, atende laboratório.',
    mamografia: 'Atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Solicitar autorização pelo site e acionar CARE MED.',
    observacoesGerais: [
      'Santa Thereza PA / Internação: atende.',
      'PS Adulto e Infantil: atende.',
      'RM: aguardando retorno da operadora.',
      'TC e Raio-X: sem informação registrada na Planilha 2 (consultar Priscila).',
      'Ambulância: autorizar no site e chamar CARE MED.'
    ],
    exames: {
      rm: { status: 'AGUARDANDO_RETORNO', descricao: 'Aguardando retorno da operadora.' },
      tc: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na Planilha 2. Perguntar para Priscila.' },
      raioX: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na Planilha 2. Perguntar para Priscila.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 32. PRÓ TOCANTINS / FA SAÚDE
  {
    id: 'PRO_TOCANTINS',
    nome: 'PRÓ TOCANTINS / FA SAÚDE',
    nomeExibicao: '32. PRÓ TOCANTINS / FA SAÚDE',
    badge: 'PT',
    categoria: 'Militar',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Atende.',
      internacao: 'Internação atende.'
    },
    consultaEletiva: 'Atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Atende UTI.',
    oftalmologia: 'Atende oftalmologia.',
    laboratorio: 'Sim, atende laboratório.',
    mamografia: 'Atende mamografia.',
    quimioterapia: 'Atende quimioterapia.',
    hemodialise: 'Atende hemodiálise.',
    ambulancia: 'Solicitar autorização, enviar e-mail e chamar CARE MED.',
    observacoesGerais: [
      'Internação, consulta eletiva e PS Adulto/Infantil: atende.',
      'RM, TC e Raio-X: atende.',
      'USG: atende.',
      'Colonoscopia, Reto e Endoscopia: não atende.',
      'Quimioterapia e Hemodiálise: atende.'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende.' },
      tc: { status: 'ATENDE', descricao: 'Atende.' },
      raioX: { status: 'ATENDE', descricao: 'Atende.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'ATENDE', descricao: 'Atende.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 33. SAÚDE PREMIER
  {
    id: 'SAUDE_PREMIER',
    nome: 'SAÚDE PREMIER',
    nomeExibicao: '33. SAÚDE PREMIER',
    badge: 'SP',
    categoria: 'Privado',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Não.',
      internacao: 'Não atende internação.'
    },
    consultaEletiva: 'Não atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Não atende.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Não atende.',
    mamografia: 'Não atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Não possui serviço.',
    observacoesGerais: [
      'Atende PS Adulto e Infantil.',
      'RM, TC e Raio-X: PODE REALIZAR, MAS COBRAR DO PACIENTE (particular).',
      'Internação, consultas e laboratório: não atende.'
    ],
    exames: {
      rm: { status: 'PARTICULAR', descricao: 'Pode realizar, mas cobrar do paciente (particular).' },
      tc: { status: 'PARTICULAR', descricao: 'Pode realizar, mas cobrar do paciente (particular).' },
      raioX: { status: 'PARTICULAR', descricao: 'Pode realizar, mas cobrar do paciente (particular).' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 34. SAÚDE CAIXA
  {
    id: 'SAUDE_CAIXA',
    nome: 'SAÚDE CAIXA',
    nomeExibicao: '34. SAÚDE CAIXA',
    badge: 'SC',
    categoria: 'Autogestão',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Atende.',
      internacao: 'Atende internação.'
    },
    consultaEletiva: 'Não atende consulta eletiva.',
    psAdulto: 'Pacote 98800124, incluindo Raio-X e ECG.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Atende UTI.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Não atende laboratório pelo convênio.',
    mamografia: 'Atende.',
    quimioterapia: 'Atende quimioterapia.',
    hemodialise: 'Atende.',
    ambulancia: 'Particular; em UTI acionar CARE MED.',
    observacoesGerais: [
      'Internação: atende.',
      'PS Adulto: pacote 98800124 (inclui Raio-X e ECG).',
      'RM: atende.',
      'TC e Raio-X: sem informação registrada nesta planilha (Planilha 2); solicitar autorização no pacote 98800124 no PS.',
      'USG: atende.'
    ],
    codigosContrato: {
      especificos: [
        { titulo: 'Pacote PS Adulto (Raio-X + ECG)', codigo: '98800124' }
      ]
    },
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende.' },
      tc: { status: 'SEM_INFORMACAO', descricao: 'Planilha 1: atende. Planilha 2: sem informação registrada. Confirmar com Priscila.' },
      raioX: { status: 'PACOTE_PS', descricao: 'Solicitar autorização no pacote 98800124 no PS.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'ATENDE', descricao: 'Atende.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 35. SEPACO
  {
    id: 'SEPACO',
    nome: 'SEPACO',
    nomeExibicao: '35. SEPACO',
    badge: 'SP',
    categoria: 'Autogestão',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Não.',
      internacao: 'Não atende internação.'
    },
    consultaEletiva: 'Não atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Não atende PS Infantil.',
    uti: 'Não atende.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Não atende.',
    mamografia: 'Não atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Particular; em UTI acionar CARE MED.',
    observacoesGerais: [
      'Atende SOMENTE PS Adulto.',
      'RM, TC, Raio-X e USG: SOMENTE NO PS.',
      'Internação, PS Infantil, consultas eletivas e laboratório: não atende.'
    ],
    exames: {
      rm: { status: 'PACOTE_PS', descricao: 'Somente no PS.' },
      tc: { status: 'PACOTE_PS', descricao: 'Somente no PS.' },
      raioX: { status: 'PACOTE_PS', descricao: 'Somente no PS.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'PACOTE_PS', descricao: 'Somente no PS.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 36. SERVIR
  {
    id: 'SERVIR',
    nome: 'SERVIR (Governo do Tocantins)',
    nomeExibicao: '36. SERVIR',
    badge: 'SR',
    categoria: 'Estadual / Regional',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Atende.',
      internacao: 'Atende internação (exclusivo Enfermaria).'
    },
    consultaEletiva: 'Atende consulta eletiva.',
    psAdulto: 'Pacote Pronto-Socorro.',
    psInfantil: 'Pacote Pronto-Socorro.',
    uti: 'Atende UTI (Pacote Global 60000999).',
    oftalmologia: 'Atende oftalmologia.',
    laboratorio: 'Sim, atende laboratório.',
    mamografia: 'Atende mamografia.',
    quimioterapia: 'Atende quimioterapia.',
    hemodialise: 'Atende com autorização.',
    ambulancia: 'Solicitar pelo e-mail remocaoservir@impactomedica.com.br e via WhatsApp à CARE MED.',
    observacoesGerais: [
      'PA, Internação e Consulta Eletiva: atende.',
      'PS Adulto/Infantil: atende por PACOTE.',
      'RM e Raio-X: atende por PACOTE (não precisa de autorização no site na urgência).',
      'TC: atende.',
      'USG: atende por PACOTE.',
      'ECO: atende.',
      'Colonoscopia: pacote 60201082.',
      'Reto: atende.',
      'Endoscopia: pacote 60201120.',
      'Ambulância Servir: remocaoservir@impactomedica.com.br e CARE MED.'
    ],
    codigosContrato: {
      especificos: [
        { titulo: 'Colonoscopia Pacote', codigo: '60201082' },
        { titulo: 'Endoscopia Pacote', codigo: '60201120' }
      ]
    },
    contatosUteis: [
      'Central SERVIR: 0800 911 4040',
      'E-mail Remoção: remocaoservir@impactomedica.com.br',
      'WhatsApp Remoção: CARE MED'
    ],
    exames: {
      rm: { status: 'PACOTE_PS', descricao: 'Atende por pacote.' },
      tc: { status: 'ATENDE', descricao: 'Atende.' },
      raioX: { status: 'PACOTE_PS', descricao: 'Atende por pacote.' },
      colonoscopia: { status: 'ATENDE', descricao: 'Atende (pacote 60201082).', codigo: '60201082' },
      retossigmoidoscopia: { status: 'ATENDE', descricao: 'Atende.' },
      endoscopia: { status: 'ATENDE', descricao: 'Atende (pacote 60201120).', codigo: '60201120' },
      usg: { status: 'PACOTE_PS', descricao: 'Atende por pacote.' },
      eco: { status: 'ATENDE', descricao: 'Atende.' }
    }
  },

  // 37. SUL AMÉRICA
  {
    id: 'SUL_AMERICA',
    nome: 'SUL AMÉRICA SAÚDE',
    nomeExibicao: '37. SUL AMÉRICA',
    badge: 'SA',
    categoria: 'Seguradora',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Não.',
      internacao: 'Não atende internação.'
    },
    consultaEletiva: 'Não atende consulta eletiva.',
    psAdulto: 'Pacote 64620107.',
    psInfantil: 'Pacote 64620107.',
    uti: 'Não atende.',
    oftalmologia: 'Atende oftalmologia.',
    laboratorio: 'Sim, atende laboratório; em internação não precisa autorização.',
    mamografia: 'Atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Particular; UTI via CARE MED.',
    observacoesGerais: [
      'PS Adulto/Infantil: pacote 64620107.',
      'RM, TC e Raio-X: atende pelo PACOTE PS 64620107 e atendimento eletivo permitido.',
      'USG: atende pelo Pacote PS 64620107.',
      'Colonoscopia, Reto e Endoscopia: não atende.',
      'Internação e consulta eletiva: não atende.'
    ],
    codigosContrato: {
      especificos: [
        { titulo: 'Pacote PS Sul América', codigo: '64620107' }
      ]
    },
    exames: {
      rm: { status: 'PACOTE_PS', descricao: 'Atende pelo Pacote PS 64620107 e atendimento eletivo permitido.', codigo: '64620107' },
      tc: { status: 'PACOTE_PS', descricao: 'Atende pelo Pacote PS 64620107 e atendimento eletivo permitido.', codigo: '64620107' },
      raioX: { status: 'PACOTE_PS', descricao: 'Atende pelo Pacote PS 64620107 e atendimento eletivo permitido.', codigo: '64620107' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'PACOTE_PS', descricao: 'Atende pelo Pacote PS 64620107.', codigo: '64620107' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 38. T.R.E.
  {
    id: 'TRE',
    nome: 'T.R.E. (Tribunal Regional Eleitoral)',
    nomeExibicao: '38. T.R.E.',
    badge: 'TR',
    categoria: 'Autogestão',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Atende.',
      internacao: 'Atende internação.'
    },
    consultaEletiva: 'Não atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Atende UTI.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Sim, atende laboratório.',
    mamografia: 'Atende mamografia.',
    quimioterapia: 'Atende quimioterapia.',
    hemodialise: 'Atende.',
    ambulancia: 'Solicitar para seben@tre-to.jus.br ou (63) 3229-9621, das 08h às 18h. À noite/finais de semana e em UTI, acionar CARE MED pelo Medical e informar Priscila.',
    observacoesGerais: [
      'Internação, PS Adulto e UTI: atende.',
      'RM, TC e Raio-X: atende.',
      'Mamografia e USG: atende.',
      'Colonoscopia, Reto e Endoscopia: não atende.',
      'Ambulância: seben@tre-to.jus.br / (63) 3229-9621 (08h às 18h); noturno/plantão acionar CARE MED e Priscila.'
    ],
    contatosUteis: [
      'Setor de Benefícios TRE-TO: seben@tre-to.jus.br',
      'Telefone TRE: (63) 3229-9621 (08h às 18h)',
      'Plantão Noturno / UTI: CARE MED (avisar Priscila)'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende.' },
      tc: { status: 'ATENDE', descricao: 'Atende.' },
      raioX: { status: 'ATENDE', descricao: 'Atende.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'ATENDE', descricao: 'Atende (conforme Planilha 1). Planilha 2: sem informação registrada.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 39. UNAFISCO
  {
    id: 'UNAFISCO',
    nome: 'UNAFISCO SAÚDE',
    nomeExibicao: '39. UNAFISCO',
    badge: 'UF',
    categoria: 'Autogestão',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Atende.',
      internacao: 'Não atende internação.'
    },
    consultaEletiva: 'Atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Atende UTI.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Não atende laboratório.',
    mamografia: 'Não atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Não atende.',
    observacoesGerais: [
      'Consulta eletiva, PS Adulto/Infantil e UTI: atende.',
      'RM, TC e Raio-X: atende.',
      'USG: atende.',
      'Mamografia, Colonoscopia, Reto e Endoscopia: não atende.',
      'ECO, Quimioterapia e Hemodiálise: não atende.',
      'Internação geral: não atende.'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende.' },
      tc: { status: 'ATENDE', descricao: 'Atende.' },
      raioX: { status: 'ATENDE', descricao: 'Atende.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'ATENDE', descricao: 'Atende.' },
      eco: { status: 'NAO_ATENDE', descricao: 'Não atende.' }
    }
  },

  // 40. VALE
  {
    id: 'VALE',
    nome: 'VALE (Pasa / Vale)',
    nomeExibicao: '40. VALE',
    badge: 'VL',
    categoria: 'Autogestão',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'PA atende.',
      internacao: 'Internação atende.'
    },
    consultaEletiva: 'Atende e NÃO precisa de autorização.',
    psAdulto: 'Código 98001620, incluindo ECG e laboratório.',
    psInfantil: 'Código 98001620, incluindo ECG e laboratório.',
    uti: 'Atende UTI.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Sim, com pacote no PS/UTI.',
    mamografia: 'Atende.',
    quimioterapia: 'Atende.',
    hemodialise: 'Atende.',
    ambulancia: 'Solicitar autorização pelo convênio e ligar 4004-0183 para informações. Solicitação também deve ser feita pelo site; códigos estão no POPs.',
    observacoesGerais: [
      'PA e Internação: atende.',
      'Consulta Eletiva: atende e não precisa autorização.',
      'PS Adulto / Infantil: código 98001620 (inclui ECG e laboratório).',
      'Retorno no PS: até 48 horas, para o mesmo CID.',
      'RM, TC e Raio-X: atende.',
      'Colonoscopia, Reto, Endoscopia e USG: atende.',
      'ECO: atende.',
      'Ambulância: autorizar no site e ligar 4004-0183.'
    ],
    codigosContrato: {
      especificos: [
        { titulo: 'PS Adulto/Infantil (c/ ECG e Lab)', codigo: '98001620' }
      ]
    },
    contatosUteis: [
      'Central PASA / Vale: 4004-0183',
      'Retorno no PS: até 48h (mesmo CID)'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende.' },
      tc: { status: 'ATENDE', descricao: 'Atende.' },
      raioX: { status: 'ATENDE', descricao: 'Atende.' },
      colonoscopia: { status: 'ATENDE', descricao: 'Atende.' },
      retossigmoidoscopia: { status: 'ATENDE', descricao: 'Atende.' },
      endoscopia: { status: 'ATENDE', descricao: 'Atende.' },
      usg: { status: 'ATENDE', descricao: 'Atende.' },
      eco: { status: 'ATENDE', descricao: 'Atende.' }
    }
  },

  // 41. VIGIMED
  {
    id: 'VIGIMED',
    nome: 'VIGIMED',
    nomeExibicao: '41. VIGIMED',
    badge: 'VG',
    categoria: 'Privado',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Não.',
      internacao: 'Não atende internação.'
    },
    consultaEletiva: 'Atende consulta eletiva.',
    psAdulto: 'Atende PS Adulto.',
    psInfantil: 'Atende PS Infantil.',
    uti: 'Não atende.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Não atende laboratório.',
    mamografia: 'Não atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Não possui serviço.',
    observacoesGerais: [
      'Consulta eletiva / PS Adulto / Infantil: atende.',
      'RM, TC e Raio-X: atende.',
      'USG: atende.',
      'Oftalmologia, Laboratório, Quimioterapia: não atende.',
      'Colonoscopia, Reto e Endoscopia: não atende.',
      'Internação: não atende.'
    ],
    exames: {
      rm: { status: 'ATENDE', descricao: 'Atende.' },
      tc: { status: 'ATENDE', descricao: 'Atende.' },
      raioX: { status: 'ATENDE', descricao: 'Atende.' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'ATENDE', descricao: 'Atende.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  },

  // 42. VIVERMED
  {
    id: 'VIVERMED',
    nome: 'VIVERMED',
    nomeExibicao: '42. VIVERMED',
    badge: 'VM',
    categoria: 'Privado',
    situacao: 'ATIVO',
    santaThereza: {
      prontoAtendimento: 'Não.',
      internacao: 'Não atende internação.'
    },
    consultaEletiva: 'Não atende.',
    psAdulto: 'Não atende.',
    psInfantil: 'Não atende.',
    uti: 'Não atende.',
    oftalmologia: 'Não atende.',
    laboratorio: 'Não atende.',
    mamografia: 'Não atende.',
    quimioterapia: 'Não atende.',
    hemodialise: 'Não atende.',
    ambulancia: 'Não possui serviço.',
    observacoesGerais: [
      'Internação, consulta eletiva e PS Adulto/Infantil: NÃO ATENDE.',
      'RM e TC: atende SOMENTE COM A GUIA ORIGINAL DO PACIENTE.',
      'Raio-X: está marcado como "X" na Planilha 2 (a planilha não explica o significado desse X; confirmar com a Priscila).',
      'Oftalmologia, Laboratório, Colonoscopia, Reto, Endoscopia e USG: não atende.'
    ],
    exames: {
      rm: { status: 'COM_ESPECIFICIDADE', descricao: 'Atende somente com a guia original do paciente.' },
      tc: { status: 'COM_ESPECIFICIDADE', descricao: 'Atende somente com a guia original do paciente.' },
      raioX: { status: 'COM_ESPECIFICIDADE', descricao: 'Marcado como "X" na Planilha 2 (não explica o significado; confirmar com Priscila).' },
      colonoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      retossigmoidoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      endoscopia: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      usg: { status: 'NAO_ATENDE', descricao: 'Não atende.' },
      eco: { status: 'SEM_INFORMACAO', descricao: 'Sem informação registrada na planilha. Perguntar para Priscila.' }
    }
  }
];
