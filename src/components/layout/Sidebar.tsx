import { Drawer } from '@mui/material';
import { SidebarContent } from './SidebarContent';

interface SidebarProps {
  isMobile: boolean;
  drawerOpen: boolean;
  onDrawerClose: () => void;
  drawerWidth?: number; 
}

export const Sidebar = ({ 
  isMobile, 
  drawerOpen, 
  onDrawerClose, 
  drawerWidth = 280 
}: SidebarProps) => {

  if (isMobile) {
    return (
      <Drawer
        variant="temporary" 
        anchor="left"
        open={drawerOpen}
        onClose={onDrawerClose}
        ModalProps={{ keepMounted: true }} 
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px dashed rgba(145, 158, 171, 0.24)',
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px dashed rgba(145, 158, 171, 0.24)', 
          backgroundColor: 'background.default',
        },
      }}
    >
      <SidebarContent />
    </Drawer>
  );
};