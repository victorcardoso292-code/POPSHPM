import React, { useState, useEffect, useMemo } from 'react';
import { 
  Printer, 
  FileText, 
  RotateCcw, 
  Copy, 
  Check, 
  Save, 
  Trash2, 
  Clock, 
  AlertTriangle, 
  User, 
  Users, 
  Building2, 
  CheckCircle2, 
  Sparkles,
  Download,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileCheck,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  SlidersHorizontal,
  Eye,
  Edit3
} from 'lucide-react';

export interface FichaContingenciaData {
  id?: string;
  dataAtendimento: string;
  horaAtendimento: string;
  // Paciente
  nomePaciente: string;
  nomeMae: string;
  dataNascimento: string;
  naturalidade: string;
  cpf: string;
  rg: string;
  convenio: string;
  numeroCarteira: string;
  endereco: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  email: string;
  telefone1: string;
  telefone2: string;
  // Responsável
  nomeResponsavel: string;
  dataNascimentoResponsavel: string;
  cpfResponsavel: string;
  emailResponsavel: string;
  telefone1Responsavel: string;
  telefone2Responsavel: string;
  // Metadados
  nomeRecepcionista?: string;
  criadoEm?: string;
}

const STORAGE_KEY = 'hpm_fichas_contingencia_v1';

const CONVENIOS_RAPIDOS = [
  'SERVIR (Governo do Tocantins)',
  'FA-SAUDE (PRO-TOCANTINS)',
  'UNIMED PALMAS',
  'BRADESCO SAÚDE',
  'CASSI',
  'GEAP SAÚDE',
  'AMIL',
  'POSTAL SAÚDE',
  'SAÚDE CAIXA',
  'ASSEFAZ',
  'SUL AMÉRICA',
  'PARTICULAR'
];

