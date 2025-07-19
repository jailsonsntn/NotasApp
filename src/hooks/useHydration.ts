import { useEffect, useState } from 'react';

/**
 * Hook para gerenciar a hidratação segura do lado do cliente
 * Evita erros de hidratação ao acessar APIs do browser
 */
export function useIsomorphicLayoutEffect(effect: () => void, deps?: React.DependencyList) {
  useEffect(effect, deps);
}

/**
 * Hook para verificar se estamos no lado do cliente
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook para acessar localStorage de forma segura
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook para gerenciar tema de forma segura
 */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark-theme');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark-theme');
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Retorna tema atual ou 'light' como fallback durante SSR
  return {
    theme: mounted ? theme : 'light',
    setTheme,
    toggleTheme,
    mounted
  };
}

/**
 * Hook para inicialização segura de dados
 */
export function useInitialization() {
  const [initialized, setInitialized] = useState(false);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient || initialized) return;

    // Só executar no cliente para evitar problemas de hidratação
    try {
      // Verificar se já foi inicializado
      const isAppInitialized = localStorage.getItem('appInitialized');
      
      if (!isAppInitialized) {
        // Importar dinamicamente para evitar problemas de SSR
        import('@/lib/initialData').then(({ initializeDefaultData }) => {
          initializeDefaultData();
          setInitialized(true);
        });
      } else {
        setInitialized(true);
      }
    } catch (error) {
      console.warn('Error initializing app data:', error);
      setInitialized(true); // Continuar mesmo com erro
    }
  }, [isClient, initialized]);

  return { initialized, isClient };
}
