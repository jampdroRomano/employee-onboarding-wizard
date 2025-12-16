import { Stack, TextField, InputAdornment} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { ReactNode } from 'react';

interface TableToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  children?: ReactNode; 
}

export const TableToolbar = ({
  searchTerm,
  onSearchChange,
  placeholder = "Buscar...",
  children
}: TableToolbarProps) => {
  return (
    <Stack 
      direction={{ xs: 'column', sm: 'row' }} 
      alignItems="center" 
      justifyContent="space-between" 
      spacing={2}
      sx={{ width: '100%' }}
    >
      {/* --- LADO ESQUERDO: BUSCA PADRONIZADA --- */}
      <TextField
        placeholder={placeholder}
        size="small"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ 
          width: { xs: '100%', sm: '280px' },
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#F4F6F8', 
            borderRadius: '8px',
            '& fieldset': { border: 'none' },       
            '&:hover fieldset': { border: 'none' }, 
            '&.Mui-focused fieldset': { border: 'none' }, 
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.disabled' }} fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      {/* --- LADO DIREITO: ÁREA DE AÇÕES VARIÁVEIS --- */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
        {children}
      </Stack>
    </Stack>
  );
};