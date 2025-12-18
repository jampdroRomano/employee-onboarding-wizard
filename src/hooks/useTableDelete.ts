import { useState } from 'react';
import { toast } from 'sonner';

interface UseTableDeleteProps {
  onDelete: (ids: string[]) => Promise<void>;
  onSuccess?: () => void;
}

export const useTableDelete = ({ onDelete, onSuccess }: UseTableDeleteProps) => {
  const [open, setOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleOpenDelete = (ids: string | string[]) => {
    const idsArray = Array.isArray(ids) ? ids : [ids];
    setIdsToDelete(idsArray);
    setOpen(true);
  };

  const handleClose = () => {
    if (isDeleting) return; 
    setOpen(false);
    setIdsToDelete([]);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(idsToDelete); 
      
      toast.success('Item(s) excluído(s) com sucesso!');
      if (onSuccess) {
        onSuccess();
      }
      handleClose();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast.error('Erro ao excluir item(s).');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    open,
    idsToDelete,
    isDeleting,
    handleOpenDelete,
    handleClose,
    handleConfirmDelete
  };
};