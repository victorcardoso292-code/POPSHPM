import React from 'react';

export interface TermoRetiradaCorpoData {
  // Controle do Documento
  codigo?: string;
  versao: string;
  dataEdicao: string;
  dataRevisao: string;
  areaResponsavel: string;

  // 1. Identificação do Paciente
  nomePaciente: string;
  numeroAtendimento: string;
  nomeMae: string;
  dataInternacao: string;
  dataNascimento: string;
  naturalidadeEstado: string;
  cpfPaciente: string;
  sexo: 'feminino' | 'masculino' | '';
  estadoCivil: 'solteiro' | 'casado' | 'divorciado' | 'outros' | '';
  convenio: string;
  numeroCarteira: string;
  endereco: string;
  cidade: string;
  estado: string;

  // 2. Identificação da Liberação
  numeroDO: string;
  tipoDestino: 'IML' | 'SVO' | '';
  causaMorte: string;
  dataObito: string;
  horaObito: string;
  medicoResp: string;

  // 3. Identificação do Familiar / Responsável pela Retirada
  nomeFamiliar: string;
  cpfFamiliar: string;
  telefoneFamiliar: string;

  // 4. Identificação da Funerária
  nomeFuneraria: string;
  placaVeiculo: string;
  nomeMotorista: string;
  telefone1Funeraria: string;
  telefone2Funeraria: string;

  // Assinaturas
  recepcionista: string;
}

export type SpacingLevel = 'compacto' | 'confortavel' | 'amplo';

interface TermoRetiradaCorpoPrintProps {
  data: TermoRetiradaCorpoData;
  onChange?: (field: keyof TermoRetiradaCorpoData, val: any) => void;
  isEditable?: boolean;
  spacingLevel?: SpacingLevel;
}

