import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface AppBreadcrumbsProps {
  items: BreadcrumbItem[];
}

const BreadcrumbSeparator = () => (
  <Box
    component="span"
    sx={{
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      bgcolor: '#919EAB', 
      display: 'block',
    }}
  />
);

export const AppBreadcrumbs = ({ items }: AppBreadcrumbsProps) => {
  return (
    <Breadcrumbs
      separator={<BreadcrumbSeparator />}
      aria-label="breadcrumb"
      sx={{
        height: '22px',
        '& .MuiBreadcrumbs-ol': {
          alignItems: 'center',
        },
        '& .MuiBreadcrumbs-separator': {
          marginLeft: '16px',
          marginRight: '16px',
        },
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return isLast ? (
          <Typography
            key={item.label}
            sx={{
              fontFamily: '"Public Sans", sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '22px',
              color: '#919EAB', 
              whiteSpace: 'nowrap',
            }}
          >
            {item.label}
          </Typography>
        ) : (
          <Link
            key={item.label}
            component={RouterLink}
            to={item.path || '#'}
            underline="hover"
            sx={{
              fontFamily: '"Public Sans", sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '22px',
              color: '#212B36', 
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};