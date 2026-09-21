
import React, { useState } from 'react';
import { User, LogOut, Save, Lock, UserCircle, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';
import { User as UserType } from '../types';

interface AccountSettingsProps {
  user: UserType;
  onUpdateUser: (user: UserType) => void;
  onLogout: () => void;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ user, onUpdateUser, onLogout }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const updatedUser = await authService.updateProfile(user.id, { name, email });
      onUpdateUser(updatedUser);
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass) return;
    setPassLoading(true);
    setPassMessage(null);
    try {
      await authService.changePassword(user.id, currentPass, newPass);
      setPassMessage({ type: 'success', text: 'Palavra-passe alterada com sucesso.' });
      setCurrentPass('');
      setNewPass('');
    } catch (err: any) {
      setPassMessage({ type: 'error', text: err.message });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-slate-900">A Minha Conta</h1>
        <p className="text-sm text-slate-600 mt-1">Gere as tuas informações pessoais e segurança.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-3xl space-y-8">
          
          {/* Perfil */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <UserCircle size={20} className="text-blue-500" />
              <h2 className="font-bold text-slate-900">Informações de Perfil</h2>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              {message && (
                <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
                  message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {message.text}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Guardar Alterações
                </button>
              </div>
            </form>
          </div>

          {/* Segurança */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Lock size={20} className="text-orange-500" />
              <h2 className="font-bold text-slate-900">Segurança</h2>
            </div>
            
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              {passMessage && (
                <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
                  passMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {passMessage.text}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Palavra-passe Atual</label>
                  <input
                    type="password"
                    value={currentPass}
                    onChange={e => setCurrentPass(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nova Palavra-passe</label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={passLoading || !currentPass || !newPass}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-50"
                >
                  {passLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                  Atualizar Senha
                </button>
              </div>
            </form>
          </div>

          {/* Sessão */}
          <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-red-50 bg-red-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LogOut size={20} className="text-red-500" />
                <h2 className="font-bold text-red-900">Zona de Perigo</h2>
              </div>
            </div>
            
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Terminar Sessão</p>
                <p className="text-sm text-slate-500">A tua sessão será encerrada neste dispositivo.</p>
              </div>
              <button
                onClick={onLogout}
                className="px-6 py-2.5 bg-white border-2 border-red-100 hover:border-red-200 hover:bg-red-50 text-red-600 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
              >
                <LogOut size={16} />
                Sair da Conta
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
