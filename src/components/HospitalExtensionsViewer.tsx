import React, { useState, useMemo } from 'react';
import { 
  PhoneCall, 
  Search, 
  Copy, 
  Check, 
  Building2, 
  MapPin, 
  ShieldCheck,
  Phone,
  MessageCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { HOSPITAL_EXTENSIONS, HOSPITAL_WHATSAPP_CONTACTS } from '../data/hospitalData';
import { HospitalExtension, HospitalWhatsContact } from '../types';

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
    { id: 'whatsapp', label: 'WhatsApp Hospitalar (8)' },
    { id: 'hst', label: 'Unidade HST' },
    { id: 'uti', label: 'UTIs' },
    { id: 'atendimento', label: 'Recepções & PS' },
    { id: 'internacao', label: 'Internação' },
    { id: 'farmacia', label: 'Farmácias' },
    { id: 'apoio', label: 'Apoio Diagnóstico & CC' },
    { id: 'administracao', label: 'Administração & TI' }
  ];

  const filteredWhatsApp = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return HOSPITAL_WHATSAPP_CONTACTS;
    return HOSPITAL_WHATSAPP_CONTACTS.filter(item => 
      item.sector.toLowerCase().includes(q) ||
      item.whatsapp.includes(q) ||
      item.cleanNumber.includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  }, [searchTerm]);

  const filteredExtensions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return HOSPITAL_EXTENSIONS.filter(ext => {
      if (selectedCat === 'whatsapp') {
        return !!ext.whatsapp;
      }
      const matchCat = 
        selectedCat === 'todos' || 
        (selectedCat === 'hst' 
          ? (ext.sector.toUpperCase().includes('HST') || (ext.building && ext.building.toUpperCase().includes('HST'))) 
          : ext.category === selectedCat);
      const matchSearch = ext.sector.toLowerCase().includes(q) || 
                          ext.number.includes(q) || 
                          (ext.whatsapp && ext.whatsapp.includes(q)) ||
                          (ext.building && ext.building.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [searchTerm, selectedCat]);

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const getWhatsAppLink = (cleanNum: string, sectorName: string) => {
    const msg = encodeURIComponent(`Olá, sou da equipe do Hospital Palmas Medical e gostaria de falar com o setor: ${sectorName}.`);
    return `https://wa.me/${cleanNum}?text=${msg}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#095962] via-[#0E7B86] to-[#095962] border border-[#0E7B86]/40 rounded-2xl p-5 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase tracking-widest text-[#EBF7F8] bg-[#095962] border border-white/20 px-2.5 py-0.5 rounded-full">
              Guia Telefônico & WhatsApp
            </span>
            <span className="text-xs text-white/80 font-medium">Hospital Palmas Medical</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white m-0">
            Ramais & WhatsApp dos Setores
          </h2>
          <p className="text-xs text-white/85 max-w-xl leading-relaxed m-0">
            Consulte rapidamente os números de WhatsApp institucionais e ramais internos de UTIs, Centros Cirúrgicos, Postos de Enfermagem, Farmácias, TI e Recepções.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 self-start md:self-auto">
          <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#EBF7F8]" />
            <span>Central: <strong>(63) 3214-8000</strong></span>
          </div>
          <div className="bg-emerald-500/20 backdrop-blur-xs border border-emerald-400/40 rounded-xl px-3.5 py-2 text-xs text-emerald-100 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-300" />
            <span><strong>8 WhatsApps</strong> Integrados</span>
          </div>
        </div>
      </div>

      {/* NOVO: SEÇÃO DE WHATSAPP OFICIAL DOS SETORES */}
      <div className="bg-white border-2 border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs flex-shrink-0">
              <MessageCircle className="w-5 h-5 fill-emerald-500 text-white" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 m-0">
                WhatsApp Hospitalar Oficial • Plantão e Setores
              </span>
              <p className="text-[11px] text-slate-500 m-0">
                Clique para iniciar conversa direta no WhatsApp ou copie o número formatado.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            8 Contatos Rápidos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredWhatsApp.map((item, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-emerald-50/50 hover:border-emerald-300 transition-all flex flex-col justify-between gap-2.5 group"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200">
                    {item.badge || 'WhatsApp'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => copyNumber(item.whatsapp)}
                      className="p-1 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-emerald-100/50 transition-colors cursor-pointer"
                      title="Copiar número"
                    >
                      {copiedNumber === item.whatsapp ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug group-hover:text-emerald-900 m-0 pt-0.5">
                  {item.sector}
                </h4>

                {item.description && (
                  <p className="text-[11px] text-slate-500 line-clamp-2 m-0 leading-tight">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-black text-slate-800">
                  {item.whatsapp}
                </span>

                <a
                  href={getWhatsAppLink(item.cleanNumber, item.sector)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-2xs active:scale-95 cursor-pointer no-underline"
                  title="Abrir no WhatsApp Web / App"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Chamar</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pinned Critical / Emergency Extensions */}
      <div className="bg-white border border-[#F6C6D6] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#B01B52] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#B01B52]" />
            Ramais Críticos • Emergência & Pronta Resposta
          </span>
          <span className="text-xs text-slate-400 font-bold">1-clique para copiar</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
          {[
            { sector: 'PA - HST', num: '8359', tag: 'HST • PA' },
            { sector: 'Internação HST', num: '8300', tag: 'HST • INT' },
            { sector: 'UTI B', num: '1893', tag: 'UTI B' },
            { sector: 'UTI A', num: '1894', tag: 'UTI A' },
            { sector: 'Recepção PS', num: '1878', tag: 'PS' },
            { sector: 'Enfermagem PS', num: '1860', tag: 'PS' },
            { sector: 'Farmácia CC', num: '1824', tag: 'Farmácia' },
            { sector: 'Centro Cirúrgico', num: '1822', tag: 'CC' }
          ].map(crit => (
            <button
              key={crit.num}
              type="button"
              onClick={() => copyNumber(crit.num)}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-[#FDF2F6] hover:border-[#F6C6D6] transition-all text-left flex flex-col justify-between gap-1.5 group cursor-pointer"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-xs font-black uppercase text-[#B01B52] bg-[#FDF2F6] px-2 py-0.5 rounded border border-[#F6C6D6]">
                  {crit.tag}
                </span>
                {copiedNumber === crit.num ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-400 group-hover:text-[#B01B52]" />
                )}
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 block truncate">
                  {crit.sector}
                </span>
                <span className="font-mono text-base sm:text-lg font-black text-slate-900 block mt-0.5">
                  {crit.num}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
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
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Pesquisar setor, ramal ou WhatsApp..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E7B86] focus:bg-white text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Extensions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExtensions.map((ext, idx) => {
          const isHst = ext.sector.toUpperCase().includes('HST') || (ext.building && ext.building.toUpperCase().includes('HST'));
          const cleanWhats = ext.whatsapp ? ext.whatsapp.replace(/\D/g, '') : null;

          return (
            <div
              key={idx}
              className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3.5 ${
                isHst ? 'border-amber-300 hover:border-amber-500 bg-gradient-to-br from-white to-amber-50/20' : 'border-slate-200 hover:border-[#0E7B86]'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isHst && (
                      <span className="text-xs font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                        Unidade HST
                      </span>
                    )}
                    {ext.whatsapp && (
                      <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        Tem WhatsApp
                      </span>
                    )}
                    <span className="text-xs uppercase font-black tracking-wider text-slate-400">
                      {(ext.category || 'geral').toUpperCase()}
                    </span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 m-0 leading-tight">
                  {ext.sector}
                </h3>
                {ext.building && (
                  <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 m-0 pt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{ext.building}</span>
                  </p>
                )}

                {ext.whatsapp && (
                  <div className="pt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp: <strong className="font-mono">{ext.whatsapp}</strong></span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-slate-500 font-bold">Ramal:</span>
                  <span className={`font-mono text-lg sm:text-xl font-black px-2.5 py-1 rounded-lg border ${
                    isHst 
                      ? 'text-amber-900 bg-amber-50 border-amber-300' 
                      : 'text-teal-800 bg-teal-50 border-teal-200'
                  }`}>
                    {ext.number}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => copyNumber(ext.number)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-teal-700 transition-colors cursor-pointer"
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
                    className={`p-2 rounded-lg transition-colors ${
                      isHst 
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-800' 
                        : 'bg-teal-50 hover:bg-teal-100 text-teal-700'
                    }`}
                    title="Ligar para o ramal"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  {ext.whatsapp && cleanWhats && (
                    <a
                      href={getWhatsAppLink(cleanWhats, ext.sector)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                      title="Chamar no WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
