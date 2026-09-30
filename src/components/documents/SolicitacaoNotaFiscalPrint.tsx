import React from 'react';

export interface SolicitacaoNotaFiscalData {
  nomePaciente: string;
  cpfPaciente: string;
  emailPaciente: string;
  nomeTitularNF: string;
  cpfCnpjNF: string;
  dataNascimentoNF: string;
  telefoneNF: string;
  valorServico: string;
  enderecoNF: string;
  cepNF: string;
  dataSolicitacao: string;
}

interface SolicitacaoNotaFiscalPrintProps {
  data: SolicitacaoNotaFiscalData;
  onChange?: (field: keyof SolicitacaoNotaFiscalData, val: string) => void;
  isEditable?: boolean;
}

export const SolicitacaoNotaFiscalPrint: React.FC<SolicitacaoNotaFiscalPrintProps> = ({
  data,
  onChange,
  isEditable = false
}) => {
  return (
    <div 
      className="text-black bg-white p-6 sm:p-12 max-w-[760px] mx-auto text-[11px] leading-normal border-2 border-black print:border-2 print:border-black rounded-none shadow-xs"
      style={{ fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}
    >
      {/* Top Logo */}
      <div className="text-center pt-2 pb-6">
        <div className="inline-flex items-center gap-3">
          {/* Logo Rede Medical */}
          <div className="relative flex items-center justify-center text-black">
            <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M40 25 H60 V40 H75 V60 H60 V75 H40 V60 H25 V40 H40 Z" />
              <path d="M30 40 C20 40 20 60 30 60" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block text-[11px] font-bold text-slate-700 uppercase tracking-widest leading-none">
              Rede
            </span>
            <span className="block text-2xl font-bold text-black tracking-tight leading-none mt-1">
              Medical
            </span>
          </div>
        </div>

        <h2 className="text-[13px] sm:text-[14px] font-bold uppercase tracking-wider text-black mt-6 mb-2">
          SOLICITAÇÃO DE NOTA FISCAL
        </h2>
      </div>

      {/* Fields */}
      <div className="space-y-6 pt-4 text-[11px]">
        {/* Nome do paciente */}
        <div className="flex items-end gap-2">
          <span className="font-bold whitespace-nowrap text-black">Nome do paciente:</span>
          <div className="border-b border-black flex-1 min-h-[22px] pb-0.5">
            {isEditable ? (
              <input
                type="text"
                value={data.nomePaciente}
                onChange={e => onChange?.('nomePaciente', e.target.value)}
                placeholder="Nome completo do paciente atendido"
                className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent"
                style={{ fontFamily: 'Arial, sans-serif' }}
              />
            ) : (
              <span className="font-bold text-black">{data.nomePaciente}</span>
            )}
          </div>
        </div>

        {/* CPF do paciente */}
        <div className="flex items-end gap-2">
          <span className="font-bold whitespace-nowrap text-black">CPF do paciente:</span>
          <div className="border-b border-black flex-1 min-h-[22px] pb-0.5">
            {isEditable ? (
              <input
                type="text"
                value={data.cpfPaciente}
                onChange={e => onChange?.('cpfPaciente', e.target.value)}
                placeholder="000.000.000-00"
                className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent"
                style={{ fontFamily: 'Arial, sans-serif' }}
              />
            ) : (
              <span className="text-black">{data.cpfPaciente || '_____._____._____-____'}</span>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex items-end gap-2">
          <span className="font-bold whitespace-nowrap text-black">Email:</span>
          <div className="border-b border-black flex-1 min-h-[22px] pb-0.5">
            {isEditable ? (
              <input
                type="email"
                value={data.emailPaciente}
                onChange={e => onChange?.('emailPaciente', e.target.value)}
                placeholder="email@exemplo.com.br"
                className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent"
                style={{ fontFamily: 'Arial, sans-serif' }}
              />
            ) : (
              <span className="text-black">{data.emailPaciente}</span>
            )}
          </div>
        </div>

        {/* Linha separadora de seção */}
        <div className="pt-4"></div>

        {/* Nota Fiscal em nome de */}
        <div className="flex items-end gap-2">
          <span className="font-bold whitespace-nowrap text-black">Nota Fiscal em nome de:</span>
          <div className="border-b border-black flex-1 min-h-[22px] pb-0.5">
            {isEditable ? (
              <input
                type="text"
                value={data.nomeTitularNF}
                onChange={e => onChange?.('nomeTitularNF', e.target.value)}
                placeholder="Nome / Razão Social para emissão"
                className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent"
                style={{ fontFamily: 'Arial, sans-serif' }}
              />
            ) : (
              <span className="font-bold text-black">{data.nomeTitularNF}</span>
            )}
          </div>
        </div>

        {/* CPF/CNPJ & Data de Nascimento */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex items-end gap-2 flex-1">
            <span className="font-bold whitespace-nowrap text-black">CPF/CNPJ:</span>
            <div className="border-b border-black flex-1 min-h-[22px] pb-0.5">
              {isEditable ? (
                <input
                  type="text"
                  value={data.cpfCnpjNF}
                  onChange={e => onChange?.('cpfCnpjNF', e.target.value)}
                  placeholder="000.000.000-00 ou 00.000.000/0001-00"
                  className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span className="text-black">{data.cpfCnpjNF}</span>
              )}
            </div>
          </div>

          <div className="flex items-end gap-2">
            <span className="font-bold whitespace-nowrap text-black">Data de Nascimento:</span>
            <div className="border-b border-black min-h-[22px] w-36 pb-0.5 text-center">
              {isEditable ? (
                <input
                  type="text"
                  value={data.dataNascimentoNF}
                  onChange={e => onChange?.('dataNascimentoNF', e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="w-full outline-none text-[11px] text-center bg-amber-50/50 print:bg-transparent"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span className="text-black">{data.dataNascimentoNF || '____/____/________'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Telefone */}
        <div className="flex items-end gap-2">
          <span className="font-bold whitespace-nowrap text-black">Telefone:</span>
          <div className="border-b border-black max-w-sm flex-1 min-h-[22px] pb-0.5">
            {isEditable ? (
              <input
                type="text"
                value={data.telefoneNF}
                onChange={e => onChange?.('telefoneNF', e.target.value)}
                placeholder="(63) 99999-9999"
                className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent"
                style={{ fontFamily: 'Arial, sans-serif' }}
              />
            ) : (
              <span className="text-black">{data.telefoneNF}</span>
            )}
          </div>
        </div>

        {/* Valor */}
        <div className="flex items-end gap-2">
          <span className="font-bold whitespace-nowrap text-black">Valor:</span>
          <div className="border-b border-black max-w-sm flex-1 min-h-[22px] pb-0.5">
            {isEditable ? (
              <input
                type="text"
                value={data.valorServico}
                onChange={e => onChange?.('valorServico', e.target.value)}
                placeholder="R$ 0,00"
                className="w-full outline-none text-[11px] font-bold text-black bg-amber-50/50 print:bg-transparent"
                style={{ fontFamily: 'Arial, sans-serif' }}
              />
            ) : (
              <span className="font-bold text-black">{data.valorServico ? `R$ ${data.valorServico}` : ''}</span>
            )}
          </div>
        </div>

        {/* Endereço & CEP */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex items-end gap-2 flex-1">
            <span className="font-bold whitespace-nowrap text-black">Endereço:</span>
            <div className="border-b border-black flex-1 min-h-[22px] pb-0.5">
              {isEditable ? (
                <input
                  type="text"
                  value={data.enderecoNF}
                  onChange={e => onChange?.('enderecoNF', e.target.value)}
                  placeholder="Logradouro, número, setor, cidade"
                  className="w-full outline-none text-[11px] bg-amber-50/50 print:bg-transparent"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span className="text-black">{data.enderecoNF}</span>
              )}
            </div>
          </div>

          <div className="flex items-end gap-2">
            <span className="font-bold whitespace-nowrap text-black">CEP:</span>
            <div className="border-b border-black min-h-[22px] w-36 pb-0.5 text-center">
              {isEditable ? (
                <input
                  type="text"
                  value={data.cepNF}
                  onChange={e => onChange?.('cepNF', e.target.value)}
                  placeholder="77000-000"
                  className="w-full outline-none text-[11px] text-center bg-amber-50/50 print:bg-transparent"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              ) : (
                <span className="text-black">{data.cepNF}</span>
              )}
            </div>
          </div>
        </div>

        {/* Data Rodapé Palmas/TO */}
        <div className="pt-16 pb-4 flex justify-center items-end gap-2 text-[11px]">
          <span className="font-bold text-black">Palmas/TO</span>
          <div className="border-b border-black w-44 min-h-[18px] text-center">
            {isEditable ? (
              <input
                type="text"
                value={data.dataSolicitacao}
                onChange={e => onChange?.('dataSolicitacao', e.target.value)}
                placeholder="____ / ____ / ________"
                className="w-full outline-none text-[11px] text-center bg-amber-50/50 print:bg-transparent"
                style={{ fontFamily: 'Arial, sans-serif' }}
              />
            ) : (
              <span>{data.dataSolicitacao || '____ / ____ / ________'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
