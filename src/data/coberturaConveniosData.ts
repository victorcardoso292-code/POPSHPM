export interface ServiceCoverageStatus {
  status: 'COBERTO_DIRETO' | 'COBERTO_COM_AUTORIZACAO' | 'PACOTE_PS' | 'RESTRITO' | 'NAO_COBERTO' | 'SOB_CONSULTA';
  descricao: string;
  codigoTuss?: string;
  observacao?: string;
}

export interface ConvenioCoverage {
  id: string;
  name: string;
  badge: string;
  category: 'Estadual' | 'Autogestão' | 'Seguradora' | 'Privado' | 'Militar' | 'Particular';
  registroAns?: string;
  acomodacaoPadrao: 'Apartamento' | 'Enfermaria' | 'Conforme Plano (Verificar Carteira)' | 'Conforme Posto / Graduação' | 'Sem Internação';
  exigeTokenBiometria: boolean;
  tipoToken?: string;
  portalAutorizacao: {
    nome: string;
    url: string;
    tipo: string;
  };
  telefonesUteis: string[];
  
  // Matriz de Serviços
  servicos: {
    psAdulto: ServiceCoverageStatus;
    psInfantil: ServiceCoverageStatus;
    internacaoClinica: ServiceCoverageStatus;
    internacaoCirurgica: ServiceCoverageStatus;
    utiAdulto: ServiceCoverageStatus;
    utiNeoPed: ServiceCoverageStatus;
    examesLaboratorioPs: ServiceCoverageStatus;
    examesImagemPs: ServiceCoverageStatus; // RX, Tomografia, RM
    hemodinamica: ServiceCoverageStatus;
    maternidadeParto: ServiceCoverageStatus;
    parecerMedicoPs: ServiceCoverageStatus;
    parecerMedicoInternacao: ServiceCoverageStatus;
    fisioterapiaInternacao: ServiceCoverageStatus;
  };

  regrasAcomodacao: string;
  carenciasUrgencia: string;
  carenciasEletivas: string;
  alertasCriticos: string[];
  documentosObrigatorios: string[];
  instrucoesRecepcao: string[];
}

