import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  FileText, 
  RotateCcw, 
  Copy, 
  Check, 
  Save, 
  Trash2, 
  AlertTriangle, 
  User, 
  Users, 
  Building2, 
  Sparkles,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Clock,
  ShieldAlert
} from 'lucide-react';

export interface FichaContingenciaData {
  id?: string;
  dataAtendimento: string;
  horaAtendimento: string;
  setorDestino: string;
  nomeRecepcionista: string;
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
  criadoEm?: string;
}

const STORAGE_KEY = 'hpm_fichas_contingencia_v2';

const CONVENIOS_SUGESTOES = [
  'BRADESCO',
  'SERVIR (Governo do Tocantins)',
  'FA-SAUDE (PRO-TOCANTINS)',
  'UNIMED PALMAS / INTERCÂMBIO',
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

const SETORES_SUGESTOES = [
  'Pronto-Socorro Adulto',
  'Pronto-Socorro Pediátrico',
  'Internação Clínica',
  'Internação Cirúrgica',
  'UTI Adulto',
  'UTI Pediátrica / Neo',
  'Ambulatório de Especialidades',
  'Centro Cirúrgico / Hemodinâmica'
];

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
    setorDestino: 'Pronto-Socorro Adulto',
    nomeRecepcionista: 'Recepção PS Central',
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
    telefone2Responsavel: ''
  });

  const [historicoFichas, setHistoricoFichas] = useState<FichaContingenciaData[]>([]);
  const [copiedText, setCopiedText] = useState(false);
  const [salvoStatus, setSalvoStatus] = useState(false);
  const [modoImpressaoEmBranco, setModoImpressaoEmBranco] = useState(false);

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

  const handleSalvarFicha = () => {
    if (!formData.nomePaciente.trim()) {
      alert('Por favor, informe ao menos o Nome do Paciente para registrar o atendimento de contingência.');
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

  const handleCarregarFicha = (ficha: FichaContingenciaData) => {
    setFormData(ficha);
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
        setorDestino: 'Pronto-Socorro Adulto',
        nomeRecepcionista: 'Recepção PS Central',
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
        telefone2Responsavel: ''
      });
    }
  };

  const handlePreencherExemplo = () => {
    setFormData({
      dataAtendimento: '26/09/2026',
      horaAtendimento: '14:06',
      setorDestino: 'Pronto-Socorro Adulto',
      nomeRecepcionista: 'Recepção PS Central',
      nomePaciente: 'CARLOS EDUARDO OLIVEIRA SANTOS',
      nomeMae: 'Maria de Lourdes Santos',
      dataNascimento: '14/05/1982',
      naturalidade: 'Palmas - TO',
      cpf: '012.345.678-90',
      rg: '1.234.567 SSP-TO',
      convenio: 'BRADESCO',
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
      telefone2Responsavel: ''
    });
  };

  const handleCopiarResumoTasy = () => {
    const linhas: string[] = [
      '=== REGISTRO DE CONTINGÊNCIA - FICHA HPM.FM ===',
      `Data/Hora: ${formData.dataAtendimento} às ${formData.horaAtendimento} | Setor: ${formData.setorDestino}`,
      `Atendente: ${formData.nomeRecepcionista}`,
      `Paciente: ${formData.nomePaciente}`,
      `Nome da Mãe: ${formData.nomeMae}`,
      `Nascimento: ${formData.dataNascimento} | Naturalidade: ${formData.naturalidade}`,
      `CPF: ${formData.cpf} | RG: ${formData.rg}`,
      `Convênio: ${formData.convenio} | Carteirinha: ${formData.numeroCarteira}`,
      `Endereço: ${formData.endereco}, ${formData.bairro} - ${formData.cidade}/${formData.estado} CEP: ${formData.cep}`,
      `E-mail: ${formData.email}`,
      `Telefones: ${formData.telefone1} / ${formData.telefone2}`,
      formData.nomeResponsavel ? `Responsável: ${formData.nomeResponsavel} (CPF: ${formData.cpfResponsavel} | Tel: ${formData.telefone1Responsavel})` : '',
      'OBS: Caso o convênio esteja em carência, não haja elegibilidade ativa ou o procedimento seja negado, o pagamento será particular.'
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

  return (
    <div className="space-y-6">
      {/* ========================================================
          CABEÇALHO OPERACIONAL DA ABA (OCULTO NA IMPRESSÃO)
      ======================================================== */}
      <div className="no-print bg-gradient-to-r from-slate-900 via-[#0B7285] to-[#085966] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-red-500/20 text-red-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-red-400/30 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                Uso em caso de Tasy Offline
              </span>
              <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                Formulário Oficial HPM.FM • Versão 001
              </span>
              <span className="bg-cyan-400/20 text-cyan-100 text-xs font-bold px-3 py-1 rounded-full border border-cyan-300/30">
                Hospital Palmas Medical (Kora Saúde)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white m-0">
              Plano de Contingência — Ficha de Atendimento Manual
            </h1>

            <p className="text-slate-200 text-sm sm:text-base font-medium max-w-3xl leading-relaxed m-0">
              Preencha os dados do paciente e responsável para gerar a ficha oficial de contingência com layout institucional padronizado e pronto para impressão direta em A4.
            </p>
          </div>

          {/* Botões de Ação de Impressão */}
          <div className="flex items-center gap-2.5 flex-wrap md:flex-col md:items-end flex-shrink-0">
            <button
              type="button"
              onClick={() => handleImprimir(false)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-black transition-all shadow-md cursor-pointer group"
            >
              <Printer className="w-4 h-4 text-[#0B7285] group-hover:scale-110 transition-transform" />
              <span>Imprimir Ficha Preenchida</span>
            </button>

            <button
              type="button"
              onClick={() => handleImprimir(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 cursor-pointer"
              title="Gera a folha em branco com linhas para preenchimento manual à caneta"
            >
              <FileText className="w-4 h-4 text-slate-300" />
              <span>Imprimir Ficha em Branco</span>
            </button>
          </div>
        </div>

        {/* Barra de Ações Rápidas */}
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
              title="Carrega os dados exatos do modelo oficial"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Carregar Modelo Oficial (Exemplo)</span>
            </button>

            <button
              type="button"
              onClick={handleLimpar}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-red-500/30 text-slate-200 hover:text-white rounded-lg font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar Formulário</span>
            </button>
          </div>

          <div className="text-slate-300 font-medium">
            Histórico de contingência: <strong>{historicoFichas.length} registros</strong>
          </div>
        </div>
      </div>

      {/* ========================================================
          FORMULÁRIO DE ENTRADA / DIGITAÇÃO (NO-PRINT)
      ======================================================== */}
      <div className="no-print grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel Principal de Edição */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
            {/* Bloco: Dados de Entrada da Recepção */}
            <div className="border-b border-slate-100 pb-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-[#0B7285]" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider m-0">
                  Dados de Admissão & Recepção
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Data do Atendimento *
                  </label>
                  <input
                    type="text"
                    value={formData.dataAtendimento}
                    onChange={e => handleChange('dataAtendimento', e.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Hora de Entrada *
                  </label>
                  <input
                    type="text"
                    value={formData.horaAtendimento}
                    onChange={e => handleChange('horaAtendimento', e.target.value)}
                    placeholder="HH:MM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Setor de Destino *
                  </label>
                  <input
                    type="text"
                    value={formData.setorDestino}
                    onChange={e => handleChange('setorDestino', e.target.value)}
                    placeholder="Ex: Pronto-Socorro Adulto"
                    list="setores-list"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none"
                  />
                  <datalist id="setores-list">
                    {SETORES_SUGESTOES.map(s => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Atendente / Recepção *
                  </label>
                  <input
                    type="text"
                    value={formData.nomeRecepcionista}
                    onChange={e => handleChange('nomeRecepcionista', e.target.value)}
                    placeholder="Ex: Recepção PS Central"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bloco 1: Identificação do Paciente */}
            <div className="border-b border-slate-100 pb-5 space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#0B7285]" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider m-0">
                  1. Identificação Completa do Paciente
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Nome Completo do Paciente *
                  </label>
                  <input
                    type="text"
                    value={formData.nomePaciente}
                    onChange={e => handleChange('nomePaciente', e.target.value)}
                    placeholder="NOME COMPLETO DO PACIENTE"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none uppercase"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Nome da Mãe *
                  </label>
                  <input
                    type="text"
                    value={formData.nomeMae}
                    onChange={e => handleChange('nomeMae', e.target.value)}
                    placeholder="Nome completo da mãe"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Data Nascimento *
                  </label>
                  <input
                    type="text"
                    value={formData.dataNascimento}
                    onChange={e => handleChange('dataNascimento', e.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    RG / Órgão
                  </label>
                  <input
                    type="text"
                    value={formData.rg}
                    onChange={e => handleChange('rg', e.target.value)}
                    placeholder="Número e órgão emissor"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none"
                  />
                </div>

                {/* Plano de Saúde e Carteira */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-[#0B7285] block mb-1">
                    Plano de Saúde / Convênio *
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={formData.convenio}
                      onChange={e => handleChange('convenio', e.target.value)}
                      placeholder="Ex: BRADESCO, SERVIR, UNIMED..."
                      className="w-full px-3 py-2 bg-teal-50/50 border border-teal-200 rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none uppercase"
                    />
                    <select
                      onChange={e => {
                        if (e.target.value) handleChange('convenio', e.target.value);
                      }}
                      className="w-full px-2 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 outline-none cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>Ou selecione um convênio frequente...</option>
                      {CONVENIOS_SUGESTOES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-[#0B7285] block mb-1">
                    Nº da Carteira do Convênio *
                  </label>
                  <input
                    type="text"
                    value={formData.numeroCarteira}
                    onChange={e => handleChange('numeroCarteira', e.target.value)}
                    placeholder="Número da carteirinha com dígitos"
                    className="w-full px-3 py-2 bg-teal-50/50 border border-teal-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none font-mono"
                  />
                </div>

                {/* Endereço e Localização */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Endereço Residencial
                  </label>
                  <input
                    type="text"
                    value={formData.endereco}
                    onChange={e => handleChange('endereco', e.target.value)}
                    placeholder="Quadra, rua, lote, número e complemento"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none"
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
                    placeholder="Ex: Plano Diretor Sul"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none"
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
                    placeholder="77000-000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={formData.cidade}
                    onChange={e => handleChange('cidade', e.target.value)}
                    placeholder="Cidade"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none uppercase"
                  />
                </div>

                {/* Contatos */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder="paciente@email.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Telefone 1 (Principal) *
                  </label>
                  <input
                    type="text"
                    value={formData.telefone1}
                    onChange={e => handleChange('telefone1', e.target.value)}
                    placeholder="(63) 98000-0000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none"
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
                    placeholder="(63) 3000-0000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B7285] focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bloco 2: Identificação do Responsável */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider m-0">
                  2. Identificação do Responsável / Acompanhante
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Nome do Responsável
                  </label>
                  <input
                    type="text"
                    value={formData.nomeResponsavel}
                    onChange={e => handleChange('nomeResponsavel', e.target.value)}
                    placeholder="Nome completo do responsável ou acompanhante legal"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-700 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Data Nascimento
                  </label>
                  <input
                    type="text"
                    value={formData.dataNascimentoResponsavel}
                    onChange={e => handleChange('dataNascimentoResponsavel', e.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-slate-700 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={formData.cpfResponsavel}
                    onChange={e => handleChange('cpfResponsavel', e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-slate-700 focus:bg-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Telefone 1
                  </label>
                  <input
                    type="text"
                    value={formData.telefone1Responsavel}
                    onChange={e => handleChange('telefone1Responsavel', e.target.value)}
                    placeholder="(63) 98000-0000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-slate-700 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Telefone 2
                  </label>
                  <input
                    type="text"
                    value={formData.telefone2Responsavel}
                    onChange={e => handleChange('telefone2Responsavel', e.target.value)}
                    placeholder="(63) 3000-0000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-slate-700 focus:bg-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    E-mail Responsável
                  </label>
                  <input
                    type="email"
                    value={formData.emailResponsavel}
                    onChange={e => handleChange('emailResponsavel', e.target.value)}
                    placeholder="responsavel@email.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-slate-700 focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Painel Lateral: Atalhos e Histórico */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider m-0 flex items-center gap-2">
              <Printer className="w-4 h-4 text-[#0B7285]" />
              Ações de Impressão
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed m-0 font-medium">
              O layout segue com precisão a identidade visual oficial do <strong>Hospital Palmas Medical</strong>, contendo cabeçalho com logo, identificação completa, bloco de convênio destacado, cláusula financeira e linhas de assinatura.
            </p>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleImprimir(false)}
                className="w-full py-3 px-4 bg-[#0B7285] hover:bg-[#085966] text-white rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Ficha com Dados Preenchidos</span>
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

          {/* Histórico Recente no Dispositivo */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider m-0">
                Fichas Salvas no Navegador
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
          DOCUMENTO OFICIAL (LAYOUT EXATO DA IMAGEM FORNECIDA)
          Exibido como prévia na tela e formatado para impressão A4
      ======================================================== */}
      <div className="bg-slate-100/70 p-2 sm:p-6 rounded-2xl no-print flex flex-col items-center">
        <div className="w-full max-w-[850px] mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Prévia Visual do PDF Oficial (HPM.FM)
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleImprimir(false)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#0B7285] hover:bg-[#085966] text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Esta Ficha</span>
          </button>
        </div>

        {/* CONTAINER DA FICHA COM O DESIGN EXATO DA IMAGEM */}
        <div className="print-document-container bg-white border border-slate-300 shadow-xl rounded-xl w-full max-w-[850px] p-6 sm:p-8 text-slate-900 font-sans">
          {/* 1. TOPO: LOGO & DADOS INSTITUCIONAIS */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            {/* Esquerda: Logo + Textos */}
            <div className="flex items-center gap-3.5">
              {/* Ícone Hospitalar Teal */}
              <div className="w-12 h-12 rounded-xl bg-[#006B70] flex items-center justify-center flex-shrink-0 shadow-xs">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current">
                  <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
                </svg>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-black text-[#0B7285] tracking-tight m-0 leading-none">
                  HOSPITAL PALMAS MEDICAL
                </h2>
                <div className="text-[11px] font-black text-slate-600 tracking-wider uppercase mt-1">
                  KORA SAÚDE • REDE HOSPITALAR
                </div>
                <div className="text-[10px] font-medium text-slate-500 mt-0.5">
                  Sistema Integrado de Gestão da Qualidade Hospitalar
                </div>
              </div>
            </div>

            {/* Direita: Metadados Form Oficial */}
            <div className="text-right flex flex-col items-end">
              <div className="text-[11px] font-black text-[#0B7285] uppercase tracking-wider">
                FORMULÁRIO OFICIAL HPM.FM
              </div>
              <div className="text-[10px] text-slate-600 font-medium mt-0.5">
                <strong>Versão:</strong> 001 · <strong>Revisão:</strong> 11/01/2026
              </div>
              <div className="text-[10px] text-slate-600 font-medium">
                <strong>Área:</strong> Atendimento & Admissão
              </div>
              <div className="text-[10px] text-slate-500">
                Plano de Contingência Operacional
              </div>
            </div>
          </div>

          {/* 2. BARRA DE TÍTULO DA FICHA */}
          <div className="mt-3.5 flex items-center justify-between border-b border-slate-200 pb-2.5">
            <h1 className="text-xs sm:text-sm font-black uppercase text-slate-900 tracking-wider m-0">
              FICHA DE ATENDIMENTO MANUAL DE CONTINGÊNCIA
            </h1>

            <span className="bg-red-50 text-red-600 text-[10.5px] font-black px-2.5 py-0.5 rounded border border-red-200 tracking-wider uppercase">
              USO EM CASO DE TASY OFFLINE
            </span>
          </div>

          {/* 3. BLOCO: DADOS RÁPIDOS DE ENTRADA (4 COLUNAS) */}
          <div className="mt-3.5 border border-slate-200 rounded-xl p-3 bg-slate-50/50 grid grid-cols-4 gap-3 text-[11px]">
            <div>
              <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                DATA ATENDIMENTO:
              </div>
              <div className="text-xs font-black text-slate-900 mt-0.5">
                {modoImpressaoEmBranco ? '____/____/________' : (formData.dataAtendimento || '____/____/________')}
              </div>
            </div>

            <div>
              <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                HORA DE ENTRADA:
              </div>
              <div className="text-xs font-black text-slate-900 mt-0.5">
                {modoImpressaoEmBranco ? '____:____' : (formData.horaAtendimento || '____:____')}
              </div>
            </div>

            <div>
              <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                SETOR DE DESTINO:
              </div>
              <div className="text-xs font-black text-slate-900 mt-0.5 truncate">
                {modoImpressaoEmBranco ? '____________________' : (formData.setorDestino || 'Pronto-Socorro Adulto')}
              </div>
            </div>

            <div>
              <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                ATENDENTE / RECEPÇÃO:
              </div>
              <div className="text-xs font-black text-slate-900 mt-0.5 truncate">
                {modoImpressaoEmBranco ? '____________________' : (formData.nomeRecepcionista || 'Recepção PS Central')}
              </div>
            </div>
          </div>

          {/* 4. SEÇÃO 1: IDENTIFICAÇÃO COMPLETA DO PACIENTE */}
          <div className="mt-4 border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
            {/* Header da Seção 1 (Teal) */}
            <div className="bg-[#006B70] text-white px-3.5 py-1.5 flex items-center justify-between">
              <span className="text-xs font-black tracking-wider uppercase">
                1. IDENTIFICAÇÃO COMPLETA DO PACIENTE
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-100">
                CADASTRO INICIAL DE ENTRADA
              </span>
            </div>

            {/* Conteúdo da Seção 1 */}
            <div className="divide-y divide-slate-200 text-xs">
              {/* Linha 1: Nome do Paciente */}
              <div className="p-2.5 flex items-baseline gap-2">
                <span className="text-[10.5px] font-bold text-slate-600 uppercase flex-shrink-0">
                  NOME DO PACIENTE:
                </span>
                <span className="text-sm font-black text-slate-900 uppercase">
                  {modoImpressaoEmBranco ? '' : formData.nomePaciente}
                </span>
              </div>

              {/* Linha 2: Nome da Mãe */}
              <div className="p-2.5 flex items-baseline gap-2">
                <span className="text-[10.5px] font-bold text-slate-600 uppercase flex-shrink-0">
                  NOME DA MÃE:
                </span>
                <span className="text-xs font-medium text-slate-900">
                  {modoImpressaoEmBranco ? '' : formData.nomeMae}
                </span>
              </div>

              {/* Linha 3: 4 colunas (Nascimento, Naturalidade, CPF, RG) */}
              <div className="p-2.5 grid grid-cols-4 gap-3">
                <div>
                  <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                    DATA NASCIMENTO:
                  </div>
                  <div className="text-xs font-black text-slate-900 mt-0.5">
                    {modoImpressaoEmBranco ? '____/____/________' : formData.dataNascimento}
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                    NATURALIDADE:
                  </div>
                  <div className="text-xs font-medium text-slate-900 mt-0.5">
                    {modoImpressaoEmBranco ? '' : formData.naturalidade}
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                    CPF:
                  </div>
                  <div className="text-xs font-black text-slate-900 mt-0.5 font-mono">
                    {modoImpressaoEmBranco ? '' : formData.cpf}
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                    RG / ÓRGÃO:
                  </div>
                  <div className="text-xs font-medium text-slate-900 mt-0.5">
                    {modoImpressaoEmBranco ? '' : formData.rg}
                  </div>
                </div>
              </div>

              {/* Linha 4: Bloco Destacado de Convênio & Carteira (Fundo Azul-Petróleo Claro) */}
              <div className="bg-[#E6F4F5] p-3 grid grid-cols-2 gap-4 border-y border-[#B2E2E6]">
                <div>
                  <div className="text-[10px] font-black text-[#0B7285] uppercase">
                    PLANO DE SAÚDE / CONVÊNIO:
                  </div>
                  <div className="text-sm font-black text-slate-900 uppercase mt-0.5">
                    {modoImpressaoEmBranco ? '' : formData.convenio}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-black text-[#0B7285] uppercase">
                    Nº DA CARTEIRA DO CONVÊNIO:
                  </div>
                  <div className="text-sm font-black text-slate-900 mt-0.5 font-mono">
                    {modoImpressaoEmBranco ? '' : formData.numeroCarteira}
                  </div>
                </div>
              </div>

              {/* Linha 5: Endereço e Bairro */}
              <div className="p-2.5 grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                    ENDEREÇO RESIDENCIAL:
                  </div>
                  <div className="text-xs font-medium text-slate-900 mt-0.5">
                    {modoImpressaoEmBranco ? '' : formData.endereco}
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                    BAIRRO:
                  </div>
                  <div className="text-xs font-medium text-slate-900 mt-0.5">
                    {modoImpressaoEmBranco ? '' : formData.bairro}
                  </div>
                </div>
              </div>

              {/* Linha 6: CEP, Cidade e Estado */}
              <div className="p-2.5 grid grid-cols-3 gap-3">
                <div>
                  <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                    CEP:
                  </div>
                  <div className="text-xs font-medium text-slate-900 mt-0.5 font-mono">
                    {modoImpressaoEmBranco ? '' : formData.cep}
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                    CIDADE:
                  </div>
                  <div className="text-xs font-medium text-slate-900 mt-0.5">
                    {modoImpressaoEmBranco ? '' : formData.cidade}
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                    ESTADO (UF):
                  </div>
                  <div className="text-xs font-black text-slate-900 mt-0.5 uppercase">
                    {modoImpressaoEmBranco ? '' : formData.estado}
                  </div>
                </div>
              </div>

              {/* Linha 7: E-mail e Telefones */}
              <div className="p-2.5 grid grid-cols-3 gap-3">
                <div>
                  <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                    E-MAIL:
                  </div>
                  <div className="text-xs font-medium text-slate-900 mt-0.5 truncate">
                    {modoImpressaoEmBranco ? '' : formData.email}
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                    TELEFONE 1 (PRINCIPAL):
                  </div>
                  <div className="text-xs font-black text-slate-900 mt-0.5">
                    {modoImpressaoEmBranco ? '' : formData.telefone1}
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                    TELEFONE 2:
                  </div>
                  <div className="text-xs font-medium text-slate-900 mt-0.5">
                    {modoImpressaoEmBranco ? '' : formData.telefone2}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. SEÇÃO 2: IDENTIFICAÇÃO DO RESPONSÁVEL / ACOMPANHANTE */}
          <div className="mt-4 border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
            {/* Header da Seção 2 (Slate Escuro) */}
            <div className="bg-[#1E293B] text-white px-3.5 py-1.5 flex items-center justify-between">
              <span className="text-xs font-black tracking-wider uppercase">
                2. IDENTIFICAÇÃO DO RESPONSÁVEL / ACOMPANHANTE
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                MAIOR DE IDADE / REPRESENTANTE
              </span>
            </div>

            {/* Conteúdo da Seção 2 */}
            <div className="divide-y divide-slate-200 text-xs">
              {/* Linha 1: Nome do Responsável */}
              <div className="p-2.5 flex items-baseline gap-2">
                <span className="text-[10.5px] font-bold text-slate-600 uppercase flex-shrink-0">
                  NOME DO RESPONSÁVEL:
                </span>
                <span className="text-xs font-black text-slate-900">
                  {modoImpressaoEmBranco ? '' : formData.nomeResponsavel}
                </span>
              </div>

              {/* Linha 2: 4 colunas (Nascimento, CPF, Telefone 1, Telefone 2) */}
              <div className="p-2.5 grid grid-cols-4 gap-3">
                <div>
                  <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                    DATA NASCIMENTO:
                  </div>
                  <div className="text-xs font-medium text-slate-900 mt-0.5">
                    {modoImpressaoEmBranco ? '____/____/________' : formData.dataNascimentoResponsavel}
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                    CPF:
                  </div>
                  <div className="text-xs font-medium text-slate-900 mt-0.5 font-mono">
                    {modoImpressaoEmBranco ? '' : formData.cpfResponsavel}
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                    TELEFONE 1:
                  </div>
                  <div className="text-xs font-medium text-slate-900 mt-0.5">
                    {modoImpressaoEmBranco ? '' : formData.telefone1Responsavel}
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-bold text-slate-500 uppercase">
                    TELEFONE 2:
                  </div>
                  <div className="text-xs font-medium text-slate-900 mt-0.5">
                    {modoImpressaoEmBranco ? '' : formData.telefone2Responsavel}
                  </div>
                </div>
              </div>

              {/* Linha 3: E-mail Responsável */}
              <div className="p-2.5">
                <span className="text-[10.5px] font-bold text-slate-600 uppercase mr-2">
                  E-MAIL RESPONSÁVEL:
                </span>
                <span className="text-xs font-medium text-slate-900">
                  {modoImpressaoEmBranco ? '' : formData.emailResponsavel}
                </span>
              </div>
            </div>
          </div>

          {/* 6. TERMO DE CIÊNCIA & RESPONSABILIDADE FINANCEIRA */}
          <div className="mt-4 bg-[#FFFBEB] border border-[#FCD34D] rounded-xl p-3 text-[10.5px] text-[#92400E] leading-relaxed">
            <div className="font-black text-[#B45309] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>⚠️</span>
              <span>TERMO DE CIÊNCIA & RESPONSABILIDADE FINANCEIRA</span>
            </div>
            <p className="m-0 font-medium">
              <strong>OBS.:</strong> Caso o convênio esteja em carência, não haja elegibilidade ativa ou o procedimento seja negado pela operadora de saúde, o beneficiário ou seu responsável declara estar ciente de que o pagamento de todo o atendimento médico-hospitalar será cobrado na modalidade <strong>&quot;particular&quot;</strong> conforme tabela vigente da instituição.
            </p>
          </div>

          {/* 7. ASSINATURAS (2 COLUNAS) */}
          <div className="mt-8 grid grid-cols-2 gap-8 text-center pt-2">
            <div>
              <div className="border-b-2 border-slate-900 pb-1 mb-1.5 min-h-[32px] flex items-end justify-center" />
              <div className="text-[11px] font-black text-slate-900 uppercase">
                ASSINATURA DO RESPONSÁVEL OU BENEFICIÁRIO
              </div>
              <div className="text-[9.5px] text-slate-500 font-medium mt-0.5">
                Declaro a veracidade dos dados e ciência dos termos
              </div>
            </div>

            <div>
              <div className="border-b-2 border-slate-900 pb-1 mb-1.5 min-h-[32px] flex items-end justify-center">
                <span className="text-[10.5px] text-slate-600 font-bold">
                  {modoImpressaoEmBranco ? '' : (formData.nomeRecepcionista || 'Recepção PS Central')}
                </span>
              </div>
              <div className="text-[11px] font-black text-slate-900 uppercase">
                ASSINATURA LEGÍVEL DO RECEPCIONISTA
              </div>
              <div className="text-[9.5px] text-slate-500 font-medium mt-0.5">
                Conferência documental e admissão hospitalar
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          DOCUMENTO DESTINADO EXCLUSIVAMENTE À IMPRESSÃO A4
      ======================================================== */}
      <div className="print-only-sheet hidden text-slate-900 font-sans">
        {/* TOPO: LOGO & DADOS INSTITUCIONAIS */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-3">
          {/* Esquerda: Logo + Textos */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#006B70] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
              </svg>
            </div>

            <div>
              <h2 className="text-base font-black text-[#0B7285] tracking-tight m-0 leading-none">
                HOSPITAL PALMAS MEDICAL
              </h2>
              <div className="text-[10px] font-black text-slate-700 tracking-wider uppercase mt-1">
                KORA SAÚDE • REDE HOSPITALAR
              </div>
              <div className="text-[9px] font-medium text-slate-500">
                Sistema Integrado de Gestão da Qualidade Hospitalar
              </div>
            </div>
          </div>

          {/* Direita: Metadados Form Oficial */}
          <div className="text-right">
            <div className="text-[10px] font-black text-[#0B7285] uppercase tracking-wider">
              FORMULÁRIO OFICIAL HPM.FM
            </div>
            <div className="text-[9px] text-slate-700 font-medium">
              <strong>Versão:</strong> 001 · <strong>Revisão:</strong> 11/01/2026
            </div>
            <div className="text-[9px] text-slate-700 font-medium">
              <strong>Área:</strong> Atendimento & Admissão
            </div>
            <div className="text-[9px] text-slate-500">
              Plano de Contingência Operacional
            </div>
          </div>
        </div>

        {/* BARRA DE TÍTULO DA FICHA */}
        <div className="mt-2.5 flex items-center justify-between border-b border-slate-200 pb-2">
          <h1 className="text-xs font-black uppercase text-slate-900 tracking-wider m-0">
            FICHA DE ATENDIMENTO MANUAL DE CONTINGÊNCIA
          </h1>

          <span className="bg-red-50 text-red-600 text-[9.5px] font-black px-2 py-0.5 rounded border border-red-200 tracking-wider uppercase">
            USO EM CASO DE TASY OFFLINE
          </span>
        </div>

        {/* BLOCO: DADOS RÁPIDOS DE ENTRADA (4 COLUNAS) */}
        <div className="mt-2.5 border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 grid grid-cols-4 gap-2 text-[10px]">
          <div>
            <div className="text-[8.5px] font-bold text-slate-500 uppercase">
              DATA ATENDIMENTO:
            </div>
            <div className="text-[10.5px] font-black text-slate-900 mt-0.5">
              {modoImpressaoEmBranco ? '____/____/________' : (formData.dataAtendimento || '____/____/________')}
            </div>
          </div>

          <div>
            <div className="text-[8.5px] font-bold text-slate-500 uppercase">
              HORA DE ENTRADA:
            </div>
            <div className="text-[10.5px] font-black text-slate-900 mt-0.5">
              {modoImpressaoEmBranco ? '____:____' : (formData.horaAtendimento || '____:____')}
            </div>
          </div>

          <div>
            <div className="text-[8.5px] font-bold text-slate-500 uppercase">
              SETOR DE DESTINO:
            </div>
            <div className="text-[10.5px] font-black text-slate-900 mt-0.5 truncate">
              {modoImpressaoEmBranco ? '____________________' : (formData.setorDestino || 'Pronto-Socorro Adulto')}
            </div>
          </div>

          <div>
            <div className="text-[8.5px] font-bold text-slate-500 uppercase">
              ATENDENTE / RECEPÇÃO:
            </div>
            <div className="text-[10.5px] font-black text-slate-900 mt-0.5 truncate">
              {modoImpressaoEmBranco ? '____________________' : (formData.nomeRecepcionista || 'Recepção PS Central')}
            </div>
          </div>
        </div>

        {/* SEÇÃO 1: IDENTIFICAÇÃO COMPLETA DO PACIENTE */}
        <div className="mt-3 border border-slate-300 rounded-lg overflow-hidden">
          <div className="bg-[#006B70] text-white px-3 py-1 flex items-center justify-between">
            <span className="text-[10.5px] font-black tracking-wider uppercase">
              1. IDENTIFICAÇÃO COMPLETA DO PACIENTE
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-teal-100">
              CADASTRO INICIAL DE ENTRADA
            </span>
          </div>

          <div className="divide-y divide-slate-200 text-[10.5px]">
            <div className="p-2 flex items-baseline gap-2">
              <span className="text-[9.5px] font-bold text-slate-600 uppercase flex-shrink-0">
                NOME DO PACIENTE:
              </span>
              <span className="text-xs font-black text-slate-900 uppercase">
                {modoImpressaoEmBranco ? '' : formData.nomePaciente}
              </span>
            </div>

            <div className="p-2 flex items-baseline gap-2">
              <span className="text-[9.5px] font-bold text-slate-600 uppercase flex-shrink-0">
                NOME DA MÃE:
              </span>
              <span className="text-[10.5px] font-medium text-slate-900">
                {modoImpressaoEmBranco ? '' : formData.nomeMae}
              </span>
            </div>

            <div className="p-2 grid grid-cols-4 gap-2">
              <div>
                <div className="text-[8.5px] font-bold text-slate-500 uppercase">
                  DATA NASCIMENTO:
                </div>
                <div className="text-[10.5px] font-black text-slate-900 mt-0.5">
                  {modoImpressaoEmBranco ? '____/____/________' : formData.dataNascimento}
                </div>
              </div>

              <div>
                <div className="text-[8.5px] font-bold text-slate-500 uppercase">
                  NATURALIDADE:
                </div>
                <div className="text-[10.5px] font-medium text-slate-900 mt-0.5">
                  {modoImpressaoEmBranco ? '' : formData.naturalidade}
                </div>
              </div>

              <div>
                <div className="text-[8.5px] font-bold text-slate-500 uppercase">
                  CPF:
                </div>
                <div className="text-[10.5px] font-black text-slate-900 mt-0.5 font-mono">
                  {modoImpressaoEmBranco ? '' : formData.cpf}
                </div>
              </div>

              <div>
                <div className="text-[8.5px] font-bold text-slate-500 uppercase">
                  RG / ÓRGÃO:
                </div>
                <div className="text-[10.5px] font-medium text-slate-900 mt-0.5">
                  {modoImpressaoEmBranco ? '' : formData.rg}
                </div>
              </div>
            </div>

            {/* Bloco Destacado de Convênio & Carteira */}
            <div className="bg-[#E6F4F5] p-2.5 grid grid-cols-2 gap-3 border-y border-[#B2E2E6]">
              <div>
                <div className="text-[9px] font-black text-[#0B7285] uppercase">
                  PLANO DE SAÚDE / CONVÊNIO:
                </div>
                <div className="text-xs font-black text-slate-900 uppercase mt-0.5">
                  {modoImpressaoEmBranco ? '' : formData.convenio}
                </div>
              </div>

              <div>
                <div className="text-[9px] font-black text-[#0B7285] uppercase">
                  Nº DA CARTEIRA DO CONVÊNIO:
                </div>
                <div className="text-xs font-black text-slate-900 mt-0.5 font-mono">
                  {modoImpressaoEmBranco ? '' : formData.numeroCarteira}
                </div>
              </div>
            </div>

            <div className="p-2 grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <div className="text-[8.5px] font-bold text-slate-500 uppercase">
                  ENDEREÇO RESIDENCIAL:
                </div>
                <div className="text-[10px] font-medium text-slate-900 mt-0.5">
                  {modoImpressaoEmBranco ? '' : formData.endereco}
                </div>
              </div>

              <div>
                <div className="text-[8.5px] font-bold text-slate-500 uppercase">
                  BAIRRO:
                </div>
                <div className="text-[10px] font-medium text-slate-900 mt-0.5">
                  {modoImpressaoEmBranco ? '' : formData.bairro}
                </div>
              </div>
            </div>

            <div className="p-2 grid grid-cols-3 gap-2">
              <div>
                <div className="text-[8.5px] font-bold text-slate-500 uppercase">
                  CEP:
                </div>
                <div className="text-[10px] font-medium text-slate-900 mt-0.5 font-mono">
                  {modoImpressaoEmBranco ? '' : formData.cep}
                </div>
              </div>

              <div>
                <div className="text-[8.5px] font-bold text-slate-500 uppercase">
                  CIDADE:
                </div>
                <div className="text-[10px] font-medium text-slate-900 mt-0.5">
                  {modoImpressaoEmBranco ? '' : formData.cidade}
                </div>
              </div>

              <div>
                <div className="text-[8.5px] font-bold text-slate-500 uppercase">
                  ESTADO (UF):
                </div>
                <div className="text-[10px] font-black text-slate-900 mt-0.5 uppercase">
                  {modoImpressaoEmBranco ? '' : formData.estado}
                </div>
              </div>
            </div>

            <div className="p-2 grid grid-cols-3 gap-2">
              <div>
                <div className="text-[8.5px] font-bold text-slate-500 uppercase">
                  E-MAIL:
                </div>
                <div className="text-[10px] font-medium text-slate-900 mt-0.5 truncate">
                  {modoImpressaoEmBranco ? '' : formData.email}
                </div>
              </div>

              <div>
                <div className="text-[8.5px] font-bold text-slate-500 uppercase">
                  TELEFONE 1 (PRINCIPAL):
                </div>
                <div className="text-[10px] font-black text-slate-900 mt-0.5">
                  {modoImpressaoEmBranco ? '' : formData.telefone1}
                </div>
              </div>

              <div>
                <div className="text-[8.5px] font-bold text-slate-500 uppercase">
                  TELEFONE 2:
                </div>
                <div className="text-[10px] font-medium text-slate-900 mt-0.5">
                  {modoImpressaoEmBranco ? '' : formData.telefone2}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: IDENTIFICAÇÃO DO RESPONSÁVEL / ACOMPANHANTE */}
        <div className="mt-3 border border-slate-300 rounded-lg overflow-hidden">
          <div className="bg-[#1E293B] text-white px-3 py-1 flex items-center justify-between">
            <span className="text-[10.5px] font-black tracking-wider uppercase">
              2. IDENTIFICAÇÃO DO RESPONSÁVEL / ACOMPANHANTE
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300">
              MAIOR DE IDADE / REPRESENTANTE
            </span>
          </div>

          <div className="divide-y divide-slate-200 text-[10.5px]">
            <div className="p-2 flex items-baseline gap-2">
              <span className="text-[9.5px] font-bold text-slate-600 uppercase flex-shrink-0">
                NOME DO RESPONSÁVEL:
              </span>
              <span className="text-[10.5px] font-black text-slate-900">
                {modoImpressaoEmBranco ? '' : formData.nomeResponsavel}
              </span>
            </div>

            <div className="p-2 grid grid-cols-4 gap-2">
              <div>
                <div className="text-[8.5px] font-bold text-slate-500 uppercase">
                  DATA NASCIMENTO:
                </div>
                <div className="text-[10px] font-medium text-slate-900 mt-0.5">
                  {modoImpressaoEmBranco ? '____/____/________' : formData.dataNascimentoResponsavel}
                </div>
              </div>

              <div>
                <div className="text-[8.5px] font-bold text-slate-500 uppercase">
                  CPF:
                </div>
                <div className="text-[10px] font-medium text-slate-900 mt-0.5 font-mono">
                  {modoImpressaoEmBranco ? '' : formData.cpfResponsavel}
                </div>
              </div>

              <div>
                <div className="text-[8.5px] font-bold text-slate-500 uppercase">
                  TELEFONE 1:
                </div>
                <div className="text-[10px] font-medium text-slate-900 mt-0.5">
                  {modoImpressaoEmBranco ? '' : formData.telefone1Responsavel}
                </div>
              </div>

              <div>
                <div className="text-[8.5px] font-bold text-slate-500 uppercase">
                  TELEFONE 2:
                </div>
                <div className="text-[10px] font-medium text-slate-900 mt-0.5">
                  {modoImpressaoEmBranco ? '' : formData.telefone2Responsavel}
                </div>
              </div>
            </div>

            <div className="p-2">
              <span className="text-[9.5px] font-bold text-slate-600 uppercase mr-2">
                E-MAIL RESPONSÁVEL:
              </span>
              <span className="text-[10px] font-medium text-slate-900">
                {modoImpressaoEmBranco ? '' : formData.emailResponsavel}
              </span>
            </div>
          </div>
        </div>

        {/* TERMO DE CIÊNCIA & RESPONSABILIDADE FINANCEIRA */}
        <div className="mt-3 bg-[#FFFBEB] border border-[#FCD34D] rounded-lg p-2.5 text-[9.5px] text-[#92400E] leading-snug">
          <div className="font-black text-[#B45309] uppercase tracking-wider mb-0.5 flex items-center gap-1">
            <span>⚠️</span>
            <span>TERMO DE CIÊNCIA & RESPONSABILIDADE FINANCEIRA</span>
          </div>
          <p className="m-0 font-medium">
            <strong>OBS.:</strong> Caso o convênio esteja em carência, não haja elegibilidade ativa ou o procedimento seja negado pela operadora de saúde, o beneficiário ou seu responsável declara estar ciente de que o pagamento de todo o atendimento médico-hospitalar será cobrado na modalidade <strong>&quot;particular&quot;</strong> conforme tabela vigente da instituição.
          </p>
        </div>

        {/* ASSINATURAS (2 COLUNAS) */}
        <div className="mt-6 grid grid-cols-2 gap-8 text-center pt-2">
          <div>
            <div className="border-b-2 border-slate-900 pb-1 mb-1 min-h-[30px] flex items-end justify-center" />
            <div className="text-[10px] font-black text-slate-900 uppercase">
              ASSINATURA DO RESPONSÁVEL OU BENEFICIÁRIO
            </div>
            <div className="text-[8.5px] text-slate-500 font-medium mt-0.5">
              Declaro a veracidade dos dados e ciência dos termos
            </div>
          </div>

          <div>
            <div className="border-b-2 border-slate-900 pb-1 mb-1 min-h-[30px] flex items-end justify-center">
              <span className="text-[9.5px] text-slate-700 font-bold">
                {modoImpressaoEmBranco ? '' : (formData.nomeRecepcionista || 'Recepção PS Central')}
              </span>
            </div>
            <div className="text-[10px] font-black text-slate-900 uppercase">
              ASSINATURA LEGÍVEL DO RECEPCIONISTA
            </div>
            <div className="text-[8.5px] text-slate-500 font-medium mt-0.5">
              Conferência documental e admissão hospitalar
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          ESTILOS CSS ESPECÍFICOS PARA IMPRESSÃO EM A4
      ======================================================== */}
      <style>{`
        @media screen {
          .print-only-sheet {
            display: none !important;
          }
        }

        @media print {
          /* Esconder elementos da aplicação que não fazem parte do documento */
          body * {
            visibility: hidden !important;
          }
          .no-print, header, nav, aside {
            display: none !important;
          }

          /* Exibir apenas a folha de impressão oficial */
          .print-only-sheet, .print-only-sheet * {
            visibility: visible !important;
          }

          .print-only-sheet {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 8mm 10mm !important;
            background: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          @page {
            size: A4 portrait;
            margin: 6mm 8mm;
          }
        }
      `}</style>
    </div>
  );
};
