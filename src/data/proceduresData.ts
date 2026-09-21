import { HospitalProcedure } from '../types';

export const PROCEDURES_METADATA = {
  vigencia: 'A partir de 01/07/2026',
  atualizacao: 'Valores do hospital atualizados sem honorários e sem OPMES',
  formasPagamento: [
    'Dinheiro',
    'Cartão de Débito',
    'Transferência / PIX',
    'Em até 6x no cartão de crédito'
  ],
  contatoSetor: {
    setor: 'Orçamento do Hospital',
    telefone: '(63) 99989-1818',
    telefoneRaw: '63999891818',
    horario: 'Segunda a Sexta - 08h às 18h'
  },
  medicosEspecificos: [
    'DIEGO MOREIRA',
    'THIAGO IKEDA',
    'HIWRY VINÍCIUS',
    'SAULO'
  ],
  avisoMedicosEspecificos:
    '!!! MUITA ATENÇÃO !!!!! Estes valores são exclusivos e aplicáveis SOMENTE para os médicos: DIEGO MOREIRA, THIAGO IKEDA, HIWRY VINÍCIUS e SAULO. O recebimento ou cobrança de valores não constantes nesta tabela causa desconforto e constrangimento entre médico e hospital. Na dúvida, consulte o setor responsável de orçamentos do hospital.'
};

export const PROCEDIMENTOS_MEDICOS_ESPECIFICOS: HospitalProcedure[] = [
  {
    id: 'pme-1',
    description: 'PROTESE DE MAMA',
    diarias: '1',
    price: 4620.00,
    category: 'Cirurgia Plástica',
    tableType: 'medicos-especificos',
    notes: 'Exclusivo para Dr. Diego Moreira, Dr. Thiago Ikeda, Dr. Hiwry Vinícius e Dr. Saulo. Sem honorários e sem OPMES.'
  },
  {
    id: 'pme-2',
    description: 'MASTOPEXIA',
    diarias: '1',
    price: 5160.00,
    category: 'Cirurgia Plástica',
    tableType: 'medicos-especificos',
    notes: 'Exclusivo para Dr. Diego Moreira, Dr. Thiago Ikeda, Dr. Hiwry Vinícius e Dr. Saulo. Sem honorários e sem OPMES.'
  },
  {
    id: 'pme-3',
    description: 'PROTESE + MASTOPEXIA',
    diarias: '1',
    price: 5160.00,
    category: 'Cirurgia Plástica',
    tableType: 'medicos-especificos',
    notes: 'Exclusivo para Dr. Diego Moreira, Dr. Thiago Ikeda, Dr. Hiwry Vinícius e Dr. Saulo. Sem honorários e sem OPMES.'
  },
  {
    id: 'pme-4',
    description: 'LIPOASPIRAÇÃO',
    diarias: '1',
    price: 5400.00,
    category: 'Cirurgia Plástica',
    tableType: 'medicos-especificos',
    notes: 'Exclusivo para Dr. Diego Moreira, Dr. Thiago Ikeda, Dr. Hiwry Vinícius e Dr. Saulo. Sem honorários e sem OPMES.'
  },
  {
    id: 'pme-5',
    description: 'LIPO + ABDOMEM',
    diarias: '1',
    price: 6960.00,
    category: 'Cirurgia Plástica',
    tableType: 'medicos-especificos',
    notes: 'Exclusivo para Dr. Diego Moreira, Dr. Thiago Ikeda, Dr. Hiwry Vinícius e Dr. Saulo. Sem honorários e sem OPMES.'
  },
  {
    id: 'pme-6',
    description: 'LIPO + MASTOPEXIA',
    diarias: '1',
    price: 6840.00,
    category: 'Cirurgia Plástica',
    tableType: 'medicos-especificos',
    notes: 'Exclusivo para Dr. Diego Moreira, Dr. Thiago Ikeda, Dr. Hiwry Vinícius e Dr. Saulo. Sem honorários e sem OPMES.'
  },
  {
    id: 'pme-7',
    description: 'ABDOMINOPLASTIA',
    diarias: '1',
    price: 5760.00,
    category: 'Cirurgia Plástica',
    tableType: 'medicos-especificos',
    notes: 'Exclusivo para Dr. Diego Moreira, Dr. Thiago Ikeda, Dr. Hiwry Vinícius e Dr. Saulo. Sem honorários e sem OPMES.'
  },
  {
    id: 'pme-8',
    description: 'LIPO + PROTESE',
    diarias: '1',
    price: 6600.00,
    category: 'Cirurgia Plástica',
    tableType: 'medicos-especificos',
    notes: 'Exclusivo para Dr. Diego Moreira, Dr. Thiago Ikeda, Dr. Hiwry Vinícius e Dr. Saulo. Sem honorários e sem OPMES.'
  },
  {
    id: 'pme-9',
    description: 'LIPO + GINECOMASTIA',
    diarias: '1',
    price: 5640.00,
    category: 'Cirurgia Plástica',
    tableType: 'medicos-especificos',
    notes: 'Exclusivo para Dr. Diego Moreira, Dr. Thiago Ikeda, Dr. Hiwry Vinícius e Dr. Saulo. Sem honorários e sem OPMES.'
  },
  {
    id: 'pme-10',
    description: 'LIPO + ABDOME + PROTESE',
    diarias: '1',
    price: 7800.00,
    category: 'Cirurgia Plástica',
    tableType: 'medicos-especificos',
    notes: 'Exclusivo para Dr. Diego Moreira, Dr. Thiago Ikeda, Dr. Hiwry Vinícius e Dr. Saulo. Sem honorários e sem OPMES.'
  },
  {
    id: 'pme-11',
    description: 'LIPO + ABDOME + MASTOPEXIA',
    diarias: '1',
    price: 8760.00,
    category: 'Cirurgia Plástica',
    tableType: 'medicos-especificos',
    notes: 'Exclusivo para Dr. Diego Moreira, Dr. Thiago Ikeda, Dr. Hiwry Vinícius e Dr. Saulo. Sem honorários e sem OPMES.'
  },
  {
    id: 'pme-12',
    description: 'RINOPLASTIA COM COSTECTOMIA',
    diarias: '1',
    price: 5280.00,
    category: 'Cirurgia Plástica',
    tableType: 'medicos-especificos',
    notes: 'Exclusivo para Dr. Diego Moreira, Dr. Thiago Ikeda, Dr. Hiwry Vinícius e Dr. Saulo. Sem honorários e sem OPMES.'
  }
];

