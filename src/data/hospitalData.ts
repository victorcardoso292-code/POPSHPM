import { HospitalExtension, HospitalReportType } from '../types';

export const HOSPITAL_EXTENSIONS: HospitalExtension[] = [
  { sector: 'PA - HST', number: '8359', building: 'Hospital Santa Thereza • Pronto Atendimento', category: 'atendimento' },
  { sector: 'INTERNAÇÃO HST', number: '8300', building: 'Hospital Santa Thereza • Posto de Internação', category: 'internacao' },
  { sector: 'UTI NEO', number: '1887', building: 'Bloco Crítico / 3º Andar', category: 'uti' },
  { sector: 'UTI A', number: '1894', building: 'Bloco Crítico / 3º Andar', category: 'uti' },
  { sector: 'UTI B', number: '1893', building: 'Bloco Crítico / 3º Andar', category: 'uti' },
  { sector: 'UTI C', number: '1885', building: 'Bloco Crítico / 3º Andar', category: 'uti' },
  { sector: 'CENTRO CIRÚRGICO (CC)', number: '1822', building: 'Bloco Cirúrgico / 2º Andar', category: 'apoio' },
  { sector: 'FARMÁCIA CC', number: '1824', building: 'Centro Cirúrgico / 2º Andar', category: 'farmacia' },
  { sector: 'INTERNAÇÃO 2º ANDAR', number: '1886', building: 'Posto de Enfermagem 2º Andar', category: 'internacao' },
  { sector: 'FARMÁCIA MEZANINO', number: '1896', building: 'Mezanino Central', category: 'farmacia' },
  { sector: 'RECEPÇÃO 2º ANDAR', number: '1801', building: 'Recepção Internação / 2º Andar', category: 'atendimento' },
  { sector: 'RECEPÇÃO PRONTO-SOCORRO', number: '1878', building: 'Térreo / Entrada PS', category: 'atendimento' },
  { sector: 'PS ADULTO (ENFERMAGEM/MÉDICO)', number: '1860', building: 'Térreo / Box de Emergência', category: 'atendimento' },
  { sector: 'PS INFANTIL / PEDIATRIA', number: '1849', building: 'Térreo / Ala Pediátrica', category: 'atendimento' },
  { sector: 'CME (CENTRO DE MATERIAIS)', number: '1834', building: 'Subsolo / Esterilização', category: 'apoio' },
  { sector: 'TI & SUPORTE DE SISTEMAS', number: '1805', building: 'Prédio Administrativo', category: 'administracao' },
  { sector: 'LABORATÓRIO CENTRAL', number: '1817 / 1853', building: 'Térreo / Coleta & Análises', category: 'apoio' },
  { sector: 'HEMODINÂMICA & CATETERISMO', number: '1868', building: 'Bloco Intervencionista', category: 'apoio' },
  { sector: 'ALMOXARIFADO CENTRAL', number: '1833', building: 'Subsolo / Logística', category: 'administracao' },
  { sector: 'GERÊNCIA DE ENFERMAGEM', number: '1826', building: 'Administração Hospitalar', category: 'administracao' },
  { sector: 'RX / RADIOLOGIA / TOMOGRAFIA', number: '1874', building: 'Centro de Diagnóstico por Imagem', category: 'apoio' },
  { sector: 'FARMÁCIA SATÉLITE', number: '1824', building: 'Pronto-Socorro / Térreo', category: 'farmacia' },
  { sector: 'MANUTENÇÃO PREDIAL & ENGENHARIA', number: '1830', building: 'Engenharia Clínica', category: 'administracao' },
  { sector: 'ORÇAMENTO & FATURAMENTO', number: '1824', building: 'Faturamento Hospitalar', category: 'administracao' },
  { sector: 'ULTRASSONOGRAFIA (USG)', number: '1820', building: 'Diagnóstico por Imagem', category: 'apoio' }
];

