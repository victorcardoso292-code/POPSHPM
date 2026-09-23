export interface PortalCredential {
  id: string;
  hospital: 'Medical' | 'Santa Thereza' | 'Ambos';
  convenio: string;
  category: 'Convênio' | 'Internação' | 'Pronto-Socorro' | 'OPME' | 'Apoio' | 'E-mail';
  siteName: string;
  portalUrl: string;
  login: string;
  senha: string;
  responsavel?: string;
  emails?: string[];
  notes?: string;
  isSpecialNotice?: boolean;
}

export const PORTAIS_RULES = {
  whatsappPriscila: '(63) 98454-5316',
  whatsappPriscilaRaw: '5563984545316',
  warningWhatsapp: 'Qualquer troca de senha informar no WhatsApp da Priscila (63) 98454-5316 para alimentar a planilha. Isso evita troca de senhas constantes.',
  warningPlantaoPs24h: 'A recepção do Pronto-Socorro funciona 24 horas. Quem fica com a senha tem o dever de compartilhar e atender o telefone da recepção em caso de a senha ser direcionada para o e-mail.',
  dadosSenhaPessoal: 'Dados para fazer uma senha pessoal (Bradesco, Amil e Orizon): Nome completo, data de nascimento, CPF, telefone e e-mail.',
  bradescoNotice: 'ATENÇÃO BRADESCO: O portal BRADESCO INTERNAÇÃO é o portal oficial Bradesco Seguros, enquanto o portal BRADESCO PRONTO-SOCORRO é no ORIZON (Polimed). Para OPMEs Bradesco, utiliza-se o portal de Gestão de Insumos Orizon.',
  cassiNotice: 'ATENÇÃO CASSI: O portal da CASSI é o ORIZON (Polimed), tanto no Pronto-Socorro como na Internação.'
};

