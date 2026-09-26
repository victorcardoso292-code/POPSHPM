import React, { useState } from 'react';
import { Download, Monitor, CheckCircle2, X, Smartphone, ArrowDown } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'sidebar' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Se já estiver instalado como PWA standalone, não mostra
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  // Botão para Chromium, Android e Windows Desktop (quando prompt nativo está disponível)
  if (isInstallable) {
    if (variant === 'sidebar') {
      return (
        <button
          type="button"
          onClick={handleInstallClick}
          disabled={isInstalling}
          className="w-full mt-3 p-3 bg-gradient-to-r from-[#006B70] to-[#0A565D] hover:from-[#085966] hover:to-[#064247] text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-between gap-2 cursor-pointer group"
          title="Instalar no Computador ou Celular para funcionar 100% Offline"
        >
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-300 group-hover:translate-y-0.5 transition-transform" />
            <div className="text-left">
              <div className="leading-tight">Instalar Aplicativo</div>
              <div className="text-[10px] text-teal-200 font-normal">Funciona sem internet</div>
            </div>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
            PWA
          </span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={handleInstallClick}
        disabled={isInstalling}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#006B70] hover:bg-[#085966] text-white rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer group"
        title="Instale o aplicativo na sua máquina para ter acesso rápido e funcionar quando a rede cair"
      >
        <Download className="w-3.5 h-3.5 text-emerald-300 group-hover:translate-y-0.5 transition-transform" />
        <span className="hidden sm:inline">Instalar App Offline</span>
        <span className="sm:hidden">Instalar</span>
      </button>
    );
  }

  // Guia específico para iOS Safari (onde beforeinstallprompt não existe)
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-300 cursor-pointer"
          title="Instalar no iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-slate-600" />
          <span>Instalar no iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#006B70] text-white flex items-center justify-center font-bold text-sm">
                    ❖
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 m-0">Instalar no iPhone / iPad</h3>
                    <p className="text-[11px] text-slate-500 m-0">Acesso offline direto na tela de início</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                    1
                  </span>
                  <span>Toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta) na barra do Safari.</span>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                    2
                  </span>
                  <span>Role a lista para baixo e toque em <strong>&ldquo;Adicionar à Tela de Início&rdquo;</strong>.</span>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                    3
                  </span>
                  <span>Confirme no canto superior direito tocando em <strong>&ldquo;Adicionar&rdquo;</strong>.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 bg-[#006B70] hover:bg-[#085966] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
