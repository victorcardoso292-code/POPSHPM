import React, { useState } from 'react';
import { ChefHat, Search, Filter, BookOpen, Printer } from 'lucide-react';

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

export const CARDAPIO_OUTUBRO_2026: CardapioItem[] = [
  // SEMANA 1 - Vermelho suave normatizado
  {
    data: '01/10/2026',
    diaSemana: 'Quinta-feira',
    pratoPrincipal: 'Carne assada + Linguiça',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Feijão tropeiro',
    salada: 'Repolho / Cenoura / Tomate / Alface',
    sobremesa: 'Laranja',
    semanaNum: 1,
    corHex: '#FFD6D6'
  },
  {
    data: '02/10/2026',
    diaSemana: 'Sexta-feira',
    pratoPrincipal: 'Frango xadrez',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão espaguete alho e óleo',
    salada: 'Legumes cozidos',
    sobremesa: 'Gelatina',
    semanaNum: 1,
    corHex: '#FFD6D6'
  },
  {
    data: '03/10/2026',
    diaSemana: 'Sábado',
    pratoPrincipal: 'Feijoada',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Farofa de Banana da Terra',
    salada: 'Repolho / Beterraba / Tomate',
    sobremesa: 'Gelatina',
    semanaNum: 1,
    corHex: '#FFD6D6'
  },
  {
    data: '04/10/2026',
    diaSemana: 'Domingo',
    pratoPrincipal: 'Lasanha Bolonhesa',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Legumes Saute',
    salada: 'Repolho / Cenoura / Tomate / Alface',
    sobremesa: 'Paçoquinha',
    semanaNum: 1,
    corHex: '#FFD6D6'
  },

  // SEMANA 2 - Amarelo suave normatizado
  {
    data: '05/10/2026',
    diaSemana: 'Segunda-feira',
    pratoPrincipal: 'Escondidinho de frango',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Batata palha',
    salada: 'Maionese de beterraba',
    sobremesa: 'Gelatina',
    feriado: 'FERIADO',
    semanaNum: 2,
    corHex: '#FFF2B2'
  },
  {
    data: '06/10/2026',
    diaSemana: 'Terça-feira',
    pratoPrincipal: 'Pernil em cubos + Tiras de Frango Mêss HST',
    acompanhamento: 'Arroz + Feijão PRETO',
    guarnicao: 'Macarrão espaguete alho e óleo',
    salada: 'Repolho Roxo / Pepino / Tomate',
    sobremesa: 'Gelatina',
    semanaNum: 2,
    corHex: '#FFF2B2'
  },
  {
    data: '07/10/2026',
    diaSemana: 'Quarta-feira',
    pratoPrincipal: 'Carne moída com legumes',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Purê de batata',
    salada: 'Macarronese',
    sobremesa: 'Gelatina',
    semanaNum: 2,
    corHex: '#FFF2B2'
  },
  {
    data: '08/10/2026',
    diaSemana: 'Quinta-feira',
    pratoPrincipal: 'Linguiça toscana + Coxinha da asa',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Polenta gratinada com queijo',
    salada: 'Alface / Cenoura / Repolho roxo',
    sobremesa: 'Paçoquinha',
    semanaNum: 2,
    corHex: '#FFF2B2'
  },
  {
    data: '09/10/2026',
    diaSemana: 'Sexta-feira',
    pratoPrincipal: 'Tiras suína ao molho escuro + Tiras de frango Mêss HST',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Creme de milho',
    salada: 'Alface / Cenoura / Repolho roxo',
    sobremesa: 'Gelatina',
    semanaNum: 2,
    corHex: '#FFF2B2'
  },
  {
    data: '10/10/2026',
    diaSemana: 'Sábado',
    pratoPrincipal: 'Carne moída com legumes',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão ao sugo',
    salada: 'Repolho Roxo / Pepino / Tomate',
    sobremesa: 'Gelatina',
    semanaNum: 2,
    corHex: '#FFF2B2'
  },
  {
    data: '11/10/2026',
    diaSemana: 'Domingo',
    pratoPrincipal: 'Lasanha de frango',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Legumes Saute',
    salada: 'Repolho / Beterraba / Tomate',
    sobremesa: 'Paçoquinha',
    semanaNum: 2,
    corHex: '#FFF2B2'
  },

  // SEMANA 3 - Verde suave normatizado
  {
    data: '12/10/2026',
    diaSemana: 'Segunda-feira',
    pratoPrincipal: 'Coxa e sobrecoxa assada',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Creme de milho',
    salada: 'Macarronese',
    sobremesa: 'Paçoquinha',
    feriado: 'FERIADO',
    semanaNum: 3,
    corHex: '#D4F5E1'
  },
  {
    data: '13/10/2026',
    diaSemana: 'Terça-feira',
    pratoPrincipal: 'Chambari com mandioca',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Farofa de cebola',
    salada: 'Repolho / Cenoura / Tomate / Alface',
    sobremesa: 'Gelatina',
    semanaNum: 3,
    corHex: '#D4F5E1'
  },
  {
    data: '14/10/2026',
    diaSemana: 'Quarta-feira',
    pratoPrincipal: 'Estrogonofe de frango',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Batata palha',
    salada: 'Repolho roxo / Pepino / Tomate',
    sobremesa: 'Gelatina',
    semanaNum: 3,
    corHex: '#D4F5E1'
  },
  {
    data: '15/10/2026',
    diaSemana: 'Quinta-feira',
    pratoPrincipal: 'Linguiça toscana + Coxinha da asa',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Purê de batata',
    salada: 'Legumes cozidos',
    sobremesa: 'Laranja',
    semanaNum: 3,
    corHex: '#D4F5E1'
  },
  {
    data: '16/10/2026',
    diaSemana: 'Sexta-feira',
    pratoPrincipal: 'Carne assada + Linguiça',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Feijão tropeiro',
    salada: 'Maionese de beterraba',
    sobremesa: 'Paçoquinha',
    semanaNum: 3,
    corHex: '#D4F5E1'
  },
  {
    data: '17/10/2026',
    diaSemana: 'Sábado',
    pratoPrincipal: 'Frango xadrez',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão espaguete alho e óleo',
    salada: 'Repolho / Cenoura / Tomate / Alface',
    sobremesa: 'Gelatina',
    semanaNum: 3,
    corHex: '#D4F5E1'
  },
  {
    data: '18/10/2026',
    diaSemana: 'Domingo',
    pratoPrincipal: 'Carne de Panela com Batata',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão parafuso alho e óleo',
    salada: 'Repolho / Cenoura / Tomate / Alface',
    sobremesa: 'Gelatina',
    semanaNum: 3,
    corHex: '#D4F5E1'
  },

  // SEMANA 4 - Azul suave normatizado
  {
    data: '19/10/2026',
    diaSemana: 'Segunda-feira',
    pratoPrincipal: 'Pernil em cubos + Tiras de Frango Mêss HST',
    acompanhamento: 'Arroz + Feijão PRETO',
    guarnicao: 'Farofa de Banana da Terra',
    salada: 'Repolho roxo / Pepino / Tomate',
    sobremesa: 'Paçoquinha',
    semanaNum: 4,
    corHex: '#D6EFFF'
  },
  {
    data: '20/10/2026',
    diaSemana: 'Terça-feira',
    pratoPrincipal: 'Escondidinho de frango',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Batata palha',
    salada: 'Repolho / Beterraba / Tomate',
    sobremesa: 'Paçoquinha',
    semanaNum: 4,
    corHex: '#D6EFFF'
  },
  {
    data: '21/10/2026',
    diaSemana: 'Quarta-feira',
    pratoPrincipal: 'Carne moída com legumes',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão espaguete alho e óleo',
    salada: 'Maionese de beterraba',
    sobremesa: 'Laranja',
    semanaNum: 4,
    corHex: '#D6EFFF'
  },
  {
    data: '22/10/2026',
    diaSemana: 'Quinta-feira',
    pratoPrincipal: 'Feijoada + Bife de frango Mêss HST',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Farofa de cebola',
    salada: 'Repolho / Cenoura / Tomate / Alface',
    sobremesa: 'Gelatina',
    semanaNum: 4,
    corHex: '#D6EFFF'
  },
  {
    data: '23/10/2026',
    diaSemana: 'Sexta-feira',
    pratoPrincipal: 'Coxa e sobrecoxa assada',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Legumes saute',
    salada: 'Repolho roxo / Pepino / Tomate',
    sobremesa: 'Gelatina',
    semanaNum: 4,
    corHex: '#D6EFFF'
  },
  {
    data: '24/10/2026',
    diaSemana: 'Sábado',
    pratoPrincipal: 'Carne de Panela com Batata',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Polenta gratinada com queijo',
    salada: 'Repolho / Beterraba / Tomate',
    sobremesa: 'Paçoquinha',
    semanaNum: 4,
    corHex: '#D6EFFF'
  },
  {
    data: '25/10/2026',
    diaSemana: 'Domingo',
    pratoPrincipal: 'Tiras suína ao molho escuro + Tiras de carne Mêss HST',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão espaguete alho e óleo',
    salada: 'Repolho / Cenoura / Tomate / Alface',
    sobremesa: 'Paçoquinha',
    semanaNum: 4,
    corHex: '#D6EFFF'
  },

  // SEMANA 5 - Laranja suave normatizado
  {
    data: '26/10/2026',
    diaSemana: 'Segunda-feira',
    pratoPrincipal: 'Frango xadrez',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão espaguete alho e óleo',
    salada: 'Repolho / Beterraba / Tomate',
    sobremesa: 'Laranja',
    semanaNum: 5,
    corHex: '#FFE2CC'
  },
  {
    data: '27/10/2026',
    diaSemana: 'Terça-feira',
    pratoPrincipal: 'Escondidinho de carne',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Batata palha',
    salada: 'Macarronese',
    sobremesa: 'Gelatina',
    semanaNum: 5,
    corHex: '#FFE2CC'
  },
  {
    data: '28/10/2026',
    diaSemana: 'Quarta-feira',
    pratoPrincipal: 'Linguiça toscana + Coxinha da asa',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão ao sugo',
    salada: 'Repolho roxo / Pepino / Tomate',
    sobremesa: 'Gelatina',
    semanaNum: 5,
    corHex: '#FFE2CC'
  },
  {
    data: '29/10/2026',
    diaSemana: 'Quinta-feira',
    pratoPrincipal: 'Coxa e sobrecoxa assada',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Polenta gratinada com queijo',
    salada: 'Legumes cozidos',
    sobremesa: 'Paçoquinha',
    semanaNum: 5,
    corHex: '#FFE2CC'
  },
  {
    data: '30/10/2026',
    diaSemana: 'Sexta-feira',
    pratoPrincipal: 'Pernil em cubos + Bife de Frango Mêss HST',
    acompanhamento: 'Arroz + Feijão PRETO',
    guarnicao: 'Purê de batata',
    salada: 'Maionese de beterraba',
    sobremesa: 'Paçoquinha',
    semanaNum: 5,
    corHex: '#FFE2CC'
  },
  {
    data: '31/10/2026',
    diaSemana: 'Sábado',
    pratoPrincipal: 'Fricasse de Frango',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Batata palha',
    salada: 'Repolho / Cenoura / Tomate / Alface',
    sobremesa: 'Gelatina',
    semanaNum: 5,
    corHex: '#FFE2CC'
  }
];

