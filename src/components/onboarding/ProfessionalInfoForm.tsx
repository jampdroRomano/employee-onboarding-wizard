import { Box, Typography, MenuItem, CircularProgress } from '@mui/material';
import { AppTextField } from '../common/AppTextField';
import type { Department } from '../../services/departmentService'; 

interface ProfessionalInfoFormProps {
  department: string;
  departmentList: Department[]; // Recebe a lista real
  isLoading: boolean;
  error: string;
  handleChange: (value: string) => void;
}

export const ProfessionalInfoForm = ({ 
  department, 
  departmentList, 
  isLoading, 
  error, 
  handleChange 
}: ProfessionalInfoFormProps) => {

  return (
    <Box sx={{ width: '100%' }}>
      <Typography 
        component="h2"
        variant="h4"
        sx={{ mb: '31px', color: 'text.secondary' }}
      >
        Informações Profissionais
      </Typography>

      <Box sx={{ width: '100%' }}> 
        <AppTextField 
            select
            fullWidth
            label="Departamento" // Adicionei Label pra ficar padrão
            placeholder="Selecione um departamento"
            value={department}
            onChange={(e) => handleChange(e.target.value)}
            error={!!error}
            helperText={error}
            disabled={isLoading} // Trava se estiver carregando
            sx={{
              '& .MuiInputBase-root': { height: '54px' },
            }}
            SelectProps={{
               displayEmpty: true,
               renderValue: (selected: any) => {
                  if (isLoading) return <span style={{ color: '#919EAB' }}>Carregando...</span>;
                  if (!selected) return <span style={{ color: '#919EAB' }}>Selecione um departamento</span>;
                  
                  // Busca o nome baseada no ID selecionado
                  const selectedDept = departmentList.find(d => d.id === selected);
                  return selectedDept ? selectedDept.name : selected;
               }
            }}
        >
            {isLoading ? (
                <MenuItem disabled>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={20} /> Carregando...
                    </Box>
                </MenuItem>
            ) : departmentList.length === 0 ? (
                <MenuItem disabled>Nenhum departamento cadastrado</MenuItem>
            ) : (
                departmentList.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                        {dept.name}
                    </MenuItem>
                ))
            )}
        </AppTextField>
      </Box>
    </Box>
  );
};