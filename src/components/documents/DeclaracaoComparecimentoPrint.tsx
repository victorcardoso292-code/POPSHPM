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
      className="bg-white text-black p-6 sm:p-10 max-w-[800px] mx-auto text-[12px] leading-normal border border-slate-300 print:border-none print:p-0 print:m-0 print:max-w-none print:w-full print:text-[11.5pt] page-break-avoid"
      style={{ fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}
    >
      {/* Moldura da Folha A4 com Área Útil e Margem Lateral para o RT */}
      <div className="flex justify-between items-stretch gap-4 print:gap-3 w-full">
        {/* Corpo Principal da Declaração (ABNT) */}
        <div className="flex-1 flex flex-col justify-between min-h-[920px] print:min-h-0 print:h-auto">
          <div>
            {/* Cabeçalho Institucional Oficial */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-800 print:border-black">
              {/* Logo Esquerda - Cruz Medical Estilizada */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 text-[#0E7B86] flex items-center justify-center font-bold text-3xl leading-none">
                  ✚
                </div>
              </div>

              {/* Logo Direita - Medical Palmas Kora Saúde */}
              <div className="flex items-center gap-2.5">
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
                  <div className="text-[8.5px] text-slate-500 font-normal leading-none mt-0.5">
                    Kora Saúde
                  </div>
                </div>
              </div>
            </div>

            {/* Título Centralizado em Conformidade ABNT (Caixa Alta, Negrito, 14pt) */}
            <div className="text-center my-8 print:my-7">
              <h1 className="text-base sm:text-lg font-bold uppercase tracking-wider text-black m-0 leading-tight">
                DECLARAÇÃO DE COMPARECIMENTO
              </h1>
            </div>

            {/* Parágrafo de Fé Pública / Texto Declaratório (Espaçamento 1,5, Justificado, ABNT) */}
            <div className="text-justify text-[12.5px] sm:text-[13px] print:text-[12pt] leading-relaxed print:leading-[1.6] mb-7 text-black">
              <p className="m-0 indent-8">
                O <strong>HOSPITAL PALMAS MEDICAL LTDA.</strong>, inscrito sob o <strong>CNPJ nº 12.955.953/0001-92</strong>, declara, para os devidos fins de comprovação legal, que o(a) paciente abaixo identificado(a) esteve presente nas dependências desta instituição hospitalar para a realização de <strong>CONSULTA EM PRONTO SOCORRO</strong>.
              </p>
            </div>

            {/* Quadro Estruturado de Dados do Paciente e Atendimento */}
            <div className="border border-black rounded-xl p-4 sm:p-5 print:p-4 my-6 bg-white space-y-4 print:space-y-3.5">
              {/* Título do Quadro */}
              <div className="text-[#0E7B86] font-bold uppercase text-[11px] print:text-[10.5pt] tracking-wider border-b border-slate-200 print:border-black/30 pb-1.5">
                DADOS DO PACIENTE / ATENDIMENTO
              </div>

              {/* Linha 1: Nome do Paciente */}
              <div>
                <div className="text-[10px] print:text-[9.5pt] font-bold uppercase text-slate-700 print:text-black mb-1">
                  NOME DO PACIENTE
                </div>
                <div className="border-b border-black min-h-[26px] flex items-end pb-0.5">
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.nomePaciente}
                      onChange={e => onChange?.('nomePaciente', e.target.value)}
                      placeholder="Nome completo do paciente"
                      className="w-full outline-none font-bold text-[12px] print:text-[11.5pt] bg-amber-50/50 print:bg-transparent"
                      style={{ fontFamily: 'Arial, sans-serif' }}
                    />
                  ) : (
                    <span className="font-bold text-[12px] print:text-[11.5pt] text-black">
                      {data.nomePaciente || ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Linha 2: CPF e Data do Comparecimento (2 Colunas Proporcionais) */}
              <div className="grid grid-cols-2 gap-6 print:gap-5">
                {/* CPF */}
                <div>
                  <div className="text-[10px] print:text-[9.5pt] font-bold uppercase text-slate-700 print:text-black mb-1">
                    CPF
                  </div>
                  <div className="border-b border-black min-h-[26px] flex items-end pb-0.5">
                    {isEditable ? (
                      <input
                        type="text"
                        value={data.cpfPaciente}
                        onChange={e => onChange?.('cpfPaciente', e.target.value)}
                        placeholder="000.000.000-00"
                        className="w-full outline-none font-mono text-[12px] print:text-[11.5pt] bg-amber-50/50 print:bg-transparent"
                        style={{ fontFamily: 'Arial, sans-serif' }}
                      />
                    ) : (
                      <span className="font-mono text-[12px] print:text-[11.5pt] text-black">
                        {data.cpfPaciente || ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Data do Comparecimento */}
                <div>
                  <div className="text-[10px] print:text-[9.5pt] font-bold uppercase text-slate-700 print:text-black mb-1">
                    DATA DO COMPARECIMENTO
                  </div>
                  <div className="border-b border-black min-h-[26px] flex items-end pb-0.5">
                    {isEditable ? (
                      <input
                        type="text"
                        value={data.dataComparecimento}
                        onChange={e => onChange?.('dataComparecimento', e.target.value)}
                        placeholder="DD / MM / AAAA"
                        className="w-full outline-none text-[12px] print:text-[11.5pt] bg-amber-50/50 print:bg-transparent"
                        style={{ fontFamily: 'Arial, sans-serif' }}
                      />
                    ) : (
                      <span className="text-[12px] print:text-[11.5pt] text-black">
                        {data.dataComparecimento || ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Linha 3: Horário e Atendimento/Observação (2 Colunas Proporcionais) */}
              <div className="grid grid-cols-2 gap-6 print:gap-5">
                {/* Horário */}
                <div>
                  <div className="text-[10px] print:text-[9.5pt] font-bold uppercase text-slate-700 print:text-black mb-1">
                    HORÁRIO (opcional)
                  </div>
                  <div className="border-b border-black min-h-[26px] flex items-end pb-0.5">
                    {isEditable ? (
                      <input
                        type="text"
                        value={data.horario}
                        onChange={e => onChange?.('horario', e.target.value)}
                        placeholder="Ex: das 14:00 às 16:30"
                        className="w-full outline-none text-[12px] print:text-[11.5pt] bg-amber-50/50 print:bg-transparent"
                        style={{ fontFamily: 'Arial, sans-serif' }}
                      />
                    ) : (
                      <span className="text-[12px] print:text-[11.5pt] text-black">
                        {data.horario || ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Atendimento / Observação */}
                <div>
                  <div className="text-[10px] print:text-[9.5pt] font-bold uppercase text-slate-700 print:text-black mb-1">
                    ATENDIMENTO / OBSERVAÇÃO (opcional)
                  </div>
                  <div className="border-b border-black min-h-[26px] flex items-end pb-0.5">
                    {isEditable ? (
                      <input
                        type="text"
                        value={data.observacao}
                        onChange={e => onChange?.('observacao', e.target.value)}
                        placeholder="Ex: Consulta médica e administração de medicação"
                        className="w-full outline-none text-[12px] print:text-[11.5pt] bg-amber-50/50 print:bg-transparent"
                        style={{ fontFamily: 'Arial, sans-serif' }}
                      />
                    ) : (
                      <span className="text-[12px] print:text-[11.5pt] text-black">
                        {data.observacao || ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Parágrafo de Ratificação / Comprovação */}
            <div className="text-justify text-[12.5px] sm:text-[13px] print:text-[12pt] leading-relaxed print:leading-[1.6] my-6 text-black">
              <p className="m-0 indent-8">
                Para fins de comprovação, declara-se que o comparecimento ocorreu na data acima informada, durante atendimento nesta instituição hospitalar.
              </p>
            </div>

            {/* Datação Oficial (Alinhamento à Direita conforme ABNT) */}
            <div className="text-right text-[12px] print:text-[11.5pt] my-8 print:my-7 text-black">
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

            {/* Bloco de Assinatura e Carimbo Centralizado */}
            <div className="pt-8 print:pt-6 max-w-sm mx-auto text-center space-y-1">
              <div className="border-t border-black mb-1.5 w-full"></div>
              <p className="font-bold text-[12px] print:text-[11.5pt] uppercase tracking-wider text-black m-0">
                HOSPITAL PALMAS MEDICAL
              </p>
              <p className="text-[10px] print:text-[9.5pt] text-slate-600 print:text-black m-0">
                Assinatura / carimbo do responsável
              </p>
            </div>
          </div>

          {/* Rodapé Oficial Padronizado (Endereço, Site e Telefone) */}
          <div className="pt-6 print:pt-4 border-t border-slate-300 print:border-black mt-8 print:mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] print:text-[9pt] text-slate-800 print:text-black">
            <div className="font-bold text-[#B01B52] print:text-black">
              redemedical.com.br
            </div>
            <div className="text-center text-slate-700 print:text-black">
              401 Sul Avenida Conj. 02 Lote 02 - Edifício Palmas Medical Center
            </div>
            <div className="text-right font-bold text-[#B01B52] print:text-black font-mono">
              (63) 3236-1818
            </div>
          </div>
        </div>

        {/* Coluna Lateral Integrada do Responsável Técnico (RT) - Não transborda nem cria 2ª folha */}
        <div className="w-5 print:w-4 flex items-center justify-center select-none shrink-0 border-l border-slate-200 print:border-transparent pl-1">
          <div 
            className="text-[9.5px] print:text-[8pt] font-bold tracking-wider text-[#B01B52] print:text-black whitespace-nowrap"
            style={{ 
              writingMode: 'vertical-rl', 
              transform: 'rotate(180deg)',
              letterSpacing: '0.08em'
            }}
          >
            RT: Dr. Nilo Francisco de Sales Sobrinho - CRM-TO 4686
          </div>
        </div>
      </div>
    </div>
  );
};
