export type AppMode = 'pops-ps' | 'pops-internacao' | 'pops' | 'exames' | 'procedimentos' | 'relatorios' | 'ramais' | 'ai-assistant' | 'pre-guia' | 'fluxo-parecer';

export type ExamTableType = 'ps' | 'amor' | 'lab';

export interface HospitalProcedure {
  id: string;
  description: string;
  diarias: string; // e.g. "1", "1 Apto", "1 Enf", "2 Apto", "0", "ao dia"
  price: number;
  category: 'Diárias & Acomodações' | 'Cirurgia Plástica' | 'Cirurgia Geral & Digestiva' | 'Urologia & Gineco' | 'Ortopedia & Traumatologia' | 'Cabeça, Pescoço & Otorrino' | 'Cardio & Intervencionista' | 'Pequenas Cirurgias & Outros';
  notes?: string;
  tableType: 'geral' | 'medicos-especificos';
}

export interface SelectedProcedureItem {
  procedure: HospitalProcedure;
  quantity: number;
  customDiarias?: number;
}

export interface PopRow {
  code: string;
  description: string;
  price?: string;
  category?: string;
}

export interface PopCardItem {
  title: string;
  icon: string;
  full?: boolean;
  warning?: boolean;
  info?: string;
  alerts?: string[];
  contacts?: string[];
  rows: [string, string, string?][];
}

export interface PopSection {
  id?: string;
  label: string;
  cards?: PopCardItem[];
  steps?: string[];
  codes?: { code: string; label: string }[];
  textItems?: string[];
  access?: [string, string][];
  contacts?: string[];
}

export interface ConvenioPop {
  id: string;
  name: string;
  badge: string;
  category: string;
  cnpj?: string;
  portalUrl?: string;
  labUrgencia: string;
  pacotePs: string;
  imagemUrgencia: string;
  sections: Record<string, PopSection>;
  criticalNotes?: string[];
  accessCredentials?: [string, string][];
  contacts?: string[];
}

export interface PopsPsMatrixItem {
  id: string;
  convenio: string;
  examesLaboratoriais: 'SIM' | 'SIM AUTORIZAR' | 'SIM AUTORIZAR COVID E INFLUENZA' | 'NÃO' | string;
  pacotePsAdulto?: string;
  pacotePsPediatria?: string;
  pacotePsGeral?: string;
  imagemPacoteCapaTasy?: string;
}

export interface GeapCovidInfluenzaItem {
  code: string;
  description: string;
}

export interface ExamRow {
  code: string;
  description: string;
  particularPrice: string;
  medPrevPrice: string;
  pageRef: string;
  isCustom?: boolean;
  category?: string;
}

export interface SelectedExamItem {
  index: number;
  exam: ExamRow;
  hasContrast?: boolean;
  quantity?: number;
  tableType: ExamTableType;
}

export interface HospitalExtension {
  sector: string;
  number: string;
  building?: string;
  category?: 'internacao' | 'uti' | 'apoio' | 'atendimento' | 'administracao' | 'farmacia';
}

export interface HospitalReportType {
  tipo: 'PARTICULAR' | 'URGÊNCIA' | 'ELETIVO';
  classe: string;
  nums: string[];
  description: string;
  documentDetails: { [key: string]: string };
}

export interface PreGuiaData {
  id: string;
  createdAt: string;
  convenio: string;
  carater: 'Urgência' | 'Eletivo' | 'URGENCIA';
  patientName: string;
  cardNumber: string;
  doctorName: string;
  doctorCrm: string;
  cid: string;
  justificativaClinica: string;
  procedimentos: {
    code: string;
    description: string;
    quantity: number;
    necessitaAutorizacao?: boolean;
    observacao?: string;
  }[];
  status: 'Pendente' | 'Autorizado' | 'Negado';
}

export interface AuditResult {
  statusConformidade: 'Aprovado' | 'Alerta' | 'Risco de Glosa';
  pontuacaoRisco: number;
  resumoExecutivo: string;
  alertasCriticos: string[];
  codigosSugeridos: { codigo: string; descricao: string; motivo: string }[];
  documentosExigidos: string[];
  orientacaoOperador: string;
}
