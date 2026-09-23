import React from 'react';

const formatCurrencyBRL = (val: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(val || 0);
};

export interface QuoteItem {
  code?: string;
  description: string;
  category?: string;
  detail?: string; // e.g. "Com Contraste (+R$ 250)", "Diárias: 1 dia (Enfermaria)"
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface HospitalPatientQuoteProps {
  id?: string;
  type: 'exames' | 'procedimentos';
  patientName?: string;
  doctorName?: string;
  tableReference: string;
  notes?: string;
  items: QuoteItem[];
  total: number;
  installmentCount?: number;
  emissionDate?: string;
  emissionTime?: string;
  isPrintPreview?: boolean; // When rendered inside modal preview on screen
}

export const HospitalPatientQuote: React.FC<HospitalPatientQuoteProps> = ({
  id = 'HPM-ORC',
  type,
  patientName,
  doctorName,
  tableReference,
  notes,
  items,
  total,
  installmentCount = 6,
  emissionDate,
  emissionTime,
  isPrintPreview = false
}) => {
  const currentDate = emissionDate || new Date().toLocaleDateString('pt-BR');
  const currentTime = emissionTime || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const installmentValue = total > 0 ? total / installmentCount : 0;
  const quoteCode = `${id}-${currentDate.replace(/\//g, '')}-${currentTime.replace(':', '')}`;

  return (
    <div
      className={`bg-white text-slate-900 font-sans leading-normal selection:bg-none ${
        isPrintPreview
          ? 'p-6 sm:p-10 border border-slate-300 rounded-2xl shadow-md max-w-4xl mx-auto my-4'
          : 'p-0 w-full'
      }`}
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
    >
      {/* ========================================================
          CABEÇALHO INSTITUCIONAL HOSPITALAR (A4)
      ======================================================== */}
      <div className="border-b-2 border-[#0E7B86] pb-4 mb-5">
        <div className="flex justify-between items-start gap-4">
          {/* Logo e Dados do Hospital */}
          <div className="flex items-start gap-3.5">
            {/* Brasão / Ícone Vectorial Oficial */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#095962] to-[#0E7B86] text-white flex items-center justify-center flex-shrink-0 shadow-sm border border-[#0E7B86]/30">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  HOSPITAL PALMAS MEDICAL
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#FDF2F6] text-[#B01B52] border border-[#F7D0DF]">
                  Kora Saúde
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 m-0 mt-0.5">
                PALMAS MEDICAL ASSISTÊNCIA MÉDICA HOSPITALAR LTDA • CNPJ: 12.955.953/0001-92
              </p>
              <p className="text-[11px] text-slate-500 m-0">
                102 Sul, Av. LO 01, Lote 08, Plano Diretor Sul, Palmas - TO • CEP: 77015-004
              </p>
              <p className="text-[11px] text-slate-500 m-0">
                Central: (63) 3214-5000 • Setor de Orçamentos: <strong className="text-slate-700 font-bold">(63) 99989-1818</strong>
              </p>
            </div>
          </div>

          {/* Selo do Orçamento / Controle */}
          <div className="text-right flex-shrink-0">
            <div className="inline-block bg-[#0E7B86] text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-2xs tracking-wider uppercase">
              {type === 'exames' ? 'Orçamento de Exames' : 'Orçamento de Procedimentos'}
            </div>
            <p className="text-[11px] font-mono font-bold text-slate-800 m-0 mt-1.5">
              Nº {quoteCode}
            </p>
            <p className="text-[11px] text-slate-600 m-0">
              Emissão: <strong>{currentDate}</strong> às <strong>{currentTime}</strong>
            </p>
            <p className="text-[10px] font-bold text-[#B01B52] m-0 mt-0.5">
              Validade: 7 dias corridos
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          QUADRO DE IDENTIFICAÇÃO DO PACIENTE E SOLICITAÇÃO
      ======================================================== */}
      <div className="border border-slate-300 rounded-xl bg-slate-50/70 p-3.5 mb-5 text-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Paciente / Destinatário:
          </span>
          <p className="text-sm font-black text-slate-900 m-0 mt-0.5">
            {patientName?.trim() || 'Aos Cuidados do Paciente'}
          </p>
        </div>

        {doctorName && (
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Médico(a) Solicitante:
            </span>
            <p className="text-xs font-extrabold text-slate-900 m-0 mt-0.5">
              {doctorName}
            </p>
          </div>
        )}

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Tabela / Modalidade Aplicada:
          </span>
          <p className="text-xs font-extrabold text-[#0E7B86] m-0 mt-0.5">
            {tableReference}
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Setor de Emissão:
          </span>
          <p className="text-xs font-bold text-slate-800 m-0 mt-0.5">
            {type === 'exames' ? 'Central de Atendimento Diagnóstico & Exames' : 'Central de Orçamentos Hospitalares & Cirurgias'}
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Total de Itens:
          </span>
          <p className="text-xs font-bold text-slate-800 m-0 mt-0.5">
            {items.length} {items.length === 1 ? 'procedimento' : 'procedimentos'}
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Status do Documento:
          </span>
          <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-emerald-300 mt-0.5">
            Orçamento Prévio Oficial
          </span>
        </div>
      </div>

      {/* ========================================================
          TABELA DETALHADA DE PROCEDIMENTOS / EXAMES
      ======================================================== */}
      <div className="mb-5">
        <table className="w-full border-collapse text-xs border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-slate-800 border-b-2 border-slate-400">
              <th className="py-2.5 px-2.5 font-bold text-center w-10 border-r border-slate-300">#</th>
              <th className="py-2.5 px-3 font-bold text-left w-24 border-r border-slate-300">Código</th>
              <th className="py-2.5 px-3 font-bold text-left border-r border-slate-300">
                {type === 'exames' ? 'Descrição do Procedimento / Exame' : 'Procedimento / Cirurgia / Pacote'}
              </th>
              <th className="py-2.5 px-3 font-bold text-center w-28 border-r border-slate-300">
                {type === 'exames' ? 'Contraste / Insumo' : 'Diárias / Tipo'}
              </th>
              <th className="py-2.5 px-2 font-bold text-center w-14 border-r border-slate-300">Qtd</th>
              <th className="py-2.5 px-3 font-bold text-right w-24 border-r border-slate-300">Valor Unit.</th>
              <th className="py-2.5 px-3 font-bold text-right w-28">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
              >
                <td className="py-2 px-2 text-center font-bold text-slate-500 border-r border-slate-200">
                  {idx + 1}
                </td>
                <td className="py-2 px-3 font-mono font-bold text-slate-700 border-r border-slate-200">
                  {item.code || '—'}
                </td>
                <td className="py-2 px-3 font-semibold text-slate-900 leading-snug border-r border-slate-200">
                  {item.description}
                  {item.category && (
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                      Categoria: {item.category}
                    </span>
                  )}
                </td>
                <td className="py-2 px-3 text-center font-medium text-slate-700 text-[11px] border-r border-slate-200">
                  {item.detail || 'Padrão'}
                </td>
                <td className="py-2 px-2 text-center font-bold text-slate-800 border-r border-slate-200">
                  {item.quantity}
                </td>
                <td className="py-2 px-3 text-right font-medium text-slate-700 border-r border-slate-200">
                  {formatCurrencyBRL(item.unitPrice)}
                </td>
                <td className="py-2 px-3 text-right font-black text-slate-900 font-mono">
                  {formatCurrencyBRL(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================================================
          BLOCO DE TOTAIS & CONDIÇÕES DE PAGAMENTO (DESTAQUE)
      ======================================================== */}
      <div className="border-2 border-slate-900 rounded-xl p-4 bg-slate-50/80 mb-5 text-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Formas e Condições de Pagamento */}
        <div className="space-y-1.5 border-b sm:border-b-0 sm:border-r border-slate-300 pb-3 sm:pb-0 sm:pr-4">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">
            Condições de Pagamento Facilitadas:
          </span>
          <div className="flex items-center gap-2 text-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0"></span>
            <span><strong>À Vista (PIX, Débito ou Dinheiro):</strong> {formatCurrencyBRL(total)}</span>
          </div>
          {type === 'exames' ? (
            <div className="flex items-center gap-2 text-slate-800">
              <span className="w-2 h-2 rounded-full bg-[#B01B52] flex-shrink-0"></span>
              <span><strong>Cartão de Crédito:</strong> Paciente PS é apenas no crédito à vista 1x</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-800">
              <span className="w-2 h-2 rounded-full bg-[#B01B52] flex-shrink-0"></span>
              <span><strong>Cartão de Crédito:</strong> em até <strong>{installmentCount}x de {formatCurrencyBRL(installmentValue)}</strong> sem juros</span>
            </div>
          )}
          <p className="text-[10px] text-slate-500 m-0 pt-1">
            * Aceitamos as principais bandeiras de cartões (Visa, Mastercard, Elo, Hipercard, Amex).
          </p>
        </div>

        {/* Total Consolidado */}
        <div className="flex flex-col justify-center sm:items-end text-left sm:text-right">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 block">
            Valor Total do Orçamento:
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#0E7B86] font-mono tracking-tight my-0.5">
            {formatCurrencyBRL(total)}
          </div>
          <span className="text-[10px] font-bold text-slate-500">
            ({items.length} {items.length === 1 ? 'procedimento contemplado' : 'procedimentos contemplados'})
          </span>
        </div>
      </div>

      {/* ========================================================
          OBSERVAÇÕES E ORIENTAÇÕES CLÍNICAS / TERMOS
      ======================================================== */}
      <div className="border border-slate-300 rounded-xl p-3.5 mb-5 text-[11px] text-slate-700 space-y-2 bg-white">
        <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
          <span>Regulamento &amp; Informações Importantes:</span>
        </div>

        {notes && notes.trim() && (
          <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-950 font-medium text-xs">
            <strong>Observações Específicas / Preparo:</strong> {notes}
          </div>
        )}

        <ul className="list-disc list-inside space-y-1 text-slate-600 leading-relaxed m-0 pl-1">
          <li>
            <strong>Validade:</strong> Este orçamento possui validade de <strong>7 (sete) dias corridos</strong> a partir da data de sua emissão, sujeito a confirmação de disponibilidade de agenda e insumos.
          </li>
          {type === 'exames' ? (
            <>
              <li>
                <strong>Formas de Pagamento &amp; Cartão de Crédito:</strong> Aceitamos PIX, Débito e Dinheiro à vista. Para exames realizados no Pronto-Socorro, o <strong>Cartão de Crédito Paciente PS é apenas no crédito à vista 1x</strong>.
              </li>
              <li>
                <strong>Exames com Contraste:</strong> A aplicação de contraste depende de questionário prévio de segurança, triagem e jejum recomendado. Pacientes com alterações renais ou histórico alérgico devem apresentar exames recentes de ureia e creatinina.
              </li>
              <li>
                <strong>Preparo Prévio:</strong> Alguns exames necessitam de jejum obrigatório ou suspensão temporária de medicamentos sob orientação médica prévia.
              </li>
            </>
          ) : (
            <>
              <li>
                <strong>Valores Hospitalares:</strong> Os valores correspondem à infraestrutura hospitalar, taxas de sala, hotelaria e diárias descritas no pacote contratado.
              </li>
              <li>
                <strong>Honorários Médicos &amp; OPMES:</strong> Os valores desta proposta <strong>não incluem</strong> honorários da equipe médica particular (cirurgião, anestesiologista, instrumentador), nem órteses, próteses e materiais especiais (OPMEs), exceto quando expressamente discriminado acima.
              </li>
            </>
          )}
          <li>
            <strong>Admissão Hospitalar:</strong> No dia do atendimento, comparecer à recepção central com 30 minutos de antecedência portando documento oficial com foto e o pedido médico original.
          </li>
        </ul>
      </div>

      {/* ========================================================
          CAMPOS FORMAIS DE ASSINATURA & ACEITE
      ======================================================== */}
      <div className="pt-6 mt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs page-break-avoid">
        <div>
          <div className="border-t border-slate-600 pt-1.5 w-56 mx-auto"></div>
          <p className="font-bold text-slate-900 m-0">Atendente / Responsável pelo Orçamento</p>
          <p className="text-[10px] text-slate-500 m-0">Hospital Palmas Medical • Kora Saúde</p>
        </div>

        <div>
          <div className="border-t border-slate-600 pt-1.5 w-56 mx-auto"></div>
          <p className="font-bold text-slate-900 m-0">Paciente / Responsável Financeiro</p>
          <p className="text-[10px] text-slate-500 m-0">De Acordo • Assinatura Legível</p>
        </div>
      </div>

      {/* Rodapé Institucional */}
      <div className="mt-6 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400">
        Hospital Palmas Medical — Qualidade, segurança e acolhimento em cada etapa do seu atendimento.
      </div>
    </div>
  );
};
