import { Box, Typography, MenuItem } from '@mui/material';
import { AppTextField } from '../common/AppTextField';

interface ProfessionalInfoFormProps {
  department: string;
  error: string;
  handleChange: (value: string) => void;
}

const departments = ['Design', 'TI', 'Marketing', 'Produto'];

export const ProfessionalInfoForm = ({ department, error, handleChange }: ProfessionalInfoFormProps) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography 
        component="h2"
        variant="h4"
        sx={{ 
            mb: '31px',
            color: 'text.secondary' 
        }}
      >
        Informações Profissionais
      </Typography>

      <Box sx={{ width: '100%' }}> 
        <AppTextField 
            select
            fullWidth
            placeholder="Selecione um departamento"
            
            value={department}
            onChange={(e) => handleChange(e.target.value)}
            
            error={!!error}
            helperText={error}

            sx={{
              '& .MuiInputBase-root': {
                height: '54px', 
              },
            }}
            SelectProps={{
               displayEmpty: true,
               renderValue: (selected: any) => {
                  if (!selected) {
                    return <span style={{ color: '#919EAB' }}>Selecione um departamento</span>;
                  }
                  return selected;
               }
            }}
        >
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
        </AppTextField>
      </Box>
    </Box>
  );
};