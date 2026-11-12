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
  dia: number; // 1 a 30
  dataStr: string; // "01/11/2026"
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
  id: string; // 'ginecologia' | 'vascular' | 'neurocirurgia' | 'neurologia' | 'nefrologia' | 'ortopedia'
  nome: string;
  setor: string;
  mes: string; // "NOVEMBRO"
  ano: string; // "2026"
  tipoPlantao: 'Presencial 24h' | 'Sobreaviso' | 'Ambulatorial / PS' | 'Plantão PS' | 'Sobreaviso & Plantão Presencial';
  responsavelTecnico?: string;
  orientacoesGerais?: string[];
  telefonesUteis?: { nome: string; numero: string }[];
  plantonistas: PlantonistaContato[];
  dias: EscalaDiaria[];
}

export interface EscalasMensaisPorMes {
  mesAnoId: string; // "2026-11"
  mesExtenso: string; // "Novembro / 2026"
  escalas: Record<string, EscalaEspecialidade>;
}

// Dias da semana para Novembro de 2026 (01/11/2026 = Domingo até 30/11/2026 = Segunda-feira)
const DIAS_SEMANA_NOV_2026: EscalaDiaria['diaSemana'][] = [
  'Domingo',       // 01/11
  'Segunda-feira', // 02/11
  'Terça-feira',   // 03/11
  'Quarta-feira',  // 04/11
  'Quinta-feira',  // 05/11
  'Sexta-feira',   // 06/11
  'Sábado',        // 07/11
  'Domingo',       // 08/11
  'Segunda-feira', // 09/11
  'Terça-feira',   // 10/11
  'Quarta-feira',  // 11/11
  'Quinta-feira',  // 12/11
  'Sexta-feira',   // 13/11
  'Sábado',        // 14/11
  'Domingo',       // 15/11
  'Segunda-feira', // 16/11
  'Terça-feira',   // 17/11
  'Quarta-feira',  // 18/11
  'Quinta-feira',  // 19/11
  'Sexta-feira',   // 20/11
  'Sábado',        // 21/11
  'Domingo',       // 22/11
  'Segunda-feira', // 23/11
  'Terça-feira',   // 24/11
  'Quarta-feira',  // 25/11
  'Quinta-feira',  // 26/11
  'Sexta-feira',   // 27/11
  'Sábado',        // 28/11
  'Domingo',       // 29/11
  'Segunda-feira'  // 30/11
];

