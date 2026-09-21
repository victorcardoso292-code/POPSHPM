import React, { useState } from 'react';
import { 
  FileCheck2, 
  Sparkles, 
  Printer, 
  Save, 
  Trash2, 
  Copy, 
  Check, 
  Building2, 
  AlertCircle,
  Plus,
  RefreshCw,
  Clock
} from 'lucide-react';
import { PreGuiaData } from '../types';
import { CONVENIOS_MASTER_LIST } from '../data/popsData';
import { loadPreGuias, savePreGuia, deletePreGuia } from '../services/storageService';

interface PreGuiaGeneratorProps {
  initialConvenio?: string;
  initialCode?: string;
  initialDesc?: string;
}

export const PreGuiaGenerator: React.FC<PreGuiaGeneratorProps> = ({
  initialConvenio,
  initialCode,
  initialDesc
}) => {
  const [patientName, setPatientName] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [convenio, setConvenio] = useState<string>(initialConvenio || 'SERVIR');
  const [carater, setCarater] = useState<'Urgência' | 'Eletivo'>('Urgência');
  const [doctorName, setDoctorName] = useState<string>('');
  const [doctorCrm, setDoctorCrm] = useState<string>('');
  const [cid, setCid] = useState<string>('');
  const [procedimentoNome, setProcedimentoNome] = useState<string>(initialDesc || '');
  const [codigos, setCodigos] = useState<string>(initialCode || '');
  const [justificativa, setJustificativa] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [copiedJustif, setCopiedJustif] = useState<boolean>(false);
  const [savedGuias, setSavedGuias] = useState<PreGuiaData[]>(() => loadPreGuias());

  const handleGenerateAiJustificativa = async () => {
    if (!procedimentoNome.trim()) {
      alert('Por favor, informe a descrição do procedimento antes de gerar a justificativa.');
      return;
    }

    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/pre-guia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          convenio,
          procedimentoNome,
          cid,
          quadroClinico: justificativa || `Paciente necessita de realização de ${procedimentoNome} com urgência para diagnóstico/tratamento hospitalar.`,
          carater
        })
      });

      const data = await res.json();
      if (data.justificativaClinica) {
        setJustificativa(data.justificativaClinica);
        if (data.codigoPrincipal?.codigo && !codigos) {
          setCodigos(data.codigoPrincipal.codigo);
        }
        if (data.observacoesAuditoria) {
          setObservacoes(data.observacoesAuditoria);
        }
      } else {
        alert('Não foi possível gerar a justificativa automática. Verifique a conexão com a IA.');
      }
    } catch (err) {
      alert('Erro ao conectar com a IA para gerar justificativa.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSaveDraft = () => {
    if (!patientName.trim() || !procedimentoNome.trim()) {
      alert('Preencha ao menos o nome do paciente e o procedimento para salvar o rascunho.');
      return;
    }

    const newGuia: PreGuiaData = {
      id: `PG-${Date.now()}`,
      patientName: patientName.trim(),
      cardNumber: cardNumber.trim(),
      convenio,
      carater,
      doctorName: doctorName.trim(),
      doctorCrm: doctorCrm.trim(),
      cid: cid.trim(),
      procedimentos: [
        {
          code: codigos.trim(),
          description: procedimentoNome.trim(),
          quantity: 1
        }
      ],
      justificativaClinica: justificativa.trim(),
      createdAt: new Date().toISOString(),
      status: 'Pendente'
    };

    const updated = savePreGuia(newGuia);
    setSavedGuias(updated);
    alert('Pré-Guia salva com sucesso no histórico local!');
  };

  const handleLoadDraft = (g: PreGuiaData) => {
    setPatientName(g.patientName);
    setCardNumber(g.cardNumber);
    setConvenio(g.convenio);
    setCarater(g.carater);
    setDoctorName(g.doctorName);
    setDoctorCrm(g.doctorCrm);
    setCid(g.cid);
    setProcedimentoNome(g.procedimentos[0]?.description || '');
    setCodigos(g.procedimentos[0]?.code || '');
    setJustificativa(g.justificativaClinica);
  };

  const handleDeleteDraft = (id: string) => {
    if (confirm('Deseja excluir este rascunho de Pré-Guia?')) {
      const updated = deletePreGuia(id);
      setSavedGuias(updated);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const copyJustif = () => {
    navigator.clipboard.writeText(justificativa);
    setCopiedJustif(true);
    setTimeout(() => setCopiedJustif(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Printable Official Pre-Guia Slip */}
      <div id="print-pre-guia" className="hidden print:block font-sans text-slate-900 p-8">
        <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 m-0">
              HOSPITAL PALMAS MEDICAL • KORA SAÚDE
            </h1>
            <p className="text-xs text-slate-600 m-0">
              Formulário de Solicitação Prévia de Autorização / Pré-Guia TISS
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold bg-slate-100 border border-slate-300 px-2 py-1 rounded">
              DATA: {new Date().toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border border-slate-400 p-3 rounded mb-4 text-xs">
          <div>
            <span className="font-bold text-slate-500 uppercase block text-[10px]">Paciente:</span>
            <p className="font-bold text-sm text-slate-900 m-0">{patientName || '______________________________________'}</p>
          </div>
          <div>
            <span className="font-bold text-slate-500 uppercase block text-[10px]">Convênio / Carteirinha:</span>
            <p className="font-bold text-sm text-slate-900 m-0">{convenio} {cardNumber ? `— Nº ${cardNumber}` : ''}</p>
          </div>
          <div>
            <span className="font-bold text-slate-500 uppercase block text-[10px]">Médico Solicitante / CRM:</span>
            <p className="font-bold text-slate-900 m-0">{doctorName || 'Dr(a). _________________'} {doctorCrm ? `(CRM: ${doctorCrm})` : ''}</p>
          </div>
          <div>
            <span className="font-bold text-slate-500 uppercase block text-[10px]">Caráter / CID-10:</span>
            <p className="font-bold text-slate-900 m-0">{carater.toUpperCase()} • CID: {cid || 'Não especificado'}</p>
          </div>
        </div>

        <div className="border border-slate-400 p-3 rounded mb-4 text-xs">
          <span className="font-bold text-slate-500 uppercase block text-[10px] mb-1">Procedimento Solicitado & Códigos TUSS:</span>
          <div className="flex items-center gap-2 font-mono font-bold text-sm text-slate-900">
            <span>[{codigos || 'SEM CÓDIGO'}]</span>
            <span>{procedimentoNome || '________________________________________________'}</span>
          </div>
        </div>

        <div className="border border-slate-400 p-3 rounded mb-8 text-xs min-h-[140px]">
          <span className="font-bold text-slate-500 uppercase block text-[10px] mb-1">Justificativa Clínica / Indicação Médica:</span>
          <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed m-0 font-medium">
            {justificativa || 'Paciente apresenta quadro clínico compatível com a indicação diagnóstica/terapêutica descrita, sendo necessária a realização em caráter hospitalar.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-center text-xs pt-12 border-t border-slate-300">
          <div>
            <div className="border-t border-slate-400 pt-1 w-48 mx-auto"></div>
            <p className="font-bold m-0">Médico Solicitante</p>
            <p className="text-[10px] text-slate-500 m-0">Carimbo e Assinatura</p>
          </div>
          <div>
            <div className="border-t border-slate-400 pt-1 w-48 mx-auto"></div>
            <p className="font-bold m-0">Beneficiário / Responsável</p>
            <p className="text-[10px] text-slate-500 m-0">Assinatura do Paciente</p>
          </div>
        </div>
      </div>

      {/* Screen View */}
      <div className="print:hidden space-y-5">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950/80 to-slate-900 border border-cyan-800/50 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/90 border border-cyan-700/50 px-2.5 py-0.5 rounded-full">
                Módulo de Autorizações TISS
              </span>
              <span className="text-xs text-slate-300 font-medium">Hospital Palmas Medical</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white m-0">
              Emissor de Pré-Guia & Justificativas
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed m-0">
              Elabore solicitações de autorização com justificativas clínicas formuladas por IA, prontas para inclusão nos portais de convênios.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Rascunho</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Pré-Guia</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Form */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 m-0">
                Dados da Solicitação
              </h3>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">Nome do Paciente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: Maria Francisca da Silva"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">Número da Carteirinha</label>
                  <input
                    type="text"
                    placeholder="Ex.: 00123456789012"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">Convênio</label>
                  <select
                    value={convenio}
                    onChange={e => setConvenio(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="SERVIR">SERVIR (Plano TO)</option>
                    {CONVENIOS_MASTER_LIST.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">Caráter do Atendimento</label>
                  <select
                    value={carater}
                    onChange={e => setCarater(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Urgência">Urgência / Emergência</option>
                    <option value="Eletivo">Eletivo</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">CID-10 Principal</label>
                  <input
                    type="text"
                    placeholder="Ex.: K35.8"
                    value={cid}
                    onChange={e => setCid(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium font-mono focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">Médico Solicitante</label>
                  <input
                    type="text"
                    placeholder="Ex.: Dr. Roberto Campos"
                    value={doctorName}
                    onChange={e => setDoctorName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">CRM do Médico</label>
                  <input
                    type="text"
                    placeholder="Ex.: 3421-TO"
                    value={doctorCrm}
                    onChange={e => setDoctorCrm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">Procedimento Solicitado *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: APENDICECTOMIA VIDEOLAPAROSCÓPICA"
                    value={procedimentoNome}
                    onChange={e => setProcedimentoNome(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">Código(s) TUSS</label>
                  <input
                    type="text"
                    placeholder="Ex.: 31001017"
                    value={codigos}
                    onChange={e => setCodigos(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Justification with AI Generator Button */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase">
                    Justificativa Clínica (Laudo Técnico)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGenerateAiJustificativa}
                      disabled={isGeneratingAi}
                      className="flex items-center gap-1.5 text-xs font-bold text-cyan-900 bg-cyan-100 hover:bg-cyan-200 px-3 py-1 rounded-lg transition-colors"
                    >
                      {isGeneratingAi ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Gerando com IA...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-cyan-700" />
                          <span>Gerar Justificativa com IA</span>
                        </>
                      )}
                    </button>

                    {justificativa && (
                      <button
                        type="button"
                        onClick={copyJustif}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-2 py-1 rounded-lg flex items-center gap-1"
                      >
                        {copiedJustif ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copiar</span>
                      </button>
                    )}
                  </div>
                </div>

                <textarea
                  rows={5}
                  placeholder="Justificativa clínica técnica detalhando indicação médica, antecedentes e necessidade hospitalar..."
                  value={justificativa}
                  onChange={e => setJustificativa(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-cyan-500 focus:bg-white leading-relaxed"
                />
              </div>

              {observacoes && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 font-medium">
                  <strong>Observação de Auditoria:</strong> {observacoes}
                </div>
              )}
            </div>
          </div>

          {/* Saved Drafts History */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                  Rascunhos Salvos
                </span>
                <h3 className="text-base font-black text-slate-900 m-0">
                  Histórico Local ({savedGuias.length})
                </h3>
              </div>
            </div>

            {savedGuias.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-1">
                <Clock className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-medium m-0">Nenhum rascunho salvo.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {savedGuias.map((g) => (
                  <div
                    key={g.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-cyan-400 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                          {g.patientName}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {g.convenio} • {new Date(g.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteDraft(g.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Excluir rascunho"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-700 font-medium m-0 truncate">
                      {g.procedimentos[0]?.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleLoadDraft(g)}
                      className="w-full py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-900 text-[11px] font-bold rounded-lg transition-colors"
                    >
                      Carregar Formulário
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
