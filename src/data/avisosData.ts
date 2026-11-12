import { AppMode } from '../types';

export type CategoriaAviso = 
  | 'URGENTE / ALERTA GERAL'
  | 'CONVÊNIOS & FATURAMENTO'
  | 'ENFERMAGEM & RECEPÇÃO'
  | 'ESCALAS & CORPO CLÍNICO'
  | 'ADMINISTRATIVO & REFEITÓRIO'
  | 'DOCUMENTOS & FORMULÁRIOS';

export interface AvisoItem {
  id: string;
  titulo: string;
  categoria: CategoriaAviso;
  prioridade: 'alta' | 'media' | 'baixa';
  fixado: boolean;
  data: string; // "DD/MM/AAAA"
  hora?: string; // "HH:MM"
  setorEmissor: string;
  autor?: string;
  resumo: string;
  conteudo: string;
  tags: string[];
  imagemUrl?: string; // Caminho para imagem/cartaz oficial
  linkAcao?: {
    texto: string;
    modo: AppMode;
    subTarget?: string;
  };
  observacoes?: string;
}

// Avisos oficiais cadastrados a partir dos comunicados e cartazes da Recepção HPM
export const AVISOS_INICIAIS: AvisoItem[] = [
  {
    id: 'aviso-assinatura-obrigatoria',
    titulo: 'A ASSINATURA DO PACIENTE É OBRIGATÓRIA EM QUALQUER GUIA QUE FOR AUTORIZADA',
    categoria: 'URGENTE / ALERTA GERAL',
    prioridade: 'alta',
    fixado: true,
    data: '12/11/2026',
    hora: '11:30',
    setorEmissor: 'Equipe da Recepção & Faturamento',
    autor: 'Coordenação de Atendimento HPM',
    resumo: 'A assinatura do paciente é obrigatória em qualquer guia autorizada (SADT e Internação). Qualquer guia sem assinatura será passível de advertência.',
    conteudo: `📢 LEMBRETE - EQUIPE DA RECEPÇÃO
Pequenos cuidados, grandes resultados! Juntos por um atendimento seguro!

A ASSINATURA DO PACIENTE É OBRIGATÓRIA EM QUALQUER GUIA QUE FOR AUTORIZADA.
• Seja SADT (exames e procedimentos)
• Seja INTERNAÇÃO

⚠️ A partir de agora, QUALQUER GUIA SEM ASSINATURA SERÁ PASSÍVEL DE ADVERTÊNCIA.
Todos já conhecem o fluxo e sabem da importância da assinatura para a segurança do paciente, do hospital e da equipe.

BENEFÍCIOS DO CUMPRIMENTO:
✔ Mais Segurança
✔ Atendimento Correto
✔ Menos Pendências
✔ Trabalho em Equipe

Contamos com a colaboração de todos!
Qualidade no atendimento começa com atenção aos detalhes.`,
    tags: ['Assinaturas', 'Obrigatório', 'SADT', 'Internação', 'Advertência', 'Glosas', 'Recepção'],
    imagemUrl: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_11.31.46__1__2995b123.jpeg',
    linkAcao: {
      texto: 'Ver POPs de Pronto-Socorro',
      modo: 'pops-ps'
    }
  },
  {
    id: 'aviso-barreira-assinaturas',
    titulo: 'ATENÇÃO RECEPÇÃO: Solicite com OBRIGATORIEDADE a Assinatura dos Seguintes Documentos!',
    categoria: 'DOCUMENTOS & FORMULÁRIOS',
    prioridade: 'alta',
    fixado: true,
    data: '12/11/2026',
    hora: '11:30',
    setorEmissor: 'Coordenação de Atendimento HPM (Medical Kora Saúde)',
    autor: 'Coordenação de Atendimento HPM',
    resumo: 'Fluxo em 3 barreiras: Recepção solicita assinaturas obrigatórias, Escriturários conferem e Pré-Faturamento é barreira para não seguir ao faturamento sem assinatura.',
    conteudo: `Medical Kora Saúde • Coordenação de Atendimento HPM

ATENÇÃO RECEPÇÃO — Solicite com OBRIGATORIEDADE a assinatura dos seguintes documentos!

1️⃣ RECEPÇÃO:
Solicite com OBRIGATORIEDADE a assinatura dos seguintes documentos:
✔ Assinatura do paciente ou responsável.
✔ Termo de opção de acomodação.

2️⃣ ESCRITURÁRIOS:
✔ Conferir se os documentos estão corretamente assinados!

3️⃣ PRÉ-FATURAMENTO:
✔ Ser BARREIRA para não seguir para o FATURAMENTO!

⛔ SEM A ASSINATURA E CONFERÊNCIA, O PROCESSO NÃO DEVE SEGUIR!

Juntos por um atendimento seguro e de qualidade! ❤️`,
    tags: ['Recepção', 'Escriturários', 'Pré-Faturamento', 'Termo de Acomodação', 'Barreira', 'Auditoria'],
    imagemUrl: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_11.31.45_03e93da9.jpeg',
    linkAcao: {
      texto: 'Ver Documentos & Termos',
      modo: 'documentos'
    }
  },
  {
    id: 'aviso-overmind-crm-nilo',
    titulo: 'COMUNICADO IMPORTANTE: Obrigatório Utilizar o Overmind (Servir, Bradesco e GEAP) com CRM do Dr. Nilo (4686)',
    categoria: 'CONVÊNIOS & FATURAMENTO',
    prioridade: 'alta',
    fixado: true,
    data: '12/11/2026',
    hora: '11:30',
    setorEmissor: 'Coordenação de Atendimento & Overmind',
    autor: 'Janaína (Coordenação de Atendimento)',
    resumo: 'É obrigatório utilizar o Overmind nos atendimentos Servir, Bradesco e GEAP utilizando sempre o CRM do Dr. Nilo (4686). O que diferencia o atendimento é o SETOR.',
    conteudo: `COMUNICADO IMPORTANTE PARA TODA EQUIPE DA RECEPÇÃO
Overmind — Autorizações com mais agilidade

É OBRIGATÓRIO UTILIZAR O OVERMIND NOS ATENDIMENTOS DOS PLANOS:
• SERVIR
• BRADESCO
• GEAP

REGRA DE PREENCHIMENTO:
UTILIZAR SEMPRE O CRM DO DR. NILO (4686) EM TODOS OS ATENDIMENTOS:
PEDIATRIA, ADULTO, CIRURGIA PS E ORTOPEDIA.

💡 O que vai diferenciar o atendimento é o SETOR, e não o CRM:
Sempre selecione o setor correto de acordo com o tipo de atendimento e utilize o CRM do Dr. Nilo (4686) para gerar a autorização no Overmind.

EXEMPLO NA TELA DO SISTEMA:
1. Paciente Pediátrico:
   • Setor: Consultório PS Pediátrico | CRM: Dr. Nilo (4686)
2. Paciente Adulto:
   • Setor: Consultório PS Adulto | CRM: Dr. Nilo (4686)
3. Cirurgia PS:
   • Setor: Cirurgia PS | CRM: Dr. Nilo (4686)
4. Ortopedia:
   • Setor: Ortopedia | CRM: Dr. Nilo (4686)

IMPORTANTE:
✔ Utilizar obrigatoriamente o Overmind.
✔ Usar sempre o CRM do Dr. Nilo (4686).
✔ Selecionar corretamente o setor.
✔ Não utilizar outros CRMs para essas operadoras.
✔ O uso correto evita pendências, glosas e garante um atendimento mais ágil e seguro.

❓ EM CASO DE DÚVIDAS, PROCURE JANAÍNA. Estou à disposição! ♡
Servir | Bradesco Saúde | GEAP Saúde
Nosso compromisso é com o paciente!`,
    tags: ['Overmind', 'Dr. Nilo', 'CRM 4686', 'Servir', 'Bradesco', 'GEAP', 'Janaína', 'Setores'],
    imagemUrl: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_11.31.44__1__58a2025d.jpeg',
    linkAcao: {
      texto: 'Ver POP Pronto-Socorro Servir',
      modo: 'pops-ps',
      subTarget: 'SERVIR'
    }
  },
  {
    id: 'aviso-token-amil-bradesco',
    titulo: 'COMUNICADO AMIL E BRADESCO: Confirmação Obrigatória do Token no Ato do Atendimento',
    categoria: 'CONVÊNIOS & FATURAMENTO',
    prioridade: 'alta',
    fixado: false,
    data: '12/11/2026',
    hora: '11:30',
    setorEmissor: 'Central de Autorizações & Faturamento',
    autor: 'Equipe de Atendimento Kora',
    resumo: 'Para os convênios Amil e Bradesco, a equipe precisa confirmar o token no ato do atendimento. Confirmação obrigatória para pacientes eletivos.',
    conteudo: `COMUNICADO - CONVÊNIOS AMIL E BRADESCO

Para os convênios Amil e Bradesco, a equipe precisa confirmar o token no ato do atendimento.

📅 ESSA CONFIRMAÇÃO É OBRIGATÓRIA PARA PACIENTES ELETIVOS.

ℹ️ Por que confirmar o token?
A confirmação do token garante a autorização correta, evita pendências e contribui para um atendimento seguro e sem atrasos.

Atenção da recepção na solicitação do código gerado no aplicativo do beneficiário no momento da abertura do atendimento.`,
    tags: ['Amil', 'Bradesco', 'Token', 'Eletivos', 'Validação', 'Atendimento', 'Recepção'],
    imagemUrl: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_11.31.46_13288670.jpeg',
    linkAcao: {
      texto: 'Ver POP Amil',
      modo: 'pops-ps',
      subTarget: 'AMIL'
    }
  },
  {
    id: 'aviso-servir-uti-endoscopia',
    titulo: 'COMUNICADO RECEPÇÃO: Internação de UTI Servir (60000999) & Autorização de Endoscopia no CC',
    categoria: 'ENFERMAGEM & RECEPÇÃO',
    prioridade: 'alta',
    fixado: false,
    data: '12/11/2026',
    hora: '11:30',
    setorEmissor: 'Coordenação de Atendimento & SADT',
    autor: 'Coordenação da Recepção',
    resumo: 'Código Servir UTI: 60000999 (Pacote UTI Global mantido). Endoscopia no Centro Cirúrgico em SADT: SEMPRE solicitar com anestesia (31602231 + 60201120).',
    conteudo: `COMUNICADO - EQUIPE DA RECEPÇÃO
Fiquem atentos! Juntos fazemos um atendimento melhor!

1. INTERNAÇÃO DE UTI – PLANO SERVIR:
Para internação de UTI no plano SERVIR, o código é:
👉 60000999 – PACOTE DE UTI GLOBAL
(Mantido até o momento).

2. AUTORIZAÇÃO DE ENDOSCOPIA:
Quando for autorizar Endoscopia:
👉 Endoscopia no Centro Cirúrgico EM SADT
⚠️ SEMPRE SOLICITAR COM ANESTESIA

CÓDIGOS OBRIGATÓRIOS:
• 31602231 – ANESTESIA PARA ENDOSCOPIA DIGESTIVA ALTA E BAIXA
• 60201120 – PCT-COMP - PACOTE ENDOSCOPIA DIGESTIVA ALTA

Contamos com a atenção e o compromisso de todos para garantir um atendimento seguro e sem pendências.
Qualquer dúvida, procure a coordenação.`,
    tags: ['Servir', 'UTI', '60000999', 'Endoscopia', 'Anestesia', '31602231', '60201120', 'SADT', 'Centro Cirúrgico'],
    imagemUrl: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_11.31.45__1__ee800d93.jpeg',
    linkAcao: {
      texto: 'Ver POP Internação Servir',
      modo: 'pops-internacao',
      subTarget: 'SERVIR'
    }
  },
  {
    id: 'aviso-fluxo-urgencia-recepcao',
    titulo: 'INSTRUÇÃO DE TRABALHO HPM OD DIR002: Conduta do Atendente em Situações de Urgência e Emergência nas Recepções',
    categoria: 'ENFERMAGEM & RECEPÇÃO',
    prioridade: 'alta',
    fixado: false,
    data: '12/11/2026',
    hora: '11:30',
    setorEmissor: 'Diretoria Técnica & Recepções (Medical Kora Saúde)',
    autor: 'Diretoria Operacional (HPM OD DIR002)',
    resumo: 'Fluxo em 3 passos quando paciente apresentar urgência na recepção: 1. Acione o médico; 2. Acione o transporte (enfermagem/cadeira/maca); 3. Registre no EPA e comunique a coordenação.',
    conteudo: `Medical Kora Saúde • RECEPÇÕES
Instrução de Trabalho (HPM OD DIR002)

Conduta do Atendente em Situações de Urgência e Emergência nas Recepções
Aplique este fluxo quando um paciente apresentar uma situação de urgência ou emergência na recepção.

FLUXO DE CONDUTA:

1️⃣ ACIONE O MÉDICO:
• Comunique imediatamente um dos médicos presentes no setor.
• Se não houver médicos no momento, comunique um dos médicos plantonistas no PS HPM ou PA HST e solicite que compareça ao local.

2️⃣ ACIONE O TRANSPORTE:
• Comunique a equipe de enfermagem do Pronto-Socorro para providenciar o transporte do paciente ao PS, após a abordagem do médico.
• Organize cadeira de rodas ou maca para auxiliar a equipe.

3️⃣ REGISTRE E COMUNIQUE:
• Registre a ocorrência no sistema EPA e comunique ao coordenador da sua área.`,
    tags: ['HPM OD DIR002', 'Urgência na Recepção', 'Emergência', 'Fluxo de Conduta', 'EPA', 'Transporte', 'Enfermagem'],
    imagemUrl: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_11.31.44_44abcce7.jpeg',
    linkAcao: {
      texto: 'Ver Ramais de Urgência',
      modo: 'ramais'
    }
  },
  {
    id: 'aviso-horarios-visitas-acompanhantes',
    titulo: 'LEIA COM ATENÇÃO: Horários de Visitas e Troca de Acompanhantes no Medical Palmas',
    categoria: 'ADMINISTRATIVO & REFEITÓRIO',
    prioridade: 'media',
    fixado: false,
    data: '12/11/2026',
    hora: '11:30',
    setorEmissor: 'Hospitalidade & Coordenação de Internação e UTI',
    autor: 'Medical Kora Saúde',
    resumo: 'Tabela oficial de horários de visitas (Internação 13h-18h, UTIs Adulto A 14h-15h, B 15h-16h, C 16h-17h) e troca de acompanhantes (8h-9h e 17h15-18h15).',
    conteudo: `LEIA COM ATENÇÃO — ORIENTAÇÕES AOS ACOMPANHANTES E VISITANTES
Horários de Visitas no Medical Palmas (Medical Kora Saúde)

📋 HORÁRIOS DE VISITAS:
• Unidade de Internação 2º Andar: Recepção 2º andar | 13h às 18h | Nº Visitantes: 2
• Unidade de Internação Mezanino: Recepção 2º andar | 13h às 18h | Nº Visitantes: 2
• UTI Adulto A: Seg a Sex: Recepção 3º Andar / Sab, Dom e Feriados: Recepção 2º Andar | 14h às 15h | Nº Visitantes: 2
• UTI Adulto B: Seg a Sex: Recepção 3º Andar / Sab, Dom e Feriados: Recepção 2º Andar | 15h às 16h | Nº Visitantes: 2
• UTI Adulto C: Seg a Sex: Recepção 3º Andar / Sab, Dom e Feriados: Recepção 2º Andar | 16h às 17h | Nº Visitantes: 2

🔄 HORÁRIOS DE TROCA DE ACOMPANHANTES:
• Unidade de Internação 2º Andar: Recepção 2º andar | 08h às 09h e 17h15 às 18h15 | Nº Acompanhante: 1
• Unidade de Internação Mezanino: Recepção 2º andar | 08h às 09h e 17h15 às 18h15 | Nº Acompanhante: 1

REGRAS E ORIENTAÇÕES IMPORTANTES:
• A entrada na UTI é permitida apenas quando acompanhada por um profissional da equipe de saúde;
• Será garantido à criança e ao adolescente o direito de visitação à mãe ou ao pai internados, exceto quando estes estiverem em leito de isolamento, conforme determinação da CCIH. O menor deverá estar acompanhado de um responsável maior de idade;
• Durante o período de visita, É ESTRITAMENTE PROIBIDO O USO DE CELULARES;
• É permitido circular apenas pelos corredores que acessam o leito onde seu paciente estiver internado; a circulação nos demais corredores do hospital NÃO é permitida;
• Das 07h às 18h30, o acesso às Unidades de Internação será exclusivamente pela recepção do 2º andar. No período noturno, para situações excepcionais, o acesso ocorrerá pela recepção do Pronto Socorro Adulto;
• Para casos excepcionais envolvendo pacientes internados nas UTIs, é possível buscar assistência do Serviço de Psicologia de segunda a sexta-feira de 08h às 18h. Também é possível procurar ajuda nas recepções do hospital;
• ALERTA DE SEGURANÇA: Os hospitais da Rede Medical NÃO realizam ligações para pedir depósitos bancários, transferências ou PIX. Em caso de dúvidas, procure pessoalmente o setor de atendimento ao cliente.`,
    tags: ['Visitas', 'Acompanhantes', 'UTI Adulto', 'Internação 2º Andar', 'Mezanino', 'Horários', 'Golpe PIX', 'CCIH', 'Psicologia'],
    imagemUrl: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_11.31.45__3__654db9c8.jpeg'
  },
  {
    id: 'aviso-pediatria-1-acompanhante',
    titulo: 'AVISO PEDIATRIA: Permitido Apenas 1 Acompanhante por Paciente na Área de Pediatria',
    categoria: 'ENFERMAGEM & RECEPÇÃO',
    prioridade: 'media',
    fixado: false,
    data: '12/11/2026',
    hora: '11:30',
    setorEmissor: 'Pronto Atendimento Pediátrico & Recepção',
    autor: 'Equipe de Pediatria HPM',
    resumo: 'A partir de agora será permitido apenas 1 ACOMPANHANTE por paciente na área de Pediatria.',
    conteudo: `📢 AVISO - PEDIATRIA (Medical Kora Saúde)

A partir de agora será permitido apenas:
👉 1 ACOMPANHANTE por paciente na área de Pediatria.

BENEFÍCIOS DA MEDIDA:
✔ Mais segurança para os nossos pacientes.
✔ Ambiente mais tranquilo e organizado para as crianças e suas famílias.
✔ Melhor assistência e conforto durante o atendimento.

Agradecemos a compreensão de todos! ❤️
Qualidade no atendimento começa com atenção aos detalhes.`,
    tags: ['Pediatria', '1 Acompanhante', 'Recepção', 'Segurança', 'Crianças', 'Acolhimento'],
    imagemUrl: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_11.31.39_18f0b115.jpeg'
  }
];

export const STORAGE_KEY_AVISOS = 'hpm_avisos_comunicados_v5';
export const STORAGE_KEY_LIDOS = 'hpm_avisos_lidos_ids_v5';