// ============================================================================
// 1. ESCALA GINECOLOGIA & OBSTETRÍCIA - NOVEMBRO / 2026 (# ESCALA GO HST)
// ============================================================================
export const ESCALA_GINECOLOGIA_NOVEMBRO_2026: EscalaEspecialidade = {
  id: 'ginecologia',
  nome: 'Ginecologia & Obstetrícia',
  setor: 'Centro Cirúrgico / Maternidade HST & PS Medical',
  mes: 'NOVEMBRO',
  ano: '2026',
  tipoPlantao: 'Sobreaviso & Plantão Presencial',
  responsavelTecnico: 'Coordenação de Ginecologia e Obstetrícia HST',
  orientacoesGerais: [
    'Escala oficial de Ginecologia e Obstetrícia (# ESCALA GO HST - NOV-26).',
    'Acionamento imediato em casos de intercorrências obstétricas, trabalho de parto, hemorragias e emergências ginecológicas.',
    'Em casos cirúrgicos de urgência, comunicar imediatamente o Centro Cirúrgico e a equipe de enfermagem.'
  ],
  telefonesUteis: [
    { nome: 'Recepção Pronto-Socorro', numero: '(63) 3236-1818' },
    { nome: 'Centro Cirúrgico HST', numero: '(63) 3215-9123' },
    { nome: 'Posto de Enfermagem GO', numero: '(63) 3216-8883' }
  ],
  plantonistas: [
    { id: 'go-1', nome: 'Dr. Luciano', especialidade: 'Ginecologia & Obstetrícia', telefone: '(63) 98405-1234', subArea: 'Ginecologia Geral / GO' },
    { id: 'go-2', nome: 'Dr. Giuliano', especialidade: 'Ginecologia & Obstetrícia', telefone: '(63) 98112-5678', subArea: 'Cirurgia Ginecológica' },
    { id: 'go-3', nome: 'Dra. Samantha', especialidade: 'Ginecologia & Obstetrícia', telefone: '(63) 99204-9988', subArea: 'Obstetrícia de Alto Risco' },
    { id: 'go-4', nome: 'Dra. Iracy', especialidade: 'Ginecologia & Obstetrícia', telefone: '(63) 99988-7766', subArea: 'Ginecologia & Obstetrícia' }
  ],
  dias: [
    { dia: 1, dataStr: '01/11/2026', diaSemana: 'Domingo', plantonista: 'Dr. Luciano' },
    { dia: 2, dataStr: '02/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Dr. Giuliano', observacaoDia: 'Feriado Finados' },
    { dia: 3, dataStr: '03/11/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Samantha' },
    { dia: 4, dataStr: '04/11/2026', diaSemana: 'Quarta-feira', plantonista: 'Dra. Iracy' },
    { dia: 5, dataStr: '05/11/2026', diaSemana: 'Quinta-feira', plantonista: 'Dra. Samantha' },
    { dia: 6, dataStr: '06/11/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Luciano' },
    { dia: 7, dataStr: '07/11/2026', diaSemana: 'Sábado', plantonista: 'Dr. Luciano' },
    { dia: 8, dataStr: '08/11/2026', diaSemana: 'Domingo', plantonista: 'Dr. Luciano' },
    { dia: 9, dataStr: '09/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Sem Plantonista Definido', observacaoDia: 'Vago no documento' },
    { dia: 10, dataStr: '10/11/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Samantha' },
    { dia: 11, dataStr: '11/11/2026', diaSemana: 'Quarta-feira', plantonista: 'Dra. Iracy' },
    { dia: 12, dataStr: '12/11/2026', diaSemana: 'Quinta-feira', plantonista: 'Dra. Samantha' },
    { dia: 13, dataStr: '13/11/2026', diaSemana: 'Sexta-feira', plantonista: 'Sem Plantonista Definido', observacaoDia: 'Vago no documento' },
    { dia: 14, dataStr: '14/11/2026', diaSemana: 'Sábado', plantonista: 'Dr. Luciano' },
    { dia: 15, dataStr: '15/11/2026', diaSemana: 'Domingo', plantonista: 'Dr. Luciano', observacaoDia: 'Proclamação da República' },
    { dia: 16, dataStr: '16/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Dr. Giuliano' },
    { dia: 17, dataStr: '17/11/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Samantha' },
    { dia: 18, dataStr: '18/11/2026', diaSemana: 'Quarta-feira', plantonista: 'Dra. Iracy' },
    { dia: 19, dataStr: '19/11/2026', diaSemana: 'Quinta-feira', plantonista: 'Dra. Samantha' },
    { dia: 20, dataStr: '20/11/2026', diaSemana: 'Sexta-feira', plantonista: 'Dra. Iracy (Dia)', observacaoDia: 'Feriado Consciência Negra • Iracy Dia' },
    { dia: 21, dataStr: '21/11/2026', diaSemana: 'Sábado', plantonista: 'Sem Plantonista Definido', observacaoDia: 'Vago no documento' },
    { dia: 22, dataStr: '22/11/2026', diaSemana: 'Domingo', plantonista: 'Sem Plantonista Definido', observacaoDia: 'Vago no documento' },
    { dia: 23, dataStr: '23/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Sem Plantonista Definido', observacaoDia: 'Vago no documento' },
    { dia: 24, dataStr: '24/11/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Samantha' },
    { dia: 25, dataStr: '25/11/2026', diaSemana: 'Quarta-feira', plantonista: 'Dra. Iracy' },
    { dia: 26, dataStr: '26/11/2026', diaSemana: 'Quinta-feira', plantonista: 'Dra. Samantha' },
    { dia: 27, dataStr: '27/11/2026', diaSemana: 'Sexta-feira', plantonista: 'Dra. Samantha' },
    { dia: 28, dataStr: '28/11/2026', diaSemana: 'Sábado', plantonista: 'Dr. Luciano' },
    { dia: 29, dataStr: '29/11/2026', diaSemana: 'Domingo', plantonista: 'Dr. Luciano' },
    { dia: 30, dataStr: '30/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Dr. Giuliano' }
  ]
};

