import { useState, useEffect } from 'react';

export function useSync(isAuthenticated) {
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [connectionStatus, setConnectionStatus] = useState('online'); // online, offline
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [pendingChanges, setPendingChanges] = useState(0);

  // API URL - será substituído pelo URL real em produção
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.notasapp.com';

  // Verificar status de conexão
  useEffect(() => {
    const handleOnline = () => setConnectionStatus('online');
    const handleOffline = () => setConnectionStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificar status inicial
    setConnectionStatus(navigator.onLine ? 'online' : 'offline');

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Verificar mudanças pendentes
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkPendingChanges = () => {
      // Verificar notas pendentes
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      const pendingNotes = notes.filter(note => note.syncStatus === 'pending');

      // Verificar categorias pendentes
      const categories = JSON.parse(localStorage.getItem('categories') || '[]');
      const pendingCategories = categories.filter(category => category.syncStatus === 'pending');

      // Atualizar contador de mudanças pendentes
      setPendingChanges(pendingNotes.length + pendingCategories.length);
    };

    // Verificar ao carregar e a cada 30 segundos
    checkPendingChanges();
    const interval = setInterval(checkPendingChanges, 30 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Sincronizar automaticamente quando ficar online
  useEffect(() => {
    if (connectionStatus === 'online' && pendingChanges > 0 && isAuthenticated) {
      syncNow();
    }
  }, [connectionStatus, pendingChanges, isAuthenticated]);

  // Função para sincronizar manualmente
  const syncNow = async () => {
    if (!isAuthenticated || connectionStatus === 'offline') {
      return { success: false, error: 'Não é possível sincronizar. Verifique sua conexão ou faça login.' };
    }

    setSyncStatus('syncing');

    try {
      // Se estivermos em desenvolvimento, simular sincronização
      if (process.env.NODE_ENV === 'development') {
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Marcar todas as notas como sincronizadas
        const notes = JSON.parse(localStorage.getItem('notes') || '[]');
        const updatedNotes = notes.map((note: any) => ({
          ...note,
          syncStatus: 'synced'
        }));
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
        
        setSyncStatus('synced');
        setLastSync(new Date());
        return { success: true };
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      // Sincronizar notas
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      const pendingNotes = notes.filter(note => note.syncStatus === 'pending');

      if (pendingNotes.length > 0) {
        const response = await fetch(`${API_URL}/api/notes/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({ notes: pendingNotes })
        });

        if (!response.ok) {
          throw new Error('Falha ao sincronizar notas');
        }

        const syncResult = await response.json();

        // Atualizar notas locais com resultados da sincronização
        const updatedNotes = notes.map(note => {
          const syncedNote = syncResult.allNotes.find(n => n._id === note.id);
          if (syncedNote) {
            return {
              ...note,
              syncStatus: 'synced',
              serverVersion: syncedNote.serverVersion
            };
          }
          return note;
        });

        localStorage.setItem('notes', JSON.stringify(updatedNotes));
      }

      // Sincronizar categorias
      const categories = JSON.parse(localStorage.getItem('categories') || '[]');
      const pendingCategories = categories.filter(category => category.syncStatus === 'pending');

      if (pendingCategories.length > 0) {
        const response = await fetch(`${API_URL}/api/categories/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({ categories: pendingCategories })
        });

        if (!response.ok) {
          throw new Error('Falha ao sincronizar categorias');
        }

        const syncResult = await response.json();

        // Atualizar categorias locais com resultados da sincronização
        const updatedCategories = categories.map(category => {
          const syncedCategory = syncResult.allCategories.find(c => c._id === category.id);
          if (syncedCategory) {
            return {
              ...category,
              syncStatus: 'synced',
              serverVersion: syncedCategory.serverVersion
            };
          }
          return category;
        });

        localStorage.setItem('categories', JSON.stringify(updatedCategories));
      }

      // Atualizar status de sincronização
      setSyncStatus('success');
      setLastSyncTime(new Date());
      setPendingChanges(0);

      return { success: true };
    } catch (err) {
      console.error('Erro ao sincronizar dados:', err);
      setSyncStatus('error');
      return { success: false, error: err.message };
    }
  };

  return {
    syncStatus,
    connectionStatus,
    lastSyncTime,
    pendingChanges,
    syncNow
  };
}
