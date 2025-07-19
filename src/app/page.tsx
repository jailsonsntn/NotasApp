'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import NoteGrid from '@/components/NoteGrid';
import NoteModal from '@/components/NoteModal';
import CategoryModal from '@/components/CategoryModal';
import EmptyTrashModal from '@/components/EmptyTrashModal';
import RestoreNoteModal from '@/components/RestoreNoteModal';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';
import WelcomeModal from '@/components/WelcomeModal';
import { useAuth } from '@/hooks/useAuth';
import { useNotes } from '@/hooks/useNotesSimple';
import { useCategories } from '@/hooks/useCategories';
import { useSync } from '@/hooks/useSync';
import { initializeDefaultData } from '@/lib/initialData';
import { useTheme, useInitialization, useIsClient } from '@/hooks/useHydration';

export default function Home() {
  const [currentCategory, setCurrentCategory] = useState('minhas-notas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGridView, setIsGridView] = useState(true);
  
  // Hooks seguros para hidratação
  const { theme, toggleTheme, mounted } = useTheme();
  const { initialized } = useInitialization();
  const isClient = useIsClient();
  
  // Modals state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEmptyTrashModalOpen, setIsEmptyTrashModalOpen] = useState(false);
  const [isRestoreNoteModalOpen, setIsRestoreNoteModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  
  // Auth hook
  const { 
    user, 
    isAuthenticated, 
    login, 
    register, 
    logout 
  } = useAuth();
  
  // Notes hook
  const { 
    notes, 
    addNote, 
    updateNote, 
    deleteNote, 
    toggleFavorite, 
    archiveNote, 
    moveToTrash, 
    restoreFromTrash, 
    emptyTrash,
    filteredNotes
  } = useNotes(currentCategory, searchQuery);
  
  // Categories hook
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory 
  } = useCategories();
  
  // Sync hook
  const { 
    syncStatus, 
    connectionStatus, 
    lastSyncTime, 
    syncNow 
  } = useSync(isAuthenticated);
  
  // Welcome modal logic - apenas no cliente
  useEffect(() => {
    if (isClient && isAuthenticated && user && !localStorage.getItem('welcomeModalShown')) {
      setIsWelcomeModalOpen(true);
      localStorage.setItem('welcomeModalShown', 'true');
    }
  }, [isClient, isAuthenticated, user]);
  
  // View toggle
  const toggleView = (view) => {
    setIsGridView(view === 'grid');
    
    // Update user preferences if logged in
    if (isAuthenticated) {
      // Update user preferences in backend
    }
  };
  
  // Modal handlers
  const openNoteModal = (noteId = null) => {
    if (noteId) {
      // Buscar a nota pelo ID
      const noteToEdit = notes.find(note => note.id === noteId);
      setEditingNote(noteToEdit || null);
    } else {
      // Nova nota
      setEditingNote(null);
    }
    setIsNoteModalOpen(true);
  };
  
  const openCategoryModal = () => {
    setIsCategoryModalOpen(true);
  };
  
  const openEmptyTrashModal = () => {
    setIsEmptyTrashModalOpen(true);
  };
  
  const openRestoreNoteModal = (noteId) => {
    setIsRestoreNoteModalOpen(true);
  };
  
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };
  
  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };
  
  return (
    <main className="flex min-h-screen">
      <Sidebar 
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
        categories={categories}
        openCategoryModal={openCategoryModal}
        isDarkTheme={theme === 'dark'}
        toggleTheme={toggleTheme}
        isAuthenticated={isAuthenticated}
        user={user}
        logout={logout}
        openLoginModal={openLoginModal}
        openRegisterModal={openRegisterModal}
        syncStatus={syncStatus}
        connectionStatus={connectionStatus}
        lastSyncTime={lastSyncTime}
        syncNow={syncNow}
      />
      
      <div className="main-content flex-1 p-4">
        <div className="top-bar flex items-center mb-6">
          <div className="note-input-container flex-1 relative">
            <input 
              type="text" 
              placeholder="O que você quer anotar?" 
              className="w-full p-3 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  addNote(e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <div className="input-actions absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
              <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                <i className="fas fa-microphone"></i>
              </button>
              <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                <i className="fas fa-comment"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div className="category-header flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {currentCategory === 'minhas-notas' ? 'Minhas notas' :
             currentCategory === 'favoritos' ? 'Favoritos' :
             currentCategory === 'tarefas' ? 'Tarefas' :
             currentCategory === 'ideias' ? 'Ideias' :
             currentCategory === 'anotacoes-rapidas' ? 'Anotações rápidas' :
             currentCategory === 'arquivadas' ? 'Arquivadas' :
             currentCategory === 'lixeira' ? 'Lixeira' :
             categories.find(cat => cat.id === currentCategory)?.name || 'Categoria'}
          </h2>
          
          <div className="view-options flex gap-2">
            <button 
              className={`p-2 rounded-md ${isGridView ? 'bg-[var(--primary-color)] text-white' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
              onClick={() => toggleView('grid')}
            >
              <i className="fas fa-th"></i>
            </button>
            <button 
              className={`p-2 rounded-md ${!isGridView ? 'bg-[var(--primary-color)] text-white' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
              onClick={() => toggleView('list')}
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
        
        <NoteGrid 
          notes={filteredNotes}
          isGridView={isGridView}
          openNoteModal={openNoteModal}
          toggleFavorite={toggleFavorite}
          archiveNote={archiveNote}
          moveToTrash={moveToTrash}
          openRestoreNoteModal={openRestoreNoteModal}
          currentCategory={currentCategory}
          openEmptyTrashModal={openEmptyTrashModal}
          categories={categories}
        />
      </div>
      
      {isNoteModalOpen && (
        <NoteModal 
          isOpen={isNoteModalOpen}
          onClose={() => {
            setIsNoteModalOpen(false);
            setEditingNote(null);
          }}
          onSave={(note) => {
            if (note.id) {
              updateNote(note);
            } else {
              addNote(note.title, note.content, note.categories, note.tags, note.isTask, note.taskItems, note.isFavorite, note.isQuickNote);
            }
            setEditingNote(null);
          }}
          note={editingNote}
          categories={categories}
        />
      )}
      
      {isCategoryModalOpen && (
        <CategoryModal 
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          onSave={(category) => {
            if (category.id) {
              updateCategory(category);
            } else {
              addCategory(category.name, category.color);
            }
          }}
        />
      )}
      
      {isEmptyTrashModalOpen && (
        <EmptyTrashModal 
          isOpen={isEmptyTrashModalOpen}
          onClose={() => setIsEmptyTrashModalOpen(false)}
          onConfirm={() => {
            emptyTrash();
            setIsEmptyTrashModalOpen(false);
          }}
        />
      )}
      
      {isRestoreNoteModalOpen && (
        <RestoreNoteModal 
          isOpen={isRestoreNoteModalOpen}
          onClose={() => setIsRestoreNoteModalOpen(false)}
          onConfirm={() => {
            restoreFromTrash();
            setIsRestoreNoteModalOpen(false);
          }}
        />
      )}
      
      {isLoginModalOpen && (
        <LoginModal 
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={login}
          onRegisterClick={() => {
            setIsLoginModalOpen(false);
            setIsRegisterModalOpen(true);
          }}
        />
      )}
      
      {isRegisterModalOpen && (
        <RegisterModal 
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onRegister={register}
          onLoginClick={() => {
            setIsRegisterModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />
      )}
      
      {isWelcomeModalOpen && (
        <WelcomeModal 
          isOpen={isWelcomeModalOpen}
          onClose={() => setIsWelcomeModalOpen(false)}
          userName={user?.name}
        />
      )}
    </main>
  );
}
