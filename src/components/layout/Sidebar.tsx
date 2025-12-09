import { Drawer } from '@mui/material';
import { SidebarContent } from './SidebarContent';

const DRAWER_WIDTH = 280;

interface SidebarProps {
  isMobile: boolean;
  drawerOpen: boolean;
  onDrawerClose: () => void;
}

export const Sidebar = ({ isMobile, drawerOpen, onDrawerClose }: SidebarProps) => {

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={onDrawerClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
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
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
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