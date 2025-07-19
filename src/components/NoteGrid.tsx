'use client';

import React from 'react';

interface NoteGridProps {
  notes: any[];
  isGridView: boolean;
  openNoteModal: (noteId?: string | null) => void;
  toggleFavorite: (noteId: string) => void;
  archiveNote: (noteId: string) => void;
  moveToTrash: (noteId: string) => void;
  openRestoreNoteModal: (noteId: string) => void;
  currentCategory: string;
  openEmptyTrashModal: () => void;
  categories: any[];
}

const NoteGrid: React.FC<NoteGridProps> = ({
  notes,
  isGridView,
  openNoteModal,
  toggleFavorite,
  archiveNote,
  moveToTrash,
  openRestoreNoteModal,
  currentCategory,
  openEmptyTrashModal,
  categories
}) => {
  // Função para formatar a data
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Função para renderizar o conteúdo HTML de forma segura
  const renderHTML = (html: string) => {
    return { __html: html };
  };

  // Função para obter a cor da categoria
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#808080';
  };

  // Função para obter o nome da categoria
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Categoria';
  };

  return (
    <div className={`notes-container ${isGridView ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-4'}`}>
      {!notes || notes.length === 0 ? (
        <div className="empty-state text-center p-8">
          <div className="text-6xl text-[var(--muted-color)] mb-4">
            <i className="far fa-sticky-note"></i>
          </div>
          <h3 className="text-xl font-semibold mb-2">Nenhuma nota encontrada</h3>
          <p className="text-[var(--muted-color)]">
            {currentCategory === 'lixeira' 
              ? 'A lixeira está vazia.' 
              : 'Comece criando uma nova nota!'}
          </p>
        </div>
      ) : (
        <>
          {notes.map(note => (
            <div 
              key={note.id} 
              className={`note-card ${isGridView ? '' : 'flex'}`}
              onClick={() => openNoteModal(note.id)}
            >
              {/* Cabeçalho da nota */}
              <div className="note-header mb-2">
                <h3 className="text-lg font-semibold mb-1">{note.title}</h3>
                
                {/* Tags de categorias */}
                <div className="note-categories mb-2">
                  {note.categories.map(categoryId => (
                    <span 
                      key={categoryId}
                      className="category-tag"
                      style={{ backgroundColor: getCategoryColor(categoryId) }}
                    >
                      {getCategoryName(categoryId)}
                    </span>
                  ))}
                </div>
                
                {/* Tags */}
                <div className="note-tags mb-2">
                  {note.tags.map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Conteúdo da nota */}
              <div className="note-content mb-3">
                {note.isTask ? (
                  <div className="task-list">
                    {note.taskItems.map((task, index) => (
                      <div key={index} className="task-item flex items-center mb-1">
                        <input 
                          type="checkbox" 
                          checked={task.completed} 
                          onChange={e => e.stopPropagation()}
                          className="mr-2"
                        />
                        <span className={task.completed ? 'line-through text-[var(--muted-color)]' : ''}>
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div 
                    className="note-text max-h-32 overflow-hidden"
                    dangerouslySetInnerHTML={renderHTML(note.content)}
                  ></div>
                )}
              </div>
              
              {/* Rodapé da nota */}
              <div className="note-footer flex justify-between items-center text-xs text-[var(--muted-color)]">
                <div className="note-date">
                  {formatDate(note.updatedAt)}
                </div>
                
                <div className="note-actions flex gap-2" onClick={e => e.stopPropagation()}>
                  {note.isInTrash ? (
                    <button 
                      className="p-1 hover:text-[var(--success-color)]"
                      onClick={() => openRestoreNoteModal(note.id)}
                      title="Restaurar"
                    >
                      <i className="fas fa-trash-restore"></i>
                    </button>
                  ) : (
                    <>
                      <button 
                        className={`p-1 ${note.isFavorite ? 'text-[var(--warning-color)]' : 'hover:text-[var(--warning-color)]'}`}
                        onClick={() => toggleFavorite(note.id)}
                        title={note.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                      >
                        <i className={`${note.isFavorite ? 'fas' : 'far'} fa-star`}></i>
                      </button>
                      
                      <button 
                        className="p-1 hover:text-[var(--primary-color)]"
                        onClick={() => archiveNote(note.id)}
                        title={note.isArchived ? 'Desarquivar' : 'Arquivar'}
                      >
                        <i className={`${note.isArchived ? 'fas' : 'far'} fa-archive`}></i>
                      </button>
                      
                      <button 
                        className="p-1 hover:text-[var(--danger-color)]"
                        onClick={() => moveToTrash(note.id)}
                        title="Mover para lixeira"
                      >
                        <i className="far fa-trash-alt"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Indicador de sincronização */}
              {note.syncStatus === 'pending' && (
                <div className="sync-indicator absolute top-2 right-2 text-[var(--warning-color)]">
                  <i className="fas fa-sync-alt"></i>
                </div>
              )}
            </div>
          ))}
          
          {/* Botão para esvaziar lixeira */}
          {currentCategory === 'lixeira' && notes.length > 0 && (
            <div className="empty-trash-button fixed bottom-6 right-6">
              <button 
                className="btn btn-danger rounded-full p-4 shadow-lg"
                onClick={openEmptyTrashModal}
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NoteGrid;
