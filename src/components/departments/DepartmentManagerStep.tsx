import { Box, Typography, Autocomplete, TextField } from '@mui/material';

interface DepartmentManagerStepProps {
  value: string | null;
  error?: string;
  onChange: (id: string | null) => void;
}

const managers = [
  { id: '1', name: 'João da Silva' },
  { id: '2', name: 'Maria Oliveira' },
  { id: '3', name: 'Carlos Souza' },
  { id: '4', name: 'Ana Pereira' },
  { id: '5', name: 'Lucas Santos' }
];

export const DepartmentManagerStep = ({ value, error, onChange }: DepartmentManagerStepProps) => {
  const selectedOption = managers.find(m => m.id === value) || null;

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
        Gestão do Departamento
      </Typography>

      <Box sx={{ width: '100%' }}>
        <Autocomplete
            options={managers}
            getOptionLabel={(option) => option.name}
            value={selectedOption}
            onChange={(_event, newValue) => {
                onChange(newValue ? newValue.id : null);
            }}
            renderInput={(params) => (
                <TextField 
                    {...params} 
                    label="Responsável" 
                    placeholder="Pesquise pelo nome..."
                    error={!!error}
                    helperText={error}
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