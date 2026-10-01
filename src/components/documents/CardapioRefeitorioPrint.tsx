import React, { useState } from 'react';
import { ChefHat, Search, Calendar, Sparkles, Filter } from 'lucide-react';

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
  // SEMANA 1 - Vermelho
  {
    data: '01/10/2026',
    diaSemana: 'quinta-feira',
    pratoPrincipal: 'Carne assada + Linguiça',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Feijão tropeiro',
    salada: 'Repolho/Cenoura/Tomate/Alface',
    sobremesa: 'Laranja',
    semanaNum: 1,
    corHex: '#FF3333'
  },
  {
    data: '02/10/2026',
    diaSemana: 'sexta-feira',
    pratoPrincipal: 'Frango xadrez',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão espaguete alho e óleo',
    salada: 'Legumes cozidos',
    sobremesa: 'Gelatina',
    semanaNum: 1,
    corHex: '#FF3333'
  },
  {
    data: '03/10/2026',
    diaSemana: 'sábado',
    pratoPrincipal: 'Feijoada',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Farofa de Banana da Terra',
    salada: 'Repolho/Beterraba/Tomate',
    sobremesa: 'Gelatina',
    semanaNum: 1,
    corHex: '#FF3333'
  },
  {
    data: '04/10/2026',
    diaSemana: 'domingo',
    pratoPrincipal: 'Lasanha Bolonhesa',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Legumes Saute',
    salada: 'Repolho/Cenoura/Tomate/Alface',
    sobremesa: 'Paçoquinha',
    semanaNum: 1,
    corHex: '#FF3333'
  },

  // SEMANA 2 - Amarelo
  {
    data: '05/10/2026',
    diaSemana: 'segunda-feira',
    pratoPrincipal: 'Escondidinho de frango',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Batata palha',
    salada: 'Maionese de beterraba',
    sobremesa: 'Gelatina',
    feriado: 'FERIADO',
    semanaNum: 2,
    corHex: '#FFCC00'
  },
  {
    data: '06/10/2026',
    diaSemana: 'terça-feira',
    pratoPrincipal: 'Pernil em cubos + Tiras de Frango Mêss HST',
    acompanhamento: 'Arroz + Feijão PRETO',
    guarnicao: 'Macarrão espaguete alho e óleo',
    salada: 'Repolho Roxo/Pepino/Tomate',
    sobremesa: 'Gelatina',
    semanaNum: 2,
    corHex: '#FFCC00'
  },
  {
    data: '07/10/2026',
    diaSemana: 'quarta-feira',
    pratoPrincipal: 'Carne moída com legumes',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Purê de batata',
    salada: 'Macarronese',
    sobremesa: 'Gelatina',
    semanaNum: 2,
    corHex: '#FFCC00'
  },
  {
    data: '08/10/2026',
    diaSemana: 'quinta-feira',
    pratoPrincipal: 'Linguiça toscana + Coxinha da asa',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Polenta gratinada com queijo',
    salada: 'Alface/Cenoura/Repolho roxo',
    sobremesa: 'Paçoquinha',
    semanaNum: 2,
    corHex: '#FFCC00'
  },
  {
    data: '09/10/2026',
    diaSemana: 'sexta-feira',
    pratoPrincipal: 'Tiras suína ao molho escuro + Tiras de frango Mêss HST',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Creme de milho',
    salada: 'Alface/Cenoura/Repolho roxo',
    sobremesa: 'Gelatina',
    semanaNum: 2,
    corHex: '#FFCC00'
  },
  {
    data: '10/10/2026',
    diaSemana: 'sábado',
    pratoPrincipal: 'Carne moída com legumes',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão ao sugo',
    salada: 'Repolho Roxo/Pepino/Tomate',
    sobremesa: 'Gelatina',
    semanaNum: 2,
    corHex: '#FFCC00'
  },
  {
    data: '11/10/2026',
    diaSemana: 'domingo',
    pratoPrincipal: 'Lasanha de frango',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Legumes Saute',
    salada: 'Repolho/Beterraba/Tomate',
    sobremesa: 'Paçoquinha',
    semanaNum: 2,
    corHex: '#FFCC00'
  },

  // SEMANA 3 - Verde
  {
    data: '12/10/2026',
    diaSemana: 'segunda-feira',
    pratoPrincipal: 'Coxa e sobrecoxa assada',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Creme de milho',
    salada: 'Macarronese',
    sobremesa: 'Paçoquinha',
    feriado: 'FERIADO',
    semanaNum: 3,
    corHex: '#00CC66'
  },
  {
    data: '13/10/2026',
    diaSemana: 'terça-feira',
    pratoPrincipal: 'Chambari com mandioca',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Farofa de cebola',
    salada: 'Repolho/Cenoura/Tomate/Alface',
    sobremesa: 'Gelatina',
    semanaNum: 3,
    corHex: '#00CC66'
  },
  {
    data: '14/10/2026',
    diaSemana: 'quarta-feira',
    pratoPrincipal: 'Estrogonofe de frango',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Batata palha',
    salada: 'Repolho roxo/Pepino/Tomate',
    sobremesa: 'Gelatina',
    semanaNum: 3,
    corHex: '#00CC66'
  },
  {
    data: '15/10/2026',
    diaSemana: 'quinta-feira',
    pratoPrincipal: 'Linguiça toscana + Coxinha da asa',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Purê de batata',
    salada: 'Legumes cozidos',
    sobremesa: 'Laranja',
    semanaNum: 3,
    corHex: '#00CC66'
  },
  {
    data: '16/10/2026',
    diaSemana: 'sexta-feira',
    pratoPrincipal: 'Carne assada + Linguiça',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Feijão tropeiro',
    salada: 'Maionese de beterraba',
    sobremesa: 'Paçoquinha',
    semanaNum: 3,
    corHex: '#00CC66'
  },
  {
    data: '17/10/2026',
    diaSemana: 'sábado',
    pratoPrincipal: 'Frango xadrez',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão espaguete alho e óleo',
    salada: 'Repolho/Cenoura/Tomate/Alface',
    sobremesa: 'Gelatina',
    semanaNum: 3,
    corHex: '#00CC66'
  },
  {
    data: '18/10/2026',
    diaSemana: 'domingo',
    pratoPrincipal: 'Carne de Panela com Batata',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão parafuso alho e óleo',
    salada: 'Repolho/Cenoura/Tomate/Alface',
    sobremesa: 'Gelatina',
    semanaNum: 3,
    corHex: '#00CC66'
  },

  // SEMANA 4 - Azul / Ciano
  {
    data: '19/10/2026',
    diaSemana: 'segunda-feira',
    pratoPrincipal: 'Pernil em cubos + Tiras de Frango Mêss HST',
    acompanhamento: 'Arroz + Feijão PRETO',
    guarnicao: 'Farofa de Banana da Terra',
    salada: 'Repolho roxo/Pepino/Tomate',
    sobremesa: 'Paçoquinha',
    semanaNum: 4,
    corHex: '#00BFFF'
  },
  {
    data: '20/10/2026',
    diaSemana: 'terça-feira',
    pratoPrincipal: 'Escondidinho de frango',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Batata palha',
    salada: 'Repolho/Beterraba/Tomate',
    sobremesa: 'Paçoquinha',
    semanaNum: 4,
    corHex: '#00BFFF'
  },
  {
    data: '21/10/2026',
    diaSemana: 'quarta-feira',
    pratoPrincipal: 'Carne moída com legumes',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão espaguete alho e óleo',
    salada: 'Maionese de beterraba',
    sobremesa: 'Laranja',
    semanaNum: 4,
    corHex: '#00BFFF'
  },
  {
    data: '22/10/2026',
    diaSemana: 'quinta-feira',
    pratoPrincipal: 'Feijoada + Bife de frango Mêss HST',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Farofa de cebola',
    salada: 'Repolho/Cenoura/Tomate/Alface',
    sobremesa: 'Gelatina',
    semanaNum: 4,
    corHex: '#00BFFF'
  },
  {
    data: '23/10/2026',
    diaSemana: 'sexta-feira',
    pratoPrincipal: 'Coxa e sobrecoxa assada',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Legumes saute',
    salada: 'Repolho roxo/Pepino/Tomate',
    sobremesa: 'Gelatina',
    semanaNum: 4,
    corHex: '#00BFFF'
  },
  {
    data: '24/10/2026',
    diaSemana: 'sábado',
    pratoPrincipal: 'Carne de Panela com Batata',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Polenta gratinada com queijo',
    salada: 'Repolho/Beterraba/Tomate',
    sobremesa: 'Paçoquinha',
    semanaNum: 4,
    corHex: '#00BFFF'
  },
  {
    data: '25/10/2026',
    diaSemana: 'domingo',
    pratoPrincipal: 'Tiras suína ao molho escuro + Tiras de carne Mêss HST',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão espaguete alho e óleo',
    salada: 'Repolho/Cenoura/Tomate/Alface',
    sobremesa: 'Paçoquinha',
    semanaNum: 4,
    corHex: '#00BFFF'
  },

  // SEMANA 5 - Laranja
  {
    data: '26/10/2026',
    diaSemana: 'segunda-feira',
    pratoPrincipal: 'Frango xadrez',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão espaguete alho e óleo',
    salada: 'Repolho/Beterraba/Tomate',
    sobremesa: 'Laranja',
    semanaNum: 5,
    corHex: '#FF8000'
  },
  {
    data: '27/10/2026',
    diaSemana: 'terça-feira',
    pratoPrincipal: 'Escondidinho de carne',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Batata palha',
    salada: 'Macarronese',
    sobremesa: 'Gelatina',
    semanaNum: 5,
    corHex: '#FF8000'
  },
  {
    data: '28/10/2026',
    diaSemana: 'quarta-feira',
    pratoPrincipal: 'Linguiça toscana + Coxinha da asa',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Macarrão ao sugo',
    salada: 'Repolho roxo/Pepino/Tomate',
    sobremesa: 'Gelatina',
    semanaNum: 5,
    corHex: '#FF8000'
  },
  {
    data: '29/10/2026',
    diaSemana: 'quinta-feira',
    pratoPrincipal: 'Coxa e sobrecoxa assada',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Polenta gratinada com queijo',
    salada: 'Legumes cozidos',
    sobremesa: 'Paçoquinha',
    semanaNum: 5,
    corHex: '#FF8000'
  },
  {
    data: '30/10/2026',
    diaSemana: 'sexta-feira',
    pratoPrincipal: 'Pernil em cubos + Bife de Frango Mêss HST',
    acompanhamento: 'Arroz + Feijão PRETO',
    guarnicao: 'Purê de batata',
    salada: 'Maionese de beterraba',
    sobremesa: 'Paçoquinha',
    semanaNum: 5,
    corHex: '#FF8000'
  },
  {
    data: '31/10/2026',
    diaSemana: 'sábado',
    pratoPrincipal: 'Fricasse de Frango',
    acompanhamento: 'Arroz + Feijão carioca',
    guarnicao: 'Batata palha',
    salada: 'Repolho/Cenoura/Tomate/Alface',
    sobremesa: 'Gelatina',
    semanaNum: 5,
    corHex: '#FF8000'
  }
];

