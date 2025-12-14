import { Stack, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export const SocialHidden = () => {
  return (
    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
      {[<FacebookIcon />, <GoogleIcon />, <LinkedInIcon />].map((icon, index) => (
        <IconButton 
          key={index}
          sx={{ 
            border: '1px solid #DDDDDD', 
            color: 'text.primary',
            borderRadius: '50%', 
            width: 40,
            height: 40,
            transition: 'all 0.3s ease',
            '&:hover': { 
              bgcolor: 'grey.100',
              borderColor: 'primary.main',
              color: 'primary.main',
              transform: 'translateY(-2px)' 
            }
          }}
        >
          {icon}
        </IconButton>
      ))}
    </Stack>
  );
};