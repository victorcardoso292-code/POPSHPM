import { ConvenioPop, PopCardItem, PopsPsMatrixItem, GeapCovidInfluenzaItem } from '../types';

export const SERVIR_DATA: { [key: string]: PopCardItem[] } = {
  'Internação / UTI': [
    {
      title: 'Internação Clínica',
      icon: '▥',
      full: true,
      rows: [
        ['10102019', 'Visita médica — médico não encontrado'],
        ['60000783', 'Diária de enfermaria'],
        ['60033533', 'Taxa de refeição de acompanhante (almoço ou jantar) — até 18 anos e acima de 60 anos']
      ]
    },
    {
      title: 'UTI / Diária',
      icon: '▥',
      rows: [
        ['60000999', 'Pacote de UTI global — mantido até o momento']
      ]
    },
    {
      title: 'Parecer na Internação',
      icon: '⚕',
      rows: [
        ['40601120', 'Parecer de especialista (U/E) na internação'],
        ['40601130', 'Parecer médico de especialista em urgência e emergência (Pronto-Socorro) para UTI']
      ]
    },
    {
      title: 'Fisioterapia para Paciente Internado',
      icon: '◌',
      rows: [
        ['2.02.03.04-7', 'Assistência fisiátrica respiratória em paciente clínico internado'],
        ['2.01.03.34-4', 'Miopatias']
      ]
    }
  ],
  'Pronto-Socorro': [
    {
      title: 'Pacotes do Pronto-Socorro',
      icon: '✚',
      info: 'Não precisa pegar autorização para RX e RM pois o pacote está incluso. Pegar assinatura na guia e colocar a capa juntos.',
      alerts: [
        'RX e RM inclusos no pacote do Pronto-Socorro — Não precisa autorização.',
        'Obrigatório pegar assinatura na guia e colocar a capa juntos.'
      ],
      rows: [
        ['10101037', 'PACOTE PRONTO SOCORRO ADULTO'],
        ['10101038', 'PACOTE PRONTO SOCORRO PEDIATRIA']
      ]
    },
    {
      title: 'Ortopedia, Ginecologia e Cirurgia Geral',
      icon: '⚕',
      rows: [
        ['10101039', 'CONSULTA EM PRONTO SOCORRO ADULTO'],
        ['50101058', 'CONSULTA EM PRONTO SOCORRO INFANTIL']
      ]
    },
    {
      title: 'Parecer no Pronto-Socorro',
      icon: '!',
      warning: true,
      alerts: ['Não está incluso no pacote do PS. Solicitar separadamente.'],
      rows: [
        ['40601120', 'Parecer de especialista (U/E) na internação'],
        ['40601130', 'Parecer médico de especialista em urgência e emergência (Pronto-Socorro) para UTI']
      ]
    }
  ],
  'Remoção': [
    {
      title: 'Solicitação de Remoção Ambulância',
      icon: '✚',
      full: true,
      info: 'Quando solicitar à empresa LISS CARE, solicitar autorização no site e colocar no grupo WhatsApp da Central para acompanhar se a solicitação estiver em análise.',
      contacts: ['remocaoservir@impactomedica.com.br', 'Enviar o formulário do Servir', 'Telefone: 0800 911 4040'],
      rows: [
        ['60501002', 'REMOÇÃO AMBULÂNCIA INTERNA DENTRO DO MUNICÍPIO DE PALMAS, ARAGUAÍNA OU GURUPI COM MÉDICO'],
        ['60501001', 'REMOÇÃO AMBULÂNCIA INTERNA DENTRO DO MUNICÍPIO DE PALMAS, ARAGUAÍNA OU GURUPI SEM MÉDICO']
      ]
    }
  ],
  'SADT': [
    {
      title: 'Endoscopia no Centro Cirúrgico',
      icon: '◍',
      warning: true,
      alerts: ['SEMPRE SOLICITAR COM ANESTESIA.'],
      rows: [
        ['3.16.02.23-1', 'ANESTESIA PARA ENDOSCOPIA DIGESTIVA ALTA E BAIXA'],
        ['6.02.01.12-0', 'PCT-COMP — PACOTE ENDOSCOPIA DIGESTIVA ALTA']
      ]
    },
    {
      title: 'Colonoscopia',
      icon: '◒',
      warning: true,
      alerts: ['SEMPRE SOLICITAR COM ANESTESIA.'],
      rows: [
        ['3.16.02.23-1', 'ANESTESIA PARA ENDOSCOPIA DIGESTIVA ALTA E BAIXA'],
        ['6.02.01.08-2', 'PCT-COMP — PACOTE COLONOSCOPIA (INCLUI A RETOSSIGMOIDOSCOPIA)'],
        ['4.02.02.28-3', 'GASTROSTOMIA ENDOSCÓPICA']
      ]
    },
    {
      title: 'Radioscopia / Hemodiálise — códigos adicionais',
      icon: '◫',
      full: true,
      rows: [
        ['40811026', 'RADIOSCOPIA'],
        ['0000121427', 'CATETER TRIPLO LUMEN'],
        ['51112523', 'PCT-COMP — PACOTE PARA HEMODIÁLISE — AGUDO — ATÉ 4H'],
        ['51112532', 'PCT-COMP — PACOTE PARA HEMODIÁLISE — AGUDO — ATÉ 6H']
      ]
    },
    {
      title: 'Biópsia na Radiologia',
      icon: '⌗',
      full: true,
      alerts: [
        'Verificar se os códigos estão de acordo com o pedido e solicitar mais a agulha como OPME vinculando a guia principal.',
        'Para o código 60034424 — DAY CLINIC: solicitar a diária se o procedimento for realizado somente no Centro Cirúrgico.'
      ],
      rows: [
        ['60034424', 'DAY CLINIC — ATÉ 12H DE PERMANÊNCIA'],
        ['4.09.01.33-5', 'USG — ULTRASSONOGRAFIA — PRÓSTATA TRANSRETAL (NÃO INCLUI ABDOME INFERIOR)'],
        ['4.09.01.38-6', 'USG — ULTRASSONOGRAFIA — DOPPLER COLORIDO DE ÓRGÃO OU ESTRUTURA ISOLADA'],
        ['3.12.01.03-2', 'BIÓPSIA PROSTÁTICA — ATÉ 8 FRAGMENTOS'],
        ['0000105082', 'AGULHA — BIÓPSIA TURNER — UN (OPME)']
      ]
    },
    {
      title: 'Códigos da Ureterorreno',
      icon: '⌁',
      full: true,
      rows: [
        ['4.08.07.02-9', 'RX — RADIOGRAFIA — PIELOGRAFIA ASCENDENTE'],
        ['5.60.40.72-5', 'PCT-HM — URETERORRENOLITOTNPSIA FLEXÍVEL UNILATERAL E REGIDIO'],
        ['5.60.40.42-3', 'PCT-HM — COLOCAÇÃO URETEROSCÓPICA DE DUPLO J UNILATERAL'],
        ['5.60.40.05-9', 'PCT-HM — DILATAÇÃO ENDOSCÓPICA UNILATERAL'],
        ['40811026', 'RADIOGRAFIA DA ESCOPIA']
      ]
    },
    {
      title: 'Retirada de Duplo J',
      icon: '⌁',
      warning: true,
      alerts: ['Solicitar em guia SADT.', 'Não solicitar diária. Não solicitar em Guia de Internação.'],
      rows: [
        ['60033681', 'TAXA DE SALA DE OBSERVAÇÃO, ATÉ 6 HORAS'],
        ['5.60.50.15-1', 'PCT-HM — CORPO ESTRANHO — EXTRAÇÃO ENDOSCÓPICA']
      ]
    }
  ],
  'Hemodinâmica': [
    {
      title: 'Cateterismo',
      icon: '♥',
      rows: [
        ['70101413', 'PCT-HOSP — CATETERISMO CARDÍACO'],
        ['70101421', 'PCT-HM — HONORÁRIO MÉDICO CATETERISMO'],
        ['7101427', 'PCT-ANEST — ANESTESIA PARA CATETERISMO']
      ]
    },
    {
      title: 'Angioplastia — 1 Stent',
      icon: '♥',
      rows: [
        ['70101414', 'PCT-HOSP — ANGIOPLASTIA 1 STENT'],
        ['70101422', 'PCT-HM — HONORÁRIO MÉDICO 1 STENT'],
        ['70101428', 'PCT-ANEST — ANESTESIA 1 STENT']
      ]
    },
    {
      title: 'Angioplastia — 2 Stents',
      icon: '♥',
      rows: [
        ['70101415', 'PCT-HOSP — ANGIOPLASTIA 2 STENTS'],
        ['70101423', 'PCT-HM — HONORÁRIO MÉDICO 2 STENTS'],
        ['70101429', 'PCT-ANEST — ANESTESIA 2 STENTS']
      ]
    },
    {
      title: 'Angioplastia — 3 Stents',
      icon: '♥',
      rows: [
        ['70101416', 'PCT-HOSP — ANGIOPLASTIA 3 STENTS'],
        ['70101424', 'PCT-HM — HONORÁRIO MÉDICO 3 STENTS'],
        ['70101430', 'PCT-ANEST — ANESTESIA 3 STENTS']
      ]
    },
    {
      title: 'Angioplastia — 4 Stents',
      icon: '♥',
      rows: [
        ['70101417', 'PCT-HOSP — ANGIOPLASTIA 4 STENTS'],
        ['70101425', 'PCT-HM — HONORÁRIO MÉDICO 4 STENTS'],
        ['70101431', 'PCT-ANEST — ANESTESIA 4 STENTS']
      ]
    },
    {
      title: 'Ultrassom AIVUS',
      icon: '!',
      warning: true,
      alerts: ['NÃO É PACOTE. Por esse motivo, solicitar todos os códigos.', 'Geralmente é feito junto com cateterismo ou angioplastia.'],
      rows: [
        ['409080439', 'ULTRASSOM INTRAVASCULAR (AIVUS) — PROCEDIMENTO'],
        ['60023139', 'PORTE 4 (CIRURGIA GRANDE) — TAXA'],
        ['0000139045', 'TRENO RETRAÇÃO DESC. PULLBACK — UN — OPME'],
        ['0000250345', 'CATETER ECOGRÁFICO CORONÁRIO OPTICROSS — UN — OPME']
      ]
    },
    {
      title: 'Outros Procedimentos de Urgência Hemodinâmica',
      icon: '!',
      full: true,
      warning: true,
      rows: [
        ['30907080', 'IMPLANTE DE FILTRO DE VEIA CAVA'],
        ['60023139', 'PORTE 4 (CIRURGIA GRANDE)'],
        ['60023325', 'TAXA DE SALA DE HEMODINÂMICA / PROCEDIMENTOS INTERVENCIONISTAS'],
        ['60812030', 'PCT — ANGIOGRAFIA CEREBRAL (ATÉ 4 VASOS)'],
        ['40812057', 'ANGIOGRAFIA POR CATETERISMO SUPERSELETIVO DE RAMO SECUNDÁRIO OU DISTAL'],
        ['40812049', 'ANGIOGRAFIA POR CATETER SELETIVO DE RAMO PRIMÁRIO — POR VASO (X6)'],
        ['60023120', 'TAXA DE SALA CIRÚRGICA, PORTE ANESTÉSICO 3']
      ]
    }
  ],
  'Ortopedia': [
    {
      title: 'Pacotes Cirúrgicos de Ortopedia',
      icon: '⌁',
      full: true,
      info: 'Os procedimentos devem ser requisitados na codificação de pacotes, conforme o POP. Os valores abaixo correspondem à tabela do SERVIR.',
      rows: [
        ['70101401', 'TRATAMENTO PERCUTÂNEO ARTRITE/ARTROSE', 'R$ 19.412,23'],
        ['70101402', 'TRATAMENTO PERCUTÂNEO COLUNA VERTEBRAL', 'R$ 29.902,40'],
        ['70101403', 'TRATAMENTO PERCUTÂNEO BLOQUEIO 1 NÍVEL', 'R$ 7.447,36'],
        ['70101404', 'TRATAMENTO PERCUTÂNEO — BLOQUEIO 2 NÍVEIS', 'R$ 10.968,82'],
        ['70101405', 'TRATAMENTO PERCUTÂNEO — BLOQUEIO 3 NÍVEIS', 'R$ 14.490,26'],
        ['70101406', 'TRAT. CIRÚRGICO DE LCA', 'R$ 18.875,60'],
        ['70101407', 'TRAT. CIRÚRGICO DE LCP', 'R$ 20.375,12'],
        ['70101408', 'TRAT. CIRÚRGICO MENISCO', 'R$ 19.572,01'],
        ['70101409', 'TRAT. CIRÚRGICO ARTROPLASTIA TOTAL COM IMPLANTE', 'R$ 38.709,87'],
        ['70101410', 'TRAT. CIRÚRGICO ARTROSCOPIA DE OMBRO', 'R$ 29.647,43'],
        ['70101411', 'TRAT. CIRÚRGICO HÉRNIA DISCO/LOMBAR SIMPLES — 1 NÍVEL', 'R$ 67.032,48'],
        ['70101412', 'TRAT. CIRÚRGICO HÉRNIA DISCO/LOMBAR SIMPLES — 2 NÍVEIS', 'R$ 68.874,64']
      ]
    },
    {
      title: 'Regras Importantes de Pertinência da Ortopedia',
      icon: '!',
      full: true,
      warning: true,
      alerts: [
        'Os procedimentos da tabela própria devem ser solicitados obrigatoriamente na codificação de pacotes; não deverão ser solicitados e cobrados em conta aberta (fee for service).',
        'A formação dos pacotes não exclui a análise de pertinência: o médico auditor deverá verificar a solicitação médica e outras documentações que comprovem a necessidade do procedimento.',
        'Pacotes de 1 a 3.2: somente um por guia e por beneficiário; não é permitida a solicitação de vários pacotes para um mesmo procedimento.',
        'Pacotes de 4 a 8: poderão ser solicitados até dois por guia e por beneficiário, desde que em membros diferentes e com pertinência comprovada.',
        'Para procedimentos diversos em um mesmo paciente, realizados em datas não coincidentes, deverão ser utilizadas guias distintas.',
        'Pacotes 9 e 10: somente um por guia e por beneficiário.'
      ],
      rows: []
    }
  ],
  'Anestesia': [
    {
      title: 'Pacotes de Anestesiologia',
      icon: '◉',
      full: true,
      info: 'Os pacotes de anestesista das cirurgias deverão ser solicitados junto com outros pacotes.',
      rows: [
        ['60023120', 'TAXA DE SALA CIRÚRGICA, PORTE ANESTÉSICO 3'],
        ['70101427', 'PCT-ANEST — PACOTE DE CATETERISMO'],
        ['70101428', 'PCT-ANEST — ANGIOPLASTIA CORONARIANA — 01 STENT'],
        ['70101429', 'PCT-ANEST — ANGIOPLASTIA CORONARIANA — 02 STENT'],
        ['70101430', 'PCT-ANEST — ANGIOPLASTIA CORONARIANA — 03 STENT'],
        ['70101431', 'PCT-ANEST — ANGIOPLASTIA CORONARIANA — 04 STENT'],
        ['70101804', 'PCT-ANEST — BLOQUEIO ANESTÉSICO'],
        ['70101806', 'PCT-ANEST — LCA/LCP/REALINHAMENTO PATELAR'],
        ['70101811', 'PCT-ANEST — TRAT. CIRÚRGICO HÉRNIA DISCO/LOMBAR SIMPLES'],
        ['70101813', 'PCT-ANEST — TRATAMENTO CIRÚRGICO ARTROPLASTIA TOTAL COM IMPLANTE'],
        ['70101810', 'PCT-ANEST — TRATAMENTO CIRÚRGICO ARTROSCOPIA DE OMBRO'],
        ['70101808', 'PCT-ANEST — TRATAMENTO CIRÚRGICO MENISCO'],
        ['70101801', 'PCT-ANEST — TRATAMENTO PERCUTÂNEO ARTRITE/ARTROSE'],
        ['70101802', 'PCT-ANEST — TRATAMENTO PERCUTÂNEO COLUNA VERTEBRAL']
      ]
    }
  ],
  'Acesso / Contatos': [
    {
      title: 'Acesso e Contatos do SERVIR',
      icon: '☎',
      full: true,
      info: 'Acessos revisados conforme o POP SERVIR e a planilha atual de senhas.',
      contacts: ['0800 911 4040', '0800 911 3030', 'atendimentoservir@impactomedica.com.br'],
      rows: [
        ['Portal', 'https://novowebplanplansaude.facilinformatica.com.br/GuiasTISS/Logon#'],
        ['Usuário', '12955953000192'],
        ['Senha', '129559530001921292'],
        ['Cód. Contratado', '00352-2']
      ]
    }
  ]
};

