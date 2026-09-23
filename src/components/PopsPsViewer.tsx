import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  Phone, 
  Mail, 
  FileText, 
  ShieldCheck, 
  Info,
  ArrowRight,
  Ambulance,
  KeyRound,
  Stethoscope,
  TestTube2,
  ScanLine,
  ChevronLeft,
  Globe
} from 'lucide-react';
import { SERVIR_DATA, CONVENIOS_MASTER_LIST } from '../data/popsData';

interface PopsPsViewerProps {
  onOpenAiWithPrompt?: (prompt: string) => void;
  onGeneratePreGuia?: (convenio: string, code?: string, desc?: string) => void;
  initialPlanId?: string;
}

type PsSubTab = 'atendimento' | 'exames' | 'token' | 'contatos';

export const PopsPsViewer: React.FC<PopsPsViewerProps> = ({
  onOpenAiWithPrompt,
  onGeneratePreGuia,
  initialPlanId
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId || '');
  const [viewMode, setViewMode] = useState<'grid' | 'details'>(initialPlanId ? 'details' : 'grid');
  const [planSearch, setPlanSearch] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('Todos');
  const [activeSubTab, setActiveSubTab] = useState<PsSubTab>('atendimento');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    if (initialPlanId) {
      setSelectedPlanId(initialPlanId);
      setViewMode('details');
      setActiveSubTab('atendimento');
    }
  }, [initialPlanId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const planCategories = ['Todos', 'Autogestão', 'Seguradora', 'Privado', 'Militar', 'Estadual'];

  // Lista mestra completa de convênios do PS, deduplicada e ordenada estritamente de A a Z
  const fullPlansList = useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      category: string;
      badge: string;
      pacotePs: string;
      labUrgencia: string;
      imagemUrgencia: string;
    }>();

    CONVENIOS_MASTER_LIST.forEach(c => {
      map.set(c.id, {
        id: c.id,
        name: c.name,
        category: c.category,
        badge: c.badge,
        pacotePs: c.pacotePs,
        labUrgencia: c.labUrgencia,
        imagemUrgencia: c.imagemUrgencia
      });
    });

    if (!map.has('SERVIR')) {
      map.set('SERVIR', {
        id: 'SERVIR',
        name: 'SERVIR (Plano de Saúde TO)',
        category: 'Estadual',
        badge: 'SE',
        pacotePs: '10101037 (Pediatria) / 10101038 (Adulto)',
        labUrgencia: 'Incluso no pacote',
        imagemUrgencia: 'RX e RM Inclusos no Pacote'
      });
    }

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
    );
  }, []);

  const allPlansList = useMemo(() => {
    const filtered = fullPlansList.filter(p => {
      const matchCat = activeCategoryFilter === 'Todos' || 
        (activeCategoryFilter === 'Autogestão' && p.category.toLowerCase().includes('autogest')) ||
        (activeCategoryFilter === 'Militar' && p.category.toLowerCase().includes('militar')) ||
        p.category === activeCategoryFilter;
      const matchSearch = !planSearch ||
        p.name.toLowerCase().includes(planSearch.toLowerCase()) || 
        p.id.toLowerCase().includes(planSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(planSearch.toLowerCase());
      return matchCat && matchSearch;
    });

    return filtered.sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
    );
  }, [fullPlansList, planSearch, activeCategoryFilter]);

  const activeConvenioObj = useMemo(() => {
    if (selectedPlanId === 'SERVIR') return null;
    return CONVENIOS_MASTER_LIST.find(c => c.id === selectedPlanId) || null;
  }, [selectedPlanId]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setViewMode('details');
    setActiveSubTab('atendimento');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGrid = () => {
    setViewMode('grid');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==========================================
  // VIEW 1: SELEÇÃO DE CONVÊNIOS (GRID / ABAS)
  // ==========================================
  if (viewMode === 'grid') {
    return (
      <div className="space-y-6">
        {/* Header Banner - Medical Kora Saúde Teal and Clean White */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#0E7B86] bg-[#EBF7F8] border border-[#C4E5E8] px-3 py-1 rounded-full flex items-center gap-1.5">
                <Ambulance className="w-3.5 h-3.5 text-[#0E7B86]" />
                POPs • Pronto-Socorro & Urgência
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Hospital Palmas Medical</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0E7B86] m-0">
              Escolha o Convênio do Paciente
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed m-0">
              Clique no convênio para abrir a página exclusiva com todas as regras de pronto-socorro, pacotes de atendimento, exames liberados na urgência e validação de token.
            </p>
          </div>

          {/* Filter pills & search */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {planCategories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeCategoryFilter === cat
                      ? 'bg-[#B01B52] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-[#EBF7F8] text-slate-600 hover:text-[#0E7B86]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Buscar convênio (ex: Amil, Bradesco)..."
                value={planSearch}
                onChange={e => setPlanSearch(e.target.value)}
                className="w-full pl-9.5 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0E7B86] focus:bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Counter of available plans */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Convênios Disponíveis ({allPlansList.length})
          </span>
          <span className="text-xs text-slate-500">
            Clique em qualquer cartão para ver os detalhes
          </span>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allPlansList.map(plan => (
            <button
              key={plan.id}
              type="button"
              onClick={() => handleSelectPlan(plan.id)}
              className="w-full text-left bg-white border border-slate-200 hover:border-[#B01B52] hover:shadow-md rounded-2xl p-5 transition-all duration-150 cursor-pointer group flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0E7B86] text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-xs tracking-wider">
                    {plan.badge}
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#FDF2F6] text-[#B01B52] border border-[#F7D0DF] transition-colors">
                    {plan.category}
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-slate-900 text-base tracking-tight leading-snug group-hover:text-[#B01B52] transition-colors m-0 break-words">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 m-0">
                    Regras e procedimentos operacionais de PS
                  </p>
                </div>
              </div>

              {/* Bottom indicator */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-[#B01B52] group-hover:underline flex items-center gap-1">
                  Acessar POP do Plano
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Urgência</span>
              </div>
            </button>
          ))}
        </div>

        {allPlansList.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <Info className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700 m-0">Nenhum convênio encontrado com esse termo.</p>
            <button
              type="button"
              onClick={() => { setPlanSearch(''); setActiveCategoryFilter('Todos'); }}
              className="text-xs font-bold text-[#B01B52] hover:underline cursor-pointer"
            >
              Limpar filtros e exibir todos
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: PÁGINA EXCLUSIVA DO CONVÊNIO ESCOLHIDO
  // ==========================================
  const planDisplayName = activeConvenioObj?.name || (selectedPlanId === 'SERVIR' ? 'SERVIR (Plano de Saúde TO)' : selectedPlanId);
  const planCategory = activeConvenioObj?.category || 'Estadual';
  const planBadge = activeConvenioObj?.badge || (selectedPlanId === 'SERVIR' ? 'SE' : selectedPlanId.slice(0, 2));

  return (
    <div className="space-y-6">
      {/* Top Navigation Strip with Back Button & Quick Plan Selector */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleBackToGrid}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EBF7F8] hover:bg-[#D8ECEE] text-[#0E7B86] font-bold text-xs transition-all cursor-pointer w-fit"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>← Voltar para a lista de convênios</span>
        </button>

        {/* Quick Switch Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden md:inline">Trocar Convênio:</span>
          <select
            value={selectedPlanId}
            onChange={e => handleSelectPlan(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0E7B86] cursor-pointer"
          >
            {fullPlansList.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dedicated Plan Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0E7B86] text-white font-black text-lg flex items-center justify-center flex-shrink-0 shadow-sm tracking-wider">
              {planBadge}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight m-0 break-words">
                  {planDisplayName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#FDF2F6] text-[#B01B52] border border-[#F7D0DF]">
                  {planCategory}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium m-0">
                Procedimento Operacional Padrão de Pronto-Socorro • Hospital Palmas Medical
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenAiWithPrompt && (
              <button
                type="button"
                onClick={() => onOpenAiWithPrompt(`Como funciona o atendimento de Pronto-Socorro no convênio ${planDisplayName}? Quais os códigos de pacote de consulta, exames de urgência liberados e regras de token?`)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B01B52] hover:bg-[#971444] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Auditar com IA</span>
              </button>
            )}

            {activeConvenioObj?.portalUrl && (
              <a
                href={activeConvenioObj.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E7B86] hover:bg-[#095962] text-white font-bold text-xs shadow-xs transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Portal da Operadora</span>
              </a>
            )}
          </div>
        </div>

        {/* 3 Quick Overview Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <div className="bg-[#F8FAFB] rounded-xl p-3 border border-slate-200/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EBF7F8] text-[#0E7B86] flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Pacote PS / Consulta</span>
              <span className="text-xs font-black text-slate-800 block break-words mt-0.5">
                {selectedPlanId === 'SERVIR' ? '10101037 / 10101038' : (activeConvenioObj?.pacotePs || '10101039')}
              </span>
            </div>
          </div>

          <div className="bg-[#F8FAFB] rounded-xl p-3 border border-slate-200/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FDF2F6] text-[#B01B52] flex items-center justify-center flex-shrink-0">
              <TestTube2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Laboratório de Urgência</span>
              <span className="text-xs font-black text-slate-800 block break-words mt-0.5">
                {selectedPlanId === 'SERVIR' ? 'Incluso no Pacote' : (activeConvenioObj?.labUrgencia || 'Conforme POP')}
              </span>
            </div>
          </div>

          <div className="bg-[#F8FAFB] rounded-xl p-3 border border-slate-200/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EBF7F8] text-[#0E7B86] flex items-center justify-center flex-shrink-0">
              <ScanLine className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Radiologia & Imagem</span>
              <span className="text-xs font-black text-slate-800 block break-words mt-0.5">
                {selectedPlanId === 'SERVIR' ? 'RX e RM Inclusos no Pacote' : (activeConvenioObj?.imagemUrgencia || 'Solicitar Autorização')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Especial CASSI e ORIZON no PS */}
      {selectedPlanId === 'CASSI' && (
        <div className="bg-[#EBF7F8] border-2 border-[#0E7B86] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0E7B86] text-white flex items-center justify-center font-black text-sm">
                !
              </div>
              <div>
                <h3 className="text-base font-black text-[#095962] m-0">
                  PORTAL DA CASSI É O ORIZON • PRONTO-SOCORRO &amp; INTERNAÇÃO
                </h3>
                <p className="text-xs text-slate-600 m-0 font-medium">
                  Tanto no Pronto-Socorro como na Internação, utilize o autenticador Orizon (Polimed) para elegibilidade, consultas e exames.
                </p>
              </div>
            </div>

            <a
              href="https://www.polimed.com.br/autenticadorOrizon/loginAutenticador"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0E7B86] hover:bg-[#095962] text-white rounded-xl text-xs font-bold transition-all shadow-xs w-fit"
            >
              <span>Abrir Portal Orizon</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-white/90 border border-[#C4E5E8] rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-400 block text-[10px] uppercase">Código Prestador</span>
              <span className="font-mono font-black text-slate-900 text-sm">2120820</span>
            </div>
            <div>
              <span className="font-bold text-slate-400 block text-[10px] uppercase">Usuário Medical (CNPJ)</span>
              <span className="font-mono font-black text-slate-900 text-sm">12955953000192</span>
            </div>
            <div>
              <span className="font-bold text-slate-400 block text-[10px] uppercase">Senha Medical</span>
              <span className="font-mono font-black text-[#B01B52] text-sm">Hpm2025hpm@</span>
            </div>
          </div>
        </div>
      )}

      {/* Banner Especial SERVIR no PS */}
      {selectedPlanId === 'SERVIR' && (
        <div className="bg-[#FDF2F6] border-2 border-[#B01B52] rounded-2xl p-5 shadow-sm space-y-2.5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#B01B52] text-white flex items-center justify-center font-black text-sm flex-shrink-0 mt-0.5">
              !
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-black text-[#87143E] m-0">
                REGRA DE EXAMES NO PRONTO-SOCORRO: RX E RM INCLUSOS NO PACOTE
              </h3>
              <p className="text-xs sm:text-sm text-slate-800 m-0 font-medium leading-relaxed">
                No SERVIR <strong>NÃO precisa pegar autorização para RX e RM</strong> pois o pacote já está incluso.
              </p>
              <p className="text-xs sm:text-sm text-[#B01B52] m-0 font-black leading-relaxed">
                ⚠️ OBRIGATÓRIO: PEGAR ASSINATURA NA GUIA E COLOCAR A CAPA JUNTOS.
              </p>
              <p className="text-[11px] text-slate-500 m-0 font-medium">
                * Esta orientação aplica-se exclusivamente ao POPS de Pronto-Socorro.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TABS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        {/* Horizontal Navigation Tab Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50/60 overflow-x-auto">
          {[
            { id: 'atendimento' as PsSubTab, label: 'Pacote & Atendimento PS', icon: Stethoscope },
            { id: 'exames' as PsSubTab, label: 'Exames Liberados na Urgência', icon: TestTube2 },
            { id: 'token' as PsSubTab, label: 'Validação de Token & Elegibilidade', icon: KeyRound },
            { id: 'contatos' as PsSubTab, label: 'Portal, Acessos & Contatos', icon: Globe }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-xs font-black transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#B01B52] text-[#B01B52] bg-white shadow-2xs'
                    : 'border-transparent text-slate-500 hover:text-[#0E7B86] hover:bg-[#EBF7F8]/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#B01B52]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="p-6 space-y-6">

          {/* ========================================================= */}
          {/* ABA 1: PACOTE & ATENDIMENTO PS */}
          {/* ========================================================= */}
          {activeSubTab === 'atendimento' && (
            <div className="space-y-6">
              {activeConvenioObj?.criticalNotes && activeConvenioObj.criticalNotes.length > 0 && (
                <div className="bg-[#FDF2F6] border border-[#F7D0DF] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[#B01B52] font-black text-sm">
                    <AlertTriangle className="w-5 h-5 text-[#B01B52] flex-shrink-0" />
                    <span>Avisos Críticos de Atendimento • {planDisplayName}</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-800 font-medium pl-1 m-0 leading-relaxed">
                    {activeConvenioObj.criticalNotes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-2 break-words">
                        <span className="text-[#B01B52] font-black flex-shrink-0">•</span>
                        <span className="leading-relaxed">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Case 1: SERVIR */}
              {selectedPlanId === 'SERVIR' ? (
                <div className="space-y-5">
                  {SERVIR_DATA['Pronto-Socorro']?.map((block, bIdx) => (
                    <div key={bIdx} className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 m-0">
                          <span className="text-[#0E7B86] font-bold">{block.icon || '•'}</span>
                          <span>{block.title}</span>
                        </h3>
                        {block.warning && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase bg-[#FDF2F6] text-[#B01B52] border border-[#F7D0DF]">
                            Atenção
                          </span>
                        )}
                      </div>

                      {block.info && (
                        <p className="text-xs sm:text-sm text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200/80 m-0 leading-relaxed">
                          {block.info}
                        </p>
                      )}

                      {block.alerts && block.alerts.length > 0 && (
                        <div className="bg-[#FDF2F6] border border-[#F7D0DF] rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 space-y-1.5">
                          {block.alerts.map((al, aIdx) => (
                            <div key={aIdx} className="flex items-start gap-2 break-words">
                              <Info className="w-4 h-4 text-[#B01B52] mt-0.5 flex-shrink-0" />
                              <span className="leading-relaxed font-medium">{al}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {block.rows && block.rows.length > 0 && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs sm:text-sm border-collapse">
                            <thead>
                              <tr className="border-b border-slate-200 text-slate-400 font-bold">
                                <th className="py-2.5 px-3 w-36">Código TUSS</th>
                                <th className="py-2.5 px-3">Descrição do Procedimento</th>
                                <th className="py-2.5 px-3 text-right w-36">Ações</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 font-medium">
                              {block.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-white transition-colors">
                                  <td className="py-3 px-3 font-mono font-bold text-[#0E7B86] whitespace-nowrap">
                                    {row[0]}
                                  </td>
                                  <td className="py-3 px-3 text-slate-800 break-words leading-relaxed">
                                    {row[1]}
                                  </td>
                                  <td className="py-3 px-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() => copyToClipboard(row[0])}
                                        className="p-2 rounded-xl bg-slate-100 hover:bg-[#EBF7F8] text-slate-700 hover:text-[#0E7B86] transition-colors cursor-pointer"
                                        title="Copiar Código"
                                      >
                                        {copiedText === row[0] ? <Check className="w-4 h-4 text-[#0E7B86]" /> : <Copy className="w-4 h-4" />}
                                      </button>
                                      {onGeneratePreGuia && (
                                        <button
                                          type="button"
                                          onClick={() => onGeneratePreGuia('SERVIR', row[0], row[1])}
                                          className="px-2.5 py-1.5 rounded-xl bg-[#FDF2F6] hover:bg-[#FCE7EF] text-[#B01B52] font-bold text-xs transition-colors cursor-pointer"
                                        >
                                          Pré-Guia
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Case 2: Other Convenios */
                <div className="space-y-6">
                  <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                    <h3 className="font-extrabold text-base text-slate-900 m-0">
                      Fluxo de Acolhimento & Triagem no Pronto-Socorro
                    </h3>

                    {activeConvenioObj?.sections?.ps?.steps && activeConvenioObj.sections.ps.steps.length > 0 && (
                      <div className="space-y-3">
                        <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider block">
                          Passo a Passo Operacional:
                        </span>
                        <div className="space-y-2.5">
                          {activeConvenioObj.sections.ps.steps.map((step, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-3.5 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                              <div className="w-7 h-7 rounded-full bg-[#0E7B86] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                {sIdx + 1}
                              </div>
                              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium m-0 flex-1 break-words">
                                {step}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeConvenioObj?.sections?.ps?.textItems && activeConvenioObj.sections.ps.textItems.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <span className="text-xs font-extrabold uppercase text-[#0E7B86] tracking-wider block">
                          Diretrizes de Atendimento:
                        </span>
                        <div className="space-y-2">
                          {activeConvenioObj.sections.ps.textItems.map((item, tIdx) => (
                            <div key={tIdx} className="flex items-start gap-2.5 bg-[#EBF7F8]/60 p-3.5 rounded-xl border border-[#C4E5E8] text-xs sm:text-sm text-slate-800 font-medium">
                              <CheckCircle2 className="w-4 h-4 text-[#0E7B86] flex-shrink-0 mt-0.5" />
                              <span className="break-words leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeConvenioObj?.sections?.ps?.codes && activeConvenioObj.sections.ps.codes.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider block">
                          Códigos de Consulta e Procedimentos:
                        </span>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs sm:text-sm border-collapse bg-white rounded-xl overflow-hidden border border-slate-200">
                            <thead>
                              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold">
                                <th className="py-2.5 px-3.5 w-36">Código TUSS</th>
                                <th className="py-2.5 px-3.5">Descrição</th>
                                <th className="py-2.5 px-3.5 text-right w-36">Ações</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 font-medium">
                              {activeConvenioObj.sections.ps.codes.map((c, cIdx) => (
                                <tr key={cIdx} className="hover:bg-slate-50 transition-colors">
                                  <td className="py-3 px-3.5 font-mono font-bold text-[#0E7B86] whitespace-nowrap">
                                    {c.code}
                                  </td>
                                  <td className="py-3 px-3.5 text-slate-800 break-words leading-relaxed">
                                    {c.label}
                                  </td>
                                  <td className="py-3 px-3.5 text-right">
                                    <button
                                      type="button"
                                      onClick={() => copyToClipboard(c.code)}
                                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#EBF7F8] text-slate-700 hover:text-[#0E7B86] transition-colors cursor-pointer"
                                      title="Copiar Código"
                                    >
                                      {copiedText === c.code ? <Check className="w-4 h-4 text-[#0E7B86]" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* ABA 2: EXAMES LIBERADOS NA URGÊNCIA */}
          {/* ========================================================= */}
          {activeSubTab === 'exames' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-extrabold text-base text-slate-900 m-0">
                    Diretrizes de Exames de Urgência no Pronto-Socorro
                  </h3>
                  <span className="text-xs font-bold text-[#0E7B86] bg-[#EBF7F8] border border-[#C4E5E8] px-2.5 py-1 rounded-lg">
                    {planDisplayName}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-xs font-bold uppercase text-[#0E7B86]">Exames Laboratoriais</span>
                    <p className="text-sm font-black text-slate-800 m-0">
                      {selectedPlanId === 'SERVIR' ? 'Incluso no Pacote PS' : (activeConvenioObj?.labUrgencia || 'Autorização no Portal')}
                    </p>
                    <p className="text-xs text-slate-500 m-0 leading-relaxed">
                      Hemograma, PCR, Gasometria, Troponina, Ureia, Creatinina, Eletrólitos e EAS.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold uppercase text-[#B01B52]">Exames de Imagem</span>
                    <p className="text-sm font-black text-slate-800 m-0">
                      {selectedPlanId === 'SERVIR' ? 'RX e RM Inclusos no Pacote (Sem autorização)' : (activeConvenioObj?.imagemUrgencia || 'Solicitar Autorização')}
                    </p>
                    <p className="text-xs text-slate-600 m-0 leading-relaxed font-medium">
                      {selectedPlanId === 'SERVIR'
                        ? 'Não precisa pegar autorização para RX e RM pois o pacote está incluso. Pegar assinatura na guia e colocar a capa juntos.'
                        : 'Radiografias simples e Tomografias de urgência conforme laudo do médico assistente.'}
                    </p>
                    {selectedPlanId === 'SERVIR' && (
                      <div className="mt-1 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs font-black text-[#B01B52]">
                        <span>⚠️ Obrigatório: Pegar assinatura na guia e anexar a capa juntos.</span>
                      </div>
                    )}
                  </div>
                </div>

                {activeConvenioObj?.sections?.exames?.steps && activeConvenioObj.sections.exames.steps.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider block">
                      Passo a Passo para Solicitação de Exames:
                    </span>
                    <div className="space-y-2.5">
                      {activeConvenioObj.sections.exames.steps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-3.5 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                          <div className="w-7 h-7 rounded-full bg-[#0E7B86] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            {sIdx + 1}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium m-0 flex-1 break-words">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeConvenioObj?.sections?.exames?.codes && activeConvenioObj.sections.exames.codes.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider block">
                      Tabela de Códigos de Exames de Urgência:
                    </span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm border-collapse bg-white rounded-xl overflow-hidden border border-slate-200">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold">
                            <th className="py-2.5 px-3.5 w-36">Código TUSS</th>
                            <th className="py-2.5 px-3.5">Descrição do Procedimento</th>
                            <th className="py-2.5 px-3.5 text-right w-36">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-medium">
                          {activeConvenioObj.sections.exames.codes.map((c, cIdx) => (
                            <tr key={cIdx} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3 px-3.5 font-mono font-bold text-[#0E7B86] whitespace-nowrap">
                                {c.code}
                              </td>
                              <td className="py-3 px-3.5 text-slate-800 break-words leading-relaxed">
                                {c.label}
                              </td>
                              <td className="py-3 px-3.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(c.code)}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#EBF7F8] text-slate-700 hover:text-[#0E7B86] transition-colors cursor-pointer"
                                    title="Copiar Código"
                                  >
                                    {copiedText === c.code ? <Check className="w-4 h-4 text-[#0E7B86]" /> : <Copy className="w-4 h-4" />}
                                  </button>
                                  {onGeneratePreGuia && (
                                    <button
                                      type="button"
                                      onClick={() => onGeneratePreGuia(planDisplayName, c.code, c.label)}
                                      className="px-2.5 py-1.5 rounded-xl bg-[#FDF2F6] hover:bg-[#FCE7EF] text-[#B01B52] font-bold text-xs transition-colors cursor-pointer"
                                    >
                                      Pré-Guia
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ABA 3: VALIDAÇÃO DE TOKEN & ELEGIBILIDADE */}
          {/* ========================================================= */}
          {activeSubTab === 'token' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-extrabold text-base text-slate-900 m-0">
                    Regras de Elegibilidade, Token e Biometria
                  </h3>
                  <span className="text-xs font-bold text-[#0E7B86] bg-[#EBF7F8] border border-[#C4E5E8] px-2.5 py-1 rounded-lg">
                    {planDisplayName}
                  </span>
                </div>

                <div className="bg-[#EBF7F8] border border-[#C4E5E8] rounded-xl p-4 flex items-start gap-3">
                  <KeyRound className="w-5 h-5 text-[#0E7B86] mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-[#0E7B86] m-0">Atenção ao Token do Beneficiário</h4>
                    <p className="text-xs sm:text-sm text-slate-800 m-0 leading-relaxed">
                      Caso o plano exija validação por token, o código de 6 dígitos deve ser gerado pelo paciente no aplicativo móvel da operadora no momento do acolhimento. A ausência de validação de token acarreta glosa imediata do atendimento.
                    </p>
                  </div>
                </div>

                {activeConvenioObj?.sections?.elegibilidade?.steps && activeConvenioObj.sections.elegibilidade.steps.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider block">
                      Passo a Passo no Portal da Operadora:
                    </span>
                    <div className="space-y-2.5">
                      {activeConvenioObj.sections.elegibilidade.steps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-3.5 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                          <div className="w-7 h-7 rounded-full bg-[#0E7B86] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            {sIdx + 1}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium m-0 flex-1 break-words">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
                  <FileText className="w-5 h-5 text-[#B01B52] mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider m-0">
                      Obrigatoriedade de Assinatura na Guia Física
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 m-0 leading-relaxed">
                      Imprimir a Guia TISS após a liberação do atendimento e colher obrigatoriamente a assinatura do paciente ou responsável legal no campo 57. Anexar ao prontuário médico para envio ao faturamento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ABA 4: PORTAL, ACESSOS & CONTATOS */}
          {/* ========================================================= */}
          {activeSubTab === 'contatos' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#0E7B86]" />
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 m-0">
                      Acessos ao Portal Autorizador
                    </h3>
                  </div>

                  {activeConvenioObj?.accessCredentials && activeConvenioObj.accessCredentials.length > 0 ? (
                    <div className="space-y-2.5">
                      {activeConvenioObj.accessCredentials.map((cred, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm gap-2">
                          <span className="font-bold text-slate-500">{cred[0]}:</span>
                          <div className="flex items-center gap-2 font-mono font-bold text-slate-900 break-all">
                            {cred[1].startsWith('http') ? (
                              <a
                                href={cred[1]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0E7B86] hover:underline flex items-center gap-1 font-sans text-xs font-bold"
                              >
                                <span>Acessar Portal</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <span>{cred[1]}</span>
                            )}
                            {!cred[1].startsWith('http') && (
                              <button
                                type="button"
                                onClick={() => copyToClipboard(cred[1])}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#EBF7F8] text-slate-600 transition-colors cursor-pointer"
                                title="Copiar"
                              >
                                {copiedText === cred[1] ? <Check className="w-3.5 h-3.5 text-[#0E7B86]" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
                      Consulte o setor de Faturamento ou TI para as credenciais institucionais deste convênio.
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#B01B52]" />
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 m-0">
                      Contatos & Telefones de Suporte
                    </h3>
                  </div>

                  {activeConvenioObj?.contacts && activeConvenioObj.contacts.length > 0 ? (
                    <div className="space-y-2.5">
                      {activeConvenioObj.contacts.map((contact, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm gap-2">
                          <div className="flex items-center gap-2.5 text-slate-800 font-medium break-all">
                            {contact.includes('@') ? (
                              <Mail className="w-4 h-4 text-[#0E7B86] flex-shrink-0" />
                            ) : (
                              <Phone className="w-4 h-4 text-[#B01B52] flex-shrink-0" />
                            )}
                            <span className="leading-relaxed">{contact}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(contact)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#EBF7F8] text-slate-600 transition-colors flex-shrink-0 cursor-pointer"
                            title="Copiar Contato"
                          >
                            {copiedText === contact ? <Check className="w-3.5 h-3.5 text-[#0E7B86]" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
                      Consulte a lista geral de ramais ou o setor de auditoria do hospital.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
