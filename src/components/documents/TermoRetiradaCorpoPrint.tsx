import React from 'react';

export interface TermoRetiradaCorpoData {
  // Cabeçalho
  codigo: string;
  versao: string;
  dataEdicao: string;
  dataRevisao: string;
  areaResponsavel: string;

  // Identificação do Paciente
  nomePaciente: string;
  nomeMae: string;
  dataNascimento: string;
  naturalidadeEstado: string;
  cpfPaciente: string;
  sexo: 'feminino' | 'masculino' | '';
  estadoCivil: 'solteiro' | 'casado' | 'divorciado' | 'outros' | '';
  convenio: string;
  numeroCarteira: string;
  numeroAtendimento: string;
  dataInternacao: string;
  endereco: string;
  cidade: string;
  estado: string;

  // Liberação
  numeroDO: string;
  tipoDestino: 'IML' | 'SVO' | '';
  causaMorte: string;
  dataObito: string;
  horaObito: string;
  medicoResp: string;

  // Familiar
  nomeFamiliar: string;
  cpfFamiliar: string;
  telefoneFamiliar: string;

  // Funerária
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
      className="text-black bg-white p-5 sm:p-8 max-w-[850px] mx-auto text-[11px] leading-tight border border-slate-300 print:border-none print:p-0 page-break-avoid"
      style={{ fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}
    >
      {/* Tabela de Cabeçalho Oficial ABNT */}
      <table className="w-full border-collapse border border-black mb-1.5 text-black">
        <tbody>
          <tr>
            {/* Logo Medical Kora */}
            <td className="w-48 p-2 border-r border-black align-middle text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="text-[#0E7B86] font-bold text-2xl leading-none">✚</div>
                <div className="text-left">
                  <div className="text-lg font-bold tracking-tight text-black leading-none">Medical</div>
                  <div className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">Kora</div>
                </div>
              </div>
            </td>

            {/* FORMULÁRIO */}
            <td className="p-3 border-r border-black text-center align-middle">
              <span className="text-base sm:text-lg font-bold uppercase tracking-wider text-black">
                FORMULÁRIO
              </span>
            </td>

            {/* Metadados da Qualidade */}
            <td className="w-56 p-1 text-[10px] align-top divide-y divide-black">
              <div className="flex justify-between px-1 py-0.5">
                <span className="font-bold">Código:</span>
                <span className="font-mono">{data.codigo || '—'}</span>
              </div>
              <div className="flex justify-between px-1 py-0.5">
                <span className="font-bold">Versão:</span>
                <span className="font-mono">{data.versao || '01'}</span>
              </div>
              <div className="flex justify-between px-1 py-0.5">
                <span className="font-bold">Data de edição:</span>
                <span>{data.dataEdicao || '09/08/2023'}</span>
              </div>
              <div className="flex justify-between px-1 py-0.5">
                <span className="font-bold">Data da revisão:</span>
                <span>{data.dataRevisao || '08/01/2026'}</span>
              </div>
              <div className="flex justify-between px-1 py-0.5">
                <span className="font-bold">Área responsável:</span>
                <span>{data.areaResponsavel || 'Diretoria'}</span>
              </div>
            </td>
          </tr>
          {/* Linha do Título */}
          <tr className="border-t border-black bg-slate-50">
            <td colSpan={3} className="p-1.5 font-bold uppercase text-center text-xs tracking-wide text-black">
              Título: TERMO DE RETIRADA DE CORPO
            </td>
          </tr>
        </tbody>
      </table>

      {/* SEÇÃO 1: IDENTIFICAÇÃO DO PACIENTE */}
      <table className="w-full border-collapse border border-black mb-1.5 text-black">
        <thead>
          <tr className="bg-slate-200 border-b border-black">
            <th colSpan={4} className="py-1 px-2 text-left font-bold uppercase tracking-wider text-[11px] text-black">
              IDENTIFICAÇÃO DO PACIENTE
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black text-[10.5px]">
          <tr>
            <td colSpan={4} className="p-1.5">
              <span className="font-bold">NOME: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.nomePaciente}
                  onChange={e => onChange?.('nomePaciente', e.target.value)}
                  placeholder="Nome completo do paciente"
                  className="font-medium outline-none w-3/4 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span className="font-bold">{data.nomePaciente}</span>
              )}
            </td>
          </tr>
          <tr>
            <td colSpan={4} className="p-1.5">
              <span className="font-bold">NOME DA MÃE: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.nomeMae}
                  onChange={e => onChange?.('nomeMae', e.target.value)}
                  placeholder="Filiação materna completa"
                  className="font-medium outline-none w-3/4 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.nomeMae}</span>
              )}
            </td>
          </tr>
          <tr className="divide-x divide-black">
            <td colSpan={2} className="p-1.5 w-1/2">
              <span className="font-bold">DATA DE NASCIMENTO: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.dataNascimento}
                  onChange={e => onChange?.('dataNascimento', e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="outline-none w-28 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.dataNascimento || '_____ / _____ / _________'}</span>
              )}
            </td>
            <td colSpan={2} className="p-1.5 w-1/2">
              <span className="font-bold">NATURALIDADE ESTADO: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.naturalidadeEstado}
                  onChange={e => onChange?.('naturalidadeEstado', e.target.value)}
                  placeholder="Cidade / UF"
                  className="outline-none w-48 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.naturalidadeEstado}</span>
              )}
            </td>
          </tr>
          <tr className="divide-x divide-black">
            <td colSpan={2} className="p-1.5 w-1/2">
              <span className="font-bold">CPF: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.cpfPaciente}
                  onChange={e => onChange?.('cpfPaciente', e.target.value)}
                  placeholder="000.000.000-00"
                  className="outline-none w-40 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.cpfPaciente}</span>
              )}
            </td>
            <td colSpan={2} className="p-1.5 w-1/2">
              <span className="font-bold">SEXO: </span>
              <span className="space-x-3">
                <span>( {data.sexo === 'feminino' ? 'X' : ' '} ) Feminino</span>
                <span>( {data.sexo === 'masculino' ? 'X' : ' '} ) Masculino</span>
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={4} className="p-1.5">
              <span className="font-bold">ESTADO CIVIL: </span>
              <span className="space-x-4">
                <span>( {data.estadoCivil === 'solteiro' ? 'X' : ' '} ) Solteiro</span>
                <span>( {data.estadoCivil === 'casado' ? 'X' : ' '} ) Casado</span>
                <span>( {data.estadoCivil === 'divorciado' ? 'X' : ' '} ) Divorciado</span>
                <span>( {data.estadoCivil === 'outros' ? 'X' : ' '} ) Outros</span>
              </span>
            </td>
          </tr>
          <tr className="divide-x divide-black">
            <td colSpan={2} className="p-1.5 w-1/2">
              <span className="font-bold">CONVÊNIO: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.convenio}
                  onChange={e => onChange?.('convenio', e.target.value)}
                  placeholder="Nome do convênio ou Particular"
                  className="outline-none w-48 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.convenio}</span>
              )}
            </td>
            <td colSpan={2} className="p-1.5 w-1/2">
              <span className="font-bold">Nº CARTEIRA CONVÊNIO: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.numeroCarteira}
                  onChange={e => onChange?.('numeroCarteira', e.target.value)}
                  placeholder="Número da carteirinha"
                  className="outline-none w-44 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.numeroCarteira}</span>
              )}
            </td>
          </tr>
          <tr className="divide-x divide-black">
            <td colSpan={2} className="p-1.5 w-1/2">
              <span className="font-bold">ATENDIMENTO Nº: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.numeroAtendimento}
                  onChange={e => onChange?.('numeroAtendimento', e.target.value)}
                  placeholder="Número TASY / ficha"
                  className="outline-none w-36 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.numeroAtendimento}</span>
              )}
            </td>
            <td colSpan={2} className="p-1.5 w-1/2">
              <span className="font-bold">DATA INTERNAÇÃO: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.dataInternacao}
                  onChange={e => onChange?.('dataInternacao', e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="outline-none w-28 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.dataInternacao || '_____ / _____ / _________'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td colSpan={4} className="p-1.5">
              <span className="font-bold">ENDEREÇO: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.endereco}
                  onChange={e => onChange?.('endereco', e.target.value)}
                  placeholder="Rua, número, setor"
                  className="outline-none w-4/5 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.endereco}</span>
              )}
            </td>
          </tr>
          <tr className="divide-x divide-black">
            <td colSpan={2} className="p-1.5 w-1/2">
              <span className="font-bold">CIDADE: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.cidade}
                  onChange={e => onChange?.('cidade', e.target.value)}
                  placeholder="Cidade"
                  className="outline-none w-44 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.cidade}</span>
              )}
            </td>
            <td colSpan={2} className="p-1.5 w-1/2">
              <span className="font-bold">ESTADO: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.estado}
                  onChange={e => onChange?.('estado', e.target.value)}
                  placeholder="UF"
                  className="outline-none w-20 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.estado}</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* SEÇÃO 2: IDENTIFICAÇÃO DA LIBERAÇÃO */}
      <table className="w-full border-collapse border border-black mb-1.5 text-black">
        <thead>
          <tr className="bg-slate-200 border-b border-black">
            <th colSpan={4} className="py-1 px-2 text-left font-bold uppercase tracking-wider text-[11px] text-black">
              IDENTIFICAÇÃO DA LIBERAÇÃO
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black text-[10.5px]">
          <tr className="divide-x divide-black">
            <td colSpan={2} className="p-1.5 w-2/3">
              <span className="font-bold">NÚMERO DA D.O.: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.numeroDO}
                  onChange={e => onChange?.('numeroDO', e.target.value)}
                  placeholder="Declaração de Óbito Nº"
                  className="outline-none w-40 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.numeroDO}</span>
              )}
            </td>
            <td colSpan={2} className="p-1.5 w-1/3 text-center">
              <span className="space-x-4">
                <span>( {data.tipoDestino === 'IML' ? 'X' : ' '} ) IML</span>
                <span>( {data.tipoDestino === 'SVO' ? 'X' : ' '} ) SVO</span>
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={4} className="p-1.5">
              <span className="font-bold">CAUSA DA MORTE: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.causaMorte}
                  onChange={e => onChange?.('causaMorte', e.target.value)}
                  placeholder="Causa mortis conforme atestado"
                  className="outline-none w-4/5 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.causaMorte}</span>
              )}
            </td>
          </tr>
          <tr className="divide-x divide-black">
            <td colSpan={2} className="p-1.5 w-1/2">
              <span className="font-bold">DATA DO ÓBITO: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.dataObito}
                  onChange={e => onChange?.('dataObito', e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="outline-none w-28 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.dataObito || '_____ / _____ / _________'}</span>
              )}
            </td>
            <td colSpan={2} className="p-1.5 w-1/2">
              <span className="font-bold">HORA DO ÓBITO: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.horaObito}
                  onChange={e => onChange?.('horaObito', e.target.value)}
                  placeholder="HH:MM"
                  className="outline-none w-24 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.horaObito || '____ : ____'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td colSpan={4} className="p-1.5">
              <span className="font-bold">MÉDICO RESP.: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.medicoResp}
                  onChange={e => onChange?.('medicoResp', e.target.value)}
                  placeholder="Nome do médico e CRM"
                  className="outline-none w-3/4 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.medicoResp}</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* SEÇÃO 3: IDENTIFICAÇÃO DO FAMILIAR/RESPONSÁVEL PELA RETIRADA */}
      <table className="w-full border-collapse border border-black mb-1.5 text-black">
        <thead>
          <tr className="bg-slate-200 border-b border-black">
            <th colSpan={4} className="py-1 px-2 text-left font-bold uppercase tracking-wider text-[11px] text-black">
              IDENTIFICAÇÃO DO FAMILIAR/RESPONSÁVEL PELA RETIRADA
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black text-[10.5px]">
          <tr>
            <td colSpan={4} className="p-1.5">
              <span className="font-bold">NOME: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.nomeFamiliar}
                  onChange={e => onChange?.('nomeFamiliar', e.target.value)}
                  placeholder="Nome do familiar ou responsável legal"
                  className="outline-none w-3/4 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.nomeFamiliar}</span>
              )}
            </td>
          </tr>
          <tr className="divide-x divide-black">
            <td colSpan={2} className="p-1.5 w-1/2">
              <span className="font-bold">CPF: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.cpfFamiliar}
                  onChange={e => onChange?.('cpfFamiliar', e.target.value)}
                  placeholder="000.000.000-00"
                  className="outline-none w-40 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.cpfFamiliar}</span>
              )}
            </td>
            <td colSpan={2} className="p-1.5 w-1/2">
              <span className="font-bold">TELEFONE: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.telefoneFamiliar}
                  onChange={e => onChange?.('telefoneFamiliar', e.target.value)}
                  placeholder="(63) 99999-9999"
                  className="outline-none w-40 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.telefoneFamiliar}</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* SEÇÃO 4: IDENTIFICAÇÃO DA FUNERÁRIA */}
      <table className="w-full border-collapse border border-black mb-3 text-black">
        <thead>
          <tr className="bg-slate-200 border-b border-black">
            <th colSpan={4} className="py-1 px-2 text-left font-bold uppercase tracking-wider text-[11px] text-black">
              IDENTIFICAÇÃO DA FUNERÁRIA
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black text-[10.5px]">
          <tr>
            <td colSpan={4} className="p-1.5">
              <span className="font-bold">FUNERÁRIA: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.nomeFuneraria}
                  onChange={e => onChange?.('nomeFuneraria', e.target.value)}
                  placeholder="Nome da empresa funerária"
                  className="outline-none w-3/4 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.nomeFuneraria}</span>
              )}
            </td>
          </tr>
          <tr className="divide-x divide-black">
            <td colSpan={2} className="p-1.5 w-1/2">
              <span className="font-bold">PLACA VEÍCULO: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.placaVeiculo}
                  onChange={e => onChange?.('placaVeiculo', e.target.value)}
                  placeholder="ABC-1234"
                  className="outline-none w-32 uppercase bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.placaVeiculo}</span>
              )}
            </td>
            <td colSpan={2} className="p-1.5 w-1/2">
              <span className="font-bold">NOME MOTORISTA: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.nomeMotorista}
                  onChange={e => onChange?.('nomeMotorista', e.target.value)}
                  placeholder="Nome do motorista / agente funerário"
                  className="outline-none w-48 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.nomeMotorista}</span>
              )}
            </td>
          </tr>
          <tr className="divide-x divide-black">
            <td colSpan={2} className="p-1.5 w-1/2">
              <span className="font-bold">TELEFONE 1: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.telefone1Funeraria}
                  onChange={e => onChange?.('telefone1Funeraria', e.target.value)}
                  placeholder="(  ) __________"
                  className="outline-none w-36 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.telefone1Funeraria}</span>
              )}
            </td>
            <td colSpan={2} className="p-1.5 w-1/2">
              <span className="font-bold">TELEFONE 2: </span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.telefone2Funeraria}
                  onChange={e => onChange?.('telefone2Funeraria', e.target.value)}
                  placeholder="(  ) __________"
                  className="outline-none w-36 bg-amber-50/50 print:bg-transparent text-[10.5px]"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span>{data.telefone2Funeraria}</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Assinaturas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 pt-4 text-center text-[10.5px]">
        <div>
          <div className="border-t border-black max-w-[280px] mx-auto mb-1.5"></div>
          <p className="font-bold m-0 text-black">Assinatura do familiar/responsável</p>
        </div>
        <div>
          <div className="border-t border-black max-w-[280px] mx-auto mb-1.5"></div>
          <p className="font-bold m-0 text-black">Nome recepcionista responsável pela liberação</p>
          {data.recepcionista && (
            <p className="text-[10px] font-bold text-black m-0 mt-1">{data.recepcionista}</p>
          )}
        </div>
      </div>

      {/* Tabela de Aprovação da Qualidade / Rodapé Oficial */}
      <table className="w-full border-collapse border border-black text-[9.5px] mt-4 text-black">
        <tbody>
          <tr className="divide-x divide-black text-center align-top">
            <td className="w-1/4 p-1.5">
              <div className="font-bold text-black">Paula Fernanda N. Santos</div>
              <div className="text-slate-700">Coordenadora de Atendimento</div>
              <div className="font-bold text-black mt-1">Elaboração</div>
            </td>
            <td className="w-1/4 p-1.5">
              <div className="font-bold text-black">Paula Fernanda N. Santos</div>
              <div className="text-slate-700">Coordenadora de Atendimento</div>
              <div className="font-bold text-black mt-1">Gestor do Documento</div>
            </td>
            <td className="w-1/4 p-1.5">
              <div className="font-bold text-black">João Carlos D. Medeiros</div>
              <div className="text-slate-700">Gerente Administrativo</div>
              <div className="font-bold text-black mt-1">Revisor</div>
            </td>
            <td className="w-1/4 p-1.5">
              <div className="font-bold text-black">Qualidade</div>
              <div className="font-bold text-black mt-1">Aprovador</div>
            </td>
          </tr>
          <tr className="border-t border-black text-[9px]">
            <td colSpan={3} className="p-1 px-2 text-slate-800">
              É proibida a reprodução parcial ou total deste documento.
            </td>
            <td className="p-1 px-2 text-right font-bold text-black">
              Página 1 de 1
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
