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
  ...props 
}: AppTextFieldProps) => {

  const baseColor = fixedActiveColor || '#263238';
  const interactionColor = fixedActiveColor || focusColor;

  return (
    <TextField
      variant="outlined"
      fullWidth
      slotProps={{
        inputLabel: {
            shrink: true,
            sx: {
                ...fontInter,
                fontSize: '16px',
                color: fixedActiveColor ? fixedActiveColor : 'rgba(38, 50, 56, 0.6)',
                '&.Mui-focused': {
                  color: interactionColor,
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
            borderColor: baseColor,
            borderWidth: fixedActiveColor ? '2px' : '1px',
          },
          
          // Hover
          '&:hover fieldset': {
            borderColor: interactionColor, 
          },
          
          // Focus
          '&.Mui-focused fieldset': {
            borderColor: interactionColor,
            borderWidth: '2px',
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
};