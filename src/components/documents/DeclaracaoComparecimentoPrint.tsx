import React from 'react';

export interface DeclaracaoComparecimentoData {
  nomePaciente: string;
  cpfPaciente: string;
  dataComparecimento: string;
  horario: string;
  observacao: string;
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
      className="bg-white text-black p-6 sm:p-12 max-w-[820px] min-h-[980px] mx-auto text-[12px] leading-relaxed border border-slate-300 print:border-none print:p-0 relative flex flex-col justify-between"
      style={{ fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}
    >
      {/* Texto Lateral Vertical RT (Diretoria Clínica / Responsável Técnico) */}
      <div 
        className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 text-[9.5px] font-bold tracking-wider text-[#B01B52] whitespace-nowrap select-none print:block print:right-0"
        style={{ transformOrigin: 'right bottom', transform: 'rotate(-90deg)' }}
      >
        RT: Dr. Nilo Francisco de Sales Sobrinho - CRM-TO 4686
      </div>

      <div>
        {/* Cabeçalho Superior com Logos */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          {/* Logo Esquerda - Cruz Medical */}
          <div className="flex items-center text-[#0E7B86]">
            <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M40 25 H60 V40 H75 V60 H60 V75 H40 V60 H25 V40 H40 Z" />
              <path d="M30 40 C20 40 20 60 30 60" />
            </svg>
          </div>

          {/* Logo Direita - Medical Palmas Kora Saúde */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 text-[#0E7B86] flex items-center justify-center font-bold text-xl leading-none">
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
        <div className="text-center my-8">
          <h2 className="text-base sm:text-xl font-bold uppercase tracking-wide text-black m-0">
            DECLARAÇÃO DE COMPARECIMENTO
          </h2>
        </div>

        {/* Parágrafo de Abertura */}
        <div className="text-justify text-[12px] sm:text-[12.5px] leading-relaxed mb-6 text-black">
          <p className="m-0">
            <strong>O HOSPITAL PALMAS MEDICAL LTDA.</strong>, inscrito sob o <strong>CNPJ nº 12.955.953/0001-92</strong>, declara, para os devidos fins, que o(a) paciente abaixo identificado(a) esteve presente nesta instituição hospitalar para realização de <strong>CONSULTA EM PRONTO SOCORRO</strong>.
          </p>
        </div>

        {/* Quadro com Bordas Arredondadas: DADOS DO PACIENTE / ATENDIMENTO */}
        <div className="border border-slate-300 rounded-2xl p-5 sm:p-6 mb-6 bg-white space-y-5">
          {/* Título da Seção */}
          <div className="text-[#0E7B86] font-bold uppercase text-[11px] tracking-wider">
            DADOS DO PACIENTE / ATENDIMENTO
          </div>

          {/* Campo: NOME DO PACIENTE */}
          <div className="space-y-1">
            <label className="block text-[10.5px] font-bold uppercase text-slate-700">
              NOME DO PACIENTE
            </label>
            <div className="border-b border-black min-h-[24px] flex items-end pb-0.5">
              {isEditable ? (
                <input
                  type="text"
                  value={data.nomePaciente}
                  onChange={e => onChange?.('nomePaciente', e.target.value)}
                  placeholder="Nome completo do paciente"
                  className="w-full outline-none font-bold text-[12px] bg-amber-50/50 print:bg-transparent"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span className="font-bold text-[12px] text-black">{data.nomePaciente}</span>
              )}
            </div>
          </div>

          {/* Linha com 2 Colunas: CPF e DATA DO COMPARECIMENTO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* CPF */}
            <div className="space-y-1">
              <label className="block text-[10.5px] font-bold uppercase text-slate-700">
                CPF
              </label>
              <div className="border-b border-black min-h-[24px] flex items-end pb-0.5">
                {isEditable ? (
                  <input
                    type="text"
                    value={data.cpfPaciente}
                    onChange={e => onChange?.('cpfPaciente', e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full outline-none font-mono text-[12px] bg-amber-50/50 print:bg-transparent"
                    style={{ fontFamily: 'Arial, sans-serif' }}
                  />
                ) : (
                  <span className="font-mono text-[12px] text-black">{data.cpfPaciente}</span>
                )}
              </div>
            </div>

            {/* DATA DO COMPARECIMENTO */}
            <div className="space-y-1">
              <label className="block text-[10.5px] font-bold uppercase text-slate-700">
                DATA DO COMPARECIMENTO
              </label>
              <div className="border-b border-black min-h-[24px] flex items-end pb-0.5">
                {isEditable ? (
                  <input
                    type="text"
                    value={data.dataComparecimento}
                    onChange={e => onChange?.('dataComparecimento', e.target.value)}
                    placeholder="DD / MM / AAAA"
                    className="w-full outline-none text-[12px] bg-amber-50/50 print:bg-transparent"
                    style={{ fontFamily: 'Arial, sans-serif' }}
                  />
                ) : (
                  <span className="text-[12px] text-black">{data.dataComparecimento}</span>
                )}
              </div>
            </div>
          </div>

          {/* Linha com 2 Colunas: HORÁRIO (opcional) e ATENDIMENTO / OBSERVAÇÃO (opcional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* HORÁRIO (opcional) */}
            <div className="space-y-1">
              <label className="block text-[10.5px] font-bold uppercase text-slate-700">
                HORÁRIO (opcional)
              </label>
              <div className="border-b border-black min-h-[24px] flex items-end pb-0.5">
                {isEditable ? (
                  <input
                    type="text"
                    value={data.horario}
                    onChange={e => onChange?.('horario', e.target.value)}
                    placeholder="Ex: das 14:00 às 16:30"
                    className="w-full outline-none text-[12px] bg-amber-50/50 print:bg-transparent"
                    style={{ fontFamily: 'Arial, sans-serif' }}
                  />
                ) : (
                  <span className="text-[12px] text-black">{data.horario}</span>
                )}
              </div>
            </div>

            {/* ATENDIMENTO / OBSERVAÇÃO (opcional) */}
            <div className="space-y-1">
              <label className="block text-[10.5px] font-bold uppercase text-slate-700">
                ATENDIMENTO / OBSERVAÇÃO (opcional)
              </label>
              <div className="border-b border-black min-h-[24px] flex items-end pb-0.5">
                {isEditable ? (
                  <input
                    type="text"
                    value={data.observacao}
                    onChange={e => onChange?.('observacao', e.target.value)}
                    placeholder="Ex: Paciente aguardando medicação / Acompanhante"
                    className="w-full outline-none text-[12px] bg-amber-50/50 print:bg-transparent"
                    style={{ fontFamily: 'Arial, sans-serif' }}
                  />
                ) : (
                  <span className="text-[12px] text-black">{data.observacao}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Texto de Conclusão / Comprovação */}
        <div className="text-justify text-[12px] sm:text-[12.5px] leading-relaxed mb-10 text-black">
          <p className="m-0">
            Para fins de comprovação, declara-se que o comparecimento ocorreu na data acima informada, durante atendimento nesta instituição.
          </p>
        </div>

        {/* Linha de Local e Data */}
        <div className="text-right text-[12px] mb-12 text-black">
          Palmas-TO,{' '}
          {isEditable ? (
            <span className="inline-flex items-center gap-1 font-sans">
              <input
                type="text"
                value={data.diaEmissao}
                onChange={e => onChange?.('diaEmissao', e.target.value)}
                placeholder="____"
                className="w-10 border-b border-black text-center outline-none bg-amber-50/50 print:bg-transparent text-xs"
              />
              <span>de</span>
              <input
                type="text"
                value={data.mesEmissao}
                onChange={e => onChange?.('mesEmissao', e.target.value)}
                placeholder="________________"
                className="w-28 border-b border-black text-center outline-none bg-amber-50/50 print:bg-transparent text-xs"
              />
              <span>de</span>
              <input
                type="text"
                value={data.anoEmissao}
                onChange={e => onChange?.('anoEmissao', e.target.value)}
                placeholder="________"
                className="w-16 border-b border-black text-center outline-none bg-amber-50/50 print:bg-transparent text-xs"
              />
            </span>
          ) : (
            <span>
              {data.diaEmissao || '________'} de {data.mesEmissao || '________________'} de {data.anoEmissao || '________'}
            </span>
          )}
        </div>

        {/* Assinatura / Carimbo do Responsável */}
        <div className="pt-8 max-w-sm mx-auto text-center space-y-1">
          <div className="border-t border-black mb-1.5"></div>
          <p className="font-bold text-[12px] uppercase tracking-wide text-black m-0">
            HOSPITAL PALMAS MEDICAL
          </p>
          <p className="text-[10px] text-slate-600 m-0">
            Assinatura / carimbo do responsável
          </p>
        </div>
      </div>

      {/* Rodapé Oficial com Endereço e Telefone */}
      <div className="pt-8 border-t border-slate-200 mt-10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[10.5px] text-slate-800">
        <div className="font-bold text-[#B01B52]">
          redemedical.com.br
        </div>
        <div className="text-center text-slate-700">
          401 Sul Avenida Conj. 02 Lote 02 - Edifício Palmas Medical Center
        </div>
        <div className="text-right font-bold text-[#B01B52] font-mono">
          (63) 3236-1818
        </div>
      </div>
    </div>
  );
};
