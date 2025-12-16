import React from 'react';
import { MenuItem, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface StickyActionMenuItemProps {
    onClick: () => void;
    icon?: React.ReactNode;
}
export const StickyActionMenuItem = ({ onClick, icon }: StickyActionMenuItemProps) => {
    return (
        <MenuItem
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
            disableRipple
            sx={{
                p: 0,
                position: 'sticky',
                bottom: 0,
                zIndex: 2,
                backgroundColor: 'background.paper',
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'center',
                '&:hover': {
                    backgroundColor: 'background.paper',
                },
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    minHeight: { xs: '48px', md: '36px' }, 
                    p: { xs: 1, md: 0.5 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#22C55E',
                    color: 'white',
                    transition: 'filter 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                        filter: 'brightness(0.9)',
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& .MuiSvgIcon-root': { fontSize: { xs: '1.5rem', md: '1.25rem' } } }}>
                    {icon || <AddIcon />}
                </Box>
            </Box>
        </MenuItem>
    );
};