import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

interface RegistrationSuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

export const RegistrationSuccessDialog = ({ open, onClose }: RegistrationSuccessDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>Cadastro Realizado com Sucesso!</DialogTitle>

      <DialogContent >
        <DialogContentText
          sx={{
            fontSize: 16,
            fontWeight: 500,
            mb: 2,
          }}
        >
          Um e-mail de verificação foi enviado para sua caixa de entrada.
        </DialogContentText>

        <DialogContentText
          sx={{
            fontSize: 16,
            color: 'text.secondary',
          }}
        >
          Para ativar sua conta, clique no link enviado.
          <br />
          Caso não encontre, verifique também o <strong>SPAM</strong> ou
          <strong> Lixo Eletrônico</strong>.
        </DialogContentText>
      </DialogContent>


      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} variant="contained">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
