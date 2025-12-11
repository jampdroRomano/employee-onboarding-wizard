import { Box, Typography, MenuItem } from '@mui/material';
import { AppTextField } from '../common/AppTextField';

// Opções estáticas por enquanto
const departments = ['Design', 'TI', 'Marketing', 'Produto'];

export const ProfessionalInfoForm = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography 
        component="h2"
        sx={{ 
            mb: '31px', 
            fontFamily: '"Public Sans", sans-serif',
            fontWeight: 700,
            fontSize: '24px', 
            color: '#637381'
        }}
      >
        Informações Profissionais
      </Typography>

      <Box sx={{ width: '100%' }}> 
        <AppTextField 
            select 
            fullWidth 
            label="Departamento"
            placeholder="Selecione um departamento"
            focusColor="#22C55E"
            sx={{
              '& .MuiInputBase-root': {
                height: '54px', 
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '1px',
                borderColor: 'rgba(220, 222, 223)', 
              }
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