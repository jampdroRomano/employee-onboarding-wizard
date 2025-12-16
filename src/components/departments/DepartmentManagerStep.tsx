import { Box, Typography, Autocomplete, TextField, CircularProgress, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Employee } from '../../types';
import { StickyActionMenuItem } from '../common/StickyActionMenuItem';

interface DepartmentManagerStepProps {
  value: string | null;
  error?: string;
  onChange: (id: string | null) => void;
  employees: Employee[]; 
  loading?: boolean;
}

export const DepartmentManagerStep = ({ 
  value, 
  error, 
  onChange,
  employees = [], 
  loading = false 
}: DepartmentManagerStepProps) => {
  const navigate = useNavigate();

  // Filtra apenas Gestores
  const managers = employees.filter(emp => emp.seniority === 'Gestor');
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
            options={managers}
            getOptionLabel={(option) => option.nome}
            value={selectedOption}
            onChange={(_event, newValue) => {
                onChange(newValue ? newValue.id : null);
            }}
            loading={loading}
            noOptionsText={
                employees.length > 0 && managers.length === 0 
                ? "Nenhum colaborador com cargo de 'Gestor' encontrado."
                : "Nenhum colaborador encontrado"
            }
            PaperComponent={({ children, ...props }) => (
              <Paper {...props}>
                {children}
                <Box onMouseDown={(e) => e.preventDefault()}>
                  <StickyActionMenuItem 
                    onClick={() => navigate('/criar')} 
                  />
                </Box>
              </Paper>
            )}
            renderInput={(params) => (
                <TextField 
                    {...params} 
                    label="Responsável pelo Departamento" 
                    placeholder="Selecione um gestor"
                    error={!!error}
                    helperText={error || (managers.length === 0 && !loading ? "Dica: Cadastre um funcionário com senioridade 'Gestor' primeiro." : "")}
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