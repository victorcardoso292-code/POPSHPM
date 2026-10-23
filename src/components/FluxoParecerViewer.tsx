import React, { useState, useMemo } from 'react';
import { 
  Stethoscope, 
  Search, 
  Copy, 
  Check, 
  Sparkles, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  ExternalLink, 
  Building2, 
  Ambulance, 
  BedDouble, 
  Printer, 
  UserCheck, 
  Clock, 
  ChevronRight,
  Send,
  HelpCircle,
  FileCheck2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Brain
} from 'lucide-react';
import { 
  PARECER_WORKFLOW_STEPS, 
  PARECERES_CONVENIOS_DATA, 
  PARECERES_NEUROLOGIA_DATA,
  ESPECIALIDADES_PARECER, 
  ERROS_CRITICOS_GLOSA_PARECER,
  ConvenioParecerRule,
  ParecerNeurologiaRule 
} from '../data/pareceresData';

interface FluxoParecerViewerProps {
  onOpenAiWithPrompt?: (prompt: string) => void;
  initialConvenioId?: string;
}

export const FluxoParecerViewer: React.FC<FluxoParecerViewerProps> = ({
  onOpenAiWithPrompt,
  initialConvenioId
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'simulador' | 'matriz' | 'neurologia' | 'fluxo' | 'antiglosa'>('simulador');
  
  // Simulator states
  const [selectedConvenioId, setSelectedConvenioId] = useState<string>(initialConvenioId || 'SERVIR');
  const [selectedAmbiente, setSelectedAmbiente] = useState<'PS' | 'INTERNACAO' | 'UTI'>('PS');
  const [selectedEspecialidade, setSelectedEspecialidade] = useState<string>('Cardiologia Clínica');
  const [pacienteNome, setPacienteNome] = useState<string>('');
  const [leitoBox, setLeitoBox] = useState<string>('');
  const [motivoClinico, setMotivoClinico] = useState<string>('');

  // Search & Filters in Matrix
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [authFilter, setAuthFilter] = useState<'all' | 'direto' | 'autorizar' | 'especiais'>('all');

  // Search & Filters in Neurologia
  const [neuroSearch, setNeuroSearch] = useState<string>('');
  const [neuroFilter, setNeuroFilter] = useState<'all' | 'pacote_ps' | 'particular' | 'conta_aberta' | 'sus'>('all');

  // Copy states
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Modal detail
  const [detailModalConvenio, setDetailModalConvenio] = useState<ConvenioParecerRule | null>(null);

  // Active selected rule for simulator
  const activeRule = useMemo(() => {
    return PARECERES_CONVENIOS_DATA.find(c => c.convenioId === selectedConvenioId) || PARECERES_CONVENIOS_DATA[0];
  }, [selectedConvenioId]);

  // Code based on environment
  const targetTussCode = useMemo(() => {
    if (selectedAmbiente === 'PS') return activeRule.tussPs;
    if (selectedAmbiente === 'UTI') return activeRule.tussUti || activeRule.tussInternacao;
    return activeRule.tussInternacao;
  }, [activeRule, selectedAmbiente]);

  // Filtered matrix list
  const filteredMatrix = useMemo(() => {
    return PARECERES_CONVENIOS_DATA.filter(item => {
      // Filter by auth status
      if (authFilter === 'direto' && item.requiresAuth !== 'NÃO') return false;
      if (authFilter === 'autorizar' && item.requiresAuth !== 'SIM') return false;
      if (authFilter === 'especiais' && !['SERVIR', 'PRO TOCANTINS', 'CASSI', 'GEAP'].includes(item.convenioId)) return false;

      // Filter by search query
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.convenioName.toLowerCase().includes(q) ||
        item.convenioId.toLowerCase().includes(q) ||
        item.tussPs.includes(q) ||
        item.tussInternacao.includes(q) ||
        item.regraGeral.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, authFilter]);

  // Neuro rule matching currently selected convênio in simulator
  const activeNeuroRule = useMemo(() => {
    const convName = activeRule.convenioName.toLowerCase();
    const convId = activeRule.convenioId.toLowerCase();
    return PARECERES_NEUROLOGIA_DATA.find(n => {
      const nName = n.convenio.toLowerCase();
      return (
        convName.includes(nName) || 
        nName.includes(convName) || 
        convId.includes(nName) || 
        nName.includes(convId) ||
        (nName.includes('sul') && convName.includes('sul')) ||
        (nName.includes('caixa') && convName.includes('caixa')) ||
        (nName.includes('geap') && convName.includes('geap')) ||
        (nName.includes('bradesco') && convName.includes('bradesco')) ||
        (nName.includes('servir') && convName.includes('servir')) ||
        (nName.includes('cassi') && convName.includes('cassi')) ||
        (nName.includes('amil') && convName.includes('amil')) ||
        (nName.includes('assefaz') && convName.includes('assefaz')) ||
        (nName.includes('best') && convName.includes('best')) ||
        (nName.includes('pasa') && convName.includes('pasa')) ||
        (nName.includes('postal') && convName.includes('postal')) ||
        (nName.includes('planassiste') && convName.includes('planassiste')) ||
        (nName.includes('fusex') && convName.includes('fusex'))
      );
    });
  }, [activeRule]);

  // Filtered Neurologia list
  const filteredNeurologia = useMemo(() => {
    return PARECERES_NEUROLOGIA_DATA.filter(item => {
      if (neuroFilter === 'pacote_ps' && item.statusPs !== 'dentro-pacote') return false;
      if (neuroFilter === 'particular' && item.statusPs !== 'particular' && item.statusPs !== 'fora-pacote-particular') return false;
      if (neuroFilter === 'conta_aberta' && !item.observacoes.toLowerCase().includes('aberta')) return false;
      if (neuroFilter === 'sus' && !item.isSus) return false;

      if (!neuroSearch) return true;
      const q = neuroSearch.toLowerCase().trim();
      return (
        item.convenio.toLowerCase().includes(q) ||
        item.ps.toLowerCase().includes(q) ||
        item.uti.toLowerCase().includes(q) ||
        item.ui.toLowerCase().includes(q) ||
        item.observacoes.toLowerCase().includes(q)
      );
    });
  }, [neuroSearch, neuroFilter]);

  // Copy code helper
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Generate formatted dispatch message
  const generatedDispatchText = useMemo(() => {
    const lines: string[] = [];
    lines.push(`*HOSPITAL PALMAS MEDICAL - SOLICITAÇÃO DE PARECER MÉDICO*`);
    lines.push(`• *Data/Hora:* ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`);
    lines.push(`• *Ambiente:* ${selectedAmbiente === 'PS' ? 'Pronto-Socorro (Urgência)' : (selectedAmbiente === 'UTI' ? 'Unidade de Terapia Intensiva (UTI)' : 'Internação Clínica/Cirúrgica')}`);
    lines.push(`• *Especialidade Solicitada:* ${selectedEspecialidade}`);
    if (pacienteNome) lines.push(`• *Paciente:* ${pacienteNome}`);
    if (leitoBox) lines.push(`• *Leito / Box:* ${leitoBox}`);
    lines.push(`• *Convênio:* ${activeRule.convenioName}`);
    lines.push(`• *Código TUSS Parecer:* ${targetTussCode}`);
    lines.push(`• *Exige Autorização Prévia?* ${activeRule.requiresAuth === 'SIM' ? 'SIM (Obrigatório autorizar no portal antes)' : (activeRule.requiresAuth === 'NÃO' ? 'NÃO (Liberação Direta com Guia Assinada)' : 'CONDICIONAL (Consultar regra)')}`);
    lines.push(`• *Diretriz do Convênio:* ${activeRule.regraGeral}`);
    if (motivoClinico) lines.push(`• *Motivo Clínico / Hipótese:* ${motivoClinico}`);
    lines.push(`\n⚠️ *Atenção:* Obrigatório colher carimbo e assinatura do médico parecerista com CRM e assinatura do paciente ou responsável legal na guia TISS.`);
    return lines.join('\n');
  }, [activeRule, selectedAmbiente, selectedEspecialidade, pacienteNome, leitoBox, motivoClinico, targetTussCode]);

  const handleCopyDispatch = () => {
    navigator.clipboard.writeText(generatedDispatchText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* ========================================================
          CABEÇALHO OFICIAL DO MÓDULO DE PARECERES
      ======================================================== */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#0E7B86] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
                Protocolo Operacional Oficial
              </span>
              <span className="bg-purple-400/20 text-purple-200 text-xs font-bold px-3 py-1 rounded-full border border-purple-300/30">
                Pronto-Socorro • Internação • UTI
              </span>
              <span className="bg-emerald-500/30 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
                Padrão TISS / ANS 2026
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white m-0">
              Fluxo de Pareceres & Interconsultas
            </h1>

            <p className="text-slate-200 text-sm sm:text-base font-medium max-w-3xl leading-relaxed m-0">
              Guia completo para solicitação, autorização, preenchimento de guias TISS, códigos TUSS específicos e regras anti-glosa de pareceres médicos especializados no Hospital Palmas Medical.
            </p>
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center gap-2.5 flex-wrap md:flex-col md:items-end flex-shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl text-xs font-black transition-all border border-white/20 cursor-pointer shadow-xs"
              title="Imprimir guia operacional"
            >
              <Printer className="w-4 h-4 text-purple-200" />
              <span>Imprimir Ficha</span>
            </button>

            {onOpenAiWithPrompt && (
              <button
                type="button"
                onClick={() => onOpenAiWithPrompt('Quais são as regras para solicitação e faturamento de parecer médico no Servir, Cassi, Amil e Bradesco? Quais códigos TUSS usar e como evitar glosas?')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-amber-950 group-hover:rotate-12 transition-transform" />
                <span>Dúvidas de Parecer com IA</span>
              </button>
            )}
          </div>
        </div>

        {/* Indicator Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10">
            <div className="text-purple-200 text-xs font-bold uppercase tracking-wider">
              Total de Planos Mapeados
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              {PARECERES_CONVENIOS_DATA.length} Convênios
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10">
            <div className="text-emerald-300 text-xs font-bold uppercase tracking-wider">
              Liberação Direta (Sem Senha)
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              {PARECERES_CONVENIOS_DATA.filter(c => c.requiresAuth === 'NÃO').length} Planos
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10">
            <div className="text-amber-300 text-xs font-bold uppercase tracking-wider">
              Exigem Autorização Prévia
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              {PARECERES_CONVENIOS_DATA.filter(c => c.requiresAuth === 'SIM').length} Planos (ex: Amil)
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10">
            <div className="text-cyan-300 text-xs font-bold uppercase tracking-wider">
              Códigos Regulados
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              Servir • Cassi • FA-Saúde
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          NAVEGAÇÃO POR ABAS DO MÓDULO
      ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('simulador')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'simulador'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Simulador de Parecer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matriz')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'matriz'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Matriz de Códigos & Convênios</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {PARECERES_CONVENIOS_DATA.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('neurologia')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'neurologia'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Brain className="w-4 h-4 text-purple-400" />
            <span>Cobrança Neurologia</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              activeTab === 'neurologia'
                ? 'bg-white/20 text-white'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {PARECERES_NEUROLOGIA_DATA.length} Convênios
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fluxo')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'fluxo'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Fluxo Operacional (6 Passos)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('antiglosa')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'antiglosa'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Guia Anti-Glosa & Checklist</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          ABA 1: SIMULADOR INTERATIVO DE PARECER
      ======================================================== */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          {/* Formulário de Configuração do Parecer */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center font-black">
                    1
                  </div>
                  <h2 className="text-base font-black text-slate-900 m-0">
                    Definir Dados do Atendimento
                  </h2>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Passo a Passo
                </span>
              </div>

              {/* Setor / Ambiente */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  Ambiente do Atendimento *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'PS' as const, label: 'Pronto-Socorro (PS)', icon: Ambulance },
                    { id: 'INTERNACAO' as const, label: 'Internação / Enferm.', icon: BedDouble },
                    { id: 'UTI' as const, label: 'UTI Geral / Cardio', icon: Building2 }
                  ].map(amb => {
                    const Icon = amb.icon;
                    const isSel = selectedAmbiente === amb.id;
                    return (
                      <button
                        key={amb.id}
                        type="button"
                        onClick={() => setSelectedAmbiente(amb.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-start gap-1.5 ${
                          isSel
                            ? 'bg-purple-50 border-purple-600 text-purple-900 shadow-2xs'
                            : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSel ? 'text-purple-700' : 'text-slate-400'}`} />
                        <span className="text-xs font-black leading-tight">
                          {amb.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Convênio */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  Convênio do Paciente *
                </label>
                <select
                  value={selectedConvenioId}
                  onChange={e => setSelectedConvenioId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-purple-600 focus:bg-white outline-none cursor-pointer"
                >
                  {PARECERES_CONVENIOS_DATA.map(c => (
                    <option key={c.convenioId} value={c.convenioId}>
                      {c.convenioName} — [{c.requiresAuth === 'SIM' ? 'EXIGE AUTORIZAÇÃO' : (c.requiresAuth === 'NÃO' ? 'LIBERAÇÃO DIRETA' : 'CONDICIONAL')}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Especialidade Parecerista */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  Especialidade Parecerista Solicitada *
                </label>
                <select
                  value={selectedEspecialidade}
                  onChange={e => setSelectedEspecialidade(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-purple-600 focus:bg-white outline-none cursor-pointer"
                >
                  {ESPECIALIDADES_PARECER.map(esp => (
                    <option key={esp} value={esp}>
                      {esp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Callout Específico de Neurologia quando selecionado */}
              {selectedEspecialidade.toLowerCase().includes('neuro') && (
                <div className="p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-700" />
                      <span className="text-xs font-black text-purple-900 uppercase tracking-wide">
                        Regra Oficial de Neurologia ({activeNeuroRule ? activeNeuroRule.convenio : activeRule.convenioName})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('neurologia')}
                      className="text-[11px] font-black text-purple-700 hover:text-purple-900 underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver Tabela Completa</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {activeNeuroRule ? (
                    <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                      <div className={`p-2 rounded-lg border ${
                        selectedAmbiente === 'PS' ? 'bg-purple-100/90 border-purple-400 font-black' : 'bg-white/80 border-slate-200'
                      }`}>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">PS:</span>
                        <span className={activeNeuroRule.statusPs === 'dentro-pacote' ? 'text-emerald-800 font-bold' : (activeNeuroRule.statusPs === 'na' ? 'text-red-700 font-bold' : 'text-amber-800 font-bold')}>
                          {activeNeuroRule.ps}
                        </span>
                      </div>
                      <div className={`p-2 rounded-lg border ${
                        selectedAmbiente === 'UTI' ? 'bg-purple-100/90 border-purple-400 font-black' : 'bg-white/80 border-slate-200'
                      }`}>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">UTI:</span>
                        <span className="text-slate-800 font-bold">{activeNeuroRule.uti}</span>
                      </div>
                      <div className={`p-2 rounded-lg border ${
                        selectedAmbiente === 'INTERNACAO' ? 'bg-purple-100/90 border-purple-400 font-black' : 'bg-white/80 border-slate-200'
                      }`}>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Internação / UI:</span>
                        <span className="text-slate-800 font-bold">{activeNeuroRule.ui}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-purple-900 m-0">
                      Consulte a aba <strong>Cobrança Neurologia</strong> para verificar o status de faturamento (pacote vs particular vs conta aberta).
                    </p>
                  )}

                  {activeNeuroRule?.observacoes && (
                    <div className="text-[11px] font-bold text-purple-950 bg-white/70 px-2.5 py-1 rounded-md border border-purple-200">
                      Obs: {activeNeuroRule.observacoes}
                    </div>
                  )}
                </div>
              )}

              {/* Dados do Paciente e Leito (Opcionais) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">
                    Nome do Paciente (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Maria José de Sousa"
                    value={pacienteNome}
                    onChange={e => setPacienteNome(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:bg-white outline-none text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">
                    Leito / Box (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Leito 204B ou Box 03"
                    value={leitoBox}
                    onChange={e => setLeitoBox(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:bg-white outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Motivo Clínico / Justificativa */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">
                  Motivo Clínico / Hipótese Diagnóstica (Evita Glosa)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Paciente com dor precordial típica e alteração no ECG; solicitar avaliação cardiológica urgente."
                  value={motivoClinico}
                  onChange={e => setMotivoClinico(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:bg-white outline-none text-slate-800 resize-none"
                />
              </div>
            </div>

            {/* Banner de Atenção Vermelha */}
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-red-950 uppercase tracking-wider m-0">
                  REGRA DE OURO HOSPITALAR: PEGAR ASSINATURA NA GUIA
                </h4>
                <p className="text-xs text-red-900 leading-snug m-0 font-medium">
                  Parecer sem assinatura do paciente (ou responsável) e sem carimbo legível com CRM do médico parecerista gera <strong>glosa irreversível</strong> em todos os convênios.
                </p>
              </div>
            </div>
          </div>

          {/* Painel de Resultado & Instrução Operacional Instantânea */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-700 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-black tracking-wider uppercase text-slate-300">
                    Resultado da Simulação
                  </span>
                </div>
                <span className="text-xs font-mono font-bold bg-white/10 px-2.5 py-0.5 rounded text-emerald-300">
                  {activeRule.convenioId}
                </span>
              </div>

              {/* Destaque do Código TUSS */}
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                  <span>CÓDIGO TUSS PARA DIGITAR NA GUIA:</span>
                  <span className="text-purple-300">
                    Ambiente: {selectedAmbiente}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                    {targetTussCode}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(targetTussCode)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs"
                    title="Copiar código TUSS"
                  >
                    {copiedCode === targetTussCode ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Código</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status de Autorização Prévia */}
              <div className="flex items-center justify-between gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs font-bold text-slate-300">
                  Exige Autorização Prévia no Portal?
                </span>
                <span className={`text-xs font-black px-3 py-1 rounded-full uppercase ${
                  activeRule.requiresAuth === 'SIM'
                    ? 'bg-red-500/20 text-red-300 border border-red-400/40'
                    : (activeRule.requiresAuth === 'NÃO'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-400/40')
                }`}>
                  {activeRule.requiresAuth === 'SIM' ? '⚠️ SIM • AUTORIZAR ANTES' : (activeRule.requiresAuth === 'NÃO' ? '✅ NÃO • LIBERAÇÃO DIRETA' : 'CONDICIONAL')}
                </span>
              </div>

              {/* Diretriz Operacional do Convênio */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Regra Específica do Plano:
                </span>
                <p className="text-xs text-slate-200 font-medium leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10 m-0">
                  {activeRule.regraGeral}
                </p>
              </div>

              {/* Documentos Obrigatórios */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Documentação Obrigatória na Conta:
                </span>
                <ul className="text-xs text-slate-300 space-y-1 m-0 pl-4 list-disc font-medium">
                  {activeRule.documentosObrigatorios.map((doc, idx) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ul>
              </div>

              {/* Portal do Convênio Link (se houver) */}
              {activeRule.portalUrl && (
                <div className="pt-1">
                  <a
                    href={activeRule.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-purple-300 hover:text-white underline transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Acessar {activeRule.portalNome || 'Portal do Prestador'}</span>
                  </a>
                </div>
              )}

              {/* Botão Copiar Resumo / Despacho Completo */}
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleCopyDispatch}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Despacho Copiado para Área de Transferência!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Copiar Despacho do Parecer (WhatsApp / TASY)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ABA 2: MATRIZ DE CÓDIGOS & CONVÊNIOS
      ======================================================== */}
      {activeTab === 'matriz' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Controles de Busca e Filtros Rápidos */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por convênio, código TUSS ou regra de parecer..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-purple-600 focus:bg-white outline-none"
                />
              </div>

              {/* Filtros de Status */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'all' as const, label: `Todos (${PARECERES_CONVENIOS_DATA.length})` },
                  { id: 'direto' as const, label: `Liberação Direta (${PARECERES_CONVENIOS_DATA.filter(c => c.requiresAuth === 'NÃO').length})` },
                  { id: 'autorizar' as const, label: `Exige Autorização (${PARECERES_CONVENIOS_DATA.filter(c => c.requiresAuth === 'SIM').length})` },
                  { id: 'especiais' as const, label: `Códigos Próprios (4)` }
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setAuthFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                      authFilter === f.id
                        ? 'bg-purple-900 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tabela de Convênios */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                    <th className="py-3.5 px-4">Convênio</th>
                    <th className="py-3.5 px-3 text-center">TUSS Pronto-Socorro</th>
                    <th className="py-3.5 px-3 text-center">TUSS Internação / UTI</th>
                    <th className="py-3.5 px-3 text-center">Exige Autorização?</th>
                    <th className="py-3.5 px-4">Regra Operacional & Alertas</th>
                    <th className="py-3.5 px-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMatrix.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                        Nenhum convênio encontrado com os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredMatrix.map(item => (
                      <tr key={item.convenioId} className="hover:bg-purple-50/40 transition-colors">
                        {/* Convênio & Badge */}
                        <td className="py-4 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-lg bg-purple-900 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                              {item.badge}
                            </span>
                            <div>
                              <div className="font-extrabold text-slate-900 leading-tight">
                                {item.convenioName}
                              </div>
                              <span className="text-[10px] text-slate-400 font-semibold">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* TUSS PS */}
                        <td className="py-4 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleCopy(item.tussPs)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-purple-100 text-slate-900 hover:text-purple-900 font-mono text-xs font-black rounded-lg transition-colors cursor-pointer border border-slate-200"
                            title="Clique para copiar código TUSS PS"
                          >
                            <span>{item.tussPs}</span>
                            {copiedCode === item.tussPs ? (
                              <Check className="w-3 h-3 text-emerald-600 font-bold" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-400" />
                            )}
                          </button>
                        </td>

                        {/* TUSS Internação */}
                        <td className="py-4 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleCopy(item.tussInternacao)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-purple-100 text-slate-900 hover:text-purple-900 font-mono text-xs font-black rounded-lg transition-colors cursor-pointer border border-slate-200"
                            title="Clique para copiar código TUSS Internação"
                          >
                            <span>{item.tussInternacao}</span>
                            {copiedCode === item.tussInternacao ? (
                              <Check className="w-3 h-3 text-emerald-600 font-bold" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-400" />
                            )}
                          </button>
                        </td>

                        {/* Exige Autorização */}
                        <td className="py-4 px-3 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-black uppercase ${
                            item.requiresAuth === 'SIM'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : (item.requiresAuth === 'NÃO'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200')
                          }`}>
                            {item.requiresAuth === 'SIM' ? 'Sim (Autorizar)' : (item.requiresAuth === 'NÃO' ? 'Não (Direto)' : 'Condicional')}
                          </span>
                        </td>

                        {/* Regra Geral */}
                        <td className="py-4 px-4 text-xs text-slate-600 max-w-md font-medium leading-relaxed">
                          {item.regraGeral}
                        </td>

                        {/* Ações */}
                        <td className="py-4 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => setDetailModalConvenio(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            <span>Detalhes</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ABA: COBRANÇA DE PARECERES - NEUROLOGIA (OFICIAL)
      ======================================================== */}
      {activeTab === 'neurologia' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Banner com Título e Ações */}
          <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden border border-purple-800/40">
            <div className="absolute right-0 top-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-purple-500/30 text-purple-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-purple-400/40 flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-purple-300" />
                    Tabela Oficial da Especialidade
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
                    {PARECERES_NEUROLOGIA_DATA.length} Convênios Regulados
                  </span>
                  <span className="bg-white/10 text-slate-200 text-xs font-bold px-3 py-1 rounded-full">
                    PS • UTI • Unidade de Internação
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl font-black text-white m-0 tracking-tight">
                  Cobrança de Pareceres — Neurologia
                </h2>

                <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed m-0 font-medium">
                  Matriz regulatória oficial de cobrança e faturamento de pareceres neurológicos por convênio. Determina com precisão quando o parecer está <strong>dentro do pacote do hospital</strong>, quando opera via <strong>conta aberta</strong>, quando deve ser <strong>cobrado particular</strong> e o <strong>alerta vermelho para o SUS</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4 text-purple-200" />
                  <span>Imprimir Tabela</span>
                </button>

                {onOpenAiWithPrompt && (
                  <button
                    type="button"
                    onClick={() => onOpenAiWithPrompt('Quais são as regras de cobrança de parecer de Neurologia no Palmas Medical para Bradesco, Geap, Cassi, Amil e Servir? Quais estão dentro do pacote e quais cobram particular?')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-950" />
                    <span>Dúvidas com IA</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 4 Cards de Resumo Rápido das Diretrizes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Dentro do Pacote no PS */}
            <div className="bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl p-4 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-md">
                  Dentro do Pacote PS
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-sm font-black text-emerald-950">
                Bradesco • Geap • Sul América
              </div>
              <p className="text-xs text-emerald-800 font-medium leading-relaxed m-0">
                <strong>Não cobrar particular no PS</strong>. O parecer já está absorvido no pacote de atendimento de urgência do hospital.
              </p>
            </div>

            {/* 2. Conta Aberta */}
            <div className="bg-purple-50/80 border-2 border-purple-300 rounded-2xl p-4 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 bg-purple-200/60 px-2 py-0.5 rounded-md">
                  Conta Aberta
                </span>
                <FileText className="w-4 h-4 text-purple-700" />
              </div>
              <div className="text-sm font-black text-purple-950">
                Amil • Assefaz • Cassi • PlanAssiste
              </div>
              <p className="text-xs text-purple-900 font-medium leading-relaxed m-0">
                Faturamento direto na conta da internação pelo convênio através de relatório médico e guia TISS.
              </p>
            </div>

            {/* 3. Fora do Pacote / Cobrar Particular */}
            <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-4 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
                  Cobrar Particular
                </span>
                <AlertTriangle className="w-4 h-4 text-amber-700" />
              </div>
              <div className="text-sm font-black text-amber-950">
                Best Saúde • Postal • Caixa • Servir • Vale Pasa
              </div>
              <p className="text-xs text-amber-900 font-medium leading-relaxed m-0">
                Fora do pacote nos ambientes listados. Cobrança de honorário realizada diretamente conforme tabela do serviço.
              </p>
            </div>

            {/* 4. SUS Alerta Vermelho */}
            <div className="bg-red-50/90 border-2 border-red-400 rounded-2xl p-4 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-800 bg-red-200/80 px-2 py-0.5 rounded-md">
                  Vedação Legal
                </span>
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-sm font-black text-red-950">
                SUS (Nunca cobrar da família)
              </div>
              <p className="text-xs text-red-900 font-medium leading-relaxed m-0">
                ⚠️ <strong>Vedado por Lei Federal</strong> (Lei nº 8.080/90). É terminantemente proibido exigir qualquer valor do paciente ou familiar.
              </p>
            </div>
          </div>

          {/* Barra de Filtros e Busca Interativa */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar convênio, status de cobrança ou observação (ex: Bradesco, Conta aberta, Pacote)..."
                  value={neuroSearch}
                  onChange={e => setNeuroSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-purple-600 focus:bg-white outline-none"
                />
              </div>

              {/* Botões de Filtro Rápido */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'all' as const, label: `Todos (${PARECERES_NEUROLOGIA_DATA.length})` },
                  { id: 'pacote_ps' as const, label: `Dentro do Pacote PS (3)` },
                  { id: 'particular' as const, label: `Cobrar Particular (9)` },
                  { id: 'conta_aberta' as const, label: `Conta Aberta (4)` },
                  { id: 'sus' as const, label: `SUS Alerta (1)` }
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setNeuroFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                      neuroFilter === f.id
                        ? 'bg-purple-900 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tabela de Planilha Oficial com Design Fiel ao Documento */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-purple-700" />
                <h3 className="text-sm font-black text-slate-900 m-0">
                  Planilha Oficial: Cobrança de Pareceres Neurologia
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500">
                Mostrando {filteredNeurologia.length} de {PARECERES_NEUROLOGIA_DATA.length} convênios
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-700 text-xs font-black uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4 w-[22%]">Convênio</th>
                    <th className="py-3 px-4 w-[20%] text-center">Pronto-Socorro (PS)</th>
                    <th className="py-3 px-4 w-[20%] text-center">UTI</th>
                    <th className="py-3 px-4 w-[20%] text-center">Unidade de Internação (UI)</th>
                    <th className="py-3 px-4 w-[18%]">Observações / Tipo de Conta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {filteredNeurologia.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400 font-semibold">
                        Nenhum convênio encontrado com os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredNeurologia.map((row, idx) => {
                      const isSus = row.isSus;
                      return (
                        <tr
                          key={idx}
                          className={`transition-colors ${
                            isSus
                              ? 'bg-red-50/70 hover:bg-red-100/70 border-l-4 border-l-red-600 font-bold'
                              : (idx % 2 === 0 ? 'bg-white hover:bg-purple-50/40' : 'bg-slate-50/50 hover:bg-purple-50/40')
                          }`}
                        >
                          {/* Convênio */}
                          <td className="py-3.5 px-4 font-black text-slate-900">
                            <div className="flex items-center gap-2">
                              {isSus ? (
                                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping flex-shrink-0" />
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0" />
                              )}
                              <span className={isSus ? 'text-red-950 font-black text-sm' : 'text-slate-900 text-sm'}>
                                {row.convenio}
                              </span>
                            </div>
                          </td>

                          {/* Pronto-Socorro (PS) */}
                          <td className="py-3.5 px-4 text-center">
                            {row.ps.includes('Dentro do pacote') ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                                <span>{row.ps}</span>
                              </span>
                            ) : row.ps.includes('N.A.') ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-red-100 text-red-900 border border-red-300">
                                <XCircle className="w-3.5 h-3.5 text-red-700 flex-shrink-0" />
                                <span>N.A.</span>
                              </span>
                            ) : row.ps.includes('Sob consulta') ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
                                <HelpCircle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                                <span>{row.ps}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                                <span>{row.ps}</span>
                              </span>
                            )}
                          </td>

                          {/* UTI */}
                          <td className="py-3.5 px-4 text-center">
                            {row.uti.includes('N.A.') ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-red-100 text-red-900 border border-red-300">
                                <XCircle className="w-3.5 h-3.5 text-red-700 flex-shrink-0" />
                                <span>N.A.</span>
                              </span>
                            ) : row.uti.includes('Sob consulta') ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
                                <HelpCircle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                                <span>{row.uti}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                                <span>{row.uti}</span>
                              </span>
                            )}
                          </td>

                          {/* UI (Unidade de Internação) */}
                          <td className="py-3.5 px-4 text-center">
                            {row.ui.includes('N.A.') ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-red-100 text-red-900 border border-red-300">
                                <XCircle className="w-3.5 h-3.5 text-red-700 flex-shrink-0" />
                                <span>N.A.</span>
                              </span>
                            ) : row.ui.includes('Sob consulta') ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
                                <HelpCircle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                                <span>{row.ui}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                                <span>{row.ui}</span>
                              </span>
                            )}
                          </td>

                          {/* Observações / Tipo de Conta */}
                          <td className="py-3.5 px-4">
                            {row.observacoes ? (
                              row.observacoes.includes('aberta') ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-purple-100 text-purple-900 border border-purple-300">
                                  <FileText className="w-3.5 h-3.5 text-purple-700 flex-shrink-0" />
                                  <span>{row.observacoes}</span>
                                </span>
                              ) : isSus ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-red-200 text-red-950 border border-red-400">
                                  <AlertTriangle className="w-3.5 h-3.5 text-red-800 flex-shrink-0" />
                                  <span>{row.observacoes}</span>
                                </span>
                              ) : (
                                <span className="text-slate-700 text-xs font-semibold">
                                  {row.observacoes}
                                </span>
                              )
                            ) : (
                              <span className="text-slate-300 text-xs italic">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dicionário Operacional & Legislação */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5">
              <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] block">
                O que é "Dentro do Pacote" (PS)?
              </span>
              <p className="text-slate-600 leading-relaxed font-medium m-0">
                Nos atendimentos de emergência no Pronto-Socorro com taxa de urgência em pacote (Bradesco, Geap, Sul América), a avaliação do neurologista é coberta pelo próprio hospital. Nenhuma taxa pode ser cobrada do paciente ou de sua família no guichê.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5">
              <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] block">
                O que significa "Conta Aberta"?
              </span>
              <p className="text-slate-600 leading-relaxed font-medium m-0">
                Para planos como Amil, Assefaz, Cassi e PlanAssiste, o parecer médico é faturado diretamente com o convênio durante o fechamento da conta hospitalar, através de Guia SP/SADT e relatório assinado com carimbo do especialista.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5">
              <span className="font-black text-red-900 uppercase tracking-wider text-[11px] block">
                Regra Legal do SUS (Alerta Vermelho)
              </span>
              <p className="text-slate-600 leading-relaxed font-medium m-0">
                Conforme a Lei Orgânica da Saúde (Lei nº 8.080/1990) e a Portaria GM/MS nº 2/2017, o atendimento pelo SUS é 100% gratuito. É vedada a cobrança de qualquer taxa, complemento ou honorário particular ao paciente ou responsável.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ABA 3: FLUXO OPERACIONAL EM 6 PASSOS
      ======================================================== */}
      {activeTab === 'fluxo' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 text-purple-950 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-900 text-white flex items-center justify-center font-black flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black m-0 text-purple-950">
                Procedimento Operacional Padrão (POP) • Interconsultas Médicas
              </h3>
              <p className="text-xs text-purple-900 leading-relaxed font-medium m-0 mt-1">
                Conheça a cadeia de responsabilidade entre o Médico Assistente, Enfermagem/NIR, Setor de Autorizações, Especialista Parecerista e Faturamento para garantir a excelência no atendimento e faturamento 100% livre de glosas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PARECER_WORKFLOW_STEPS.map(step => (
              <div
                key={step.step}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-purple-600 transition-all p-5 shadow-2xs flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-purple-900 text-white font-black text-sm flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      {step.step}º
                    </span>
                    <span className="text-[11px] font-black uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                      Passo {step.step} de 6
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-900 m-0 group-hover:text-purple-900 transition-colors">
                      {step.title}
                    </h4>
                    <span className="text-xs font-bold text-slate-500 block mt-0.5">
                      Responsável: <strong className="text-slate-700">{step.responsible}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed m-0">
                    {step.description}
                  </p>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      Ação Chave:
                    </span>
                    <p className="text-xs font-bold text-slate-800 m-0">
                      {step.keyAction}
                    </p>
                  </div>
                </div>

                {/* Alertas */}
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  {step.alerts.map((al, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-amber-900 font-medium">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{al}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          ABA 4: GUIA ANTI-GLOSA & CHECKLIST
      ======================================================== */}
      {activeTab === 'antiglosa' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 text-red-950 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black flex-shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black m-0 text-red-950">
                Os 5 Principais Motivos de Glosa em Pareceres Médicos
              </h3>
              <p className="text-xs text-red-900 leading-relaxed font-medium m-0 mt-1">
                Auditoria de Contas Hospitalares: Saiba exatamente o que a operadora de saúde audita e como blindar a conta do hospital contra recusas de pagamento.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ERROS_CRITICOS_GLOSA_PARECER.map((err, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 font-black text-xs flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 m-0">
                      {err.title}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium mt-1 m-0 leading-relaxed">
                      {err.desc}
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 space-y-1">
                  <span className="font-black text-emerald-800 uppercase tracking-wider text-[10px] block">
                    Como Prevenir (Ação Correta):
                  </span>
                  <p className="font-semibold text-emerald-900 m-0 leading-snug">
                    {err.prevention}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL DE DETALHES COMPLETOS DO CONVÊNIO
      ======================================================== */}
      {detailModalConvenio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-900 text-white font-black flex items-center justify-center">
                  {detailModalConvenio.badge}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 m-0">
                    {detailModalConvenio.convenioName}
                  </h3>
                  <span className="text-xs font-bold text-slate-400">
                    Categoria: {detailModalConvenio.category}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalConvenio(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Códigos TUSS */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <span className="text-[10px] font-black uppercase text-purple-700 block">
                  Código TUSS Pronto-Socorro:
                </span>
                <span className="text-lg font-mono font-black text-purple-950">
                  {detailModalConvenio.tussPs}
                </span>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                <span className="text-[10px] font-black uppercase text-indigo-700 block">
                  Código TUSS Internação:
                </span>
                <span className="text-lg font-mono font-black text-indigo-950">
                  {detailModalConvenio.tussInternacao}
                </span>
              </div>
            </div>

            {/* Regra */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Regra Geral & Observações:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-200 m-0">
                {detailModalConvenio.regraGeral}
              </p>
            </div>

            {/* Documentos */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Documentos Obrigatórios:
              </span>
              <ul className="text-xs text-slate-700 space-y-1 m-0 pl-4 list-disc font-medium">
                {detailModalConvenio.documentosObrigatorios.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

            {/* Alertas Críticos */}
            {detailModalConvenio.alertasCriticos.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                  Alertas Críticos Anti-Glosa:
                </span>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
                  {detailModalConvenio.alertasCriticos.map((al, i) => (
                    <div key={i} className="text-xs text-amber-900 font-medium">
                      ⚠️ {al}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setDetailModalConvenio(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
