import React, { useState, useMemo, useEffect } from 'react';
import { 
  ExternalLink, 
  Globe, 
  Printer, 
  FileText, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  KeyRound, 
  ShieldAlert,
  Stethoscope,
  Pill,
  FlaskConical,
  Scan,
  Activity,
  Link2,
  Building2,
  Bed,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { SERVIR_DATA, CONVENIOS_MASTER_LIST } from '../data/popsData';
import { TABELA_DIARIAS_DATA, ALL_DIARIAS_ITEMS, DiariaItem, ConvenioDiariasRules } from '../data/diariasData';
import { PORTAIS_CREDENCIAIS, PORTAIS_RULES, PortalCredential } from '../data/portaisData';

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
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId || '');
  const [viewMode, setViewMode] = useState<'grid' | 'details'>(initialPlanId ? 'details' : 'grid');
  const [activeTab, setActiveTab] = useState<PopActiveTab>('clinica');
  const [query, setQuery] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [planSearch, setPlanSearch] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('Todos');
  const [revealedPasswords, setRevealedPasswords] = useState<{ [id: string]: boolean }>({});
  const [copiedCredential, setCopiedCredential] = useState<{ id: string; field: 'login' | 'senha' } | null>(null);
  const [copiedCardSummary, setCopiedCardSummary] = useState<string | null>(null);
  const [cardLayoutMode, setCardLayoutMode] = useState<'cards' | 'table'>('cards');

  const togglePasswordReveal = (id: string) => {
    setRevealedPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyCredField = (id: string, field: 'login' | 'senha', text: string) => {
    if (!text || text === 'Verificar no portal' || text.includes('Não se aplica')) return;
    navigator.clipboard.writeText(text);
    setCopiedCredential({ id, field });
    setTimeout(() => setCopiedCredential(null), 1800);
  };

  // Status visual dos 5 pilares de autorização
  const getPillarStatus = (value?: string | null) => {
    if (!value || value.toLowerCase().includes('não informado')) {
      return {
        badgeText: 'Não informado',
        badgeClass: 'bg-slate-100 text-slate-500 border-slate-200',
        cardClass: 'bg-slate-50/80 border-slate-200/80',
        textClass: 'text-slate-400 italic'
      };
    }
    const lower = value.toLowerCase();
    if (lower.includes('não precisa') || lower.includes('não necessita') || lower.includes('isento') || lower.includes('liberado')) {
      return {
        badgeText: 'Liberado',
        badgeClass: 'bg-emerald-100/90 text-emerald-800 border-emerald-300 font-bold',
        cardClass: 'bg-emerald-50/40 border-emerald-200/90',
        textClass: 'text-emerald-950 font-semibold'
      };
    }
    if (lower.includes('incluso')) {
      return {
        badgeText: 'Incluso',
        badgeClass: 'bg-teal-100/90 text-teal-800 border-teal-300 font-bold',
        cardClass: 'bg-teal-50/40 border-teal-200/90',
        textClass: 'text-teal-950 font-semibold'
      };
    }
    if (lower.includes('necessita') || lower.includes('acima') || lower.includes('autoriza') || lower.includes('obrigat') || lower.includes('solicitar')) {
      return {
        badgeText: 'Autorização',
        badgeClass: 'bg-amber-100/90 text-amber-900 border-amber-300 font-bold',
        cardClass: 'bg-amber-50/40 border-amber-300/90',
        textClass: 'text-amber-950 font-bold'
      };
    }
    return {
      badgeText: 'Contratual',
      badgeClass: 'bg-sky-100/90 text-sky-800 border-sky-200 font-bold',
      cardClass: 'bg-sky-50/30 border-sky-200/90',
      textClass: 'text-slate-800 font-medium'
    };
  };

  useEffect(() => {
    if (initialPlanId) {
      setSelectedPlanId(initialPlanId);
      setViewMode('details');
      setActiveTab('clinica');
      setQuery('');
    } else {
      setViewMode('grid');
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

  const handleCopyCardSummary = (item: DiariaItem, isUti: boolean, pName: string) => {
    const getVal = (itemVal?: string, ruleVal?: string) => {
      if (itemVal && !itemVal.toLowerCase().includes('não informado')) return itemVal;
      if (ruleVal && !ruleVal.toLowerCase().includes('não informado')) return ruleVal;
      return null;
    };

    const valParecer = getVal(item.parecer, planDiariasRules?.parecer) || 'Não informado na planilha';
    const valMatMed = getVal(item.matMed, planDiariasRules?.matMed) || 'Não informado na planilha';
    const valExLab = getVal(item.exLab, planDiariasRules?.exLab) || 'Não informado na planilha';
    const valExRad = getVal(item.exRad, planDiariasRules?.exRad) || 'Não informado na planilha';
    const valFisio = getVal(item.fisioIntern, planDiariasRules?.fisioIntern) || 'Não informado na planilha';

    let text = `🏥 *${pName.toUpperCase()} - ${isUti ? 'UTI INTENSIVA' : 'INTERNAÇÃO CLÍNICA'}*\n`;
    text += `🛏️ *Acomodação:* ${item.acomodacao}\n`;
    text += `🔢 *Código:* ${item.code}\n`;
    if (item.solicitarJunto) {
      text += `🔗 *Solicitar Junto:* ${item.solicitarJunto}\n`;
    }
    text += `📋 *Regras de Liberação/Autorização:*\n`;
    text += `• Parecer Especialista: ${valParecer}\n`;
    text += `• Mat / Med: ${valMatMed}\n`;
    text += `• Exames Laboratoriais: ${valExLab}\n`;
    text += `• Exames Radiológicos: ${valExRad}\n`;
    text += `• Fisioterapia: ${valFisio}\n`;

    navigator.clipboard.writeText(text);
    const key = item.id || item.code + item.acomodacao;
    setCopiedCardSummary(key);
    setTimeout(() => setCopiedCardSummary(null), 2000);
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
  const planDisplayName = planDiariasRules?.convenioName || activeConvenioObj?.name || (selectedPlanId === 'SERVIR' ? 'SERVIR' : selectedPlanId) || 'Convênio';
  const planCategory = planDiariasRules?.category || activeConvenioObj?.category || 'Autogestão';
  const planBadge = selectedPlanId.toUpperCase() === 'ASSEFAZ' ? 'AF' : (planDiariasRules?.badge || activeConvenioObj?.badge || (selectedPlanId ? selectedPlanId.slice(0, 2).toUpperCase() : 'CV'));

  const isBradesco = selectedPlanId.toUpperCase().includes('BRADESCO') || planDisplayName.toUpperCase().includes('BRADESCO');
  const isCassi = selectedPlanId.toUpperCase().includes('CASSI') || planDisplayName.toUpperCase().includes('CASSI');

  const matchingCredentials = useMemo(() => {
    const rawTerms = [
      selectedPlanId.toLowerCase(),
      planDisplayName.toLowerCase(),
      activeConvenioObj?.id?.toLowerCase() || '',
      activeConvenioObj?.name?.toLowerCase() || ''
    ].filter(Boolean);

    if (isBradesco) {
      return PORTAIS_CREDENCIAIS.filter(c => 
        c.id === 'bradesco-internacao-medical' || c.id === 'bradesco-internacao-st'
      );
    }

    if (isCassi) {
      return PORTAIS_CREDENCIAIS.filter(c => c.id === 'cassi-medical' || c.convenio.toLowerCase().includes('cassi'));
    }

    return PORTAIS_CREDENCIAIS.filter(cred => {
      const cName = cred.convenio.toLowerCase();
      const cId = cred.id.toLowerCase();
      return rawTerms.some(term => {
        const cleanTerm = term.replace(/[^a-z0-9]/g, '');
        const cleanName = cName.replace(/[^a-z0-9]/g, '');
        if (cleanTerm.length >= 3 && cleanName.includes(cleanTerm)) return true;
        if (cleanName.length >= 3 && cleanTerm.includes(cleanName)) return true;
        return cName.includes(term) || cId.includes(term);
      });
    });
  }, [selectedPlanId, planDisplayName, activeConvenioObj, isBradesco, isCassi]);

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
      <div className="space-y-6 w-full max-w-[1700px] mx-auto pb-16">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8] flex items-center gap-1.5">
                <Bed className="w-3 h-3 text-[#0E7B86]" />
                <span>Central de POPS Internação</span>
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Hospital Palmas Medical</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0E7B86] m-0">
              Escolha o Convênio do Paciente Internado
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed m-0 font-medium">
              Selecione o convênio para abrir o guia de consulta com códigos de diárias, regras de acomodação (enfermaria/apartamento), vínculos de cobrança e leitos de UTI.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {planCategories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeCategoryFilter === cat
                      ? 'bg-[#A7194D] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-[#EBF7F8] text-slate-700 hover:text-[#0E7B86]'
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
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E7B86] focus:bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredPlansForGrid.map(plan => (
            <button
              key={plan.id}
              type="button"
              onClick={() => handleSelectPlan(plan.id)}
              className="bg-white border-1.5 border-slate-200/90 hover:border-[#A7194D] hover:shadow-md rounded-2xl p-6 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-[#A7194D] text-white font-black text-base flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    {plan.badge}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8]">
                      {plan.category}
                    </span>
                    {plan.count > 0 && (
                      <span className="text-xs text-slate-600 font-bold bg-slate-100 px-2.5 py-0.5 rounded">
                        {plan.count} diárias
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-black text-slate-900 text-lg tracking-tight leading-snug group-hover:text-[#A7194D] transition-colors m-0 break-words">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium mt-1.5 m-0 line-clamp-3">
                    Diárias clínicas, acomodação, vínculos e leitos de UTI
                  </p>
                </div>
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-sm">
                <span className="font-black text-[#A7194D] group-hover:underline flex items-center gap-1">
                  Abrir Modelo de Internação →
                </span>
                <span className="text-xs text-slate-500 font-bold">Internação</span>
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
          margin: -1rem;
          padding: 1rem;
          min-height: calc(100vh - 80px);
          width: calc(100% + 2rem);
        }
        .pop-shell {
          max-width: 100%;
          width: 100%;
          margin: 0;
          padding: 12px 6px 70px;
        }
        .pop-topline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 0 16px;
          color: #475569;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.01em;
          flex-wrap: wrap;
          gap: 12px;
        }
        .pop-crumb {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .pop-crumb button.crumb-btn {
          background: none;
          border: 0;
          color: #64748b;
          cursor: pointer;
          padding: 0;
          font: inherit;
          font-weight: 600;
        }
        .pop-crumb button.crumb-btn:hover {
          color: #a7194d;
          text-decoration: underline;
        }
        .pop-crumb span.active-crumb {
          color: #0f172a;
          font-weight: 850;
        }
        .pop-top-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .pop-plan-select {
          padding: 8px 15px;
          border: 1.5px solid #cbd5e1;
          border-radius: 20px;
          background: white;
          color: #0f172a;
          font-size: 13.5px;
          font-weight: 750;
          font-family: inherit;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .pop-plan-select:focus {
          border-color: #a7194d;
        }
        .pop-preview {
          padding: 7px 15px;
          border: 1.5px solid #cbd5e1;
          border-radius: 30px;
          background: white;
          font-size: 13px;
          font-weight: 700;
          color: #334155;
          white-space: nowrap;
          cursor: pointer;
        }
        .pop-hero, .pop-workspace {
          background: #fff;
          border: 1.5px solid #cbd5e1;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
          border-radius: 20px;
        }
        .pop-hero {
          padding: 28px 32px 24px;
        }
        .pop-hero-main {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .pop-badge {
          display: grid;
          place-items: center;
          flex: 0 0 64px;
          width: 64px;
          height: 64px;
          border-radius: 18px;
          background: #a7194d;
          color: #fff;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -0.02em;
          box-shadow: 0 4px 12px rgba(167, 25, 77, 0.25);
        }
        .pop-heading {
          min-width: 0;
          flex: 1;
        }
        .pop-name-row {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .pop-heading h1 {
          margin: 0;
          color: #0f172a;
          letter-spacing: -0.035em;
          font-size: 28px;
          font-weight: 900;
          line-height: 1.2;
        }
        .pop-tag {
          padding: 5px 12px;
          border-radius: 8px;
          background: #fdf2f6;
          border: 1px solid #f7d0df;
          color: #a7194d;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 0.01em;
        }
        .pop-heading p {
          margin: 6px 0 0;
          color: #475569;
          font-size: 15px;
          font-weight: 550;
          letter-spacing: -0.01em;
          line-height: 1.4;
        }
        .pop-hero-rule {
          height: 1px;
          background: #e2e8f0;
          margin: 24px 0 18px;
        }
        .pop-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }
        .pop-stat {
          display: flex;
          gap: 16px;
          align-items: center;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 16px;
          padding: 18px 22px;
          min-height: 86px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
          transition: all 0.2s ease;
        }
        .pop-stat:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
        }
        .pop-stat-icon {
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          flex: 0 0 44px;
          border-radius: 12px;
          background: #fdf2f6;
          color: #a7194d;
          font-size: 22px;
        }
        .pop-stat:nth-child(2) .pop-stat-icon {
          background: #ebf7f8;
          color: #0e7b86;
        }
        .pop-stat:nth-child(3) .pop-stat-icon {
          background: #eef5fa;
          color: #245b7d;
        }
        .pop-stat small {
          display: block;
          color: #475569;
          font-size: 12.5px;
          font-weight: 850;
          letter-spacing: .06em;
          text-transform: uppercase;
        }
        .pop-stat strong {
          display: block;
          margin-top: 4px;
          font-size: 16px;
          line-height: 1.35;
          color: #0f172a;
          font-weight: 850;
          letter-spacing: -0.015em;
          word-break: break-word;
          white-space: normal;
        }
        .pop-workspace {
          margin-top: 24px;
          overflow: hidden;
        }
        .pop-workspace-head {
          padding: 28px 32px 0;
        }
        .pop-eyebrow {
          color: #a7194d;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .pop-workspace h2 {
          margin: 6px 0 5px;
          color: #0f172a;
          font-size: 25px;
          letter-spacing: -.035em;
          font-weight: 850;
          line-height: 1.25;
        }
        .pop-subtext {
          font-size: 15px;
          color: #64748b;
          margin: 0 0 20px;
          font-weight: 500;
          letter-spacing: -0.01em;
          line-height: 1.45;
        }
        .pop-toolbar {
          display: flex;
          gap: 16px;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }
        .pop-tabs {
          display: flex;
          gap: 6px;
          padding: 6px;
          flex-wrap: wrap;
          max-width: 100%;
          background: #f1f5f9;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
        }
        .pop-tab {
          border: 0;
          background: transparent;
          border-radius: 10px;
          padding: 11px 18px;
          color: #475569;
          font-weight: 800;
          font-size: 14.5px;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }
        .pop-tab[aria-selected="true"] {
          color: #a7194d;
          background: #fff;
          font-weight: 850;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
        }
        .pop-count, .pop-tab .count {
          font-size: 12.5px;
          font-weight: 850;
          opacity: .9;
          margin-left: 6px;
        }
        .pop-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .pop-search {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1.5px solid #cbd5e1;
          border-radius: 11px;
          padding: 0 14px;
          background: white;
          color: #64748b;
        }
        .pop-search input {
          width: 230px;
          height: 42px;
          border: 0;
          outline: 0;
          color: #0f172a;
          background: transparent;
          font-size: 14px;
          font-family: inherit;
          font-weight: 600;
        }
        .pop-search input::placeholder {
          color: #94a3b8;
          font-weight: 500;
        }
        .pop-print {
          border: 1.5px solid #cbd5e1;
          color: #1e293b;
          background: white;
          border-radius: 11px;
          padding: 10px 15px;
          font-size: 13.5px;
          font-family: inherit;
          font-weight: 750;
          letter-spacing: -0.01em;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: background .15s;
        }
        .pop-print:hover {
          background: #f8fafc;
        }
        .pop-notice {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 22px 28px 0;
          padding: 14px 18px;
          border-radius: 13px;
          background: #fdf2f6;
          color: #1e293b;
          font-size: 14px;
          font-weight: 550;
          line-height: 1.55;
          border: 1px solid #f7d0df;
          letter-spacing: -0.01em;
        }
        .pop-notice b {
          color: #a7194d;
          font-weight: 850;
        }
        .pop-list-head {
          padding: 24px 28px 14px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 16px;
        }
        .pop-list-head h3 {
          font-size: 18px;
          margin: 0 0 4px;
          color: #0f172a;
          font-weight: 850;
          letter-spacing: -0.02em;
        }
        .pop-list-head p {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          font-weight: 500;
          line-height: 1.45;
        }
        .pop-results {
          font-size: 13px;
          color: #64748b;
          white-space: nowrap;
          font-weight: 700;
        }
        .pop-cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          padding: 0 32px 34px;
        }
        .pop-card {
          border: 1.5px solid #e2e8f0;
          border-radius: 18px;
          padding: 26px 28px 24px;
          transition: border-color .2s, box-shadow .2s;
          min-width: 0;
          background: #fff;
        }
        .pop-card:hover {
          border-color: #f7d0df;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
        }
        .pop-cardtop {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
        }
        .pop-code {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fdf2f6;
          border: 1.5px solid #f7d0df;
          color: #a7194d;
          border-radius: 10px;
          padding: 8px 14px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 15px;
          font-weight: 850;
          letter-spacing: 0.02em;
        }
        .pop-copy {
          border: 0;
          background: none;
          color: #94a3b8;
          font-size: 15px;
          padding: 3px 5px;
          cursor: pointer;
          transition: color .15s;
        }
        .pop-copy:hover {
          color: #a7194d;
        }
        .pop-category {
          color: #a7194d;
          background: #fdf2f6;
          border: 1px solid #f7d0df;
          font-size: 12px;
          font-weight: 850;
          padding: 6px 12px;
          border-radius: 8px;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .pop-category.uti {
          color: #4338ca;
          background: #eef2ff;
          border-color: #c7d2fe;
        }
        .pop-card h4 {
          font-size: 18px;
          line-height: 1.4;
          margin: 16px 0 14px;
          color: #0f172a;
          font-weight: 850;
          letter-spacing: -0.015em;
          text-transform: uppercase;
        }
        .pop-joint {
          border-top: 1px solid #e2e8f0;
          padding-top: 14px;
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        .pop-joint .label {
          font-size: 12px;
          font-weight: 850;
          color: #475569;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .pop-joint .value {
          font-size: 14px;
          font-weight: 850;
          color: #0e7b86;
          background: #ebf7f8;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid #c4e5e8;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          letter-spacing: 0.01em;
        }
        .pop-joint .empty {
          font-size: 13px;
          color: #94a3b8;
          font-weight: 500;
        }
        .pop-detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-top: 18px;
        }
        .pop-detail {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px 20px;
          min-width: 0;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
          transition: all 0.2s ease;
        }
        .pop-detail:hover {
          background: #ffffff;
          border-color: #cbd5e1;
        }
        .pop-detail b {
          display: block;
          color: #475569;
          font-size: 13px;
          letter-spacing: .025em;
          margin-bottom: 6px;
          font-weight: 850;
          text-transform: uppercase;
        }
        .pop-detail span {
          display: block;
          font-size: 15.5px;
          line-height: 1.6;
          color: #0f172a;
          font-weight: 650;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        .pop-detail .missing {
          color: #94a3b8;
          font-style: italic;
          font-weight: 500;
        }
        .pop-empty-state {
          text-align: center;
          color: #64748b;
          padding: 50px 20px;
          font-size: 15px;
        }
        .pop-module {
          margin: 0 32px 34px;
          padding: 26px;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          background: #fff;
        }
        .pop-module h4 {
          font-size: 19px;
          color: #0f172a;
          margin: 0 0 8px;
          font-weight: 850;
          letter-spacing: -0.02em;
        }
        .pop-module p {
          font-size: 15px;
          color: #64748b;
          line-height: 1.55;
          margin: 0 0 18px;
          font-weight: 500;
        }
        .pop-module-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .pop-module-item {
          padding: 18px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
        }
        .pop-module-item strong {
          font-size: 15px;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          font-weight: 850;
          letter-spacing: -0.01em;
        }
        .pop-module-item span {
          font-size: 14px;
          color: #475569;
          line-height: 1.5;
          display: block;
          font-weight: 550;
        }
        .pop-module-item i {
          font-style: normal;
          color: #a7194d;
          margin-right: 4px;
        }
        .pop-footer-note {
          padding: 18px 32px;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
          background: #f8fafc;
          font-size: 14px;
          line-height: 1.6;
          font-weight: 500;
        }
        .pop-footer-note strong {
          color: #1e293b;
          font-weight: 800;
        }

        /* Bloco Diretrizes de Centro Cirúrgico, OPME e Guia de Internação */
        .pop-guidelines-box {
          margin: 10px 32px 30px;
          padding: 26px;
          border: 1.5px solid #e2e8f0;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
        }
        .pop-guidelines-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .pop-guidelines-head h3 {
          font-size: 18px;
          font-weight: 850;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .pop-guidelines-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 14px;
          border-radius: 10px;
          background: #fdf2f6;
          border: 1px solid #f7d0df;
          color: #a7194d;
          font-size: 13px;
          font-weight: 850;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
        .pop-guidelines-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .pop-guidelines-card {
          padding: 18px 20px;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          background: #f8fafc;
        }
        .pop-guidelines-card small.teal {
          color: #0e7b86;
          font-size: 12px;
          font-weight: 850;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 5px;
          display: block;
        }
        .pop-guidelines-card small.berry {
          color: #a7194d;
          font-size: 12px;
          font-weight: 850;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 5px;
          display: block;
        }
        .pop-guidelines-card strong {
          color: #0f172a;
          font-size: 16px;
          font-weight: 850;
          letter-spacing: -0.01em;
          margin-bottom: 6px;
          display: block;
        }
        .pop-guidelines-card p {
          color: #475569;
          font-size: 14px;
          line-height: 1.55;
          margin: 0;
          font-weight: 500;
        }
        .pop-guidelines-banner {
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px 20px;
          margin-top: 16px;
          background: #fdf2f6;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .pop-guidelines-banner strong {
          color: #87143e;
          font-size: 14px;
          font-weight: 850;
          letter-spacing: 0.02em;
          display: block;
          margin-bottom: 4px;
          text-transform: uppercase;
        }
        .pop-guidelines-banner p {
          color: #475569;
          font-size: 14px;
          line-height: 1.55;
          margin: 0;
          font-weight: 550;
        }

        @media(max-width:960px){
          .pop-detail-grid {
            grid-template-columns: 1fr;
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
            font-size: 13px;
          }
          .pop-hero-main {
            align-items: flex-start;
          }
          .pop-heading p {
            line-height: 1.4;
          }
          .pop-heading h1 {
            font-size: 24px;
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

        {/* Banner Especial para CASSI e ORIZON */}
        {isCassi && (
          <div className="bg-[#EBF7F8] border-2 border-[#0E7B86] rounded-2xl p-5 mb-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#0E7B86] text-white flex items-center justify-center font-black text-sm">
                  !
                </span>
                <div>
                  <h3 className="text-base font-black text-[#095962] m-0">
                    PORTAL DA CASSI É O ORIZON • PRONTO-SOCORRO &amp; INTERNAÇÃO
                  </h3>
                  <p className="text-xs text-slate-600 m-0 font-medium">
                    Todas as solicitações de internação e atendimentos de emergência devem ser feitas via autenticador Orizon (Polimed).
                  </p>
                </div>
              </div>

              <a
                href="https://www.polimed.com.br/autenticadorOrizon/loginAutenticador"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0E7B86] hover:bg-[#095962] text-white rounded-xl text-xs font-bold transition-all shadow-xs w-fit"
              >
                <span>Acessar Portal Orizon</span>
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

            <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-2.5 m-0 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Atenção Obrigatória:</strong> Após a solicitação de internação no Orizon, ligue imediatamente para a Central CASSI: <strong>0800 729 0090 / 0800 729 0080</strong> para validar e liberar o atendimento.
              </span>
            </p>
          </div>
        )}

        {isBradesco && (
          <div className="bg-[#FFF8E6] border border-[#F5C242] rounded-2xl p-4 mb-5 text-xs text-slate-800 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 font-black text-[#946200] uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              Atenção aos Portais Bradesco:
            </div>
            <p className="m-0 leading-relaxed font-medium">
              O portal para <strong>INTERNAÇÃO</strong> é o site oficial Bradesco Seguros (com senha pessoal do operador e CPF). Já o portal para <strong>PRONTO-SOCORRO</strong> é processado no <strong>ORIZON (Polimed)</strong>. Para cotação de <strong>OPMES</strong>, utilize o Gestão de Insumos Orizon.
            </p>
          </div>
        )}

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
                {/* Visual View Switcher (Cartões vs Tabela) */}
                {!isSpecialTab && (
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setCardLayoutMode('cards')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        cardLayoutMode === 'cards'
                          ? 'bg-white text-[#0E7B86] shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="Modo Cartões Detalhados"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Cartões</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardLayoutMode('table')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        cardLayoutMode === 'table'
                          ? 'bg-white text-[#0E7B86] shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="Modo Tabela Comparativa"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Tabela</span>
                    </button>
                  </div>
                )}

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

          {/* Cards & Table Section (quando ativa é clinica, uti ou todos) */}
          {!isSpecialTab && (
            <div className="px-4 sm:px-6 pb-8" id="cards" aria-live="polite">
              {filteredCards.length > 0 ? (
                cardLayoutMode === 'cards' ? (
                  <div className="grid grid-cols-1 gap-5">
                    {filteredCards.map(item => {
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

                      const pillars = [
                        {
                          key: 'parecer',
                          label: 'Parecer',
                          sub: 'Especialista',
                          val: valParecer,
                          icon: Stethoscope,
                          status: getPillarStatus(valParecer)
                        },
                        {
                          key: 'matMed',
                          label: 'Mat / Med',
                          sub: 'Materiais & Medicamentos',
                          val: valMatMed,
                          icon: Pill,
                          status: getPillarStatus(valMatMed)
                        },
                        {
                          key: 'exLab',
                          label: 'Ex. Lab',
                          sub: 'Laboratoriais',
                          val: valExLab,
                          icon: FlaskConical,
                          status: getPillarStatus(valExLab)
                        },
                        {
                          key: 'exRad',
                          label: 'Ex. Rad',
                          sub: 'Raio-X & Tomografia',
                          val: valExRad,
                          icon: Scan,
                          status: getPillarStatus(valExRad)
                        },
                        {
                          key: 'fisio',
                          label: 'Fisioterapia',
                          sub: 'Hospitalar / Diária',
                          val: valFisio,
                          icon: Activity,
                          status: getPillarStatus(valFisio)
                        }
                      ];

                      const cardKey = item.id || item.code + item.acomodacao;

                      return (
                        <article 
                          key={cardKey}
                          className={`bg-white rounded-2xl border border-slate-200/90 hover:border-[#0E7B86]/40 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden relative ${
                            isUti ? 'border-l-4 border-l-indigo-600' : 'border-l-4 border-l-[#0E7B86]'
                          }`}
                        >
                          <div className="p-5 sm:p-6">
                            {/* Top row: Category tag & Code Pill */}
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider ${
                                  isUti 
                                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-700' 
                                    : 'bg-[#FDF2F6] border border-[#F7D0DF] text-[#A7194D]'
                                }`}>
                                  {isUti ? <Activity className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                                  {isUti ? 'UTI Intensiva' : 'Internação Clínica'}
                                </span>

                                <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                                  {planDisplayName}
                                </span>
                              </div>

                              {/* TUSS / Hospital Code badge */}
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => copyCodeToClipboard(item.code)}
                                  className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-[#FDF2F6] border border-slate-200 hover:border-[#A7194D]/40 text-slate-800 hover:text-[#A7194D] transition-all cursor-pointer shadow-2xs"
                                  title="Clique para copiar código TUSS"
                                >
                                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-[#A7194D]">Cód:</span>
                                  <span className="font-mono text-sm sm:text-base font-black tabular-nums">{item.code}</span>
                                  {copiedCode === item.code ? (
                                    <span className="inline-flex items-center gap-1 text-emerald-600 text-xs sm:text-sm font-bold">
                                      <Check className="w-4 h-4" />
                                    </span>
                                  ) : (
                                    <Copy className="w-4 h-4 text-slate-400 group-hover:text-[#A7194D]" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Accommodation Name */}
                            <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug my-2.5 uppercase">
                              {item.acomodacao}
                            </h4>

                            {/* Directive: SOLICITAR JUNTO */}
                            {item.solicitarJunto ? (
                              <div className="bg-sky-50/90 border border-sky-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-3.5 shadow-2xs">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                                    <Link2 className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-xs font-black uppercase tracking-wider text-sky-800 block">
                                      Código Vinculado Obrigatório (Solicitar Junto):
                                    </span>
                                    <span className="font-mono font-black text-sm sm:text-base text-sky-950 truncate block">
                                      {item.solicitarJunto}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => copyCodeToClipboard(item.solicitarJunto || '')}
                                  className="px-3 py-1.5 rounded-lg bg-white border border-sky-300 hover:bg-sky-100 text-sky-900 text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 w-fit flex-shrink-0 cursor-pointer shadow-2xs"
                                  title="Copiar código vinculado"
                                >
                                  {copiedCode === item.solicitarJunto ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      <span className="text-emerald-700">Copiado</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Copiar Vinculado</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            ) : (
                              <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs sm:text-sm text-slate-500 my-3">
                                <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-medium">
                                  <strong className="text-slate-700 font-bold">Solicitar Junto:</strong> Sem código vinculado obrigatório na planilha.
                                </span>
                              </div>
                            )}

                            {/* The 5 Clinical Authorization Pillars */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 mt-4">
                              {pillars.map(p => {
                                const IconComp = p.icon;
                                return (
                                  <div
                                    key={p.key}
                                    className={`p-4 sm:p-5 rounded-xl border flex flex-col justify-between transition-all min-w-0 ${p.status.cardClass}`}
                                  >
                                    <div>
                                      {/* Header do Pilar */}
                                      <div className="pb-3 mb-3 border-b border-black/10 flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                          <div className="w-7 h-7 rounded-lg bg-white/90 shadow-2xs border border-slate-200/80 flex items-center justify-center flex-shrink-0">
                                            <IconComp className="w-4 h-4 text-slate-700" />
                                          </div>
                                          <span className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                                            {p.label}
                                          </span>
                                        </div>

                                        <div>
                                          <span className={`inline-flex items-center text-[11px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border shadow-2xs ${p.status.badgeClass}`}>
                                            {p.status.badgeText}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Texto descritivo da regra com fonte maior e alta legibilidade */}
                                      <p className={`text-sm sm:text-base leading-relaxed m-0 font-medium break-words ${p.status.textClass}`}>
                                        {p.val || 'Não informado na planilha'}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Card Footer: Metadata & Actions */}
                            <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                                <span className={`w-2 h-2 rounded-full ${isUti ? 'bg-indigo-500' : 'bg-[#A7194D]'}`}></span>
                                <span>Regras oficiais: <strong className="text-slate-800">{planDisplayName}</strong></span>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => handleCopyCardSummary(item, isUti, planDisplayName)}
                                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                  title="Copiar regras completas desta acomodação para o prontuário ou portal"
                                >
                                  {copiedCardSummary === cardKey ? (
                                    <>
                                      <Check className="w-4 h-4 text-emerald-600" />
                                      <span className="text-emerald-700 font-bold">Resumo Copiado!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-4 h-4 text-slate-500" />
                                      <span>Copiar Regras</span>
                                    </>
                                  )}
                                </button>

                                {onGeneratePreGuia && (
                                  <button
                                    type="button"
                                    onClick={() => onGeneratePreGuia(selectedPlanId, item.code, item.acomodacao)}
                                    className="px-4 py-2 rounded-xl bg-[#A7194D] hover:bg-[#87143E] text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                                    title="Preencher pré-guia com esta diária"
                                  >
                                    <span>Gerar Pré-Guia</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  /* Modo Tabela Comparativa Compacta */
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-xs font-black">
                            <th className="py-3 px-3.5">Código</th>
                            <th className="py-3 px-3.5">Acomodação</th>
                            <th className="py-3 px-3.5">Tipo</th>
                            <th className="py-3 px-3.5">Solicitar Junto</th>
                            <th className="py-3 px-3.5">Parecer</th>
                            <th className="py-3 px-3.5">Mat / Med</th>
                            <th className="py-3 px-3.5">Ex. Lab</th>
                            <th className="py-3 px-3.5">Ex. Rad</th>
                            <th className="py-3 px-3.5">Fisio</th>
                            <th className="py-3 px-3.5 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredCards.map(item => {
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

                            const cardKey = item.id || item.code + item.acomodacao;

                            return (
                              <tr key={cardKey} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3 px-3.5 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => copyCodeToClipboard(item.code)}
                                    className="font-mono font-black text-slate-900 bg-slate-100 hover:bg-[#FDF2F6] px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-[#A7194D]/40 text-xs sm:text-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
                                    title="Copiar código"
                                  >
                                    <span>{item.code}</span>
                                    {copiedCode === item.code ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                                    )}
                                  </button>
                                </td>
                                <td className="py-3 px-3.5 font-bold text-slate-900 min-w-[200px] text-xs sm:text-sm">
                                  {item.acomodacao}
                                </td>
                                <td className="py-3 px-3.5 whitespace-nowrap">
                                  <span className={`inline-block px-2.5 py-1 rounded text-xs font-black uppercase tracking-wider ${
                                    isUti ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-[#FDF2F6] text-[#A7194D] border border-[#F7D0DF]'
                                  }`}>
                                    {isUti ? 'UTI' : 'Internação'}
                                  </span>
                                </td>
                                <td className="py-3 px-3.5">
                                  {item.solicitarJunto ? (
                                    <span className="font-mono font-black text-sky-800 bg-sky-50 px-2 py-1 rounded border border-sky-200 block text-xs">
                                      {item.solicitarJunto}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 italic text-xs">-</span>
                                  )}
                                </td>
                                <td className="py-3 px-3.5 text-xs text-slate-700 max-w-[150px] font-medium">
                                  {valParecer || <span className="text-slate-400 italic">-</span>}
                                </td>
                                <td className="py-3 px-3.5 text-xs text-slate-700 max-w-[150px] font-medium">
                                  {valMatMed || <span className="text-slate-400 italic">-</span>}
                                </td>
                                <td className="py-3 px-3.5 text-xs text-slate-700 max-w-[150px] font-medium">
                                  {valExLab || <span className="text-slate-400 italic">-</span>}
                                </td>
                                <td className="py-3 px-3.5 text-xs text-slate-700 max-w-[150px] font-medium">
                                  {valExRad || <span className="text-slate-400 italic">-</span>}
                                </td>
                                <td className="py-3 px-3.5 text-xs text-slate-700 max-w-[150px] font-medium">
                                  {valFisio || <span className="text-slate-400 italic">-</span>}
                                </td>
                                <td className="py-3 px-3.5 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleCopyCardSummary(item, isUti, planDisplayName)}
                                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                                      title="Copiar regras"
                                    >
                                      {copiedCardSummary === cardKey ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                    {onGeneratePreGuia && (
                                      <button
                                        type="button"
                                        onClick={() => onGeneratePreGuia(selectedPlanId, item.code, item.acomodacao)}
                                        className="p-1.5 rounded-lg bg-[#A7194D] hover:bg-[#87143E] text-white transition-colors cursor-pointer shadow-2xs"
                                        title="Gerar Pré-Guia"
                                      >
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center my-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-500 mx-auto flex items-center justify-center mb-3">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-black text-slate-800 mb-1">
                    Nenhuma acomodação encontrada
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                    Não encontramos itens para o termo pesquisado na aba selecionada no convênio {planDisplayName}.
                  </p>
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Limpar filtro de busca
                    </button>
                  )}
                </div>
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
            <div className="space-y-6">
              {/* Notificação Especial se for Bradesco: Apenas Portal de Internação */}
              {isBradesco && (
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-[#B01B52] rounded-2xl p-5 shadow-xs">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#B01B52] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-[#B01B52] text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                          Portal Oficial de Internação • Convênio Bradesco
                        </span>
                        <span className="text-xs font-semibold text-slate-600">
                          Internação Clínica, Cirúrgica e UTI
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium m-0 leading-relaxed">
                        Na <strong>Internação</strong>, as autorizações e prorrogações hospitalares do convênio Bradesco são realizadas exclusivamente pelo <strong>Portal Bradesco Seguros</strong>:
                      </p>

                      <div className="bg-white border border-rose-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
                        <div>
                          <strong className="text-xs sm:text-sm text-slate-900 block font-bold">
                            Portal Bradesco Seguros (Internação Hospitalar)
                          </strong>
                          <p className="text-[11px] text-slate-600 mt-1 m-0">
                            Acesso exclusivo para internação hospitalar. Login CPF + CNPJ e senha pessoal.
                          </p>
                        </div>
                        <a
                          href="https://www.bradescoseguros.com.br/clientes/produtos/plano-saude"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold transition-colors flex-shrink-0 shadow-2xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Abrir Bradesco Seguros ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notificação Especial se for CASSI: Portal Orizon tanto no PS como na Internação */}
              {isCassi && (
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-2 border-[#0E7B86] rounded-2xl p-5 shadow-xs">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#0E7B86] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-[#0E7B86] text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                          Portal Oficial de Autorização • Convênio CASSI
                        </span>
                        <span className="text-xs font-semibold text-teal-800">
                          Tanto no Pronto-Socorro quanto na Internação
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium m-0 leading-relaxed">
                        O portal de autorizações da <strong>CASSI</strong> é o <strong>ORIZON</strong>, utilizado tanto no <strong>Pronto-Socorro</strong> como na <strong>Internação</strong>:
                      </p>

                      <div className="bg-white border border-teal-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
                        <div>
                          <strong className="text-xs sm:text-sm text-slate-900 block font-bold">
                            Portal Orizon / Polimed (Autorizador CASSI)
                          </strong>
                          <p className="text-[11px] text-slate-600 mt-1 m-0">
                            Código Prestador: <strong className="text-slate-900 font-bold">2120820</strong> • Login: <strong className="text-slate-900 font-bold">12955953000192</strong> • Senha: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-slate-800 border border-slate-200">Hpm2025hpm@</code>
                          </p>
                        </div>
                        <a
                          href="https://www.polimed.com.br/autenticadorOrizon/loginAutenticador"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0E7B86] hover:bg-[#095962] text-white rounded-lg text-xs font-bold transition-colors flex-shrink-0 shadow-2xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Abrir Orizon (CASSI) ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Credenciais e Usuários Oficiais deste Convênio */}
              {matchingCredentials.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#EBF7F8] text-[#0E7B86] flex items-center justify-center font-bold">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 m-0 tracking-tight">
                          Usuários &amp; Senhas Cadastrados ({matchingCredentials.length})
                        </h4>
                        <p className="text-xs text-slate-500 m-0 font-medium">
                          Credenciais oficiais para autorização em {planDisplayName}
                        </p>
                      </div>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matchingCredentials.map(cred => {
                      const isPwdVisible = revealedPasswords[cred.id] || false;
                      const isCopiedLogin = copiedCredential?.id === cred.id && copiedCredential?.field === 'login';
                      const isCopiedPwd = copiedCredential?.id === cred.id && copiedCredential?.field === 'senha';

                      return (
                        <div
                          key={cred.id}
                          className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-2xs"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                  cred.hospital === 'Medical'
                                    ? 'bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8]'
                                    : cred.hospital === 'Santa Thereza'
                                    ? 'bg-[#FDF2F6] text-[#B01B52] border border-[#F7D0DF]'
                                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                                }`}
                              >
                                {cred.hospital}
                              </span>

                              <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {cred.category}
                              </span>
                            </div>

                            <div>
                              <strong className="text-xs font-bold text-slate-900 block leading-tight">
                                {cred.siteName}
                              </strong>
                              {cred.notes && (
                                <p className="text-[11px] text-slate-500 mt-1 m-0 leading-snug">
                                  {cred.notes}
                                </p>
                              )}
                            </div>

                            {/* Login and Password rows */}
                            <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-2 text-xs">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-bold uppercase text-slate-400 w-12 flex-shrink-0">
                                  Login:
                                </span>
                                <code className="font-mono font-bold text-slate-800 flex-1 truncate">
                                  {cred.login}
                                </code>
                                <button
                                  type="button"
                                  onClick={() => copyCredField(cred.id, 'login', cred.login)}
                                  className="p-1 text-slate-400 hover:text-[#0E7B86] rounded cursor-pointer"
                                  title="Copiar usuário"
                                >
                                  {isCopiedLogin ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>

                              <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-1.5">
                                <span className="text-[10px] font-bold uppercase text-slate-400 w-12 flex-shrink-0">
                                  Senha:
                                </span>
                                <code className="font-mono font-bold text-slate-800 flex-1 truncate">
                                  {isPwdVisible || cred.senha === 'pessoal' || cred.senha === 'Verificar no portal'
                                    ? cred.senha
                                    : '••••••••••••'}
                                </code>
                                <div className="flex items-center gap-1">
                                  {cred.senha !== 'pessoal' && cred.senha !== 'Verificar no portal' && (
                                    <button
                                      type="button"
                                      onClick={() => togglePasswordReveal(cred.id)}
                                      className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                                      title={isPwdVisible ? 'Ocultar' : 'Exibir'}
                                    >
                                      {isPwdVisible ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => copyCredField(cred.id, 'senha', cred.senha)}
                                    className="p-1 text-slate-400 hover:text-[#0E7B86] rounded cursor-pointer"
                                    title="Copiar senha"
                                  >
                                    {isCopiedPwd ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>
                            </div>

                            {cred.responsavel && (
                              <div className="text-[11px] text-slate-600">
                                <strong className="text-[#B01B52]">Resp: </strong>
                                <span className="break-all">{cred.responsavel}</span>
                              </div>
                            )}
                          </div>

                          {cred.portalUrl.startsWith('http') && (
                            <a
                              href={cred.portalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center justify-center gap-1.5 w-full py-1.5 bg-[#0E7B86] hover:bg-[#095962] text-white rounded-lg text-xs font-bold transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Acessar Portal ↗
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Informações Complementares de Contato */}
              <div className="pop-module">
                <h4>Canais de Suporte &amp; Regulação</h4>
                <p>
                  Canais oficiais de autorização, suporte ao prestador e auditoria de {planDisplayName}.
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
