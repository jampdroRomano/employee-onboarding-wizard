import { Box, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { AppTextField } from '../common/AppTextField';
import { AppSwitchLabel } from '../common/AppSwitchLabel';
import { AppButton } from '../common/AppButton';
import { toast } from 'sonner';
import { employeeService } from '../../services/employeeService';

interface ProfileFormProps {
  employeeId: string;
  initialData: {
    nome: string;
    email: string;
    status: boolean;
    img?: string;
  };
  onSuccess?: () => void;
}

export const ProfileForm = ({ employeeId, initialData, onSuccess }: ProfileFormProps) => {
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.email) {
      toast.error("Nome e E-mail são obrigatórios.");
      return;
    }

    setIsSaving(true);
    try {
        await employeeService.update(employeeId, {
            nome: formData.nome,
            email: formData.email,
            status: formData.status, 
        });
        toast.success("Perfil atualizado com sucesso!");
        if (onSuccess) onSuccess();
    } catch (error) {
        console.error(error);
        toast.error("Erro ao salvar perfil.");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={2} sx={{ width: '100%', maxWidth: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <AppTextField 
                    label="Nome Completo"
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    fullWidth
                />

                <AppTextField 
                    label="E-mail Corporativo"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    fullWidth
                />

                <Box>
                    <AppSwitchLabel 
                        label={formData.status ? "Colaborador Ativo" : "Colaborador Inativo"}
                        checked={formData.status}
                        onChange={(checked) => handleChange('status', checked)}
                    />
                </Box>
            </Box>

            <AppButton 
                onClick={handleSave}
                loading={isSaving}
                sx={{ height: '48px', width: '100%' }}
            >
                Salvar 
            </AppButton>
        </Stack>
    </Box>
  );
};