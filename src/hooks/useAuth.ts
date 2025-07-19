import { useState, useEffect } from 'react';

// Interfaces
interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    theme: string;
    language: string;
  };
}

interface MockUser extends User {
  password: string;
}

// Mock data para desenvolvimento
const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    name: 'Usuário Teste',
    email: 'teste@email.com',
    password: '123456',
    preferences: {
      theme: 'light',
      language: 'pt-BR'
    }
  }
];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API URL - será substituído pelo URL real em produção
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.notasapp.com';
  const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

  useEffect(() => {
    // Verificar se há token no localStorage
    const token = localStorage.getItem('authToken');
    
    if (token) {
      if (IS_DEVELOPMENT) {
        // Mock authentication
        const userData = JSON.parse(localStorage.getItem('mockUser') || 'null');
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
        setIsLoading(false);
      } else {
        fetchUserInfo(token);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  // Buscar informações do usuário
  const fetchUserInfo = async (token: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_URL}/api/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao buscar informações do usuário');
      }
      
      const userData = await response.json();
      setUser(userData as User);
      setIsAuthenticated(true);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao buscar informações do usuário:', err);
      setError(err.message);
      // Token inválido ou expirado
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (IS_DEVELOPMENT) {
        // Mock login para desenvolvimento
        const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
        
        if (!mockUser) {
          throw new Error('Email ou senha inválidos');
        }
        
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const userData = {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          preferences: mockUser.preferences
        };
        
        // Salvar dados do usuário
        localStorage.setItem('authToken', 'mock-token-' + mockUser.id);
        localStorage.setItem('mockUser', JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true };
      }
      
      // Implementação real da API
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error((errorData as any).msg || 'Erro ao fazer login');
      }
      
      const data = await response.json();
      
      // Salvar token
      const token = (data as any).token;
      localStorage.setItem('authToken', token);
      
      // Buscar informações do usuário
      await fetchUserInfo(token);
      
      return { success: true };
    } catch (err: any) {
      console.error('Erro ao fazer login:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Registro
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (IS_DEVELOPMENT) {
        // Mock register para desenvolvimento
        const existingUser = MOCK_USERS.find(u => u.email === email);
        
        if (existingUser) {
          throw new Error('Este email já está em uso');
        }
        
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          preferences: {
            theme: 'light',
            language: 'pt-BR'
          }
        };
        
        // Salvar dados do usuário
        localStorage.setItem('authToken', 'mock-token-' + newUser.id);
        localStorage.setItem('mockUser', JSON.stringify(newUser));
        
        setUser(newUser);
        setIsAuthenticated(true);
        
        return { success: true };
      }
      
      // Implementação real da API
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error((errorData as any).msg || 'Erro ao registrar');
      }
      
      const data = await response.json();
      
      // Salvar token
      const token = (data as any).token;
      localStorage.setItem('authToken', token);
      
      // Buscar informações do usuário
      await fetchUserInfo(token);
      
      return { success: true };
    } catch (err: any) {
      console.error('Erro ao registrar:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('mockUser');
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout
  };
}
