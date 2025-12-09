import { LinearProgress, Stack, Typography, linearProgressClasses } from '@mui/material';

interface OnboardingProgressProps {
  progress: number; 
}

export const OnboardingProgress = ({ progress }: OnboardingProgressProps) => {
  return (
    <Stack 
      direction="row" 
      alignItems="center" 
      spacing={2} 
      sx={{
        width: '98%',
        height: '18px',
      }}
    >
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          flexGrow: 1, 
          height: '4px',
          borderRadius: '4px',
          backgroundColor: '#22C55E3D', 
          [`& .${linearProgressClasses.bar}`]: {
            borderRadius: '50px',
            backgroundColor: '#22C55E', 
          },
        }}
      />

      <Typography
        sx={{
          fontFamily: '"Public Sans", sans-serif',
          fontWeight: 400,
          fontSize: '12px',
          lineHeight: '18px',
          color: '#637381',
          minWidth: '35px', 
          textAlign: 'left',
        }}
      >
        {Math.round(progress)}%
      </Typography>
    </Stack>
  );
};