import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Copy, 
  Check, 
  AlertTriangle, 
  Info, 
  Bed, 
  Activity, 
  ShieldCheck, 
  Filter,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { TABELA_DIARIAS_DATA, ALL_DIARIAS_ITEMS, DiariaItem, ConvenioDiariasRules } from '../data/diariasData';

interface TabelaDiariasViewProps {
  onSelectConvenio?: (convenioId: string) => void;
  onGeneratePreGuia?: (convenio: string, code?: string, desc?: string) => void;
  selectedConvenioFilter?: string;
}

export const TabelaDiariasView: React.FC<TabelaDiariasViewProps> = ({
  onSelectConvenio,
  onGeneratePreGuia,
  selectedConvenioFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConvenio, setSelectedConvenio] = useState<string>(selectedConvenioFilter || 'TODOS');
  const [selectedTipo, setSelectedTipo] = useState<string>('TODOS');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedRow, setCopiedRow] = useState<string | null>(null);

  const copyToClipboard = (text: string, id?: string) => {
    navigator.clipboard.writeText(text);
    if (id) {
      setCopiedRow(id);
      setTimeout(() => setCopiedRow(null), 2000);
    } else {
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const tiposList = ['TODOS', 'Apartamento', 'Enfermaria', 'UTI', 'Isolamento', 'Hospital Dia', 'Berçário'];

  // Filtered Items
  const filteredItems = useMemo(() => {
    return ALL_DIARIAS_ITEMS.filter(item => {
      const matchConvenio = selectedConvenio === 'TODOS' || item.convenioId === selectedConvenio;
      const matchTipo = selectedTipo === 'TODOS' || item.tipo === selectedTipo;
      
      const term = searchTerm.toLowerCase().trim();
      const matchSearch = !term || 
        item.code.toLowerCase().includes(term) ||
        item.acomodacao.toLowerCase().includes(term) ||
        item.convenioName.toLowerCase().includes(term) ||
        (item.solicitarJunto && item.solicitarJunto.toLowerCase().includes(term)) ||
        (item.parecer && item.parecer.toLowerCase().includes(term)) ||
        (item.matMed && item.matMed.toLowerCase().includes(term)) ||
        (item.exLab && item.exLab.toLowerCase().includes(term)) ||
        (item.exRad && item.exRad.toLowerCase().includes(term)) ||
        (item.fisioIntern && item.fisioIntern.toLowerCase().includes(term));

      return matchConvenio && matchTipo && matchSearch;
    });
  }, [searchTerm, selectedConvenio, selectedTipo]);

  // Selected Convenio Rule (if single convenio selected)
  const currentConvenioRules = useMemo(() => {
    if (selectedConvenio === 'TODOS') return null;
    return TABELA_DIARIAS_DATA.find(r => r.convenioId === selectedConvenio) || null;
  }, [selectedConvenio]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-[#B01B52] bg-[#FDF2F6] border border-[#F7D0DF] px-3 py-1 rounded-full flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#B01B52]" />
                Tabela Oficial de Diárias de Internação
              </span>
              <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-full">
                19 Planos Catalogados • Hospital Palmas Medical
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0E7B86] tracking-tight m-0">
              Códigos de Diárias, Acomodações & Regras de Leito
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">
              Consulte códigos TUSS para Apartamento, Enfermaria, UTI Adulto/Ped/Neo, Berçário, Hospital Dia, taxas de isolamento, regras de parecer médico, exames laboratoriais, radiologia e fisioterapia.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-[#EBF7F8] border border-[#C4E5E8] rounded-xl p-3 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total de Diárias</span>
              <span className="text-2xl font-black text-[#0E7B86]">{ALL_DIARIAS_ITEMS.length}</span>
            </div>
            <div className="bg-[#FDF2F6] border border-[#F7D0DF] rounded-xl p-3 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Convênios</span>
              <span className="text-2xl font-black text-[#B01B52]">{TABELA_DIARIAS_DATA.length}</span>
            </div>
          </div>
        </div>

        {/* Critical Clinical Alerts Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-5 mt-5 border-t border-slate-100">
          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 leading-tight">
              <span className="font-extrabold block mb-0.5">NÃO PODE ENFERMARIA:</span>
              <span className="font-medium text-rose-800">Cassi, TRE, Pró-Social e Saúde Caixa. Exclusivo Apartamento.</span>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-tight">
              <span className="font-extrabold block mb-0.5">APENAS ENFERMARIA:</span>
              <span className="font-medium text-amber-800">Fusex (Soldado), Postal Saúde, Servir (padrão) e Pró-Tocantins.</span>
            </div>
          </div>

          <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3 flex items-start gap-2.5">
            <Activity className="w-4 h-4 text-sky-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-sky-900 leading-tight">
              <span className="font-extrabold block mb-0.5">ALERTAS DE UTI:</span>
              <span className="font-medium text-sky-800">Geap não atende UTI Ped; Gama Saúde sem UTI credenciada; Bradesco sem código numérico.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Filters */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar por código TUSS (ex: 60000651), acomodação, convênio, parecer ou regra..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0E7B86] focus:bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Convenio Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Convênio:</span>
            <select
              value={selectedConvenio}
              onChange={e => setSelectedConvenio(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0E7B86] cursor-pointer"
            >
              <option value="TODOS">Todos os Convênios (19)</option>
              {TABELA_DIARIAS_DATA.map(rule => (
                <option key={rule.convenioId} value={rule.convenioId}>
                  {rule.convenioName} ({rule.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Leito / Acomodacao Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Tipo:
          </span>
          {tiposList.map(tipo => (
            <button
              key={tipo}
              type="button"
              onClick={() => setSelectedTipo(tipo)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedTipo === tipo
                  ? 'bg-[#0E7B86] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-[#EBF7F8] text-slate-600 hover:text-[#0E7B86]'
              }`}
            >
              {tipo}
            </button>
          ))}

          {(searchTerm || selectedConvenio !== 'TODOS' || selectedTipo !== 'TODOS') && (
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setSelectedConvenio('TODOS'); setSelectedTipo('TODOS'); }}
              className="ml-auto text-xs font-bold text-[#B01B52] hover:underline cursor-pointer whitespace-nowrap px-2"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Single Convenio Critical Banner if Active */}
      {currentConvenioRules && (
        <div className="bg-[#EBF7F8] border border-[#C4E5E8] rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0E7B86] text-white font-black text-sm flex items-center justify-center shadow-xs">
                {currentConvenioRules.badge}
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 m-0">
                  {currentConvenioRules.convenioName} • Regras Específicas de Internação
                </h3>
                <span className="text-xs font-medium text-slate-600">
                  Categoria: {currentConvenioRules.category}
                </span>
              </div>
            </div>

            {onSelectConvenio && (
              <button
                type="button"
                onClick={() => onSelectConvenio(currentConvenioRules.convenioId)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#0E7B86] font-bold text-xs shadow-2xs transition-all cursor-pointer"
              >
                <span>Ver POP Completo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {currentConvenioRules.criticalRule && (
            <div className="animate-alert-box border-2 rounded-xl p-3.5 text-xs sm:text-sm text-rose-950 font-black flex items-center gap-2.5 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600 animate-alert-sign flex-shrink-0" />
              <span>{currentConvenioRules.criticalRule}</span>
            </div>
          )}

          {currentConvenioRules.urgenciaRegra && (
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-xs text-sky-900 font-bold flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-700 flex-shrink-0" />
              <span>{currentConvenioRules.urgenciaRegra}</span>
            </div>
          )}

          {currentConvenioRules.inclusoPacote && currentConvenioRules.inclusoPacote.length > 0 && (
            <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 space-y-1.5">
              <span className="text-xs font-black text-[#0E7B86] uppercase tracking-wider block">
                Itens Inclusos nas Diárias Globais do Pacote:
              </span>
              <ul className="text-xs text-slate-700 space-y-1 pl-1 m-0">
                {currentConvenioRules.inclusoPacote.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0E7B86] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Main Table Presentation */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              Registros Encontrados:
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8]">
              {filteredItems.length}
            </span>
          </div>

          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Clique no código ou na linha para copiar instantaneamente
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-600 font-black border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-3 min-w-[130px]">Convênio</th>
                <th className="py-3.5 px-3 min-w-[120px]">Código TUSS</th>
                <th className="py-3.5 px-4 min-w-[240px]">Acomodação / Diária</th>
                <th className="py-3.5 px-3 min-w-[130px]">Solicitar Junto</th>
                <th className="py-3.5 px-3 min-w-[110px]">Parecer</th>
                <th className="py-3.5 px-3 min-w-[140px]">Mat / Med</th>
                <th className="py-3.5 px-3 min-w-[110px]">Ex. Laboratório</th>
                <th className="py-3.5 px-3 min-w-[120px]">Ex. Radiologia</th>
                <th className="py-3.5 px-3 min-w-[140px]">Fisio Internação</th>
                <th className="py-3.5 px-3 text-right min-w-[90px]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {filteredItems.map((item, index) => {
                const isEven = index % 2 === 0;
                const isCodeCopied = copiedCode === item.code;
                const isRowCopied = copiedRow === item.id;

                // Color code type badges
                let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
                if (item.tipo === 'Apartamento') badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
                if (item.tipo === 'Enfermaria') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                if (item.tipo === 'UTI') badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
                if (item.tipo === 'Isolamento') badgeColor = 'bg-purple-50 text-purple-700 border-purple-200';
                if (item.tipo === 'Hospital Dia') badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
                if (item.tipo === 'Berçário') badgeColor = 'bg-teal-50 text-teal-700 border-teal-200';

                return (
                  <tr 
                    key={item.id} 
                    className={`transition-colors hover:bg-[#F0F8F9]/60 ${isEven ? 'bg-white' : 'bg-slate-50/40'}`}
                  >
                    {/* Convênio */}
                    <td className="py-3 px-3 align-top">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#B01B52] text-white font-black text-[10px] flex items-center justify-center flex-shrink-0">
                          {item.badge}
                        </span>
                        <div>
                          <span className="font-extrabold text-slate-900 block leading-tight">
                            {item.convenioName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Código TUSS */}
                    <td className="py-3 px-3 align-top">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.code)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border-2 animate-code-alert-box font-mono font-black text-xs text-slate-950 dark:text-white transition-all cursor-pointer group shadow-2xs hover:scale-[1.02]"
                        title="Clique para copiar código TUSS"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-alert-sign flex-shrink-0" />
                        <span>{item.code}</span>
                        {isCodeCopied ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-amber-700/60 dark:text-amber-400/60 group-hover:text-rose-600" />
                        )}
                      </button>
                    </td>

                    {/* Acomodação */}
                    <td className="py-3 px-4 align-top">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 block leading-snug">
                          {item.acomodacao}
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${badgeColor}`}>
                            {item.tipo}
                          </span>
                          {item.observacoes && (
                            <span className="text-[11px] text-[#B01B52] font-semibold bg-[#FDF2F6] px-2 py-0.5 rounded border border-[#F7D0DF]">
                              {item.observacoes}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Solicitar Junto */}
                    <td className="py-3 px-3 align-top">
                      {item.solicitarJunto ? (
                        <div className="animate-alert-box border-2 rounded-lg px-2.5 py-1 font-mono font-black text-xs leading-tight inline-flex items-center gap-1.5 shadow-xs text-rose-950">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-alert-sign flex-shrink-0" />
                          <span>{item.solicitarJunto}</span>
                        </div>
                      ) : (
                        <span className="text-slate-300 font-medium">—</span>
                      )}
                    </td>

                    {/* Parecer */}
                    <td className="py-3 px-3 align-top">
                      {item.parecer ? (
                        <span className={`px-2 py-1 rounded-lg font-bold text-[11px] inline-block leading-tight ${
                          item.parecer.toLowerCase().includes('não precisa')
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {item.parecer}
                        </span>
                      ) : (
                        <span className="text-slate-300 font-medium">—</span>
                      )}
                    </td>

                    {/* Mat / Med */}
                    <td className="py-3 px-3 align-top">
                      {item.matMed ? (
                        <span className="text-[11px] text-slate-700 font-medium block leading-relaxed bg-slate-50 p-1.5 rounded-lg border border-slate-200/60">
                          {item.matMed}
                        </span>
                      ) : (
                        <span className="text-slate-300 font-medium">—</span>
                      )}
                    </td>

                    {/* Ex. Laboratório */}
                    <td className="py-3 px-3 align-top">
                      {item.exLab ? (
                        <span className={`px-2 py-1 rounded-lg font-bold text-[11px] inline-block leading-tight ${
                          item.exLab.toLowerCase().includes('não') || item.exLab.toLowerCase().includes('incluso')
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {item.exLab}
                        </span>
                      ) : (
                        <span className="text-slate-300 font-medium">—</span>
                      )}
                    </td>

                    {/* Ex. Radiologia */}
                    <td className="py-3 px-3 align-top">
                      {item.exRad ? (
                        <span className={`px-2 py-1 rounded-lg font-bold text-[11px] inline-block leading-tight ${
                          item.exRad.toLowerCase().includes('não') || item.exRad.toLowerCase().includes('incluso')
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {item.exRad}
                        </span>
                      ) : (
                        <span className="text-slate-300 font-medium">—</span>
                      )}
                    </td>

                    {/* Fisio Internação */}
                    <td className="py-3 px-3 align-top">
                      {item.fisioIntern ? (
                        <span className={`text-[11px] font-medium block leading-tight p-1.5 rounded-lg border ${
                          item.fisioIntern.toLowerCase().includes('não precisa') || item.fisioIntern.toLowerCase().includes('incluso')
                            ? 'bg-slate-50 text-slate-600 border-slate-200'
                            : 'bg-indigo-50 text-indigo-800 border-indigo-200 font-bold'
                        }`}>
                          {item.fisioIntern}
                        </span>
                      ) : (
                        <span className="text-slate-300 font-medium">—</span>
                      )}
                    </td>

                    {/* Ações */}
                    <td className="py-3 px-3 align-top text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const summary = `Convênio: ${item.convenioName} | Código: ${item.code} | Acomodação: ${item.acomodacao} | Solicitar Junto: ${item.solicitarJunto || 'N/A'} | Parecer: ${item.parecer || 'N/A'}`;
                            copyToClipboard(summary, item.id);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#EBF7F8] text-slate-700 hover:text-[#0E7B86] transition-colors cursor-pointer"
                          title="Copiar dados da diária"
                        >
                          {isRowCopied ? <Check className="w-3.5 h-3.5 text-[#0E7B86]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        {onGeneratePreGuia && item.code !== 'TEXTO LIVRE' && !item.code.startsWith('OPÇÃO') && (
                          <button
                            type="button"
                            onClick={() => onGeneratePreGuia(item.convenioId, item.code, item.acomodacao)}
                            className="px-2 py-1 rounded-lg bg-[#FDF2F6] hover:bg-[#FCE7EF] text-[#B01B52] font-black text-[10px] transition-colors cursor-pointer"
                            title="Gerar Pré-Guia com este código"
                          >
                            Pré-Guia
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

        {filteredItems.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <Info className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700 m-0">Nenhuma diária encontrada com os filtros atuais.</p>
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setSelectedConvenio('TODOS'); setSelectedTipo('TODOS'); }}
              className="text-xs font-bold text-[#0E7B86] hover:underline cursor-pointer"
            >
              Restaurar filtros e ver todas as diárias
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
