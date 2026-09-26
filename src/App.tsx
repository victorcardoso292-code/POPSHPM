import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { PopsPsViewer } from './components/PopsPsViewer';
import { PopsInternacaoViewer } from './components/PopsInternacaoViewer';
import { ExamValuesViewer } from './components/ExamValuesViewer';
import { ProcedureValuesViewer } from './components/ProcedureValuesViewer';
import { FluxoParecerViewer } from './components/FluxoParecerViewer';
import { PlanoContingenciaViewer } from './components/PlanoContingenciaViewer';
import { HospitalReportsViewer } from './components/HospitalReportsViewer';
import { HospitalExtensionsViewer } from './components/HospitalExtensionsViewer';
import { AiHospitalAssistant } from './components/AiHospitalAssistant';
import { AiChatDrawer } from './components/AiChatDrawer';
import { PreGuiaGenerator } from './components/PreGuiaGenerator';
import { MasterModal } from './components/MasterModal';
import { UniversalSearchModal } from './components/UniversalSearchModal';
import { SmartRuleDrawer } from './components/SmartRuleDrawer';
import { Footer } from './components/Footer';
import { LoginScreen } from './components/LoginScreen';
import { Sparkles } from 'lucide-react';

import { AppMode, ExamRow, ExamTableType, SelectedExamItem } from './types';
import { 
  loadPsExams, 
  savePsExams, 
  loadAmorExams, 
  saveAmorExams, 
  loadLabExams, 
  saveLabExams,
  resetExamsToDefault,
  isMasterLoggedIn,
  setMasterSession,
  isSystemAuthenticated,
  setSystemAuth
} from './services/storageService';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isSystemAuthenticated());
  const [activeMode, setActiveMode] = useState<AppMode>('pops-ps');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [isMaster, setIsMaster] = useState<boolean>(() => isMasterLoggedIn());
  const [isMasterModalOpen, setIsMasterModalOpen] = useState<boolean>(false);

  // Universal Search & Smart Drawer Modals
  const [isUniversalSearchOpen, setIsUniversalSearchOpen] = useState<boolean>(false);
  const [isSmartDrawerOpen, setIsSmartDrawerOpen] = useState<boolean>(false);
  const [smartDrawerDefaultPlanId, setSmartDrawerDefaultPlanId] = useState<string>('AMIL');

  // Floating AI Chat Drawer state
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [aiDrawerPrompt, setAiDrawerPrompt] = useState<string>('');

  // Navigation target states (defaults to empty so user sees the clean grid of plans)
  const [selectedPlanForPops, setSelectedPlanForPops] = useState<string>('');
  const [examSearchInitial, setExamSearchInitial] = useState<string>('');
  const [ramaisSearchInitial, setRamaisSearchInitial] = useState<string>('');
  const [relatoriosTypeInitial, setRelatoriosTypeInitial] = useState<'PARTICULAR' | 'URGÊNCIA' | 'ELETIVO'>('URGÊNCIA');
  const [parecerConvenioInitial, setParecerConvenioInitial] = useState<string>('SERVIR');

  // Exams datasets
  const [psExams, setPsExams] = useState<ExamRow[]>(() => loadPsExams());
  const [amorExams, setAmorExams] = useState<ExamRow[]>(() => loadAmorExams());
  const [labExams, setLabExams] = useState<ExamRow[]>(() => loadLabExams());

  // Selected exams in calculation cart
  const [selectedExams, setSelectedExams] = useState<{ [key: string]: SelectedExamItem }>({});

  // Dark Mode state with persistence in localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('theme_dark_mode');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme_dark_mode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme_dark_mode', 'false');
      }
    } catch {
      // ignore storage issues
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Dynamic parameters passed to AI or Pre-guia
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');
  const [preGuiaPrefill, setPreGuiaPrefill] = useState<{ convenio?: string; code?: string; desc?: string }>({});

  // Global Keyboard Shortcut: Ctrl + K or / to open Universal Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsUniversalSearchOpen(true);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsUniversalSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveExams = (table: ExamTableType, exams: ExamRow[]) => {
    if (table === 'ps') {
      savePsExams(exams);
      setPsExams(exams);
    } else if (table === 'amor') {
      saveAmorExams(exams);
      setAmorExams(exams);
    } else {
      saveLabExams(exams);
      setLabExams(exams);
    }
  };

  const handleResetExams = (table: ExamTableType) => {
    const fresh = resetExamsToDefault(table);
    if (table === 'ps') setPsExams(fresh);
    else if (table === 'amor') setAmorExams(fresh);
    else setLabExams(fresh);
  };

  const handleToggleSelectExam = (table: ExamTableType, index: number, exam: ExamRow, contrast?: boolean) => {
    const key = `${table}-${index}`;
    setSelectedExams(prev => {
      const copy = { ...prev };
      if (copy[key] && !contrast && copy[key].hasContrast === contrast) {
        delete copy[key];
      } else {
        copy[key] = {
          tableType: table,
          index,
          exam,
          hasContrast: !!contrast,
          quantity: copy[key]?.quantity || 1
        };
      }
      return copy;
    });
  };

  const handleUpdateExamQuantity = (key: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveExamItem(key);
      return;
    }
    setSelectedExams(prev => {
      if (!prev[key]) return prev;
      return {
        ...prev,
        [key]: {
          ...prev[key],
          quantity: qty
        }
      };
    });
  };

  const handleRemoveExamItem = (key: string) => {
    setSelectedExams(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleClearSelectedExams = () => {
    setSelectedExams({});
  };

  const handleLoginMaster = () => {
    setIsMaster(true);
    setMasterSession(true);
  };

  const handleLogoutMaster = () => {
    setIsMaster(false);
    setMasterSession(false);
  };

  const handleOpenAiWithPrompt = (prompt: string) => {
    setAiDrawerPrompt(prompt);
    setIsAiDrawerOpen(true);
  };

  const handleOpenFullAi = (prompt?: string) => {
    if (prompt) setAiInitialPrompt(prompt);
    setIsAiDrawerOpen(false);
    setActiveMode('ai-assistant');
  };

  const handleGeneratePreGuiaFromPops = (convenio: string, code?: string, desc?: string) => {
    setPreGuiaPrefill({ convenio, code, desc });
    setActiveMode('pre-guia');
  };

  // Universal Navigation Handlers
  const handleNavigateToConvenio = (mode: 'pops-ps' | 'pops-internacao', convenioId: string) => {
    setSelectedPlanForPops(convenioId);
    setSmartDrawerDefaultPlanId(convenioId);
    setActiveMode(mode);
  };

  const handleNavigateToExames = (searchQuery?: string) => {
    if (searchQuery) {
      setExamSearchInitial(searchQuery);
    }
    setActiveMode('exames');
  };

  const handleNavigateToRamais = (searchQuery?: string) => {
    if (searchQuery) {
      setRamaisSearchInitial(searchQuery);
    }
    setActiveMode('ramais');
  };

  const handleNavigateToRelatorios = (tipo?: 'PARTICULAR' | 'URGÊNCIA' | 'ELETIVO') => {
    if (tipo) {
      setRelatoriosTypeInitial(tipo);
    }
    setActiveMode('relatorios');
  };

  const handleNavigateToParecer = (convenioId?: string) => {
    if (convenioId) {
      setParecerConvenioInitial(convenioId);
    }
    setActiveMode('fluxo-parecer');
  };

  const handleNavigateToContingencia = () => {
    setActiveMode('plano-contingencia');
  };

  const handleSelectMode = (mode: AppMode) => {
    if (mode === 'pops-ps' || mode === 'pops-internacao' || mode === 'pops') {
      setSelectedPlanForPops('');
    }
    setActiveMode(mode);
  };

  const handleLogoutSystem = () => {
    setSystemAuth(false);
    setIsAuthenticated(false);
  };

  const selectedCount = Object.keys(selectedExams).length;

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F4F8F9] text-slate-900 flex flex-col font-sans selection:bg-[#B01B52] selection:text-white print:bg-white print:min-h-0 print:p-0 print:m-0 print:w-full">
      {/* Top Header */}
      <div className="print:hidden">
        <Header
          activeMode={activeMode}
          onSelectMode={handleSelectMode}
          isMaster={isMaster}
          onOpenMaster={() => setIsMasterModalOpen(true)}
          onLogoutMaster={handleLogoutMaster}
          globalSearch={globalSearch}
          onSearchChange={setGlobalSearch}
          selectedExamsCount={selectedCount}
          onOpenUniversalSearch={() => setIsUniversalSearchOpen(true)}
          onOpenSmartDrawer={() => setIsSmartDrawerOpen(true)}
          onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
          onLogoutSystem={handleLogoutSystem}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1720px] 2xl:max-w-[1850px] mx-auto px-2 sm:px-4 lg:px-6 print:max-w-none print:w-full print:m-0 print:p-0 print:block">
        {/* Navigation Sidebar */}
        <div className="print:hidden">
          <Sidebar
            activeMode={activeMode}
            onSelectMode={handleSelectMode}
            isMaster={isMaster}
            onOpenMaster={() => setIsMasterModalOpen(true)}
            onLogoutMaster={handleLogoutMaster}
            selectedExamsCount={selectedCount}
            onLogoutSystem={handleLogoutSystem}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
        </div>

        {/* Dynamic Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto print:p-0 print:m-0 print:overflow-visible print:w-full print:max-w-none print:block">
          {(activeMode === 'pops-ps' || activeMode === 'pops') && (
            <PopsPsViewer
              onOpenAiWithPrompt={handleOpenAiWithPrompt}
              onGeneratePreGuia={handleGeneratePreGuiaFromPops}
              initialPlanId={selectedPlanForPops}
            />
          )}

          {activeMode === 'pops-internacao' && (
            <PopsInternacaoViewer
              onOpenAiWithPrompt={handleOpenAiWithPrompt}
              onGeneratePreGuia={handleGeneratePreGuiaFromPops}
              initialPlanId={selectedPlanForPops}
            />
          )}

          {activeMode === 'exames' && (
            <ExamValuesViewer
              psExams={psExams}
              amorExams={amorExams}
              labExams={labExams}
              onSaveExams={handleSaveExams}
              onResetExams={handleResetExams}
              isMaster={isMaster}
              selectedExams={selectedExams}
              onToggleSelectExam={handleToggleSelectExam}
              onUpdateExamQuantity={handleUpdateExamQuantity}
              onRemoveExamItem={handleRemoveExamItem}
              onClearSelectedExams={handleClearSelectedExams}
              onOpenMaster={() => setIsMasterModalOpen(true)}
              onNavigateToPreGuia={(primaryConvenio, code, desc) => {
                setPreGuiaPrefill({ convenio: primaryConvenio || 'PARTICULAR', code, desc });
                setActiveMode('pre-guia');
              }}
              initialSearch={examSearchInitial}
            />
          )}

          {activeMode === 'procedimentos' && (
            <ProcedureValuesViewer />
          )}

          {activeMode === 'fluxo-parecer' && (
            <FluxoParecerViewer
              onOpenAiWithPrompt={handleOpenAiWithPrompt}
              initialConvenioId={parecerConvenioInitial}
            />
          )}

          {activeMode === 'plano-contingencia' && (
            <PlanoContingenciaViewer />
          )}

          {activeMode === 'relatorios' && (
            <HospitalReportsViewer
              initialType={relatoriosTypeInitial}
            />
          )}

          {activeMode === 'ramais' && (
            <HospitalExtensionsViewer
              initialSearch={ramaisSearchInitial}
            />
          )}

          {activeMode === 'ai-assistant' && (
            <AiHospitalAssistant
              initialPrompt={aiInitialPrompt}
              onClearInitialPrompt={() => setAiInitialPrompt('')}
            />
          )}

          {activeMode === 'pre-guia' && (
            <PreGuiaGenerator
              initialConvenio={preGuiaPrefill.convenio}
              initialCode={preGuiaPrefill.code}
              initialDesc={preGuiaPrefill.desc}
            />
          )}
        </main>
      </div>

      {/* Medical Kora Saúde Footer */}
      <div className="print:hidden">
        <Footer onNavigateToMode={handleSelectMode} />
      </div>

      {/* Floating AI Help Trigger Button */}
      <div className="fixed bottom-5 right-5 z-40 print:hidden">
        <button
          type="button"
          onClick={() => setIsAiDrawerOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#B01B52] via-[#A7194D] to-[#0E7B86] hover:from-[#971444] hover:to-[#095962] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-2 border-white/70 group"
          title="Clique para tirar dúvidas sobre convênios, códigos TUSS e regras de internação com a IA"
          aria-label="Abrir assistente inteligente para tirar dúvidas"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-xs sm:text-sm font-black tracking-wide text-white drop-shadow-xs">
              Tirar Dúvidas com IA
            </span>
            <span className="text-[10px] text-white/90 font-medium tracking-tight mt-0.5">
              Gemini • Online
            </span>
          </div>
        </button>
      </div>

      {/* Floating AI Chat & Q&A Drawer */}
      <div className="print:hidden">
        <AiChatDrawer
          isOpen={isAiDrawerOpen}
          onClose={() => setIsAiDrawerOpen(false)}
          onOpenFullAi={handleOpenFullAi}
          currentMode={activeMode}
          selectedPlanId={selectedPlanForPops}
          pendingPrompt={aiDrawerPrompt}
          onClearPendingPrompt={() => setAiDrawerPrompt('')}
        />
      </div>

      {/* Universal Search Modal */}
      <div className="print:hidden">
        <UniversalSearchModal
          isOpen={isUniversalSearchOpen}
          onClose={() => setIsUniversalSearchOpen(false)}
          onNavigateToConvenio={handleNavigateToConvenio}
          onNavigateToExames={handleNavigateToExames}
          onNavigateToRamais={handleNavigateToRamais}
          onNavigateToRelatorios={handleNavigateToRelatorios}
          onNavigateToParecer={handleNavigateToParecer}
          onNavigateToContingencia={handleNavigateToContingencia}
          psExams={psExams}
          amorExams={amorExams}
          labExams={labExams}
        />
      </div>

      {/* Smart Rule & Snapshot Drawer */}
      <div className="print:hidden">
        <SmartRuleDrawer
          isOpen={isSmartDrawerOpen}
          onClose={() => setIsSmartDrawerOpen(false)}
          defaultConvenioId={smartDrawerDefaultPlanId || selectedPlanForPops}
          onNavigateToConvenio={handleNavigateToConvenio}
        />
      </div>

      {/* Master Login / Admin Modal */}
      <div className="print:hidden">
        <MasterModal
          isOpen={isMasterModalOpen}
          onClose={() => setIsMasterModalOpen(false)}
          isMaster={isMaster}
          onLoginSuccess={handleLoginMaster}
          onLogout={handleLogoutMaster}
        />
      </div>
    </div>
  );
}
