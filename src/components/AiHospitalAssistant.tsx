import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  FileCheck, 
  Layers, 
  Copy, 
  Check, 
  RefreshCw,
  HelpCircle,
  Stethoscope,
  Info
} from 'lucide-react';
import { CONVENIOS_MASTER_LIST } from '../data/popsData';
import { AuditResult } from '../types';

interface AiHospitalAssistantProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const AiHospitalAssistant: React.FC<AiHospitalAssistantProps> = ({
  initialPrompt,
  onClearInitialPrompt
}) => {
  const [activeTab, setActiveTab] = useState<'copilot' | 'auditor'>('copilot');

  // Copilot State
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; time: string }[]>([
    {
      role: 'assistant',
      text: 'Olá! Sou o **Copilot de Autorizações & POPs Hospitalares** do Hospital Palmas Medical. Como posso ajudar na auditoria, códigos TUSS, regras de convênios ou processos de internação hoje?',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [selectedConvenioContext, setSelectedConvenioContext] = useState<string>('SERVIR');
  const [isLoadingCopilot, setIsLoadingCopilot] = useState<boolean>(false);

  // Auditor State
  const [auditConvenio, setAuditConvenio] = useState<string>('SERVIR');
  const [auditTipo, setAuditTipo] = useState<string>('Pronto-Socorro');
  const [auditCarater, setAuditCarater] = useState<string>('Urgência');
  const [auditPedidoTexto, setAuditPedidoTexto] = useState<string>('');
  const [auditCodigos, setAuditCodigos] = useState<string>('');
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isLoadingAudit, setIsLoadingAudit] = useState<boolean>(false);
  const [copiedAudit, setCopiedAudit] = useState<boolean>(false);

  // Quick prompt suggestions
  const promptSuggestions = [
    'Como autorizar Colonoscopia com Polipectomia no SERVIR?',
    'Regras de Tomografia e Ressonância de Urgência no BRADESCO',
    'Passo a passo de elegibilidade e Token no AMIL',
    'Regras de Diária de UTI e Intensivista no CASSI',
    'Autorização de OPME na Urgência vs Eletivo'
  ];

  // Auto-send if initial prompt is set
  React.useEffect(() => {
    if (initialPrompt) {
      setInputQuestion(initialPrompt);
      setActiveTab('copilot');
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const handleSendCopilot = async (overridePrompt?: string) => {
    const q = (overridePrompt || inputQuestion).trim();
    if (!q || isLoadingCopilot) return;

    const userMsg = {
      role: 'user' as const,
      text: q,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoadingCopilot(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          contextConvenio: selectedConvenioContext,
          contextSection: 'Geral'
        })
      });

      const data = await res.json();
      const replyText = data.answer || data.fallbackAnswer || 'Não foi possível obter resposta no momento.';

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: replyText,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'Ocorreu um erro de comunicação com o servidor de IA. Verifique as configurações de rede e tente novamente.',
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoadingCopilot(false);
    }
  };

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditPedidoTexto.trim() || isLoadingAudit) return;

    setIsLoadingAudit(true);
    setAuditResult(null);

    try {
      const codigosList = auditCodigos
        .split(/[,;\n]/)
        .map(s => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/ai/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          convenio: auditConvenio,
          tipoAtendimento: auditTipo,
          carater: auditCarater,
          pedidoTexto: auditPedidoTexto,
          codigosInformados: codigosList
        })
      });

      const data = await res.json();
      if (data.audit) {
        setAuditResult(data.audit);
      } else {
        alert('Erro ao processar auditoria.');
      }
    } catch (err) {
      alert('Erro de conexão ao auditar pedido.');
    } finally {
      setIsLoadingAudit(false);
    }
  };

  const copyAuditSummary = () => {
    if (!auditResult) return;
    const text = `AUDITORIA PREVENTIVA DE AUTORIZAÇÃO - HOSPITAL PALMAS MEDICAL
Convênio: ${auditConvenio} | Tipo: ${auditTipo} (${auditCarater})
Status: ${auditResult.statusConformidade} (Risco: ${auditResult.pontuacaoRisco}%)
Resumo: ${auditResult.resumoExecutivo}

Alertas Críticos:
${auditResult.alertasCriticos.map(a => `- ${a}`).join('\n')}

Códigos Sugeridos:
${auditResult.codigosSugeridos.map(c => `- ${c.codigo}: ${c.descricao} (${c.motivo})`).join('\n')}

Documentos Obrigatórios:
${auditResult.documentosExigidos.map(d => `- ${d}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedAudit(true);
    setTimeout(() => setCopiedAudit(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#095962] via-[#0E7B86] to-[#095962] border border-[#0E7B86]/40 rounded-2xl p-5 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase tracking-widest text-[#EBF7F8] bg-white/15 border border-white/20 px-3 py-0.5 rounded-full">
              Inteligência Artificial Hospitalar
            </span>
            <span className="text-xs text-white/80 font-medium">Hospital Palmas Medical</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white m-0">
            Auditor Preventivo & Copilot de POPs
          </h2>
          <p className="text-xs text-white/90 max-w-xl leading-relaxed m-0">
            Valide pedidos médicos em tempo real, previna glosas, encontre códigos TUSS correlacionados e esclareça dúvidas operacionais instantaneamente.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex items-center gap-1.5 bg-[#07474e] p-1.5 rounded-xl border border-white/15">
          <button
            type="button"
            onClick={() => setActiveTab('copilot')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'copilot'
                ? 'bg-white text-[#095962] shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Copilot de Dúvidas</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('auditor')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'auditor'
                ? 'bg-white text-[#095962] shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Auditor de Pedido</span>
          </button>
        </div>
      </div>

      {/* COPILOT TAB */}
      {activeTab === 'copilot' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Quick Context & Prompts Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                Convênio em Foco
              </span>
              <select
                value={selectedConvenioContext}
                onChange={e => setSelectedConvenioContext(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500"
              >
                <option value="SERVIR">SERVIR (Plano de Saúde TO)</option>
                {CONVENIOS_MASTER_LIST.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Perguntas Frequentes</span>
              </div>
              <div className="space-y-1.5">
                {promptSuggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendCopilot(sug)}
                    className="w-full text-left text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-amber-50/80 border border-slate-200 hover:border-amber-300 p-2.5 rounded-xl transition-all leading-snug"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[600px] overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={idx}
                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold flex-shrink-0 mt-0.5 shadow-sm">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                        isUser
                          ? 'bg-teal-700 text-white rounded-tr-none shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-1.5 mb-1.5 text-[10px] opacity-75">
                        <span className="font-bold">{isUser ? 'Operador Hospitalar' : 'Copilot Palmas Medical (Gemini)'}</span>
                        <span>{msg.time}</span>
                      </div>
                      <div className="whitespace-pre-wrap font-sans">
                        {msg.text}
                      </div>
                    </div>
                    {isUser && (
                      <div className="w-8 h-8 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold flex-shrink-0 mt-0.5 shadow-sm">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoadingCopilot && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold flex-shrink-0 animate-pulse">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 rounded-tl-none flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                    <span>Analisando diretrizes institucionais e regulamentos do convênio...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendCopilot();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Digite sua dúvida sobre autorizações, códigos TUSS, regras de carência..."
                  value={inputQuestion}
                  onChange={e => setInputQuestion(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={!inputQuestion.trim() || isLoadingCopilot}
                  className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-2 transition-all"
                >
                  <span>Enviar</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* AUDITOR TAB */}
      {activeTab === 'auditor' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Order Input Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-700">
                Auditoria Preventiva de Autorização
              </span>
              <h3 className="text-base font-black text-slate-900 m-0">
                Dados do Pedido Médico & Paciente
              </h3>
            </div>

            <form onSubmit={handleRunAudit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">Convênio</label>
                  <select
                    value={auditConvenio}
                    onChange={e => setAuditConvenio(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="SERVIR">SERVIR (Plano TO)</option>
                    {CONVENIOS_MASTER_LIST.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">Atendimento</label>
                  <select
                    value={auditTipo}
                    onChange={e => setAuditTipo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Pronto-Socorro">Pronto-Socorro</option>
                    <option value="Internação Clínica">Internação Clínica</option>
                    <option value="Internação Cirúrgica">Internação Cirúrgica</option>
                    <option value="UTI">UTI Adulto / Neo</option>
                    <option value="SADT / Exames">SADT / Ambulatorial</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">Caráter</label>
                  <select
                    value={auditCarater}
                    onChange={e => setAuditCarater(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Urgência">Urgência / Emergência</option>
                    <option value="Eletivo">Eletivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">
                  Texto do Pedido Médico / Hipótese Diagnóstica / Queixa *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ex.: Solicito Tomografia de Crânio com contraste para paciente com cefaleia súbita e rebaixamento de nível de consciência. CID: R51."
                  value={auditPedidoTexto}
                  onChange={e => setAuditPedidoTexto(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase">
                  Códigos TUSS já digitados pelo operador (separados por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="Ex.: 41001079, 10101012"
                  value={auditCodigos}
                  onChange={e => setAuditCodigos(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoadingAudit || !auditPedidoTexto.trim()}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoadingAudit ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Auditando com Inteligência Artificial...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Executar Auditoria Preventiva</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Audit Results Panel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                  Resultado da Análise
                </span>
                <h3 className="text-base font-black text-slate-900 m-0">
                  Parecer Técnico de Auditoria
                </h3>
              </div>

              {auditResult && (
                <button
                  type="button"
                  onClick={copyAuditSummary}
                  className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  {copiedAudit ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAudit ? 'Copiado' : 'Copiar Parecer'}</span>
                </button>
              )}
            </div>

            {!auditResult && !isLoadingAudit && (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <Stethoscope className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-medium max-w-xs mx-auto m-0">
                  Preencha os dados do pedido ao lado e clique em Executar Auditoria Preventiva para validar regras e evitar glosas.
                </p>
              </div>
            )}

            {isLoadingAudit && (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 mx-auto text-amber-500 animate-spin" />
                <p className="text-xs font-bold text-slate-700 m-0">
                  Verificando tabelas TUSS, regras de contraste, exigências de token e histórico de glosas...
                </p>
              </div>
            )}

            {auditResult && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Status & Risk score */}
                <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border bg-slate-50">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                      Status de Conformidade
                    </span>
                    <span className={`text-base font-black ${
                      auditResult.statusConformidade === 'Aprovado'
                        ? 'text-emerald-700'
                        : (auditResult.statusConformidade === 'Alerta' ? 'text-amber-700' : 'text-rose-700')
                    }`}>
                      {auditResult.statusConformidade}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                      Risco de Glosa
                    </span>
                    <span className="text-base font-black text-slate-900">
                      {auditResult.pontuacaoRisco}%
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-800 leading-relaxed font-medium">
                  {auditResult.resumoExecutivo}
                </div>

                {/* Critical Alerts */}
                {auditResult.alertasCriticos.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-extrabold uppercase text-rose-700 block">
                      Alertas Críticos / Pontos de Glosa:
                    </span>
                    {auditResult.alertasCriticos.map((al, idx) => (
                      <div key={idx} className="bg-rose-50 border border-rose-200 text-rose-950 p-2.5 rounded-lg text-xs font-semibold flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        <span>{al}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Codes */}
                {auditResult.codigosSugeridos.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-extrabold uppercase text-teal-800 block">
                      Códigos TUSS Correlacionados Obrigatórios:
                    </span>
                    <div className="space-y-1.5">
                      {auditResult.codigosSugeridos.map((cod, idx) => (
                        <div key={idx} className="bg-teal-50 border border-teal-200 p-2.5 rounded-lg text-xs flex items-start justify-between gap-2">
                          <div>
                            <span className="font-mono font-black text-teal-900 bg-teal-200/80 px-1.5 py-0.5 rounded text-[11px]">
                              {cod.codigo}
                            </span>
                            <span className="font-bold text-slate-900 ml-1.5">{cod.descricao}</span>
                            <p className="text-[11px] text-slate-600 m-0 mt-0.5">{cod.motivo}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Required Documents */}
                {auditResult.documentosExigidos.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold uppercase text-slate-600 block">
                      Documentação & Anexos Necessários:
                    </span>
                    <ul className="list-disc pl-5 space-y-0.5 text-xs text-slate-700 font-medium">
                      {auditResult.documentosExigidos.map((doc, idx) => (
                        <li key={idx}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Operator Instructions */}
                {auditResult.orientacaoOperador && (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-950 font-medium leading-relaxed">
                    <strong>Passo a passo no sistema:</strong> {auditResult.orientacaoOperador}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
