import React from 'react';

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
    <div className="font-serif text-black bg-white p-6 sm:p-10 max-w-[800px] mx-auto text-xs leading-normal border border-slate-300 print:border-none print:p-0">
      {/* Header Brasão */}
      <div className="text-center space-y-1 mb-4">
        {/* SVG Brasão das Armas Nacionais / Exército */}
        <div className="flex justify-center mb-1.5">
          <svg className="w-16 h-16 text-slate-800" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 5 L61 35 L93 35 L67 55 L77 87 L50 68 L23 87 L33 55 L7 35 L39 35 Z" fill="#2d3748" opacity="0.85" />
            <circle cx="50" cy="50" r="18" fill="#1a202c" />
            <circle cx="50" cy="50" r="14" fill="#ffffff" />
            <polygon points="50,40 53,47 60,47 55,51 57,58 50,54 43,58 45,51 40,47 47,47" fill="#1a202c" />
          </svg>
        </div>
        <p className="font-bold uppercase tracking-wider text-[11px] m-0">Ministério da Defesa</p>
        <p className="font-bold uppercase tracking-wider text-[11px] m-0">Exército Brasileiro</p>
        <p className="font-bold uppercase tracking-wider text-[10px] m-0">CMP – 3ª BDA INF MTZ</p>
        <p className="font-bold uppercase tracking-wider text-[10px] m-0">22º Batalhão de Infantaria</p>
        <p className="font-bold uppercase tracking-wider text-[10px] m-0">Batalhão Tocantins</p>
        <h3 className="font-black uppercase tracking-normal text-xs sm:text-sm mt-3 pt-1 border-t border-black inline-block">
          TERMO DE COMPROMISSO PARA ENTREGA DA GUIA DE ENCAMINHAMENTO
        </h3>
      </div>

      {/* Grid de Campos Identificação */}
      <div className="border-2 border-black divide-y-2 divide-black text-[11px] mb-4">
        {/* Nome do Titular */}
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x-2 divide-black">
          <div className="w-full sm:w-48 p-1.5 font-bold bg-slate-50 flex items-center">
            Nome do titular do FUSEx:
          </div>
          <div className="flex-1 p-1.5 min-h-[28px]">
            {isEditable ? (
              <input
                type="text"
                value={data.nomeTitular}
                onChange={e => onChange?.('nomeTitular', e.target.value)}
                placeholder="Nome do militar / titular"
                className="w-full font-sans text-xs outline-none bg-amber-50/50 print:bg-transparent"
              />
            ) : (
              <span>{data.nomeTitular}</span>
            )}
          </div>
        </div>

        {/* Nome do dependente */}
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x-2 divide-black">
          <div className="w-full sm:w-48 p-1.5 font-bold bg-slate-50 flex items-center">
            Nome do dependente<br />(paciente):
          </div>
          <div className="flex-1 p-1.5 min-h-[28px] flex items-center">
            {isEditable ? (
              <input
                type="text"
                value={data.nomeDependente}
                onChange={e => onChange?.('nomeDependente', e.target.value)}
                placeholder="Nome completo do paciente atendido"
                className="w-full font-sans text-xs outline-none bg-amber-50/50 print:bg-transparent"
              />
            ) : (
              <span>{data.nomeDependente}</span>
            )}
          </div>
        </div>

        {/* Prec Cp */}
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x-2 divide-black">
          <div className="w-full sm:w-48 p-1.5 font-bold bg-slate-50 flex items-center">
            Prec Cp:
          </div>
          <div className="flex-1 p-1.5 min-h-[26px]">
            {isEditable ? (
              <input
                type="text"
                value={data.precCp}
                onChange={e => onChange?.('precCp', e.target.value)}
                placeholder="Número Prec Cp"
                className="w-full font-sans text-xs outline-none bg-amber-50/50 print:bg-transparent"
              />
            ) : (
              <span>{data.precCp}</span>
            )}
          </div>
        </div>

        {/* Especialidade atendida */}
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x-2 divide-black">
          <div className="w-full sm:w-48 p-1.5 font-bold bg-slate-50 flex items-center">
            Especialidade atendida:
          </div>
          <div className="flex-1 p-1.5 min-h-[26px]">
            {isEditable ? (
              <input
                type="text"
                value={data.especialidade}
                onChange={e => onChange?.('especialidade', e.target.value)}
                placeholder="Ex.: Pronto-Socorro / Clínica Médica / Ortopedia"
                className="w-full font-sans text-xs outline-none bg-amber-50/50 print:bg-transparent"
              />
            ) : (
              <span>{data.especialidade}</span>
            )}
          </div>
        </div>

        {/* Data de atendimento & Hora */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x-2 divide-black">
          <div className="flex divide-x-2 divide-black">
            <div className="w-40 sm:w-48 p-1.5 font-bold bg-slate-50 flex items-center">
              Data de atendimento:
            </div>
            <div className="flex-1 p-1.5 text-center flex items-center justify-center font-mono">
              {isEditable ? (
                <input
                  type="text"
                  value={data.dataAtendimento}
                  onChange={e => onChange?.('dataAtendimento', e.target.value)}
                  placeholder="DD / MM / AAAA"
                  className="w-full text-center font-sans text-xs outline-none bg-amber-50/50 print:bg-transparent"
                />
              ) : (
                <span>{data.dataAtendimento || '____ / ____ / ________'}</span>
              )}
            </div>
          </div>
          <div className="flex divide-x-2 divide-black">
            <div className="w-36 p-1.5 font-bold bg-slate-50 flex items-center">
              Hora da emissão:
            </div>
            <div className="flex-1 p-1.5 text-center flex items-center justify-center font-mono">
              {isEditable ? (
                <input
                  type="text"
                  value={data.horaEmissao}
                  onChange={e => onChange?.('horaEmissao', e.target.value)}
                  placeholder="HH : MM"
                  className="w-full text-center font-sans text-xs outline-none bg-amber-50/50 print:bg-transparent"
                />
              ) : (
                <span>{data.horaEmissao || '____ : ____'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Telefone de contato do responsável */}
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x-2 divide-black">
          <div className="w-full sm:w-48 p-1.5 font-bold bg-slate-50 flex items-center">
            Telefone de contato do responsável:
          </div>
          <div className="flex-1 p-1.5 grid grid-cols-2 divide-x divide-slate-300">
            <div className="pr-2">
              {isEditable ? (
                <input
                  type="text"
                  value={data.telefone1}
                  onChange={e => onChange?.('telefone1', e.target.value)}
                  placeholder="(   ) ____________"
                  className="w-full font-sans text-xs outline-none bg-amber-50/50 print:bg-transparent"
                />
              ) : (
                <span>{data.telefone1 ? `( ) ${data.telefone1}` : '(   ) ________________'}</span>
              )}
            </div>
            <div className="pl-2">
              {isEditable ? (
                <input
                  type="text"
                  value={data.telefone2}
                  onChange={e => onChange?.('telefone2', e.target.value)}
                  placeholder="(   ) ____________"
                  className="w-full font-sans text-xs outline-none bg-amber-50/50 print:bg-transparent"
                />
              ) : (
                <span>{data.telefone2 ? `( ) ${data.telefone2}` : '(   ) ________________'}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Texto de Declaração Oficial */}
      <div className="text-[11px] text-justify space-y-2 mb-4 leading-relaxed">
        <p>
          <strong>DECLARO</strong> que fui atendido(a), em caráter de URGÊNCIA e ou EMERGÊNCIA pelo Hospital{' '}
          {isEditable ? (
            <input
              type="text"
              value={data.hospitalNome}
              onChange={e => onChange?.('hospitalNome', e.target.value)}
              className="border-b border-black font-bold outline-none px-1 w-64 bg-amber-50/50 print:bg-transparent inline-block"
            />
          ) : (
            <span className="font-bold underline">{data.hospitalNome || 'Hospital Palmas Medical'}</span>
          )}{' '}
          e me comprometo a providenciar em até 48 (quarenta e oito) horas ou 2 (dois) dias úteis, a contar da data do atendimento, a Guia de Encaminhamento (Autorização).
        </p>

        <p>
          Estou ciente que o não cumprimento deste termo acarretará o pagamento integral das despesas realizadas, conforme Capítulo III da Urgência e Emergência, previstas nas Instruções Reguladoras para Assistência Médico Hospitalar aos Beneficiários do Fundo de Saúde do Exército (IR 30-38).
        </p>

        <p className="italic font-serif pl-2 border-l-2 border-slate-400">
          “Art. 20. O FUSEx não se responsabilizará ou ressarcirá as despesas, caso não comprovada a urgência e/ou a emergência ou não tenham sido cumpridas as providências previstas nos arts. 18 e 19 das IR 30-38.”
        </p>
      </div>

      {/* Local, Data e Assinaturas */}
      <div className="text-right text-[11px] mb-6">
        Palmas, TO, {data.diaData || '_______'} de {data.mesData || '_________________'} de 20{data.anoData || '____'}.
      </div>

      <div className="space-y-4 mb-5">
        <div className="text-center pt-6 max-w-md mx-auto">
          <div className="border-t border-black mb-1"></div>
          <p className="font-bold text-[11px] m-0">Assinatura do beneficiário ou responsável</p>
          <div className="mt-2 text-left flex items-center gap-2 text-[11px]">
            <span className="font-semibold">Anotar a identidade:</span>
            <span className="border-b border-black flex-1 min-h-[16px]">
              {data.identidadeResponsavel}
            </span>
          </div>
        </div>
      </div>

      {/* Box OCS / Hospital */}
      <div className="border-2 border-black p-3 text-[10.5px] space-y-2 bg-slate-50/40">
        <div className="text-center font-black uppercase tracking-wider text-xs border-b border-black pb-1">
          A ser preenchido pela Organização Civil de Saúde/OCS
        </div>

        <p className="font-bold text-center m-0">
          Horário limite para a troca da guia autorizada do FUSEx: até 48 (quarenta e oito) horas ou 2 (dois) dias úteis, a contar da data do atendimento.
        </p>

        <p className="text-center m-0 text-[10px]">
          Srs. Beneficiários, a troca somente será realizada dentro do prazo e horários estabelecidos acima.
        </p>

        <div className="pt-6 max-w-sm mx-auto text-center">
          <div className="border-t border-black mb-1"></div>
          <p className="font-bold text-[10.5px] m-0">Assinatura da recepcionista</p>
          <p className="text-[10px] m-0 text-slate-600">Responsável pelo atendimento (legível)</p>
          {data.recepcionista && (
            <p className="text-[10px] font-mono mt-0.5 text-slate-800">{data.recepcionista}</p>
          )}
        </div>

        <p className="font-bold text-[10px] pt-1 border-t border-slate-300 m-0">
          OBS: O hospital ficará com o termo original, e o responsável pelo paciente ficará com a cópia a ser trocada.
        </p>
      </div>
    </div>
  );
};
