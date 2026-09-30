import React, { useState } from 'react';
import { 
  FolderOpen, 
  Search, 
  FileText, 
  Printer, 
  Edit3, 
  CheckCircle2, 
  X, 
  ShieldAlert, 
  Building2, 
  Receipt,
  FileCheck,
  Clock,
  UserCheck
} from 'lucide-react';
import { TermoFusexPrint, TermoFusexData } from './documents/TermoFusexPrint';
import { TermoRetiradaCorpoPrint, TermoRetiradaCorpoData } from './documents/TermoRetiradaCorpoPrint';
import { SolicitacaoNotaFiscalPrint, SolicitacaoNotaFiscalData } from './documents/SolicitacaoNotaFiscalPrint';
import { AutorizacaoHoraExtraPrint, AutorizacaoHoraExtraData, HoraExtraRow } from './documents/AutorizacaoHoraExtraPrint';
import { DeclaracaoComparecimentoPrint, DeclaracaoComparecimentoData } from './documents/DeclaracaoComparecimentoPrint';

export type DocumentType = 'fusex' | 'retirada-corpo' | 'nota-fiscal' | 'hora-extra' | 'declaracao-comparecimento';

const INITIAL_FUSEX: TermoFusexData = {
  nomeTitular: '',
  nomeDependente: '',
  precCp: '',
  especialidade: '',
  dataAtendimento: '',
  horaEmissao: '',
  telefone1: '',
  telefone2: '',
  hospitalNome: 'Hospital Palmas Medical',
  diaData: '',
  mesData: '',
  anoData: '',
  identidadeResponsavel: '',
  recepcionista: ''
};

const INITIAL_RETIRADA_CORPO: TermoRetiradaCorpoData = {
  codigo: '',
  versao: '01',
  dataEdicao: '09/08/2023',
  dataRevisao: '08/01/2026',
  areaResponsavel: 'Diretoria',
  nomePaciente: '',
  nomeMae: '',
  dataNascimento: '',
  naturalidadeEstado: '',
  cpfPaciente: '',
  sexo: '',
  estadoCivil: '',
  convenio: '',
  numeroCarteira: '',
  numeroAtendimento: '',
  dataInternacao: '',
  endereco: '',
  cidade: 'Palmas',
  estado: 'TO',
  numeroDO: '',
  tipoDestino: '',
  causaMorte: '',
  dataObito: '',
  horaObito: '',
  medicoResp: '',
  nomeFamiliar: '',
  cpfFamiliar: '',
  telefoneFamiliar: '',
  nomeFuneraria: '',
  placaVeiculo: '',
  nomeMotorista: '',
  telefone1Funeraria: '',
  telefone2Funeraria: '',
  recepcionista: ''
};

const INITIAL_NOTA_FISCAL: SolicitacaoNotaFiscalData = {
  nomePaciente: '',
  cpfPaciente: '',
  emailPaciente: '',
  nomeTitularNF: '',
  cpfCnpjNF: '',
  dataNascimentoNF: '',
  telefoneNF: '',
  valorServico: '',
  enderecoNF: '',
  cepNF: '',
  dataSolicitacao: ''
};

const INITIAL_HORA_EXTRA: AutorizacaoHoraExtraData = {
  colaborador: '',
  matricula: '',
  linhas: Array.from({ length: 9 }, () => ({
    data: '',
    entrada: '',
    saidaIntervalo: '',
    retornoIntervalo: '',
    saida: '',
    qtdHoras: '',
    motivo: ''
  }))
};

const INITIAL_DECLARACAO: DeclaracaoComparecimentoData = {
  nomePaciente: '',
  cpfPaciente: '',
  diaAtendimento: '',
  mesAtendimento: '',
  anoAtendimento: '',
  tipoAtendimento: 'CONSULTA em PRONTO SOCORRO',
  diaEmissao: '',
  mesEmissao: '',
  anoEmissao: ''
};

