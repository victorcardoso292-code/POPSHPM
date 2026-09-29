import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Printer, 
  Trash2, 
  Check, 
  Lock, 
  RotateCcw, 
  Edit3, 
  Sparkles,
  Activity,
  CheckCircle2,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  FileText,
  X,
  Eye,
  Layers,
  ArrowRight,
  SlidersHorizontal,
  FileUp,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { ExamRow, ExamTableType, SelectedExamItem } from '../types';
import { parseMoneyValue, formatCurrencyBRL, isImagingExamWithContrast } from '../data/examData';
import { HospitalPatientQuote, QuoteItem } from './HospitalPatientQuote';

export interface ParsedBatchExam {
  code: string;
  description: string;
  particularPrice: string;
  medPrevPrice: string;
  pageRef: string;
}

export function normalizeExamStr(s: string): string {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanPrice(p: string): string {
  const s = (p || '').trim().replace(/^R\$\s*/i, '');
  if (!s || s === '*' || s === '-' || s === '—') return '*';
  return s;
}

export function parseBatchExamLine(line: string): ParsedBatchExam | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  if (lower.startsWith('código') || lower.startsWith('tuss') || lower.startsWith('descrição') || lower.startsWith('procedimento')) {
    return null;
  }

  // Formato 1: JSON array syntax ["40305015", "Nome", "175,09", "*", "1"]
  if (trimmed.startsWith('[') && (trimmed.endsWith(']') || trimmed.endsWith('],'))) {
    try {
      const cleanJson = trimmed.replace(/,\s*$/, '');
      const arr = JSON.parse(cleanJson);
      if (Array.isArray(arr) && arr.length >= 2) {
        return {
          code: String(arr[0] || '').trim(),
          description: String(arr[1] || '').trim(),
          particularPrice: cleanPrice(String(arr[2] || '*')),
          medPrevPrice: cleanPrice(String(arr[3] || '*')),
          pageRef: String(arr[4] || '').trim()
        };
      }
    } catch {
      // continua para outros formatos
    }
  }

  // Formato 2: Separado por Tab, Ponto e Vírgula ou Pipe
  let parts: string[] = [];
  if (trimmed.includes('\t')) {
    parts = trimmed.split('\t').map(s => s.trim()).filter(Boolean);
  } else if (trimmed.includes(';')) {
    parts = trimmed.split(';').map(s => s.trim()).filter(Boolean);
  } else if (trimmed.includes('|')) {
    parts = trimmed.split('|').map(s => s.trim()).filter(Boolean);
  }

  if (parts.length >= 2) {
    let code = '';
    let description = '';
    let particularPrice = '*';
    let medPrevPrice = '*';
    let pageRef = '';

    const firstClean = parts[0].replace(/[\.\-]/g, '').trim();
    if (/^\d{6,10}$/.test(firstClean)) {
      code = firstClean;
      description = parts[1];
      if (parts[2]) particularPrice = parts[2];
      if (parts[3]) medPrevPrice = parts[3];
      if (parts[4]) pageRef = parts[4];
    } else {
      description = parts[0];
      if (parts[1]) particularPrice = parts[1];
      if (parts[2]) medPrevPrice = parts[2];
      if (parts[3]) pageRef = parts[3];
    }

    if (description) {
      return {
        code,
        description: description.replace(/^[\s\-\:\;\|]+|[\s\-\:\;\|]+$/g, '').trim(),
        particularPrice: cleanPrice(particularPrice),
        medPrevPrice: cleanPrice(medPrevPrice),
        pageRef
      };
    }
  }

  // Formato 3: Linha de texto com Código TUSS inicial (6 a 10 dígitos)
  const codeMatch = trimmed.match(/^(\d{6,10})[\s\-:\|]+(.+)$/);
  let code = '';
  let rest = trimmed;
  if (codeMatch) {
    code = codeMatch[1];
    rest = codeMatch[2].trim();
  }

  const priceEndMatch = rest.match(/(?:R\$\s*)?(\d{1,4}(?:\.\d{3})*,\d{2}|\d+\.\d{2})(?:\s+(\d+))?$/i);
  let particularPrice = '*';
  let pageRef = '';
  let description = rest;

  if (priceEndMatch) {
    particularPrice = priceEndMatch[1];
    pageRef = priceEndMatch[2] || '';
    description = rest.slice(0, rest.lastIndexOf(priceEndMatch[0])).trim();
  }

  description = description.replace(/^[\s\-\:\;\|]+|[\s\-\:\;\|]+$/g, '').trim();
  if (!description) return null;

  return {
    code,
    description,
    particularPrice: cleanPrice(particularPrice),
    medPrevPrice: '*',
    pageRef
  };
}

interface ExamValuesViewerProps {
  psExams: ExamRow[];
  amorExams: ExamRow[];
  labExams: ExamRow[];
  onSaveExams: (table: ExamTableType, exams: ExamRow[]) => void;
  onResetExams: (table: ExamTableType) => void;
  isMaster: boolean;
  selectedExams: { [key: string]: SelectedExamItem };
  onToggleSelectExam: (table: ExamTableType, index: number, exam: ExamRow, contrast?: boolean) => void;
  onUpdateExamQuantity?: (key: string, qty: number) => void;
  onRemoveExamItem?: (key: string) => void;
  onClearSelectedExams: () => void;
  onOpenMaster: () => void;
  onNavigateToPreGuia?: (primaryConvenio: string, code?: string, desc?: string) => void;
  initialSearch?: string;
}

