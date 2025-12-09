import { Box, Stack, Typography } from '@mui/material';

export const StepperVertical = () => {
  return (
    <Stack 
      spacing={1} 
      sx={{ 
        width: '153px', 
        height: '272px' 
      }}
    >
      {/* --- STEP 1: ATIVO --- */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '24px' }}>
        {/* Ícone Ativo */}
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: 'primary.main', // #22C55E
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontFamily: '"Public Sans", sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '22px',
          }}
        >
          1
        </Box>
        
        {/* Texto Ativo */}
        <Typography
          sx={{
            fontFamily: '"Public Sans", sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            color: 'text.primary', // #212B36
            lineHeight: '22px',
          }}
        >
          Infos Básicas
        </Typography>
      </Stack>

      {/* --- CONECTOR VERTICAL   */}
      <Box 
        sx={{ 
          width: '24px',      
          height: '104px',   
          minWidth: '24px',
          display: 'flex',
          justifyContent: 'center', 
          alignItems: 'center',
        }} 
      >
        <Box 
            sx={{
                width: '1px',  
                height: '100%', 
                bgcolor: '#919EAB',
                opacity: 0.24,
            }}
        />
      </Box>

      {/* --- STEP 2: INATIVO --- */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '24px' }}>
        {/* Ícone Inativo */}
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: '#DFE3E8', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#637381', 
            fontFamily: '"Public Sans", sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '22px',
          }}
        >
          2
        </Box>
        
        {/* Texto Inativo */}
        <Typography
          sx={{
            fontFamily: '"Public Sans", sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            color: '#919EAB', 
            lineHeight: '22px',
          }}
        >
          Infos Profissionais
        </Typography>
      </Stack>
    </Stack>
  );
};