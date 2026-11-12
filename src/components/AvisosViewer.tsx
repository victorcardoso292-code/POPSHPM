import React, { useState, useEffect, useMemo } from 'react';
import { 
  Megaphone, 
  Search, 
  Plus, 
  Pin, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Building2, 
  User, 
  Tag, 
  Copy, 
  Check, 
  Printer, 
  Trash2, 
  Edit3, 
  ArrowRight, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  X, 
  Filter,
  BellRing,
  Sparkles,
  Info,
  Image as ImageIcon,
  Maximize2
} from 'lucide-react';
import { 
  AvisoItem, 
  CategoriaAviso, 
  AVISOS_INICIAIS, 
  STORAGE_KEY_AVISOS, 
  STORAGE_KEY_LIDOS 
} from '../data/avisosData';
import { AppMode } from '../types';

interface AvisosViewerProps {
  onNavigateToMode?: (mode: AppMode, subTarget?: string) => void;
  isMaster?: boolean;
}

export const AvisosViewer: React.FC<AvisosViewerProps> = ({ 
  onNavigateToMode,
  isMaster = false 
}) => {
  // Estado dos avisos com persistência no LocalStorage (inicializado com os avisos oficiais enviados)
  const [avisos, setAvisos] = useState<AvisoItem[]>(() => {
    try {
      localStorage.removeItem('hpm_avisos_comunicados_v1');
      localStorage.removeItem('hpm_avisos_comunicados_v2');
      const saved = localStorage.getItem(STORAGE_KEY_AVISOS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar avisos do localStorage:', e);
    }
    return AVISOS_INICIAIS;
  });

  // Estado para visualização ampliada do cartaz oficial (Lightbox)
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Estado dos IDs lidos
  const [lidosIds, setLidosIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LIDOS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Salvar avisos no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AVISOS, JSON.stringify(avisos));
    } catch (e) {
      console.error('Erro ao salvar avisos:', e);
    }
  }, [avisos]);

  // Salvar lidos no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LIDOS, JSON.stringify(lidosIds));
    } catch (e) {
      console.error('Erro ao salvar lidos:', e);
    }
  }, [lidosIds]);

  // Filtros e busca
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('TODAS');
  const [filterMode, setFilterMode] = useState<'todos' | 'nao_lidos' | 'fixados'>('todos');

  // Estado para feedback de cópia
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal de criação / edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAviso, setEditingAviso] = useState<AvisoItem | null>(null);

  // Formulário do modal
  const [formTitulo, setFormTitulo] = useState('');
  const [formCategoria, setFormCategoria] = useState<CategoriaAviso>('URGENTE / ALERTA GERAL');
  const [formPrioridade, setFormPrioridade] = useState<'alta' | 'media' | 'baixa'>('alta');
  const [formFixado, setFormFixado] = useState(false);
  const [formSetor, setFormSetor] = useState('Recepção & Faturamento');
  const [formAutor, setFormAutor] = useState('Supervisão Hospitalar');
  const [formResumo, setFormResumo] = useState('');
  const [formConteudo, setFormConteudo] = useState('');
  const [formTags, setFormTags] = useState('');

  // Contador de não lidos
  const totalNaoLidos = useMemo(() => {
    return avisos.filter(a => !lidosIds.includes(a.id)).length;
  }, [avisos, lidosIds]);

  // Lista de categorias únicas
  const categoriasDisponiveis: CategoriaAviso[] = [
    'URGENTE / ALERTA GERAL',
    'CONVÊNIOS & FATURAMENTO',
    'ENFERMAGEM & RECEPÇÃO',
    'ESCALAS & CORPO CLÍNICO',
    'ADMINISTRATIVO & REFEITÓRIO',
    'DOCUMENTOS & FORMULÁRIOS'
  ];

  // Ações de leitura
  const handleToggleLido = (id: string) => {
    setLidosIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleMarcarTodosComoLidos = () => {
    const allIds = avisos.map(a => a.id);
    setLidosIds(allIds);
  };

  // Copiar comunicado para a área de transferência
  const handleCopyAviso = async (aviso: AvisoItem) => {
    const textoFormatado = `📢 COMUNICADO HOSPITALAR - REDE MEDICAL / KORA SAÚDE\n\n📌 *${aviso.titulo}*\n🏷️ Categoria: ${aviso.categoria}\n📅 Data: ${aviso.data}${aviso.hora ? ` às ${aviso.hora}` : ''}\n🏢 Setor: ${aviso.setorEmissor}\n\n${aviso.conteudo}\n\n---\nPalmas Medical Central de Autorizações & Recepção`;
    try {
      await navigator.clipboard.writeText(textoFormatado);
      setCopiedId(aviso.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // fallback
    }
  };

  // Limpar todos os avisos do quadro
  const handleLimparTodosAvisos = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os avisos do quadro?')) {
      setAvisos([]);
      setLidosIds([]);
      try {
        localStorage.setItem(STORAGE_KEY_AVISOS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEY_LIDOS, JSON.stringify([]));
      } catch {}
    }
  };

  // Excluir aviso
  const handleDeleteAviso = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este aviso?')) {
      setAvisos(prev => prev.filter(a => a.id !== id));
      setLidosIds(prev => prev.filter(item => item !== id));
    }
  };

  // Abrir modal para novo aviso
  const handleOpenNovoAviso = () => {
    setEditingAviso(null);
    setFormTitulo('');
    setFormCategoria('URGENTE / ALERTA GERAL');
    setFormPrioridade('alta');
    setFormFixado(false);
    setFormSetor('Recepção & Faturamento');
    setFormAutor('Supervisão Hospitalar');
    setFormResumo('');
    setFormConteudo('');
    setFormTags('Aviso, Recepção, Urgente');
    setIsModalOpen(true);
  };

  // Abrir modal para edição
  const handleOpenEditarAviso = (aviso: AvisoItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAviso(aviso);
    setFormTitulo(aviso.titulo);
    setFormCategoria(aviso.categoria);
    setFormPrioridade(aviso.prioridade);
    setFormFixado(aviso.fixado);
    setFormSetor(aviso.setorEmissor);
    setFormAutor(aviso.autor || '');
    setFormResumo(aviso.resumo);
    setFormConteudo(aviso.conteudo);
    setFormTags(aviso.tags.join(', '));
    setIsModalOpen(true);
  };

  // Salvar formulário (criação ou edição)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitulo.trim() || !formConteudo.trim()) {
      alert('Por favor, preencha o título e o conteúdo do aviso.');
      return;
    }

    const tagsArray = formTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const now = new Date();
    const dataFormatada = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const horaFormatada = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (editingAviso) {
      setAvisos(prev => prev.map(a => {
        if (a.id === editingAviso.id) {
          return {
            ...a,
            titulo: formTitulo.trim(),
            categoria: formCategoria,
            prioridade: formPrioridade,
            fixado: formFixado,
            setorEmissor: formSetor.trim(),
            autor: formAutor.trim() || undefined,
            resumo: formResumo.trim() || formConteudo.slice(0, 140) + '...',
            conteudo: formConteudo.trim(),
            tags: tagsArray.length > 0 ? tagsArray : ['Geral']
          };
        }
        return a;
      }));
    } else {
      const novoAviso: AvisoItem = {
        id: `aviso-${Date.now()}`,
        titulo: formTitulo.trim(),
        categoria: formCategoria,
        prioridade: formPrioridade,
        fixado: formFixado,
        data: dataFormatada,
        hora: horaFormatada,
        setorEmissor: formSetor.trim() || 'Central de Atendimento',
        autor: formAutor.trim() || 'Equipe Hospitalar',
        resumo: formResumo.trim() || formConteudo.slice(0, 140) + '...',
        conteudo: formConteudo.trim(),
        tags: tagsArray.length > 0 ? tagsArray : ['Novo Aviso']
      };
      setAvisos(prev => [novoAviso, ...prev]);
    }

    setIsModalOpen(false);
  };

  // Filtragem e ordenação
  const avisosFiltrados = useMemo(() => {
    return avisos.filter(aviso => {
      // Filtro de busca textual
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitulo = aviso.titulo.toLowerCase().includes(q);
        const matchConteudo = aviso.conteudo.toLowerCase().includes(q);
        const matchSetor = aviso.setorEmissor.toLowerCase().includes(q);
        const matchAutor = aviso.autor?.toLowerCase().includes(q) || false;
        const matchTags = aviso.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitulo && !matchConteudo && !matchSetor && !matchAutor && !matchTags) {
          return false;
        }
      }

      // Filtro de categoria
      if (selectedCategoria !== 'TODAS' && aviso.categoria !== selectedCategoria) {
        return false;
      }

      // Filtro de status
      const isLido = lidosIds.includes(aviso.id);
      if (filterMode === 'nao_lidos' && isLido) return false;
      if (filterMode === 'fixados' && !aviso.fixado) return false;

      return true;
    }).sort((a, b) => {
      // Fixados primeiro
      if (a.fixado && !b.fixado) return -1;
      if (!a.fixado && b.fixado) return 1;

      // Alta prioridade depois
      const prioridadeRank = { alta: 3, media: 2, baixa: 1 };
      if (prioridadeRank[a.prioridade] !== prioridadeRank[b.prioridade]) {
        return prioridadeRank[b.prioridade] - prioridadeRank[a.prioridade];
      }

      return 0;
    });
  }, [avisos, searchQuery, selectedCategoria, filterMode, lidosIds]);

  // Função para imprimir comunicados selecionados ou todos
  const handlePrint = () => {
    window.print();
  };

  // Helper de estilização de categorias
  const getCategoriaBadgeStyle = (cat: CategoriaAviso) => {
    switch (cat) {
      case 'URGENTE / ALERTA GERAL':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'CONVÊNIOS & FATURAMENTO':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'ENFERMAGEM & RECEPÇÃO':
        return 'bg-[#EBF7F8] text-[#0E7B86] border-[#C4E5E8]';
      case 'ESCALAS & CORPO CLÍNICO':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'ADMINISTRATIVO & REFEITÓRIO':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'DOCUMENTOS & FORMULÁRIOS':
        return 'bg-[#FDF2F6] text-[#B01B52] border-[#F7D0DF]';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF7F8] border border-[#C4E5E8] flex items-center justify-center flex-shrink-0 text-[#0E7B86] shadow-2xs">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  Quadro de Avisos & Comunicados
                </h1>
                <span className="bg-[#B01B52] text-white text-xs px-2.5 py-0.5 rounded-full font-bold shadow-2xs">
                  {avisos.length} Comunicados
                </span>
                {totalNaoLidos > 0 && (
                  <span className="bg-red-600 text-white text-xs px-2.5 py-0.5 rounded-full font-bold animate-pulse flex items-center gap-1 shadow-2xs">
                    <BellRing className="w-3 h-3" />
                    {totalNaoLidos} não lido{totalNaoLidos > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Alertas operacionais, informativos de convênios, escalas médicas e comunicados da Recepção, Enfermagem e Faturamento.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleOpenNovoAviso}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-[#B01B52] hover:bg-[#971444] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer group"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span>Novo Aviso</span>
            </button>

            {totalNaoLidos > 0 && (
              <button
                type="button"
                onClick={handleMarcarTodosComoLidos}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer border border-slate-200"
                title="Marcar todos os comunicados como lidos"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Marcar todos como lidos</span>
              </button>
            )}

            {avisos.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer border border-slate-200 shadow-2xs"
                  title="Imprimir quadro de avisos em folha A4"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Imprimir Mural</span>
                </button>

                <button
                  type="button"
                  onClick={handleLimparTodosAvisos}
                  className="flex items-center gap-1.5 px-2.5 py-2 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-700 text-xs font-medium rounded-xl transition-colors cursor-pointer border border-slate-200"
                  title="Limpar todos os avisos do quadro"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Limpar Todos</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Banner de Aviso de Destaque Urgente (Se houver aviso fixado prioritário) */}
        {avisos.some(a => a.fixado && a.prioridade === 'alta') && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-3.5 flex items-center justify-between gap-3 text-red-900">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-wider font-black text-red-600 block">
                    Aviso Operacional de Alta Importância
                  </span>
                  <p className="text-xs sm:text-sm font-bold truncate">
                    {avisos.find(a => a.fixado && a.prioridade === 'alta')?.titulo}
                  </p>
                </div>
              </div>

              {avisos.find(a => a.fixado && a.prioridade === 'alta')?.linkAcao && onNavigateToMode && (
                <button
                  type="button"
                  onClick={() => {
                    const topAviso = avisos.find(a => a.fixado && a.prioridade === 'alta');
                    if (topAviso?.linkAcao) {
                      onNavigateToMode(topAviso.linkAcao.modo, topAviso.linkAcao.subTarget);
                    }
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 flex-shrink-0 cursor-pointer shadow-2xs"
                >
                  <span>{avisos.find(a => a.fixado && a.prioridade === 'alta')?.linkAcao?.texto}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls: Search & Category Filters (visíveis apenas quando houver avisos) */}
      {avisos.length > 0 && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título, conteúdo, tag, setor ou convênio citado..."
                className="w-full bg-[#F8FAFB] border border-slate-200 rounded-xl pl-9.5 pr-8 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E7B86] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status View Mode Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl flex-shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setFilterMode('todos')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  filterMode === 'todos'
                    ? 'bg-white text-slate-800 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Todos ({avisos.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('nao_lidos')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  filterMode === 'nao_lidos'
                    ? 'bg-white text-[#B01B52] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Não Lidos</span>
                {totalNaoLidos > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('fixados')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  filterMode === 'fixados'
                    ? 'bg-white text-[#0E7B86] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Pin className="w-3 h-3" />
                <span>Fixados</span>
              </button>
            </div>
          </div>

          {/* Categories Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategoria('TODAS')}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategoria === 'TODAS'
                  ? 'bg-[#0E7B86] text-white border-[#0E7B86] shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Todas as Categorias
            </button>

            {categoriasDisponiveis.map((cat) => {
              const isSelected = selectedCategoria === cat;
              const count = avisos.filter(a => a.categoria === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategoria(cat)}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#0E7B86] text-white border-[#0E7B86] shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Cards List */}
      {avisos.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 sm:p-14 border border-slate-200 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#EBF7F8] text-[#0E7B86] border border-[#C4E5E8] flex items-center justify-center mx-auto shadow-2xs">
            <Megaphone className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-black text-slate-800">
              Quadro de Avisos Vazio
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Todos os avisos foram limpos. O quadro está pronto para você adicionar comunicados, alertas operacionais ou notas da equipe assim que tiver algum.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleOpenNovoAviso}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#B01B52] hover:bg-[#971444] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer group"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span>Adicionar Primeiro Aviso</span>
            </button>
          </div>
        </div>
      ) : avisosFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Megaphone className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-700">Nenhum comunicado encontrado</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Não encontramos avisos com os termos pesquisados ou com os filtros ativos. Tente limpar os filtros ou criar um novo aviso.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategoria('TODAS');
              setFilterMode('todos');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Limpar Filtros de Busca
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {avisosFiltrados.map((aviso) => {
            const isLido = lidosIds.includes(aviso.id);
            const isCopied = copiedId === aviso.id;

            return (
              <article
                key={aviso.id}
                className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden relative shadow-xs hover:shadow-md ${
                  aviso.fixado 
                    ? 'border-[#0E7B86]/40 ring-1 ring-[#0E7B86]/20' 
                    : isLido 
                      ? 'border-slate-200' 
                      : 'border-slate-300 ring-1 ring-slate-200'
                }`}
              >
                {/* Header do Card */}
                <div className="p-4 sm:p-5 space-y-3 flex-1">
                  {/* Top Bar: Categoria, Data e Botão de Pin/Fixado */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full border ${getCategoriaBadgeStyle(aviso.categoria)}`}>
                        {aviso.categoria}
                      </span>
                      {aviso.fixado && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#0E7B86] bg-[#EBF7F8] px-2 py-0.5 rounded-full border border-[#C4E5E8]">
                          <Pin className="w-3 h-3 fill-[#0E7B86]" />
                          Fixado
                        </span>
                      )}
                      {!isLido && (
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" title="Comunicado não lido" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {aviso.data}
                      </span>
                      {aviso.hora && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {aviso.hora}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Título do Aviso */}
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug tracking-tight">
                      {aviso.titulo}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{aviso.setorEmissor}</span>
                      {aviso.autor && (
                        <>
                          <span>•</span>
                          <span className="truncate text-slate-400">{aviso.autor}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Conteúdo formatado com quebras de linha */}
                  <div className="bg-[#F8FAFB] rounded-xl p-3.5 border border-slate-100 text-xs sm:text-sm text-slate-700 font-normal leading-relaxed whitespace-pre-line select-text">
                    {aviso.conteudo}
                  </div>

                  {/* Cartaz Oficial / Imagem Anexa (se houver) */}
                  {aviso.imagemUrl && (
                    <div className="relative group/img rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100 border-b border-slate-200 text-[11px] text-slate-700 font-bold">
                        <span className="flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-[#0E7B86]" />
                          Cartaz Oficial do Comunicado
                        </span>
                        <button
                          type="button"
                          onClick={() => setLightboxImage({ url: aviso.imagemUrl!, title: aviso.titulo })}
                          className="text-[#0E7B86] hover:text-[#095962] flex items-center gap-1 text-[10px] font-black cursor-pointer"
                        >
                          <Maximize2 className="w-3 h-3" />
                          Ampliar Cartaz
                        </button>
                      </div>
                      <div 
                        onClick={() => setLightboxImage({ url: aviso.imagemUrl!, title: aviso.titulo })}
                        className="cursor-pointer max-h-56 overflow-hidden flex items-center justify-center bg-slate-100 relative group-hover/img:opacity-95 transition-opacity"
                        title="Clique para ver o cartaz em tamanho grande"
                      >
                        <img 
                          src={aviso.imagemUrl} 
                          alt={aviso.titulo} 
                          className="w-full object-cover object-top max-h-56"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                          <Eye className="w-4 h-4" />
                          <span>Clique para ampliar o cartaz</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {aviso.tags && aviso.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {aviso.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/60"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer do Card: Ações & Navegação */}
                <div className="bg-slate-50/80 border-t border-slate-100 px-4 py-3 flex items-center justify-between gap-2 flex-wrap">
                  {/* Botão de Ação Direta (Ex: Ver POP, Ver Escala, Ver Documentos) */}
                  <div className="flex items-center gap-2">
                    {aviso.linkAcao && onNavigateToMode && (
                      <button
                        type="button"
                        onClick={() => onNavigateToMode(aviso.linkAcao!.modo, aviso.linkAcao!.subTarget)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0E7B86] hover:bg-[#095962] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs group"
                      >
                        <span>{aviso.linkAcao.texto}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleToggleLido(aviso.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                        isLido
                          ? 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                      title={isLido ? 'Marcar como não lido' : 'Marcar como lido'}
                    >
                      {isLido ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      <span className="hidden sm:inline">{isLido ? 'Lido' : 'Marcar Lido'}</span>
                    </button>
                  </div>

                  {/* Ações secundárias: Copiar, Editar, Excluir */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyAviso(aviso)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                      title="Copiar texto do comunicado para envio via WhatsApp ou memorando"
                    >
                      {isCopied ? (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold px-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Copiado!
                        </span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleOpenEditarAviso(aviso, e)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                      title="Editar comunicado"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteAviso(aviso.id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Excluir comunicado"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal de Criação / Edição de Aviso */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBF7F8] border border-[#C4E5E8] flex items-center justify-center text-[#0E7B86]">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {editingAviso ? 'Editar Comunicado' : 'Novo Comunicado Hospitalar'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cadastre alertas operacionais, regras de convênios ou avisos da equipe
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Título do Aviso *
                </label>
                <input
                  type="text"
                  required
                  value={formTitulo}
                  onChange={(e) => setFormTitulo(e.target.value)}
                  placeholder="Ex: OBRIGATÓRIO: Coleta de Assinatura do Paciente nas Guias..."
                  className="w-full bg-[#F8FAFB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0E7B86] font-medium"
                />
              </div>

              {/* Linha dupla: Categoria e Prioridade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Categoria
                  </label>
                  <select
                    value={formCategoria}
                    onChange={(e) => setFormCategoria(e.target.value as CategoriaAviso)}
                    className="w-full bg-[#F8FAFB] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E7B86]"
                  >
                    {categoriasDisponiveis.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nível de Prioridade
                  </label>
                  <select
                    value={formPrioridade}
                    onChange={(e) => setFormPrioridade(e.target.value as 'alta' | 'media' | 'baixa')}
                    className="w-full bg-[#F8FAFB] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E7B86]"
                  >
                    <option value="alta">Alta (Destaque Vermelho)</option>
                    <option value="media">Média (Informativo Padrão)</option>
                    <option value="baixa">Baixa (Rotina / Lembrete)</option>
                  </select>
                </div>
              </div>

              {/* Linha dupla: Setor Emissor e Autor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Setor Emissor
                  </label>
                  <input
                    type="text"
                    value={formSetor}
                    onChange={(e) => setFormSetor(e.target.value)}
                    placeholder="Ex: Faturamento & Auditoria"
                    className="w-full bg-[#F8FAFB] border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0E7B86]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Autor / Responsável
                  </label>
                  <input
                    type="text"
                    value={formAutor}
                    onChange={(e) => setFormAutor(e.target.value)}
                    placeholder="Ex: Coordenação de Recepção"
                    className="w-full bg-[#F8FAFB] border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0E7B86]"
                  />
                </div>
              </div>

              {/* Conteúdo Completo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Conteúdo / Orientações *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formConteudo}
                  onChange={(e) => setFormConteudo(e.target.value)}
                  placeholder="Escreva aqui as instruções detalhadas, códigos, regras operacionais e procedimentos..."
                  className="w-full bg-[#F8FAFB] border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0E7B86] leading-relaxed font-sans"
                />
              </div>

              {/* Tags e Opção Fixado */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tags (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Ex: Guias, Glosas, Recepção, Urgência"
                    className="w-full bg-[#F8FAFB] border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0E7B86]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4 sm:pt-6">
                  <input
                    type="checkbox"
                    id="chk-fixado"
                    checked={formFixado}
                    onChange={(e) => setFormFixado(e.target.checked)}
                    className="w-4 h-4 text-[#0E7B86] rounded border-slate-300 focus:ring-[#0E7B86] cursor-pointer"
                  />
                  <label htmlFor="chk-fixado" className="text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1">
                    <Pin className="w-3.5 h-3.5 text-[#0E7B86]" />
                    Fixar no topo do mural
                  </label>
                </div>
              </div>

              {/* Botões do Modal */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#B01B52] hover:bg-[#971444] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  {editingAviso ? 'Salvar Alterações' : 'Publicar Comunicado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal de Visualização do Cartaz Oficial */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-fade-in cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-3xl max-w-2xl sm:max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-300 shadow-2xl cursor-default"
          >
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2 min-w-0">
                <Megaphone className="w-4 h-4 text-[#0E7B86] flex-shrink-0" />
                <h4 className="text-xs sm:text-sm font-black text-slate-800 truncate">
                  {lightboxImage.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 cursor-pointer"
                title="Fechar visualização"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex items-center justify-center bg-slate-100 min-h-0 flex-1">
              <img 
                src={lightboxImage.url} 
                alt={lightboxImage.title}
                className="max-h-[75vh] w-auto object-contain rounded-xl shadow-md border border-slate-200" 
              />
            </div>
            <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Cartaz Oficial • Hospital Palmas Medical (Kora Saúde)</span>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="px-3.5 py-1.5 bg-[#0E7B86] hover:bg-[#095962] text-white font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Sheet View (visível apenas na impressão - print:block) */}
      <div className="hidden print:block p-8 space-y-6 text-black bg-white">
        <div className="border-b-2 border-slate-800 pb-4 text-center">
          <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">
            HOSPITAL PALMAS MEDICAL • KORA SAÚDE
          </h2>
          <p className="text-sm font-bold uppercase tracking-wider text-slate-600 mt-1">
            MURAL OPERACIONAL DE AVISOS E COMUNICADOS INTERNOS
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Data de Impressão: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
          </p>
        </div>

        <div className="space-y-6">
          {avisosFiltrados.map((aviso, idx) => (
            <div key={aviso.id} className="border border-slate-400 p-4 rounded-lg space-y-2 break-inside-avoid">
              <div className="flex justify-between items-center text-xs border-b border-slate-200 pb-1">
                <span className="font-bold uppercase text-slate-800">
                  [{aviso.categoria}] {aviso.fixado ? '• FIXADO NO TOPO' : ''}
                </span>
                <span className="text-slate-600">
                  {aviso.data} {aviso.hora ? `• ${aviso.hora}` : ''}
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900 leading-tight">
                {idx + 1}. {aviso.titulo}
              </h4>
              <p className="text-xs text-slate-600 italic">
                Setor Emissor: {aviso.setorEmissor} {aviso.autor ? `| Responsável: ${aviso.autor}` : ''}
              </p>
              <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed pt-1">
                {aviso.conteudo}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 text-center text-xs text-slate-500 border-t border-slate-300">
          Central de Autorizações & Recepção • Hospital Palmas Medical • Palmas - TO
        </div>
      </div>
    </div>
  );
};
