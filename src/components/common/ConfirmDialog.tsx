import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button, 
  CircularProgress 
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  content?: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDialog = ({
  open,
  title = "Confirmar exclusão",
  content = "Tem certeza que deseja excluir este(s) item(ns)? Esta ação não pode ser desfeita.",
  onClose,
  onConfirm,
  isLoading = false,
  confirmText = "Excluir",
  cancelText = "Cancelar"
}: ConfirmDialogProps) => {
  return (
    <Dialog 
      open={open} 
      onClose={!isLoading ? onClose : undefined} // Impede fechar clicando fora se estiver carregando
      PaperProps={{
        sx: { borderRadius: 2, minWidth: 400 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {title}
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText>
          {content}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ p: 2.5, pt: 0 }}>
        <Button 
          variant="outlined" 
          color="inherit" 
          onClick={onClose} 
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        
        <Button 
          variant="contained" 
          color="error" 
          onClick={onConfirm}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};