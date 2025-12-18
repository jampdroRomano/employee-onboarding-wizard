import { List, ListItemButton, ListItemText, Typography, Box } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

export interface NavItem {
  label: string;
  value: string;
}

interface VerticalSideNavProps {
  items: NavItem[];
  activeValue: string;
  onChange: (newValue: string) => void;
}

export const VerticalSideNav = ({ items, activeValue, onChange }: VerticalSideNavProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
        
        <List sx={{ p: 0 }}>
            {items.map((item) => {
                const isActive = activeValue === item.value;

                return (
                    <ListItemButton
                        key={item.value}
                        onClick={() => onChange(item.value)}
                        disableRipple
                        sx={{
                            mb: 1,
                            minHeight: '48px',
                            borderRadius: '8px', 
                            position: 'relative',
                            backgroundColor: 'transparent',
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            },
                        }}
                    >
                        <ListItemText
                            primary={
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: isActive ? 700 : 600,
                                        color: isActive ? 'primary.main' : 'text.secondary',
                                        fontSize: '14px',
                                        transition: 'color 0.3s ease',
                                    }}
                                >
                                    {item.label}
                                </Typography>
                            }
                        />

                        {/* O Traço Verde Animado */}
                        <Box
                            sx={{
                                position: 'absolute',
                                right: 0,
                                top: '50%',
                                transform: isActive ? 'translateY(-50%) scaleY(1)' : 'translateY(-50%) scaleY(0)',
                                height: '24px', // Altura do traço
                                width: '3px',
                                backgroundColor: 'primary.main',
                                borderTopLeftRadius: '4px',
                                borderBottomLeftRadius: '4px',
                                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                transformOrigin: 'center',
                            }}
                        />
                    </ListItemButton>
                );
            })}
        </List>
    </Box>
  );
};