export const HOSPITAL_REPORTS: HospitalReportType[] = [
  {
    tipo: 'PARTICULAR',
    classe: 'particular',
    nums: ['2', '4', '7', '10', '11', '12', '13', '15', '16', '17', '19', '22'],
    description: 'Kit de documentos exigidos para internações clínicas ou cirúrgicas particulares (sem convênio).',
    documentDetails: {
      '2': 'Termo de Responsabilidade e Ciência de Débito / Internação Particular',
      '4': 'Boletim de Admissão e Ficha de Identificação do Paciente',
      '7': 'Prescrição Médica Inicial e Folha de Rosto do Prontuário',
      '10': 'Termo de Consentimento Informado (Anestésico / Cirúrgico / Procedimento)',
      '11': 'Ficha de Avaliação Nutricional e Prescrição Dietética',
      '12': 'Controle de Sinais Vitais e Balanço Hídrico (Enfermagem)',
      '13': 'Evolução Multiprofissional (Médica, Enfermagem e Fisioterapia)',
      '15': 'Espelho de Consumo de Medicamentos e Materiais (Checagem Beira-Leito)',
      '16': 'Termo de Pertences do Paciente e Declaração de Acompanhante',
      '17': 'Guia de Autorização de Exames Complementares Internos',
      '19': 'Nota de Débito Provisória / Contrato de Prestação de Serviços Hospitalares',
      '22': 'Sumário de Alta Hospitalar e Orientações Pós-Internação'
    }
  },
  {
    tipo: 'URGÊNCIA',
    classe: 'urgencia',
    nums: ['2', '4', '7', '10', '11', '12', '13', '15', '16', '17', '20', '21', '23'],
    description: 'Documentos obrigatórios para internações via Pronto-Socorro / Sala Vermelha / UTI em caráter de urgência.',
    documentDetails: {
      '2': 'Termo de Ciência de Débito e Autorização Emergencial',
      '4': 'Boletim de Atendimento de Urgência (BAU) e Classificação de Risco',
      '7': 'Solicitação de Internação em Caráter de Urgência / Justificativa Médica',
      '10': 'Termo de Consentimento Informado para Procedimentos de Emergência',
      '11': 'Ficha de Avaliação Inicial da Equipe Multiprofissional',
      '12': 'Folha de Cuidados Intensivos / Monitorização Hemodinâmica',
      '13': 'Evolução Diária Médica e de Enfermagem (Urgência)',
      '15': 'Checklist de Transferência Interna (PS para Leito / UTI)',
      '16': 'Termo de Pertences / Guarda de Valores na Urgência',
      '17': 'Formulário de Notificação de Eventos e Pendências de Convênio',
      '20': 'Guia TISS de Solicitação de Internação de Urgência assinada',
      '21': 'Relatório Circunstanciado de Auditoria Médica Concorrente',
      '23': 'Declaração de Vaga Zero / Protocolo de Regulação e Acomodação'
    }
  },
  {
    tipo: 'ELETIVO',
    classe: 'eletivo',
    nums: ['2', '4', '7', '10', '11', '12', '13', '15', '16', '17', '21'],
    description: 'Documentação institucional para pacientes com cirurgias ou procedimentos eletivos previamente agendados e autorizados.',
    documentDetails: {
      '2': 'Termo de Admissão Eletiva e Responsabilidade de Co-Participação',
      '4': 'Ficha Cadastral do Paciente e Cópia da Guia TISS Autorizada',
      '7': 'Pedido Médico Original com CID-10, Procedimentos e Laudos Pré-Operatórios',
      '10': 'Termo de Consentimento Livre e Esclarecido (TCLE) Cirúrgico',
      '11': 'Avaliação Pré-Anestésica (APA) e Risco Cirúrgico Cardiológico',
      '12': 'Prescrição Pré-Operatória e Checklist de Cirurgia Segura (OMS)',
      '13': 'Evolução e Anotações de Enfermagem Pós-Operatória',
      '15': 'Controle de Materiais Especiais e OPME Utilizados em Sala',
      '16': 'Termo de Acompanhante e Normas de Visitação Hospitalar',
      '17': 'Formulário de Solicitação de Prorrogação de Diárias (se ultrapassar)',
      '21': 'Relatório de Fechamento de Conta Hospitalar e Faturamento'
    }
  }
];
