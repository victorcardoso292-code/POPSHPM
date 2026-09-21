import React from 'react';
import { 
  Building2, 
  Lock, 
  Unlock, 
  Calculator,
  Search,
  Sparkles,
  Command
} from 'lucide-react';
import { AppMode } from '../types';

interface HeaderProps {
  activeMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  isMaster: boolean;
  onOpenMaster: () => void;
  onLogoutMaster: () => void;
  globalSearch: string;
  onSearchChange: (val: string) => void;
  selectedExamsCount: number;
  onOpenUniversalSearch?: () => void;
  onOpenSmartDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeMode,
  onSelectMode,
  isMaster,
  onOpenMaster,
  onLogoutMaster,
  globalSearch,
  onSearchChange,
  selectedExamsCount,
  onOpenUniversalSearch,
  onOpenSmartDrawer
}) => {
  return (
    <header className="bg-white text-slate-800 shadow-xs border-b border-slate-200/90 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Brand & Logo (Medical Kora Saúde) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer" onClick={() => onSelectMode('pops-ps')}>
              {/* Stylized Medical Cross Icon */}
              <div className="w-10 h-10 rounded-xl bg-[#EBF7F8] border border-[#C4E5E8] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <svg className="w-6 h-6 text-[#0E7B86]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5C12 3.12 13.12 2 14.5 2H17.5C18.88 2 20 3.12 20 4.5V10C20 11.1 20.9 12 22 12H27.5C28.88 12 30 13.12 30 14.5V17.5C30 18.88 28.88 20 27.5 20H22C20.9 20 20 20.9 20 22V27.5C20 28.88 18.88 30 17.5 30H14.5C13.12 30 12 28.88 12 27.5V22C12 20.9 11.1 20 10 20H4.5C3.12 20 2 18.88 2 17.5V14.5C2 13.12 3.12 12 4.5 12H10C11.1 12 12 11.1 12 10V4.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="#D8ECEE" />
                </svg>
              </div>

              {/* Medical Kora Saúde typography */}
              <div className="flex flex-col leading-none">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#B01B52]">
                    Medical
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 tracking-wider">
                  Kora<span className="font-normal text-slate-400">Saúde</span>
                </span>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            {/* Portal Title & Hospital Name */}
            <div className="min-w-0 hidden sm:block">
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-sm font-black tracking-tight text-slate-800 m-0 leading-tight truncate">
                  CENTRAL DE AUTORIZAÇÕES
                </h1>
                <span className="bg-[#EBF7F8] text-[#0E7B86] text-[10px] px-2 py-0.5 rounded-full font-bold border border-[#C4E5E8] hidden lg:inline-block">
                  POPs 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium m-0 flex items-center gap-1 mt-0.5 truncate">
                <Building2 className="w-3 h-3 text-[#0E7B86] flex-shrink-0" />
                Hospital Palmas Medical • Portal Operacional
              </p>
            </div>
          </div>

          {/* Central Search Trigger with Medical Berry Search Button */}
          <div className="flex-1 max-w-md mx-0 md:mx-4">
            <button
              type="button"
              onClick={onOpenUniversalSearch}
              className="w-full bg-[#F8FAFB] hover:bg-[#F0F8F9] border border-slate-200 hover:border-[#0E7B86] rounded-xl pl-3.5 pr-1.5 py-1.5 text-left text-xs text-slate-600 flex items-center justify-between gap-2 transition-all group cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="truncate text-slate-600 group-hover:text-slate-900 font-medium">
                  Buscar convênio, exame, ramal ou relatório...
                </span>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-mono font-bold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500 hidden sm:flex items-center gap-0.5">
                  <Command className="w-2.5 h-2.5" /> K
                </span>
                {/* Authentic Berry Search Button from brand */}
                <div className="w-8 h-8 rounded-lg bg-[#B01B52] group-hover:bg-[#971444] text-white flex items-center justify-center transition-colors shadow-xs">
                  <Search className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          </div>

          {/* Quick Actions & Master Status */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Smart Rule Inspector Button - Medical Berry Pill matching Agendar Online */}
            <button
              type="button"
              onClick={onOpenSmartDrawer}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#B01B52] hover:bg-[#971444] text-white transition-all shadow-xs cursor-pointer"
              title="Abrir Raio-X e Consulta Rápida de Convênios"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Raio-X & Regras</span>
            </button>

            {/* Cart summary badge if exams selected */}
            {selectedExamsCount > 0 && (
              <button
                type="button"
                onClick={() => onSelectMode('exames')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0E7B86] text-white hover:bg-[#095962] transition-all shadow-xs cursor-pointer animate-pulse"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>{selectedExamsCount} Exame{selectedExamsCount > 1 ? 's' : ''}</span>
              </button>
            )}

            {/* Master Access Status */}
            {isMaster ? (
              <div className="flex items-center gap-1.5 bg-[#EBF7F8] border border-[#0E7B86]/40 rounded-xl px-2.5 py-1.5 text-xs text-[#0E7B86] font-semibold shadow-2xs">
                <Unlock className="w-3.5 h-3.5 text-[#0E7B86]" />
                <span className="hidden sm:inline font-bold">Master Ativo</span>
                <button
                  type="button"
                  onClick={onLogoutMaster}
                  className="ml-1 text-[10px] bg-[#B01B52] hover:bg-[#971444] text-white px-1.5 py-0.5 rounded font-bold cursor-pointer"
                  title="Sair do modo Master"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenMaster}
                className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-medium transition-colors cursor-pointer"
                title="Acesso Master para gerenciar valores e regras"
              >
                <Lock className="w-3.5 h-3.5 text-[#0E7B86]" />
                <span className="hidden sm:inline">Acesso Master</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
