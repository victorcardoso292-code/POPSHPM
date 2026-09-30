import React, { useState } from 'react';
import { 
  FolderOpen, 
  Search, 
  FileText, 
  UploadCloud, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Download, 
  ShieldCheck,
  FileCheck
} from 'lucide-react';

export interface HospitalDocument {
  id: string;
  title: string;
  category: 'termos' | 'admissao' | 'contratos' | 'declaracoes' | 'outros';
  code?: string;
  description: string;
  updatedAt?: string;
  fileUrl?: string;
  downloadable?: boolean;
}

export const DocumentosViewer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Empty list for now as requested: "AI PODE DEIXA EM BRANCO QUE EU VOU PEDIR DEPOIS PÁRA COLOCAR ALGUNS"
  const documents: HospitalDocument[] = [];

  const categories = [
    { id: 'todos', label: 'Todos os Documentos' },
    { id: 'termos', label: 'Termos & Consentimento' },
    { id: 'admissao', label: 'Fichas de Admissão' },
    { id: 'contratos', label: 'Contratos Particulares' },
    { id: 'declaracoes', label: 'Declarações & Laudos' },
    { id: 'outros', label: 'Outros Documentos' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF7F8] border border-[#C4E5E8] flex items-center justify-center text-[#0E7B86] shadow-xs flex-shrink-0">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight m-0">
                DOCUMENTOS & FORMULÁRIOS
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200">
                Aba Nova
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Repositório central de termos de consentimento, fichas cadastrais, contratos particulares e formulários operacionais.
            </p>
          </div>
        </div>

        {/* Ready indicator */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 self-start md:self-auto">
          <Clock className="w-4 h-4 text-[#0E7B86]" />
          <span>Aguardando inclusão de documentos</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              disabled
              placeholder="Buscar documento por título, código ou palavra-chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-400 placeholder:text-slate-400 cursor-not-allowed"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Documento</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0E7B86] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Blank / Empty State Container */}
      <div className="bg-white border-2 border-dashed border-slate-300/80 rounded-3xl p-8 sm:p-14 text-center shadow-xs space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#EBF7F8] border border-[#C4E5E8] flex items-center justify-center text-[#0E7B86] mx-auto shadow-xs">
          <FolderOpen className="w-10 h-10" />
        </div>

        <div className="max-w-xl mx-auto space-y-2">
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            Aba Documentos Criada e Pronta
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Esta seção está em branco conforme solicitado e preparada para receber os documentos oficiais, termos de responsabilidade, fichas de internação, contratos particulares e formulários hospitalares.
          </p>
        </div>

        {/* Prepared Capabilities Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-[#0E7B86] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-slate-900 m-0">Termos & Fichas</h4>
              <p className="text-[11px] text-slate-500 m-0 mt-0.5">Pronto para termos de internação e cirurgia.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left flex items-start gap-3">
            <Printer className="w-5 h-5 text-[#0E7B86] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-slate-900 m-0">Impressão Direta</h4>
              <p className="text-[11px] text-slate-500 m-0 mt-0.5">Formatação A4 para impressão na recepção.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left flex items-start gap-3">
            <Download className="w-5 h-5 text-[#0E7B86] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-slate-900 m-0">Download Rápido</h4>
              <p className="text-[11px] text-slate-500 m-0 mt-0.5">Acesso a modelos em PDF ou formulários.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#0E7B86] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-slate-900 m-0">Contratos & Kits</h4>
              <p className="text-[11px] text-slate-500 m-0 mt-0.5">Kit de admissão particular e convênios.</p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Basta enviar os títulos, modelos ou arquivos quando desejar adicioná-los.
          </span>
        </div>
      </div>
    </div>
  );
};