// ========================================================
// OFICIAL: RELAÇÃO DE CONVÊNIOS DO PRONTO SOCORRO (POPS PS)
// CNPJ Pronto Socorro: 12955953000192 | CBO Clínico Geral: 225125
// ========================================================
export const POPS_PS_INSTITUTIONAL_HEADER = {
  title: 'RELAÇÃO DE CONVÊNIOS PARA REALIZAÇÃO DE EXAMES LABORATORIAIS | CÓDIGOS PACOTES PS | EXAMES IMAGEM PACOTE IMPRIMIR CAPA TASY',
  cnpj: '12955953000192',
  cnpjFormatado: '12.955.953/0001-92',
  cboClinicoGeral: '225125',
  cboDescricao: 'CBO Clínico Geral 225125 - Urgência / Emergência',
  regrasGerais: [
    'Exames de imagem e laboratório que não são pacotes, solicitar autorização convênio!',
    'Colher assinatura paciente ou responsável em todas as GUIAS AUTORIZADAS e nas fichas de atendimentos. Na Internação sempre que ocorrer!!'
  ],
  especialidadesSobreavisoPs: [
    'Urologista',
    'Cardiologista',
    'Nefrologista',
    'Neurologista',
    'Neurocirurgião'
  ]
};

// Tabela Amarela: Códigos exames Influenza e Covid para convênio GEAP
export const GEAP_COVID_INFLUENZA_EXAMS: GeapCovidInfluenzaItem[] = [
  { code: '40306216', description: 'ANTICORPOS ANTI-INFLUENZA A, IGG-PESQUISA E/OU DOSAGEM' },
  { code: '40306224', description: 'ANTICORPOS ANTI-INFLUENZA A, IGM-PESQUISA E/OU DOSAGEM' },
  { code: '40306232', description: 'ANTICORPOS ANTI-INFLUENZA B, IGG-PESQUISA E/OU DOSAGEM' },
  { code: '40306240', description: 'ANTICORPOS ANTI-INFLUENZA B, IGM-PESQUISA E/OU DOSAGEM' },
  { code: '40314618', description: 'SARS - (COVID-19) PESQUISA DE ANTICORPOS (NOVO CÓDIGO)' }
];