export const ExamValuesViewer: React.FC<ExamValuesViewerProps> = ({
  psExams,
  amorExams,
  labExams,
  onSaveExams,
  onResetExams,
  isMaster,
  selectedExams,
  onToggleSelectExam,
  onUpdateExamQuantity,
  onRemoveExamItem,
  onClearSelectedExams,
  onOpenMaster,
  onNavigateToPreGuia,
  initialSearch = ''
}) => {
  const [activeTable, setActiveTable] = useState<ExamTableType>('ps');
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [psPriceMode, setPsPriceMode] = useState<'particular' | 'medPrev'>('particular');
  const [labLetter, setLabLetter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  React.useEffect(() => {
    if (initialSearch) {
      setSearchTerm(initialSearch);
      setCurrentPage(1);
    }
  }, [initialSearch]);

  // Editing / Adding State
  const [editingExamIndex, setEditingExamIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Form states for adding/editing
  const [formCode, setFormCode] = useState<string>('');
  const [formDesc, setFormDesc] = useState<string>('');
  const [formPartPrice, setFormPartPrice] = useState<string>('');
  const [formMedPrice, setFormMedPrice] = useState<string>('');
  const [formPageRef, setFormPageRef] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Expanded Quote Modal & View states
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [modalQuoteTab, setModalQuoteTab] = useState<'editor' | 'preview'>('editor');
  const [isInlineQuoteExpanded, setIsInlineQuoteExpanded] = useState<boolean>(true);
  const [patientNameQuote, setPatientNameQuote] = useState<string>('');
  const [quoteNotes, setQuoteNotes] = useState<string>('');
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);

  // Batch Import Modal State & Deduplication
  const [showBatchImportModal, setShowBatchImportModal] = useState<boolean>(false);
  const [batchImportText, setBatchImportText] = useState<string>('');
  const [batchImportSuccessMsg, setBatchImportSuccessMsg] = useState<string>('');

  const PAGE_SIZE = 5; // Requisito: 5 exames por página em todas as abas

  const currentDataset = useMemo(() => {
    if (activeTable === 'amor') return amorExams;
    if (activeTable === 'lab') return labExams;
    return psExams;
  }, [activeTable, psExams, amorExams, labExams]);

  // Batch import parser & deduplication against currentDataset
  const batchParsedResults = useMemo(() => {
    if (!batchImportText.trim()) return [];
    const lines = batchImportText.split('\n');
    const existingCodes = new Set(currentDataset.map(e => e.code.trim()).filter(Boolean));
    const existingDesc = new Set(currentDataset.map(e => normalizeExamStr(e.description)));
    
    const seenCodesInBatch = new Set<string>();
    const seenDescInBatch = new Set<string>();

    const list: (ParsedBatchExam & { isDuplicate: boolean; duplicateReason: string })[] = [];

    for (const rawLine of lines) {
      const parsed = parseBatchExamLine(rawLine);
      if (!parsed) continue;

      const normD = normalizeExamStr(parsed.description);
      let isDuplicate = false;
      let duplicateReason = '';

      if (parsed.code && existingCodes.has(parsed.code)) {
        isDuplicate = true;
        duplicateReason = `Código TUSS ${parsed.code} já cadastrado no sistema`;
      } else if (existingDesc.has(normD)) {
        isDuplicate = true;
        duplicateReason = `Exame com mesma descrição já cadastrado`;
      } else if (parsed.code && seenCodesInBatch.has(parsed.code)) {
        isDuplicate = true;
        duplicateReason = `Código repetido na própria lista colada`;
      } else if (seenDescInBatch.has(normD)) {
        isDuplicate = true;
        duplicateReason = `Descrição repetida na própria lista colada`;
      }

      if (parsed.code) seenCodesInBatch.add(parsed.code);
      seenDescInBatch.add(normD);

      list.push({
        ...parsed,
        isDuplicate,
        duplicateReason
      });
    }

    return list;
  }, [batchImportText, currentDataset]);

  const newBatchExams = useMemo(() => {
    return batchParsedResults.filter(r => !r.isDuplicate);
  }, [batchParsedResults]);

  const duplicateBatchExams = useMemo(() => {
    return batchParsedResults.filter(r => r.isDuplicate);
  }, [batchParsedResults]);

  const handleConfirmBatchImport = () => {
    if (newBatchExams.length === 0) return;

    const newRows: ExamRow[] = newBatchExams.map(item => ({
      code: item.code,
      description: item.description,
      particularPrice: item.particularPrice,
      medPrevPrice: activeTable === 'amor' ? '*' : item.medPrevPrice,
      pageRef: item.pageRef,
      isCustom: true
    }));

    const updated = [...newRows, ...currentDataset];
    onSaveExams(activeTable, updated);
    setBatchImportSuccessMsg(`Sucesso! ${newRows.length} novo(s) exame(s) adicionado(s) com sucesso à tabela.`);
    setTimeout(() => {
      setShowBatchImportModal(false);
      setBatchImportSuccessMsg('');
      setBatchImportText('');
    }, 1800);
  };

  // Filtered exams list
  const filteredExams = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    let result = currentDataset.map((exam, index) => ({ exam, index }));

    if (q) {
      result = result.filter(({ exam }) => 
        exam.description.toLowerCase().includes(q) || 
        exam.code.toLowerCase().includes(q) ||
        exam.pageRef.toLowerCase().includes(q)
      );
    }

    if (activeTable === 'lab' && labLetter) {
      const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toUpperCase();
      result = result.filter(({ exam }) => normalize(exam.description).startsWith(labLetter));
    }

    return result;
  }, [currentDataset, searchTerm, activeTable, labLetter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredExams.length / PAGE_SIZE));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedExams = useMemo(() => {
    const start = (validCurrentPage - 1) * PAGE_SIZE;
    return filteredExams.slice(start, start + PAGE_SIZE);
  }, [filteredExams, validCurrentPage]);

  // Reset page when switching tabs or filtering
  React.useEffect(() => {
    setCurrentPage(1);
    setJumpPageInput('');
  }, [searchTerm, labLetter, activeTable]);

  // Selected items list & Calculations
  const selectedEntries = useMemo(() => Object.entries(selectedExams), [selectedExams]);
  const selectedList = useMemo(() => Object.values(selectedExams), [selectedExams]);
  
  const getItemUnitPrice = (item: SelectedExamItem) => {
    let unit = 0;
    if (item.tableType === 'amor') {
      unit = parseMoneyValue(item.exam.particularPrice);
    } else if (item.tableType === 'lab') {
      unit = parseMoneyValue(item.exam.particularPrice);
    } else {
      unit = parseMoneyValue(item.exam.particularPrice);
    }
    return unit;
  };

  const getItemTotal = (item: SelectedExamItem) => {
    const unit = getItemUnitPrice(item);
    const contrastCost = item.hasContrast ? 250 : 0;
    const qty = item.quantity || 1;
    return (unit + contrastCost) * qty;
  };

  const cartTotal = useMemo(() => {
    return selectedList.reduce((acc, item) => acc + getItemTotal(item), 0);
  }, [selectedList]);

  const totalContrastCount = useMemo(() => {
    return selectedList.filter(item => item.hasContrast).length;
  }, [selectedList]);

  const totalExamItemsCount = useMemo(() => {
    return selectedList.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [selectedList]);

  const tableRefName = useMemo(() => {
    if (activeTable === 'amor') return 'Tabela Amor Saúde Contratual 2026';
    if (activeTable === 'lab') return 'Tabela Laboratorial TUSS';
    return 'Pronto-Socorro / Particular';
  }, [activeTable]);

  const quoteItemsForExams: QuoteItem[] = useMemo(() => {
    return selectedList.map(item => {
      const unit = getItemUnitPrice(item);
      const subtotal = getItemTotal(item);
      const detail = item.hasContrast ? 'Com Contraste (+ R$ 250,00)' : 'Sem Contraste';
      return {
        code: item.exam.code || undefined,
        description: item.exam.description,
        category: item.exam.category || undefined,
        detail,
        quantity: item.quantity || 1,
        unitPrice: unit,
        subtotal
      };
    });
  }, [selectedList, psPriceMode]);

  // Open edit modal
  const handleOpenEdit = (index: number) => {
    const exam = currentDataset[index];
    if (!exam) return;
    setEditingExamIndex(index);
    setFormCode(exam.code);
    setFormDesc(exam.description);
    setFormPartPrice(exam.particularPrice === '*' ? '' : exam.particularPrice);
    setFormMedPrice(exam.medPrevPrice === '*' ? '' : exam.medPrevPrice);
    setFormPageRef(exam.pageRef);
    setFormError('');
    setShowAddForm(true);
  };

  // Open add form
  const handleOpenAdd = () => {
    setEditingExamIndex(null);
    setFormCode('');
    setFormDesc('');
    setFormPartPrice('');
    setFormMedPrice('');
    setFormPageRef('');
    setFormError('');
    setShowAddForm(true);
  };

  // Save exam form
  const handleSaveExamForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDesc.trim()) {
      setFormError('Informe a descrição do exame.');
      return;
    }

    const norm = (v: string) => {
      const s = v.trim().replace(/^R\$\s*/i, '');
      return s ? s : '*';
    };

    const newRow: ExamRow = {
      code: formCode.trim(),
      description: formDesc.trim(),
      particularPrice: norm(formPartPrice),
      medPrevPrice: activeTable === 'amor' ? '*' : norm(formMedPrice),
      pageRef: formPageRef.trim(),
      isCustom: true
    };

    const updated = [...currentDataset];
    if (editingExamIndex !== null) {
      updated[editingExamIndex] = newRow;
    } else {
      updated.unshift(newRow);
    }

    onSaveExams(activeTable, updated);
    setShowAddForm(false);
  };

  // Print Quote Slip
  const handlePrintQuote = () => {
    window.print();
  };

  // Copy formatted quote to clipboard
  const handleCopyQuoteToClipboard = () => {
    if (selectedList.length === 0) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    let text = `🏥 *HOSPITAL PALMAS MEDICAL - ORÇAMENTO DE EXAMES*\n`;
    text += `📅 Emissão: ${dateStr} às ${timeStr}\n`;
    if (patientNameQuote.trim()) {
      text += `👤 Paciente: ${patientNameQuote.trim()}\n`;
    }
    text += `📋 Base/Tabela: ${activeTable === 'amor' ? 'Amor Saúde (Contratual)' : (activeTable === 'lab' ? 'Exames Laboratoriais' : 'Pronto-Socorro / Particular')}\n`;
    text += `--------------------------------------------------\n`;

    selectedList.forEach((item, i) => {
      const unit = getItemUnitPrice(item);
      const subtotal = getItemTotal(item);
      const contrastInfo = item.hasContrast ? ' | +Contraste (R$ 250,00)' : '';
      const qty = item.quantity || 1;
      text += `${i + 1}. ${item.exam.code ? `[${item.exam.code}] ` : ''}${item.exam.description}\n`;
      text += `   Qtd: ${qty} | Unit.: ${formatCurrencyBRL(unit)}${contrastInfo} | Subtotal: ${formatCurrencyBRL(subtotal)}\n`;
    });

    text += `--------------------------------------------------\n`;
    text += `💰 *VALOR TOTAL ESTIMADO: ${formatCurrencyBRL(cartTotal)}*\n`;
    text += `💳 *Formas de Pagamento:* À vista (PIX, Débito ou Dinheiro). Cartão de Crédito Paciente PS é apenas no crédito à vista 1x.\n`;
    if (quoteNotes.trim()) {
      text += `📝 Obs: ${quoteNotes.trim()}\n`;
    }
    text += `\n* Validade do orçamento: 7 dias. Valores sujeitos à confirmação no momento da admissão/atendimento.`;

    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2500);
  };

  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      setJumpPageInput('');
    }
  };

  return (
    <div className="space-y-5">
      {/* Printable Area for Hospital Quote (A4 Formatted) */}
      <div id="print-exam-slip" className="hidden print:block font-sans text-slate-900 w-full m-0 p-0">
        <HospitalPatientQuote
          type="exames"
          patientName={patientNameQuote}
          tableReference={tableRefName}
          notes={quoteNotes}
          items={quoteItemsForExams}
          total={cartTotal}
          installmentCount={1}
        />
      </div>

      {/* Main Interactive Screen View */}
      <div className="print:hidden space-y-5">
        {/* Navigation Sub-Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveTable('ps')}
              className={`px-4 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTable === 'ps'
                  ? 'bg-[#0E7B86] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-[#EBF7F8] text-slate-700 hover:text-[#0E7B86]'
              }`}
            >
              <span>Pronto-Socorro / Particular</span>
              <span className={`text-xs px-2 py-0.5 rounded-lg font-black ${
                activeTable === 'ps' ? 'bg-[#095962] text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {psExams.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTable('amor')}
              className={`px-4 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTable === 'amor'
                  ? 'bg-[#0E7B86] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-[#EBF7F8] text-slate-700 hover:text-[#0E7B86]'
              }`}
            >
              <span>Amor Saúde (Contratual)</span>
              <span className={`text-xs px-2 py-0.5 rounded-lg font-black ${
                activeTable === 'amor' ? 'bg-[#095962] text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {amorExams.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTable('lab')}
              className={`px-4 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTable === 'lab'
                  ? 'bg-[#0E7B86] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-[#EBF7F8] text-slate-700 hover:text-[#0E7B86]'
              }`}
            >
              <span>Exames Laboratoriais</span>
              <span className={`text-xs px-2 py-0.5 rounded-lg font-black ${
                activeTable === 'lab' ? 'bg-[#095962] text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {labExams.length}
              </span>
            </button>
          </div>

          {/* Master Edit Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Batch Import Button - Always accessible, ideal for importing lab exams */}
            <button
              type="button"
              onClick={() => {
                setBatchImportText('');
                setBatchImportSuccessMsg('');
                setShowBatchImportModal(true);
              }}
              className="flex items-center gap-1.5 bg-[#0E7B86] hover:bg-[#095962] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
              title="Importar lista ou colar exames com desconsideração automática de duplicatas"
            >
              <FileUp className="w-4 h-4" />
              <span>Importar Lista / Lote</span>
            </button>

            {isMaster ? (
              <>
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="flex items-center gap-1.5 bg-[#0E7B86] hover:bg-[#095962] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Exame</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Restaurar os valores padrão de fábrica desta tabela?')) {
                      onResetExams(activeTable);
                    }
                  }}
                  className="flex items-center gap-1 bg-slate-100 hover:bg-[#FDF2F6] text-slate-600 hover:text-[#B01B52] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 transition-colors cursor-pointer"
                  title="Restaurar tabela padrão"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Restaurar Padrão</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onOpenMaster}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 hover:text-[#0E7B86] font-semibold px-2 py-1 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#0E7B86]" />
                <span>Entrar como Master para editar</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Price Basis Switch Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder={`Buscar exame por nome, código TUSS ou termo... (${filteredExams.length} disponíveis)`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-900"
            />
          </div>

          {/* Basis Indicator for PS */}
          {activeTable === 'ps' && (
            <div className="flex items-center gap-2 bg-[#EBF7F8] border border-[#C4E5E8] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#0E7B86]">
              <span className="text-slate-500 font-medium">Tabela:</span>
              <span className="font-black text-[#095962]">Particular / PS</span>
            </div>
          )}
        </div>

        {/* Alphabet quick jump for Laboratory */}
        {activeTable === 'lab' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex items-center gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setLabLetter('')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                labLetter === '' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todos
            </button>
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(char => (
              <button
                key={char}
                type="button"
                onClick={() => setLabLetter(char)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex-shrink-0 flex items-center justify-center ${
                  labLetter === char ? 'bg-teal-700 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {char}
              </button>
            ))}
          </div>
        )}

        {/* Master Add / Edit Form Box */}
        {showAddForm && isMaster && (
          <div className="bg-teal-50/80 border-2 border-teal-600/60 rounded-2xl p-5 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-teal-200 pb-2">
              <h4 className="text-sm font-black text-teal-950 m-0">
                {editingExamIndex !== null ? 'Alterar Valor do Exame' : 'Cadastrar Novo Exame'}
              </h4>
              <span className="text-xs text-teal-700 font-bold">Modo Master</span>
            </div>

            <form onSubmit={handleSaveExamForm} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">Código TUSS (Opcional)</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    placeholder="Ex.: 41001079"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">Descrição do Exame *</label>
                  <input
                    type="text"
                    required
                    value={formDesc}
                    onChange={e => setFormDesc(e.target.value)}
                    placeholder="Ex.: TOMOGRAFIA DE TÓRAX"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">Ref / Pág</label>
                  <input
                    type="text"
                    value={formPageRef}
                    onChange={e => setFormPageRef(e.target.value)}
                    placeholder="Opcional"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">
                    {activeTable === 'amor' ? 'Valor Amor Saúde (R$)' : (activeTable === 'lab' ? 'Valor Unitário (R$)' : 'Particular / Médica (R$)')}
                  </label>
                  <input
                    type="text"
                    value={formPartPrice}
                    onChange={e => setFormPartPrice(e.target.value)}
                    placeholder="Ex.: 400,00"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-teal-900 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                {activeTable === 'ps' && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">Valor MedPrev (R$)</label>
                    <input
                      type="text"
                      value={formMedPrice}
                      onChange={e => setFormMedPrice(e.target.value)}
                      placeholder="Ex.: 330,00"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-teal-900 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                )}
              </div>

              {formError && (
                <p className="text-xs font-bold text-rose-600 m-0">{formError}</p>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Salvar Exame
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Exams Table (5 Exams Per Page) */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900 text-white border-b border-slate-800 text-xs sm:text-sm font-black">
                  <th className="py-3.5 px-3.5 font-black text-center w-32">Seleção</th>
                  {activeTable === 'ps' && (
                    <th className="py-3.5 px-3.5 font-black text-center w-44 bg-emerald-950/90 text-emerald-300 border-x border-slate-800">
                      Contraste (+R$ 250)
                    </th>
                  )}
                  <th className="py-3.5 px-3.5 font-black w-32">Código TUSS</th>
                  <th className="py-3.5 px-4 font-black">Descrição Completa do Exame</th>
                  {activeTable === 'ps' && (
                    <th className="py-3.5 px-3.5 font-black text-right w-36">Valor Particular</th>
                  )}
                  {activeTable === 'amor' && (
                    <th className="py-3.5 px-4 font-black text-right w-40">Valor Amor Saúde</th>
                  )}
                  {activeTable === 'lab' && (
                    <th className="py-3.5 px-4 font-black text-right w-40">Valor Unitário</th>
                  )}
                  {isMaster && (
                    <th className="py-3.5 px-3 font-black text-center w-24">Editar</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedExams.length === 0 ? (
                  <tr>
                    <td colSpan={activeTable === 'ps' ? (isMaster ? 6 : 5) : (isMaster ? 5 : 4)} className="py-12 text-center text-slate-500 font-medium text-sm">
                      Nenhum exame encontrado com os critérios informados.
                    </td>
                  </tr>
                ) : (
                  paginatedExams.map(({ exam, index }) => {
                    const examKey = `${activeTable}-${index}`;
                    const isSelected = !!selectedExams[examKey];
                    const hasContrastSelected = isSelected && !!selectedExams[examKey].hasContrast;
                    const canHaveContrast = activeTable === 'ps' && isImagingExamWithContrast(exam.description);

                    return (
                      <tr 
                        key={examKey} 
                        className={`transition-colors hover:bg-teal-50/40 ${
                          isSelected ? 'bg-teal-50/70 font-semibold' : ''
                        }`}
                      >
                        {/* Checkbox / select button */}
                        <td className="py-4 px-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => onToggleSelectExam(activeTable, index, exam, hasContrastSelected)}
                            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border flex items-center justify-center gap-1.5 mx-auto w-full max-w-[110px] cursor-pointer ${
                              isSelected
                                ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-4 h-4" />
                                <span>Adicionado</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 text-slate-400" />
                                <span>Selecionar</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Contraste NA FRENTE (Column 2 on PS Table) */}
                        {activeTable === 'ps' && (
                          <td className="py-4 px-3.5 text-center bg-slate-50/50 border-x border-slate-100">
                            {canHaveContrast ? (
                              <button
                                type="button"
                                onClick={() => {
                                  if (!isSelected) {
                                    onToggleSelectExam(activeTable, index, exam, true);
                                  } else {
                                    onToggleSelectExam(activeTable, index, exam, !hasContrastSelected);
                                  }
                                }}
                                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-black transition-all border w-full max-w-[155px] shadow-xs flex items-center justify-center gap-1.5 mx-auto cursor-pointer ${
                                  hasContrastSelected
                                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-600/30'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                                }`}
                                title={hasContrastSelected ? "Contraste incluído (+ R$ 250,00)" : "Adicionar contraste (+ R$ 250,00)"}
                              >
                                {hasContrastSelected ? (
                                  <>
                                    <Check className="w-4 h-4 text-white" />
                                    <span>c/ Contraste</span>
                                  </>
                                ) : (
                                  <span>+ Contraste</span>
                                )}
                              </button>
                            ) : (
                              <span className="text-slate-300 text-xs font-medium">—</span>
                            )}
                          </td>
                        )}

                        {/* Code */}
                        <td className="py-4 px-3.5 font-mono text-slate-800 font-bold">
                          {exam.code ? (
                            <span className="bg-slate-100 text-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 font-mono text-xs sm:text-sm font-black">
                              {exam.code}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal">—</span>
                          )}
                        </td>

                        {/* Description - spacious, bold and fully visible */}
                        <td className="py-4 px-4 text-slate-900">
                          <div className="font-bold text-sm sm:text-base leading-snug">
                            {exam.description}
                          </div>
                          {exam.isCustom && (
                            <span className="inline-block mt-1 text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                              PERSONALIZADO
                            </span>
                          )}
                          {exam.pageRef && (
                            <span className="inline-block mt-1 ml-2 text-xs text-slate-400 font-medium">
                              Ref: {exam.pageRef}
                            </span>
                          )}
                        </td>

                        {/* PS Prices */}
                        {activeTable === 'ps' && (
                          <td className="py-4 px-3.5 text-right font-mono font-black text-teal-900 text-sm sm:text-base">
                            {exam.particularPrice === '*' ? (
                              <span className="text-slate-400 font-normal text-xs">Consultar</span>
                            ) : (
                              `R$ ${exam.particularPrice}`
                            )}
                          </td>
                        )}

                        {/* Amor Saúde Price */}
                        {activeTable === 'amor' && (
                          <td className="py-4 px-4 text-right font-mono font-black text-teal-900 text-sm sm:text-base">
                            {exam.particularPrice === '*' ? (
                              <span className="text-slate-400 font-normal text-xs">Consultar</span>
                            ) : (
                              `R$ ${exam.particularPrice}`
                            )}
                          </td>
                        )}

                        {/* Lab Price */}
                        {activeTable === 'lab' && (
                          <td className="py-4 px-4 text-right font-mono font-black text-teal-900 text-sm sm:text-base">
                            {formatCurrencyBRL(parseMoneyValue(exam.particularPrice))}
                          </td>
                        )}

                        {/* Edit Action for Master */}
                        {isMaster && (
                          <td className="py-3.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(index)}
                              className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-teal-700 rounded-lg transition-colors"
                              title="Editar este exame"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Unified Pagination Bar (5 items per page on all tabs) */}
          <div className="border-t border-slate-200 p-3.5 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <span>
                Mostrando <strong className="text-slate-900">{filteredExams.length > 0 ? (validCurrentPage - 1) * PAGE_SIZE + 1 : 0}</strong> a <strong className="text-slate-900">{Math.min(validCurrentPage * PAGE_SIZE, filteredExams.length)}</strong> de <strong className="text-slate-900">{filteredExams.length}</strong> exames
              </span>
              <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200">
                5 por página
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {/* First Page */}
              <button
                type="button"
                disabled={validCurrentPage <= 1}
                onClick={() => setCurrentPage(1)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Primeira página"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Prev Page */}
              <button
                type="button"
                disabled={validCurrentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>

              {/* Numbered Page Buttons */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p = i + 1;
                  if (totalPages > 5) {
                    if (validCurrentPage <= 3) {
                      p = i + 1;
                    } else if (validCurrentPage >= totalPages - 2) {
                      p = totalPages - 4 + i;
                    } else {
                      p = validCurrentPage - 2 + i;
                    }
                  }
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        validCurrentPage === p
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              {/* Next Page */}
              <button
                type="button"
                disabled={validCurrentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
              >
                <span>Próxima</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Last Page */}
              <button
                type="button"
                disabled={validCurrentPage >= totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Última página"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>

              {/* Jump to page if many */}
              {totalPages > 5 && (
                <form onSubmit={handleJumpPage} className="flex items-center gap-1 ml-2">
                  <span className="text-[11px] text-slate-400">Ir:</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    placeholder={validCurrentPage.toString()}
                    value={jumpPageInput}
                    onChange={e => setJumpPageInput(e.target.value)}
                    className="w-12 px-1.5 py-1 text-center bg-white border border-slate-200 rounded-md text-xs font-bold focus:ring-1 focus:ring-teal-500"
                  />
                </form>
              )}
            </div>
          </div>
        </div>

        {/* EXPANDED FULL-VIEW ORÇAMENTO PANEL (Sticky Bottom with Full Item Descriptions) */}
        {selectedList.length > 0 && (
          <div className="bg-white text-slate-900 border-2 border-[#0E7B86]/35 rounded-2xl shadow-xl overflow-hidden sticky bottom-3 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Top Bar of the Budget Cart */}
            <div className="p-4 bg-gradient-to-r from-[#095962] via-[#0E7B86] to-[#095962] text-white flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#B01B52] flex items-center justify-center font-bold text-white shadow-md flex-shrink-0">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs uppercase tracking-wider font-extrabold text-[#EBF7F8]">
                      Orçamento Hospitalar Integrado
                    </span>
                    <span className="bg-white/15 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-white/20">
                      {totalExamItemsCount} Exame{totalExamItemsCount > 1 ? 's' : ''}
                    </span>
                    {totalContrastCount > 0 && (
                      <span className="bg-[#B01B52] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-[#F6C6D6]/40 shadow-xs">
                        {totalContrastCount} c/ Contraste
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-black text-white leading-tight mt-0.5 flex items-baseline gap-2">
                    <span className="text-white/85 text-xs font-semibold uppercase tracking-wider">Total Estimado:</span>
                    <span className="text-white font-mono font-black text-2xl tracking-tight">{formatCurrencyBRL(cartTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsInlineQuoteExpanded(v => !v)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#EBF7F8]" />
                  <span>{isInlineQuoteExpanded ? 'Recolher Lista' : 'Ver Descrições'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#0E7B86] hover:bg-[#EBF7F8] text-xs font-black shadow-xs transition-all cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#0E7B86]" />
                  <span>Expandir Orçamento Completo</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintQuote}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#B01B52] hover:bg-[#971444] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-white" />
                  <span>Imprimir Guia A4</span>
                </button>

                <button
                  type="button"
                  onClick={onClearSelectedExams}
                  className="p-2 rounded-xl bg-white/10 hover:bg-[#B01B52] text-white/80 hover:text-white border border-white/20 transition-colors cursor-pointer"
                  title="Limpar todos os exames selecionados"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* FULL INLINE VIEW WITH COMPLETE DESCRIPTIONS (No Truncation) */}
            {isInlineQuoteExpanded && (
              <div className="p-4 max-h-72 overflow-y-auto space-y-2 bg-[#F8FAFB] border-t border-slate-200/80">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                  <span>Itens Selecionados no Orçamento ({selectedList.length} procedimentos):</span>
                  <span className="text-[10px] text-[#0E7B86] font-extrabold">Descrições completas e ajustes de quantidade</span>
                </div>

                <div className="space-y-2">
                  {selectedEntries.map(([key, item], idx) => {
                    const unit = getItemUnitPrice(item);
                    const subtotal = getItemTotal(item);
                    const canContrast = item.tableType === 'ps' && isImagingExamWithContrast(item.exam.description);
                    const qty = item.quantity || 1;

                    return (
                      <div
                        key={key}
                        className="bg-white border border-slate-200/90 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#0E7B86]/40 shadow-2xs transition-colors"
                      >
                        {/* Left Info: Code + FULL Description */}
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-slate-400 text-xs font-bold">#{idx + 1}</span>
                            {item.exam.code ? (
                              <span className="font-mono text-[#0E7B86] bg-[#EBF7F8] border border-[#C4E5E8] px-2 py-0.5 rounded text-xs font-bold">
                                {item.exam.code}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs">Sem TUSS</span>
                            )}
                            <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded border border-slate-200">
                              {item.tableType === 'amor' ? 'Amor Saúde' : (item.tableType === 'lab' ? 'Laboratório' : 'Pronto-Socorro')}
                            </span>
                            {item.hasContrast && (
                              <span className="text-[10px] bg-[#FDF2F6] text-[#B01B52] font-black px-2 py-0.5 rounded border border-[#F6C6D6]">
                                + Contraste (+ R$ 250,00)
                              </span>
                            )}
                          </div>

                          {/* FULL UNTRUNCATED DESCRIPTION */}
                          <div className="text-sm font-bold text-slate-800 leading-relaxed break-words">
                            {item.exam.description}
                          </div>
                        </div>

                        {/* Right Controls: Quantity + Contrast Toggle + Subtotal + Remove */}
                        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                          {/* Contrast toggle in cart */}
                          {canContrast && (
                            <button
                              type="button"
                              onClick={() => onToggleSelectExam(item.tableType, item.index, item.exam, !item.hasContrast)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                                item.hasContrast
                                  ? 'bg-[#0E7B86] text-white border-[#0E7B86]'
                                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-[#EBF7F8] hover:text-[#0E7B86]'
                              }`}
                            >
                              {item.hasContrast ? '✓ Com Contraste' : '+ Contraste'}
                            </button>
                          )}

                          {/* Quantity control */}
                          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => onUpdateExamQuantity ? onUpdateExamQuantity(key, qty - 1) : null}
                              className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded font-bold transition-colors cursor-pointer"
                              title="Diminuir quantidade"
                            >
                              -
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-slate-800 font-mono">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateExamQuantity ? onUpdateExamQuantity(key, qty + 1) : null}
                              className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded font-bold transition-colors cursor-pointer"
                              title="Aumentar quantidade"
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

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => onRemoveExamItem ? onRemoveExamItem(key) : onToggleSelectExam(item.tableType, item.index, item.exam, false)}
                            className="p-1.5 text-slate-400 hover:text-[#B01B52] hover:bg-[#FDF2F6] rounded-lg transition-colors cursor-pointer"
                            title="Remover este item do orçamento"
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

      {/* FULLSCREEN PANORAMIC MODAL: ORÇAMENTO COMPLETO COM TODAS AS DESCRIÇÕES */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150 print:hidden">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#095962] via-[#0E7B86] to-[#095962] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#0E7B86]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#B01B52] flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white m-0">
                    Orçamento Hospitalar de Exames
                  </h3>
                  <p className="text-xs text-[#EBF7F8] m-0">
                    Hospital Palmas Medical • Documento Oficial para o Paciente
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

            {/* Modal Body - Mode 1: Editor */}
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
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">Total de Procedimentos</span>
                    <div className="text-xl font-black text-slate-900 mt-1">
                      {totalExamItemsCount} itens
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">Exames com Contraste</span>
                    <div className="text-xl font-black text-[#0E7B86] mt-1">
                      {totalContrastCount} {totalContrastCount === 1 ? 'exame' : 'exames'}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">Tabela Referência</span>
                    <div className="text-xs font-extrabold text-slate-800 mt-2 truncate">
                      {activeTable === 'amor' ? 'Amor Saúde' : (activeTable === 'lab' ? 'Laboratorial' : 'Pronto-Socorro / Particular')}
                    </div>
                  </div>
                </div>

                {/* Optional Fields: Patient Name & Notes */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">
                      Nome do Paciente (Para Impressão ou Envio)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex.: Maria Francisca dos Santos"
                      value={patientNameQuote}
                      onChange={e => setPatientNameQuote(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0E7B86] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">
                      Observações / Orientações de Preparo (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex.: Jejum de 8 horas, levar exames anteriores de imagem..."
                      value={quoteNotes}
                      onChange={e => setQuoteNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0E7B86] focus:bg-white"
                    />
                  </div>
                </div>

                {/* PS Credit Card Payment Notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-600 flex-shrink-0"></span>
                    <span>
                      <strong>Condição de Pagamento:</strong> Cartão de Crédito Paciente PS é apenas no crédito à vista 1x.
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    Regra PS
                  </span>
                </div>

                {/* Panoramic Table of Exams with Complete Descriptions */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
                  <div className="p-4 bg-[#EBF7F8] border-b border-[#C4E5E8] flex items-center justify-between">
                    <h4 className="text-xs font-black text-[#095962] uppercase tracking-wider m-0">
                      Relação Detalhada de Procedimentos Orçados
                    </h4>
                    <span className="text-xs text-slate-600 font-medium">
                      {selectedList.length} itens cadastrados
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-[#095962] text-white">
                          <th className="py-3 px-3 font-bold w-12 text-center">#</th>
                          <th className="py-3 px-3 font-bold w-28">Código TUSS</th>
                          <th className="py-3 px-4 font-bold">Descrição Completa do Exame</th>
                          <th className="py-3 px-3 font-bold text-center w-24">Tabela</th>
                          <th className="py-3 px-3 font-bold text-center w-32">Contraste</th>
                          <th className="py-3 px-3 font-bold text-center w-24">Qtd</th>
                          <th className="py-3 px-3 font-bold text-right w-28">Valor Unit.</th>
                          <th className="py-3 px-3 font-bold text-right w-28">Subtotal</th>
                          <th className="py-3 px-3 font-bold text-center w-14">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {selectedEntries.map(([key, item], idx) => {
                          const unit = getItemUnitPrice(item);
                          const subtotal = getItemTotal(item);
                          const canContrast = item.tableType === 'ps' && isImagingExamWithContrast(item.exam.description);
                          const qty = item.quantity || 1;

                          return (
                            <tr key={key} className="hover:bg-[#EBF7F8]/30 transition-colors">
                              <td className="py-3 px-3 text-center font-bold text-slate-400">
                                {idx + 1}
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-[#0E7B86]">
                                {item.exam.code ? (
                                  <span className="bg-[#EBF7F8] text-[#0E7B86] px-2 py-1 rounded border border-[#C4E5E8] text-xs font-bold">
                                    {item.exam.code}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-normal">—</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-slate-900">
                                <div className="font-bold text-xs leading-relaxed text-slate-900">
                                  {item.exam.description}
                                </div>
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-1 rounded">
                                  {item.tableType === 'amor' ? 'Amor Saúde' : (item.tableType === 'lab' ? 'Laboratório' : 'Pronto-Socorro')}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center">
                                {canContrast ? (
                                  <button
                                    type="button"
                                    onClick={() => onToggleSelectExam(item.tableType, item.index, item.exam, !item.hasContrast)}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all border cursor-pointer ${
                                      item.hasContrast
                                        ? 'bg-[#0E7B86] text-white border-[#0E7B86] shadow-2xs'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                                    }`}
                                  >
                                    {item.hasContrast ? '✓ Com Contraste' : '+ Adicionar'}
                                  </button>
                                ) : (
                                  <span className="text-slate-300 text-[10px]">—</span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <div className="flex items-center justify-center bg-slate-100 border border-slate-300 rounded-lg p-0.5 w-20 mx-auto">
                                  <button
                                    type="button"
                                    onClick={() => onUpdateExamQuantity ? onUpdateExamQuantity(key, qty - 1) : null}
                                    className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded font-bold cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <span className="w-6 text-center text-xs font-bold text-slate-900 font-mono">
                                    {qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => onUpdateExamQuantity ? onUpdateExamQuantity(key, qty + 1) : null}
                                    className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded font-bold cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-right font-mono font-medium text-slate-700">
                                {formatCurrencyBRL(unit)}
                              </td>
                              <td className="py-3 px-3 text-right font-mono font-bold text-[#0E7B86]">
                                {formatCurrencyBRL(subtotal)}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => onRemoveExamItem ? onRemoveExamItem(key) : onToggleSelectExam(item.tableType, item.index, item.exam, false)}
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
              </div>
            ) : (
              /* Modal Body - Mode 2: Live A4 Document Preview */
              <div className="p-4 sm:p-6 bg-slate-100 overflow-y-auto flex-1">
                <div className="text-center mb-3">
                  <span className="text-xs font-semibold text-slate-500">
                    Pré-visualização do documento que será impresso ou salvo em PDF para entrega ao paciente:
                  </span>
                </div>
                <HospitalPatientQuote
                  type="exames"
                  patientName={patientNameQuote}
                  tableReference={tableRefName}
                  notes={quoteNotes}
                  items={quoteItemsForExams}
                  total={cartTotal}
                  installmentCount={1}
                  isPrintPreview={true}
                />
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500 font-medium">
                Total consolidado: <strong className="text-slate-900 text-sm font-mono">{formatCurrencyBRL(cartTotal)}</strong> ({totalExamItemsCount} procedimentos)
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-end">
                <button
                  type="button"
                  onClick={handleCopyQuoteToClipboard}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  {copiedQuote ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Copiado p/ WhatsApp!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-600" />
                      <span>Copiar Texto Formatado</span>
                    </>
                  )}
                </button>

                {onNavigateToPreGuia && selectedList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const first = selectedList[0];
                      setIsQuoteModalOpen(false);
                      onNavigateToPreGuia(
                        activeTable === 'amor' ? 'AMOR SAÚDE' : 'PARTICULAR',
                        first?.exam.code,
                        first?.exam.description
                      );
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EBF7F8] hover:bg-[#D8ECEE] text-[#0E7B86] border border-[#C4E5E8] text-xs font-bold transition-all cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4 text-[#0E7B86]" />
                    <span>Gerar Pré-Guia TISS</span>
                  </button>
                )}

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

      {/* Modal de Importação em Lote de Exames (com Desconsideração Automática de Duplicatas) */}
      {showBatchImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0E7B86] to-[#095962] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight">
                    Importação em Lote de Exames ({activeTable === 'lab' ? 'Laboratoriais' : activeTable === 'amor' ? 'Amor Saúde' : 'Pronto-Socorro'})
                  </h3>
                  <p className="text-xs text-teal-100 font-medium mt-0.5">
                    Cole as linhas da lista ou do PDF. Exames já cadastrados são identificados e desconsiderados automaticamente.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBatchImportModal(false)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {batchImportSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{batchImportSuccessMsg}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                  Cole o Conteúdo da Lista ou Tabela (linhas de texto, TSV, CSV ou JSON):
                </label>
                <textarea
                  rows={6}
                  value={batchImportText}
                  onChange={e => setBatchImportText(e.target.value)}
                  placeholder={`Exemplos aceitos:
40301234  HEMOGRAMA COM CONTAGEM DE PLAQUETAS  30,86
40302040  GLICOSE EM JEJUM  20,04  12
40308391; PROTEÍNA C REATIVA (PCR) ULTRASSENSÍVEL; 72,18
["40301630", "CREATININA, DOSAGEM", "20,04", "*", "8"]`}
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0E7B86] focus:bg-white placeholder:text-slate-400"
                />
              </div>

              {/* Status & Metrics Bar */}
              {batchImportText.trim() && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-semibold">Linhas Reconhecidas:</span>
                    <strong className="text-sm font-black text-slate-900">{batchParsedResults.length}</strong>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    duplicateBatchExams.length > 0 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-semibold">Já Cadastrados (Ignorados):</span>
                    </div>
                    <strong className="text-sm font-black">{duplicateBatchExams.length}</strong>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    newBatchExams.length > 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-semibold">Novos a Incluir:</span>
                    </div>
                    <strong className="text-sm font-black">{newBatchExams.length}</strong>
                  </div>
                </div>
              )}

              {/* Preview Table */}
              {batchParsedResults.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>Prévia de Processamento ({batchParsedResults.length} itens encontrados):</span>
                    {duplicateBatchExams.length > 0 && (
                      <span className="text-amber-700 font-semibold">
                        * {duplicateBatchExams.length} item(ns) já existem e serão desconsiderados.
                      </span>
                    )}
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 sticky top-0 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Código TUSS</th>
                          <th className="py-2.5 px-3">Descrição do Exame</th>
                          <th className="py-2.5 px-3 text-right">Valor</th>
                          <th className="py-2.5 px-3 text-center">Ref/Pág</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {batchParsedResults.map((item, idx) => (
                          <tr key={idx} className={item.isDuplicate ? 'bg-amber-50/40 text-slate-500' : 'bg-white hover:bg-teal-50/30 text-slate-900'}>
                            <td className="py-2 px-3 whitespace-nowrap">
                              {item.isDuplicate ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800">
                                  <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                                  <span>Ignorado: {item.duplicateReason}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span>Novo Exame</span>
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-3 font-mono font-bold text-slate-700 whitespace-nowrap">
                              {item.code || '—'}
                            </td>
                            <td className="py-2 px-3">
                              {item.description}
                            </td>
                            <td className="py-2 px-3 text-right font-bold font-mono whitespace-nowrap text-teal-900">
                              {item.particularPrice !== '*' ? `R$ ${item.particularPrice}` : 'Sob Consulta'}
                            </td>
                            <td className="py-2 px-3 text-center text-slate-500 whitespace-nowrap">
                              {item.pageRef || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                {newBatchExams.length > 0 ? (
                  <span>Pronto para adicionar <strong className="text-slate-900 font-bold">{newBatchExams.length}</strong> novo(s) exame(s) sem duplicar.</span>
                ) : (
                  <span>Cole a lista acima para processar os exames.</span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {batchImportText.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      setBatchImportText('');
                      setBatchImportSuccessMsg('');
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Limpar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowBatchImportModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={newBatchExams.length === 0}
                  onClick={handleConfirmBatchImport}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer ${
                    newBatchExams.length > 0
                      ? 'bg-[#0E7B86] hover:bg-[#095962] text-white active:scale-95'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar {newBatchExams.length} Novo(s) Exame(s)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