// ============================================================================
// 2. ESCALA SOBREAVISO CIRURGIA VASCULAR - NOVEMBRO / 2026 (REDE KORA PALMAS)
// ============================================================================
export const ESCALA_VASCULAR_NOVEMBRO_2026: EscalaEspecialidade = {
  id: 'vascular',
  nome: 'Cirurgia Vascular & Endovascular',
  setor: 'Sobreaviso Cirurgia Vascular – Rede Kora Palmas',
  mes: 'NOVEMBRO',
  ano: '2026',
  tipoPlantao: 'Sobreaviso',
  responsavelTecnico: 'Dr. Guilherme Marum Olmedo (CRM-TO: 7840 – RQE: 3578/3619/3643)',
  orientacoesGerais: [
    'Escala oficial de sobreaviso para urgências vasculares, isquemia aguda de membros, trombose venosa profunda e sangramentos.',
    'Acione diretamente o cirurgião vascular escalado no dia correspondente através dos números de plantão.',
    'Responsável Técnico: Dr. Guilherme Marum Olmedo • Médico – Cirurgião Vascular e Endovascular.'
  ],
  telefonesUteis: [
    { nome: 'Central de Atendimento HM', numero: '(63) 3236-1818' },
    { nome: 'Posto de Enfermagem PS', numero: '(63) 3215-9123' }
  ],
  plantonistas: [
    { id: 'vasc-1', nome: 'Dra. Camila Rodrigues', especialidade: 'Cirurgia Vascular', telefone: '(63) 99235-8430' },
    { id: 'vasc-2', nome: 'Dra. Larissa Violato', especialidade: 'Cirurgia Vascular', telefone: '(63) 9948-6462' },
    { id: 'vasc-3', nome: 'Dr. Brenno Conde', especialidade: 'Cirurgia Vascular', telefone: '(63) 9979-7071' },
    { id: 'vasc-4', nome: 'Dr. Guilherme Olmedo', especialidade: 'Cirurgia Vascular', telefone: '(17) 99164-6769', crm: 'CRM-TO: 7840', rqe: '3578/3619/3643' },
    { id: 'vasc-5', nome: 'Dr. Jonathan Campos', especialidade: 'Cirurgia Vascular', telefone: '(11) 99209-2975' },
    { id: 'vasc-6', nome: 'Dr. Felipe Damascena', especialidade: 'Cirurgia Vascular', telefone: '(63) 9975-5575' }
  ],
  dias: [
    { dia: 1, dataStr: '01/11/2026', diaSemana: 'Domingo', plantonista: 'Dr. Brenno Conde' },
    { dia: 2, dataStr: '02/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Dra. Camila Rodrigues', observacaoDia: 'Feriado Finados' },
    { dia: 3, dataStr: '03/11/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Larissa Violato' },
    { dia: 4, dataStr: '04/11/2026', diaSemana: 'Quarta-feira', plantonista: 'Dr. Brenno Conde' },
    { dia: 5, dataStr: '05/11/2026', diaSemana: 'Quinta-feira', plantonista: 'Dr. Guilherme Olmedo' },
    { dia: 6, dataStr: '06/11/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Jonathan Campos' },
    { dia: 7, dataStr: '07/11/2026', diaSemana: 'Sábado', plantonista: 'Dra. Camila Rodrigues' },
    { dia: 8, dataStr: '08/11/2026', diaSemana: 'Domingo', plantonista: 'Dra. Camila Rodrigues' },
    { dia: 9, dataStr: '09/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Dra. Camila Rodrigues' },
    { dia: 10, dataStr: '10/11/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Larissa Violato' },
    { dia: 11, dataStr: '11/11/2026', diaSemana: 'Quarta-feira', plantonista: 'Dr. Brenno Conde' },
    { dia: 12, dataStr: '12/11/2026', diaSemana: 'Quinta-feira', plantonista: 'Dr. Guilherme Olmedo' },
    { dia: 13, dataStr: '13/11/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Jonathan Campos' },
    { dia: 14, dataStr: '14/11/2026', diaSemana: 'Sábado', plantonista: 'Dr. Guilherme Olmedo' },
    { dia: 15, dataStr: '15/11/2026', diaSemana: 'Domingo', plantonista: 'Dr. Guilherme Olmedo', observacaoDia: 'Proclamação da República' },
    { dia: 16, dataStr: '16/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Dra. Camila Rodrigues' },
    { dia: 17, dataStr: '17/11/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Larissa Violato' },
    { dia: 18, dataStr: '18/11/2026', diaSemana: 'Quarta-feira', plantonista: 'Dr. Brenno Conde' },
    { dia: 19, dataStr: '19/11/2026', diaSemana: 'Quinta-feira', plantonista: 'Dr. Guilherme Olmedo' },
    { dia: 20, dataStr: '20/11/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Jonathan Campos', observacaoDia: 'Feriado Consciência Negra' },
    { dia: 21, dataStr: '21/11/2026', diaSemana: 'Sábado', plantonista: 'Dra. Larissa Violato' },
    { dia: 22, dataStr: '22/11/2026', diaSemana: 'Domingo', plantonista: 'Dra. Larissa Violato' },
    { dia: 23, dataStr: '23/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Dra. Camila Rodrigues' },
    { dia: 24, dataStr: '24/11/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Larissa Violato' },
    { dia: 25, dataStr: '25/11/2026', diaSemana: 'Quarta-feira', plantonista: 'Dr. Brenno Conde' },
    { dia: 26, dataStr: '26/11/2026', diaSemana: 'Quinta-feira', plantonista: 'Dr. Guilherme Olmedo' },
    { dia: 27, dataStr: '27/11/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Jonathan Campos' },
    { dia: 28, dataStr: '28/11/2026', diaSemana: 'Sábado', plantonista: 'Dr. Brenno Conde' },
    { dia: 29, dataStr: '29/11/2026', diaSemana: 'Domingo', plantonista: 'Dr. Brenno Conde' },
    { dia: 30, dataStr: '30/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Dra. Camila Rodrigues' }
  ]
};

