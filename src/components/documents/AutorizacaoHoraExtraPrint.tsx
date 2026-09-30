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
  onUpdateRow?: (index: number, updatedRow: HoraExtraRow) => void;
  isEditable?: boolean;
}

/**
 * Máscara automática de Data: ao digitar dígitos, formata automaticamente com barras:
 * Exemplo: '01092026' -> '01/09/2026', '0109' -> '01/09'
 */
export function formatDateInput(raw: string): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

/**
 * Máscara automática de Hora: ao digitar dígitos, formata automaticamente com dois-pontos:
 * Exemplo: '1900' -> '19:00', '0700' -> '07:00'
 */
export function formatTimeInput(raw: string): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
}

/**
 * Converte horário 'HH:MM' para total de minutos desde 00:00
 */
function parseTimeToMinutes(t: string): number | null {
  if (!t) return null;
  const match = t.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

/**
 * Calcula a quantidade de horas extras trabalhadas em uma linha (Regra do Plantonista Hospitalar):
 * No trabalho do plantonista, a hora de descanso/refeição é considerada hora integrante do plantão.
 * Portanto, calcula integralmente o período entre Entrada e Saída (sem descontar intervalo):
 * - 07:00 às 19:00 = 12h de plantão (o descanso conta como plantão)
 * - 07:00 às 13:00 = 6h de plantão
 * - 13:00 às 19:00 = 6h de plantão
 * - 19:00 às 07:00 = 12h de plantão noturno (trata virada da meia-noite)
 */
export function computeRowExtraHours(
  entrada: string,
  saidaIntervalo: string,
  _retornoIntervalo: string,
  saida: string
): string {
  const ent = parseTimeToMinutes(entrada);
  // Se preencheu saída final, usa ela; caso contrário, se preencheu saída de 6h em saída/intervalo, considera ela
  const effectiveSaida = saida || saidaIntervalo;
  const sai = parseTimeToMinutes(effectiveSaida);
  if (ent === null || sai === null) return '';

  // Duração total do plantão (trata virada da meia-noite, ex: 19:00 às 07:00 = 12h)
  let totalMinutes = sai >= ent ? sai - ent : sai + 24 * 60 - ent;

  if (totalMinutes <= 0) return '';
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (m === 0) {
    return `${h}h`;
  }
  return `${h}h ${String(m).padStart(2, '0')}min`;
}

/**
 * Converte texto livre de horas (ex: '11h', '2h 30min', '02:30', '2.5') para minutos
 */
export function parseQtdHorasToMinutes(val: string): number {
  if (!val) return 0;
  const str = val.trim().toLowerCase();

  // '11h 30min' ou '11h30' ou '11h'
  const hMinMatch = str.match(/(\d+)\s*h\s*(\d+)?/);
  if (hMinMatch) {
    const h = parseInt(hMinMatch[1], 10) || 0;
    const m = parseInt(hMinMatch[2], 10) || 0;
    return h * 60 + m;
  }

  // '11:30'
  const colonMatch = str.match(/^(\d{1,2}):(\d{2})$/);
  if (colonMatch) {
    const h = parseInt(colonMatch[1], 10) || 0;
    const m = parseInt(colonMatch[2], 10) || 0;
    return h * 60 + m;
  }

  // Decimal '2.5' ou '2,5'
  const decMatch = str.replace(',', '.').match(/^(\d+(\.\d+)?)$/);
  if (decMatch) {
    const hours = parseFloat(decMatch[1]) || 0;
    return Math.round(hours * 60);
  }

  // Apenas número '4' -> 4h
  const numMatch = str.match(/^(\d+)$/);
  if (numMatch) {
    return parseInt(numMatch[1], 10) * 60;
  }

  return 0;
}

/**
 * Formata o total acumulado de minutos para horas amigáveis (ex: '18h' ou '18h 30min')
 */
export function formatTotalHours(totalMinutes: number): string {
  if (totalMinutes <= 0) return '0h';
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (m === 0) {
    return `${h}h`;
  }
  return `${h}h ${String(m).padStart(2, '0')}min`;
}

export const AutorizacaoHoraExtraPrint: React.FC<AutorizacaoHoraExtraPrintProps> = ({
  data,
  onChangeHeader,
  onChangeRow,
  onUpdateRow,
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

  // Soma de todas as horas da coluna 'Quantidade Horas Extras Autorizadas'
  const totalMinutes = rows.reduce((acc, row) => acc + parseQtdHorasToMinutes(row.qtdHoras), 0);
  const totalHorasFormatado = formatTotalHours(totalMinutes);

  // Manipulador de Data com máscara inteligente
  const handleDateChange = (idx: number, rawVal: string) => {
    const formatted = formatDateInput(rawVal);
    onChangeRow?.(idx, 'data', formatted);
  };

  // Manipulador de Horários com máscara inteligente e auto-cálculo da linha
  const handleTimeChange = (
    idx: number,
    field: 'entrada' | 'saidaIntervalo' | 'retornoIntervalo' | 'saida',
    rawVal: string
  ) => {
    const formatted = formatTimeInput(rawVal);
    const currentRow = rows[idx];
    const updatedRow = { ...currentRow, [field]: formatted };

    // Calcula automaticamente a quantidade de horas extras se entrada e saída estiverem preenchidas
    const autoHours = computeRowExtraHours(
      updatedRow.entrada,
      updatedRow.saidaIntervalo,
      updatedRow.retornoIntervalo,
      updatedRow.saida
    );

    if (autoHours) {
      updatedRow.qtdHoras = autoHours;
    }

    if (onUpdateRow) {
      onUpdateRow(idx, updatedRow);
    } else {
      onChangeRow?.(idx, field, formatted);
      if (autoHours) {
        onChangeRow?.(idx, 'qtdHoras', autoHours);
      }
    }
  };

  return (
    <div 
      className="bg-white text-black p-4 sm:p-8 max-w-[900px] mx-auto text-[11px] leading-tight border border-slate-300 print:border-none print:p-0 page-break-avoid"
      style={{ fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}
    >
      {/* Guia Informativo de Preenchimento Automático (Apenas em tela) */}
      {isEditable && (
        <div className="mb-3 p-2.5 bg-teal-50 border border-teal-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-teal-900 print:hidden shadow-xs">
          <div className="flex items-center gap-2">
            <span className="font-black text-teal-700">⚡ Auto-Formatação & Cálculo:</span>
            <span>
              Digite apenas números na data (ex: <code className="font-mono bg-white px-1 py-0.5 rounded border border-teal-200">01092026</code> ➔ <strong className="text-teal-800">01/09/2026</strong>) e nas horas (ex: <code className="font-mono bg-white px-1 py-0.5 rounded border border-teal-200">1900</code> ➔ <strong className="text-teal-800">19:00</strong>). O cálculo do plantão (ex: 07:00 às 19:00 = 12h; 07:00 às 13:00 = 6h) e a soma total são automáticos!
            </span>
          </div>
          <div className="font-black bg-white px-3 py-1 rounded-lg border border-teal-300 text-[#0E7B86] shadow-xs text-xs whitespace-nowrap self-end sm:self-auto">
            Total Geral: {totalHorasFormatado}
          </div>
        </div>
      )}

      {/* Moldura Externa Oficial */}
      <div className="border border-black" style={{ border: '1.5px solid #000000' }}>
        {/* Tabela de Cabeçalho Superior */}
        <table 
          className="w-full border-collapse border-b border-black text-black"
          style={{ borderCollapse: 'collapse', borderBottom: '1.5px solid #000000' }}
        >
          <tbody>
            <tr>
              {/* Logo Medical Kora Saúde */}
              <td 
                className="w-56 p-3 border-r border-black align-middle"
                style={{ borderRight: '1px solid #000000', width: '220px' }}
              >
                <div className="flex items-center gap-2">
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
            <tr className="border-t border-black text-[11px]" style={{ borderTop: '1px solid #000000' }}>
              <td 
                className="p-2 border-r border-black"
                style={{ borderRight: '1px solid #000000' }}
              >
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
        <div 
          className="p-2.5 border-b border-black text-[11px] text-black bg-slate-50/40"
          style={{ borderBottom: '1px solid #000000' }}
        >
          Informamos que nosso colaborador citado acima está autorizado à realizar serviços em regime extraordinário para pagamento de hora extra, conforme abaixo:
        </div>

        {/* Tabela de Lançamento das Horas Extras com Linhas 100% Sólidas */}
        <table 
          className="w-full border-collapse text-center text-[10.5px] text-black"
          style={{ borderCollapse: 'collapse', width: '100%' }}
        >
          <thead>
            <tr className="bg-slate-100 font-bold text-black" style={{ borderBottom: '1px solid #000000' }}>
              <th className="py-2 px-1 w-[14%] text-center" style={{ border: '1px solid #000000' }}>Data (s)</th>
              <th className="py-2 px-1 w-[11%] text-center" style={{ border: '1px solid #000000' }}>Entrada</th>
              <th className="py-2 px-1 w-[12%] text-center" style={{ border: '1px solid #000000' }}>Saída Intervalo</th>
              <th className="py-2 px-1 w-[12%] text-center" style={{ border: '1px solid #000000' }}>Retorno Intervalo</th>
              <th className="py-2 px-1 w-[11%] text-center" style={{ border: '1px solid #000000' }}>Saída</th>
              <th className="py-2 px-1 w-[18%] text-center" style={{ border: '1px solid #000000' }}>Quantidade Horas Extras Autorizadas</th>
              <th className="py-2 px-1 w-[22%] text-center" style={{ border: '1px solid #000000' }}>Motivo</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="h-8 text-[10.5px]" style={{ borderBottom: '1px solid #000000' }}>
                {/* Data com máscara 01/09/2026 */}
                <td className="p-1" style={{ border: '1px solid #000000' }}>
                  {isEditable ? (
                    <input
                      type="text"
                      value={row.data}
                      onChange={e => handleDateChange(idx, e.target.value)}
                      placeholder="DD/MM/AAAA"
                      maxLength={10}
                      className="w-full text-center outline-none bg-amber-50/40 print:bg-transparent text-[10.5px] font-mono"
                      title="Digite a data (ex: 01092026 preenche 01/09/2026)"
                    />
                  ) : (
                    <span className="font-mono font-medium">{row.data}</span>
                  )}
                </td>

                {/* Entrada com máscara 19:00 */}
                <td className="p-1" style={{ border: '1px solid #000000' }}>
                  {isEditable ? (
                    <input
                      type="text"
                      value={row.entrada}
                      onChange={e => handleTimeChange(idx, 'entrada', e.target.value)}
                      placeholder="00:00"
                      maxLength={5}
                      className="w-full text-center outline-none bg-amber-50/40 print:bg-transparent text-[10.5px] font-mono"
                      title="Digite o horário de entrada (ex: 1900 preenche 19:00)"
                    />
                  ) : (
                    <span className="font-mono">{row.entrada}</span>
                  )}
                </td>

                {/* Saída Intervalo com máscara */}
                <td className="p-1" style={{ border: '1px solid #000000' }}>
                  {isEditable ? (
                    <input
                      type="text"
                      value={row.saidaIntervalo}
                      onChange={e => handleTimeChange(idx, 'saidaIntervalo', e.target.value)}
                      placeholder="00:00"
                      maxLength={5}
                      className="w-full text-center outline-none bg-amber-50/40 print:bg-transparent text-[10.5px] font-mono"
                    />
                  ) : (
                    <span className="font-mono">{row.saidaIntervalo}</span>
                  )}
                </td>

                {/* Retorno Intervalo com máscara */}
                <td className="p-1" style={{ border: '1px solid #000000' }}>
                  {isEditable ? (
                    <input
                      type="text"
                      value={row.retornoIntervalo}
                      onChange={e => handleTimeChange(idx, 'retornoIntervalo', e.target.value)}
                      placeholder="00:00"
                      maxLength={5}
                      className="w-full text-center outline-none bg-amber-50/40 print:bg-transparent text-[10.5px] font-mono"
                    />
                  ) : (
                    <span className="font-mono">{row.retornoIntervalo}</span>
                  )}
                </td>

                {/* Saída com máscara */}
                <td className="p-1" style={{ border: '1px solid #000000' }}>
                  {isEditable ? (
                    <input
                      type="text"
                      value={row.saida}
                      onChange={e => handleTimeChange(idx, 'saida', e.target.value)}
                      placeholder="00:00"
                      maxLength={5}
                      className="w-full text-center outline-none bg-amber-50/40 print:bg-transparent text-[10.5px] font-mono"
                      title="Digite o horário de saída (ex: 0700 preenche 07:00)"
                    />
                  ) : (
                    <span className="font-mono">{row.saida}</span>
                  )}
                </td>

                {/* Quantidade Horas Extras Autorizadas (Calculado e Editável) */}
                <td 
                  className="p-1 font-bold text-center bg-amber-50/20 print:bg-transparent"
                  style={{ border: '1px solid #000000' }}
                >
                  {isEditable ? (
                    <input
                      type="text"
                      value={row.qtdHoras}
                      onChange={e => onChangeRow?.(idx, 'qtdHoras', e.target.value)}
                      placeholder="Auto / Ex: 2h"
                      className="w-full text-center outline-none font-bold text-slate-900 bg-amber-100/50 print:bg-transparent text-[10.5px]"
                      title="Calculado automaticamente a partir dos horários ou digite manualmente"
                    />
                  ) : (
                    <span className="font-bold text-black">{row.qtdHoras}</span>
                  )}
                </td>

                {/* Motivo */}
                <td className="p-1 text-left px-2" style={{ border: '1px solid #000000' }}>
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

          {/* Linha de Total Geral das Horas Extras Autorizadas */}
          <tfoot>
            <tr className="bg-slate-100 font-bold text-black" style={{ borderTop: '1.5px solid #000000' }}>
              <td 
                colSpan={5} 
                className="py-2.5 px-3 text-right font-black uppercase text-[10.5px] bg-slate-100"
                style={{ border: '1px solid #000000' }}
              >
                Total Geral de Horas Extras Autorizadas:
              </td>
              <td 
                className="py-2.5 px-1 text-center font-black text-[12px] bg-amber-100 text-slate-950"
                style={{ border: '1.5px solid #000000', backgroundColor: '#fef3c7' }}
              >
                {totalHorasFormatado}
              </td>
              <td 
                className="py-2.5 px-2 text-left text-[9.5px] text-slate-600 bg-slate-100 italic"
                style={{ border: '1px solid #000000' }}
              >
                Soma automática
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Seção Inferior de Assinaturas e Aprovações */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-black border-t border-black text-center text-[10.5px]"
          style={{ borderTop: '1.5px solid #000000' }}
        >
          {/* Assinatura Colaborador */}
          <div 
            className="p-4 sm:p-5 flex flex-col justify-between min-h-[90px]"
            style={{ borderRight: '1px solid #000000' }}
          >
            <div className="text-left font-bold text-black mb-6">
              Assinatura Colaborador:
            </div>
            <div 
              className="max-w-[200px] mx-auto w-full pt-1 text-[10px] text-slate-600"
              style={{ borderTop: '1px solid black' }}
            >
              Assinatura legível
            </div>
          </div>

          {/* Aprovação da Diretoria */}
          <div 
            className="p-4 sm:p-5 flex flex-col justify-between min-h-[90px]"
            style={{ borderRight: '1px solid #000000' }}
          >
            <div className="text-center font-bold text-black mb-6">
              Aprovação da Diretoria:
            </div>
            <div 
              className="max-w-[200px] mx-auto w-full pt-1 text-[10px] text-slate-600"
              style={{ borderTop: '1px solid black' }}
            >
              Diretoria Hospitalar
            </div>
          </div>

          {/* Aprovação do Gestor */}
          <div className="p-4 sm:p-5 flex flex-col justify-between min-h-[90px]">
            <div className="text-center font-bold text-black mb-6">
              Aprovação do Gestor:
            </div>
            <div 
              className="max-w-[200px] mx-auto w-full pt-1 text-[10px] text-slate-600"
              style={{ borderTop: '1px solid black' }}
            >
              Gestor / Coordenação Imediata
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
