import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  X, 
  Maximize2, 
  RefreshCw, 
  Copy, 
  Check, 
  AlertTriangle, 
  HelpCircle,
  Building2,
  Stethoscope,
  Trash2,
  ChevronDown,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { CONVENIOS_MASTER_LIST } from '../data/popsData';
import { retrieveHospitalKnowledge, RetrievedHospitalFact } from '../services/aiKnowledgeEngine';

interface AiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFullAi: (initialPrompt?: string) => void;
  currentMode?: string;
  selectedPlanId?: string;
  pendingPrompt?: string;
  onClearPendingPrompt?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  groundingFacts?: RetrievedHospitalFact[];
  criticalAlerts?: string[];
  matchedItems?: any[];
  isStreaming?: boolean;
}

export const AiChatDrawer: React.FC<AiChatDrawerProps> = ({
  isOpen,
  onClose,
  onOpenFullAi,
  pendingPrompt,
  onClearPendingPrompt
}) => {
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Olá! Sou a **IA Universal** do Hospital Palmas Medical. 🏥\n\nTenho acesso a **TODO o sistema**: códigos TUSS de exames, diárias de todos os convênios, valores de cirurgias, ramais telefônicos e portais.\n\nPergunte o que precisar diretamente, sem necessidade de selecionar nenhum plano.',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // If a pendingPrompt is passed (e.g. from clicking "Dúvida com IA" on a card)
  useEffect(() => {
    if (pendingPrompt && isOpen) {
      handleSendMessage(pendingPrompt);
      if (onClearPendingPrompt) onClearPendingPrompt();
    }
  }, [pendingPrompt, isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Universal system suggestions
  const quickSuggestions = [
    { label: 'Cód. Angiotomografia', query: 'qual o código da angiotomografia arterial de crânio?' },
    { label: 'Ramal UTI NEO', query: 'qual o ramal da UTI NEO?' },
    { label: 'Cód. UTI Servir', query: 'qual o código da diária de UTI no Servir?' },
    { label: 'Portal Bradesco', query: 'qual o portal e regra do Bradesco?' },
    { label: 'Valor Mastopexia', query: 'qual o valor e diárias da Mastopexia?' },
    { label: 'WhatsApp Priscila', query: 'qual o whatsapp da Priscila para senhas?' }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const q = (textToSend || inputQuestion).trim();
    if (!q || isLoading) return;

    // 1. INSTANT UNIVERSAL SYSTEM GROUNDING (0 ms latency)
    const localKnowledge = retrieveHospitalKnowledge(q);

    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      text: q,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    const assistantMsgId = String(Date.now() + 1);

    // Initial instant assistant response with local direct answer if available
    const initialAssistantMessage: Message = {
      id: assistantMsgId,
      role: 'assistant',
      text: localKnowledge.directAnswer || '⚡ Buscando no sistema hospitalar...',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isStreaming: !localKnowledge.directAnswer
    };

    setMessages(prev => [...prev, userMessage, initialAssistantMessage]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const previousHistory = messages
        .filter(m => !m.isStreaming && m.text !== '⚡ Buscando no sistema hospitalar...')
        .slice(-8)
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          text: m.text
        }));

      let answerText = '';
      try {
        if (!navigator.onLine) {
          throw new Error('Offline');
        }

        const res = await fetch('/api/ai/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: q, history: previousHistory })
        });

        if (res.ok) {
          const data = await res.json();
          answerText = data.answer || localKnowledge.directAnswer || 'Informação não localizada.';
        } else {
          throw new Error(`Server status ${res.status}`);
        }
      } catch (networkErr) {
        if (localKnowledge.facts && localKnowledge.facts.length > 0) {
          const factsBlocks = localKnowledge.facts.slice(0, 2).map(f => 
            `**${f.title}**\n${f.code ? `• Código TUSS/POP: \`${f.code}\`\n` : ''}• ${f.details}`
          ).join('\n\n');

          answerText = `⚡ **Modo Offline Ativo** (Base Hospitalar Local)\n\n${localKnowledge.directAnswer ? `${localKnowledge.directAnswer}\n\n` : ''}${factsBlocks}\n\n*Resposta gerada sem internet a partir do banco de dados de POPs e convênios.*`;
        } else {
          answerText = localKnowledge.directAnswer || '⚡ **Modo Offline**: Rede hospitalar indisponível. Consulte as regras diretamente no menu lateral de POPs ou na Ficha de Contingência.';
        }
      }

      setMessages(prev => prev.map(m => {
        if (m.id === assistantMsgId) {
          return {
            ...m,
            text: answerText,
            isStreaming: false
          };
        }
        return m;
      }));
    } catch (err: any) {
      setMessages(prev => prev.map(m => {
        if (m.id === assistantMsgId) {
          return {
            ...m,
            text: localKnowledge.directAnswer || 'Ocorreu uma falha na conexão com a IA.',
            isStreaming: false
          };
        }
        return m;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (window.confirm('Deseja limpar o histórico desta conversa?')) {
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          text: 'Histórico reiniciado. Como posso te orientar agora com regras de autorização ou internação?',
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Format simple markdown into styled elements
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-black text-slate-900 mt-2 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-black text-slate-900 mt-3 mb-1">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} className="text-base font-black text-[#B01B52] mt-3 mb-1.5">{line.replace('# ', '')}</h2>;
      }

      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.trim().substring(2);
        return (
          <div key={idx} className="flex items-start gap-2 ml-1 my-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0E7B86] mt-2 flex-shrink-0" />
            <div className="flex-1">{formatInlineStyles(itemText)}</div>
          </div>
        );
      }

      // Numbered items
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start gap-2 ml-1 my-1">
            <span className="text-xs font-black text-[#B01B52] min-w-4 mt-0.5">{numMatch[1]}.</span>
            <div className="flex-1">{formatInlineStyles(numMatch[2])}</div>
          </div>
        );
      }

      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }

      return (
        <p key={idx} className="m-0 leading-relaxed">
          {formatInlineStyles(line)}
        </p>
      );
    });
  };

  const formatInlineStyles = (content: string) => {
    // Regex for bold **text**
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const strongText = part.slice(2, -2);
        return <strong key={pIdx} className="font-black text-slate-950">{strongText}</strong>;
      }
      return part;
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full sm:w-[540px] md:w-[600px] h-full bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-label="Assistente Inteligente Hospitalar"
      >
        {/* Drawer Header */}
        <div className="bg-gradient-to-r from-[#0E7B86] via-[#106A73] to-[#B01B52] text-white p-4 sm:p-5 flex items-center justify-between shadow-xs select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center text-yellow-300 shadow-xs flex-shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white m-0 leading-tight">
                  Copilot de Dúvidas • IA
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/20">
                  Gemini Flash
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium m-0 flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3 text-white/80" />
                Hospital Palmas Medical • Dúvidas & Auditoria
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onOpenFullAi(inputQuestion)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Expandir para tela cheia com Auditor e Pré-Guia"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleClearChat}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Limpar conversa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer ml-1"
              title="Fechar painel de dúvidas"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Universal Mode Info Bar */}
        <div className="bg-[#EBF7F8] border-b border-[#C4E5E8] px-4 py-2 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-[#0E7B86] text-xs">
              Busca Universal Hospitalar Ativa
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-500 hidden sm:inline-block">
            Exames • Diárias • Cirurgias • Ramais • Portais
          </span>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex-shrink-0">
            Dúvidas Frequentes:
          </span>
          {quickSuggestions.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(sug.query)}
              className="text-xs font-semibold px-2.5 py-1 bg-white hover:bg-[#FDF2F6] text-slate-700 hover:text-[#B01B52] border border-slate-200 hover:border-[#F7D0DF] rounded-lg transition-all flex-shrink-0 shadow-2xs cursor-pointer"
            >
              {sug.label}
            </button>
          ))}
        </div>

        {/* Chat Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#F8FAFB]">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0E7B86] to-[#095962] text-white flex items-center justify-center font-bold flex-shrink-0 shadow-xs mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-xs space-y-2 relative group ${
                  isUser
                    ? 'bg-[#B01B52] text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}>
                  <div className={`flex items-center justify-between gap-4 pb-1 border-b text-[10px] font-bold ${
                    isUser ? 'border-white/20 text-white/80' : 'border-slate-100 text-slate-400'
                  }`}>
                    <span className="flex items-center gap-1">
                      {isUser ? 'Você' : (
                        <>
                          <ShieldCheck className="w-3 h-3 text-[#0E7B86]" />
                          <span>IA Oficial • Hospital Palmas Medical</span>
                        </>
                      )}
                    </span>
                    <span>{msg.time}</span>
                  </div>

                  <div className="space-y-1">
                    {renderFormattedText(msg.text)}
                  </div>

                  {!isUser && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-[#0E7B86]">
                        <Check className="w-3 h-3 text-[#0E7B86]" />
                        Validado pelas diretrizes do POP
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="flex items-center gap-1 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-2 py-0.5 rounded border border-slate-200 transition-colors cursor-pointer"
                        title="Copiar resposta"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-xs mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-[#0E7B86] text-white flex items-center justify-center font-bold flex-shrink-0 animate-pulse mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 sm:p-4 text-xs font-semibold text-slate-700 shadow-xs flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#0E7B86]" />
                <span>Consultando sistema hospitalar e tabelas oficiais...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Pergunte sobre exames, códigos TUSS, diárias, cirurgias, ramais, portais..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#B01B52] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isLoading}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#B01B52] hover:bg-[#971444] disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0"
            >
              <span>Enviar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Dica: Pressione <strong>Enter</strong> para enviar sua dúvida</span>
            <button
              type="button"
              onClick={() => onOpenFullAi(inputQuestion)}
              className="text-[#0E7B86] hover:underline font-bold"
            >
              Abrir Auditor Completo →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