// ============================================================================
// 3. ESCALA NEUROCIRURGIA PS MEDICAL - NOVEMBRO / 2026 (REDE MEDICAL)
// ============================================================================
export const ESCALA_NEUROCIRURGIA_NOVEMBRO_2026: EscalaEspecialidade = {
  id: 'neurocirurgia',
  nome: 'Neurocirurgia',
  setor: 'Pronto-Socorro & Sobreaviso Cirúrgico Medical',
  mes: 'NOVEMBRO',
  ano: '2026',
  tipoPlantao: 'Sobreaviso',
  responsavelTecnico: 'Equipe de Neurocirurgia Rede Medical',
  orientacoesGerais: [
    'Escala oficial de Neurocirurgia PS Medical - Novembro 2026.',
    'Acionamento para casos de urgência neurológica e traumatismo cranioencefálico (TCE) com indicação cirúrgica.',
    'Endereço: Q. 401 Sul Avenida Joaquim Teotônio Segurado, S/N - Conjunto 02 Lote 04 - Plano Diretor Sul, Palmas - TO, 77015-558 • Telefone: (63) 3236-1818.'
  ],
  telefonesUteis: [
    { nome: 'Recepção PS Medical', numero: '(63) 3236-1818' },
    { nome: 'Posto de Enfermagem PS', numero: '(63) 3215-9123' }
  ],
  plantonistas: [
    { id: 'nc-1', nome: 'Dr. Leonardo Batalha', especialidade: 'Neurocirurgia', telefone: '(61) 98266-1301', observacoes: 'Plantonista de 01 a 10/11' },
    { id: 'nc-2', nome: 'Dra. Ana Flávia', especialidade: 'Neurocirurgia', telefone: '(63) 99213-9297', observacoes: 'Plantonista de 11 a 20/11' },
    { id: 'nc-3', nome: 'Dr. Vinicius Bessa', especialidade: 'Neurocirurgia', telefone: '(63) 9966-2080', observacoes: 'Plantonista de 21 a 30/11' }
  ],
  dias: Array.from({ length: 30 }, (_, i) => {
    const dia = i + 1;
    let plantonista = 'Dr. Leonardo Batalha';
    if (dia >= 1 && dia <= 10) {
      plantonista = 'Dr. Leonardo Batalha';
    } else if (dia >= 11 && dia <= 20) {
      plantonista = 'Dra. Ana Flávia';
    } else {
      plantonista = 'Dr. Vinicius Bessa';
    }

    return {
      dia,
      dataStr: `${String(dia).padStart(2, '0')}/11/2026`,
      diaSemana: DIAS_SEMANA_NOV_2026[i],
      plantonista,
      observacaoDia: dia === 2 ? 'Feriado Finados' : dia === 15 ? 'Proclamação da República' : dia === 20 ? 'Consciência Negra' : undefined
    };
  })
};

