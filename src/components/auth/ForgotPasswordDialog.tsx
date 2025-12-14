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
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSend = async () => {
    if (!email) return;
    
    setLoading(true);
    setMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({ type: 'success', text: 'E-mail de recuperação enviado! Verifique sua caixa de entrada.' });
      setTimeout(onClose, 3000); // Fecha automaticamente após 3s
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setMessage({ type: 'error', text: 'E-mail não encontrado.' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao enviar. Tente novamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Recuperar Senha</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Digite seu e-mail para receber um link de redefinição de senha.
        </DialogContentText>
        
        {message && (
          <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>
        )}

        <AppTextField
          autoFocus
          label="E-mail"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSend} variant="contained" disabled={loading || !email}>
          {loading ? 'Enviando...' : 'Enviar Link'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};