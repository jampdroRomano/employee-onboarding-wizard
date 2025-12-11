import { TextField } from '@mui/material';
import type { TextFieldProps, InputLabelProps } from '@mui/material';

const fontInter = {
  fontFamily: '"Inter", sans-serif',
};

type AppTextFieldProps = TextFieldProps & {
  focusColor?: string;     
  fixedActiveColor?: string; 
};

export const AppTextField = ({ 
  focusColor = '#22C55E', 
  fixedActiveColor, 
  sx, 
  error,
  ...props 
}: AppTextFieldProps) => {

  // Cores
  const interactionColor = fixedActiveColor || focusColor; 
  const errorColor = '#d32f2f'; 
  const labelDefaultColor = '#212B36'; 
  const borderDefaultColor = 'rgba(145, 158, 171, 0.32)'; 

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
                // 1. Cor padrão (sem foco) = Preto
                color: error ? errorColor : labelDefaultColor,
                
                // 2. Cor no foco = Verde (interactionColor)
                '&.Mui-focused': {
                  color: error ? errorColor : interactionColor, 
                  fontWeight: 500,
                },
            } as InputLabelProps['sx']
        },
        input: {
            sx: {
                ...fontInter,
                height: '56px',
                boxSizing: 'border-box',
                color: labelDefaultColor, 
            }
        }
      }}
      sx={{
        maxWidth: '100%',
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          backgroundColor: 'transparent',
          
          // Borda Inativa (Cinza)
          '& fieldset': {
            borderColor: error ? errorColor : borderDefaultColor, 
            borderWidth: fixedActiveColor ? '2px' : '1px',
          },
          
          // Hover (Verde)
          '&:hover fieldset': {
            borderColor: error ? errorColor : interactionColor, 
          },
          
          // Foco (Verde)
          '&.Mui-focused fieldset': {
            borderColor: error ? errorColor : interactionColor, 
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
};