export const TermoRetiradaCorpoPrint: React.FC<TermoRetiradaCorpoPrintProps> = ({
  data,
  onChange,
  isEditable = false,
  spacingLevel = 'confortavel'
}) => {
  // Padding adaptado: no modo impressão (print), fixa-se estritamente para garantir 1 PÁGINA ÚNICA
  const cellPadding = 
    spacingLevel === 'amplo'
      ? 'py-2 px-2.5 sm:py-2.5 sm:px-3 print:py-1 print:px-2'
      : spacingLevel === 'confortavel'
      ? 'py-1.5 px-2.5 sm:py-2 sm:px-3 print:py-1 print:px-2'
      : 'py-1 px-2 print:py-0.5 print:px-1.5';

  const sectionMargin = 
    spacingLevel === 'amplo'
      ? 'mb-3 sm:mb-3.5 print:mb-2'
      : spacingLevel === 'confortavel'
      ? 'mb-2.5 sm:mb-3 print:mb-2'
      : 'mb-2 print:mb-1.5';

  const signatureMargin = 
    spacingLevel === 'amplo'
      ? 'my-5 sm:my-6 print:my-2.5 pt-2 print:pt-1'
      : spacingLevel === 'confortavel'
      ? 'my-4 sm:my-5 print:my-2.5 pt-2 print:pt-1'
      : 'my-3 print:my-2 pt-1';

  const signatureHeight = 
    spacingLevel === 'amplo'
      ? 'h-10 sm:h-12 print:h-8'
      : spacingLevel === 'confortavel'
      ? 'h-8 sm:h-10 print:h-7'
      : 'h-6 print:h-5';

  return (
    <div 
      id="termo-retirada-corpo-document"
      className="text-black bg-white p-4 sm:p-6 max-w-[850px] mx-auto text-[9pt] leading-normal border border-slate-300 print:border-none print:p-0 print:m-0 print:max-w-full print:text-[8.5pt] print:leading-tight page-break-avoid break-inside-avoid print:max-h-[275mm] selection:bg-teal-100"
      style={{ fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}
    >
      {/* =========================================================================
          CABEÇALHO OFICIAL • MEDICAL KORA SAÚDE | FORMULÁRIO | CONTROLE
          ========================================================================= */}
      <table className={`w-full border-collapse border border-black ${sectionMargin} text-black`}>
        <tbody>
          <tr>
            {/* Coluna 1: Logo Medical Kora Saúde */}
            <td className="w-48 sm:w-52 p-2 sm:p-2.5 print:p-1.5 border-r border-black align-middle text-left bg-white">
              <div className="flex items-center gap-2">
                {/* Cruz Estilizada Medical */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 print:w-7 print:h-7 rounded-lg bg-[#EBF7F8] border border-[#C4E5E8] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 print:w-4.5 print:h-4.5 text-[#0E7B86]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C12 3.12 13.12 2 14.5 2H17.5C18.88 2 20 3.12 20 4.5V10C20 11.1 20.9 12 22 12H27.5C28.88 12 30 13.12 30 14.5V17.5C30 18.88 28.88 20 27.5 20H22C20.9 20 20 20.9 20 22V27.5C20 28.88 18.88 30 17.5 30H14.5C13.12 30 12 28.88 12 27.5V22C12 20.9 11.1 20 10 20H4.5C3.12 20 2 18.88 2 17.5V14.5C2 13.12 3.12 12 4.5 12H10C11.1 12 12 11.1 12 10V4.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="#D8ECEE" />
                  </svg>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xl sm:text-2xl print:text-lg font-black tracking-tight text-[#B01B52]">
                    Medical
                  </span>
                  <span className="text-[10px] print:text-[8.5pt] font-bold text-slate-800 tracking-wider">
                    Kora<span className="font-semibold text-slate-500">Saúde</span>
                  </span>
                </div>
              </div>
            </td>

            {/* Coluna 2: Título do Formulário */}
            <td className="p-2 sm:p-2.5 print:p-1.5 border-r border-black text-center align-middle">
              <div className="text-sm sm:text-base print:text-[11pt] font-black uppercase tracking-wider text-black">
                FORMULÁRIO
              </div>
              <div className="text-xs sm:text-sm print:text-[9.5pt] font-bold uppercase tracking-tight text-slate-900 mt-0.5">
                TERMO DE RETIRADA DE CORPO
              </div>
            </td>

            {/* Coluna 3: Controle do Documento */}
            <td className="w-52 sm:w-56 print:w-48 p-2 print:p-1 text-[8pt] print:text-[7.5pt] align-middle text-black leading-tight">
              <div className="font-bold uppercase tracking-wider mb-1 text-[7.5pt] print:text-[7pt] text-slate-900 pb-0.5 border-b border-black/30">
                CONTROLE DO DOCUMENTO
              </div>
              <div className="space-y-0.5">
                <div className="flex justify-between items-center">
                  <span>Versão:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.versao}
                      onChange={e => onChange?.('versao', e.target.value)}
                      placeholder="____"
                      className="w-12 text-right font-mono bg-amber-50/70 print:bg-transparent outline-none border-b border-dotted border-black text-[8pt] print:text-[7.5pt]"
                    />
                  ) : (
                    <span className="font-mono">{data.versao || '____'}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span>Data de edição:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.dataEdicao}
                      onChange={e => onChange?.('dataEdicao', e.target.value)}
                      placeholder="____/____/______"
                      className="w-20 text-right font-mono bg-amber-50/70 print:bg-transparent outline-none border-b border-dotted border-black text-[8pt] print:text-[7.5pt]"
                    />
                  ) : (
                    <span className="font-mono">{data.dataEdicao || '____/____/______'}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span>Data da revisão:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.dataRevisao}
                      onChange={e => onChange?.('dataRevisao', e.target.value)}
                      placeholder="____/____/______"
                      className="w-20 text-right font-mono bg-amber-50/70 print:bg-transparent outline-none border-b border-dotted border-black text-[8pt] print:text-[7.5pt]"
                    />
                  ) : (
                    <span className="font-mono">{data.dataRevisao || '____/____/______'}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span>Área responsável:</span>
                  <span className="font-bold">{data.areaResponsavel || 'Diretoria'}</span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* =========================================================================
          SEÇÃO 1. IDENTIFICAÇÃO DO PACIENTE
          Campos calibrados por linha: Naturalidade/Estado possui 66% da largura
          para evitar quebras indesejadas em cidades como "Paraíso do Tocantins - TO"
          ========================================================================= */}
      <div className={`border border-black ${sectionMargin} text-black`}>
        <div className="bg-[#0b2546] text-white font-black text-[9pt] print:text-[8.5pt] uppercase px-2.5 py-1 tracking-wider border-b border-black">
          1. IDENTIFICAÇÃO DO PACIENTE
        </div>
        
        {/* Linha 1: Nome (66%) | Atendimento Nº (34%) */}
        <div className="flex border-b border-black">
          <div className={`w-[66%] border-r border-black ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">NOME:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.nomePaciente}
                onChange={e => onChange?.('nomePaciente', e.target.value)}
                placeholder="Nome completo do paciente"
                className="flex-1 font-bold outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="font-bold underline decoration-dotted decoration-1 flex-1 min-h-[18px] truncate text-[8.5pt] print:text-[8pt]">
                {data.nomePaciente || '_________________________________________________'}
              </span>
            )}
          </div>
          <div className={`w-[34%] ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">ATENDIMENTO Nº:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.numeroAtendimento}
                onChange={e => onChange?.('numeroAtendimento', e.target.value)}
                placeholder="Nº Atendimento"
                className="flex-1 font-mono font-bold outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="font-mono font-bold underline decoration-dotted decoration-1 flex-1 min-h-[18px] text-[8.5pt] print:text-[8pt]">
                {data.numeroAtendimento || '____________________'}
              </span>
            )}
          </div>
        </div>

        {/* Linha 2: Nome da Mãe (66%) | Data de Internação (34%) */}
        <div className="flex border-b border-black">
          <div className={`w-[66%] border-r border-black ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">NOME DA MÃE:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.nomeMae}
                onChange={e => onChange?.('nomeMae', e.target.value)}
                placeholder="Filiação materna completa"
                className="flex-1 outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="underline decoration-dotted decoration-1 flex-1 min-h-[18px] truncate text-[8.5pt] print:text-[8pt]">
                {data.nomeMae || '____________________________________________'}
              </span>
            )}
          </div>
          <div className={`w-[34%] ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">DATA DE INTERNAÇÃO:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.dataInternacao}
                onChange={e => onChange?.('dataInternacao', e.target.value)}
                placeholder="DD/MM/AAAA"
                className="flex-1 font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="font-mono underline decoration-dotted decoration-1 flex-1 min-h-[18px] text-[8.5pt] print:text-[8pt]">
                {data.dataInternacao || '____/____/______'}
              </span>
            )}
          </div>
        </div>

        {/* Linha 3: Data de Nascimento (34%) | Naturalidade / Estado (66%) -> NÃO QUEBRA MAIS EM DUAS LINHAS */}
        <div className="flex border-b border-black">
          <div className={`w-[34%] border-r border-black ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">DATA DE NASCIMENTO:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.dataNascimento}
                onChange={e => onChange?.('dataNascimento', e.target.value)}
                placeholder="DD/MM/AAAA"
                className="w-24 font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="font-mono underline decoration-dotted decoration-1 min-h-[18px] text-[8.5pt] print:text-[8pt] whitespace-nowrap">
                {data.dataNascimento || '____/____/______'}
              </span>
            )}
          </div>
          <div className={`w-[66%] ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">NATURALIDADE / ESTADO:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.naturalidadeEstado}
                onChange={e => onChange?.('naturalidadeEstado', e.target.value)}
                placeholder="Ex: Paraíso do Tocantins - TO"
                className="flex-1 outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="underline decoration-dotted decoration-1 flex-1 min-h-[18px] truncate text-[8.5pt] print:text-[8pt] whitespace-nowrap">
                {data.naturalidadeEstado || '______________________________'}
              </span>
            )}
          </div>
        </div>

        {/* Linha 4: CPF (44%) | Sexo (56%) */}
        <div className="flex border-b border-black">
          <div className={`w-[44%] border-r border-black ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">CPF:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.cpfPaciente}
                onChange={e => onChange?.('cpfPaciente', e.target.value)}
                placeholder="000.000.000-00"
                className="flex-1 max-w-[180px] font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="font-mono underline decoration-dotted decoration-1 flex-1 max-w-[180px] min-h-[18px] text-[8.5pt] print:text-[8pt] whitespace-nowrap">
                {data.cpfPaciente || '__________________________________'}
              </span>
            )}
          </div>
          <div className={`w-[56%] ${cellPadding} flex items-center gap-4 text-[8.5pt] print:text-[8pt]`}>
            <span className="font-bold uppercase whitespace-nowrap text-black">SEXO:</span>
            <label 
              onClick={() => isEditable && onChange?.('sexo', data.sexo === 'feminino' ? '' : 'feminino')}
              className={`inline-flex items-center gap-1 ${isEditable ? 'cursor-pointer hover:text-teal-900' : ''}`}
            >
              <span className="font-mono font-bold">( {data.sexo === 'feminino' ? <strong className="font-black text-black">X</strong> : ' '} )</span>
              <span>Feminino</span>
            </label>
            <label 
              onClick={() => isEditable && onChange?.('sexo', data.sexo === 'masculino' ? '' : 'masculino')}
              className={`inline-flex items-center gap-1 ${isEditable ? 'cursor-pointer hover:text-teal-900' : ''}`}
            >
              <span className="font-mono font-bold">( {data.sexo === 'masculino' ? <strong className="font-black text-black">X</strong> : ' '} )</span>
              <span>Masculino</span>
            </label>
          </div>
        </div>

        {/* Linha 5: Estado Civil (Largura Completa) */}
        <div className={`border-b border-black ${cellPadding} flex items-center gap-4 sm:gap-6 flex-wrap text-[8.5pt] print:text-[8pt]`}>
          <span className="font-bold uppercase whitespace-nowrap text-black">ESTADO CIVIL:</span>
          <label 
            onClick={() => isEditable && onChange?.('estadoCivil', data.estadoCivil === 'solteiro' ? '' : 'solteiro')}
            className={`inline-flex items-center gap-1 ${isEditable ? 'cursor-pointer hover:text-teal-900' : ''}`}
          >
            <span className="font-mono font-bold">( {data.estadoCivil === 'solteiro' ? <strong className="font-black text-black">X</strong> : ' '} )</span>
            <span>Solteiro</span>
          </label>
          <label 
            onClick={() => isEditable && onChange?.('estadoCivil', data.estadoCivil === 'casado' ? '' : 'casado')}
            className={`inline-flex items-center gap-1 ${isEditable ? 'cursor-pointer hover:text-teal-900' : ''}`}
          >
            <span className="font-mono font-bold">( {data.estadoCivil === 'casado' ? <strong className="font-black text-black">X</strong> : ' '} )</span>
            <span>Casado</span>
          </label>
          <label 
            onClick={() => isEditable && onChange?.('estadoCivil', data.estadoCivil === 'divorciado' ? '' : 'divorciado')}
            className={`inline-flex items-center gap-1 ${isEditable ? 'cursor-pointer hover:text-teal-900' : ''}`}
          >
            <span className="font-mono font-bold">( {data.estadoCivil === 'divorciado' ? <strong className="font-black text-black">X</strong> : ' '} )</span>
            <span>Divorciado</span>
          </label>
          <label 
            onClick={() => isEditable && onChange?.('estadoCivil', data.estadoCivil === 'outros' ? '' : 'outros')}
            className={`inline-flex items-center gap-1 ${isEditable ? 'cursor-pointer hover:text-teal-900' : ''}`}
          >
            <span className="font-mono font-bold">( {data.estadoCivil === 'outros' ? <strong className="font-black text-black">X</strong> : ' '} )</span>
            <span>Outros</span>
          </label>
        </div>

        {/* Linha 6: Convênio (58%) | Nº Carteira Convênio (42%) */}
        <div className="flex border-b border-black">
          <div className={`w-[58%] border-r border-black ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">CONVÊNIO:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.convenio}
                onChange={e => onChange?.('convenio', e.target.value)}
                placeholder="Nome do convênio ou Particular"
                className="flex-1 outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="underline decoration-dotted decoration-1 flex-1 min-h-[18px] truncate text-[8.5pt] print:text-[8pt]">
                {data.convenio || '__________________________________________'}
              </span>
            )}
          </div>
          <div className={`w-[42%] ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">Nº CARTEIRA CONVÊNIO:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.numeroCarteira}
                onChange={e => onChange?.('numeroCarteira', e.target.value)}
                placeholder="Número da carteira"
                className="flex-1 font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="font-mono underline decoration-dotted decoration-1 flex-1 min-h-[18px] text-[8.5pt] print:text-[8pt]">
                {data.numeroCarteira || '__________________________'}
              </span>
            )}
          </div>
        </div>

        {/* Linha 7: Endereço (Largura Completa) */}
        <div className={`border-b border-black ${cellPadding} flex items-center gap-1.5 min-w-0`}>
          <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">ENDEREÇO:</span>
          {isEditable ? (
            <input
              type="text"
              value={data.endereco}
              onChange={e => onChange?.('endereco', e.target.value)}
              placeholder="Logradouro, número, complemento, bairro"
              className="flex-1 outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
            />
          ) : (
            <span className="underline decoration-dotted decoration-1 flex-1 min-h-[18px] truncate text-[8.5pt] print:text-[8pt]">
              {data.endereco || '__________________________________________________________________________________'}
            </span>
          )}
        </div>

        {/* Linha 8: Cidade (70%) | Estado (30%) */}
        <div className="flex">
          <div className={`w-[70%] border-r border-black ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">CIDADE:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.cidade}
                onChange={e => onChange?.('cidade', e.target.value)}
                placeholder="Cidade de residência"
                className="flex-1 outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="underline decoration-dotted decoration-1 flex-1 min-h-[18px] truncate text-[8.5pt] print:text-[8pt]">
                {data.cidade || '__________________________________________'}
              </span>
            )}
          </div>
          <div className={`w-[30%] ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">ESTADO:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.estado}
                onChange={e => onChange?.('estado', e.target.value)}
                placeholder="UF"
                className="flex-1 uppercase outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="uppercase underline decoration-dotted decoration-1 flex-1 min-h-[18px] text-[8.5pt] print:text-[8pt]">
                {data.estado || '__________________'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SEÇÃO 2. IDENTIFICAÇÃO DA LIBERAÇÃO
          ========================================================================= */}
      <div className={`border border-black ${sectionMargin} text-black`}>
        <div className="bg-[#0b2546] text-white font-black text-[9pt] print:text-[8.5pt] uppercase px-2.5 py-1 tracking-wider border-b border-black">
          2. IDENTIFICAÇÃO DA LIBERAÇÃO
        </div>
        
        {/* Linha 1: Número da D.O. (58%) | Destino (42%) */}
        <div className="flex border-b border-black">
          <div className={`w-[58%] border-r border-black ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">NÚMERO DA D.O.:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.numeroDO}
                onChange={e => onChange?.('numeroDO', e.target.value)}
                placeholder="Declaração de Óbito Nº"
                className="flex-1 max-w-[200px] font-mono font-bold outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="font-mono font-bold underline decoration-dotted decoration-1 flex-1 max-w-[200px] min-h-[18px] text-[8.5pt] print:text-[8pt] whitespace-nowrap">
                {data.numeroDO || '__________________________________'}
              </span>
            )}
          </div>
          <div className={`w-[42%] ${cellPadding} flex items-center gap-4 text-[8.5pt] print:text-[8pt]`}>
            <span className="font-bold uppercase whitespace-nowrap text-black">DESTINO:</span>
            <label 
              onClick={() => isEditable && onChange?.('tipoDestino', data.tipoDestino === 'IML' ? '' : 'IML')}
              className={`inline-flex items-center gap-1 ${isEditable ? 'cursor-pointer hover:text-teal-900' : ''}`}
            >
              <span className="font-mono font-bold">( {data.tipoDestino === 'IML' ? <strong className="font-black text-black">X</strong> : ' '} )</span>
              <span>IML</span>
            </label>
            <label 
              onClick={() => isEditable && onChange?.('tipoDestino', data.tipoDestino === 'SVO' ? '' : 'SVO')}
              className={`inline-flex items-center gap-1 ${isEditable ? 'cursor-pointer hover:text-teal-900' : ''}`}
            >
              <span className="font-mono font-bold">( {data.tipoDestino === 'SVO' ? <strong className="font-black text-black">X</strong> : ' '} )</span>
              <span>SVO</span>
            </label>
          </div>
        </div>

        {/* Linha 2: Causa da Morte (Largura Completa) */}
        <div className={`border-b border-black ${cellPadding} flex items-center gap-1.5 min-w-0`}>
          <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">CAUSA DA MORTE:</span>
          {isEditable ? (
            <input
              type="text"
              value={data.causaMorte}
              onChange={e => onChange?.('causaMorte', e.target.value)}
              placeholder="Causa mortis conforme atestado/D.O."
              className="flex-1 outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
            />
          ) : (
            <span className="underline decoration-dotted decoration-1 flex-1 min-h-[18px] truncate text-[8.5pt] print:text-[8pt]">
              {data.causaMorte || '__________________________________________________________________________________'}
            </span>
          )}
        </div>

        {/* Linha 3: Data do Óbito (58%) | Hora do Óbito (42%) */}
        <div className="flex border-b border-black">
          <div className={`w-[58%] border-r border-black ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">DATA DO ÓBITO:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.dataObito}
                onChange={e => onChange?.('dataObito', e.target.value)}
                placeholder="DD/MM/AAAA"
                className="w-28 font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="font-mono underline decoration-dotted decoration-1 w-28 min-h-[18px] text-[8.5pt] print:text-[8pt]">
                {data.dataObito || '____/____/______'}
              </span>
            )}
          </div>
          <div className={`w-[42%] ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">HORA DO ÓBITO:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.horaObito}
                onChange={e => onChange?.('horaObito', e.target.value)}
                placeholder="HH:MM"
                className="w-20 font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="font-mono underline decoration-dotted decoration-1 w-20 min-h-[18px] text-[8.5pt] print:text-[8pt]">
                {data.horaObito || '______:______'}
              </span>
            )}
          </div>
        </div>

        {/* Linha 4: Médico Responsável (Largura Completa) */}
        <div className={`${cellPadding} flex items-center gap-1.5 min-w-0`}>
          <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">MÉDICO RESPONSÁVEL:</span>
          {isEditable ? (
            <input
              type="text"
              value={data.medicoResp}
              onChange={e => onChange?.('medicoResp', e.target.value)}
              placeholder="Nome do médico e CRM"
              className="flex-1 font-bold outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
            />
          ) : (
            <span className="font-bold underline decoration-dotted decoration-1 flex-1 min-h-[18px] truncate text-[8.5pt] print:text-[8pt]">
              {data.medicoResp || '_________________________________________________________________'}
            </span>
          )}
        </div>
      </div>

      {/* =========================================================================
          SEÇÃO 3. IDENTIFICAÇÃO DO FAMILIAR / RESPONSÁVEL PELA RETIRADA
          ========================================================================= */}
      <div className={`border border-black ${sectionMargin} text-black`}>
        <div className="bg-[#0b2546] text-white font-black text-[9pt] print:text-[8.5pt] uppercase px-2.5 py-1 tracking-wider border-b border-black">
          3. IDENTIFICAÇÃO DO FAMILIAR / RESPONSÁVEL PELA RETIRADA
        </div>
        
        {/* Linha 1: Nome (Largura Completa) */}
        <div className={`border-b border-black ${cellPadding} flex items-center gap-1.5 min-w-0`}>
          <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">NOME:</span>
          {isEditable ? (
            <input
              type="text"
              value={data.nomeFamiliar}
              onChange={e => onChange?.('nomeFamiliar', e.target.value)}
              placeholder="Nome completo do familiar ou responsável legal"
              className="flex-1 font-bold outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
            />
          ) : (
            <span className="font-bold underline decoration-dotted decoration-1 flex-1 min-h-[18px] truncate text-[8.5pt] print:text-[8pt]">
              {data.nomeFamiliar || '__________________________________________________________________________________'}
            </span>
          )}
        </div>

        {/* Linha 2: CPF (50%) | Telefone (50%) */}
        <div className="flex">
          <div className={`w-[50%] border-r border-black ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">CPF:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.cpfFamiliar}
                onChange={e => onChange?.('cpfFamiliar', e.target.value)}
                placeholder="000.000.000-00"
                className="flex-1 max-w-[180px] font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="font-mono underline decoration-dotted decoration-1 flex-1 max-w-[180px] min-h-[18px] text-[8.5pt] print:text-[8pt] whitespace-nowrap">
                {data.cpfFamiliar || '__________________________________'}
              </span>
            )}
          </div>
          <div className={`w-[50%] ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">TELEFONE:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.telefoneFamiliar}
                onChange={e => onChange?.('telefoneFamiliar', e.target.value)}
                placeholder="(63) 99999-9999"
                className="flex-1 font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="font-mono underline decoration-dotted decoration-1 flex-1 min-h-[18px] text-[8.5pt] print:text-[8pt]">
                {data.telefoneFamiliar || '______________________________'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SEÇÃO 4. IDENTIFICAÇÃO DA FUNERÁRIA
          ========================================================================= */}
      <div className={`border border-black ${sectionMargin} text-black`}>
        <div className="bg-[#0b2546] text-white font-black text-[9pt] print:text-[8.5pt] uppercase px-2.5 py-1 tracking-wider border-b border-black">
          4. IDENTIFICAÇÃO DA FUNERÁRIA
        </div>
        
        {/* Linha 1: Funerária (Largura Completa) */}
        <div className={`border-b border-black ${cellPadding} flex items-center gap-1.5 min-w-0`}>
          <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">FUNERÁRIA:</span>
          {isEditable ? (
            <input
              type="text"
              value={data.nomeFuneraria}
              onChange={e => onChange?.('nomeFuneraria', e.target.value)}
              placeholder="Nome da empresa funerária"
              className="flex-1 font-bold outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
            />
          ) : (
            <span className="font-bold underline decoration-dotted decoration-1 flex-1 min-h-[18px] truncate text-[8.5pt] print:text-[8pt]">
              {data.nomeFuneraria || '______________________________________________________________________________'}
            </span>
          )}
        </div>

        {/* Linha 2: Placa do Veículo (36%) | Nome do Motorista (64%) */}
        <div className="flex border-b border-black">
          <div className={`w-[36%] border-r border-black ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">PLACA DO VEÍCULO:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.placaVeiculo}
                onChange={e => onChange?.('placaVeiculo', e.target.value)}
                placeholder="ABC-1234"
                className="w-28 font-mono uppercase outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="font-mono uppercase underline decoration-dotted decoration-1 w-28 min-h-[18px] text-[8.5pt] print:text-[8pt]">
                {data.placaVeiculo || '______________________________'}
              </span>
            )}
          </div>
          <div className={`w-[64%] ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">NOME DO MOTORISTA:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.nomeMotorista}
                onChange={e => onChange?.('nomeMotorista', e.target.value)}
                placeholder="Nome do motorista / agente funerário"
                className="flex-1 outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="underline decoration-dotted decoration-1 flex-1 min-h-[18px] truncate text-[8.5pt] print:text-[8pt]">
                {data.nomeMotorista || '______________________________'}
              </span>
            )}
          </div>
        </div>

        {/* Linha 3: Telefone 1 (50%) | Telefone 2 (50%) */}
        <div className="flex">
          <div className={`w-[50%] border-r border-black ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">TELEFONE 1:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.telefone1Funeraria}
                onChange={e => onChange?.('telefone1Funeraria', e.target.value)}
                placeholder="(63) 0000-0000"
                className="w-32 font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="font-mono underline decoration-dotted decoration-1 w-32 min-h-[18px] text-[8.5pt] print:text-[8pt]">
                {data.telefone1Funeraria || '__________________________'}
              </span>
            )}
          </div>
          <div className={`w-[50%] ${cellPadding} flex items-center gap-1.5 min-w-0`}>
            <span className="font-bold uppercase whitespace-nowrap text-black text-[8.5pt] print:text-[8pt]">TELEFONE 2:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.telefone2Funeraria}
                onChange={e => onChange?.('telefone2Funeraria', e.target.value)}
                placeholder="(63) 0000-0000"
                className="w-32 font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[8.5pt] print:text-[8pt] py-0.5"
              />
            ) : (
              <span className="font-mono underline decoration-dotted decoration-1 w-32 min-h-[18px] text-[8.5pt] print:text-[8pt]">
                {data.telefone2Funeraria || '__________________________'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          CAMPOS DE ASSINATURA DUPLA (CALIBRADO PARA PÁGINA ÚNICA)
          ========================================================================= */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 print:gap-8 text-center text-[8.5pt] print:text-[8pt] ${signatureMargin}`}>
        <div className="flex flex-col justify-end">
          <div className={signatureHeight}></div>
          <div className="border-t border-black max-w-[280px] sm:max-w-[320px] print:max-w-[260px] w-full mx-auto mb-1"></div>
          <p className="font-bold m-0 text-black leading-tight">
            Assinatura do familiar / responsável
          </p>
        </div>
        <div className="flex flex-col justify-end">
          <div className={signatureHeight}></div>
          <div className="border-t border-black max-w-[320px] sm:max-w-[340px] print:max-w-[280px] w-full mx-auto mb-1"></div>
          <p className="font-bold m-0 text-black leading-tight">
            Nome e assinatura do recepcionista responsável pela liberação
          </p>
          {data.recepcionista && (
            <p className="text-[8pt] font-mono font-bold text-slate-800 m-0 mt-0.5">
              {data.recepcionista}
            </p>
          )}
        </div>
      </div>

      {/* =========================================================================
          QUADRO DE CONTROLE INTERNO (RODAPÉ OFICIAL)
          ========================================================================= */}
      <div className="border border-black py-1 px-2 print:py-0.5 print:px-1.5 text-center text-[8pt] print:text-[7.5pt] font-medium text-black mb-2 print:mb-1.5 bg-white">
        Documento de controle interno • Preencher todos os campos aplicáveis com letra legível. • Não rasurar.
      </div>

      {/* =========================================================================
          RODAPÉ DE PÁGINA (PAGINAÇÃO INSTITUCIONAL)
          ========================================================================= */}
      <div className="flex justify-between items-center text-[7.5pt] print:text-[7pt] text-slate-500 pt-1 border-t border-slate-200 print:border-slate-300">
        <span>Medical Kora Saúde • Termo de Retirada de Corpo</span>
        <span>Página 1</span>
      </div>
    </div>
  );
};
