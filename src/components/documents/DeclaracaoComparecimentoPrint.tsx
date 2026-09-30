import React from 'react';

export interface DeclaracaoComparecimentoData {
  nomePaciente: string;
  cpfPaciente: string;
  diaAtendimento: string;
  mesAtendimento: string;
  anoAtendimento: string;
  tipoAtendimento: string; // Ex: "CONSULTA em PRONTO SOCORRO"
  diaEmissao: string;
  mesEmissao: string;
  anoEmissao: string;
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
  return (
    <div 
      className="bg-white text-black p-8 sm:p-14 max-w-[800px] min-h-[960px] mx-auto text-[13px] leading-relaxed border border-slate-300 print:border-none print:p-0 relative flex flex-col justify-between"
      style={{ fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}
    >
      {/* Texto Lateral Vertical RT (Diretoria Clínica / Responsável Técnico) */}
      <div 
        className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 origin-bottom-right rotate-90 text-[10px] font-bold tracking-wider text-[#B01B52] whitespace-nowrap select-none print:block print:right-1"
        style={{ transformOrigin: 'right bottom', transform: 'rotate(-90deg)' }}
      >
        RT: Dr. Nilo Francisco de Sales Sobrinho - CRM-TO 4686.
      </div>

      <div>
        {/* Top Header Logos */}
        <div className="flex items-start justify-between mb-16 pt-2">
          {/* Logo Esquerda - Cruz Medical */}
          <div className="flex items-center text-[#0E7B86]">
            <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M40 25 H60 V40 H75 V60 H60 V75 H40 V60 H25 V40 H40 Z" />
              <path d="M30 40 C20 40 20 60 30 60" />
            </svg>
          </div>

          {/* Logo Direita - Medical Palmas Kora Saúde */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 text-[#0E7B86] flex items-center justify-center font-bold text-2xl leading-none">
              ✚
            </div>
            <div className="text-left">
              <div className="text-xl font-bold tracking-tight text-[#B01B52] leading-none">
                Medical
              </div>
              <div className="text-[10px] text-slate-700 font-bold tracking-wider leading-none mt-1">
                Palmas
              </div>
              <div className="text-[9px] text-slate-500 font-normal leading-none mt-0.5">
                Kora Saúde
              </div>
            </div>
          </div>
        </div>

        {/* Título Centralizado */}
        <div className="text-center mb-16">
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-widest text-black m-0">
            DECLARAÇÃO DE COMPARECIMENTO
          </h2>
        </div>

        {/* Corpo do Texto da Declaração */}
        <div className="text-justify text-[13px] sm:text-[14px] leading-loose space-y-6 max-w-xl mx-auto text-black">
          <p className="leading-loose">
            O <strong>HOSPITAL PALMAS MEDICAL LTDA</strong>, inscrito sob o <strong>CNPJ nº 12.955.953/0001-92</strong>, declara para os devidos fins que{' '}
            {isEditable ? (
              <input
                type="text"
                value={data.nomePaciente}
                onChange={e => onChange?.('nomePaciente', e.target.value)}
                placeholder="Nome completo do paciente / declarante"
                className="border-b border-black font-bold outline-none px-1 w-72 bg-amber-50/50 print:bg-transparent inline-block text-xs"
                style={{ fontFamily: 'Arial, sans-serif' }}
              />
            ) : (
              <span className="font-bold underline underline-offset-4">
                {data.nomePaciente || '___________________________________________________________'}
              </span>
            )}
            , portador(a) do <strong>CPF:</strong>{' '}
            {isEditable ? (
              <input
                type="text"
                value={data.cpfPaciente}
                onChange={e => onChange?.('cpfPaciente', e.target.value)}
                placeholder="000.000.000-00"
                className="border-b border-black font-bold outline-none px-1 w-44 font-mono bg-amber-50/50 print:bg-transparent inline-block text-xs"
                style={{ fontFamily: 'Arial, sans-serif' }}
              />
            ) : (
              <span className="font-bold underline underline-offset-4 font-mono">
                {data.cpfPaciente || '_________________________'}
              </span>
            )}
            , esteve presente nesta instituição hospitalar na data de{' '}
            {isEditable ? (
              <span className="inline-flex items-center gap-1">
                <input
                  type="text"
                  value={data.diaAtendimento}
                  onChange={e => onChange?.('diaAtendimento', e.target.value)}
                  placeholder="DD"
                  className="border-b border-black text-center font-bold outline-none w-10 bg-amber-50/50 print:bg-transparent text-xs"
                />
                <span>de</span>
                <input
                  type="text"
                  value={data.mesAtendimento}
                  onChange={e => onChange?.('mesAtendimento', e.target.value)}
                  placeholder="Mês"
                  className="border-b border-black text-center font-bold outline-none w-28 bg-amber-50/50 print:bg-transparent text-xs"
                />
                <span>de</span>
                <input
                  type="text"
                  value={data.anoAtendimento}
                  onChange={e => onChange?.('anoAtendimento', e.target.value)}
                  placeholder="AAAA"
                  className="border-b border-black text-center font-bold outline-none w-16 bg-amber-50/50 print:bg-transparent text-xs"
                />
              </span>
            ) : (
              <span>
                {data.diaAtendimento || '____'} de {data.mesAtendimento || '________________'} de {data.anoAtendimento || '20____'}
              </span>
            )}
            , para realização de{' '}
            {isEditable ? (
              <input
                type="text"
                value={data.tipoAtendimento}
                onChange={e => onChange?.('tipoAtendimento', e.target.value)}
                placeholder="Ex: CONSULTA em PRONTO SOCORRO"
                className="border-b border-black font-bold outline-none px-1 w-64 bg-amber-50/50 print:bg-transparent inline-block text-xs"
                style={{ fontFamily: 'Arial, sans-serif' }}
              />
            ) : (
              <strong>{data.tipoAtendimento || 'CONSULTA em PRONTO SOCORRO'}</strong>
            )}
            .
          </p>
        </div>

        {/* Local e Data */}
        <div className="text-right text-[12px] sm:text-[13px] mt-16 max-w-xl mx-auto text-black">
          Palmas-TO, {data.diaEmissao || '____'} de {data.mesEmissao || '________________'} de {data.anoEmissao || '20____'}.
        </div>

        {/* Linha de Assinatura Hospitalar */}
        <div className="pt-24 max-w-sm mx-auto text-center">
          <div className="border-t border-black mb-1.5"></div>
          <p className="font-bold text-[12px] sm:text-[13px] uppercase tracking-wider text-black m-0">
            HOSPITAL PALMAS MEDICAL
          </p>
        </div>
      </div>

      {/* Rodapé Oficial com Endereço e Site */}
      <div className="pt-16 border-t border-slate-200 mt-12 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] text-slate-800">
        <div className="font-bold text-[#B01B52]">
          redemedical.com.br
        </div>
        <div className="text-center sm:text-right text-slate-700">
          401 Sul Avenida Conj. 02 Lote 02 - Edifício Palmas Medical Center{' '}
          <strong className="text-[#B01B52] font-bold font-mono">(63)3236-1818</strong>
        </div>
      </div>
    </div>
  );
};