// ============================================================================
// 4. ESCALA PLANTÃO DA NEUROLOGIA CLÍNICA - NOVEMBRO / 2026
// ============================================================================
export const ESCALA_NEUROLOGIA_NOVEMBRO_2026: EscalaEspecialidade = {
  id: 'neurologia',
  nome: 'Neurologia Clínica',
  setor: 'Pronto-Socorro & Pareceres Neurológicos HMC',
  mes: 'NOVEMBRO',
  ano: '2026',
  tipoPlantao: 'Sobreaviso',
  responsavelTecnico: 'Dra. Priscila Leite (Responsável Técnica)',
  orientacoesGerais: [
    'ACIONAMENTO SEMPRE POR LIGAÇÃO TELEFÔNICA.',
    'Em casos de AVC agudo, acionar com prioridade máxima o neurologista de sobreaviso para protocolo de trombólise.',
    'Para plantões divididos, Manhã corresponde a 07h às 13h / Tarde e Noite das 13h às 07h do dia seguinte.'
  ],
  telefonesUteis: [
    { nome: 'Pronto-Socorro Palmas Medical', numero: '(63) 3236-1818' },
    { nome: 'Recepção Central', numero: '(63) 3215-9123' }
  ],
  plantonistas: [
    { id: 'neuro-1', nome: 'Dra. Priscila Leite', especialidade: 'Neurologia', telefone: '(61) 99966-5550', observacoes: 'Responsável Técnica' },
    { id: 'neuro-2', nome: 'Dra. Georgia', especialidade: 'Neurologia', telefone: '(61) 99838-0158' },
    { id: 'neuro-3', nome: 'Dr. Ray', especialidade: 'Neurologia', telefone: '(63) 98147-1737' },
    { id: 'neuro-4', nome: 'Dr. Murilo', especialidade: 'Neurologia', telefone: '(63) 99203-1010' },
    { id: 'neuro-5', nome: 'Dra. Aline', especialidade: 'Neurologia', telefone: '(62) 98135-4000' }
  ],
  dias: [
    { dia: 1, dataStr: '01/11/2026', diaSemana: 'Domingo', plantonista: 'Dra. Priscila Leite' },
    { dia: 2, dataStr: '02/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Dra. Georgia', observacaoDia: 'Feriado Finados' },
    { dia: 3, dataStr: '03/11/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Georgia' },
    { dia: 4, dataStr: '04/11/2026', diaSemana: 'Quarta-feira', plantonista: 'Manhã: Dra. Georgia | Tarde e Noite: Dra. Aline' },
    { dia: 5, dataStr: '05/11/2026', diaSemana: 'Quinta-feira', plantonista: 'Dra. Georgia' },
    { dia: 6, dataStr: '06/11/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Ray' },
    { dia: 7, dataStr: '07/11/2026', diaSemana: 'Sábado', plantonista: 'Manhã: Dra. Georgia | Tarde e Noite: Dra. Aline' },
    { dia: 8, dataStr: '08/11/2026', diaSemana: 'Domingo', plantonista: 'Dra. Priscila Leite' },
    { dia: 9, dataStr: '09/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Dr. Murilo' },
    { dia: 10, dataStr: '10/11/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Georgia' },
    { dia: 11, dataStr: '11/11/2026', diaSemana: 'Quarta-feira', plantonista: 'Manhã: Dra. Georgia | Tarde e Noite: Dra. Aline' },
    { dia: 12, dataStr: '12/11/2026', diaSemana: 'Quinta-feira', plantonista: 'Dra. Georgia' },
    { dia: 13, dataStr: '13/11/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Ray' },
    { dia: 14, dataStr: '14/11/2026', diaSemana: 'Sábado', plantonista: 'Dr. Ray' },
    { dia: 15, dataStr: '15/11/2026', diaSemana: 'Domingo', plantonista: 'Dr. Ray', observacaoDia: 'Proclamação da República' },
    { dia: 16, dataStr: '16/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Manhã: Dr. Ray | Tarde e Noite: Dr. Murilo' },
    { dia: 17, dataStr: '17/11/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Priscila Leite' },
    { dia: 18, dataStr: '18/11/2026', diaSemana: 'Quarta-feira', plantonista: 'Dr. Ray' },
    { dia: 19, dataStr: '19/11/2026', diaSemana: 'Quinta-feira', plantonista: 'Dra. Priscila Leite' },
    { dia: 20, dataStr: '20/11/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Ray', observacaoDia: 'Feriado Consciência Negra' },
    { dia: 21, dataStr: '21/11/2026', diaSemana: 'Sábado', plantonista: 'Manhã: Dr. Ray | Tarde e Noite: Dr. Murilo' },
    { dia: 22, dataStr: '22/11/2026', diaSemana: 'Domingo', plantonista: 'Manhã: Dr. Ray | Tarde e Noite: Dr. Murilo' },
    { dia: 23, dataStr: '23/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Dr. Murilo' },
    { dia: 24, dataStr: '24/11/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Priscila Leite' },
    { dia: 25, dataStr: '25/11/2026', diaSemana: 'Quarta-feira', plantonista: 'Dr. Murilo' },
    { dia: 26, dataStr: '26/11/2026', diaSemana: 'Quinta-feira', plantonista: 'Dra. Priscila Leite' },
    { dia: 27, dataStr: '27/11/2026', diaSemana: 'Sexta-feira', plantonista: 'Manhã: Dr. Murilo | Tarde e Noite: Dr. Ray' },
    { dia: 28, dataStr: '28/11/2026', diaSemana: 'Sábado', plantonista: 'Dra. Georgia' },
    { dia: 29, dataStr: '29/11/2026', diaSemana: 'Domingo', plantonista: 'Dra. Georgia' },
    { dia: 30, dataStr: '30/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Dr. Murilo' }
  ]
};

