import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  KeyRound, 
  ExternalLink, 
  Phone, 
  Copy, 
  Check, 
  AlertTriangle, 
  HelpCircle, 
  Send, 
  Bot, 
  User, 
  Stethoscope,
  Building2,
  Ambulance,
  FileCheck2
} from 'lucide-react';
import { CONVENIOS_MASTER_LIST } from '../data/popsData';
import { ConvenioPop } from '../types';

interface SmartRuleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultConvenioId?: string;
  onNavigateToConvenio?: (mode: 'pops-ps' | 'pops-internacao', convenioId: string) => void;
}

export const SmartRuleDrawer: React.FC<SmartRuleDrawerProps> = ({
  isOpen,
  onClose,
  defaultConvenioId = 'AMIL',
  onNavigateToConvenio
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultConvenioId || 'AMIL');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // AI Assistant Chat State inside Drawer
  const [question, setQuestion] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Olá! Sou o assistente de regras rápidas dos POPs. Escolha o convênio acima para ver o Raio-X completo instantâneo ou digite sua dúvida operacional abaixo.'
    }
  ]);
  const [isAskingAi, setIsAskingAi] = useState<boolean>(false);

  const activePlan: ConvenioPop | undefined = useMemo(() => {
    return CONVENIOS_MASTER_LIST.find(p => p.id === selectedPlanId) || CONVENIOS_MASTER_LIST[0];
  }, [selectedPlanId]);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleAskQuestion = async (textToSend?: string) => {
    const query = (textToSend || question).trim();
    if (!query || isAskingAi) return;

    const userMsg = { role: 'user' as const, text: query };
    setChatHistory(prev => [...prev, userMsg]);
    setQuestion('');
    setIsAskingAi(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          contextConvenio: activePlan?.name || selectedPlanId,
          contextSection: 'SmartRuleDrawer'
        })
      });

      if (!res.ok) {
        throw new Error('Falha na resposta da IA');
      }

      const data = await res.json();
      setChatHistory(prev => [
        ...prev,
        { role: 'assistant', text: data.answer || 'Resposta concluída.' }
      ]);
    } catch (err: any) {
      // Fallback answers based on local data if offline or API key missing
      let fallback = 'Consulta das diretrizes hospitalares:\n';
      if (query.toLowerCase().includes('token')) {
        fallback += `Para o convênio ${activePlan?.name}: verificar no aplicativo do beneficiário a validação biométrica/token. Em caso de falha, acionar a central do convênio.`;
      } else if (query.toLowerCase().includes('contraste')) {
        fallback += 'Exames com contraste exigem formulário próprio assinado pelo paciente/responsável e acréscimo de R$ 250,00.';
      } else {
        fallback += `Para ${activePlan?.name}: Pacote de Consulta PS: ${activePlan?.pacotePs}. Exames no PS: ${activePlan?.labUrgencia}. Alertas: ${activePlan?.criticalNotes?.slice(0, 2).join(' ')}`;
      }

      setChatHistory(prev => [
        ...prev,
        { role: 'assistant', text: fallback }
      ]);
    } finally {
      setIsAskingAi(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col overflow-hidden border-l border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-950 via-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600/80 border border-teal-400/40 flex items-center justify-center font-bold text-amber-300 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-white m-0">
                Raio-X Rápido & Regras do Convênio
              </h3>
              <p className="text-[11px] text-teal-200/80 m-0">
                Consulte autorizações, tokens, acessos e tire dúvidas instantâneas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-teal-200 hover:text-white hover:bg-teal-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Selector Strip */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider whitespace-nowrap pl-1">
            Plano:
          </span>
          <select
            value={selectedPlanId}
            onChange={e => setSelectedPlanId(e.target.value)}
            aria-label="Selecione o Convênio"
            className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-600 cursor-pointer"
          >
            {CONVENIOS_MASTER_LIST.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.category})
              </option>
            ))}
          </select>

          {onNavigateToConvenio && activePlan && (
            <div className="flex items-center gap-1.5 ml-auto whitespace-nowrap">
              <button
                type="button"
                onClick={() => {
                  onNavigateToConvenio('pops-ps', activePlan.id);
                  onClose();
                }}
                className="px-2.5 py-1 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[11px] font-bold cursor-pointer transition-colors"
              >
                Abrir no PS
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigateToConvenio('pops-internacao', activePlan.id);
                  onClose();
                }}
                className="px-2.5 py-1 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-[11px] font-bold cursor-pointer transition-colors"
              >
                Internação
              </button>
            </div>
          )}
        </div>

        {/* Drawer Body - Tabs or Split view */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {activePlan && (
            <>
              {/* Snapshot Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Token Box */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <KeyRound className="w-4 h-4 text-teal-700" />
                    <span>Validação & Token</span>
                  </div>
                  <p className="text-xs text-slate-900 font-medium m-0 leading-relaxed">
                    {activePlan.criticalNotes?.some(n => n.toLowerCase().includes('token'))
                      ? '⚠️ EXIGE TOKEN: Solicitar token do aplicativo com o beneficiário.'
                      : '✅ Não exige token obrigatório ou segue consulta de elegibilidade.'}
                  </p>
                </div>

                {/* Exames no PS */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Stethoscope className="w-4 h-4 text-emerald-700" />
                    <span>Exames no PS</span>
                  </div>
                  <p className="text-xs text-slate-900 font-medium m-0 leading-relaxed">
                    <strong className="text-teal-900">{activePlan.labUrgencia}</strong> • {activePlan.imagemUrgencia}
                  </p>
                </div>
              </div>

              {/* Pacote de Consulta PS */}
              <div className="p-3 rounded-xl border border-teal-200 bg-teal-50/50 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider block">
                    Pacote de Consulta Pronto-Socorro
                  </span>
                  <span className="text-xs font-black text-teal-950">
                    {activePlan.pacotePs}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(activePlan.pacotePs, 'pct-ps')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-teal-300 text-teal-800 text-xs font-bold hover:bg-teal-100 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'pct-ps' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar</span>
                </button>
              </div>

              {/* Critical Notes */}
              {activePlan.criticalNotes && activePlan.criticalNotes.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Alertas Críticos para Evitar Glosas
                  </span>
                  <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-3 space-y-1 text-xs text-rose-950">
                    {activePlan.criticalNotes.map((note, idx) => (
                      <p key={idx} className="m-0 leading-relaxed font-medium">
                        • {note}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Portal & Credentials */}
              {activePlan.accessCredentials && activePlan.accessCredentials.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                    Acesso ao Portal do Prestador
                  </span>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 divide-y divide-slate-200/80">
                    {activePlan.portalUrl && (
                      <div className="pb-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Link do Portal:</span>
                        <a
                          href={activePlan.portalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 hover:underline"
                        >
                          Acessar site credenciado
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {activePlan.accessCredentials.slice(0, 4).map(([label, val], idx) => (
                      <div key={idx} className="py-1.5 flex items-center justify-between gap-2 text-xs">
                        <span className="text-slate-500 font-medium">{label}:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {val}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyText(val, `cred-${idx}`)}
                            className="p-1 rounded hover:bg-slate-200 text-slate-500 cursor-pointer"
                            title="Copiar credencial"
                          >
                            {copiedKey === `cred-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contacts */}
              {activePlan.contacts && activePlan.contacts.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                    Telefones e Canais de Atendimento
                  </span>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1 text-xs text-slate-800">
                    {activePlan.contacts.map((contact, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2">
                        <span className="truncate">{contact}</span>
                        <button
                          type="button"
                          onClick={() => copyText(contact, `cont-${idx}`)}
                          className="p-1 rounded hover:bg-slate-200 text-slate-500 flex-shrink-0 cursor-pointer"
                          title="Copiar contato"
                        >
                          {copiedKey === `cont-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Chat Mini Section */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-teal-600" />
                Assistente de Dúvidas Rápidas
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Gemini 3.7 Powered</span>
            </div>

            {/* Chat Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2.5">
              {chatHistory.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex gap-2 text-xs ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-md bg-teal-700 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div 
                    className={`p-2.5 rounded-xl max-w-[85%] whitespace-pre-wrap leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-teal-700 text-white font-medium' 
                        : 'bg-white border border-slate-200 text-slate-800 shadow-2xs font-normal'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAskingAi && (
                <div className="flex gap-2 items-center text-xs text-teal-700">
                  <div className="w-4 h-4 border-2 border-teal-700 border-t-transparent rounded-full animate-spin" />
                  <span>Consultando inteligência clínica dos POPs...</span>
                </div>
              )}
            </div>

            {/* Fast suggestions */}
            <div className="flex flex-wrap gap-1.5">
              {[
                `Como funciona o token no ${activePlan?.name || 'plano'}?`,
                `Tomografia com contraste no ${activePlan?.name || 'plano'}`,
                'Documentos para Internação'
              ].map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAskQuestion(sug)}
                  className="text-[11px] font-medium px-2 py-1 rounded-md bg-slate-100 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 text-slate-600 transition-colors cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Input field */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAskQuestion()}
                placeholder={`Perguntar regra sobre ${activePlan?.name || 'convênio'}...`}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-600"
              />
              <button
                type="button"
                onClick={() => handleAskQuestion()}
                disabled={isAskingAi || !question.trim()}
                className="p-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Hospital Palmas Medical • Autorizações</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold text-xs transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
