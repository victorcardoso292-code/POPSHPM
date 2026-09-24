import React from 'react';
import { 
  FileSpreadsheet, 
  Files, 
  PhoneCall, 
  Lock, 
  Unlock, 
  Info,
  ChevronRight,
  Ambulance,
  Building2,
  Stethoscope,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { AppMode } from '../types';

interface SidebarProps {
  activeMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  isMaster: boolean;
  onOpenMaster: () => void;
  onLogoutMaster: () => void;
  selectedExamsCount: number;
  onLogoutSystem?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMode,
  onSelectMode,
  isMaster,
  onOpenMaster,
  onLogoutMaster,
  selectedExamsCount,
  onLogoutSystem,
  isDarkMode = false,
  onToggleDarkMode
}) => {
  const navItems = [
    {
      id: 'pops-ps' as AppMode,
      label: 'POPs • Pronto-Socorro',
      subtitle: 'Urgência, pacotes, exames e tokens',
      icon: Ambulance,
      badge: 'PS Urgência',
      badgeColor: 'bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8]'
    },
    {
      id: 'pops-internacao' as AppMode,
      label: 'POPs • Internação & UTI',
      subtitle: 'Clínica, cirúrgica, diárias e UTI',
      icon: Building2,
      badge: 'Internação',
      badgeColor: 'bg-[#FDF2F6] text-[#B01B52] border border-[#F7D0DF]'
    },
    {
      id: 'exames' as AppMode,
      label: 'Valores de Exames',
      subtitle: 'PS, Amor Saúde e 450+ Labs',
      icon: FileSpreadsheet,
      badge: selectedExamsCount > 0 ? `${selectedExamsCount} sel.` : 'Calculadora',
      badgeColor: selectedExamsCount > 0 ? 'bg-[#B01B52] text-white animate-pulse' : 'bg-slate-100 text-slate-700'
    },
    {
      id: 'procedimentos' as AppMode,
      label: 'Valores Procedimentos',
      subtitle: 'Cirurgias, diárias e plásticas',
      icon: Stethoscope,
      badge: 'Tabela 2026',
      badgeColor: 'bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8]'
    },
    {
      id: 'relatorios' as AppMode,
      label: 'Relatórios de Internação',
      subtitle: 'Checklist para impressão',
      icon: Files,
      badge: '3 Categorias',
      badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200'
    },
    {
      id: 'ramais' as AppMode,
      label: 'Ramais Hospitalares',
      subtitle: 'Contatos internos rápidos',
      icon: PhoneCall,
      badge: '23 Setores',
      badgeColor: 'bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8]'
    }
  ];

  return (
    <aside className="w-full lg:w-72 bg-white border-r border-slate-200 flex flex-col p-4 gap-4 shadow-xs">
      <div>
        <p className="text-[11px] uppercase font-black tracking-wider text-slate-400 mb-2 px-2">
          Módulos Operacionais
        </p>
        <nav className="space-y-1.5" aria-label="Navegação do sistema">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectMode(item.id)}
                className={`w-full text-left flex items-center justify-between p-3 rounded-xl transition-all font-medium group cursor-pointer ${
                  isActive
                    ? 'bg-[#FDF2F6] border-2 border-[#B01B52] text-[#B01B52] shadow-2xs'
                    : 'bg-slate-50/70 hover:bg-[#EBF7F8] border border-slate-200/80 text-slate-700 hover:text-[#0E7B86] hover:border-[#C4E5E8]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#B01B52] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-[#0E7B86] group-hover:bg-[#0E7B86] group-hover:text-white group-hover:border-[#0E7B86]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-sm sm:text-base font-black truncate leading-tight">
                      {item.label}
                    </span>
                    <span className="block text-xs text-slate-500 font-medium truncate mt-0.5">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-[#B01B52] translate-x-0.5' : 'text-slate-400'}`} />
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Master Access section */}
      <div className="pt-2 border-t border-slate-200">
        <p className="text-[11px] uppercase font-black tracking-wider text-slate-400 mb-2 px-2">
          Administração & Auditoria
        </p>
        <button
          type="button"
          onClick={isMaster ? onLogoutMaster : onOpenMaster}
          className={`w-full flex items-center justify-between p-3 rounded-xl text-left border transition-all cursor-pointer ${
            isMaster
              ? 'bg-[#EBF7F8] border-[#0E7B86]/40 text-[#0E7B86] hover:bg-[#D8ECEE]'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isMaster ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {isMaster ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <span className="block text-xs font-bold leading-tight">
                {isMaster ? 'Modo Master Ativo' : 'Acesso Master'}
              </span>
              <span className="block text-[11px] text-slate-500">
                {isMaster ? 'Clique para encerrar sessão' : 'Editar valores e regras'}
              </span>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isMaster ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'}`}>
            {isMaster ? 'Conectado' : 'Entrar'}
          </span>
        </button>

        {onToggleDarkMode && (
          <button
            type="button"
            onClick={onToggleDarkMode}
            className={`w-full mt-2 flex items-center justify-between py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
            title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
          >
            <div className="flex items-center gap-2">
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-600" />
              )}
              <span>{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
              isDarkMode ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-100 text-slate-600'
            }`}>
              {isDarkMode ? 'Ligado' : 'Desligado'}
            </span>
          </button>
        )}

        {onLogoutSystem && (
          <button
            type="button"
            onClick={onLogoutSystem}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-700 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Bloquear / Sair do Sistema</span>
          </button>
        )}
      </div>

      {/* Protocol Quick Reminder Card */}
      <div className="mt-auto bg-slate-50 rounded-xl p-3.5 border border-slate-200/90 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Info className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span>Diretrizes Institucionais</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed m-0">
          O <strong>SERVIR</strong> está integrado junto aos POPs operacionais. Todos os exames com contraste (+ R$ 250) e diárias de UTI exigem registro e assinatura em guia TISS.
        </p>
      </div>
    </aside>
  );
};
