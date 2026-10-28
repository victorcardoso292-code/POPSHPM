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

interface TermoRetiradaCorpoPrintProps {
  data: TermoRetiradaCorpoData;
  onChange?: (field: keyof TermoRetiradaCorpoData, val: any) => void;
  isEditable?: boolean;
}

export const TermoRetiradaCorpoPrint: React.FC<TermoRetiradaCorpoPrintProps> = ({
  data,
  onChange,
  isEditable = false
}) => {
  return (
    <div 
      className="text-black bg-white p-4 sm:p-6 max-w-[850px] mx-auto text-[10pt] leading-tight border border-slate-300 print:border-none print:p-0 print:max-w-full page-break-avoid selection:bg-teal-100"
      style={{ fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}
    >
      {/* =========================================================================
          CABEÇALHO OFICIAL • MEDICAL KORA SAÚDE | FORMULÁRIO | CONTROLE
          ========================================================================= */}
      <table className="w-full border-collapse border border-black mb-2 text-black">
        <tbody>
          <tr>
            {/* Coluna 1: Logo Medical Kora Saúde */}
            <td className="w-48 p-2.5 border-r border-black align-middle text-left bg-white">
              <div className="flex items-center gap-2.5">
                {/* Cruz Estilizada Medical */}
                <div className="w-9 h-9 rounded-lg bg-[#EBF7F8] border border-[#C4E5E8] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#0E7B86]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C12 3.12 13.12 2 14.5 2H17.5C18.88 2 20 3.12 20 4.5V10C20 11.1 20.9 12 22 12H27.5C28.88 12 30 13.12 30 14.5V17.5C30 18.88 28.88 20 27.5 20H22C20.9 20 20 20.9 20 22V27.5C20 28.88 18.88 30 17.5 30H14.5C13.12 30 12 28.88 12 27.5V22C12 20.9 11.1 20 10 20H4.5C3.12 20 2 18.88 2 17.5V14.5C2 13.12 3.12 12 4.5 12H10C11.1 12 12 11.1 12 10V4.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="#D8ECEE" />
                  </svg>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xl font-black tracking-tight text-[#B01B52]">
                    Medical
                  </span>
                  <span className="text-[10px] font-bold text-slate-800 tracking-wider">
                    Kora<span className="font-semibold text-slate-500">Saúde</span>
                  </span>
                </div>
              </div>
            </td>

            {/* Coluna 2: Título do Formulário */}
            <td className="p-2 border-r border-black text-center align-middle">
              <div className="text-base sm:text-lg font-black uppercase tracking-wider text-black">
                FORMULÁRIO
              </div>
              <div className="text-xs sm:text-sm font-bold uppercase tracking-tight text-slate-900 mt-0.5">
                TERMO DE RETIRADA DE CORPO
              </div>
            </td>

            {/* Coluna 3: Controle do Documento */}
            <td className="w-56 p-1.5 text-[8.5pt] align-middle text-black leading-tight">
              <div className="font-bold uppercase tracking-wider mb-1 text-[8pt] text-slate-900">
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
                      className="w-14 text-right font-mono bg-amber-50/60 print:bg-transparent outline-none border-b border-dotted border-black/40 text-[8.5pt]"
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
                      className="w-24 text-right font-mono bg-amber-50/60 print:bg-transparent outline-none border-b border-dotted border-black/40 text-[8.5pt]"
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
                      className="w-24 text-right font-mono bg-amber-50/60 print:bg-transparent outline-none border-b border-dotted border-black/40 text-[8.5pt]"
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
          SEÇÃO 1. IDENTIFICAÇÃO DO PACIENTE (FAIXA AZUL ESCURO)
          ========================================================================= */}
      <div className="border border-black mb-2 text-black">
        <div className="bg-[#0b2546] text-white font-black text-[9.5pt] uppercase px-2.5 py-1 tracking-wider border-b border-black">
          1. IDENTIFICAÇÃO DO PACIENTE
        </div>
        <div className="p-2 space-y-1.5 text-[9.5pt]">
          {/* Linha 1: Nome | Atendimento Nº */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex-1 flex items-baseline gap-1.5 min-w-0">
              <span className="font-bold uppercase whitespace-nowrap">NOME:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.nomePaciente}
                  onChange={e => onChange?.('nomePaciente', e.target.value)}
                  placeholder="Nome completo do paciente"
                  className="flex-1 font-bold outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="font-bold underline decoration-dotted decoration-1 flex-1 truncate">
                  {data.nomePaciente || '_________________________________________________'}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5 sm:w-56 flex-shrink-0">
              <span className="font-bold uppercase whitespace-nowrap">ATENDIMENTO Nº:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.numeroAtendimento}
                  onChange={e => onChange?.('numeroAtendimento', e.target.value)}
                  placeholder="Nº Atendimento"
                  className="flex-1 font-mono font-bold outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="font-mono font-bold underline decoration-dotted decoration-1 flex-1">
                  {data.numeroAtendimento || '____________________'}
                </span>
              )}
            </div>
          </div>

          {/* Linha 2: Nome da Mãe | Data de Internação */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex-1 flex items-baseline gap-1.5 min-w-0">
              <span className="font-bold uppercase whitespace-nowrap">NOME DA MÃE:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.nomeMae}
                  onChange={e => onChange?.('nomeMae', e.target.value)}
                  placeholder="Filiação materna completa"
                  className="flex-1 outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="underline decoration-dotted decoration-1 flex-1 truncate">
                  {data.nomeMae || '____________________________________________'}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5 sm:w-56 flex-shrink-0">
              <span className="font-bold uppercase whitespace-nowrap">DATA DE INTERNAÇÃO:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.dataInternacao}
                  onChange={e => onChange?.('dataInternacao', e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="flex-1 font-mono outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="font-mono underline decoration-dotted decoration-1 flex-1">
                  {data.dataInternacao || '____/____/______'}
                </span>
              )}
            </div>
          </div>

          {/* Linha 3: Data de Nascimento | Naturalidade / Estado */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5 sm:w-72">
              <span className="font-bold uppercase whitespace-nowrap">DATA DE NASCIMENTO:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.dataNascimento}
                  onChange={e => onChange?.('dataNascimento', e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="flex-1 font-mono outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="font-mono underline decoration-dotted decoration-1 flex-1">
                  {data.dataNascimento || '____/____/______'}
                </span>
              )}
            </div>
            <div className="flex-1 flex items-baseline gap-1.5 min-w-0">
              <span className="font-bold uppercase whitespace-nowrap">NATURALIDADE / ESTADO:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.naturalidadeEstado}
                  onChange={e => onChange?.('naturalidadeEstado', e.target.value)}
                  placeholder="Cidade / UF"
                  className="flex-1 outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="underline decoration-dotted decoration-1 flex-1 truncate">
                  {data.naturalidadeEstado || '______________________________'}
                </span>
              )}
            </div>
          </div>

          {/* Linha 4: CPF | Sexo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex-1 flex items-baseline gap-1.5 min-w-0">
              <span className="font-bold uppercase whitespace-nowrap">CPF:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.cpfPaciente}
                  onChange={e => onChange?.('cpfPaciente', e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-48 font-mono outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="font-mono underline decoration-dotted decoration-1 w-48">
                  {data.cpfPaciente || '__________________________________'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 sm:w-64 flex-shrink-0">
              <span className="font-bold uppercase">SEXO:</span>
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <span>( {data.sexo === 'feminino' ? <strong className="font-black">X</strong> : ' '} )</span>
                <span>Feminino</span>
              </label>
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <span>( {data.sexo === 'masculino' ? <strong className="font-black">X</strong> : ' '} )</span>
                <span>Masculino</span>
              </label>
            </div>
          </div>

          {/* Linha 5: Estado Civil */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-bold uppercase">ESTADO CIVIL:</span>
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <span>( {data.estadoCivil === 'solteiro' ? <strong className="font-black">X</strong> : ' '} )</span>
              <span>Solteiro</span>
            </label>
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <span>( {data.estadoCivil === 'casado' ? <strong className="font-black">X</strong> : ' '} )</span>
              <span>Casado</span>
            </label>
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <span>( {data.estadoCivil === 'divorciado' ? <strong className="font-black">X</strong> : ' '} )</span>
              <span>Divorciado</span>
            </label>
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <span>( {data.estadoCivil === 'outros' ? <strong className="font-black">X</strong> : ' '} )</span>
              <span>Outros</span>
            </label>
          </div>

          {/* Linha 6: Convênio | Nº Carteira Convênio */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex-1 flex items-baseline gap-1.5 min-w-0">
              <span className="font-bold uppercase whitespace-nowrap">CONVÊNIO:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.convenio}
                  onChange={e => onChange?.('convenio', e.target.value)}
                  placeholder="Nome do convênio ou Particular"
                  className="flex-1 outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="underline decoration-dotted decoration-1 flex-1 truncate">
                  {data.convenio || '__________________________________________'}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5 sm:w-72 flex-shrink-0">
              <span className="font-bold uppercase whitespace-nowrap">Nº CARTEIRA CONVÊNIO:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.numeroCarteira}
                  onChange={e => onChange?.('numeroCarteira', e.target.value)}
                  placeholder="Número da carteira"
                  className="flex-1 font-mono outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="font-mono underline decoration-dotted decoration-1 flex-1">
                  {data.numeroCarteira || '__________________________'}
                </span>
              )}
            </div>
          </div>

          {/* Linha 7: Endereço */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold uppercase whitespace-nowrap">ENDEREÇO:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.endereco}
                onChange={e => onChange?.('endereco', e.target.value)}
                placeholder="Logradouro, número, complemento, bairro"
                className="flex-1 outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
              />
            ) : (
              <span className="underline decoration-dotted decoration-1 flex-1 truncate">
                {data.endereco || '__________________________________________________________________________________'}
              </span>
            )}
          </div>

          {/* Linha 8: Cidade | Estado */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex-1 flex items-baseline gap-1.5 min-w-0">
              <span className="font-bold uppercase whitespace-nowrap">CIDADE:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.cidade}
                  onChange={e => onChange?.('cidade', e.target.value)}
                  placeholder="Cidade de residência"
                  className="flex-1 outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="underline decoration-dotted decoration-1 flex-1 truncate">
                  {data.cidade || '__________________________________________'}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5 sm:w-48 flex-shrink-0">
              <span className="font-bold uppercase whitespace-nowrap">ESTADO:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.estado}
                  onChange={e => onChange?.('estado', e.target.value)}
                  placeholder="UF"
                  className="flex-1 uppercase outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="uppercase underline decoration-dotted decoration-1 flex-1">
                  {data.estado || '__________________'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SEÇÃO 2. IDENTIFICAÇÃO DA LIBERAÇÃO (FAIXA AZUL ESCURO)
          ========================================================================= */}
      <div className="border border-black mb-2 text-black">
        <div className="bg-[#0b2546] text-white font-black text-[9.5pt] uppercase px-2.5 py-1 tracking-wider border-b border-black">
          2. IDENTIFICAÇÃO DA LIBERAÇÃO
        </div>
        <div className="p-2 space-y-1.5 text-[9.5pt]">
          {/* Linha 1: Número da D.O. | Destino */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex-1 flex items-baseline gap-1.5 min-w-0">
              <span className="font-bold uppercase whitespace-nowrap">NÚMERO DA D.O.:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.numeroDO}
                  onChange={e => onChange?.('numeroDO', e.target.value)}
                  placeholder="Declaração de Óbito Nº"
                  className="w-56 font-mono font-bold outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="font-mono font-bold underline decoration-dotted decoration-1 w-56">
                  {data.numeroDO || '__________________________________'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 sm:w-56 flex-shrink-0">
              <span className="font-bold uppercase">DESTINO:</span>
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <span>( {data.tipoDestino === 'IML' ? <strong className="font-black">X</strong> : ' '} )</span>
                <span>IML</span>
              </label>
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <span>( {data.tipoDestino === 'SVO' ? <strong className="font-black">X</strong> : ' '} )</span>
                <span>SVO</span>
              </label>
            </div>
          </div>

          {/* Linha 2: Causa da Morte */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold uppercase whitespace-nowrap">CAUSA DA MORTE:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.causaMorte}
                onChange={e => onChange?.('causaMorte', e.target.value)}
                placeholder="Causa mortis conforme atestado/D.O."
                className="flex-1 outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
              />
            ) : (
              <span className="underline decoration-dotted decoration-1 flex-1 truncate">
                {data.causaMorte || '__________________________________________________________________________________'}
              </span>
            )}
          </div>

          {/* Linha 3: Data do Óbito | Hora do Óbito */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex-1 flex items-baseline gap-1.5 min-w-0">
              <span className="font-bold uppercase whitespace-nowrap">DATA DO ÓBITO:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.dataObito}
                  onChange={e => onChange?.('dataObito', e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="w-36 font-mono outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="font-mono underline decoration-dotted decoration-1 w-36">
                  {data.dataObito || '____/____/______'}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5 sm:w-56 flex-shrink-0">
              <span className="font-bold uppercase whitespace-nowrap">HORA DO ÓBITO:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.horaObito}
                  onChange={e => onChange?.('horaObito', e.target.value)}
                  placeholder="HH:MM"
                  className="w-24 font-mono outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="font-mono underline decoration-dotted decoration-1 w-24">
                  {data.horaObito || '______:______'}
                </span>
              )}
            </div>
          </div>

          {/* Linha 4: Médico Responsável */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold uppercase whitespace-nowrap">MÉDICO RESPONSÁVEL:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.medicoResp}
                onChange={e => onChange?.('medicoResp', e.target.value)}
                placeholder="Nome do médico e CRM"
                className="flex-1 font-bold outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
              />
            ) : (
              <span className="font-bold underline decoration-dotted decoration-1 flex-1 truncate">
                {data.medicoResp || '_________________________________________________________________'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SEÇÃO 3. IDENTIFICAÇÃO DO FAMILIAR / RESPONSÁVEL PELA RETIRADA
          ========================================================================= */}
      <div className="border border-black mb-2 text-black">
        <div className="bg-[#0b2546] text-white font-black text-[9.5pt] uppercase px-2.5 py-1 tracking-wider border-b border-black">
          3. IDENTIFICAÇÃO DO FAMILIAR / RESPONSÁVEL PELA RETIRADA
        </div>
        <div className="p-2 space-y-1.5 text-[9.5pt]">
          {/* Linha 1: Nome */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold uppercase whitespace-nowrap">NOME:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.nomeFamiliar}
                onChange={e => onChange?.('nomeFamiliar', e.target.value)}
                placeholder="Nome completo do familiar ou responsável legal"
                className="flex-1 font-bold outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
              />
            ) : (
              <span className="font-bold underline decoration-dotted decoration-1 flex-1 truncate">
                {data.nomeFamiliar || '__________________________________________________________________________________'}
              </span>
            )}
          </div>

          {/* Linha 2: CPF | Telefone */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex-1 flex items-baseline gap-1.5 min-w-0">
              <span className="font-bold uppercase whitespace-nowrap">CPF:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.cpfFamiliar}
                  onChange={e => onChange?.('cpfFamiliar', e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-48 font-mono outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="font-mono underline decoration-dotted decoration-1 w-48">
                  {data.cpfFamiliar || '__________________________________'}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5 sm:w-64 flex-shrink-0">
              <span className="font-bold uppercase whitespace-nowrap">TELEFONE:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.telefoneFamiliar}
                  onChange={e => onChange?.('telefoneFamiliar', e.target.value)}
                  placeholder="(63) 99999-9999"
                  className="flex-1 font-mono outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="font-mono underline decoration-dotted decoration-1 flex-1">
                  {data.telefoneFamiliar || '______________________________'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SEÇÃO 4. IDENTIFICAÇÃO DA FUNERÁRIA (FAIXA AZUL ESCURO)
          ========================================================================= */}
      <div className="border border-black mb-3 text-black">
        <div className="bg-[#0b2546] text-white font-black text-[9.5pt] uppercase px-2.5 py-1 tracking-wider border-b border-black">
          4. IDENTIFICAÇÃO DA FUNERÁRIA
        </div>
        <div className="p-2 space-y-1.5 text-[9.5pt]">
          {/* Linha 1: Funerária */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold uppercase whitespace-nowrap">FUNERÁRIA:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.nomeFuneraria}
                onChange={e => onChange?.('nomeFuneraria', e.target.value)}
                placeholder="Nome da empresa funerária"
                className="flex-1 font-bold outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
              />
            ) : (
              <span className="font-bold underline decoration-dotted decoration-1 flex-1 truncate">
                {data.nomeFuneraria || '______________________________________________________________________________'}
              </span>
            )}
          </div>

          {/* Linha 2: Placa do Veículo | Nome do Motorista */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex-1 flex items-baseline gap-1.5 min-w-0">
              <span className="font-bold uppercase whitespace-nowrap">PLACA DO VEÍCULO:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.placaVeiculo}
                  onChange={e => onChange?.('placaVeiculo', e.target.value)}
                  placeholder="ABC-1234"
                  className="w-40 font-mono uppercase outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="font-mono uppercase underline decoration-dotted decoration-1 w-40">
                  {data.placaVeiculo || '______________________________'}
                </span>
              )}
            </div>
            <div className="flex-1 flex items-baseline gap-1.5 min-w-0">
              <span className="font-bold uppercase whitespace-nowrap">NOME DO MOTORISTA:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.nomeMotorista}
                  onChange={e => onChange?.('nomeMotorista', e.target.value)}
                  placeholder="Nome do motorista / agente funerário"
                  className="flex-1 outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="underline decoration-dotted decoration-1 flex-1 truncate">
                  {data.nomeMotorista || '______________________________'}
                </span>
              )}
            </div>
          </div>

          {/* Linha 3: Telefone 1 | Telefone 2 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex-1 flex items-baseline gap-1.5 min-w-0">
              <span className="font-bold uppercase whitespace-nowrap">TELEFONE 1:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.telefone1Funeraria}
                  onChange={e => onChange?.('telefone1Funeraria', e.target.value)}
                  placeholder="(63) 0000-0000"
                  className="w-44 font-mono outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="font-mono underline decoration-dotted decoration-1 w-44">
                  {data.telefone1Funeraria || '__________________________'}
                </span>
              )}
            </div>
            <div className="flex-1 flex items-baseline gap-1.5 min-w-0">
              <span className="font-bold uppercase whitespace-nowrap">TELEFONE 2:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.telefone2Funeraria}
                  onChange={e => onChange?.('telefone2Funeraria', e.target.value)}
                  placeholder="(63) 0000-0000"
                  className="w-44 font-mono outline-none bg-amber-50/60 print:bg-transparent border-b border-dotted border-black text-[9.5pt]"
                />
              ) : (
                <span className="font-mono underline decoration-dotted decoration-1 w-44">
                  {data.telefone2Funeraria || '__________________________'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CAMPOS DE ASSINATURA DUPLA (EXATO AO NOVO FORMULÁRIO)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-5 pt-3 text-center text-[9pt]">
        <div>
          <div className="border-t border-black max-w-[300px] mx-auto mb-1"></div>
          <p className="font-bold m-0 text-black">
            Assinatura do familiar / responsável
          </p>
        </div>
        <div>
          <div className="border-t border-black max-w-[340px] mx-auto mb-1"></div>
          <p className="font-bold m-0 text-black">
            Nome e assinatura do recepcionista responsável pela liberação
          </p>
          {data.recepcionista && (
            <p className="text-[8.5pt] font-mono font-bold text-slate-800 m-0 mt-0.5">
              {data.recepcionista}
            </p>
          )}
        </div>
      </div>

      {/* =========================================================================
          QUADRO DE CONTROLE INTERNO (RODAPÉ OFICIAL DA NOVA VERSÃO)
          ========================================================================= */}
      <div className="border border-black p-1.5 text-center text-[8.5pt] font-medium text-black mb-3 bg-white">
        Documento de controle interno • Preencher todos os campos aplicáveis com letra legível. • Não rasurar.
      </div>

      {/* =========================================================================
          RODAPÉ DE PÁGINA (PAGINAÇÃO INSTITUCIONAL)
          ========================================================================= */}
      <div className="flex justify-between items-center text-[8pt] text-slate-500 pt-1 border-t border-slate-200 print:border-slate-300">
        <span>Medical Kora Saúde • Termo de Retirada de Corpo</span>
        <span>Página 1</span>
      </div>
    </div>
  );
};
