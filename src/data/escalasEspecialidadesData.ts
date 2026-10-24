export interface PlantonistaContato {
  id: string;
  nome: string;
  titulo?: string;
  especialidade: string;
  subArea?: string; // ex: Quadril, Trauma, Joelho, etc.
  telefone: string;
  whatsapp?: string;
  crm?: string;
  rqe?: string;
  observacoes?: string;
}

export interface EscalaDiaria {
  dia: number; // 1 a 31
  dataStr: string; // "01/10/2026"
  diaSemana: 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado' | 'Domingo';
  // Para Ortopedia que possui 3 turnos
  turnoDiurno?: string; // 07h às 19h
  turnoIntermediario?: string; // 19h às 22h
  turnoNoturno?: string; // 22h às 07h
  // Para escalas de 24h ou sobreaviso único
  plantonista?: string;
  observacaoDia?: string;
}

export interface EscalaEspecialidade {
  id: string; // 'ortopedia' | 'neurocirurgia' | 'vascular' | 'nefrologia' | 'neurologia'
  nome: string;
  setor: string;
  mes: string; // "OUTUBRO"
  ano: string; // "2026"
  tipoPlantao: 'Presencial 24h' | 'Sobreaviso' | 'Ambulatorial / PS' | 'Plantão PS';
  responsavelTecnico?: string;
  orientacoesGerais?: string[];
  telefonesUteis?: { nome: string; numero: string }[];
  plantonistas: PlantonistaContato[];
  dias: EscalaDiaria[];
}

export interface EscalasMensaisPorMes {
  mesAnoId: string; // "2026-10"
  mesExtenso: string; // "Outubro / 2026"
  escalas: Record<string, EscalaEspecialidade>;
}

// ============================================================================
// ESCALAS OFICIAIS DE OUTUBRO / 2026 - HOSPITAL PALMAS MEDICAL CENTER
// ============================================================================