// Matriz Completa Oficial de Convênios do Pronto Socorro (29 Convênios)
export const POPS_PS_MATRIX_DATA: PopsPsMatrixItem[] = [
  {
    id: 'AMIL',
    convenio: 'AMIL',
    examesLaboratoriais: 'SIM AUTORIZAR',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'ASSEFAZ',
    convenio: 'ASSEFAZ',
    examesLaboratoriais: 'SIM AUTORIZAR',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'BEST SAÚDE',
    convenio: 'BEST SAÚDE',
    examesLaboratoriais: 'SIM AUTORIZAR',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: 'RAIO X'
  },
  {
    id: 'BRADESCO',
    convenio: 'BRADESCO',
    examesLaboratoriais: 'SIM',
    pacotePsAdulto: '84000406',
    pacotePsPediatria: '84000147',
    imagemPacoteCapaTasy: 'RAIO X e Tomografia'
  },
  {
    id: 'CAPESAÚDE',
    convenio: 'CAPESAÚDE',
    examesLaboratoriais: 'SIM',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'CASSI',
    convenio: 'CASSI',
    examesLaboratoriais: 'SIM AUTORIZAR',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'CONAB',
    convenio: 'CONAB',
    examesLaboratoriais: 'SIM',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'E-VIDA',
    convenio: 'E-VIDA',
    examesLaboratoriais: 'SIM AUTORIZAR',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'FUSEX',
    convenio: 'FUSEX',
    examesLaboratoriais: 'SIM',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'GAMASAÚDE',
    convenio: 'GAMASAÚDE',
    examesLaboratoriais: 'SIM',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'GEAP',
    convenio: 'GEAP',
    examesLaboratoriais: 'SIM AUTORIZAR COVID E INFLUENZA',
    pacotePsAdulto: '989100094',
    pacotePsPediatria: '98910043',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'GOLDEN CROSS',
    convenio: 'GOLDEN CROSS',
    examesLaboratoriais: 'SIM',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'LIFE SAÚDE',
    convenio: 'LIFE SAÚDE',
    examesLaboratoriais: 'SIM AUTORIZAR',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'MARINHA',
    convenio: 'MARINHA',
    examesLaboratoriais: 'SIM',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'NOTRE DAME',
    convenio: 'NOTRE DAME',
    examesLaboratoriais: 'NÃO',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'OMINT',
    convenio: 'OMINT',
    examesLaboratoriais: 'SIM',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'PASA VALE',
    convenio: 'PASA VALE',
    examesLaboratoriais: 'SIM',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'PETROBRAS',
    convenio: 'PETROBRAS',
    examesLaboratoriais: 'NÃO',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'PLAN ASSISTE',
    convenio: 'PLAN ASSISTE',
    examesLaboratoriais: 'SIM AUTORIZAR',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'POSTAL SAÚDE',
    convenio: 'POSTAL SAÚDE',
    examesLaboratoriais: 'SIM',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'PRO SOCIAL',
    convenio: 'PRO SOCIAL',
    examesLaboratoriais: 'SIM AUTORIZAR',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'PRO TOCANTINS',
    convenio: 'FA-SAUDE (PRO-TOCANTINS)',
    examesLaboratoriais: 'SIM AUTORIZAR',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'SAÚDE CAIXA',
    convenio: 'SAÚDE CAIXA',
    examesLaboratoriais: 'SIM AUTORIZAR',
    pacotePsGeral: '98800124 + 10101039',
    imagemPacoteCapaTasy: 'RAIO X'
  },
  {
    id: 'SEPACO',
    convenio: 'SEPACO',
    examesLaboratoriais: 'NÃO',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'SERVIR',
    convenio: 'SERVIR',
    examesLaboratoriais: 'SIM',
    pacotePsAdulto: '10101037',
    pacotePsPediatria: '10101038',
    imagemPacoteCapaTasy: 'Raio X e Ressonância'
  },
  {
    id: 'SUL AMÉRICA',
    convenio: 'SUL AMÉRICA',
    examesLaboratoriais: 'SIM',
    pacotePsGeral: '64620107',
    imagemPacoteCapaTasy: 'Raio X e Tomografia'
  },
  {
    id: 'SUS',
    convenio: 'SUS',
    examesLaboratoriais: 'NÃO',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'TRE',
    convenio: 'TRE',
    examesLaboratoriais: 'SIM',
    pacotePsGeral: '10101039',
    imagemPacoteCapaTasy: '—'
  },
  {
    id: 'VALE PASA',
    convenio: 'VALE PASA',
    examesLaboratoriais: '—',
    pacotePsGeral: '98001620',
    imagemPacoteCapaTasy: '—'
  }
];

