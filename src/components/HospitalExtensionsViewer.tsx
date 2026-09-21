import React, { useState, useMemo } from 'react';
import { 
  PhoneCall, 
  Search, 
  Copy, 
  Check, 
  Building2, 
  MapPin, 
  ShieldCheck,
  Phone
} from 'lucide-react';
import { HOSPITAL_EXTENSIONS } from '../data/hospitalData';
import { HospitalExtension } from '../types';

interface HospitalExtensionsViewerProps {
  initialSearch?: string;
}

export const HospitalExtensionsViewer: React.FC<HospitalExtensionsViewerProps> = ({
  initialSearch = ''
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [selectedCat, setSelectedCat] = useState<string>('todos');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialSearch) {
      setSearchTerm(initialSearch);
    }
  }, [initialSearch]);

  const categories = [
    { id: 'todos', label: 'Todos os Ramais' },
    { id: 'uti', label: 'UTIs' },
    { id: 'atendimento', label: 'Recepções & PS' },
    { id: 'farmacia', label: 'Farmácias' },
    { id: 'internacao', label: 'Internação' },
    { id: 'apoio', label: 'Apoio Diagnóstico & CC' },
    { id: 'administracao', label: 'Administração & TI' }
  ];

  const filteredExtensions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return HOSPITAL_EXTENSIONS.filter(ext => {
      const matchCat = selectedCat === 'todos' || ext.category === selectedCat;
      const matchSearch = ext.sector.toLowerCase().includes(q) || 
                          ext.number.includes(q) || 
                          (ext.building && ext.building.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [searchTerm, selectedCat]);

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#095962] via-[#0E7B86] to-[#095962] border border-[#0E7B86]/40 rounded-2xl p-5 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#EBF7F8] bg-[#095962] border border-white/20 px-2.5 py-0.5 rounded-full">
              Guia Telefônico Interno
            </span>
            <span className="text-xs text-white/80 font-medium">Hospital Palmas Medical</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white m-0">
            Ramais & Telefones Úteis
          </h2>
          <p className="text-xs text-white/85 max-w-xl leading-relaxed m-0">
            Consulte rapidamente o ramal de UTIs, Centros Cirúrgicos, Farmácias, Postos de Enfermagem, Apoio Diagnóstico e Recepções.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#EBF7F8]" />
          <span>Central Telefônica: <strong>(63) 3214-8000</strong></span>
        </div>
      </div>

      {/* Pinned Critical / Emergency Extensions */}
      <div className="bg-white border border-[#F6C6D6] rounded-2xl p-4 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[#B01B52] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#B01B52]" />
            Ramais Críticos • Emergência & Pronta Resposta
          </span>
          <span className="text-[11px] text-slate-400 font-semibold">1-clique para copiar</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {[
            { sector: 'UTI Geral', num: '8010', tag: 'UTI' },
            { sector: 'Recepção PS', num: '8020', tag: 'PS' },
            { sector: 'Enfermagem PS', num: '8025', tag: 'PS' },
            { sector: 'Farmácia Central', num: '8040', tag: 'Farmácia' },
            { sector: 'Tomografia / RX', num: '8032', tag: 'SADT' },
            { sector: 'Centro Cirúrgico', num: '8015', tag: 'CC' }
          ].map(crit => (
            <button
              key={crit.num}
              type="button"
              onClick={() => copyNumber(crit.num)}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-[#FDF2F6] hover:border-[#F6C6D6] transition-all text-left flex flex-col justify-between gap-1 group cursor-pointer"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-black uppercase text-[#B01B52] bg-[#FDF2F6] px-1.5 py-0.5 rounded border border-[#F6C6D6]">
                  {crit.tag}
                </span>
                {copiedNumber === crit.num ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#B01B52]" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block truncate">
                  {crit.sector}
                </span>
                <span className="font-mono text-sm font-black text-slate-900 block mt-0.5">
                  {crit.num}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCat === cat.id
                    ? 'bg-[#0E7B86] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-[#EBF7F8] text-slate-700 hover:text-[#0E7B86]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Pesquisar setor ou ramal..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0E7B86] focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Extensions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredExtensions.map((ext, idx) => {
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200 hover:border-teal-400 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                    {ext.category.toUpperCase()}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <h3 className="text-sm font-black text-slate-900 m-0 leading-tight">
                  {ext.sector}
                </h3>
                {ext.building && (
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 m-0 pt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{ext.building}</span>
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-bold">Ramal:</span>
                  <span className="font-mono text-base font-black text-teal-800 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                    {ext.number}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => copyNumber(ext.number)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-teal-700 transition-colors"
                    title="Copiar ramal"
                  >
                    {copiedNumber === ext.number ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <a
                    href={`tel:${ext.number}`}
                    className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 transition-colors"
                    title="Ligar para o ramal"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
