import { Box, Typography, Autocomplete, TextField, CircularProgress } from '@mui/material';
import type { IEmployee } from '../../services/employeeService';

interface DepartmentManagerStepProps {
  value: string | null;
  error?: string;
  onChange: (id: string | null) => void;
  employees: IEmployee[];
  loading?: boolean;
}

export const DepartmentManagerStep = ({ 
  value, 
  error, 
  onChange,
  employees = [], 
  loading = false 
}: DepartmentManagerStepProps) => {

  const selectedOption = employees.find(emp => emp.id === value) || null;

  return (
    <Box sx={{ width: '100%' }}>
      <Typography 
        component="h2"
        variant="h4" 
        sx={{ mb: '31px', color: 'text.secondary' }}
      >
        Gestão do Departamento
      </Typography>

      <Box sx={{ width: '100%' }}>
        <Autocomplete
            options={employees}
            getOptionLabel={(option) => option.nome}
            
            // Controle do valor selecionado
            value={selectedOption}
            
            // Ao mudar, devolve apenas o ID para o formulário
            onChange={(_event, newValue) => {
                onChange(newValue ? newValue.id : null);
            }}
            
            loading={loading}
            noOptionsText="Nenhum colaborador encontrado"
            
            // Renderização do Input
            renderInput={(params) => (
                <TextField 
                    {...params} 
                    label="Responsável (Opcional)" 
                    placeholder="Selecione um gestor ou deixe em branco"
                    error={!!error}
                    helperText={error}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                    }}
                />
            )}
            sx={{
                '& .MuiOutlinedInput-root': {
                    height: '54px',
                    padding: '0 14px !important',
                    alignItems: 'center', 
                },
                '& .MuiAutocomplete-input': {
                    padding: '0 !important',
                },
                '& .MuiInputLabel-root': {
                    top: '-2px' 
                }
            }}
        />
      </Box>
    </Box>
  );
};