export const PORTAIS_CREDENCIAIS: PortalCredential[] = [
  {
    id: 'amil-medical',
    hospital: 'Medical',
    convenio: 'Amil',
    category: 'Convênio',
    siteName: 'Portal Credenciado Amil',
    portalUrl: 'https://credenciado.amil.com.br/autorizacao/329070191',
    login: 'pessoal',
    senha: 'pessoal',
    responsavel: 'Senha Master: romilton.pereira@redemedical.com.br',
    notes: 'Exige senha pessoal do operador. Senha Master com Romilton Pereira.'
  },
  {
    id: 'assefaz-medical',
    hospital: 'Medical',
    convenio: 'Assefaz',
    category: 'Convênio',
    siteName: 'WebPlan Assefaz (Fácil Informática)',
    portalUrl: 'https://novowebplanassefaz.facilinformatica.com.br/GuiasTISS/Logon',
    login: '12955953000192',
    senha: '12955953000192',
    notes: 'Login e senha padrão CNPJ Palmas Medical.'
  },
  {
    id: 'assefaz-santa-thereza',
    hospital: 'Santa Thereza',
    convenio: 'Assefaz',
    category: 'Convênio',
    siteName: 'WebPlan Assefaz (Fácil Informática)',
    portalUrl: 'https://novowebplanassefaz.facilinformatica.com.br/GuiasTISS/Logon',
    login: '25016319000136',
    senha: 'ASSEFAZ2025',
    notes: 'Unidade Hospital Santa Thereza.'
  },
  {
    id: 'best-saude-medical',
    hospital: 'Medical',
    convenio: 'Best Saúde',
    category: 'Convênio',
    siteName: 'WebPlan Best Senior / Best Saúde',
    portalUrl: 'https://novowebplanbestsenior.facilinformatica.com.br/GuiasTISS/GuiaSPSADT/ViewGuiaSPSADT',
    login: '12955953000192',
    senha: 'palmas@2026',
    notes: 'Guia SP/SADT e autorizações.'
  },
  {
    id: 'best-saude-santa-thereza',
    hospital: 'Santa Thereza',
    convenio: 'Best Saúde',
    category: 'Convênio',
    siteName: 'WebPlan Best Senior / Best Saúde',
    portalUrl: 'https://novowebplanbestsenior.facilinformatica.com.br/GuiasTISS/GuiaSPSADT/ViewGuiaSPSADT',
    login: '25016319000136',
    senha: '25016319000136',
    notes: 'Unidade Hospital Santa Thereza.'
  },
  {
    id: 'bradesco-internacao-medical',
    hospital: 'Medical',
    convenio: 'Bradesco Saúde (Internação)',
    category: 'Internação',
    siteName: 'Bradesco Seguros Oficial • Portal Internação',
    portalUrl: 'https://www.bradescoseguros.com.br/clientes/produtos/plano-saude',
    login: 'CPF + 12955953000192',
    senha: 'pessoal',
    responsavel: 'Senha Master: priscila.marques@redemedical.com.br',
    notes: 'PORTAL EXCLUSIVO PARA INTERNAÇÃO BRADESCO. Para Pronto-Socorro Bradesco, utilize o portal ORIZON.',
    isSpecialNotice: true
  },
  {
    id: 'bradesco-internacao-st',
    hospital: 'Santa Thereza',
    convenio: 'Bradesco Saúde',
    category: 'Internação',
    siteName: 'Saúde para Você | Bradesco Seguros',
    portalUrl: 'https://www.bradescoseguros.com.br/clientes/produtos/plano-saude',
    login: 'CPF + 25016319000136',
    senha: 'pessoal',
    notes: 'Unidade Hospital Santa Thereza. Senha pessoal.'
  },
  {
    id: 'bradesco-ps-orizon',
    hospital: 'Medical',
    convenio: 'Bradesco Saúde (Pronto-Socorro)',
    category: 'Pronto-Socorro',
    siteName: 'Orizon / Polimed • Portal de Pronto-Socorro Bradesco',
    portalUrl: 'https://www.polimed.com.br/autenticadorOrizon/loginAutenticador',
    login: 'pessoal',
    senha: 'pessoal',
    responsavel: 'Senha Master: priscila.marques@redemedical.com.br',
    notes: 'PORTAL OFICIAL PARA BRADESCO PRONTO-SOCORRO E ORIZON. Não utilizar o portal Bradesco Seguros no PS, o atendimento emergencial é via Orizon / Polimed.',
    isSpecialNotice: true
  },
  {
    id: 'bradesco-opmes',
    hospital: 'Medical',
    convenio: 'OPMEs Bradesco',
    category: 'OPME',
    siteName: 'Gestão de Insumos Orizon (OPMEs Bradesco)',
    portalUrl: 'https://gestaodeinsumos.orizon.com.br/#/',
    login: 'lucas.ribeiro',
    senha: 'Med@2025',
    notes: 'Portal específico de cotação e liberação de OPMEs e materiais especiais para o convênio Bradesco.',
    isSpecialNotice: true
  },
  {
    id: 'capsesp-medical',
    hospital: 'Medical',
    convenio: 'Capsesp',
    category: 'Convênio',
    siteName: 'Portal Capesesp Credenciado',
    portalUrl: 'https://servicosn.capesesp.com.br/novo/dist/login/login.php',
    login: '12955953000192',
    senha: '@1234567Aa',
    notes: 'Pesquisar no Google: Home CAPESESP -> CREDENCIADO -> PORTAL DE AUTORIZAÇÕES.'
  },
  {
    id: 'capsesp-retroativo',
    hospital: 'Medical',
    convenio: 'Capsesp (Retroativo)',
    category: 'Convênio',
    siteName: 'Portal Capesesp Guias Retroativas',
    portalUrl: 'https://servicosn.capesesp.com.br/novo/dist/login/login.php?tipoLogin=450000250',
    login: '12955953000192',
    senha: '39510',
    notes: 'Acesso para emissão e regularização de procedimentos retroativos.'
  },
  {
    id: 'cassi-medical',
    hospital: 'Medical',
    convenio: 'Cassi',
    category: 'Convênio',
    siteName: 'Portal Orizon / Polimed (Autorizador CASSI)',
    portalUrl: 'https://www.polimed.com.br/autenticadorOrizon/loginAutenticador',
    login: '12955953000192',
    senha: 'Hpm2025hpm@',
    notes: 'O portal da CASSI é o ORIZON, tanto no Pronto-Socorro como na Internação. Código do Prestador: 2120820.',
    isSpecialNotice: true
  },
  {
    id: 'conab-medical',
    hospital: 'Medical',
    convenio: 'Conab',
    category: 'Convênio',
    siteName: 'Portal Gov.br Conab Prestador',
    portalUrl: 'https://www.gov.br/conab/pt-br',
    login: '12955953000192',
    senha: 'Medical2026'
  },
  {
    id: 'email-google-prorrogacao',
    hospital: 'Medical',
    convenio: 'E-mail Google (Prorrogação)',
    category: 'E-mail',
    siteName: 'Gmail / Google Workspace Internação',
    portalUrl: 'https://mail.google.com',
    login: 'prorrogacao.internacao@redemedical.com.br',
    senha: 'VDGAG7LrKQEa2bE>',
    notes: 'E-mail institucional utilizado para envio e recebimento de prorrogações de internação e relatórios médicos de UTI.'
  },
  {
    id: 'evida-medical',
    hospital: 'Medical',
    convenio: 'E-vida',
    category: 'Convênio',
    siteName: 'WebPlan E-vida (Fácil Informática)',
    portalUrl: 'https://novowebplanevida.facilinformatica.com.br/GuiasTISS/Logon',
    login: '12955953000192',
    senha: '12955953000192'
  },
  {
    id: 'gama-saude-medical',
    hospital: 'Medical',
    convenio: 'Gama Saúde',
    category: 'Convênio',
    siteName: 'TopSaúdeHub Portal Credenciado Gama',
    portalUrl: 'https://gama.topsaudehub.com.br/PortalCredenciado',
    login: '40090197_AUT',
    senha: 'Medical25@'
  },
  {
    id: 'geap-medical',
    hospital: 'Medical',
    convenio: 'GEAP',
    category: 'Convênio',
    siteName: 'Portal GEAP Autogestão',
    portalUrl: 'https://www.geap.com.br',
    login: '28112539',
    senha: '28112539',
    notes: 'Código de prestador Palmas Medical.'
  },
  {
    id: 'geap-santa-thereza',
    hospital: 'Santa Thereza',
    convenio: 'GEAP',
    category: 'Convênio',
    siteName: 'Portal GEAP Autogestão',
    portalUrl: 'https://www.geap.com.br',
    login: '28114590',
    senha: 'Santa2025',
    notes: 'Unidade Santa Thereza.'
  },
  {
    id: 'geap-inpart-medical',
    hospital: 'Medical',
    convenio: 'GEAP Inpart',
    category: 'Convênio',
    siteName: 'Inpart Saúde Autorizador GEAP',
    portalUrl: 'https://www.inpartsaude.com.br',
    login: 'Verificar no portal',
    senha: 'Verificar no portal'
  },
  {
    id: 'geap-inpart-st',
    hospital: 'Santa Thereza',
    convenio: 'GEAP Inpart',
    category: 'Convênio',
    siteName: 'Inpart Saúde Autorizador GEAP Santa Thereza',
    portalUrl: 'https://www.inpartsaude.com.br',
    login: 'Verificar no portal',
    senha: 'Verificar no portal'
  },
  {
    id: 'ideal-saude-medical',
    hospital: 'Medical',
    convenio: 'Ideal Saúde',
    category: 'Convênio',
    siteName: 'WebPlan Ideal Saúde (Fácil Informática)',
    portalUrl: 'https://novowebplanidealsaude.facilinformatica.com.br/GuiasTISS/Logon',
    login: '12955953000192',
    senha: '12955953000192'
  },
  {
    id: 'laboratorio-shift',
    hospital: 'Medical',
    convenio: 'Laboratório (Shift / Metropolitano)',
    category: 'Apoio',
    siteName: 'Rede Meridional / LIS Shift Metropolitano',
    portalUrl: 'https://resultados.redemeridional.com.br/shift/lis/metropolitano/elis/s01.iu.web.Login.cls?config=MEDICAL',
    login: 'P1704042',
    senha: 'DH18R2',
    notes: 'Consulta e liberação de resultados laboratoriais de pacientes internados e PS.'
  },
  {
    id: 'life-empresarial',
    hospital: 'Medical',
    convenio: 'Life Empresarial',
    category: 'Convênio',
    siteName: 'Life Empresarial Saúde Prestador',
    portalUrl: 'https://www.lifeempresarial.com.br',
    login: '12955953000192',
    senha: 'Kora2026#',
    responsavel: 'Recepção e-mail'
  },
  {
    id: 'mediservice-st-1',
    hospital: 'Santa Thereza',
    convenio: 'Mediservice',
    category: 'Convênio',
    siteName: 'Mediservice | Login Credenciado',
    portalUrl: 'https://www.mediservice.com.br',
    login: 'SANTATHEREZA (senha com o Lucas)',
    senha: 'Kora2027#',
    responsavel: 'priscila.marques@redemedical.com.br'
  },
  {
    id: 'mediservice-st-2',
    hospital: 'Santa Thereza',
    convenio: 'Mediservice (Acesso Secundário)',
    category: 'Convênio',
    siteName: 'Mediservice | Login Credenciado',
    portalUrl: 'https://www.mediservice.com.br',
    login: 'SANTATHEREZA (senha com o Lucas)',
    senha: 'SA7SEA4',
    responsavel: 'priscila.marques@redemedical.com.br'
  },
  {
    id: 'notredame-medical-1',
    hospital: 'Medical',
    convenio: 'NotreDame Intermédica / Hapvida',
    category: 'Convênio',
    siteName: 'Savi Atendimento Hapvida GNDI',
    portalUrl: 'https://saviatendimento.com.br/saviatendimento/login.faces',
    login: '73511439353',
    senha: 'Redemedical123',
    notes: 'Solicitar prorrogações nos e-mails oficiais.',
    emails: [
      'prorrogacoes@hapvida.com.br',
      'juliane.garcia@hapvida.com.br',
      'prorrogacaondi@hapvida.com.br'
    ]
  },
  {
    id: 'notredame-medical-2',
    hospital: 'Medical',
    convenio: 'NotreDame Intermédica (Portal Savi Home)',
    category: 'Convênio',
    siteName: 'Savi Atendimento Home GNDI',
    portalUrl: 'https://saviatendimento.com.br/saviatendimento/pages/home.faces',
    login: '73511439353',
    senha: 'Remedical123'
  },
  {
    id: 'petrobras-medical',
    hospital: 'Medical',
    convenio: 'Petrobras (AMS)',
    category: 'Convênio',
    siteName: 'Portal TISS Saúde Petrobras',
    portalUrl: 'https://portaltiss.saudepetrobras.com.br/saudeweb/seguranca/login?appCMP=true',
    login: '12955953000192',
    senha: 'Medical@2025'
  },
  {
    id: 'plan-assiste-medical',
    hospital: 'Medical',
    convenio: 'Plan-Assiste (MPU)',
    category: 'Convênio',
    siteName: 'Autorizador Web Plan-Assiste / WSTISS',
    portalUrl: 'https://sistema.planassiste.mpu.mp.br/autorizadorweb/login.aspx',
    login: '12955953000192',
    senha: 'OFIRVB28',
    responsavel: 'isaias.silva@redemedical.com.br (senha master)',
    notes: 'Exames eletivos: sistema.planassiste.mpu.mp.br/WSTISS/Default.aspx ou autorizadorweb. Autorizações eletivas comunicar: seplan-nueplanto@mpu.mp.br, prto-planassiste@mpf.mp.br, planassiste-periciaplan@mpf.mp.br. Urgência: planassiste-internacao@mpf.mp.br com cópia para priscila.marques@redemedical.com.br.',
    emails: [
      'planassiste-internacao@mpf.mp.br',
      'priscila.marques@redemedical.com.br',
      'prto-planassiste@mpf.mp.br',
      'planassiste-periciaplan@mpf.mp.br',
      'seplan-nueplanto@mpu.mp.br'
    ]
  },
  {
    id: 'postal-saude-medical',
    hospital: 'Medical',
    convenio: 'Postal Saúde (Correios)',
    category: 'Convênio',
    siteName: 'Autorizador Pro Postal Saúde',
    portalUrl: 'https://autorizador.postalsaudeservicos.com.br/autorizadorpro/custom/CustomLogin.aspx',
    login: '12955953000192',
    senha: 'Kora2026@'
  },
  {
    id: 'pro-social-medical',
    hospital: 'Medical',
    convenio: 'Pró-Social (TRF1)',
    category: 'Convênio',
    siteName: 'Portal Pró-Social TRF1',
    portalUrl: 'https://prosocial.trf1.jus.br/prosocial/login.aspx',
    login: '12955953000192',
    senha: 'hCP2015'
  },
  {
    id: 'pro-social-st',
    hospital: 'Santa Thereza',
    convenio: 'Pró-Social (TRF1)',
    category: 'Convênio',
    siteName: 'Portal Pró-Social TRF1 Santa Thereza',
    portalUrl: 'https://prosocial.trf1.jus.br/prosocial/login.aspx',
    login: '25016319000136',
    senha: 'thereza2018'
  },
  {
    id: 'pro-tocantins-antigo',
    hospital: 'Medical',
    convenio: 'Pró-Tocantins (Site Antigo FamSaúde)',
    category: 'Convênio',
    siteName: 'WebPlan FamSaúde (Fácil Informática)',
    portalUrl: 'https://novowebplanfamsaude.facilinformatica.com.br/GuiasTISS/Logon',
    login: '12955953000192',
    senha: '12955953000192A'
  },
  {
    id: 'pro-tocantins-fa-saude-medical',
    hospital: 'Medical',
    convenio: 'Pró-Tocantins // FA SAÚDE (NOVO SITE)',
    category: 'Convênio',
    siteName: 'Portal Prestador FA Saúde Novo',
    portalUrl: 'https://servicos.fasaudefpto.com.br/prestador/index.php',
    login: 'MEDICAL',
    senha: '123456',
    notes: 'Novo portal de autorizações FA Saúde / Pró-Tocantins.'
  },
  {
    id: 'pro-tocantins-fa-saude-st',
    hospital: 'Santa Thereza',
    convenio: 'Pró-Tocantins // FA SAÚDE (NOVO SITE)',
    category: 'Convênio',
    siteName: 'Portal Prestador FA Saúde Santa Thereza',
    portalUrl: 'https://servicos.fasaudefpto.com.br/prestador/index.php',
    login: 'SANTA THEREZA',
    senha: '123456'
  },
  {
    id: 'radiologia-directrad',
    hospital: 'Medical',
    convenio: 'Radiologia (Directrad)',
    category: 'Apoio',
    siteName: 'Directrad Laudos e Imagens',
    portalUrl: 'https://directrad.com.br/exame/',
    login: 'wilton.santana',
    senha: 'hpm123',
    notes: 'Acesso do Dr. Wilton Santana / Laudos de RX, Tomografia e exames de imagem.'
  },
  {
    id: 'saude-caixa-medical',
    hospital: 'Medical',
    convenio: 'Saúde Caixa',
    category: 'Convênio',
    siteName: 'Credenciado Saúde Caixa',
    portalUrl: 'https://credenciadosaude.caixa.gov.br/login.aspx',
    login: 'a12955953000192',
    senha: 'Medical@1234'
  },
  {
    id: 'saude-caixa-st',
    hospital: 'Santa Thereza',
    convenio: 'Saúde Caixa',
    category: 'Convênio',
    siteName: 'Autorizador PRD Saúde Caixa Santa Thereza',
    portalUrl: 'https://saude.caixa.gov.br/autorizadorprd/login.aspx',
    login: 'a25016319000136',
    senha: 'Saude@1234'
  },
  {
    id: 'sepaco-medical',
    hospital: 'Medical',
    convenio: 'SEPACO',
    category: 'Convênio',
    siteName: 'Portal AG2 Sepaco Autogestão',
    portalUrl: 'https://portalag2.sepaco.org.br/login',
    login: '0003458',
    senha: 'Medical2025'
  },
  {
    id: 'servir-medical',
    hospital: 'Medical',
    convenio: 'Servir (Plano de Saúde TO)',
    category: 'Convênio',
    siteName: 'WebPlan Servir (Fácil Informática)',
    portalUrl: 'https://novowebplanplansaude.facilinformatica.com.br/GuiasTISS/Logon#',
    login: '12955953000192',
    senha: '129559530001921292',
    notes: 'Portal principal do Servir (Governo do Tocantins).'
  },
  {
    id: 'servir-santa-thereza',
    hospital: 'Santa Thereza',
    convenio: 'Servir (Plano de Saúde TO)',
    category: 'Convênio',
    siteName: 'WebPlan Servir Santa Thereza',
    portalUrl: 'https://novowebplanplansaude.facilinformatica.com.br/GuiasTISS/Logon',
    login: '25016319000136',
    senha: '25016319000136'
  },
  {
    id: 'sul-america-medical',
    hospital: 'Medical',
    convenio: 'SulAmérica Saúde',
    category: 'Convênio',
    siteName: 'Portal Prestador SulAmérica',
    portalUrl: 'https://saude.sulamerica.com.br/prestador/',
    login: '100000015181 / MASTER',
    senha: '@medic18'
  },
  {
    id: 'vale-pasa-medical',
    hospital: 'Medical',
    convenio: 'VALE PASA',
    category: 'Convênio',
    siteName: 'Benner Conecta PASA',
    portalUrl: 'https://conectapasa.benner.com.br',
    login: 'prorrogacaointernacao@redemedical.com.br',
    senha: 'Medical2025.',
    notes: 'Login institucional via Benner Conecta.'
  },
  {
    id: 'marinha-medical-st',
    hospital: 'Ambos',
    convenio: 'Marinha do Brasil',
    category: 'Convênio',
    siteName: 'Autorização por E-mail (Capitania / Marinha)',
    portalUrl: 'mailto:andreina.amaral@marinha.mil.br',
    login: 'Solicitação formal por e-mail',
    senha: 'Não se aplica (via e-mail)',
    notes: 'Autorizações médicas e prorrogações solicitadas exclusivamente pelos e-mails dos oficiais responsáveis.',
    emails: [
      'andreina.amaral@marinha.mil.br',
      'goncalves.santos@marinha.mil.br',
      'costa.amaral@marinha.mil.br',
      'lucas.scherr@marinha.mil.br'
    ]
  }
];
