import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { verifySystemCredentials, setSystemAuth } from '../services/storageService';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Por favor, informe o usuário de acesso.');
      return;
    }

    if (!password) {
      setError('Por favor, digite a senha.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const isValid = verifySystemCredentials(username, password);

      if (isValid) {
        setSystemAuth(true, rememberMe);
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('Usuário ou senha incorretos. Verifique os dados digitados.');
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F9FA] via-[#EBF7F8] to-[#E2F1F3] flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans antialiased text-slate-800 selection:bg-[#0E7B86] selection:text-white">
      
      {/* Top Header branding */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
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
            <span className="text-[10px] font-semibold text-slate-500 tracking-wider">
              Kora<span className="font-normal text-slate-400">Saúde</span>
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#095962] font-semibold bg-white/80 border border-[#C4E5E8] px-3 py-1.5 rounded-full shadow-2xs">
          <Building2 className="w-3.5 h-3.5 text-[#0E7B86]" />
          <span>Hospital Palmas Medical</span>
        </div>
      </div>

      {/* Main Login Card Container */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white rounded-3xl border border-[#C4E5E8] shadow-xl overflow-hidden">
          
          {/* Card Top Brand Banner */}
          <div className="bg-gradient-to-r from-[#095962] via-[#0E7B86] to-[#095962] p-6 text-white text-center relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
            
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-2xs backdrop-blur-xs">
              <Lock className="w-6 h-6 text-[#EBF7F8]" />
            </div>

            <span className="inline-block text-[11px] font-black uppercase tracking-widest text-[#EBF7F8] bg-white/15 border border-white/20 px-3 py-0.5 rounded-full mb-1.5">
              Portal Operacional
            </span>
            
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white m-0">
              Acesso ao Sistema
            </h1>
            
            <p className="text-xs text-white/85 mt-1 max-w-xs mx-auto leading-relaxed">
              Autenticação obrigatória para acesso aos POPs, Procedimentos, Exames e Relatórios.
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Field */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Usuário / Login
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    autoFocus
                    autoCapitalize="characters"
                    placeholder="Digite o login (ex: HPM)"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E7B86] focus:bg-white transition-all uppercase"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite a senha institucional"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E7B86] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0E7B86] focus:ring-[#0E7B86] border-slate-300 accent-[#0E7B86] cursor-pointer"
                  />
                  <span>Lembrar neste navegador</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-[#B01B52] hover:bg-[#971444] active:scale-[0.99] text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2 border border-[#F7D0DF]/30"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Entrar no Sistema</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Security Note */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-500 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-[#0E7B86]" />
              <span>Ambiente institucional restrito • Acesso monitorado</span>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Footer Credit */}
      <div className="max-w-6xl w-full mx-auto text-center py-4 text-xs text-slate-500">
        <p className="m-0 mb-1">
          © {new Date().getFullYear()} Hospital Palmas Medical • Kora Saúde. Todos os direitos reservados.
        </p>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 border border-[#C4E5E8] text-slate-700 font-medium shadow-2xs text-[11px]">
          Criação: <strong className="ml-1 text-[#0E7B86] font-bold">João Victor Cardoso Costa</strong>
        </span>
      </div>

    </div>
  );
};
