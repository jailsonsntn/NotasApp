'use client';

import React from 'react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: any) => void;
  category?: any;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category
}) => {
  const [name, setName] = React.useState('');
  const [color, setColor] = React.useState('#4285F4');
  const modalRef = React.useRef<HTMLDivElement>(null);
  
  // Cores predefinidas
  const predefinedColors = [
    '#4285F4', // Azul
    '#0F9D58', // Verde
    '#DB4437', // Vermelho
    '#F4B400', // Amarelo
    '#673AB7', // Roxo
    '#FF5722', // Laranja
    '#795548', // Marrom
    '#607D8B', // Cinza azulado
  ];
  
  // Inicializar com dados da categoria se estiver editando
  React.useEffect(() => {
    if (category) {
      setName(category.name || '');
      setColor(category.color || '#4285F4');
    } else {
      // Valores padrão para nova categoria
      setName('');
      setColor('#4285F4');
    }
  }, [category]);
  
  // Fechar modal ao clicar fora
  React.useEffect(() => {
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
  
  // Salvar categoria
  const handleSave = () => {
    if (!name.trim()) {
      alert('Por favor, insira um nome para a categoria.');
      return;
    }
    
    const savedCategory = {
      id: category?.id,
      name: name.trim(),
      color,
      createdAt: category?.createdAt || new Date(),
      updatedAt: new Date(),
      localVersion: (category?.localVersion || 0) + 1,
      serverVersion: category?.serverVersion
    };
    
    onSave(savedCategory);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay fixed inset-0 bg-[var(--modal-overlay)] flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="modal-content bg-[var(--card-bg)] rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col"
      >
        <div className="modal-header p-4 border-b border-[var(--border-color)]">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {category ? 'Editar categoria' : 'Nova categoria'}
            </h2>
            <button 
              className="text-[var(--muted-color)] hover:text-[var(--text-color)]"
              onClick={onClose}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <div className="modal-body p-4">
          {/* Nome da categoria */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nome da categoria</label>
            <input 
              type="text" 
              placeholder="Nome da categoria" 
              className="modal-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          {/* Cor da categoria */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Cor da categoria</label>
            <div className="color-picker flex flex-wrap gap-2">
              {predefinedColors.map(presetColor => (
                <div 
                  key={presetColor}
                  className={`color-option w-8 h-8 rounded-full cursor-pointer ${
                    color === presetColor ? 'ring-2 ring-offset-2 ring-[var(--primary-color)]' : ''
                  }`}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => setColor(presetColor)}
                ></div>
              ))}
              
              <div className="custom-color-input flex items-center">
                <input 
                  type="color" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
              </div>
            </div>
          </div>
          
          {/* Visualização */}
          <div className="category-preview p-3 rounded-md flex items-center gap-2 mb-4" style={{ backgroundColor: color }}>
            <span className="text-white">{name || 'Nome da categoria'}</span>
          </div>
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

export default CategoryModal;
