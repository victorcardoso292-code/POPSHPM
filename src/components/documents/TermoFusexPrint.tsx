import React from 'react';
import { AlertTriangle } from 'lucide-react';

export interface TermoFusexData {
  nomeTitular: string;
  nomeDependente: string;
  precCp: string;
  especialidade: string;
  dataAtendimento: string;
  horaEmissao: string;
  telefone1: string;
  telefone2: string;
  hospitalNome: string;
  diaData: string;
  mesData: string;
  anoData: string;
  identidadeResponsavel: string;
  recepcionista: string;
}

interface TermoFusexPrintProps {
  data: TermoFusexData;
  onChange?: (field: keyof TermoFusexData, val: string) => void;
  isEditable?: boolean;
}

export const TermoFusexPrint: React.FC<TermoFusexPrintProps> = ({
  data,
  onChange,
  isEditable = false
}) => {
  return (
    <div 
      className="bg-white text-black p-6 sm:p-10 max-w-[800px] mx-auto border border-slate-300 print:border-none print:p-0 page-break-avoid"
      style={{ fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}
    >
      {/* Aviso Operacional de Duas Vias (Com sinal de alerta piscando) */}
      <div className="mb-4 p-2.5 bg-amber-50 border-2 border-amber-500 rounded-xl flex items-center justify-center gap-2.5 text-amber-950 font-black text-xs uppercase tracking-wide print:border-black print:border print:bg-transparent print:p-1.5 print:mb-3 print:text-[10px] select-none shadow-xs">
        <AlertTriangle className="w-4 h-4 text-red-600 animate-alert-icon flex-shrink-0 print:hidden" />
        <span className="text-center">
          AVISO: IMPRIMIR DUAS VIAS, UMA DO PACIENTE E OUTRA ANEXAR AO PRONTUÁRIO
        </span>
        <AlertTriangle className="w-4 h-4 text-red-600 animate-alert-icon flex-shrink-0 print:hidden" />
      </div>

      {/* Header Oficial ABNT - Sem a estrela */}
      <div className="text-center space-y-1 mb-5">
        <p className="font-bold uppercase tracking-wider text-[12px] m-0 text-black">
          MINISTÉRIO DA DEFESA
        </p>
        <p className="font-bold uppercase tracking-wider text-[12px] m-0 text-black">
          EXÉRCITO BRASILEIRO
        </p>
        <p className="font-bold uppercase tracking-wider text-[11px] m-0 text-black">
          CMP – 3ª BDA INF MTZ
        </p>
        <p className="font-bold uppercase tracking-wider text-[11px] m-0 text-black">
          22º BATALHÃO DE INFANTARIA
        </p>
        <p className="font-bold uppercase tracking-wider text-[11px] m-0 text-black">
          BATALHÃO TOCANTINS
        </p>
        <div className="pt-2">
          <h3 className="font-bold uppercase text-[13px] tracking-normal inline-block border-t border-black pt-1 m-0 text-black">
            TERMO DE COMPROMISSO PARA ENTREGA DA GUIA DE ENCAMINHAMENTO
          </h3>
        </div>
      </div>

      {/* Grid de Campos de Identificação ABNT */}
      <div className="border border-black divide-y divide-black text-[11px] mb-4">
        {/* Nome do Titular */}
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-black">
          <div className="w-full sm:w-56 p-1.5 font-bold bg-slate-50 flex items-center text-black">
            Nome do titular do FUSEx:
          </div>
          <div className="flex-1 p-1.5 min-h-[26px] flex items-center">
            {isEditable ? (
              <input
                type="text"
                value={data.nomeTitular}
                onChange={e => onChange?.('nomeTitular', e.target.value)}
                placeholder="Nome do militar / titular"
                className="w-full text-[11px] outline-none bg-amber-50/50 print:bg-transparent"
                style={{ fontFamily: 'Arial, sans-serif' }}
              />
            ) : (
              <span className="font-medium">{data.nomeTitular}</span>
            )}
          </div>
        </div>

        {/* Nome do dependente */}
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-black">
          <div className="w-full sm:w-56 p-1.5 font-bold bg-slate-50 flex items-center text-black">
            Nome do dependente (paciente):
          </div>
          <div className="flex-1 p-1.5 min-h-[26px] flex items-center">
            {isEditable ? (
              <input
                type="text"
                value={data.nomeDependente}
                onChange={e => onChange?.('nomeDependente', e.target.value)}
                placeholder="Nome completo do paciente atendido"
                className="w-full text-[11px] outline-none bg-amber-50/50 print:bg-transparent"
                style={{ fontFamily: 'Arial, sans-serif' }}
              />
            ) : (
              <span className="font-medium">{data.nomeDependente}</span>
            )}
          </div>
        </div>

        {/* Prec Cp */}
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-black">
          <div className="w-full sm:w-56 p-1.5 font-bold bg-slate-50 flex items-center text-black">
            Prec Cp:
          </div>
          <div className="flex-1 p-1.5 min-h-[26px] flex items-center">
            {isEditable ? (
              <input
                type="text"
                value={data.precCp}
                onChange={e => onChange?.('precCp', e.target.value)}
                placeholder="Número Prec Cp"
                className="w-full text-[11px] outline-none bg-amber-50/50 print:bg-transparent"
                style={{ fontFamily: 'Arial, sans-serif' }}
              />
            ) : (
              <span className="font-medium">{data.precCp}</span>
            )}
          </div>
        </div>

        {/* Especialidade atendida */}
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-black">
          <div className="w-full sm:w-56 p-1.5 font-bold bg-slate-50 flex items-center text-black">
            Especialidade atendida:
          </div>
          <div className="flex-1 p-1.5 min-h-[26px] flex items-center">
            {isEditable ? (
              <input
                type="text"
                value={data.especialidade}
                onChange={e => onChange?.('especialidade', e.target.value)}
                placeholder="Ex.: Pronto-Socorro / Urgência Adulto"
                className="w-full text-[11px] outline-none bg-amber-50/50 print:bg-transparent"
                style={{ fontFamily: 'Arial, sans-serif' }}
              />
            ) : (
              <span className="font-medium">{data.especialidade}</span>
            )}
          </div>
        </div>

        {/* Data de atendimento & Hora */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-black">
          <div className="flex divide-x divide-black">
            <div className="w-44 sm:w-56 p-1.5 font-bold bg-slate-50 flex items-center text-black">
              Data de atendimento:
            </div>
            <div className="flex-1 p-1.5 text-center flex items-center justify-center">
              {isEditable ? (
                <input
                  type="text"
                  value={data.dataAtendimento}
                  onChange={e => onChange?.('dataAtendimento', e.target.value)}
                  placeholder="DD / MM / AAAA"
                  className="w-full text-center text-[11px] outline-none bg-amber-50/50 print:bg-transparent"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.dataAtendimento || '____ / ____ / ________'}</span>
              )}
            </div>
          </div>
          <div className="flex divide-x divide-black">
            <div className="w-36 p-1.5 font-bold bg-slate-50 flex items-center text-black">
              Hora da emissão:
            </div>
            <div className="flex-1 p-1.5 text-center flex items-center justify-center">
              {isEditable ? (
                <input
                  type="text"
                  value={data.horaEmissao}
                  onChange={e => onChange?.('horaEmissao', e.target.value)}
                  placeholder="HH : MM"
                  className="w-full text-center text-[11px] outline-none bg-amber-50/50 print:bg-transparent"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.horaEmissao || '____ : ____'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Telefone de contato do responsável */}
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-black">
          <div className="w-full sm:w-56 p-1.5 font-bold bg-slate-50 flex items-center text-black">
            Telefone de contato do responsável:
          </div>
          <div className="flex-1 p-1.5 grid grid-cols-2 divide-x divide-black">
            <div className="pr-2 flex items-center">
              <span className="font-bold mr-1">(</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.telefone1}
                  onChange={e => onChange?.('telefone1', e.target.value)}
                  placeholder="63) 99999-9999"
                  className="w-full text-[11px] outline-none bg-amber-50/50 print:bg-transparent"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.telefone1 ? `${data.telefone1}` : '   ) ________________'}</span>
              )}
            </div>
            <div className="pl-2 flex items-center">
              <span className="font-bold mr-1">(</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.telefone2}
                  onChange={e => onChange?.('telefone2', e.target.value)}
                  placeholder="63) 3215-0000"
                  className="w-full text-[11px] outline-none bg-amber-50/50 print:bg-transparent"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.telefone2 ? `${data.telefone2}` : '   ) ________________'}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Texto de Declaração Oficial ABNT (Justificado, Entrelinhas 1.5) */}
      <div className="text-[11.5px] text-justify space-y-3 mb-5 leading-relaxed text-black">
        <p>
          <strong>DECLARO</strong> que fui atendido(a), em caráter de <strong>URGÊNCIA e ou EMERGÊNCIA</strong> pelo Hospital{' '}
          {isEditable ? (
            <input
              type="text"
              value={data.hospitalNome}
              onChange={e => onChange?.('hospitalNome', e.target.value)}
              className="border-b border-black font-bold outline-none px-1 w-64 bg-amber-50/50 print:bg-transparent inline-block"
              style={{ fontFamily: 'Arial, sans-serif' }}
            />
          ) : (
            <span className="font-bold underline">{data.hospitalNome || 'Hospital Palmas Medical'}</span>
          )}{' '}
          e me comprometo a providenciar em até 48 (quarenta e oito) horas ou 2 (dois) dias úteis, a contar da data do atendimento, a Guia de Encaminhamento (Autorização).
        </p>

        <p>
          Estou ciente que o não cumprimento deste termo acarretará o pagamento integral das despesas realizadas, conforme Capítulo III da Urgência e Emergência, previstas nas Instruções Reguladoras para Assistência Médico Hospitalar aos Beneficiários do Fundo de Saúde do Exército (IR 30-38).
        </p>

        <div className="pl-4 border-l-2 border-slate-700 italic text-[10.5px] text-slate-900 leading-normal">
          “Art. 20. O FUSEx não se responsabilizará ou ressarcirá as despesas, caso não comprovada a urgência e/ou a emergência ou não tenham sido cumpridas as providências previstas nos arts. 18 e 19 das IR 30-38.”
        </div>
      </div>

      {/* Local e Data ABNT */}
      <div className="text-right text-[11.5px] mb-6 text-black">
        Palmas, TO, {data.diaData || '_______'} de {data.mesData || '_________________'} de 20{data.anoData || '____'}.
      </div>

      {/* Assinatura do Beneficiário */}
      <div className="space-y-4 mb-6">
        <div className="text-center pt-6 max-w-md mx-auto">
          <div className="border-t border-black mb-1.5"></div>
          <p className="font-bold text-[11px] m-0 text-black">Assinatura do beneficiário ou responsável</p>
          <div className="mt-3 text-left flex items-center gap-2 text-[11px]">
            <span className="font-bold text-black">Anotar a identidade:</span>
            <span className="border-b border-black flex-1 min-h-[18px]">
              {data.identidadeResponsavel}
            </span>
          </div>
        </div>
      </div>

      {/* Box OCS / Hospital */}
      <div className="border border-black p-3.5 text-[11px] space-y-2 bg-slate-50/50">
        <div className="text-center font-bold uppercase tracking-wider text-[11.5px] border-b border-black pb-1.5 text-black">
          A ser preenchido pela Organização Civil de Saúde/OCS
        </div>

        <p className="font-bold text-center m-0 text-[11px] text-black">
          Horário limite para a troca da guia autorizada do FUSEx: até 48 (quarenta e oito) horas ou 2 (dois) dias úteis, a contar da data do atendimento.
        </p>

        <p className="text-center m-0 text-[10.5px] text-slate-800">
          Srs. Beneficiários, a troca somente será realizada dentro do prazo e horários estabelecidos acima.
        </p>

        <div className="pt-8 max-w-sm mx-auto text-center">
          <div className="border-t border-black mb-1.5"></div>
          <p className="font-bold text-[11px] m-0 text-black">Assinatura da recepcionista</p>
          <p className="text-[10px] m-0 text-slate-700">Responsável pelo atendimento (legível)</p>
          {data.recepcionista && (
            <p className="text-[10px] font-bold mt-1 text-black">{data.recepcionista}</p>
          )}
        </div>

        <p className="font-bold text-[10px] pt-1.5 border-t border-slate-400 m-0 text-black">
          OBS: O hospital ficará com o termo original, e o responsável pelo paciente ficará com a cópia a ser trocada.
        </p>
      </div>
    </div>
  );
};