// ============================================================================
// 5. ESCALA NEFROLOGIA - NOVEMBRO / 2026 (UNIDADE KORA)
// ============================================================================
export const ESCALA_NEFROLOGIA_NOVEMBRO_2026: EscalaEspecialidade = {
  id: 'nefrologia',
  nome: 'Nefrologia',
  setor: 'Unidade Kora Palmas • Hemodiálise & Pareceres',
  mes: 'NOVEMBRO',
  ano: '2026',
  tipoPlantao: 'Sobreaviso',
  responsavelTecnico: 'Equipe de Nefrologia Rede Kora',
  orientacoesGerais: [
    'Escala oficial de trabalho médico na especialidade de Nefrologia do mês de Novembro/2026 (Unidade Kora).',
    'Atendimento de pareceres na UTI e Enfermarias, hemodiálise beira-leito e intercorrências renais agudas.'
  ],
  telefonesUteis: [
    { nome: 'Posto UTI Hospitalar', numero: '(63) 3216-8883' },
    { nome: 'Central de Atendimento HM', numero: '(63) 3236-1818' }
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
    { dia: 1, dataStr: '01/11/2026', diaSemana: 'Domingo', plantonista: 'Dra. Adryane Reis' },
    { dia: 2, dataStr: '02/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Dr. Vinícius de Freitas Orsolin', observacaoDia: 'Feriado Finados' },
    { dia: 3, dataStr: '03/11/2026', diaSemana: 'Terça-feira', plantonista: 'Dra. Adryane Reis' },
    { dia: 4, dataStr: '04/11/2026', diaSemana: 'Quarta-feira', plantonista: 'Dra. Adryane Reis' },
    { dia: 5, dataStr: '05/11/2026', diaSemana: 'Quinta-feira', plantonista: 'Dra. Adryane Reis' },
    { dia: 6, dataStr: '06/11/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Bruno Aguiar Pinheiro' },
    { dia: 7, dataStr: '07/11/2026', diaSemana: 'Sábado', plantonista: 'Dr. Jenyffer Bandeira' },
    { dia: 8, dataStr: '08/11/2026', diaSemana: 'Domingo', plantonista: 'Dr. Jenyffer Bandeira' },
    { dia: 9, dataStr: '09/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Dr. Vinícius de Freitas Orsolin' },
    { dia: 10, dataStr: '10/11/2026', diaSemana: 'Terça-feira', plantonista: 'Dr. Giordano Floripe Ginani' },
    { dia: 11, dataStr: '11/11/2026', diaSemana: 'Quarta-feira', plantonista: 'Dr. Vinícius de Freitas Orsolin' },
    { dia: 12, dataStr: '12/11/2026', diaSemana: 'Quinta-feira', plantonista: 'Dr. Vinícius de Freitas Orsolin' },
    { dia: 13, dataStr: '13/11/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Vinícius de Freitas Orsolin' },
    { dia: 14, dataStr: '14/11/2026', diaSemana: 'Sábado', plantonista: 'Dr. Vinícius de Freitas Orsolin' },
    { dia: 15, dataStr: '15/11/2026', diaSemana: 'Domingo', plantonista: 'Dr. Vinícius de Freitas Orsolin', observacaoDia: 'Proclamação da República' },
    { dia: 16, dataStr: '16/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Dr. Giordano Floripe Ginani' },
    { dia: 17, dataStr: '17/11/2026', diaSemana: 'Terça-feira', plantonista: 'Dr. Jenyffer Bandeira' },
    { dia: 18, dataStr: '18/11/2026', diaSemana: 'Quarta-feira', plantonista: 'Dr. Jenyffer Bandeira' },
    { dia: 19, dataStr: '19/11/2026', diaSemana: 'Quinta-feira', plantonista: 'Dr. Bruno Aguiar Pinheiro' },
    { dia: 20, dataStr: '20/11/2026', diaSemana: 'Sexta-feira', plantonista: 'Dr. Bruno Aguiar Pinheiro', observacaoDia: 'Feriado Consciência Negra' },
    { dia: 21, dataStr: '21/11/2026', diaSemana: 'Sábado', plantonista: 'Dr. Jenyffer Bandeira' },
    { dia: 22, dataStr: '22/11/2026', diaSemana: 'Domingo', plantonista: 'Dr. Jenyffer Bandeira' },
    { dia: 23, dataStr: '23/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Dr. Giordano Floripe Ginani' },
    { dia: 24, dataStr: '24/11/2026', diaSemana: 'Terça-feira', plantonista: 'Dr. Jenyffer Bandeira' },
    { dia: 25, dataStr: '25/11/2026', diaSemana: 'Quarta-feira', plantonista: 'Dr. Jenyffer Bandeira' },
    { dia: 26, dataStr: '26/11/2026', diaSemana: 'Quinta-feira', plantonista: 'Dra. Adryane Reis' },
    { dia: 27, dataStr: '27/11/2026', diaSemana: 'Sexta-feira', plantonista: 'Dra. Adryane Reis' },
    { dia: 28, dataStr: '28/11/2026', diaSemana: 'Sábado', plantonista: 'Dra. Adryane Reis' },
    { dia: 29, dataStr: '29/11/2026', diaSemana: 'Domingo', plantonista: 'Dra. Adryane Reis' },
    { dia: 30, dataStr: '30/11/2026', diaSemana: 'Segunda-feira', plantonista: 'Dr. Jenyffer Bandeira / Dr. Bruno Aguiar Pinheiro', observacaoDia: 'JEN/BRUNO' }
  ]
};