export const CardapioRefeitorioPrint: React.FC = () => {
  const [filterText, setFilterText] = useState('');
  const [selectedSemana, setSelectedSemana] = useState<number | 'todas'>('todas');

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

  return (
    <div className="w-full bg-white text-black p-2 sm:p-6 max-w-[1250px] mx-auto text-xs print:p-0 print:m-0 print:border-none">
      {/* Barra de Filtro Rápido e Atalhos (Apenas em tela) */}
      <div className="mb-4 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs print:hidden shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#0E7B86]" />
            Filtrar Semana:
          </span>
          <button
            type="button"
            onClick={() => setSelectedSemana('todas')}
            className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              selectedSemana === 'todas'
                ? 'bg-[#0E7B86] text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Mês Completo (31 Dias)
          </button>
          {[
            { num: 1, label: 'Semana 1', color: 'bg-red-500' },
            { num: 2, label: 'Semana 2', color: 'bg-amber-400' },
            { num: 3, label: 'Semana 3', color: 'bg-emerald-500' },
            { num: 4, label: 'Semana 4', color: 'bg-sky-400' },
            { num: 5, label: 'Semana 5', color: 'bg-orange-500' }
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setSelectedSemana(s.num)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                selectedSemana === s.num
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${s.color}`}></span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Pesquisar prato, sobremesa, data..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E7B86]"
          />
        </div>
      </div>

      {/* DOCUMENTO OFICIAL A4 PARA IMPRESSÃO / VISUALIZAÇÃO */}
      <div 
        className="bg-white text-black p-4 sm:p-6 border border-black shadow-sm print:border-none print:shadow-none print:p-0"
        style={{ 
          fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact'
        }}
      >
        {/* Top Header Colaborador */}
        <div className="text-center font-bold tracking-widest text-[13px] uppercase py-1 border-b border-black mb-1">
          COLABORADOR
        </div>

        {/* Header Principal com Logo Master Massas e Título */}
        <div className="border border-black flex items-center justify-between p-2 mb-2 bg-white">
          <div className="flex items-center gap-2 w-1/4">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-300 rounded-lg">
              <ChefHat className="w-5 h-5 text-amber-600" />
              <div className="leading-tight">
                <span className="font-extrabold text-[12px] text-amber-900 tracking-tight block">Master Massas</span>
                <span className="text-[8px] font-semibold text-amber-700 uppercase tracking-widest">Alimentação</span>
              </div>
            </div>
          </div>

          <div className="w-2/4 text-center">
            <h1 className="font-black text-sm sm:text-base tracking-wide uppercase text-black">
              CARDÁPIO ROTATIVO REFEITÓRIO – OUTUBRO 2026
            </h1>
          </div>

          <div className="w-1/4 text-right text-[10px] text-slate-600 font-semibold pr-2">
            Refeitório Hospitalar
          </div>
        </div>

        {/* Tabela do Cardápio Completo */}
        <div className="overflow-x-auto">
          <table 
            className="w-full border-collapse border border-black text-black text-[11px] leading-tight"
            style={{ borderCollapse: 'collapse', border: '1.5px solid #000000' }}
          >
            <thead>
              <tr className="bg-slate-100 text-black font-bold uppercase text-center border-b border-black">
                <th className="border border-black px-2 py-2 w-[85px]">Data</th>
                <th className="border border-black px-2 py-2 w-[105px]">Semana</th>
                <th className="border border-black px-2.5 py-2 text-left w-[240px]">PRATO PRINCIPAL</th>
                <th className="border border-black px-2.5 py-2 text-left w-[170px]">ACOMPANHAMENTO</th>
                <th className="border border-black px-2.5 py-2 text-left w-[190px]">GUARNIÇÃO</th>
                <th className="border border-black px-2.5 py-2 text-left w-[190px]">Salada</th>
                <th className="border border-black px-2 py-2 text-center w-[110px]">Sobremesa</th>
                <th className="border border-black px-2 py-2 text-center w-[80px]">Obs</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, idx) => {
                return (
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
                    <td className="border border-black px-2 py-1.5 font-medium text-center whitespace-nowrap capitalize">
                      {item.diaSemana}
                    </td>
                    <td className="border border-black px-2.5 py-1.5 font-bold text-left">
                      {item.pratoPrincipal}
                    </td>
                    <td className="border border-black px-2.5 py-1.5 font-medium text-left">
                      {item.acompanhamento}
                    </td>
                    <td className="border border-black px-2.5 py-1.5 font-medium text-left">
                      {item.guarnicao}
                    </td>
                    <td className="border border-black px-2.5 py-1.5 font-medium text-left">
                      {item.salada}
                    </td>
                    <td className="border border-black px-2 py-1.5 font-semibold text-center whitespace-nowrap">
                      {item.sobremesa}
                    </td>
                    <td className="border border-black px-1.5 py-1.5 text-center font-black text-[10px] uppercase">
                      {item.feriado ? (
                        <span className="px-1.5 py-0.5 bg-black text-white rounded font-black text-[9px] tracking-wider">
                          {item.feriado}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Rodapé do Documento */}
        <div className="mt-3 pt-2 border-t border-black flex items-center justify-between text-[10px] text-slate-700 font-medium">
          <div>
            <span>Nutrição & Gastronomia Hospitalar • Master Massas</span>
          </div>
          <div className="font-bold">
            Página 1
          </div>
          <div>
            <span>Mês de Referência: Outubro / 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
