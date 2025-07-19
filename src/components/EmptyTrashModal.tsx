'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EmptyTrashModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function EmptyTrashModal({ isOpen, onClose, onConfirm }: EmptyTrashModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Esvaziar lixeira</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Tem certeza que deseja esvaziar a lixeira? Esta ação não pode ser desfeita e todas as notas na lixeira serão excluídas permanentemente.</p>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Esvaziar lixeira
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