export const CardapioRefeitorioPrint: React.FC = () => {
  const [filterText, setFilterText] = useState('');
  const [selectedSemana, setSelectedSemana] = useState<number | 'todas'>('todas');
  // Seletor de tipografia estrita ABNT: Arial (padrão técnico) ou Times New Roman (padrão clássico)
  const [abntFont, setAbntFont] = useState<'arial' | 'times'>('arial');

  const filteredItems = CARDAPIO_OUTUBRO_2026.filter((item) => {
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
            Mês Completo
          </button>
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setSelectedSemana(num)}
              className={`px-2 py-1 rounded-md font-bold text-[11px] transition-all cursor-pointer ${
                selectedSemana === num
                  ? 'bg-[#0E7B86] text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Semana {num}
            </button>
          ))}
        </div>

        {/* Busca */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Pesquisar prato, sobremesa..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E7B86]"
          />
        </div>
      </div>

      {/* DOCUMENTO OFICIAL A4 FORMATADO SEGUNDO NORMAS ABNT */}
      <div 
        className="bg-white text-black p-6 sm:p-8 border border-slate-300 shadow-sm print:border-none print:shadow-none print:p-0"
        style={{ 
          ...fontStyle,
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
          lineHeight: '1.2'
        }}
      >
        {/* Cabeçalho Institucional Padrão ABNT */}
        <div className="text-center pb-2 mb-3 border-b-2 border-black">
          <div className="flex items-center justify-between text-[11px] text-black font-normal mb-1">
            <span className="font-semibold tracking-wide">HOSPITAL PALMAS MEDICAL</span>
            <span className="text-[10px] tracking-widest uppercase">PADRÃO INSTITUCIONAL ABNT</span>
            <span className="font-semibold">SND / MASTER MASSAS</span>
          </div>

          <h2 className="text-[13px] sm:text-[14px] font-bold text-black uppercase tracking-wider my-0.5">
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
            <span className="font-normal"> – Programação Nutricional e Cardápio Rotativo do Refeitório (Outubro de 2026)</span>
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
            
            {/* Corpo com Linhas das Semanas Coloridas e Tipografia Escura Nítida */}
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
              <span>Serviço de Nutrição e Dietética (SND) / Master Massas Alimentação Coletiva, 2026.</span>
            </div>
            <div className="font-bold text-right">
              Página 1 de 1
            </div>
          </div>

          <div className="text-[9px] text-slate-800">
            <span className="font-bold">Notas: </span>
            <span>
              1. Cardápio sujeito a alterações eventuais por indisponibilidade de insumos no mercado local.
              2. Feriados em 05/10/2026 (Criação do Estado do Tocantins) e 12/10/2026 (Nossa Senhora Aparecida).
              3. Elaborado por Responsável Técnica Nutricionista (CRN-TO).
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
