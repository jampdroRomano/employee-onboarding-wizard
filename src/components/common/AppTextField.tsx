import { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  MenuItem, 
  Select 
} from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const fontInter = {
  fontFamily: '"Inter", sans-serif',
};


type AppTextFieldProps = TextFieldProps & {
  select?: boolean;
};

export const AppTextField = ({
  sx, 
  error, 
  type,
  select, 
  children, 
  InputProps, 
  SelectProps, 
  ...props
}: AppTextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';

  const handleClickShowPassword = () => setShowPassword((show: boolean) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <TextField
      variant="outlined"
      fullWidth
      error={error} 
      type={isPassword ? (showPassword ? 'text' : 'password') : type}
      select={select} 

      InputProps={{
        ...InputProps, 
        endAdornment: isPassword ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : InputProps?.endAdornment, 
      }}

      SelectProps={SelectProps}

      InputLabelProps={{
        shrink: true,
        sx: {
            ...fontInter,
            fontSize: '16px',
            color: error ? 'error.main' : 'text.primary',
            '&.Mui-focused': {
              color: error ? 'error.main' : 'primary.main',
              fontWeight: 500,
            },
        }
      }}
      inputProps={{
        sx: {
            ...fontInter,
            height: '56px',
            boxSizing: 'border-box',
            color: 'text.primary',
        }
      }}

      sx={{
        maxWidth: '100%',
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          backgroundColor: 'transparent',

          '& fieldset': {
            borderColor: error ? 'error.main' : 'grey.300', 
            borderWidth: '1px',
          },

          '&:hover fieldset': {
            borderColor: error ? 'error.main' : 'primary.main',
          },

          '&.Mui-focused fieldset': {
            borderColor: error ? 'error.main' : 'primary.main',
          },
        },
        ...sx, 
      }}
      {...props}
    >
      {select && children} 
    </TextField>
  );
};