export const CONVENIOS_MASTER_LIST: ConvenioPop[] = [
  {
    id: 'SERVIR',
    name: 'SERVIR (Plano de Saúde TO)',
    badge: 'SE',
    category: 'Estadual',
    cnpj: '12.955.953/0001-92',
    portalUrl: 'https://servir.facilinformatica.com.br',
    labUrgencia: 'SIM (Incluso no Pacote PS)',
    pacotePs: '10101037 ADULTO / 10101038 PEDIATRIA',
    imagemUrgencia: 'Raio X e Ressonância (Imprimir Capa TASY)',
    accessCredentials: [
      ['Portal Servir', 'https://servir.facilinformatica.com.br'],
      ['Login', '12955953000192'],
      ['Senha', 'Medical@2025']
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          'Consulta Pronto Socorro Adulto: 10101037.',
          'Consulta Pronto Socorro Pediatria: 10101038.',
          'Raio X e Ressonância inclusos no pacote do Pronto-Socorro — Imprimir capa TASY.',
          'Não precisa pegar autorização para RX e RM pois o pacote está incluso.',
          'Obrigatório pegar assinatura na guia e colocar a capa juntos.'
        ]
      }
    }
  },
  {
    id: 'AMIL',
    name: 'AMIL',
    badge: 'AM',
    category: 'Privado',
    cnpj: '12.955.953/0001-92',
    portalUrl: 'https://credenciado.amil.com.br/login',
    labUrgencia: 'AUTORIZAR',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'AUTORIZAR RX / TC / RM',
    criticalNotes: [
      'NÃO ATENDER RADIOLOGIA ELETIVA.',
      'Obrigatório solicitar o TOKEN com o beneficiário para validar o atendimento.',
      'OBRIGATÓRIO o paciente/responsável assinar na guia impressa.',
      'TODOS os procedimentos necessitam de autorização prévia: internações, eletivas, urgências, RX, TC e RM.'
    ],
    accessCredentials: [
      ['Site', 'https://credenciado.amil.com.br/login'],
      ['Código do Prestador', '40830624'],
      ['Usuário principal', '40830624'],
      ['Senha principal', '6n91a5izud'],
      ['2ª opção — CPF', '043.182.841-58'],
      ['2ª opção — Usuário', '40830624w8'],
      ['2ª opção — Senha', '40830624w8'],
      ['Troca de senha — e-mail', 'hpm.recepção@redemedical.com.br']
    ],
    contacts: [
      'Central de autorização: 3003-2702 / 0800 727 2288',
      'Apoio Médico / Urgência: 3004-1028 / 0800 721 1028',
      'Comunicação Geral: 3004-1000',
      'Suporte: 3004-1050 e 0800 706 1663 (07h às 19h seg-sex)',
      'hospitaisnacionaisrj@amil.com.br',
      'ana.marques@amil.com.br'
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        steps: [
          'Realizar consulta de elegibilidade prévia no portal Amil.',
          'Solicitar e validar o TOKEN com o paciente.',
          'Lançar código de consulta 10101039 no portal.',
          'Coletar assinatura física do paciente na guia autorizada.'
        ],
        textItems: [
          'Código informado no POP: 10101039 — CONSULTA EM PRONTO SOCORRO.',
          'Antes do atendimento, realizar consulta de elegibilidade.',
          'Não esquecer de solicitar o TOKEN para validar o atendimento.',
          'OBRIGATÓRIO o paciente assinar a guia.',
          'Todos os procedimentos necessitam de autorização: internações, eletivas, urgências, RX, TC e RM.'
        ]
      },
      elegibilidade: {
        id: 'elegibilidade',
        label: 'Elegibilidade',
        steps: [
          'No portal Amil, acessar a opção "Consulta de Elegibilidade".',
          'Informar o número da carteirinha ou CPF do paciente.',
          'Clicar em Consultar.',
          'Prosseguir somente quando aparecer o status: CLIENTE ELEGÍVEL.'
        ]
      },
      exames: {
        id: 'exames',
        label: 'Fluxo de Exames',
        steps: [
          'Selecionar TIPO DE ATENDIMENTO: EXAMES.',
          'Selecionar CARÁTER: URGÊNCIA / EMERGÊNCIA.',
          'Informar o médico solicitante com CRM e UF.',
          'Inserir o procedimento solicitado e a quantidade.',
          'Incluir o procedimento.',
          'Escanear o pedido médico e anexar em PDF ou imagem.',
          'Concluir a solicitação (os exames de urgência são autorizados na hora pelo sistema Amil).',
          'Imprimir a guia autorizada e colher assinatura do paciente/acompanhante.',
          'Solicitar o TOKEN para validar o atendimento.'
        ]
      },
      internacao: {
        id: 'internacao',
        label: 'Internação',
        codes: [
          { code: '10102019', label: 'Visita Hospitalar (Paciente Internado Clínico)' },
          { code: '60000554', label: 'Diária de Apartamento Simples' },
          { code: '60000619', label: 'Diária de Berçário Normal' },
          { code: '60000627', label: 'Diária de Berçário Patológico/Prematuro' },
          { code: '60000805', label: 'Diária de Quarto Coletivo de 2 Leitos com Banheiro Privativo' },
          { code: '60000384', label: 'Diária de Acompanhante com Refeição Completa' }
        ]
      },
      uti: {
        id: 'uti',
        label: 'UTI',
        codes: [
          { code: '60001038', label: 'Diária de UTI Adulto Geral' },
          { code: '60001054', label: 'Diária de UTI Infantil/Pediátrica' },
          { code: '60001062', label: 'Diária de UTI Neonatal' },
          { code: '10104020', label: 'Atendimento Médico do Intensivista em UTI (Plantão 12h — por paciente, qtd 2)' },
          { code: '10104011', label: 'Atendimento do Intensivista Diarista (por dia e paciente)' }
        ]
      },
      parto: {
        id: 'parto',
        label: 'Parto',
        codes: [
          { code: '60000384', label: 'Diária de Acompanhante com Refeição Completa' },
          { code: '60000619', label: 'Diária de Berçário Normal' },
          { code: '60000554', label: 'Diária de Apartamento Simples' },
          { code: '31309038', label: 'Assistência ao Trabalho de Parto (por hora, até o limite de 6h)' },
          { code: '31909127', label: 'Parto (Via Vaginal)' },
          { code: '10103015', label: 'Atendimento ao Recém-Nascido em Berçário' },
          { code: '10103023', label: 'Atendimento ao Recém-Nascido em Sala de Parto (Baixo Risco)' }
        ]
      },
      isolamento: {
        id: 'isolamento',
        label: 'Isolamento',
        codes: [
          { code: '60001135', label: 'Diária de Isolamento de Apartamento Simples' },
          { code: '60001194', label: 'Diária de Isolamento de Berçário Normal' },
          { code: '60001208', label: 'Diária de Isolamento de Berçário Patológico/Prematuro' },
          { code: '60001330', label: 'Diária de Isolamento de UTI Adulto Geral' },
          { code: '60001356', label: 'Diária de Isolamento de UTI Infantil/Pediátrica' },
          { code: '60001364', label: 'Diária de Isolamento de UTI Neonatal' },
          { code: '60034424', label: 'Diária de Hospital Dia independente de acomodação' }
        ]
      },
      fisioterapia: {
        id: 'fisioterapia',
        label: 'Fisioterapia & Multiprofissional',
        codes: [
          { code: '50000365', label: 'Fisioterapia cardiovascular' },
          { code: '50000411', label: 'Fisioterapia pré e pós-cirúrgico / recuperação de tecidos' },
          { code: '50000462', label: 'Consulta em Psicologia Hospitalar' },
          { code: '50000632', label: 'Sessão Individual Hospitalar de Fonoaudiologia' },
          { code: '50000691', label: 'Consulta Hospitalar por Nutricionista' },
          { code: '50000810', label: 'Fisioterapia respiratória COM assistência ventilatória' },
          { code: '50000829', label: 'Fisioterapia respiratória SEM assistência ventilatória' },
          { code: '50001019', label: 'Fisioterapia respiratória com ventilação mecânica' }
        ]
      }
    }
  },
  {
    id: 'BRADESCO',
    name: 'BRADESCO SAÚDE',
    badge: 'BR',
    category: 'Seguradora',
    labUrgencia: 'SIM',
    pacotePs: '84000406 ADULTO | 84000147 PEDIATRIA',
    imagemUrgencia: 'RAIO X e Tomografia',
    criticalNotes: [
      '84000406: Atendimento/consulta em Pronto-Socorro Adulto (pacote contempla RX e TC no POP).',
      'Ressonância Magnética: solicitar somente na Radiologia, no site Bradesco, sob contratado 000810479.',
      'Evitar RM no PS: o POP orienta internar primeiro caso o paciente necessite de RM.',
      'OPME na urgência: não necessita pré-autorização, cobrado diretamente em conta. Eletivo necessita solicitação prévia.'
    ],
    accessCredentials: [
      ['Site Bradesco', 'https://www.bradescoseguros.com.br/clientes/produtos/plano-saude'],
      ['Código Referenciado', '417815'],
      ['Login', 'CPF + 12955953000192'],
      ['Senha', 'PESSOAL'],
      ['Responsável Master', 'priscila.marques@redemedical.com.br'],
      ['Portal ORIZON', 'https://www.polimed.com.br/autenticadorOrizon/loginAutenticador']
    ],
    contacts: [
      'Central Bradesco: 4004-4580',
      'Med Life Remoções: (61) 3386-3480',
      'Vida Emergência: (61) 3248-0008 / (61) 3248-3030',
      'bk.remocao@bradesco'
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          'PRONTO-SOCORRO ADULTO: código 84000406.',
          'PRONTO-SOCORRO PEDIATRIA: código 84000147.',
          '84000406 contempla RX e Tomografia conforme pacote contratual.',
          'Para Ressonância Magnética no PS: orienta-se internar antes de solicitar a RM.',
          'Não realiza exames eletivos de RX e TC (somente RM eletiva sob agendamento).'
        ]
      },
      internacao: {
        id: 'internacao',
        label: 'Internação',
        textItems: [
          'Sempre verificar carência no portal antes da internação.',
          'Autorização clínica: 10102019 — Visita Hospitalar.',
          'Cirúrgica: 31102085, 31102042, 31102379, 31003593, 31102565 e 31102077.',
          'UTI: 10104011 (1x) + 10104020 (2x) — marcar obrigatoriamente a opção UTI no portal, sem necessidade de código de diária.'
        ]
      }
    }
  },
  {
    id: 'CASSI',
    name: 'CASSI',
    badge: 'CS',
    category: 'Autogestão',
    portalUrl: 'https://www.polimed.com.br/autenticadorOrizon/loginAutenticador',
    labUrgencia: 'AUTORIZAR VIA ORIZON',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'Solicitar Autorização no Orizon para RX, TC e RM.',
    criticalNotes: [
      'PORTAL ORIZON (POLIMED): O portal de autorizações da CASSI é o ORIZON, tanto no Pronto-Socorro como na Internação.',
      'Após qualquer solicitação de internação, é OBRIGATÓRIO ligar para a Central CASSI (0800 729 0090 / 0800 729 0080) para validar a autorização ou tratar eventuais pendências.',
      'No Pronto-Socorro: elegibilidade, consulta médica (10101039) e exames de urgência são lançados diretamente no autenticador Orizon.',
      'Curativos no PS: tipo SP/SADT, Operadora CASSI, Guia Principal 01, Código TUSS 20104090.',
      'Apoio e Suporte ao Portal Orizon pelo telefone: 4004-4550.'
    ],
    accessCredentials: [
      ['Portal CASSI (Orizon - PS & Internação)', 'https://www.polimed.com.br/autenticadorOrizon/loginAutenticador'],
      ['Login MEDICAL (CNPJ)', '12955953000192'],
      ['Senha MEDICAL', 'Hpm2025hpm@'],
      ['Código Prestador Medical', '2120820'],
      ['Unidade Santa Thereza (Login)', '25016319000136'],
      ['Unidade Santa Thereza (Senha)', 'Hst@2025'],
      ['Código Prestador Santa Thereza', '2120821']
    ],
    contacts: [
      'Central CASSI: 0800 729 0090 / 0800 729 0080',
      'Suporte Portal Orizon: 4004-4550',
      'go.negociacao@cassi.com.br',
      'central.opme@cassi.com.br',
      'opme.negociacao@cassi.com.br'
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        steps: [
          'Acessar o portal Orizon (Polimed) pelo link oficial do autenticador.',
          'Informar o Login Medical (12955953000192) e Senha (Hpm2025hpm@) com o Código do Prestador 2120820.',
          'Realizar verificação de elegibilidade do beneficiário CASSI.',
          'Lançar a consulta de urgência pelo código 10101039.',
          'Para exames laboratoriais e radiológicos de urgência, cadastrar pedido médico no Orizon.',
          'Para curativos: Guia SP/SADT, Guia Principal 01, Código 20104090.'
        ],
        textItems: [
          'Portal oficial: Orizon (Polimed) — tanto no PS como na Internação.',
          '10101039 — Consulta em Pronto-Socorro.',
          'Curativos: SP/SADT / Operadora CASSI / Guia principal 01 / código 20104090.',
          'Solicitar autorização em todos os pedidos de exames laboratoriais e de imagem no Orizon.'
        ]
      },
      elegibilidade: {
        id: 'elegibilidade',
        label: 'Elegibilidade & Token',
        steps: [
          'No autenticador Orizon, selecionar a operadora CASSI.',
          'Digitar a matrícula da carteirinha ou CPF do paciente.',
          'Conferir a vigência e situação cadastral do beneficiário.',
          'Imprimir a guia autorizada e colher assinatura do paciente.'
        ]
      },
      exames: {
        id: 'exames',
        label: 'Exames de Urgência no PS',
        steps: [
          'Acessar menu de solicitação SP/SADT no portal Orizon.',
          'Informar o CRM do médico solicitante do PS.',
          'Adicionar códigos TUSS dos exames laboratoriais ou de imagem.',
          'Anexar justificativa ou pedido médico quando solicitado pelo portal Orizon.',
          'Confirmar emissão da guia e colher assinatura do paciente.'
        ],
        codes: [
          { code: '10101039', label: 'CONSULTA EM PRONTO SOCORRO' },
          { code: '20104090', label: 'CURATIVO DE PEQUENO / MÉDIO PORTE' },
          { code: '40304361', label: 'HEMOGRAMA COMPLETO COM CONTAGEM DE PLAQUETAS' },
          { code: '40301630', label: 'CREATININA, DOSAGEM' },
          { code: '40302580', label: 'UREIA, DOSAGEM' },
          { code: '40316149', label: 'GASOMETRIA ARTERIAL' },
          { code: '40808033', label: 'RADIOGRAFIA DE TÓRAX (PA E PERFIL)' },
          { code: '41001010', label: 'TOMOGRAFIA COMPUTADORIZADA DE CRÂNIO' }
        ]
      },
      internacao: {
        id: 'internacao',
        label: 'Internação',
        steps: [
          'Acessar o portal Orizon (Polimed) e selecionar a opção Guia de Solicitação de Internação.',
          'Preencher dados do médico assistente, diagnóstico/CID-10 e procedimento principal.',
          'Informar a acomodação contratual (Enfermaria ou Apartamento).',
          'Concluir o pedido no Orizon.',
          'OBRIGATÓRIO: Ligar para a Central CASSI (0800 729 0090) para validação imediata e acompanhamento do número da autorização.'
        ],
        codes: [
          { code: '10102019', label: 'Visita Hospitalar (Paciente Internado Clínico)' },
          { code: '60000651', label: 'Diária de Apartamento Standard' },
          { code: '60000694', label: 'Diária de Enfermaria' },
          { code: '60000775', label: 'Hospital Dia' },
          { code: '60001038', label: 'Diária de UTI Adulto' },
          { code: '10104020', label: 'Intensivista Plantonista UTI (2x)' },
          { code: '10104011', label: 'Intensivista Diarista UTI (1x)' }
        ]
      }
    }
  },
  {
    id: 'GEAP',
    name: 'GEAP AUTOGESTÃO',
    badge: 'GE',
    category: 'Autogestão',
    labUrgencia: 'SIM AUTORIZAR COVID E INFLUENZA',
    pacotePs: '989100094 ADULTO | 98910043 PEDIATRIA',
    imagemUrgencia: 'Solicitar autorização para RX, USG, TC e RM.',
    criticalNotes: [
      '98910043: Pacote PS Pediatria (não necessita autorização no site).',
      'Pareceres de qualquer especialidade médica: inclusos no pacote do PS.',
      'Exames de imagem (RX, USG, TC, RM): NÃO estão inclusos no pacote; solicitar autorização.'
    ],
    accessCredentials: [
      ['Site GEAP', 'https://www.geap.com.br'],
      ['Login', '28112539'],
      ['Senha', '28112539']
    ],
    contacts: [
      'Telefones GEAP Palmas: (63) 2111-4309 / 2111-4312 / 2111-4307',
      'Assistencial.to@geap.com.br',
      'Remoção LISS CARE: lisscareremocao@gmail.com'
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          'Adulto: 989100094 | Pediatria: 98910043.',
          'RX, USG, TC e RM: solicitar autorização prévia.',
          'COVID e Influenza: códigos específicos exigem autorização.'
        ]
      },
      covid_influenza: {
        id: 'covid_influenza',
        label: 'COVID & Influenza',
        codes: [
          { code: '40306216', label: 'ANTICORPOS ANTI-INFLUENZA A, IGG-PESQUISA E/OU DOSAGEM' },
          { code: '40306224', label: 'ANTICORPOS ANTI-INFLUENZA A, IGM-PESQUISA E/OU DOSAGEM' },
          { code: '40306232', label: 'ANTICORPOS ANTI-INFLUENZA B, IGG-PESQUISA E/OU DOSAGEM' },
          { code: '40306240', label: 'ANTICORPOS ANTI-INFLUENZA B, IGM-PESQUISA E/OU DOSAGEM' },
          { code: '40314618', label: 'SARS - (COVID-19) PESQUISA DE ANTICORPOS (NOVO CÓDIGO)' }
        ]
      },
      internacao: {
        id: 'internacao',
        label: 'Internação',
        codes: [
          { code: '98980181', label: 'Diária Global de Enfermaria' },
          { code: '98980173', label: 'Diária Global de Apartamento' },
          { code: '60000775', label: 'Hospital Dia Apartamento (Cirurgia 2º andar até 12h)' },
          { code: '98980025', label: 'Diária de UTI Adulto' },
          { code: '98980068', label: 'UTI NEO Nível I' }
        ]
      }
    }
  },
  {
    id: 'SAÚDE CAIXA',
    name: 'SAÚDE CAIXA',
    badge: 'CX',
    category: 'Autogestão',
    labUrgencia: 'SIM AUTORIZAR',
    pacotePs: '98800124 + 10101039',
    imagemUrgencia: 'RAIO X incluso no 98800124',
    criticalNotes: [
      'Solicitar SEMPRE os dois códigos no PS: 98800124 + 10101039.',
      '98800124 contempla Raio-X, eletroencefalograma e gesso conforme o POP.',
      'Análise de internação/procedimentos pode levar de 3 a 5 dias; anexar termo de ciência de débito e consentimento.'
    ],
    accessCredentials: [
      ['Portal Saúde Caixa', 'https://credenciadosaude.caixa.gov.br/login.aspx'],
      ['Login', 'a12955953000192'],
      ['Senha', 'Medical@1234']
    ],
    contacts: [
      '0800 095 6094',
      'WhatsApp: (61) 99186-5878',
      'centralsaudecaixa.com.br'
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          'Lançar conjuntamente: 98800124 e 10101039.',
          '98800124 cobre RX, eletroencefalograma e gesso no PS.',
          'Beneficiário RESTRITO: somente consultas eletivas e exames complementares previstos em tabela.'
        ]
      },
      internacao: {
        id: 'internacao',
        label: 'Internação',
        codes: [
          { code: '98800205', label: 'Diária Global de Enfermaria' },
          { code: '98800230', label: 'Diária Global de Apartamento' },
          { code: '98800213', label: 'Diária Global de UTI' },
          { code: '98800221', label: 'Diária Global de Berçário' }
        ]
      }
    }
  },
  {
    id: 'ASSEFAZ',
    name: 'ASSEFAZ',
    badge: 'AF',
    category: 'Autogestão',
    labUrgencia: 'AUTORIZAR',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'AUTORIZAR RX / TC / RM',
    accessCredentials: [
      ['Portal', 'https://novowebplanassefaz.facilinformatica.com.br/GuiasTISS/Logon'],
      ['Login', '12955953000192'],
      ['Senha', '12955953000192']
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          '10101039 — Consulta em Pronto-Socorro.',
          'Autorizar todos os procedimentos: internações, eletivas, urgências, RX, TC e RM.',
          'No campo "Nº Guia no Prestador" e "Cartão de Identificação", informar o número da carteirinha.'
        ]
      }
    }
  },
  {
    id: 'CAPESESP',
    name: 'CAPESESP / CAPESAUDE',
    badge: 'CP',
    category: 'Autogestão',
    labUrgencia: 'AUTORIZAR',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'AUTORIZAR RX / TC / RM',
    accessCredentials: [
      ['Portal Capesesp', 'https://www.capesesp.com.br/'],
      ['Login Prestador', '12955953000192'],
      ['Senha', 'Medical2026@']
    ],
    contacts: ['0800 979 6191', 'atendimento@capesesp.com.br'],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          '10101039 — Consulta em Pronto-Socorro.',
          'Solicitar autorização prévia no portal para exames laboratoriais e procedimentos de imagem.',
          'Verificar validade da carteirinha e elegibilidade ativa.'
        ]
      },
      internacao: {
        id: 'internacao',
        label: 'Internação',
        codes: [
          { code: '10102019', label: 'Visita Hospitalar' },
          { code: '60000694', label: 'Diária de Enfermaria' },
          { code: '60000651', label: 'Diária de Apartamento' },
          { code: '60001038', label: 'Diária de UTI Adulto' }
        ]
      }
    }
  },
  {
    id: 'CONAB',
    name: 'CONAB',
    badge: 'CN',
    category: 'Autogestão',
    labUrgencia: 'CONFORME POP',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'URGÊNCIA CONFORME POP',
    criticalNotes: [
      'Quando é urgência não precisa autorização — só verificar a elegibilidade.',
      'Não exige cartão físico do plano; paciente deve apresentar documento oficial com foto e ter elegibilidade confirmada.',
      'RX e Tomografia de urgência: podem ser realizados normalmente no PS quando amparados por pedido médico.',
      'Encaminhar pedido e documentos da internação para to.seade@conab.gov.br.'
    ],
    accessCredentials: [
      ['Site CONAB', 'https://www.gov.br/conab/pt-br'],
      ['Login / CNPJ', '12955953000192'],
      ['Senha', 'Medical2026']
    ],
    contacts: ['to.seade@conab.gov.br', '(63) 3228-8412', '(63) 3228-8433'],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          '10101039 — Consulta em Pronto-Socorro.',
          'RX e Tomografia de Urgência liberados com pedido médico.',
          'Exames eletivos exigem retorno do beneficiário com guia previamente autorizada.'
        ]
      }
    }
  },
  {
    id: 'TRE',
    name: 'TRE (Tribunal Regional Eleitoral)',
    badge: 'TR',
    category: 'Autogestão',
    labUrgencia: 'CONFORME POP',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'URGÊNCIA CONFORME POP',
    criticalNotes: [
      'PACIENTE NÃO PODE FICAR EM ENFERMARIA. Acomodação exclusivamente em Apartamento.',
      'Diária de Apartamento: 60000651. Isolamento Apto: 60000686.',
      'Diária de UTI: 60001038. Isolamento UTI: 60001330.',
      'Berçário Normal: 60000619. Isolamento Berçário: 60001194.'
    ],
    contacts: ['(63) 3229-9500'],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          '10101039 — Consulta em Pronto-Socorro.',
          'Atendimento de urgência conforme elegibilidade ativa.'
        ]
      },
      internacao: {
        id: 'internacao',
        label: 'Internação',
        textItems: [
          'PACIENTE NÃO PODE FICAR EM ENFERMARIA.',
          'Acomodação exclusivamente em Apartamento Standard (60000651) ou Isolamento Apto (60000686).'
        ],
        codes: [
          { code: '60000651', label: 'Diária de Apartamento Standard' },
          { code: '60000686', label: 'Diária de Isolamento de Apartamento Standard' },
          { code: '60001038', label: 'Diária UTI' },
          { code: '60001330', label: 'Diária de Isolamento de UTI Adulto' },
          { code: '60000619', label: 'Diária de Berçário Normal' },
          { code: '60001194', label: 'Diária de Isolamento de Berçário Normal' }
        ]
      }
    }
  },
  {
    id: 'E-VIDA',
    name: 'E-VIDA',
    badge: 'EV',
    category: 'Autogestão',
    labUrgencia: 'AUTORIZAR',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'AUTORIZAR RX / TC / USG',
    accessCredentials: [
      ['Portal E-Vida', 'https://novowebplanevida.facilinformatica.com.br/GuiasTISS/Logon'],
      ['Login', '12955953000192'],
      ['Senha', '12955953000192']
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          '10101039 — Consulta em Pronto-Socorro.',
          'Solicitar autorização para consulta e procedimentos de imagem (RX, TC, USG).'
        ]
      }
    }
  },
  {
    id: 'FUSEX',
    name: 'FUSEX (EXÉRCITO)',
    badge: 'FX',
    category: 'Militar',
    labUrgencia: 'NÃO PARA URGÊNCIA',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'CONFORME POP',
    criticalNotes: [
      'Atendimento de urgência: pode atender diretamente sem autorização prévia; colher assinatura na guia SADT.',
      'Internação/UTI: avisar o médico auditor do FUSEX imediatamente (auditoria in loco).',
      'Beneficiário tem prazo de até 48h para apresentar a guia autorizada para procedimentos eletivos.'
    ],
    contacts: [
      'fusexpalmasinternacao@gmail.com',
      'prorrogacaointernação@redemedical.com.br',
      'auditoriafusexpalmas@gmail.com.br',
      'Betânia: (63) 98136-6947',
      'Dr. Bryan: (61) 98440-2960'
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          'Atendimento de urgência sem autorização prévia.',
          'RX, TC, USG e ECG de urgência liberados com pedido do médico do PS.',
          'Ressonância com sedação: solicitar junto com o código da anestesia.'
        ]
      }
    }
  },
  {
    id: 'GAMASAÚDE',
    name: 'GAMA SAÚDE',
    badge: 'GM',
    category: 'Privado',
    labUrgencia: 'AUTORIZAR',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'AUTORIZAR CONFORME CÓDIGO',
    criticalNotes: [
      'UTI: NÃO CREDENCIADO — NÃO ATENDER UTI PELO PLANO GAMA SAÚDE.'
    ],
    accessCredentials: [
      ['Portal Gama', 'https://gama.topsaudehub.com.br/PortalCredenciado'],
      ['Login', '40090197_AUT'],
      ['Senha', 'Medical25@']
    ],
    contacts: ['(35) 3629-8000', 'remocao.gama@gamasaude.com.br'],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          '10101039 — Consulta em Pronto Socorro, quantidade 01.',
          'Caráter: Urgência e Emergência.',
          'Radiologia, Tomografia e USG: seguir mesmo fluxo da consulta no portal.'
        ]
      }
    }
  },
  {
    id: 'GOLDEN CROSS',
    name: 'GOLDEN CROSS',
    badge: 'GC',
    category: 'Privado',
    labUrgencia: 'AUTORIZAR',
    pacotePs: 'CONSULTA + TODOS PROCEDIMENTOS',
    imagemUrgencia: 'AUTORIZAR',
    accessCredentials: [
      ['Portal Golden', 'https://portal.goldentiss.com.br/portaltiss/tiss/info/home.golden'],
      ['Login', '12.955.953/0001-92'],
      ['Senha', 'Kora2022']
    ],
    contacts: [
      '4002-2001',
      'procedimento@goldencross.com.br',
      'internado.opme@goldencross.com.br',
      'prorrogacao.df@goldencross.com.br'
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          'Verificar elegibilidade; não necessita de TOKEN.',
          'Obter autorização prévia para consulta e todos os procedimentos diagnósticos.',
          'Procedimento com porte anestésico: utilizar a mesma senha liberada para o procedimento principal.'
        ]
      }
    }
  },
  {
    id: 'MARINHA',
    name: 'MARINHA DO BRASIL',
    badge: 'MB',
    category: 'Militar',
    labUrgencia: 'POR E-MAIL',
    pacotePs: 'GUIA / SOLICITAÇÃO POR E-MAIL',
    imagemUrgencia: 'POR E-MAIL',
    accessCredentials: [
      ['Forma de autorização', 'SOLICITAR OBRIGATORIAMENTE POR E-MAIL'],
      ['E-mail 1', 'andreina.amaral@marinha.mil.br'],
      ['E-mail 2', 'goncalves.santos@marinha.mil.br'],
      ['E-mail 3', 'costa.amaral@marinha.mil.br'],
      ['E-mail 4', 'lucas.scherr@marinha.mil.br']
    ],
    contacts: [
      'julio.cezar1@marinha.mil.br',
      'priscila.marques@redemedical.com.br',
      '(63) 99956-1106',
      '(63) 3216-1715'
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          'Procedimentos de urgência: enviar solicitação por e-mail com cópia da carteirinha e documento com foto.',
          'Procedimentos eletivos: o paciente já deve apresentar guia previamente autorizada.'
        ]
      }
    }
  },
  {
    id: 'PASA VALE',
    name: 'PASA / VALE',
    badge: 'PA',
    category: 'Autogestão',
    labUrgencia: 'NÃO NO PACOTE PS',
    pacotePs: 'PACOTE URGÊNCIA/EMERGÊNCIA',
    imagemUrgencia: 'CONFORME POP',
    accessCredentials: [
      ['Portal Conecta Saúde', 'https://portalconectasaude.com.br/'],
      ['Login', 'prorrogacaointernacao@redemedical.com.br'],
      ['Senha', 'Medical2025.']
    ],
    contacts: ['4004-0183'],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          'Sempre verificar elegibilidade no portal (status: HABILITADO).',
          'Pacote PS de urgência/emergência: inclui exames laboratoriais e ECG de rotina do PS.',
          'Retorno no PS: válido por até 48 horas com o mesmo CID ou queixa clínica.'
        ]
      }
    }
  },
  {
    id: 'UNAFISCO',
    name: 'UNAFISCO SAÚDE',
    badge: 'UN',
    category: 'Autogestão',
    labUrgencia: 'AUTORIZAR',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'AUTORIZAR LABORATÓRIO E RX',
    criticalNotes: [
      'Atender SOMENTE carteirinha UNAFISCO PREMIUM (cor preta), conforme o POP.',
      'Validade das guias autorizadas: 90 dias.'
    ],
    accessCredentials: [
      ['Portal Unafisco', 'https://novowebplanunafisco.facilinformatica.com.br/GuiasTISS/Home'],
      ['Usuário MEDICAL', '12955953000192'],
      ['Senha MEDICAL', '12955953000192'],
      ['Código Contratado', '468.235/12-1']
    ],
    contacts: ['0800 028 2777'],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          '10101039 — Consulta em Pronto Socorro.',
          'Solicitar autorização prévia para todos os exames laboratoriais e Raio-X.'
        ]
      }
    }
  },
  {
    id: 'VIGIMED',
    name: 'VIGIMED',
    badge: 'VG',
    category: 'Privado',
    labUrgencia: 'NÃO',
    pacotePs: 'ATENDIMENTO CLÍNICO SEM AUTORIZAÇÃO',
    imagemUrgencia: 'RADIOLOGIA E USG SEM AUTORIZAÇÃO',
    criticalNotes: [
      'Obrigatório apresentar o CARTÃO VIGIMED PRIME físico ou digital.',
      'Não precisa de autorização no site para consulta clínica, RX e Ultrassom.'
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          'Atendimento clínico direto sem necessidade de autorização prévia.',
          'RX e USG liberados com pedido do médico assistente.'
        ]
      }
    }
  },
  {
    id: 'BEST SAÚDE',
    name: 'BEST SENIOR / BEST SAÚDE',
    badge: 'BS',
    category: 'Privado',
    labUrgencia: 'SIM AUTORIZAR',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'RAIO X',
    accessCredentials: [
      ['Portal', 'https://novowebplanbestsenior.facilinformatica.com.br/GuiasTISS/GuiaSPSADT/ViewGuiaSPSADT'],
      ['Login', '12955953000192'],
      ['Senha', 'palmas@2026']
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          '10101039 — Consulta em Pronto Socorro.',
          'Autorizar exames de imagem e laboratoriais.'
        ]
      }
    }
  },
  {
    id: 'PETROBRAS',
    name: 'PETROBRAS / AMS',
    badge: 'PB',
    category: 'Autogestão',
    labUrgencia: 'NÃO',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'Solicitar Autorização em todos os pedidos.',
    accessCredentials: [
      ['Portal Petrobras', 'https://portaltiss.saudepetrobras.com.br/saudeweb/'],
      ['Login', '12955953000192'],
      ['Senha', 'Medical@2025']
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          '10101039 — Consulta em Pronto-Socorro.',
          'Solicitar autorização para procedimentos especiais e exames complexos.'
        ]
      }
    }
  },
  {
    id: 'PLAN ASSISTE',
    name: 'PLAN ASSISTE (MPF / MPU)',
    badge: 'PA',
    category: 'Autogestão',
    labUrgencia: 'SIM AUTORIZAR',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'Solicitar Autorização em todos os pedidos.',
    accessCredentials: [
      ['Portal Exames Eletivos', 'https://sistema.planassiste.mpu.mp.br/WSTISS/Default.aspx'],
      ['Portal Autorizador', 'https://sistema.planassiste.mpu.mp.br/autorizadorweb/login.aspx'],
      ['Login', '12955953000192'],
      ['Senha', 'OFIRVB28'],
      ['Responsável Master', 'isaias.silva@redemedical.com.br']
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          '10101039 — Consulta em Pronto Socorro.',
          'Solicitar autorização em todos os pedidos de exames.'
        ]
      }
    }
  },
  {
    id: 'POSTAL SAÚDE',
    name: 'POSTAL SAÚDE (CORREIOS)',
    badge: 'PS',
    category: 'Autogestão',
    labUrgencia: 'SIM',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'Solicitar Autorização em todos os pedidos.',
    accessCredentials: [
      ['Portal Postal Saúde', 'https://autorizador.postalsaudeservicos.com.br/autorizadorpro/custom/CustomLogin.aspx'],
      ['Login', '12955953000192'],
      ['Senha', 'Kora2026@']
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          '10101039 — Consulta em Pronto-Socorro.',
          'Solicitar autorização para internação e SADT.'
        ]
      }
    }
  },
  {
    id: 'PRO SOCIAL',
    name: 'PRO-SOCIAL (TRF1)',
    badge: 'PR',
    category: 'Autogestão',
    labUrgencia: 'SIM AUTORIZAR',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'Solicitar Autorização em todos os pedidos.',
    accessCredentials: [
      ['Portal Pro-Social', 'https://prosocial.trf1.jus.br/prosocial/login.aspx'],
      ['Login', '12955953000192'],
      ['Senha', 'hCP2015']
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          '10101039 — Consulta em Pronto Socorro.',
          'Autorizar exames no portal TRF1.'
        ]
      }
    }
  },
  {
    id: 'PRO TOCANTINS',
    name: 'FA-SAUDE (PRO-TOCANTINS)',
    badge: 'FS',
    category: 'Estadual',
    labUrgencia: 'SIM AUTORIZAR',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'Solicitar Autorização em todos os pedidos.',
    accessCredentials: [
      ['Portal Novo (FA Saúde)', 'https://servicos.fasaudefpto.com.br/prestador/index.php'],
      ['Login', 'MEDICAL'],
      ['Senha', '123456'],
      ['Portal Antigo (FamSaúde)', 'https://novowebplanfamsaude.facilinformatica.com.br/GuiasTISS/Logon']
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          '10101039 — Consulta em Pronto Socorro.',
          'Utilizar o novo portal FA Saúde com usuário e senha do prestador.'
        ]
      }
    }
  },
  {
    id: 'SEPACO',
    name: 'SEPACO',
    badge: 'SP',
    category: 'Privado',
    labUrgencia: 'NÃO',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'Solicitar Autorização em todos os pedidos.',
    accessCredentials: [
      ['Portal SEPACO', 'https://portalag2.sepaco.org.br/login'],
      ['Login', '0003458'],
      ['Senha', 'Medical2025']
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: ['10101039 — Consulta em Pronto Socorro.']
      }
    }
  },
  {
    id: 'SUL AMÉRICA',
    name: 'SUL AMÉRICA SAÚDE',
    badge: 'SA',
    category: 'Seguradora',
    labUrgencia: 'SIM',
    pacotePs: '64620107',
    imagemUrgencia: 'Raio X e Tomografia',
    accessCredentials: [
      ['Portal SulAmérica', 'Portal do Prestador SulAmérica'],
      ['Login', '100000015181 / MASTER'],
      ['Senha', '@medic18']
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          'Código PS: 64620107.',
          'RX e Tomografia no PS exigem autorização.'
        ]
      }
    }
  },
  {
    id: 'LIFE EMPRESARIAL',
    name: 'LIFE EMPRESARIAL',
    badge: 'LE',
    category: 'Privado',
    labUrgencia: 'AUTORIZAR',
    pacotePs: 'CONSULTA + EXAMES CONFORME PORTAL',
    imagemUrgencia: 'Raio-X, Tomografia e USG exigem autorização',
    accessCredentials: [
      ['Portal Life Empresarial', 'https://portal.lifeempresarial.com.br/PlanodeSaude/'],
      ['Login (CNPJ)', '12955953000192'],
      ['Senha', 'Medical@2026'],
      ['Responsável', 'Recepção e-mail']
    ],
    contacts: [
      'Site: https://portal.lifeempresarial.com.br/PlanodeSaude/',
      'Central de Atendimento Prestador'
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          'Acesso ao portal Life Empresarial com CNPJ 12955953000192 e nova senha: Medical@2026.',
          'Verificar elegibilidade do beneficiário antes do atendimento.',
          'Solicitar autorização prévia para exames laboratoriais e de imagem no portal do prestador.',
          'Colher assinatura obrigatória do paciente na Guia TISS física (campo 57).'
        ]
      }
    }
  },
  {
    id: 'NOTREDAME',
    name: 'NOTREDAME INTERMÉDICA (GNDI)',
    badge: 'ND',
    category: 'Privado',
    labUrgencia: 'A preencher',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'A preencher',
    accessCredentials: [
      ['Portal GNDI / Savi', 'https://savi.hapvida.com.br/savi-atendimento/'],
      ['Login', '12955953000192'],
      ['Senha', 'Redemedical123'],
      ['Observações', 'Portal Savi Hapvida GNDI']
    ],
    contacts: [
      'A preencher com os telefones e contatos oficiais do convênio'
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          'Aguardando inclusão de diretrizes e regras operacionais do convênio.',
          'Acesso pelo portal Savi Hapvida GNDI com usuário e senha institucionais.'
        ]
      }
    }
  },
  {
    id: 'OMINT',
    name: 'OMINT SAÚDE',
    badge: 'OM',
    category: 'Seguradora',
    labUrgencia: 'A preencher',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'A preencher',
    accessCredentials: [
      ['Portal Credenciado Omint', 'https://www.omint.com.br/credenciado/'],
      ['Login', 'A preencher'],
      ['Senha', 'A preencher']
    ],
    contacts: [
      'A preencher com os telefones e contatos oficiais do convênio'
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          'Aguardando inclusão de diretrizes e regras operacionais do convênio.'
        ]
      }
    }
  },
  {
    id: 'SUS',
    name: 'SUS (SISTEMA ÚNICO DE SAÚDE)',
    badge: 'SUS',
    category: 'Estadual',
    labUrgencia: 'A preencher',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'A preencher',
    accessCredentials: [
      ['Sistema / Regulação', 'SISREG / CNES / BPA'],
      ['Login', 'A preencher'],
      ['Senha', 'A preencher']
    ],
    contacts: [
      'Central de Regulação Estadual / Municipal'
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          'Fluxo de atendimento SUS / Regulação de leitos e urgência.',
          'Aguardando inclusão de diretrizes e regras operacionais do convênio.'
        ]
      }
    }
  },
  {
    id: 'SEMUS',
    name: 'SEMUS PALMAS',
    badge: 'SM',
    category: 'Estadual',
    labUrgencia: 'A preencher',
    pacotePs: '10101039 CONSULTA EM PRONTO SOCORRO',
    imagemUrgencia: 'A preencher',
    accessCredentials: [
      ['Regulação SEMUS', 'Central de Regulação de Urgência de Palmas'],
      ['Login', 'A preencher'],
      ['Senha', 'A preencher']
    ],
    contacts: [
      'Secretaria Municipal de Saúde de Palmas'
    ],
    sections: {
      ps: {
        id: 'ps',
        label: 'Pronto-Socorro',
        textItems: [
          'Atendimento regulado pela Secretaria Municipal de Saúde de Palmas.',
          'Aguardando inclusão de diretrizes e regras operacionais do convênio.'
        ]
      }
    }
  }
];