export const PROCEDIMENTOS_GERAIS: HospitalProcedure[] = [
  // DIÁRIAS GLOBAIS (Page 1)
  {
    id: 'pg-1',
    description: 'Diária Global de Apartamento',
    diarias: 'ao dia',
    price: 2860.00,
    category: 'Diárias & Acomodações',
    tableType: 'geral',
    notes: 'Receber conforme prescrição médica.'
  },
  {
    id: 'pg-2',
    description: 'Diária Global de Enfermaria',
    diarias: 'ao dia',
    price: 2200.00,
    category: 'Diárias & Acomodações',
    tableType: 'geral',
    notes: 'Receber conforme prescrição médica.'
  },
  {
    id: 'pg-3',
    description: 'Diária Global de UTI',
    diarias: 'ao dia',
    price: 9600.00,
    category: 'Diárias & Acomodações',
    tableType: 'geral',
    notes: 'Receber conforme prescrição médica.'
  },
  {
    id: 'pg-4',
    description: 'Diária de UTI (Pós cirúrgico)',
    diarias: 'ao dia',
    price: 6800.00,
    category: 'Diárias & Acomodações',
    tableType: 'geral',
    notes: 'Receber conforme prescrição médica.'
  },
  {
    id: 'pg-5',
    description: 'Diária UPGRADE Enf p/ Apto (Diferença de acomodação)',
    diarias: 'ao dia',
    price: 569.25,
    category: 'Diárias & Acomodações',
    tableType: 'geral',
    notes: 'Receber conforme prescrição médica. Diferença diária por leito.'
  },

  // PROCEDIMENTOS CIRÚRGICOS & GERAIS - PAGE 1
  {
    id: 'pg-6',
    description: 'ABDOME + MASTOPEXIA',
    diarias: '1',
    price: 8580.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-7',
    description: 'ABDOME + MASTOPEXIA + LIPOESCULTURA',
    diarias: '1',
    price: 9636.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-8',
    description: 'ABDOME + MASTOPEXIA + LIPOESCULTURA + BLEFAROPLASTIA',
    diarias: '1',
    price: 10824.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-9',
    description: 'ABDOME + MASTOPEXIA + LIPOESCULTURA + COR. DE CICATRIZ',
    diarias: '1',
    price: 10824.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-10',
    description: 'ABDOME + MASTOPEXIA + LIPOESCULTURA + NINFOPLASTIA',
    diarias: '1',
    price: 10824.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-11',
    description: 'ABDOME + PROTESE DE MAMA',
    diarias: '1',
    price: 8580.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-12',
    description: 'ABDOMINOPLASTIA',
    diarias: '1',
    price: 6336.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-13',
    description: 'ABDOMINOPLASTIA + BLEFAROPLASTIA',
    diarias: '1',
    price: 7920.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-14',
    description: 'Adenoamigdalectomia',
    diarias: '0',
    price: 3960.00,
    category: 'Cabeça, Pescoço & Otorrino',
    tableType: 'geral'
  },
  {
    id: 'pg-15',
    description: 'Adenoidectomia',
    diarias: '0',
    price: 3300.00,
    category: 'Cabeça, Pescoço & Otorrino',
    tableType: 'geral'
  },
  {
    id: 'pg-16',
    description: 'ABLAÇÃO (DR FERNANDO GONDO)',
    diarias: '0',
    price: 12000.00,
    category: 'Cardio & Intervencionista',
    tableType: 'geral',
    notes: 'Procedimento com Dr. Fernando Gondo.'
  },
  {
    id: 'pg-17',
    description: 'Amigdalectomia',
    diarias: '0',
    price: 3300.00,
    category: 'Cabeça, Pescoço & Otorrino',
    tableType: 'geral'
  },
  {
    id: 'pg-18',
    description: 'Angioplastia / Incluso 1 Stent',
    diarias: '1',
    price: 16500.00,
    category: 'Cardio & Intervencionista',
    tableType: 'geral',
    notes: 'Incluso 1 Stent coronariano/vascular.'
  },
  {
    id: 'pg-19',
    description: 'Apendicectomia por Vídeo',
    diarias: '1 Apto',
    price: 5500.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral',
    notes: 'Acomodação em Apartamento.'
  },
  {
    id: 'pg-20',
    description: 'Apendicectomia por Vídeo',
    diarias: '1 Enf',
    price: 5280.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral',
    notes: 'Acomodação em Enfermaria.'
  },
  {
    id: 'pg-21',
    description: 'Biópsia de Linfonodo (Leito dia)',
    diarias: '0',
    price: 2640.00,
    category: 'Pequenas Cirurgias & Outros',
    tableType: 'geral'
  },
  {
    id: 'pg-22',
    description: 'BIÓPSIA GUIADA POR TC OU USG (DR FERNANDO GONDO)',
    diarias: '0',
    price: 5000.00,
    category: 'Pequenas Cirurgias & Outros',
    tableType: 'geral',
    notes: 'Guiada por Tomografia ou Ultrassom com Dr. Fernando Gondo.'
  },
  {
    id: 'pg-23',
    description: 'Biópsia de Próstata (Leito dia)',
    diarias: '0',
    price: 990.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-24',
    description: 'BLEFAROPLASTIA + LIPO DE CERVICAL',
    diarias: '1',
    price: 6600.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-25',
    description: 'BLEFAROPLASTIA (alta da RPA)',
    diarias: '0',
    price: 3600.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral',
    notes: 'Sem pernoite, alta direto da Recuperação Pós-Anestésica (RPA).'
  },
  {
    id: 'pg-26',
    description: 'BODYTITE / MORPHEUS',
    diarias: '0',
    price: 1800.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-27',
    description: 'BRAQUEOPLASTIA + ABDOME',
    diarias: '1',
    price: 7920.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-28',
    description: 'BRAQUEOPLASTIA + ABDOME + LIPOASPIRAÇÃO',
    diarias: '1',
    price: 8316.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-29',
    description: 'BRAQUEOPLASTIA + LIPOASPIRAÇÃO',
    diarias: '1',
    price: 6600.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-30',
    description: 'BRAQUEOPLASTIA + MASTOPEXIA',
    diarias: '1',
    price: 7260.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-31',
    description: 'BRAQUEOPLASTIA + PROTESE DE MAMA',
    diarias: '1',
    price: 6336.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-32',
    description: 'BRAQUEOPLASTIA / DERMOLIPECTOMIA DE BRAÇOS',
    diarias: '1',
    price: 5280.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-33',
    description: 'Cateterismo',
    diarias: '1',
    price: 2750.00,
    category: 'Cardio & Intervencionista',
    tableType: 'geral'
  },
  {
    id: 'pg-34',
    description: 'Cesariana - Feto Único Ou Múltiplo',
    diarias: '2 Apto',
    price: 6776.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '2 diárias em Apartamento.'
  },
  {
    id: 'pg-35',
    description: 'Cesariana com Laqueadura - Feto Único Ou Múltiplo',
    diarias: '2 Apto',
    price: 7172.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '2 diárias em Apartamento.'
  },
  {
    id: 'pg-36',
    description: 'Cirurgia Bariátrica',
    diarias: '3 Apto',
    price: 9460.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral',
    notes: '3 diárias em Apartamento.'
  },

  // PAGE 2
  {
    id: 'pg-37',
    description: 'Cistolitotripsia (Leito dia)',
    diarias: '0',
    price: 2904.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-38',
    description: 'Cistoscopia E/Ou Uretroscopia (Leito dia)',
    diarias: '0',
    price: 660.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-39',
    description: 'Colangiopancreatografia CPRE',
    diarias: '1 Apto',
    price: 3960.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral',
    notes: '1 diária em Apartamento.'
  },
  {
    id: 'pg-40',
    description: 'Colecistectomia Por Videolaparoscopia',
    diarias: '1 Apto',
    price: 5104.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral',
    notes: '1 diária em Apartamento.'
  },
  {
    id: 'pg-41',
    description: 'Colecistectomia Por Videolaparoscopia',
    diarias: '1 Enf',
    price: 4994.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral',
    notes: '1 diária em Enfermaria.'
  },
  {
    id: 'pg-42',
    description: 'Colocação de Prótese Peniana',
    diarias: '1',
    price: 4356.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-43',
    description: 'Colpoperineoplastia',
    diarias: '1 Apto',
    price: 4840.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-44',
    description: 'Conização do Colo do Útero',
    diarias: '1 Apto',
    price: 3256.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-45',
    description: 'CORREÇÃO DE CICATRIZ ABDOMINAL',
    diarias: '1',
    price: 3960.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-46',
    description: 'CORREÇÃO DE CICATRIZ ABDOMINAL + LIPOASPIRAÇÃO',
    diarias: '1',
    price: 6204.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-47',
    description: 'CORREÇÃO DE CICATRIZ ABDOMINAL + PROTESE DE MAMA',
    diarias: '1',
    price: 5720.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-48',
    description: 'CORREÇÃO DE CICATRIZ DE ABDOME E MAMA',
    diarias: '1',
    price: 5280.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-49',
    description: 'Correção de Hidrocele',
    diarias: '2 Apto',
    price: 3300.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '2 diárias em Apartamento.'
  },
  {
    id: 'pg-50',
    description: 'Correção de Hidrocele',
    diarias: '1 Enf',
    price: 3190.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '1 diária em Enfermaria.'
  },
  {
    id: 'pg-51',
    description: 'CORREÇÃO PROLAPSO CÚPULA VAGINAL',
    diarias: '1 Apto',
    price: 4840.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-52',
    description: 'COXOPLASTIA + BRAQUIOPLASTIA',
    diarias: '1',
    price: 6820.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-53',
    description: 'COXOPLASTIA + LIPOASPIRAÇÃO',
    diarias: '1',
    price: 6820.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-54',
    description: 'COXOPLASTIA / DERMOLIPECTOMIA DE COXAS',
    diarias: '1',
    price: 5280.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-55',
    description: 'Curetagem',
    diarias: '1 Apto',
    price: 3036.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-56',
    description: 'Desbridamento Cirúrgico - Por Unidade Topográfica (Ut)',
    diarias: '0',
    price: 3168.00,
    category: 'Pequenas Cirurgias & Outros',
    tableType: 'geral'
  },
  {
    id: 'pg-57',
    description: 'Drenagem de Abscesso',
    diarias: '0',
    price: 2860.00,
    category: 'Pequenas Cirurgias & Outros',
    tableType: 'geral'
  },
  {
    id: 'pg-58',
    description: 'Drenagem de Hematoma',
    diarias: '1',
    price: 3520.00,
    category: 'Pequenas Cirurgias & Outros',
    tableType: 'geral'
  },
  {
    id: 'pg-59',
    description: 'Eletrocauterização de Lesões (Leito dia)',
    diarias: '0',
    price: 333.96,
    category: 'Pequenas Cirurgias & Outros',
    tableType: 'geral'
  },
  {
    id: 'pg-60',
    description: 'Endometriose Peritonial - Tratamento Cirúrgico',
    diarias: '1 Apto',
    price: 5102.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-61',
    description: 'Endometriose Profunda - Tratamento Cirúrgico',
    diarias: '1 Apto',
    price: 5500.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-62',
    description: 'Endoscopia Digestiva Alta (Leito dia)',
    diarias: '0',
    price: 1320.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral'
  },
  {
    id: 'pg-63',
    description: 'Esvaziamento Cervical',
    diarias: '1 Apto',
    price: 4620.00,
    category: 'Cabeça, Pescoço & Otorrino',
    tableType: 'geral'
  },
  {
    id: 'pg-64',
    description: 'Exérese com Geral',
    diarias: '1 Apto',
    price: 3300.00,
    category: 'Pequenas Cirurgias & Outros',
    tableType: 'geral'
  },
  {
    id: 'pg-65',
    description: 'Exérese com Sedação',
    diarias: '0',
    price: 1980.00,
    category: 'Pequenas Cirurgias & Outros',
    tableType: 'geral'
  },
  {
    id: 'pg-66',
    description: 'Fechamento de Colostomia',
    diarias: '2 Apto',
    price: 7920.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral',
    notes: '2 diárias em Apartamento.'
  },
  {
    id: 'pg-67',
    description: 'Fístula anal',
    diarias: '1 Enf',
    price: 3124.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral',
    notes: '1 diária em Enfermaria.'
  },
  {
    id: 'pg-68',
    description: 'Fístula P/ Hemodiálise',
    diarias: '1',
    price: 2860.00,
    category: 'Cardio & Intervencionista',
    tableType: 'geral'
  },
  {
    id: 'pg-69',
    description: 'GIGANTOMASTIA (MAMA GIGANTE)',
    diarias: '1',
    price: 6336.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-70',
    description: 'GINECOMASTIA',
    diarias: '1',
    price: 3696.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-71',
    description: 'GINECOMASTIA + LIPOASPIRAÇÃO',
    diarias: '1',
    price: 6204.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-72',
    description: 'Gravidez Ectópica',
    diarias: '2 Apto',
    price: 4620.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '2 diárias em Apartamento.'
  },
  {
    id: 'pg-73',
    description: 'Hálux Valgo (Um Pé)',
    diarias: '1 Apto',
    price: 3520.00,
    category: 'Ortopedia & Traumatologia',
    tableType: 'geral',
    notes: '1 diária em Apartamento.'
  },

  // PAGE 3
  {
    id: 'pg-74',
    description: 'Hematoma Subdural Crônico',
    diarias: '2 Apto',
    price: 5500.00,
    category: 'Cabeça, Pescoço & Otorrino',
    tableType: 'geral',
    notes: '2 diárias em Apartamento.'
  },
  {
    id: 'pg-75',
    description: 'Hemorroidectomia',
    diarias: '1 Apto',
    price: 4180.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral',
    notes: '1 diária em Apartamento.'
  },
  {
    id: 'pg-76',
    description: 'Hemorroidectomia',
    diarias: '1 Enf',
    price: 3960.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral',
    notes: '1 diária em Enfermaria.'
  },
  {
    id: 'pg-77',
    description: 'Hérnia De Disco - Tratamento Cirúrgico',
    diarias: '1 Apto',
    price: 6204.00,
    category: 'Ortopedia & Traumatologia',
    tableType: 'geral',
    notes: '1 diária em Apartamento.'
  },
  {
    id: 'pg-78',
    description: 'Hérnia hiatal por vídeo - Esofagoplastia (Leito dia)',
    diarias: '0',
    price: 4440.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral'
  },
  {
    id: 'pg-79',
    description: 'Herniorrafia Inguinal / Umbilical / Incisional Unilateral / Bilateral',
    diarias: '1 Apto',
    price: 4640.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral',
    notes: '1 diária em Apartamento.'
  },
  {
    id: 'pg-80',
    description: 'Herniorrafia Inguinal / Umbilical / Incisional Unilateral / Bilateral',
    diarias: '1 Enf',
    price: 4440.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral',
    notes: '1 diária em Enfermaria.'
  },
  {
    id: 'pg-81',
    description: 'Hipospádia',
    diarias: '1 Apto',
    price: 3960.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-82',
    description: 'Histerectomia Abdominal Retirada Útero',
    diarias: '2 Apto',
    price: 5324.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '2 diárias em Apartamento.'
  },
  {
    id: 'pg-83',
    description: 'Histerectomia por Vídeo',
    diarias: '1 Apto',
    price: 5500.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '1 diária em Apartamento.'
  },
  {
    id: 'pg-84',
    description: 'Histerectomia Vaginal',
    diarias: '1 Apto',
    price: 5104.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '1 diária em Apartamento.'
  },
  {
    id: 'pg-85',
    description: 'Histeroscopia Cirúrgica',
    diarias: '1 Apto',
    price: 3300.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-86',
    description: 'Implante de Cateter p/ Quimio',
    diarias: '1',
    price: 2226.40,
    category: 'Pequenas Cirurgias & Outros',
    tableType: 'geral'
  },
  {
    id: 'pg-87',
    description: 'Implante e retirada de Duplo J (Leito dia)',
    diarias: '0',
    price: 1669.80,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-88',
    description: 'Laparoscopia + Anexectomia',
    diarias: '1',
    price: 9740.50,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-89',
    description: 'Laparoscopia com Aparelho',
    diarias: '1 Apto',
    price: 4840.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral'
  },
  {
    id: 'pg-90',
    description: 'Laparotomia',
    diarias: '1 Apto',
    price: 4840.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral'
  },
  {
    id: 'pg-91',
    description: 'Laqueadura',
    diarias: '1 Apto',
    price: 4620.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '1 diária em Apartamento.'
  },
  {
    id: 'pg-92',
    description: 'Laqueadura',
    diarias: '1 Enf',
    price: 4444.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '1 diária em Enfermaria.'
  },
  {
    id: 'pg-93',
    description: 'LIFTING FACIAL (INCLUI BLEFAROPLASTIA)',
    diarias: '1',
    price: 9240.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-94',
    description: 'LIFTING FACIAL + CERVICAL + BLEFAROPLASTIA',
    diarias: '1',
    price: 10560.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-95',
    description: 'LIFTING FACIAL + LIPOASPIRAÇÃO',
    diarias: '1',
    price: 8844.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-96',
    description: 'LIPO LIGHT (LIPO PEQUENA)',
    diarias: '0',
    price: 4224.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-97',
    description: 'LIPOASPIRAÇÃO',
    diarias: '1',
    price: 5940.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-98',
    description: 'LIPOASPIRAÇÃO + ABDOME',
    diarias: '1',
    price: 7656.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-99',
    description: 'LIPOASPIRAÇÃO + ABDOME + CORREÇÃO DE CICATRIZ MAMÁRIA',
    diarias: '1',
    price: 8316.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-100',
    description: 'LIPOASPIRAÇÃO + ABDOME + HISTERECTOMIA',
    diarias: '2',
    price: 9900.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral',
    notes: '2 diárias inclusas.'
  },
  {
    id: 'pg-101',
    description: 'LIPOASPIRAÇÃO + ABDOMEM + PROTESE DE MAMA',
    diarias: '1',
    price: 8580.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-102',
    description: 'LIPOASPIRAÇÃO + ABDOMEM + PROTESE DE MAMA + BLEFAROPLASTIA',
    diarias: '1',
    price: 9240.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-103',
    description: 'LIPOASPIRAÇÃO + ABDOMEM + PROTESE DE MAMA + LAQUEADURA',
    diarias: '1',
    price: 9240.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-104',
    description: 'LIPOASPIRAÇÃO + ABDOMEM + PROTESE DE MAMA + NINFOPLASTIA',
    diarias: '1',
    price: 9240.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-105',
    description: 'LIPOASPIRAÇÃO + ABDOMEM + TORSOPLASTIA',
    diarias: '1',
    price: 8316.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-106',
    description: 'LIPOASPIRAÇÃO + ABDOME + BLEFAROPLASTIA + LIFTING',
    diarias: '1',
    price: 10824.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-107',
    description: 'LIPOASPIRAÇÃO + FUSO DE PELE DE ABDOME',
    diarias: '1',
    price: 6380.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-108',
    description: 'LIPOASPIRAÇÃO + MASTOPEXIA',
    diarias: '1',
    price: 7524.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-109',
    description: 'LIPOASPIRAÇÃO + MASTOPEXIA + BLEFAROPLASTIA',
    diarias: '1',
    price: 9240.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-110',
    description: 'LIPOASPIRAÇÃO + MASTOPEXIA + CORREÇÃO DE CICATRIZ ABDOMINAL',
    diarias: '1',
    price: 8184.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },

  // PAGE 4
  {
    id: 'pg-111',
    description: 'LIPOASPIRAÇÃO + MASTOPEXIA + TORSOPLASTIA',
    diarias: '1',
    price: 8421.60,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-112',
    description: 'LIPOASPIRAÇÃO + MINI ABDOME + MAMA ACESSÓRIA',
    diarias: '1',
    price: 7550.40,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-113',
    description: 'LIPOASPIRAÇÃO + MINI ABDOME + MASTOPEXIA',
    diarias: '1',
    price: 7920.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-114',
    description: 'LIPOASPIRAÇÃO + MINI ABDOME + NINFOPLASTIA',
    diarias: '1',
    price: 7550.40,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-115',
    description: 'LIPOASPIRAÇÃO + MINI-ABDOMEM + PRÓTESE MAMA',
    diarias: '1',
    price: 7392.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-116',
    description: 'LIPOASPIRAÇÃO + NINFOPLASTIA',
    diarias: '1',
    price: 6864.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-117',
    description: 'LIPOASPIRAÇÃO + NINFOPLASTIA + MASTOPEXIA',
    diarias: '1',
    price: 7986.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-118',
    description: 'LIPOASPIRAÇÃO + PRÓTESE DE GLÚTEO',
    diarias: '1',
    price: 6600.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-119',
    description: 'LIPOASPIRAÇÃO + PRÓTESE DE MAMA',
    diarias: '1',
    price: 6600.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-120',
    description: 'LIPOASPIRAÇÃO + PRÓTESE DE MAMA + HÉRNIA INGUINAL / UMBILICAL',
    diarias: '1',
    price: 7656.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-121',
    description: 'LIPOASPIRAÇÃO + PRÓTESE DE MAMA + MAMA ACESSÓRIA',
    diarias: '1',
    price: 6534.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-122',
    description: 'LIPOENXERTIA EM MAMA',
    diarias: '1',
    price: 5148.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-123',
    description: 'MAMA ACESSÓRIA',
    diarias: '1',
    price: 3300.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-124',
    description: 'MAMA ACESSÓRIA + PRÓTESE DE MAMA',
    diarias: '1',
    price: 5280.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-125',
    description: 'MAMOPLASTIA + MAMA ACESSÓRIA',
    diarias: '1',
    price: 5940.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-126',
    description: 'MAMOPLASTIA + MENTOPLASTIA',
    diarias: '1',
    price: 7260.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-127',
    description: 'MAMOPLASTIA + NINFOPLASTIA',
    diarias: '1',
    price: 6468.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-128',
    description: 'MAMOPLASTIA + NINFOPLASTIA C/ ENXERTO',
    diarias: '1',
    price: 6468.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-129',
    description: 'MAMOPLASTIA + OTOPLASTIA',
    diarias: '1',
    price: 6336.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-130',
    description: 'MAMOPLASTIA REDUTORA',
    diarias: '1',
    price: 6006.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-131',
    description: 'MAMOPLASTIA REDUTORA + OOFORECTOMIA',
    diarias: '1',
    price: 7840.80,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-132',
    description: 'MAMOPLASTIA / MASTOPEXIA (COM OU SEM PRÓTESE)',
    diarias: '1',
    price: 5676.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-133',
    description: 'MASTOPEXIA + BLEFAROPLASTIA',
    diarias: '1',
    price: 6600.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-134',
    description: 'MASTOPEXIA + CORREÇÃO DE CICATRIZ ABDOMINAL',
    diarias: '1',
    price: 6600.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-135',
    description: 'MASTOPEXIA + PRÓTESE DE GLÚTEO',
    diarias: '1',
    price: 7260.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-136',
    description: 'MINI ABDOME',
    diarias: '1',
    price: 4224.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-137',
    description: 'MINI ABDOME + LIPOASPIRAÇÃO',
    diarias: '1',
    price: 6600.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-138',
    description: 'MINI LIFTING',
    diarias: '1',
    price: 5940.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-139',
    description: 'MINI-ABDOME + MAMOPLASTIA',
    diarias: '1',
    price: 6600.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-140',
    description: 'MINI-ABDOME + PRÓTESE DE MAMA',
    diarias: '1',
    price: 5280.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-141',
    description: 'Miomectomia',
    diarias: '1 Apto',
    price: 4840.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '1 diária em Apartamento.'
  },
  {
    id: 'pg-142',
    description: 'Nefrectomia por Vídeo',
    diarias: '2 Apto',
    price: 6864.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '2 diárias em Apartamento.'
  },
  {
    id: 'pg-143',
    description: 'Nefrectomia Radical Unilateral',
    diarias: '3 Apto',
    price: 9350.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '3 diárias em Apartamento.'
  },
  {
    id: 'pg-144',
    description: 'Nefrolitotripsia percutânea',
    diarias: '1 Apto',
    price: 6336.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '1 diária em Apartamento.'
  },
  {
    id: 'pg-145',
    description: 'NINFOPLASTIA',
    diarias: '1',
    price: 2772.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-146',
    description: 'NINFOPLASTIA + LIPOASPIRAÇÃO',
    diarias: '1',
    price: 6534.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-147',
    description: 'NINFOPLASTIA + LIPOASPIRAÇÃO + ABDOME',
    diarias: '1',
    price: 7986.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },

  // PAGE 5
  {
    id: 'pg-148',
    description: 'NINFOPLASTIA + PRÓTESE DE MAMA',
    diarias: '1',
    price: 4884.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-149',
    description: 'NINFOPLASTIA + PRÓTESE DE MAMA + OTOPLASTIA',
    diarias: '1',
    price: 5544.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-150',
    description: 'Nódulo de Mama (Leito dia)',
    diarias: '0',
    price: 2376.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral'
  },
  {
    id: 'pg-151',
    description: 'Ooforectomia / Ooforoplastia',
    diarias: '1 Apto',
    price: 5104.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-152',
    description: 'Orquidopexia unilateral (Leito dia)',
    diarias: '0',
    price: 2376.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-153',
    description: 'Orquiectomia bilateral',
    diarias: '1 Enf',
    price: 3795.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '1 diária em Enfermaria.'
  },
  {
    id: 'pg-154',
    description: 'Orquiectomia bilateral (Leito dia)',
    diarias: '0',
    price: 2884.20,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-155',
    description: 'OTOPLASTIA (02 ORELHAS)',
    diarias: '0',
    price: 2640.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-156',
    description: 'OTOPLASTIA + BLEFAROPLASTIA',
    diarias: '1',
    price: 4224.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-157',
    description: 'Parotidectomia',
    diarias: '1 Apto',
    price: 4620.00,
    category: 'Cabeça, Pescoço & Otorrino',
    tableType: 'geral'
  },
  {
    id: 'pg-158',
    description: 'Parto Normal - Incluso Pediatra',
    diarias: '2 Apto',
    price: 6644.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '2 diárias em Apartamento. Incluso pediatra de sala de parto.'
  },
  {
    id: 'pg-159',
    description: 'Perineoplastia Anterior e Posterior',
    diarias: '1 Apto',
    price: 4356.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-160',
    description: 'Pieloplastia',
    diarias: '2 Apto',
    price: 6600.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '2 diárias em Apartamento.'
  },
  {
    id: 'pg-161',
    description: 'Polipectomia',
    diarias: '1 Apto',
    price: 3960.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral'
  },
  {
    id: 'pg-162',
    description: 'Postectomia (Leito dia)',
    diarias: '0',
    price: 792.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-163',
    description: 'Prostatectomia Radical',
    diarias: '1 Apto',
    price: 7656.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '1 diária em Apartamento.'
  },
  {
    id: 'pg-164',
    description: 'Prostatectomia Radical (Vídeo)',
    diarias: '1 Apto',
    price: 9740.50,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '1 diária em Apartamento por Videolaparoscopia.'
  },
  {
    id: 'pg-165',
    description: 'Prostatectomia Transvesical Céu Aberto',
    diarias: '1 Apto',
    price: 5016.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '1 diária em Apartamento.'
  },
  {
    id: 'pg-166',
    description: 'PRÓTESE DE GLÚTEO',
    diarias: '1',
    price: 3960.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-167',
    description: 'PRÓTESE DE GLÚTEO + CORREÇÃO DE CICATRIZ',
    diarias: '1',
    price: 5544.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-168',
    description: 'PRÓTESE DE GLÚTEO + RINOPLASTIA',
    diarias: '1',
    price: 6072.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-169',
    description: 'PRÓTESE DE MAMA',
    diarias: '1',
    price: 4620.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-170',
    description: 'PRÓTESE DE MAMA + OTOPLASTIA',
    diarias: '1',
    price: 5148.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-171',
    description: 'PRÓTESE DE MAMA + OTOPLASTIA + LIPOASPIRAÇÃO',
    diarias: '1',
    price: 6864.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-172',
    description: 'PRÓTESE DE MAMA + PRÓTESE DE GLÚTEO',
    diarias: '1',
    price: 6072.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-173',
    description: 'PRÓTESE DE MENTO',
    diarias: '1',
    price: 4224.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-174',
    description: 'PRÓTESE DE MENTO + LIPOASPIRAÇÃO',
    diarias: '1',
    price: 6336.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-175',
    description: 'REFINAMENTO DE MAMA',
    diarias: '1',
    price: 3801.60,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-176',
    description: 'REFINAMENTO DE MAMA + LIPOASPIRAÇÃO',
    diarias: '1',
    price: 6600.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-177',
    description: 'Reimplante ureteral',
    diarias: '1 Apto',
    price: 6336.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-178',
    description: 'Ressecção de Mucosa Lesão no Estômago',
    diarias: '1 Apto',
    price: 3850.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral'
  },
  {
    id: 'pg-179',
    description: 'Ressecção de Setor em Mama',
    diarias: '1',
    price: 4620.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral'
  },
  {
    id: 'pg-180',
    description: 'Ressecção de Tumor de Pele com Reconstrução / Enxerto',
    diarias: '1',
    price: 4341.48,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-181',
    description: 'Ressecção Endoscópica Da Próstata (RTU)',
    diarias: '2 Apto',
    price: 4752.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '2 diárias em Apartamento.'
  },
  {
    id: 'pg-182',
    description: 'Ressecção Pólipos Vesicais (Leito dia)',
    diarias: '0',
    price: 3036.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-183',
    description: 'RESSUTURA DE ABDOME',
    diarias: '1',
    price: 3960.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-184',
    description: 'Retirada de Cisto Dermóide',
    diarias: '1 Apto',
    price: 2970.00,
    category: 'Pequenas Cirurgias & Outros',
    tableType: 'geral'
  },

  // PAGE 6
  {
    id: 'pg-185',
    description: 'Retirada de DIU',
    diarias: '1',
    price: 1716.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-186',
    description: 'RETIRADA DE PRÓTESE + LIPOASPIRAÇÃO',
    diarias: '1',
    price: 6534.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-187',
    description: 'RETIRADA DE PRÓTESES',
    diarias: '1',
    price: 3960.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-188',
    description: 'RETOSSIGMOIDECTOMIA PÉLVICA E/OU RETROPERITONEAL',
    diarias: '1',
    price: 7507.50,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral'
  },
  {
    id: 'pg-189',
    description: 'Reversão de Vasectomia',
    diarias: '1 Apto',
    price: 5009.40,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-190',
    description: 'RINOPLASTIA + BLEFAROPLASTIA',
    diarias: '1',
    price: 5940.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-191',
    description: 'RINOPLASTIA + LIFTING',
    diarias: '1',
    price: 8976.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-192',
    description: 'RINOPLASTIA + LIPOASPIRAÇÃO',
    diarias: '1',
    price: 7524.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-193',
    description: 'RINOPLASTIA + LIPOASPIRAÇÃO + ABDOMINOPLASTIA',
    diarias: '1',
    price: 9504.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-194',
    description: 'RINOPLASTIA + LIPOASPIRAÇÃO + PRÓTESE DE MAMA',
    diarias: '1',
    price: 8580.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-195',
    description: 'RINOPLASTIA + MASTOPEXIA',
    diarias: '1',
    price: 6600.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-196',
    description: 'RINOPLASTIA + OTOPLASTIA',
    diarias: '1',
    price: 5544.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-197',
    description: 'RINOPLASTIA + PRÓTESE DE MAMA',
    diarias: '1',
    price: 6072.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-198',
    description: 'RINOPLASTIA C/ COSTECTOMIA',
    diarias: '1',
    price: 5280.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-199',
    description: 'RITIDOPLASTIA',
    diarias: '1',
    price: 6336.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-200',
    description: 'RITIDOPLASTIA + BLEFAROPLASTIA',
    diarias: '1',
    price: 6864.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-201',
    description: 'RITIDOPLASTIA + BLEFAROPLASTIA + RINOPLASTIA',
    diarias: '1',
    price: 8580.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-202',
    description: 'RTU de Bexiga por Vídeo',
    diarias: '1 Apto',
    price: 4752.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-203',
    description: 'Salpingectomia por Vídeo',
    diarias: '1 Apto',
    price: 5104.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-204',
    description: 'Septoplastia',
    diarias: '0',
    price: 3960.00,
    category: 'Cabeça, Pescoço & Otorrino',
    tableType: 'geral'
  },
  {
    id: 'pg-205',
    description: 'Septoplastia + Amígdala',
    diarias: '0',
    price: 4356.00,
    category: 'Cabeça, Pescoço & Otorrino',
    tableType: 'geral'
  },
  {
    id: 'pg-206',
    description: 'Septoplastia + Turbinectomia',
    diarias: '0',
    price: 4356.00,
    category: 'Cabeça, Pescoço & Otorrino',
    tableType: 'geral'
  },
  {
    id: 'pg-207',
    description: 'Simpatectomia bilateral',
    diarias: '1 Apto',
    price: 4180.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral'
  },
  {
    id: 'pg-208',
    description: 'Sling',
    diarias: '1 Apto',
    price: 5280.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-209',
    description: 'Sutura de pequenos ferimentos (não inclui cirurgia)',
    diarias: '0',
    price: 1197.50,
    category: 'Pequenas Cirurgias & Outros',
    tableType: 'geral'
  },
  {
    id: 'pg-210',
    description: 'Timpanomastoidectomia (Pacote Particular)',
    diarias: '1 Apto',
    price: 7216.00,
    category: 'Cabeça, Pescoço & Otorrino',
    tableType: 'geral'
  },
  {
    id: 'pg-211',
    description: 'Timpanoplastia unilateral',
    diarias: '1 Apto',
    price: 5016.00,
    category: 'Cabeça, Pescoço & Otorrino',
    tableType: 'geral'
  },
  {
    id: 'pg-212',
    description: 'Tireoidectomia total',
    diarias: '1 Apto',
    price: 4620.00,
    category: 'Cabeça, Pescoço & Otorrino',
    tableType: 'geral'
  },
  {
    id: 'pg-213',
    description: 'TROCA DE PRÓTESE MAMÁRIA',
    diarias: '1',
    price: 4224.00,
    category: 'Cirurgia Plástica',
    tableType: 'geral'
  },
  {
    id: 'pg-214',
    description: 'Tumor de Pênis',
    diarias: '1 Apto',
    price: 7514.10,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-215',
    description: 'Turbinectomia',
    diarias: '0',
    price: 3960.00,
    category: 'Cabeça, Pescoço & Otorrino',
    tableType: 'geral'
  },
  {
    id: 'pg-216',
    description: 'Ureterorrenolitotripsia Flexível Unilateral',
    diarias: '1 Apto',
    price: 4620.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-217',
    description: 'Ureterorrenolitotripsia Rígida Unilateral (Leito dia)',
    diarias: '0',
    price: 3960.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-218',
    description: 'Ureteroscopia (Leito dia)',
    diarias: '0',
    price: 1335.84,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-219',
    description: 'Uretroplastia anterior',
    diarias: '2 Apto',
    price: 5808.00,
    category: 'Urologia & Gineco',
    tableType: 'geral',
    notes: '2 diárias em Apartamento.'
  },
  {
    id: 'pg-220',
    description: 'Uretrotomia (Leito dia)',
    diarias: '0',
    price: 1168.20,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-221',
    description: 'Varicocele',
    diarias: '1 Apto',
    price: 3168.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },

  // PAGE 7
  {
    id: 'pg-222',
    description: 'Varizes - Tratamento Cirúrgico Unilateral',
    diarias: '1 Apto',
    price: 3630.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral',
    notes: '1 diária em Apartamento.'
  },
  {
    id: 'pg-223',
    description: 'Varizes - Tratamento Cirúrgico Unilateral',
    diarias: '1 Enf',
    price: 3300.00,
    category: 'Cirurgia Geral & Digestiva',
    tableType: 'geral',
    notes: '1 diária em Enfermaria.'
  },
  {
    id: 'pg-224',
    description: 'Vasectomia (Leito dia)',
    diarias: '0',
    price: 792.00,
    category: 'Urologia & Gineco',
    tableType: 'geral'
  },
  {
    id: 'pg-225',
    description: 'Fratura de TNZ, rádio distal, osso antebraço, clavícula, LAC, tíbia (Leito dia)',
    diarias: '0',
    price: 2208.00,
    category: 'Ortopedia & Traumatologia',
    tableType: 'geral',
    notes: 'Sempre confirmar no setor, pois alguns médicos recebem desconto e pagam depois da internação do paciente. Caso optarem por apartamento cobrar R$ 300,00 a mais no valor do procedimento.'
  },
  {
    id: 'pg-226',
    description: 'Fratura de TNZ, rádio distal, osso antebraço, clavícula, LAC, tíbia',
    diarias: '1 Enf',
    price: 2530.00,
    category: 'Ortopedia & Traumatologia',
    tableType: 'geral',
    notes: '1 diária em Enfermaria. Sempre confirmar no setor, pois alguns médicos recebem desconto e pagam depois da internação do paciente. Caso optarem por apartamento cobrar R$ 300,00 a mais no valor do procedimento.'
  },
  {
    id: 'pg-227',
    description: 'Fratura de fêmur, acetábulo',
    diarias: '1 Enf',
    price: 3680.00,
    category: 'Ortopedia & Traumatologia',
    tableType: 'geral',
    notes: '1 diária em Enfermaria.'
  },
  {
    id: 'pg-228',
    description: 'Próteses Quadril e Joelho',
    diarias: '2 Enf',
    price: 4485.00,
    category: 'Ortopedia & Traumatologia',
    tableType: 'geral',
    notes: '2 diárias em Enfermaria.'
  },
  {
    id: 'pg-229',
    description: 'Artroscopia de ombro e joelho',
    diarias: '1 Enf',
    price: 3174.00,
    category: 'Ortopedia & Traumatologia',
    tableType: 'geral',
    notes: '1 diária em Enfermaria.'
  }
];