// Utilitários de Máscara para digitação fluida
function maskCpf(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function maskDate(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function maskPhone(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function maskCep(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export const PlanoContingenciaViewer: React.FC = () => {
  // Obter data e hora atuais formatadas
  const getNowFormatted = () => {
    const now = new Date();
    const dia = String(now.getDate()).padStart(2, '0');
    const mes = String(now.getMonth() + 1).padStart(2, '0');
    const ano = now.getFullYear();
    const hora = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return {
      data: `${dia}/${mes}/${ano}`,
      hora: `${hora}:${min}`
    };
  };

  const initialDate = getNowFormatted();

  const [formData, setFormData] = useState<FichaContingenciaData>({
    dataAtendimento: initialDate.data,
    horaAtendimento: initialDate.hora,
    nomePaciente: '',
    nomeMae: '',
    dataNascimento: '',
    naturalidade: 'Palmas - TO',
    cpf: '',
    rg: '',
    convenio: '',
    numeroCarteira: '',
    endereco: '',
    bairro: '',
    cep: '',
    cidade: 'Palmas',
    estado: 'TO',
    email: '',
    telefone1: '',
    telefone2: '',
    nomeResponsavel: '',
    dataNascimentoResponsavel: '',
    cpfResponsavel: '',
    emailResponsavel: '',
    telefone1Responsavel: '',
    telefone2Responsavel: '',
    nomeRecepcionista: ''
  });

  const [historicoFichas, setHistoricoFichas] = useState<FichaContingenciaData[]>([]);
  const [copiedText, setCopiedText] = useState(false);
  const [salvoStatus, setSalvoStatus] = useState(false);
  const [modoImpressaoEmBranco, setModoImpressaoEmBranco] = useState(false);
  const [activeTab, setActiveTab] = useState<'formulario' | 'espelho' | 'historico'>('formulario');
  const [buscaHistorico, setBuscaHistorico] = useState('');

  // Carregar histórico local
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistoricoFichas(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Erro ao ler fichas de contingência:', e);
    }
  }, []);

  const handleChange = (field: keyof FichaContingenciaData, rawValue: string) => {
    let value = rawValue;
    if (field === 'cpf' || field === 'cpfResponsavel') {
      value = maskCpf(rawValue);
    } else if (field === 'dataNascimento' || field === 'dataNascimentoResponsavel' || field === 'dataAtendimento') {
      value = maskDate(rawValue);
    } else if (field === 'telefone1' || field === 'telefone2' || field === 'telefone1Responsavel' || field === 'telefone2Responsavel') {
      value = maskPhone(rawValue);
    } else if (field === 'cep') {
      value = maskCep(rawValue);
    } else if (field === 'estado') {
      value = rawValue.toUpperCase().slice(0, 2);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Cálculo de campos essenciais preenchidos
  const progressoPreenchimento = useMemo(() => {
    const obrigatorios = [
      formData.nomePaciente,
      formData.nomeMae,
      formData.dataNascimento,
      formData.cpf,
      formData.convenio,
      formData.numeroCarteira,
      formData.endereco,
      formData.telefone1
    ];
    const preenchidos = obrigatorios.filter(val => val && val.trim().length > 0).length;
    return {
      total: obrigatorios.length,
      preenchidos,
      porcentagem: Math.round((preenchidos / obrigatorios.length) * 100)
    };
  }, [formData]);

  // Salvar no histórico
  const handleSalvarFicha = () => {
    if (!formData.nomePaciente.trim()) {
      alert('Por favor, informe ao menos o Nome do Paciente para registrar o atendimento.');
      return;
    }

    const novaFicha: FichaContingenciaData = {
      ...formData,
      id: formData.id || `contingencia-${Date.now()}`,
      criadoEm: new Date().toLocaleString('pt-BR')
    };

    const atualizado = [novaFicha, ...historicoFichas.filter(f => f.id !== novaFicha.id)].slice(0, 50);
    setHistoricoFichas(atualizado);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizado));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }

    setSalvoStatus(true);
    setTimeout(() => setSalvoStatus(false), 2500);
  };

  // Carregar ficha do histórico
  const handleCarregarFicha = (ficha: FichaContingenciaData) => {
    setFormData(ficha);
    setActiveTab('formulario');
  };

  // Excluir ficha do histórico
  const handleExcluirFicha = (id?: string) => {
    if (!id) return;
    const atualizado = historicoFichas.filter(f => f.id !== id);
    setHistoricoFichas(atualizado);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizado));
    } catch (e) {
      console.error('Erro ao excluir:', e);
    }
  };

  // Limpar formulário
  const handleLimpar = () => {
    if (window.confirm('Deseja realmente limpar todos os campos da ficha atual?')) {
      const now = getNowFormatted();
      setFormData({
        dataAtendimento: now.data,
        horaAtendimento: now.hora,
        nomePaciente: '',
        nomeMae: '',
        dataNascimento: '',
        naturalidade: 'Palmas - TO',
        cpf: '',
        rg: '',
        convenio: '',
        numeroCarteira: '',
        endereco: '',
        bairro: '',
        cep: '',
        cidade: 'Palmas',
        estado: 'TO',
        email: '',
        telefone1: '',
        telefone2: '',
        nomeResponsavel: '',
        dataNascimentoResponsavel: '',
        cpfResponsavel: '',
        emailResponsavel: '',
        telefone1Responsavel: '',
        telefone2Responsavel: '',
        nomeRecepcionista: ''
      });
    }
  };

  // Preencher exemplo de teste para conferência rápida
  const handlePreencherExemplo = () => {
    const now = getNowFormatted();
    setFormData({
      dataAtendimento: now.data,
      horaAtendimento: now.hora,
      nomePaciente: 'Carlos Eduardo Oliveira Santos',
      nomeMae: 'Maria de Lourdes Santos',
      dataNascimento: '14/05/1982',
      naturalidade: 'Palmas - TO',
      cpf: '012.345.678-90',
      rg: '1.234.567 SSP-TO',
      convenio: 'SERVIR (Governo do Tocantins)',
      numeroCarteira: '00987654321-00',
      endereco: 'Quadra 104 Sul, Rua SE 05, Lote 12',
      bairro: 'Plano Diretor Sul',
      cep: '77020-020',
      cidade: 'Palmas',
      estado: 'TO',
      email: 'carlos.eduardo@email.com',
      telefone1: '(63) 98456-7890',
      telefone2: '(63) 3215-4000',
      nomeResponsavel: 'Juliana Ferreira Santos',
      dataNascimentoResponsavel: '22/08/1985',
      cpfResponsavel: '987.654.321-10',
      emailResponsavel: 'juliana.santos@email.com',
      telefone1Responsavel: '(63) 99234-5678',
      telefone2Responsavel: '',
      nomeRecepcionista: 'Recepção PS 24h'
    });
  };

  // Copiar resumo formatado para colar no TASY
  const handleCopiarResumoTasy = () => {
    const linhas: string[] = [
      '=== REGISTRO DE CONTINGÊNCIA - FICHA HPM.FM ===',
      `Data/Hora: ${formData.dataAtendimento} às ${formData.horaAtendimento}`,
      `Paciente: ${formData.nomePaciente}`,
      `Nome da Mãe: ${formData.nomeMae}`,
      `Nascimento: ${formData.dataNascimento} | Naturalidade: ${formData.naturalidade}`,
      `CPF: ${formData.cpf} | RG: ${formData.rg}`,
      `Convênio: ${formData.convenio} | Carteirinha: ${formData.numeroCarteira}`,
      `Endereço: ${formData.endereco}, ${formData.bairro} - ${formData.cidade}/${formData.estado} CEP: ${formData.cep}`,
      `E-mail: ${formData.email}`,
      `Telefones: ${formData.telefone1} / ${formData.telefone2}`,
      formData.nomeResponsavel ? `Responsável: ${formData.nomeResponsavel} (CPF: ${formData.cpfResponsavel} | Tel: ${formData.telefone1Responsavel})` : '',
      'OBS: Caso o convênio esteja em carência ou procedimento negado, o atendimento será particular.'
    ].filter(Boolean);

    navigator.clipboard.writeText(linhas.join('\n'));
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  // Disparar impressão
  const handleImprimir = (emBranco: boolean = false) => {
    setModoImpressaoEmBranco(emBranco);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Filtragem de histórico
  const historicoFiltrado = useMemo(() => {
    if (!buscaHistorico.trim()) return historicoFichas;
    const q = buscaHistorico.toLowerCase();
    return historicoFichas.filter(f => 
      f.nomePaciente.toLowerCase().includes(q) ||
      f.cpf.includes(q) ||
      f.convenio.toLowerCase().includes(q) ||
      f.numeroCarteira.includes(q)
    );
  }, [historicoFichas, buscaHistorico]);

  return (
    <div className="space-y-6">
      {/* ========================================================
          BARRA DE COMANDO DA CONTINGÊNCIA (REESTILIZADA & MODERNA)
      ======================================================== */}
      <div className="no-print bg-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow sutil de fundo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0E7B86]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Linha superior: Alertas de status e metadados oficiais */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/15 border border-red-500/30 text-red-300 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                <span>Protocolo de Contingência Ativo</span>
              </div>
              <span className="text-xs text-slate-400">
                Código: <strong className="text-slate-200">HPM.FM</strong> · Versão 000
              </span>
              <span className="text-xs text-slate-400">
                Área: <strong className="text-slate-200">Atendimento / Recepção</strong>
              </span>
            </div>

            {/* Medidor de progresso de preenchimento */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                Campos Essenciais: <strong className="text-emerald-400">{progressoPreenchimento.preenchidos}/{progressoPreenchimento.total}</strong>
              </span>
              <div className="w-24 sm:w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    progressoPreenchimento.porcentagem === 100 
                      ? 'bg-emerald-400' 
                      : progressoPreenchimento.porcentagem >= 50 
                        ? 'bg-amber-400' 
                        : 'bg-red-400'
                  }`}
                  style={{ width: `${progressoPreenchimento.porcentagem}%` }}
                />
              </div>
            </div>
          </div>

          {/* Título principal e botões de ação mestres */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white m-0">
                Ficha de Atendimento Manual (Plano de Contingência)
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed m-0">
                Preencha os dados cadastrais do paciente quando o TASY ou a rede estiverem indisponíveis. Gere a folha de atendimento oficial do Hospital Palmas Medical pronta para assinatura física e arquivamento.
              </p>
            </div>

            {/* Ações principais de impressão e cópia */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap flex-shrink-0">
              <button
                type="button"
                onClick={() => handleImprimir(false)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0E7B86] hover:bg-[#0A565D] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Ficha Preenchida</span>
              </button>

              <button
                type="button"
                onClick={() => handleImprimir(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer"
                title="Imprime formulário em branco para ter cópias físicas impressas na gaveta"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Folha em Branco</span>
              </button>
            </div>
          </div>

          {/* Barra de navegação por modos e utilitários rápidos */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
            {/* Segmented control para abas */}
            <div className="inline-flex p-1 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <button
                type="button"
                onClick={() => setActiveTab('formulario')}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'formulario'
                    ? 'bg-[#0E7B86] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Formulário de Entrada</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('espelho')}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'espelho'
                    ? 'bg-[#0E7B86] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Espelho da Ficha Oficial (A4)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('historico')}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'historico'
                    ? 'bg-[#0E7B86] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Histórico ({historicoFichas.length})</span>
              </button>
            </div>

            {/* Ações secundárias */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSalvarFicha}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                title="Salva localmente para não perder os dados em caso de reinício da máquina"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{salvoStatus ? 'Salvo!' : 'Salvar Ficha'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopiarResumoTasy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                title="Copia os dados formatados em bloco para colar no TASY"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar p/ Tasy</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePreencherExemplo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                title="Preenche campos de teste para conferência rápida"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Exemplo</span>
              </button>

              <button
                type="button"
                onClick={handleLimpar}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                title="Limpar formulário"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          ABA 1: FORMULÁRIO DE ENTRADA (ERGONÔMICO & ÁGIL)
      ======================================================== */}
      {activeTab === 'formulario' && (
        <div className="no-print space-y-6 animate-in fade-in duration-150">
          {/* Card Seção 1: Dados do Atendimento */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#0E7B86]/10 text-[#0E7B86] flex items-center justify-center font-bold text-xs">
                  01
                </span>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider m-0">
                  Data, Hora & Identificação do Atendimento
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Obrigatório</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Data do Atendimento *
                </label>
                <input
                  type="text"
                  value={formData.dataAtendimento}
                  onChange={e => handleChange('dataAtendimento', e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Hora do Atendimento *
                </label>
                <input
                  type="text"
                  value={formData.horaAtendimento}
                  onChange={e => handleChange('horaAtendimento', e.target.value)}
                  placeholder="HH:MM"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Recepcionista Responsável
                </label>
                <input
                  type="text"
                  value={formData.nomeRecepcionista || ''}
                  onChange={e => handleChange('nomeRecepcionista', e.target.value)}
                  placeholder="Ex: Recepção Central / Ana Paula"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card Seção 2: Identificação do Paciente */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#0E7B86]/10 text-[#0E7B86] flex items-center justify-center font-bold text-xs">
                  02
                </span>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider m-0">
                  Identificação do Paciente
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Dados Principais</span>
            </div>

            {/* Linha 1: Nome do Paciente e Nome da Mãe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nome Completo do Paciente *
                </label>
                <input
                  type="text"
                  value={formData.nomePaciente}
                  onChange={e => handleChange('nomePaciente', e.target.value)}
                  placeholder="Informe o nome completo do paciente"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nome da Mãe *
                </label>
                <input
                  type="text"
                  value={formData.nomeMae}
                  onChange={e => handleChange('nomeMae', e.target.value)}
                  placeholder="Nome completo da mãe do paciente"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Data de Nascimento *
                </label>
                <input
                  type="text"
                  value={formData.dataNascimento}
                  onChange={e => handleChange('dataNascimento', e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Naturalidade (Cidade - UF)
                </label>
                <input
                  type="text"
                  value={formData.naturalidade}
                  onChange={e => handleChange('naturalidade', e.target.value)}
                  placeholder="Ex: Palmas - TO"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  CPF do Paciente *
                </label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={e => handleChange('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  RG (Identidade)
                </label>
                <input
                  type="text"
                  value={formData.rg}
                  onChange={e => handleChange('rg', e.target.value)}
                  placeholder="Número e órgão emissor"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                />
              </div>
            </div>

            {/* Linha de Convênio com Botões Rápidos */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <label className="text-xs font-semibold text-slate-700 block">
                Convênio / Plano de Saúde *
              </label>

              {/* Botões rápidos de convênio para agilidade máxima */}
              <div className="flex flex-wrap gap-1.5">
                {CONVENIOS_RAPIDOS.map(conv => {
                  const isSel = formData.convenio.toLowerCase().includes(conv.toLowerCase().slice(0, 6));
                  return (
                    <button
                      key={conv}
                      type="button"
                      onClick={() => handleChange('convenio', conv)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
                        isSel
                          ? 'bg-[#0E7B86] text-white border-[#0E7B86] shadow-2xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {conv.split(' ')[0]}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <input
                    type="text"
                    value={formData.convenio}
                    onChange={e => handleChange('convenio', e.target.value)}
                    placeholder="Nome do convênio (ou digite aqui caso não esteja acima)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={formData.numeroCarteira}
                    onChange={e => handleChange('numeroCarteira', e.target.value)}
                    placeholder="Nº da Carteira do Convênio *"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Linha de Endereço */}
            <div className="pt-2 border-t border-slate-100 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    value={formData.endereco}
                    onChange={e => handleChange('endereco', e.target.value)}
                    placeholder="Quadra, rua, alameda, lote, número e complemento"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={formData.bairro}
                    onChange={e => handleChange('bairro', e.target.value)}
                    placeholder="Bairro ou setor"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    value={formData.cep}
                    onChange={e => handleChange('cep', e.target.value)}
                    placeholder="77000-000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none font-mono"
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={formData.cidade}
                    onChange={e => handleChange('cidade', e.target.value)}
                    placeholder="Cidade"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Estado (UF)
                  </label>
                  <input
                    type="text"
                    value={formData.estado}
                    onChange={e => handleChange('estado', e.target.value)}
                    placeholder="TO"
                    maxLength={2}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Linha de Contatos */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  E-mail do Paciente
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="paciente@exemplo.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Telefone Principal *
                </label>
                <input
                  type="text"
                  value={formData.telefone1}
                  onChange={e => handleChange('telefone1', e.target.value)}
                  placeholder="(63) 90000-0000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Telefone Secundário / Recado
                </label>
                <input
                  type="text"
                  value={formData.telefone2}
                  onChange={e => handleChange('telefone2', e.target.value)}
                  placeholder="(63) 3000-0000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Card Seção 3: Identificação do Responsável / Acompanhante */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#0E7B86]/10 text-[#0E7B86] flex items-center justify-center font-bold text-xs">
                  03
                </span>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider m-0">
                  Identificação do Responsável / Acompanhante
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Se aplicável</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nome Completo do Responsável ou Acompanhante
                </label>
                <input
                  type="text"
                  value={formData.nomeResponsavel}
                  onChange={e => handleChange('nomeResponsavel', e.target.value)}
                  placeholder="Nome da pessoa responsável pelo paciente"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Data de Nascimento do Responsável
                </label>
                <input
                  type="text"
                  value={formData.dataNascimentoResponsavel}
                  onChange={e => handleChange('dataNascimentoResponsavel', e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  CPF do Responsável
                </label>
                <input
                  type="text"
                  value={formData.cpfResponsavel}
                  onChange={e => handleChange('cpfResponsavel', e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  E-mail do Responsável
                </label>
                <input
                  type="email"
                  value={formData.emailResponsavel}
                  onChange={e => handleChange('emailResponsavel', e.target.value)}
                  placeholder="responsavel@exemplo.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Telefone Principal do Responsável
                </label>
                <input
                  type="text"
                  value={formData.telefone1Responsavel}
                  onChange={e => handleChange('telefone1Responsavel', e.target.value)}
                  placeholder="(63) 90000-0000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Telefone Secundário do Responsável
                </label>
                <input
                  type="text"
                  value={formData.telefone2Responsavel}
                  onChange={e => handleChange('telefone2Responsavel', e.target.value)}
                  placeholder="(63) 0000-0000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Cláusula de Carência & Aviso Anti-Glosa */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <strong className="text-amber-950 font-bold block uppercase tracking-wider text-[11px]">
                Cláusula Contratual Obrigatória do Formulário:
              </strong>
              <p className="text-amber-900 font-medium leading-relaxed m-0 italic">
                &ldquo;OBS.: Caso o convênio esteja em carência ou procedimento negado, o pagamento de todo o atendimento será cobrado &apos;particular&apos;.&rdquo;
              </p>
            </div>
          </div>

          {/* Barra inferior flutuante de ações rápidas */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Dados salvos em tempo real na sessão atual.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('espelho')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Visualizar Impressão A4
              </button>

              <button
                type="button"
                onClick={() => handleImprimir(false)}
                className="px-5 py-2 bg-[#0E7B86] hover:bg-[#0A565D] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Agora</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ABA 2: HISTÓRICO LOCAL DE FICHAS SALVAS
      ======================================================== */}
      {activeTab === 'historico' && (
        <div className="no-print space-y-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 m-0">
                  Fichas Registradas Neste Computador
                </h3>
                <p className="text-xs text-slate-500 m-0 mt-0.5 font-medium">
                  {historicoFichas.length} atendimentos manuais arquivados na memória local do navegador.
                </p>
              </div>

              {/* Campo de pesquisa no histórico */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={buscaHistorico}
                  onChange={e => setBuscaHistorico(e.target.value)}
                  placeholder="Buscar por paciente, CPF ou convênio..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0E7B86] outline-none"
                />
              </div>
            </div>

            {historicoFiltrado.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-medium space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Nenhuma ficha encontrada no histórico local.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {historicoFiltrado.map(ficha => (
                  <div
                    key={ficha.id}
                    className="p-4 bg-white hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 truncate m-0">
                          {ficha.nomePaciente || 'Sem nome informado'}
                        </h4>
                        {ficha.convenio && (
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {ficha.convenio}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 font-medium">
                        <span>CPF: {ficha.cpf || 'Não informado'}</span>
                        <span aria-hidden="true">·</span>
                        <span>Carteira: {ficha.numeroCarteira || '—'}</span>
                        <span aria-hidden="true">·</span>
                        <span>Atendimento: {ficha.dataAtendimento} às {ficha.horaAtendimento}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleCarregarFicha(ficha)}
                        className="px-3 py-1.5 bg-[#0E7B86]/10 hover:bg-[#0E7B86]/20 text-[#0E7B86] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Carregar na Tela
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFormData(ficha);
                          handleImprimir(false);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        title="Imprimir direto"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExcluirFicha(ficha.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                        title="Excluir do histórico"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          DOCUMENTO FÍSICO OFICIAL HPM.FM (VISUALIZAÇÃO & IMPRESSÃO)
          Sempre pronto no DOM para window.print(), e visível na aba Espelho
      ======================================================== */}
      <div className={`print-area ${activeTab !== 'espelho' ? 'hidden print:block' : 'block'} bg-white border border-slate-300 rounded-2xl shadow-sm p-4 sm:p-8 max-w-4xl mx-auto text-slate-900 font-sans text-xs`}>
        
        {/* Barra superior de controle visual na aba Espelho (oculta na impressão) */}
        <div className="no-print bg-slate-50 border border-slate-200 rounded-xl p-3 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0E7B86]" />
            <span className="font-bold text-slate-800">
              Visualização Fiel do Formulário Físico A4 Oficial (Código HPM.FM)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('formulario')}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
            >
              Editar Dados
            </button>

            <button
              type="button"
              onClick={() => handleImprimir(false)}
              className="px-4 py-1.5 bg-[#0E7B86] hover:bg-[#0A565D] text-white rounded-lg font-bold text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Ficha</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            TABELA CABEÇALHO INSTITUCIONAL FORMULÁRIO KORA
        ======================================================== */}
        <table className="w-full border-collapse border-2 border-black text-[11px] mb-3">
          <tbody>
            <tr>
              {/* Logo / Marca */}
              <td className="w-1/4 border-2 border-black p-3 text-center align-middle">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-xl font-black tracking-tight flex items-center gap-1 text-black">
                    <span className="text-lg">❖</span>
                    <span>Medical</span>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-black">
                    Kora
                  </div>
                </div>
              </td>

              {/* Título Central */}
              <td className="w-2/4 border-2 border-black p-2 text-center align-middle">
                <div className="text-[12px] font-bold uppercase tracking-wider text-black">
                  FORMULÁRIO
                </div>
                <div className="text-[13px] font-black uppercase text-black mt-1">
                  Título: FICHA DE ATENDIMENTO MANUAL
                </div>
              </td>

              {/* Metadados do Sistema de Qualidade */}
              <td className="w-1/4 border-2 border-black p-1.5 text-[9px] leading-tight text-black">
                <div className="border-b border-black pb-0.5 mb-0.5">
                  <strong>Código:</strong> HPM.FM
                </div>
                <div className="border-b border-black pb-0.5 mb-0.5">
                  <strong>Versão:</strong> 000
                </div>
                <div className="border-b border-black pb-0.5 mb-0.5">
                  <strong>Data de criação:</strong> 19/06/2023
                </div>
                <div className="border-b border-black pb-0.5 mb-0.5">
                  <strong>Data da revisão:</strong> 11/01/2026
                </div>
                <div>
                  <strong>Área responsável:</strong> Atendimento
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Data e Hora */}
        <div className="border-2 border-black p-2 font-bold mb-3 flex items-center justify-between text-[11px]">
          <div>
            DATA: <span className="font-mono underline ml-1">{modoImpressaoEmBranco ? '____/____/________' : (formData.dataAtendimento || '____/____/________')}</span>
          </div>
          <div>
            HORA: <span className="font-mono underline ml-1">{modoImpressaoEmBranco ? '____:____' : (formData.horaAtendimento || '____:____')}</span>
          </div>
        </div>

        {/* ========================================================
            SEÇÃO: IDENTIFICAÇÃO DO PACIENTE
        ======================================================== */}
        <div className="border-2 border-black mb-3">
          <div className="bg-slate-100 border-b-2 border-black px-2 py-1 font-black text-[11px] uppercase tracking-wider text-black">
            IDENTIFICAÇÃO DO PACIENTE:
          </div>

          {/* Nome */}
          <div className="border-b border-black p-2">
            <span className="font-bold">NOME: </span>
            <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.nomePaciente}</span>
          </div>

          {/* Nome da Mãe */}
          <div className="border-b border-black p-2">
            <span className="font-bold">NOME DA MÃE: </span>
            <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.nomeMae}</span>
          </div>

          {/* Data Nascimento e Naturalidade */}
          <div className="border-b border-black flex">
            <div className="w-1/2 border-r border-black p-2">
              <span className="font-bold">DATA DE NASCIMENTO: </span>
              <span className="font-semibold">{modoImpressaoEmBranco ? '____/____/________' : formData.dataNascimento}</span>
            </div>
            <div className="w-1/2 p-2">
              <span className="font-bold">NATURALIDADE: </span>
              <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.naturalidade}</span>
            </div>
          </div>

          {/* CPF e RG */}
          <div className="border-b border-black flex">
            <div className="w-1/2 border-r border-black p-2">
              <span className="font-bold">CPF: </span>
              <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.cpf}</span>
            </div>
            <div className="w-1/2 p-2">
              <span className="font-bold">RG: </span>
              <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.rg}</span>
            </div>
          </div>

          {/* Convênio e Nº Carteira */}
          <div className="border-b border-black flex">
            <div className="w-1/2 border-r border-black p-2">
              <span className="font-bold">CONVÊNIO: </span>
              <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.convenio}</span>
            </div>
            <div className="w-1/2 p-2">
              <span className="font-bold">Nº CARTEIRA CONVÊNIO: </span>
              <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.numeroCarteira}</span>
            </div>
          </div>

          {/* Endereço */}
          <div className="border-b border-black p-2">
            <span className="font-bold">ENDEREÇO: </span>
            <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.endereco}</span>
          </div>

          {/* Bairro e CEP */}
          <div className="border-b border-black flex">
            <div className="w-1/2 border-r border-black p-2">
              <span className="font-bold">BAIRRO: </span>
              <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.bairro}</span>
            </div>
            <div className="w-1/2 p-2">
              <span className="font-bold">CEP: </span>
              <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.cep}</span>
            </div>
          </div>

          {/* Cidade e Estado */}
          <div className="border-b border-black flex">
            <div className="w-1/2 border-r border-black p-2">
              <span className="font-bold">CIDADE: </span>
              <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.cidade}</span>
            </div>
            <div className="w-1/2 p-2">
              <span className="font-bold">ESTADO: </span>
              <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.estado}</span>
            </div>
          </div>

          {/* E-mail */}
          <div className="border-b border-black p-2">
            <span className="font-bold">E-MAIL: </span>
            <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.email}</span>
          </div>

          {/* Telefone 1 e Telefone 2 */}
          <div className="flex">
            <div className="w-1/2 border-r border-black p-2">
              <span className="font-bold">TELEFONE 1: </span>
              <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.telefone1}</span>
            </div>
            <div className="w-1/2 p-2">
              <span className="font-bold">TELEFONE 2: </span>
              <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.telefone2}</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            SEÇÃO: IDENTIFICAÇÃO DO RESPONSÁVEL / ACOMPANHANTE
        ======================================================== */}
        <div className="border-2 border-black mb-3">
          <div className="bg-slate-100 border-b-2 border-black px-2 py-1 font-black text-[11px] uppercase tracking-wider text-black">
            IDENTIFICAÇÃO DO RESPONSÁVEL/ACOMPANHANTE:
          </div>

          {/* Nome */}
          <div className="border-b border-black p-2">
            <span className="font-bold">NOME: </span>
            <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.nomeResponsavel}</span>
          </div>

          {/* Data Nascimento e CPF */}
          <div className="border-b border-black flex">
            <div className="w-1/2 border-r border-black p-2">
              <span className="font-bold">DATA DE NASCIMENTO: </span>
              <span className="font-semibold">{modoImpressaoEmBranco ? '____/____/________' : formData.dataNascimentoResponsavel}</span>
            </div>
            <div className="w-1/2 p-2">
              <span className="font-bold">CPF: </span>
              <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.cpfResponsavel}</span>
            </div>
          </div>

          {/* E-mail */}
          <div className="border-b border-black p-2">
            <span className="font-bold">E-MAIL: </span>
            <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.emailResponsavel}</span>
          </div>

          {/* Telefone 1 e Telefone 2 */}
          <div className="flex">
            <div className="w-1/2 border-r border-black p-2">
              <span className="font-bold">TELEFONE 1: </span>
              <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.telefone1Responsavel}</span>
            </div>
            <div className="w-1/2 p-2">
              <span className="font-bold">TELEFONE 2: </span>
              <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.telefone2Responsavel}</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            OBSERVAÇÃO REGULATÓRIA OBRIGATÓRIA
        ======================================================== */}
        <div className="text-center font-bold text-[10px] my-3 leading-tight px-4 text-black">
          OBS.: Caso o convênio esteja em carência ou procedimento negado, o pagamento de todo o atendimento será cobrado &quot;particular&quot;.
        </div>

        {/* ========================================================
            CAMPOS DE ASSINATURA
        ======================================================== */}
        <div className="grid grid-cols-2 gap-6 pt-6 pb-4">
          <div className="text-center">
            <div className="border-b border-black pb-1 mb-1 min-h-[30px]" />
            <span className="font-bold text-[10.5px] text-black">
              Assinatura do responsável ou beneficiário
            </span>
          </div>

          <div className="text-center">
            <div className="border-b border-black pb-1 mb-1 min-h-[30px]">
              {formData.nomeRecepcionista && !modoImpressaoEmBranco && (
                <span className="text-[10px] text-slate-500 font-semibold">
                  {formData.nomeRecepcionista}
                </span>
              )}
            </div>
            <span className="font-bold text-[10.5px] text-black">
              Assinatura legível do recepcionista
            </span>
          </div>
        </div>

        {/* ========================================================
            RODAPÉ DE QUALIDADE E APROVAÇÃO DO DOCUMENTO
        ======================================================== */}
        <div className="border-t-2 border-black pt-2 mt-4 text-[8.5px] leading-tight text-black">
          <div className="grid grid-cols-4 gap-2 text-center border-b border-black pb-1 mb-1">
            <div>
              <strong>Elaboração</strong>
              <div className="text-[8px] text-black">
                Paula Fernanda N. Santos<br />
                Coordenadora de atendimento
              </div>
            </div>

            <div>
              <strong>Gestor do Documento</strong>
              <div className="text-[8px] text-black">
                Paula Fernanda N. Santos<br />
                Coordenadora de atendimento
              </div>
            </div>

            <div>
              <strong>Revisor</strong>
              <div className="text-[8px] text-black">
                João Carlos D. Medeiros<br />
                Gerente administrativo
              </div>
            </div>

            <div>
              <strong>Aprovador</strong>
              <div className="text-[8px] text-black">
                Qualidade
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[8px] text-black pt-0.5">
            <span>É proibida a reprodução parcial ou total deste documento</span>
            <span>Página 1 de 1</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          ESTILOS CSS ESPECÍFICOS PARA IMPRESSÃO EM A4
      ======================================================== */}
      <style>{`
        @media print {
          /* Esconder elementos fora do documento impresso */
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 10mm 14mm !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            background: white !important;
            color: black !important;
            font-size: 10.5px !important;
          }
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
        }
      `}</style>
    </div>
  );
};
