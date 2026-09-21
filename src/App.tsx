import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { PopsPsViewer } from './components/PopsPsViewer';
import { PopsInternacaoViewer } from './components/PopsInternacaoViewer';
import { ExamValuesViewer } from './components/ExamValuesViewer';
import { ProcedureValuesViewer } from './components/ProcedureValuesViewer';
import { HospitalReportsViewer } from './components/HospitalReportsViewer';
import { HospitalExtensionsViewer } from './components/HospitalExtensionsViewer';
import { AiHospitalAssistant } from './components/AiHospitalAssistant';
import { PreGuiaGenerator } from './components/PreGuiaGenerator';
import { MasterModal } from './components/MasterModal';
import { UniversalSearchModal } from './components/UniversalSearchModal';
import { SmartRuleDrawer } from './components/SmartRuleDrawer';
import { Footer } from './components/Footer';

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
  setMasterSession
} from './services/storageService';

export default function App() {
  const [activeMode, setActiveMode] = useState<AppMode>('pops-ps');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [isMaster, setIsMaster] = useState<boolean>(() => isMasterLoggedIn());
  const [isMasterModalOpen, setIsMasterModalOpen] = useState<boolean>(false);

  // Universal Search & Smart Drawer Modals
  const [isUniversalSearchOpen, setIsUniversalSearchOpen] = useState<boolean>(false);
  const [isSmartDrawerOpen, setIsSmartDrawerOpen] = useState<boolean>(false);
  const [smartDrawerDefaultPlanId, setSmartDrawerDefaultPlanId] = useState<string>('AMIL');

  // Navigation target states (defaults to empty so user sees the clean grid of plans)
  const [selectedPlanForPops, setSelectedPlanForPops] = useState<string>('');
  const [examSearchInitial, setExamSearchInitial] = useState<string>('');
  const [ramaisSearchInitial, setRamaisSearchInitial] = useState<string>('');
  const [relatoriosTypeInitial, setRelatoriosTypeInitial] = useState<'PARTICULAR' | 'URGÊNCIA' | 'ELETIVO'>('URGÊNCIA');

  // Exams datasets
  const [psExams, setPsExams] = useState<ExamRow[]>(() => loadPsExams());
  const [amorExams, setAmorExams] = useState<ExamRow[]>(() => loadAmorExams());
  const [labExams, setLabExams] = useState<ExamRow[]>(() => loadLabExams());

  // Selected exams in calculation cart
  const [selectedExams, setSelectedExams] = useState<{ [key: string]: SelectedExamItem }>({});

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
    setAiInitialPrompt(prompt);
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

  const handleSelectMode = (mode: AppMode) => {
    if (mode === 'pops-ps' || mode === 'pops-internacao' || mode === 'pops') {
      setSelectedPlanForPops('');
    }
    setActiveMode(mode);
  };

  const selectedCount = Object.keys(selectedExams).length;

  return (
    <div className="min-h-screen bg-[#F4F8F9] text-slate-900 flex flex-col font-sans selection:bg-[#B01B52] selection:text-white">
      {/* Top Header */}
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
      />

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          activeMode={activeMode}
          onSelectMode={handleSelectMode}
          isMaster={isMaster}
          onOpenMaster={() => setIsMasterModalOpen(true)}
          onLogoutMaster={handleLogoutMaster}
          selectedExamsCount={selectedCount}
        />

        {/* Dynamic Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
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
      <Footer onNavigateToMode={handleSelectMode} />

      {/* Universal Search Modal */}
      <UniversalSearchModal
        isOpen={isUniversalSearchOpen}
        onClose={() => setIsUniversalSearchOpen(false)}
        onNavigateToConvenio={handleNavigateToConvenio}
        onNavigateToExames={handleNavigateToExames}
        onNavigateToRamais={handleNavigateToRamais}
        onNavigateToRelatorios={handleNavigateToRelatorios}
        psExams={psExams}
        amorExams={amorExams}
        labExams={labExams}
      />

      {/* Smart Rule & Snapshot Drawer */}
      <SmartRuleDrawer
        isOpen={isSmartDrawerOpen}
        onClose={() => setIsSmartDrawerOpen(false)}
        defaultConvenioId={smartDrawerDefaultPlanId || selectedPlanForPops}
        onNavigateToConvenio={handleNavigateToConvenio}
      />

      {/* Master Login / Admin Modal */}
      <MasterModal
        isOpen={isMasterModalOpen}
        onClose={() => setIsMasterModalOpen(false)}
        isMaster={isMaster}
        onLoginSuccess={handleLoginMaster}
        onLogout={handleLogoutMaster}
      />
    </div>
  );
}
