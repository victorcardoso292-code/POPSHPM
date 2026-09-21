import React from 'react';
import { Instagram, Linkedin, Youtube, ShieldCheck, HeartPulse } from 'lucide-react';

interface FooterProps {
  onNavigateToMode?: (mode: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToMode }) => {
  return (
    <footer className="bg-[#D8ECEE] text-slate-700 border-t border-[#C4E5E8] mt-auto">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#C4E5E8] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <svg className="w-6 h-6 text-[#0E7B86]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5C12 3.12 13.12 2 14.5 2H17.5C18.88 2 20 3.12 20 4.5V10C20 11.1 20.9 12 22 12H27.5C28.88 12 30 13.12 30 14.5V17.5C30 18.88 28.88 20 27.5 20H22C20.9 20 20 20.9 20 22V27.5C20 28.88 18.88 30 17.5 30H14.5C13.12 30 12 28.88 12 27.5V22C12 20.9 11.1 20 10 20H4.5C3.12 20 2 18.88 2 17.5V14.5C2 13.12 3.12 12 4.5 12H10C11.1 12 12 11.1 12 10V4.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="#D8ECEE" />
                </svg>
              </div>

              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-tight text-[#B01B52]">
                  Medical
                </span>
                <span className="text-xs font-semibold text-slate-500 tracking-wider">
                  Kora<span className="font-normal text-slate-400">Saúde</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Hospital Palmas Medical • Portal Operacional Integrado de POPs, Procedimentos de Urgência, Internação e Exames.
            </p>
          </div>

          {/* Sobre Nós */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-[#0E7B86] tracking-tight">
              Sobre nós
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <span className="hover:text-[#0E7B86] transition-colors cursor-default">Institucional</span>
              </li>
              <li>
                <span className="hover:text-[#0E7B86] transition-colors cursor-default">Qualidade & Segurança</span>
              </li>
              <li>
                <span className="hover:text-[#0E7B86] transition-colors cursor-default">Trabalhe Conosco</span>
              </li>
              <li>
                <span className="hover:text-[#0E7B86] transition-colors cursor-default">Comissão de Ética Médica</span>
              </li>
            </ul>
          </div>

          {/* Para Você */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-[#0E7B86] tracking-tight">
              Para você
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <span className="hover:text-[#0E7B86] transition-colors cursor-default">Agendamentos & Central</span>
              </li>
              <li>
                <span className="hover:text-[#0E7B86] transition-colors cursor-default">Especialidades Médicas</span>
              </li>
              <li>
                <span className="hover:text-[#0E7B86] transition-colors cursor-default">Centro de Exames & Diagnóstico</span>
              </li>
              <li>
                <span className="hover:text-[#0E7B86] transition-colors cursor-default">Pronto Atendimento 24 Horas</span>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-[#0E7B86] tracking-tight">
              Redes Sociais
            </h4>
            <div className="flex items-center gap-3 text-[#0E7B86]">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-lg bg-white/80 hover:bg-white border border-[#C4E5E8] flex items-center justify-center text-[#0E7B86] hover:text-[#B01B52] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-lg bg-white/80 hover:bg-white border border-[#C4E5E8] flex items-center justify-center text-[#0E7B86] hover:text-[#B01B52] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-lg bg-white/80 hover:bg-white border border-[#C4E5E8] flex items-center justify-center text-[#0E7B86] hover:text-[#B01B52] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-2">
              Atendimento ao Beneficiário: (63) 3236-1819
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#C4E5E8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 font-medium">
          <p className="m-0 text-center sm:text-left">
            © {new Date().getFullYear()} Hospital Palmas Medical • Kora Saúde. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 text-[11px]">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/80 border border-[#C4E5E8] text-slate-700 shadow-2xs">
              Criação: <strong className="ml-1 text-[#0E7B86] font-extrabold">João Victor Cardoso Costa</strong>
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="flex items-center gap-1 text-[#0E7B86] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              POPs & Diretrizes 2026
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="text-slate-500">Versão Operacional 2.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