export const DocumentosViewer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Modal State
  const [activeDoc, setActiveDoc] = useState<DocumentType | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(true);

  // Form Data States
  const [fusexData, setFusexData] = useState<TermoFusexData>(INITIAL_FUSEX);
  const [retiradaData, setRetiradaData] = useState<TermoRetiradaCorpoData>(INITIAL_RETIRADA_CORPO);
  const [notaFiscalData, setNotaFiscalData] = useState<SolicitacaoNotaFiscalData>(INITIAL_NOTA_FISCAL);
  const [horaExtraData, setHoraExtraData] = useState<AutorizacaoHoraExtraData>(INITIAL_HORA_EXTRA);
  const [declaracaoData, setDeclaracaoData] = useState<DeclaracaoComparecimentoData>(INITIAL_DECLARACAO);

  const categories = [
    { id: 'todos', label: 'Todos os Documentos' },
    { id: 'declaracoes', label: 'Declarações & Laudos' },
    { id: 'termos', label: 'Termos & Compromisso' },
    { id: 'rh', label: 'RH & Horas Extras' },
    { id: 'obito', label: 'Liberação de Óbito' },
    { id: 'faturamento', label: 'Nota Fiscal & Faturamento' }
  ];

  const docList = [
    {
      id: 'declaracao-comparecimento' as DocumentType,
      title: 'Declaração de Comparecimento – Hospital Palmas Medical',
      shortTitle: 'Declaração de Comparecimento',
      category: 'declaracoes',
      orgao: 'Hospital Palmas Medical • Pronto-Socorro',
      description: 'Documento comprobatório oficial de comparecimento do paciente para consulta em Pronto-Socorro, exames ou internação, com dados do RT Dr. Nilo Francisco de Sales Sobrinho (CRM-TO 4686).',
      icon: UserCheck,
      badge: 'Pronto-Socorro',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
      prazo: 'Emissão Imediata'
    },
    {
      id: 'fusex' as DocumentType,
      title: 'Termo de Compromisso para Entrega da Guia de Encaminhamento – FUSEx / Exército Brasileiro',
      shortTitle: 'Termo de Compromisso FUSEx / Exército Brasileiro',
      category: 'termos',
      orgao: 'Ministério da Defesa / 22º BI',
      description: 'Termo formal para atendimento de Urgência/Emergência a beneficiários do FUSEx com compromisso de entrega da guia autorizada em até 48h (2 dias úteis) ou assunção particular.',
      icon: ShieldAlert,
      badge: 'FUSEx / Exército',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      prazo: '48 horas ou 2 dias úteis'
    },
    {
      id: 'hora-extra' as DocumentType,
      title: 'Autorização Pagamento de Hora Extra – Rede Medical / Kora Saúde',
      shortTitle: 'Autorização Pagamento de Hora Extra',
      category: 'rh',
      orgao: 'Rede Medical / Kora Saúde • DP & RH',
      description: 'Formulário padrão para autorização de trabalho em regime extraordinário, controle de jornadas, horários de intervalo, horas autorizadas e aprovações da Diretoria e do Gestor.',
      icon: Clock,
      badge: 'RH & DP',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      prazo: 'Folha de Pagamento'
    },
    {
      id: 'retirada-corpo' as DocumentType,
      title: 'Termo de Retirada de Corpo – Rede Medical',
      shortTitle: 'Termo de Retirada de Corpo – Rede Medical / Kora',
      category: 'obito',
      orgao: 'Rede Medical / Diretoria',
      description: 'Formulário oficial para liberação e retirada de corpo por familiar ou funerária, com dados da D.O., IML/SVO, identificação do motorista, veículo e aprovações da Qualidade.',
      icon: Building2,
      badge: 'Formulário Oficial',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      prazo: 'Revisão: 08/01/2026'
    },
    {
      id: 'nota-fiscal' as DocumentType,
      title: 'Solicitação de Nota Fiscal – Rede Medical',
      shortTitle: 'Solicitação de Nota Fiscal – Rede Medical',
      category: 'faturamento',
      orgao: 'Rede Medical / Faturamento',
      description: 'Formulário padrão de solicitação de nota fiscal de serviços hospitalares/médicos em nome do paciente ou de terceiros (CPF/CNPJ, endereço, valor e dados de contato).',
      icon: Receipt,
      badge: 'Faturamento',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      prazo: 'Palmas/TO'
    }
  ];

  const filteredDocs = docList.filter(doc => {
    const matchesCategory = selectedCategory === 'todos' || doc.category === selectedCategory;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = !q || 
      doc.title.toLowerCase().includes(q) || 
      doc.description.toLowerCase().includes(q) ||
      doc.orgao.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleOpenDoc = (docId: DocumentType, edit: boolean = true) => {
    setActiveDoc(docId);
    setIsEditMode(edit);
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePrintBlank = (docId: DocumentType) => {
    if (docId === 'fusex') setFusexData(INITIAL_FUSEX);
    if (docId === 'retirada-corpo') setRetiradaData(INITIAL_RETIRADA_CORPO);
    if (docId === 'nota-fiscal') setNotaFiscalData(INITIAL_NOTA_FISCAL);
    if (docId === 'hora-extra') setHoraExtraData(INITIAL_HORA_EXTRA);
    if (docId === 'declaracao-comparecimento') setDeclaracaoData(INITIAL_DECLARACAO);
    setActiveDoc(docId);
    setIsEditMode(false);
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const handleClearCurrentForm = () => {
    if (activeDoc === 'fusex') setFusexData(INITIAL_FUSEX);
    if (activeDoc === 'retirada-corpo') setRetiradaData(INITIAL_RETIRADA_CORPO);
    if (activeDoc === 'nota-fiscal') setNotaFiscalData(INITIAL_NOTA_FISCAL);
    if (activeDoc === 'hora-extra') setHoraExtraData(INITIAL_HORA_EXTRA);
    if (activeDoc === 'declaracao-comparecimento') setDeclaracaoData(INITIAL_DECLARACAO);
  };

  const fillExampleData = () => {
    const now = new Date();
    const dStr = now.toLocaleDateString('pt-BR');
    const tStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const diaAtual = String(now.getDate()).padStart(2, '0');
    const mesAtual = now.toLocaleString('pt-BR', { month: 'long' });
    const anoAtual = String(now.getFullYear());

    if (activeDoc === 'declaracao-comparecimento') {
      setDeclaracaoData({
        nomePaciente: 'GABRIEL RODRIGUES DE CARVALHO',
        cpfPaciente: '852.147.963-00',
        diaAtendimento: diaAtual,
        mesAtendimento: mesAtual,
        anoAtendimento: anoAtual,
        tipoAtendimento: 'CONSULTA em PRONTO SOCORRO',
        diaEmissao: diaAtual,
        mesEmissao: mesAtual,
        anoEmissao: anoAtual
      });
    } else if (activeDoc === 'fusex') {
      setFusexData({
        nomeTitular: 'SGT CARLOS ALBERTO SILVA',
        nomeDependente: 'LUCAS SILVA E SOUZA',
        precCp: '123456789',
        especialidade: 'Pronto-Socorro / Urgência Adulto',
        dataAtendimento: dStr,
        horaEmissao: tStr,
        telefone1: '(63) 98412-3456',
        telefone2: '(63) 3215-0000',
        hospitalNome: 'Hospital Palmas Medical',
        diaData: diaAtual,
        mesData: mesAtual,
        anoData: anoAtual.slice(-2),
        identidadeResponsavel: '1234567 SSP/TO',
        recepcionista: 'Recepção PS Palmas Medical'
      });
    } else if (activeDoc === 'hora-extra') {
      setHoraExtraData({
        colaborador: 'FERNANDO ALMEIDA SILVA',
        matricula: 'MED-4821',
        linhas: [
          {
            data: '28/09',
            entrada: '19:00',
            saidaIntervalo: '00:00',
            retornoIntervalo: '01:00',
            saida: '07:00',
            qtdHoras: '11h',
            motivo: 'Cobertura de plantão noturno no Pronto-Socorro'
          },
          {
            data: '29/09',
            entrada: '14:00',
            saidaIntervalo: '18:00',
            retornoIntervalo: '19:00',
            saida: '22:00',
            qtdHoras: '7h',
            motivo: 'Substituição de escala de enfermagem UTI'
          },
          ...Array.from({ length: 7 }, () => ({
            data: '',
            entrada: '',
            saidaIntervalo: '',
            retornoIntervalo: '',
            saida: '',
            qtdHoras: '',
            motivo: ''
          }))
        ]
      });
    } else if (activeDoc === 'retirada-corpo') {
      setRetiradaData({
        codigo: 'FOR-DIR-042',
        versao: '02',
        dataEdicao: '09/08/2023',
        dataRevisao: '08/01/2026',
        areaResponsavel: 'Diretoria Hospitalar',
        nomePaciente: 'JOSÉ FRANCISCO DE OLIVEIRA',
        nomeMae: 'MARIA APARECIDA DE OLIVEIRA',
        dataNascimento: '15/04/1952',
        naturalidadeEstado: 'Porto Nacional / TO',
        cpfPaciente: '123.456.789-00',
        sexo: 'masculino',
        estadoCivil: 'casado',
        convenio: 'PARTICULAR',
        numeroCarteira: 'N/A',
        numeroAtendimento: 'AT-2026-9874',
        dataInternacao: dStr,
        endereco: 'Quadra 104 Sul, Rua SE 05, Lote 12',
        cidade: 'Palmas',
        estado: 'TO',
        numeroDO: '34.897.123-5',
        tipoDestino: '',
        causaMorte: 'Insuficiência respiratória aguda decorrente de choque séptico',
        dataObito: dStr,
        horaObito: tStr,
        medicoResp: 'Dr. Roberto Mendes (CRM/TO 4512)',
        nomeFamiliar: 'ANA CLAUDIA OLIVEIRA',
        cpfFamiliar: '987.654.321-99',
        telefoneFamiliar: '(63) 99234-5678',
        nomeFuneraria: 'Pax Palmas Serviços Funerários',
        placaVeiculo: 'QKM-4E52',
        nomeMotorista: 'Marcos Vinicius Santos',
        telefone1Funeraria: '(63) 3218-9000',
        telefone2Funeraria: '(63) 98400-1122',
        recepcionista: 'Recepção Internação Palmas Medical'
      });
    } else if (activeDoc === 'nota-fiscal') {
      setNotaFiscalData({
        nomePaciente: 'MARIA EDUARDA PEREIRA',
        cpfPaciente: '234.567.890-11',
        emailPaciente: 'maria.eduarda@email.com',
        nomeTitularNF: 'MARIA EDUARDA PEREIRA',
        cpfCnpjNF: '234.567.890-11',
        dataNascimentoNF: '22/08/1988',
        telefoneNF: '(63) 98112-9988',
        valorServico: '1.450,00',
        enderecoNF: 'Quadra 208 Sul, Alameda 02, Casa 15',
        cepNF: '77020-120',
        dataSolicitacao: dStr
      });
    }
  };

  const handleRowChange = (index: number, field: keyof HoraExtraRow, val: string) => {
    setHoraExtraData(prev => {
      const newLinhas = [...prev.linhas];
      newLinhas[index] = { ...newLinhas[index], [field]: val };
      return { ...prev, linhas: newLinhas };
    });
  };

  return (
    <div className="space-y-6">
      {/* Printable Area when print is triggered */}
      {activeDoc && (
        <div id="documento-print-container" className="hidden print:block font-sans text-black w-full m-0 p-0">
          {activeDoc === 'declaracao-comparecimento' && (
            <DeclaracaoComparecimentoPrint
              data={declaracaoData}
              isEditable={false}
            />
          )}
          {activeDoc === 'fusex' && (
            <TermoFusexPrint 
              data={fusexData} 
              isEditable={false} 
            />
          )}
          {activeDoc === 'hora-extra' && (
            <AutorizacaoHoraExtraPrint
              data={horaExtraData}
              isEditable={false}
            />
          )}
          {activeDoc === 'retirada-corpo' && (
            <TermoRetiradaCorpoPrint 
              data={retiradaData} 
              isEditable={false} 
            />
          )}
          {activeDoc === 'nota-fiscal' && (
            <SolicitacaoNotaFiscalPrint 
              data={notaFiscalData} 
              isEditable={false} 
            />
          )}
        </div>
      )}

      {/* Screen View */}
      <div className="print:hidden space-y-6">
        {/* Header Banner */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF7F8] border border-[#C4E5E8] flex items-center justify-center text-[#0E7B86] shadow-xs flex-shrink-0">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight m-0">
                  DOCUMENTOS & MODELOS HOSPITALARES
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8]">
                  5 Modelos Oficiais
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Modelos oficiais formatados para preenchimento na recepção, visualização em tela e impressão direta em folha A4.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl self-start md:self-auto">
            <FileCheck className="w-4 h-4 text-[#0E7B86]" />
            <span>Padrão ABNT • Folha A4 • Impressão Limpa</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar modelo de documento por título, finalidade ou órgão..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E7B86] focus:bg-white"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0E7B86] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filteredDocs.map((doc) => {
            const Icon = doc.icon;
            return (
              <div 
                key={doc.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-[#0E7B86] transition-all group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 group-hover:bg-[#EBF7F8] group-hover:border-[#C4E5E8] flex items-center justify-center text-slate-700 group-hover:text-[#0E7B86] transition-colors shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${doc.badgeColor}`}>
                      {doc.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-[#0E7B86] transition-colors leading-snug">
                      {doc.shortTitle}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wide">
                      {doc.orgao}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {doc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Referência:</span>
                    <strong className="text-slate-700 font-mono text-[10px]">{doc.prazo}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenDoc(doc.id, true)}
                      className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-[#0E7B86] hover:bg-[#095962] text-white text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Preencher</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePrintBlank(doc.id)}
                      className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all active:scale-95 cursor-pointer border border-slate-200"
                      title="Imprimir modelo em branco para preenchimento manual"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>Imprimir</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Document Editor / Preview Modal */}
        {activeDoc && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-5 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-5xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[95vh]">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0E7B86] to-[#095962] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black tracking-tight leading-tight">
                      {activeDoc === 'declaracao-comparecimento' && 'Declaração de Comparecimento – Hospital Palmas Medical'}
                      {activeDoc === 'fusex' && 'Termo de Compromisso FUSEx – Exército Brasileiro'}
                      {activeDoc === 'hora-extra' && 'Autorização Pagamento de Hora Extra – Rede Medical'}
                      {activeDoc === 'retirada-corpo' && 'Termo de Retirada de Corpo – Rede Medical'}
                      {activeDoc === 'nota-fiscal' && 'Solicitação de Nota Fiscal – Rede Medical'}
                    </h3>
                    <p className="text-[11px] text-teal-100 font-medium mt-0.5">
                      {isEditMode 
                        ? 'Modo Preenchimento: digite os dados nos campos destacados para impressão personalizada.'
                        : 'Modo Documento em Branco: modelo limpo pronto para impressão e assinatura manual.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDoc(null)}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mode Switcher & Actions Bar */}
              <div className="p-3 px-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditMode(true)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      isEditMode
                        ? 'bg-[#0E7B86] text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Digitar Dados (Em Tela)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditMode(false)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      !isEditMode
                        ? 'bg-[#0E7B86] text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Modelo Limpo em Branco
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {isEditMode && (
                    <>
                      <button
                        type="button"
                        onClick={fillExampleData}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold cursor-pointer"
                        title="Preencher campos com dados de exemplo para teste"
                      >
                        Exemplo Rápido
                      </button>
                      <button
                        type="button"
                        onClick={handleClearCurrentForm}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer"
                      >
                        Limpar
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#B01B52] hover:bg-[#971444] text-white font-bold shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimir Agora (A4)</span>
                  </button>
                </div>
              </div>

              {/* Document Preview Content */}
              <div className="p-4 sm:p-6 overflow-y-auto bg-slate-100/70 flex-1">
                {activeDoc === 'declaracao-comparecimento' && (
                  <DeclaracaoComparecimentoPrint
                    data={declaracaoData}
                    isEditable={isEditMode}
                    onChange={(f, val) => setDeclaracaoData(prev => ({ ...prev, [f]: val }))}
                  />
                )}
                {activeDoc === 'fusex' && (
                  <TermoFusexPrint 
                    data={fusexData} 
                    isEditable={isEditMode}
                    onChange={(f, val) => setFusexData(prev => ({ ...prev, [f]: val }))} 
                  />
                )}
                {activeDoc === 'hora-extra' && (
                  <AutorizacaoHoraExtraPrint
                    data={horaExtraData}
                    isEditable={isEditMode}
                    onChangeHeader={(field, val) => setHoraExtraData(prev => ({ ...prev, [field]: val }))}
                    onChangeRow={handleRowChange}
                  />
                )}
                {activeDoc === 'retirada-corpo' && (
                  <TermoRetiradaCorpoPrint 
                    data={retiradaData} 
                    isEditable={isEditMode}
                    onChange={(f, val) => setRetiradaData(prev => ({ ...prev, [f]: val }))} 
                  />
                )}
                {activeDoc === 'nota-fiscal' && (
                  <SolicitacaoNotaFiscalPrint 
                    data={notaFiscalData} 
                    isEditable={isEditMode}
                    onChange={(f, val) => setNotaFiscalData(prev => ({ ...prev, [f]: val }))} 
                  />
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>Dica: Pressione Ctrl+P ou clique no botão Imprimir para salvar em PDF ou imprimir na recepção.</span>
                <button
                  type="button"
                  onClick={() => setActiveDoc(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
