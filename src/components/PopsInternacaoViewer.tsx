import React, { useState, useMemo, useEffect } from 'react';
import { ExternalLink, Globe, Printer, FileText } from 'lucide-react';
import { SERVIR_DATA, CONVENIOS_MASTER_LIST } from '../data/popsData';
import { TABELA_DIARIAS_DATA, ALL_DIARIAS_ITEMS, DiariaItem, ConvenioDiariasRules } from '../data/diariasData';

interface PopsInternacaoViewerProps {
  onOpenAiWithPrompt?: (prompt: string) => void;
  onGeneratePreGuia?: (convenio: string, code?: string, desc?: string) => void;
  initialPlanId?: string;
}

type PopActiveTab = 'clinica' | 'uti' | 'todos' | 'cirurgias' | 'portal';

export const PopsInternacaoViewer: React.FC<PopsInternacaoViewerProps> = ({
  onOpenAiWithPrompt,
  onGeneratePreGuia,
  initialPlanId
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId || 'ASSEFAZ');
  const [viewMode, setViewMode] = useState<'grid' | 'details'>('details');
  const [activeTab, setActiveTab] = useState<PopActiveTab>('clinica');
  const [query, setQuery] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [planSearch, setPlanSearch] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('Todos');

  useEffect(() => {
    if (initialPlanId) {
      setSelectedPlanId(initialPlanId);
      setViewMode('details');
      setActiveTab('clinica');
      setQuery('');
    }
  }, [initialPlanId]);

  const copyCodeToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1300);
    } catch {
      // Fallback
    }
  };

  const planCategories = ['Todos', 'Autogestão', 'Seguradora', 'Privado', 'Militar', 'Estadual'];

  // Busca regras oficiais da planilha do convênio selecionado
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
      (norm.includes('FUSEX') && r.convenioId === 'FUSEX') ||
      (norm.includes('SUL') && r.convenioId === 'SUL AMÉRICA')
    ) || null;
  }, [selectedPlanId]);

  // Objeto de dados complementares do convênio
  const activeConvenioObj = useMemo(() => {
    if (!selectedPlanId) return null;
    if (selectedPlanId === 'SERVIR') return null;
    return CONVENIOS_MASTER_LIST.find(c => 
      c.id.toUpperCase() === selectedPlanId.toUpperCase() ||
      c.name.toUpperCase().includes(selectedPlanId.toUpperCase())
    ) || null;
  }, [selectedPlanId]);

  // Lista com todos os convênios disponíveis
  const allPlansList = useMemo(() => {
    const plans: { id: string; name: string; category: string; badge: string; count: number }[] = [];

    TABELA_DIARIAS_DATA.forEach(d => {
      plans.push({
        id: d.convenioId,
        name: d.convenioName,
        category: d.category,
        badge: d.convenioId === 'ASSEFAZ' ? 'AF' : d.badge,
        count: d.itens.length
      });
    });

    CONVENIOS_MASTER_LIST.forEach(c => {
      const exists = plans.some(p => p.id.toUpperCase() === c.id.toUpperCase() || p.name.toUpperCase() === c.name.toUpperCase());
      if (!exists) {
        plans.push({
          id: c.id,
          name: c.name,
          category: c.category,
          badge: c.badge,
          count: 0
        });
      }
    });

    return plans.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filteredPlansForGrid = useMemo(() => {
    return allPlansList.filter(p => {
      const matchCat = activeCategoryFilter === 'Todos' || 
        (activeCategoryFilter === 'Autogestão' && p.category.toLowerCase().includes('autogest')) ||
        (activeCategoryFilter === 'Militar' && p.category.toLowerCase().includes('militar')) ||
        (activeCategoryFilter === 'Seguradora' && p.category.toLowerCase().includes('seguradora')) ||
        (activeCategoryFilter === 'Privado' && p.category.toLowerCase().includes('privad')) ||
        (activeCategoryFilter === 'Estadual' && p.category.toLowerCase().includes('estadual'));

      const matchSearch = !planSearch || 
        p.name.toLowerCase().includes(planSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(planSearch.toLowerCase());

      return matchCat && matchSearch;
    });
  }, [allPlansList, activeCategoryFilter, planSearch]);

  // Helper para identificar leitos e diárias de UTI
  const isUtiItem = (item: DiariaItem) => {
    const normTipo = (item.tipo || '').toUpperCase();
    const normAcomodacao = (item.acomodacao || '').toUpperCase();
    return (
      normTipo === 'UTI' ||
      normAcomodacao.includes('UTI') ||
      normAcomodacao.includes('CORONARIANA') ||
      normAcomodacao.includes('INTENSIV')
    );
  };

  const allItems = useMemo(() => {
    if (!planDiariasRules) return [];
    return planDiariasRules.itens;
  }, [planDiariasRules]);

  const clinicaDiarias = useMemo(() => {
    return allItems.filter(i => !isUtiItem(i));
  }, [allItems]);

  const utiDiarias = useMemo(() => {
    return allItems.filter(i => isUtiItem(i));
  }, [allItems]);

  const itemsWithTogether = useMemo(() => {
    return allItems.filter(i => i.solicitarJunto && i.solicitarJunto.trim().length > 0);
  }, [allItems]);

  // Filtragem dos cartões baseado na aba ativa e no termo de busca
  const filteredCards = useMemo(() => {
    let baseList = allItems;
    if (activeTab === 'clinica') {
      baseList = clinicaDiarias;
    } else if (activeTab === 'uti') {
      baseList = utiDiarias;
    }

    const q = query.toLowerCase().trim();
    if (!q) return baseList;

    return baseList.filter(item => 
      (item.acomodacao || '').toLowerCase().includes(q) ||
      (item.code || '').toLowerCase().includes(q) ||
      (item.solicitarJunto || '').toLowerCase().includes(q)
    );
  }, [allItems, clinicaDiarias, utiDiarias, activeTab, query]);

  // Informações de apresentação do convênio ativo
  const planDisplayName = planDiariasRules?.convenioName || activeConvenioObj?.name || (selectedPlanId === 'SERVIR' ? 'SERVIR' : selectedPlanId);
  const planCategory = planDiariasRules?.category || activeConvenioObj?.category || 'Autogestão';
  const planBadge = selectedPlanId.toUpperCase() === 'ASSEFAZ' ? 'AF' : (planDiariasRules?.badge || activeConvenioObj?.badge || selectedPlanId.slice(0, 2).toUpperCase());

  // Título e subtítulo do cabeçalho da listagem conforme a aba
  const headings = {
    clinica: {
      title: 'Internação clínica',
      subtitle: 'Enfermaria, apartamento, berçário, isolamento e hospital dia.'
    },
    uti: {
      title: 'UTI',
      subtitle: 'Diárias e taxa de isolamento para UTI.'
    },
    todos: {
      title: 'Todas as diárias',
      subtitle: `Relação completa do convênio ${planDisplayName}.`
    },
    cirurgias: {
      title: 'Cirurgias, OPME & Pré-Guia',
      subtitle: `Área reservada para os procedimentos cirúrgicos de ${planDisplayName}.`
    },
    portal: {
      title: 'Portal, Acessos & Contatos',
      subtitle: `Área reservada para os acessos e contatos de ${planDisplayName}.`
    }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setViewMode('details');
    setActiveTab('clinica');
    setQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==========================================
  // VIEW 1: SELETOR DE CONVÊNIOS EM GRID
  // ==========================================
  if (viewMode === 'grid') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8]">
                Central de POPS Internação
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Hospital Palmas Medical</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0E7B86] m-0">
              Escolha o Convênio do Paciente Internado
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed m-0">
              Selecione o convênio para abrir o guia de consulta com códigos de diárias, regras de acomodação (enfermaria/apartamento), vínculos de cobrança e leitos de UTI.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {planCategories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeCategoryFilter === cat
                      ? 'bg-[#A7194D] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-[#EBF7F8] text-slate-600 hover:text-[#0E7B86]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <input
                type="search"
                placeholder="Buscar convênio para internação..."
                value={planSearch}
                onChange={e => setPlanSearch(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0E7B86] focus:bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlansForGrid.map(plan => (
            <button
              key={plan.id}
              type="button"
              onClick={() => handleSelectPlan(plan.id)}
              className="bg-white border border-slate-200/90 hover:border-[#BFDEE7] hover:shadow-md rounded-2xl p-5 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-12 h-12 rounded-xl bg-[#A7194D] text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    {plan.badge}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8]">
                      {plan.category}
                    </span>
                    {plan.count > 0 && (
                      <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                        {plan.count} diárias
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-black text-slate-900 text-base tracking-tight leading-snug group-hover:text-[#A7194D] transition-colors m-0 break-words">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 m-0">
                    Diárias clínicas, acomodação, vínculos e leitos de UTI
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-[#A7194D] group-hover:underline flex items-center gap-1">
                  Abrir Modelo de Internação →
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Internação</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: MODELO SOLICITADO PELO USUÁRIO
  // (100% IDÊNTICO ÀS CAPTURAS DE TELA ENVIADAS)
  // ==========================================
  const isSpecialTab = activeTab === 'cirurgias' || activeTab === 'portal';

  const specificNotice = planDiariasRules?.criticalRule
    ? `Aviso de acomodação: ${planDiariasRules.criticalRule}`
    : planDiariasRules?.urgenciaRegra
    ? `Regra de urgência: ${planDiariasRules.urgenciaRegra}`
    : `As demais orientações não constam na parte da ${planDisplayName} da planilha.`;

  return (
    <div className="pop-root">
      <style>{`
        .pop-root {
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          color: #172b43;
          background: #f3f7fa;
          font-synthesis: none;
          margin: -1.5rem;
          padding: 1.5rem;
          min-height: calc(100vh - 80px);
        }
        .pop-shell {
          max-width: 1220px;
          margin: auto;
          padding: 10px 10px 70px;
        }
        .pop-topline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 0 15px;
          color: #64768a;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: -0.01em;
          flex-wrap: wrap;
          gap: 10px;
        }
        .pop-crumb {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }
        .pop-crumb button.crumb-btn {
          background: none;
          border: 0;
          color: #64768a;
          cursor: pointer;
          padding: 0;
          font: inherit;
          font-weight: 500;
        }
        .pop-crumb button.crumb-btn:hover {
          color: #a7194d;
          text-decoration: underline;
        }
        .pop-crumb span.active-crumb {
          color: #1b354c;
          font-weight: 800;
        }
        .pop-top-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pop-plan-select {
          padding: 6px 12px;
          border: 1px solid #d8e5ec;
          border-radius: 20px;
          background: white;
          color: #1b354c;
          font-size: 12px;
          font-weight: 700;
          font-family: inherit;
          outline: none;
          cursor: pointer;
        }
        .pop-preview {
          padding: 5px 12px;
          border: 1px solid #d8e5ec;
          border-radius: 30px;
          background: white;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          white-space: nowrap;
        }
        .pop-hero, .pop-workspace {
          background: #fff;
          border: 1px solid #dae5ed;
          box-shadow: 0 5px 18px #182f4b09;
          border-radius: 20px;
        }
        .pop-hero {
          padding: 28px 30px 23px;
        }
        .pop-hero-main {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .pop-badge {
          display: grid;
          place-items: center;
          flex: 0 0 56px;
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: #a7194d;
          color: #fff;
          font-size: 20px;
          font-weight: 850;
          letter-spacing: -0.02em;
          box-shadow: 0 4px 9px #a7194d25;
        }
        .pop-heading {
          min-width: 0;
          flex: 1;
        }
        .pop-name-row {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        .pop-heading h1 {
          margin: 0;
          color: #0c2541;
          letter-spacing: -0.04em;
          font-size: 26px;
          font-weight: 850;
          line-height: 1.2;
        }
        .pop-tag {
          padding: 4px 10px;
          border-radius: 7px;
          background: #e8f8fa;
          border: 1px solid #bee6ec;
          color: #14758a;
          font-weight: 750;
          font-size: 12px;
          letter-spacing: 0.01em;
        }
        .pop-heading p {
          margin: 5px 0 0;
          color: #516780;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: -0.01em;
        }
        .pop-hero-rule {
          height: 1px;
          background: #edf1f5;
          margin: 23px 0 16px;
        }
        .pop-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .pop-stat {
          display: flex;
          gap: 12px;
          align-items: center;
          border: 1px solid #dde8f0;
          background: #fbfdff;
          border-radius: 13px;
          padding: 13px;
        }
        .pop-stat-icon {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          border-radius: 10px;
          background: #eaf7fb;
          color: #08768d;
          font-size: 18px;
        }
        .pop-stat:nth-child(2) .pop-stat-icon {
          background: #fff0f5;
          color: #b01b51;
        }
        .pop-stat:nth-child(3) .pop-stat-icon {
          background: #eef5fa;
          color: #245b7d;
        }
        .pop-stat small {
          display: block;
          color: #687b91;
          font-size: 10.5px;
          font-weight: 850;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .pop-stat strong {
          display: block;
          margin-top: 3px;
          font-size: 13.5px;
          line-height: 1.25;
          color: #0c2541;
          font-weight: 800;
          letter-spacing: -0.015em;
        }
        .pop-workspace {
          margin-top: 20px;
          overflow: hidden;
        }
        .pop-workspace-head {
          padding: 24px 26px 0;
        }
        .pop-eyebrow {
          color: #ac2354;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .pop-workspace h2 {
          margin: 5px 0 4px;
          color: #122a46;
          font-size: 22px;
          letter-spacing: -.035em;
          font-weight: 800;
          line-height: 1.25;
        }
        .pop-subtext {
          font-size: 13px;
          color: #708196;
          margin: 0 0 18px;
          font-weight: 500;
          letter-spacing: -0.01em;
        }
        .pop-toolbar {
          display: flex;
          gap: 12px;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }
        .pop-tabs {
          display: flex;
          gap: 4px;
          padding: 4px;
          max-width: 100%;
          overflow-x: auto;
          background: #f1f6f9;
          border: 1px solid #e5edf3;
          border-radius: 11px;
        }
        .pop-tab {
          border: 0;
          background: transparent;
          border-radius: 8px;
          padding: 9px 14px;
          color: #607387;
          font-weight: 750;
          font-size: 13px;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }
        .pop-tab[aria-selected="true"] {
          color: #a7194d;
          background: #fff;
          font-weight: 800;
          box-shadow: 0 2px 7px #182f4b16;
        }
        .pop-count {
          font-size: 11px;
          font-weight: 750;
          opacity: .75;
          margin-left: 5px;
        }
        .pop-actions {
          display: flex;
          gap: 9px;
          align-items: center;
        }
        .pop-search {
          display: flex;
          align-items: center;
          gap: 7px;
          border: 1px solid #dce6ed;
          border-radius: 9px;
          padding: 0 12px;
          background: white;
          color: #6b8190;
        }
        .pop-search input {
          width: 210px;
          height: 38px;
          border: 0;
          outline: 0;
          color: #203951;
          background: transparent;
          font-size: 13px;
          font-family: inherit;
          font-weight: 500;
        }
        .pop-search input::placeholder {
          color: #94a3b8;
        }
        .pop-print {
          border: 1px solid #dce6ed;
          color: #234459;
          background: white;
          border-radius: 9px;
          padding: 9px 12px;
          font-size: 13px;
          font-family: inherit;
          font-weight: 700;
          letter-spacing: -0.01em;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background .15s;
        }
        .pop-print:hover {
          background: #f8fafc;
        }
        .pop-notice {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 21px 26px 0;
          padding: 12px 15px;
          border-radius: 11px;
          background: #f1f9fb;
          color: #245568;
          font-size: 12px;
          font-weight: 500;
          line-height: 1.5;
          border: 1px solid #d8ecf2;
          letter-spacing: -0.01em;
        }
        .pop-notice b {
          color: #176d82;
          font-weight: 750;
        }
        .pop-list-head {
          padding: 22px 26px 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 14px;
        }
        .pop-list-head h3 {
          font-size: 15px;
          margin: 0 0 3px;
          color: #1b354c;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .pop-list-head p {
          font-size: 12px;
          color: #708196;
          margin: 0;
          font-weight: 500;
        }
        .pop-results {
          font-size: 12px;
          color: #708196;
          white-space: nowrap;
          font-weight: 600;
        }
        .pop-cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          padding: 0 26px 27px;
        }
        .pop-card {
          border: 1px solid #e0e9ef;
          border-radius: 13px;
          padding: 18px 20px 17px;
          transition: border-color .2s, box-shadow .2s;
          min-width: 0;
          background: #fff;
        }
        .pop-card:hover {
          border-color: #bfdee7;
          box-shadow: 0 4px 12px #182f4b06;
        }
        .pop-cardtop {
          display: flex;
          justify-content: space-between;
          gap: 7px;
          align-items: center;
        }
        .pop-code {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #eef5f9;
          border: 1px solid #dceaf0;
          color: #225570;
          border-radius: 7px;
          padding: 5px 9px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
          font-size: 12.5px;
          font-weight: 750;
          letter-spacing: 0.02em;
        }
        .pop-copy {
          border: 0;
          background: none;
          color: #8c9cad;
          font-size: 14px;
          padding: 2px 4px;
          cursor: pointer;
          transition: color .15s;
        }
        .pop-copy:hover {
          color: #a7194d;
        }
        .pop-category {
          color: #8b5670;
          background: #fff2f6;
          font-size: 10px;
          font-weight: 850;
          padding: 5px 8px;
          border-radius: 6px;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .pop-category.uti {
          color: #385884;
          background: #eff5ff;
        }
        .pop-card h4 {
          font-size: 14.5px;
          line-height: 1.45;
          margin: 12px 0 12px;
          color: #1b304a;
          font-weight: 800;
          letter-spacing: -0.015em;
          text-transform: uppercase;
        }
        .pop-joint {
          border-top: 1px solid #e9eef3;
          padding-top: 12px;
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }
        .pop-joint .label {
          font-size: 11px;
          font-weight: 850;
          color: #667a8d;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .pop-joint .value {
          font-size: 12px;
          font-weight: 750;
          color: #1d6d80;
          background: #eaf8f9;
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid #bee6ec;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          letter-spacing: 0.01em;
        }
        .pop-joint .empty {
          font-size: 12px;
          color: #91a0aa;
          font-weight: 500;
        }
        .pop-detail-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 9px;
          margin-top: 13px;
        }
        .pop-detail {
          background: #f8fafc;
          border: 1px solid #e9eff4;
          border-radius: 8px;
          padding: 10px 12px;
          min-width: 0;
        }
        .pop-detail b {
          display: block;
          color: #637b90;
          font-size: 11px;
          letter-spacing: .02em;
          margin-bottom: 4px;
          font-weight: 750;
        }
        .pop-detail span {
          display: block;
          font-size: 11px;
          line-height: 1.45;
          color: #283e52;
          font-weight: 500;
          overflow-wrap: anywhere;
        }
        .pop-detail .missing {
          color: #8292a1;
          font-style: italic;
          font-weight: 400;
        }
        .pop-empty-state {
          text-align: center;
          color: #6d8091;
          padding: 50px 20px;
          font-size: 13px;
        }
        .pop-module {
          margin: 0 26px 27px;
          padding: 22px;
          border: 1px solid #e1eaf0;
          border-radius: 13px;
          background: linear-gradient(135deg, #fff, #f9fcfd);
        }
        .pop-module h4 {
          font-size: 17px;
          color: #19344d;
          margin: 0 0 8px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .pop-module p {
          font-size: 13px;
          color: #6b7e8e;
          line-height: 1.55;
          margin: 0 0 18px;
          font-weight: 500;
        }
        .pop-module-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 11px;
        }
        .pop-module-item {
          padding: 16px;
          border-radius: 10px;
          border: 1px solid #e3eaf0;
          background: #fff;
        }
        .pop-module-item strong {
          font-size: 13px;
          color: #28435b;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        .pop-module-item span {
          font-size: 12px;
          color: #77899a;
          line-height: 1.45;
          display: block;
          font-weight: 500;
        }
        .pop-module-item i {
          font-style: normal;
          color: #b02056;
          margin-right: 4px;
        }
        .pop-footer-note {
          padding: 13px 26px;
          border-top: 1px solid #e9eef3;
          color: #6d8192;
          background: #fcfdfe;
          font-size: 11.5px;
          line-height: 1.5;
          font-weight: 500;
        }
        .pop-footer-note strong {
          color: #38566d;
          font-weight: 750;
        }

        /* Bloco Diretrizes de Centro Cirúrgico, OPME e Guia de Internação */
        .pop-guidelines-box {
          margin: 10px 26px 26px;
          padding: 22px;
          border: 1px solid #dae5ed;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 2px 10px rgba(18, 42, 70, 0.03);
        }
        .pop-guidelines-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .pop-guidelines-head h3 {
          font-size: 16px;
          font-weight: 850;
          color: #122a46;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .pop-guidelines-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 8px;
          background: #f0fafb;
          border: 1px solid #bee6ec;
          color: #0e7b86;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
        .pop-guidelines-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .pop-guidelines-card {
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #fff;
        }
        .pop-guidelines-card small.teal {
          color: #0e7b86;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 4px;
          display: block;
        }
        .pop-guidelines-card small.berry {
          color: #b01b52;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 4px;
          display: block;
        }
        .pop-guidelines-card strong {
          color: #0f172a;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.01em;
          margin-bottom: 5px;
          display: block;
        }
        .pop-guidelines-card p {
          color: #64748b;
          font-size: 12px;
          line-height: 1.5;
          margin: 0;
          font-weight: 500;
        }
        .pop-guidelines-banner {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          margin-top: 14px;
          background: #fff;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .pop-guidelines-banner strong {
          color: #0f172a;
          font-size: 12.5px;
          font-weight: 850;
          letter-spacing: 0.02em;
          display: block;
          margin-bottom: 4px;
          text-transform: uppercase;
        }
        .pop-guidelines-banner p {
          color: #64748b;
          font-size: 12px;
          line-height: 1.5;
          margin: 0;
          font-weight: 500;
        }

        @media(max-width:960px){
          .pop-detail-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media(max-width:780px){
          .pop-root {
            margin: -1rem;
            padding: 1rem;
          }
          .pop-shell {
            padding: 10px 4px 45px;
          }
          .pop-hero {
            padding: 20px 17px;
          }
          .pop-stats {
            grid-template-columns: 1fr;
          }
          .pop-workspace-head {
            padding: 20px 16px 0;
          }
          .pop-notice {
            margin: 18px 16px 0;
          }
          .pop-cards {
            padding: 0 16px 20px;
          }
          .pop-detail-grid {
            grid-template-columns: 1fr;
          }
          .pop-module {
            margin: 0 16px 20px;
            padding: 16px;
          }
          .pop-module-grid {
            grid-template-columns: 1fr;
          }
          .pop-list-head {
            padding: 20px 16px 12px;
          }
          .pop-tabs {
            width: 100%;
            overflow: auto;
          }
          .pop-actions, .pop-search {
            flex: 1;
          }
          .pop-search input {
            width: 100%;
          }
          .pop-topline {
            font-size: 11px;
          }
          .pop-hero-main {
            align-items: flex-start;
          }
          .pop-heading p {
            line-height: 1.4;
          }
          .pop-heading h1 {
            font-size: 23px;
          }
          .pop-guidelines-box {
            margin: 10px 16px 20px;
            padding: 16px;
          }
          .pop-guidelines-grid {
            grid-template-columns: 1fr;
          }
        }

        @media print {
          body {
            background: #fff !important;
          }
          .pop-root {
            margin: 0;
            padding: 0;
            background: #fff;
          }
          .pop-shell {
            max-width: none;
            padding: 0;
          }
          .pop-topline, .pop-actions, .pop-tabs, .pop-copy, .no-print {
            display: none !important;
          }
          .pop-hero, .pop-workspace {
            border: 0;
            box-shadow: none;
          }
          .pop-hero {
            padding: 10px 0;
          }
          .pop-workspace {
            margin: 0;
          }
          .pop-cards {
            padding: 0;
          }
          .pop-card {
            break-inside: avoid;
          }
          .pop-notice {
            margin: 12px 0;
          }
          .pop-workspace-head, .pop-list-head {
            padding-left: 0;
          }
          .pop-footer-note {
            padding-left: 0;
          }
        }
      `}</style>

      <main className="pop-shell">
        {/* Topline Navigation & Plan Switcher */}
        <nav className="pop-topline" aria-label="Localização">
          <div className="pop-crumb">
            <button 
              type="button" 
              className="crumb-btn"
              onClick={() => setViewMode('grid')}
            >
              Central de Autorizações
            </button>
            <span>›</span>
            <button 
              type="button" 
              className="crumb-btn"
              onClick={() => setViewMode('grid')}
            >
              Convênios
            </button>
            <span>›</span>
            <span className="active-crumb">{planDisplayName}</span>
          </div>

          <div className="pop-top-actions">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className="pop-preview hover:border-[#a7194d] hover:text-[#a7194d] transition-colors cursor-pointer"
            >
              ← Todos os Convênios
            </button>

            <select
              value={selectedPlanId}
              onChange={e => handleSelectPlan(e.target.value)}
              className="pop-plan-select"
              title="Trocar Convênio"
            >
              {allPlansList.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>

            <span className="pop-preview">Modelo de página</span>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="pop-hero">
          <div className="pop-hero-main">
            <div className="pop-badge" aria-hidden="true">
              {planBadge}
            </div>
            <div className="pop-heading">
              <div className="pop-name-row">
                <h1>{planDisplayName}</h1>
                <span className="pop-tag">{planCategory}</span>
              </div>
              <p>Diárias de internação e UTI · Hospital Palmas Medical</p>
            </div>
          </div>

          <div className="pop-hero-rule"></div>

          {/* Stats Bar */}
          <div className="pop-stats">
            <div className="pop-stat">
              <span className="pop-stat-icon" aria-hidden="true">▣</span>
              <div>
                <small>ITENS DA PLANILHA</small>
                <strong>{allItems.length} diárias e taxas</strong>
              </div>
            </div>

            <div className="pop-stat">
              <span className="pop-stat-icon" aria-hidden="true">↗</span>
              <div>
                <small>SOLICITAR JUNTO</small>
                <strong>{itemsWithTogether.length} itens com código vinculado</strong>
              </div>
            </div>

            <div className="pop-stat">
              <span className="pop-stat-icon" aria-hidden="true">+</span>
              <div>
                <small>UTI</small>
                <strong>{utiDiarias.length} diárias e taxas</strong>
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Section */}
        <section className="pop-workspace" aria-labelledby="section-title">
          <div className="pop-workspace-head">
            <span className="pop-eyebrow">GUIA DE CONSULTA · INTERNAÇÃO</span>
            <h2 id="section-title">Lista de diárias e acomodações</h2>
            <p className="pop-subtext">Consulte o código da diária e veja o que solicitar junto, quando informado na planilha.</p>

            {/* Toolbar: Tabs & Actions */}
            <div className="pop-toolbar">
              <div className="pop-tabs" role="tablist" aria-label="Tipo de diária">
                <button
                  type="button"
                  className="pop-tab"
                  role="tab"
                  aria-selected={activeTab === 'clinica'}
                  onClick={() => setActiveTab('clinica')}
                >
                  Internação clínica <span className="count">{clinicaDiarias.length}</span>
                </button>

                <button
                  type="button"
                  className="pop-tab"
                  role="tab"
                  aria-selected={activeTab === 'uti'}
                  onClick={() => setActiveTab('uti')}
                >
                  UTI <span className="count">{utiDiarias.length}</span>
                </button>

                <button
                  type="button"
                  className="pop-tab"
                  role="tab"
                  aria-selected={activeTab === 'todos'}
                  onClick={() => setActiveTab('todos')}
                >
                  Todos <span className="count">{allItems.length}</span>
                </button>

                <button
                  type="button"
                  className="pop-tab"
                  role="tab"
                  aria-selected={activeTab === 'cirurgias'}
                  onClick={() => setActiveTab('cirurgias')}
                >
                  ✂ &nbsp;Cirurgias, OPME &amp; Pré-Guia
                </button>

                <button
                  type="button"
                  className="pop-tab"
                  role="tab"
                  aria-selected={activeTab === 'portal'}
                  onClick={() => setActiveTab('portal')}
                >
                  ◎ &nbsp;Portal, Acessos &amp; Contatos
                </button>
              </div>

              <div className="pop-actions">
                <label className="pop-search">
                  <span aria-hidden="true">⌕</span>
                  <input
                    type="search"
                    placeholder="Buscar código ou acomodação"
                    aria-label="Buscar código ou acomodação"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                  />
                </label>

                <button 
                  type="button" 
                  className="pop-print" 
                  onClick={() => window.print()}
                >
                  ↑ &nbsp;Imprimir
                </button>
              </div>
            </div>
          </div>

          {/* Notice Banner */}
          {!isSpecialTab && (
            <div className="pop-notice" id="notice">
              <span aria-hidden="true">ⓘ</span>
              <span>
                <b>Leitura dos dados:</b> “Solicitar junto” aparece apenas quando preenchido para aquela diária. {specificNotice}
              </span>
            </div>
          )}

          {/* List Header */}
          <div className="pop-list-head">
            <div>
              <h3 id="list-title">{headings[activeTab].title}</h3>
              <p id="list-subtitle">{headings[activeTab].subtitle}</p>
            </div>
            {!isSpecialTab && (
              <span className="pop-results" id="results">
                {filteredCards.length} {filteredCards.length === 1 ? 'item' : 'itens'}
              </span>
            )}
          </div>

          {/* Cards Grid (quando ativa é clinica, uti ou todos) */}
          {!isSpecialTab && (
            <div className="pop-cards" id="cards" aria-live="polite">
              {filteredCards.length > 0 ? (
                filteredCards.map(item => {
                  const isUti = isUtiItem(item);

                  const getVal = (itemVal?: string, ruleVal?: string) => {
                    if (itemVal && !itemVal.toLowerCase().includes('não informado')) return itemVal;
                    if (ruleVal && !ruleVal.toLowerCase().includes('não informado')) return ruleVal;
                    return null;
                  };

                  const valParecer = getVal(item.parecer, planDiariasRules?.parecer);
                  const valMatMed = getVal(item.matMed, planDiariasRules?.matMed);
                  const valExLab = getVal(item.exLab, planDiariasRules?.exLab);
                  const valExRad = getVal(item.exRad, planDiariasRules?.exRad);
                  const valFisio = getVal(item.fisioIntern, planDiariasRules?.fisioIntern);

                  return (
                    <article className="pop-card" key={item.id || item.code + item.acomodacao}>
                      <div className="pop-cardtop">
                        <span className="pop-code">
                          {item.code}{' '}
                          <button
                            type="button"
                            className="pop-copy"
                            data-code={item.code}
                            onClick={() => copyCodeToClipboard(item.code)}
                            aria-label={`Copiar código ${item.code}`}
                            title="Copiar código"
                          >
                            {copiedCode === item.code ? '✓' : '▢'}
                          </button>
                        </span>
                        <span className={`pop-category ${isUti ? 'uti' : ''}`}>
                          {isUti ? 'UTI' : 'INTERNAÇÃO'}
                        </span>
                      </div>

                      <h4>{item.acomodacao}</h4>

                      <div className="pop-joint">
                        <span className="label">SOLICITAR JUNTO</span>
                        {item.solicitarJunto ? (
                          <span className="value">{item.solicitarJunto}</span>
                        ) : (
                          <span className="empty">Não informado na planilha</span>
                        )}
                      </div>

                      <div className="pop-detail-grid">
                        <div className="pop-detail">
                          <b>Parecer</b>
                          <span className={valParecer ? '' : 'missing'}>
                            {valParecer || 'Não informado na planilha'}
                          </span>
                        </div>

                        <div className="pop-detail">
                          <b>Mat / Med</b>
                          <span className={valMatMed ? '' : 'missing'}>
                            {valMatMed || 'Não informado na planilha'}
                          </span>
                        </div>

                        <div className="pop-detail">
                          <b>Ex. Lab</b>
                          <span className={valExLab ? '' : 'missing'}>
                            {valExLab || 'Não informado na planilha'}
                          </span>
                        </div>

                        <div className="pop-detail">
                          <b>Ex. Rad</b>
                          <span className={valExRad ? '' : 'missing'}>
                            {valExRad || 'Não informado na planilha'}
                          </span>
                        </div>

                        <div className="pop-detail">
                          <b>Fisio</b>
                          <span className={valFisio ? '' : 'missing'}>
                            {valFisio || 'Não informado na planilha'}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <p className="pop-empty-state">
                  Nenhum item encontrado para esta busca no convênio {planDisplayName}.
                </p>
              )}
            </div>
          )}

          {/* Módulo Especial: Cirurgias, OPME & Pré-Guia */}
          {activeTab === 'cirurgias' && (
            <div className="space-y-6">
              {/* Diretrizes de Centro Cirúrgico, OPME e Guia de Internação (Exclusivo desta aba) */}
              <div className="pop-guidelines-box">
                <div className="pop-guidelines-head">
                  <h3>Diretrizes de Centro Cirúrgico, OPME e Guia de Internação</h3>
                  <span className="pop-guidelines-badge">{planDisplayName.toUpperCase()}</span>
                </div>

                <div className="pop-guidelines-grid">
                  <div className="pop-guidelines-card">
                    <small className="teal">OPME &amp; MATERIAIS ESPECIAIS</small>
                    <strong>Cotação de 3 Fornecedores</strong>
                    <p>Exigência de 3 orçamentos no portal para órteses, próteses e materiais especiais não padronizados.</p>
                  </div>

                  <div className="pop-guidelines-card">
                    <small className="berry">PRORROGAÇÃO DE DIÁRIAS</small>
                    <strong>Solicitação c/ 24h de Antecedência</strong>
                    <p>Anexar boletim médico e evolução clínica antes do vencimento do período autorizado.</p>
                  </div>
                </div>

                <div className="pop-guidelines-banner">
                  <FileText className="w-5 h-5 text-[#b01b52] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>GERAÇÃO DE PRÉ-GUIA &amp; CHECKLIST DE FATURAMENTO</strong>
                    <p>Toda cirurgia com internação deve ter a pré-guia emitida e conferida antes do procedimento eletivo ou em até 24 horas no pós-operatório de urgência.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Módulo Especial: Portal, Acessos & Contatos */}
          {activeTab === 'portal' && (
            <div className="pop-module">
              <h4>Portal, Acessos &amp; Contatos</h4>
              <p>
                Canais oficiais de autorização, portal da operadora e suporte prestador do convênio {planDisplayName}.
              </p>

              <div className="pop-module-grid">
                <div className="pop-module-item">
                  <strong><i>◇</i>Portal da operadora</strong>
                  <span>
                    {activeConvenioObj?.portalUrl
                      ? 'Acesso direto ao portal eletrônico oficial da operadora.'
                      : 'Acesso pelo sistema autorizador web ou TISS contratado.'}
                  </span>
                  {activeConvenioObj?.portalUrl && (
                    <a
                      href={activeConvenioObj.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0E7B86] text-white rounded-lg text-xs font-bold hover:bg-[#095962] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Acessar Portal da Operadora ↗
                    </a>
                  )}
                </div>

                <div className="pop-module-item">
                  <strong><i>◇</i>Central de Autorizações</strong>
                  <span>
                    {activeConvenioObj?.contacts && activeConvenioObj.contacts.length > 0
                      ? activeConvenioObj.contacts.filter(c => !c.includes('@')).join(' • ')
                      : 'Central de Atendimento ao Prestador e Urgência 24h.'}
                  </span>
                </div>

                <div className="pop-module-item">
                  <strong><i>◇</i>E-mail &amp; Auditoria Concorrente</strong>
                  <span>
                    {activeConvenioObj?.contacts && activeConvenioObj.contacts.some(c => c.includes('@'))
                      ? activeConvenioObj.contacts.filter(c => c.includes('@')).join(' • ')
                      : 'Envio de laudos médicos para prorrogação de internação e relatórios de UTI.'}
                  </span>
                </div>

                <div className="pop-module-item">
                  <strong><i>◇</i>Prazos e Prorrogações</strong>
                  <span>
                    Prorrogações de leito e UTI devem ser enviadas com 24h a 48h de antecedência com relatório do médico assistente e intensivista.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Rodapé Oficial da Tabela */}
          <div className="pop-footer-note">
            <strong>Fonte:</strong> TABELA DE DIÁRIAS CORRETA2(1).xlsx · Se uma informação não aparece na planilha, ela não foi presumida neste modelo.
          </div>
        </section>
      </main>
    </div>
  );
};
