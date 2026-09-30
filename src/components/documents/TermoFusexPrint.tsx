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

function cleanPhoneDisplay(phone: string): string {
  if (!phone) return '(    ) ____________________';
  const trimmed = phone.trim();
  if (trimmed.startsWith('(')) return trimmed;
  return `(${trimmed}`;
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

      {/* Tabela de Campos de Identificação ABNT com Linhas 100% Sólidas e Fechadas */}
      <table 
        className="w-full text-[11px] mb-4 text-black"
        style={{ 
          borderCollapse: 'collapse', 
          border: '1.5px solid #000000', 
          width: '100%',
          backgroundColor: '#ffffff'
        }}
      >
        <tbody>
          {/* Nome do Titular */}
          <tr>
            <td 
              className="bg-slate-50 font-bold p-1.5 align-middle text-black"
              style={{ 
                width: '230px', 
                border: '1px solid #000000', 
                backgroundColor: '#f8fafc',
                padding: '6px 8px'
              }}
            >
              Nome do titular do FUSEx:
            </td>
            <td 
              colSpan={3} 
              className="p-1.5 align-middle text-black"
              style={{ 
                border: '1px solid #000000',
                padding: '6px 8px'
              }}
            >
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
                <span className="font-medium text-black">{data.nomeTitular}</span>
              )}
            </td>
          </tr>

          {/* Nome do dependente */}
          <tr>
            <td 
              className="bg-slate-50 font-bold p-1.5 align-middle text-black"
              style={{ 
                width: '230px', 
                border: '1px solid #000000', 
                backgroundColor: '#f8fafc',
                padding: '6px 8px'
              }}
            >
              Nome do dependente (paciente):
            </td>
            <td 
              colSpan={3} 
              className="p-1.5 align-middle text-black"
              style={{ 
                border: '1px solid #000000',
                padding: '6px 8px'
              }}
            >
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
                <span className="font-medium text-black">{data.nomeDependente}</span>
              )}
            </td>
          </tr>

          {/* Prec Cp */}
          <tr>
            <td 
              className="bg-slate-50 font-bold p-1.5 align-middle text-black"
              style={{ 
                width: '230px', 
                border: '1px solid #000000', 
                backgroundColor: '#f8fafc',
                padding: '6px 8px'
              }}
            >
              Prec Cp:
            </td>
            <td 
              colSpan={3} 
              className="p-1.5 align-middle text-black"
              style={{ 
                border: '1px solid #000000',
                padding: '6px 8px'
              }}
            >
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
                <span className="font-medium text-black">{data.precCp}</span>
              )}
            </td>
          </tr>

          {/* Especialidade atendida */}
          <tr>
            <td 
              className="bg-slate-50 font-bold p-1.5 align-middle text-black"
              style={{ 
                width: '230px', 
                border: '1px solid #000000', 
                backgroundColor: '#f8fafc',
                padding: '6px 8px'
              }}
            >
              Especialidade atendida:
            </td>
            <td 
              colSpan={3} 
              className="p-1.5 align-middle text-black"
              style={{ 
                border: '1px solid #000000',
                padding: '6px 8px'
              }}
            >
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
                <span className="font-medium text-black">{data.especialidade}</span>
              )}
            </td>
          </tr>

          {/* Data de atendimento & Hora */}
          <tr>
            <td 
              className="bg-slate-50 font-bold p-1.5 align-middle text-black"
              style={{ 
                width: '230px', 
                border: '1px solid #000000', 
                backgroundColor: '#f8fafc',
                padding: '6px 8px'
              }}
            >
              Data de atendimento:
            </td>
            <td 
              className="p-1.5 align-middle text-center text-black"
              style={{ 
                width: '24%', 
                border: '1px solid #000000',
                padding: '6px 8px'
              }}
            >
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
                <span className="font-medium text-black">{data.dataAtendimento || '____ / ____ / ________'}</span>
              )}
            </td>
            <td 
              className="bg-slate-50 font-bold p-1.5 align-middle text-center text-black"
              style={{ 
                width: '135px', 
                border: '1px solid #000000', 
                backgroundColor: '#f8fafc',
                padding: '6px 8px'
              }}
            >
              Hora da emissão:
            </td>
            <td 
              className="p-1.5 align-middle text-center text-black"
              style={{ 
                border: '1px solid #000000',
                padding: '6px 8px'
              }}
            >
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
                <span className="font-medium text-black">{data.horaEmissao || '____ : ____'}</span>
              )}
            </td>
          </tr>

          {/* Telefone de contato do responsável */}
          <tr>
            <td 
              className="bg-slate-50 font-bold p-1.5 align-middle text-black"
              style={{ 
                width: '230px', 
                border: '1px solid #000000', 
                backgroundColor: '#f8fafc',
                padding: '6px 8px'
              }}
            >
              Telefone de contato do responsável:
            </td>
            <td 
              className="p-1.5 align-middle text-black"
              style={{ 
                width: '24%', 
                border: '1px solid #000000',
                padding: '6px 8px'
              }}
            >
              {isEditable ? (
                <input
                  type="text"
                  value={data.telefone1}
                  onChange={e => onChange?.('telefone1', e.target.value)}
                  placeholder="(63) 99999-9999"
                  className="w-full text-[11px] outline-none bg-amber-50/50 print:bg-transparent"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span className="text-black font-medium">
                  {cleanPhoneDisplay(data.telefone1)}
                </span>
              )}
            </td>
            <td 
              colSpan={2}
              className="p-1.5 align-middle text-black"
              style={{ 
                border: '1px solid #000000',
                padding: '6px 8px'
              }}
            >
              {isEditable ? (
                <input
                  type="text"
                  value={data.telefone2}
                  onChange={e => onChange?.('telefone2', e.target.value)}
                  placeholder="(63) 3215-0000 / Recado"
                  className="w-full text-[11px] outline-none bg-amber-50/50 print:bg-transparent"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span className="text-black font-medium">
                  {cleanPhoneDisplay(data.telefone2)}
                </span>
              )}
            </td>
          </tr>
        </tbody>
      </table>

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
              style={{ fontFamily: 'Arial, sans-serif', borderBottom: '1px solid black' }}
            />
          ) : (
            <span className="font-bold underline">{data.hospitalNome || 'Hospital Palmas Medical'}</span>
          )}{' '}
          e me comprometo a providenciar em até 48 (quarenta e oito) horas ou 2 (dois) dias úteis, a contar da data do atendimento, a Guia de Encaminhamento (Autorização).
        </p>

        <p>
          Estou ciente que o não cumprimento deste termo acarretará o pagamento integral das despesas realizadas, conforme Capítulo III da Urgência e Emergência, previstas nas Instruções Reguladoras para Assistência Médico Hospitalar aos Beneficiários do Fundo de Saúde do Exército (IR 30-38).
        </p>

        <div 
          className="pl-4 italic text-[10.5px] text-slate-900 leading-normal"
          style={{ borderLeft: '2px solid #334155' }}
        >
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
          <div className="mb-1.5" style={{ borderTop: '1px solid black' }}></div>
          <p className="font-bold text-[11px] m-0 text-black">Assinatura do beneficiário ou responsável</p>
          <div className="mt-3 text-left flex items-center gap-2 text-[11px]">
            <span className="font-bold text-black">Anotar a identidade:</span>
            <span 
              className="flex-1 min-h-[18px] text-black"
              style={{ borderBottom: '1px solid black' }}
            >
              {data.identidadeResponsavel}
            </span>
          </div>
        </div>
      </div>

      {/* Box OCS / Hospital com bordas 100% sólidas */}
      <div 
        className="p-3.5 text-[11px] space-y-2 bg-slate-50/50 text-black"
        style={{ border: '1.5px solid #000000', backgroundColor: '#fafafa' }}
      >
        <div 
          className="text-center font-bold uppercase tracking-wider text-[11.5px] pb-1.5 text-black"
          style={{ borderBottom: '1px solid #000000' }}
        >
          A ser preenchido pela Organização Civil de Saúde/OCS
        </div>

        <p className="font-bold text-center m-0 text-[11px] text-black">
          Horário limite para a troca da guia autorizada do FUSEx: até 48 (quarenta e oito) horas ou 2 (dois) dias úteis, a contar da data do atendimento.
        </p>

        <p className="text-center m-0 text-[10.5px] text-slate-800">
          Srs. Beneficiários, a troca somente será realizada dentro do prazo e horários estabelecidos acima.
        </p>

        <div className="pt-8 max-w-sm mx-auto text-center">
          <div className="mb-1.5" style={{ borderTop: '1px solid black' }}></div>
          <p className="font-bold text-[11px] m-0 text-black">Assinatura da recepcionista</p>
          <p className="text-[10px] m-0 text-slate-700">Responsável pelo atendimento (legível)</p>
          {data.recepcionista && (
            <p className="text-[10px] font-bold mt-1 text-black">{data.recepcionista}</p>
          )}
        </div>

        <p 
          className="font-bold text-[10px] pt-1.5 m-0 text-black"
          style={{ borderTop: '1px solid #94a3b8' }}
        >
          OBS: O hospital ficará com o termo original, e o responsável pelo paciente ficará com a cópia a ser trocada.
        </p>
      </div>
    </div>
  );
};
