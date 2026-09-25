import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  ChevronRight, 
  Phone, 
  Copy, 
  Check, 
  FileText, 
  FileSpreadsheet, 
  Ambulance, 
  Building2, 
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { AppMode, ExamRow } from '../types';
import { CONVENIOS_MASTER_LIST } from '../data/popsData';
import { HOSPITAL_EXTENSIONS, HOSPITAL_REPORTS } from '../data/hospitalData';
import { ALL_DIARIAS_ITEMS } from '../data/diariasData';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToConvenio: (mode: 'pops-ps' | 'pops-internacao', convenioId: string) => void;
  onNavigateToExames: (searchQuery?: string) => void;
  onNavigateToRamais: (searchQuery?: string) => void;
  onNavigateToRelatorios: (tipo?: 'PARTICULAR' | 'URGÊNCIA' | 'ELETIVO') => void;
  psExams: ExamRow[];
  amorExams: ExamRow[];
  labExams: ExamRow[];
}

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToConvenio,
  onNavigateToExames,
  onNavigateToRamais,
  onNavigateToRelatorios,
  psExams,
  amorExams,
  labExams
}) => {
  const [query, setQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const copyText = (e: React.MouseEvent, text: string, key: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // Search Results Filter
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        convenios: [],
        diarias: [],
        exams: [],
        ramais: [],
        reports: [],
        rules: []
      };
    }

    // 1. Convenios
    const matchingConvenios = [
      ...CONVENIOS_MASTER_LIST,
      {
        id: 'SERVIR',
        name: 'SERVIR (Plano de Saúde TO)',
        category: 'Estadual',
        badge: 'SE',
        criticalNotes: ['Cobertura estadual com regras específicas para internação e SADT.'],
        portalUrl: 'https://servir.to.gov.br'
      } as any
    ].filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.id.toLowerCase().includes(q) ||
      (c.category && c.category.toLowerCase().includes(q))
    ).slice(0, 5);

    // 1.5 Diárias de Internação
    const matchingDiarias = ALL_DIARIAS_ITEMS.filter(d => 
      d.code.toLowerCase().includes(q) ||
      d.acomodacao.toLowerCase().includes(q) ||
      d.convenioName.toLowerCase().includes(q) ||
      (d.solicitarJunto && d.solicitarJunto.toLowerCase().includes(q))
    ).slice(0, 6);

    // 2. Exams
    const allExams = [...psExams, ...amorExams, ...labExams];
    const seenCodes = new Set<string>();
    const matchingExams: ExamRow[] = [];
    for (const ex of allExams) {
      if (!seenCodes.has(ex.code) && (ex.code.includes(q) || ex.description.toLowerCase().includes(q))) {
        seenCodes.add(ex.code);
        matchingExams.push(ex);
        if (matchingExams.length >= 6) break;
      }
    }

    // 3. Extensions
    const matchingRamais = HOSPITAL_EXTENSIONS.filter(ext => 
      ext.sector.toLowerCase().includes(q) || 
      ext.number.includes(q) ||
      (ext.building && ext.building.toLowerCase().includes(q))
    ).slice(0, 5);

    // 4. Reports
    const matchingReports: { tipo: 'PARTICULAR' | 'URGÊNCIA' | 'ELETIVO'; num: string }[] = [];
    HOSPITAL_REPORTS.forEach(rep => {
      rep.nums.forEach(num => {
        if (num.includes(q) || `relatorio ${num}`.includes(q) || rep.tipo.toLowerCase().includes(q)) {
          matchingReports.push({ tipo: rep.tipo, num });
        }
      });
    });

    // 5. Operational quick rules
    const rules: { title: string; desc: string; action: () => void }[] = [];
    if ('contraste'.includes(q) || 'taxa'.includes(q) || 'tc'.includes(q) || 'rm'.includes(q)) {
      rules.push({
        title: 'Taxa de Contraste (+ R$ 250,00)',
        desc: 'Exames de TC ou RM realizados com contraste possuem acréscimo fixo institucional de R$ 250,00 e exigem formulário assinado.',
        action: () => {
          onNavigateToExames('contraste');
          onClose();
        }
      });
    }
    if ('token'.includes(q) || 'autenticacao'.includes(q) || 'validacao'.includes(q)) {
      rules.push({
        title: 'Validação de Token do Beneficiário',
        desc: 'Amil, Bradesco e Cassi exigem validação de TOKEN gerado no aplicativo do paciente antes do atendimento.',
        action: () => {
          onNavigateToConvenio('pops-ps', 'AMIL');
          onClose();
        }
      });
    }

    return {
      convenios: matchingConvenios,
      diarias: matchingDiarias,
      exams: matchingExams,
      ramais: matchingRamais,
      reports: matchingReports.slice(0, 4),
      rules
    };
  }, [query, psExams, amorExams, labExams, onNavigateToConvenio, onNavigateToExames, onClose]);

  const hasAnyResults = 
    (results.convenios?.length ?? 0) > 0 || 
    (results.diarias?.length ?? 0) > 0 ||
    (results.exams?.length ?? 0) > 0 || 
    (results.ramais?.length ?? 0) > 0 || 
    (results.reports?.length ?? 0) > 0 || 
    (results.rules?.length ?? 0) > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-4 pt-12 sm:pt-20 animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/70">
          <Search className="w-5 h-5 text-teal-700 flex-shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Digite o convênio, exame, ramal, código TUSS ou relatório..."
            className="w-full bg-transparent border-none text-slate-900 placeholder-slate-400 text-base font-semibold focus:outline-hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[11px] font-bold text-slate-400 border border-slate-200 bg-white px-2 py-0.5 rounded-md hidden sm:inline-block">
              ESC para sair
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-5 divide-y divide-slate-100">
          {!query ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto border border-teal-100">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800 m-0">
                Busca Inteligente Unificada
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto m-0">
                Localize instantaneamente qualquer informação hospitalar digitando o nome do convênio, código TUSS, nome de exame, ramal interno ou número de relatório.
              </p>
              
              {/* Quick suggestions pills */}
              <div className="pt-3 flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                {['Amil', 'Bradesco', 'Unimed', 'Tomografia', 'Hemograma', 'UTI', 'Farmácia', 'Relatório 2', 'Contraste'].map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 hover:border-teal-200 text-slate-700 transition-all cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : !hasAnyResults ? (
            <div className="py-10 text-center space-y-2 text-slate-500">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 m-0">
                Nenhum resultado encontrado para &quot;{query}&quot;
              </p>
              <p className="text-xs text-slate-400 m-0">
                Tente buscar pelo nome parcial, sigla ou código numérico.
              </p>
            </div>
          ) : (
            <>
              {/* Operational Rules if matching */}
              {results.rules.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] uppercase font-black tracking-wider text-amber-700 block">
                    Regra Operacional Crítica
                  </span>
                  <div className="space-y-2">
                    {results.rules.map((rule, i) => (
                      <div
                        key={i}
                        onClick={rule.action}
                        className="p-3 rounded-xl bg-amber-50 border border-amber-200/90 hover:border-amber-400 transition-all cursor-pointer flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <h5 className="text-xs font-black text-amber-950 m-0 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            {rule.title}
                          </h5>
                          <p className="text-xs text-amber-900/80 m-0 leading-relaxed">
                            {rule.desc}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Convenios Section */}
              {results.convenios.length > 0 && (
                <div className="pt-3 space-y-2">
                  <span className="text-[11px] uppercase font-black tracking-wider text-teal-700 block">
                    Convênios & Planos de Saúde ({results.convenios.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {results.convenios.map(c => (
                      <div
                        key={c.id}
                        className="p-3 rounded-xl border border-slate-200 hover:border-teal-600 bg-white hover:bg-teal-50/40 transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-teal-900 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                            {c.badge || c.id.slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-black text-slate-900 uppercase truncate m-0">
                              {c.name}
                            </h5>
                            <span className="text-[11px] text-slate-500 block truncate">
                              {c.category}
                            </span>
                          </div>
                        </div>

                        {/* Fast Action Buttons */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              onNavigateToConvenio('pops-ps', c.id);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[11px] font-bold transition-colors cursor-pointer"
                            title="Abrir no Pronto-Socorro"
                          >
                            PS
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onNavigateToConvenio('pops-internacao', c.id);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-[11px] font-bold transition-colors cursor-pointer"
                            title="Abrir na Internação & UTI"
                          >
                            Internação
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Diárias de Internação Section */}
              {results.diarias && results.diarias.length > 0 && (
                <div className="pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-black tracking-wider text-[#0E7B86] block">
                      Diárias de Internação & Leitos ({results.diarias.length})
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Clique para abrir o convênio na Internação
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {results.diarias.map(d => (
                      <div
                        key={d.id}
                        onClick={() => {
                          onNavigateToConvenio('pops-internacao', d.convenioId);
                          onClose();
                        }}
                        className="p-3 rounded-xl border border-slate-200 hover:border-[#0E7B86] bg-white hover:bg-[#EBF7F8]/40 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-7 h-7 rounded-lg bg-[#B01B52] text-white font-black text-[10px] flex items-center justify-center flex-shrink-0">
                            {d.badge}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0E7B86] transition-colors truncate">
                                {d.acomodacao}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                {d.convenioName}
                              </span>
                              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#EBF7F8] text-[#0E7B86]">
                                {d.tipo}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-mono font-bold block mt-0.5">
                              Código TUSS: <strong className="text-slate-800">{d.code}</strong> {d.solicitarJunto ? `• Solicitar: ${d.solicitarJunto}` : ''}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => copyText(e, d.code, d.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#EBF7F8] text-slate-600 hover:text-[#0E7B86] transition-colors flex-shrink-0 cursor-pointer"
                          title="Copiar código TUSS"
                        >
                          {copiedKey === d.id ? <Check className="w-3.5 h-3.5 text-[#0E7B86]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exams Section */}
              {results.exams.length > 0 && (
                <div className="pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-black tracking-wider text-teal-700 block">
                      Tabela de Exames & Procedimentos ({results.exams.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateToExames(query);
                        onClose();
                      }}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline cursor-pointer"
                    >
                      Ver todos na tabela →
                    </button>
                  </div>
                  <div className="space-y-2">
                    {results.exams.map(ex => (
                      <div
                        key={ex.code}
                        onClick={() => {
                          onNavigateToExames(ex.code);
                          onClose();
                        }}
                        className="p-3 rounded-xl border border-slate-200 hover:border-teal-500 bg-white hover:bg-slate-50/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 cursor-pointer group"
                      >
                        <div className="min-w-0 flex items-center gap-3">
                          <span className="font-mono text-xs font-black text-teal-900 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md flex-shrink-0">
                            {ex.code}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {ex.description}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">Valor Particular</span>
                            <span className="text-xs font-black text-slate-800">
                              {ex.particularPrice && ex.particularPrice !== '*' ? `R$ ${ex.particularPrice}` : 'Sob consulta'}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => copyText(e, ex.code, `ex-${ex.code}`)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                            title="Copiar código TUSS"
                          >
                            {copiedKey === `ex-${ex.code}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hospital Extensions Section */}
              {results.ramais.length > 0 && (
                <div className="pt-3 space-y-2">
                  <span className="text-[11px] uppercase font-black tracking-wider text-teal-700 block">
                    Ramais Telefônicos ({results.ramais.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.ramais.map((ext, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <h6 className="text-xs font-bold text-slate-900 m-0 truncate">
                            {ext.sector}
                          </h6>
                          {ext.building && (
                            <span className="text-[10px] text-slate-400 block truncate">
                              {ext.building}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="font-mono text-xs font-black text-teal-900 bg-teal-100/70 border border-teal-200 px-2 py-0.5 rounded-md">
                            Ramal {ext.number}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => copyText(e, ext.number, `ramal-${ext.number}`)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                            title="Copiar número de ramal"
                          >
                            {copiedKey === `ramal-${ext.number}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reports Section */}
              {results.reports.length > 0 && (
                <div className="pt-3 space-y-2">
                  <span className="text-[11px] uppercase font-black tracking-wider text-teal-700 block">
                    Relatórios Institucionais
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {results.reports.map((rep, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          onNavigateToRelatorios(rep.tipo);
                          onClose();
                        }}
                        className="px-3 py-2 rounded-xl border border-slate-200 hover:border-teal-500 bg-white hover:bg-teal-50/50 flex items-center gap-2 text-xs font-bold text-slate-800 transition-all cursor-pointer"
                      >
                        <span className="font-mono text-teal-900 bg-teal-100 px-2 py-0.5 rounded-md">
                          Relatório Nº {rep.num}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase">
                          Modalidade {rep.tipo}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Central Hospital Palmas Medical • 2026
          </span>
          <span>
            Pressione <strong>ESC</strong> para fechar
          </span>
        </div>
      </div>
    </div>
  );
};
