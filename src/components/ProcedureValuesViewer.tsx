import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Stethoscope, 
  BedDouble, 
  AlertTriangle, 
  Phone, 
  Calendar, 
  CreditCard, 
  Printer, 
  Copy, 
  Check, 
  Plus, 
  Minus, 
  Trash2, 
  Eye, 
  Maximize2, 
  X, 
  Info,
  Building2,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { HospitalProcedure, SelectedProcedureItem } from '../types';
import { 
  PROCEDIMENTOS_GERAIS, 
  PROCEDIMENTOS_MEDICOS_ESPECIFICOS, 
  PROCEDURES_METADATA 
} from '../data/proceduresData';
import { HospitalPatientQuote, QuoteItem } from './HospitalPatientQuote';

interface ProcedureValuesViewerProps {
  initialSearch?: string;
}

export const ProcedureValuesViewer: React.FC<ProcedureValuesViewerProps> = ({
  initialSearch = ''
}) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'medicos' | 'diarias'>('geral');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<Record<string, SelectedProcedureItem>>({});
  const [isCartExpanded, setIsCartExpanded] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [modalQuoteTab, setModalQuoteTab] = useState<'editor' | 'preview'>('editor');
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Format currency in BRL
  const formatCurrencyBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val);
  };

  // Switch tab and reset category filter if needed
  const handleTabChange = (tab: 'geral' | 'medicos' | 'diarias') => {
    setActiveTab(tab);
    setSelectedCategory('all');
  };

  // Base list depending on active tab
  const currentBaseList = useMemo(() => {
    if (activeTab === 'medicos') {
      return PROCEDIMENTOS_MEDICOS_ESPECIFICOS;
    }
    if (activeTab === 'diarias') {
      return PROCEDIMENTOS_GERAIS.filter(p => p.category === 'Diárias & Acomodações');
    }
    return PROCEDIMENTOS_GERAIS;
  }, [activeTab]);

  // Available categories for current tab
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    currentBaseList.forEach(item => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  }, [currentBaseList]);

  // Filtered procedures
  const filteredProcedures = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return currentBaseList.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (q) {
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCat = item.category?.toLowerCase().includes(q);
        const matchesDiaria = item.diarias.toLowerCase().includes(q);
        const matchesNotes = item.notes?.toLowerCase().includes(q);
        return matchesDesc || matchesCat || matchesDiaria || matchesNotes;
      }
      return true;
    });
  }, [currentBaseList, selectedCategory, searchQuery]);

  // Add / Toggle item in budget
  const handleAddItem = (proc: HospitalProcedure) => {
    setSelectedItems(prev => {
      const existing = prev[proc.id];
      if (existing) {
        return {
          ...prev,
          [proc.id]: {
            ...existing,
            quantity: existing.quantity + 1
          }
        };
      }
      return {
        ...prev,
        [proc.id]: {
          procedure: proc,
          quantity: 1
        }
      };
    });
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setSelectedItems(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: {
          ...prev[id],
          quantity: newQty
        }
      };
    });
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleClearCart = () => {
    setSelectedItems({});
  };

  // Cart calculations
  const cartItems = useMemo(() => Object.values(selectedItems), [selectedItems]);
  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.procedure.price * item.quantity), 0);
  }, [cartItems]);
  const totalItemsCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // Payment installment calculations (up to 6x)
  const installment6x = cartTotal > 0 ? cartTotal / 6 : 0;

  const quoteItemsForProcedures: QuoteItem[] = useMemo(() => {
    return cartItems.map(item => {
      const unit = item.procedure.price;
      const subtotal = unit * item.quantity;
      const detailParts: string[] = [];
      if (item.procedure.diarias) detailParts.push(`Diárias: ${item.procedure.diarias}`);
      if (item.procedure.notes) detailParts.push(item.procedure.notes);

      return {
        code: item.procedure.id || undefined,
        description: item.procedure.description,
        category: item.procedure.category || undefined,
        detail: detailParts.length > 0 ? detailParts.join(' • ') : undefined,
        quantity: item.quantity,
        unitPrice: unit,
        subtotal
      };
    });
  }, [cartItems]);

  // Copy budget summary
  const handleCopyBudget = () => {
    if (cartItems.length === 0) return;

    let text = `*HOSPITAL PALMAS MEDICAL - ORÇAMENTO DE PROCEDIMENTOS*\n`;
    text += `Vigência: ${PROCEDURES_METADATA.vigencia}\n`;
    if (patientName) text += `Paciente: ${patientName}\n`;
    if (doctorName) text += `Médico(a): ${doctorName}\n`;
    text += `------------------------------------\n`;
    text += `*ITENS DO PROCEDIMENTO:*\n`;

    cartItems.forEach((item, i) => {
      text += `${i + 1}. ${item.procedure.description}\n`;
      text += `   Diárias: ${item.procedure.diarias} | Qtd: ${item.quantity} | Valor: ${formatCurrencyBRL(item.procedure.price * item.quantity)}\n`;
      if (item.procedure.notes) {
        text += `   Obs: ${item.procedure.notes}\n`;
      }
    });

    text += `------------------------------------\n`;
    text += `*TOTAL ESTIMADO DO HOSPITAL: ${formatCurrencyBRL(cartTotal)}*\n`;
    text += `Condições: À vista (PIX/Dinheiro/Débito) ou em até 6x de ${formatCurrencyBRL(installment6x)} no cartão de crédito.\n`;
    text += `\n*Aviso:* Valores hospitalares sem honorários médicos e sem OPMES.\n`;
    if (quoteNotes) text += `Observações: ${quoteNotes}\n`;
    text += `Dúvidas: Setor de Orçamento do Hospital - (63) 99989-1818\n`;

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  // Print A4 Quote
  const handlePrintQuote = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Printable Area for Hospital Patient Quote (A4 Formatted) */}
      <div id="print-procedure-slip" className="hidden print:block font-sans text-slate-900 w-full m-0 p-0">
        <HospitalPatientQuote
          type="procedimentos"
          patientName={patientName}
          doctorName={doctorName}
          tableReference="Tabela Oficial de Pacotes Cirúrgicos & Procedimentos 2026"
          notes={quoteNotes}
          items={quoteItemsForProcedures}
          total={cartTotal}
          installmentCount={6}
        />
      </div>

      {/* Screen Interactive Container */}
      <div className="print:hidden space-y-6">
        {/* Header Banner - Identity Medical Kora Saúde */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Tabela Oficial 2026
              </span>
              <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
                {PROCEDURES_METADATA.vigencia}
              </span>
              <span className="bg-[#FDF2F6] text-[#B01B52] border border-[#F7D0DF] text-xs font-bold px-3 py-1 rounded-full">
                Sem Honorários & Sem OPMES
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tabela de Valores de Procedimentos & Cirurgias
            </h2>

            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed font-medium">
              Consulta de pacotes cirúrgicos hospitalares, internação, diárias globais, UTI, urologia e cirurgias plásticas do Hospital Palmas Medical.
            </p>
          </div>

          {/* Quick Contact Box */}
          <div className="flex-shrink-0 bg-[#F8FAFB] border border-slate-200/80 rounded-2xl p-4 sm:p-4.5 flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#0E7B86] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Dúvidas & Procedimentos não constantes:
              </span>
              <a
                href={`tel:${PROCEDURES_METADATA.contatoSetor.telefoneRaw}`}
                className="text-base font-black text-[#0E7B86] hover:text-[#095962] transition-colors block"
              >
                {PROCEDURES_METADATA.contatoSetor.telefone}
              </a>
              <span className="text-[11px] font-semibold text-slate-500">
                Setor de Orçamento do Hospital
              </span>
            </div>
          </div>
        </div>

        {/* Payment Policy Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <CreditCard className="w-4 h-4 text-[#B01B52] flex-shrink-0" />
            <span><strong>Pagamento:</strong> Dinheiro, Débito, PIX ou até 6x no Cartão</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <BedDouble className="w-4 h-4 text-[#0E7B86] flex-shrink-0" />
            <span><strong>Diárias Inclusas:</strong> Indicadas em cada procedimento (Apto / Enf / Leito Dia)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span><strong>Vigência:</strong> Atualizada a partir de 01/07/2026</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto p-1">
          <button
            type="button"
            onClick={() => handleTabChange('geral')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'geral'
                ? 'bg-[#0E7B86] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#EBF7F8]'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Tabela Geral (Plásticas, Gerais, Uro & Diárias)</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              activeTab === 'geral' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {PROCEDIMENTOS_GERAIS.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('medicos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'medicos'
                ? 'bg-[#B01B52] text-white shadow-2xs'
                : 'text-slate-600 hover:text-[#B01B52] hover:bg-[#FDF2F6]'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <span>Tabela Médicos Específicos</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              activeTab === 'medicos' ? 'bg-white/20 text-white' : 'bg-[#FDF2F6] text-[#B01B52]'
            }`}>
              {PROCEDIMENTOS_MEDICOS_ESPECIFICOS.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('diarias')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'diarias'
                ? 'bg-[#0E7B86] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#EBF7F8]'
            }`}
          >
            <BedDouble className="w-4 h-4" />
            <span>Diárias Globais & UTI</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              activeTab === 'diarias' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              5
            </span>
          </button>
        </div>

        {/* Selected Items Counter in tab header */}
        {cartItems.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FDF2F6] border border-[#F7D0DF] rounded-xl self-end sm:self-center">
            <span className="text-xs font-bold text-[#B01B52]">
              {totalItemsCount} {totalItemsCount === 1 ? 'item orçado' : 'itens orçados'}:
            </span>
            <span className="text-xs font-mono font-black text-[#B01B52]">
              {formatCurrencyBRL(cartTotal)}
            </span>
            <button
              type="button"
              onClick={() => setIsQuoteModalOpen(true)}
              className="ml-1 text-[11px] font-extrabold text-[#0E7B86] underline hover:text-[#095962] cursor-pointer"
            >
              Ver Orçamento
            </button>
          </div>
        )}
      </div>

      {/* Critical Attention Box for Médicos Específicos */}
      {activeTab === 'medicos' && (
        <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-5 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black flex-shrink-0 shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full">
                  Observação de Muita Atenção
                </span>
                <span className="text-xs font-bold text-amber-800">
                  Uso Restrito Hospitalar
                </span>
              </div>
              <h3 className="text-lg font-black text-amber-950 m-0">
                ESSES VALORES SÃO SOMENTE PARA OS MÉDICOS:
              </h3>
              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                {PROCEDURES_METADATA.medicosEspecificos.map((med, idx) => (
                  <span
                    key={idx}
                    className="bg-white border border-amber-300 text-amber-950 px-3 py-1 rounded-xl text-xs font-black shadow-2xs"
                  >
                    Dr. {med}
                  </span>
                ))}
              </div>
              <p className="text-xs text-amber-900 leading-relaxed font-medium pt-1">
                {PROCEDURES_METADATA.avisoMedicosEspecificos}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search & Category Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por cirurgia, diária, acomodação ou médico..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#0E7B86] focus:bg-white outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs font-bold text-slate-500 self-center whitespace-nowrap">
            Mostrando <strong className="text-slate-800">{filteredProcedures.length}</strong> de {currentBaseList.length} procedimentos
          </div>
        </div>

        {/* Category Pills (if more than 1 category) */}
        {availableCategories.length > 1 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Filtrar por:</span>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#0E7B86] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Todas ({currentBaseList.length})
            </button>
            {availableCategories.map(cat => {
              const count = currentBaseList.filter(p => p.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0E7B86] text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Procedures Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
        <div className="p-4 bg-gradient-to-r from-[#095962] to-[#0E7B86] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Stethoscope className="w-5 h-5 text-[#EBF7F8]" />
            <h3 className="text-sm font-black uppercase tracking-wider m-0">
              {activeTab === 'geral' 
                ? 'Procedimentos Cirúrgicos & Hospitalares Gerais'
                : (activeTab === 'medicos' 
                    ? 'Procedimentos Médicos Específicos (Diego, Thiago, Hiwry, Saulo)'
                    : 'Diárias Globais, Apartamento, Enfermaria e UTI')}
            </h3>
          </div>
          <span className="text-xs text-white/80 font-medium">
            {filteredProcedures.length} registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="py-3 px-3.5 font-bold w-12 text-center">#</th>
                <th className="py-3 px-4 font-bold">Procedimento Cirúrgico / Diária</th>
                <th className="py-3 px-3 font-bold w-36">Categoria</th>
                <th className="py-3 px-3 font-bold w-28 text-center">Diárias</th>
                <th className="py-3 px-4 font-bold w-36 text-right">Valor do Hospital</th>
                <th className="py-3 px-3.5 font-bold w-32 text-center">Orçamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProcedures.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">Nenhum procedimento encontrado para &quot;{searchQuery}&quot;.</p>
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                      className="mt-2 text-xs font-bold text-[#0E7B86] underline cursor-pointer"
                    >
                      Limpar busca e filtros
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProcedures.map((proc, idx) => {
                  const isSelected = !!selectedItems[proc.id];
                  const qty = selectedItems[proc.id]?.quantity || 0;

                  return (
                    <tr
                      key={proc.id}
                      className={`hover:bg-[#EBF7F8]/40 transition-colors ${
                        isSelected ? 'bg-[#FDF2F6]/50' : (idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40')
                      }`}
                    >
                      <td className="py-3 px-3.5 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-slate-900 leading-snug">
                            {proc.description}
                          </div>
                          {proc.notes && (
                            <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200/80 rounded-md px-2 py-0.5 inline-block font-medium">
                              ⚠️ {proc.notes}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-600">
                        <span className="text-[11px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded border border-slate-200 inline-block">
                          {proc.category}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          proc.diarias.includes('Apto') 
                            ? 'bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8]'
                            : (proc.diarias.includes('Enf')
                                ? 'bg-slate-100 text-slate-700 border border-slate-200'
                                : (proc.diarias === '0'
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : 'bg-teal-50 text-teal-800 border border-teal-200'))
                        }`}>
                          {proc.diarias === '0' ? 'Leito Dia (0)' : (proc.diarias === 'ao dia' ? 'Ao dia' : `${proc.diarias} diária(s)`)}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="font-mono font-black text-sm text-slate-900">
                          {formatCurrencyBRL(proc.price)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {proc.diarias === 'ao dia' ? 'por dia' : 'pacote hospital'}
                        </div>
                      </td>

                      <td className="py-3 px-3.5 text-center">
                        {isSelected ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <div className="flex items-center bg-white border border-[#B01B52] rounded-lg p-0.5 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(proc.id, qty - 1)}
                                className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-slate-900 rounded font-bold cursor-pointer"
                                title="Diminuir quantidade"
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-xs font-bold text-[#B01B52] font-mono">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(proc.id, qty + 1)}
                                className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-slate-900 rounded font-bold cursor-pointer"
                                title="Aumentar quantidade"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddItem(proc)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EBF7F8] hover:bg-[#D8ECEE] text-[#0E7B86] hover:text-[#095962] border border-[#C4E5E8] font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Orçar</span>
                          </button>
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

      {/* STICKY BOTTOM BUDGET BAR (When at least 1 procedure is selected) */}
      {cartItems.length > 0 && (
        <div className="bg-white text-slate-900 border-2 border-[#0E7B86]/35 rounded-2xl shadow-xl overflow-hidden sticky bottom-3 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Header Bar */}
          <div className="p-4 bg-gradient-to-r from-[#095962] via-[#0E7B86] to-[#095962] text-white flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#B01B52] flex items-center justify-center font-bold text-white shadow-md flex-shrink-0">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs uppercase tracking-wider font-extrabold text-[#EBF7F8]">
                    Orçamento Cirúrgico & Procedimentos
                  </span>
                  <span className="bg-white/15 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-white/20">
                    {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Itens'}
                  </span>
                  <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                    Até 6x de {formatCurrencyBRL(installment6x)}
                  </span>
                </div>

                <div className="text-xl font-black text-white leading-tight mt-0.5 flex items-baseline gap-2">
                  <span className="text-white/85 text-xs font-semibold uppercase tracking-wider">Total Estimado Hospital:</span>
                  <span className="text-white font-mono font-black text-2xl tracking-tight">{formatCurrencyBRL(cartTotal)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsCartExpanded(v => !v)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#EBF7F8]" />
                <span>{isCartExpanded ? 'Recolher Lista' : 'Ver Detalhes'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#0E7B86] hover:bg-[#EBF7F8] text-xs font-black shadow-xs transition-all cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#0E7B86]" />
                <span>Expandir Guia Completa</span>
              </button>

              <button
                type="button"
                onClick={handlePrintQuote}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#B01B52] hover:bg-[#971444] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-white" />
                <span>Imprimir A4</span>
              </button>

              <button
                type="button"
                onClick={handleClearCart}
                className="p-2 rounded-xl bg-white/10 hover:bg-[#B01B52] text-white/80 hover:text-white border border-white/20 transition-colors cursor-pointer"
                title="Limpar todos os itens selecionados"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expanded Inline Items View */}
          {isCartExpanded && (
            <div className="p-4 max-h-72 overflow-y-auto space-y-2 bg-[#F8FAFB] border-t border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                <span>Procedimentos Selecionados ({cartItems.length}):</span>
                <span className="text-[10px] text-[#0E7B86] font-extrabold">Sem honorários e sem OPMES</span>
              </div>

              <div className="space-y-2">
                {cartItems.map((item, idx) => {
                  const subtotal = item.procedure.price * item.quantity;

                  return (
                    <div
                      key={item.procedure.id}
                      className="bg-white border border-slate-200/90 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#0E7B86]/40 shadow-2xs transition-colors"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-slate-400 text-xs font-bold">#{idx + 1}</span>
                          <span className="text-[10px] bg-[#EBF7F8] text-[#0E7B86] font-bold px-2 py-0.5 rounded border border-[#C4E5E8]">
                            {item.procedure.category}
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                            {item.procedure.diarias === '0' ? 'Leito Dia' : `${item.procedure.diarias} diária(s)`}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-900 leading-relaxed">
                          {item.procedure.description}
                        </div>
                        {item.procedure.notes && (
                          <div className="text-xs text-amber-700 font-medium mt-0.5">
                            {item.procedure.notes}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                        {/* Quantity control */}
                        <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.procedure.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-slate-800 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.procedure.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right min-w-[90px]">
                          <span className="text-[10px] text-slate-400 block font-medium">Subtotal</span>
                          <span className="text-sm font-extrabold text-[#0E7B86] font-mono">
                            {formatCurrencyBRL(subtotal)}
                          </span>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.procedure.id)}
                          className="p-1.5 text-slate-400 hover:text-[#B01B52] hover:bg-[#FDF2F6] rounded-lg transition-colors cursor-pointer"
                          title="Remover procedimento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
      </div>

      {/* FULL PANORAMIC MODAL (For Quote & A4 Print) */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150 print:hidden">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#095962] via-[#0E7B86] to-[#095962] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#0E7B86]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#B01B52] flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white m-0 tracking-tight">
                    Orçamento Cirúrgico & Procedimentos
                  </h3>
                  <p className="text-xs text-[#EBF7F8] m-0">
                    Hospital Palmas Medical • Emissão de Guia A4 e Condições de Pagamento
                  </p>
                </div>
              </div>

              {/* View Mode Toggle: Edição vs Pré-visualização A4 */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/15 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setModalQuoteTab('editor')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      modalQuoteTab === 'editor'
                        ? 'bg-white text-[#095962] shadow-xs'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Itens & Dados
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalQuoteTab('preview')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      modalQuoteTab === 'preview'
                        ? 'bg-white text-[#095962] shadow-xs'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visualizar Documento A4</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                  title="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            {modalQuoteTab === 'editor' ? (
              <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 bg-slate-50">
              {/* Summary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">Valor Total Estimado</span>
                  <div className="text-xl font-black text-[#B01B52] mt-1 font-mono">
                    {formatCurrencyBRL(cartTotal)}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">Parcelamento Cartão</span>
                  <div className="text-base font-black text-slate-900 mt-1 font-mono">
                    Até 6x de {formatCurrencyBRL(installment6x)}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">Total de Itens</span>
                  <div className="text-xl font-black text-[#0E7B86] mt-1">
                    {totalItemsCount} {totalItemsCount === 1 ? 'procedimento' : 'procedimentos'}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">Vigência da Tabela</span>
                  <div className="text-xs font-extrabold text-slate-800 mt-2 truncate">
                    {PROCEDURES_METADATA.vigencia}
                  </div>
                </div>
              </div>

              {/* Patient and Doctor info fields */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">
                    Nome do Paciente
                  </label>
                  <input
                    type="text"
                    placeholder="Ex.: Maria Aparecida da Silva"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0E7B86] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">
                    Médico(a) Responsável
                  </label>
                  <input
                    type="text"
                    placeholder="Ex.: Dr. Diego Moreira"
                    value={doctorName}
                    onChange={e => setDoctorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0E7B86] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">
                    Observações / Orientações
                  </label>
                  <input
                    type="text"
                    placeholder="Ex.: Necessidade de reserva de sangue, leito de UTI..."
                    value={quoteNotes}
                    onChange={e => setQuoteNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0E7B86] focus:bg-white"
                  />
                </div>
              </div>

              {/* Table of Procedures */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
                <div className="p-4 bg-[#EBF7F8] border-b border-[#C4E5E8] flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#095962] uppercase tracking-wider m-0">
                    Relação de Procedimentos & Diárias Inclusas
                  </h4>
                  <span className="text-xs text-slate-600 font-medium">
                    {cartItems.length} cadastrados
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-[#095962] text-white">
                        <th className="py-3 px-3 font-bold w-12 text-center">#</th>
                        <th className="py-3 px-4 font-bold">Descrição do Procedimento</th>
                        <th className="py-3 px-3 font-bold w-32">Categoria</th>
                        <th className="py-3 px-3 font-bold w-24 text-center">Diárias</th>
                        <th className="py-3 px-3 font-bold w-20 text-center">Qtd</th>
                        <th className="py-3 px-3 font-bold w-28 text-right">Valor Unit.</th>
                        <th className="py-3 px-3 font-bold w-32 text-right">Subtotal</th>
                        <th className="py-3 px-3 font-bold w-14 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cartItems.map((item, idx) => {
                        const subtotal = item.procedure.price * item.quantity;

                        return (
                          <tr key={item.procedure.id} className="hover:bg-[#EBF7F8]/30 transition-colors">
                            <td className="py-3 px-3 text-center font-bold text-slate-400">
                              {idx + 1}
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900 leading-snug">
                                {item.procedure.description}
                              </div>
                              {item.procedure.notes && (
                                <div className="text-[11px] text-amber-700 font-medium mt-0.5">
                                  {item.procedure.notes}
                                </div>
                              )}
                            </td>

                            <td className="py-3 px-3 text-slate-600">
                              <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold">
                                {item.procedure.category}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-center font-bold text-slate-700">
                              {item.procedure.diarias}
                            </td>

                            <td className="py-3 px-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(item.procedure.id, item.quantity - 1)}
                                  className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded font-bold cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="font-mono font-bold text-slate-900 w-5 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(item.procedure.id, item.quantity + 1)}
                                  className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded font-bold cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            <td className="py-3 px-3 text-right font-mono font-medium text-slate-700">
                              {formatCurrencyBRL(item.procedure.price)}
                            </td>

                            <td className="py-3 px-3 text-right font-mono font-bold text-[#0E7B86]">
                              {formatCurrencyBRL(subtotal)}
                            </td>

                            <td className="py-3 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.procedure.id)}
                                className="p-1 text-slate-400 hover:text-[#B01B52] hover:bg-[#FDF2F6] rounded transition-colors cursor-pointer"
                                title="Remover item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Legal Notes & Disclaimers */}
              <div className="bg-[#EBF7F8] border border-[#C4E5E8] rounded-2xl p-4 text-xs space-y-1.5 text-slate-700">
                <div className="font-extrabold text-[#095962] uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#0E7B86]" />
                  Termos e Condições do Orçamento Hospitalar:
                </div>
                <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] leading-relaxed">
                  <li><strong>Honorários Médicos:</strong> Valores exclusivamente hospitalares. Honorários de cirurgião, anestesista e instrumentador não inclusos.</li>
                  <li><strong>OPMES:</strong> Órteses, próteses e materiais especiais não estão contemplados nos valores básicos.</li>
                  <li><strong>Formas de Pagamento:</strong> Dinheiro, Cartão de Débito, Transferência/PIX ou em até 6x no Cartão de Crédito.</li>
                  <li><strong>Dúvidas de Orçamento:</strong> Setor de Orçamento do Hospital - (63) 99989-1818.</li>
                </ul>
              </div>
            </div>
            ) : (
              /* Modal Body - Mode 2: Live A4 Document Preview */
              <div className="p-4 sm:p-6 bg-slate-100 overflow-y-auto flex-1">
                <div className="text-center mb-3">
                  <span className="text-xs font-semibold text-slate-500">
                    Pré-visualização do documento oficial pronto para impressão ou salvamento em PDF (A4):
                  </span>
                </div>
                <HospitalPatientQuote
                  type="procedimentos"
                  patientName={patientName}
                  doctorName={doctorName}
                  tableReference="Tabela Oficial de Pacotes Cirúrgicos & Procedimentos 2026"
                  notes={quoteNotes}
                  items={quoteItemsForProcedures}
                  total={cartTotal}
                  installmentCount={6}
                  isPrintPreview={true}
                />
              </div>
            )}

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500 font-medium">
                Total consolidado: <strong className="text-slate-900 text-sm font-mono">{formatCurrencyBRL(cartTotal)}</strong> ({totalItemsCount} procedimentos)
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-end">
                <button
                  type="button"
                  onClick={handleCopyBudget}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  {copiedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Copiado para WhatsApp!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Copiar Resumo</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePrintQuote}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B01B52] hover:bg-[#971444] text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-white" />
                  <span>Imprimir / Salvar em PDF (A4)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
