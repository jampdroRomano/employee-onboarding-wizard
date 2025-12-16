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
                    height: '28px',
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
                {icon || <AddIcon />}
            </Box>
        </MenuItem>
    );
};