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
  HelpCircle
} from 'lucide-react';
import { 
  ESCALAS_INICIAIS, 
  EscalaEspecialidade, 
  EscalaDiaria, 
  PlantonistaContato 
} from '../data/escalasEspecialidadesData';

const STORAGE_KEY = 'hpm_escalas_medicas_especialidade_v2';

export const EscalaMedicaViewer: React.FC<{ isMaster?: boolean }> = ({ isMaster = false }) => {
  // Carrega escalas do localStorage se existirem, senão usa as oficiais iniciais
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

  // NÃO há escala geral: o usuário escolhe especificamente a especialidade desejada
  const [activeSpecialty, setActiveSpecialty] = useState<string>('ortopedia');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Dia atual para destaque em tempo real
  const todayDate = useMemo(() => {
    const d = new Date().getDate();
    return d >= 1 && d <= 31 ? d : 24;
  }, []);

  const [highlightedDay, setHighlightedDay] = useState<number>(todayDate);

  // Modal de edição / atualização mensal de plantonista
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editDiaNumber, setEditDiaNumber] = useState<number>(1);
  const [editDiurno, setEditDiurno] = useState<string>('');
  const [editIntermediario, setEditIntermediario] = useState<string>('');
  const [editNoturno, setEditNoturno] = useState<string>('');
  const [editPlantonista, setEditPlantonista] = useState<string>('');

  const currentEscala: EscalaEspecialidade = escalasData[activeSpecialty] || escalasData.ortopedia;

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
    if (confirm(`Restaurar a escala oficial de fábrica de ${currentEscala.nome} (Outubro/2026)?`)) {
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
    const msg = encodeURIComponent(`Olá, ${doctorName}. Contato do Hospital Palmas Medical referente ao plantão de ${esp}.`);
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

  // Plantonista de HOJE na especialidade selecionada
  const plantonistaHoje = useMemo(() => {
    const diaObj = currentEscala.dias.find(d => d.dia === highlightedDay);
    if (!diaObj) return null;
    return diaObj;
  }, [currentEscala, highlightedDay]);

  // Médicos filtrados pela busca
  const filteredPlantonistas = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return currentEscala.plantonistas;
    return currentEscala.plantonistas.filter(p => 
      p.nome.toLowerCase().includes(q) ||
      (p.subArea && p.subArea.toLowerCase().includes(q)) ||
      p.telefone.includes(q)
    );
  }, [currentEscala, searchTerm]);

  // Lista dos 5 cartões de especialidades para o seletor tecnológico
  const specialtyList = [
    {
      id: 'ortopedia',
      nome: 'Ortopedia & Traumatologia',
      badge: 'Plantão 24h • 3 Turnos',
      medicosCount: 19,
      icon: Stethoscope,
      accent: 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
    },
    {
      id: 'neurocirurgia',
      nome: 'Neurocirurgia',
      badge: 'Sobreaviso PS Medical',
      medicosCount: 3,
      icon: Activity,
      accent: 'border-purple-500 bg-purple-500/10 text-purple-400'
    },
    {
      id: 'vascular',
      nome: 'Cirurgia Vascular',
      badge: 'Sobreaviso Rede Kora',
      medicosCount: 6,
      icon: HeartRateIcon,
      accent: 'border-rose-500 bg-rose-500/10 text-rose-400'
    },
    {
      id: 'nefrologia',
      nome: 'Nefrologia',
      badge: 'Hemodiálise & Pareceres',
      medicosCount: 6,
      icon: Hospital,
      accent: 'border-sky-500 bg-sky-500/10 text-sky-400'
    },
    {
      id: 'neurologia',
      nome: 'Neurologia Clínica',
      badge: 'Sobreaviso • Ligação',
      medicosCount: 5,
      icon: PhoneCall,
      accent: 'border-amber-500 bg-amber-500/10 text-amber-400'
    }
  ];

  return (
    <div className="space-y-5">
      {/* =========================================================================
          IMPRESSÃO A4 ESPECÍFICA DA ESPECIALIDADE SELECIONADA
          ========================================================================= */}
      <div id="print-escala-container" className="hidden print:block font-sans text-slate-900 w-full m-0 p-0 text-[10.5pt]">
        <div className="border-b-2 border-slate-900 pb-2 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0E7B86] text-white flex items-center justify-center font-black text-2xl">
              ✚
            </div>
            <div>
              <h1 className="text-lg font-black text-[#B01B52] leading-tight m-0">
                HOSPITAL PALMAS MEDICAL CENTER
              </h1>
              <p className="text-xs text-slate-700 font-bold m-0 uppercase">
                ESCALA MÉDICA OFICIAL • {currentEscala.nome} • {currentEscala.mes} / {currentEscala.ano}
              </p>
            </div>
          </div>
          <div className="text-right text-xs">
            <div className="font-mono font-bold text-slate-900">PABX: (63) 3236-1818</div>
            <div className="text-slate-500">Urgência & Emergência 24h</div>
          </div>
        </div>

        <table className="w-full border-collapse border border-slate-800 text-[9.5pt]">
          <thead>
            <tr className="bg-slate-900 text-white font-bold">
              <th className="border border-slate-800 p-1.5 text-center w-12">Dia</th>
              <th className="border border-slate-800 p-1.5 text-left w-28">Dia da Semana</th>
              {activeSpecialty === 'ortopedia' ? (
                <>
                  <th className="border border-slate-800 p-1.5 text-left">07h às 19h (Diurno)</th>
                  <th className="border border-slate-800 p-1.5 text-left">19h às 22h</th>
                  <th className="border border-slate-800 p-1.5 text-left">22h às 07h (Noturno)</th>
                </>
              ) : (
                <th className="border border-slate-800 p-1.5 text-left">Médico Plantonista / Sobreaviso</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentEscala.dias.map(d => (
              <tr key={d.dia} className="border-b border-slate-300">
                <td className="border border-slate-400 p-1 text-center font-bold">{d.dia}</td>
                <td className="border border-slate-400 p-1">{d.diaSemana}</td>
                {activeSpecialty === 'ortopedia' ? (
                  <>
                    <td className="border border-slate-400 p-1 font-bold text-emerald-950">{d.turnoDiurno}</td>
                    <td className="border border-slate-400 p-1 font-bold text-amber-950">{d.turnoIntermediario}</td>
                    <td className="border border-slate-400 p-1 font-bold text-blue-950">{d.turnoNoturno}</td>
                  </>
                ) : (
                  <td className="border border-slate-400 p-1 font-bold">{d.plantonista}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Rodapé de Contatos da Especialidade */}
        <div className="mt-4 pt-3 border-t border-slate-300 text-[8.5pt] flex justify-between items-start">
          <div>
            <strong>Contatos dos Especialistas:</strong>
            <div className="grid grid-cols-3 gap-x-4 gap-y-0.5 mt-1 font-mono text-[8pt]">
              {currentEscala.plantonistas.map(p => (
                <div key={p.id}>• {p.nome}: {p.telefone} {p.subArea ? `(${p.subArea})` : ''}</div>
              ))}
            </div>
          </div>
          {currentEscala.responsavelTecnico && (
            <div className="text-right text-[8pt] text-slate-600 max-w-xs">
              <strong>Responsável Técnico:</strong><br />
              {currentEscala.responsavelTecnico}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          TELA INTERATIVA ELEVADA (SEM ESCALA GERAL - CADA ESPECIALIDADE DEDICADA)
          ========================================================================= */}
      <div className="print:hidden space-y-5">
        
        {/* Painel de Comando Tecnológico do Cabeçalho */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 border border-slate-700/80 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-[#0E7B86]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                  Tarifário & Escalas Oficiais • Hospital Palmas Medical
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                <Stethoscope className="w-6 h-6 text-[#4FD1C5]" />
                <span>Escala Médica Especialidade</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-medium">
                Selecione a especialidade médica abaixo para abrir o ambiente exclusivo de plantão, turnos diários e lista telefônica de acionamento.
              </p>
            </div>

            {/* Mês & Atualização */}
            <div className="flex items-center gap-2.5">
              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-2.5 px-3 flex flex-col justify-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Mês Vigente</span>
                <span className="text-base font-black text-[#4FD1C5] font-mono">OUTUBRO / 2026</span>
              </div>
              <div className="bg-[#0E7B86]/40 border border-[#4FD1C5]/40 rounded-xl p-2.5 px-3 flex flex-col justify-center">
                <span className="text-[10px] text-[#A7F3D0] uppercase font-bold">Atualização</span>
                <span className="text-base font-black text-white font-mono">Mensal Oficial</span>
              </div>
            </div>
          </div>
        </div>

        {/* SELETOR DE ESPECIALIDADES EXCLUSIVO (CADA ESPECIALIDADE NA SUA PRÓPRIA ESCALA) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
              Selecione a Especialidade Médica Desejada:
            </span>
            <span className="text-xs font-bold text-[#0E7B86]">
              5 Especialidades Disponíveis
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {specialtyList.map(s => {
              const Icon = s.icon;
              const isSelected = activeSpecialty === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setActiveSpecialty(s.id);
                    setSearchTerm('');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#095962] to-[#0E7B86] text-white border-[#0E7B86] shadow-md ring-2 ring-[#0E7B86]/30'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-white border border-slate-200 text-[#0E7B86]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-white text-[#095962]' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {s.medicosCount} Médicos
                      </span>
                    </div>

                    <div className="font-black text-xs sm:text-sm leading-snug">
                      {s.nome}
                    </div>
                  </div>

                  <div className={`text-[10.5px] font-bold mt-2 pt-2 border-t ${
                    isSelected ? 'border-white/20 text-emerald-200' : 'border-slate-200 text-slate-500'
                  }`}>
                    {s.badge}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* BARRA SUPERIOR DE STATUS DO DIA & AÇÕES DA ESPECIALIDADE ATIVA */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Card de Quem está de plantão no Dia Selecionado */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0E7B86] to-[#095962] text-white flex items-center justify-center font-black text-lg shadow-sm flex-shrink-0">
              {highlightedDay}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  Plantonista Escalado para o Dia:
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono text-[11px] font-black">
                  {String(highlightedDay).padStart(2, '0')}/10/2026 ({plantonistaHoje?.diaSemana})
                </span>
                {highlightedDay === todayDate && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                    Hoje
                  </span>
                )}
              </div>

              <div className="text-base sm:text-lg font-black text-slate-900 leading-tight mt-0.5">
                {activeSpecialty === 'ortopedia' ? (
                  <span className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                    <span className="text-emerald-700 font-bold">07h-19h: {plantonistaHoje?.turnoDiurno}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-amber-700 font-bold">19h-22h: {plantonistaHoje?.turnoIntermediario}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-blue-700 font-bold">22h-07h: {plantonistaHoje?.turnoNoturno}</span>
                  </span>
                ) : (
                  <span>{plantonistaHoje?.plantonista || 'Consulte a escala'}</span>
                )}
              </div>
            </div>
          </div>

          {/* Ações da Especialidade */}
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-[#B01B52] hover:bg-[#971444] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
              title={`Imprimir escala oficial de ${currentEscala.nome}`}
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Escala A4</span>
            </button>

            {isMaster && (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                title="Restaurar padrão oficial"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar</span>
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
            LAYOUT EXCLUSIVO 1: ORTOPEDIA & TRAUMATOLOGIA (24H - 3 TURNOS)
            ========================================================================= */}
        {activeSpecialty === 'ortopedia' && (
          <div className="space-y-4">
            {/* Header da Folha de Ortopedia (Fiel à Imagem 1) */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-slate-900 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-950 text-white rounded-xl flex items-center justify-center font-black text-2xl">
                    ✚
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-blue-950 tracking-wide m-0">
                      PALMAS MEDICAL CENTER — HOSPITAL
                    </h2>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight m-0">
                      ESCALA DE PLANTÃO ORTOPEDIA — OUTUBRO/2026
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
                  <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-300">
                    <span className="text-slate-500">SETOR:</span> <strong>ORTOPEDIA</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-lg">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> 07h às 19h
                    </span>
                    <span className="flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-lg">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span> 19h às 22h
                    </span>
                    <span className="flex items-center gap-1 text-blue-800 bg-blue-50 border border-blue-300 px-2.5 py-1 rounded-lg">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> 22h às 07h
                    </span>
                  </div>
                </div>
              </div>

              {/* Layout 2 Colunas: Tabela Diária na Esquerda (68%) e Lista Lateral na Direita (32%) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
                {/* Coluna 1: Tabela dos 31 Dias de Ortopedia */}
                <div className="lg:col-span-8 border border-slate-300 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-blue-950 text-white font-black text-[11px]">
                        <th className="p-2.5 text-center border-r border-blue-900 w-12">DATA</th>
                        <th className="p-2.5 border-r border-blue-900 w-28">DIA DA SEMANA</th>
                        <th className="p-2.5 border-r border-blue-900 bg-emerald-900 text-emerald-200">07h às 19h</th>
                        <th className="p-2.5 border-r border-blue-900 bg-amber-900 text-amber-200">19h às 22h</th>
                        <th className="p-2.5 bg-blue-900 text-blue-200">22h às 07h</th>
                        {isMaster && <th className="p-2.5 text-center w-12">EDITAR</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {currentEscala.dias.map(d => {
                        const isCurrentDay = d.dia === highlightedDay;
                        return (
                          <tr 
                            key={d.dia}
                            onClick={() => setHighlightedDay(d.dia)}
                            className={`cursor-pointer transition-colors hover:bg-teal-50/50 ${
                              isCurrentDay ? 'bg-teal-50 font-bold ring-1 ring-[#0E7B86]' : ''
                            }`}
                          >
                            <td className="p-2 text-center font-bold font-mono border-r border-slate-200">
                              {String(d.dia).padStart(2, '0')}/10
                            </td>
                            <td className="p-2 text-slate-700 border-r border-slate-200 truncate">
                              {d.diaSemana}
                            </td>
                            <td className="p-2 font-bold text-emerald-950 bg-emerald-50/30 border-r border-slate-200">
                              {d.turnoDiurno}
                            </td>
                            <td className="p-2 font-bold text-amber-950 bg-amber-50/30 border-r border-slate-200">
                              {d.turnoIntermediario}
                            </td>
                            <td className="p-2 font-bold text-blue-950 bg-blue-50/30">
                              {d.turnoNoturno}
                            </td>
                            {isMaster && (
                              <td className="p-1.5 text-center">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditDay(d.dia);
                                  }}
                                  className="p-1 text-slate-400 hover:text-[#0E7B86] rounded"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Coluna 2: Especialistas e Avisos Laterais (Fiel à Imagem 1) */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Lista de Especialistas Plantonistas Numerada de 1 a 19 */}
                  <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs bg-white">
                    <div className="bg-blue-950 text-white p-2.5 font-black text-xs uppercase tracking-wider text-center">
                      LISTA DE ESPECIALISTAS PLANTONISTAS ({currentEscala.plantonistas.length})
                    </div>
                    <div className="max-h-[520px] overflow-y-auto divide-y divide-slate-100 text-xs">
                      {currentEscala.plantonistas.map((p, idx) => (
                        <div key={p.id} className="p-2 flex items-center justify-between gap-1 hover:bg-slate-50">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 text-slate-400 font-mono font-bold text-[11px]">
                              {idx + 1}
                            </span>
                            <div>
                              <span className="font-bold text-slate-900 block leading-tight">
                                {p.nome.replace('Dr. ', '').replace('Dra. ', '')}
                              </span>
                              <span className="text-[10px] text-slate-500 font-semibold">
                                {p.subArea}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 font-mono text-[11px]">
                            <a 
                              href={formatWhatsappLink(p.telefone, p.nome, 'Ortopedia')}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                              title="Chamar no WhatsApp"
                            >
                              <MessageSquare className="w-3 h-3 text-emerald-600" />
                              <span>{p.telefone.replace('(63) ', '')}</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quadro OBSERVAÇÕES GERAIS */}
                  <div className="border border-blue-900 rounded-xl overflow-hidden">
                    <div className="bg-blue-950 text-white p-2 text-xs font-black uppercase text-center">
                      OBSERVAÇÕES GERAIS
                    </div>
                    <div className="p-3 bg-blue-50/50 text-xs text-blue-950 font-bold leading-relaxed">
                      Casos cirúrgicos que chegarem devem ser colocados imediatamente no grupo geral do PS.
                    </div>
                  </div>

                  {/* Quadro ATENÇÃO & URGÊNCIA */}
                  <div className="border border-red-300 rounded-xl p-3 bg-red-50 text-red-950 text-xs font-bold leading-relaxed flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-red-900 uppercase">ATENÇÃO:</strong>
                      EM CASO DE EMERGÊNCIA, ACIONE O ATENDIMENTO AO PACIENTE E ACIONE O ESPECIALISTA RESPONSÁVEL.
                    </div>
                  </div>

                  {/* Quadro CONTATOS IMPORTANTES */}
                  <div className="border border-slate-300 rounded-xl p-3 bg-slate-50 text-xs space-y-1.5 font-medium">
                    <div className="font-black text-slate-800 uppercase text-[11px] mb-1">
                      CONTATOS IMPORTANTES:
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Pronto Socorro HMC:</span>
                      <strong className="font-mono text-slate-900">63 3215-9123</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Central Centro Cirúrgico HM:</span>
                      <strong className="font-mono text-slate-900">63 3216-8883</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Central Centro Cirúrgico HE:</span>
                      <strong className="font-mono text-slate-900">63 3807-4078</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            LAYOUT EXCLUSIVO 2: NEUROCIRURGIA PS MEDICAL (Fiel à Imagem 2)
            ========================================================================= */}
        {activeSpecialty === 'neurocirurgia' && (
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
            {/* Cabeçalho Oficial Rede Medical */}
            <div className="flex items-center justify-between border-b-2 border-[#B01B52] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#EBF7F8] border border-[#C4E5E8] flex items-center justify-center text-[#0E7B86] font-black text-2xl">
                  ✚
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#B01B52] leading-none">
                    Rede Medical
                  </div>
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-0.5">
                    Hospital Palmas Medical Center
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block bg-[#B01B52] text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">
                  ESCALA NEUROCIRURGIA PS MEDICAL
                </div>
                <div className="text-sm font-black text-slate-900 mt-1 font-mono">
                  OUTUBRO 2026
                </div>
              </div>
            </div>

            {/* Calendário Mensal com Blocos de Cores dos Neurocirurgiões */}
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
              <div className="grid grid-cols-7 bg-[#B01B52] text-white font-black text-center text-xs py-2 uppercase tracking-wider">
                <div>DOMINGO</div>
                <div>SEGUNDA</div>
                <div>TERÇA</div>
                <div>QUARTA</div>
                <div>QUINTA</div>
                <div>SEXTA</div>
                <div>SÁBADO</div>
              </div>

              {/* Matriz Semanal de Outubro */}
              <div className="grid grid-cols-7 divide-x divide-y divide-slate-200 text-xs">
                {/* Dias vazios antes do dia 1 (Outubro começou em Quinta-feira) */}
                <div className="bg-slate-100/60 p-2 min-h-[68px]"></div>
                <div className="bg-slate-100/60 p-2 min-h-[68px]"></div>
                <div className="bg-slate-100/60 p-2 min-h-[68px]"></div>
                <div className="bg-slate-100/60 p-2 min-h-[68px]"></div>

                {/* Dias 1 a 31 */}
                {currentEscala.dias.map(d => {
                  const isVinicius = d.dia >= 1 && d.dia <= 10;
                  const isLeonardo = d.dia >= 11 && d.dia <= 20;
                  const isAnaFlavia = d.dia >= 21;
                  const isSelected = d.dia === highlightedDay;

                  return (
                    <div
                      key={d.dia}
                      onClick={() => setHighlightedDay(d.dia)}
                      className={`p-2 min-h-[68px] flex flex-col justify-between cursor-pointer transition-colors ${
                        isSelected ? 'ring-2 ring-purple-600 bg-purple-50' : ''
                      } ${
                        isVinicius ? 'bg-sky-50/70 hover:bg-sky-100' :
                        isLeonardo ? 'bg-purple-50/70 hover:bg-purple-100' :
                        'bg-emerald-50/70 hover:bg-emerald-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700 font-mono text-[11px]">{d.dia}</span>
                        {isMaster && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditDay(d.dia);
                            }}
                            className="text-slate-400 hover:text-purple-700"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="font-black text-center text-xs sm:text-sm uppercase tracking-wide py-1 text-slate-900">
                        {isVinicius ? 'VINICIUS' : isLeonardo ? 'LEONARDO' : 'ANA FLÁVIA'}
                      </div>
                      <div className={`text-[9px] font-bold text-center rounded py-0.5 ${
                        isVinicius ? 'text-sky-800' : isLeonardo ? 'text-purple-800' : 'text-emerald-800'
                      }`}>
                        Sobreaviso PS
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contatos dos Neurocirurgiões com Botões de Ação Direta */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h4 className="font-black text-xs sm:text-sm uppercase text-slate-800 tracking-wide m-0">
                Telefones para contato da equipe de Neurocirurgia:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentEscala.plantonistas.map(p => (
                  <div key={p.id} className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="font-black text-sm text-slate-900">{p.nome}</div>
                      <div className="font-mono text-xs font-bold text-slate-600 mt-0.5">{p.telefone}</div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
                      <a
                        href={`tel:${cleanPhone(p.telefone)}`}
                        className="flex-1 py-1 px-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Ligar</span>
                      </a>
                      <a
                        href={formatWhatsappLink(p.telefone, p.nome, 'Neurocirurgia')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rodapé Institucional */}
            <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-200">
              Endereço: Q. 401 Sul Avenida Joaquim Teotônio Segurado, S/N - Conjunto 02 Lote 04 - Plano Diretor Sul, Palmas - TO • Telefone: (63) 3236-1818
            </div>
          </div>
        )}

        {/* =========================================================================
            LAYOUT EXCLUSIVO 3: CIRURGIA VASCULAR (Fiel à Imagem 3)
            ========================================================================= */}
        {activeSpecialty === 'vascular' && (
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
            <div className="text-center border-b-2 border-slate-800 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 uppercase tracking-wide m-0">
                Escala Sobreaviso Cirurgia Vascular — Rede Kora Palmas
              </h2>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 m-0">
                OUTUBRO 2026
              </h3>
            </div>

            {/* Calendário Segunda a Domingo (Fiel à Imagem 3) */}
            <div className="border border-slate-400 rounded-xl overflow-hidden shadow-xs">
              <div className="grid grid-cols-7 bg-slate-800 text-white font-bold text-center text-xs py-2 uppercase">
                <div>Segunda</div>
                <div>Terça</div>
                <div>Quarta</div>
                <div>Quinta</div>
                <div>Sexta</div>
                <div>Sábado</div>
                <div>Domingo</div>
              </div>

              <div className="grid grid-cols-7 divide-x divide-y divide-slate-300 text-xs">
                {/* Dias vazios antes de 1 de Outubro (Outubro começou em Quinta) */}
                <div className="bg-slate-100 p-2 min-h-[64px]"></div>
                <div className="bg-slate-100 p-2 min-h-[64px]"></div>
                <div className="bg-slate-100 p-2 min-h-[64px]"></div>

                {currentEscala.dias.map(d => {
                  const isSelected = d.dia === highlightedDay;
                  return (
                    <div
                      key={d.dia}
                      onClick={() => setHighlightedDay(d.dia)}
                      className={`p-2 min-h-[64px] flex flex-col justify-between cursor-pointer transition-colors ${
                        isSelected ? 'bg-rose-50 ring-2 ring-rose-600' : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 font-mono text-xs">{d.dia}</span>
                        {isMaster && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditDay(d.dia);
                            }}
                            className="text-slate-400 hover:text-rose-700"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="font-bold text-center text-xs text-rose-950 py-1">
                        {d.plantonista?.replace('Dr. ', '').replace('Dra. ', '')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contatos dos Cirurgiões Vasculares e Responsável Técnico */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
              <div className="md:col-span-8 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-black text-xs uppercase text-slate-800">
                  Contatos da Equipe de Cirurgia Vascular:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {currentEscala.plantonistas.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                      <div>
                        <span className="font-bold text-slate-900 block">{p.nome}</span>
                        <span className="font-mono text-slate-600 text-[11px]">{p.telefone}</span>
                      </div>
                      <a
                        href={formatWhatsappLink(p.telefone, p.nome, 'Cirurgia Vascular')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded"
                        title="WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-4 p-4 bg-rose-50/70 border border-rose-200 rounded-xl flex flex-col justify-center text-right text-xs">
                <span className="font-bold text-rose-900 uppercase text-[10px]">Responsável Técnico:</span>
                <span className="font-black text-slate-900 text-sm mt-0.5">Dr. Guilherme Marum Olmedo</span>
                <span className="text-slate-600 text-[11px] mt-0.5">Médico – Cirurgião Vascular e Endovascular</span>
                <span className="font-mono font-bold text-rose-950 mt-1">CRM TO: 7840 – RQE: 3578/3619/3643</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            LAYOUT EXCLUSIVO 4: NEFROLOGIA (Fiel à Imagem 4)
            ========================================================================= */}
        {activeSpecialty === 'nefrologia' && (
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <p className="text-xs sm:text-sm text-slate-700 font-medium italic m-0">
                "Vimos, mui gentilmente, enviar nossa escala de trabalho médico na especialidade de Nefrologia do mês de OUTUBRO/2026."
              </p>
              <div className="flex items-center justify-between mt-3">
                <div className="text-2xl sm:text-3xl font-black text-[#0E7B86] font-mono leading-none">
                  OUTUBRO 2026
                </div>
                <div className="text-right text-xs font-semibold text-slate-500">
                  MÊS: <strong>OUTUBRO</strong> • ANO: <strong>2026</strong> • UNIDADE: <strong>KORA PALMAS</strong>
                </div>
              </div>
            </div>

            {/* Grade Semanal de Nefrologia */}
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
              <div className="grid grid-cols-8 bg-sky-900 text-white font-bold text-center text-xs py-2">
                <div>UNIDADE</div>
                <div>segunda-feira</div>
                <div>terça-feira</div>
                <div>quarta-feira</div>
                <div>quinta-feira</div>
                <div>sexta-feira</div>
                <div>sábado</div>
                <div>domingo</div>
              </div>

              {/* Tabela de Nefrologia */}
              <div className="divide-y divide-slate-200 text-xs">
                {/* Linha das semanas */}
                {[
                  { range: [1, 2, 3, 4], prev: 3 },
                  { range: [5, 6, 7, 8, 9, 10, 11] },
                  { range: [12, 13, 14, 15, 16, 17, 18] },
                  { range: [19, 20, 21, 22, 23, 24, 25] },
                  { range: [26, 27, 28, 29, 30, 31], next: 1 }
                ].map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-8 divide-x divide-slate-200">
                    <div className="bg-slate-100 p-2 font-bold text-center flex flex-col justify-center text-slate-600 text-[11px]">
                      KORA
                    </div>
                    {/* Renderiza dias da semana correspondentes */}
                    {Array.from({ length: 7 }, (_, colIdx) => {
                      const dayNumber = rIdx === 0 
                        ? (colIdx >= 3 ? row.range[colIdx - 3] : null)
                        : (rIdx === 4 && colIdx >= 6 ? null : (row.range[colIdx] || null));
                      
                      if (!dayNumber) {
                        return <div key={colIdx} className="bg-slate-50 p-2 min-h-[56px]"></div>;
                      }

                      const diaObj = currentEscala.dias.find(d => d.dia === dayNumber);
                      const isSelected = dayNumber === highlightedDay;

                      return (
                        <div
                          key={colIdx}
                          onClick={() => setHighlightedDay(dayNumber)}
                          className={`p-2 min-h-[56px] flex flex-col justify-between cursor-pointer transition-colors ${
                            isSelected ? 'bg-sky-100 ring-2 ring-sky-600' : 'hover:bg-sky-50/60'
                          }`}
                        >
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 font-mono">
                            <span>{dayNumber}</span>
                            {isMaster && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditDay(dayNumber);
                                }}
                                className="text-slate-400 hover:text-sky-700"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <div className="font-black text-center text-xs text-sky-950 uppercase truncate">
                            {diaObj?.plantonista?.replace('Dr. ', '').replace('Dra. ', '')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Contatos dos Nefrologistas */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="font-black text-xs uppercase text-slate-700">
                Contatos da Equipe de Nefrologia:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {currentEscala.plantonistas.map(p => (
                  <div key={p.id} className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{p.nome}</span>
                      <span className="font-mono text-slate-600 text-[11px]">{p.telefone}</span>
                    </div>
                    <a
                      href={formatWhatsappLink(p.telefone, p.nome, 'Nefrologia')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200"
                      title="WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            LAYOUT EXCLUSIVO 5: NEUROLOGIA CLÍNICA (Fiel à Imagem 5)
            ========================================================================= */}
        {activeSpecialty === 'neurologia' && (
          <div className="bg-[#104A50] text-white rounded-2xl p-4 sm:p-6 shadow-md space-y-5">
            {/* Top Bar macOS/Console Style */}
            <div className="flex items-center justify-between border-b border-teal-700/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-teal-200 uppercase tracking-tight ml-2">
                  OUTUBRO 2026
                </span>
              </div>
              <span className="text-xs font-black uppercase text-teal-300 tracking-widest bg-teal-900/80 px-3 py-1 rounded-full border border-teal-700">
                ESCALA PLANTÃO DA NEUROLOGIA
              </span>
            </div>

            {/* Layout 2 Colunas: Lateral de Acionamento e Grade do Calendário (Fiel à Imagem 5) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Coluna 1: Painel Lateral com Aviso "ACIONAMENTO SEMPRE POR LIGAÇÃO" */}
              <div className="lg:col-span-4 bg-teal-950/70 border border-teal-600/50 rounded-xl p-4 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="border-b border-teal-700/60 pb-2 mb-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-teal-300 block">
                      PLANTONISTAS & CONTATOS
                    </span>
                    <span className="text-[10px] text-teal-400/80">Acionamento por chamada direta</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {currentEscala.plantonistas.map(p => (
                      <div key={p.id} className="p-2 bg-teal-900/60 rounded-lg border border-teal-700/60 flex items-center justify-between">
                        <div>
                          <strong className="block text-white text-xs">{p.nome}</strong>
                          <span className="font-mono text-teal-300 text-[11px]">{p.telefone}</span>
                        </div>
                        <a
                          href={`tel:${cleanPhone(p.telefone)}`}
                          className="px-2 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded text-xs font-black flex items-center gap-1"
                          title="Ligar"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Ligar</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Banner Oficial: ACIONAMENTO SEMPRE POR LIGAÇÃO */}
                <div className="p-3 bg-amber-400 text-slate-950 rounded-xl text-center font-black text-xs uppercase tracking-wider shadow-sm">
                  ⚠️ ACIONAMENTO SEMPRE POR LIGAÇÃO
                </div>
              </div>

              {/* Coluna 2: Grade de Calendário Dom a Sáb */}
              <div className="lg:col-span-8 bg-teal-950/50 border border-teal-600/40 rounded-xl p-3">
                <div className="grid grid-cols-7 text-center font-black text-xs text-teal-200 uppercase py-1 border-b border-teal-700/60 mb-2">
                  <div>DOM</div>
                  <div>SEG</div>
                  <div>TER</div>
                  <div>QUA</div>
                  <div>QUI</div>
                  <div>SEX</div>
                  <div>SÁB</div>
                </div>

                <div className="grid grid-cols-7 gap-1.5 text-xs">
                  {/* Dias vazios antes do dia 1 (Outubro começou em Quinta) */}
                  <div className="bg-teal-900/30 rounded-lg min-h-[58px]"></div>
                  <div className="bg-teal-900/30 rounded-lg min-h-[58px]"></div>
                  <div className="bg-teal-900/30 rounded-lg min-h-[58px]"></div>
                  <div className="bg-teal-900/30 rounded-lg min-h-[58px]"></div>

                  {currentEscala.dias.map(d => {
                    const isSelected = d.dia === highlightedDay;
                    return (
                      <div
                        key={d.dia}
                        onClick={() => setHighlightedDay(d.dia)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between min-h-[58px] ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm font-black'
                            : 'bg-white text-slate-900 border-teal-300/40 hover:bg-teal-50'
                        }`}
                      >
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold font-mono">{d.dia}</span>
                          {isMaster && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditDay(d.dia);
                              }}
                              className="text-slate-400 hover:text-teal-800"
                            >
                              <Edit3 className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                        <div className="font-bold text-center text-[11px] leading-tight truncate">
                          {d.plantonista?.replace('Dr. ', '').replace('Dra. ', '')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Rodapé Oficial da Neurologia */}
            <div className="text-center font-black text-xs uppercase tracking-widest text-teal-200 pt-3 border-t border-teal-700/60">
              RESPONSÁVEL TÉCNICO: DRA. PRISCILA LEITE
            </div>
          </div>
        )}

        {/* MODAL DE EDIÇÃO MENSAL (PARA O USUÁRIO ATUALIZAR MÊS A MÊS) */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 m-0 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#0E7B86]" />
                  <span>Editar Plantão do Dia {editDiaNumber}</span>
                </h3>
                <span className="text-xs font-bold text-[#0E7B86] uppercase">
                  {currentEscala.nome}
                </span>
              </div>

              <form onSubmit={handleSaveDayEdit} className="space-y-3">
                {activeSpecialty === 'ortopedia' ? (
                  <>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">
                        Turno Diurno (07h às 19h):
                      </label>
                      <input
                        type="text"
                        value={editDiurno}
                        onChange={e => setEditDiurno(e.target.value)}
                        placeholder="Ex: Dr. André"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0E7B86]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">
                        Turno Intermediário (19h às 22h):
                      </label>
                      <input
                        type="text"
                        value={editIntermediario}
                        onChange={e => setEditIntermediario(e.target.value)}
                        placeholder="Ex: Dr. Pedro"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0E7B86]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">
                        Turno Noturno (22h às 07h):
                      </label>
                      <input
                        type="text"
                        value={editNoturno}
                        onChange={e => setEditNoturno(e.target.value)}
                        placeholder="Ex: Dr. Pedro"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0E7B86]"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      Médico Plantonista / Sobreaviso:
                    </label>
                    <input
                      type="text"
                      value={editPlantonista}
                      onChange={e => setEditPlantonista(e.target.value)}
                      placeholder="Ex: Dra. Ana Flávia"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0E7B86]"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
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

// Ícone Vascular
function HeartRateIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
