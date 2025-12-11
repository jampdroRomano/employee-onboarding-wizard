import { TextField } from '@mui/material';
import type { TextFieldProps, InputLabelProps } from '@mui/material';

const fontInter = {
  fontFamily: '"Inter", sans-serif',
};

type AppTextFieldProps = TextFieldProps;

export const AppTextField = ({ 
  sx, 
  error,
  ...props 
}: AppTextFieldProps) => {

  return (
    <TextField
      variant="outlined"
      fullWidth
      error={error} 
      slotProps={{
        inputLabel: {
            shrink: true,
            sx: {
                ...fontInter,
                fontSize: '16px',
                color: error ? 'error.main' : 'text.primary',
                
                '&.Mui-focused': {
                  // Cor Focado: Verde do Tema (Primary Main)
                  color: error ? 'error.main' : 'primary.main',
                  fontWeight: 500,
                },
            } as InputLabelProps['sx']
        },
        input: {
            sx: {
                ...fontInter,
                height: '56px',
                boxSizing: 'border-box',
                color: 'text.primary', // Texto digitado
            }
        }
      }}
      sx={{
        maxWidth: '100%',
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          backgroundColor: 'transparent',
          
          // Borda Inativa
          '& fieldset': {
            borderColor: error ? 'error.main' : 'grey.300', // #DFE3E8
            borderWidth: '1px',
          },
          
          // Hover
          '&:hover fieldset': {
            borderColor: error ? 'error.main' : 'primary.main', 
          },
          
          // Foco
          '&.Mui-focused fieldset': {
            borderColor: error ? 'error.main' : 'primary.main', 
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
};