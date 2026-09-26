import React, { useState, useEffect } from 'react';
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
  FileCheck
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

const CONVENIOS_SUGESTOES = [
  'SERVIR (Governo do Tocantins)',
  'FA-SAUDE (PRO-TOCANTINS)',
  'UNIMED PALMAS / INTERCÂMBIO',
  'BRADESCO SAÚDE',
  'CASSI (Banco do Brasil)',
  'GEAP SAÚDE',
  'AMIL',
  'POSTAL SAÚDE',
  'ASSEFAZ',
  'SAÚDE CAIXA',
  'SUL AMÉRICA',
  'BEST SAÚDE',
  'FUSEX',
  'PARTICULAR'
];

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

  const handleChange = (field: keyof FichaContingenciaData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
    setTimeout(() => setSalvoStatus(false), 3000);
  };

  // Carregar ficha do histórico
  const handleCarregarFicha = (ficha: FichaContingenciaData) => {
    setFormData(ficha);
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

  return (
    <div className="space-y-6">
      {/* ========================================================
          CABEÇALHO DO MÓDULO (OCULTO NA IMPRESSÃO)
      ======================================================== */}
      <div className="no-print bg-gradient-to-r from-slate-900 via-[#0E7B86] to-[#0A565D] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-red-500/20 text-red-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-red-400/30 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                Operação de Contingência
              </span>
              <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                Código: HPM.FM • Versão 000
              </span>
              <span className="bg-cyan-400/20 text-cyan-200 text-xs font-bold px-3 py-1 rounded-full border border-cyan-300/30">
                Atendimento Manual / Tasy Offline
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white m-0">
              Plano de Contingência — Ficha de Atendimento Manual
            </h1>

            <p className="text-slate-200 text-sm sm:text-base font-medium max-w-3xl leading-relaxed m-0">
              Formulário oficial do Hospital Palmas Medical (Kora Saúde) para admissão e cadastro manual de pacientes em caso de indisponibilidade do sistema TASY, queda de energia ou contingência de rede.
            </p>
          </div>

          {/* Botões de Ação Rápida */}
          <div className="flex items-center gap-2.5 flex-wrap md:flex-col md:items-end flex-shrink-0">
            <button
              type="button"
              onClick={() => handleImprimir(false)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-black transition-all shadow-md cursor-pointer group"
            >
              <Printer className="w-4 h-4 text-[#0E7B86] group-hover:scale-110 transition-transform" />
              <span>Imprimir Ficha Preenchida</span>
            </button>

            <button
              type="button"
              onClick={() => handleImprimir(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 cursor-pointer"
              title="Gera o formulário vazio para impressão de cópias de segurança"
            >
              <FileText className="w-4 h-4 text-slate-300" />
              <span>Imprimir Ficha em Branco</span>
            </button>
          </div>
        </div>

        {/* Barra de utilitários rápidos */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSalvarFicha}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-black transition-colors cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{salvoStatus ? 'Salvo no Histórico!' : 'Salvar Registro'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopiarResumoTasy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg font-bold transition-colors cursor-pointer border border-white/20"
            >
              {copiedText ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar para Tasy</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePreencherExemplo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg font-bold transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Preencher Exemplo</span>
            </button>

            <button
              type="button"
              onClick={handleLimpar}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-red-500/30 text-slate-200 hover:text-white rounded-lg font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          </div>

          <div className="text-slate-300 font-medium">
            Histórico salvo neste navegador: <strong>{historicoFichas.length} fichas</strong>
          </div>
        </div>
      </div>

      {/* ========================================================
          ÁREA DE FORMULÁRIO DE ENTRADA (NO-PRINT)
      ======================================================== */}
      <div className="no-print grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel de Edição dos Dados */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
            {/* Bloco 1: Data e Hora do Atendimento */}
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-[#0E7B86]" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider m-0">
                  Data & Hora da Contingência
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Data do Atendimento *
                  </label>
                  <input
                    type="text"
                    value={formData.dataAtendimento}
                    onChange={e => handleChange('dataAtendimento', e.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Hora do Atendimento *
                  </label>
                  <input
                    type="text"
                    value={formData.horaAtendimento}
                    onChange={e => handleChange('horaAtendimento', e.target.value)}
                    placeholder="HH:MM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Nome do Recepcionista
                  </label>
                  <input
                    type="text"
                    value={formData.nomeRecepcionista || ''}
                    onChange={e => handleChange('nomeRecepcionista', e.target.value)}
                    placeholder="Ex: Ana Paula (Recepção PS)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bloco 2: Identificação do Paciente */}
            <div className="border-b border-slate-100 pb-5 space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#0E7B86]" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider m-0">
                  Identificação do Paciente
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Nome Completo do Paciente *
                  </label>
                  <input
                    type="text"
                    value={formData.nomePaciente}
                    onChange={e => handleChange('nomePaciente', e.target.value)}
                    placeholder="Nome completo do paciente"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Nome da Mãe *
                  </label>
                  <input
                    type="text"
                    value={formData.nomeMae}
                    onChange={e => handleChange('nomeMae', e.target.value)}
                    placeholder="Nome completo da mãe"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Data de Nascimento *
                  </label>
                  <input
                    type="text"
                    value={formData.dataNascimento}
                    onChange={e => handleChange('dataNascimento', e.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Naturalidade
                  </label>
                  <input
                    type="text"
                    value={formData.naturalidade}
                    onChange={e => handleChange('naturalidade', e.target.value)}
                    placeholder="Ex: Palmas - TO"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    CPF *
                  </label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={e => handleChange('cpf', e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    RG
                  </label>
                  <input
                    type="text"
                    value={formData.rg}
                    onChange={e => handleChange('rg', e.target.value)}
                    placeholder="Número e órgão emissor"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Convênio / Plano de Saúde *
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={formData.convenio}
                      onChange={e => handleChange('convenio', e.target.value)}
                      placeholder="Ex: SERVIR, UNIMED, BRADESCO..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                    />
                    <select
                      onChange={e => {
                        if (e.target.value) handleChange('convenio', e.target.value);
                      }}
                      className="w-full px-2 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 outline-none cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>Ou selecione um convênio cadastrado...</option>
                      {CONVENIOS_SUGESTOES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Nº Carteira do Convênio *
                  </label>
                  <input
                    type="text"
                    value={formData.numeroCarteira}
                    onChange={e => handleChange('numeroCarteira', e.target.value)}
                    placeholder="Número da carteirinha"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    value={formData.endereco}
                    onChange={e => handleChange('endereco', e.target.value)}
                    placeholder="Rua, avenida, número, complemento"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={formData.bairro}
                    onChange={e => handleChange('bairro', e.target.value)}
                    placeholder="Bairro"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    value={formData.cep}
                    onChange={e => handleChange('cep', e.target.value)}
                    placeholder="00000-000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={formData.cidade}
                    onChange={e => handleChange('cidade', e.target.value)}
                    placeholder="Cidade"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Estado (UF)
                  </label>
                  <input
                    type="text"
                    value={formData.estado}
                    onChange={e => handleChange('estado', e.target.value)}
                    placeholder="TO"
                    maxLength={2}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none uppercase"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    E-mail do Paciente
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder="paciente@exemplo.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Telefone 1 *
                  </label>
                  <input
                    type="text"
                    value={formData.telefone1}
                    onChange={e => handleChange('telefone1', e.target.value)}
                    placeholder="(63) 90000-0000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Telefone 2
                  </label>
                  <input
                    type="text"
                    value={formData.telefone2}
                    onChange={e => handleChange('telefone2', e.target.value)}
                    placeholder="(63) 0000-0000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bloco 3: Identificação do Responsável / Acompanhante */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0E7B86]" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider m-0">
                  Identificação do Responsável / Acompanhante
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Nome Completo do Responsável
                  </label>
                  <input
                    type="text"
                    value={formData.nomeResponsavel}
                    onChange={e => handleChange('nomeResponsavel', e.target.value)}
                    placeholder="Nome do responsável ou acompanhante"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Data de Nascimento do Responsável
                  </label>
                  <input
                    type="text"
                    value={formData.dataNascimentoResponsavel}
                    onChange={e => handleChange('dataNascimentoResponsavel', e.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    CPF do Responsável
                  </label>
                  <input
                    type="text"
                    value={formData.cpfResponsavel}
                    onChange={e => handleChange('cpfResponsavel', e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    E-mail do Responsável
                  </label>
                  <input
                    type="email"
                    value={formData.emailResponsavel}
                    onChange={e => handleChange('emailResponsavel', e.target.value)}
                    placeholder="responsavel@exemplo.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Telefone 1 do Responsável
                  </label>
                  <input
                    type="text"
                    value={formData.telefone1Responsavel}
                    onChange={e => handleChange('telefone1Responsavel', e.target.value)}
                    placeholder="(63) 90000-0000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Telefone 2 do Responsável
                  </label>
                  <input
                    type="text"
                    value={formData.telefone2Responsavel}
                    onChange={e => handleChange('telefone2Responsavel', e.target.value)}
                    placeholder="(63) 0000-0000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Cláusula / OBS Institucional */}
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-xs text-amber-950 space-y-1">
              <span className="font-black text-amber-900 uppercase block tracking-wider text-[11px]">
                Cláusula Obrigatória do Formulário HPM.FM:
              </span>
              <p className="font-medium text-amber-900 m-0 leading-relaxed italic">
                &ldquo;OBS.: Caso o convênio esteja em carência ou procedimento negado, o pagamento de todo o atendimento será cobrado &quot;particular&quot;.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Painel Lateral: Prévia e Histórico Recente */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card de Impressão Direta */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider m-0 flex items-center gap-2">
              <Printer className="w-4 h-4 text-[#0E7B86]" />
              Opções de Impressão
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed m-0 font-medium">
              O layout de impressão foi calibrado conforme o formulário original da <strong>Kora Saúde / Hospital Palmas Medical</strong>, cabendo exatamente em 1 página A4 com os campos institucionais, assinaturas e rodapé de qualidade.
            </p>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleImprimir(false)}
                className="w-full py-3 px-4 bg-[#0E7B86] hover:bg-[#0A565D] text-white rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir com os Dados Preenchidos</span>
              </button>

              <button
                type="button"
                onClick={() => handleImprimir(true)}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Imprimir Folha em Branco (Manual)</span>
              </button>
            </div>
          </div>

          {/* Histórico de Fichas Salvas neste Dispositivo */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider m-0">
                Atendimentos de Contingência
              </h3>
              <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                {historicoFichas.length}
              </span>
            </div>

            {historicoFichas.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center font-medium m-0">
                Nenhum atendimento salvo no histórico local ainda.
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {historicoFichas.map(f => (
                  <div
                    key={f.id}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between gap-2 transition-colors"
                  >
                    <div
                      className="cursor-pointer flex-1 min-w-0"
                      onClick={() => handleCarregarFicha(f)}
                      title="Clique para carregar dados desta ficha"
                    >
                      <h4 className="text-xs font-black text-slate-900 truncate m-0">
                        {f.nomePaciente}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate m-0 mt-0.5 font-medium">
                        {f.convenio || 'Sem convênio'} • {f.dataAtendimento} {f.horaAtendimento}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleExcluirFicha(f.id)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer"
                      title="Remover do histórico"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          DOCUMENTO OFICIAL IMPRESSO (LAYOUT A4 OFICIAL KORA)
          Visível na tela como prévia e formatado para impressão
      ======================================================== */}
      <div className="print-area bg-white border border-slate-300 rounded-2xl shadow-sm p-4 sm:p-8 max-w-4xl mx-auto text-slate-900 font-sans text-xs">
        {/* Banner de cabeçalho da prévia na tela (oculto na impressão) */}
        <div className="no-print bg-slate-100 border border-slate-200 rounded-xl p-3 mb-6 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-bold text-slate-700">
              Prévia Visual do Documento Físico Oficial HPM.FM (A4)
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleImprimir(false)}
            className="px-3 py-1 bg-[#0E7B86] text-white rounded-lg font-bold text-xs hover:bg-[#0A565D] transition-colors cursor-pointer"
          >
            Imprimir Agora
          </button>
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
          <div className="bg-slate-100 border-b-2 border-black px-2 py-1 font-black text-[11px] uppercase tracking-wider">
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
          <div className="bg-slate-100 border-b-2 border-black px-2 py-1 font-black text-[11px] uppercase tracking-wider">
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
            padding: 12mm 15mm !important;
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