export const COBERTURA_CONVENIOS_DATA: ConvenioCoverage[] = [
  // 1. SERVIR
  {
    id: 'SERVIR',
    name: 'SERVIR (Governo do Tocantins)',
    badge: 'SR',
    category: 'Estadual',
    registroAns: 'Plano Estadual de Assistência',
    acomodacaoPadrao: 'Enfermaria',
    exigeTokenBiometria: false,
    portalAutorizacao: {
      nome: 'Portal do Prestador SERVIR',
      url: 'https://servir.insidemed.com.br/',
      tipo: 'Web Direto / InsideMed'
    },
    telefonesUteis: [
      'Central SERVIR: 0800 911 4040',
      'Remoção LISS CARE: 0800 911 4040'
    ],
    servicos: {
      psAdulto: {
        status: 'PACOTE_PS',
        descricao: 'Coberto via Pacote Pronto-Socorro Adulto.',
        codigoTuss: '10101037',
        observacao: 'Inclui consulta médica, triagem, medicação rápida e curativos simples.'
      },
      psInfantil: {
        status: 'PACOTE_PS',
        descricao: 'Coberto via Pacote Pronto-Socorro Pediatria.',
        codigoTuss: '10101038',
        observacao: 'Atendimento pediátrico em urgência/emergência.'
      },
      internacaoClinica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cobertura exclusiva em leito de ENFERMARIA.',
        codigoTuss: '60000783 + 10102019',
        observacao: 'Alerta: Beneficiário Servir só tem direito à enfermaria. Se quiser apartamento, deve pagar diferença particular.'
      },
      internacaoCirurgica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cirurgias de urgência e eletivas autorizadas pelo portal.',
        codigoTuss: 'Conforme procedimento',
        observacao: 'Materiais acima de R$ 1.000,00 e medicamentos especiais exigem autorização específica.'
      },
      utiAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pacote de UTI Adulto Global.',
        codigoTuss: '60000999',
        observacao: 'Manter diária de UTI global autorizada no sistema.'
      },
      utiNeoPed: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Coberto com solicitação de vaga regulada e autorização.',
        codigoTuss: '60000999',
        observacao: 'Regulação de leito intensivo pediátrico/neonatal.'
      },
      examesLaboratorioPs: {
        status: 'COBERTO_DIRETO',
        descricao: 'Exames laboratoriais básicos do PS inclusos no atendimento de urgência.',
        observacao: 'Não precisa autorização prévia na urgência (está caindo direto).'
      },
      examesImagemPs: {
        status: 'PACOTE_PS',
        descricao: 'RX e Ressonância Magnética inclusos no pacote do Pronto-Socorro.',
        observacao: 'NÃO precisa pegar autorização no site para RX e RM no PS. Imprimir capa TASY e colher assinatura na guia.'
      },
      hemodinamica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cateterismo cardíaco e angioplastia com autorização urgente.',
        codigoTuss: '40801010 / 40801029',
        observacao: 'Cardiopatias agudas com relatório médico circunstanciado.'
      },
      maternidadeParto: {
        status: 'RESTRITO',
        descricao: 'Atendimento emergencial de parto e transferência ou regulação conforme contrato.',
        observacao: 'Verificar carência obstétrica no portal do Servir.'
      },
      parecerMedicoPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer de especialista urgência/emergência para UTI ou PS.',
        codigoTuss: '40601130',
        observacao: 'NÃO está incluso no pacote do PS. Solicitar separadamente no portal.'
      },
      parecerMedicoInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer de especialista na internação.',
        codigoTuss: '40601120',
        observacao: 'Exige justificativa médica do assistente.'
      },
      fisioterapiaInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Assistência fisiátrica respiratória em internado.',
        codigoTuss: '2.02.03.04-7 / 2.01.03.34-4',
        observacao: 'Solicitar código de miopatias ou respiratória.'
      }
    },
    regrasAcomodacao: 'PACIENTE SÓ TEM DIREITO A ENFERMARIA. Para acomodação em apartamento, o paciente ou familiar deve assinar Termo de Upgrade e pagar a diferença como particular.',
    carenciasUrgencia: '24 horas para urgência e emergência com risco de vida.',
    carenciasEletivas: 'Conforme carências do Servir (consultas 30 dias, exames 90 a 180 dias, cirurgias 180 dias).',
    alertasCriticos: [
      'ALERTA CRÍTICO: PACIENTE SÓ TEM DIREITO A ENFERMARIA. Proibido internar em apartamento sem termo particular.',
      'RX e RM no PS estão inclusos no pacote do Pronto-Socorro. Não precisa de autorização no site.',
      'OBRIGATÓRIO colher assinatura física do paciente na Guia TISS e anexar a capa TASY.',
      'Medicamentos acima de R$ 1.000,00 e antifúngicos acima de R$ 300,00 exigem justificativa e autorização prévia.'
    ],
    documentosObrigatorios: [
      'Documento oficial com foto (RG ou CNH)',
      'Cartão do Beneficiário SERVIR',
      'Guia TISS impressa com assinatura legível',
      'Capa TASY grampeada com a guia'
    ],
    instrucoesRecepcao: [
      'Verificar no sistema InsideMed a regularidade do servidor.',
      'Lançar código 10101037 (Adulto) ou 10101038 (Pediatria).',
      'Não cobrar taxa de RX/RM se prescrito na urgência do PS.',
      'Colher assinatura imediatamente na admissão.'
    ]
  },

  // 2. BRADESCO SAÚDE
  {
    id: 'BRADESCO',
    name: 'BRADESCO SAÚDE',
    badge: 'BR',
    category: 'Seguradora',
    registroAns: '005711',
    acomodacaoPadrao: 'Conforme Plano (Verificar Carteira)',
    exigeTokenBiometria: true,
    tipoToken: 'Biometria Facial / Token no App Bradesco Saúde',
    portalAutorizacao: {
      nome: 'Portal Bradesco Saúde do Prestador',
      url: 'https://www.bradescoseguros.com.br/prestador',
      tipo: 'Web Prestador / Conectividade'
    },
    telefonesUteis: [
      'Central Prestador: 4004-0237 / 0800 237 0237',
      'Central Segurado: 4004-2700'
    ],
    servicos: {
      psAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Consulta e pronto atendimento adulto 24h.',
        codigoTuss: '10101039',
        observacao: 'Exige validação do Token no app ou Biometria Facial antes do atendimento.'
      },
      psInfantil: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto atendimento infantil e pediátrico.',
        codigoTuss: '10101039',
        observacao: 'Necessário documento com foto do responsável e certidão/RG da criança.'
      },
      internacaoClinica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Internação clínica em Enfermaria ou Apartamento conforme categoria da carteirinha.',
        codigoTuss: '10102019 + Diárias',
        observacao: 'Conferir no portal: Linha Top/Nacional geralmente é Apartamento; Linha Efetivo/Flex pode ser Enfermaria.'
      },
      internacaoCirurgica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cirurgias gerais, ortopédicas, cardíacas e neurológicas.',
        codigoTuss: 'Tabela TUSS CBHPM',
        observacao: 'Cirurgias eletivas exigem senha prévia autorizada. Urgências exigem abertura de sinistro em até 48h.'
      },
      utiAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'UTI Geral e Coronariana autorizada.',
        codigoTuss: '60001038 + 10104020',
        observacao: 'Enviar relatório médico circunstanciado na admissão na UTI.'
      },
      utiNeoPed: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'UTI Neonatal e Pediátrica completa.',
        codigoTuss: '60001062 / 60001054',
        observacao: 'Cobertura assegurada aos recém-nascidos nos primeiros 30 dias de vida no plano da mãe.'
      },
      examesLaboratorioPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Exames laboratoriais liberados no sistema Bradesco.',
        observacao: 'Autorização online rápida via portal prestador.'
      },
      examesImagemPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'RX, Tomografia e Ressonância liberados mediante senha.',
        observacao: 'RX simples possui liberação direta. Tomografia e Ressonância no PS exigem pedido médico detalhado.'
      },
      hemodinamica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cateterismo, angioplastia e procedimentos cardiovasculares de alta complexidade.',
        codigoTuss: '40801010',
        observacao: 'Autorização em regime de urgência via central 24h.'
      },
      maternidadeParto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parto normal e cesárea com equipe obstétrica credenciada.',
        codigoTuss: '31309038 / 31909127',
        observacao: 'Verificar se o plano contratado possui cobertura obstétrica (C/OBST).'
      },
      parecerMedicoPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Avaliação médica de especialista no PS.',
        codigoTuss: '10101039 ou Parecer',
        observacao: 'Lançar com CRM do especialista consultado.'
      },
      parecerMedicoInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico em paciente internado.',
        codigoTuss: '10102019',
        observacao: 'Justificar a especialidade médica solicitada no prontuário.'
      },
      fisioterapiaInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Fisioterapia motora e respiratória hospitalar.',
        codigoTuss: '20103477 / 20103523',
        observacao: 'Sessões autorizadas por prescrição da equipe multidisciplinar.'
      }
    },
    regrasAcomodacao: 'A acomodação depende estritamente do plano impresso na carteirinha: Linhas "Nacional Top", "Plus" e "Premium" possuem cobertura para APARTAMENTO INDIVIDUAL. Planos "Efetivo", "Hospitalar" e "Perfil" possuem cobertura para ENFERMARIA.',
    carenciasUrgencia: '24 horas para urgência e emergência.',
    carenciasEletivas: '30 dias consultas e exames simples; 180 dias cirurgias e internações; 300 dias parto a termo.',
    alertasCriticos: [
      'VALIDAÇÃO OBRIGATÓRIA: Não atender sem validação de Token pelo App Bradesco Saúde ou Biometria Facial.',
      'Sempre verificar na tela do portal se a carteirinha está com status "ATIVO" e se há carências pendentes.',
      'Se o plano for sem obstetrícia, atendimentos relacionados a parto não têm cobertura.',
      'OPME deve ser solicitada com antecedência mínima de 10 dias úteis para eletivos.'
    ],
    documentosObrigatorios: [
      'Documento de identidade oficial com foto e CPF',
      'Carteira digital Bradesco Saúde no smartphone',
      'Token de validação gerado na hora ou biometria',
      'Guia TISS assinada pelo paciente'
    ],
    instrucoesRecepcao: [
      'Solicitar ao paciente para abrir o App Bradesco Saúde e gerar o Token de Atendimento.',
      'Digitar o número da carteirinha com 16 dígitos no portal.',
      'Conferir se o tipo de acomodação no espelho do portal é Apartamento ou Quarto Coletivo.',
      'Imprimir o comprovante de autorização com a assinatura do titular/beneficiário.'
    ]
  },

  // 3. FA-SAÚDE (FUNDAÇÃO PRÓ-TOCANTINS)
  {
    id: 'FA-SAUDE',
    name: 'FA-SAÚDE (Fundação Pró-Tocantins)',
    badge: 'FA',
    category: 'Militar',
    registroAns: 'Autogestão Militar Tocantins',
    acomodacaoPadrao: 'Conforme Plano (Verificar Carteira)',
    exigeTokenBiometria: false,
    portalAutorizacao: {
      nome: 'Portal do Prestador FA-Saúde / Pró-Tocantins',
      url: 'https://autorizador.protocantins.org.br/',
      tipo: 'Web Autorizador'
    },
    telefonesUteis: [
      'Central FA-Saúde: (63) 3218-4000 / (63) 99974-5555',
      'Auditoria Médica Pró-Tocantins'
    ],
    servicos: {
      psAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Atendimento de urgência e emergência 24h para militares e dependentes.',
        codigoTuss: '10101039',
        observacao: 'Autorização online no portal FA-Saúde.'
      },
      psInfantil: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Urgência pediátrica para dependentes cadastrados.',
        codigoTuss: '10101039',
        observacao: 'Verificar elegibilidade do dependente no portal.'
      },
      internacaoClinica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Internação clínica autorizada.',
        codigoTuss: '10102019 + Diárias',
        observacao: 'Acomodação varia entre Oficiais (Apartamento) e Praças (Enfermaria/Apartamento conforme plano individual).'
      },
      internacaoCirurgica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Procedimentos cirúrgicos com autorização prévia.',
        codigoTuss: 'CBHPM / TUSS',
        observacao: 'Cirurgias eletivas devem passar por prévia autorização da diretoria de saúde da FPTO.'
      },
      utiAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Diárias de UTI Adulto cobertas.',
        codigoTuss: '60001038',
        observacao: 'Notificar auditoria médica do FA-Saúde nas primeiras 24h.'
      },
      utiNeoPed: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'UTI Pediátrica e Neonatal.',
        codigoTuss: '60001054 / 60001062',
        observacao: 'Inclusão de recém-nascido exige certidão de nascimento.'
      },
      examesLaboratorioPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Exames laboratoriais na urgência do PS.',
        observacao: 'Liberar no portal do prestador.'
      },
      examesImagemPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'RX, Tomografia e Ultrassonografia.',
        observacao: 'Ressonância Magnética no PS requer laudo e justificativa emergencial anexados.'
      },
      hemodinamica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Hemodinâmica e cardiologia invasiva cobertas.',
        codigoTuss: '40801010',
        observacao: 'Urgência com relatório médico imediato.'
      },
      maternidadeParto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Assistência obstétrica integral para beneficiárias com carência cumprida.',
        codigoTuss: '31309038 / 31909127',
        observacao: 'Parto normal ou cesárea com indicação clínica.'
      },
      parecerMedicoPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico no Pronto-Socorro.',
        codigoTuss: '10102011',
        observacao: 'ATENÇÃO AO CÓDIGO TUSS: No FA-Saúde o parecer de urgência utiliza o código 10102011.'
      },
      parecerMedicoInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico em internação.',
        codigoTuss: '10102011 / 10102019',
        observacao: 'Informar motivo clínico e especialidade do parecerista.'
      },
      fisioterapiaInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Fisioterapia motora e respiratória.',
        codigoTuss: '20103477',
        observacao: 'Sessões registradas no prontuário hospitalar.'
      }
    },
    regrasAcomodacao: 'Verificar no portal Pró-Tocantins a categoria funcional do titular: Oficiais têm direito a APARTAMENTO; Praças têm direito conforme plano contratado (Enfermaria ou Apartamento com coparticipação reduzida).',
    carenciasUrgencia: '24 horas para urgência/emergência.',
    carenciasEletivas: '30 a 180 dias para procedimentos eletivos.',
    alertasCriticos: [
      'REGRA ANTI-GLOSA: Código de Parecer Médico no FA-Saúde é 10102011 (não faturar 10102019 ou 40601130).',
      'Guia física deve conter carimbo e assinatura do médico assistente e assinatura legível do paciente militar.',
      'Sempre verificar validade da carteira no portal (evitar atender militar exonerado ou afastado).'
    ],
    documentosObrigatorios: [
      'Identidade Militar (PM/CBM-TO) ou RG civil',
      'Carteira do plano FA-Saúde (física ou digital)',
      'Guia autorizada no portal Pró-Tocantins impressa'
    ],
    instrucoesRecepcao: [
      'Acessar o portal autorizador com o código de prestador do Palmas Medical.',
      'Inserir a matrícula e conferir os dependentes vinculados.',
      'Para pareceres, lançar obrigatoriamente o código 10102011.',
      'Manter a guia TISS com a via do paciente assinada.'
    ]
  },

  // 4. UNIMED PALMAS / INTERCÂMBIO
  {
    id: 'UNIMED',
    name: 'UNIMED PALMAS & INTERCÂMBIO',
    badge: 'UN',
    category: 'Privado',
    registroAns: '344885',
    acomodacaoPadrao: 'Conforme Plano (Verificar Carteira)',
    exigeTokenBiometria: true,
    tipoToken: 'Token no Aplicativo Unimed Cliente ou Biometria Facial',
    portalAutorizacao: {
      nome: 'Portal do Prestador Unimed / Autorizador Web',
      url: 'https://unimedpalmas.coop.br/prestador',
      tipo: 'Autorizador Web Unimed / WPD'
    },
    telefonesUteis: [
      'Central Unimed Palmas: (63) 3219-5000 / 0800 642 5000',
      'Intercâmbio Nacional Unimed: 0800 940 4774'
    ],
    servicos: {
      psAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto atendimento adulto 24h Unimed Local e Intercâmbio Nacional.',
        codigoTuss: '10101039',
        observacao: 'Validação obrigatória de biometria facial ou token no app Unimed Cliente.'
      },
      psInfantil: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto atendimento infantil e pediatria 24h.',
        codigoTuss: '10101039',
        observacao: 'Para crianças menores de 7 anos, validação via token no celular do responsável.'
      },
      internacaoClinica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Internação clínica em Enfermaria ou Apartamento conforme carteirinha.',
        codigoTuss: '10102019 + Diárias',
        observacao: 'Verificar se o plano é "Unifácil", "Básico" (Enfermaria) ou "Especial", "Master" (Apartamento).'
      },
      internacaoCirurgica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cirurgias gerais, ortopedia, urologia, neurocirurgia e vasculares.',
        codigoTuss: 'TUSS Unimed',
        observacao: 'Cirurgias eletivas exigem senha pré-autorizada dentro da validade (60 dias).'
      },
      utiAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'UTI Adulto credenciada.',
        codigoTuss: 'Diárias UTI Unimed',
        observacao: 'Comunicação obrigatória de vaga de UTI à auditoria concorrente Unimed.'
      },
      utiNeoPed: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'UTI Neonatal e Pediátrica credenciada.',
        codigoTuss: 'Diárias UTI Pediátrica',
        observacao: 'Recém-nascido atendido pelo plano materno até o 30º dia de vida.'
      },
      examesLaboratorioPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Exames laboratoriais na urgência do PS liberados no sistema.',
        observacao: 'Autorização online automática para exames de urgência.'
      },
      examesImagemPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'RX e Tomografia liberados no PS. RM requer justificativa emergencial.',
        observacao: 'Ressonância Magnética no PS deve ser solicitada com indicação clínica e laudo prévio.'
      },
      hemodinamica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Hemodinâmica, angiografia e procedimentos coronarianos invasivos.',
        codigoTuss: '40801010',
        observacao: 'Intervenções de urgência com liberação imediata via plantão auditor Unimed.'
      },
      maternidadeParto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parto normal, cesárea e centro obstétrico cobertos (se plano C/ Obstetrícia).',
        codigoTuss: '31309038 / 31909127',
        observacao: 'Planos hospitalares sem obstetrícia não cobrem o evento de parto eletivo.'
      },
      parecerMedicoPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer de especialista no PS.',
        codigoTuss: '10101039 (Interconsulta)',
        observacao: 'Registrar CRM do especialista e justificativa do emergencista.'
      },
      parecerMedicoInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico em leito de internação.',
        codigoTuss: '10102019',
        observacao: 'Autorização concedida no prontuário eletrônico.'
      },
      fisioterapiaInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Fisioterapia respiratória e motora.',
        codigoTuss: '20103477 / 20103523',
        observacao: 'Lançamento das sessões prescritas pelo intensivista/clínico.'
      }
    },
    regrasAcomodacao: 'Acomodação rigorosamente atrelada ao contrato: Código na carteirinha "ENF" = Enfermaria (Quarto Coletivo); Código "APT" = Apartamento Individual Privativo. Para planos Unimed Intercâmbio, a tela de elegibilidade indica a acomodação contratada.',
    carenciasUrgencia: '24 horas para urgência/emergência.',
    carenciasEletivas: 'Conforme carências do contrato (30 a 180 dias).',
    alertasCriticos: [
      'INTERCÂMBIO NACIONAL: Clientes de outras Unimeds (ex: Unimed Goiânia, Unimed BH, Central Nacional Unimed) exigem validação de transação de intercâmbio.',
      'BIOMETRIA / TOKEN: Obrigatório validar biometria facial ou token no App Unimed Cliente para evitar glosa de elegibilidade.',
      'Sempre verificar a data de validade da carteira e se o titular não está bloqueado financeiramente.',
      'Na internação eletiva, conferir se a senha de autorização emitida ainda está dentro do prazo de 60 dias.'
    ],
    documentosObrigatorios: [
      'Documento de identificação oficial com foto e CPF',
      'Carteirinha Unimed física ou virtual no aplicativo',
      'Token gerado no aplicativo Unimed Cliente',
      'Guia de atendimento assinada'
    ],
    instrucoesRecepcao: [
      'Digitar o número da carteirinha completo (0 e código da Unimed de origem).',
      'Solicitar a validação de biometria facial do paciente na câmera ou digitar o Token.',
      'Conferir tipo de acomodação (Apartamento vs Enfermaria).',
      'Imprimir o comprovante e colher assinatura.'
    ]
  },

  // 5. CASSI (BANCO DO BRASIL)
  {
    id: 'CASSI',
    name: 'CASSI (Banco do Brasil)',
    badge: 'CS',
    category: 'Autogestão',
    registroAns: '346659',
    acomodacaoPadrao: 'Apartamento',
    exigeTokenBiometria: false,
    portalAutorizacao: {
      nome: 'Portal Autenticador Orizon (Polimed)',
      url: 'https://www.polimed.com.br/autenticadorOrizon/loginAutenticador',
      tipo: 'Autenticador Orizon / Web Polimed'
    },
    telefonesUteis: [
      'Central CASSI: 0800 729 0090 / 0800 729 0080',
      'Suporte Portal Orizon: 4004-4550',
      'E-mail: go.negociacao@cassi.com.br'
    ],
    servicos: {
      psAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto-Socorro Adulto coberto via portal Orizon.',
        codigoTuss: '10101039',
        observacao: 'Consulta e atendimentos de urgência lançados no autenticador Orizon.'
      },
      psInfantil: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto-Socorro Infantil e Pediatria.',
        codigoTuss: '10101039',
        observacao: 'Lançar atendimento de dependentes no Orizon.'
      },
      internacaoClinica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Internação clínica com padrão predominante em APARTAMENTO.',
        codigoTuss: '10102019 + 60000554',
        observacao: 'Plano CASSI Associados possui acomodação em Apartamento; plano CASSI Família verificar carteirinha.'
      },
      internacaoCirurgica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cirurgias gerais e de alta complexidade.',
        codigoTuss: 'TUSS / CBHPM',
        observacao: 'Após solicitar no portal Orizon, é OBRIGATÓRIO telefonar para a central CASSI para validar.'
      },
      utiAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Diárias de UTI Adulto Geral cobertas.',
        codigoTuss: '60001038 + Intensivista',
        observacao: 'Informar prontuário e justificativa médica no Orizon.'
      },
      utiNeoPed: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'UTI Pediátrica e Neonatal com berçário patológico.',
        codigoTuss: '60001054 / 60001062',
        observacao: 'Cobertura integral a recém-nascidos e crianças.'
      },
      examesLaboratorioPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Exames laboratoriais na urgência autorizados no Orizon.',
        observacao: 'Lançar códigos TUSS individuais (Hemograma, Creatinina, Eletrólitos).'
      },
      examesImagemPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'RX, Tomografia e Ressonância no PS exigem autorização no Orizon.',
        observacao: 'Inserir pedido do médico assistente no sistema Orizon.'
      },
      hemodinamica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Hemodinâmica, cateterismo e angioplastias cobertos.',
        codigoTuss: '40801010',
        observacao: 'Procedimento intervencionista de urgência com comunicação à CASSI.'
      },
      maternidadeParto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parto normal e cesárea em centro cirúrgico obstétrico.',
        codigoTuss: '31309038 / 31909127',
        observacao: 'Acomodação em apartamento com direito a acompanhante.'
      },
      parecerMedicoPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer de especialista no PS.',
        codigoTuss: '10102019 ou 10101039',
        observacao: 'Autorizar no Orizon como interconsulta médica.'
      },
      parecerMedicoInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico em paciente internado.',
        codigoTuss: '10102019',
        observacao: 'Justificar no prontuário a especialidade solicitada.'
      },
      fisioterapiaInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Fisioterapia respiratória e motora.',
        codigoTuss: '20103477',
        observacao: 'Lançamento de sessões hospitalares diárias.'
      }
    },
    regrasAcomodacao: 'A imensa maioria dos beneficiários CASSI (Plano Associados) possui direito a APARTAMENTO INDIVIDUAL. Para planos "CASSI Família", conferir na tela do Orizon se a acomodação é Apartamento ou Enfermaria.',
    carenciasUrgencia: '24 horas para urgência/emergência.',
    carenciasEletivas: 'Conforme carências do plano (verificar elegibilidade no Orizon).',
    alertasCriticos: [
      'ALERTA OPERACIONAL CASSI: Após qualquer solicitação de internação no portal Orizon, é OBRIGATÓRIO ligar para a Central CASSI (0800 729 0090) para validar a autorização.',
      'Curativos no PS: tipo SP/SADT, Operadora CASSI, Guia Principal 01, Código TUSS 20104090.',
      'Login Medical no Orizon: 12955953000192 / Prestador 2120820.'
    ],
    documentosObrigatorios: [
      'Documento oficial de identidade com foto e CPF',
      'Cartão do plano CASSI (físico ou no app CASSI)',
      'Guia de autorização emitida pelo Orizon assinada pelo paciente'
    ],
    instrucoesRecepcao: [
      'Abrir o autenticador Orizon (Polimed) e selecionar a operadora CASSI.',
      'Consultar elegibilidade pela matrícula ou CPF.',
      'Emitir a guia SP/SADT para a consulta do PS (10101039) e exames solicitados.',
      'Ligar para o 0800 da CASSI em casos de internação clínica/cirúrgica urgente.'
    ]
  },

  // 6. GEAP SAÚDE
  {
    id: 'GEAP',
    name: 'GEAP SAÚDE (Fundação de Seguridade Social)',
    badge: 'GP',
    category: 'Autogestão',
    registroAns: '323080',
    acomodacaoPadrao: 'Conforme Plano (Verificar Carteira)',
    exigeTokenBiometria: false,
    portalAutorizacao: {
      nome: 'Portal do Prestador GEAP / Conectividade',
      url: 'https://prestador.geap.com.br/',
      tipo: 'Web Prestador GEAP'
    },
    telefonesUteis: [
      'Central GEAP: 0800 728 8300',
      'Central de Autorizações GEAP: 0800 728 8303'
    ],
    servicos: {
      psAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto-Socorro Adulto 24h para servidores federais e dependentes.',
        codigoTuss: '10101039',
        observacao: 'Autorização online rápida no portal do prestador GEAP.'
      },
      psInfantil: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto atendimento infantil.',
        codigoTuss: '10101039',
        observacao: 'Dependente cadastrado no plano de saúde GEAP.'
      },
      internacaoClinica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Internação clínica autorizada.',
        codigoTuss: '10102019 + Diárias',
        observacao: 'Plano GEAP Referência = Enfermaria; GEAP Saúde Clássica / Vida = Apartamento.'
      },
      internacaoCirurgica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cirurgias gerais e de alta complexidade com senha prévia.',
        codigoTuss: 'TUSS GEAP',
        observacao: 'Cirurgias de urgência exigem lançamento em até 24h no portal.'
      },
      utiAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Diárias de UTI Adulto Geral cobertas.',
        codigoTuss: '60001038 + Intensivista',
        observacao: 'Apresentar relatório diário da UTI para prorrogação.'
      },
      utiNeoPed: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'UTI Pediátrica e Neonatal com suporte intensivo.',
        codigoTuss: '60001054 / 60001062',
        observacao: 'Regulação de leito intensivo infantil.'
      },
      examesLaboratorioPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Exames laboratoriais na urgência liberados via portal.',
        observacao: 'Painel viral / Covid / Influenza exige preenchimento do formulário específico da GEAP.'
      },
      examesImagemPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'RX, Tomografia e Ultrassom no PS.',
        observacao: 'Tomografia e RM exigem pedido médico com indicação clínica clara.'
      },
      hemodinamica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Hemodinâmica, angiografia e angioplastias de urgência.',
        codigoTuss: '40801010',
        observacao: 'Comunicação imediata à auditoria médica da GEAP.'
      },
      maternidadeParto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Assistência ao parto normal e cesárea para planos com obstetrícia.',
        codigoTuss: '31309038 / 31909127',
        observacao: 'Verificar carência obstétrica no portal.'
      },
      parecerMedicoPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer de especialista no PS.',
        codigoTuss: '10102019 ou 10101039',
        observacao: 'Lançar com CRM do parecerista no portal GEAP.'
      },
      parecerMedicoInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico em internação.',
        codigoTuss: '10102019',
        observacao: 'Justificar a necessidade no relatório clínico.'
      },
      fisioterapiaInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Fisioterapia respiratória e motora.',
        codigoTuss: '20103477',
        observacao: 'Diárias de fisioterapia autorizadas pela auditoria.'
      }
    },
    regrasAcomodacao: 'Acomodação varia por plano: GEAP Saúde Clássica, Premium e Executivo = APARTAMENTO. GEAP Referência, Família e Básico = ENFERMARIA. Sempre conferir a informação exata impressa na consulta de elegibilidade.',
    carenciasUrgencia: '24 horas para urgência/emergência.',
    carenciasEletivas: 'Conforme carências estatutárias (30 a 180 dias).',
    alertasCriticos: [
      'PAINEL VIRAL / COVID / INFLUENZA: A GEAP possui formulário e critérios específicos para autorizar testes virais.',
      'Sempre verificar elegibilidade no portal da GEAP antes do atendimento para conferir carência.',
      'Colher assinatura em todas as vias de guias TISS.'
    ],
    documentosObrigatorios: [
      'Documento com foto e CPF do servidor ou dependente',
      'Carteira digital no app GEAP Saúde',
      'Guia TISS impressa e assinada'
    ],
    instrucoesRecepcao: [
      'Acessar o portal do prestador GEAP com usuário e senha do hospital.',
      'Inserir o número do cartão do beneficiário e conferir situação ativa.',
      'Lançar a consulta do PS (10101039) e imprimir a guia.',
      'Colher assinatura imediata do paciente.'
    ]
  },

  // 7. AMIL SAÚDE / ONE HEALTH
  {
    id: 'AMIL',
    name: 'AMIL SAÚDE & ONE HEALTH',
    badge: 'AM',
    category: 'Seguradora',
    registroAns: '326305',
    acomodacaoPadrao: 'Conforme Plano (Verificar Carteira)',
    exigeTokenBiometria: true,
    tipoToken: 'Token de Atendimento gerado no Aplicativo Amil Clientes',
    portalAutorizacao: {
      nome: 'Portal Amil do Prestador',
      url: 'https://www.amil.com.br/prestador',
      tipo: 'Web Prestador Amil'
    },
    telefonesUteis: [
      'Central de Autorização: 3003-2702 / 0800 727 2288',
      'Apoio Médico / Urgência: 3004-1028 / 0800 721 1028',
      'Suporte Portal: 3004-1050'
    ],
    servicos: {
      psAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto-Socorro Adulto 24h credenciado.',
        codigoTuss: '10101039',
        observacao: 'Validação obrigatória de Token no App Amil Clientes antes do atendimento.'
      },
      psInfantil: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto atendimento infantil.',
        codigoTuss: '10101039',
        observacao: 'Token gerado no aplicativo do titular para o dependente.'
      },
      internacaoClinica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Internação clínica em Enfermaria ou Apartamento conforme plano.',
        codigoTuss: '10102019 + 60000554',
        observacao: 'Amil Fácil/S-60/S-80 = Quarto Coletivo; Amil S-380/S-450/S-750/One = Apartamento.'
      },
      internacaoCirurgica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Procedimentos cirúrgicos de média e alta complexidade.',
        codigoTuss: 'TUSS Amil',
        observacao: 'Autorização online no portal com anexo de laudo e exames pré-operatórios.'
      },
      utiAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Diárias de UTI Adulto Geral cobertas.',
        codigoTuss: '60001038 + Intensivista (10104020 x 2)',
        observacao: 'Lançar Intensivista diarista (10104011) e plantonista 12h (10104020 x 2).'
      },
      utiNeoPed: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'UTI Pediátrica e Neonatal com berçário patológico.',
        codigoTuss: '60001054 / 60001062',
        observacao: 'Berçário normal (60000619) e patológico (60000627).'
      },
      examesLaboratorioPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Exames laboratoriais na urgência do PS autorizados na hora.',
        observacao: 'Lançar os códigos TUSS com CRM do médico e token do paciente.'
      },
      examesImagemPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'RX, Tomografia e Ressonância Magnética cobertos mediante autorização.',
        observacao: 'Todos os exames no PS necessitam de autorização online no portal Amil.'
      },
      hemodinamica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cateterismo cardíaco e angioplastias cobertos.',
        codigoTuss: '40801010',
        observacao: 'Liberação de urgência via portal do prestador ou central de urgência 24h.'
      },
      maternidadeParto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Assistência ao parto normal (31909127) e parto cesárea.',
        codigoTuss: '31309038 / 31909127',
        observacao: 'Diária de acompanhante com refeição (60000384) inclusa por lei.'
      },
      parecerMedicoPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer de especialista no PS.',
        codigoTuss: '10101039 / Parecer',
        observacao: 'Solicitar autorização como interconsulta de urgência.'
      },
      parecerMedicoInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico em internação.',
        codigoTuss: '10102019',
        observacao: 'Visita hospitalar do especialista solicitada pelo médico assistente.'
      },
      fisioterapiaInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Fisioterapia respiratória com/sem ventilação mecânica.',
        codigoTuss: '50000810 / 50000829 / 50001019',
        observacao: 'Utilizar os códigos TUSS da tabela própria Amil de fisioterapia.'
      }
    },
    regrasAcomodacao: 'Acomodação definida na carteira do paciente: Linha "Amil Fácil" e códigos com terminação "Q" = Quarto Coletivo (Enfermaria). Linha "Amil S" com terminação "A" ou linhas One Health = Apartamento Individual.',
    carenciasUrgencia: '24 horas para urgência/emergência.',
    carenciasEletivas: '30 dias consultas e exames simples; 180 dias procedimentos de alta complexidade; 300 dias parto.',
    alertasCriticos: [
      'TOKEN OBRIGATÓRIO: Não iniciar o atendimento sem colher e validar o Token do aplicativo Amil Clientes.',
      'TODOS os procedimentos na Amil necessitam de autorização: internações, eletivas, urgências, RX, TC e RM.',
      'OBRIGATÓRIO o paciente assinar a guia autorizada física.',
      'Internação em UTI: lançar código de diária (60001038) + Atendimento intensivista (10104020 x 2).'
    ],
    documentosObrigatorios: [
      'Documento oficial com foto e CPF',
      'Carteirinha digital no app Amil Clientes',
      'Token de atendimento gerado no aplicativo',
      'Guia de atendimento TISS assinada'
    ],
    instrucoesRecepcao: [
      'Acessar menu "Consulta de Elegibilidade" no portal Amil.',
      'Prosseguir somente quando constar status: CLIENTE ELEGÍVEL.',
      'Para exames, anexar pedido médico digitalizado em PDF ou imagem.',
      'Concluir atendimento com validação do Token e assinatura do paciente.'
    ]
  },

  // 8. POSTAL SAÚDE (CORREIOS)
  {
    id: 'POSTAL',
    name: 'POSTAL SAÚDE (Correios)',
    badge: 'PS',
    category: 'Autogestão',
    registroAns: '419133',
    acomodacaoPadrao: 'Conforme Plano (Verificar Carteira)',
    exigeTokenBiometria: false,
    portalAutorizacao: {
      nome: 'Portal do Prestador Postal Saúde',
      url: 'https://postalsaude.com.br/prestador',
      tipo: 'Web Prestador Postal Saúde'
    },
    telefonesUteis: [
      'Central Postal Saúde: 0800 888 8116',
      'Central Médica: 0800 888 8117'
    ],
    servicos: {
      psAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto-Socorro Adulto 24h para funcionários dos Correios e dependentes.',
        codigoTuss: '10101039',
        observacao: 'Consulta e estabilização de urgência.'
      },
      psInfantil: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto-Socorro Infantil e Pediatria.',
        codigoTuss: '10101039',
        observacao: 'Atendimento de dependentes cadastrados.'
      },
      internacaoClinica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Internação clínica autorizada via portal ou central 0800.',
        codigoTuss: '10102019 + Diárias',
        observacao: 'Verificar se o plano contratado é Básico (Enfermaria) ou Especial (Apartamento).'
      },
      internacaoCirurgica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cirurgias gerais e de urgência.',
        codigoTuss: 'TUSS Postal Saúde',
        observacao: 'Cirurgias eletivas exigem senha prévia autorizada pela gerência regional da Postal.'
      },
      utiAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Diárias de UTI Adulto Geral.',
        codigoTuss: '60001038 + Intensivista',
        observacao: 'Envio de boletim médico para prorrogação.'
      },
      utiNeoPed: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'UTI Pediátrica e Neonatal com berçário.',
        codigoTuss: '60001054 / 60001062',
        observacao: 'Suporte intensivo para recém-nascidos e crianças.'
      },
      examesLaboratorioPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Exames laboratoriais na urgência do PS liberados no portal.',
        observacao: 'Hemograma, urina, bioquímicos e marcadores cardíacos.'
      },
      examesImagemPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'RX, Tomografia e Ultrassonografia no PS.',
        observacao: 'Ressonância Magnética requer justificativa emergencial do médico plantonista.'
      },
      hemodinamica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Hemodinâmica e cateterismo cardíaco cobertos.',
        codigoTuss: '40801010',
        observacao: 'Urgências coronarianas comunicadas imediatamente à central 0800.'
      },
      maternidadeParto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Assistência obstétrica integral para gestantes credenciadas.',
        codigoTuss: '31309038 / 31909127',
        observacao: 'Parto normal e cesárea conforme indicação clínica.'
      },
      parecerMedicoPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico de especialista no PS.',
        codigoTuss: '10102019 ou 10101039',
        observacao: 'Lançar com CRM do parecerista no portal.'
      },
      parecerMedicoInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico em internação.',
        codigoTuss: '10102019',
        observacao: 'Justificar no prontuário hospitalar.'
      },
      fisioterapiaInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Fisioterapia hospitalar respiratória e motora.',
        codigoTuss: '20103477',
        observacao: 'Autorizada por prescrição médica.'
      }
    },
    regrasAcomodacao: 'Acomodação conforme plano impresso no cartão de identificação: Postal Saúde Padrão = Enfermaria; Postal Saúde Especial = Apartamento. Em caso de dúvida, confirmar no portal do prestador.',
    carenciasUrgencia: '24 horas para urgência/emergência.',
    carenciasEletivas: '30 a 180 dias para procedimentos eletivos.',
    alertasCriticos: [
      'Sempre verificar validade da carteira no portal (evitar atender funcionários desligados dos Correios).',
      'Colher assinatura em todas as vias da guia TISS.',
      'Em caso de internação no plantão noturno ou final de semana, comunicar a central 0800 em até 24 horas úteis.'
    ],
    documentosObrigatorios: [
      'Documento com foto e CPF',
      'Carteira física ou virtual Postal Saúde',
      'Guia TISS assinada pelo paciente'
    ],
    instrucoesRecepcao: [
      'Consultar elegibilidade no portal da Postal Saúde.',
      'Lançar a consulta de urgência (10101039).',
      'Conferir acomodação (Apartamento vs Enfermaria).',
      'Imprimir a guia e colher assinatura.'
    ]
  },

  // 9. ASSEFAZ
  {
    id: 'ASSEFAZ',
    name: 'ASSEFAZ (Fundação Assefaz)',
    badge: 'AS',
    category: 'Autogestão',
    registroAns: '307491',
    acomodacaoPadrao: 'Apartamento',
    exigeTokenBiometria: false,
    portalAutorizacao: {
      nome: 'Portal do Prestador Assefaz',
      url: 'https://prestador.assefaz.org.br/',
      tipo: 'Web Prestador Assefaz'
    },
    telefonesUteis: [
      'Central Assefaz: 0800 703 4000',
      'Central de Atendimento 24h: 0800 703 4000'
    ],
    servicos: {
      psAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto-Socorro Adulto 24h coberto para fazendários e servidores conveniados.',
        codigoTuss: '10101039',
        observacao: 'Atendimento de urgência lançado no portal.'
      },
      psInfantil: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto-Socorro Pediátrico 24h.',
        codigoTuss: '10101039',
        observacao: 'Atendimento a dependentes cadastrados.'
      },
      internacaoClinica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Internação clínica em APARTAMENTO STANDARD.',
        codigoTuss: '60000651 + 10102019',
        observacao: 'Padrão da Assefaz é Apartamento Standard (código diária 60000651).'
      },
      internacaoCirurgica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Procedimentos cirúrgicos gerais e especializados.',
        codigoTuss: 'TUSS Assefaz',
        observacao: 'Autorização prévia para cirurgias eletivas; urgências comunicadas em até 48h.'
      },
      utiAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Diárias de UTI Adulto Geral cobertas.',
        codigoTuss: '60001038 + Intensivista',
        observacao: 'Informar laudo médico circunstanciado à auditoria Assefaz.'
      },
      utiNeoPed: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'UTI Pediátrica e Neonatal com berçário patológico.',
        codigoTuss: '60001054 / 60001062',
        observacao: 'Berçário normal (60000619).'
      },
      examesLaboratorioPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Exames laboratoriais na urgência autorizados via portal.',
        observacao: 'Bioquímica, hemograma, coagulograma e sorologias urgentes.'
      },
      examesImagemPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'RX, Tomografia e Ultrassonografia no PS.',
        observacao: 'Ressonância Magnética no PS requer relatório médico emergencial.'
      },
      hemodinamica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cateterismo cardíaco e angioplastias de urgência.',
        codigoTuss: '40801010',
        observacao: 'Procedimento hemodinâmico de alta complexidade coberto.'
      },
      maternidadeParto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parto normal e cesárea em centro obstétrico privativo.',
        codigoTuss: '31309038 / 31909127',
        observacao: 'Acomodação em apartamento com direito a acompanhante.'
      },
      parecerMedicoPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico no PS.',
        codigoTuss: '10102019 ou 10101039',
        observacao: 'Lançar com CRM do parecerista no portal Assefaz.'
      },
      parecerMedicoInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico em internação.',
        codigoTuss: '10102019',
        observacao: 'Solicitar com código de visita hospitalar.'
      },
      fisioterapiaInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Fisioterapia respiratória e motora.',
        codigoTuss: '20103477',
        observacao: 'Lançamento das sessões prescritas.'
      }
    },
    regrasAcomodacao: 'A grande maioria dos planos Assefaz (Assefaz Rubi, Diamante, Ouro) prevê acomodação em APARTAMENTO STANDARD. Planos regionais específicos verificar se constam Enfermaria no espelho de elegibilidade.',
    carenciasUrgencia: '24 horas para urgência/emergência.',
    carenciasEletivas: '30 a 180 dias para procedimentos eletivos.',
    alertasCriticos: [
      'Diária de Apartamento Assefaz: código 60000651 (solicitar junto com 10102019 x 1).',
      'Diária de Isolamento Assefaz: código 60000686.',
      'Sempre colher assinatura na guia TISS física.'
    ],
    documentosObrigatorios: [
      'Documento com foto e CPF',
      'Carteira física ou virtual Assefaz',
      'Guia TISS impressa com assinatura'
    ],
    instrucoesRecepcao: [
      'Acessar o portal do prestador Assefaz.',
      'Inserir o código do beneficiário e validar vigência.',
      'Emitir a guia do PS (10101039).',
      'Colher assinatura do paciente ou responsável.'
    ]
  },

  // 10. SAÚDE CAIXA
  {
    id: 'SAUDE_CAIXA',
    name: 'SAÚDE CAIXA (Caixa Econômica Federal)',
    badge: 'CX',
    category: 'Autogestão',
    registroAns: '300071',
    acomodacaoPadrao: 'Apartamento',
    exigeTokenBiometria: false,
    portalAutorizacao: {
      nome: 'Portal Saúde Caixa / Autenticador',
      url: 'https://www.saudecaixa.com.br/prestador',
      tipo: 'Web Prestador Saúde Caixa'
    },
    telefonesUteis: [
      'Central Saúde Caixa: 0800 095 6094',
      'Atendimento 24h: 0800 095 6094'
    ],
    servicos: {
      psAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto-Socorro Adulto 24h para economiários da Caixa e dependentes.',
        codigoTuss: '10101039',
        observacao: 'Consulta e atendimentos de urgência autorizados no sistema.'
      },
      psInfantil: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto atendimento infantil 24h.',
        codigoTuss: '10101039',
        observacao: 'Atendimento a dependentes legais.'
      },
      internacaoClinica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Internação clínica em APARTAMENTO INDIVIDUAL.',
        codigoTuss: '10102019 + Diárias',
        observacao: 'Beneficiários Saúde Caixa têm direito a acomodação em Apartamento.'
      },
      internacaoCirurgica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cirurgias de média e alta complexidade.',
        codigoTuss: 'TUSS Saúde Caixa',
        observacao: 'Autorização prévia para cirurgias eletivas; urgências comunicadas em até 24h.'
      },
      utiAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Diárias de UTI Adulto Geral cobertas.',
        codigoTuss: '60001038 + Intensivista',
        observacao: 'Notificação do boletim médico diário.'
      },
      utiNeoPed: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'UTI Pediátrica e Neonatal com berçário patológico.',
        codigoTuss: '60001054 / 60001062',
        observacao: 'Assistência intensiva pediátrica integral.'
      },
      examesLaboratorioPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Exames laboratoriais na urgência do PS liberados online.',
        observacao: 'Exames básicos e especializados com solicitação médica.'
      },
      examesImagemPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'RX, Tomografia e Ultrassonografia no PS.',
        observacao: 'Ressonância Magnética com indicação emergencial expressa.'
      },
      hemodinamica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cateterismo, angioplastia e cirurgia cardíaca invasiva.',
        codigoTuss: '40801010',
        observacao: 'Procedimento coberto com comunicação à central Saúde Caixa.'
      },
      maternidadeParto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Assistência obstétrica completa: parto normal e cesárea.',
        codigoTuss: '31309038 / 31909127',
        observacao: 'Acomodação em apartamento privativo.'
      },
      parecerMedicoPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer de especialista no PS.',
        codigoTuss: '10102019 ou 10101039',
        observacao: 'Lançar com CRM do médico parecerista.'
      },
      parecerMedicoInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico em leito hospitalar.',
        codigoTuss: '10102019',
        observacao: 'Justificar no prontuário.'
      },
      fisioterapiaInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Fisioterapia motora e respiratória hospitalar.',
        codigoTuss: '20103477',
        observacao: 'Sessões registradas no prontuário.'
      }
    },
    regrasAcomodacao: 'Acomodação padrão estatutária Saúde Caixa: APARTAMENTO INDIVIDUAL PRIVATIVO para todos os titulares e dependentes.',
    carenciasUrgencia: '24 horas para urgência/emergência.',
    carenciasEletivas: '30 a 180 dias para procedimentos eletivos.',
    alertasCriticos: [
      'Acomodação garantida em Apartamento Individual.',
      'Sempre conferir matrícula e validade da carteira no portal do Saúde Caixa.',
      'Colher assinatura do paciente na Guia TISS.'
    ],
    documentosObrigatorios: [
      'Documento oficial com foto e CPF',
      'Cartão do Saúde Caixa (físico ou no app Caixa Saúde)',
      'Guia TISS assinada pelo paciente'
    ],
    instrucoesRecepcao: [
      'Consultar elegibilidade no portal do Saúde Caixa.',
      'Emitir guia de urgência para a consulta (10101039).',
      'Internações devem ser lançadas com acomodação em Apartamento.',
      'Colher assinatura na guia impressa.'
    ]
  },

  // 11. SUL AMÉRICA SAÚDE
  {
    id: 'SUL_AMERICA',
    name: 'SUL AMÉRICA SAÚDE',
    badge: 'SA',
    category: 'Seguradora',
    registroAns: '006246',
    acomodacaoPadrao: 'Conforme Plano (Verificar Carteira)',
    exigeTokenBiometria: true,
    tipoToken: 'Token de Atendimento no Aplicativo SulAmérica Saúde',
    portalAutorizacao: {
      nome: 'Portal do Prestador SulAmérica',
      url: 'https://prestador.sulamerica.com.br/',
      tipo: 'Web Prestador SulAmérica'
    },
    telefonesUteis: [
      'Central Prestador: 4004-5900 / 0800 970 0500',
      'Central Segurado: 4004-7700'
    ],
    servicos: {
      psAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto-Socorro Adulto 24h credenciado.',
        codigoTuss: '64620107 / 10101039',
        observacao: 'Código específico no PS informado no POP: 64620107.'
      },
      psInfantil: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto atendimento infantil 24h.',
        codigoTuss: '64620107 / 10101039',
        observacao: 'Atendimento a dependentes com validação de token.'
      },
      internacaoClinica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Internação clínica em Enfermaria ou Apartamento conforme plano.',
        codigoTuss: '10102019 + Diárias',
        observacao: 'Plano Clássico/Especial = Apartamento; Plano Básico = Enfermaria.'
      },
      internacaoCirurgica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cirurgias gerais, ortopédicas e de alta complexidade.',
        codigoTuss: 'TUSS SulAmérica',
        observacao: 'Cirurgias eletivas exigem senha prévia autorizada.'
      },
      utiAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Diárias de UTI Adulto Geral cobertas.',
        codigoTuss: '60001038 + Intensivista',
        observacao: 'Envio de boletim médico na admissão.'
      },
      utiNeoPed: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'UTI Neonatal e Pediátrica completa.',
        codigoTuss: '60001054 / 60001062',
        observacao: 'Cobertura intensiva infantil integral.'
      },
      examesLaboratorioPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Exames laboratoriais na urgência do PS autorizados no sistema.',
        observacao: 'Liberação online com token do segurado.'
      },
      examesImagemPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'RX e Tomografia no PS exigem autorização.',
        observacao: 'Autorização online rápida no portal do prestador SulAmérica.'
      },
      hemodinamica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cateterismo cardíaco e angioplastias de urgência.',
        codigoTuss: '40801010',
        observacao: 'Procedimento hemodinâmico com comunicação à central 24h.'
      },
      maternidadeParto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parto normal e cesárea para planos com obstetrícia.',
        codigoTuss: '31309038 / 31909127',
        observacao: 'Verificar se a carteirinha possui cobertura obstétrica.'
      },
      parecerMedicoPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico de especialista no PS.',
        codigoTuss: '10101039 ou Parecer',
        observacao: 'Solicitar autorização como interconsulta de urgência.'
      },
      parecerMedicoInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico em internação.',
        codigoTuss: '10102019',
        observacao: 'Justificar no prontuário a especialidade solicitada.'
      },
      fisioterapiaInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Fisioterapia motora e respiratória hospitalar.',
        codigoTuss: '20103477',
        observacao: 'Sessões autorizadas por prescrição médica.'
      }
    },
    regrasAcomodacao: 'Acomodação impressa na carteirinha: "Básico" = Enfermaria; "Clássico", "Especial 100", "Executivo" e "Prestige" = APARTAMENTO INDIVIDUAL.',
    carenciasUrgencia: '24 horas para urgência/emergência.',
    carenciasEletivas: '30 a 180 dias conforme contrato.',
    alertasCriticos: [
      'Código de PS SulAmérica informado no POP: 64620107.',
      'TOKEN OBRIGATÓRIO: Solicitar validação de Token pelo App SulAmérica Saúde.',
      'RX e Tomografia no PS exigem autorização no portal.',
      'Colher assinatura na guia TISS física.'
    ],
    documentosObrigatorios: [
      'Documento oficial de identidade com foto e CPF',
      'Carteirinha digital no App SulAmérica Saúde',
      'Token de atendimento gerado no aplicativo',
      'Guia TISS assinada pelo segurado'
    ],
    instrucoesRecepcao: [
      'Acessar o portal SulAmérica Prestador.',
      'Digitar a carteirinha e solicitar o Token do segurado.',
      'Lançar código do PS e exames complementares.',
      'Imprimir o comprovante de autorização com assinatura.'
    ]
  },

  // 12. FUSEX (EXÉRCITO BRASILEIRO)
  {
    id: 'FUSEX',
    name: 'FUSEX (Fundo de Saúde do Exército)',
    badge: 'FX',
    category: 'Militar',
    registroAns: 'Autogestão Militar Federal',
    acomodacaoPadrao: 'Conforme Posto / Graduação',
    exigeTokenBiometria: false,
    portalAutorizacao: {
      nome: 'Regulação Militar / Guia de Encaminhamento FUSEX',
      url: 'https://fusex.eb.mil.br/',
      tipo: 'Guia de Encaminhamento Prévia (Guia FUSEX)'
    },
    telefonesUteis: [
      'Comando 22º Batalhão de Infantaria (Palmas): (63) 3218-8000',
      'Seção de Saúde FUSEX Palmas'
    ],
    servicos: {
      psAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Atendimento de urgência e emergência para militares do Exército e dependentes.',
        codigoTuss: '10101039',
        observacao: 'Em caso de urgência sem guia, emitir Declaração de Atendimento de Urgência em até 48h para homologação militar.'
      },
      psInfantil: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto atendimento infantil para dependentes de militares cadastrados.',
        codigoTuss: '10101039',
        observacao: 'Apresentar Cartão FUSEX do dependente e identidade.'
      },
      internacaoClinica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Internação clínica autorizada por Guia de Encaminhamento.',
        codigoTuss: '10102019 + Diárias',
        observacao: 'Oficiais = Apartamento; Praças = Enfermaria (conforme regulamento R-59 do Exército).'
      },
      internacaoCirurgica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cirurgias gerais e ortopédicas credenciadas.',
        codigoTuss: 'Tabela FUSEX / TUSS',
        observacao: 'Cirurgias eletivas EXIGEM Guia de Encaminhamento original emitida pela Organização Militar.'
      },
      utiAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Diárias de UTI Adulto Geral.',
        codigoTuss: '60001038 + Intensivista',
        observacao: 'Comunicação imediata à seção de saúde do Exército.'
      },
      utiNeoPed: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'UTI Pediátrica e Neonatal com berçário.',
        codigoTuss: '60001054 / 60001062',
        observacao: 'Regulação militar de dependente neonato.'
      },
      examesLaboratorioPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Exames laboratoriais na urgência do PS.',
        observacao: 'Inclusos no atendimento emergencial com relatório.'
      },
      examesImagemPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'RX, Tomografia e USG na urgência.',
        observacao: 'Ressonância Magnética requer relatório justificando a urgência.'
      },
      hemodinamica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cateterismo cardíaco e angioplastias de urgência.',
        codigoTuss: '40801010',
        observacao: 'Urgência cardiológica comunicada ao Oficial de Dia/Saúde militar.'
      },
      maternidadeParto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parto normal e cesárea para titulares e dependentes com guia.',
        codigoTuss: '31309038 / 31909127',
        observacao: 'Acomodação conforme posto/graduação militar.'
      },
      parecerMedicoPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer de especialista no PS.',
        codigoTuss: '10102019 ou 10101039',
        observacao: 'Lançar com CRM do parecerista.'
      },
      parecerMedicoInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico em internação.',
        codigoTuss: '10102019',
        observacao: 'Informar justificativa clínica.'
      },
      fisioterapiaInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Fisioterapia hospitalar.',
        codigoTuss: '20103477',
        observacao: 'Prescrição pelo médico assistente.'
      }
    },
    regrasAcomodacao: 'Regulamento R-59 do Exército Brasileiro: Oficiais Superiores, Intermediários e Subalternos = APARTAMENTO. Subtenentes, Sargentos, Cabos e Soldados = ENFERMARIA (Quarto Coletivo).',
    carenciasUrgencia: '24 horas para urgência/emergência com risco de vida.',
    carenciasEletivas: 'Exige Guia de Encaminhamento prévia homologada pela Organização Militar.',
    alertasCriticos: [
      'GUIA DE ENCAMINHAMENTO OBRIGATÓRIA: Em atendimentos eletivos, NUNCA atender sem a Guia FUSEX original carimbada e assinada pelo gestor militar.',
      'Na urgência, notificar a Seção FUSEX em até 48 horas úteis para obter a guia de homologação retroativa.',
      'Acomodação depende estritamente do posto/graduação militar.'
    ],
    documentosObrigatorios: [
      'Identidade Militar do Exército ou identidade civil com CPF',
      'Cartão FUSEX do titular ou dependente',
      'Guia de Encaminhamento FUSEX (via original com carimbo militar)'
    ],
    instrucoesRecepcao: [
      'Conferir a vigência e carimbos na Guia de Encaminhamento FUSEX.',
      'Conferir o posto/graduação militar para definir a acomodação (Apartamento vs Enfermaria).',
      'Colher assinatura do militar na guia.',
      'Arquivar a guia original para o faturamento hospitalar.'
    ]
  },

  // 13. CAPESESP
  {
    id: 'CAPESESP',
    name: 'CAPESESP (Previdência dos Servidores da Saúde)',
    badge: 'CP',
    category: 'Autogestão',
    registroAns: '320072',
    acomodacaoPadrao: 'Conforme Plano (Verificar Carteira)',
    exigeTokenBiometria: false,
    portalAutorizacao: {
      nome: 'Portal do Prestador CAPESESP',
      url: 'https://prestador.capesesp.com.br/',
      tipo: 'Web Prestador CAPESESP'
    },
    telefonesUteis: [
      'Central CAPESESP: 0800 979 6191'
    ],
    servicos: {
      psAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto-Socorro Adulto 24h para servidores da saúde federal e dependentes.',
        codigoTuss: '10101039',
        observacao: 'Consulta e atendimentos de urgência autorizados no sistema.'
      },
      psInfantil: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto atendimento infantil.',
        codigoTuss: '10101039',
        observacao: 'Atendimento a dependentes legais.'
      },
      internacaoClinica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Internação clínica autorizada.',
        codigoTuss: '10102019 + Diárias',
        observacao: 'Acomodação conforme plano: Capesaúde Master = Apartamento; Capesaúde Padrão = Enfermaria.'
      },
      internacaoCirurgica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cirurgias gerais e especializadas.',
        codigoTuss: 'TUSS CAPESESP',
        observacao: 'Cirurgias eletivas exigem senha prévia autorizada.'
      },
      utiAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Diárias de UTI Adulto Geral cobertas.',
        codigoTuss: '60001038 + Intensivista',
        observacao: 'Notificação do boletim médico diário.'
      },
      utiNeoPed: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'UTI Pediátrica e Neonatal com berçário patológico.',
        codigoTuss: '60001054 / 60001062',
        observacao: 'Assistência intensiva pediátrica integral.'
      },
      examesLaboratorioPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Exames laboratoriais na urgência do PS liberados online.',
        observacao: 'Exames básicos e especializados com solicitação médica.'
      },
      examesImagemPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'RX, Tomografia e Ultrassonografia no PS.',
        observacao: 'Ressonância Magnética com indicação emergencial expressa.'
      },
      hemodinamica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cateterismo, angioplastia e cirurgia cardíaca invasiva.',
        codigoTuss: '40801010',
        observacao: 'Procedimento coberto com comunicação à central CAPESESP.'
      },
      maternidadeParto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Assistência obstétrica completa: parto normal e cesárea.',
        codigoTuss: '31309038 / 31909127',
        observacao: 'Acomodação conforme plano contratado.'
      },
      parecerMedicoPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer de especialista no PS.',
        codigoTuss: '10102019 ou 10101039',
        observacao: 'Lançar com CRM do médico parecerista.'
      },
      parecerMedicoInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico em leito hospitalar.',
        codigoTuss: '10102019',
        observacao: 'Justificar no prontuário.'
      },
      fisioterapiaInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Fisioterapia motora e respiratória hospitalar.',
        codigoTuss: '20103477',
        observacao: 'Sessões registradas no prontuário.'
      }
    },
    regrasAcomodacao: 'Acomodação conforme a categoria: Planos "Capesaúde Executivo / Master" = APARTAMENTO. Planos "Capesaúde Básico / Padrão" = ENFERMARIA.',
    carenciasUrgencia: '24 horas para urgência/emergência.',
    carenciasEletivas: '30 a 180 dias conforme contrato.',
    alertasCriticos: [
      'Sempre verificar validade da carteira no portal CAPESESP.',
      'Colher assinatura em todas as vias da guia TISS.',
      'Cirurgias e internações requerem confirmação da acomodação no portal.'
    ],
    documentosObrigatorios: [
      'Documento oficial com foto e CPF',
      'Cartão CAPESESP',
      'Guia TISS assinada'
    ],
    instrucoesRecepcao: [
      'Consultar elegibilidade no portal da CAPESESP.',
      'Emitir a guia do PS (10101039).',
      'Colher assinatura do paciente.',
      'Conferir tipo de acomodação.'
    ]
  },

  // 14. CAMED SAÚDE
  {
    id: 'CAMED',
    name: 'CAMED SAÚDE (Banco do Nordeste)',
    badge: 'CM',
    category: 'Autogestão',
    registroAns: '385697',
    acomodacaoPadrao: 'Apartamento',
    exigeTokenBiometria: false,
    portalAutorizacao: {
      nome: 'Portal do Prestador CAMED',
      url: 'https://prestador.camed.com.br/',
      tipo: 'Web Prestador CAMED'
    },
    telefonesUteis: [
      'Central CAMED: 0800 704 9555'
    ],
    servicos: {
      psAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto-Socorro Adulto 24h para servidores do Banco do Nordeste e dependentes.',
        codigoTuss: '10101039',
        observacao: 'Consulta e atendimentos de urgência autorizados no sistema.'
      },
      psInfantil: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto atendimento infantil 24h.',
        codigoTuss: '10101039',
        observacao: 'Atendimento a dependentes legais.'
      },
      internacaoClinica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Internação clínica em APARTAMENTO.',
        codigoTuss: '10102019 + Diárias',
        observacao: 'Padrão predominante de acomodação é Apartamento Individual.'
      },
      internacaoCirurgica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cirurgias gerais e de alta complexidade.',
        codigoTuss: 'TUSS CAMED',
        observacao: 'Cirurgias eletivas exigem senha prévia autorizada.'
      },
      utiAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Diárias de UTI Adulto Geral cobertas.',
        codigoTuss: '60001038 + Intensivista',
        observacao: 'Notificação do boletim médico diário.'
      },
      utiNeoPed: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'UTI Pediátrica e Neonatal com berçário patológico.',
        codigoTuss: '60001054 / 60001062',
        observacao: 'Assistência intensiva pediátrica integral.'
      },
      examesLaboratorioPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Exames laboratoriais na urgência do PS liberados online.',
        observacao: 'Exames básicos e especializados com solicitação médica.'
      },
      examesImagemPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'RX, Tomografia e Ultrassonografia no PS.',
        observacao: 'Ressonância Magnética com indicação emergencial expressa.'
      },
      hemodinamica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cateterismo, angioplastia e cirurgia cardíaca invasiva.',
        codigoTuss: '40801010',
        observacao: 'Procedimento coberto com comunicação à central CAMED.'
      },
      maternidadeParto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Assistência obstétrica completa: parto normal e cesárea.',
        codigoTuss: '31309038 / 31909127',
        observacao: 'Acomodação em apartamento.'
      },
      parecerMedicoPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer de especialista no PS.',
        codigoTuss: '10102019 ou 10101039',
        observacao: 'Lançar com CRM do médico parecerista.'
      },
      parecerMedicoInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico em leito hospitalar.',
        codigoTuss: '10102019',
        observacao: 'Justificar no prontuário.'
      },
      fisioterapiaInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Fisioterapia motora e respiratória hospitalar.',
        codigoTuss: '20103477',
        observacao: 'Sessões registradas no prontuário.'
      }
    },
    regrasAcomodacao: 'Acomodação padrão para beneficiários CAMED: APARTAMENTO INDIVIDUAL PRIVATIVO.',
    carenciasUrgencia: '24 horas para urgência/emergência.',
    carenciasEletivas: '30 a 180 dias conforme contrato.',
    alertasCriticos: [
      'Acomodação garantida em Apartamento.',
      'Sempre conferir matrícula e validade da carteira no portal CAMED.',
      'Colher assinatura do paciente na Guia TISS.'
    ],
    documentosObrigatorios: [
      'Documento oficial com foto e CPF',
      'Cartão CAMED',
      'Guia TISS assinada'
    ],
    instrucoesRecepcao: [
      'Consultar elegibilidade no portal da CAMED.',
      'Emitir guia de urgência para a consulta (10101039).',
      'Colher assinatura na guia impressa.'
    ]
  },

  // 15. LIFE EMPRESARIAL
  {
    id: 'LIFE',
    name: 'LIFE EMPRESARIAL SAÚDE',
    badge: 'LE',
    category: 'Privado',
    registroAns: '417386',
    acomodacaoPadrao: 'Conforme Plano (Verificar Carteira)',
    exigeTokenBiometria: false,
    portalAutorizacao: {
      nome: 'Portal do Prestador Life Empresarial',
      url: 'https://portal.lifeempresarial.com.br/PlanodeSaude/',
      tipo: 'Web Prestador Life Empresarial'
    },
    telefonesUteis: [
      'Central Life Empresarial: 0800 707 5433'
    ],
    servicos: {
      psAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto-Socorro Adulto 24h credenciado.',
        codigoTuss: '10101039',
        observacao: 'Verificar elegibilidade antes do atendimento no portal.'
      },
      psInfantil: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto atendimento infantil.',
        codigoTuss: '10101039',
        observacao: 'Atendimento a dependentes cadastrados.'
      },
      internacaoClinica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Internação clínica autorizada.',
        codigoTuss: '10102019 + Diárias',
        observacao: 'Acomodação conforme contrato impresso na carteira (Enfermaria ou Apartamento).'
      },
      internacaoCirurgica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cirurgias gerais e de urgência com senha prévia.',
        codigoTuss: 'TUSS Life',
        observacao: 'Cirurgias eletivas exigem autorização expressa no portal.'
      },
      utiAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Diárias de UTI Adulto Geral.',
        codigoTuss: '60001038 + Intensivista',
        observacao: 'Notificação médica imediata.'
      },
      utiNeoPed: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'UTI Neonatal e Pediátrica.',
        codigoTuss: '60001054 / 60001062',
        observacao: 'Assistência intensiva infantil.'
      },
      examesLaboratorioPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Exames laboratoriais na urgência autorizados no portal.',
        observacao: 'Lançar códigos TUSS individuais.'
      },
      examesImagemPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'RX, Tomografia e USG exigem autorização prévia no portal.',
        observacao: 'Pedido médico circunstanciado anexado.'
      },
      hemodinamica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Procedimentos cardiovasculares de urgência.',
        codigoTuss: '40801010',
        observacao: 'Comunicação imediata à central da operadora.'
      },
      maternidadeParto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Assistência ao parto para planos com obstetrícia.',
        codigoTuss: '31309038 / 31909127',
        observacao: 'Conferir carência obstétrica.'
      },
      parecerMedicoPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer de especialista no PS.',
        codigoTuss: '10101039 / Parecer',
        observacao: 'Lançar com CRM do especialista.'
      },
      parecerMedicoInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico em internação.',
        codigoTuss: '10102019',
        observacao: 'Justificar no prontuário.'
      },
      fisioterapiaInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Fisioterapia hospitalar.',
        codigoTuss: '20103477',
        observacao: 'Conforme prescrição médica.'
      }
    },
    regrasAcomodacao: 'Acomodação varia por categoria empresarial: Planos Básicos = Enfermaria; Planos Superiores = Apartamento. Conferir espelho no portal com CNPJ 12955953000192.',
    carenciasUrgencia: '24 horas para urgência/emergência.',
    carenciasEletivas: '30 a 180 dias conforme contrato.',
    alertasCriticos: [
      'Acesso ao portal Life Empresarial com CNPJ 12955953000192 e senha Medical@2026.',
      'Solicitar autorização prévia para exames laboratoriais e de imagem no portal.',
      'Colher assinatura obrigatória do paciente na Guia TISS física (campo 57).'
    ],
    documentosObrigatorios: [
      'Documento com foto e CPF',
      'Cartão Life Empresarial Saúde',
      'Guia TISS assinada no campo 57'
    ],
    instrucoesRecepcao: [
      'Acessar portal da Life Empresarial com CNPJ e senha do hospital.',
      'Validar elegibilidade do beneficiário.',
      'Lançar consulta e procedimentos solicitados.',
      'Colher assinatura física obrigatória na Guia TISS.'
    ]
  },

  // 16. NOTREDAME INTERMÉDICA (GNDI)
  {
    id: 'NOTREDAME',
    name: 'NOTREDAME INTERMÉDICA (GNDI)',
    badge: 'ND',
    category: 'Privado',
    registroAns: '359017',
    acomodacaoPadrao: 'Conforme Plano (Verificar Carteira)',
    exigeTokenBiometria: false,
    portalAutorizacao: {
      nome: 'Portal Savi Hapvida GNDI',
      url: 'https://savi.hapvida.com.br/savi-atendimento/',
      tipo: 'Portal Savi Hapvida GNDI'
    },
    telefonesUteis: [
      'Central GNDI Prestador: 4090-1740 / 0800 130 300'
    ],
    servicos: {
      psAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto-Socorro Adulto 24h credenciado.',
        codigoTuss: '10101039',
        observacao: 'Acesso pelo portal Savi Hapvida GNDI.'
      },
      psInfantil: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto atendimento infantil.',
        codigoTuss: '10101039',
        observacao: 'Atendimento a dependentes legais.'
      },
      internacaoClinica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Internação clínica em Enfermaria ou Apartamento.',
        codigoTuss: '10102019 + Diárias',
        observacao: 'Linhas Smart = Enfermaria; Linhas Advance e Premium = Apartamento.'
      },
      internacaoCirurgica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cirurgias gerais com autorização prévia.',
        codigoTuss: 'TUSS GNDI',
        observacao: 'Autorização online no portal Savi.'
      },
      utiAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Diárias de UTI Adulto Geral.',
        codigoTuss: '60001038 + Intensivista',
        observacao: 'Notificação à regulação GNDI.'
      },
      utiNeoPed: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'UTI Pediátrica e Neonatal.',
        codigoTuss: '60001054 / 60001062',
        observacao: 'Suporte intensivo neonatal.'
      },
      examesLaboratorioPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Exames laboratoriais na urgência do PS liberados no portal.',
        observacao: 'Lançar códigos TUSS no Savi.'
      },
      examesImagemPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'RX, Tomografia e Ultrassonografia no PS.',
        observacao: 'RM requer relatório médico prévio.'
      },
      hemodinamica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Hemodinâmica de urgência coberta.',
        codigoTuss: '40801010',
        observacao: 'Comunicação imediata à auditoria GNDI.'
      },
      maternidadeParto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Assistência obstétrica para planos com cobertura.',
        codigoTuss: '31309038 / 31909127',
        observacao: 'Conferir carência obstétrica.'
      },
      parecerMedicoPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer de especialista no PS.',
        codigoTuss: '10101039 / Parecer',
        observacao: 'Lançar com CRM do parecerista.'
      },
      parecerMedicoInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico em internação.',
        codigoTuss: '10102019',
        observacao: 'Justificar no prontuário.'
      },
      fisioterapiaInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Fisioterapia hospitalar.',
        codigoTuss: '20103477',
        observacao: 'Prescrição pelo médico assistente.'
      }
    },
    regrasAcomodacao: 'Acomodação conforme plano: Planos Smart = Quarto Coletivo (Enfermaria); Planos Advance, Premium e Infinity = Apartamento Individual.',
    carenciasUrgencia: '24 horas para urgência/emergência.',
    carenciasEletivas: '30 a 180 dias conforme contrato.',
    alertasCriticos: [
      'Acesso pelo portal Savi Hapvida GNDI com CNPJ 12955953000192.',
      'Sempre verificar rede credenciada do plano (Smart vs Advance).',
      'Colher assinatura em todas as vias da guia TISS.'
    ],
    documentosObrigatorios: [
      'Documento com foto e CPF',
      'Carteira GNDI física ou no app GNDI Easy',
      'Guia TISS assinada'
    ],
    instrucoesRecepcao: [
      'Acessar o portal Savi Hapvida GNDI.',
      'Conferir elegibilidade e acomodação contratada.',
      'Emitir guia de consulta do PS (10101039).',
      'Colher assinatura na guia impressa.'
    ]
  },

  // 17. OMINT SAÚDE
  {
    id: 'OMINT',
    name: 'OMINT SAÚDE',
    badge: 'OM',
    category: 'Seguradora',
    registroAns: '359211',
    acomodacaoPadrao: 'Apartamento',
    exigeTokenBiometria: false,
    portalAutorizacao: {
      nome: 'Portal Credenciado Omint',
      url: 'https://www.omint.com.br/credenciado/',
      tipo: 'Web Credenciado Omint'
    },
    telefonesUteis: [
      'Central Omint: 0800 726 4000 / (11) 2132-4000'
    ],
    servicos: {
      psAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto-Socorro Adulto 24h Premium.',
        codigoTuss: '10101039',
        observacao: 'Atendimento de alta complexidade credenciado.'
      },
      psInfantil: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Pronto atendimento infantil.',
        codigoTuss: '10101039',
        observacao: 'Atendimento a dependentes legais.'
      },
      internacaoClinica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Internação clínica em APARTAMENTO LUXO.',
        codigoTuss: '10102019 + Diárias',
        observacao: 'Padrão exclusivo de acomodação em Apartamento Individual.'
      },
      internacaoCirurgica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Cirurgias gerais e de alta complexidade com ampla cobertura.',
        codigoTuss: 'TUSS Omint',
        observacao: 'Autorização prévia rápida via concierge Omint.'
      },
      utiAdulto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Diárias de UTI Adulto Geral.',
        codigoTuss: '60001038 + Intensivista',
        observacao: 'Acompanhamento pela central médica Omint.'
      },
      utiNeoPed: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'UTI Pediátrica e Neonatal completa.',
        codigoTuss: '60001054 / 60001062',
        observacao: 'Cobertura intensiva infantil de alto padrão.'
      },
      examesLaboratorioPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Exames laboratoriais na urgência autorizados.',
        observacao: 'Amplo rol de exames com liberação rápida.'
      },
      examesImagemPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'RX, Tomografia e Ressonância Magnética no PS.',
        observacao: 'Cobertura completa de diagnóstico por imagem de urgência.'
      },
      hemodinamica: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Hemodinâmica e cardiologia intervencionista.',
        codigoTuss: '40801010',
        observacao: 'Urgências coronarianas com autorização prioritária.'
      },
      maternidadeParto: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Assistência obstétrica completa com equipe privativa.',
        codigoTuss: '31309038 / 31909127',
        observacao: 'Acomodação em suíte/apartamento.'
      },
      parecerMedicoPs: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico no PS.',
        codigoTuss: '10102019 ou 10101039',
        observacao: 'Lançar com CRM do parecerista.'
      },
      parecerMedicoInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Parecer médico em internação.',
        codigoTuss: '10102019',
        observacao: 'Informar justificativa clínica.'
      },
      fisioterapiaInternacao: {
        status: 'COBERTO_COM_AUTORIZACAO',
        descricao: 'Fisioterapia hospitalar.',
        codigoTuss: '20103477',
        observacao: 'Sessões registradas no prontuário.'
      }
    },
    regrasAcomodacao: 'Acomodação padrão para todos os planos Omint: APARTAMENTO INDIVIDUAL / SUÍTE.',
    carenciasUrgencia: '24 horas para urgência/emergência.',
    carenciasEletivas: '30 a 180 dias conforme contrato.',
    alertasCriticos: [
      'Plano Premium: padrão de acomodação sempre em Apartamento.',
      'Atendimento prioritário com suporte concierge da operadora.',
      'Colher assinatura na guia TISS física.'
    ],
    documentosObrigatorios: [
      'Documento com foto e CPF',
      'Cartão Omint físico ou no app Omint',
      'Guia TISS assinada'
    ],
    instrucoesRecepcao: [
      'Consultar elegibilidade no portal Omint Credenciado.',
      'Lançar a consulta do PS (10101039).',
      'Acomodação garantida em Apartamento.',
      'Colher assinatura na guia.'
    ]
  },

  // 18. PARTICULAR & AMOR SAÚDE
  {
    id: 'PARTICULAR',
    name: 'PARTICULAR / TABELA AMOR SAÚDE',
    badge: 'PA',
    category: 'Particular',
    registroAns: 'Sem Convênio (Direto)',
    acomodacaoPadrao: 'Apartamento',
    exigeTokenBiometria: false,
    portalAutorizacao: {
      nome: 'Faturamento Interno Hospital Palmas Medical',
      url: '#',
      tipo: 'Sistema Interno TASY / Terminal Financeiro'
    },
    telefonesUteis: [
      'Ramal Orçamento & Faturamento: 1824',
      'Recepção Central: 1878'
    ],
    servicos: {
      psAdulto: {
        status: 'COBERTO_DIRETO',
        descricao: 'Consulta Pronto-Socorro Adulto Particular.',
        codigoTuss: '10101039',
        observacao: 'Pagamento prévio na recepção ou termo de responsabilidade financeira.'
      },
      psInfantil: {
        status: 'COBERTO_DIRETO',
        descricao: 'Consulta Pronto-Socorro Infantil Particular.',
        codigoTuss: '10101039',
        observacao: 'Pagamento prévio na admissão.'
      },
      internacaoClinica: {
        status: 'COBERTO_DIRETO',
        descricao: 'Internação clínica particular em Apartamento ou Enfermaria.',
        codigoTuss: 'Orçamento Tabela Própria',
        observacao: 'Exige depósito garantia caução / contrato de prestação de serviços hospitalares assinado.'
      },
      internacaoCirurgica: {
        status: 'COBERTO_DIRETO',
        descricao: 'Cirurgias particulares com orçamento prévio fechado.',
        codigoTuss: 'Tabela Hospitalar HPM',
        observacao: 'Orçamento gerado pelo setor de orçamentos (Ramal 1824).'
      },
      utiAdulto: {
        status: 'COBERTO_DIRETO',
        descricao: 'Diária de UTI Adulto Particular.',
        codigoTuss: 'Tabela Particular HPM',
        observacao: 'Termo de responsabilidade financeira obrigatório assinado pelo responsável.'
      },
      utiNeoPed: {
        status: 'COBERTO_DIRETO',
        descricao: 'Diária de UTI Neonatal / Pediátrica Particular.',
        codigoTuss: 'Tabela Particular HPM',
        observacao: 'Assinatura contratual imediata do responsável financeiro.'
      },
      examesLaboratorioPs: {
        status: 'COBERTO_DIRETO',
        descricao: 'Exames laboratoriais conforme Tabela Particular ou Amor Saúde.',
        observacao: 'Valores disponíveis na aba "Valores de Exames".'
      },
      examesImagemPs: {
        status: 'COBERTO_DIRETO',
        descricao: 'RX, Tomografia e Ressonância Magnética com valores de tabela particular.',
        observacao: 'Descontos especiais para pacientes Amor Saúde ou tabela social.'
      },
      hemodinamica: {
        status: 'COBERTO_DIRETO',
        descricao: 'Cateterismo e angioplastia particular.',
        codigoTuss: 'Tabela Intervencionista',
        observacao: 'Orçamento prévio com taxa de sala e insumos.'
      },
      maternidadeParto: {
        status: 'COBERTO_DIRETO',
        descricao: 'Pacote de parto normal e cesárea particular.',
        codigoTuss: 'Pacote Maternidade HPM',
        observacao: 'Inclui diárias hospitalares, equipe e berçário conforme contrato.'
      },
      parecerMedicoPs: {
        status: 'COBERTO_DIRETO',
        descricao: 'Parecer médico especialista particular.',
        codigoTuss: 'Tabela Própria HPM',
        observacao: 'Cobrado conforme honorário do especialista acionado.'
      },
      parecerMedicoInternacao: {
        status: 'COBERTO_DIRETO',
        descricao: 'Visita hospitalar do especialista.',
        codigoTuss: 'Tabela Própria HPM',
        observacao: 'Lançado na conta hospitalar particular.'
      },
      fisioterapiaInternacao: {
        status: 'COBERTO_DIRETO',
        descricao: 'Sessões de fisioterapia cobradas por atendimento.',
        codigoTuss: 'Tabela Própria HPM',
        observacao: 'Registrado em espelho de consumo.'
      }
    },
    regrasAcomodacao: 'Acomodação definida pelo paciente no momento da contratação: APARTAMENTO INDIVIDUAL ou ENFERMARIA (com diferença de valor na diária e taxas hospitalares).',
    carenciasUrgencia: 'Sem carência (Atendimento imediato após assinatura de termo / pagamento).',
    carenciasEletivas: 'Sem carência.',
    alertasCriticos: [
      'PACIENTE PARTICULAR: Obrigatório assinar o Termo de Responsabilidade e Ciência de Débito (Relatório Tipo Particular).',
      'Para consultas de PS e exames simples: pagamento antes do procedimento.',
      'Para internações: caução e contrato de internação particular.',
      'Valores de exames do PS e Amor Saúde estão catalogados na aba "Valores de Exames" com calculadora ativa.'
    ],
    documentosObrigatorios: [
      'Documento oficial com foto e CPF do paciente',
      'Documento oficial com foto e CPF do responsável financeiro',
      'Contrato de prestação de serviços hospitalares assinado',
      'Termo de ciência de débito'
    ],
    instrucoesRecepcao: [
      'Apresentar a tabela de preços ao paciente/responsável.',
      'Colher assinatura no Contrato de Prestação de Serviços Particulares.',
      'Emitir recibo ou cupom fiscal após pagamento.',
      'Encaminhar ao setor de atendimento clínico.'
    ]
  }
];
