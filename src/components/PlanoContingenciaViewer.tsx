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
  Search,
  Eye,
  Edit3,
  Sliders,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  BadgeAlert
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
  // Triagem / Destino
  setorDestino?: string;
  motivoAtendimento?: string;
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
    setorDestino: 'Pronto-Socorro Adulto',
    motivoAtendimento: '',
    nomeRecepcionista: ''
  });

  const [historicoFichas, setHistoricoFichas] = useState<FichaContingenciaData[]>([]);
  const [copiedText, setCopiedText] = useState(false);
  const [salvoStatus, setSalvoStatus] = useState(false);
  const [modoImpressaoEmBranco, setModoImpressaoEmBranco] = useState(false);
  const [activeTab, setActiveTab] = useState<'formulario' | 'espelho' | 'historico'>('espelho');
  const [buscaHistorico, setBuscaHistorico] = useState('');
  
  // Opção de estilo do layout PDF: 'moderno' (repaginado, elegante) ou 'classico' (caixas pretas antigas)
  const [estiloLayoutPdf, setEstiloLayoutPdf] = useState<'moderno' | 'classico'>('moderno');

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

  const handleCarregarFicha = (ficha: FichaContingenciaData) => {
    setFormData(ficha);
    setActiveTab('espelho');
  };

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
        setorDestino: 'Pronto-Socorro Adulto',
        motivoAtendimento: '',
        nomeRecepcionista: ''
      });
    }
  };

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
      setorDestino: 'Pronto-Socorro Adulto',
      motivoAtendimento: 'Dor precordial atípica com irradiação para MSE há 2 horas',
      nomeRecepcionista: 'Recepção PS Central'
    });
  };

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
      formData.setorDestino ? `Destino: ${formData.setorDestino}` : '',
      formData.motivoAtendimento ? `Motivo: ${formData.motivoAtendimento}` : '',
      'OBS: Caso o convênio esteja em carência ou procedimento negado, o atendimento será particular.'
    ].filter(Boolean);

    navigator.clipboard.writeText(linhas.join('\n'));
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleImprimir = (emBranco: boolean = false) => {
    setModoImpressaoEmBranco(emBranco);
    setTimeout(() => {
      window.print();
    }, 150);
  };

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
          CABEÇALHO & COMANDO DO MÓDULO (NO-PRINT)
      ======================================================== */}
      <div className="no-print bg-slate-900 text-white rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0E7B86]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Top badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-300 rounded-full text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span>Protocolo de Contingência Ativo</span>
              </span>
              <span className="text-xs text-slate-400">
                Código: <strong className="text-white">HPM.FM</strong> · Versão 001
              </span>
              <span className="text-xs text-slate-400">
                Área: <strong className="text-white">Atendimento / Recepção</strong>
              </span>
            </div>

            {/* Alternador de Estilo do PDF */}
            <div className="flex items-center gap-2 bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 text-xs">
              <span className="text-slate-400 px-2 font-medium">Estilo da Ficha:</span>
              <button
                type="button"
                onClick={() => setEstiloLayoutPdf('moderno')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  estiloLayoutPdf === 'moderno'
                    ? 'bg-[#0E7B86] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ✨ Repaginado (Moderno)
              </button>
              <button
                type="button"
                onClick={() => setEstiloLayoutPdf('classico')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  estiloLayoutPdf === 'classico'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📄 Clássico (Original)
              </button>
            </div>
          </div>

          {/* Título & Ações Principais */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white m-0">
                Ficha de Atendimento Manual — PDF & Impressão
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-normal mt-1 max-w-2xl leading-relaxed m-0">
                Layout de folha física hospitalar de alta qualidade gráfica para atendimento quando o TASY estiver offline. Calibrado para preenchimento legível e assinatura.
              </p>
            </div>

            {/* Botões de Impressão */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap flex-shrink-0">
              <button
                type="button"
                onClick={() => handleImprimir(false)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0E7B86] hover:bg-[#0A565D] text-white text-xs sm:text-sm font-black rounded-xl shadow-lg transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Ficha Preenchida</span>
              </button>

              <button
                type="button"
                onClick={() => handleImprimir(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer"
                title="Gera formulário com linhas em branco para ter na recepção"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Folha em Branco</span>
              </button>
            </div>
          </div>

          {/* Segmented controls & utilitários */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="inline-flex p-1 bg-slate-800/90 rounded-xl border border-slate-700/60">
              <button
                type="button"
                onClick={() => setActiveTab('espelho')}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'espelho'
                    ? 'bg-[#0E7B86] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Espelho da Ficha PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('formulario')}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'formulario'
                    ? 'bg-[#0E7B86] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Preencher / Editar Dados</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('historico')}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'historico'
                    ? 'bg-[#0E7B86] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Histórico ({historicoFichas.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSalvarFicha}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{salvoStatus ? 'Salvo!' : 'Salvar Registro'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopiarResumoTasy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Exemplo</span>
              </button>

              <button
                type="button"
                onClick={handleLimpar}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 rounded-lg text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          ABA 1: ESPELHO DA FICHA OFICIAL PDF (VISUALIZAÇÃO DA FOLHA A4)
      ======================================================== */}
      {activeTab === 'espelho' && (
        <div className="no-print space-y-4 animate-in fade-in duration-150">
          <div className="bg-slate-100/80 border border-slate-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-bold text-slate-800">
                Visualização Prévia da Folha A4 ({estiloLayoutPdf === 'moderno' ? 'Design Repaginado Kora' : 'Design Clássico'})
              </span>
              <span className="text-slate-500">· Exatamente como sairá na impressora</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('formulario')}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Editar Informações
              </button>
              <button
                type="button"
                onClick={() => handleImprimir(false)}
                className="px-4 py-1.5 bg-[#0E7B86] text-white rounded-lg font-bold hover:bg-[#0A565D] cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Agora</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ABA 2: FORMULÁRIO DE ENTRADA (QUANDO CLICADO EM EDITAR)
      ======================================================== */}
      {activeTab === 'formulario' && (
        <div className="no-print space-y-6 animate-in fade-in duration-150">
          {/* Dados do Atendimento */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#0E7B86]/10 text-[#0E7B86] flex items-center justify-center font-bold text-xs">
                  01
                </span>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider m-0">
                  Data, Hora & Triagem de Entrada
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Controle Hospitalar</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                  Hora de Chegada *
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
                  Setor de Destino
                </label>
                <select
                  value={formData.setorDestino || 'Pronto-Socorro Adulto'}
                  onChange={e => handleChange('setorDestino', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none cursor-pointer"
                >
                  <option value="Pronto-Socorro Adulto">Pronto-Socorro Adulto</option>
                  <option value="Pronto-Socorro Pediátrico">Pronto-Socorro Pediátrico</option>
                  <option value="Ortopedia / Sutura">Ortopedia / Sutura</option>
                  <option value="Internação Geral">Internação Geral</option>
                  <option value="UTI Geral / Cardio">UTI Geral / Cardio</option>
                  <option value="Centro Cirúrgico">Centro Cirúrgico</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Recepcionista
                </label>
                <input
                  type="text"
                  value={formData.nomeRecepcionista || ''}
                  onChange={e => handleChange('nomeRecepcionista', e.target.value)}
                  placeholder="Seu nome / Matrícula"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Queixa Principal / Motivo Clínico (Opcional)
              </label>
              <input
                type="text"
                value={formData.motivoAtendimento || ''}
                onChange={e => handleChange('motivoAtendimento', e.target.value)}
                placeholder="Ex: Dor torácica, febre alta, queda com trauma em punho..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Dados do Paciente */}
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
              <span className="text-xs text-slate-400 font-medium">Campos Primários</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nome Completo do Paciente *
                </label>
                <input
                  type="text"
                  value={formData.nomePaciente}
                  onChange={e => handleChange('nomePaciente', e.target.value)}
                  placeholder="Nome completo do paciente"
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
                  placeholder="Nome completo da mãe"
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

            {/* Convênio */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <label className="text-xs font-semibold text-slate-700 block">
                Convênio & Carteira *
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CONVENIOS_RAPIDOS.map(conv => (
                  <button
                    key={conv}
                    type="button"
                    onClick={() => handleChange('convenio', conv)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer"
                  >
                    {conv.split(' ')[0]}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={formData.convenio}
                  onChange={e => handleChange('convenio', e.target.value)}
                  placeholder="Nome do convênio"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                />
                <input
                  type="text"
                  value={formData.numeroCarteira}
                  onChange={e => handleChange('numeroCarteira', e.target.value)}
                  placeholder="Nº da Carteira do Convênio *"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none font-mono"
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-8">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Endereço Residencial
                </label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={e => handleChange('endereco', e.target.value)}
                  placeholder="Logradouro, número, complemento"
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
                  placeholder="Bairro"
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
                  placeholder="00000-000"
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
                  UF
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

            {/* Contatos */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="paciente@email.com"
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
                  Telefone 2 / Recado
                </label>
                <input
                  type="text"
                  value={formData.telefone2}
                  onChange={e => handleChange('telefone2', e.target.value)}
                  placeholder="(63) 0000-0000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Responsável */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#0E7B86]/10 text-[#0E7B86] flex items-center justify-center font-bold text-xs">
                  03
                </span>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider m-0">
                  Responsável Legal ou Acompanhante
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Se aplicável</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nome do Responsável
                </label>
                <input
                  type="text"
                  value={formData.nomeResponsavel}
                  onChange={e => handleChange('nomeResponsavel', e.target.value)}
                  placeholder="Nome completo do responsável"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Data de Nascimento
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
                  CPF
                </label>
                <input
                  type="text"
                  value={formData.cpfResponsavel}
                  onChange={e => handleChange('cpfResponsavel', e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Telefone Principal
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
                  E-mail
                </label>
                <input
                  type="email"
                  value={formData.emailResponsavel}
                  onChange={e => handleChange('emailResponsavel', e.target.value)}
                  placeholder="responsavel@email.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('espelho')}
              className="px-5 py-2.5 bg-[#0E7B86] hover:bg-[#0A565D] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>Ver Ficha Formatada para Impressão</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          ABA 3: HISTÓRICO LOCAL
      ======================================================== */}
      {activeTab === 'historico' && (
        <div className="no-print space-y-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 m-0">
                  Histórico de Fichas Emitidas
                </h3>
                <p className="text-xs text-slate-500 m-0 mt-0.5 font-medium">
                  {historicoFichas.length} cadastros de contingência salvos localmente.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={buscaHistorico}
                  onChange={e => setBuscaHistorico(e.target.value)}
                  placeholder="Pesquisar por paciente, CPF ou convênio..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0E7B86] outline-none"
                />
              </div>
            </div>

            {historicoFiltrado.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-medium space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Nenhuma ficha no histórico local.</p>
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
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
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
                        Carregar
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFormData(ficha);
                          handleImprimir(false);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExcluirFicha(ficha.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
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
          DOCUMENTO FÍSICO OFICIAL HPM.FM (A4 IMPRESSO)
          Layout 1: MODERNO / REPAGINADO (Kora Executive)
          Layout 2: CLÁSSICO / ORIGINAL (Matriz Gradeada)
      ======================================================== */}
      <div className={`print-area ${activeTab !== 'espelho' ? 'hidden print:block' : 'block'} bg-white text-slate-900 mx-auto max-w-[210mm] shadow-lg rounded-none print:shadow-none`}>
        
        {/* ========================================================
            LAYOUT 1: DESIGN REPAGINADO (MODERNO, EXECUTIVO, LIMPO)
        ======================================================== */}
        {estiloLayoutPdf === 'moderno' ? (
          <div className="sheet-a4-modern p-6 sm:p-8 font-sans text-slate-900 border border-slate-300 print:border-none min-h-[297mm] flex flex-col justify-between">
            <div>
              {/* Cabeçalho Institucional Repaginado */}
              <div className="border-b-2 border-[#0E7B86] pb-3 mb-4">
                <div className="flex items-center justify-between gap-4">
                  {/* Logo & Marca Kora */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0E7B86] text-white flex items-center justify-center font-black text-xl shadow-xs print:shadow-none">
                      ❖
                    </div>
                    <div>
                      <div className="text-lg font-black tracking-tight text-[#0E7B86] leading-none uppercase">
                        Hospital Palmas Medical
                      </div>
                      <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mt-0.5">
                        Kora Saúde · Rede Hospitalar
                      </div>
                      <div className="text-[9px] text-slate-400 font-semibold">
                        Sistema Integrado de Gestão da Qualidade Hospitalar
                      </div>
                    </div>
                  </div>

                  {/* Metadados Oficiais Controlados */}
                  <div className="text-right border-l border-slate-200 pl-4 space-y-0.5 text-[9px] leading-tight">
                    <div className="inline-block bg-[#0E7B86]/10 text-[#0E7B86] px-2 py-0.5 rounded font-black text-[9.5px] uppercase">
                      Formulário Oficial HPM.FM
                    </div>
                    <div className="text-slate-600">
                      <strong>Versão:</strong> 001 · <strong>Revisão:</strong> 11/01/2026
                    </div>
                    <div className="text-slate-600">
                      <strong>Área:</strong> Atendimento & Admissão
                    </div>
                    <div className="text-slate-500 font-medium">
                      Plano de Contingência Operacional
                    </div>
                  </div>
                </div>

                {/* Faixa com Título do Documento */}
                <div className="mt-3 bg-slate-100 rounded-lg px-3 py-1.5 flex items-center justify-between">
                  <span className="font-black text-xs uppercase tracking-wider text-slate-900">
                    FICHA DE ATENDIMENTO MANUAL DE CONTINGÊNCIA
                  </span>
                  <span className="text-[10px] font-bold text-red-700 uppercase bg-red-100 px-2 py-0.5 rounded">
                    Uso em caso de Tasy offline
                  </span>
                </div>
              </div>

              {/* Barra de Metadados do Atendimento */}
              <div className="grid grid-cols-4 gap-2 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[10px]">
                <div>
                  <span className="text-[8.5px] font-black uppercase text-slate-500 block">Data Atendimento:</span>
                  <span className="font-black font-mono text-[11px] text-slate-900">
                    {modoImpressaoEmBranco ? '____/____/________' : (formData.dataAtendimento || '____/____/________')}
                  </span>
                </div>
                <div>
                  <span className="text-[8.5px] font-black uppercase text-slate-500 block">Hora de Entrada:</span>
                  <span className="font-black font-mono text-[11px] text-slate-900">
                    {modoImpressaoEmBranco ? '____:____' : (formData.horaAtendimento || '____:____')}
                  </span>
                </div>
                <div>
                  <span className="text-[8.5px] font-black uppercase text-slate-500 block">Setor de Destino:</span>
                  <span className="font-bold text-slate-900">
                    {modoImpressaoEmBranco ? '____________________' : (formData.setorDestino || 'Pronto-Socorro')}
                  </span>
                </div>
                <div>
                  <span className="text-[8.5px] font-black uppercase text-slate-500 block">Atendente / Recepção:</span>
                  <span className="font-semibold text-slate-900">
                    {modoImpressaoEmBranco ? '____________________' : (formData.nomeRecepcionista || 'Recepção')}
                  </span>
                </div>
              </div>

              {/* ========================================================
                  BLOCO 1: IDENTIFICAÇÃO DO PACIENTE
              ======================================================== */}
              <div className="border border-slate-300 rounded-lg overflow-hidden mb-3">
                <div className="bg-[#0E7B86] text-white px-3 py-1 font-black text-[10.5px] uppercase tracking-wider flex items-center justify-between">
                  <span>1. IDENTIFICAÇÃO COMPLETA DO PACIENTE</span>
                  <span className="text-[9px] font-normal opacity-90">Cadastro Inicial de Entrada</span>
                </div>

                <div className="p-2.5 space-y-2 text-[10px]">
                  {/* Linha: Nome Paciente */}
                  <div className="border-b border-slate-200 pb-1.5 flex items-baseline">
                    <span className="w-32 font-bold uppercase text-slate-600 text-[9px] flex-shrink-0">Nome do Paciente:</span>
                    <span className="font-bold text-slate-950 text-[11.5px] uppercase">
                      {modoImpressaoEmBranco ? '____________________________________________________________________________________' : formData.nomePaciente}
                    </span>
                  </div>

                  {/* Linha: Nome Mãe */}
                  <div className="border-b border-slate-200 pb-1.5 flex items-baseline">
                    <span className="w-32 font-bold uppercase text-slate-600 text-[9px] flex-shrink-0">Nome da Mãe:</span>
                    <span className="font-semibold text-slate-900 text-[10.5px]">
                      {modoImpressaoEmBranco ? '____________________________________________________________________________________' : formData.nomeMae}
                    </span>
                  </div>

                  {/* Linha: Nascimento, Naturalidade, CPF e RG */}
                  <div className="grid grid-cols-4 gap-2 border-b border-slate-200 pb-1.5">
                    <div>
                      <span className="font-bold uppercase text-slate-600 text-[8.5px] block">Data Nascimento:</span>
                      <span className="font-bold font-mono text-[10.5px]">
                        {modoImpressaoEmBranco ? '____/____/________' : formData.dataNascimento}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold uppercase text-slate-600 text-[8.5px] block">Naturalidade:</span>
                      <span className="font-semibold text-[10.5px]">
                        {modoImpressaoEmBranco ? '____________________' : formData.naturalidade}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold uppercase text-slate-600 text-[8.5px] block">CPF:</span>
                      <span className="font-bold font-mono text-[10.5px]">
                        {modoImpressaoEmBranco ? '_____._____._____-__' : formData.cpf}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold uppercase text-slate-600 text-[8.5px] block">RG / Órgão:</span>
                      <span className="font-semibold text-[10.5px]">
                        {modoImpressaoEmBranco ? '____________________' : formData.rg}
                      </span>
                    </div>
                  </div>

                  {/* Linha: Convênio & Carteira Destaque */}
                  <div className="grid grid-cols-2 gap-3 border-b border-slate-200 pb-1.5 bg-slate-50/70 p-1.5 rounded">
                    <div>
                      <span className="font-black uppercase text-[#0E7B86] text-[8.5px] block">Plano de Saúde / Convênio:</span>
                      <span className="font-black text-slate-950 text-[11px] uppercase">
                        {modoImpressaoEmBranco ? '____________________________________________' : formData.convenio}
                      </span>
                    </div>
                    <div>
                      <span className="font-black uppercase text-[#0E7B86] text-[8.5px] block">Nº da Carteira do Convênio:</span>
                      <span className="font-black font-mono text-slate-950 text-[11px]">
                        {modoImpressaoEmBranco ? '____________________________________________' : formData.numeroCarteira}
                      </span>
                    </div>
                  </div>

                  {/* Linha: Endereço */}
                  <div className="grid grid-cols-12 gap-2 border-b border-slate-200 pb-1.5">
                    <div className="col-span-8">
                      <span className="font-bold uppercase text-slate-600 text-[8.5px] block">Endereço Residencial:</span>
                      <span className="font-semibold text-[10px]">
                        {modoImpressaoEmBranco ? '________________________________________________________________________' : formData.endereco}
                      </span>
                    </div>
                    <div className="col-span-4">
                      <span className="font-bold uppercase text-slate-600 text-[8.5px] block">Bairro:</span>
                      <span className="font-semibold text-[10px]">
                        {modoImpressaoEmBranco ? '______________________________' : formData.bairro}
                      </span>
                    </div>
                  </div>

                  {/* Linha: CEP, Cidade e UF */}
                  <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-1.5">
                    <div>
                      <span className="font-bold uppercase text-slate-600 text-[8.5px] block">CEP:</span>
                      <span className="font-semibold font-mono text-[10px]">
                        {modoImpressaoEmBranco ? '________-___' : formData.cep}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold uppercase text-slate-600 text-[8.5px] block">Cidade:</span>
                      <span className="font-semibold text-[10px]">
                        {modoImpressaoEmBranco ? '____________________' : formData.cidade}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold uppercase text-slate-600 text-[8.5px] block">Estado (UF):</span>
                      <span className="font-bold text-[10px] uppercase">
                        {modoImpressaoEmBranco ? '____' : formData.estado}
                      </span>
                    </div>
                  </div>

                  {/* Linha: Contatos */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="font-bold uppercase text-slate-600 text-[8.5px] block">E-mail:</span>
                      <span className="font-semibold text-[10px]">
                        {modoImpressaoEmBranco ? '________________________________' : formData.email}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold uppercase text-slate-600 text-[8.5px] block">Telefone 1 (Principal):</span>
                      <span className="font-bold font-mono text-[10.5px]">
                        {modoImpressaoEmBranco ? '(____) _____________' : formData.telefone1}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold uppercase text-slate-600 text-[8.5px] block">Telefone 2:</span>
                      <span className="font-semibold font-mono text-[10.5px]">
                        {modoImpressaoEmBranco ? '(____) _____________' : formData.telefone2}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================
                  BLOCO 2: IDENTIFICAÇÃO DO RESPONSÁVEL / ACOMPANHANTE
              ======================================================== */}
              <div className="border border-slate-300 rounded-lg overflow-hidden mb-3">
                <div className="bg-slate-800 text-white px-3 py-1 font-black text-[10.5px] uppercase tracking-wider flex items-center justify-between">
                  <span>2. IDENTIFICAÇÃO DO RESPONSÁVEL / ACOMPANHANTE</span>
                  <span className="text-[9px] font-normal opacity-80">Maior de Idade / Representante</span>
                </div>

                <div className="p-2.5 space-y-2 text-[10px]">
                  <div className="border-b border-slate-200 pb-1.5 flex items-baseline">
                    <span className="w-36 font-bold uppercase text-slate-600 text-[9px] flex-shrink-0">Nome do Responsável:</span>
                    <span className="font-bold text-slate-900 text-[10.5px]">
                      {modoImpressaoEmBranco ? '____________________________________________________________________________________' : formData.nomeResponsavel}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 border-b border-slate-200 pb-1.5">
                    <div>
                      <span className="font-bold uppercase text-slate-600 text-[8.5px] block">Data Nascimento:</span>
                      <span className="font-semibold font-mono text-[10px]">
                        {modoImpressaoEmBranco ? '____/____/________' : formData.dataNascimentoResponsavel}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold uppercase text-slate-600 text-[8.5px] block">CPF:</span>
                      <span className="font-bold font-mono text-[10px]">
                        {modoImpressaoEmBranco ? '_____._____._____-__' : formData.cpfResponsavel}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold uppercase text-slate-600 text-[8.5px] block">Telefone 1:</span>
                      <span className="font-bold font-mono text-[10px]">
                        {modoImpressaoEmBranco ? '(____) _____________' : formData.telefone1Responsavel}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold uppercase text-slate-600 text-[8.5px] block">Telefone 2:</span>
                      <span className="font-semibold font-mono text-[10px]">
                        {modoImpressaoEmBranco ? '(____) _____________' : formData.telefone2Responsavel}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline">
                    <span className="w-36 font-bold uppercase text-slate-600 text-[8.5px] flex-shrink-0">E-mail Responsável:</span>
                    <span className="font-semibold text-[10px]">
                      {modoImpressaoEmBranco ? '____________________________________________________________________' : formData.emailResponsavel}
                    </span>
                  </div>
                </div>
              </div>

              {/* ========================================================
                  BLOCO 3: CLÁUSULA REGULATÓRIA OBRIGATÓRIA
              ======================================================== */}
              <div className="bg-amber-50/90 border border-amber-300 rounded-lg p-2.5 mb-3 text-amber-950 text-[9.5px] leading-relaxed">
                <div className="font-black uppercase text-amber-900 tracking-wider text-[9px] mb-0.5 flex items-center gap-1.5">
                  <span>⚠️ TERMO DE CIÊNCIA & RESPONSABILIDADE FINANCEIRA</span>
                </div>
                <p className="m-0 font-medium">
                  <strong>OBS.:</strong> Caso o convênio esteja em carência, não haja elegibilidade ativa ou o procedimento seja negado pela operadora de saúde, o beneficiário ou seu responsável declara estar ciente de que o pagamento de todo o atendimento médico-hospitalar será cobrado na modalidade <strong>&quot;particular&quot;</strong> conforme tabela vigente da instituição.
                </p>
              </div>

              {/* ========================================================
                  BLOCO 4: CAMPOS DE ASSINATURA FORMAL
              ======================================================== */}
              <div className="grid grid-cols-2 gap-8 pt-4 pb-2">
                <div className="text-center">
                  <div className="border-b-2 border-slate-700 min-h-[35px] mb-1.5" />
                  <span className="font-bold text-[10px] text-slate-900 block uppercase">
                    Assinatura do Responsável ou Beneficiário
                  </span>
                  <span className="text-[8.5px] text-slate-500">
                    Declaro a veracidade dos dados e ciência dos termos
                  </span>
                </div>

                <div className="text-center">
                  <div className="border-b-2 border-slate-700 min-h-[35px] mb-1.5 flex items-end justify-center">
                    {formData.nomeRecepcionista && !modoImpressaoEmBranco && (
                      <span className="text-[9px] text-slate-600 font-semibold mb-1">
                        {formData.nomeRecepcionista}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-[10px] text-slate-900 block uppercase">
                    Assinatura Legível do Recepcionista
                  </span>
                  <span className="text-[8.5px] text-slate-500">
                    Conferência documental e admissão hospitalar
                  </span>
                </div>
              </div>
            </div>

            {/* ========================================================
                RODAPÉ DE GOVERNANÇA, QUALIDADE & AUDITORIA
            ======================================================== */}
            <div className="border-t border-slate-300 pt-2 text-[8px] text-slate-600 leading-tight">
              <div className="grid grid-cols-4 gap-2 text-center pb-1 border-b border-slate-200">
                <div>
                  <strong className="text-slate-800">Elaboração</strong>
                  <div>Paula Fernanda N. Santos<br />Coord. de Atendimento</div>
                </div>
                <div>
                  <strong className="text-slate-800">Gestor do Documento</strong>
                  <div>Paula Fernanda N. Santos<br />Coord. de Atendimento</div>
                </div>
                <div>
                  <strong className="text-slate-800">Revisor</strong>
                  <div>João Carlos D. Medeiros<br />Gerente Administrativo</div>
                </div>
                <div>
                  <strong className="text-slate-800">Aprovador</strong>
                  <div>Qualidade Hospitalar<br />Kora Saúde</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 font-medium text-slate-500">
                <span>Hospital Palmas Medical · ACSU SE 50, Av. Joaquim Teotônio Segurado — Palmas/TO — (63) 3215-4000</span>
                <span>É proibida a reprodução parcial ou total deste documento · Página 1 de 1</span>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================
              LAYOUT 2: DESIGN CLÁSSICO (CÓPIA 1:1 DA MATRIZ ORIGINAL)
          ======================================================== */
          <div className="sheet-a4-classic p-4 sm:p-6 font-sans text-black border-2 border-black print:border-none min-h-[297mm] flex flex-col justify-between text-xs">
            <div>
              {/* Tabela Cabeçalho Clássica */}
              <table className="w-full border-collapse border-2 border-black text-[11px] mb-3">
                <tbody>
                  <tr>
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
                    <td className="w-2/4 border-2 border-black p-2 text-center align-middle">
                      <div className="text-[12px] font-bold uppercase tracking-wider text-black">
                        FORMULÁRIO
                      </div>
                      <div className="text-[13px] font-black uppercase text-black mt-1">
                        Título: FICHA DE ATENDIMENTO MANUAL
                      </div>
                    </td>
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

              {/* Paciente */}
              <div className="border-2 border-black mb-3 text-[11px]">
                <div className="bg-slate-100 border-b-2 border-black px-2 py-1 font-black text-[11px] uppercase tracking-wider">
                  IDENTIFICAÇÃO DO PACIENTE:
                </div>
                <div className="border-b border-black p-2">
                  <span className="font-bold">NOME: </span>
                  <span className="font-semibold uppercase">{modoImpressaoEmBranco ? '' : formData.nomePaciente}</span>
                </div>
                <div className="border-b border-black p-2">
                  <span className="font-bold">NOME DA MÃE: </span>
                  <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.nomeMae}</span>
                </div>
                <div className="border-b border-black flex">
                  <div className="w-1/2 border-r border-black p-2">
                    <span className="font-bold">DATA DE NASCIMENTO: </span>
                    <span className="font-semibold font-mono">{modoImpressaoEmBranco ? '____/____/________' : formData.dataNascimento}</span>
                  </div>
                  <div className="w-1/2 p-2">
                    <span className="font-bold">NATURALIDADE: </span>
                    <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.naturalidade}</span>
                  </div>
                </div>
                <div className="border-b border-black flex">
                  <div className="w-1/2 border-r border-black p-2">
                    <span className="font-bold">CPF: </span>
                    <span className="font-semibold font-mono">{modoImpressaoEmBranco ? '' : formData.cpf}</span>
                  </div>
                  <div className="w-1/2 p-2">
                    <span className="font-bold">RG: </span>
                    <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.rg}</span>
                  </div>
                </div>
                <div className="border-b border-black flex">
                  <div className="w-1/2 border-r border-black p-2">
                    <span className="font-bold">CONVÊNIO: </span>
                    <span className="font-semibold uppercase">{modoImpressaoEmBranco ? '' : formData.convenio}</span>
                  </div>
                  <div className="w-1/2 p-2">
                    <span className="font-bold">Nº CARTEIRA CONVÊNIO: </span>
                    <span className="font-semibold font-mono">{modoImpressaoEmBranco ? '' : formData.numeroCarteira}</span>
                  </div>
                </div>
                <div className="border-b border-black p-2">
                  <span className="font-bold">ENDEREÇO: </span>
                  <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.endereco}</span>
                </div>
                <div className="border-b border-black flex">
                  <div className="w-1/2 border-r border-black p-2">
                    <span className="font-bold">BAIRRO: </span>
                    <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.bairro}</span>
                  </div>
                  <div className="w-1/2 p-2">
                    <span className="font-bold">CEP: </span>
                    <span className="font-semibold font-mono">{modoImpressaoEmBranco ? '' : formData.cep}</span>
                  </div>
                </div>
                <div className="border-b border-black flex">
                  <div className="w-1/2 border-r border-black p-2">
                    <span className="font-bold">CIDADE: </span>
                    <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.cidade}</span>
                  </div>
                  <div className="w-1/2 p-2">
                    <span className="font-bold">ESTADO: </span>
                    <span className="font-semibold uppercase">{modoImpressaoEmBranco ? '' : formData.estado}</span>
                  </div>
                </div>
                <div className="border-b border-black p-2">
                  <span className="font-bold">E-MAIL: </span>
                  <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.email}</span>
                </div>
                <div className="flex">
                  <div className="w-1/2 border-r border-black p-2">
                    <span className="font-bold">TELEFONE 1: </span>
                    <span className="font-semibold font-mono">{modoImpressaoEmBranco ? '' : formData.telefone1}</span>
                  </div>
                  <div className="w-1/2 p-2">
                    <span className="font-bold">TELEFONE 2: </span>
                    <span className="font-semibold font-mono">{modoImpressaoEmBranco ? '' : formData.telefone2}</span>
                  </div>
                </div>
              </div>

              {/* Responsável */}
              <div className="border-2 border-black mb-3 text-[11px]">
                <div className="bg-slate-100 border-b-2 border-black px-2 py-1 font-black text-[11px] uppercase tracking-wider">
                  IDENTIFICAÇÃO DO RESPONSÁVEL/ACOMPANHANTE:
                </div>
                <div className="border-b border-black p-2">
                  <span className="font-bold">NOME: </span>
                  <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.nomeResponsavel}</span>
                </div>
                <div className="border-b border-black flex">
                  <div className="w-1/2 border-r border-black p-2">
                    <span className="font-bold">DATA DE NASCIMENTO: </span>
                    <span className="font-semibold font-mono">{modoImpressaoEmBranco ? '____/____/________' : formData.dataNascimentoResponsavel}</span>
                  </div>
                  <div className="w-1/2 p-2">
                    <span className="font-bold">CPF: </span>
                    <span className="font-semibold font-mono">{modoImpressaoEmBranco ? '' : formData.cpfResponsavel}</span>
                  </div>
                </div>
                <div className="border-b border-black p-2">
                  <span className="font-bold">E-MAIL: </span>
                  <span className="font-semibold">{modoImpressaoEmBranco ? '' : formData.emailResponsavel}</span>
                </div>
                <div className="flex">
                  <div className="w-1/2 border-r border-black p-2">
                    <span className="font-bold">TELEFONE 1: </span>
                    <span className="font-semibold font-mono">{modoImpressaoEmBranco ? '' : formData.telefone1Responsavel}</span>
                  </div>
                  <div className="w-1/2 p-2">
                    <span className="font-bold">TELEFONE 2: </span>
                    <span className="font-semibold font-mono">{modoImpressaoEmBranco ? '' : formData.telefone2Responsavel}</span>
                  </div>
                </div>
              </div>

              {/* Cláusula */}
              <div className="text-center font-bold text-[10px] my-3 leading-tight px-4 text-black">
                OBS.: Caso o convênio esteja em carência ou procedimento negado, o pagamento de todo o atendimento será cobrado &quot;particular&quot;.
              </div>

              {/* Assinaturas */}
              <div className="grid grid-cols-2 gap-6 pt-6 pb-4">
                <div className="text-center">
                  <div className="border-b border-black pb-1 mb-1 min-h-[30px]" />
                  <span className="font-bold text-[10.5px] text-black">
                    Assinatura do responsável ou beneficiário
                  </span>
                </div>
                <div className="text-center">
                  <div className="border-b border-black pb-1 mb-1 min-h-[30px]" />
                  <span className="font-bold text-[10.5px] text-black">
                    Assinatura legível do recepcionista
                  </span>
                </div>
              </div>
            </div>

            {/* Rodapé Clássico */}
            <div className="border-t-2 border-black pt-2 mt-4 text-[8.5px] leading-tight text-black">
              <div className="grid grid-cols-4 gap-2 text-center border-b border-black pb-1 mb-1">
                <div>
                  <strong>Elaboração</strong>
                  <div className="text-[8px]">Paula Fernanda N. Santos<br />Coordenadora de atendimento</div>
                </div>
                <div>
                  <strong>Gestor do Documento</strong>
                  <div className="text-[8px]">Paula Fernanda N. Santos<br />Coordenadora de atendimento</div>
                </div>
                <div>
                  <strong>Revisor</strong>
                  <div className="text-[8px]">João Carlos D. Medeiros<br />Gerente administrativo</div>
                </div>
                <div>
                  <strong>Aprovador</strong>
                  <div className="text-[8px]">Qualidade</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[8px] pt-0.5">
                <span>É proibida a reprodução parcial ou total deste documento</span>
                <span>Página 1 de 1</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          CSS ESPECÍFICO DE IMPRESSÃO A4 (PERFEITAMENTE CALIBRADO)
      ======================================================== */}
      <style>{`
        @media print {
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
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 8mm 12mm !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            background: white !important;
            color: black !important;
          }
          @page {
            size: A4 portrait;
            margin: 6mm;
          }
        }
      `}</style>
    </div>
  );
};
