import React from 'react';

export interface HoraExtraRow {
  data: string;
  entrada: string;
  saidaIntervalo: string;
  retornoIntervalo: string;
  saida: string;
  qtdHoras: string;
  motivo: string;
}

export interface AutorizacaoHoraExtraData {
  colaborador: string;
  matricula: string;
  linhas: HoraExtraRow[];
}

interface AutorizacaoHoraExtraPrintProps {
  data: AutorizacaoHoraExtraData;
  onChangeHeader?: (field: 'colaborador' | 'matricula', val: string) => void;
  onChangeRow?: (index: number, field: keyof HoraExtraRow, val: string) => void;
  isEditable?: boolean;
}

export const AutorizacaoHoraExtraPrint: React.FC<AutorizacaoHoraExtraPrintProps> = ({
  data,
  onChangeHeader,
  onChangeRow,
  isEditable = false
}) => {
  // Garantir sempre pelo menos 9 linhas para preenchimento manual ou impressão A4
  const rows = data.linhas.length >= 9 ? data.linhas : [
    ...data.linhas,
    ...Array.from({ length: 9 - data.linhas.length }, () => ({
      data: '',
      entrada: '',
      saidaIntervalo: '',
      retornoIntervalo: '',
      saida: '',
      qtdHoras: '',
      motivo: ''
    }))
  ];

  return (
    <div 
      className="bg-white text-black p-4 sm:p-8 max-w-[900px] mx-auto text-[11px] leading-tight border border-slate-300 print:border-none print:p-0"
      style={{ fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}
    >
      {/* Moldura Externa Oficial */}
      <div className="border border-black">
        {/* Tabela de Cabeçalho Superior */}
        <table className="w-full border-collapse border-b border-black">
          <tbody>
            <tr>
              {/* Logo Medical Kora Saúde */}
              <td className="w-56 p-3 border-r border-black align-middle">
                <div className="flex items-center gap-2">
                  {/* Ícone cruz estilizada */}
                  <div className="w-7 h-7 text-[#0E7B86] flex items-center justify-center font-bold text-2xl leading-none">
                    ✚
                  </div>
                  <div>
                    <div className="text-xl font-bold tracking-tight text-[#B01B52] leading-none">
                      Medical
                    </div>
                    <div className="text-[10px] text-slate-700 font-bold tracking-wider leading-none mt-1">
                      Kora<span className="font-normal text-slate-500">Saúde</span>
                    </div>
                  </div>
                </div>
              </td>

              {/* Título Oficial */}
              <td className="p-3 text-center align-middle">
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-black m-0">
                  AUTORIZAÇÃO PAGAMENTO DE HORA EXTRA
                </h2>
              </td>
            </tr>

            {/* Linha de Colaborador e Matrícula */}
            <tr className="border-t border-black text-[11px]">
              <td className="p-2 border-r border-black">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold whitespace-nowrap text-black">Colaborador:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.colaborador}
                      onChange={e => onChangeHeader?.('colaborador', e.target.value)}
                      placeholder="Nome completo do colaborador"
                      className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent"
                      style={{ fontFamily: 'Arial, sans-serif' }}
                    />
                  ) : (
                    <span className="font-bold text-black">{data.colaborador}</span>
                  )}
                </div>
              </td>
              <td className="p-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold whitespace-nowrap text-black">Matrícula:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.matricula}
                      onChange={e => onChangeHeader?.('matricula', e.target.value)}
                      placeholder="Nº da matrícula"
                      className="w-48 outline-none text-[11px] font-mono bg-amber-50/50 print:bg-transparent"
                      style={{ fontFamily: 'Arial, sans-serif' }}
                    />
                  ) : (
                    <span className="font-mono font-bold text-black">{data.matricula}</span>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Texto Explicativo Institucional */}
        <div className="p-2.5 border-b border-black text-[11px] text-black bg-slate-50/40">
          Informamos que nosso colaborador citado acima está autorizado à realizar serviços em regime extraordinário para pagamento de hora extra, conforme abaixo:
        </div>

        {/* Tabela de Lançamento das Horas Extras */}
        <table className="w-full border-collapse text-center text-[10.5px]">
          <thead>
            <tr className="bg-slate-100 border-b border-black font-bold divide-x divide-black text-black">
              <th className="py-2 px-1 w-[12%] text-center">Data (s)</th>
              <th className="py-2 px-1 w-[11%] text-center">Entrada</th>
              <th className="py-2 px-1 w-[13%] text-center">Saída Intervalo</th>
              <th className="py-2 px-1 w-[13%] text-center">Retorno Intervalo</th>
              <th className="py-2 px-1 w-[11%] text-center">Saída</th>
              <th className="py-2 px-1 w-[18%] text-center">Quantidade Horas Extras Autorizadas</th>
              <th className="py-2 px-1 w-[22%] text-center">Motivo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {rows.map((row, idx) => (
              <tr key={idx} className="divide-x divide-black h-8 text-[10.5px]">
                {/* Data */}
                <td className="p-1">
                  {isEditable ? (
                    <input
                      type="text"
                      value={row.data}
                      onChange={e => onChangeRow?.(idx, 'data', e.target.value)}
                      placeholder="DD/MM"
                      className="w-full text-center outline-none bg-amber-50/40 print:bg-transparent text-[10px]"
                    />
                  ) : (
                    <span>{row.data}</span>
                  )}
                </td>

                {/* Entrada */}
                <td className="p-1">
                  {isEditable ? (
                    <input
                      type="text"
                      value={row.entrada}
                      onChange={e => onChangeRow?.(idx, 'entrada', e.target.value)}
                      placeholder="00:00"
                      className="w-full text-center outline-none bg-amber-50/40 print:bg-transparent text-[10px]"
                    />
                  ) : (
                    <span>{row.entrada}</span>
                  )}
                </td>

                {/* Saída Intervalo */}
                <td className="p-1">
                  {isEditable ? (
                    <input
                      type="text"
                      value={row.saidaIntervalo}
                      onChange={e => onChangeRow?.(idx, 'saidaIntervalo', e.target.value)}
                      placeholder="00:00"
                      className="w-full text-center outline-none bg-amber-50/40 print:bg-transparent text-[10px]"
                    />
                  ) : (
                    <span>{row.saidaIntervalo}</span>
                  )}
                </td>

                {/* Retorno Intervalo */}
                <td className="p-1">
                  {isEditable ? (
                    <input
                      type="text"
                      value={row.retornoIntervalo}
                      onChange={e => onChangeRow?.(idx, 'retornoIntervalo', e.target.value)}
                      placeholder="00:00"
                      className="w-full text-center outline-none bg-amber-50/40 print:bg-transparent text-[10px]"
                    />
                  ) : (
                    <span>{row.retornoIntervalo}</span>
                  )}
                </td>

                {/* Saída */}
                <td className="p-1">
                  {isEditable ? (
                    <input
                      type="text"
                      value={row.saida}
                      onChange={e => onChangeRow?.(idx, 'saida', e.target.value)}
                      placeholder="00:00"
                      className="w-full text-center outline-none bg-amber-50/40 print:bg-transparent text-[10px]"
                    />
                  ) : (
                    <span>{row.saida}</span>
                  )}
                </td>

                {/* Quantidade Horas */}
                <td className="p-1">
                  {isEditable ? (
                    <input
                      type="text"
                      value={row.qtdHoras}
                      onChange={e => onChangeRow?.(idx, 'qtdHoras', e.target.value)}
                      placeholder="Ex: 2h / 12h"
                      className="w-full text-center outline-none font-bold bg-amber-50/40 print:bg-transparent text-[10px]"
                    />
                  ) : (
                    <span className="font-bold">{row.qtdHoras}</span>
                  )}
                </td>

                {/* Motivo */}
                <td className="p-1 text-left px-2">
                  {isEditable ? (
                    <input
                      type="text"
                      value={row.motivo}
                      onChange={e => onChangeRow?.(idx, 'motivo', e.target.value)}
                      placeholder="Cobertura de escala / urgência"
                      className="w-full outline-none bg-amber-50/40 print:bg-transparent text-[10px]"
                    />
                  ) : (
                    <span>{row.motivo}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Seção Inferior de Assinaturas e Aprovações */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-black border-t border-black text-center text-[10.5px]">
          {/* Assinatura Colaborador */}
          <div className="p-4 sm:p-5 flex flex-col justify-between min-h-[90px]">
            <div className="text-left font-bold text-black mb-6">
              Assinatura Colaborador:
            </div>
            <div className="border-t border-black max-w-[200px] mx-auto w-full pt-1 text-[10px] text-slate-600">
              Assinatura legível
            </div>
          </div>

          {/* Aprovação da Diretoria */}
          <div className="p-4 sm:p-5 flex flex-col justify-between min-h-[90px]">
            <div className="text-center font-bold text-black mb-6">
              Aprovação da Diretoria:
            </div>
            <div className="border-t border-black max-w-[200px] mx-auto w-full pt-1 text-[10px] text-slate-600">
              Diretoria Hospitalar
            </div>
          </div>

          {/* Aprovação do Gestor */}
          <div className="p-4 sm:p-5 flex flex-col justify-between min-h-[90px]">
            <div className="text-center font-bold text-black mb-6">
              Aprovação do Gestor:
            </div>
            <div className="border-t border-black max-w-[200px] mx-auto w-full pt-1 text-[10px] text-slate-600">
              Gestor / Coordenação Imediata
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
