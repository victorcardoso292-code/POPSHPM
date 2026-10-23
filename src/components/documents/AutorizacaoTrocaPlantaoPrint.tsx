import React from 'react';

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

const FUNCOES_DISPONIVEIS = [
  { id: 'enfermeiro', label: 'Enfermeiro(a)' },
  { id: 'copeira', label: 'Copeira' },
  { id: 'tec-enfermagem', label: 'Téc. Em Enfermagem' },
  { id: 'fisioterapeuta', label: 'Fisioterapeuta' },
  { id: 'recepcionista', label: 'Recepcionista' },
  { id: 'nutricionista', label: 'Nutricionista' },
  { id: 'servicos-gerais', label: 'Serviços Gerais' },
  { id: 'farmaceutico', label: 'Farmacêutico(a) ou Auxiliar de Farmácia' },
];

export const AutorizacaoTrocaPlantaoPrint: React.FC<AutorizacaoTrocaPlantaoPrintProps> = ({
  data,
  onChange,
  isEditable = false
}) => {
  return (
    <div 
      className="text-black bg-white p-4 sm:p-8 max-w-[820px] mx-auto text-[11px] leading-tight border border-black print:border-none print:p-0 rounded-none shadow-xs page-break-avoid"
      style={{ fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}
    >
      {/* Top Logo Rede Medical */}
      <div className="flex items-center justify-end pb-2">
        <div className="flex items-center gap-2">
          {/* Stylized Cross Logo */}
          <div className="text-[#0E7B86] flex items-center justify-center">
            <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" stroke="#0E7B86" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8 H24 V16 H32 V24 H24 V32 H16 V24 H8 V16 H16 Z" />
              <path d="M10 16 C6 16 6 24 10 24" />
            </svg>
          </div>
          <div className="text-left leading-none">
            <span className="block text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
              Rede
            </span>
            <span className="block text-xl font-black text-[#0E7B86] tracking-tight">
              Medical
            </span>
          </div>
        </div>
      </div>

      {/* Título Principal em Caixa de Borda Sólida */}
      <div className="border border-black bg-slate-50/60 py-2 px-3 text-center mb-0">
        <h1 className="text-[13px] sm:text-[14px] font-black uppercase tracking-wider text-black m-0">
          AUTORIZAÇÃO PARA TROCA DE PLANTÃO
        </h1>
      </div>

      {/* Caixa 1: Dados dos Funcionários Solicitante e Solicitado */}
      <div className="border-x border-b border-black p-3 space-y-2.5 bg-white text-[11px]">
        {/* Funcionário Solicitante */}
        <div className="flex items-end gap-1.5 flex-wrap sm:flex-nowrap">
          <span className="font-bold whitespace-nowrap text-black">Funcionário Solicitante:</span>
          <div className="border-b border-black flex-1 min-h-[20px] pb-0.5">
            {isEditable ? (
              <input
                type="text"
                value={data.funcionarioSolicitante}
                onChange={e => onChange?.('funcionarioSolicitante', e.target.value)}
                placeholder="Nome completo do colaborador solicitante"
                className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent px-1 font-bold"
              />
            ) : (
              <span className="font-bold text-black px-1">{data.funcionarioSolicitante}</span>
            )}
          </div>
        </div>

        {/* Data e Horário Solicitante */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
          <div className="sm:col-span-6 flex items-end gap-1.5">
            <span className="font-bold whitespace-nowrap text-black">Data do Plantão Solicitante:</span>
            <div className="border-b border-black flex-1 min-h-[20px] pb-0.5">
              {isEditable ? (
                <input
                  type="text"
                  value={data.dataPlantaoSolicitante}
                  onChange={e => onChange?.('dataPlantaoSolicitante', e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent text-center font-bold"
                />
              ) : (
                <span className="font-bold text-black text-center block">{data.dataPlantaoSolicitante || '___/___/_____'}</span>
              )}
            </div>
          </div>

          <div className="sm:col-span-6 flex items-end gap-1.5">
            <span className="font-bold whitespace-nowrap text-black">Horário:</span>
            <div className="border-b border-black w-20 min-h-[20px] pb-0.5 text-center">
              {isEditable ? (
                <input
                  type="text"
                  value={data.horarioSolicitanteInicio}
                  onChange={e => onChange?.('horarioSolicitanteInicio', e.target.value)}
                  placeholder="07:00"
                  className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent text-center font-bold"
                />
              ) : (
                <span className="font-bold text-black">{data.horarioSolicitanteInicio || '_____'}</span>
              )}
            </div>
            <span className="font-bold text-black">às</span>
            <div className="border-b border-black flex-1 min-h-[20px] pb-0.5 text-center">
              {isEditable ? (
                <input
                  type="text"
                  value={data.horarioSolicitanteFim}
                  onChange={e => onChange?.('horarioSolicitanteFim', e.target.value)}
                  placeholder="19:00"
                  className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent text-center font-bold"
                />
              ) : (
                <span className="font-bold text-black">{data.horarioSolicitanteFim || '______'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Funcionário Solicitado */}
        <div className="flex items-end gap-1.5 flex-wrap sm:flex-nowrap pt-1">
          <span className="font-bold whitespace-nowrap text-black">Funcionário Solicitado:</span>
          <div className="border-b border-black flex-1 min-h-[20px] pb-0.5">
            {isEditable ? (
              <input
                type="text"
                value={data.funcionarioSolicitado}
                onChange={e => onChange?.('funcionarioSolicitado', e.target.value)}
                placeholder="Nome completo do colaborador que substituirá"
                className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent px-1 font-bold"
              />
            ) : (
              <span className="font-bold text-black px-1">{data.funcionarioSolicitado}</span>
            )}
          </div>
        </div>

        {/* Data e Horário Solicitado */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
          <div className="sm:col-span-6 flex items-end gap-1.5">
            <span className="font-bold whitespace-nowrap text-black">Data do Plantão Solicitado:</span>
            <div className="border-b border-black flex-1 min-h-[20px] pb-0.5">
              {isEditable ? (
                <input
                  type="text"
                  value={data.dataPlantaoSolicitado}
                  onChange={e => onChange?.('dataPlantaoSolicitado', e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent text-center font-bold"
                />
              ) : (
                <span className="font-bold text-black text-center block">{data.dataPlantaoSolicitado || '___/___/_____'}</span>
              )}
            </div>
          </div>

          <div className="sm:col-span-6 flex items-end gap-1.5">
            <span className="font-bold whitespace-nowrap text-black">Horário:</span>
            <div className="border-b border-black w-20 min-h-[20px] pb-0.5 text-center">
              {isEditable ? (
                <input
                  type="text"
                  value={data.horarioSolicitadoInicio}
                  onChange={e => onChange?.('horarioSolicitadoInicio', e.target.value)}
                  placeholder="07:00"
                  className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent text-center font-bold"
                />
              ) : (
                <span className="font-bold text-black">{data.horarioSolicitadoInicio || '_____'}</span>
              )}
            </div>
            <span className="font-bold text-black">às</span>
            <div className="border-b border-black flex-1 min-h-[20px] pb-0.5 text-center">
              {isEditable ? (
                <input
                  type="text"
                  value={data.horarioSolicitadoFim}
                  onChange={e => onChange?.('horarioSolicitadoFim', e.target.value)}
                  placeholder="19:00"
                  className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent text-center font-bold"
                />
              ) : (
                <span className="font-bold text-black">{data.horarioSolicitadoFim || '______'}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Caixa 2: FUNÇÃO */}
      <div className="border-x border-b border-black p-3 bg-white">
        <span className="font-bold text-black uppercase tracking-wider block mb-2">FUNÇÃO:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6 text-[11px]">
          {FUNCOES_DISPONIVEIS.map((f) => {
            const isChecked = data.funcao === f.label || data.funcao === f.id;
            return (
              <label 
                key={f.id} 
                className={`flex items-center gap-2 cursor-pointer ${isEditable ? 'hover:text-[#0E7B86]' : ''}`}
                onClick={() => {
                  if (isEditable) {
                    onChange?.('funcao', isChecked ? '' : f.label);
                  }
                }}
              >
                <span className="font-mono text-xs font-bold w-4 text-center">
                  ( {isChecked ? 'X' : ' '} )
                </span>
                <span className={isChecked ? 'font-black text-black' : 'text-black'}>
                  {f.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Caixa 3: Normas e Regras de Troca de Plantão */}
      <div className="border-x border-b border-black p-3 bg-slate-50/40 text-[10px] leading-tight space-y-1.5">
        <p className="font-bold text-black">
          Fica assegurado a troca de plantões entre trabalhadores com limites de no máximo 02 (duas) ao mês, desde que cumpra-se o seguinte:
        </p>
        <ol className="list-decimal pl-4 space-y-1 text-black font-normal">
          <li>Deve ser informado a Supervisão do setor e ao RH da empresa com intervalo mínimo 48 (Quarenta e Oito) horas de antecedência;</li>
          <li>Será permitida apenas uma troca por mês entre o titular do plantão, seu substituto, e vice-versa;</li>
          <li>O Formulário deve constar a assinatura do trabalhador titular do plantão, do substituto e da supervisão de setor para protocolo junto ao RH;</li>
          <li>Após o acordo firmado, a responsabilidade do cumprimento do plantão será toda do trabalhador substituto;</li>
          <li>Será permitida a troca de plantões caso o profissional não extrapole a jornada máxima permitida;</li>
          <li>As trocas devem ser realizadas dentro do mesmo período de fechamento, sendo de 21 a 20 de cada mês.</li>
          <li>Não será aceito formulários de trocas com erro de preenchimento.</li>
        </ol>
      </div>

      {/* Caixa 4: JUSTIFICATIVA DO SOLICITANTE */}
      <div className="border-x border-b border-black">
        <div className="border-b border-black bg-slate-100/70 py-1 px-3 text-center font-bold text-[11px] uppercase tracking-wider text-black">
          JUSTIFICATIVA DO SOLICITANTE
        </div>
        <div className="p-3">
          {isEditable ? (
            <textarea
              rows={3}
              value={data.justificativaSolicitante}
              onChange={e => onChange?.('justificativaSolicitante', e.target.value)}
              placeholder="Descreva a justificativa e o motivo da solicitação da troca de plantão..."
              className="w-full outline-none text-[11px] bg-amber-50/40 p-2 border border-slate-200 rounded-sm print:border-none print:bg-transparent resize-none leading-relaxed"
            />
          ) : (
            <div className="min-h-[50px] text-[11px] text-black whitespace-pre-wrap leading-relaxed">
              {data.justificativaSolicitante || (
                <div className="space-y-3 pt-1">
                  <div className="border-b border-slate-300 h-4"></div>
                  <div className="border-b border-slate-300 h-4"></div>
                </div>
              )}
            </div>
          )}

          {/* Assinaturas Solicitante e Solicitado */}
          <div className="grid grid-cols-2 gap-8 pt-8 pb-1 text-center">
            <div>
              <div className="border-t border-black w-4/5 mx-auto"></div>
              <span className="block text-[10px] font-bold text-black mt-1">Assinatura Solicitante</span>
            </div>
            <div>
              <div className="border-t border-black w-4/5 mx-auto"></div>
              <span className="block text-[10px] font-bold text-black mt-1">Assinatura Solicitado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Caixa 5: JUSTIFICATIVA DO SUPERVISOR */}
      <div className="border-x border-b border-black">
        <div className="border-b border-black bg-slate-100/70 py-1 px-3 text-center font-bold text-[11px] uppercase tracking-wider text-black">
          JUSTIFICATIVA DO SUPERVISOR
        </div>
        <div className="p-3">
          {isEditable ? (
            <textarea
              rows={2}
              value={data.justificativaSupervisor}
              onChange={e => onChange?.('justificativaSupervisor', e.target.value)}
              placeholder="Parecer da supervisão sobre a viabilidade operacional e cobertura do setor..."
              className="w-full outline-none text-[11px] bg-amber-50/40 p-2 border border-slate-200 rounded-sm print:border-none print:bg-transparent resize-none leading-relaxed"
            />
          ) : (
            <div className="min-h-[35px] text-[11px] text-black whitespace-pre-wrap leading-relaxed">
              {data.justificativaSupervisor || (
                <div className="space-y-3 pt-1">
                  <div className="border-b border-slate-300 h-4"></div>
                  <div className="border-b border-slate-300 h-4"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Caixa 6: APROVAÇÃO */}
      <div className="border-x border-b border-black">
        <div className="border-b border-black bg-slate-100/70 py-1 px-3 text-center font-bold text-[11px] uppercase tracking-wider text-black">
          APROVAÇÃO
        </div>
        <div className="p-3 space-y-4">
          {/* Linha da Data em Palmas - TO */}
          <div className="flex items-end justify-center gap-1.5 text-[11px]">
            <span className="font-bold text-black">Palmas - TO,</span>
            <div className="border-b border-black w-10 text-center pb-0.5">
              {isEditable ? (
                <input
                  type="text"
                  value={data.diaAprovacao}
                  onChange={e => onChange?.('diaAprovacao', e.target.value)}
                  placeholder="DD"
                  className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent text-center font-bold"
                />
              ) : (
                <span className="font-bold text-black">{data.diaAprovacao || '______'}</span>
              )}
            </div>
            <span className="text-black">de</span>
            <div className="border-b border-black w-36 text-center pb-0.5">
              {isEditable ? (
                <input
                  type="text"
                  value={data.mesAprovacao}
                  onChange={e => onChange?.('mesAprovacao', e.target.value)}
                  placeholder="Mês por extenso"
                  className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent text-center font-bold"
                />
              ) : (
                <span className="font-bold text-black">{data.mesAprovacao || '______________'}</span>
              )}
            </div>
            <span className="text-black">de</span>
            <div className="border-b border-black w-16 text-center pb-0.5">
              {isEditable ? (
                <input
                  type="text"
                  value={data.anoAprovacao}
                  onChange={e => onChange?.('anoAprovacao', e.target.value)}
                  placeholder="AAAA"
                  className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent text-center font-bold"
                />
              ) : (
                <span className="font-bold text-black">{data.anoAprovacao || '_________'}</span>
              )}
            </div>
          </div>

          {/* Assinaturas da Supervisão do Setor e Recursos Humanos */}
          <div className="grid grid-cols-2 gap-8 pt-6 pb-2 text-center">
            <div>
              <div className="border-t border-black w-4/5 mx-auto"></div>
              <span className="block text-[10px] font-bold text-black mt-1">Supervisão do Setor</span>
            </div>
            <div>
              <div className="border-t border-black w-4/5 mx-auto"></div>
              <span className="block text-[10px] font-bold text-black mt-1">Recursos Humanos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Caixa 7: Rodapé de Lançamento no Sistema */}
      <div className="border-x border-b border-black p-2.5 flex items-end justify-between gap-4 text-[11px] bg-white">
        <div className="flex items-end gap-1.5">
          <span className="font-bold text-black whitespace-nowrap">Lançado no sistema</span>
          <div className="border-b border-black w-28 text-center pb-0.5">
            {isEditable ? (
              <input
                type="text"
                value={data.dataLancadoSistema}
                onChange={e => onChange?.('dataLancadoSistema', e.target.value)}
                placeholder="DD/MM/AAAA"
                className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent text-center font-bold"
              />
            ) : (
              <span className="font-bold text-black">{data.dataLancadoSistema || '____/____/_____'}</span>
            )}
          </div>
        </div>

        <div className="flex items-end gap-1.5 flex-1">
          <span className="font-bold text-black whitespace-nowrap">Visto:</span>
          <div className="border-b border-black flex-1 min-h-[18px] pb-0.5">
            {isEditable ? (
              <input
                type="text"
                value={data.vistoLancado}
                onChange={e => onChange?.('vistoLancado', e.target.value)}
                placeholder="Assinatura / Visto do responsável pelo lançamento"
                className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent px-1 font-bold"
              />
            ) : (
              <span className="font-bold text-black px-1">{data.vistoLancado}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