export const ESCALA_ORTOPEDIA_OUTUBRO_2026: EscalaEspecialidade = {
  id: 'ortopedia',
  nome: 'Ortopedia & Traumatologia',
  setor: 'Pronto-Socorro / Centro Cirúrgico',
  mes: 'OUTUBRO',
  ano: '2026',
  tipoPlantao: 'Presencial 24h',
  responsavelTecnico: 'Coordenação Médica de Ortopedia HMC',
  orientacoesGerais: [
    'Casos cirúrgicos que chegarem devem ser colocados imediatamente no grupo geral do PS.',
    'Troca de plantões será realizada apenas com autorização prévia da coordenação médica.',
    'O original desta escala deve ser apresentado realizado no aplicativo.',
    'A coordenação poderá fazer alterações necessárias para melhor andamento do serviço assistencial.',
    'EM CASO DE EMERGÊNCIA, ACIONE O ATENDIMENTO AO PACIENTE E ACIONE O ESPECIALISTA RESPONSÁVEL.'
  ],
  telefonesUteis: [
    { nome: 'Pronto Socorro HMC', numero: '(63) 3215-9123' },
    { nome: 'Central Centro Cirúrgico HM', numero: '(63) 3216-8883' },
    { nome: 'Central Centro Cirúrgico HE', numero: '(63) 3807-4078' }
  ],
  plantonistas: [
    { id: 'ort-1', nome: 'Dr. Fernando', especialidade: 'Ortopedia', subArea: 'Quadril', telefone: '(63) 98111-1981' },
    { id: 'ort-2', nome: 'Dr. Rômulo', especialidade: 'Ortopedia', subArea: 'Trauma', telefone: '(63) 98405-5873' },
    { id: 'ort-3', nome: 'Dr. André', especialidade: 'Ortopedia', subArea: 'Pediátrica', telefone: '(63) 99204-6912' },
    { id: 'ort-4', nome: 'Dra. Gabriela', especialidade: 'Ortopedia', subArea: 'Pediátrica', telefone: '(63) 99105-6866' },
    { id: 'ort-5', nome: 'Dr. Sebastião', especialidade: 'Ortopedia', subArea: 'Joelho', telefone: '(63) 98115-1968' },
    { id: 'ort-6', nome: 'Dr. Divino', especialidade: 'Ortopedia', subArea: 'Ombro', telefone: '(63) 99202-2116' },
    { id: 'ort-7', nome: 'Dr. Cayo', especialidade: 'Ortopedia', subArea: 'Trauma', telefone: '(63) 98134-6866' },
    { id: 'ort-8', nome: 'Dr. Renan', especialidade: 'Ortopedia', subArea: 'Ombro', telefone: '(63) 98108-8024' },
    { id: 'ort-9', nome: 'Dra. Estefaní', especialidade: 'Ortopedia', subArea: 'Trauma', telefone: '(63) 98112-0418' },
    { id: 'ort-10', nome: 'Dr. Ricardo', especialidade: 'Ortopedia', subArea: 'Mão', telefone: '(63) 98152-1000' },
    { id: 'ort-11', nome: 'Dr. Ulisses', especialidade: 'Ortopedia', subArea: 'Trauma', telefone: '(63) 99204-0086' },
    { id: 'ort-12', nome: 'Dr. Hélio', especialidade: 'Ortopedia', subArea: 'Coluna', telefone: '(63) 98166-8854' },
    { id: 'ort-13', nome: 'Dr. Ismael', especialidade: 'Ortopedia', subArea: 'Trauma', telefone: '(63) 98210-3865' },
    { id: 'ort-14', nome: 'Dr. Willian', especialidade: 'Ortopedia', subArea: 'Trauma', telefone: '(63) 98416-3555' },
    { id: 'ort-15', nome: 'Dr. Douglas', especialidade: 'Ortopedia', subArea: 'Joelho', telefone: '(63) 98100-1000' },
    { id: 'ort-16', nome: 'Dra. Thayene', especialidade: 'Ortopedia', subArea: 'Quadril', telefone: '(63) 98207-4863' },
    { id: 'ort-17', nome: 'Dr. Pedro', especialidade: 'Ortopedia', subArea: 'Joelho', telefone: '(63) 98207-3031' },
    { id: 'ort-18', nome: 'Dr. Jonathan', especialidade: 'Ortopedia', subArea: 'Trauma', telefone: '(63) 98127-6570' },
    { id: 'ort-19', nome: 'Dr. Saulo', especialidade: 'Ortopedia', subArea: 'Joelho', telefone: '(63) 98112-8880' }
  ],
  dias: [
    { dia: 1, dataStr: '01/10/2026', diaSemana: 'Quinta-feira', turnoDiurno: 'Dr. André', turnoIntermediario: 'Dr. Pedro', turnoNoturno: 'Dr. Pedro' },
    { dia: 2, dataStr: '02/10/2026', diaSemana: 'Sexta-feira', turnoDiurno: 'Dra. Estefaní', turnoIntermediario: 'Dra. Estefaní', turnoNoturno: 'Dra. Estefaní' },
    { dia: 3, dataStr: '03/10/2026', diaSemana: 'Sábado', turnoDiurno: 'Dr. André', turnoIntermediario: 'Dr. Ismael', turnoNoturno: 'Dr. Ismael' },
    { dia: 4, dataStr: '04/10/2026', diaSemana: 'Domingo', turnoDiurno: 'Dr. Yvan', turnoIntermediario: 'Dra. Thayene', turnoNoturno: 'Dra. Thayene' },
    { dia: 5, dataStr: '05/10/2026', diaSemana: 'Segunda-feira', turnoDiurno: 'Dra. Gabriela', turnoIntermediario: 'Dra. Gabriela', turnoNoturno: 'Dra. Gabriela' },
    { dia: 6, dataStr: '06/10/2026', diaSemana: 'Terça-feira', turnoDiurno: 'Dr. Ulisses', turnoIntermediario: 'Dr. Divino', turnoNoturno: 'Dr. Divino' },
    { dia: 7, dataStr: '07/10/2026', diaSemana: 'Quarta-feira', turnoDiurno: 'Dr. Fernando', turnoIntermediario: 'Dr. Fernando', turnoNoturno: 'Dr. Fernando' },
    { dia: 8, dataStr: '08/10/2026', diaSemana: 'Quinta-feira', turnoDiurno: 'Dr. André', turnoIntermediario: 'Dr. Pedro', turnoNoturno: 'Dr. Pedro' },
    { dia: 9, dataStr: '09/10/2026', diaSemana: 'Sexta-feira', turnoDiurno: 'Dra. Estefaní', turnoIntermediario: 'Dr. Ricardo', turnoNoturno: 'Dr. Ricardo' },
    { dia: 10, dataStr: '10/10/2026', diaSemana: 'Sábado', turnoDiurno: 'Dr. Rômulo', turnoIntermediario: 'Dr. Yvan', turnoNoturno: 'Dr. Yvan' },
    { dia: 11, dataStr: '11/10/2026', diaSemana: 'Domingo', turnoDiurno: 'Dr. André', turnoIntermediario: 'Dra. Thayene', turnoNoturno: 'Dra. Thayene' },
    { dia: 12, dataStr: '12/10/2026', diaSemana: 'Segunda-feira', turnoDiurno: 'Dr. Jonathan', turnoIntermediario: 'Dr. Jonathan', turnoNoturno: 'Dr. Jonathan' },
    { dia: 13, dataStr: '13/10/2026', diaSemana: 'Terça-feira', turnoDiurno: 'Dr. Yvan', turnoIntermediario: 'Dr. Cayo', turnoNoturno: 'Dr. Cayo' },
    { dia: 14, dataStr: '14/10/2026', diaSemana: 'Quarta-feira', turnoDiurno: 'Dr. Sebastião', turnoIntermediario: 'Dr. Ismael', turnoNoturno: 'Dr. Ismael' },
    { dia: 15, dataStr: '15/10/2026', diaSemana: 'Quinta-feira', turnoDiurno: 'Dr. André', turnoIntermediario: 'Dr. Rômulo', turnoNoturno: 'Dr. Rômulo' },
    { dia: 16, dataStr: '16/10/2026', diaSemana: 'Sexta-feira', turnoDiurno: 'Dr. Ricardo', turnoIntermediario: 'Dr. Ricardo', turnoNoturno: 'Dr. Ricardo' },
    { dia: 17, dataStr: '17/10/2026', diaSemana: 'Sábado', turnoDiurno: 'Dr. Rômulo', turnoIntermediario: 'Dr. Ismael', turnoNoturno: 'Dr. Ismael' },
    { dia: 18, dataStr: '18/10/2026', diaSemana: 'Domingo', turnoDiurno: 'Dr. Yvan', turnoIntermediario: 'Dr. Yvan', turnoNoturno: 'Dr. Yvan' },
    { dia: 19, dataStr: '19/10/2026', diaSemana: 'Segunda-feira', turnoDiurno: 'Dra. Gabriela', turnoIntermediario: 'Dra. Gabriela', turnoNoturno: 'Dra. Gabriela' },
    { dia: 20, dataStr: '20/10/2026', diaSemana: 'Terça-feira', turnoDiurno: 'Dr. Sebastião', turnoIntermediario: 'Dr. Divino', turnoNoturno: 'Dr. Divino' },
    { dia: 21, dataStr: '21/10/2026', diaSemana: 'Quarta-feira', turnoDiurno: 'Dr. Fernando', turnoIntermediario: 'Dr. Fernando', turnoNoturno: 'Dr. Fernando' },
    { dia: 22, dataStr: '22/10/2026', diaSemana: 'Quinta-feira', turnoDiurno: 'Dr. André', turnoIntermediario: 'Dr. Rômulo', turnoNoturno: 'Dr. Rômulo' },
    { dia: 23, dataStr: '23/10/2026', diaSemana: 'Sexta-feira', turnoDiurno: 'Dra. Estefaní', turnoIntermediario: 'Dra. Estefaní', turnoNoturno: 'Dra. Estefaní' },
    { dia: 24, dataStr: '24/10/2026', diaSemana: 'Sábado', turnoDiurno: 'Dr. Rômulo', turnoIntermediario: 'Dr. Hélio', turnoNoturno: 'Dr. Hélio' },
    { dia: 25, dataStr: '25/10/2026', diaSemana: 'Domingo', turnoDiurno: 'Dr. André', turnoIntermediario: 'Dra. Thayene', turnoNoturno: 'Dra. Thayene' },
    { dia: 26, dataStr: '26/10/2026', diaSemana: 'Segunda-feira', turnoDiurno: 'Dra. Gabriela', turnoIntermediario: 'Dra. Gabriela', turnoNoturno: 'Dra. Gabriela' },
    { dia: 27, dataStr: '27/10/2026', diaSemana: 'Terça-feira', turnoDiurno: 'Dr. Ulisses', turnoIntermediario: 'Dr. Divino', turnoNoturno: 'Dr. Divino' },
    { dia: 28, dataStr: '28/10/2026', diaSemana: 'Quarta-feira', turnoDiurno: 'Dr. Sebastião', turnoIntermediario: 'Dr. Rômulo', turnoNoturno: 'Dr. Rômulo' },
    { dia: 29, dataStr: '29/10/2026', diaSemana: 'Quinta-feira', turnoDiurno: 'Dr. André', turnoIntermediario: 'Dr. Rômulo', turnoNoturno: 'Dr. Rômulo' },
    { dia: 30, dataStr: '30/10/2026', diaSemana: 'Sexta-feira', turnoDiurno: 'Dra. Estefaní', turnoIntermediario: 'Dra. Estefaní', turnoNoturno: 'Dra. Estefaní' },
    { dia: 31, dataStr: '31/10/2026', diaSemana: 'Sábado', turnoDiurno: 'Dr. Rômulo', turnoIntermediario: 'Dr. Ismael', turnoNoturno: 'Dr. Ismael' }
  ]
};

