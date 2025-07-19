'use client';

import React, { useState, useEffect, useRef } from 'react';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: any) => void;
  note?: any;
  categories: any[];
}

const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  note,
  categories
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTask, setIsTask] = useState(false);
  const [taskItems, setTaskItems] = useState<{text: string, completed: boolean}[]>([]);
  const [taskInput, setTaskInput] = useState('');
  const [isQuickNote, setIsQuickNote] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Inicializar com dados da nota se estiver editando
  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setSelectedCategories(note.categories || []);
      setTags(note.tags || []);
      setIsFavorite(note.isFavorite || false);
      setIsTask(note.isTask || false);
      setTaskItems(note.taskItems || []);
      setIsQuickNote(note.isQuickNote || false);
    } else {
      // Valores padrão para nova nota
      setTitle('');
      setContent('');
      setSelectedCategories([]);
      setTags([]);
      setIsFavorite(false);
      setIsTask(false);
      setTaskItems([]);
      setIsQuickNote(false);
    }
  }, [note]);
  
  // Fechar modal ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Inicializar editor de texto rico
  useEffect(() => {
    if (isOpen && editorRef.current) {
      editorRef.current.innerHTML = content;
      
      // Configurar barra de ferramentas
      const toolbar = document.getElementById('rich-editor-toolbar');
      if (toolbar) {
        const buttons = toolbar.querySelectorAll('button');
        buttons.forEach(button => {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            const command = button.getAttribute('data-command');
            const value = button.getAttribute('data-value');
            
            if (command) {
              if (command === 'createLink') {
                const url = prompt('Insira o URL do link:');
                if (url) document.execCommand(command, false, url);
              } else if (value) {
                document.execCommand(command, false, value);
              } else {
                document.execCommand(command, false, null);
              }
              
              // Atualizar conteúdo após comando
              if (editorRef.current) {
                setContent(editorRef.current.innerHTML);
              }
            }
          });
        });
      }
    }
  }, [isOpen, content]);
  
  // Atualizar conteúdo quando o editor é modificado
  const handleEditorChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };
  
  // Adicionar tag
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  // Remover tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Adicionar item de tarefa
  const addTaskItem = () => {
    if (taskInput.trim()) {
      setTaskItems([...taskItems, { text: taskInput.trim(), completed: false }]);
      setTaskInput('');
    }
  };
  
  // Remover item de tarefa
  const removeTaskItem = (index: number) => {
    setTaskItems(taskItems.filter((_, i) => i !== index));
  };
  
  // Alternar estado de conclusão da tarefa
  const toggleTaskCompletion = (index: number) => {
    setTaskItems(taskItems.map((item, i) => 
      i === index ? { ...item, completed: !item.completed } : item
    ));
  };
  
  // Alternar categoria
  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };
  
  // Salvar nota
  const handleSave = () => {
    const savedNote = {
      id: note?.id,
      title: title.trim() || 'Nota sem título',
      content,
      categories: selectedCategories,
      tags,
      isFavorite,
      isArchived: note?.isArchived || false,
      isQuickNote,
      expiresAt: isQuickNote ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) : null, // 5 dias
      isTask,
      taskItems,
      isInTrash: note?.isInTrash || false,
      deletedAt: note?.deletedAt || null,
      createdAt: note?.createdAt || new Date(),
      updatedAt: new Date(),
      localVersion: (note?.localVersion || 0) + 1,
      serverVersion: note?.serverVersion
    };
    
    onSave(savedNote);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay fixed inset-0 bg-[var(--modal-overlay)] flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="modal-content bg-[var(--card-bg)] rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="modal-header p-4 border-b border-[var(--border-color)]">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {note ? 'Editar nota' : 'Nova nota'}
            </h2>
            <button 
              className="text-[var(--muted-color)] hover:text-[var(--text-color)]"
              onClick={onClose}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <div className="modal-body p-4 overflow-y-auto flex-1">
          {/* Título */}
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="Título da nota" 
              className="modal-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          {/* Categorias */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Categorias</label>
            <div className="categories-grid grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map(category => (
                <div 
                  key={category.id}
                  className={`category-item p-2 rounded-md cursor-pointer flex items-center gap-2 ${
                    selectedCategories.includes(category.id) 
                      ? 'bg-[var(--primary-color)] text-white' 
                      : 'bg-[var(--bg-color)] hover:bg-[var(--border-color)]'
                  }`}
                  onClick={() => toggleCategory(category.id)}
                >
                  <span 
                    className="category-color w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></span>
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tags */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="tags-input-container flex items-center">
              <input 
                type="text" 
                placeholder="Adicionar tag" 
                className="modal-input flex-1"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <button 
                className="ml-2 p-2 bg-[var(--primary-color)] text-white rounded-md"
                onClick={addTag}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
            
            <div className="tags-list mt-2 flex flex-wrap gap-1">
              {tags.map(tag => (
                <div 
                  key={tag}
                  className="tag flex items-center"
                >
                  <span>{tag}</span>
                  <button 
                    className="ml-1 text-white hover:text-white/80"
                    onClick={() => removeTag(tag)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Opções */}
          <div className="mb-4 flex flex-wrap gap-4">
            <div className="option-item flex items-center">
              <input 
                type="checkbox" 
                id="favorite-option" 
                className="mr-2"
                checked={isFavorite}
                onChange={() => setIsFavorite(!isFavorite)}
              />
              <label htmlFor="favorite-option">Favorito</label>
            </div>
            
            <div className="option-item flex items-center">
              <input 
                type="checkbox" 
                id="task-option" 
                className="mr-2"
                checked={isTask}
                onChange={() => setIsTask(!isTask)}
              />
              <label htmlFor="task-option">Lista de tarefas</label>
            </div>
            
            <div className="option-item flex items-center">
              <input 
                type="checkbox" 
                id="quick-note-option" 
                className="mr-2"
                checked={isQuickNote}
                onChange={() => setIsQuickNote(!isQuickNote)}
              />
              <label htmlFor="quick-note-option">Anotação rápida (expira em 5 dias)</label>
            </div>
          </div>
          
          {/* Conteúdo da nota (editor de texto rico ou lista de tarefas) */}
          {isTask ? (
            <div className="task-editor mb-4">
              <label className="block text-sm font-medium mb-2">Itens da tarefa</label>
              
              <div className="task-input-container flex items-center mb-2">
                <input 
                  type="text" 
                  placeholder="Adicionar item" 
                  className="modal-input flex-1"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTaskItem();
                    }
                  }}
                />
                <button 
                  className="ml-2 p-2 bg-[var(--primary-color)] text-white rounded-md"
                  onClick={addTaskItem}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              
              <div className="task-items-list">
                {taskItems.map((item, index) => (
                  <div 
                    key={index}
                    className="task-item flex items-center p-2 border-b border-[var(--border-color)]"
                  >
                    <input 
                      type="checkbox" 
                      checked={item.completed} 
                      onChange={() => toggleTaskCompletion(index)}
                      className="mr-2"
                    />
                    <span className={item.completed ? 'line-through text-[var(--muted-color)] flex-1' : 'flex-1'}>
                      {item.text}
                    </span>
                    <button 
                      className="text-[var(--danger-color)]"
                      onClick={() => removeTaskItem(index)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
                
                {taskItems.length === 0 && (
                  <div className="empty-tasks text-center p-4 text-[var(--muted-color)]">
                    Adicione itens à sua lista de tarefas
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rich-text-editor mb-4">
              <label className="block text-sm font-medium mb-2">Conteúdo da nota</label>
              
              <div id="rich-editor-toolbar" className="editor-toolbar flex flex-wrap gap-1 mb-2 p-2 bg-[var(--bg-color)] rounded-t-md border border-[var(--border-color)]">
                {/* Formatação de texto */}
                <button data-command="bold" className="p-1 hover:bg-[var(--border-color)] rounded" title="Negrito">
                  <i className="fas fa-bold"></i>
                </button>
                <button data-command="italic" className="p-1 hover:bg-[var(--border-color)] rounded" title="Itálico">
                  <i className="fas fa-italic"></i>
                </button>
                <button data-command="underline" className="p-1 hover:bg-[var(--border-color)] rounded" title="Sublinhado">
                  <i className="fas fa-underline"></i>
                </button>
                <button data-command="strikeThrough" className="p-1 hover:bg-[var(--border-color)] rounded" title="Tachado">
                  <i className="fas fa-strikethrough"></i>
                </button>
                
                <span className="separator mx-1 border-r border-[var(--border-color)]"></span>
                
                {/* Alinhamento */}
                <button data-command="justifyLeft" className="p-1 hover:bg-[var(--border-color)] rounded" title="Alinhar à esquerda">
                  <i className="fas fa-align-left"></i>
                </button>
                <button data-command="justifyCenter" className="p-1 hover:bg-[var(--border-color)] rounded" title="Centralizar">
                  <i className="fas fa-align-center"></i>
                </button>
                <button data-command="justifyRight" className="p-1 hover:bg-[var(--border-color)] rounded" title="Alinhar à direita">
                  <i className="fas fa-align-right"></i>
                </button>
                
                <span className="separator mx-1 border-r border-[var(--border-color)]"></span>
                
                {/* Listas */}
                <button data-command="insertUnorderedList" className="p-1 hover:bg-[var(--border-color)] rounded" title="Lista com marcadores">
                  <i className="fas fa-list-ul"></i>
                </button>
                <button data-command="insertOrderedList" className="p-1 hover:bg-[var(--border-color)] rounded" title="Lista numerada">
                  <i className="fas fa-list-ol"></i>
                </button>
                
                <span className="separator mx-1 border-r border-[var(--border-color)]"></span>
                
                {/* Links */}
                <button data-command="createLink" className="p-1 hover:bg-[var(--border-color)] rounded" title="Inserir link">
                  <i className="fas fa-link"></i>
                </button>
                <button data-command="unlink" className="p-1 hover:bg-[var(--border-color)] rounded" title="Remover link">
                  <i className="fas fa-unlink"></i>
                </button>
                
                <span className="separator mx-1 border-r border-[var(--border-color)]"></span>
                
                {/* Cores */}
                <button data-command="foreColor" data-value="#DB4437" className="p-1 hover:bg-[var(--border-color)] rounded" title="Texto vermelho">
                  <i className="fas fa-font text-[#DB4437]"></i>
                </button>
                <button data-command="foreColor" data-value="#0F9D58" className="p-1 hover:bg-[var(--border-color)] rounded" title="Texto verde">
                  <i className="fas fa-font text-[#0F9D58]"></i>
                </button>
                <button data-command="foreColor" data-value="#4285F4" className="p-1 hover:bg-[var(--border-color)] rounded" title="Texto azul">
                  <i className="fas fa-font text-[#4285F4]"></i>
                </button>
                <button data-command="foreColor" data-value="#F4B400" className="p-1 hover:bg-[var(--border-color)] rounded" title="Texto amarelo">
                  <i className="fas fa-font text-[#F4B400]"></i>
                </button>
                
                <span className="separator mx-1 border-r border-[var(--border-color)]"></span>
                
                {/* Fundo */}
                <button data-command="hiliteColor" data-value="#ffcdd2" className="p-1 hover:bg-[var(--border-color)] rounded" title="Fundo vermelho">
                  <i className="fas fa-highlighter text-[#ffcdd2]"></i>
                </button>
                <button data-command="hiliteColor" data-value="#c8e6c9" className="p-1 hover:bg-[var(--border-color)] rounded" title="Fundo verde">
                  <i className="fas fa-highlighter text-[#c8e6c9]"></i>
                </button>
                <button data-command="hiliteColor" data-value="#bbdefb" className="p-1 hover:bg-[var(--border-color)] rounded" title="Fundo azul">
                  <i className="fas fa-highlighter text-[#bbdefb]"></i>
                </button>
                <button data-command="hiliteColor" data-value="#fff9c4" className="p-1 hover:bg-[var(--border-color)] rounded" title="Fundo amarelo">
                  <i className="fas fa-highlighter text-[#fff9c4]"></i>
                </button>
              </div>
              
              <div 
                ref={editorRef}
                className="editor-content p-3 min-h-[200px] border border-[var(--border-color)] rounded-b-md bg-[var(--card-bg)]"
                contentEditable
                onInput={handleEditorChange}
              ></div>
            </div>
          )}
        </div>
        
        <div className="modal-footer p-4 border-t border-[var(--border-color)] flex justify-end">
          <button 
            className="btn btn-secondary mr-2"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSave}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
