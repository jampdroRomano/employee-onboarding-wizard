import { Button, type ButtonProps } from '@mui/material';

interface AppButtonProps extends ButtonProps {
}

export const AppButton = ({ children, sx, ...props }: AppButtonProps) => {
  return (
    <Button
      variant="contained" 
      size="large"       
      sx={{
        boxShadow: 'none', 
        ...sx, 
      }}
      {...props} 
    >
      {children}
    </Button>
  );
};