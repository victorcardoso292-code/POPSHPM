import React, { useState } from 'react';
import { ChefHat, Search, Filter, BookOpen, Printer, Calendar } from 'lucide-react';

export interface CardapioItem {
  data: string;
  diaSemana: string;
  pratoPrincipal: string;
  acompanhamento: string;
  guarnicao: string;
  salada: string;
  sobremesa: string;
  feriado?: string;
  semanaNum: 1 | 2 | 3 | 4 | 5;
  corHex: string;
}

export const CARDAPIO_NOVEMBRO_2026: CardapioItem[] = [
  // SEMANA 1 - Verde claro (#DFF2BF / #DDF3D5)
  {
    data: '01/11/2026',
    diaSemana: 'Domingo',
    pratoPrincipal: 'Lasanha de Carne',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Batata palha',
    salada: 'Legumes cozidos',
    sobremesa: 'Gelatina',
    semanaNum: 1,
    corHex: '#DDF3D5'
  },
  {
    data: '02/11/2026',
    diaSemana: 'Segunda-feira',
    pratoPrincipal: 'Carne de Panela com batata e cenoura',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Farofa de Cebola',
    salada: 'Repolho/Beterraba/Tomate',
    sobremesa: 'Gelatina',
    feriado: 'FERIADO',
    semanaNum: 1,
    corHex: '#DDF3D5'
  },
  {
    data: '03/11/2026',
    diaSemana: 'Terça-feira',
    pratoPrincipal: 'Frango xadrez',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão espaguete alho e óleo',
    salada: 'Repolho/Beterraba/Tomate',
    sobremesa: 'Paçoquinha',
    semanaNum: 1,
    corHex: '#DDF3D5'
  },
  {
    data: '04/11/2026',
    diaSemana: 'Quarta-feira',
    pratoPrincipal: 'Pernil em cubos ao molho escuro + Tiras de Frango Mles HST',
    acompanhamento: 'Arroz + Feijão PRETO',
    guarnicao: 'Macarrão ao sugo',
    salada: 'Repolho/Cenoura/Tomate/Alface',
    sobremesa: 'Laranja',
    semanaNum: 1,
    corHex: '#DDF3D5'
  },
  {
    data: '05/11/2026',
    diaSemana: 'Quinta-feira',
    pratoPrincipal: 'Estrogonofe de frango',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Batata palha',
    salada: 'Maionese de beterraba',
    sobremesa: 'Gelatina',
    semanaNum: 1,
    corHex: '#DDF3D5'
  },
  {
    data: '06/11/2026',
    diaSemana: 'Sexta-feira',
    pratoPrincipal: 'Fricasse de frango',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Batata palha',
    salada: 'Repolho Roxo/Pepino/Tomate',
    sobremesa: 'Paçoquinha',
    semanaNum: 1,
    corHex: '#DDF3D5'
  },
  {
    data: '07/11/2026',
    diaSemana: 'Sábado',
    pratoPrincipal: 'Feijoada Sabor da Terra + Bife de Frango Mles HST',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Farofa de banana da Terra',
    salada: 'Repolho/Cenoura/Tomate/Alface',
    sobremesa: 'Laranja',
    semanaNum: 1,
    corHex: '#DDF3D5'
  },
  {
    data: '08/11/2026',
    diaSemana: 'Domingo',
    pratoPrincipal: 'Escondidinho de carne',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Legumes cozidos',
    salada: 'Alface/Cenoura/Repolho roxo',
    sobremesa: 'Paçoquinha',
    semanaNum: 1,
    corHex: '#DDF3D5'
  },

  // SEMANA 2 - Amarelo ouro (#FFD633 / #FFE066)
  {
    data: '09/11/2026',
    diaSemana: 'Segunda-feira',
    pratoPrincipal: 'Carne moída com legumes',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão espaguete alho e óleo',
    salada: 'Alface/Cenoura/Repolho roxo',
    sobremesa: 'Gelatina',
    semanaNum: 2,
    corHex: '#FFDF66'
  },
  {
    data: '10/11/2026',
    diaSemana: 'Terça-feira',
    pratoPrincipal: 'Tiras suína ao molho escuro + Tiras de frango Mles HST',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão espaguete alho e óleo',
    salada: 'Repolho/Beterraba/Tomate',
    sobremesa: 'Paçoquinha',
    semanaNum: 2,
    corHex: '#FFDF66'
  },
  {
    data: '11/11/2026',
    diaSemana: 'Quarta-feira',
    pratoPrincipal: 'Coxa e sobrecoxa assada',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Creme de milho',
    salada: 'Macaronese',
    sobremesa: 'Laranja',
    semanaNum: 2,
    corHex: '#FFDF66'
  },
  {
    data: '12/11/2026',
    diaSemana: 'Quinta-feira',
    pratoPrincipal: 'Chambari com mandioca',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Farofa de cebola',
    salada: 'Repolho/Beterraba/Tomate',
    sobremesa: 'Gelatina',
    semanaNum: 2,
    corHex: '#FFDF66'
  },
  {
    data: '13/11/2026',
    diaSemana: 'Sexta-feira',
    pratoPrincipal: 'Linguiça Suína + Coxinha da Asa',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Feijão tropeiro',
    salada: 'Repolho roxo/Pepino/Tomate',
    sobremesa: 'Gelatina',
    semanaNum: 2,
    corHex: '#FFDF66'
  },
  {
    data: '14/11/2026',
    diaSemana: 'Sábado',
    pratoPrincipal: 'Tiras de Frango acebolada',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Farofa de Bacon',
    salada: 'Repolho roxo/Pepino/Tomate',
    sobremesa: 'Paçoquinha',
    semanaNum: 2,
    corHex: '#FFDF66'
  },
  {
    data: '15/11/2026',
    diaSemana: 'Domingo',
    pratoPrincipal: 'Lasanha de Carne',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Batata palha',
    salada: 'Legumes cozidos',
    sobremesa: 'Paçoquinha',
    semanaNum: 2,
    corHex: '#FFDF66'
  },

  // SEMANA 3 - Pêssego / Laranja claro (#FFD6BA / #FFD9C2)
  {
    data: '16/11/2026',
    diaSemana: 'Segunda-feira',
    pratoPrincipal: 'Coxa e sobrecoxa assada',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Creme de milho',
    salada: 'Repolho/Cenoura/Tomate/Alface',
    sobremesa: 'Gelatina',
    semanaNum: 3,
    corHex: '#FFD9C2'
  },
  {
    data: '17/11/2026',
    diaSemana: 'Terça-feira',
    pratoPrincipal: 'Carne assada + Linguiça de Frango',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Feijão tropeiro',
    salada: 'Macaronese',
    sobremesa: 'Gelatina',
    semanaNum: 3,
    corHex: '#FFD9C2'
  },
  {
    data: '18/11/2026',
    diaSemana: 'Quarta-feira',
    pratoPrincipal: 'Pernil em cubos ao molho escuro + Tiras de Frango Mles HST',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão Alho e óleo',
    salada: 'Repolho roxo/Pepino/Tomate',
    sobremesa: 'Laranja',
    semanaNum: 3,
    corHex: '#FFD9C2'
  },
  {
    data: '19/11/2026',
    diaSemana: 'Quinta-feira',
    pratoPrincipal: 'Escondidinho de frango',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Batata palha',
    salada: 'Repolho/Beterraba/Tomate',
    sobremesa: 'Paçoquinha',
    semanaNum: 3,
    corHex: '#FFD9C2'
  },
  {
    data: '20/11/2026',
    diaSemana: 'Sexta-feira',
    pratoPrincipal: 'Carne de Panela com Batata e cenoura',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão espaguete alho e óleo',
    salada: 'Repolho/Beterraba/Tomate',
    sobremesa: 'Paçoquinha',
    feriado: 'FERIADO',
    semanaNum: 3,
    corHex: '#FFD9C2'
  },
  {
    data: '21/11/2026',
    diaSemana: 'Sábado',
    pratoPrincipal: 'Feijoada + Bife de Frango Mles HST',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Farofa de Banana da Terra',
    salada: 'Repolho/Cenoura/Tomate/Alface',
    sobremesa: 'Gelatina',
    semanaNum: 3,
    corHex: '#FFD9C2'
  },
  {
    data: '22/11/2026',
    diaSemana: 'Domingo',
    pratoPrincipal: 'Lasanha de frango',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Legumes saute',
    salada: 'Repolho roxo/Pepino/Tomate',
    sobremesa: 'Gelatina',
    semanaNum: 3,
    corHex: '#FFD9C2'
  },

  // SEMANA 4 / 5 - Azul claro (#BEE3F8 / #C7E8FA)
  {
    data: '23/11/2026',
    diaSemana: 'Segunda-feira',
    pratoPrincipal: 'Coxa e sobrecoxa assada',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Creme de milho',
    salada: 'Repolho/Cenoura/Tomate/Alface',
    sobremesa: 'Paçoquinha',
    semanaNum: 4,
    corHex: '#C7E8FA'
  },
  {
    data: '24/11/2026',
    diaSemana: 'Terça-feira',
    pratoPrincipal: 'Escondidinho de carne',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Batata palha',
    salada: 'Repolho/Cenoura/Tomate/Alface',
    sobremesa: 'Paçoquinha',
    semanaNum: 4,
    corHex: '#C7E8FA'
  },
  {
    data: '25/11/2026',
    diaSemana: 'Quarta-feira',
    pratoPrincipal: 'Pernil em cubos + Bife de Frango Mles HST',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Farofa de cebola',
    salada: 'Repolho/Cenoura/Tomate/Alface',
    sobremesa: 'Laranja',
    semanaNum: 4,
    corHex: '#C7E8FA'
  },
  {
    data: '26/11/2026',
    diaSemana: 'Quinta-feira',
    pratoPrincipal: 'Frango xadrez',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão espaguete alho e óleo',
    salada: 'Macaronese',
    sobremesa: 'Gelatina',
    semanaNum: 4,
    corHex: '#C7E8FA'
  },
  {
    data: '27/11/2026',
    diaSemana: 'Sexta-feira',
    pratoPrincipal: 'Carne de Panela com Batata',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão espaguete alho e óleo',
    salada: 'Repolho roxo/Pepino/Tomate',
    sobremesa: 'Gelatina',
    semanaNum: 4,
    corHex: '#C7E8FA'
  },
  {
    data: '28/11/2026',
    diaSemana: 'Sábado',
    pratoPrincipal: 'Feijoada + Bife de Frango Mles HST',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Farofa de Banana da Terra',
    salada: 'Legumes cozidos',
    sobremesa: 'Paçoquinha',
    semanaNum: 4,
    corHex: '#C7E8FA'
  },
  {
    data: '29/11/2026',
    diaSemana: 'Domingo',
    pratoPrincipal: 'Coxa e sobrecoxa assada',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Creme de milho',
    salada: 'Repolho/Beterraba/Tomate',
    sobremesa: 'Paçoquinha',
    semanaNum: 4,
    corHex: '#C7E8FA'
  },
  {
    data: '30/11/2026',
    diaSemana: 'Segunda-feira',
    pratoPrincipal: 'Estrogonofe de frango',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Batata palha',
    salada: 'Repolho/Cenoura/Tomate/Alface',
    sobremesa: 'Gelatina',
    semanaNum: 5,
    corHex: '#C7E8FA'
  }
];

