import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface AutorizacaoTrocaPlantaoData {
  funcionarioSolicitante: string;
  dataPlantaoSolicitante: string;
  horarioSolicitanteInicio: string;
  horarioSolicitanteFim: string;
  funcionarioSolicitado: string;
  dataPlantaoSolicitado: string;
  horarioSolicitadoInicio: string;
  horarioSolicitadoFim: string;
  funcao: string;
  justificativaSolicitante: string;
  justificativaSupervisor: string;
  diaAprovacao: string;
  mesAprovacao: string;
  anoAprovacao: string;
  dataLancadoSistema: string;
  vistoLancado: string;
}

interface AutorizacaoTrocaPlantaoPrintProps {
  data: AutorizacaoTrocaPlantaoData;
  onChange?: (field: keyof AutorizacaoTrocaPlantaoData, val: string) => void;
  isEditable?: boolean;
}

const FUNCOES_COLUNA_1 = [
  'Enfermeiro(a)',
  'Téc. Em Enfermagem',
  'Recepcionista',
  'Serviços Gerais'
];

const FUNCOES_COLUNA_2 = [
  'Copeira',
  'Fisioterapeuta',
  'Nutricionista',
  'Farmacêutico(a) ou Auxiliar de Farmácia'
];

export const AutorizacaoTrocaPlantaoPrint: React.FC<AutorizacaoTrocaPlantaoPrintProps> = ({
  data,
  onChange,
  isEditable = false
}) => {
  const isFuncaoChecked = (label: string) => {
    if (!data.funcao) return false;
    const clean = label.trim().toLowerCase();
    const current = data.funcao.toLowerCase();
    if (current === clean) return true;
    const list = current.split(/[,;|]/).map(s => s.trim());
    return list.includes(clean);
  };

  const handleToggleFuncao = (label: string) => {
    if (!onChange) return;
    if (isFuncaoChecked(label)) {
      const parts = (data.funcao || '').split(/[,;|]/).map(s => s.trim()).filter(Boolean);
      const filtered = parts.filter(p => p.toLowerCase() !== label.toLowerCase());
      onChange('funcao', filtered.join(', '));
    } else {
      onChange('funcao', label);
    }
  };

  return (
    <>
      {/* Estilo CSS Estrito para Garantir 1 Única Página A4 na Impressão */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm 6mm 10mm;
          }
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-single-page {
            max-height: 278mm !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
          }
        }
      `}</style>

      <div 
        className="print-single-page text-slate-900 bg-white p-4 sm:p-7 max-w-[820px] mx-auto text-[10px] leading-tight border border-slate-300 rounded-2xl shadow-md print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none page-break-avoid"
        style={{ 
          fontFamily: "Inter, Arial, 'Helvetica Neue', Helvetica, sans-serif",
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact'
        }}
      >
        {/* Top Header com Logo Corporativo Rede Medical */}
        <div className="flex items-center justify-between pb-2 border-b-2 border-[#0E7B86]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EBF7F8] border border-[#C4E5E8] flex items-center justify-center text-[#0E7B86] shadow-xs print:border-black print:bg-white">
              <svg className="w-5 h-5 text-[#0E7B86] print:text-black" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.5C12 3.12 13.12 2 14.5 2H17.5C18.88 2 20 3.12 20 4.5V10C20 11.1 20.9 12 22 12H27.5C28.88 12 30 13.12 30 14.5V17.5C30 18.88 28.88 20 27.5 20H22C20.9 20 20 20.9 20 22V27.5C20 28.88 18.88 30 17.5 30H14.5C13.12 30 12 28.88 12 27.5V22C12 20.9 11.1 20 10 20H4.5C3.12 20 2 18.88 2 17.5V14.5C2 13.12 3.12 12 4.5 12H10C11.1 12 12 11.1 12 10V4.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="#D8ECEE" />
              </svg>
            </div>
            <div>
              <span className="block text-[8.5px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                Rede
              </span>
              <span className="block text-lg sm:text-xl font-black text-[#0E7B86] tracking-tight leading-none mt-0.5 print:text-black">
                Medical
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 print:border-black print:text-black print:bg-transparent">
              Gestão de Pessoas • RH & Escalas
            </span>
            <span className="block text-[8.5px] text-slate-400 font-medium mt-0.5 print:text-black">
              Hospital Palmas Medical
            </span>
          </div>
        </div>

        {/* Faixa Título Principal Compacta */}
        <div className="my-1.5 py-1 px-3 rounded-md bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white text-center shadow-xs border border-slate-800 print:bg-black print:text-white print:rounded-none">
          <h1 className="text-[11px] sm:text-[12px] font-black uppercase tracking-widest m-0 drop-shadow-xs">
            AUTORIZAÇÃO PARA TROCA DE PLANTÃO
          </h1>
        </div>

        {/* Card 1: Dados do Solicitante e do Solicitado */}
        <div className="border border-slate-300 rounded-lg p-2.5 mb-1.5 bg-white space-y-1.5 shadow-2xs print:border-black print:rounded-none">
          {/* Bloco 1: Funcionário Solicitante */}
          <div className="space-y-1 pb-1.5 border-b border-slate-200 print:border-black">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0E7B86] print:bg-black"></span>
              <span className="font-extrabold text-slate-800 text-[10px] print:text-black whitespace-nowrap">
                Funcionário Solicitante:
              </span>
              <div className="flex-1">
                {isEditable ? (
                  <input
                    type="text"
                    value={data.funcionarioSolicitante}
                    onChange={e => onChange?.('funcionarioSolicitante', e.target.value)}
                    placeholder="Nome completo do colaborador solicitante"
                    className="w-full px-2 py-0.5 text-[10px] font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E7B86]"
                  />
                ) : (
                  <div className="border-b border-slate-400 min-h-[16px] px-1 font-bold text-slate-900 print:text-black print:border-black">
                    {data.funcionarioSolicitante || '___________________________________________________________________'}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 items-center pl-3">
              <div className="sm:col-span-6 flex items-center gap-1.5">
                <span className="font-semibold text-slate-700 text-[9.5px] print:text-black whitespace-nowrap">
                  Data do Plantão Solicitante:
                </span>
                <div className="flex-1">
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.dataPlantaoSolicitante}
                      onChange={e => onChange?.('dataPlantaoSolicitante', e.target.value)}
                      placeholder="DD/MM/AAAA"
                      className="w-full px-1.5 py-0.5 text-[9.5px] font-bold text-center text-slate-900 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E7B86]"
                    />
                  ) : (
                    <div className="border-b border-slate-400 min-h-[16px] text-center font-bold text-slate-900 print:text-black print:border-black">
                      {data.dataPlantaoSolicitante || '____/____/_____'}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6 flex items-center gap-1 justify-end">
                <span className="font-semibold text-slate-700 text-[9.5px] print:text-black whitespace-nowrap">
                  Horário:
                </span>
                <div className="w-16">
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.horarioSolicitanteInicio}
                      onChange={e => onChange?.('horarioSolicitanteInicio', e.target.value)}
                      placeholder="07:00"
                      className="w-full px-1 py-0.5 text-[9.5px] font-bold text-center text-slate-900 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E7B86]"
                    />
                  ) : (
                    <div className="border-b border-slate-400 min-h-[16px] text-center font-bold text-slate-900 print:text-black print:border-black">
                      {data.horarioSolicitanteInicio || '_____'}
                    </div>
                  )}
                </div>
                <span className="font-bold text-slate-500 px-0.5 print:text-black">às</span>
                <div className="w-16">
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.horarioSolicitanteFim}
                      onChange={e => onChange?.('horarioSolicitanteFim', e.target.value)}
                      placeholder="19:00"
                      className="w-full px-1 py-0.5 text-[9.5px] font-bold text-center text-slate-900 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E7B86]"
                    />
                  ) : (
                    <div className="border-b border-slate-400 min-h-[16px] text-center font-bold text-slate-900 print:text-black print:border-black">
                      {data.horarioSolicitanteFim || '______'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bloco 2: Funcionário Solicitado (Substituto) */}
          <div className="space-y-1 pt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 print:bg-black"></span>
              <span className="font-extrabold text-slate-800 text-[10px] print:text-black whitespace-nowrap">
                Funcionário Solicitado:
              </span>
              <div className="flex-1">
                {isEditable ? (
                  <input
                    type="text"
                    value={data.funcionarioSolicitado}
                    onChange={e => onChange?.('funcionarioSolicitado', e.target.value)}
                    placeholder="Nome completo do colaborador que substituirá"
                    className="w-full px-2 py-0.5 text-[10px] font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E7B86]"
                  />
                ) : (
                  <div className="border-b border-slate-400 min-h-[16px] px-1 font-bold text-slate-900 print:text-black print:border-black">
                    {data.funcionarioSolicitado || '___________________________________________________________________'}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 items-center pl-3">
              <div className="sm:col-span-6 flex items-center gap-1.5">
                <span className="font-semibold text-slate-700 text-[9.5px] print:text-black whitespace-nowrap">
                  Data do Plantão Solicitado:
                </span>
                <div className="flex-1">
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.dataPlantaoSolicitado}
                      onChange={e => onChange?.('dataPlantaoSolicitado', e.target.value)}
                      placeholder="DD/MM/AAAA"
                      className="w-full px-1.5 py-0.5 text-[9.5px] font-bold text-center text-slate-900 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E7B86]"
                    />
                  ) : (
                    <div className="border-b border-slate-400 min-h-[16px] text-center font-bold text-slate-900 print:text-black print:border-black">
                      {data.dataPlantaoSolicitado || '____/____/_____'}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6 flex items-center gap-1 justify-end">
                <span className="font-semibold text-slate-700 text-[9.5px] print:text-black whitespace-nowrap">
                  Horário:
                </span>
                <div className="w-16">
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.horarioSolicitadoInicio}
                      onChange={e => onChange?.('horarioSolicitadoInicio', e.target.value)}
                      placeholder="07:00"
                      className="w-full px-1 py-0.5 text-[9.5px] font-bold text-center text-slate-900 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E7B86]"
                    />
                  ) : (
                    <div className="border-b border-slate-400 min-h-[16px] text-center font-bold text-slate-900 print:text-black print:border-black">
                      {data.horarioSolicitadoInicio || '_____'}
                    </div>
                  )}
                </div>
                <span className="font-bold text-slate-500 px-0.5 print:text-black">às</span>
                <div className="w-16">
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.horarioSolicitadoFim}
                      onChange={e => onChange?.('horarioSolicitadoFim', e.target.value)}
                      placeholder="19:00"
                      className="w-full px-1 py-0.5 text-[9.5px] font-bold text-center text-slate-900 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E7B86]"
                    />
                  ) : (
                    <div className="border-b border-slate-400 min-h-[16px] text-center font-bold text-slate-900 print:text-black print:border-black">
                      {data.horarioSolicitadoFim || '______'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: FUNÇÃO DO COLABORADOR */}
        <div className="border border-slate-300 rounded-lg p-2.5 mb-1.5 bg-white shadow-2xs print:border-black print:rounded-none">
          <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-200 print:border-black">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-900 uppercase tracking-wider text-[10px] print:text-black">
                FUNÇÃO:
              </span>
              <span className="text-[9px] text-slate-400 font-medium print:hidden">
                (Selecione a categoria do colaborador para a troca)
              </span>
            </div>

            {isEditable && (
              <span className="text-[8.5px] font-bold text-[#0E7B86] bg-[#EBF7F8] px-1.5 py-0.5 rounded border border-[#C4E5E8] print:hidden">
                Clique para marcar ( X )
              </span>
            )}
          </div>

          {/* 2 Colunas Exatas da Folha Oficial */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[10px]">
            {/* Coluna 1 */}
            <div className="space-y-0.5">
              {FUNCOES_COLUNA_1.map((label) => {
                const checked = isFuncaoChecked(label);
                return (
                  <div
                    key={label}
                    onClick={() => {
                      if (isEditable) handleToggleFuncao(label);
                    }}
                    className={`flex items-center gap-2 transition-all select-none rounded p-0.5 ${
                      isEditable 
                        ? checked 
                          ? 'bg-[#EBF7F8] border border-[#C4E5E8] text-[#0E7B86] cursor-pointer' 
                          : 'hover:bg-slate-50 border border-transparent cursor-pointer'
                        : ''
                    }`}
                  >
                    <span className={`font-mono text-[10px] font-black w-5 text-center whitespace-pre ${
                      checked ? 'text-[#0E7B86] print:text-black' : 'text-slate-700 print:text-black'
                    }`}>
                      ({checked ? ' X ' : '   '})
                    </span>

                    <span className={`text-[10px] leading-tight ${
                      checked ? 'font-black text-slate-900 print:font-bold' : 'font-medium text-slate-800'
                    }`}>
                      {label}
                    </span>

                    {checked && isEditable && (
                      <CheckCircle2 className="w-3 h-3 text-[#0E7B86] ml-auto mr-1 print:hidden flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Coluna 2 */}
            <div className="space-y-0.5">
              {FUNCOES_COLUNA_2.map((label) => {
                const checked = isFuncaoChecked(label);
                return (
                  <div
                    key={label}
                    onClick={() => {
                      if (isEditable) handleToggleFuncao(label);
                    }}
                    className={`flex items-center gap-2 transition-all select-none rounded p-0.5 ${
                      isEditable 
                        ? checked 
                          ? 'bg-[#EBF7F8] border border-[#C4E5E8] text-[#0E7B86] cursor-pointer' 
                          : 'hover:bg-slate-50 border border-transparent cursor-pointer'
                        : ''
                    }`}
                  >
                    <span className={`font-mono text-[10px] font-black w-5 text-center whitespace-pre ${
                      checked ? 'text-[#0E7B86] print:text-black' : 'text-slate-700 print:text-black'
                    }`}>
                      ({checked ? ' X ' : '   '})
                    </span>

                    <span className={`text-[10px] leading-tight ${
                      checked ? 'font-black text-slate-900 print:font-bold' : 'font-medium text-slate-800'
                    }`}>
                      {label}
                    </span>

                    {checked && isEditable && (
                      <CheckCircle2 className="w-3 h-3 text-[#0E7B86] ml-auto mr-1 print:hidden flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 3: Normas e Regras de Troca de Plantão */}
        <div className="border border-slate-300 rounded-lg p-2 mb-1.5 bg-slate-50/70 text-[8.5px] leading-tight shadow-2xs print:border-black print:rounded-none print:bg-transparent">
          <div className="flex items-center gap-1 mb-1">
            <ShieldCheck className="w-3 h-3 text-[#0E7B86] print:text-black flex-shrink-0" />
            <span className="font-extrabold text-slate-900 print:text-black">
              Fica assegurada a troca de plantões entre trabalhadores com limites de no máximo 02 (duas) ao mês, desde que cumpra-se o seguinte:
            </span>
          </div>

          <ol className="list-decimal pl-4 space-y-0.5 text-slate-700 print:text-black font-medium">
            <li>Deve ser informado à Supervisão do setor e ao RH da empresa com intervalo mínimo de <strong>48 (quarenta e oito) horas de antecedência</strong>;</li>
            <li>Será permitida apenas <strong>uma troca por mês</strong> entre o titular do plantão, seu substituto, e vice-versa;</li>
            <li>O Formulário deve constar a <strong>assinatura do trabalhador titular do plantão, do substituto e da supervisão de setor</strong> para protocolo junto ao RH;</li>
            <li>Após o acordo firmado, a <strong>responsabilidade do cumprimento do plantão será toda do trabalhador substituto</strong>;</li>
            <li>Será permitida a troca de plantões caso o profissional não extrapole a jornada máxima permitida;</li>
            <li>As trocas devem ser realizadas dentro do mesmo período de fechamento, sendo de <strong>21 a 20 de cada mês</strong>;</li>
            <li>Não será aceito formulários de trocas com erro de preenchimento.</li>
          </ol>
        </div>

        {/* Card 4: JUSTIFICATIVA DO SOLICITANTE */}
        <div className="border border-slate-300 rounded-lg mb-1.5 overflow-hidden shadow-2xs print:border-black print:rounded-none">
          <div className="bg-slate-100 py-0.5 px-2 border-b border-slate-200 text-center font-black text-[9.5px] uppercase tracking-wider text-slate-800 print:border-black print:bg-slate-200 print:text-black">
            JUSTIFICATIVA DO SOLICITANTE
          </div>
          <div className="p-2 bg-white">
            {isEditable ? (
              <textarea
                rows={2}
                value={data.justificativaSolicitante}
                onChange={e => onChange?.('justificativaSolicitante', e.target.value)}
                placeholder="Descreva detalhadamente o motivo da solicitação da troca de plantão..."
                className="w-full outline-none text-[9.5px] bg-slate-50 p-1.5 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-[#0E7B86] print:border-none print:bg-transparent resize-none leading-tight"
              />
            ) : (
              <div className="min-h-[28px] text-[9.5px] text-slate-800 print:text-black whitespace-pre-wrap leading-tight">
                {data.justificativaSolicitante || (
                  <div className="space-y-2 pt-0.5">
                    <div className="border-b border-slate-300 print:border-black h-3"></div>
                  </div>
                )}
              </div>
            )}

            {/* Assinaturas Solicitante e Solicitado */}
            <div className="grid grid-cols-2 gap-6 pt-4 pb-0.5 text-center">
              <div>
                <div className="border-t border-slate-400 print:border-black w-4/5 mx-auto"></div>
                <span className="block text-[8.5px] font-bold text-slate-800 print:text-black mt-0.5 uppercase tracking-wider">
                  Assinatura Solicitante
                </span>
              </div>
              <div>
                <div className="border-t border-slate-400 print:border-black w-4/5 mx-auto"></div>
                <span className="block text-[8.5px] font-bold text-slate-800 print:text-black mt-0.5 uppercase tracking-wider">
                  Assinatura Solicitado
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: JUSTIFICATIVA DO SUPERVISOR */}
        <div className="border border-slate-300 rounded-lg mb-1.5 overflow-hidden shadow-2xs print:border-black print:rounded-none">
          <div className="bg-slate-100 py-0.5 px-2 border-b border-slate-200 text-center font-black text-[9.5px] uppercase tracking-wider text-slate-800 print:border-black print:bg-slate-200 print:text-black">
            JUSTIFICATIVA DO SUPERVISOR
          </div>
          <div className="p-2 bg-white">
            {isEditable ? (
              <textarea
                rows={1}
                value={data.justificativaSupervisor}
                onChange={e => onChange?.('justificativaSupervisor', e.target.value)}
                placeholder="Parecer da supervisão sobre a viabilidade operacional e cobertura assistencial do setor..."
                className="w-full outline-none text-[9.5px] bg-slate-50 p-1.5 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-[#0E7B86] print:border-none print:bg-transparent resize-none leading-tight"
              />
            ) : (
              <div className="min-h-[22px] text-[9.5px] text-slate-800 print:text-black whitespace-pre-wrap leading-tight">
                {data.justificativaSupervisor || (
                  <div className="border-b border-slate-300 print:border-black h-3"></div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card 6: APROVAÇÃO */}
        <div className="border border-slate-300 rounded-lg mb-1.5 overflow-hidden shadow-2xs print:border-black print:rounded-none">
          <div className="bg-slate-100 py-0.5 px-2 border-b border-slate-200 text-center font-black text-[9.5px] uppercase tracking-wider text-slate-800 print:border-black print:bg-slate-200 print:text-black">
            APROVAÇÃO
          </div>
          <div className="p-2.5 bg-white space-y-2.5">
            {/* Linha da Data em Palmas - TO */}
            <div className="flex items-center justify-center gap-1.5 text-[9.5px]">
              <span className="font-bold text-slate-900 print:text-black">Palmas - TO,</span>
              <div className="w-10 text-center">
                {isEditable ? (
                  <input
                    type="text"
                    value={data.diaAprovacao}
                    onChange={e => onChange?.('diaAprovacao', e.target.value)}
                    placeholder="DD"
                    className="w-full px-1 py-0.5 text-[9.5px] font-bold text-center bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-[#0E7B86]"
                  />
                ) : (
                  <div className="border-b border-slate-400 print:border-black font-bold text-slate-900 print:text-black min-h-[16px]">
                    {data.diaAprovacao || '______'}
                  </div>
                )}
              </div>
              <span className="text-slate-600 print:text-black">de</span>
              <div className="w-32 text-center">
                {isEditable ? (
                  <input
                    type="text"
                    value={data.mesAprovacao}
                    onChange={e => onChange?.('mesAprovacao', e.target.value)}
                    placeholder="Mês por extenso"
                    className="w-full px-1.5 py-0.5 text-[9.5px] font-bold text-center bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-[#0E7B86]"
                  />
                ) : (
                  <div className="border-b border-slate-400 print:border-black font-bold text-slate-900 print:text-black min-h-[16px]">
                    {data.mesAprovacao || '______________'}
                  </div>
                )}
              </div>
              <span className="text-slate-600 print:text-black">de</span>
              <div className="w-14 text-center">
                {isEditable ? (
                  <input
                    type="text"
                    value={data.anoAprovacao}
                    onChange={e => onChange?.('anoAprovacao', e.target.value)}
                    placeholder="AAAA"
                    className="w-full px-1 py-0.5 text-[9.5px] font-bold text-center bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-1 focus:ring-[#0E7B86]"
                  />
                ) : (
                  <div className="border-b border-slate-400 print:border-black font-bold text-slate-900 print:text-black min-h-[16px]">
                    {data.anoAprovacao || '_________'}
                  </div>
                )}
              </div>
            </div>

            {/* Assinaturas da Supervisão do Setor e Recursos Humanos */}
            <div className="grid grid-cols-2 gap-6 pt-4 pb-1 text-center">
              <div>
                <div className="border-t border-slate-400 print:border-black w-4/5 mx-auto"></div>
                <span className="block text-[8.5px] font-bold text-slate-800 print:text-black mt-0.5 uppercase tracking-wider">
                  Supervisão do Setor
                </span>
              </div>
              <div>
                <div className="border-t border-slate-400 print:border-black w-4/5 mx-auto"></div>
                <span className="block text-[8.5px] font-bold text-slate-800 print:text-black mt-0.5 uppercase tracking-wider">
                  Recursos Humanos
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 7: Rodapé de Lançamento no Sistema */}
        <div className="border border-slate-300 rounded-lg p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[9.5px] bg-slate-50/60 shadow-2xs print:border-black print:rounded-none print:bg-transparent">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-800 print:text-black whitespace-nowrap">
              Lançado no sistema:
            </span>
            <div className="w-28">
              {isEditable ? (
                <input
                  type="text"
                  value={data.dataLancadoSistema}
                  onChange={e => onChange?.('dataLancadoSistema', e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="w-full px-1.5 py-0.5 text-[9.5px] font-bold text-center bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#0E7B86]"
                />
              ) : (
                <div className="border-b border-slate-400 print:border-black text-center font-bold text-slate-900 print:text-black min-h-[16px]">
                  {data.dataLancadoSistema || '____/____/_____'}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-1 sm:max-w-xs">
            <span className="font-extrabold text-slate-800 print:text-black whitespace-nowrap">
              Visto:
            </span>
            <div className="flex-1">
              {isEditable ? (
                <input
                  type="text"
                  value={data.vistoLancado}
                  onChange={e => onChange?.('vistoLancado', e.target.value)}
                  placeholder="Visto do responsável"
                  className="w-full px-1.5 py-0.5 text-[9.5px] font-bold bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#0E7B86]"
                />
              ) : (
                <div className="border-b border-slate-400 print:border-black font-bold text-slate-900 print:text-black min-h-[16px] px-1">
                  {data.vistoLancado || '________________________________________'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
