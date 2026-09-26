import React, { useState } from 'react';
import { WifiOff, CheckCircle2, ChevronRight, AlertCircle, RefreshCw, X } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface OfflineBannerProps {
  onNavigateToContingencia?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ onNavigateToContingencia }) => {
  const isOnline = useOnlineStatus();
  const [minimized, setMinimized] = useState(false);

  if (isOnline) return null;

  if (minimized) {
    return (
      <div className="no-print fixed bottom-4 left-4 z-50 animate-in fade-in duration-200">
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-lg border border-amber-400/30 text-xs font-black cursor-pointer transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-amber-200 animate-pulse" />
          <WifiOff className="w-3.5 h-3.5" />
          <span>Modo Offline</span>
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Status de Conexão Offline"
      className="no-print sticky top-0 z-40 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white px-4 py-2.5 shadow-md border-b border-amber-400/40"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-amber-700/60 flex items-center justify-center flex-shrink-0">
            <WifiOff className="w-4 h-4 text-amber-100 animate-pulse" />
          </div>

          <div>
            <div className="font-black text-amber-50 flex items-center gap-2">
              <span>MODO OFFLINE ATIVO — QUEDA DE REDE DETECTADA</span>
              <span className="bg-amber-800/60 text-amber-100 text-[10px] px-2 py-0.5 rounded-full font-bold">
                100% Funcional Localmente
              </span>
            </div>
            <p className="text-amber-100 text-[11px] m-0 font-medium">
              Todos os POPs (PS/Internação), Valores de Exames, Procedimentos, Ramais e Ficha de Contingência continuam disponíveis sem interrupção.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {onNavigateToContingencia && (
            <button
              type="button"
              onClick={onNavigateToContingencia}
              className="px-3 py-1.5 bg-white text-amber-900 hover:bg-amber-50 rounded-lg font-black text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <span>Abrir Ficha de Contingência</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="p-1.5 bg-amber-700/60 hover:bg-amber-700 text-white rounded-lg transition-colors cursor-pointer"
            title="Tentar reconectar"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setMinimized(true)}
            className="p-1.5 hover:bg-amber-700/40 text-amber-100 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Minimizar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
