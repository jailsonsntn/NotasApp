import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '@/types';

export function useNotes(currentCategory: string, searchQuery: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [restoreNoteId, setRestoreNoteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // API URL - será substituído pelo URL real em produção
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.notasapp.com';

  // Carregar notas do localStorage ou API
  useEffect(() => {
    const loadNotes = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // Verificar se estamos em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          // Usar dados mock em desenvolvimento
          const mockNotes = JSON.parse(localStorage.getItem('notes') || '[]');
          setNotes(mockNotes);
          setIsLoading(false);
          return;
        }

        // Carregar do backend (apenas em produção)
        try {
          const response = await fetch(`${API_URL}/api/notes`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            }
          });
          
          if (!response.ok) {
            throw new Error('Falha ao buscar notas');
          }
          
          const notesData = await response.json();
          setNotes(notesData.map(note => ({
            id: note._id,
            title: note.title,
            content: note.content,
            tags: note.tags || [],
            categories: note.categories.map(cat => typeof cat === 'object' ? cat._id : cat),
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
            isFavorite: note.isFavorite,
            isArchived: note.isArchived,
            isQuickNote: note.isQuickNote,
            expiresAt: note.expiresAt ? new Date(note.expiresAt) : null,
            isTask: note.isTask,
            taskItems: note.taskItems || [],
            isInTrash: note.isInTrash,
            deletedAt: note.deletedAt ? new Date(note.deletedAt) : null,
            syncStatus: 'synced'
          })));
        } catch (err) {
          console.error('Erro ao buscar notas:', err);
          // Fallback para localStorage
          const savedNotes = localStorage.getItem('notes');
          if (savedNotes) {
            setNotes(JSON.parse(savedNotes));
          }
        }
      } else {
        // Carregar do localStorage
        const savedNotes = localStorage.getItem('notes');
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        }
      }
    };
    
    loadNotes();
  }, [API_URL]);

  // Filtrar notas com base na categoria atual e pesquisa
  useEffect(() => {
    let filtered = [...notes];
    
    // Filtrar por categoria
    if (currentCategory === 'favoritos') {
      filtered = filtered.filter(note => note.isFavorite && !note.isInTrash);
    } else if (currentCategory === 'tarefas') {
      filtered = filtered.filter(note => note.isTask && !note.isArchived && !note.isInTrash);
    } else if (currentCategory === 'ideias') {
      filtered = filtered.filter(note => note.tags.includes('ideia') && !note.isArchived && !note.isInTrash);
    } else if (currentCategory === 'anotacoes-rapidas') {
      filtered = filtered.filter(note => note.isQuickNote && !note.isArchived && !note.isInTrash);
    } else if (currentCategory === 'arquivadas') {
      filtered = filtered.filter(note => note.isArchived && !note.isInTrash);
    } else if (currentCategory === 'lixeira') {
      filtered = filtered.filter(note => note.isInTrash);
    } else if (currentCategory === 'minhas-notas') {
      filtered = filtered.filter(note => !note.isArchived && !note.isInTrash);
    } else {
      // Categoria personalizada
      filtered = filtered.filter(note => 
        note.categories.includes(currentCategory) && 
        !note.isArchived && 
        !note.isInTrash
      );
    }
    
    // Filtrar por pesquisa
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Ordenar por data de atualização (mais recente primeiro)
    filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    setFilteredNotes(filtered);
  }, [notes, currentCategory, searchQuery]);

  // Salvar notas no localStorage
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Verificar notas expiradas
  useEffect(() => {
    const checkExpiredNotes = () => {
      const now = new Date();
      let hasChanges = false;
      
      const updatedNotes = notes.map(note => {
        // Verificar anotações rápidas (5 dias)
        if (note.isQuickNote && !note.isInTrash) {
          const createdDate = new Date(note.createdAt);
          const expiryDate = new Date(createdDate);
          expiryDate.setDate(expiryDate.getDate() + 5);
          
          if (now > expiryDate) {
            hasChanges = true;
            return { ...note, isInTrash: true, deletedAt: now };
          }
        }
        
        // Verificar notas na lixeira (30 dias)
        if (note.isInTrash && note.deletedAt) {
          const deletedDate = new Date(note.deletedAt);
          const expiryDate = new Date(deletedDate);
          expiryDate.setDate(expiryDate.getDate() + 30);
          
          if (now > expiryDate) {
            hasChanges = true;
            return null; // Remover completamente
          }
        }
        
        // Verificar notas arquivadas (30 dias)
        if (note.isArchived && !note.isInTrash) {
          const archivedDate = new Date(note.updatedAt);
          const expiryDate = new Date(archivedDate);
          expiryDate.setDate(expiryDate.getDate() + 30);
          
          if (now > expiryDate) {
            hasChanges = true;
            return { ...note, isInTrash: true, deletedAt: now };
          }
        }
        
        return note;
      }).filter(Boolean); // Remover notas nulas
      
      if (hasChanges) {
        setNotes(updatedNotes);
      }
    };
    
    // Verificar ao carregar e a cada hora
    checkExpiredNotes();
    const interval = setInterval(checkExpiredNotes, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [notes]);

  // Adicionar nova nota
  const addNote = async (title, content = '', categories = [], tags = [], isTask = false, taskItems = [], isFavorite = false, isQuickNote = false) => {
    const newNote = {
      id: uuidv4(),
      title,
      content,
      tags,
      categories,
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite,
      isArchived: false,
      isQuickNote,
      expiresAt: isQuickNote ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) : null, // 5 dias
      isTask,
      taskItems,
      isInTrash: false,
      deletedAt: null,
      syncStatus: 'pending'
    };
    
    setNotes(prevNotes => [newNote, ...prevNotes]);
    
    // Sincronizar com o backend se autenticado
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await fetch(`${API_URL}/api/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({
            title,
            content,
            tags,
            categories,
            isFavorite,
            isArchived: false,
            isQuickNote,
            expiresAt: isQuickNote ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) : null,
            isTask,
            taskItems,
            isInTrash: false,
            deletedAt: null,
            localVersion: 1
          })
        });
        
        if (!response.ok) {
          throw new Error('Falha ao criar nota');
        }
        
        const savedNote = await response.json();
        
        // Atualizar ID da nota com o ID do servidor
        setNotes(prevNotes => prevNotes.map(note => 
          note.id === newNote.id 
            ? { 
                ...note, 
                id: savedNote._id,
                syncStatus: 'synced'
              } 
            : note
        ));
      } catch (err) {
        console.error('Erro ao criar nota no servidor:', err);
        // Manter nota local com status pendente
      }
    }
    
    return newNote;
  };

  // Atualizar nota existente
  const updateNote = async (updatedNote) => {
    setNotes(prevNotes => prevNotes.map(note => 
      note.id === updatedNote.id 
        ? { 
            ...updatedNote, 
            updatedAt: new Date(),
            syncStatus: 'pending'
          } 
        : note
    ));
    
    // Sincronizar com o backend se autenticado
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await fetch(`${API_URL}/api/notes/${updatedNote.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({
            title: updatedNote.title,
            content: updatedNote.content,
            tags: updatedNote.tags,
            categories: updatedNote.categories,
            isFavorite: updatedNote.isFavorite,
            isArchived: updatedNote.isArchived,
            isQuickNote: updatedNote.isQuickNote,
            expiresAt: updatedNote.expiresAt,
            isTask: updatedNote.isTask,
            taskItems: updatedNote.taskItems,
            isInTrash: updatedNote.isInTrash,
            deletedAt: updatedNote.deletedAt,
            localVersion: (updatedNote.localVersion || 0) + 1
          })
        });
        
        if (!response.ok) {
          throw new Error('Falha ao atualizar nota');
        }
        
        const savedNote = await response.json();
        
        // Atualizar status de sincronização
        setNotes(prevNotes => prevNotes.map(note => 
          note.id === updatedNote.id 
            ? { 
                ...note, 
                syncStatus: 'synced',
                serverVersion: savedNote.serverVersion
              } 
            : note
        ));
      } catch (err) {
        console.error('Erro ao atualizar nota no servidor:', err);
        // Manter nota local com status pendente
      }
    }
  };

  // Excluir nota permanentemente
  const deleteNote = async (noteId) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    
    // Sincronizar com o backend se autenticado
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        });
        
        if (!response.ok) {
          throw new Error('Falha ao excluir nota');
        }
      } catch (err) {
        console.error('Erro ao excluir nota no servidor:', err);
        // Nota já foi removida localmente
      }
    }
  };

  // Alternar favorito
  const toggleFavorite = async (noteId) => {
    setNotes(prevNotes => prevNotes.map(note => 
      note.id === noteId 
        ? { 
            ...note, 
            isFavorite: !note.isFavorite,
            updatedAt: new Date(),
            syncStatus: 'pending'
          } 
        : note
    ));
    
    // Sincronizar com o backend
    const token = localStorage.getItem('authToken');
    if (token) {
      const noteToUpdate = notes.find(note => note.id === noteId);
      if (noteToUpdate) {
        try {
          const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            },
            body: JSON.stringify({
              ...noteToUpdate,
              isFavorite: !noteToUpdate.isFavorite,
              localVersion: (noteToUpdate.localVersion || 0) + 1
            })
          });
          
          if (!response.ok) {
            throw new Error('Falha ao atualizar favorito');
          }
          
          const savedNote = await response.json();
          
          // Atualizar status de sincronização
          setNotes(prevNotes => prevNotes.map(note => 
            note.id === noteId 
              ? { 
                  ...note, 
                  syncStatus: 'synced',
                  serverVersion: savedNote.serverVersion
                } 
              : note
          ));
        } catch (err) {
          console.error('Erro ao atualizar favorito no servidor:', err);
          // Manter nota local com status pendente
        }
      }
    }
  };

  // Arquivar nota
  const archiveNote = async (noteId) => {
    setNotes(prevNotes => prevNotes.map(note => 
      note.id === noteId 
        ? { 
            ...note, 
            isArchived: !note.isArchived,
            updatedAt: new Date(),
            syncStatus: 'pending'
          } 
        : note
    ));
    
    // Sincronizar com o backend
    const token = localStorage.getItem('authToken');
    if (token) {
      const noteToUpdate = notes.find(note => note.id === noteId);
      if (noteToUpdate) {
        try {
          const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            },
            body: JSON.stringify({
              ...noteToUpdate,
              isArchived: !noteToUpdate.isArchived,
              localVersion: (noteToUpdate.localVersion || 0) + 1
            })
          });
          
          if (!response.ok) {
            throw new Error('Falha ao arquivar nota');
          }
          
          const savedNote = await response.json();
          
          // Atualizar status de sincronização
          setNotes(prevNotes => prevNotes.map(note => 
            note.id === noteId 
              ? { 
                  ...note, 
                  syncStatus: 'synced',
                  serverVersion: savedNote.serverVersion
                } 
              : note
          ));
        } catch (err) {
          console.error('Erro ao arquivar nota no servidor:', err);
          // Manter nota local com status pendente
        }
      }
    }
  };

  // Mover para lixeira
  const moveToTrash = async (noteId) => {
    setNotes(prevNotes => prevNotes.map(note => 
      note.id === noteId 
        ? { 
            ...note, 
            isInTrash: true,
            deletedAt: new Date(),
            updatedAt: new Date(),
            syncStatus: 'pending'
          } 
        : note
    ));
    
    // Sincronizar com o backend
    const token = localStorage.getItem('authToken');
    if (token) {
      const noteToUpdate = notes.find(note => note.id === noteId);
      if (noteToUpdate) {
        try {
          const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            },
            body: JSON.stringify({
              ...noteToUpdate,
              isInTrash: true,
              deletedAt: new Date(),
              localVersion: (noteToUpdate.localVersion || 0) + 1
            })
          });
          
          if (!response.ok) {
            throw new Error('Falha ao mover nota para lixeira');
          }
          
          const savedNote = await response.json();
          
          // Atualizar status de sincronização
          setNotes(prevNotes => prevNotes.map(note => 
            note.id === noteId 
              ? { 
                  ...note, 
                  syncStatus: 'synced',
                  serverVersion: savedNote.serverVersion
                } 
              : note
          ));
        } catch (err) {
          console.error('Erro ao mover nota para lixeira no servidor:', err);
          // Manter nota local com status pendente
        }
      }
    }
  };

  // Restaurar da lixeira
  const restoreFromTrash = async (noteId = restoreNoteId) => {
    if (!noteId) return;
    
    setNotes(prevNotes => prevNotes.map(note => 
      note.id === noteId 
        ? { 
            ...note, 
            isInTrash: false,
            deletedAt: null,
            updatedAt: new Date(),
            syncStatus: 'pending'
          } 
        : note
    ));
    
    // Sincronizar com o backend
    const token = localStorage.getItem('authToken');
    if (token) {
      const noteToUpdate = notes.find(note => note.id === noteId);
      if (noteToUpdate) {
        try {
          const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            },
            body: JSON.stringify({
              ...noteToUpdate,
              isInTrash: false,
              deletedAt: null,
              localVersion: (noteToUpdate.localVersion || 0) + 1
            })
          });
          
          if (!response.ok) {
            throw new Error('Falha ao restaurar nota');
          }
          
          const savedNote = await response.json();
          
          // Atualizar status de sincronização
          setNotes(prevNotes => prevNotes.map(note => 
            note.id === noteId 
              ? { 
                  ...note, 
                  syncStatus: 'synced',
                  serverVersion: savedNote.serverVersion
                } 
              : note
          ));
        } catch (err) {
          console.error('Erro ao restaurar nota no servidor:', err);
          // Manter nota local com status pendente
        }
      }
    }
    
    setRestoreNoteId(null);
  };

  // Esvaziar lixeira
  const emptyTrash = async () => {
    // Obter IDs das notas na lixeira
    const trashNoteIds = notes.filter(note => note.isInTrash).map(note => note.id);
    
    // Remover notas da lixeira
    setNotes(prevNotes => prevNotes.filter(note => !note.isInTrash));
    
    // Sincronizar com o backend
    const token = localStorage.getItem('authToken');
    if (token) {
      for (const noteId of trashNoteIds) {
        try {
          const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            }
          });
          
          if (!response.ok) {
            console.error(`Falha ao excluir nota ${noteId}`);
          }
        } catch (err) {
          console.error(`Erro ao excluir nota ${noteId} no servidor:`, err);
        }
      }
    }
  };

  return {
    notes,
    filteredNotes,
    editingNoteId,
    setEditingNoteId,
    restoreNoteId,
    setRestoreNoteId,
    addNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    archiveNote,
    moveToTrash,
    restoreFromTrash,
    emptyTrash
  };
}
