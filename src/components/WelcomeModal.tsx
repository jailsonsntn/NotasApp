import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { CheckCircle, Cloud, Smartphone, Monitor } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export function WelcomeModal({ isOpen, onClose, userName }: WelcomeModalProps) {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">
              Bem-vindo{userName ? `, ${userName}` : ''}! 🎉
            </h3>
            <p className="text-muted-foreground">
              Seu login foi realizado com sucesso. Agora você pode aproveitar todos os recursos do NotasApp.
            </p>
          </div>
        );

      case 2:
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
              <Cloud className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold">Sincronização Automática</h3>
            <p className="text-muted-foreground">
              Suas notas são sincronizadas automaticamente na nuvem. Você pode acessá-las de qualquer dispositivo.
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Smartphone className="w-4 h-4" />
                <span>Mobile</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Monitor className="w-4 h-4" />
                <span>Desktop</span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold">Tudo Pronto!</h3>
            <p className="text-muted-foreground">
              Agora você pode começar a criar suas notas, organizá-las em categorias e muito mais.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 mt-4">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Dica:</strong> Use o campo de entrada rápida para criar notas rapidamente ou clique em "Nova Nota" para mais opções.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            Bem-vindo ao NotasApp
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          {renderStep()}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              Pular
            </Button>
            <Button size="sm" onClick={handleNext}>
              {step < 3 ? 'Próximo' : 'Começar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WelcomeModal;
