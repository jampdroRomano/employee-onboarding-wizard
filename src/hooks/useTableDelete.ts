import { useState } from 'react';

interface UseTableDeleteProps {
  onDelete: (ids: string[]) => Promise<void>;
  onSuccess?: () => void;
  successMessage?: string;
}

export const useTableDelete = ({ onDelete, onSuccess }: UseTableDeleteProps) => {
  const [open, setOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Abre o modal preparando para deletar (recebe 1 ID ou Vários)
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
      await onDelete(idsToDelete); // Chama a função do Service passada por prop
      
      if (onSuccess) {
        onSuccess();
      }
      handleClose();
    } catch (error) {
      console.error("Erro ao excluir:", error);
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