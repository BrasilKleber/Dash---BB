
import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Loader2, CheckCircle } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { authService } from '../../services/authService';
import { User } from '../../types';

interface RegisterPageProps {
  onRegisterSuccess: (user: User) => void;
  onNavigateLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onNavigateLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const user = await authService.register(name, email, password);
      onRegisterSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Criar nova conta" 
      subtitle="Junta-te à Bluebolt e otimiza a tua performance"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-bold text-slate-700">
            Nome Completo
          </label>
          <div className="mt-1 relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
              placeholder="João Silva"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-bold text-slate-700">
            Email profissional
          </label>
          <div className="mt-1 relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
              placeholder="nome@empresa.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-bold text-slate-700">
            Palavra-passe
          </label>
          <div className="mt-1 relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-700">
            Confirmar Palavra-passe
          </label>
          <div className="mt-1 relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all active:scale-95"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <>
              Criar Conta <CheckCircle className="ml-2 h-4 w-4" />
            </>
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Já tens conta?{' '}
            <button
              type="button"
              onClick={onNavigateLogin}
              className="font-bold text-blue-600 hover:text-blue-500 transition-colors"
            >
              Entrar
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
