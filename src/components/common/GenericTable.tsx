import { 
  Card, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography, 
  CircularProgress,
  Box,
  Stack
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { ReactNode } from 'react';

export interface TableColumn {
  id: string;
  label: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

interface GenericTableProps<T> {
  columns: TableColumn[];
  rows: T[];
  isLoading: boolean;
  emptyMessage?: string;
  renderRow: (row: T) => ReactNode;
  minWidth?: number;
}

export const GenericTable = <T,>({ 
  columns, 
  rows, 
  isLoading, 
  emptyMessage = "Nenhum registro encontrado.",
  renderRow,
  minWidth = 900
}: GenericTableProps<T>) => {

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: minWidth }}>
          <TableHead sx={{ bgcolor: '#F4F6F8' }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell 
                  key={col.id} 
                  align={col.align || 'left'} 
                  sx={{ 
                    width: col.width || 'auto', 
                    fontWeight: 600, 
                    color: 'text.secondary'
                  }}
                >
                  <Stack 
                    direction="row" 
                    alignItems="center" 
                    spacing={0.5} 
                    justifyContent={col.align === 'right' ? 'flex-end' : (col.align === 'center' ? 'center' : 'flex-start')}
                  >
                    <span>{col.label}</span>
                    <ArrowDownwardIcon sx={{ fontSize: 16, opacity: 0.5 }} />
                  </Stack>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                            {emptyMessage}
                        </Typography>
                    </TableCell>
                </TableRow>
            ) : (
                rows.map((row) => renderRow(row))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};