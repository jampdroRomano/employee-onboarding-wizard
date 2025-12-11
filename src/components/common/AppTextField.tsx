// src/components/common/AppTextField.tsx
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

  const baseColor = fixedActiveColor || '#dcdedf';
  const interactionColor = fixedActiveColor || focusColor;
  const errorColor = '#d32f2f'; 

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
                color: error ? errorColor : (fixedActiveColor ? fixedActiveColor : 'rgba(38, 50, 56, 0.6)'),
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
                color: '#263238',
            }
        }
      }}
      sx={{
        maxWidth: '100%',
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          backgroundColor: 'transparent',
          
          // Borda Base
          '& fieldset': {
            borderColor: error ? errorColor : baseColor, 
            borderWidth: fixedActiveColor ? '2px' : '1px',
          },
          
          // Hover
          '&:hover fieldset': {
            borderColor: error ? errorColor : interactionColor, 
          },
          
          // Focus
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