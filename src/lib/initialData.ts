// utils/initialData.ts
// Configurações iniciais para o NotasApp

export const defaultCategories = [
  {
    id: 'minhas-notas',
    name: 'Minhas Notas',
    icon: 'notes',
    color: '#3B82F6',
    isDefault: true,
    syncStatus: 'synced'
  },
  {
    id: 'favoritos',
    name: 'Favoritos',
    icon: 'star',
    color: '#F59E0B',
    isDefault: true,
    syncStatus: 'synced'
  },
  {
    id: 'tarefas',
    name: 'Tarefas',
    icon: 'tasks',
    color: '#10B981',
    isDefault: true,
    syncStatus: 'synced'
  },
  {
    id: 'ideias',
    name: 'Ideias',
    icon: 'lightbulb',
    color: '#F97316',
    isDefault: true,
    syncStatus: 'synced'
  },
  {
    id: 'anotacoes-rapidas',
    name: 'Anotações rápidas',
    icon: 'bolt',
    color: '#8B5CF6',
    isDefault: true,
    syncStatus: 'synced'
  },
  {
    id: 'arquivadas',
    name: 'Arquivadas',
    icon: 'archive',
    color: '#6B7280',
    isDefault: true,
    syncStatus: 'synced'
  },
  {
    id: 'lixeira',
    name: 'Lixeira',
    icon: 'trash',
    color: '#EF4444',
    isDefault: true,
    syncStatus: 'synced'
  }
];

export const defaultSettings = {
  theme: 'light',
  viewMode: 'grid',
  autoSync: true,
  backupInterval: 24, // horas
  language: 'pt-BR'
};

export const welcomeNote = {
  id: 'welcome-note',
  title: '🎉 Bem-vindo ao NotasApp!',
  content: `Olá! Seja bem-vindo ao seu novo aplicativo de notas.

Aqui estão algumas dicas para começar:

📝 **Criando notas**: Use o campo de entrada rápida ou clique em "Nova Nota"
📁 **Organizando**: Crie categorias personalizadas para organizar suas notas
⭐ **Favoritos**: Marque suas notas importantes como favoritas
🗂️ **Arquivos**: Archive notas antigas para manter sua área de trabalho limpa
🔄 **Sincronização**: Suas notas são sincronizadas automaticamente na nuvem

**Recursos especiais:**
- ✅ Criar listas de tarefas
- 🏷️ Adicionar tags às suas notas
- 🔍 Buscar em todas as suas notas
- 🌙 Alternar entre tema claro e escuro
- 📱 Acesso de qualquer dispositivo

Aproveite e organize suas ideias de forma eficiente!`,
  category: 'minhas-notas',
  isFavorite: false,
  isArchived: false,
  isDeleted: false,
  isTask: false,
  isQuickNote: false,
  tags: ['boas-vindas', 'tutorial'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  syncStatus: 'synced'
};

// Função para inicializar dados padrão
export function initializeDefaultData() {
  // Verificar se estamos no cliente
  if (typeof window === 'undefined') {
    console.warn('initializeDefaultData called on server side');
    return;
  }

  try {
    // Verificar se já foi inicializado
    const isInitialized = localStorage.getItem('appInitialized');
    
    if (!isInitialized) {
      // Configurar categorias padrão
      const existingCategories = localStorage.getItem('categories');
      if (!existingCategories) {
        localStorage.setItem('categories', JSON.stringify(defaultCategories));
      }
      
      // Configurar nota de boas-vindas
      const existingNotes = localStorage.getItem('notes');
      const notes = existingNotes ? JSON.parse(existingNotes) : [];
      
      // Adicionar nota de boas-vindas se não existir
      const hasWelcomeNote = notes.some((note: any) => note.id === 'welcome-note');
      if (!hasWelcomeNote) {
        notes.unshift(welcomeNote);
        localStorage.setItem('notes', JSON.stringify(notes));
      }
      
      // Configurar configurações padrão
      const existingSettings = localStorage.getItem('settings');
      if (!existingSettings) {
        localStorage.setItem('settings', JSON.stringify(defaultSettings));
      }
      
      // Marcar como inicializado
      localStorage.setItem('appInitialized', 'true');
      
      console.log('✅ Dados iniciais do NotasApp configurados com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao inicializar dados do app:', error);
  }
}

// Função para resetar dados (útil para desenvolvimento)
export function resetAppData() {
  const keys = ['notes', 'categories', 'settings', 'authToken', 'theme', 'appInitialized', 'welcomeModalShown'];
  keys.forEach(key => localStorage.removeItem(key));
  console.log('🔄 Dados do app resetados. Recarregue a página.');
}

// Função para exportar dados para backup
export function exportAppData() {
  const data = {
    notes: JSON.parse(localStorage.getItem('notes') || '[]'),
    categories: JSON.parse(localStorage.getItem('categories') || '[]'),
    settings: JSON.parse(localStorage.getItem('settings') || '{}'),
    exportedAt: new Date().toISOString(),
    version: '3.0.0'
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `notasapp-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
  console.log('📁 Backup exportado com sucesso!');
}

// Função para importar dados de backup
export function importAppData(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validar estrutura do backup
        if (!data.notes || !data.categories) {
          throw new Error('Arquivo de backup inválido');
        }
        
        // Confirmar importação
        const confirmImport = confirm(
          'Esta ação substituirá todos os dados atuais. Deseja continuar?'
        );
        
        if (confirmImport) {
          localStorage.setItem('notes', JSON.stringify(data.notes));
          localStorage.setItem('categories', JSON.stringify(data.categories));
          
          if (data.settings) {
            localStorage.setItem('settings', JSON.stringify(data.settings));
          }
          
          console.log('📥 Backup importado com sucesso! Recarregue a página.');
          alert('Backup importado com sucesso! A página será recarregada.');
          window.location.reload();
        }
        
        resolve();
      } catch (error) {
        console.error('Erro ao importar backup:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
}
