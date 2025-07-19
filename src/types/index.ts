// types/index.ts
// Definições de tipos para o NotasApp

export interface User {
  id: string;
  name: string;
  email: string;
  preferences?: {
    isDarkTheme: boolean;
    viewMode: 'grid' | 'list';
    autoSync: boolean;
    language: string;
  };
  createdAt: string;
  lastLogin: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  categories?: string[];
  category?: string;
  color: string;
  isFavorite?: boolean;
  isArchived: boolean;
  isDeleted?: boolean;
  isTrashed: boolean;
  isInTrash?: boolean;
  isTask?: boolean;
  isQuickNote?: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  syncStatus: 'synced' | 'pending' | 'error';
  archivedAt?: string;
  deletedAt?: string;
  taskItems?: TaskItem[];
}

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  syncStatus: 'synced' | 'pending' | 'error';
  createdAt: string;
  updatedAt?: string;
  localVersion?: number;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  viewMode: 'grid' | 'list';
  autoSync: boolean;
  backupInterval: number; // horas
  language: string;
}

export interface SyncStatus {
  status: 'idle' | 'syncing' | 'success' | 'error';
  lastSyncTime: string | null;
  pendingChanges: number;
}

export interface ConnectionStatus {
  status: 'online' | 'offline';
}

// Props para componentes
export interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note | null;
  categories: Category[];
  onSave: (note: Partial<Note>) => void;
}

export interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSave: (category: Partial<Category>) => void;
}

export interface SidebarProps {
  currentCategory: string;
  setCurrentCategory: (category: string) => void;
  categories: Category[];
  openCategoryModal: () => void;
  isDarkTheme: boolean;
  toggleTheme: () => void;
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
  openLoginModal: () => void;
  syncStatus: SyncStatus;
  connectionStatus: ConnectionStatus;
}

export interface NoteGridProps {
  notes: Note[];
  isGridView: boolean;
  currentCategory: string;
  searchQuery: string;
  onNoteClick: (noteId: string) => void;
  onToggleFavorite: (noteId: string) => void;
  onArchiveNote: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
  onRestoreNote: (noteId: string) => void;
  openNoteModal: (noteId?: string | null) => void;
}

// Tipos para hooks
export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export interface UseNotesReturn {
  notes: Note[];
  filteredNotes: Note[];
  isLoading: boolean;
  error: string | null;
  addNote: (noteData: Partial<Note>) => Promise<void>;
  updateNote: (noteId: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  toggleFavorite: (noteId: string) => Promise<void>;
  archiveNote: (noteId: string) => Promise<void>;
  moveToTrash: (noteId: string) => Promise<void>;
  restoreFromTrash: (noteId: string) => Promise<void>;
  emptyTrash: () => Promise<void>;
  searchNotes: (query: string) => Note[];
}

export interface UseCategoriesReturn {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  addCategory: (categoryData: Partial<Category>) => Promise<void>;
  updateCategory: (categoryId: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
}

export interface UseSyncReturn {
  syncStatus: SyncStatus;
  connectionStatus: ConnectionStatus;
  syncNow: () => Promise<void>;
  enableAutoSync: () => void;
  disableAutoSync: () => void;
}

// Tipos para API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Tipos para eventos
export type NoteEventType = 'created' | 'updated' | 'deleted' | 'archived' | 'restored';
export type CategoryEventType = 'created' | 'updated' | 'deleted';

export interface NoteEvent {
  type: NoteEventType;
  noteId: string;
  timestamp: string;
  userId?: string;
}

export interface CategoryEvent {
  type: CategoryEventType;
  categoryId: string;
  timestamp: string;
  userId?: string;
}
