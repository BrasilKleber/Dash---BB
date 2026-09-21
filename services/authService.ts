
import { User } from '../types';

const STORAGE_KEY_SESSION = 'BLUEBOLT_SESSION_V1';

// CREDENCIAIS FIXAS DE ADMINISTRADOR
const ADMIN_USER: User = {
  id: 'admin-master-01',
  name: 'Administrador Bluebolt',
  email: 'admin@bluebolt.pt',
  role: 'admin',
  createdAt: new Date().toISOString()
};

const ADMIN_PASSWORD_PLAIN = 'admin2025';

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class AuthService {
  
  async getSession(): Promise<User | null> {
    const session = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!session) return null;
    return JSON.parse(session);
  }

  async login(email: string, password: string): Promise<User> {
    await delay(800); // Simular loading
    
    // Verificação estrita das credenciais fixas
    if (email.toLowerCase() === ADMIN_USER.email.toLowerCase() && password === ADMIN_PASSWORD_PLAIN) {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(ADMIN_USER));
      return ADMIN_USER;
    }
    
    throw new Error('Credenciais inválidas. Acesso restrito.');
  }

  // Método de registo desativado
  async register(name: string, email: string, password: string): Promise<User> {
    await delay(500);
    throw new Error('O registo de novos utilizadores está desativado. Contacte o administrador.');
  }

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  }

  async updateProfile(userId: string, data: { name?: string; email?: string }): Promise<User> {
    await delay(500);
    
    // Apenas atualiza a sessão local visualmente, não persiste (pois é hardcoded)
    const currentSession = await this.getSession();
    if (!currentSession) throw new Error('Sessão inválida');

    const updatedUser = { ...currentSession, ...data };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(updatedUser));
    
    return updatedUser;
  }

  async changePassword(userId: string, currentPass: string, newPass: string): Promise<void> {
    await delay(800);
    throw new Error('Não é possível alterar a palavra-passe da conta de administrador fixa.');
  }
}

export const authService = new AuthService();
