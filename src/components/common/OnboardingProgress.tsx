import { LinearProgress, Stack, Typography, linearProgressClasses } from '@mui/material';

interface OnboardingProgressProps {
  progress: number; // 0 a 100
}

export const OnboardingProgress = ({ progress }: OnboardingProgressProps) => {
  return (
    <Stack 
      direction="row" 
      alignItems="center" 
      spacing={2} // Espaçamento entre a barra e o texto
      sx={{
        width: '100%', // CORREÇÃO: Ocupa a largura total do pai (fluido)
        height: '18px',
      }}
    >
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          flexGrow: 1, // CORREÇÃO: Faz a barra esticar para preencher o espaço restante
          height: '4px',
          borderRadius: '4px',
          backgroundColor: '#22C55E3D', // Sua cor de fundo (verde transparente)
          [`& .${linearProgressClasses.bar}`]: {
            borderRadius: '50px',
            backgroundColor: '#22C55E', // Sua cor principal (verde)
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
          minWidth: '35px', // Garante que o texto "100%" caiba sem empurrar o layout
          textAlign: 'right',
        }}
      >
        {Math.round(progress)}%
      </Typography>
    </Stack>
  );
};