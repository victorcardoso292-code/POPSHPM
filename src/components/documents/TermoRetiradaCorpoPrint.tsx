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
  spacingLevel = 'amplo'
}) => {
  // Spacing helper classes according to selected density
  const cellPadding = 
    spacingLevel === 'amplo' 
      ? 'py-2.5 px-3 sm:py-3 sm:px-3.5' 
      : spacingLevel === 'confortavel' 
      ? 'py-2 px-2.5 sm:py-2.5 sm:px-3' 
      : 'py-1.5 px-2';

  const sectionMargin = 
    spacingLevel === 'amplo' 
      ? 'mb-4 sm:mb-5' 
      : spacingLevel === 'confortavel' 
      ? 'mb-3 sm:mb-4' 
      : 'mb-2';

  const signatureMargin = 
    spacingLevel === 'amplo' 
      ? 'my-8 sm:my-10 pt-4' 
      : spacingLevel === 'confortavel' 
      ? 'my-6 sm:my-7 pt-3' 
      : 'my-4 pt-2';

  const signatureBlankHeight = 
    spacingLevel === 'amplo' 
      ? 'h-14 sm:h-16' 
      : spacingLevel === 'confortavel' 
      ? 'h-10 sm:h-12' 
      : 'h-8';

  return (
    <div 
      className="text-black bg-white p-4 sm:p-7 max-w-[860px] mx-auto text-[9.5pt] leading-normal border border-slate-300 print:border-none print:p-0 print:max-w-full selection:bg-teal-100"
      style={{ fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}
    >
      {/* =========================================================================
          CABEÇALHO OFICIAL • MEDICAL KORA SAÚDE | FORMULÁRIO | CONTROLE
          ========================================================================= */}
      <table className={`w-full border-collapse border border-black ${sectionMargin} text-black`}>
        <tbody>
          <tr>
            {/* Coluna 1: Logo Medical Kora Saúde */}
            <td className="w-52 p-3 border-r border-black align-middle text-left bg-white">
              <div className="flex items-center gap-2.5">
                {/* Cruz Estilizada Medical */}
                <div className="w-10 h-10 rounded-lg bg-[#EBF7F8] border border-[#C4E5E8] flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#0E7B86]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C12 3.12 13.12 2 14.5 2H17.5C18.88 2 20 3.12 20 4.5V10C20 11.1 20.9 12 22 12H27.5C28.88 12 30 13.12 30 14.5V17.5C30 18.88 28.88 20 27.5 20H22C20.9 20 20 20.9 20 22V27.5C20 28.88 18.88 30 17.5 30H14.5C13.12 30 12 28.88 12 27.5V22C12 20.9 11.1 20 10 20H4.5C3.12 20 2 18.88 2 17.5V14.5C2 13.12 3.12 12 4.5 12H10C11.1 12 12 11.1 12 10V4.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="#D8ECEE" />
                  </svg>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-2xl font-black tracking-tight text-[#B01B52]">
                    Medical
                  </span>
                  <span className="text-[11px] font-bold text-slate-800 tracking-wider">
                    Kora<span className="font-semibold text-slate-500">Saúde</span>
                  </span>
                </div>
              </div>
            </td>

            {/* Coluna 2: Título do Formulário */}
            <td className="p-3 border-r border-black text-center align-middle">
              <div className="text-base sm:text-lg font-black uppercase tracking-wider text-black">
                FORMULÁRIO
              </div>
              <div className="text-xs sm:text-[11pt] font-bold uppercase tracking-tight text-slate-900 mt-1">
                TERMO DE RETIRADA DE CORPO
              </div>
            </td>

            {/* Coluna 3: Controle do Documento */}
            <td className="w-60 p-2.5 text-[8.5pt] align-middle text-black leading-tight">
              <div className="font-bold uppercase tracking-wider mb-1.5 text-[8pt] text-slate-900 pb-0.5 border-b border-black/30">
                CONTROLE DO DOCUMENTO
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span>Versão:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.versao}
                      onChange={e => onChange?.('versao', e.target.value)}
                      placeholder="____"
                      className="w-14 text-right font-mono bg-amber-50/70 print:bg-transparent outline-none border-b border-dotted border-black text-[8.5pt]"
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
                      className="w-24 text-right font-mono bg-amber-50/70 print:bg-transparent outline-none border-b border-dotted border-black text-[8.5pt]"
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
                      className="w-24 text-right font-mono bg-amber-50/70 print:bg-transparent outline-none border-b border-dotted border-black text-[8.5pt]"
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
          SEÇÃO 1. IDENTIFICAÇÃO DO PACIENTE (ESTRUTURA EM TABELA COM ESPAÇAMENTO)
          ========================================================================= */}
      <div className={`border border-black ${sectionMargin} text-black`}>
        <div className="bg-[#0b2546] text-white font-black text-[9.5pt] uppercase px-3 py-1.5 tracking-wider border-b border-black">
          1. IDENTIFICAÇÃO DO PACIENTE
        </div>
        
        <table className="w-full border-collapse text-[9.5pt]">
          <tbody>
            {/* Linha 1: Nome | Atendimento Nº */}
            <tr className="border-b border-black">
              <td className={`w-[62%] border-r border-black ${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">NOME:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.nomePaciente}
                      onChange={e => onChange?.('nomePaciente', e.target.value)}
                      placeholder="Nome completo do paciente"
                      className="flex-1 font-bold outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="font-bold underline decoration-dotted decoration-1 flex-1 min-h-[22px] inline-block">
                      {data.nomePaciente || '_________________________________________________'}
                    </span>
                  )}
                </div>
              </td>
              <td className={`w-[38%] ${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">ATENDIMENTO Nº:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.numeroAtendimento}
                      onChange={e => onChange?.('numeroAtendimento', e.target.value)}
                      placeholder="Nº Atendimento"
                      className="flex-1 font-mono font-bold outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="font-mono font-bold underline decoration-dotted decoration-1 flex-1 min-h-[22px] inline-block">
                      {data.numeroAtendimento || '____________________'}
                    </span>
                  )}
                </div>
              </td>
            </tr>

            {/* Linha 2: Nome da Mãe | Data de Internação */}
            <tr className="border-b border-black">
              <td className={`border-r border-black ${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">NOME DA MÃE:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.nomeMae}
                      onChange={e => onChange?.('nomeMae', e.target.value)}
                      placeholder="Filiação materna completa"
                      className="flex-1 outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="underline decoration-dotted decoration-1 flex-1 min-h-[22px] inline-block">
                      {data.nomeMae || '____________________________________________'}
                    </span>
                  )}
                </div>
              </td>
              <td className={`${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">DATA DE INTERNAÇÃO:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.dataInternacao}
                      onChange={e => onChange?.('dataInternacao', e.target.value)}
                      placeholder="DD/MM/AAAA"
                      className="flex-1 font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="font-mono underline decoration-dotted decoration-1 flex-1 min-h-[22px] inline-block">
                      {data.dataInternacao || '____/____/______'}
                    </span>
                  )}
                </div>
              </td>
            </tr>

            {/* Linha 3: Data de Nascimento | Naturalidade / Estado */}
            <tr className="border-b border-black">
              <td className={`border-r border-black ${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">DATA DE NASCIMENTO:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.dataNascimento}
                      onChange={e => onChange?.('dataNascimento', e.target.value)}
                      placeholder="DD/MM/AAAA"
                      className="w-36 font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="font-mono underline decoration-dotted decoration-1 w-36 min-h-[22px] inline-block">
                      {data.dataNascimento || '____/____/______'}
                    </span>
                  )}
                </div>
              </td>
              <td className={`${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">NATURALIDADE / ESTADO:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.naturalidadeEstado}
                      onChange={e => onChange?.('naturalidadeEstado', e.target.value)}
                      placeholder="Cidade / UF"
                      className="flex-1 outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="underline decoration-dotted decoration-1 flex-1 min-h-[22px] inline-block">
                      {data.naturalidadeEstado || '______________________________'}
                    </span>
                  )}
                </div>
              </td>
            </tr>

            {/* Linha 4: CPF | Sexo */}
            <tr className="border-b border-black">
              <td className={`border-r border-black ${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">CPF:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.cpfPaciente}
                      onChange={e => onChange?.('cpfPaciente', e.target.value)}
                      placeholder="000.000.000-00"
                      className="flex-1 max-w-[220px] font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="font-mono underline decoration-dotted decoration-1 flex-1 max-w-[220px] min-h-[22px] inline-block">
                      {data.cpfPaciente || '__________________________________'}
                    </span>
                  )}
                </div>
              </td>
              <td className={`${cellPadding} align-middle`}>
                <div className="flex items-center gap-5">
                  <span className="font-bold uppercase whitespace-nowrap text-black">SEXO:</span>
                  <label 
                    onClick={() => isEditable && onChange?.('sexo', data.sexo === 'feminino' ? '' : 'feminino')}
                    className={`inline-flex items-center gap-1.5 ${isEditable ? 'cursor-pointer hover:text-teal-900' : ''}`}
                  >
                    <span className="font-mono font-bold">( {data.sexo === 'feminino' ? <strong className="font-black text-black">X</strong> : ' '} )</span>
                    <span>Feminino</span>
                  </label>
                  <label 
                    onClick={() => isEditable && onChange?.('sexo', data.sexo === 'masculino' ? '' : 'masculino')}
                    className={`inline-flex items-center gap-1.5 ${isEditable ? 'cursor-pointer hover:text-teal-900' : ''}`}
                  >
                    <span className="font-mono font-bold">( {data.sexo === 'masculino' ? <strong className="font-black text-black">X</strong> : ' '} )</span>
                    <span>Masculino</span>
                  </label>
                </div>
              </td>
            </tr>

            {/* Linha 5: Estado Civil (Linha Inteira com espaçamento) */}
            <tr className="border-b border-black">
              <td colSpan={2} className={`${cellPadding} align-middle`}>
                <div className="flex items-center gap-5 sm:gap-7 flex-wrap">
                  <span className="font-bold uppercase whitespace-nowrap text-black">ESTADO CIVIL:</span>
                  <label 
                    onClick={() => isEditable && onChange?.('estadoCivil', data.estadoCivil === 'solteiro' ? '' : 'solteiro')}
                    className={`inline-flex items-center gap-1.5 ${isEditable ? 'cursor-pointer hover:text-teal-900' : ''}`}
                  >
                    <span className="font-mono font-bold">( {data.estadoCivil === 'solteiro' ? <strong className="font-black text-black">X</strong> : ' '} )</span>
                    <span>Solteiro</span>
                  </label>
                  <label 
                    onClick={() => isEditable && onChange?.('estadoCivil', data.estadoCivil === 'casado' ? '' : 'casado')}
                    className={`inline-flex items-center gap-1.5 ${isEditable ? 'cursor-pointer hover:text-teal-900' : ''}`}
                  >
                    <span className="font-mono font-bold">( {data.estadoCivil === 'casado' ? <strong className="font-black text-black">X</strong> : ' '} )</span>
                    <span>Casado</span>
                  </label>
                  <label 
                    onClick={() => isEditable && onChange?.('estadoCivil', data.estadoCivil === 'divorciado' ? '' : 'divorciado')}
                    className={`inline-flex items-center gap-1.5 ${isEditable ? 'cursor-pointer hover:text-teal-900' : ''}`}
                  >
                    <span className="font-mono font-bold">( {data.estadoCivil === 'divorciado' ? <strong className="font-black text-black">X</strong> : ' '} )</span>
                    <span>Divorciado</span>
                  </label>
                  <label 
                    onClick={() => isEditable && onChange?.('estadoCivil', data.estadoCivil === 'outros' ? '' : 'outros')}
                    className={`inline-flex items-center gap-1.5 ${isEditable ? 'cursor-pointer hover:text-teal-900' : ''}`}
                  >
                    <span className="font-mono font-bold">( {data.estadoCivil === 'outros' ? <strong className="font-black text-black">X</strong> : ' '} )</span>
                    <span>Outros</span>
                  </label>
                </div>
              </td>
            </tr>

            {/* Linha 6: Convênio | Nº Carteira Convênio */}
            <tr className="border-b border-black">
              <td className={`border-r border-black ${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">CONVÊNIO:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.convenio}
                      onChange={e => onChange?.('convenio', e.target.value)}
                      placeholder="Nome do convênio ou Particular"
                      className="flex-1 outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="underline decoration-dotted decoration-1 flex-1 min-h-[22px] inline-block">
                      {data.convenio || '__________________________________________'}
                    </span>
                  )}
                </div>
              </td>
              <td className={`${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">Nº CARTEIRA CONVÊNIO:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.numeroCarteira}
                      onChange={e => onChange?.('numeroCarteira', e.target.value)}
                      placeholder="Número da carteira"
                      className="flex-1 font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="font-mono underline decoration-dotted decoration-1 flex-1 min-h-[22px] inline-block">
                      {data.numeroCarteira || '__________________________'}
                    </span>
                  )}
                </div>
              </td>
            </tr>

            {/* Linha 7: Endereço (Linha Inteira) */}
            <tr className="border-b border-black">
              <td colSpan={2} className={`${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">ENDEREÇO:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.endereco}
                      onChange={e => onChange?.('endereco', e.target.value)}
                      placeholder="Logradouro, número, complemento, bairro"
                      className="flex-1 outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="underline decoration-dotted decoration-1 flex-1 min-h-[22px] inline-block">
                      {data.endereco || '__________________________________________________________________________________'}
                    </span>
                  )}
                </div>
              </td>
            </tr>

            {/* Linha 8: Cidade | Estado */}
            <tr>
              <td className={`border-r border-black ${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">CIDADE:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.cidade}
                      onChange={e => onChange?.('cidade', e.target.value)}
                      placeholder="Cidade de residência"
                      className="flex-1 outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="underline decoration-dotted decoration-1 flex-1 min-h-[22px] inline-block">
                      {data.cidade || '__________________________________________'}
                    </span>
                  )}
                </div>
              </td>
              <td className={`${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">ESTADO:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.estado}
                      onChange={e => onChange?.('estado', e.target.value)}
                      placeholder="UF"
                      className="flex-1 uppercase outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="uppercase underline decoration-dotted decoration-1 flex-1 min-h-[22px] inline-block">
                      {data.estado || '__________________'}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* =========================================================================
          SEÇÃO 2. IDENTIFICAÇÃO DA LIBERAÇÃO (ESTRUTURA EM TABELA COM ESPAÇAMENTO)
          ========================================================================= */}
      <div className={`border border-black ${sectionMargin} text-black`}>
        <div className="bg-[#0b2546] text-white font-black text-[9.5pt] uppercase px-3 py-1.5 tracking-wider border-b border-black">
          2. IDENTIFICAÇÃO DA LIBERAÇÃO
        </div>
        
        <table className="w-full border-collapse text-[9.5pt]">
          <tbody>
            {/* Linha 1: Número da D.O. | Destino */}
            <tr className="border-b border-black">
              <td className={`w-[62%] border-r border-black ${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">NÚMERO DA D.O.:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.numeroDO}
                      onChange={e => onChange?.('numeroDO', e.target.value)}
                      placeholder="Declaração de Óbito Nº"
                      className="flex-1 max-w-[240px] font-mono font-bold outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="font-mono font-bold underline decoration-dotted decoration-1 flex-1 max-w-[240px] min-h-[22px] inline-block">
                      {data.numeroDO || '__________________________________'}
                    </span>
                  )}
                </div>
              </td>
              <td className={`w-[38%] ${cellPadding} align-middle`}>
                <div className="flex items-center gap-5">
                  <span className="font-bold uppercase whitespace-nowrap text-black">DESTINO:</span>
                  <label 
                    onClick={() => isEditable && onChange?.('tipoDestino', data.tipoDestino === 'IML' ? '' : 'IML')}
                    className={`inline-flex items-center gap-1.5 ${isEditable ? 'cursor-pointer hover:text-teal-900' : ''}`}
                  >
                    <span className="font-mono font-bold">( {data.tipoDestino === 'IML' ? <strong className="font-black text-black">X</strong> : ' '} )</span>
                    <span>IML</span>
                  </label>
                  <label 
                    onClick={() => isEditable && onChange?.('tipoDestino', data.tipoDestino === 'SVO' ? '' : 'SVO')}
                    className={`inline-flex items-center gap-1.5 ${isEditable ? 'cursor-pointer hover:text-teal-900' : ''}`}
                  >
                    <span className="font-mono font-bold">( {data.tipoDestino === 'SVO' ? <strong className="font-black text-black">X</strong> : ' '} )</span>
                    <span>SVO</span>
                  </label>
                </div>
              </td>
            </tr>

            {/* Linha 2: Causa da Morte (Linha Inteira) */}
            <tr className="border-b border-black">
              <td colSpan={2} className={`${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">CAUSA DA MORTE:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.causaMorte}
                      onChange={e => onChange?.('causaMorte', e.target.value)}
                      placeholder="Causa mortis conforme atestado/D.O."
                      className="flex-1 outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="underline decoration-dotted decoration-1 flex-1 min-h-[22px] inline-block">
                      {data.causaMorte || '__________________________________________________________________________________'}
                    </span>
                  )}
                </div>
              </td>
            </tr>

            {/* Linha 3: Data do Óbito | Hora do Óbito */}
            <tr className="border-b border-black">
              <td className={`border-r border-black ${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">DATA DO ÓBITO:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.dataObito}
                      onChange={e => onChange?.('dataObito', e.target.value)}
                      placeholder="DD/MM/AAAA"
                      className="w-36 font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="font-mono underline decoration-dotted decoration-1 w-36 min-h-[22px] inline-block">
                      {data.dataObito || '____/____/______'}
                    </span>
                  )}
                </div>
              </td>
              <td className={`${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">HORA DO ÓBITO:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.horaObito}
                      onChange={e => onChange?.('horaObito', e.target.value)}
                      placeholder="HH:MM"
                      className="w-24 font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="font-mono underline decoration-dotted decoration-1 w-24 min-h-[22px] inline-block">
                      {data.horaObito || '______:______'}
                    </span>
                  )}
                </div>
              </td>
            </tr>

            {/* Linha 4: Médico Responsável (Linha Inteira) */}
            <tr>
              <td colSpan={2} className={`${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">MÉDICO RESPONSÁVEL:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.medicoResp}
                      onChange={e => onChange?.('medicoResp', e.target.value)}
                      placeholder="Nome do médico e CRM"
                      className="flex-1 font-bold outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="font-bold underline decoration-dotted decoration-1 flex-1 min-h-[22px] inline-block">
                      {data.medicoResp || '_________________________________________________________________'}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* =========================================================================
          SEÇÃO 3. IDENTIFICAÇÃO DO FAMILIAR / RESPONSÁVEL PELA RETIRADA
          ========================================================================= */}
      <div className={`border border-black ${sectionMargin} text-black`}>
        <div className="bg-[#0b2546] text-white font-black text-[9.5pt] uppercase px-3 py-1.5 tracking-wider border-b border-black">
          3. IDENTIFICAÇÃO DO FAMILIAR / RESPONSÁVEL PELA RETIRADA
        </div>
        
        <table className="w-full border-collapse text-[9.5pt]">
          <tbody>
            {/* Linha 1: Nome (Linha Inteira) */}
            <tr className="border-b border-black">
              <td colSpan={2} className={`${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">NOME:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.nomeFamiliar}
                      onChange={e => onChange?.('nomeFamiliar', e.target.value)}
                      placeholder="Nome completo do familiar ou responsável legal"
                      className="flex-1 font-bold outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="font-bold underline decoration-dotted decoration-1 flex-1 min-h-[22px] inline-block">
                      {data.nomeFamiliar || '__________________________________________________________________________________'}
                    </span>
                  )}
                </div>
              </td>
            </tr>

            {/* Linha 2: CPF | Telefone */}
            <tr>
              <td className={`w-[50%] border-r border-black ${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">CPF:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.cpfFamiliar}
                      onChange={e => onChange?.('cpfFamiliar', e.target.value)}
                      placeholder="000.000.000-00"
                      className="flex-1 max-w-[220px] font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="font-mono underline decoration-dotted decoration-1 flex-1 max-w-[220px] min-h-[22px] inline-block">
                      {data.cpfFamiliar || '__________________________________'}
                    </span>
                  )}
                </div>
              </td>
              <td className={`w-[50%] ${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">TELEFONE:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.telefoneFamiliar}
                      onChange={e => onChange?.('telefoneFamiliar', e.target.value)}
                      placeholder="(63) 99999-9999"
                      className="flex-1 font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="font-mono underline decoration-dotted decoration-1 flex-1 min-h-[22px] inline-block">
                      {data.telefoneFamiliar || '______________________________'}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* =========================================================================
          SEÇÃO 4. IDENTIFICAÇÃO DA FUNERÁRIA
          ========================================================================= */}
      <div className={`border border-black ${sectionMargin} text-black`}>
        <div className="bg-[#0b2546] text-white font-black text-[9.5pt] uppercase px-3 py-1.5 tracking-wider border-b border-black">
          4. IDENTIFICAÇÃO DA FUNERÁRIA
        </div>
        
        <table className="w-full border-collapse text-[9.5pt]">
          <tbody>
            {/* Linha 1: Funerária (Linha Inteira) */}
            <tr className="border-b border-black">
              <td colSpan={2} className={`${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">FUNERÁRIA:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.nomeFuneraria}
                      onChange={e => onChange?.('nomeFuneraria', e.target.value)}
                      placeholder="Nome da empresa funerária"
                      className="flex-1 font-bold outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="font-bold underline decoration-dotted decoration-1 flex-1 min-h-[22px] inline-block">
                      {data.nomeFuneraria || '______________________________________________________________________________'}
                    </span>
                  )}
                </div>
              </td>
            </tr>

            {/* Linha 2: Placa do Veículo | Nome do Motorista */}
            <tr className="border-b border-black">
              <td className={`w-[50%] border-r border-black ${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">PLACA DO VEÍCULO:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.placaVeiculo}
                      onChange={e => onChange?.('placaVeiculo', e.target.value)}
                      placeholder="ABC-1234"
                      className="w-36 font-mono uppercase outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="font-mono uppercase underline decoration-dotted decoration-1 w-36 min-h-[22px] inline-block">
                      {data.placaVeiculo || '______________________________'}
                    </span>
                  )}
                </div>
              </td>
              <td className={`w-[50%] ${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">NOME DO MOTORISTA:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.nomeMotorista}
                      onChange={e => onChange?.('nomeMotorista', e.target.value)}
                      placeholder="Nome do motorista / agente funerário"
                      className="flex-1 outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="underline decoration-dotted decoration-1 flex-1 min-h-[22px] inline-block">
                      {data.nomeMotorista || '______________________________'}
                    </span>
                  )}
                </div>
              </td>
            </tr>

            {/* Linha 3: Telefone 1 | Telefone 2 */}
            <tr>
              <td className={`border-r border-black ${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">TELEFONE 1:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.telefone1Funeraria}
                      onChange={e => onChange?.('telefone1Funeraria', e.target.value)}
                      placeholder="(63) 0000-0000"
                      className="w-40 font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="font-mono underline decoration-dotted decoration-1 w-40 min-h-[22px] inline-block">
                      {data.telefone1Funeraria || '__________________________'}
                    </span>
                  )}
                </div>
              </td>
              <td className={`${cellPadding} align-middle`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold uppercase whitespace-nowrap text-black">TELEFONE 2:</span>
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.telefone2Funeraria}
                      onChange={e => onChange?.('telefone2Funeraria', e.target.value)}
                      placeholder="(63) 0000-0000"
                      className="w-40 font-mono outline-none bg-amber-50/70 print:bg-transparent border-b border-dotted border-black text-[9.5pt] py-0.5"
                    />
                  ) : (
                    <span className="font-mono underline decoration-dotted decoration-1 w-40 min-h-[22px] inline-block">
                      {data.telefone2Funeraria || '__________________________'}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* =========================================================================
          CAMPOS DE ASSINATURA DUPLA (COM ESPAÇO GENEROSO PARA ASSINATURA FÍSICA)
          ========================================================================= */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 text-center text-[9pt] ${signatureMargin}`}>
        <div className="flex flex-col justify-end">
          <div className={signatureBlankHeight}></div>
          <div className="border-t border-black max-w-[320px] w-full mx-auto mb-1.5"></div>
          <p className="font-bold m-0 text-black leading-tight">
            Assinatura do familiar / responsável
          </p>
        </div>
        <div className="flex flex-col justify-end">
          <div className={signatureBlankHeight}></div>
          <div className="border-t border-black max-w-[340px] w-full mx-auto mb-1.5"></div>
          <p className="font-bold m-0 text-black leading-tight">
            Nome e assinatura do recepcionista responsável pela liberação
          </p>
          {data.recepcionista && (
            <p className="text-[8.5pt] font-mono font-bold text-slate-800 m-0 mt-1">
              {data.recepcionista}
            </p>
          )}
        </div>
      </div>

      {/* =========================================================================
          QUADRO DE CONTROLE INTERNO (RODAPÉ OFICIAL DA NOVA VERSÃO)
          ========================================================================= */}
      <div className="border border-black py-2 px-3 text-center text-[8.5pt] font-medium text-black mb-4 bg-white">
        Documento de controle interno • Preencher todos os campos aplicáveis com letra legível. • Não rasurar.
      </div>

      {/* =========================================================================
          RODAPÉ DE PÁGINA (PAGINAÇÃO INSTITUCIONAL)
          ========================================================================= */}
      <div className="flex justify-between items-center text-[8pt] text-slate-500 pt-1.5 border-t border-slate-200 print:border-slate-300">
        <span>Medical Kora Saúde • Termo de Retirada de Corpo</span>
        <span>Página 1</span>
      </div>
    </div>
  );
};
