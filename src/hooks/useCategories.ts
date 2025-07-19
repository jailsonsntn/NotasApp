import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Category } from '@/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API URL - será substituído pelo URL real em produção
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.notasapp.com';

  // Carregar categorias do localStorage ou API
  useEffect(() => {
    const loadCategories = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // Verificar se estamos em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          // Usar dados mock em desenvolvimento
          const mockCategories = JSON.parse(localStorage.getItem('categories') || '[]');
          if (mockCategories.length === 0) {
            // Inicializar com categorias padrão se não existirem
            const defaultCategories: Category[] = [
              { id: '1', name: 'Pessoal', icon: '👤', color: '#FF6B6B', isDefault: true, syncStatus: 'synced', createdAt: new Date().toISOString() },
              { id: '2', name: 'Trabalho', icon: '💼', color: '#4ECDC4', isDefault: true, syncStatus: 'synced', createdAt: new Date().toISOString() },
              { id: '3', name: 'Estudos', icon: '📚', color: '#45B7D1', isDefault: true, syncStatus: 'synced', createdAt: new Date().toISOString() },
              { id: '4', name: 'Projetos', icon: '🚀', color: '#96CEB4', isDefault: true, syncStatus: 'synced', createdAt: new Date().toISOString() },
              { id: '5', name: 'Ideias', icon: '💡', color: '#FFEAA7', isDefault: true, syncStatus: 'synced', createdAt: new Date().toISOString() },
              { id: '6', name: 'Compras', icon: '🛒', color: '#DDA0DD', isDefault: true, syncStatus: 'synced', createdAt: new Date().toISOString() },
              { id: '7', name: 'Saúde', icon: '🏥', color: '#98D8C8', isDefault: true, syncStatus: 'synced', createdAt: new Date().toISOString() }
            ];
            localStorage.setItem('categories', JSON.stringify(defaultCategories));
            setCategories(defaultCategories);
          } else {
            setCategories(mockCategories);
          }
          setIsLoading(false);
          return;
        }

        // Carregar do backend (apenas em produção)
        try {
          const response = await fetch(`${API_URL}/api/categories`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            }
          });
          
          if (!response.ok) {
            throw new Error('Falha ao buscar categorias');
          }
          
          const categoriesData = await response.json();
          setCategories(categoriesData.map(category => ({
            id: category._id,
            name: category.name,
            color: category.color,
            createdAt: new Date(category.createdAt),
            updatedAt: new Date(category.updatedAt),
            syncStatus: 'synced'
          })));
          setError(null);
        } catch (err) {
          console.error('Erro ao buscar categorias:', err);
          setError(err.message);
          // Fallback para localStorage
          const savedCategories = localStorage.getItem('categories');
          if (savedCategories) {
            setCategories(JSON.parse(savedCategories));
          } else {
            // Categorias padrão
            setCategories([
              { id: 'trabalho', name: 'Trabalho', color: '#4285F4', createdAt: new Date(), updatedAt: new Date() },
              { id: 'pessoal', name: 'Pessoal', color: '#0F9D58', createdAt: new Date(), updatedAt: new Date() },
              { id: 'estudos', name: 'Estudos', color: '#F4B400', createdAt: new Date(), updatedAt: new Date() },
              { id: 'projetos', name: 'Projetos', color: '#DB4437', createdAt: new Date(), updatedAt: new Date() }
            ]);
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        // Carregar do localStorage
        const savedCategories = localStorage.getItem('categories');
        if (savedCategories) {
          setCategories(JSON.parse(savedCategories));
        } else {
          // Categorias padrão
          setCategories([
            { id: 'trabalho', name: 'Trabalho', color: '#4285F4', createdAt: new Date(), updatedAt: new Date() },
            { id: 'pessoal', name: 'Pessoal', color: '#0F9D58', createdAt: new Date(), updatedAt: new Date() },
            { id: 'estudos', name: 'Estudos', color: '#F4B400', createdAt: new Date(), updatedAt: new Date() },
            { id: 'projetos', name: 'Projetos', color: '#DB4437', createdAt: new Date(), updatedAt: new Date() }
          ]);
        }
        setIsLoading(false);
      }
    };
    
    loadCategories();
  }, [API_URL]);

  // Salvar categorias no localStorage
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('categories', JSON.stringify(categories));
    }
  }, [categories]);

  // Adicionar nova categoria
  const addCategory = async (name: string, color: string) => {
    const newCategory: Category = {
      id: uuidv4(),
      name,
      color,
      icon: '📁', // Ícone padrão
      isDefault: false,
      syncStatus: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setCategories(prevCategories => [...prevCategories, newCategory]);
    
    // Sincronizar com o backend se autenticado
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await fetch(`${API_URL}/api/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({
            name,
            color,
            localVersion: 1
          })
        });
        
        if (!response.ok) {
          throw new Error('Falha ao criar categoria');
        }
        
        const savedCategory = await response.json();
        
        // Atualizar ID da categoria com o ID do servidor
        setCategories(prevCategories => prevCategories.map(category => 
          category.id === newCategory.id 
            ? { 
                ...category, 
                id: savedCategory._id,
                syncStatus: 'synced'
              } 
            : category
        ));
        
        setError(null);
      } catch (err: any) {
        console.error('Erro ao criar categoria no servidor:', err);
        setError(err.message);
        // Manter categoria local com status pendente
      }
    }
    
    return newCategory;
  };

  // Atualizar categoria existente
  const updateCategory = async (updatedCategory: Partial<Category> & { id: string }) => {
    setCategories(prevCategories => prevCategories.map(category => 
      category.id === updatedCategory.id 
        ? { 
            ...updatedCategory, 
            updatedAt: new Date(),
            syncStatus: 'pending'
          } 
        : category
    ));
    
    // Sincronizar com o backend se autenticado
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await fetch(`${API_URL}/api/categories/${updatedCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({
            name: updatedCategory.name,
            color: updatedCategory.color,
            localVersion: (updatedCategory.localVersion || 0) + 1
          })
        });
        
        if (!response.ok) {
          throw new Error('Falha ao atualizar categoria');
        }
        
        const savedCategory = await response.json();
        
        // Atualizar status de sincronização
        setCategories(prevCategories => prevCategories.map(category => 
          category.id === updatedCategory.id 
            ? { 
                ...category, 
                syncStatus: 'synced',
                serverVersion: savedCategory.serverVersion
              } 
            : category
        ));
        
        setError(null);
      } catch (err) {
        console.error('Erro ao atualizar categoria no servidor:', err);
        setError(err.message);
        // Manter categoria local com status pendente
      }
    }
  };

  // Excluir categoria
  const deleteCategory = async (categoryId) => {
    setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
    
    // Sincronizar com o backend se autenticado
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await fetch(`${API_URL}/api/categories/${categoryId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        });
        
        if (!response.ok) {
          throw new Error('Falha ao excluir categoria');
        }
        
        setError(null);
      } catch (err) {
        console.error('Erro ao excluir categoria no servidor:', err);
        setError(err.message);
        // Categoria já foi removida localmente
      }
    }
  };

  return {
    categories,
    isLoading,
    error,
    addCategory,
    updateCategory,
    deleteCategory
  };
}
