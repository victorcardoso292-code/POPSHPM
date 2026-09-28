import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Building2, 
  Ambulance, 
  Stethoscope, 
  FileText, 
  Printer, 
  ExternalLink, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  KeyRound, 
  Bed, 
  HeartPulse, 
  Baby, 
  Activity, 
  Zap,
  Info,
  Sparkles,
  ArrowRight,
  PhoneCall,
  Table,
  LayoutGrid,
  HelpCircle,
  Phone,
  Mail,
  AlertCircle,
  FileCheck,
  Eye,
  Syringe,
  FlaskConical
} from 'lucide-react';
import { 
  PLANOS_COBERTURA_COMPLETA, 
  PlanoCoberturaCompleta, 
  ExameStatusDetalhe, 
  REGRA_GERAL_PLANILHAS 
} from '../data/planosCoberturaCompletaData';

interface CoberturaConveniosViewerProps {
  onNavigateToPops?: (mode: 'pops-ps' | 'pops-internacao', planId?: string) => void;
  onNavigateToContingencia?: () => void;
  initialPlanId?: string;
}

type ViewMode = 'cards' | 'pagina-plano' | 'tabela-geral';
type TabsDisplayMode = 'scrollable' | 'grid';

export const CoberturaConveniosViewer: React.FC<CoberturaConveniosViewerProps> = ({
  onNavigateToPops,
  onNavigateToContingencia,
  initialPlanId
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId || 'BRADESCO');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [tabsDisplayMode, setTabsDisplayMode] = useState<TabsDisplayMode>('scrollable');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Sync if initialPlanId changes from parent
  React.useEffect(() => {
    if (initialPlanId) {
      setSelectedPlanId(initialPlanId);
      setViewMode('pagina-plano');
    }
  }, [initialPlanId]);

  const categories = ['TODAS', 'Seguradora', 'Autogestão', 'Estadual / Regional', 'Militar', 'Privado', 'Clínica / Cartão', 'Público'];

  // Filtered list of plans for the tab bar / selector
  const filteredPlans = useMemo(() => {
    return PLANOS_COBERTURA_COMPLETA.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        p.nome.toLowerCase().includes(q) ||
        p.nomeExibicao.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q) ||
        p.psAdulto.toLowerCase().includes(q) ||
        p.uti.toLowerCase().includes(q) ||
        p.ambulancia.toLowerCase().includes(q) ||
        p.observacoesGerais.some(o => o.toLowerCase().includes(q)) ||
        Object.values(p.exames).some(e => e.descricao.toLowerCase().includes(q) || (e.codigo && e.codigo.includes(q)));

      const matchesCat = selectedCategory === 'TODAS' || p.categoria.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  // Selected plan data
  const currentPlan: PlanoCoberturaCompleta = useMemo(() => {
    const found = PLANOS_COBERTURA_COMPLETA.find(p => p.id === selectedPlanId);
    if (found) return found;
    return filteredPlans[0] || PLANOS_COBERTURA_COMPLETA[0];
  }, [selectedPlanId, filteredPlans]);

  // Index navigation
  const currentIndex = PLANOS_COBERTURA_COMPLETA.findIndex(p => p.id === currentPlan.id);
  const handlePrevPlan = () => {
    const prevIdx = (currentIndex - 1 + PLANOS_COBERTURA_COMPLETA.length) % PLANOS_COBERTURA_COMPLETA.length;
    setSelectedPlanId(PLANOS_COBERTURA_COMPLETA[prevIdx].id);
  };
  const handleNextPlan = () => {
    const nextIdx = (currentIndex + 1) % PLANOS_COBERTURA_COMPLETA.length;
    setSelectedPlanId(PLANOS_COBERTURA_COMPLETA[nextIdx].id);
  };

  const handleCopyResumoPlano = (p: PlanoCoberturaCompleta) => {
    const linhas: string[] = [
      `=== COBERTURA CONVÊNIO: ${p.nomeExibicao} (${p.categoria}) ===`,
      `Situação: ${p.situacao}`,
      `Santa Thereza PA: ${p.santaThereza.prontoAtendimento}`,
      `Santa Thereza Internação: ${p.santaThereza.internacao}`,
      `Consulta Eletiva: ${p.consultaEletiva}`,
      `PS Adulto: ${p.psAdulto}`,
      `PS Infantil: ${p.psInfantil}`,
      `UTI: ${p.uti}`,
      `RM: ${p.exames.rm.descricao}`,
      `TC: ${p.exames.tc.descricao}`,
      `Raio-X: ${p.exames.raioX.descricao}`,
      `Colonoscopia: ${p.exames.colonoscopia.descricao}`,
      `Retossigmoidoscopia: ${p.exames.retossigmoidoscopia.descricao}`,
      `Endoscopia: ${p.exames.endoscopia.descricao}`,
      `USG: ${p.exames.usg.descricao}`,
      `ECO / Parecer / Risco: ${p.exames.eco.descricao}`,
      `Laboratório: ${p.laboratorio}`,
      `Oftalmologia: ${p.oftalmologia}`,
      `Mamografia: ${p.mamografia}`,
      `Quimioterapia: ${p.quimioterapia}`,
      `Hemodiálise: ${p.hemodialise}`,
      `Ambulância: ${p.ambulancia}`,
      `Observações: ${p.observacoesGerais.join(' | ')}`,
      `Aviso Geral: ${REGRA_GERAL_PLANILHAS}`
    ];

    navigator.clipboard.writeText(linhas.join('\n'));
    setCopiedText(p.id);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleCopyCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    setCopiedText(codigo);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper para renderizar badge de status do exame
  const renderExameBadge = (exame: ExameStatusDetalhe) => {
    switch (exame.status) {
      case 'ATENDE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Atende</span>
          </span>
        );
      case 'PACOTE_PS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-teal-100 text-teal-800 border border-teal-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span>Pacote PS</span>
          </span>
        );
      case 'COM_ESPECIFICIDADE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-sky-100 text-sky-800 border border-sky-300">
            <KeyRound className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
            <span>Especificidade</span>
          </span>
        );
      case 'SOMENTE_URGENCIA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span>Somente Urgência</span>
          </span>
        );
      case 'SOMENTE_ELETIVO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-purple-100 text-purple-800 border border-purple-300">
            <FileText className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
            <span>Somente Eletivo</span>
          </span>
        );
      case 'PARTICULAR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>Cobrar do Paciente</span>
          </span>
        );
      case 'AGUARDANDO_RETORNO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
            <Clock className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
            <span>Aguardando Retorno</span>
          </span>
        );
      case 'SUSPENSO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-300">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
            <span>Suspenso</span>
          </span>
        );
      case 'NAO_ATENDE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-red-100 text-red-800 border border-red-300">
            <XCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
            <span>Não Atende</span>
          </span>
        );
      case 'SEM_INFORMACAO':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span>Confirmar c/ Priscila</span>
          </span>
        );
    }
  };

  const examesLista = [
    { key: 'rm' as const, label: 'Ressonância Magnética (RM)', icon: Activity },
    { key: 'tc' as const, label: 'Tomografia Computadorizada (TC)', icon: Activity },
    { key: 'raioX' as const, label: 'Raio-X Digital', icon: Activity },
    { key: 'usg' as const, label: 'Ultrassonografia (USG)', icon: Activity },
    { key: 'eco' as const, label: 'ECO / Parecer / Risco Cirúrgico', icon: HeartPulse },
    { key: 'colonoscopia' as const, label: 'Colonoscopia', icon: Stethoscope },
    { key: 'retossigmoidoscopia' as const, label: 'Retossigmoidoscopia', icon: Stethoscope },
    { key: 'endoscopia' as const, label: 'Endoscopia Digestiva Alta', icon: Stethoscope }
  ];

  return (
    <div className="space-y-6">
      {/* ========================================================
          CABEÇALHO DA ABA COBERTURA DE CONVÊNIOS
      ======================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0A565D] to-[#006B70] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-emerald-500/20 text-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Planilhas 1 & 2 Consolidadas por Plano
              </span>
              <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                Hospital Palmas Medical • HST
              </span>
              <span className="bg-amber-400/20 text-amber-200 text-xs font-bold px-3 py-1 rounded-full border border-amber-300/30">
                42 Planos de Saúde Mapeados
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white m-0">
              Cobertura por Convênios
            </h1>

            <p className="text-slate-200 text-sm sm:text-base font-medium max-w-3xl leading-relaxed m-0">
              Selecione a aba de qualquer operadora abaixo para abrir a <strong>página completa de atendimento</strong> contendo regras de Pronto-Socorro, Santa Thereza, Internação/UTI, Consultas, Matriz de Imagem (RM, TC, RX, USG, ECO) e Endoscopia/Colonoscopia.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap md:flex-col md:items-end flex-shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-black transition-all shadow-md cursor-pointer group"
            >
              <Printer className="w-4 h-4 text-[#006B70] group-hover:scale-110 transition-transform" />
              <span>Imprimir Ficha do Convênio</span>
            </button>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'cards'
                    ? 'bg-white text-slate-900 border-white shadow-xs font-black'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-teal-300" />
                <span>Modelos em Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('pagina-plano')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'pagina-plano'
                    ? 'bg-white text-slate-900 border-white shadow-xs font-black'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-teal-300" />
                <span>Páginas por Plano</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('tabela-geral')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'tabela-geral'
                    ? 'bg-white text-slate-900 border-white shadow-xs font-black'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                <Table className="w-3.5 h-3.5 text-teal-300" />
                <span>Tabela Geral</span>
              </button>
            </div>
          </div>
        </div>

        {/* REGRA GERAL DA PLANILHA EM DESTAQUE */}
        <div className="mt-6 pt-4 border-t border-white/15 flex items-start gap-2.5 text-xs text-amber-200 bg-amber-500/10 p-3 rounded-xl border border-amber-400/20">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-white">REGRA GERAL INSTITUCIONAL (PLANILHAS 1 & 2):</strong> Para qualquer convênio ou item em branco / sem orientação registrada, a regra expressa determina: <em>&ldquo;Perguntar para a Priscila antes do atendimento.&rdquo;</em>
          </div>
        </div>
      </div>

      {/* ========================================================
          BARRA DE CONTROLES: MODOS DE VISUALIZAÇÃO, BUSCA & FILTRO
      ======================================================== */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
        {/* Modos de Visualização Operacional — Botão idêntico ao solicitado */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* O BOTÃO EXATO DA IMAGEM: [ ⊞ Modelos em Cards (Por Plano) ] */}
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                viewMode === 'cards'
                  ? 'bg-[#006B70] text-white shadow-md ring-2 ring-[#006B70]/30'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Modelos em Cards (Por Plano)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('pagina-plano')}
              className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                viewMode === 'pagina-plano'
                  ? 'bg-[#006B70] text-white shadow-md ring-2 ring-[#006B70]/30 font-black'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Página do Convênio (Abas)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('tabela-geral')}
              className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                viewMode === 'tabela-geral'
                  ? 'bg-[#006B70] text-white shadow-md ring-2 ring-[#006B70]/30 font-black'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Tabela Geral (42 Planos)</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
            <span>Total:</span>
            <span className="text-[#006B70] font-black">{filteredPlans.length}</span>
            <span>planos de saúde</span>
          </div>
        </div>
        {/* Linha de Busca e Filtros de Categoria */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por plano (ex: Bradesco, Amil, Sul América, Servir, Unafisco, Correios, Petrobrás)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006B70] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Limpar
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Filtrar:
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#006B70] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* LISTA HORIZONTAL / GRID DE ABAS DOS PLANOS (42 ABAS) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 uppercase text-[10.5px] tracking-wider flex items-center gap-1.5">
                <span>Abas dos Convênios ({filteredPlans.length} disponíveis):</span>
              </span>

              <button
                type="button"
                onClick={() => setTabsDisplayMode(tabsDisplayMode === 'scrollable' ? 'grid' : 'scrollable')}
                className="px-2 py-0.5 rounded-md text-[10px] font-black border transition-colors cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
              >
                {tabsDisplayMode === 'scrollable' ? 'Ver Todas em Grade' : 'Ver em Linha Rolável'}
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevPlan}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                title="Plano Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>
              <button
                type="button"
                onClick={handleNextPlan}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                title="Próximo Plano"
              >
                <span className="hidden sm:inline">Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Abas com rolagem horizontal ou Grade Completa */}
          {tabsDisplayMode === 'scrollable' ? (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
              {filteredPlans.map(p => {
                const isSelected = p.id === currentPlan.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlanId(p.id);
                      setViewMode('pagina-plano');
                    }}
                    className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#006B70] text-white border-[#006B70] shadow-md scale-102 ring-2 ring-[#006B70]/30'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {p.badge}
                    </span>
                    <span className="truncate max-w-[170px]">{p.nomeExibicao}</span>
                    {p.situacao === 'SUSPENSO' && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" title="Suspenso" />
                    )}
                    {p.situacao === 'DESCREDENCIADO' && (
                      <span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" title="Descredenciado" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5 max-h-72 overflow-y-auto p-1 bg-slate-50/60 rounded-xl border border-slate-200">
              {filteredPlans.map(p => {
                const isSelected = p.id === currentPlan.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlanId(p.id);
                      setViewMode('pagina-plano');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black transition-all flex items-center gap-1.5 cursor-pointer border text-left truncate ${
                      isSelected
                        ? 'bg-[#006B70] text-white border-[#006B70] shadow-xs ring-2 ring-[#006B70]/30'
                        : 'bg-white hover:bg-teal-50 text-slate-700 border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded flex items-center justify-center text-[9px] font-black flex-shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {p.badge}
                    </span>
                    <span className="truncate flex-1">{p.nomeExibicao}</span>
                    {p.situacao === 'SUSPENSO' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" title="Suspenso" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          MODO 1: MODELOS EM CARDS (POR PLANO) — SOLICITADO NA IMAGEM
      ======================================================== */}
      {viewMode === 'cards' && (
        <div className="space-y-6">
          {/* Header informativo da visualização em Cards */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-teal-50 via-emerald-50/50 to-white border border-teal-200/80 p-4 sm:p-5 rounded-2xl shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#006B70] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 m-0 flex items-center gap-2">
                  <span>Modelos em Cards (Por Plano)</span>
                  <span className="text-[11px] font-bold bg-[#006B70] text-white px-2.5 py-0.5 rounded-full">
                    {filteredPlans.length} Convênios
                  </span>
                </h3>
                <p className="text-xs text-slate-600 m-0 mt-0.5">
                  Consulte os cartões com resumo de PS, Santa Thereza, UTI, Exames e Ambulância. Clique em <strong>&ldquo;Abrir Página do Convênio&rdquo;</strong> para ver a ficha completa.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setTabsDisplayMode(tabsDisplayMode === 'scrollable' ? 'grid' : 'scrollable')}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-teal-400 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                {tabsDisplayMode === 'scrollable' ? 'Exibir Abas em Grade' : 'Exibir Abas em Linha'}
              </button>
            </div>
          </div>

          {/* Grid de Cards por Plano (Responsivo 1 / 2 / 3 colunas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredPlans.map(p => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#006B70] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Topo do Card / Identidade do Plano */}
                <div 
                  onClick={() => {
                    setSelectedPlanId(p.id);
                    setViewMode('pagina-plano');
                  }}
                  className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60 hover:bg-teal-50/30 transition-colors cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-[#006B70] text-white flex items-center justify-center font-black text-base shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                        {p.badge}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-black text-slate-900 truncate m-0 group-hover:text-[#006B70] transition-colors">
                          {p.nomeExibicao}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                            {p.categoria}
                          </span>
                          {p.situacao === 'ATIVO' && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Ativo
                            </span>
                          )}
                          {p.situacao === 'SUSPENSO' && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                              Suspenso
                            </span>
                          )}
                          {p.situacao === 'DESCREDENCIADO' && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
                              Descredenciado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyResumoPlano(p);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                      title="Copiar Resumo deste Convênio"
                    >
                      {copiedText === p.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Corpo do Card: 4 Pilares Principais */}
                <div className="p-4 sm:p-5 space-y-4 flex-1">
                  {/* Grid 2x2 dos Serviços Hospitalares */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* PS Adulto */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1">
                        <Ambulance className="w-3 h-3 text-[#006B70]" />
                        PS Adulto
                      </span>
                      <div className="text-[11px] font-bold text-slate-900 truncate" title={p.psAdulto}>
                        {p.psAdulto.includes('Pacote') ? 'Pacote PS' : p.psAdulto.startsWith('Não') ? 'Não Atende' : 'Atende'}
                      </div>
                    </div>

                    {/* PS Infantil */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1">
                        <Baby className="w-3 h-3 text-purple-600" />
                        PS Infantil
                      </span>
                      <div className="text-[11px] font-bold text-slate-900 truncate" title={p.psInfantil}>
                        {p.psInfantil.startsWith('Não') ? 'Não Atende' : p.psInfantil.includes('Não consta') ? 'Não em Contrato' : 'Atende'}
                      </div>
                    </div>

                    {/* Santa Thereza */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-sky-600" />
                        Santa Thereza
                      </span>
                      <div className="text-[11px] font-bold text-slate-900 truncate" title={p.santaThereza.prontoAtendimento}>
                        {p.santaThereza.prontoAtendimento.includes('OK') || p.santaThereza.prontoAtendimento.includes('Atende') ? 'PA Credenciado' : 'Sem PA Direto'}
                      </div>
                    </div>

                    {/* UTI */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-red-600" />
                        UTI
                      </span>
                      <div className="text-[11px] font-bold text-slate-900 truncate" title={p.uti}>
                        {p.uti.startsWith('Não') ? 'Não Atende' : p.uti.includes('Somente') || p.uti.includes('somente') ? 'Com Restrição' : 'Atende'}
                      </div>
                    </div>
                  </div>

                  {/* Matriz Compacta de Exames da Planilha 2 */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      Exames & Diagnóstico (Planilha 2):
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10.5px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200" title={`RM: ${p.exames.rm.descricao}`}>
                        RM: <strong className={p.exames.rm.status === 'ATENDE' ? 'text-emerald-700 font-bold' : p.exames.rm.status === 'NAO_ATENDE' ? 'text-red-600' : 'text-slate-800'}>
                          {p.exames.rm.status === 'ATENDE' ? 'Atende' : p.exames.rm.status === 'NAO_ATENDE' ? 'Não' : 'Urgência'}
                        </strong>
                      </span>
                      <span className="text-[10.5px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200" title={`TC: ${p.exames.tc.descricao}`}>
                        TC: <strong className={p.exames.tc.status === 'ATENDE' ? 'text-emerald-700 font-bold' : p.exames.tc.status === 'NAO_ATENDE' ? 'text-red-600' : 'text-slate-800'}>
                          {p.exames.tc.status === 'ATENDE' ? 'Atende' : p.exames.tc.status === 'NAO_ATENDE' ? 'Não' : 'Urgência'}
                        </strong>
                      </span>
                      <span className="text-[10.5px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200" title={`Raio-X: ${p.exames.raioX.descricao}`}>
                        RX: <strong className={p.exames.raioX.status === 'ATENDE' ? 'text-emerald-700 font-bold' : 'text-slate-800'}>
                          {p.exames.raioX.status === 'ATENDE' ? 'Atende' : 'Verificar'}
                        </strong>
                      </span>
                      <span className="text-[10.5px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200" title={`Endoscopia: ${p.exames.endoscopia.descricao}`}>
                        Endo: <strong className={p.exames.endoscopia.status === 'ATENDE' ? 'text-emerald-700 font-bold' : p.exames.endoscopia.status === 'NAO_ATENDE' ? 'text-red-600' : 'text-slate-800'}>
                          {p.exames.endoscopia.status === 'ATENDE' ? 'Atende' : p.exames.endoscopia.status === 'NAO_ATENDE' ? 'Não' : 'Urgência'}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Observação Chave / Alerta */}
                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                    <span className="font-bold text-slate-700">Obs: </span>
                    <span className="line-clamp-2">
                      {p.observacoesGerais[0] || 'Perguntar para a Priscila antes do atendimento.'}
                    </span>
                  </div>
                </div>

                {/* Rodapé do Card com Ação */}
                <div className="p-3.5 sm:p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyResumoPlano(p)}
                    className="px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlanId(p.id);
                      setViewMode('pagina-plano');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#006B70] hover:bg-[#0A565D] text-white rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer group-hover:shadow-md"
                  >
                    <span>Abrir Página do Convênio</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          MODO 2: PÁGINA DO PLANO DE SAÚDE SELECIONADO
      ======================================================== */}
      {viewMode === 'pagina-plano' && (
        <div className="space-y-6">
          {/* Card Principal da Página do Convênio */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
            {/* Header da Página com Identidade & Ações */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#006B70] text-white flex items-center justify-center font-black text-xl shadow-md flex-shrink-0">
                  {currentPlan.badge}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 m-0">
                      {currentPlan.nomeExibicao}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {currentPlan.categoria}
                    </span>
                    {currentPlan.situacao === 'ATIVO' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Credenciado / Ativo
                      </span>
                    )}
                    {currentPlan.situacao === 'SUSPENSO' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Suspenso na Planilha
                      </span>
                    )}
                    {currentPlan.situacao === 'DESCREDENCIADO' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Descredenciado
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium m-0 mt-1">
                    Diretrizes oficiais consolidadas das Planilhas de Atendimento por Convênios (Hospital Palmas Medical & Hospital Santa Thereza)
                  </p>
                </div>
              </div>

              {/* Botões de Ação do Plano */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-[#006B70] rounded-xl text-xs font-black transition-all cursor-pointer border border-teal-200"
                  title="Voltar para a visualização em Cards"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Modelos em Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyResumoPlano(currentPlan)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200"
                >
                  {copiedText === currentPlan.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copiado com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>Copiar Resumo Oficial</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#006B70] hover:bg-[#0A565D] text-white rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Esta Página</span>
                </button>
              </div>
            </div>

            {/* BANNERS DE ALERTA ESPECÍFICOS */}
            {currentPlan.situacao === 'SUSPENSO' && (
              <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start gap-3 text-rose-900">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong className="text-sm font-black block">ATENÇÃO: PLANO COM INDICAÇÃO DE SUSPENSÃO</strong>
                  A Planilha registra expressamente que este convênio está com atendimentos suspensos ou pendentes de confirmação. <strong>NÃO REALIZAR SEM CONFIRMAR COM A PRISCILA OU DIRETORIA.</strong>
                </div>
              </div>
            )}

            {currentPlan.situacao === 'DESCREDENCIADO' && (
              <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-start gap-3 text-red-900">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong className="text-sm font-black block">CONVÊNIO DESCREDENCIADO</strong>
                  A planilha registra situação de descredenciamento. Atendimentos não devem ser faturados pelo convênio; orientar cobrança na modalidade Particular.
                </div>
              </div>
            )}

            {/* Alerta Institucional da Priscila */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Regra Geral Aplicável:</strong> Caso qualquer exame ou procedimento específico esteja em branco na planilha, <em>perguntar para a Priscila</em> antes do atendimento.
                </span>
              </div>
              <span className="text-[10px] font-bold bg-amber-200/60 px-2 py-0.5 rounded text-amber-950 flex-shrink-0">
                Diretriz Operacional
              </span>
            </div>

            {/* ========================================================
                CARTOES DE RESUMO EXECUTIVO (4 PILARES)
            ======================================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: PS Adulto */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Ambulance className="w-4 h-4 text-[#006B70]" />
                    PS Adulto
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                    HPM
                  </span>
                </div>
                <div className="text-sm font-black text-slate-900 leading-tight">
                  {currentPlan.psAdulto.includes('Pacote') || currentPlan.psAdulto.includes('pacote') ? 'Atende (Pacote PS)' : currentPlan.psAdulto.startsWith('Não') ? 'Não Atende' : 'Atende'}
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 m-0" title={currentPlan.psAdulto}>
                  {currentPlan.psAdulto}
                </p>
              </div>

              {/* Card 2: PS Infantil */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Baby className="w-4 h-4 text-purple-600" />
                    PS Infantil / Ped
                  </span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-mono">
                    Pediatria
                  </span>
                </div>
                <div className="text-sm font-black text-slate-900 leading-tight">
                  {currentPlan.psInfantil.startsWith('Não') ? 'Não Atende' : currentPlan.psInfantil.includes('Não consta') ? 'Não em Contrato' : 'Atende'}
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 m-0" title={currentPlan.psInfantil}>
                  {currentPlan.psInfantil}
                </p>
              </div>

              {/* Card 3: Internação & Santa Thereza */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-sky-600" />
                    Santa Thereza (HST)
                  </span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-mono">
                    Rede
                  </span>
                </div>
                <div className="text-sm font-black text-slate-900 leading-tight">
                  {currentPlan.santaThereza.prontoAtendimento.includes('OK') || currentPlan.santaThereza.prontoAtendimento.includes('atende') ? 'PA Credenciado' : 'Sem PA Direto'}
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 m-0" title={`${currentPlan.santaThereza.prontoAtendimento} | ${currentPlan.santaThereza.internacao}`}>
                  {currentPlan.santaThereza.internacao}
                </p>
              </div>

              {/* Card 4: UTI & Alta Complexidade */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-red-600" />
                    UTI Adulto / Ped
                  </span>
                  <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-mono">
                    Críticos
                  </span>
                </div>
                <div className="text-sm font-black text-slate-900 leading-tight">
                  {currentPlan.uti.startsWith('Não') ? 'Não Atende' : currentPlan.uti.includes('somente') || currentPlan.uti.includes('Somente') ? 'Com Restrição' : 'Atende'}
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 m-0" title={currentPlan.uti}>
                  {currentPlan.uti}
                </p>
              </div>
            </div>

            {/* ========================================================
                SEÇÃO A: PRONTO ATENDIMENTO & HOSPITAL SANTA THEREZA
            ======================================================== */}
            <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider m-0 flex items-center gap-2">
                  <Ambulance className="w-4 h-4 text-[#006B70]" />
                  1. Pronto-Socorro & Hospital Santa Thereza (HST)
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  Planilha 1 • Urgência e Emergência
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* PS Adulto */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10.5px] font-black text-slate-500 uppercase tracking-wider block">
                    Pronto-Socorro Adulto (Medical):
                  </span>
                  <div className="text-xs font-bold text-slate-900 leading-relaxed">
                    {currentPlan.psAdulto}
                  </div>
                </div>

                {/* PS Infantil */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10.5px] font-black text-slate-500 uppercase tracking-wider block">
                    Pronto-Socorro Infantil / Pediatria:
                  </span>
                  <div className="text-xs font-bold text-slate-900 leading-relaxed">
                    {currentPlan.psInfantil}
                  </div>
                </div>

                {/* Santa Thereza PA */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10.5px] font-black text-slate-500 uppercase tracking-wider block">
                    Santa Thereza — Pronto Atendimento:
                  </span>
                  <div className="text-xs font-bold text-slate-900 leading-relaxed">
                    {currentPlan.santaThereza.prontoAtendimento}
                  </div>
                </div>

                {/* Santa Thereza Internação */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10.5px] font-black text-slate-500 uppercase tracking-wider block">
                    Santa Thereza — Internação:
                  </span>
                  <div className="text-xs font-bold text-slate-900 leading-relaxed">
                    {currentPlan.santaThereza.internacao}
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                SEÇÃO B: INTERNAÇÃO, CIRURGIAS & UTI
            ======================================================== */}
            <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider m-0 flex items-center gap-2">
                  <Bed className="w-4 h-4 text-purple-700" />
                  2. Internação, Cirurgias & UTI
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  Diárias, Pacotes e Intensivistas
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* UTI Detalhada */}
                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-purple-700" />
                      Regras de UTI & Códigos Faturáveis:
                    </span>
                    <span className="text-[11px] bg-purple-200/80 text-purple-900 px-2 py-0.5 rounded font-mono font-bold">
                      Intensivistas
                    </span>
                  </div>
                  <p className="text-xs text-purple-950 font-medium leading-relaxed m-0">
                    {currentPlan.uti}
                  </p>
                </div>

                {/* Consulta Eletiva */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10.5px] font-black text-slate-500 uppercase tracking-wider block">
                    Consultas Eletivas no Ambulatório:
                  </span>
                  <p className="text-xs text-slate-900 font-semibold m-0 leading-relaxed">
                    {currentPlan.consultaEletiva}
                  </p>
                </div>
              </div>
            </div>

            {/* ========================================================
                SEÇÃO C: MATRIZ DE EXAMES DE IMAGEM & DIAGNÓSTICO (PLANILHA 2)
            ======================================================== */}
            <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-slate-50/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider m-0 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#006B70]" />
                    3. Matriz de Exames de Imagem & Procedimentos Diagnósticos
                  </h3>
                  <p className="text-xs text-slate-500 m-0 mt-0.5">
                    Informações oficiais e detalhadas da <strong>Planilha 2</strong> com códigos de contrato, pacotes e especificidades de atendimento.
                  </p>
                </div>

                <span className="text-[11px] font-bold bg-[#006B70]/10 text-[#006B70] px-2.5 py-1 rounded-lg border border-[#006B70]/20 flex-shrink-0">
                  Planilha 2 Oficial
                </span>
              </div>

              {/* Grid dos 8 Exames da Planilha 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {examesLista.map(ex => {
                  const detalhe = currentPlan.exames[ex.key];
                  const Icon = ex.icon;
                  return (
                    <div 
                      key={ex.key}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2 hover:border-[#006B70] transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-[#006B70]" />
                          {ex.label}
                        </span>
                        {renderExameBadge(detalhe)}
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed m-0 font-medium">
                        {detalhe.descricao}
                      </p>

                      {detalhe.codigo && (
                        <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            Código / TUSS:
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCodigo(detalhe.codigo!)}
                            className="inline-flex items-center gap-1 text-[11px] font-mono font-black text-[#006B70] bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded border border-teal-200 transition-colors cursor-pointer"
                            title="Clique para copiar código"
                          >
                            <span>{detalhe.codigo}</span>
                            <Copy className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ========================================================
                SEÇÃO D: LABORATÓRIO, OFTALMO, QUIMIO & HEMODIÁLISE
            ======================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Laboratório */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10.5px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                  Laboratório de Análises:
                </span>
                <p className="text-xs font-bold text-slate-900 m-0 leading-relaxed">
                  {currentPlan.laboratorio}
                </p>
              </div>

              {/* Oftalmologia */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10.5px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-amber-600" />
                  Oftalmologia:
                </span>
                <p className="text-xs font-bold text-slate-900 m-0 leading-relaxed">
                  {currentPlan.oftalmologia}
                </p>
              </div>

              {/* Mamografia */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10.5px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-pink-600" />
                  Mamografia:
                </span>
                <p className="text-xs font-bold text-slate-900 m-0 leading-relaxed">
                  {currentPlan.mamografia}
                </p>
              </div>

              {/* Quimioterapia & Hemodiálise */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10.5px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Syringe className="w-3.5 h-3.5 text-emerald-600" />
                  Quimioterapia & Hemodiálise:
                </span>
                <div className="text-xs font-bold text-slate-900 m-0 leading-relaxed">
                  <div><strong>Quimio:</strong> {currentPlan.quimioterapia}</div>
                  <div><strong>Hemodiálise:</strong> {currentPlan.hemodialise}</div>
                </div>
              </div>
            </div>

            {/* ========================================================
                SEÇÃO E: AMBULÂNCIA & CONTATOS DE REMOÇÃO
            ======================================================== */}
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Ambulance className="w-4 h-4 text-amber-700" />
                  Serviço de Ambulância & Regras de Remoção:
                </span>
                <span className="text-[10.5px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                  CARE MED / LISS CARE
                </span>
              </div>
              <p className="text-xs text-amber-950 font-medium leading-relaxed m-0">
                {currentPlan.ambulancia}
              </p>

              {/* Contatos Específicos se houver */}
              {currentPlan.contatosUteis && currentPlan.contatosUteis.length > 0 && (
                <div className="pt-2 border-t border-amber-200/80 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase text-amber-800">
                    Contatos Registrados:
                  </span>
                  {currentPlan.contatosUteis.map((c, i) => (
                    <span key={i} className="text-xs font-bold bg-white text-slate-900 px-2.5 py-1 rounded-lg border border-amber-200 font-mono">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ========================================================
                SEÇÃO F: CÓDIGOS DE CONTRATO & ESPECIFICIDADES
            ======================================================== */}
            {currentPlan.codigosContrato?.especificos && currentPlan.codigosContrato.especificos.length > 0 && (
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-teal-300">
                    <KeyRound className="w-4 h-4 text-teal-400" />
                    Códigos Oficiais de Contrato & Faturamento
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Clique para copiar
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {currentPlan.codigosContrato.especificos.map((esp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleCopyCodigo(esp.codigo)}
                      className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 text-left transition-colors cursor-pointer group flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[10px] text-slate-300 font-semibold">{esp.titulo}</div>
                        <div className="text-xs font-mono font-black text-white group-hover:text-teal-200">{esp.codigo}</div>
                      </div>
                      <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================
                SEÇÃO G: TODAS AS OBSERVAÇÕES OFICIAIS DA PLANILHA
            ======================================================== */}
            {currentPlan.observacoesGerais.length > 0 && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#006B70]" />
                  Observações Oficiais Registradas na Planilha:
                </span>
                <ul className="text-xs text-slate-700 list-disc list-inside space-y-1 m-0 font-medium">
                  {currentPlan.observacoesGerais.map((obs, idx) => (
                    <li key={idx} className="leading-relaxed">{obs}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Rodapé de Navegação Rápida entre Planos */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={handlePrevPlan}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Plano Anterior ({PLANOS_COBERTURA_COMPLETA[(currentIndex - 1 + PLANOS_COBERTURA_COMPLETA.length) % PLANOS_COBERTURA_COMPLETA.length].nomeExibicao})</span>
            </button>

            <span className="text-xs font-bold text-slate-500 hidden sm:inline">
              Plano {currentIndex + 1} de {PLANOS_COBERTURA_COMPLETA.length}
            </span>

            <button
              type="button"
              onClick={handleNextPlan}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#006B70] hover:bg-[#0A565D] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <span>Próximo Plano ({PLANOS_COBERTURA_COMPLETA[(currentIndex + 1) % PLANOS_COBERTURA_COMPLETA.length].nomeExibicao})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          MODO 2: TABELA COMPARATIVA GERAL (TODOS OS 42 PLANOS)
      ======================================================== */}
      {viewMode === 'tabela-geral' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider m-0 flex items-center gap-2">
                <Table className="w-4 h-4 text-[#006B70]" />
                Tabela Matriz de Todos os 42 Planos de Saúde (Planilhas 1 & 2)
              </h2>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Clique no botão de qualquer linha para abrir a página individual completa do plano.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className="px-3 py-1.5 bg-[#006B70] text-white hover:bg-[#0A565D] rounded-lg text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Modelos em Cards (Por Plano)</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('pagina-plano')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-200"
              >
                Ver Páginas por Plano
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-black border-b border-slate-200 uppercase text-[10px] tracking-wider select-none">
                  <th className="py-3 px-3.5 sticky left-0 bg-slate-100 z-10">Convênio / Plano</th>
                  <th className="py-3 px-2 text-center">Categoria</th>
                  <th className="py-3 px-2 text-center">PS Adulto</th>
                  <th className="py-3 px-2 text-center">PS Infantil</th>
                  <th className="py-3 px-2 text-center">Santa Thereza</th>
                  <th className="py-3 px-2 text-center">UTI</th>
                  <th className="py-3 px-2 text-center">RM</th>
                  <th className="py-3 px-2 text-center">TC</th>
                  <th className="py-3 px-2 text-center">Raio-X</th>
                  <th className="py-3 px-2 text-center">Colono</th>
                  <th className="py-3 px-2 text-center">Endo</th>
                  <th className="py-3 px-2 text-center">USG</th>
                  <th className="py-3 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredPlans.map(p => (
                  <tr 
                    key={p.id}
                    className="hover:bg-teal-50/50 transition-colors"
                  >
                    <td className="py-3 px-3.5 sticky left-0 bg-white hover:bg-teal-50/50 z-10 font-black text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-[#006B70] text-white flex items-center justify-center font-black text-[10px] flex-shrink-0">
                          {p.badge}
                        </span>
                        <div className="truncate font-black text-slate-900 text-xs">
                          {p.nomeExibicao}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {p.categoria}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded ${
                        p.psAdulto.startsWith('Não') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'
                      }`}>
                        {p.psAdulto.startsWith('Não') ? 'Não' : 'Atende'}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded ${
                        p.psInfantil.startsWith('Não') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'
                      }`}>
                        {p.psInfantil.startsWith('Não') ? 'Não' : 'Atende'}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      <span className="text-[10.5px] font-bold text-slate-700">
                        {p.santaThereza.prontoAtendimento.includes('OK') || p.santaThereza.prontoAtendimento.includes('Atende') ? 'OK' : 'Não'}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded ${
                        p.uti.startsWith('Não') ? 'bg-red-50 text-red-700' : 'bg-purple-50 text-purple-800'
                      }`}>
                        {p.uti.startsWith('Não') ? 'Não' : 'Atende'}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      {renderExameBadge(p.exames.rm)}
                    </td>

                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      {renderExameBadge(p.exames.tc)}
                    </td>

                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      {renderExameBadge(p.exames.raioX)}
                    </td>

                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      {renderExameBadge(p.exames.colonoscopia)}
                    </td>

                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      {renderExameBadge(p.exames.endoscopia)}
                    </td>

                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      {renderExameBadge(p.exames.usg)}
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPlanId(p.id);
                          setViewMode('pagina-plano');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#006B70] text-white hover:bg-[#0A565D] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        <span>Abrir Página</span>
                        <ChevronRight className="w-3.5 h-3.5" />
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
  );
};
