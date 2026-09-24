import React, { useState, useMemo, useEffect } from 'react';
import { 
  Files, 
  Search, 
  Printer, 
  CheckCircle, 
  CheckSquare, 
  Square, 
  FileText, 
  AlertCircle,
  Building2,
  Copy,
  Check
} from 'lucide-react';
import { HOSPITAL_REPORTS } from '../data/hospitalData';
import { HospitalReportType } from '../types';

interface HospitalReportsViewerProps {
  initialType?: 'PARTICULAR' | 'URGÊNCIA' | 'ELETIVO';
}

export const HospitalReportsViewer: React.FC<HospitalReportsViewerProps> = ({
  initialType = 'URGÊNCIA'
}) => {
  const [selectedType, setSelectedType] = useState<'PARTICULAR' | 'URGÊNCIA' | 'ELETIVO'>(initialType);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [checkedReports, setCheckedReports] = useState<{ [key: string]: boolean }>({});
  const [copiedList, setCopiedList] = useState<boolean>(false);

  useEffect(() => {
    if (initialType) {
      setSelectedType(initialType);
    }
  }, [initialType]);

  const activeReportConfig = useMemo(() => {
    return HOSPITAL_REPORTS.find(r => r.tipo === selectedType) || HOSPITAL_REPORTS[0];
  }, [selectedType]);

  const filteredNums = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return activeReportConfig.nums.filter(num => num.includes(q));
  }, [activeReportConfig, searchTerm]);

  const toggleCheck = (num: string) => {
    setCheckedReports(prev => ({
      ...prev,
      [`${selectedType}-${num}`]: !prev[`${selectedType}-${num}`]
    }));
  };

  const handleSelectAll = () => {
    const allChecked = activeReportConfig.nums.every(num => !!checkedReports[`${selectedType}-${num}`]);
    const nextState = { ...checkedReports };
    activeReportConfig.nums.forEach(num => {
      nextState[`${selectedType}-${num}`] = !allChecked;
    });
    setCheckedReports(nextState);
  };

  const handlePrintChecklist = () => {
    window.print();
  };

  const checkedCount = activeReportConfig.nums.filter(num => !!checkedReports[`${selectedType}-${num}`]).length;

  return (
    <div className="space-y-5">
      {/* Print View */}
      <div id="print-reports-checklist" className="hidden print:block font-sans text-slate-900 p-8">
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 m-0">
            HOSPITAL PALMAS MEDICAL • CHECKLIST DE INTERNAÇÃO
          </h1>
          <p className="text-xs text-slate-600 m-0 mt-1">
            Tipo de Internação: <strong>{selectedType}</strong> • Data: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {activeReportConfig.nums.map(num => (
            <div key={num} className="flex items-center gap-3 border border-slate-300 p-2.5 rounded">
              <div className="w-5 h-5 border-2 border-slate-900 rounded flex items-center justify-center font-bold text-xs">
                {checkedReports[`${selectedType}-${num}`] ? '✓' : ''}
              </div>
              <span className="font-mono font-bold text-sm text-slate-900">Relatório Nº {num}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8 text-center text-xs pt-12 border-t border-slate-300">
          <div>
            <div className="border-t border-slate-400 pt-1 w-48 mx-auto"></div>
            <p className="font-bold m-0">Recepção de Internação</p>
            <p className="text-[10px] text-slate-500 m-0">Assinatura / Carimbo</p>
          </div>
          <div>
            <div className="border-t border-slate-400 pt-1 w-48 mx-auto"></div>
            <p className="font-bold m-0">Posto de Enfermagem</p>
            <p className="text-[10px] text-slate-500 m-0">Recebimento do Prontuário</p>
          </div>
        </div>
      </div>

      {/* Screen View */}
      <div className="print:hidden space-y-5">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-[#095962] via-[#0E7B86] to-[#095962] border border-[#0E7B86]/40 rounded-2xl p-5 sm:p-6 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-widest text-[#EBF7F8] bg-white/15 border border-white/20 px-3 py-0.5 rounded-full">
                Área de Internação Hospitalar
              </span>
              <span className="text-xs text-white/80 font-medium">Controle de Documentos Obrigatórios</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white m-0">
              Relatórios da Internação
            </h2>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl leading-relaxed m-0">
              Relação de relatórios institucionais para impressão e conferência na admissão do paciente.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrintChecklist}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#B01B52] hover:bg-[#971444] text-white font-bold text-sm shadow-xs transition-all self-start md:self-auto cursor-pointer border border-[#F7D0DF]/30"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>Imprimir Checklist do Prontuário</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {HOSPITAL_REPORTS.map(rep => {
            const isSelected = selectedType === rep.tipo;
            return (
              <button
                key={rep.tipo}
                type="button"
                onClick={() => setSelectedType(rep.tipo)}
                className={`p-5 rounded-2xl border text-left transition-all shadow-2xs flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? rep.tipo === 'URGÊNCIA'
                      ? 'bg-[#FDF2F6] border-2 border-[#B01B52]'
                      : 'bg-[#EBF7F8] border-2 border-[#0E7B86]'
                    : 'bg-white hover:bg-[#EBF7F8]/40 border-slate-200 text-slate-700'
                }`}
              >
                <div>
                  <span className="text-xs uppercase font-black tracking-wider text-slate-400 block mb-0.5">
                    Modalidade
                  </span>
                  <h3 className="text-xl font-black text-slate-900 m-0 leading-tight">
                    {rep.tipo}
                  </h3>
                </div>
                <span className={`text-xs sm:text-sm font-black px-3 py-1.5 rounded-full ${
                  rep.tipo === 'URGÊNCIA' ? 'bg-[#B01B52] text-white' : 'bg-[#0E7B86] text-white'
                }`}>
                  {rep.nums.length} Relatórios
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar for Document Numbers */}
        <div className="relative bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Pesquisar número do relatório (ex: 2, 4, 7, 10)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E7B86] focus:bg-white text-slate-900"
            />
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                const listStr = activeReportConfig.nums.join(', ');
                navigator.clipboard.writeText(listStr);
                setCopiedList(true);
                setTimeout(() => setCopiedList(false), 2000);
              }}
              className="px-4 py-2.5 bg-[#EBF7F8] hover:bg-[#d8eff2] border border-[#C4E5E8] text-[#0E7B86] rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Copiar sequência de números para colar no PEP ou ERP"
            >
              {copiedList ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedList ? 'Copiado!' : 'Copiar Sequência'}</span>
            </button>

            <button
              type="button"
              onClick={handleSelectAll}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer"
            >
              {checkedCount === activeReportConfig.nums.length ? 'Desmarcar Todos' : 'Marcar Todos'}
            </button>
          </div>
        </div>

        {/* Documents Grid / Interactive List - Numbers Only */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                Documentos para Impressão • {selectedType}
              </span>
              <h3 className="text-xl font-black text-slate-900 m-0">
                Relação de Relatórios ({filteredNums.length} itens)
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-sm font-black text-slate-800 block">
                  {checkedCount} de {activeReportConfig.nums.length} impressos
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  {Math.round((checkedCount / Math.max(1, activeReportConfig.nums.length)) * 100)}% concluído
                </span>
              </div>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(checkedCount / Math.max(1, activeReportConfig.nums.length)) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {filteredNums.map(num => {
              const checkKey = `${selectedType}-${num}`;
              const isChecked = !!checkedReports[checkKey];

              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => toggleCheck(num)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 text-left ${
                    isChecked
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex-shrink-0">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <span className="font-mono text-base font-black text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs truncate">
                      Nº {num}
                    </span>
                  </div>
                  {isChecked && (
                    <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex-shrink-0">
                      OK
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orientation Card */}
        <div className="bg-[#EBF7F8] border border-[#C4E5E8] rounded-2xl p-5 text-sm text-[#095962] font-medium flex items-start gap-3.5">
          <AlertCircle className="w-6 h-6 text-[#0E7B86] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-[#095962] block font-black text-base">Instrução Operacional de Admissão:</strong>
            <span className="text-slate-800 text-sm leading-relaxed">
              Todos os relatórios listados pelos respectivos números devem ser impressos no momento da abertura da internação na recepção e anexados ao prontuário físico para encaminhamento ao posto de enfermagem.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
