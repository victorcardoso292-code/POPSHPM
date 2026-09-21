import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  KeyRound, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck 
} from 'lucide-react';
import { verifyMasterPassword, setMasterPassword } from '../services/storageService';

interface MasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMaster: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
}

export const MasterModal: React.FC<MasterModalProps> = ({
  isOpen,
  onClose,
  isMaster,
  onLoginSuccess,
  onLogout
}) => {
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isChangingPass, setIsChangingPass] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (verifyMasterPassword(password)) {
      onLoginSuccess();
      setPassword('');
      onClose();
    } else {
      setErrorMessage('Senha Master incorreta. Verifique e tente novamente.');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword.length < 4) {
      setErrorMessage('A nova senha deve ter no mínimo 4 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('As senhas digitadas não coincidem.');
      return;
    }

    if (setMasterPassword(newPassword)) {
      setSuccessMessage('Senha Master alterada com sucesso!');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPass(false);
    } else {
      setErrorMessage('Erro ao salvar nova senha.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
            isMaster ? 'bg-emerald-100 text-emerald-800' : 'bg-teal-100 text-teal-800'
          }`}>
            {isMaster ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 m-0">
              {isMaster ? 'Painel de Acesso Master' : 'Autenticação Master'}
            </h3>
            <p className="text-xs text-slate-500 m-0">
              {isMaster ? 'Permissões administrativas ativas' : 'Acesso para edição de tabelas e valores'}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {!isMaster ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">
                Senha de Acesso Master
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Digite a senha..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Entrar no Modo Master</span>
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 font-medium flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Você está autenticado como Master.</strong>
                <span>Agora você pode adicionar, alterar valores particulares/MedPrev, excluir ou restaurar exames nas tabelas.</span>
              </div>
            </div>

            {!isChangingPass ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPass(true)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                >
                  Alterar Senha Master
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors border border-rose-200"
                >
                  Encerrar Sessão
                </button>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nova Senha Master</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl"
                  >
                    Salvar Senha
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChangingPass(false)}
                    className="px-3 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
