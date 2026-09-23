import React, { useState, useMemo } from 'react';
import { 
  KeyRound, 
  ExternalLink, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Search, 
  AlertTriangle, 
  Building2, 
  ShieldAlert, 
  Clock, 
  Phone, 
  Mail, 
  Printer, 
  Info,
  CheckCircle2,
  Sparkles,
  Lock,
  Layers
} from 'lucide-react';
import { PORTAIS_CREDENCIAIS, PORTAIS_RULES, PortalCredential } from '../data/portaisData';

export const PortaisSenhasViewer: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<'Todos' | 'Medical' | 'Santa Thereza'>('Todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [revealedPasswords, setRevealedPasswords] = useState<{ [id: string]: boolean }>({});
  const [copiedItem, setCopiedItem] = useState<{ id: string; field: 'login' | 'senha' } | null>(null);

  const toggleReveal = (id: string) => {
    setRevealedPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopy = (id: string, field: 'login' | 'senha', text: string) => {
    if (!text || text === 'Verificar no portal' || text.includes('Não se aplica')) return;
    navigator.clipboard.writeText(text);
    setCopiedItem({ id, field });
    setTimeout(() => {
      setCopiedItem(null);
    }, 2000);
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    PORTAIS_CREDENCIAIS.forEach(item => set.add(item.category));
    return ['Todos', ...Array.from(set)];
  }, []);

  const filteredCredentials = useMemo(() => {
    return PORTAIS_CREDENCIAIS.filter(item => {
      // Filter by Hospital
      if (selectedHospital !== 'Todos') {
        if (item.hospital !== 'Ambos' && item.hospital !== selectedHospital) {
          return false;
        }
      }

      // Filter by Category
      if (selectedCategory !== 'Todos' && item.category !== selectedCategory) {
        return false;
      }

      // Search term
      if (search.trim()) {
        const q = search.toLowerCase();
        const inConvenio = item.convenio.toLowerCase().includes(q);
        const inLogin = item.login.toLowerCase().includes(q);
        const inSite = item.siteName.toLowerCase().includes(q);
        const inNotes = item.notes ? item.notes.toLowerCase().includes(q) : false;
        const inResp = item.responsavel ? item.responsavel.toLowerCase().includes(q) : false;
        return inConvenio || inLogin || inSite || inNotes || inResp;
      }

      return true;
    });
  }, [search, selectedHospital, selectedCategory]);

  const medicalCount = PORTAIS_CREDENCIAIS.filter(c => c.hospital === 'Medical' || c.hospital === 'Ambos').length;
  const santaTherezaCount = PORTAIS_CREDENCIAIS.filter(c => c.hospital === 'Santa Thereza' || c.hospital === 'Ambos').length;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8] flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" />
                Segurança &amp; Acessos
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                Hospital Palmas Medical &amp; Santa Thereza
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight m-0">
              Portais, Usuários e Senhas de Convênios
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium m-0">
              Controle centralizado de links de autorização, credenciais operacionais e responsáveis de cada operadora.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`https://wa.me/${PORTAIS_RULES.whatsappPriscilaRaw}?text=Ol%C3%A1%20Priscila,%20preciso%20informar%20uma%20troca%20de%20senha%20de%20portal%20de%20conv%C3%AAnio.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              WhatsApp Priscila (Troca de Senhas)
            </a>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300/80 shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir Tabela
            </button>
          </div>
        </div>
      </div>

      {/* Destaque Obrigatório: Observação Bradesco Internação vs Bradesco Pronto-Socorro vs OPMEs */}
      <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-emerald-50 border-2 border-[#B01B52]/40 rounded-2xl p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#B01B52] text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#B01B52] text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                Observação Crítica Operacional • Convênio Bradesco
              </span>
              <span className="text-xs font-semibold text-slate-600">
                Atenção ao escolher o portal correto conforme o setor de atendimento
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-800 font-medium m-0 leading-relaxed">
              O portal <strong>BRADESCO INTERNAÇÃO</strong> é diferente do portal do <strong>BRADESCO PRONTO-SOCORRO</strong> e das <strong>OPMEs</strong>:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="bg-white/90 border border-rose-200 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[11px] font-black text-rose-800 uppercase tracking-wider">
                      1. Internação Clínica &amp; UTI
                    </span>
                    <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded text-[10px] font-bold">Oficial</span>
                  </div>
                  <strong className="text-xs text-slate-900 block font-bold">Portal Bradesco Seguros</strong>
                  <p className="text-[11px] text-slate-600 mt-1 m-0">
                    Acesso exclusivo para internações. Login CPF + CNPJ e senha pessoal.
                  </p>
                </div>
                <a
                  href="https://www.bradescoseguros.com.br/clientes/produtos/plano-saude"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center justify-center gap-1 w-full py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-[11px] font-bold transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Abrir Bradesco Seguros ↗
                </a>
              </div>

              <div className="bg-white/90 border border-emerald-200 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider">
                      2. Pronto-Socorro Urgência
                    </span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">Orizon</span>
                  </div>
                  <strong className="text-xs text-slate-900 block font-bold">Portal Orizon / Polimed</strong>
                  <p className="text-[11px] text-slate-600 mt-1 m-0">
                    Atendimento de PS Bradesco é feito no autenticador Orizon com login pessoal.
                  </p>
                </div>
                <a
                  href="https://www.polimed.com.br/autenticadorOrizon/loginAutenticador"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center justify-center gap-1 w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Abrir Orizon PS ↗
                </a>
              </div>

              <div className="bg-white/90 border border-amber-200 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[11px] font-black text-amber-800 uppercase tracking-wider">
                      3. OPMEs &amp; Materiais
                    </span>
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">Insumos</span>
                  </div>
                  <strong className="text-xs text-slate-900 block font-bold">Gestão de Insumos Orizon</strong>
                  <p className="text-[11px] text-slate-600 mt-1 m-0">
                    Login: <code className="bg-amber-100 px-1 rounded text-amber-900 font-bold">lucas.ribeiro</code> • Senha: <code className="bg-amber-100 px-1 rounded text-amber-900 font-bold">Med@2025</code>
                  </p>
                </div>
                <a
                  href="https://gestaodeinsumos.orizon.com.br/#/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center justify-center gap-1 w-full py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-[11px] font-bold transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Abrir Gestão Insumos ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Destaque Operacional CASSI: Portal Orizon no PS e na Internação */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-2 border-[#0E7B86]/40 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0E7B86] text-white flex items-center justify-center flex-shrink-0 shadow-2xs font-bold mt-0.5 sm:mt-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#0E7B86] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                  Regra Operacional • CASSI
                </span>
                <span className="text-xs font-bold text-teal-900">
                  Portal ORIZON / Polimed (Pronto-Socorro &amp; Internação)
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1 m-0">
                O portal oficial de autorizações da <strong>CASSI</strong> é o <strong>ORIZON</strong>, tanto no <strong>Pronto-Socorro</strong> quanto na <strong>Internação</strong>. Código Prestador: <strong>2120820</strong> • Login: <strong>12955953000192</strong> • Senha: <code className="bg-white/80 px-1 py-0.5 rounded font-mono font-bold text-slate-800 border border-teal-200">Hpm2025hpm@</code>
              </p>
            </div>
          </div>
          <a
            href="https://www.polimed.com.br/autenticadorOrizon/loginAutenticador"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#0E7B86] hover:bg-[#095962] text-white rounded-xl text-xs font-bold transition-colors flex-shrink-0 shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Abrir Orizon (CASSI) ↗
          </a>
        </div>
      </div>

      {/* Regras e Recomendações da Equipe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-bold">
            <Phone className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <strong className="text-slate-900 block font-bold">Troca de Senha Obrigatória</strong>
            <p className="text-slate-600 m-0">
              Qualquer alteração de senha deve ser comunicada no WhatsApp da Priscila <strong>(63) 98454-5316</strong> para atualização da planilha.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-[#EBF7F8] text-[#0E7B86] flex items-center justify-center flex-shrink-0 font-bold">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <strong className="text-slate-900 block font-bold">Plantão Recepção PS 24 Horas</strong>
            <p className="text-slate-600 m-0">
              Quem estiver de posse da senha tem o dever de compartilhar e atender ao telefone da recepção se a senha for enviada por e-mail.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-[#FDF2F6] text-[#B01B52] flex items-center justify-center flex-shrink-0 font-bold">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <strong className="text-slate-900 block font-bold">Senha Pessoal (Bradesco, Amil, Orizon)</strong>
            <p className="text-slate-600 m-0">
              Para cadastrar senha individual, informar: <em>Nome completo, data de nascimento, CPF, telefone e e-mail institucional</em>.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar convênio, usuário, portal, senha ou responsável..."
              className="w-full bg-[#F8FAFB] border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0E7B86] focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Hospital Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSelectedHospital('Todos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedHospital === 'Todos'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({PORTAIS_CREDENCIAIS.length})
            </button>

            <button
              type="button"
              onClick={() => setSelectedHospital('Medical')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedHospital === 'Medical'
                  ? 'bg-[#0E7B86] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Medical ({medicalCount})
            </button>

            <button
              type="button"
              onClick={() => setSelectedHospital('Santa Thereza')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedHospital === 'Santa Thereza'
                  ? 'bg-[#B01B52] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Santa Thereza ({santaTherezaCount})
            </button>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mr-1">
            Categoria:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCredentials.map((item) => {
          const isPasswordVisible = revealedPasswords[item.id] || false;
          const isCopiedLogin = copiedItem?.id === item.id && copiedItem?.field === 'login';
          const isCopiedSenha = copiedItem?.id === item.id && copiedItem?.field === 'senha';

          return (
            <div
              key={item.id}
              className={`bg-white border rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3.5 transition-all shadow-xs hover:shadow-md ${
                item.isSpecialNotice
                  ? 'border-amber-300 ring-1 ring-amber-200 bg-amber-50/20'
                  : 'border-slate-200/90 hover:border-[#0E7B86]/60'
              }`}
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider ${
                        item.hospital === 'Medical'
                          ? 'bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8]'
                          : item.hospital === 'Santa Thereza'
                          ? 'bg-[#FDF2F6] text-[#B01B52] border border-[#F7D0DF]'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {item.hospital}
                    </span>

                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {item.category}
                    </span>
                  </div>

                  {item.isSpecialNotice && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                      Regra Especial
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight m-0 leading-tight">
                    {item.convenio}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 m-0 truncate">
                    {item.siteName}
                  </p>
                </div>
              </div>

              {/* Login & Senha Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                {/* Login Row */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider w-14 flex-shrink-0">
                    Usuário:
                  </span>
                  <div className="flex-1 font-mono font-bold text-slate-900 truncate bg-white px-2 py-1 rounded-md border border-slate-200/80">
                    {item.login}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, 'login', item.login)}
                    title="Copiar usuário"
                    className="p-1.5 text-slate-500 hover:text-[#0E7B86] hover:bg-slate-200 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                  >
                    {isCopiedLogin ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Senha Row */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider w-14 flex-shrink-0">
                    Senha:
                  </span>
                  <div className="flex-1 font-mono font-bold text-slate-900 truncate bg-white px-2 py-1 rounded-md border border-slate-200/80 flex items-center justify-between">
                    <span>
                      {isPasswordVisible || item.senha === 'pessoal' || item.senha === 'Verificar no portal'
                        ? item.senha
                        : '••••••••••••'}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    {item.senha !== 'pessoal' && item.senha !== 'Verificar no portal' && !item.senha.includes('Não se aplica') && (
                      <button
                        type="button"
                        onClick={() => toggleReveal(item.id)}
                        title={isPasswordVisible ? 'Ocultar senha' : 'Ver senha'}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        {isPasswordVisible ? (
                          <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, 'senha', item.senha)}
                      title="Copiar senha"
                      className="p-1.5 text-slate-500 hover:text-[#0E7B86] hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      {isCopiedSenha ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Responsável / Observações */}
              {(item.responsavel || item.notes || item.emails) && (
                <div className="text-[11px] text-slate-600 space-y-1.5 pt-1">
                  {item.responsavel && (
                    <div className="flex items-start gap-1.5 text-slate-700 font-medium">
                      <span className="font-bold text-[#B01B52] flex-shrink-0">Resp:</span>
                      <span className="break-all">{item.responsavel}</span>
                    </div>
                  )}

                  {item.notes && (
                    <p className="m-0 text-slate-500 leading-snug">
                      {item.notes}
                    </p>
                  )}

                  {item.emails && item.emails.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-1">
                      {item.emails.map(email => (
                        <a
                          key={email}
                          href={`mailto:${email}`}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[10px] font-mono transition-colors"
                        >
                          <Mail className="w-2.5 h-2.5" />
                          {email}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Card Footer Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-medium">
                  {item.portalUrl.startsWith('http') ? 'Link Oficial' : 'Acesso Interno'}
                </span>

                {item.portalUrl.startsWith('http') ? (
                  <a
                    href={item.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0E7B86] hover:bg-[#095962] text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Acessar Portal ↗
                  </a>
                ) : item.portalUrl.startsWith('mailto:') ? (
                  <a
                    href={item.portalUrl}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#B01B52] hover:bg-[#8D1540] text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Enviar E-mail
                  </a>
                ) : (
                  <span className="text-xs text-slate-500 font-semibold italic">
                    {item.portalUrl}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCredentials.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <Info className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-700 m-0">Nenhum portal ou convênio encontrado com esse termo.</p>
          <button
            type="button"
            onClick={() => { setSearch(''); setSelectedHospital('Todos'); setSelectedCategory('Todos'); }}
            className="text-xs font-bold text-[#0E7B86] hover:underline cursor-pointer"
          >
            Limpar filtros e exibir todos
          </button>
        </div>
      )}
    </div>
  );
};