// ============================================================================
// 6. ESCALA ORTOPEDIA & TRAUMATOLOGIA - NOVEMBRO / 2026 (PRESENCIAL 24H)
// ============================================================================
export const ESCALA_ORTOPEDIA_NOVEMBRO_2026: EscalaEspecialidade = {
  id: 'ortopedia',
  nome: 'Ortopedia & Traumatologia',
  setor: 'Pronto-Socorro / Centro Cirúrgico HMC',
  mes: 'NOVEMBRO',
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
    { dia: 1, dataStr: '01/11/2026', diaSemana: 'Domingo', turnoDiurno: 'Dr. André', turnoIntermediario: 'Dra. Thayene', turnoNoturno: 'Dra. Thayene' },
    { dia: 2, dataStr: '02/11/2026', diaSemana: 'Segunda-feira', turnoDiurno: 'Dra. Gabriela', turnoIntermediario: 'Dra. Gabriela', turnoNoturno: 'Dra. Gabriela', observacaoDia: 'Feriado Finados' },
    { dia: 3, dataStr: '03/11/2026', diaSemana: 'Terça-feira', turnoDiurno: 'Dr. Ulisses', turnoIntermediario: 'Dr. Divino', turnoNoturno: 'Dr. Divino' },
    { dia: 4, dataStr: '04/11/2026', diaSemana: 'Quarta-feira', turnoDiurno: 'Dr. Fernando', turnoIntermediario: 'Dr. Fernando', turnoNoturno: 'Dr. Fernando' },
    { dia: 5, dataStr: '05/11/2026', diaSemana: 'Quinta-feira', turnoDiurno: 'Dr. André', turnoIntermediario: 'Dr. Pedro', turnoNoturno: 'Dr. Pedro' },
    { dia: 6, dataStr: '06/11/2026', diaSemana: 'Sexta-feira', turnoDiurno: 'Dra. Estefaní', turnoIntermediario: 'Dr. Ricardo', turnoNoturno: 'Dr. Ricardo' },
    { dia: 7, dataStr: '07/11/2026', diaSemana: 'Sábado', turnoDiurno: 'Dr. Rômulo', turnoIntermediario: 'Dr. Ismael', turnoNoturno: 'Dr. Ismael' },
    { dia: 8, dataStr: '08/11/2026', diaSemana: 'Domingo', turnoDiurno: 'Dr. André', turnoIntermediario: 'Dra. Thayene', turnoNoturno: 'Dra. Thayene' },
    { dia: 9, dataStr: '09/11/2026', diaSemana: 'Segunda-feira', turnoDiurno: 'Dra. Gabriela', turnoIntermediario: 'Dra. Gabriela', turnoNoturno: 'Dra. Gabriela' },
    { dia: 10, dataStr: '10/11/2026', diaSemana: 'Terça-feira', turnoDiurno: 'Dr. Sebastião', turnoIntermediario: 'Dr. Divino', turnoNoturno: 'Dr. Divino' },
    { dia: 11, dataStr: '11/11/2026', diaSemana: 'Quarta-feira', turnoDiurno: 'Dr. Fernando', turnoIntermediario: 'Dr. Fernando', turnoNoturno: 'Dr. Fernando' },
    { dia: 12, dataStr: '12/11/2026', diaSemana: 'Quinta-feira', turnoDiurno: 'Dr. André', turnoIntermediario: 'Dr. Pedro', turnoNoturno: 'Dr. Pedro' },
    { dia: 13, dataStr: '13/11/2026', diaSemana: 'Sexta-feira', turnoDiurno: 'Dra. Estefaní', turnoIntermediario: 'Dr. Ricardo', turnoNoturno: 'Dr. Ricardo' },
    { dia: 14, dataStr: '14/11/2026', diaSemana: 'Sábado', turnoDiurno: 'Dr. Rômulo', turnoIntermediario: 'Dr. Ismael', turnoNoturno: 'Dr. Ismael' },
    { dia: 15, dataStr: '15/11/2026', diaSemana: 'Domingo', turnoDiurno: 'Dr. André', turnoIntermediario: 'Dra. Thayene', turnoNoturno: 'Dra. Thayene', observacaoDia: 'Proclamação da República' },
    { dia: 16, dataStr: '16/11/2026', diaSemana: 'Segunda-feira', turnoDiurno: 'Dra. Gabriela', turnoIntermediario: 'Dra. Gabriela', turnoNoturno: 'Dra. Gabriela' },
    { dia: 17, dataStr: '17/11/2026', diaSemana: 'Terça-feira', turnoDiurno: 'Dr. Ulisses', turnoIntermediario: 'Dr. Divino', turnoNoturno: 'Dr. Divino' },
    { dia: 18, dataStr: '18/11/2026', diaSemana: 'Quarta-feira', turnoDiurno: 'Dr. Sebastião', turnoIntermediario: 'Dr. Ismael', turnoNoturno: 'Dr. Ismael' },
    { dia: 19, dataStr: '19/11/2026', diaSemana: 'Quinta-feira', turnoDiurno: 'Dr. André', turnoIntermediario: 'Dr. Rômulo', turnoNoturno: 'Dr. Rômulo' },
    { dia: 20, dataStr: '20/11/2026', diaSemana: 'Sexta-feira', turnoDiurno: 'Dr. Ricardo', turnoIntermediario: 'Dr. Ricardo', turnoNoturno: 'Dr. Ricardo', observacaoDia: 'Feriado Consciência Negra' },
    { dia: 21, dataStr: '21/11/2026', diaSemana: 'Sábado', turnoDiurno: 'Dr. Rômulo', turnoIntermediario: 'Dr. Ismael', turnoNoturno: 'Dr. Ismael' },
    { dia: 22, dataStr: '22/11/2026', diaSemana: 'Domingo', turnoDiurno: 'Dr. André', turnoIntermediario: 'Dra. Thayene', turnoNoturno: 'Dra. Thayene' },
    { dia: 23, dataStr: '23/11/2026', diaSemana: 'Segunda-feira', turnoDiurno: 'Dra. Gabriela', turnoIntermediario: 'Dra. Gabriela', turnoNoturno: 'Dra. Gabriela' },
    { dia: 24, dataStr: '24/11/2026', diaSemana: 'Terça-feira', turnoDiurno: 'Dr. Sebastião', turnoIntermediario: 'Dr. Divino', turnoNoturno: 'Dr. Divino' },
    { dia: 25, dataStr: '25/11/2026', diaSemana: 'Quarta-feira', turnoDiurno: 'Dr. Fernando', turnoIntermediario: 'Dr. Fernando', turnoNoturno: 'Dr. Fernando' },
    { dia: 26, dataStr: '26/11/2026', diaSemana: 'Quinta-feira', turnoDiurno: 'Dr. André', turnoIntermediario: 'Dr. Rômulo', turnoNoturno: 'Dr. Rômulo' },
    { dia: 27, dataStr: '27/11/2026', diaSemana: 'Sexta-feira', turnoDiurno: 'Dra. Estefaní', turnoIntermediario: 'Dra. Estefaní', turnoNoturno: 'Dra. Estefaní' },
    { dia: 28, dataStr: '28/11/2026', diaSemana: 'Sábado', turnoDiurno: 'Dr. Rômulo', turnoIntermediario: 'Dr. Hélio', turnoNoturno: 'Dr. Hélio' },
    { dia: 29, dataStr: '29/11/2026', diaSemana: 'Domingo', turnoDiurno: 'Dr. André', turnoIntermediario: 'Dra. Thayene', turnoNoturno: 'Dra. Thayene' },
    { dia: 30, dataStr: '30/11/2026', diaSemana: 'Segunda-feira', turnoDiurno: 'Dra. Gabriela', turnoIntermediario: 'Dra. Gabriela', turnoNoturno: 'Dra. Gabriela' }
  ]
};

// Dicionário Inicial de Escalas Oficiais de NOVEMBRO / 2026
export const ESCALAS_INICIAIS: Record<string, EscalaEspecialidade> = {
  ginecologia: ESCALA_GINECOLOGIA_NOVEMBRO_2026,
  vascular: ESCALA_VASCULAR_NOVEMBRO_2026,
  neurocirurgia: ESCALA_NEUROCIRURGIA_NOVEMBRO_2026,
  neurologia: ESCALA_NEUROLOGIA_NOVEMBRO_2026,
  nefrologia: ESCALA_NEFROLOGIA_NOVEMBRO_2026,
  ortopedia: ESCALA_ORTOPEDIA_NOVEMBRO_2026
};

export const LISTA_MESES_DISPONIVEIS = [
  { id: '2026-11', label: 'Novembro / 2026 (Ativo)' },
  { id: '2026-12', label: 'Dezembro / 2026' }
];