export const ESCALA_NEUROCIRURGIA_OUTUBRO_2026: EscalaEspecialidade = {
  id: 'neurocirurgia',
  nome: 'Neurocirurgia',
  setor: 'Pronto-Socorro & Sobreaviso Cirúrgico',
  mes: 'OUTUBRO',
  ano: '2026',
  tipoPlantao: 'Sobreaviso',
  responsavelTecnico: 'Equipe de Neurocirurgia Rede Medical',
  orientacoesGerais: [
    'Acionamento exclusivo para casos de urgência neurológica e traumatismo cranioencefálico (TCE) com indicação cirúrgica.',
    'Avaliação de exames de tomografia e ressonância deve ser compartilhada previamente com o especialista de plantão.'
  ],
  telefonesUteis: [
    { nome: 'Recepção PS Medical', numero: '(63) 3236-1818' },
    { nome: 'Posto de Enfermagem PS', numero: '(63) 3215-9123' }
  ],
  plantonistas: [
    { id: 'nc-1', nome: 'Dra. Ana Flávia', especialidade: 'Neurocirurgia', telefone: '(63) 99213-9297' },
    { id: 'nc-2', nome: 'Dr. Leonardo Batalha', especialidade: 'Neurocirurgia', telefone: '(61) 98266-1301' },
    { id: 'nc-3', nome: 'Dr. Vinicius Bessa', especialidade: 'Neurocirurgia', telefone: '(63) 9966-2080' }
  ],
  dias: Array.from({ length: 31 }, (_, i) => {
    const dia = i + 1;
    let plantonista = 'Dr. Vinicius Bessa';
    if (dia >= 1 && dia <= 10) plantonista = 'Dr. Vinicius Bessa';
    else if (dia >= 11 && dia <= 20) plantonista = 'Dr. Leonardo Batalha';
    else plantonista = 'Dra. Ana Flávia';

    const d = new Date(2026, 9, dia);
    const diasSemana: EscalaDiaria['diaSemana'][] = [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    return {
      dia,
      dataStr: `${String(dia).padStart(2, '0')}/10/2026`,
      diaSemana: diasSemana[d.getDay()],
      plantonista
    };
  })
};

export const ESCALA_VASCULAR_OUTUBRO_2026: EscalaEspecialidade = {
  id: 'vascular',
  nome: 'Cirurgia Vascular & Endovascular',
  setor: 'Sobreaviso Cirurgia Vascular - Rede Kora Palmas',
  mes: 'OUTUBRO',
  ano: '2026',
  tipoPlantao: 'Sobreaviso',
  responsavelTecnico: 'Dr. Guilherme Marum Olmedo (CRM-TO: 7840 - RQE: 3578/3619/3643)',
  orientacoesGerais: [
    'Escala de sobreaviso para urgências vasculares, isquemia aguda de membros, trombose venosa profunda e sangramentos vasculares.',
    'Acione diretamente o cirurgião vascular escalado no dia correspondente.'
  ],
  telefonesUteis: [
    { nome: 'Central de Atendimento HM', numero: '(63) 3236-1818' }
  ],
  plantonistas: [
    { id: 'vasc-1', nome: 'Dra. Camila Rodrigues', especialidade: 'Cirurgia Vascular', telefone: '(63) 99235-8430' },
    { id: 'vasc-2', nome: 'Dra. Larissa Violato', especialidade: 'Cirurgia Vascular', telefone: '(63) 9948-6462' },
    { id: 'vasc-3', nome: 'Dr. Brenno Conde', especialidade: 'Cirurgia Vascular', telefone: '(63) 9979-7071' },
    { id: 'vasc-4', nome: 'Dr. Guilherme Olmedo', especialidade: 'Cirurgia Vascular', telefone: '(17) 99164-6769', crm: 'CRM-TO 7840' },
    { id: 'vasc-5', nome: 'Dr. Jonathan Campos', especialidade: 'Cirurgia Vascular', telefone: '(11) 99209-2975' },
    { id: 'vasc-6', nome: 'Dr. Felipe Damascena', especialidade: 'Cirurgia Vascular', telefone: '(63) 9975-5575' }
  ],
  dias: [
    { dia: 1, dataStr: '01/10/2026', diaSemana: 'Quinta-feira', plantonista: 'Dr. Guilherme Olmedo' },
    { dia: 2, dataStr: '02/10/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Jonathan Campos' },
    { dia: 3, dataStr: '03/10/2026', diaSemana: 'Sábado', plantonista: 'Dr. Jonathan Campos' },
    { dia: 4, dataStr: '04/10/2026', diaSemana: 'Domingo', plantonista: 'Dr. Jonathan Campos' },
    { dia: 5, dataStr: '05/10/2026', diaSemana: 'Segunda-feira', plantonista: 'Dra. Camila Rodrigues' },
    { dia: 6, dataStr: '06/10/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Larissa Violato' },
    { dia: 7, dataStr: '07/10/2026', diaSemana: 'Quarta-feira', plantonista: 'Dr. Brenno Conde' },
    { dia: 8, dataStr: '08/10/2026', diaSemana: 'Quinta-feira', plantonista: 'Dr. Guilherme Olmedo' },
    { dia: 9, dataStr: '09/10/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Jonathan Campos' },
    { dia: 10, dataStr: '10/10/2026', diaSemana: 'Sábado', plantonista: 'Dra. Camila Rodrigues' },
    { dia: 11, dataStr: '11/10/2026', diaSemana: 'Domingo', plantonista: 'Dra. Camila Rodrigues' },
    { dia: 12, dataStr: '12/10/2026', diaSemana: 'Segunda-feira', plantonista: 'Dra. Camila Rodrigues' },
    { dia: 13, dataStr: '13/10/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Larissa Violato' },
    { dia: 14, dataStr: '14/10/2026', diaSemana: 'Quarta-feira', plantonista: 'Dr. Brenno Conde' },
    { dia: 15, dataStr: '15/10/2026', diaSemana: 'Quinta-feira', plantonista: 'Dr. Guilherme Olmedo' },
    { dia: 16, dataStr: '16/10/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Jonathan Campos' },
    { dia: 17, dataStr: '17/10/2026', diaSemana: 'Sábado', plantonista: 'Dr. Brenno Conde' },
    { dia: 18, dataStr: '18/10/2026', diaSemana: 'Domingo', plantonista: 'Dr. Brenno Conde' },
    { dia: 19, dataStr: '19/10/2026', diaSemana: 'Segunda-feira', plantonista: 'Dra. Camila Rodrigues' },
    { dia: 20, dataStr: '20/10/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Larissa Violato' },
    { dia: 21, dataStr: '21/10/2026', diaSemana: 'Quarta-feira', plantonista: 'Dr. Brenno Conde' },
    { dia: 22, dataStr: '22/10/2026', diaSemana: 'Quinta-feira', plantonista: 'Dr. Brenno Conde' },
    { dia: 23, dataStr: '23/10/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Jonathan Campos' },
    { dia: 24, dataStr: '24/10/2026', diaSemana: 'Sábado', plantonista: 'Dra. Larissa Violato' },
    { dia: 25, dataStr: '25/10/2026', diaSemana: 'Domingo', plantonista: 'Dra. Larissa Violato' },
    { dia: 26, dataStr: '26/10/2026', diaSemana: 'Segunda-feira', plantonista: 'Dra. Camila Rodrigues' },
    { dia: 27, dataStr: '27/10/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Larissa Violato' },
    { dia: 28, dataStr: '28/10/2026', diaSemana: 'Quarta-feira', plantonista: 'Dr. Brenno Conde' },
    { dia: 29, dataStr: '29/10/2026', diaSemana: 'Quinta-feira', plantonista: 'Dr. Guilherme Olmedo' },
    { dia: 30, dataStr: '30/10/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Jonathan Campos' },
    { dia: 31, dataStr: '31/10/2026', diaSemana: 'Sábado', plantonista: 'Dr. Guilherme Olmedo' }
  ]
};

export const ESCALA_NEFROLOGIA_OUTUBRO_2026: EscalaEspecialidade = {
  id: 'nefrologia',
  nome: 'Nefrologia',
  setor: 'Hemodiálise & Pareceres Hospitalares',
  mes: 'OUTUBRO',
  ano: '2026',
  tipoPlantao: 'Sobreaviso',
  responsavelTecnico: 'Equipe de Nefrologia Rede Kora',
  orientacoesGerais: [
    'Escala oficial de trabalho médico na especialidade de Nefrologia do mês de Outubro/2026.',
    'Atendimento de pareceres na UTI e Enfermarias, hemodiálise beira-leito e intercorrências renais agudas.'
  ],
  telefonesUteis: [
    { nome: 'Posto UTI Hospitalar', numero: '(63) 3216-8883' }
  ],
  plantonistas: [
    { id: 'nefro-1', nome: 'Dra. Aline Neres', especialidade: 'Nefrologia', telefone: '(11) 98741-4642' },
    { id: 'nefro-2', nome: 'Dra. Adryane Reis', especialidade: 'Nefrologia', telefone: '(82) 99191-0320' },
    { id: 'nefro-3', nome: 'Dr. Bruno Aguiar Pinheiro', especialidade: 'Nefrologia', telefone: '(63) 99967-0283' },
    { id: 'nefro-4', nome: 'Dr. Giordano Floripe Ginani', especialidade: 'Nefrologia', telefone: '(94) 99194-0618' },
    { id: 'nefro-5', nome: 'Dr. Jenyffer Bandeira', especialidade: 'Nefrologia', telefone: '(47) 98884-2828' },
    { id: 'nefro-6', nome: 'Dr. Vinícius de Freitas Orsolin', especialidade: 'Nefrologia', telefone: '(94) 99134-1734' }
  ],
  dias: [
    { dia: 1, dataStr: '01/10/2026', diaSemana: 'Quinta-feira', plantonista: 'Dr. Jenyffer Bandeira' },
    { dia: 2, dataStr: '02/10/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Vinícius de Freitas Orsolin' },
    { dia: 3, dataStr: '03/10/2026', diaSemana: 'Sábado', plantonista: 'Dr. Jenyffer Bandeira' },
    { dia: 4, dataStr: '04/10/2026', diaSemana: 'Domingo', plantonista: 'Dr. Jenyffer Bandeira' },
    { dia: 5, dataStr: '05/10/2026', diaSemana: 'Segunda-feira', plantonista: 'Dr. Vinícius de Freitas Orsolin' },
    { dia: 6, dataStr: '06/10/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Adryane Reis' },
    { dia: 7, dataStr: '07/10/2026', diaSemana: 'Quarta-feira', plantonista: 'Dra. Adryane Reis' },
    { dia: 8, dataStr: '08/10/2026', diaSemana: 'Quinta-feira', plantonista: 'Dra. Adryane Reis' },
    { dia: 9, dataStr: '09/10/2026', diaSemana: 'Sexta-feira', plantonista: 'Dra. Adryane Reis' },
    { dia: 10, dataStr: '10/10/2026', diaSemana: 'Sábado', plantonista: 'Dra. Adryane Reis' },
    { dia: 11, dataStr: '11/10/2026', diaSemana: 'Domingo', plantonista: 'Dra. Adryane Reis' },
    { dia: 12, dataStr: '12/10/2026', diaSemana: 'Segunda-feira', plantonista: 'Dr. Vinícius de Freitas Orsolin' },
    { dia: 13, dataStr: '13/10/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Adryane Reis' },
    { dia: 14, dataStr: '14/10/2026', diaSemana: 'Quarta-feira', plantonista: 'Dr. Bruno Aguiar Pinheiro' },
    { dia: 15, dataStr: '15/10/2026', diaSemana: 'Quinta-feira', plantonista: 'Dr. Bruno Aguiar Pinheiro' },
    { dia: 16, dataStr: '16/10/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Bruno Aguiar Pinheiro' },
    { dia: 17, dataStr: '17/10/2026', diaSemana: 'Sábado', plantonista: 'Dr. Jenyffer Bandeira' },
    { dia: 18, dataStr: '18/10/2026', diaSemana: 'Domingo', plantonista: 'Dr. Jenyffer Bandeira' },
    { dia: 19, dataStr: '19/10/2026', diaSemana: 'Segunda-feira', plantonista: 'Dr. Giordano Floripe Ginani' },
    { dia: 20, dataStr: '20/10/2026', diaSemana: 'Terça-feira', plantonista: 'Dr. Jenyffer Bandeira' },
    { dia: 21, dataStr: '21/10/2026', diaSemana: 'Quarta-feira', plantonista: 'Dr. Jenyffer Bandeira' },
    { dia: 22, dataStr: '22/10/2026', diaSemana: 'Quinta-feira', plantonista: 'Dr. Jenyffer Bandeira' },
    { dia: 23, dataStr: '23/10/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Jenyffer Bandeira' },
    { dia: 24, dataStr: '24/10/2026', diaSemana: 'Sábado', plantonista: 'Dr. Vinícius de Freitas Orsolin' },
    { dia: 25, dataStr: '25/10/2026', diaSemana: 'Domingo', plantonista: 'Dr. Vinícius de Freitas Orsolin' },
    { dia: 26, dataStr: '26/10/2026', diaSemana: 'Segunda-feira', plantonista: 'Dr. Giordano Floripe Ginani' },
    { dia: 27, dataStr: '27/10/2026', diaSemana: 'Terça-feira', plantonista: 'Dr. Jenyffer Bandeira' },
    { dia: 28, dataStr: '28/10/2026', diaSemana: 'Quarta-feira', plantonista: 'Dr. Jenyffer Bandeira' },
    { dia: 29, dataStr: '29/10/2026', diaSemana: 'Quinta-feira', plantonista: 'Dr. Giordano Floripe Ginani' },
    { dia: 30, dataStr: '30/10/2026', diaSemana: 'Sexta-feira', plantonista: 'Dra. Adryane Reis' },
    { dia: 31, dataStr: '31/10/2026', diaSemana: 'Sábado', plantonista: 'Dra. Adryane Reis' }
  ]
};

export const ESCALA_NEUROLOGIA_OUTUBRO_2026: EscalaEspecialidade = {
  id: 'neurologia',
  nome: 'Neurologia Clínica',
  setor: 'Pronto-Socorro & Pareceres Neurológicos',
  mes: 'OUTUBRO',
  ano: '2026',
  tipoPlantao: 'Sobreaviso',
  responsavelTecnico: 'Dra. Priscila Leite',
  orientacoesGerais: [
    'ACIONAMENTO SEMPRE POR LIGAÇÃO TELEFÔNICA.',
    'Em casos de AVC agudo, acionar com prioridade máxima o neurologista de sobreaviso para protocolo de trombólise.',
    'Para pareceres eletivos de enfermaria, encaminhar pedido via sistema hospitalar.'
  ],
  telefonesUteis: [
    { nome: 'Pronto-Socorro Palmas Medical', numero: '(63) 3236-1818' },
    { nome: 'Recepção Central', numero: '(63) 3215-9123' }
  ],
  plantonistas: [
    { id: 'neuro-1', nome: 'Dra. Priscila Leite', especialidade: 'Neurologia', telefone: '(61) 99966-5550' },
    { id: 'neuro-2', nome: 'Dra. Georgia', especialidade: 'Neurologia', telefone: '(61) 99838-0158' },
    { id: 'neuro-3', nome: 'Dr. Ray', especialidade: 'Neurologia', telefone: '(63) 98147-1737' },
    { id: 'neuro-4', nome: 'Dr. Murilo', especialidade: 'Neurologia', telefone: '(63) 99203-1010' },
    { id: 'neuro-5', nome: 'Dra. Aline', especialidade: 'Neurologia', telefone: '(62) 98135-4000' }
  ],
  dias: [
    { dia: 1, dataStr: '01/10/2026', diaSemana: 'Quinta-feira', plantonista: 'Dra. Priscila Leite' },
    { dia: 2, dataStr: '02/10/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Ray' },
    { dia: 3, dataStr: '03/10/2026', diaSemana: 'Sábado', plantonista: 'Manhã: Dra. Aline / Tarde e Noite: Dr. Murilo' },
    { dia: 4, dataStr: '04/10/2026', diaSemana: 'Domingo', plantonista: 'Dr. Ray' },
    { dia: 5, dataStr: '05/10/2026', diaSemana: 'Segunda-feira', plantonista: 'Dr. Murilo' },
    { dia: 6, dataStr: '06/10/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Aline' },
    { dia: 7, dataStr: '07/10/2026', diaSemana: 'Quarta-feira', plantonista: 'Dra. Aline' },
    { dia: 8, dataStr: '08/10/2026', diaSemana: 'Quinta-feira', plantonista: 'Dr. Murilo' },
    { dia: 9, dataStr: '09/10/2026', diaSemana: 'Sexta-feira', plantonista: 'Dra. Aline' },
    { dia: 10, dataStr: '10/10/2026', diaSemana: 'Sábado', plantonista: 'Dr. Murilo' },
    { dia: 11, dataStr: '11/10/2026', diaSemana: 'Domingo', plantonista: 'Dr. Murilo' },
    { dia: 12, dataStr: '12/10/2026', diaSemana: 'Segunda-feira', plantonista: 'Dr. Murilo' },
    { dia: 13, dataStr: '13/10/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Georgia' },
    { dia: 14, dataStr: '14/10/2026', diaSemana: 'Quarta-feira', plantonista: 'Dra. Aline' },
    { dia: 15, dataStr: '15/10/2026', diaSemana: 'Quinta-feira', plantonista: 'Dra. Georgia' },
    { dia: 16, dataStr: '16/10/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Ray' },
    { dia: 17, dataStr: '17/10/2026', diaSemana: 'Sábado', plantonista: 'Dr. Ray' },
    { dia: 18, dataStr: '18/10/2026', diaSemana: 'Domingo', plantonista: 'Dr. Ray' },
    { dia: 19, dataStr: '19/10/2026', diaSemana: 'Segunda-feira', plantonista: 'Dr. Murilo' },
    { dia: 20, dataStr: '20/10/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Georgia' },
    { dia: 21, dataStr: '21/10/2026', diaSemana: 'Quarta-feira', plantonista: 'Dra. Aline' },
    { dia: 22, dataStr: '22/10/2026', diaSemana: 'Quinta-feira', plantonista: 'Dra. Priscila Leite' },
    { dia: 23, dataStr: '23/10/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Ray' },
    { dia: 24, dataStr: '24/10/2026', diaSemana: 'Sábado', plantonista: 'Dra. Georgia' },
    { dia: 25, dataStr: '25/10/2026', diaSemana: 'Domingo', plantonista: 'Dra. Georgia' },
    { dia: 26, dataStr: '26/10/2026', diaSemana: 'Segunda-feira', plantonista: 'Dr. Murilo' },
    { dia: 27, dataStr: '27/10/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Georgia' },
    { dia: 28, dataStr: '28/10/2026', diaSemana: 'Quarta-feira', plantonista: 'Dra. Georgia' },
    { dia: 29, dataStr: '29/10/2026', diaSemana: 'Quinta-feira', plantonista: 'Dra. Priscila Leite' },
    { dia: 30, dataStr: '30/10/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Ray' },
    { dia: 31, dataStr: '31/10/2026', diaSemana: 'Sábado', plantonista: 'Dra. Priscila Leite' }
  ]
};

// Dicionário Inicial de Escalas Oficiais
export const ESCALAS_INICIAIS: Record<string, EscalaEspecialidade> = {
  ortopedia: ESCALA_ORTOPEDIA_OUTUBRO_2026,
  neurocirurgia: ESCALA_NEUROCIRURGIA_OUTUBRO_2026,
  vascular: ESCALA_VASCULAR_OUTUBRO_2026,
  nefrologia: ESCALA_NEFROLOGIA_OUTUBRO_2026,
  neurologia: ESCALA_NEUROLOGIA_OUTUBRO_2026
};

export const LISTA_MESES_DISPONIVEIS = [
  { id: '2026-10', label: 'Outubro / 2026 (Ativo)' },
  { id: '2026-11', label: 'Novembro / 2026' },
  { id: '2026-12', label: 'Dezembro / 2026' }
];
