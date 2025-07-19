'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  currentCategory: string;
  setCurrentCategory: (category: string) => void;
  categories: any[];
  openCategoryModal: () => void;
  isDarkTheme: boolean;
  toggleTheme: () => void;
  isAuthenticated: boolean;
  user: any;
  logout: () => void;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  syncStatus: string;
  connectionStatus: string;
  lastSyncTime: Date | null;
  syncNow: () => Promise<any>;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentCategory,
  setCurrentCategory,
  categories,
  openCategoryModal,
  isDarkTheme,
  toggleTheme,
  isAuthenticated,
  user,
  logout,
  openLoginModal,
  openRegisterModal,
  syncStatus,
  connectionStatus,
  lastSyncTime,
  syncNow
}) => {
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    setCurrentCategory(category);
  };

  return (
    <div className="sidebar w-64 h-screen bg-[var(--card-bg)] border-r border-[var(--border-color)] p-4 flex flex-col">
      <div className="sidebar-header mb-6">
        <h1 className="text-2xl font-bold text-[var(--primary-color)]">NotasApp</h1>
        <p className="text-sm text-[var(--muted-color)]">Suas notas em qualquer lugar</p>
      </div>

      {isAuthenticated ? (
        <div className="user-profile mb-6 flex items-center">
          <div className="avatar w-10 h-10 rounded-full bg-[var(--primary-color)] flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-3">
            <p className="font-medium">{user?.name || 'Usuário'}</p>
            <p className="text-xs text-[var(--muted-color)]">{user?.email || 'email@exemplo.com'}</p>
          </div>
        </div>
      ) : (
        <div className="auth-buttons mb-6 flex gap-2">
          <button 
            className="btn btn-primary flex-1 py-1 text-sm"
            onClick={openLoginModal}
          >
            Login
          </button>
          <button 
            className="btn btn-secondary flex-1 py-1 text-sm"
            onClick={openRegisterModal}
          >
            Registrar
          </button>
        </div>
      )}

      <div className="search-box mb-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Pesquisar" 
            className="w-full p-2 pl-8 rounded-md border border-[var(--border-color)] bg-[var(--bg-color)]"
          />
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[var(--muted-color)]">
            <i className="fas fa-search"></i>
          </span>
        </div>
      </div>

      <div className="sidebar-categories flex-1 overflow-y-auto">
        <div 
          className={`sidebar-item ${currentCategory === 'minhas-notas' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('minhas-notas')}
        >
          <i className="fas fa-sticky-note"></i>
          <span>Minhas notas</span>
        </div>
        
        <div 
          className={`sidebar-item ${currentCategory === 'favoritos' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('favoritos')}
        >
          <i className="fas fa-star"></i>
          <span>Favoritos</span>
        </div>
        
        <div 
          className={`sidebar-item ${currentCategory === 'tarefas' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('tarefas')}
        >
          <i className="fas fa-tasks"></i>
          <span>Tarefas</span>
        </div>
        
        <div 
          className={`sidebar-item ${currentCategory === 'ideias' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('ideias')}
        >
          <i className="fas fa-lightbulb"></i>
          <span>Ideias</span>
        </div>
        
        <div 
          className={`sidebar-item ${currentCategory === 'anotacoes-rapidas' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('anotacoes-rapidas')}
        >
          <i className="fas fa-bolt"></i>
          <span>Anotações rápidas</span>
        </div>
        
        <div 
          className={`sidebar-item ${currentCategory === 'arquivadas' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('arquivadas')}
        >
          <i className="fas fa-archive"></i>
          <span>Arquivadas</span>
        </div>
        
        <div 
          className={`sidebar-item ${currentCategory === 'lixeira' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('lixeira')}
        >
          <i className="fas fa-trash"></i>
          <span>Lixeira</span>
        </div>
        
        <div className="categories-divider my-3 border-t border-[var(--divider-color)]"></div>
        
        <div className="custom-categories">
          <h3 className="text-xs uppercase text-[var(--muted-color)] font-semibold mb-2 px-3">Categorias</h3>
          
          {categories.map(category => (
            <div 
              key={category.id}
              className={`sidebar-item ${currentCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <span 
                className="category-color w-4 h-4 rounded-full" 
                style={{ backgroundColor: category.color }}
              ></span>
              <span>{category.name}</span>
            </div>
          ))}
          
          <div 
            className="sidebar-item text-[var(--primary-color)]"
            onClick={openCategoryModal}
          >
            <i className="fas fa-plus"></i>
            <span>Criar categoria</span>
          </div>
        </div>
      </div>

      <div className="sidebar-footer mt-4 pt-4 border-t border-[var(--divider-color)]">
        <div className="sync-status mb-3 text-xs text-[var(--muted-color)]">
          <div className="flex items-center justify-between">
            <span>Sincronização: </span>
            <span className={`
              ${syncStatus === 'syncing' ? 'text-[var(--warning-color)]' : ''}
              ${syncStatus === 'success' ? 'text-[var(--success-color)]' : ''}
              ${syncStatus === 'error' ? 'text-[var(--danger-color)]' : ''}
            `}>
              {syncStatus === 'idle' && 'Aguardando'}
              {syncStatus === 'syncing' && 'Sincronizando...'}
              {syncStatus === 'success' && 'Sincronizado'}
              {syncStatus === 'error' && 'Erro'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Conexão: </span>
            <span className={connectionStatus === 'online' ? 'text-[var(--success-color)]' : 'text-[var(--danger-color)]'}>
              {connectionStatus === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>
          {lastSyncTime && (
            <div className="text-xs mt-1">
              Última sincronização: {lastSyncTime.toLocaleTimeString()}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button 
            className="btn btn-primary flex-1 py-1 text-sm"
            onClick={syncNow}
            disabled={syncStatus === 'syncing' || connectionStatus === 'offline' || !isAuthenticated}
          >
            <i className="fas fa-sync-alt mr-1"></i> Sincronizar
          </button>
          
          <button 
            className="btn btn-secondary flex-1 py-1 text-sm"
            onClick={toggleTheme}
          >
            {isDarkTheme ? (
              <>
                <i className="fas fa-sun mr-1"></i> Modo claro
              </>
            ) : (
              <>
                <i className="fas fa-moon mr-1"></i> Modo escuro
              </>
            )}
          </button>
        </div>
        
        {isAuthenticated && (
          <button 
            className="btn btn-danger w-full mt-2 py-1 text-sm"
            onClick={logout}
          >
            <i className="fas fa-sign-out-alt mr-1"></i> Sair
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
