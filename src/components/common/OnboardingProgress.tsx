import { LinearProgress, Stack, Typography, linearProgressClasses, useTheme, alpha } from '@mui/material';

interface OnboardingProgressProps {
  progress: number; 
}

export const OnboardingProgress = ({ progress }: OnboardingProgressProps) => {
  const theme = useTheme();

  return (
    <Stack 
      direction="row" 
      alignItems="center" 
      spacing={2} 
      sx={{ width: '100%', height: '18px' }}
    >
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          flexGrow: 1, 
          height: '4px',
          borderRadius: '4px',
          backgroundColor: alpha(theme.palette.primary.main, 0.24),
          
          [`& .${linearProgressClasses.bar}`]: {
            borderRadius: '50px',
            backgroundColor: 'primary.main', 
          },
        }}
      />

      <Typography
        sx={{
          fontFamily: '"Public Sans", sans-serif',
          fontWeight: 400,
          fontSize: '12px',
          lineHeight: '18px',
          color: 'text.secondary',
          textAlign: 'left',
        }}
      >
        {Math.round(progress)}%
      </Typography>
    </Stack>
  );
};