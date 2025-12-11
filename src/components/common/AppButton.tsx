import { Button, CircularProgress, type ButtonProps } from '@mui/material';

interface AppButtonProps extends ButtonProps {
  loading?: boolean; 
}

export const AppButton = ({ children, sx, loading, disabled, ...props }: AppButtonProps) => {
  return (
    <Button
      variant="contained" 
      size="large"
      disabled={loading || disabled}       
      sx={{
        boxShadow: 'none', 
        ...sx, 
      }}
      {...props} 
    >
      {loading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        children
      )}
    </Button>
  );
};