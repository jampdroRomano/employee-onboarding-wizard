import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button, 
  Alert 
} from '@mui/material';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { AppTextField } from '../common/AppTextField';

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ForgotPasswordDialog = ({ open, onClose }: ForgotPasswordDialogProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: React.ReactNode } | null>(null);

  const handleSend = async () => {
    if (!email) return;
    
    setLoading(true);
    setMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      
      setMessage({ 
        type: 'success', 
        text: (
          <>
            Enviamos um link de redefinição para <strong>{email}</strong>.
            <br /><br />
            1. Verifique sua <strong>Caixa de Entrada</strong>.
            <br />
            2. ⚠️ Se não encontrar, verifique a caixa de <strong>SPAM</strong> ou <strong>Lixo Eletrônico</strong>.
          </>
        )
      });
      
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setMessage({ type: 'error', text: 'Este e-mail não está cadastrado.' });
      } else {
        setMessage({ type: 'error', text: 'Ocorreu um erro ao enviar. Tente novamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleExited = () => {
    setMessage(null);
    setEmail('');
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="xs"
      TransitionProps={{
        onExited: handleExited
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>Recuperar Senha</DialogTitle>
      
      <DialogContent>
        {/* Só mostra o texto e input se NÃO tiver mensagem de sucesso */}
        {(!message || message.type === 'error') && (
          <DialogContentText sx={{ mb: 3 }}>
            Digite o e-mail da sua conta para receber o link de redefinição.
          </DialogContentText>
        )}
        
        {message && (
          <Alert severity={message.type} sx={{ mb: 3, textAlign: 'left' }}>
            {message.text}
          </Alert>
        )}

        {(!message || message.type === 'error') && (
          <AppTextField
            autoFocus
            label="E-mail"
            fullWidth
            placeholder="Ex: joao@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        {/* Botão Cancelar/Fechar */}
        <Button onClick={handleClose} color="inherit">
          {message?.type === 'success' ? 'Fechar' : 'Cancelar'}
        </Button>
        
        {/* Botão Enviar (Some no sucesso) */}
        {(!message || message.type === 'error') && (
          <Button 
            onClick={handleSend} 
            variant="contained" 
            disabled={loading || !email}
          >
            {loading ? 'Enviando...' : 'Enviar Link'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};