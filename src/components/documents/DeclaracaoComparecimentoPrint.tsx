import React from 'react';
import { 
  Building2, 
  Calendar, 
  Clock, 
  FileCheck2, 
  Fingerprint, 
  QrCode, 
  ShieldCheck, 
  Stethoscope, 
  User, 
  UserCheck, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

export interface DeclaracaoComparecimentoData {
  nomePaciente: string;
  cpfPaciente: string;
  rgPaciente?: string;
  dataNascimento?: string;
  registroAtendimento?: string;
  convenioPlano?: string;
  
  condicao?: 'PACIENTE' | 'ACOMPANHANTE';
  nomeAcompanhante?: string;
  cpfAcompanhante?: string;
  grauParentesco?: string;

  dataComparecimento: string;
  horarioEntrada?: string;
  horarioSaida?: string;
  horario: string; // retrocompatibilidade
  tipoAtendimento?: string;
  setorUnidade?: string;

  observacao: string;
  diaEmissao: string;
  mesEmissao: string;
  anoEmissao: string;

  codigoAutenticidade?: string;
  medicoResponsavel?: string;
  crmProfissional?: string;
  cargoEmitente?: string;
}

interface DeclaracaoComparecimentoPrintProps {
  data: DeclaracaoComparecimentoData;
  onChange?: (field: keyof DeclaracaoComparecimentoData, val: string) => void;
  isEditable?: boolean;
}

export const DeclaracaoComparecimentoPrint: React.FC<DeclaracaoComparecimentoPrintProps> = ({
  data,
  onChange,
  isEditable = false
}) => {
  // Gera código único de rastreabilidade se não existir
  const authCode = data.codigoAutenticidade || 'HPM-CMP-2026-8491';
  const condicao = data.condicao || 'PACIENTE';
  const horaEntrada = data.horarioEntrada || (data.horario.includes('às') ? data.horario.split('às')[0].trim() : data.horario);
  const horaSaida = data.horarioSaida || (data.horario.includes('às') ? data.horario.split('às')[1].trim() : '');
  const tipoAtendimento = data.tipoAtendimento || 'Consulta Médica em Pronto-Socorro';
  const setorUnidade = data.setorUnidade || 'Pronto-Socorro Geral (PS)';

  const setField = (field: keyof DeclaracaoComparecimentoData, val: string) => {
    if (onChange) {
      onChange(field, val);
      // Se alterar horarioEntrada ou horarioSaida, atualiza também horario consolidado
      if (field === 'horarioEntrada') {
        onChange('horario', val ? (horaSaida ? `${val} às ${horaSaida}` : val) : horaSaida);
      }
      if (field === 'horarioSaida') {
        onChange('horario', horaEntrada ? (val ? `${horaEntrada} às ${val}` : horaEntrada) : val);
      }
    }
  };

  return (
    <div className="w-full">
      {/* Editor Helper Bar (Visível apenas em modo de edição de tela) */}
      {isEditable && (
        <div className="print:hidden mb-4 p-4 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white rounded-2xl border border-teal-700/60 shadow-md space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                Assistente de Preenchimento Inteligente • Declaração de Comparecimento
              </span>
            </div>
            <span className="text-[11px] text-teal-200/80 font-semibold">
              Edite os campos diretamente na folha ou selecione os atalhos rápidos abaixo
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-300 mr-1">Finalidade:</span>
            <button
              type="button"
              onClick={() => setField('condicao', 'PACIENTE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                condicao === 'PACIENTE'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>O próprio Paciente</span>
            </button>
            <button
              type="button"
              onClick={() => setField('condicao', 'ACOMPANHANTE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                condicao === 'ACOMPANHANTE'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Acompanhante / Responsável Legal</span>
            </button>

            <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

            <span className="text-xs font-bold text-slate-300 mr-1">Preenchimentos Rápidos:</span>
            <button
              type="button"
              onClick={() => {
                setField('tipoAtendimento', 'Consulta Médica e Administração de Medicações');
                setField('setorUnidade', 'Pronto-Socorro Geral (PS Adulto)');
                setField('observacao', 'Paciente atendido em regime de urgência, submetido a avaliação médica e permanência para infusão medicamentosa endovenosa.');
              }}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-teal-700 text-teal-200 transition-colors cursor-pointer"
            >
              Consulta + Medicação PS
            </button>
            <button
              type="button"
              onClick={() => {
                setField('tipoAtendimento', 'Realização de Exames Complementares de Urgência');
                setField('setorUnidade', 'Centro de Diagnóstico por Imagem e Laboratório');
                setField('observacao', 'Paciente compareceu para a realização de exames diagnósticos solicitados pela equipe médica assistente.');
              }}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-teal-700 text-teal-200 transition-colors cursor-pointer"
            >
              Exames / Imagem
            </button>
            <button
              type="button"
              onClick={() => {
                setField('condicao', 'ACOMPANHANTE');
                setField('tipoAtendimento', 'Acompanhamento de Paciente em Atendimento de Urgência');
                setField('setorUnidade', 'Pronto-Socorro Pediátrico / Emergência');
                setField('observacao', 'Acompanhante legal presente durante todo o período de atendimento e assistência médica prestada ao paciente.');
              }}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-teal-700 text-teal-200 transition-colors cursor-pointer"
            >
              Acompanhante Pediátrico
            </button>
          </div>
        </div>
      )}

      {/* DOCUMENTO PRINCIPAL A4 DE ALTA FIDELIDADE */}
      <div 
        className="bg-white text-slate-900 p-6 sm:p-9 max-w-[840px] mx-auto text-[12px] leading-relaxed border border-slate-300 rounded-xl shadow-md print:shadow-none print:border-none print:rounded-none print:p-0 print:m-0 print:max-w-none print:w-full print:text-[11pt] page-break-avoid"
        style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
      >
        <div className="flex justify-between items-stretch gap-4 print:gap-3 w-full">
          {/* Corpo do Documento */}
          <div className="flex-1 flex flex-col justify-between min-h-[960px] print:min-h-0 print:h-auto">
            <div>
              {/* TOP HEADER INSTITUCIONAL ELEVADO */}
              <div className="border-b-2 border-[#0E7B86] pb-3.5 mb-4">
                <div className="flex items-center justify-between gap-3">
                  {/* Logotipo Hospitalar Moderno */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0E7B86] to-[#095962] text-white flex items-center justify-center font-black text-2xl shadow-xs print:border print:border-black/30">
                      ✚
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl sm:text-2xl font-black tracking-tight text-[#B01B52] leading-none">
                          Medical
                        </span>
                        <span className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">
                          Palmas
                        </span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                        Kora Saúde • Hospital Palmas Medical Ltda.
                      </div>
                      <div className="text-[9px] text-slate-400 font-medium">
                        CNPJ: 12.955.953/0001-92 • CNES: 2755259
                      </div>
                    </div>
                  </div>

                  {/* Selo Tecnológico de Autenticidade Digital */}
                  <div className="text-right flex flex-col items-end">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-black uppercase tracking-wider shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Documento Autenticado</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-600 mt-1 font-bold">
                      CÓD: <span className="text-slate-900 font-black">{authCode}</span>
                    </div>
                    <div className="text-[8.5px] text-slate-400">
                      Rastreabilidade Digital CFM/CLT
                    </div>
                  </div>
                </div>
              </div>

              {/* TÍTULO DO DOCUMENTO */}
              <div className="text-center my-4 print:my-3">
                <div className="inline-block bg-[#0E7B86]/10 text-[#095962] border border-[#0E7B86]/30 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-1">
                  Comprovante Oficial de Atendimento Hospitalar
                </div>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-slate-900 m-0 leading-tight">
                  DECLARAÇÃO DE COMPARECIMENTO
                </h1>
                <div className="w-20 h-1 bg-[#B01B52] mx-auto mt-1.5 rounded-full print:bg-black" />
              </div>

              {/* TEXTO DECLARATÓRIO FORMAL DE FÉ PÚBLICA */}
              <div className="text-justify text-xs sm:text-[13px] print:text-[11.5pt] leading-relaxed text-slate-800 print:text-black my-4">
                <p className="m-0 indent-6">
                  Declaramos, para os devidos fins de comprovação legal de comparecimento e justificação de ausência laboral ou acadêmica perante o empregador ou autoridade competente (em observância ao <strong>Art. 473 da CLT</strong> e Resoluções do Conselho Federal de Medicina), que a pessoa abaixo qualificada compareceu e permaneceu nas dependências desta instituição hospitalar para a realização de atendimento de saúde.
                </p>
              </div>

              {/* QUADRO 1: DADOS DO PACIENTE */}
              <div className="border border-slate-300 print:border-black rounded-xl p-3.5 sm:p-4 my-3 bg-slate-50/60 print:bg-transparent space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200 print:border-black/30 pb-1.5">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0E7B86] print:text-black" />
                    <span className="text-[11px] print:text-[10pt] font-black uppercase tracking-wider text-slate-800 print:text-black">
                      1. Identificação do Paciente
                    </span>
                  </div>
                  {isEditable && (
                    <span className="text-[10px] text-slate-400 font-semibold print:hidden">
                      * Campo editável
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 print:gap-2.5 text-xs">
                  {/* Nome Completo */}
                  <div className="sm:col-span-8">
                    <label className="text-[9.5px] print:text-[8.5pt] font-bold uppercase text-slate-500 print:text-black block mb-0.5">
                      Nome Completo do Paciente:
                    </label>
                    <div className="min-h-[26px] border-b border-slate-400 print:border-black flex items-end pb-0.5">
                      {isEditable ? (
                        <input
                          type="text"
                          value={data.nomePaciente}
                          onChange={e => setField('nomePaciente', e.target.value.toUpperCase())}
                          placeholder="Informe o nome completo do paciente"
                          className="w-full font-black text-xs sm:text-sm text-slate-900 outline-none bg-amber-50/50 focus:bg-white rounded px-1.5 py-0.5"
                        />
                      ) : (
                        <span className="font-black text-xs sm:text-sm text-slate-900 print:text-black">
                          {data.nomePaciente || '—'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CPF */}
                  <div className="sm:col-span-4">
                    <label className="text-[9.5px] print:text-[8.5pt] font-bold uppercase text-slate-500 print:text-black block mb-0.5">
                      CPF do Paciente:
                    </label>
                    <div className="min-h-[26px] border-b border-slate-400 print:border-black flex items-end pb-0.5 font-mono">
                      {isEditable ? (
                        <input
                          type="text"
                          value={data.cpfPaciente}
                          onChange={e => setField('cpfPaciente', e.target.value)}
                          placeholder="000.000.000-00"
                          className="w-full font-bold text-xs text-slate-900 outline-none bg-amber-50/50 focus:bg-white rounded px-1.5 py-0.5 font-mono"
                        />
                      ) : (
                        <span className="font-bold text-xs text-slate-900 print:text-black">
                          {data.cpfPaciente || '—'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Prontuário / Boletim */}
                  <div className="sm:col-span-4">
                    <label className="text-[9.5px] print:text-[8.5pt] font-bold uppercase text-slate-500 print:text-black block mb-0.5">
                      Nº Atendimento / Boletim PS:
                    </label>
                    <div className="min-h-[24px] border-b border-slate-400 print:border-black flex items-end pb-0.5">
                      {isEditable ? (
                        <input
                          type="text"
                          value={data.registroAtendimento || ''}
                          onChange={e => setField('registroAtendimento', e.target.value)}
                          placeholder="Ex: AT-2026-9418"
                          className="w-full font-semibold text-xs text-slate-900 outline-none bg-amber-50/50 focus:bg-white rounded px-1.5 py-0.5"
                        />
                      ) : (
                        <span className="font-semibold text-xs text-slate-800 print:text-black">
                          {data.registroAtendimento || '—'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Convênio / Plano */}
                  <div className="sm:col-span-4">
                    <label className="text-[9.5px] print:text-[8.5pt] font-bold uppercase text-slate-500 print:text-black block mb-0.5">
                      Convênio / Plano de Saúde:
                    </label>
                    <div className="min-h-[24px] border-b border-slate-400 print:border-black flex items-end pb-0.5">
                      {isEditable ? (
                        <input
                          type="text"
                          value={data.convenioPlano || ''}
                          onChange={e => setField('convenioPlano', e.target.value)}
                          placeholder="Ex: Unimed / Bradesco / Particular"
                          className="w-full font-semibold text-xs text-slate-900 outline-none bg-amber-50/50 focus:bg-white rounded px-1.5 py-0.5"
                        />
                      ) : (
                        <span className="font-semibold text-xs text-slate-800 print:text-black">
                          {data.convenioPlano || 'Particular / Convênio'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Condição: Paciente ou Acompanhante */}
                  <div className="sm:col-span-4">
                    <label className="text-[9.5px] print:text-[8.5pt] font-bold uppercase text-slate-500 print:text-black block mb-0.5">
                      Condição do Comparecimento:
                    </label>
                    <div className="min-h-[24px] border-b border-slate-400 print:border-black flex items-end pb-0.5">
                      {isEditable ? (
                        <select
                          value={condicao}
                          onChange={e => setField('condicao', e.target.value as any)}
                          className="w-full font-black text-xs text-[#0E7B86] outline-none bg-amber-50/50 rounded py-0.5 cursor-pointer"
                        >
                          <option value="PACIENTE">NA CONDIÇÃO DE PACIENTE</option>
                          <option value="ACOMPANHANTE">NA CONDIÇÃO DE ACOMPANHANTE</option>
                        </select>
                      ) : (
                        <span className="font-black text-xs text-[#0E7B86] print:text-black">
                          {condicao === 'PACIENTE' ? 'COMO PACIENTE' : 'COMO ACOMPANHANTE'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bloco Adicional caso seja Acompanhante */}
                {condicao === 'ACOMPANHANTE' && (
                  <div className="mt-2 pt-2 border-t border-dashed border-amber-300 print:border-slate-400 bg-amber-50/40 print:bg-transparent p-2 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 print:gap-2 text-xs">
                      <div className="sm:col-span-7">
                        <label className="text-[9px] print:text-[8pt] font-bold uppercase text-amber-900 print:text-black block mb-0.5">
                          Nome do Acompanhante (Portador do Documento):
                        </label>
                        <div className="min-h-[24px] border-b border-slate-400 print:border-black flex items-end pb-0.5">
                          {isEditable ? (
                            <input
                              type="text"
                              value={data.nomeAcompanhante || ''}
                              onChange={e => setField('nomeAcompanhante', e.target.value.toUpperCase())}
                              placeholder="Nome completo do acompanhante"
                              className="w-full font-black text-xs text-slate-900 outline-none bg-white rounded px-1.5 py-0.5"
                            />
                          ) : (
                            <span className="font-black text-xs text-slate-900 print:text-black">
                              {data.nomeAcompanhante || '—'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-5">
                        <label className="text-[9px] print:text-[8pt] font-bold uppercase text-amber-900 print:text-black block mb-0.5">
                          CPF do Acompanhante:
                        </label>
                        <div className="min-h-[24px] border-b border-slate-400 print:border-black flex items-end pb-0.5 font-mono">
                          {isEditable ? (
                            <input
                              type="text"
                              value={data.cpfAcompanhante || ''}
                              onChange={e => setField('cpfAcompanhante', e.target.value)}
                              placeholder="000.000.000-00"
                              className="w-full font-bold text-xs text-slate-900 outline-none bg-white rounded px-1.5 py-0.5 font-mono"
                            />
                          ) : (
                            <span className="font-bold text-xs text-slate-900 print:text-black">
                              {data.cpfAcompanhante || '—'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* QUADRO 2: DADOS DO ATENDIMENTO & HORÁRIOS */}
              <div className="border border-slate-300 print:border-black rounded-xl p-3.5 sm:p-4 my-3 bg-slate-50/60 print:bg-transparent space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200 print:border-black/30 pb-1.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#0E7B86] print:text-black" />
                    <span className="text-[11px] print:text-[10pt] font-black uppercase tracking-wider text-slate-800 print:text-black">
                      2. Registro Temporal e Unidade de Atendimento
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 print:gap-2.5 text-xs">
                  {/* Data do Comparecimento */}
                  <div className="sm:col-span-4">
                    <label className="text-[9.5px] print:text-[8.5pt] font-bold uppercase text-slate-500 print:text-black block mb-0.5">
                      Data do Comparecimento:
                    </label>
                    <div className="min-h-[26px] border-b border-slate-400 print:border-black flex items-end pb-0.5">
                      {isEditable ? (
                        <input
                          type="text"
                          value={data.dataComparecimento}
                          onChange={e => setField('dataComparecimento', e.target.value)}
                          placeholder="DD / MM / AAAA"
                          className="w-full font-black text-xs sm:text-sm text-slate-900 outline-none bg-amber-50/50 focus:bg-white rounded px-1.5 py-0.5"
                        />
                      ) : (
                        <span className="font-black text-xs sm:text-sm text-slate-900 print:text-black">
                          {data.dataComparecimento || '—'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Horário de Entrada */}
                  <div className="sm:col-span-4">
                    <label className="text-[9.5px] print:text-[8.5pt] font-bold uppercase text-slate-500 print:text-black block mb-0.5">
                      Horário de Entrada (Chegada):
                    </label>
                    <div className="min-h-[26px] border-b border-slate-400 print:border-black flex items-end pb-0.5 font-mono">
                      {isEditable ? (
                        <input
                          type="text"
                          value={horaEntrada}
                          onChange={e => setField('horarioEntrada', e.target.value)}
                          placeholder="Ex: 14:15"
                          className="w-full font-bold text-xs sm:text-sm text-slate-900 outline-none bg-amber-50/50 focus:bg-white rounded px-1.5 py-0.5 font-mono"
                        />
                      ) : (
                        <span className="font-bold text-xs sm:text-sm text-slate-900 print:text-black">
                          {horaEntrada ? `${horaEntrada} horas` : '—'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Horário de Saída */}
                  <div className="sm:col-span-4">
                    <label className="text-[9.5px] print:text-[8.5pt] font-bold uppercase text-slate-500 print:text-black block mb-0.5">
                      Horário de Saída (Término):
                    </label>
                    <div className="min-h-[26px] border-b border-slate-400 print:border-black flex items-end pb-0.5 font-mono">
                      {isEditable ? (
                        <input
                          type="text"
                          value={horaSaida}
                          onChange={e => setField('horarioSaida', e.target.value)}
                          placeholder="Ex: 17:40"
                          className="w-full font-bold text-xs sm:text-sm text-slate-900 outline-none bg-amber-50/50 focus:bg-white rounded px-1.5 py-0.5 font-mono"
                        />
                      ) : (
                        <span className="font-bold text-xs sm:text-sm text-slate-900 print:text-black">
                          {horaSaida ? `${horaSaida} horas` : '—'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Setor / Unidade */}
                  <div className="sm:col-span-6">
                    <label className="text-[9.5px] print:text-[8.5pt] font-bold uppercase text-slate-500 print:text-black block mb-0.5">
                      Setor / Unidade Hospitalar:
                    </label>
                    <div className="min-h-[24px] border-b border-slate-400 print:border-black flex items-end pb-0.5">
                      {isEditable ? (
                        <input
                          type="text"
                          value={setorUnidade}
                          onChange={e => setField('setorUnidade', e.target.value)}
                          placeholder="Ex: Pronto-Socorro Geral / Sala de Medicação"
                          className="w-full font-semibold text-xs text-slate-900 outline-none bg-amber-50/50 focus:bg-white rounded px-1.5 py-0.5"
                        />
                      ) : (
                        <span className="font-semibold text-xs text-slate-800 print:text-black">
                          {setorUnidade}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tipo de Atendimento */}
                  <div className="sm:col-span-6">
                    <label className="text-[9.5px] print:text-[8.5pt] font-bold uppercase text-slate-500 print:text-black block mb-0.5">
                      Tipo de Procedimento / Atendimento:
                    </label>
                    <div className="min-h-[24px] border-b border-slate-400 print:border-black flex items-end pb-0.5">
                      {isEditable ? (
                        <input
                          type="text"
                          value={tipoAtendimento}
                          onChange={e => setField('tipoAtendimento', e.target.value)}
                          placeholder="Ex: Consulta de Urgência / Avaliação Especializada"
                          className="w-full font-semibold text-xs text-slate-900 outline-none bg-amber-50/50 focus:bg-white rounded px-1.5 py-0.5"
                        />
                      ) : (
                        <span className="font-semibold text-xs text-slate-800 print:text-black">
                          {tipoAtendimento}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* QUADRO 3: OBSERVAÇÕES CLÍNICAS / ADMINISTRATIVAS */}
              <div className="border border-slate-300 print:border-black rounded-xl p-3.5 sm:p-4 my-3 bg-slate-50/60 print:bg-transparent space-y-1.5">
                <div className="flex items-center gap-2 border-b border-slate-200 print:border-black/30 pb-1">
                  <FileCheck2 className="w-4 h-4 text-[#0E7B86] print:text-black" />
                  <span className="text-[11px] print:text-[10pt] font-black uppercase tracking-wider text-slate-800 print:text-black">
                    3. Observações Médicas / Administrativas
                  </span>
                </div>
                <div className="min-h-[46px] border-b border-slate-400 print:border-black pt-1 pb-1">
                  {isEditable ? (
                    <textarea
                      rows={2}
                      value={data.observacao}
                      onChange={e => setField('observacao', e.target.value)}
                      placeholder="Descreva detalhes do atendimento, necessidade de repouso ou justificativas complementares..."
                      className="w-full text-xs text-slate-900 outline-none bg-amber-50/50 focus:bg-white rounded p-1.5 resize-none font-medium leading-snug"
                    />
                  ) : (
                    <p className="text-xs text-slate-800 print:text-black m-0 leading-relaxed font-medium">
                      {data.observacao || 'Atendimento realizado conforme protocolos assistenciais do Hospital Palmas Medical.'}
                    </p>
                  )}
                </div>
              </div>

              {/* DATAÇÃO OFICIAL */}
              <div className="text-right text-xs print:text-[11pt] font-semibold my-5 print:my-4 text-slate-900 print:text-black">
                Palmas - TO,{' '}
                {isEditable ? (
                  <span className="inline-flex items-center gap-1 font-sans">
                    <input
                      type="text"
                      value={data.diaEmissao}
                      onChange={e => setField('diaEmissao', e.target.value)}
                      placeholder="DD"
                      className="w-10 border-b border-black text-center outline-none bg-amber-50/50 font-bold text-xs py-0.5"
                    />
                    <span>de</span>
                    <input
                      type="text"
                      value={data.mesEmissao}
                      onChange={e => setField('mesEmissao', e.target.value)}
                      placeholder="Mês"
                      className="w-28 border-b border-black text-center outline-none bg-amber-50/50 font-bold text-xs py-0.5"
                    />
                    <span>de</span>
                    <input
                      type="text"
                      value={data.anoEmissao}
                      onChange={e => setField('anoEmissao', e.target.value)}
                      placeholder="AAAA"
                      className="w-16 border-b border-black text-center outline-none bg-amber-50/50 font-bold text-xs py-0.5"
                    />
                  </span>
                ) : (
                  <span>
                    <strong>{data.diaEmissao || '__'}</strong> de <strong>{data.mesEmissao || '__________'}</strong> de <strong>{data.anoEmissao || '____'}</strong>
                  </span>
                )}
              </div>

              {/* BLOCO DUPLO DE ASSINATURA E CHANCELA */}
              <div className="grid grid-cols-2 gap-8 print:gap-6 pt-5 print:pt-4 my-2">
                {/* Assinatura do Profissional de Saúde */}
                <div className="text-center">
                  <div className="border-t border-slate-900 print:border-black pt-1.5 mx-auto max-w-[240px]">
                    <div className="font-black text-xs print:text-[10.5pt] uppercase text-slate-900 print:text-black">
                      {data.medicoResponsavel || 'Médico / Profissional Assistente'}
                    </div>
                    <div className="text-[10px] print:text-[9pt] text-slate-600 print:text-black font-semibold">
                      {data.crmProfissional || 'Carimbo & Assinatura (CRM / COREN)'}
                    </div>
                  </div>
                </div>

                {/* Carimbo / Emissão Hospitalar */}
                <div className="text-center">
                  <div className="border-t border-slate-900 print:border-black pt-1.5 mx-auto max-w-[240px]">
                    <div className="font-black text-xs print:text-[10.5pt] uppercase text-[#0E7B86] print:text-black">
                      Hospital Palmas Medical
                    </div>
                    <div className="text-[10px] print:text-[9pt] text-slate-600 print:text-black font-semibold">
                      Recepção / Controle de Acesso e Admissão
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RODAPÉ TECNOLÓGICO COM CÓDIGO QR E CANAL DE VALIDAÇÃO */}
            <div className="pt-4 print:pt-3 border-t-2 border-slate-200 print:border-black mt-6 print:mt-4">
              <div className="flex items-center justify-between gap-3 text-[9.5px] print:text-[8.5pt] text-slate-600 print:text-black">
                {/* Dados de Validação e QR Code Visual */}
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 border border-slate-400 p-0.5 rounded bg-white flex flex-col items-center justify-center font-mono text-[7px] leading-tight select-none">
                    <QrCode className="w-8 h-8 text-slate-900" />
                  </div>
                  <div>
                    <div className="font-black text-[#B01B52] print:text-black uppercase tracking-wider">
                      Autenticação Eletrônica Hospitalar
                    </div>
                    <div className="text-slate-500 print:text-black text-[8.5px]">
                      Acesse <span className="font-bold text-[#0E7B86]">redemedical.com.br/validacao</span> com o código <span className="font-mono font-bold text-slate-900">{authCode}</span>
                    </div>
                  </div>
                </div>

                {/* Endereço e Contato Central */}
                <div className="text-right">
                  <div className="font-bold text-slate-800 print:text-black">
                    401 Sul Avenida Joaquim Teotônio Segurado, Conj. 02 Lote 02
                  </div>
                  <div className="text-slate-500 print:text-black text-[8.5px]">
                    Edifício Palmas Medical Center • Palmas - TO • PABX: <strong className="font-mono text-slate-800">(63) 3236-1818</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA LATERAL INTEGRADA DO RT (Dr. Nilo Francisco de Sales Sobrinho) */}
          <div className="w-5 print:w-4 flex items-center justify-center select-none shrink-0 border-l border-slate-200 print:border-transparent pl-1">
            <div 
              className="text-[9.5px] print:text-[8pt] font-black tracking-wider text-[#B01B52] print:text-black whitespace-nowrap"
              style={{ 
                writingMode: 'vertical-rl', 
                transform: 'rotate(180deg)',
                letterSpacing: '0.08em'
              }}
            >
              RT: Dr. Nilo Francisco de Sales Sobrinho - CRM-TO 4686
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
