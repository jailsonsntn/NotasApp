'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RestoreNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RestoreNoteModal({ isOpen, onClose, onConfirm }: RestoreNoteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Restaurar nota</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Deseja restaurar esta nota da lixeira? A nota será movida de volta para sua localização original.</p>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="default" onClick={onConfirm}>
            Restaurar nota
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
