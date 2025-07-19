'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onRegisterClick: () => void;
}

export default function LoginModal({ isOpen, onClose, onLogin, onRegisterClick }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    setIsLoading(true);
    try {
      await onLogin(email, password);
      onClose();
    } catch (err) {
      setError('Email ou senha inválidos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md"
        style={{ 
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px'
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: '#111827' }}>Entrar no NotasApp</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" style={{ color: '#374151' }}>Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={{
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                color: '#111827'
              }}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" style={{ color: '#374151' }}>Senha</Label>
            <Input 
              id="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                color: '#111827'
              }}
              required
            />
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onRegisterClick}
              disabled={isLoading}
              style={{
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                color: '#374151'
              }}
            >
              Criar conta
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: '#2563eb',
                color: 'white'
              }}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
