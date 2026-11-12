import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Phone, 
  PhoneCall, 
  MessageSquare, 
  Search, 
  Printer, 
  AlertTriangle, 
  Stethoscope, 
  Activity, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles,
  Hospital,
  AlertCircle,
  HelpCircle,
  Users,
  Grid,
  List,
  Check,
  Building2,
  Share2,
  FileText,
  UserCheck,
  Sun,
  Moon,
  Sunset,
  Baby
} from 'lucide-react';
import { 
  ESCALAS_INICIAIS, 
  EscalaEspecialidade, 
  EscalaDiaria, 
  PlantonistaContato 
} from '../data/escalasEspecialidadesData';

const STORAGE_KEY = 'hpm_escalas_medicas_novembro_2026_v6';

export const EscalaMedicaViewer: React.FC<{ isMaster?: boolean }> = ({ isMaster = false }) => {
  // Carrega escalas de Novembro/2026 do localStorage se existirem, senão usa as oficiais iniciais
  const [escalasData, setEscalasData] = useState<Record<string, EscalaEspecialidade>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Erro ao ler escalas do localStorage', e);
    }
    return ESCALAS_INICIAIS;
  });

  // Especialidade ativa selecionada (padrão Ginecologia)
  const [activeSpecialty, setActiveSpecialty] = useState<string>('ginecologia');
  // Modo de visualização padronizado: Grade de Calendário ou Tabela Cronológica
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');
  // Busca rápida de médicos
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Dia atual para destaque em tempo real (1 a 30 em Novembro)
  const todayDate = useMemo(() => {
    const d = new Date().getDate();
    return d >= 1 && d <= 30 ? d : 10;
  }, []);

  const [highlightedDay, setHighlightedDay] = useState<number>(todayDate);

  // Modal de edição / atualização mensal de plantonista
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editDiaNumber, setEditDiaNumber] = useState<number>(1);
  const [editDiurno, setEditDiurno] = useState<string>('');
  const [editIntermediario, setEditIntermediario] = useState<string>('');
  const [editNoturno, setEditNoturno] = useState<string>('');
  const [editPlantonista, setEditPlantonista] = useState<string>('');

  const currentEscala: EscalaEspecialidade = escalasData[activeSpecialty] || escalasData.ginecologia || escalasData.vascular;

  // Salvar no localStorage sempre que houver alteração
  const saveEscalas = (newEscalas: Record<string, EscalaEspecialidade>) => {
    setEscalasData(newEscalas);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEscalas));
    } catch (e) {
      console.error('Erro ao salvar escalas no localStorage', e);
    }
  };

  const handleResetToDefault = () => {
    if (confirm(`Restaurar a escala oficial padronizada de ${currentEscala.nome} (Novembro/2026)?`)) {
      const updated = {
        ...escalasData,
        [activeSpecialty]: ESCALAS_INICIAIS[activeSpecialty]
      };
      saveEscalas(updated);
    }
  };

  // Helper para formatar telefone para link de chamada e WhatsApp
  const cleanPhone = (phone: string) => phone.replace(/\D/g, '');
  const formatWhatsappLink = (phone: string, doctorName: string, esp: string) => {
    const num = cleanPhone(phone);
    const fullNum = num.length === 10 || num.length === 11 ? `55${num}` : num;
    const msg = encodeURIComponent(`Olá, ${doctorName}. Contato do Hospital Palmas Medical referente ao plantão de ${esp} (Novembro/2026).`);
    return `https://wa.me/${fullNum}?text=${msg}`;
  };

  // Abre modal de edição para um dia específico
  const handleOpenEditDay = (diaNum: number) => {
    const diaObj = currentEscala.dias.find(d => d.dia === diaNum);
    setEditDiaNumber(diaNum);
    setEditDiurno(diaObj?.turnoDiurno || '');
    setEditIntermediario(diaObj?.turnoIntermediario || '');
    setEditNoturno(diaObj?.turnoNoturno || '');
    setEditPlantonista(diaObj?.plantonista || '');
    setShowEditModal(true);
  };

  const handleSaveDayEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDias = currentEscala.dias.map(d => {
      if (d.dia === editDiaNumber) {
        return {
          ...d,
          turnoDiurno: editDiurno.trim() || undefined,
          turnoIntermediario: editIntermediario.trim() || undefined,
          turnoNoturno: editNoturno.trim() || undefined,
          plantonista: editPlantonista.trim() || undefined
        };
      }
      return d;
    });

    const updated = {
      ...escalasData,
      [activeSpecialty]: {
        ...currentEscala,
        dias: newDias
      }
    };

    saveEscalas(updated);
    setShowEditModal(false);
  };

  // Objeto do dia selecionado
  const diaSelecionadoObj = useMemo(() => {
    return currentEscala.dias.find(d => d.dia === highlightedDay) || currentEscala.dias[0];
  }, [currentEscala, highlightedDay]);

  // Médicos filtrados pela busca
  const filteredPlantonistas = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return currentEscala.plantonistas;
    return currentEscala.plantonistas.filter(p => 
      p.nome.toLowerCase().includes(q) ||
      (p.subArea && p.subArea.toLowerCase().includes(q)) ||
      (p.crm && p.crm.toLowerCase().includes(q)) ||
      p.telefone.includes(q)
    );
  }, [currentEscala, searchTerm]);

  // Lista padronizada das 6 especialidades médicas oficiais
  const specialtyList = [
    {
      id: 'ginecologia',
      nome: 'Ginecologia & Obstetrícia',
      sigla: 'GO',
      badge: 'Sobreaviso & GO HST',
      medicosCount: currentEscala.id === 'ginecologia' ? currentEscala.plantonistas.length : 4,
      icon: Baby,
      corBadge: 'bg-pink-50 text-pink-700 border-pink-200'
    },
    {
      id: 'vascular',
      nome: 'Cirurgia Vascular',
      sigla: 'VASC',
      badge: 'Sobreaviso Rede Kora 24h',
      medicosCount: currentEscala.id === 'vascular' ? currentEscala.plantonistas.length : 6,
      icon: HeartRateIcon,
      corBadge: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      id: 'neurocirurgia',
      nome: 'Neurocirurgia',
      sigla: 'NCIR',
      badge: 'Sobreaviso PS Medical 24h',
      medicosCount: currentEscala.id === 'neurocirurgia' ? currentEscala.plantonistas.length : 3,
      icon: Activity,
      corBadge: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      id: 'neurologia',
      nome: 'Neurologia Clínica',
      sigla: 'NEURO',
      badge: 'Sobreaviso por Ligação',
      medicosCount: currentEscala.id === 'neurologia' ? currentEscala.plantonistas.length : 5,
      icon: PhoneCall,
      corBadge: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'nefrologia',
      nome: 'Nefrologia',
      sigla: 'NEFRO',
      badge: 'Unidade Kora • Hemodiálise',
      medicosCount: currentEscala.id === 'nefrologia' ? currentEscala.plantonistas.length : 6,
      icon: Hospital,
      corBadge: 'bg-sky-50 text-sky-700 border-sky-200'
    },
    {
      id: 'ortopedia',
      nome: 'Ortopedia & Traumatologia',
      sigla: 'ORT',
      badge: 'Presencial 24h • 3 Turnos',
      medicosCount: currentEscala.id === 'ortopedia' ? currentEscala.plantonistas.length : 19,
      icon: Stethoscope,
      corBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ];

  // Helper para buscar o contato de um médico pelo nome (para botão de ligar do card hero)
  const getDoctorContact = (name?: string) => {
    if (!name) return null;
    const clean = name.toLowerCase().replace(/dr\.|dra\./g, '').trim();
    return currentEscala.plantonistas.find(p => {
      const pclean = p.nome.toLowerCase().replace(/dr\.|dra\./g, '').trim();
      return pclean.includes(clean) || clean.includes(pclean);
    });
  };

  // Cálculo dinâmico do deslocamento do 1º dia na grade semanal Seg-Dom
  // Em Novembro/2026, dia 1 é Domingo -> rawDay = 0 -> (0 + 6) % 7 = 6 células vazias
  const calendarLeadingEmptyCells = useMemo(() => {
    const rawDay = new Date(2026, 10, 1).getDay(); // 0 para Domingo
    return (rawDay + 6) % 7;
  }, []);

  return (
    <div className="space-y-6">
      {/* =========================================================================
          IMPRESSÃO A4 PADRONIZADA (DOCUMENTO OFICIAL HOSPITAL PALMAS MEDICAL)
          ========================================================================= */}
      <div id="print-escala-container" className="hidden print:block font-sans text-slate-900 w-full m-0 p-0 text-[10pt]">
        <div className="border-b-2 border-slate-900 pb-2.5 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#0E7B86] text-white flex items-center justify-center font-black text-2xl">
              ✚
            </div>
            <div>
              <h1 className="text-xl font-black text-[#B01B52] leading-tight m-0">
                HOSPITAL PALMAS MEDICAL CENTER • KORA SAÚDE
              </h1>
              <p className="text-xs text-slate-800 font-black m-0 uppercase tracking-wide">
                ESCALA MÉDICA OFICIAL • {currentEscala.nome.toUpperCase()}
              </p>
              <p className="text-[9pt] text-slate-600 m-0">
                Mês de Vigência: <strong>{currentEscala.mes} / {currentEscala.ano}</strong> (30 dias) • Regime: <strong>{currentEscala.tipoPlantao}</strong>
              </p>
            </div>
          </div>
          <div className="text-right text-xs">
            <div className="font-mono font-bold text-slate-900">EMERGÊNCIA: (63) 3236-1800</div>
            <div className="font-mono text-slate-700">PABX GERAL: (63) 3236-1818</div>
            <div className="text-[8pt] text-slate-500">Palmas - TO</div>
          </div>
        </div>

        <table className="w-full border-collapse border border-slate-800 text-[9pt]">
          <thead>
            <tr className="bg-slate-900 text-white font-bold">
              <th className="border border-slate-800 p-1.5 text-center w-12">Dia</th>
              <th className="border border-slate-800 p-1.5 text-left w-28">Dia da Semana</th>
              {activeSpecialty === 'ortopedia' ? (
                <>
                  <th className="border border-slate-800 p-1.5 text-left">Turno Diurno (07h às 19h)</th>
                  <th className="border border-slate-800 p-1.5 text-left">Turno Intermediário (19h às 22h)</th>
                  <th className="border border-slate-800 p-1.5 text-left">Turno Noturno (22h às 07h)</th>
                </>
              ) : (
                <th className="border border-slate-800 p-1.5 text-left">Médico Plantonista / Sobreaviso 24h</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentEscala.dias.map(d => (
              <tr key={d.dia} className="border-b border-slate-300">
                <td className="border border-slate-400 p-1 text-center font-bold">{d.dia}</td>
                <td className="border border-slate-400 p-1 text-slate-800">{d.diaSemana}</td>
                {activeSpecialty === 'ortopedia' ? (
                  <>
                    <td className="border border-slate-400 p-1 font-bold text-emerald-950">{d.turnoDiurno}</td>
                    <td className="border border-slate-400 p-1 font-bold text-amber-950">{d.turnoIntermediario}</td>
                    <td className="border border-slate-400 p-1 font-bold text-blue-950">{d.turnoNoturno}</td>
                  </>
                ) : (
                  <td className="border border-slate-400 p-1 font-bold">
                    <span>{d.plantonista}</span>
                    {d.observacaoDia && (
                      <span className="text-[7.5pt] ml-2 text-slate-500 font-normal">({d.observacaoDia})</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Rodapé Padronizado da Folha A4 */}
        <div className="mt-3.5 pt-2 border-t-2 border-slate-800 text-[8pt]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong className="text-slate-900 uppercase">Equipe Médica & Telefones:</strong>
              <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-1 font-mono text-[7.5pt]">
                {currentEscala.plantonistas.map(p => (
                  <div key={p.id}>• {p.nome}: {p.telefone}</div>
                ))}
              </div>
            </div>
            <div className="text-right flex flex-col justify-between">
              {currentEscala.responsavelTecnico && (
                <div>
                  <strong className="text-slate-900 uppercase">Responsável Técnico / Coordenação:</strong>
                  <div className="text-[8pt] text-slate-700">{currentEscala.responsavelTecnico}</div>
                </div>
              )}
              <div className="mt-4 border-t border-slate-400 pt-1 text-[7.5pt] text-slate-500 text-center">
                Hospital Palmas Medical Center • Vigência: Novembro/2026
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SISTEMA INTERATIVO COM MODELO PADRONIZADO (UI MODERNA & TECNOLÓGICA)
          ========================================================================= */}
      <div className="print:hidden space-y-6">

        {/* 1. CABEÇALHO PADRONIZADO INSTITUCIONAL */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-700/80 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-[#0E7B86]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-black uppercase tracking-wider">
                  Escalas Oficiais de Novembro
                </span>
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">•</span>
                <span className="text-xs text-slate-300 font-medium">
                  Hospital Palmas Medical Center • Kora Saúde
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0E7B86] to-[#4FD1C5] text-white flex items-center justify-center shadow-md">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span>Escalas Médicas Especializadas</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl font-normal leading-relaxed">
                Ambiente hospitalar unificado e padronizado para controle dos plantões presenciais 24h, turnos diários e sobreavisos médicos da unidade (Novembro/2026).
              </p>
            </div>

            {/* Metadados e Ações Globais */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-800/90 border border-slate-700/90 rounded-2xl p-3 px-4 flex flex-col justify-center shadow-inner">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Mês Vigente</span>
                <span className="text-base font-black text-[#4FD1C5] font-mono tracking-tight">NOVEMBRO / 2026</span>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-[#B01B52] hover:bg-[#971444] text-white px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                title="Imprimir folha A4 oficial padronizada"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Escala A4</span>
              </button>

              {isMaster && (
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3.5 py-3 rounded-2xl text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                  title="Restaurar escala padrão de fábrica"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. SELETOR PADRONIZADO DE ESPECIALIDADES MÉDICAS (6 ESPECIALIDADES CADASTRADAS) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#0E7B86]" />
              <span>Selecione a Especialidade Médica</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              6 Especialidades Oficiais (Novembro/2026)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {specialtyList.map(item => {
              const IconComponent = item.icon;
              const isSelected = activeSpecialty === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveSpecialty(item.id);
                    setSearchTerm('');
                  }}
                  className={`text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-[#0E7B86] shadow-md ring-2 ring-[#0E7B86]/20'
                      : 'bg-white/90 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-7 h-7 bg-[#0E7B86] text-white flex items-center justify-center rounded-bl-xl shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'bg-[#0E7B86] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="pr-3 flex-1 min-w-0">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">
                        {item.sigla}
                      </span>
                      <h3 className={`text-xs sm:text-sm font-black leading-snug truncate ${
                        isSelected ? 'text-[#0E7B86]' : 'text-slate-900'
                      }`}>
                        {item.nome}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-bold">
                      {item.medicosCount} médicos
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg font-black text-[10px] border ${item.corBadge}`}>
                      {item.badge.split('•')[0].trim()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. HERO PADRONIZADO: PLANTONISTA ESCALADO NO DIA & NAVEGAÇÃO TEMPORAL */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-slate-100">
            {/* Navegador de Dias */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0E7B86] to-[#095962] text-white flex flex-col items-center justify-center shadow-md flex-shrink-0">
                <span className="text-[10px] uppercase font-black tracking-wider text-teal-200">NOV</span>
                <span className="text-xl font-black leading-none">{highlightedDay}</span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    Plantonista Escalado para o Dia:
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-teal-50 text-[#0E7B86] font-mono text-[11px] font-black border border-teal-200">
                    {String(highlightedDay).padStart(2, '0')}/11/2026 ({diaSelecionadoObj.diaSemana})
                  </span>
                  {diaSelecionadoObj.observacaoDia && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                      {diaSelecionadoObj.observacaoDia}
                    </span>
                  )}
                  {highlightedDay === todayDate && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                      Hoje
                    </span>
                  )}
                </div>

                <div className="text-xl sm:text-2xl font-black text-[#0E7B86] mt-1 flex flex-wrap items-center gap-2">
                  <span>{currentEscala.nome}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                    {currentEscala.tipoPlantao}
                  </span>
                </div>
              </div>
            </div>

            {/* Controles de Navegação Entre Dias (1 a 30) */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setHighlightedDay(prev => Math.max(1, prev - 1))}
                disabled={highlightedDay <= 1}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold disabled:opacity-40 transition-colors cursor-pointer"
                title="Dia anterior"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <button
                type="button"
                onClick={() => setHighlightedDay(todayDate)}
                className={`px-3 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                  highlightedDay === todayDate
                    ? 'bg-[#0E7B86] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Hoje ({todayDate}/11)
              </button>

              <button
                type="button"
                onClick={() => setHighlightedDay(prev => Math.min(30, prev + 1))}
                disabled={highlightedDay >= 30}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold disabled:opacity-40 transition-colors cursor-pointer"
                title="Próximo dia"
              >
                <span>Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleOpenEditDay(highlightedDay)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0E7B86]/10 text-[#0E7B86] hover:bg-[#0E7B86]/20 text-xs font-bold border border-[#0E7B86]/30 transition-colors cursor-pointer ml-1"
                title="Editar médicos deste dia"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Dia {highlightedDay}</span>
              </button>
            </div>
          </div>

          {/* Cards dos Médicos do Dia Selecionado */}
          <div className="mt-5">
            {activeSpecialty === 'ortopedia' ? (
              /* Turnos de Ortopedia (3 Turnos Padronizados) */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Diurno */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-1">
                      <span className="flex items-center gap-1.5 uppercase tracking-wide">
                        <Sun className="w-4 h-4 text-emerald-600" />
                        Turno Diurno
                      </span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                        07h às 19h
                      </span>
                    </div>
                    <div className="text-base sm:text-lg font-black text-emerald-950 mt-2">
                      {diaSelecionadoObj.turnoDiurno || 'Não informado'}
                    </div>
                  </div>
                  {diaSelecionadoObj.turnoDiurno && (
                    <div className="mt-4 pt-3 border-t border-emerald-200 flex items-center gap-2">
                      {getDoctorContact(diaSelecionadoObj.turnoDiurno)?.telefone ? (
                        <>
                          <a
                            href={`tel:${cleanPhone(getDoctorContact(diaSelecionadoObj.turnoDiurno)!.telefone)}`}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Ligar</span>
                          </a>
                          <a
                            href={formatWhatsappLink(
                              getDoctorContact(diaSelecionadoObj.turnoDiurno)!.telefone,
                              diaSelecionadoObj.turnoDiurno,
                              currentEscala.nome
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold p-2 px-3 rounded-xl transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-mono">
                          Plantão Presencial Confirmado
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Intermediário */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-amber-800 mb-1">
                      <span className="flex items-center gap-1.5 uppercase tracking-wide">
                        <Sunset className="w-4 h-4 text-amber-600" />
                        Turno Intermediário
                      </span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-amber-200">
                        19h às 22h
                      </span>
                    </div>
                    <div className="text-base sm:text-lg font-black text-amber-950 mt-2">
                      {diaSelecionadoObj.turnoIntermediario || 'Não informado'}
                    </div>
                  </div>
                  {diaSelecionadoObj.turnoIntermediario && (
                    <div className="mt-4 pt-3 border-t border-amber-200 flex items-center gap-2">
                      {getDoctorContact(diaSelecionadoObj.turnoIntermediario)?.telefone ? (
                        <>
                          <a
                            href={`tel:${cleanPhone(getDoctorContact(diaSelecionadoObj.turnoIntermediario)!.telefone)}`}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Ligar</span>
                          </a>
                          <a
                            href={formatWhatsappLink(
                              getDoctorContact(diaSelecionadoObj.turnoIntermediario)!.telefone,
                              diaSelecionadoObj.turnoIntermediario,
                              currentEscala.nome
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold p-2 px-3 rounded-xl transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </>
                      ) : (
                        <span className="text-[11px] text-amber-700 font-mono">
                          Reforço Noturno
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Noturno */}
                <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-blue-800 mb-1">
                      <span className="flex items-center gap-1.5 uppercase tracking-wide">
                        <Moon className="w-4 h-4 text-blue-600" />
                        Turno Noturno
                      </span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-blue-200">
                        22h às 07h
                      </span>
                    </div>
                    <div className="text-base sm:text-lg font-black text-blue-950 mt-2">
                      {diaSelecionadoObj.turnoNoturno || 'Não informado'}
                    </div>
                  </div>
                  {diaSelecionadoObj.turnoNoturno && (
                    <div className="mt-4 pt-3 border-t border-blue-200 flex items-center gap-2">
                      {getDoctorContact(diaSelecionadoObj.turnoNoturno)?.telefone ? (
                        <>
                          <a
                            href={`tel:${cleanPhone(getDoctorContact(diaSelecionadoObj.turnoNoturno)!.telefone)}`}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Ligar</span>
                          </a>
                          <a
                            href={formatWhatsappLink(
                              getDoctorContact(diaSelecionadoObj.turnoNoturno)!.telefone,
                              diaSelecionadoObj.turnoNoturno,
                              currentEscala.nome
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-bold p-2 px-3 rounded-xl transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </>
                      ) : (
                        <span className="text-[11px] text-blue-700 font-mono">
                          Plantão Noturno
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Sobreaviso 24h Padronizado (Ginecologia, Neurocirurgia, Vascular, Nefrologia, Neurologia) */
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0E7B86] flex items-center justify-center border border-teal-200 shadow-xs flex-shrink-0">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs uppercase font-black text-slate-400 tracking-wider">
                        Médico Escalado no Dia ({String(highlightedDay).padStart(2, '0')}/11)
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[11px] font-black">
                        Disponível
                      </span>
                      {diaSelecionadoObj.observacaoDia && (
                        <span className="text-xs font-bold text-amber-700">
                          • {diaSelecionadoObj.observacaoDia}
                        </span>
                      )}
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                      {diaSelecionadoObj.plantonista || 'Sem Plantonista Definido'}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-xl bg-teal-100/90 text-[#0E7B86] font-black text-sm border border-teal-300 shadow-2xs">
                        {getDoctorContact(diaSelecionadoObj.plantonista)?.subArea || currentEscala.nome}
                      </span>
                      {getDoctorContact(diaSelecionadoObj.plantonista)?.crm && (
                        <span className="text-xs sm:text-sm text-slate-600 font-mono font-bold">
                          {getDoctorContact(diaSelecionadoObj.plantonista)!.crm}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {getDoctorContact(diaSelecionadoObj.plantonista)?.telefone ? (
                    <>
                      <a
                        href={`tel:${cleanPhone(getDoctorContact(diaSelecionadoObj.plantonista)!.telefone)}`}
                        className="flex items-center gap-2 bg-[#0E7B86] hover:bg-[#095962] text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Acionar por Ligação</span>
                      </a>
                      <a
                        href={formatWhatsappLink(
                          getDoctorContact(diaSelecionadoObj.plantonista)!.telefone,
                          diaSelecionadoObj.plantonista || '',
                          currentEscala.nome
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </a>
                    </>
                  ) : (
                    <div className="text-xs text-slate-500 font-medium">
                      Contato geral pela recepção / PS: (63) 3236-1818
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. VISUALIZADOR PRINCIPAL PADRONIZADO: COMUTADOR ENTRE GRADE MENSAL E TABELA CRONOLÓGICA */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          {/* Barra de Ferramentas Superior */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#0E7B86]" />
                <span>Escala Oficial de {currentEscala.nome}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Novembro / 2026 • 30 dias cadastrados • Regime: {currentEscala.tipoPlantao}
              </p>
            </div>

            {/* Alternador de Modo de Visualização */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'calendar'
                    ? 'bg-white text-[#0E7B86] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grade de Calendário</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-[#0E7B86] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Tabela Cronológica</span>
              </button>
            </div>
          </div>

          {/* MODO 1: GRADE DE CALENDÁRIO PADRONIZADA (1 a 30) */}
          {viewMode === 'calendar' && (
            <div className="space-y-3">
              {/* Cabeçalho dos Dias da Semana */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((diaNome, idx) => (
                  <div 
                    key={diaNome} 
                    className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider ${
                      idx >= 5 
                        ? 'bg-rose-50 text-rose-700' 
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {diaNome}
                  </div>
                ))}
              </div>

              {/* Grid dos Dias do Mês (Novembro/2026 começa no Domingo com 6 células vazias) */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {Array.from({ length: calendarLeadingEmptyCells }).map((_, i) => (
                  <div 
                    key={`empty-${i}`} 
                    className="h-28 sm:h-32 rounded-2xl bg-slate-50/60 border border-dashed border-slate-200 hidden sm:block"
                  />
                ))}

                {currentEscala.dias.map(d => {
                  const isSelected = d.dia === highlightedDay;
                  const isToday = d.dia === todayDate;
                  const isWeekend = d.diaSemana === 'Sábado' || d.diaSemana === 'Domingo';

                  return (
                    <div
                      key={d.dia}
                      onClick={() => setHighlightedDay(d.dia)}
                      className={`min-h-[110px] sm:min-h-[125px] p-2 sm:p-2.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'border-[#0E7B86] bg-teal-50/30 shadow-md ring-2 ring-[#0E7B86]/20'
                          : isToday
                          ? 'border-emerald-500 bg-emerald-50/20'
                          : isWeekend
                          ? 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Topo do Card do Dia */}
                      <div className="flex items-center justify-between">
                        <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center font-mono ${
                          isSelected
                            ? 'bg-[#0E7B86] text-white'
                            : isToday
                            ? 'bg-emerald-500 text-white'
                            : isWeekend
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {d.dia}
                        </span>

                        <div className="flex items-center gap-1">
                          {d.observacaoDia && (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800" title={d.observacaoDia}>
                              Feriado
                            </span>
                          )}
                          {isToday && (
                            <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                              Hoje
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Conteúdo do Plantonista no Dia */}
                      <div className="my-1.5 flex-1 flex flex-col justify-center">
                        {activeSpecialty === 'ortopedia' ? (
                          <div className="space-y-1 text-[10px] font-bold">
                            <div className="text-emerald-700 line-clamp-1" title={`Diurno: ${d.turnoDiurno}`}>
                              ☀️ {d.turnoDiurno?.replace('Dr. ', '').replace('Dra. ', '')}
                            </div>
                            <div className="text-amber-700 line-clamp-1" title={`Intermediário: ${d.turnoIntermediario}`}>
                              🌆 {d.turnoIntermediario?.replace('Dr. ', '').replace('Dra. ', '')}
                            </div>
                            <div className="text-blue-700 line-clamp-1" title={`Noturno: ${d.turnoNoturno}`}>
                              🌙 {d.turnoNoturno?.replace('Dr. ', '').replace('Dra. ', '')}
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px] font-bold text-slate-900 line-clamp-2 leading-tight">
                            {d.plantonista}
                          </div>
                        )}
                      </div>

                      {/* Botão sutil de editar ao hover */}
                      <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="truncate">{d.diaSemana.split('-')[0]}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditDay(d.dia);
                          }}
                          className="opacity-0 group-hover:opacity-100 hover:text-[#0E7B86] transition-opacity p-0.5"
                          title="Editar escala deste dia"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODO 2: TABELA CRONOLÓGICA PADRONIZADA (1 a 30) */}
          {viewMode === 'table' && (
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-black text-[11px]">
                    <th className="p-3 text-center border-r border-slate-800 w-16">DATA</th>
                    <th className="p-3 border-r border-slate-800 w-32">DIA DA SEMANA</th>
                    {activeSpecialty === 'ortopedia' ? (
                      <>
                        <th className="p-3 border-r border-slate-800 bg-emerald-950/70 text-emerald-300">07h às 19h (Diurno)</th>
                        <th className="p-3 border-r border-slate-800 bg-amber-950/70 text-amber-300">19h às 22h</th>
                        <th className="p-3 border-r border-slate-800 bg-blue-950/70 text-blue-300">22h às 07h (Noturno)</th>
                      </>
                    ) : (
                      <th className="p-3 border-r border-slate-800">MÉDICO PLANTONISTA / SOBREAVISO</th>
                    )}
                    <th className="p-3 text-center w-28">AÇÃO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {currentEscala.dias.map(d => {
                    const isSelected = d.dia === highlightedDay;
                    const isToday = d.dia === todayDate;

                    return (
                      <tr
                        key={d.dia}
                        onClick={() => setHighlightedDay(d.dia)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-teal-50 font-bold'
                            : isToday
                            ? 'bg-emerald-50/50'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-3 text-center font-mono font-bold border-r border-slate-200">
                          <span className={`px-2 py-0.5 rounded-md ${
                            isToday ? 'bg-emerald-500 text-white' : 'text-slate-800'
                          }`}>
                            {String(d.dia).padStart(2, '0')}/11
                          </span>
                        </td>
                        <td className="p-3 text-slate-700 border-r border-slate-200">
                          {d.diaSemana}
                          {d.observacaoDia && (
                            <span className="block text-[10px] text-amber-700 font-bold">
                              {d.observacaoDia}
                            </span>
                          )}
                        </td>
                        {activeSpecialty === 'ortopedia' ? (
                          <>
                            <td className="p-3 font-bold text-emerald-900 border-r border-slate-200">
                              {d.turnoDiurno}
                            </td>
                            <td className="p-3 font-bold text-amber-900 border-r border-slate-200">
                              {d.turnoIntermediario}
                            </td>
                            <td className="p-3 font-bold text-blue-900 border-r border-slate-200">
                              {d.turnoNoturno}
                            </td>
                          </>
                        ) : (
                          <td className="p-3 font-bold text-slate-900 border-r border-slate-200">
                            {d.plantonista}
                          </td>
                        )}
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditDay(d.dia);
                            }}
                            className="p-1 px-2.5 rounded-lg bg-slate-100 hover:bg-[#0E7B86] hover:text-white text-slate-600 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 5. DIRETÓRIO PADRONIZADO DA EQUIPE MÉDICA (CONTATOS E ACIONAMENTO) */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0E7B86]" />
                <span>Corpo Clínico & Contatos • {currentEscala.nome}</span>
              </h3>
              <p className="text-xs text-slate-500">
                Lista padronizada de médicos especialistas para acionamento e sobreaviso hospitalar (Novembro/2026)
              </p>
            </div>

            {/* Campo de Busca Rápida Padronizado */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, CRM ou área..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E7B86]"
              />
            </div>
          </div>

          {/* Grid Padronizado de Especialistas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredPlantonistas.map(medico => (
              <div 
                key={medico.id}
                className="p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-[#0E7B86] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-teal-100 text-[#0E7B86] font-black text-sm flex items-center justify-center flex-shrink-0 shadow-2xs">
                        {medico.nome.replace(/Dr\.|Dra\./g, '').trim().substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug truncate">
                          {medico.nome}
                        </h4>
                        
                        {/* ESPECIALIDADE / SUBESPECIALIDADE COM FONTE BEM VISÍVEL E DESTAQUE */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-teal-50 text-[#0E7B86] font-black text-xs sm:text-[13px] border border-teal-200 tracking-tight shadow-2xs">
                            {medico.subArea || currentEscala.nome}
                          </span>
                          <span className="text-xs text-slate-500 font-mono font-bold">
                            {medico.crm ? medico.crm : 'CRM Ativo'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={`tel:${cleanPhone(medico.telefone)}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-[13px] font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#0E7B86]" />
                    <span className="truncate">{medico.telefone}</span>
                  </a>
                  <a
                    href={formatWhatsappLink(medico.telefone, medico.nome, currentEscala.nome)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs sm:text-[13px] font-bold transition-colors flex items-center gap-1.5"
                    title="Conversar no WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. NORMAS TÉCNICAS & PROTOCOLO DE ACIONAMENTO PADRONIZADO */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-md">
          <div className="flex items-center gap-2.5 mb-3">
            <ShieldCheck className="w-5 h-5 text-[#4FD1C5]" />
            <h3 className="text-sm sm:text-base font-black tracking-tight text-white uppercase">
              Diretrizes & Protocolo de Acionamento do Hospital Palmas Medical Center
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
              <span className="text-[10px] uppercase font-black text-[#4FD1C5] block mb-1">
                1. Acionamento do Sobreaviso
              </span>
              <p className="leading-relaxed">
                O acionamento deve ocorrer <strong>exclusivamente por ligação telefônica</strong> confirmada pelo profissional, garantindo tempo de resposta seguro e assistência imediata.
              </p>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
              <span className="text-[10px] uppercase font-black text-[#4FD1C5] block mb-1">
                2. Fluxo de Pareceres e Centro Cirúrgico
              </span>
              <p className="leading-relaxed">
                Casos cirúrgicos e pareceres de urgência/UTI devem ser protocolados no sistema hospitalar e reportados na central médica de apoio.
              </p>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
              <span className="text-[10px] uppercase font-black text-[#4FD1C5] block mb-1">
                3. Responsável Técnico & Contatos
              </span>
              <p className="leading-relaxed font-mono text-[11px]">
                {currentEscala.responsavelTecnico || 'Coordenação Médica Hospital Palmas Medical'}<br />
                PABX Geral: (63) 3236-1818<br />
                Emergência PS: (63) 3236-1800
              </p>
            </div>
          </div>
        </div>

        {/* 7. MODAL PADRONIZADO DE ATUALIZAÇÃO MENSAL DE PLANTÃO */}
        {showEditModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#0E7B86] text-white flex items-center justify-center font-black">
                    {editDiaNumber}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      Editar Plantão • Dia {editDiaNumber}/11/2026
                    </h4>
                    <p className="text-[11px] text-slate-500">{currentEscala.nome}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveDayEdit} className="mt-4 space-y-3.5">
                {activeSpecialty === 'ortopedia' ? (
                  <>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Turno Diurno (07h às 19h):
                      </label>
                      <input
                        type="text"
                        value={editDiurno}
                        onChange={e => setEditDiurno(e.target.value)}
                        placeholder="Nome do plantonista diurno..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E7B86]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Turno Intermediário (19h às 22h):
                      </label>
                      <input
                        type="text"
                        value={editIntermediario}
                        onChange={e => setEditIntermediario(e.target.value)}
                        placeholder="Nome do plantonista intermediário..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E7B86]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Turno Noturno (22h às 07h):
                      </label>
                      <input
                        type="text"
                        value={editNoturno}
                        onChange={e => setEditNoturno(e.target.value)}
                        placeholder="Nome do plantonista noturno..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E7B86]"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Médico Plantonista / Sobreaviso 24h:
                    </label>
                    <input
                      type="text"
                      value={editPlantonista}
                      onChange={e => setEditPlantonista(e.target.value)}
                      placeholder="Nome do médico..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E7B86]"
                    />
                    <div className="mt-2 text-[11px] text-slate-500">
                      Sugestões da equipe:
                      <div className="flex flex-wrap gap-1 mt-1">
                        {currentEscala.plantonistas.map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setEditPlantonista(p.nome)}
                            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-teal-50 hover:text-[#0E7B86] text-slate-700 text-[10px] font-semibold transition-colors cursor-pointer"
                          >
                            {p.nome}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 bg-[#0E7B86] hover:bg-[#095962] text-white rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer"
                  >
                    Salvar Alteração
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Ícone Vascular Padronizado
function HeartRateIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
