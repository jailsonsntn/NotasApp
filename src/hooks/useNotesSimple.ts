import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface SimpleNote {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  color: string;
  tags: string[];
  isArchived: boolean;
  isTrashed: boolean;
  isInTrash?: boolean;
  isFavorite?: boolean;
  isTask?: boolean;
  isQuickNote?: boolean;
  createdAt: string;
  updatedAt: string;
  syncStatus: string;
}

export function useNotes(currentCategory: string, searchQuery: string) {
  const [notes, setNotes] = useState<SimpleNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<SimpleNote[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [restoreNoteId, setRestoreNoteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar notas do localStorage em desenvolvimento
  useEffect(() => {
    const loadNotes = async () => {
      if (process.env.NODE_ENV === 'development') {
        // Usar dados do localStorage em desenvolvimento
        const storedNotes = localStorage.getItem('notes');
        if (storedNotes) {
          try {
            const notesData = JSON.parse(storedNotes);
            setNotes(notesData);
          } catch (error) {
            console.error('Erro ao carregar notas:', error);
            setNotes([]);
          }
        } else {
          // Inicializar com algumas notas de exemplo
          const defaultNotes: SimpleNote[] = [
            {
              id: '1',
              title: 'Bem-vindo ao NotasApp',
              content: 'Esta é sua primeira nota! Você pode editar, categorizar e organizar suas ideias aqui.',
              categoryId: '1',
              color: '#FF6B6B',
              tags: ['exemplo'],
              isArchived: false,
              isTrashed: false,
              isFavorite: false,
              isTask: false,
              isQuickNote: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              syncStatus: 'synced'
            }
          ];
          setNotes(defaultNotes);
          localStorage.setItem('notes', JSON.stringify(defaultNotes));
        }
      }
      setIsLoading(false);
    };

    loadNotes();
  }, []);

  // Filtrar notas baseado na categoria e busca
  useEffect(() => {
    let filtered = notes;

    // Filtrar por categoria especial
    if (currentCategory === 'favorites') {
      filtered = filtered.filter(note => note.isFavorite && !note.isInTrash);
    } else if (currentCategory === 'tasks') {
      filtered = filtered.filter(note => note.isTask && !note.isArchived && !note.isInTrash);
    } else if (currentCategory === 'ideas') {
      filtered = filtered.filter(note => note.tags.includes('ideia') && !note.isArchived && !note.isInTrash);
    } else if (currentCategory === 'quick-notes') {
      filtered = filtered.filter(note => note.isQuickNote && !note.isArchived && !note.isInTrash);
    } else if (currentCategory === 'archive') {
      filtered = filtered.filter(note => note.isArchived && !note.isInTrash);
    } else if (currentCategory === 'trash') {
      filtered = filtered.filter(note => note.isInTrash || note.isTrashed);
    } else if (currentCategory === 'all') {
      filtered = filtered.filter(note => !note.isArchived && !note.isInTrash && !note.isTrashed);
    } else {
      // Filtrar por categoria específica
      filtered = filtered.filter(note => 
        note.categoryId === currentCategory &&
        !note.isArchived &&
        !note.isInTrash &&
        !note.isTrashed
      );
    }

    // Filtrar por termo de busca
    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Ordenar por data de atualização
    filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    setFilteredNotes(filtered);
  }, [notes, currentCategory, searchQuery]);

  const saveNotesToStorage = (updatedNotes: SimpleNote[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const addNote = async (title: string, content = '', categoryId = '1', tags: string[] = [], isTask = false, isFavorite = false, isQuickNote = false) => {
    const newNote: SimpleNote = {
      id: uuidv4(),
      title,
      content,
      categoryId,
      color: '#FFE4B5',
      tags,
      isArchived: false,
      isTrashed: false,
      isFavorite,
      isTask,
      isQuickNote,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: 'synced'
    };

    const updatedNotes = [newNote, ...notes];
    saveNotesToStorage(updatedNotes);
    return newNote;
  };

  const updateNote = async (noteId: string, updates: Partial<SimpleNote>) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    );
    saveNotesToStorage(updatedNotes);
  };

  const deleteNote = async (noteId: string) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId
        ? { ...note, isInTrash: true, isTrashed: true, updatedAt: new Date().toISOString() }
        : note
    );
    saveNotesToStorage(updatedNotes);
  };

  const restoreNote = async (noteId: string) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId
        ? { ...note, isInTrash: false, isTrashed: false, isArchived: false, updatedAt: new Date().toISOString() }
        : note
    );
    saveNotesToStorage(updatedNotes);
  };

  const toggleFavorite = async (noteId: string) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId
        ? { ...note, isFavorite: !note.isFavorite, updatedAt: new Date().toISOString() }
        : note
    );
    saveNotesToStorage(updatedNotes);
  };

  const archiveNote = async (noteId: string) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId
        ? { ...note, isArchived: !note.isArchived, updatedAt: new Date().toISOString() }
        : note
    );
    saveNotesToStorage(updatedNotes);
  };

  const emptyTrash = async () => {
    const updatedNotes = notes.filter(note => !note.isInTrash && !note.isTrashed);
    saveNotesToStorage(updatedNotes);
  };

  return {
    notes: filteredNotes,
    isLoading,
    addNote,
    updateNote,
    deleteNote,
    restoreNote,
    toggleFavorite,
    archiveNote,
    emptyTrash,
    editingNoteId,
    setEditingNoteId,
    restoreNoteId,
    setRestoreNoteId
  };
}
