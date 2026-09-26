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
  Ambulance,
  Stethoscope, 
  TestTube2, 
  Scan, 
  Building2, 
  Phone, 
  Mail, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ShieldAlert,
  Table,
  LayoutGrid,
  ArrowRight,
  ArrowLeft,
  XCircle,
  FileCheck2,
  Syringe,
  Activity,
  FileSpreadsheet,
  Layers
} from 'lucide-react';
import { 
  SERVIR_DATA, 
  CONVENIOS_MASTER_LIST,
  POPS_PS_MATRIX_DATA,
  POPS_PS_INSTITUTIONAL_HEADER,
  GEAP_COVID_INFLUENZA_EXAMS
} from '../data/popsData';
import { PORTAIS_CREDENCIAIS, PortalCredential } from '../data/portaisData';

interface PopsPsViewerProps {
  onOpenAiWithPrompt?: (prompt: string) => void;
  onGeneratePreGuia?: (convenio: string, code?: string, desc?: string) => void;
  initialPlanId?: string;
}

type PsActiveTab = 'atendimento' | 'exames' | 'token' | 'portal';

export const PopsPsViewer: React.FC<PopsPsViewerProps> = ({
  onOpenAiWithPrompt,
  onGeneratePreGuia,
  initialPlanId
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId || '');
  const [viewMode, setViewMode] = useState<'matrix' | 'grid' | 'details'>(initialPlanId ? 'details' : 'matrix');
  const [activeTab, setActiveTab] = useState<PsActiveTab>('atendimento');
  const [query, setQuery] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [planSearch, setPlanSearch] = useState<string>('');
  const [matrixSearch, setMatrixSearch] = useState<string>('');
  const [matrixFilter, setMatrixFilter] = useState<'all' | 'pacotes' | 'padrao' | 'capa-tasy' | 'sim-autorizar' | 'nao'>('all');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('Todos');
  const [revealedPasswords, setRevealedPasswords] = useState<{ [id: string]: boolean }>({});
  const [copiedCredential, setCopiedCredential] = useState<{ id: string; field: 'login' | 'senha' } | null>(null);

  const togglePasswordReveal = (id: string) => {
    setRevealedPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyCredField = (id: string, field: 'login' | 'senha', text: string) => {
    if (!text || text === 'Verificar no portal' || text.includes('Não se aplica')) return;
    navigator.clipboard.writeText(text);
    setCopiedCredential({ id, field });
    setTimeout(() => setCopiedCredential(null), 1800);
  };

  const copyCodeToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1300);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    if (initialPlanId) {
      setSelectedPlanId(initialPlanId);
      setViewMode('details');
      setActiveTab('atendimento');
      setQuery('');
    } else {
      setViewMode('grid');
    }
  }, [initialPlanId]);

  const planCategories = ['Todos', 'Autogestão', 'Seguradora', 'Privado', 'Militar', 'Estadual'];

  // Lista mestra completa de convênios do PS ordenada estritamente A-Z
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
        pacotePs: c.pacotePs || 'Consulta Pronto-Socorro',
        labUrgencia: c.labUrgencia || 'Conforme pedido médico',
        imagemUrgencia: c.imagemUrgencia || 'Solicitar Autorização'
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
        imagemUrgencia: 'RX e RM Inclusos no Pacote (Sem autorização)'
      });
    }

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
    );
  }, []);

  const filteredPlansForGrid = useMemo(() => {
    return fullPlansList.filter(p => {
      const matchCat = activeCategoryFilter === 'Todos' || 
        (activeCategoryFilter === 'Autogestão' && p.category.toLowerCase().includes('autogest')) ||
        (activeCategoryFilter === 'Militar' && p.category.toLowerCase().includes('militar')) ||
        (activeCategoryFilter === 'Seguradora' && p.category.toLowerCase().includes('seguradora')) ||
        (activeCategoryFilter === 'Privado' && p.category.toLowerCase().includes('privad')) ||
        (activeCategoryFilter === 'Estadual' && p.category.toLowerCase().includes('estadual'));

      const matchSearch = !planSearch || 
        p.name.toLowerCase().includes(planSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(planSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(planSearch.toLowerCase());

      return matchCat && matchSearch;
    });
  }, [fullPlansList, activeCategoryFilter, planSearch]);

  const activeConvenioObj = useMemo(() => {
    if (!selectedPlanId) return null;
    if (selectedPlanId === 'SERVIR') return null;
    return CONVENIOS_MASTER_LIST.find(c => 
      c.id.toUpperCase() === selectedPlanId.toUpperCase() ||
      c.name.toUpperCase().includes(selectedPlanId.toUpperCase())
    ) || null;
  }, [selectedPlanId]);

  const planDisplayName = selectedPlanId === 'SERVIR' 
    ? 'SERVIR (Plano de Saúde TO)' 
    : (activeConvenioObj?.name || selectedPlanId || 'Convênio');
  const planCategory = selectedPlanId === 'SERVIR' 
    ? 'Estadual' 
    : (activeConvenioObj?.category || 'Autogestão');
  const planBadge = selectedPlanId === 'SERVIR' 
    ? 'SE' 
    : (activeConvenioObj?.badge || selectedPlanId.slice(0, 2).toUpperCase());

  const isCassi = selectedPlanId.toUpperCase().includes('CASSI') || planDisplayName.toUpperCase().includes('CASSI');
  const isServir = selectedPlanId.toUpperCase() === 'SERVIR' || planDisplayName.toUpperCase().includes('SERVIR');

  // Credenciais vinculadas ao convênio para a aba Portal
  const matchingCredentials = useMemo(() => {
    const rawTerms = [
      selectedPlanId.toLowerCase(),
      planDisplayName.toLowerCase(),
      activeConvenioObj?.id?.toLowerCase() || '',
      activeConvenioObj?.name?.toLowerCase() || ''
    ].filter(Boolean);

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
  }, [selectedPlanId, planDisplayName, activeConvenioObj, isCassi]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setViewMode('details');
    setActiveTab('atendimento');
    setQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Contadores para abas
  const counts = useMemo(() => {
    if (isServir) {
      const servirBlocks = SERVIR_DATA['Pronto-Socorro'] || [];
      const rowsCount = servirBlocks.reduce((acc, curr) => acc + (curr.rows?.length || 0), 0);
      return {
        atendimento: rowsCount,
        exames: 2,
        token: 1,
        portal: 1
      };
    }
    const psSection = activeConvenioObj?.sections?.ps;
    const itemsCount = (psSection?.procedures?.length || 0) + (psSection?.textItems?.length || 0) + 1;
    return {
      atendimento: itemsCount,
      exames: 2,
      token: activeConvenioObj?.sections?.token ? 2 : 1,
      portal: matchingCredentials.length > 0 ? matchingCredentials.length : 1
    };
  }, [isServir, activeConvenioObj, matchingCredentials]);

  // ==========================================
  // FILTRAGEM DA TABELA MATRIZ OFICIAL (29 CONVÊNIOS)
  // ==========================================
  const filteredMatrixData = useMemo(() => {
    return POPS_PS_MATRIX_DATA.filter(item => {
      const q = matrixSearch.toLowerCase().trim();
      const matchSearch = !q || 
        item.convenio.toLowerCase().includes(q) ||
        (item.pacotePsAdulto && item.pacotePsAdulto.includes(q)) ||
        (item.pacotePsPediatria && item.pacotePsPediatria.includes(q)) ||
        (item.pacotePsGeral && item.pacotePsGeral.toLowerCase().includes(q)) ||
        item.examesLaboratoriais.toLowerCase().includes(q) ||
        (item.imagemPacoteCapaTasy && item.imagemPacoteCapaTasy.toLowerCase().includes(q));

      if (!matchSearch) return false;

      if (matrixFilter === 'pacotes') {
        return Boolean(item.pacotePsAdulto || item.pacotePsPediatria || (item.pacotePsGeral && item.pacotePsGeral !== '10101039'));
      }
      if (matrixFilter === 'padrao') {
        return item.pacotePsGeral === '10101039';
      }
      if (matrixFilter === 'capa-tasy') {
        return Boolean(item.imagemPacoteCapaTasy && item.imagemPacoteCapaTasy !== '—');
      }
      if (matrixFilter === 'sim-autorizar') {
        return item.examesLaboratoriais.includes('AUTORIZAR');
      }
      if (matrixFilter === 'nao') {
        return item.examesLaboratoriais === 'NÃO';
      }

      return true;
    });
  }, [matrixSearch, matrixFilter]);

  // ==========================================
  // VIEW 1: TABELA MATRIZ OFICIAL DO PRONTO-SOCORRO
  // (DOCUMENTO MATRIZ: 29 CONVÊNIOS, CBO 225125, CAPA TASY)
  // ==========================================
  if (viewMode === 'matrix') {
    return (
      <div className="space-y-6 w-full max-w-[1700px] mx-auto pb-16">
        {/* Switcher de Visão: Matriz Oficial vs Cards */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-black transition-all cursor-pointer bg-[#0E7B86] text-white shadow-xs"
            >
              <Table className="w-4 h-4" />
              <span>Tabela Matriz Oficial (29 Convênios)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Modelos em Cards (Por Plano)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Imprimir Matriz</span>
            </button>
            {onOpenAiWithPrompt && (
              <button
                type="button"
                onClick={() => onOpenAiWithPrompt('Quais convênios possuem pacotes e exames inclusos no Pronto-Socorro?')}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#B01B52] text-white rounded-xl text-xs font-bold hover:bg-[#8e1542] transition-colors cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Perguntar à IA</span>
              </button>
            )}
          </div>
        </div>

        {/* Cabeçalho Institucional Oficial */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8] flex items-center gap-1.5">
                  <Ambulance className="w-3 h-3 text-[#0E7B86]" />
                  <span>Matriz Oficial de Convênios do Pronto-Socorro</span>
                </span>
                <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-[11px] font-bold text-slate-700">
                  CNPJ: 12.955.953/0001-92
                </span>
                <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-[11px] font-bold text-slate-700">
                  CBO Clínico Geral: 225125
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight m-0">
                RELAÇÃO DE CONVÊNIOS PARA REALIZAÇÃO DE EXAMES LABORATORIAIS | CÓDIGOS PACOTES PS | EXAMES IMAGEM PACOTE IMPRIMIR CAPA TASY
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 m-0 font-medium">
                Tabela de diretrizes rápidas para liberação, conferência de pacotes de urgência e impressão de capa Tasy na recepção do PS.
              </p>
            </div>
          </div>

          {/* Banner das 5 Especialidades de Sobreaviso */}
          <div className="bg-gradient-to-r from-teal-50 via-cyan-50 to-sky-50 border border-teal-200 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#0E7B86] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0E7B86] block">
                  Diretriz Médica de Retaguarda
                </span>
                <span className="text-sm font-black text-slate-900">
                  ESPECIALIDADES DE SOBREAVISO NO PS:
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {POPS_PS_INSTITUTIONAL_HEADER.especialidadesSobreavisoPs.map(esp => (
                <span 
                  key={esp} 
                  className="px-2.5 py-1 bg-white border border-teal-200/90 rounded-lg text-xs font-black text-slate-800 shadow-2xs flex items-center gap-1"
                >
                  <Activity className="w-3 h-3 text-[#0E7B86]" />
                  <span>{esp}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Caixa Amarela Oficial: GEAP Influenza e COVID */}
          <div className="bg-amber-50/90 border-2 border-amber-300 rounded-xl p-4 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-amber-200/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center flex-shrink-0 font-black shadow-xs">
                  ⚠️
                </div>
                <div>
                  <h3 className="text-sm font-black text-amber-950 uppercase tracking-tight m-0">
                    Códigos exames Influenza e covid para convênio Geap
                  </h3>
                  <p className="text-xs text-amber-800 font-semibold m-0">
                    No convênio GEAP é obrigatório autorizar previamente no PS os seguintes códigos para exames respiratórios:
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-amber-200/70 border border-amber-400 rounded-md text-[11px] font-black text-amber-950 self-start md:self-auto">
                SIM AUTORIZAR COVID E INFLUENZA
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-3">
              {GEAP_COVID_INFLUENZA_EXAMS.map(item => (
                <div 
                  key={item.code} 
                  className="bg-white border border-amber-200 rounded-lg p-2.5 flex items-center justify-between gap-2 shadow-2xs hover:border-amber-400 transition-colors"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-xs font-black text-slate-900 bg-amber-100/70 px-1.5 py-0.5 rounded border border-amber-200">
                      {item.code}
                    </span>
                    <p className="text-[11px] font-bold text-slate-700 mt-1 truncate m-0" title={item.description}>
                      {item.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCodeToClipboard(item.code)}
                    className="p-1.5 text-slate-500 hover:text-amber-800 hover:bg-amber-50 rounded transition-colors cursor-pointer flex-shrink-0"
                    title="Copiar código TUSS"
                  >
                    {copiedCode === item.code ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Barra de Filtros e Busca da Tabela */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: 'all', label: `Todos (${POPS_PS_MATRIX_DATA.length})` },
              { id: 'pacotes', label: `Pacotes Exclusivos (${POPS_PS_MATRIX_DATA.filter(i => Boolean(i.pacotePsAdulto || i.pacotePsPediatria || (i.pacotePsGeral && i.pacotePsGeral !== '10101039'))).length})` },
              { id: 'padrao', label: `Padrão 10101039 (${POPS_PS_MATRIX_DATA.filter(i => i.pacotePsGeral === '10101039').length})` },
              { id: 'capa-tasy', label: `Capa TASY Imagem (${POPS_PS_MATRIX_DATA.filter(i => Boolean(i.imagemPacoteCapaTasy && i.imagemPacoteCapaTasy !== '—')).length})` },
              { id: 'sim-autorizar', label: `Sim Autorizar (${POPS_PS_MATRIX_DATA.filter(i => i.examesLaboratoriais.includes('AUTORIZAR')).length})` },
              { id: 'nao', label: `Não Atende Lab (${POPS_PS_MATRIX_DATA.filter(i => i.examesLaboratoriais === 'NÃO').length})` }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setMatrixFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  matrixFilter === f.id
                    ? 'bg-[#0E7B86] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-[#EBF7F8] text-slate-700 hover:text-[#0E7B86]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar por convênio ou código..."
              value={matrixSearch}
              onChange={e => setMatrixSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E7B86] focus:bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Tabela Matriz Interativa dos 29 Convênios */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px] font-black">
                  <th className="py-3 px-4 sm:px-6">Convênios</th>
                  <th className="py-3 px-4 sm:px-6">Exames Laboratoriais (Urgência / Emergência)</th>
                  <th className="py-3 px-4 sm:px-6">Códigos Pacotes PS (CBO 225125)</th>
                  <th className="py-3 px-4 sm:px-6">Exames Imagem Pacote (Imprimir Capa TASY)</th>
                  <th className="py-3 px-4 text-center">Modelo Detalhado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMatrixData.map((item, idx) => {
                  const hasPacote = Boolean(item.pacotePsAdulto || item.pacotePsPediatria || item.pacotePsGeral);
                  const hasCapaTasy = Boolean(item.imagemPacoteCapaTasy && item.imagemPacoteCapaTasy !== '—');

                  return (
                    <tr 
                      key={item.id || item.convenio}
                      className={`hover:bg-slate-50/80 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                    >
                      {/* Coluna 1: Nome do Convênio */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#0E7B86] text-white flex items-center justify-center font-black text-xs shadow-2xs flex-shrink-0">
                            {item.convenio.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-black text-slate-900 block text-sm">
                              {item.convenio}
                            </span>
                            {hasCapaTasy && (
                              <span className="text-[10px] font-black text-cyan-700 bg-cyan-50 px-1.5 py-0.2 rounded border border-cyan-200 inline-block mt-0.5">
                                Imprime Capa TASY
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Coluna 2: Exames Laboratoriais */}
                      <td className="py-3.5 px-4 sm:px-6">
                        {item.examesLaboratoriais === 'SIM' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                            <span>SIM</span>
                          </span>
                        ) : item.examesLaboratoriais === 'NÃO' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>NÃO ATENDE NO PS</span>
                          </span>
                        ) : item.examesLaboratoriais === 'SIM AUTORIZAR COVID E INFLUENZA' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                            <span>SIM AUTORIZAR COVID E INFLUENZA</span>
                          </span>
                        ) : item.examesLaboratoriais.includes('AUTORIZAR') ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>SIM AUTORIZAR</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold">—</span>
                        )}
                      </td>

                      {/* Coluna 3: Códigos Pacotes PS */}
                      <td className="py-3.5 px-4 sm:px-6">
                        {hasPacote ? (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            {item.pacotePsAdulto && (
                              <button
                                type="button"
                                onClick={() => copyCodeToClipboard(item.pacotePsAdulto!)}
                                className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md font-mono text-xs font-black text-slate-900 transition-colors cursor-pointer"
                                title="Clique para copiar código Adulto"
                              >
                                <span className="text-slate-900 font-bold">{item.pacotePsAdulto}</span>
                                <span className="text-[10px] uppercase font-bold text-slate-500">ADULTO</span>
                                {copiedCode === item.pacotePsAdulto ? (
                                  <Check className="w-3 h-3 text-emerald-600 font-bold" />
                                ) : (
                                  <Copy className="w-3 h-3 text-slate-400" />
                                )}
                              </button>
                            )}

                            {item.pacotePsPediatria && (
                              <button
                                type="button"
                                onClick={() => copyCodeToClipboard(item.pacotePsPediatria!)}
                                className="inline-flex items-center gap-1.5 px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-md font-mono text-xs font-black text-rose-800 transition-colors cursor-pointer"
                                title="Clique para copiar código Pediatria"
                              >
                                <span className="text-rose-700 font-black">{item.pacotePsPediatria}</span>
                                <span className="text-[10px] uppercase font-black text-rose-600">PEDIATRIA</span>
                                {copiedCode === item.pacotePsPediatria ? (
                                  <Check className="w-3 h-3 text-emerald-600 font-bold" />
                                ) : (
                                  <Copy className="w-3 h-3 text-rose-400" />
                                )}
                              </button>
                            )}

                            {item.pacotePsGeral && (
                              <button
                                type="button"
                                onClick={() => copyCodeToClipboard(item.pacotePsGeral!)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-xs font-black transition-colors cursor-pointer ${
                                  item.pacotePsGeral === '10101039'
                                    ? 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900'
                                    : 'bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-900'
                                }`}
                                title={`Clique para copiar código ${item.pacotePsGeral}`}
                              >
                                <span>{item.pacotePsGeral}</span>
                                {item.pacotePsGeral === '10101039' && (
                                  <span className="text-[10px] uppercase font-bold text-slate-500">CONSULTA</span>
                                )}
                                {copiedCode === item.pacotePsGeral ? (
                                  <Check className="w-3 h-3 text-emerald-600 font-bold" />
                                ) : (
                                  <Copy className={`w-3 h-3 ${item.pacotePsGeral === '10101039' ? 'text-slate-400' : 'text-teal-600'}`} />
                                )}
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => copyCodeToClipboard('10101039')}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md font-mono text-xs font-black text-slate-900 transition-colors cursor-pointer"
                            title="Clique para copiar código padrão 10101039"
                          >
                            <span>10101039</span>
                            <span className="text-[10px] uppercase font-bold text-slate-500">CONSULTA</span>
                            {copiedCode === '10101039' ? (
                              <Check className="w-3 h-3 text-emerald-600 font-bold" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-400" />
                            )}
                          </button>
                        )}
                      </td>

                      {/* Coluna 4: Exames Imagem Pacote (Imprimir Capa TASY) */}
                      <td className="py-3.5 px-4 sm:px-6">
                        {hasCapaTasy ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black bg-cyan-50 text-cyan-800 border border-cyan-300 shadow-2xs">
                            <Printer className="w-3.5 h-3.5 text-cyan-600" />
                            <span>{item.imagemPacoteCapaTasy}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">— (Solicitar autorização)</span>
                        )}
                      </td>

                      {/* Coluna 5: Ação / Modelo */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleSelectPlan(item.convenio)}
                          className="px-2.5 py-1 text-xs font-bold text-[#0E7B86] hover:text-white bg-[#EBF7F8] hover:bg-[#0E7B86] border border-[#C4E5E8] rounded-md transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Guia</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rodapé Oficial: Alertas e Regras Institucionais */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2.5 shadow-2xs">
          <div className="flex items-start gap-2 text-xs font-bold text-slate-800">
            <span className="text-base leading-none">⚠️</span>
            <span>
              <strong>Exames de imagem e laboratório que não são pacotes:</strong> É obrigatório solicitar autorização com o convênio antes da realização!
            </span>
          </div>

          <div className="flex items-start gap-2 text-xs font-bold text-slate-800">
            <span className="text-base leading-none">✍️</span>
            <span>
              <strong>Assinatura Obrigatória:</strong> Colher assinatura do paciente ou responsável em todas as <strong>GUIAS AUTORIZADAS</strong> e nas fichas de atendimentos. Na Internação sempre que ocorrer!!
            </span>
          </div>

          <div className="flex items-start gap-2 text-xs font-bold text-[#0E7B86]">
            <span className="text-base leading-none">🩺</span>
            <span>
              <strong>ESPECIALIDADES DE SOBREAVISO NO PS:</strong> Urologista, Cardiologista, Nefrologista, Neurologista e Neurocirurgião.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: SELETOR DE CONVÊNIOS EM GRID (PS)
  // ==========================================
  if (viewMode === 'grid') {
    return (
      <div className="space-y-6 w-full max-w-[1700px] mx-auto pb-16">
        {/* Switcher de Visão: Matriz Oficial vs Cards */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all cursor-pointer"
            >
              <Table className="w-4 h-4" />
              <span>Tabela Matriz Oficial (29 Convênios)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-black transition-all cursor-pointer bg-[#0E7B86] text-white shadow-xs"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Modelos em Cards (Por Plano)</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8] flex items-center gap-1.5">
                <Ambulance className="w-3 h-3 text-[#0E7B86]" />
                <span>Central de POPS Pronto-Socorro</span>
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Hospital Palmas Medical • Urgência 24h</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0E7B86] m-0">
              Escolha o Convênio do Paciente (Pronto-Socorro)
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed m-0">
              Selecione o convênio para abrir o guia operacional com pacotes de atendimento de urgência, exames liberados, regras de imagem e validação de token no balcão do PS.
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
                      ? 'bg-[#0E7B86] text-white shadow-xs'
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
                placeholder="Buscar convênio do Pronto-Socorro..."
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
              className="bg-white border-1.5 border-slate-200/90 hover:border-[#0E7B86] hover:shadow-md rounded-2xl p-6 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-[#0E7B86] text-white font-black text-base flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    {plan.badge}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8]">
                      {plan.category}
                    </span>
                    <span className="text-xs text-slate-600 font-bold bg-slate-100 px-2.5 py-0.5 rounded">
                      PS 24h
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-black text-slate-900 text-lg tracking-tight leading-snug group-hover:text-[#0E7B86] transition-colors m-0 break-words">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium mt-1.5 m-0 line-clamp-3">
                    {plan.pacotePs || 'Consulta e procedimentos de emergência'}
                  </p>
                </div>
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-sm">
                <span className="font-black text-[#0E7B86] group-hover:underline flex items-center gap-1">
                  Abrir Modelo de Pronto-Socorro →
                </span>
                <span className="text-xs text-slate-500 font-bold">Urgência</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: MODELO VISUAL IDÊNTICO AO POPS INTERNAÇÃO
  // (COM AS REGRAS E DADOS EXCLUSIVOS DO PRONTO-SOCORRO)
  // ==========================================
  const statPacote = isServir 
    ? '10101037 / 10101038' 
    : (activeConvenioObj?.pacotePs || 'Consulta PS');
  const statLab = isServir 
    ? 'Incluso no pacote' 
    : (activeConvenioObj?.labUrgencia || 'Conforme pedido médico');
  const statImagem = isServir 
    ? 'RX e RM Inclusos no Pacote (Sem autorização)' 
    : (activeConvenioObj?.imagemUrgencia || 'Solicitar Autorização');

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
          color: #0e7b86;
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
          border-color: #0e7b86;
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
          background: #0e7b86;
          color: #fff;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -0.02em;
          box-shadow: 0 4px 12px rgba(14, 123, 134, 0.25);
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
          background: #e8f8fa;
          border: 1px solid #bee6ec;
          color: #0e7b86;
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
          background: #ebf7f8;
          color: #0e7b86;
          font-size: 22px;
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
          color: #0e7b86;
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
          color: #0e7b86;
          background: #fff;
          font-weight: 850;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
        }
        .pop-count {
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
          background: #f1f9fb;
          color: #1e293b;
          font-size: 14px;
          font-weight: 550;
          line-height: 1.55;
          border: 1px solid #c4e5e8;
          letter-spacing: -0.01em;
        }
        .pop-notice b {
          color: #0e7b86;
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
          border-color: #93c5fd;
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
          background: #f0f7f8;
          border: 1.5px solid #c4e5e8;
          color: #0e7b86;
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
          color: #0e7b86;
        }
        .pop-category {
          color: #0e7b86;
          background: #ebf7f8;
          border: 1px solid #c4e5e8;
          font-size: 12px;
          font-weight: 850;
          padding: 6px 12px;
          border-radius: 8px;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .pop-category.urgencia {
          color: #0e7b86;
          background: #ebf7f8;
          border: 1px solid #c4e5e8;
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
        .pop-detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
          margin-top: 18px;
        }
        .pop-detail {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px 22px;
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
              Pronto-Socorro
            </button>
            <span>›</span>
            <span className="active-crumb">{planDisplayName}</span>
          </div>

          <div className="pop-top-actions">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className="pop-preview hover:border-[#0e7b86] hover:text-[#0e7b86] transition-colors cursor-pointer"
            >
              ← Todos os Convênios
            </button>

            <select
              value={selectedPlanId}
              onChange={e => handleSelectPlan(e.target.value)}
              className="pop-plan-select"
              title="Trocar Convênio"
            >
              {fullPlansList.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>

            <span className="pop-preview">Modelo Pronto-Socorro</span>
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
              <p>Pronto-Socorro, Pacotes de Urgência & Elegibilidade · Hospital Palmas Medical</p>
            </div>
          </div>

          <div className="pop-hero-rule"></div>

          {/* Stats Bar (Pronto-Socorro) */}
          <div className="pop-stats">
            <div className="pop-stat">
              <span className="pop-stat-icon" aria-hidden="true">✚</span>
              <div className="min-w-0">
                <small>PACOTE PRONTO-SOCORRO</small>
                <strong title={statPacote}>{statPacote}</strong>
              </div>
            </div>

            <div className="pop-stat">
              <span className="pop-stat-icon" aria-hidden="true">🧪</span>
              <div className="min-w-0">
                <small>EXAMES DE URGÊNCIA</small>
                <strong title={statLab}>{statLab}</strong>
              </div>
            </div>

            <div className="pop-stat">
              <span className="pop-stat-icon" aria-hidden="true">⚡</span>
              <div className="min-w-0">
                <small>RADIOLOGIA & IMAGEM</small>
                <strong title={statImagem}>{statImagem}</strong>
              </div>
            </div>
          </div>
        </header>

        {/* ========================================================= */}
        {/* BANNER OPERACIONAL EXCLUSIVO SERVIR NO PRONTO-SOCORRO */}
        {/* ========================================================= */}
        {isServir && (
          <div className="bg-[#FDF2F6] border-2 border-[#B01B52] rounded-2xl p-6 my-5 shadow-sm space-y-3">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#B01B52] text-white flex items-center justify-center font-black text-lg flex-shrink-0 mt-0.5 shadow-xs">
                !
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-black text-[#87143E] m-0">
                  REGRA DE EXAMES NO PRONTO-SOCORRO: RX E RM INCLUSOS NO PACOTE
                </h3>
                <p className="text-sm sm:text-base text-slate-900 m-0 font-bold leading-relaxed">
                  No SERVIR <strong className="text-[#87143E] underline">NÃO precisa pegar autorização para RX e RM</strong> pois o pacote já está incluso.
                </p>
                <p className="text-sm sm:text-base text-[#B01B52] m-0 font-black leading-relaxed">
                  ⚠️ OBRIGATÓRIO: PEGAR ASSINATURA NA GUIA E COLOCAR A CAPA JUNTOS.
                </p>
                <p className="text-xs text-slate-500 m-0 font-semibold">
                  * Esta orientação aplica-se exclusivamente ao POPS de Pronto-Socorro.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* BANNER ESPECIAL CASSI NO PRONTO-SOCORRO */}
        {/* ========================================================= */}
        {isCassi && (
          <div className="bg-[#EBF7F8] border-2 border-[#0E7B86] rounded-2xl p-6 my-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#0E7B86] text-white flex items-center justify-center font-black text-base flex-shrink-0">
                  !
                </span>
                <div>
                  <h3 className="text-lg font-black text-[#095962] m-0">
                    PORTAL DA CASSI É O ORIZON • PRONTO-SOCORRO
                  </h3>
                  <p className="text-sm text-slate-700 m-0 font-semibold">
                    Tanto no Pronto-Socorro como na Internação, utilize o autenticador Orizon (Polimed) para elegibilidade, consultas e exames.
                  </p>
                </div>
              </div>

              <a
                href="https://www.polimed.com.br/autenticadorOrizon/loginAutenticador"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E7B86] hover:bg-[#095962] text-white rounded-xl text-sm font-black transition-all shadow-xs w-fit"
              >
                <span>Acessar Portal Orizon</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-white/95 border-1.5 border-[#C4E5E8] rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-black text-slate-500 block text-xs uppercase tracking-wider">Código Prestador</span>
                <span className="font-mono font-black text-slate-900 text-base">2120820</span>
              </div>
              <div>
                <span className="font-black text-slate-500 block text-xs uppercase tracking-wider">Usuário Medical (CNPJ)</span>
                <span className="font-mono font-black text-slate-900 text-base">12955953000192</span>
              </div>
              <div>
                <span className="font-black text-slate-500 block text-xs uppercase tracking-wider">Senha do Autorizador</span>
                <span className="font-mono font-black text-[#0E7B86] text-base">cassi@2025</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* WORKSPACE OPERACIONAL PRINCIPAL (IDÊNTICO AO INTERNAÇÃO) */}
        {/* ========================================================= */}
        <section className="pop-workspace" aria-label="Espaço de Diretrizes do Pronto-Socorro">
          <div className="pop-workspace-head">
            <span className="pop-eyebrow">CENTRAL OPERACIONAL • PRONTO-SOCORRO 24H</span>
            <h2>Diretrizes de Atendimento • {planDisplayName}</h2>
            <p className="pop-subtext">
              Protocolos de abertura de ficha de urgência, pacotes contratuais, exames laboratoriais/imagem e elegibilidade.
            </p>

            <div className="pop-toolbar">
              <div className="pop-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'atendimento'}
                  onClick={() => setActiveTab('atendimento')}
                  className="pop-tab"
                >
                  Pacote & Atendimento PS
                  <span className="pop-count">({counts.atendimento})</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'exames'}
                  onClick={() => setActiveTab('exames')}
                  className="pop-tab"
                >
                  Exames Liberados na Urgência
                  <span className="pop-count">({counts.exames})</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'token'}
                  onClick={() => setActiveTab('token')}
                  className="pop-tab"
                >
                  Validação de Token & Elegibilidade
                  <span className="pop-count">({counts.token})</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'portal'}
                  onClick={() => setActiveTab('portal')}
                  className="pop-tab"
                >
                  Portal, Acessos & Contatos
                  <span className="pop-count">({counts.portal})</span>
                </button>
              </div>

              <div className="pop-actions">
                <div className="pop-search">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Filtrar nesta visualização..."
                    aria-label="Filtrar diretrizes"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="pop-print"
                  title="Imprimir Protocolos do PS"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir POP</span>
                </button>

                {onOpenAiWithPrompt && (
                  <button
                    type="button"
                    onClick={() => onOpenAiWithPrompt(`Como funciona o atendimento de urgência, pacotes, exames e token no convênio ${planDisplayName}? Quais os alertas críticos para o Pronto-Socorro?`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0E7B86] to-[#095962] text-white hover:from-[#095962] hover:to-[#07474E] text-xs font-bold transition-all shadow-xs cursor-pointer"
                    title="Tirar dúvidas sobre este convênio com IA"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Dúvidas com IA</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Aviso rápido */}
          <div className="pop-notice">
            <Info className="w-4 h-4 text-[#176d82] flex-shrink-0" />
            <span>
              <b>Diretriz de Urgência:</b> Todos os atendimentos no Pronto-Socorro exigem confirmação biométrica ou token quando exigido pela operadora, e colheita obrigatória da assinatura do paciente ou responsável na guia física TISS.
            </span>
          </div>

          <div className="pop-list-head">
            <div>
              <h3>
                {activeTab === 'atendimento' && 'Pacote e Procedimentos de Urgência'}
                {activeTab === 'exames' && 'Exames de Urgência (Laboratório & Imagem)'}
                {activeTab === 'token' && 'Regras de Token & Validação Biométrica'}
                {activeTab === 'portal' && 'Acessos e Canais de Contato com a Operadora'}
              </h3>
              <p>
                {activeTab === 'atendimento' && `Relação contratual de consultas e procedimentos autorizados para ${planDisplayName}.`}
                {activeTab === 'exames' && `Diretrizes para realização de exames laboratoriais, radiografias e tomografias.`}
                {activeTab === 'token' && `Procedimentos no balcão de recepção para liberação e validação de elegibilidade.`}
                {activeTab === 'portal' && `Links diretos, credenciais de autorização e ramais da operadora.`}
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CONTEÚDO DA ABA 1: PACOTE & ATENDIMENTO PS */}
          {/* ========================================================= */}
          {activeTab === 'atendimento' && (
            <div className="pop-cards">
              {/* Caso Especial SERVIR */}
              {isServir ? (
                SERVIR_DATA['Pronto-Socorro']?.map((block, bIdx) => (
                  <div key={bIdx} className="pop-card">
                    <div className="pop-cardtop">
                      <span className="pop-code">
                        <Ambulance className="w-3.5 h-3.5 text-[#0E7B86]" />
                        <span>SERVIR-PS-0{bIdx + 1}</span>
                      </span>
                      <span className="pop-category urgencia">
                        {block.title.includes('Pacotes') ? 'PACOTE PS' : 'PROCEDIMENTO'}
                      </span>
                    </div>

                    <h4>{block.title}</h4>

                    {block.info && (
                      <p className="text-sm sm:text-base text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200/90 m-0 leading-relaxed font-semibold">
                        {block.info}
                      </p>
                    )}

                    {block.alerts && block.alerts.length > 0 && (
                      <div className="bg-[#FDF2F6] border border-[#F7D0DF] rounded-xl p-4 text-sm sm:text-base text-slate-900 space-y-2 mt-3.5">
                        {block.alerts.map((al, aIdx) => (
                          <div key={aIdx} className="flex items-start gap-2.5 break-words">
                            <Info className="w-5 h-5 text-[#B01B52] mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed font-black text-[#87143E]">{al}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {block.rows && block.rows.length > 0 && (
                      <div className="overflow-x-auto mt-4">
                        <table className="w-full text-left text-sm sm:text-base border-collapse">
                          <thead>
                            <tr className="border-b-2 border-slate-200 text-slate-500 font-black text-xs sm:text-sm uppercase tracking-wider">
                              <th className="py-3 px-3.5 w-40">Código TUSS</th>
                              <th className="py-3 px-3.5">Descrição do Procedimento</th>
                              <th className="py-3 px-3.5 text-right w-32">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {block.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3.5 px-3.5 font-mono font-black text-[#0E7B86] whitespace-nowrap text-sm sm:text-base">
                                  {row[0]}
                                </td>
                                <td className="py-3.5 px-3.5 text-slate-900 break-words leading-relaxed font-bold text-sm sm:text-base">
                                  {row[1]}
                                </td>
                                <td className="py-3.5 px-3.5 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => copyCodeToClipboard(row[0])}
                                      className="p-2 rounded-lg bg-slate-100 hover:bg-[#EBF7F8] text-slate-700 hover:text-[#0E7B86] transition-colors cursor-pointer"
                                      title="Copiar Código"
                                    >
                                      {copiedCode === row[0] ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                    {onGeneratePreGuia && (
                                      <button
                                        type="button"
                                        onClick={() => onGeneratePreGuia('SERVIR', row[0], row[1])}
                                        className="px-3 py-1.5 rounded-lg bg-[#FDF2F6] hover:bg-[#FCE7EF] text-[#B01B52] font-black text-xs transition-colors cursor-pointer"
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
                ))
              ) : (
                /* Demais Convênios */
                <>
                  {/* Card 1: Consulta & Pacote PS */}
                  <div className="pop-card">
                    <div className="pop-cardtop">
                      <span className="pop-code">
                        <Ambulance className="w-4 h-4 text-[#0E7B86]" />
                        <span>{activeConvenioObj?.pacotePs ? activeConvenioObj.pacotePs.split(' ')[0] : '10101039'}</span>
                      </span>
                      <span className="pop-category urgencia">PACOTE CONSULTA PS</span>
                    </div>

                    <h4>Atendimento Médico de Urgência & Emergência</h4>

                    <div className="pop-detail-grid">
                      <div className="pop-detail">
                        <b>Código Principal</b>
                        <span className="font-mono font-black text-[#0E7B86] text-sm sm:text-base">
                          {activeConvenioObj?.pacotePs || '10101039 - Consulta em Pronto-Socorro'}
                        </span>
                      </div>
                      <div className="pop-detail">
                        <b>Tipo de Cobertura</b>
                        <span className="font-bold text-slate-900 text-sm sm:text-base">
                          {activeConvenioObj?.category || 'Atendimento de Urgência 24h'}
                        </span>
                      </div>
                      <div className="pop-detail">
                        <b>Carência & Elegibilidade</b>
                        <span className="font-bold text-slate-900 text-sm sm:text-base">
                          {activeConvenioObj?.elegibilidadeRules || 'Validação obrigatória no portal/biometria'}
                        </span>
                      </div>
                    </div>

                    {activeConvenioObj?.criticalNotes && activeConvenioObj.criticalNotes.length > 0 && (
                      <div className="bg-[#FDF2F6] border border-[#F7D0DF] rounded-xl p-4 text-sm sm:text-base text-slate-900 space-y-2 mt-4">
                        <strong className="text-[#87143E] block uppercase tracking-wider text-xs font-black">
                          Avisos Importantes de Atendimento:
                        </strong>
                        {activeConvenioObj.criticalNotes.map((note, nIdx) => (
                          <div key={nIdx} className="flex items-start gap-2.5">
                            <span className="text-[#B01B52] font-black text-base">•</span>
                            <span className="leading-relaxed font-bold text-slate-800">{note}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card 2: Procedimentos Liberados na Urgência */}
                  {activeConvenioObj?.sections?.ps?.procedures && activeConvenioObj.sections.ps.procedures.length > 0 && (
                    <div className="pop-card">
                      <div className="pop-cardtop">
                        <span className="pop-code">
                          <Stethoscope className="w-4 h-4 text-[#0E7B86]" />
                          <span>PROCEDIMENTOS-PS</span>
                        </span>
                        <span className="pop-category urgencia">URGÊNCIA AMBULATORIAL</span>
                      </div>

                      <h4>Procedimentos de Urgência Amparados</h4>

                      <div className="overflow-x-auto mt-4">
                        <table className="w-full text-left text-sm sm:text-base border-collapse">
                          <thead>
                            <tr className="border-b-2 border-slate-200 text-slate-500 font-black text-xs sm:text-sm uppercase tracking-wider">
                              <th className="py-3 px-3.5 w-40">Código TUSS</th>
                              <th className="py-3 px-3.5">Descrição do Procedimento</th>
                              <th className="py-3 px-3.5 text-right w-32">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {activeConvenioObj.sections.ps.procedures.map((proc, pIdx) => (
                              <tr key={pIdx} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3.5 px-3.5 font-mono font-black text-[#0E7B86] whitespace-nowrap text-sm sm:text-base">
                                  {proc.code}
                                </td>
                                <td className="py-3.5 px-3.5 text-slate-900 break-words leading-relaxed font-bold text-sm sm:text-base">
                                  {proc.desc}
                                </td>
                                <td className="py-3.5 px-3.5 text-right">
                                  <button
                                    type="button"
                                    onClick={() => copyCodeToClipboard(proc.code)}
                                    className="p-2 rounded-lg bg-slate-100 hover:bg-[#EBF7F8] text-slate-700 hover:text-[#0E7B86] transition-colors cursor-pointer"
                                    title="Copiar Código"
                                  >
                                    {copiedCode === proc.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Card 3: Regras e Textos de Pronto-Socorro */}
                  {activeConvenioObj?.sections?.ps?.textItems && activeConvenioObj.sections.ps.textItems.length > 0 && (
                    <div className="pop-card">
                      <div className="pop-cardtop">
                        <span className="pop-code">
                          <FileText className="w-4 h-4 text-[#0E7B86]" />
                          <span>NORMAS-OPERACIONAIS</span>
                        </span>
                        <span className="pop-category">REGRAS DO PS</span>
                      </div>

                      <h4>Orientações e Normas do Pronto-Socorro</h4>

                      <ul className="space-y-2.5 text-sm sm:text-base text-slate-800 m-0 mt-3.5 pl-1 font-semibold leading-relaxed">
                        {activeConvenioObj.sections.ps.textItems.map((item, iIdx) => (
                          <li key={iIdx} className="flex items-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-[#0E7B86] mt-2 flex-shrink-0" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* CONTEÚDO DA ABA 2: EXAMES LIBERADOS NA URGÊNCIA */}
          {/* ========================================================= */}
          {activeTab === 'exames' && (
            <div className="pop-cards">
              {/* Card 1: Laboratório */}
              <div className="pop-card">
                <div className="pop-cardtop">
                  <span className="pop-code">
                    <TestTube2 className="w-4 h-4 text-[#0E7B86]" />
                    <span>LAB-URGENCIA</span>
                  </span>
                  <span className="pop-category urgencia">EXAMES LABORATORIAIS</span>
                </div>

                <h4>Exames Laboratoriais de Urgência no PS</h4>

                <div className="pop-detail-grid">
                  <div className="pop-detail">
                    <b>Regra de Liberação</b>
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {isServir ? 'Incluso no pacote' : (activeConvenioObj?.labUrgencia || 'Conforme pedido do médico assistente')}
                    </span>
                  </div>
                  <div className="pop-detail">
                    <b>Exames Comuns</b>
                    <span className="text-slate-800 font-semibold text-sm sm:text-base">
                      Hemograma, PCR, Ureia, Creatinina, Eletrólitos, Gasometria, Troponina e EAS.
                    </span>
                  </div>
                  <div className="pop-detail">
                    <b>Validação</b>
                    <span className="text-slate-800 font-semibold text-sm sm:text-base">
                      Carimbo e assinatura do médico na guia de urgência.
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Imagem (RX e RM) */}
              <div className="pop-card">
                <div className="pop-cardtop">
                  <span className="pop-code">
                    <Scan className="w-4 h-4 text-[#0E7B86]" />
                    <span>IMAGEM-URGENCIA</span>
                  </span>
                  <span className="pop-category">RADIOLOGIA & IMAGEM</span>
                </div>

                <h4>Exames de Radiologia, Ultrassom e Tomografia</h4>

                <div className="pop-detail-grid">
                  <div className="pop-detail">
                    <b>Status Contratual</b>
                    <span className="font-black text-[#0E7B86] text-sm sm:text-base">
                      {isServir ? 'RX e RM Inclusos no Pacote (Sem autorização)' : (activeConvenioObj?.imagemUrgencia || 'Solicitar Autorização')}
                    </span>
                  </div>
                  <div className="pop-detail">
                    <b>Diretriz Operacional</b>
                    <span className="text-slate-800 font-semibold text-sm sm:text-base">
                      {isServir 
                        ? 'Não precisa pegar autorização para RX e RM pois o pacote está incluso. Pegar assinatura na guia e colocar a capa juntos.'
                        : 'Radiografias e Tomografias liberadas amparadas pelo pedido médico do PS.'}
                    </span>
                  </div>
                  <div className="pop-detail">
                    <b>Requisito Mandatório</b>
                    <span className="font-black text-slate-900 text-sm sm:text-base">
                      {isServir ? 'Assinatura na Guia + Capa Juntos' : 'Laudo do médico assistente'}
                    </span>
                  </div>
                </div>

                {isServir && (
                  <div className="animate-alert-box border-2 rounded-xl p-4 text-sm sm:text-base text-slate-900 mt-4 flex items-start gap-2.5 font-bold text-[#87143E] shadow-sm">
                    <AlertTriangle className="w-5 h-5 text-[#B01B52] animate-alert-sign flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">Aviso Obrigatório SERVIR: NÃO precisa autorizar RX e RM no portal. Obrigatório colher assinatura na guia e anexar a capa do atendimento.</span>
                  </div>
                )}
              </div>

              {/* Passo a Passo se houver */}
              {activeConvenioObj?.sections?.exames?.steps && activeConvenioObj.sections.exames.steps.length > 0 && (
                <div className="pop-card">
                  <div className="pop-cardtop">
                    <span className="pop-code">
                      <FileText className="w-4 h-4 text-[#0E7B86]" />
                      <span>PASSO-A-PASSO</span>
                    </span>
                    <span className="pop-category urgencia">SOLICITAÇÃO DE EXAMES</span>
                  </div>

                  <h4>Fluxo de Solicitação de Exames no Autorizador</h4>

                  <div className="space-y-3 mt-4">
                    {activeConvenioObj.sections.exames.steps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200/90">
                        <div className="w-7 h-7 rounded-full bg-[#0E7B86] text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {sIdx + 1}
                        </div>
                        <p className="text-sm sm:text-base text-slate-900 m-0 leading-relaxed font-bold">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* CONTEÚDO DA ABA 3: VALIDAÇÃO DE TOKEN & ELEGIBILIDADE */}
          {/* ========================================================= */}
          {activeTab === 'token' && (
            <div className="pop-cards">
              <div className="pop-card">
                <div className="pop-cardtop">
                  <span className="pop-code">
                    <KeyRound className="w-4 h-4 text-[#0E7B86]" />
                    <span>TOKEN-VALIDACAO</span>
                  </span>
                  <span className="pop-category urgencia">BALCÃO DO PS</span>
                </div>

                <h4>Validação Biométrica e Token no Pronto-Socorro</h4>

                <div className="pop-detail-grid">
                  <div className="pop-detail">
                    <b>Exigência de Token</b>
                    <span className="font-black text-slate-900 text-sm sm:text-base">
                      {activeConvenioObj?.sections?.token?.steps ? 'Obrigatório no Atendimento' : 'Conforme sistema da operadora'}
                    </span>
                  </div>
                  <div className="pop-detail">
                    <b>Biometria Facial</b>
                    <span className="text-slate-800 font-semibold text-sm sm:text-base">
                      Obrigatório realizar conferência documental com foto do paciente.
                    </span>
                  </div>
                  <div className="pop-detail">
                    <b>Contingência</b>
                    <span className="text-slate-800 font-semibold text-sm sm:text-base">
                      {activeConvenioObj?.sections?.token?.contingency || 'Em caso de instabilidade, contatar central de autorização da operadora.'}
                    </span>
                  </div>
                </div>

                {activeConvenioObj?.sections?.token?.steps && (
                  <div className="space-y-3 mt-5 pt-4 border-t border-slate-100">
                    <span className="text-xs font-black uppercase text-slate-500 tracking-wider block">
                      Passo a Passo no Balcão de Recepção:
                    </span>
                    {activeConvenioObj.sections.token.steps.map((st, idx) => (
                      <div key={idx} className="flex items-start gap-3.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200/90 text-sm sm:text-base text-slate-900 font-semibold">
                        <span className="w-6 h-6 rounded-full bg-[#0E7B86] text-white flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{st}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* CONTEÚDO DA ABA 4: PORTAL, ACESSOS & CONTATOS */}
          {/* ========================================================= */}
          {activeTab === 'portal' && (
            <div className="pop-cards">
              {/* Card de Credenciais do Portal */}
              {matchingCredentials.length > 0 ? (
                matchingCredentials.map((cred, cIdx) => (
                  <div key={cIdx} className="pop-card">
                    <div className="pop-cardtop">
                      <span className="pop-code">
                        <Globe className="w-4 h-4 text-[#0E7B86]" />
                        <span>PORTAL-ACESSO</span>
                      </span>
                      <span className="pop-category urgencia">LOGIN & SENHA</span>
                    </div>

                    <h4>{cred.siteName}</h4>

                    <div className="pop-detail-grid">
                      <div className="pop-detail">
                        <b>Endereço do Portal</b>
                        <a
                          href={cred.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#0E7B86] hover:underline flex items-center gap-1.5 mt-1.5 truncate text-sm sm:text-base"
                        >
                          <span className="truncate">{cred.portalUrl}</span>
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                        </a>
                      </div>

                      <div className="pop-detail">
                        <div className="flex items-center justify-between mb-1.5">
                          <b>Login de Acesso</b>
                          <button
                            type="button"
                            onClick={() => copyCredField(cred.id, 'login', cred.login)}
                            className="text-xs font-black text-[#0E7B86] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            {copiedCredential?.id === cred.id && copiedCredential?.field === 'login' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>Copiar</span>
                          </button>
                        </div>
                        <span className="font-mono font-black text-slate-900 text-sm sm:text-base">
                          {cred.login}
                        </span>
                      </div>

                      <div className="pop-detail">
                        <div className="flex items-center justify-between mb-1.5">
                          <b>Senha de Acesso</b>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => togglePasswordReveal(cred.id)}
                              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                            >
                              {revealedPasswords[cred.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              <span>{revealedPasswords[cred.id] ? 'Ocultar' : 'Ver'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => copyCredField(cred.id, 'senha', cred.senha)}
                              className="text-xs font-black text-[#0E7B86] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              {copiedCredential?.id === cred.id && copiedCredential?.field === 'senha' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span>Copiar</span>
                            </button>
                          </div>
                        </div>
                        <span className="font-mono font-black text-[#0E7B86] text-sm sm:text-base">
                          {revealedPasswords[cred.id] ? cred.senha : '••••••••••••'}
                        </span>
                      </div>
                    </div>

                    {cred.notes && (
                      <p className="text-sm text-slate-700 font-semibold mt-3.5 m-0 bg-slate-50 p-3 rounded-xl border border-slate-200/90 leading-relaxed">
                        {cred.notes}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                /* Fallback Portal SERVIR ou Geral */
                <div className="pop-card">
                  <div className="pop-cardtop">
                    <span className="pop-code">
                      <Globe className="w-4 h-4 text-[#0E7B86]" />
                      <span>PORTAL-OPERADORA</span>
                    </span>
                    <span className="pop-category urgencia">ACESSO WEB</span>
                  </div>

                  <h4>
                    {isServir ? 'Portal do Prestador SERVIR (Fácil Informática)' : `Portal de Autorizações • ${planDisplayName}`}
                  </h4>

                  <div className="pop-detail-grid">
                    <div className="pop-detail">
                      <b>Portal Autorizador</b>
                      <a
                        href={isServir ? 'https://servir.facilinformatica.com.br' : (activeConvenioObj?.portalUrl || '#')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#0E7B86] hover:underline flex items-center gap-1.5 mt-1.5 truncate text-sm sm:text-base"
                      >
                        <span className="truncate">
                          {isServir ? 'https://servir.facilinformatica.com.br' : (activeConvenioObj?.portalUrl || 'Verificar portal')}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                      </a>
                    </div>

                    <div className="pop-detail">
                      <b>Usuário / CNPJ</b>
                      <span className="font-mono font-black text-slate-900 text-sm sm:text-base">
                        12955953000192 (Palmas Medical)
                      </span>
                    </div>

                    <div className="pop-detail">
                      <b>Senha Padrão</b>
                      <span className="font-mono font-black text-[#0E7B86] text-sm sm:text-base">
                        {isServir ? 'Medical@2025' : 'Hpm2025hpm@'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Card de Contatos Telefônicos */}
              {activeConvenioObj?.contact && (
                <div className="pop-card">
                  <div className="pop-cardtop">
                    <span className="pop-code">
                      <Phone className="w-4 h-4 text-[#0E7B86]" />
                      <span>CANAIS-SUPORTE</span>
                    </span>
                    <span className="pop-category">TELEFONES & E-MAILS</span>
                  </div>

                  <h4>Canais de Atendimento ao Prestador</h4>

                  <div className="pop-detail-grid">
                    {activeConvenioObj.contact.phone && (
                      <div className="pop-detail">
                        <b>Central Telefônica</b>
                        <span className="font-black text-slate-900 text-sm sm:text-base">{activeConvenioObj.contact.phone}</span>
                      </div>
                    )}
                    {activeConvenioObj.contact.support0800 && (
                      <div className="pop-detail">
                        <b>Suporte 0800</b>
                        <span className="font-black text-slate-900 text-sm sm:text-base">{activeConvenioObj.contact.support0800}</span>
                      </div>
                    )}
                    {activeConvenioObj.contact.email && (
                      <div className="pop-detail">
                        <b>E-mail de Autorização</b>
                        <span className="font-black text-[#0E7B86] text-sm sm:text-base">{activeConvenioObj.contact.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rodapé institucional */}
          <footer className="pop-footer-note">
            <strong>Hospital Palmas Medical • Urgência & Emergência 24 Horas:</strong> Todas as regras são atualizadas de acordo com as diretrizes contratuais vigentes. Em caso de dúvidas no plantão, consulte a supervisão de recepção.
          </footer>
        </section>
      </main>
    </div>
  );
};
