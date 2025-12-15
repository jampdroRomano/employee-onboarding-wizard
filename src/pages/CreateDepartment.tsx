import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AppBreadcrumbs } from '../components/common/AppBreadcrumbs';
import { AppButton } from '../components/common/AppButton';
import { DepartmentForm } from '../components/departments/DepartmentForm';
import { departmentService } from '../services/departmentService';

// 1. Tipo do estado
interface DepartmentState {
  name: string;
  description: string;
  managerId: string | null;
}

export const CreateDepartment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // 2. Avisa que o useState que managerId pode ser string ou null
  const [formData, setFormData] = useState<DepartmentState>({
    name: '',
    description: '',
    managerId: null
  });

  const handleSave = async () => {
    if (!formData.name) {
      alert("O nome do departamento é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      await departmentService.create(formData);
      navigate('/departamentos');
    } catch (error) {
      console.error(error);
      alert("Erro ao criar departamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ width: '100%', maxWidth: '100%', mx: 'auto', pr: { xs: 0, lg: '5%' } }}>
        
        <Box sx={{ mb: 4 }}>
          <AppBreadcrumbs
            items={[
              { label: 'Departamentos', path: '/departamentos' },
              { label: 'Novo Departamento' }
            ]}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: '40px',
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ width: { xs: '100%', md: '200px' }, flexShrink: 0 }}>
             <Typography variant="h6" fontWeight="bold" color="text.primary" mb={1}>
                Informações
             </Typography>
             <Typography variant="body2" color="text.secondary">
                Preencha os dados básicos do novo departamento.
             </Typography>
          </Box>

          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '440px' }}>
             
             <DepartmentForm 
                data={formData}
                onChange={setFormData}
             />

             <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <AppButton 
                  variant="text" 
                  onClick={() => navigate('/departamentos')}
                  disabled={loading}
                >
                  Cancelar
                </AppButton>
                <AppButton 
                  onClick={handleSave}
                  loading={loading}
                  sx={{ minWidth: '120px' }}
                >
                  Salvar
                </AppButton>
             </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};