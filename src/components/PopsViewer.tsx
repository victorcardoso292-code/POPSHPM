import React, { useState, useMemo } from 'react';
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
  Layers,
  ArrowRight,
  Stethoscope,
  LayoutGrid,
  ChevronLeft
} from 'lucide-react';
import { ConvenioPop } from '../types';
import { SERVIR_DATA, CONVENIOS_MASTER_LIST } from '../data/popsData';
import { ConvenioCardGrid } from './ConvenioCardGrid';

interface PopsViewerProps {
  onOpenAiWithPrompt?: (prompt: string) => void;
  onGeneratePreGuia?: (convenio: string, code?: string, desc?: string) => void;
}

export const PopsViewer: React.FC<PopsViewerProps> = ({
  onOpenAiWithPrompt,
  onGeneratePreGuia
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('AMIL');
  const [planSearch, setPlanSearch] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('Todos');
  const [activeSectionId, setActiveSectionId] = useState<string>('ps');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'details'>('details');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Filter plans
  const planCategories = ['Todos', 'Autogestão', 'Seguradora', 'Privado', 'Militar', 'Estadual'];

  const allPlansList = useMemo(() => {
    const plans: { id: string; name: string; category: string; badge: string }[] = [
      { id: 'SERVIR', name: 'SERVIR (Plano de Saúde TO)', category: 'Estadual', badge: 'SE' },
      ...CONVENIOS_MASTER_LIST.map(c => ({
        id: c.id,
        name: c.name,
        category: c.category,
        badge: c.badge
      }))
    ];
    return plans.filter(p => {
      const matchCat = activeCategoryFilter === 'Todos' || p.category === activeCategoryFilter;
      const matchSearch = p.name.toLowerCase().includes(planSearch.toLowerCase()) || p.id.toLowerCase().includes(planSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [planSearch, activeCategoryFilter]);

  const activeConvenioObj = useMemo(() => {
    if (selectedPlanId === 'SERVIR') return null;
    return CONVENIOS_MASTER_LIST.find(c => c.id === selectedPlanId) || null;
  }, [selectedPlanId]);

  // Section keys for the currently selected plan
  const planSections = useMemo(() => {
    if (selectedPlanId === 'SERVIR') {
      return Object.keys(SERVIR_DATA).map(key => ({ id: key, label: key }));
    }
    if (!activeConvenioObj) return [];
    return Object.entries(activeConvenioObj.sections).map(([key, sec]) => ({
      id: key,
      label: (sec as any).label || key
    }));
  }, [selectedPlanId, activeConvenioObj]);

  // Make sure activeSectionId is valid
  React.useEffect(() => {
    if (planSections.length > 0) {
      if (!planSections.some(s => s.id === activeSectionId)) {
        setActiveSectionId(planSections[0].id);
      }
    }
  }, [selectedPlanId, planSections, activeSectionId]);

  return (
    <div className="space-y-5">
      {/* Top Banner & AI Prompt Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-800/60 rounded-2xl p-5 text-white shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-teal-400 bg-teal-950/80 border border-teal-700/50 px-2.5 py-0.5 rounded-full">
              Procedimentos Operacionais Padrão (POPs)
            </span>
            <span className="text-xs text-slate-300 font-medium">Hospital Palmas Medical</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white m-0">
            POP {activeConvenioObj?.name || selectedPlanId}
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed m-0">
            Consulte regras de elegibilidade, pacotes TUSS, autorização de exames de imagem e laboratoriais, critérios de UTI e internação.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenAiWithPrompt && (
            <button
              type="button"
              onClick={() => onOpenAiWithPrompt(`Como funciona o fluxo de autorização no convênio ${selectedPlanId}? Quais os principais códigos TUSS e regras de carência/token?`)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>Auditar Convênio com IA</span>
            </button>
          )}

          {activeConvenioObj?.portalUrl && (
            <a
              href={activeConvenioObj.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-teal-100 font-bold text-xs border border-teal-600/50 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Portal Operadora</span>
            </a>
          )}
        </div>
      </div>

      {/* Plan Selector Carousel / Chips */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {planCategories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategoryFilter === cat
                    ? 'bg-[#09473d] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick plan search input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar convênio..."
              value={planSearch}
              onChange={e => setPlanSearch(e.target.value)}
              className="w-full pl-9.5 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            />
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'grid' ? 'details' : 'grid')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>{viewMode === 'grid' ? 'Ver Detalhes do Convênio' : 'Expandir Grade de Convênios'}</span>
          </button>
          <span className="text-xs text-slate-500 font-medium">
            Convênio ativo: <strong className="text-slate-900">{activeConvenioObj?.name || selectedPlanId}</strong>
          </span>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base m-0">Todos os Convênios</h3>
            <span className="text-xs text-slate-500">Clique em qualquer convênio para abrir suas diretrizes</span>
          </div>
          <ConvenioCardGrid 
            plans={allPlansList}
            selectedPlanId={selectedPlanId}
            onSelectPlan={(id) => { setSelectedPlanId(id); setViewMode('details'); }}
            accentColor="teal"
          />
        </div>
      ) : null}

      {/* Sub-category Tabs for the selected Plan */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {planSections.map(sec => {
          const isActive = activeSectionId === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSectionId(sec.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* RENDER CONTENT FOR SERVIR */}
      {selectedPlanId === 'SERVIR' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(SERVIR_DATA[activeSectionId] || []).map((card, idx) => (
            <div
              key={idx}
              className={`bg-white border rounded-2xl p-5 shadow-sm space-y-3.5 ${
                card.full ? 'md:col-span-2' : ''
              } ${card.warning ? 'border-rose-200 bg-rose-50/30' : 'border-slate-200'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                    card.warning ? 'bg-rose-100 text-rose-700' : 'bg-teal-100 text-teal-800'
                  }`}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 m-0">
                      {card.title}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-semibold">POP SERVIR</span>
                  </div>
                </div>

                {onGeneratePreGuia && (
                  <button
                    type="button"
                    onClick={() => onGeneratePreGuia('SERVIR', card.rows[0]?.[0], card.rows[0]?.[1])}
                    className="text-[11px] font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1 rounded-lg flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Gerar Pré-Guia</span>
                  </button>
                )}
              </div>

              {card.info && (
                <div className="bg-teal-50/80 border-l-4 border-teal-600 p-3 rounded-r-xl text-xs text-teal-950 font-medium leading-relaxed">
                  {card.info}
                </div>
              )}

              {card.alerts && card.alerts.length > 0 && (
                <div className="space-y-1.5">
                  {card.alerts.map((al, aIdx) => (
                    <div key={aIdx} className="bg-rose-50 border border-rose-200 text-rose-900 p-3 rounded-xl text-xs font-semibold flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      <span>{al}</span>
                    </div>
                  ))}
                </div>
              )}

              {card.contacts && card.contacts.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {card.contacts.map((ct, cIdx) => (
                    <span
                      key={cIdx}
                      onClick={() => copyToClipboard(ct)}
                      className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer border border-slate-200 transition-colors"
                      title="Clique para copiar contato"
                    >
                      <Phone className="w-3 h-3 text-teal-600" />
                      <span>{ct}</span>
                      {copiedText === ct ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    </span>
                  ))}
                </div>
              )}

              {card.rows && card.rows.length > 0 && (
                <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 overflow-hidden bg-slate-50/40">
                  {card.rows.map((row, rIdx) => (
                    <div key={rIdx} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-teal-50/40 transition-colors">
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(row[0])}
                          className="font-mono text-xs font-black text-teal-800 bg-teal-100/70 hover:bg-teal-200 px-2 py-0.5 rounded border border-teal-200 flex items-center gap-1"
                          title="Clique para copiar código"
                        >
                          <span>{row[0]}</span>
                          {copiedText === row[0] ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                        </button>
                        <span className="text-xs text-slate-800 font-medium leading-tight">
                          {row[1]}
                        </span>
                      </div>
                      {row[2] && (
                        <span className="text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 self-end sm:self-center">
                          {row[2]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* RENDER CONTENT FOR OTHER CONVÊNIOS */}
      {selectedPlanId !== 'SERVIR' && activeConvenioObj && (
        <div className="space-y-4">
          {/* Overview KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Exames Laboratoriais PS
              </span>
              <b className={`text-base block mt-1 ${
                activeConvenioObj.labUrgencia.includes('NÃO') ? 'text-rose-600' : 'text-teal-700'
              }`}>
                {activeConvenioObj.labUrgencia}
              </b>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Código / Pacote PS
              </span>
              <b className="text-base text-slate-800 block mt-1 font-mono font-bold truncate">
                {activeConvenioObj.pacotePs || 'Conforme POP'}
              </b>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Exames de Imagem PS
              </span>
              <b className="text-base text-slate-800 block mt-1">
                {activeConvenioObj.imagemUrgencia}
              </b>
            </div>
          </div>

          {/* Critical Alerts Banner */}
          {activeConvenioObj.criticalNotes && activeConvenioObj.criticalNotes.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-4 space-y-2 text-amber-950 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Pontos Críticos de Atenção Institucional</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-xs font-semibold">
                {activeConvenioObj.criticalNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Selected Section Details */}
          {activeConvenioObj.sections[activeSectionId] && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                    {activeConvenioObj.name} • Rotina Operacional
                  </span>
                  <h3 className="text-lg font-black text-slate-900 m-0">
                    {activeConvenioObj.sections[activeSectionId].label}
                  </h3>
                </div>

                {onGeneratePreGuia && (
                  <button
                    type="button"
                    onClick={() => onGeneratePreGuia(activeConvenioObj.name)}
                    className="text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 px-3.5 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Emitir Pré-Guia TISS</span>
                  </button>
                )}
              </div>

              {/* Steps Flow if available */}
              {activeConvenioObj.sections[activeSectionId].steps && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Passo a Passo do Fluxo
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {activeConvenioObj.sections[activeSectionId].steps!.map((step, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 rounded-full bg-teal-700 text-white font-black text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-teal-900">Etapa {idx + 1}</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium m-0 leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Text list items */}
              {activeConvenioObj.sections[activeSectionId].textItems && (
                <div className="space-y-2">
                  {activeConvenioObj.sections[activeSectionId].textItems!.map((item, idx) => (
                    <div key={idx} className="bg-teal-50/50 border border-teal-100 p-3 rounded-xl text-xs text-slate-800 font-medium flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Codes Grid if available */}
              {activeConvenioObj.sections[activeSectionId].codes && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Códigos TUSS & Pacotes
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeConvenioObj.sections[activeSectionId].codes!.map((codeItem, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 border border-slate-200 hover:border-teal-300 p-3 rounded-xl flex items-start justify-between gap-3 transition-colors"
                      >
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(codeItem.code)}
                            className="font-mono text-xs font-black text-teal-800 bg-teal-100/70 hover:bg-teal-200 px-2 py-0.5 rounded border border-teal-200 inline-flex items-center gap-1"
                            title="Copiar código"
                          >
                            <span>{codeItem.code}</span>
                            {copiedText === codeItem.code ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                          </button>
                          <p className="text-xs text-slate-800 font-semibold m-0 leading-tight">
                            {codeItem.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Access & Credentials Section */}
          {activeConvenioObj.accessCredentials && activeConvenioObj.accessCredentials.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm border-b border-slate-100 pb-2.5">
                <Building2 className="w-4 h-4 text-teal-700" />
                <span>Credenciais e Acessos ao Portal ({activeConvenioObj.name})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {activeConvenioObj.accessCredentials.map((cred, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                      {cred[0]}
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-800 font-mono truncate">
                        {cred[1]}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(cred[1])}
                        className="text-slate-400 hover:text-teal-700 p-1 rounded"
                        title="Copiar credencial"
                      >
                        {copiedText === cred[1] ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contacts Section */}
          {activeConvenioObj.contacts && activeConvenioObj.contacts.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Contatos & Telefones Úteis da Operadora
              </span>
              <div className="flex flex-wrap gap-2">
                {activeConvenioObj.contacts.map((ct, idx) => (
                  <span
                    key={idx}
                    onClick={() => copyToClipboard(ct)}
                    className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-800 text-xs px-3 py-1.5 rounded-xl font-medium cursor-pointer hover:border-teal-400 transition-colors shadow-2xs"
                  >
                    <Phone className="w-3 h-3 text-teal-600" />
                    <span>{ct}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