export const CardapioRefeitorioPrint: React.FC = () => {
  const [filterText, setFilterText] = useState('');
  const [selectedSemana, setSelectedSemana] = useState<number | 'todas'>('todas');
  // Seletor de tipografia estrita ABNT: Arial (padrão técnico) ou Times New Roman (padrão clássico)
  const [abntFont, setAbntFont] = useState<'arial' | 'times'>('arial');

  const filteredItems = CARDAPIO_NOVEMBRO_2026.filter((item) => {
    const matchSemana = selectedSemana === 'todas' || item.semanaNum === selectedSemana;
    const q = filterText.trim().toLowerCase();
    const matchSearch =
      !q ||
      item.data.toLowerCase().includes(q) ||
      item.diaSemana.toLowerCase().includes(q) ||
      item.pratoPrincipal.toLowerCase().includes(q) ||
      item.acompanhamento.toLowerCase().includes(q) ||
      item.guarnicao.toLowerCase().includes(q) ||
      item.salada.toLowerCase().includes(q) ||
      item.sobremesa.toLowerCase().includes(q);
    return matchSemana && matchSearch;
  });

  const fontStyle = abntFont === 'arial' 
    ? { fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif' }
    : { fontFamily: '"Times New Roman", Times, Baskerville, Georgia, serif' };

  return (
    <div className="w-full bg-white text-black p-2 sm:p-5 max-w-[1280px] mx-auto text-xs print:p-0 print:m-0 print:border-none">
      
      {/* Barra de Controle de Visualização & Normas ABNT (Oculta na Impressão) */}
      <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs print:hidden shadow-xs">
        
        {/* Seletor de Fonte Conforme ABNT */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#0E7B86]" />
            Fonte ABNT:
          </span>
          <button
            type="button"
            onClick={() => setAbntFont('arial')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              abntFont === 'arial'
                ? 'bg-[#0E7B86] text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title="Arial (12pt / 10pt) - Fonte padrão da ABNT NBR 14724 para relatórios e tabelas técnicas"
          >
            Arial (Padrão ABNT)
          </button>
          <button
            type="button"
            onClick={() => setAbntFont('times')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer font-serif ${
              abntFont === 'times'
                ? 'bg-[#0E7B86] text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title="Times New Roman (12pt / 10pt) - Fonte acadêmica clássica ABNT"
          >
            Times New Roman (ABNT)
          </button>
        </div>

        {/* Filtro de Semanas */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            Semana:
          </span>
          <button
            type="button"
            onClick={() => setSelectedSemana('todas')}
            className={`px-2 py-1 rounded-md font-bold text-[11px] transition-all cursor-pointer ${
              selectedSemana === 'todas'
                ? 'bg-slate-800 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Mês Completo (Novembro)
          </button>
          {[1, 2, 3, 4].map((sem) => (
            <button
              key={sem}
              type="button"
              onClick={() => setSelectedSemana(sem)}
              className={`px-2 py-1 rounded-md font-bold text-[11px] transition-all cursor-pointer ${
                selectedSemana === sem
                  ? 'bg-[#0E7B86] text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Semana {sem}
            </button>
          ))}
        </div>

        {/* Busca Rápida no Cardápio */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar prato, carne, salada..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E7B86] w-48 sm:w-60 bg-white"
            />
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-[#B01B52] hover:bg-[#971444] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Imprimir Cardápio Oficial ABNT"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir A4</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          FOLHA ABNT NBR 14724 • CARDÁPIO OFICIAL REFEITÓRIO NOVEMBRO 2026
          ========================================================================= */}
      <div 
        id="cardapio-abnt-doc"
        className="w-full bg-white text-black p-4 sm:p-6 border border-black print:border-none print:p-0 page-break-avoid"
        style={fontStyle}
      >
        
        {/* Cabeçalho Institucional Oficial */}
        <div className="border-b-2 border-black pb-2.5 mb-2 text-center">
          <div className="flex items-center justify-between pb-1 text-[10px] text-slate-700 font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E06D24] inline-block"></span>
              <span>Instituto Hermes</span>
            </div>
            <span>Hospital Palmas Medical Center • Kora Saúde</span>
            <span>Palmas - TO</span>
          </div>
          
          <h1 className="text-base sm:text-lg font-black uppercase text-black tracking-wide my-1">
            CARDÁPIO ROTATIVO REFETÓRIO – NOVEMBRO 2026
          </h1>
          <h2 className="text-xs font-bold uppercase text-slate-800 my-0">
            SERVIÇO DE NUTRIÇÃO E DIETÉTICA • ALIMENTAÇÃO COLETIVA
          </h2>
          <p className="text-[11px] text-black font-normal my-0">
            Cardápio Rotativo Mensal do Refeitório dos Colaboradores
          </p>
        </div>

        {/* Identificação Normatizada da Tabela / Quadro (ABNT NBR 14724) */}
        <div className="flex items-baseline justify-between mb-1.5 pt-1">
          <div className="text-[11px] text-black">
            <span className="font-bold">Quadro 1</span>
            <span className="font-normal"> – Programação Nutricional e Cardápio Rotativo do Refeitório (Novembro de 2026)</span>
          </div>
          <div className="text-[10px] text-black font-semibold">
            Palmas, TO
          </div>
        </div>

        {/* Tabela do Cardápio Estruturada Conforme ABNT */}
        <div className="overflow-x-auto">
          <table 
            className="w-full border-collapse border border-black text-black text-[10px] leading-tight"
            style={{ 
              borderCollapse: 'collapse', 
              border: '1.5px solid #000000',
              ...fontStyle
            }}
          >
            {/* Cabeçalho das Colunas: Caixa Alta, Negrito, Tamanho 10pt */}
            <thead>
              <tr className="bg-slate-100 text-black font-bold uppercase text-center border-b-2 border-black">
                <th className="border border-black px-2 py-2 w-[78px] text-center">Data</th>
                <th className="border border-black px-2 py-2 w-[98px] text-center">Dia da Semana</th>
                <th className="border border-black px-2.5 py-2 text-left w-[240px]">Prato Principal</th>
                <th className="border border-black px-2 py-2 text-left w-[170px]">Acompanhamento</th>
                <th className="border border-black px-2 py-2 text-left w-[180px]">Guarnição</th>
                <th className="border border-black px-2 py-2 text-left w-[190px]">Salada</th>
                <th className="border border-black px-2 py-2 text-center w-[100px]">Sobremesa</th>
                <th className="border border-black px-1.5 py-2 text-center w-[74px]">Observação</th>
              </tr>
            </thead>
            
            {/* Corpo com Linhas das Semanas Coloridas Fielmente à Imagem Original */}
            <tbody>
              {filteredItems.map((item) => (
                <tr 
                  key={item.data}
                  className="transition-colors hover:brightness-95 border-b border-black"
                  style={{ 
                    backgroundColor: item.corHex,
                    color: '#000000'
                  }}
                >
                  <td className="border border-black px-2 py-1.5 font-bold text-center whitespace-nowrap">
                    {item.data}
                  </td>
                  <td className="border border-black px-2 py-1.5 font-medium text-center whitespace-nowrap">
                    {item.diaSemana}
                  </td>
                  <td className="border border-black px-2.5 py-1.5 font-bold text-left">
                    {item.pratoPrincipal}
                  </td>
                  <td className="border border-black px-2 py-1.5 font-normal text-left">
                    {item.acompanhamento}
                  </td>
                  <td className="border border-black px-2 py-1.5 font-normal text-left">
                    {item.guarnicao}
                  </td>
                  <td className="border border-black px-2 py-1.5 font-normal text-left">
                    {item.salada}
                  </td>
                  <td className="border border-black px-2 py-1.5 font-semibold text-center whitespace-nowrap">
                    {item.sobremesa}
                  </td>
                  <td className="border border-black px-1 py-1.5 text-center font-bold text-[9px] uppercase">
                    {item.feriado ? (
                      <span className="px-1 py-0.5 bg-black text-white font-bold rounded-xs tracking-wider">
                        {item.feriado}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rodapé Técnico Normatizado Conforme ABNT */}
        <div className="mt-2 pt-2 border-t border-black text-[9.5px] text-black leading-relaxed space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-normal">
            <div>
              <span className="font-bold">Fonte: </span>
              <span>Instituto Hermes / Serviço de Nutrição e Dietética (SND) • Alimentação Coletiva Hospitalar, Novembro de 2026.</span>
            </div>
            <div className="font-bold text-right">
              Página 1 de 1
            </div>
          </div>

          <div className="text-[9px] text-slate-800">
            <span className="font-bold">Notas: </span>
            <span>
              1. Cardápio sujeito a alterações eventuais por indisponibilidade de insumos no mercado local.
              2. Feriados Nacionais em 02/11/2026 (Finados) e 20/11/2026 (Dia Nacional de Zumbi e da Consciência Negra).
              3. Elaborado por Responsável Técnica Nutricionista (CRN-TO).
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
