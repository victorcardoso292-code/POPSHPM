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
  Bed,
  Activity,
  Scissors,
  Calendar,
  ChevronLeft,
  Globe
} from 'lucide-react';
import { SERVIR_DATA, CONVENIOS_MASTER_LIST } from '../data/popsData';
import { TABELA_DIARIAS_DATA, ALL_DIARIAS_ITEMS, DiariaItem, ConvenioDiariasRules } from '../data/diariasData';

interface PopsInternacaoViewerProps {
  onOpenAiWithPrompt?: (prompt: string) => void;
  onGeneratePreGuia?: (convenio: string, code?: string, desc?: string) => void;
  initialPlanId?: string;
}

type InternacaoSubTab = 'clinica' | 'uti' | 'cirurgias' | 'contatos';

export const PopsInternacaoViewer: React.FC<PopsInternacaoViewerProps> = ({
  onOpenAiWithPrompt,
  onGeneratePreGuia,
  initialPlanId
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId || '');
  const [viewMode, setViewMode] = useState<'grid' | 'details'>(initialPlanId ? 'details' : 'grid');
  const [planSearch, setPlanSearch] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('Todos');
  const [activeSubTab, setActiveSubTab] = useState<InternacaoSubTab>('clinica');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    if (initialPlanId) {
      setSelectedPlanId(initialPlanId);
      setViewMode('details');
      setActiveSubTab('clinica');
    }
  }, [initialPlanId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const planCategories = ['Todos', 'Autogestão', 'Seguradora', 'Privado', 'Militar', 'Estadual'];

  const planDiariasRules = useMemo(() => {
    if (!selectedPlanId) return null;
    const norm = selectedPlanId.toUpperCase().trim();
    return TABELA_DIARIAS_DATA.find(r => 
      r.convenioId.toUpperCase() === norm ||
      r.convenioName.toUpperCase() === norm ||
      (norm === 'CAPESESP' && r.convenioId === 'CAPESAUDE') ||
      (norm === 'PETROBRAS' && r.convenioId === 'PETROBRAS') ||
      (norm === 'BRADESCO' && r.convenioId === 'BRADESCO') ||
      (norm === 'SERVIR' && r.convenioId === 'SERVIR') ||
      (norm.includes('CAIXA') && r.convenioId === 'SAÚDE CAIXA') ||
      (norm.includes('TOCANTINS') && r.convenioId === 'PRO TOCANTINS') ||
      (norm.includes('SOCIAL') && r.convenioId === 'PRO SOCIAL') ||
      (norm.includes('POSTAL') && r.convenioId === 'POSTAL SAÚDE') ||
      (norm.includes('GAMA') && r.convenioId === 'GAMASAÚDE') ||
      (norm.includes('BEST') && r.convenioId === 'BEST SAÚDE') ||
      (norm.includes('UNIMED') && r.convenioId === 'UNIMED') ||
      (norm.includes('CAMED') && r.convenioId === 'CAMED') ||
      (norm.includes('MEDISERVICE') && r.convenioId === 'MEDISERVICE') ||
      (norm.includes('ASSEFAZ') && r.convenioId === 'ASSEFAZ') ||
      (norm.includes('CASSI') && r.convenioId === 'CASSI') ||
      (norm.includes('GEAP') && r.convenioId === 'GEAP') ||
      (norm.includes('CONAB') && r.convenioId === 'CONAB') ||
      (norm.includes('TRE') && r.convenioId === 'TRE') ||
      (norm.includes('E-VIDA') && r.convenioId === 'E-VIDA') ||
      (norm.includes('FUSEX') && r.convenioId === 'FUSEX')
    ) || null;
  }, [selectedPlanId]);

  // Helper para identificar leitos e diárias de UTI
  const isUtiItem = (item: DiariaItem) => {
    const normTipo = item.tipo.toUpperCase();
    const normAcomodacao = item.acomodacao.toUpperCase();
    return (
      normTipo === 'UTI' ||
      normAcomodacao.includes('UTI') ||
      normAcomodacao.includes('CORONARIANA') ||
      normAcomodacao.includes('INTENSIV')
    );
  };

  // Diárias exclusivas de Internação Clínica (Apartamento, Enfermaria, Berçário, Hospital Dia)
  const clinicaDiarias = useMemo(() => {
    if (!planDiariasRules) return [];
    return planDiariasRules.itens.filter(i => !isUtiItem(i));
  }, [planDiariasRules]);

  // Diárias exclusivas de UTI & Cuidados Intensivos
  const utiDiarias = useMemo(() => {
    if (!planDiariasRules) return [];
    return planDiariasRules.itens.filter(i => isUtiItem(i));
  }, [planDiariasRules]);

  const allPlansList = useMemo(() => {
    const plans: { id: string; name: string; category: string; badge: string }[] = [
      ...CONVENIOS_MASTER_LIST.map(c => ({
        id: c.id,
        name: c.name,
        category: c.category,
        badge: c.badge
      })),
      { 
        id: 'SERVIR', 
        name: 'SERVIR (Plano de Saúde TO)', 
        category: 'Estadual', 
        badge: 'SE' 
      }
    ];

    // Inclui convênios da tabela de diárias não mapeados na lista base
    TABELA_DIARIAS_DATA.forEach(d => {
      const exists = plans.some(p => 
        p.id.toUpperCase() === d.convenioId.toUpperCase() ||
        (p.id === 'CAPESESP' && d.convenioId === 'CAPESAUDE') ||
        (p.id === 'SAÚDE CAIXA' && d.convenioId === 'SAÚDE CAIXA') ||
        (p.id === 'PRO TOCANTINS' && d.convenioId === 'PRO TOCANTINS') ||
        (p.id === 'PRO SOCIAL' && d.convenioId === 'PRO SOCIAL') ||
        (p.id === 'POSTAL SAÚDE' && d.convenioId === 'POSTAL SAÚDE') ||
        (p.id === 'GAMASAÚDE' && d.convenioId === 'GAMASAÚDE')
      );
      if (!exists) {
        plans.push({
          id: d.convenioId,
          name: d.convenioName,
          category: d.category,
          badge: d.badge
        });
      }
    });

    return plans.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filteredPlans = useMemo(() => {
    return allPlansList.filter(p => {
      const matchCat = activeCategoryFilter === 'Todos' || 
        (activeCategoryFilter === 'Autogestão' && p.category.toLowerCase().includes('autogest')) ||
        (activeCategoryFilter === 'Militar' && p.category.toLowerCase().includes('militar')) ||
        p.category === activeCategoryFilter;
      const matchSearch = p.name.toLowerCase().includes(planSearch.toLowerCase()) || 
        p.id.toLowerCase().includes(planSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(planSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allPlansList, planSearch, activeCategoryFilter]);

  const activeConvenioObj = useMemo(() => {
    if (selectedPlanId === 'SERVIR') return null;
    return CONVENIOS_MASTER_LIST.find(c => c.id === selectedPlanId) || null;
  }, [selectedPlanId]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setViewMode('details');
    setActiveSubTab('clinica');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGrid = () => {
    setViewMode('grid');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==========================================
  // VIEW 1: SELEÇÃO DE CONVÊNIOS (GRID)
  // ==========================================
  if (viewMode === 'grid') {
    return (
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#B01B52] bg-[#FDF2F6] border border-[#F7D0DF] px-3 py-1 rounded-full flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#B01B52]" />
                POPs • Internação & UTI
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Hospital Palmas Medical</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0E7B86] m-0">
              Escolha o Convênio do Paciente Internado
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed m-0">
              Clique no convênio desejado para acessar os códigos de diárias, regras de acomodação (enfermaria/apartamento), pareceres médicos e leitos de UTI cadastrados na tabela oficial.
            </p>
          </div>

          {/* Filter pills & search */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
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

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Buscar convênio para internação..."
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
            Convênios Disponíveis para Internação ({filteredPlans.length})
          </span>
          <span className="text-xs text-slate-500">
            Clique no convênio para ver seus respectivos códigos e regras
          </span>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlans.map(plan => {
            const planRules = TABELA_DIARIAS_DATA.find(r => 
              r.convenioId.toUpperCase() === plan.id.toUpperCase() ||
              r.convenioName.toUpperCase() === plan.name.toUpperCase()
            );

            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => handleSelectPlan(plan.id)}
                className="w-full text-left bg-white border border-slate-200 hover:border-[#B01B52] hover:shadow-md rounded-2xl p-5 transition-all duration-150 cursor-pointer group flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#B01B52] text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-xs tracking-wider">
                      {plan.badge}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8] transition-colors">
                        {plan.category}
                      </span>
                      {planRules && (
                        <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                          {planRules.itens.length} diárias
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900 text-base tracking-tight leading-snug group-hover:text-[#B01B52] transition-colors m-0 break-words">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1 m-0">
                      Diárias clínicas, acomodação, pareceres e leitos de UTI
                    </p>
                  </div>

                  {planRules?.criticalRule && (
                    <div className="bg-[#FDF2F6] border border-[#F7D0DF] rounded-lg px-2.5 py-1 text-[11px] text-[#B01B52] font-black flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{planRules.criticalRule}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#B01B52] group-hover:underline flex items-center gap-1">
                    Ver Diárias & Regras do Plano
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Internação</span>
                </div>
              </button>
            );
          })}
        </div>

        {filteredPlans.length === 0 && (
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
  const planDisplayName = activeConvenioObj?.name || planDiariasRules?.convenioName || (selectedPlanId === 'SERVIR' ? 'SERVIR (Plano de Saúde TO)' : selectedPlanId);
  const planCategory = activeConvenioObj?.category || planDiariasRules?.category || 'Convênio';
  const planBadge = activeConvenioObj?.badge || planDiariasRules?.badge || (selectedPlanId === 'SERVIR' ? 'SE' : selectedPlanId.slice(0, 2));

  return (
    <div className="space-y-6">
      {/* Top Navigation Strip */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleBackToGrid}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EBF7F8] hover:bg-[#D8ECEE] text-[#0E7B86] font-bold text-xs transition-all cursor-pointer w-fit"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>← Voltar para a lista de convênios</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden md:inline">Trocar Convênio:</span>
          <select
            value={selectedPlanId}
            onChange={e => handleSelectPlan(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0E7B86] cursor-pointer"
          >
            {allPlansList.map(p => (
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
            <div className="w-14 h-14 rounded-2xl bg-[#B01B52] text-white font-black text-lg flex items-center justify-center flex-shrink-0 shadow-sm tracking-wider">
              {planBadge}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight m-0 break-words">
                  {planDisplayName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8]">
                  {planCategory}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium m-0">
                Procedimento Operacional Padrão de Internação & UTI • Hospital Palmas Medical
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenAiWithPrompt && (
              <button
                type="button"
                onClick={() => onOpenAiWithPrompt(`Como funciona a internação clínica, diárias de enfermaria/apartamento, UTI e autorização cirúrgica no convênio ${planDisplayName}?`)}
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
              <Bed className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Diária de Quarto / Leito</span>
              <span className="text-xs font-black text-slate-800 block break-words mt-0.5">
                Enfermaria ou Apartamento
              </span>
            </div>
          </div>

          <div className="bg-[#F8FAFB] rounded-xl p-3 border border-slate-200/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FDF2F6] text-[#B01B52] flex items-center justify-center flex-shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">UTI Adulto & Pediátrica</span>
              <span className="text-xs font-black text-slate-800 block break-words mt-0.5">
                Parecer Intensivista Obrigatório
              </span>
            </div>
          </div>

          <div className="bg-[#F8FAFB] rounded-xl p-3 border border-slate-200/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EBF7F8] text-[#0E7B86] flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Prorrogação de Diária</span>
              <span className="text-xs font-black text-slate-800 block break-words mt-0.5">
                Laudo Médico Atualizado (24h-48h)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SUB-TABS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        {/* Horizontal Navigation Tab Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50/60 overflow-x-auto">
          {[
            { 
              id: 'clinica' as InternacaoSubTab, 
              label: 'Internação Clínica (Enfermaria / Apto)', 
              badgeCount: clinicaDiarias.length,
              icon: Bed 
            },
            { 
              id: 'uti' as InternacaoSubTab, 
              label: 'UTI & Cuidados Intensivos', 
              badgeCount: utiDiarias.length,
              icon: Activity 
            },
            { 
              id: 'cirurgias' as InternacaoSubTab, 
              label: 'Cirurgias, OPME & Pré-Guia', 
              icon: Scissors 
            },
            { 
              id: 'contatos' as InternacaoSubTab, 
              label: 'Portal, Acessos & Contatos', 
              icon: Globe 
            }
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
                {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive 
                      ? 'bg-[#B01B52]/10 text-[#B01B52]' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tab.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="p-6 space-y-6">

          {/* ========================================================= */}
          {/* ABA 1: INTERNAÇÃO CLÍNICA & DIÁRIAS (SEM UTI) */}
          {/* ========================================================= */}
          {activeSubTab === 'clinica' && (
            <div className="space-y-6">
              {/* Critical warning if available from Convenio Object */}
              {activeConvenioObj?.criticalNotes && activeConvenioObj.criticalNotes.length > 0 && (
                <div className="bg-[#FDF2F6] border border-[#F7D0DF] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[#B01B52] font-black text-sm">
                    <AlertTriangle className="w-5 h-5 text-[#B01B52] flex-shrink-0" />
                    <span>Avisos Críticos de Internação • {planDisplayName}</span>
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

              {/* Official Diárias Table from Tabela Oficial (SOMENTE LEITOS CLÍNICOS) */}
              {planDiariasRules && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black uppercase tracking-wider text-[#0E7B86] bg-[#EBF7F8] px-2.5 py-0.5 rounded-full border border-[#C4E5E8] flex items-center gap-1.5">
                          <Bed className="w-3.5 h-3.5 text-[#0E7B86]" />
                          Diárias de Internação Clínica (Sem UTI)
                        </span>
                        <span className="text-xs text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
                          {clinicaDiarias.length} leitos clínicos
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">
                        Códigos TUSS de Enfermaria, Apartamento & Hospital Dia
                      </h3>
                    </div>

                    {planDiariasRules.criticalRule && !planDiariasRules.criticalRule.includes('UTI') && (
                      <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-1.5 text-xs text-rose-900 font-black flex items-center gap-2 max-w-md">
                        <AlertTriangle className="w-4 h-4 text-rose-700 flex-shrink-0" />
                        <span>{planDiariasRules.criticalRule}</span>
                      </div>
                    )}
                  </div>

                  {/* Banner de separação: aviso e atalho para leitos de UTI */}
                  {utiDiarias.length > 0 && (
                    <div className="bg-[#EBF7F8]/70 border border-[#C4E5E8] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#0E7B86] flex-shrink-0" />
                        <span className="text-xs text-slate-800 font-medium">
                          Este convênio possui <strong>{utiDiarias.length} diárias e pareceres de UTI</strong> separadas na aba exclusiva de UTI.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSubTab('uti');
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E7B86] hover:bg-[#0B6670] text-white text-xs font-black transition-colors cursor-pointer w-fit shadow-xs"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        <span>Ver Diárias de UTI ({utiDiarias.length}) →</span>
                      </button>
                    </div>
                  )}

                  {planDiariasRules.urgenciaRegra && (
                    <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-xs text-sky-900 font-bold flex items-center gap-2">
                      <Info className="w-4 h-4 text-sky-700 flex-shrink-0" />
                      <span>{planDiariasRules.urgenciaRegra}</span>
                    </div>
                  )}

                  {/* Diárias Clínicas Table */}
                  {clinicaDiarias.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100/90 text-slate-600 font-black border-b border-slate-200 uppercase tracking-wider text-[11px]">
                            <th className="py-3 px-3 min-w-[120px]">Código TUSS</th>
                            <th className="py-3 px-3 min-w-[190px]">Acomodação Clínica</th>
                            <th className="py-3 px-3 min-w-[130px]">Solicitar Junto</th>
                            <th className="py-3 px-3 min-w-[110px]">Parecer</th>
                            <th className="py-3 px-3 min-w-[130px]">Mat / Med</th>
                            <th className="py-3 px-3 min-w-[100px]">Ex. Lab</th>
                            <th className="py-3 px-3 min-w-[100px]">Ex. Rad</th>
                            <th className="py-3 px-3 min-w-[130px]">Fisio</th>
                            <th className="py-3 px-3 text-right min-w-[90px]">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/80 font-medium">
                          {clinicaDiarias.map((dItem, idx) => (
                            <tr key={idx} className="hover:bg-[#F0F8F9]/50 transition-colors">
                              <td className="py-3 px-3 align-top font-mono font-black text-slate-900">
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(dItem.code)}
                                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 hover:bg-[#EBF7F8] hover:text-[#0E7B86] border border-slate-200 text-xs font-mono font-black text-slate-800 transition-colors cursor-pointer group"
                                  title="Copiar código TUSS"
                                >
                                  <span>{dItem.code}</span>
                                  {copiedText === dItem.code ? <Check className="w-3 h-3 text-[#0E7B86]" /> : <Copy className="w-3 h-3 text-slate-400 group-hover:text-[#0E7B86]" />}
                                </button>
                              </td>
                              <td className="py-3 px-3 align-top">
                                <span className="font-bold text-slate-900 block leading-snug">{dItem.acomodacao}</span>
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8] rounded">
                                    {dItem.tipo}
                                  </span>
                                  {dItem.observacoes && (
                                    <span className="text-[11px] text-[#B01B52] font-semibold bg-[#FDF2F6] px-1.5 py-0.5 rounded border border-[#F7D0DF]">
                                      {dItem.observacoes}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-3 align-top">
                                {dItem.solicitarJunto ? (
                                  <span className="bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8] rounded-md px-2 py-0.5 font-mono font-bold text-[11px] inline-block">
                                    {dItem.solicitarJunto}
                                  </span>
                                ) : <span className="text-slate-300 font-medium">—</span>}
                              </td>
                              <td className="py-3 px-3 align-top">
                                {dItem.parecer ? (
                                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold inline-block ${
                                    dItem.parecer.toLowerCase().includes('não precisa')
                                      ? 'bg-slate-100 text-slate-600'
                                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                                  }`}>
                                    {dItem.parecer}
                                  </span>
                                ) : <span className="text-slate-300 font-medium">—</span>}
                              </td>
                              <td className="py-3 px-3 align-top text-[11px] text-slate-700">
                                {dItem.matMed || '—'}
                              </td>
                              <td className="py-3 px-3 align-top">
                                {dItem.exLab ? (
                                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold inline-block ${
                                    dItem.exLab.toLowerCase().includes('não') || dItem.exLab.toLowerCase().includes('incluso')
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                                  }`}>
                                    {dItem.exLab}
                                  </span>
                                ) : <span className="text-slate-300 font-medium">—</span>}
                              </td>
                              <td className="py-3 px-3 align-top">
                                {dItem.exRad ? (
                                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold inline-block ${
                                    dItem.exRad.toLowerCase().includes('não') || dItem.exRad.toLowerCase().includes('incluso')
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                                  }`}>
                                    {dItem.exRad}
                                  </span>
                                ) : <span className="text-slate-300 font-medium">—</span>}
                              </td>
                              <td className="py-3 px-3 align-top text-[11px] text-slate-700">
                                {dItem.fisioIntern || '—'}
                              </td>
                              <td className="py-3 px-3 align-top text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {onGeneratePreGuia && dItem.code !== 'TEXTO LIVRE' && !dItem.code.startsWith('OPÇÃO') && (
                                    <button
                                      type="button"
                                      onClick={() => onGeneratePreGuia(planDiariasRules.convenioId, dItem.code, dItem.acomodacao)}
                                      className="px-2 py-1 rounded-lg bg-[#FDF2F6] hover:bg-[#FCE7EF] text-[#B01B52] font-black text-[10px] transition-colors cursor-pointer"
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
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-xs text-slate-600">
                      Nenhuma diária clínica exclusiva cadastrada. Verifique a aba de UTI para leitos intensivos.
                    </div>
                  )}
                </div>
              )}

              {/* SERVIR Case (if SERVIR is selected, also keep its specific guide) */}
              {selectedPlanId === 'SERVIR' && SERVIR_DATA['Internação'] && (
                <div className="space-y-5">
                  {SERVIR_DATA['Internação'].map((block, bIdx) => (
                    <div key={bIdx} className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 m-0">
                          <span className="text-[#0E7B86] font-bold">{block.icon || '•'}</span>
                          <span>{block.title}</span>
                        </h3>
                        {block.warning && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase bg-[#FDF2F6] text-[#B01B52] border border-[#F7D0DF]">
                            Importante
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
                    </div>
                  ))}
                </div>
              )}

              {/* Convenio Steps & Guidelines */}
              {selectedPlanId !== 'SERVIR' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                    <h3 className="font-extrabold text-base text-slate-900 m-0">
                      Fluxo de Solicitação & Autorização de Internação
                    </h3>

                    {activeConvenioObj?.sections?.internacao?.steps && activeConvenioObj.sections.internacao.steps.length > 0 && (
                      <div className="space-y-3">
                        <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider block">
                          Passo a Passo no Portal Operacional:
                        </span>
                        <div className="space-y-2.5">
                          {activeConvenioObj.sections.internacao.steps.map((step, sIdx) => (
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

                    {activeConvenioObj?.sections?.internacao?.textItems && activeConvenioObj.sections.internacao.textItems.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <span className="text-xs font-extrabold uppercase text-[#0E7B86] tracking-wider block">
                          Diretrizes de Diárias & Acomodação:
                        </span>
                        <div className="space-y-2">
                          {activeConvenioObj.sections.internacao.textItems.map((item, tIdx) => (
                            <div key={tIdx} className="flex items-start gap-2.5 bg-[#EBF7F8]/60 p-3.5 rounded-xl border border-[#C4E5E8] text-xs sm:text-sm text-slate-800 font-medium">
                              <CheckCircle2 className="w-4 h-4 text-[#0E7B86] flex-shrink-0 mt-0.5" />
                              <span className="break-words leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* ABA 2: UTI & CUIDADOS INTENSIVOS (EXCLUSIVO UTI) */}
          {/* ========================================================= */}
          {activeSubTab === 'uti' && (
            <div className="space-y-6">
              {/* Official Diárias Table from Tabela Oficial (SOMENTE LEITOS DE UTI) */}
              {planDiariasRules && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black uppercase tracking-wider text-[#B01B52] bg-[#FDF2F6] px-2.5 py-0.5 rounded-full border border-[#F7D0DF] flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-[#B01B52]" />
                          Diárias de UTI & Cuidados Intensivos
                        </span>
                        <span className="text-xs text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
                          {utiDiarias.length} leitos de UTI mapeados
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">
                        Códigos TUSS de UTI (Adulto, Coronariana, Pediátrica & Isolamento)
                      </h3>
                    </div>

                    {planDiariasRules.criticalRule && (
                      <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-1.5 text-xs text-rose-900 font-black flex items-center gap-2 max-w-md">
                        <AlertTriangle className="w-4 h-4 text-rose-700 flex-shrink-0" />
                        <span>{planDiariasRules.criticalRule}</span>
                      </div>
                    )}
                  </div>

                  {/* Banner para voltar para diárias clínicas se necessário */}
                  {clinicaDiarias.length > 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4 text-slate-600 flex-shrink-0" />
                        <span className="text-xs text-slate-700 font-medium">
                          Para consultar leitos de enfermaria, apartamento ou berçário ({clinicaDiarias.length} leitos), acesse a aba de internação clínica.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSubTab('clinica');
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-black transition-colors cursor-pointer w-fit shadow-2xs"
                      >
                        <Bed className="w-3.5 h-3.5 text-[#0E7B86]" />
                        <span>← Ver Diárias Clínicas ({clinicaDiarias.length})</span>
                      </button>
                    </div>
                  )}

                  {/* Diárias de UTI Table */}
                  {utiDiarias.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100/90 text-slate-600 font-black border-b border-slate-200 uppercase tracking-wider text-[11px]">
                            <th className="py-3 px-3 min-w-[120px]">Código TUSS</th>
                            <th className="py-3 px-3 min-w-[190px]">Leito UTI / Acomodação</th>
                            <th className="py-3 px-3 min-w-[130px]">Solicitar Junto</th>
                            <th className="py-3 px-3 min-w-[110px]">Parecer</th>
                            <th className="py-3 px-3 min-w-[130px]">Mat / Med</th>
                            <th className="py-3 px-3 min-w-[100px]">Ex. Lab</th>
                            <th className="py-3 px-3 min-w-[100px]">Ex. Rad</th>
                            <th className="py-3 px-3 min-w-[130px]">Fisio</th>
                            <th className="py-3 px-3 text-right min-w-[90px]">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/80 font-medium">
                          {utiDiarias.map((uItem, idx) => (
                            <tr key={idx} className="hover:bg-[#FDF2F6]/40 transition-colors">
                              <td className="py-3 px-3 align-top font-mono font-black text-slate-900">
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(uItem.code)}
                                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 hover:bg-[#FDF2F6] hover:text-[#B01B52] border border-slate-200 text-xs font-mono font-black text-slate-800 transition-colors cursor-pointer group"
                                  title="Copiar código TUSS"
                                >
                                  <span>{uItem.code}</span>
                                  {copiedText === uItem.code ? <Check className="w-3 h-3 text-[#B01B52]" /> : <Copy className="w-3 h-3 text-slate-400 group-hover:text-[#B01B52]" />}
                                </button>
                              </td>
                              <td className="py-3 px-3 align-top">
                                <span className="font-bold text-slate-900 block leading-snug">{uItem.acomodacao}</span>
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#FDF2F6] text-[#B01B52] border border-[#F7D0DF] rounded">
                                    {uItem.tipo}
                                  </span>
                                  {uItem.observacoes && (
                                    <span className="text-[11px] text-[#B01B52] font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                                      {uItem.observacoes}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-3 align-top">
                                {uItem.solicitarJunto ? (
                                  <span className="bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8] rounded-md px-2 py-0.5 font-mono font-bold text-[11px] inline-block">
                                    {uItem.solicitarJunto}
                                  </span>
                                ) : <span className="text-slate-300 font-medium">—</span>}
                              </td>
                              <td className="py-3 px-3 align-top">
                                {uItem.parecer ? (
                                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold inline-block ${
                                    uItem.parecer.toLowerCase().includes('não precisa')
                                      ? 'bg-slate-100 text-slate-600'
                                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                                  }`}>
                                    {uItem.parecer}
                                  </span>
                                ) : <span className="text-slate-300 font-medium">—</span>}
                              </td>
                              <td className="py-3 px-3 align-top text-[11px] text-slate-700">
                                {uItem.matMed || '—'}
                              </td>
                              <td className="py-3 px-3 align-top">
                                {uItem.exLab ? (
                                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold inline-block ${
                                    uItem.exLab.toLowerCase().includes('não') || uItem.exLab.toLowerCase().includes('incluso')
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                                  }`}>
                                    {uItem.exLab}
                                  </span>
                                ) : <span className="text-slate-300 font-medium">—</span>}
                              </td>
                              <td className="py-3 px-3 align-top">
                                {uItem.exRad ? (
                                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold inline-block ${
                                    uItem.exRad.toLowerCase().includes('não') || uItem.exRad.toLowerCase().includes('incluso')
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                                  }`}>
                                    {uItem.exRad}
                                  </span>
                                ) : <span className="text-slate-300 font-medium">—</span>}
                              </td>
                              <td className="py-3 px-3 align-top text-[11px] text-slate-700">
                                {uItem.fisioIntern || '—'}
                              </td>
                              <td className="py-3 px-3 align-top text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {onGeneratePreGuia && uItem.code !== 'TEXTO LIVRE' && !uItem.code.startsWith('OPÇÃO') && (
                                    <button
                                      type="button"
                                      onClick={() => onGeneratePreGuia(planDiariasRules.convenioId, uItem.code, uItem.acomodacao)}
                                      className="px-2 py-1 rounded-lg bg-[#FDF2F6] hover:bg-[#FCE7EF] text-[#B01B52] font-black text-[10px] transition-colors cursor-pointer"
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
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-xs text-slate-600">
                      Nenhum leito específico de UTI tabelado individualmente para este convênio. O faturamento segue a tabela padrão do hospital.
                    </div>
                  )}
                </div>
              )}

              {/* Protocolo de Parecer Intensivista & Visitas */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-extrabold text-base text-slate-900 m-0">
                    Regras de Admissão, Diária e Parecer de UTI
                  </h3>
                  <span className="text-xs font-bold text-[#0E7B86] bg-[#EBF7F8] border border-[#C4E5E8] px-2.5 py-1 rounded-lg">
                    {planDisplayName}
                  </span>
                </div>

                <div className="bg-[#EBF7F8] border border-[#C4E5E8] rounded-xl p-4 flex items-start gap-3">
                  <Activity className="w-5 h-5 text-[#0E7B86] mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-[#0E7B86] m-0">Protocolo de Parecer Intensivista & Visitas</h4>
                    <p className="text-xs sm:text-sm text-slate-800 m-0 leading-relaxed">
                      Toda admissão em UTI requer a inserção imediata do parecer médico fundamentado e o laudo de internação no portal do convênio em até 24 horas. Diárias de UTI sem laudo de justificativa clínica geram glosa integral do leito.
                    </p>
                  </div>
                </div>

                {activeConvenioObj?.sections?.uti?.steps && activeConvenioObj.sections.uti.steps.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider block">
                      Fluxo de Liberação da UTI:
                    </span>
                    <div className="space-y-2.5">
                      {activeConvenioObj.sections.uti.steps.map((step, sIdx) => (
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

                {activeConvenioObj?.sections?.uti?.codes && activeConvenioObj.sections.uti.codes.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider block">
                      Outros Códigos de UTI Registrados:
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
                          {activeConvenioObj.sections.uti.codes.map((c, cIdx) => (
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
                                  {copiedText === c.code ? <Check className="w-4 h-4 text-[#0E7B86]" /> : <Copy className="w-4 h-4 text-slate-400 group-hover:text-[#0E7B86]" />}
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

          {/* ========================================================= */}
          {/* ABA 3: CIRURGIAS, OPME & PRÉ-GUIA */}
          {/* ========================================================= */}
          {activeSubTab === 'cirurgias' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-extrabold text-base text-slate-900 m-0">
                    Diretrizes de Centro Cirúrgico, OPME e Guia de Internação
                  </h3>
                  <span className="text-xs font-bold text-[#0E7B86] bg-[#EBF7F8] border border-[#C4E5E8] px-2.5 py-1 rounded-lg">
                    {planDisplayName}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-xs font-bold uppercase text-[#0E7B86]">OPME & Materiais Especiais</span>
                    <p className="text-sm font-black text-slate-800 m-0">
                      Cotação de 3 Fornecedores
                    </p>
                    <p className="text-xs text-slate-500 m-0 leading-relaxed">
                      Exigência de 3 orçamentos no portal para órteses, próteses e materiais especiais não padronizados.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-xs font-bold uppercase text-[#B01B52]">Prorrogação de Diárias</span>
                    <p className="text-sm font-black text-slate-800 m-0">
                      Solicitação c/ 24h de Antecedência
                    </p>
                    <p className="text-xs text-slate-500 m-0 leading-relaxed">
                      Anexar boletim médico e evolução clínica antes do vencimento do período autorizado.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
                  <FileText className="w-5 h-5 text-[#B01B52] mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider m-0">
                      Geração de Pré-Guia & Checklist de Faturamento
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 m-0 leading-relaxed">
                      Toda cirurgia com internação deve ter a pré-guia emitida e conferida antes do procedimento eletivo ou em até 24 horas no pós-operatório de urgência.
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
                      Consulte o setor de Faturamento de Internação ou Auditoria Médica.
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#B01B52]" />
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 m-0">
                      Contatos & Auditoria Concorrente
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
                      Consulte a lista geral de ramais do hospital.
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
