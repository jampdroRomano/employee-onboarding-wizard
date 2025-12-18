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
    Stack,
    Checkbox,
    TablePagination,
    TableFooter,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { ReactNode } from 'react';
import { CHECKBOX_GREEN } from '../../theme/mainTheme';

export interface TableColumn {
    id: string;
    label: string;
    width?: string | number;
    align?: 'left' | 'center' | 'right';
    disableSort?: boolean; 
}

interface GenericTableProps<T> {
    columns: TableColumn[];
    rows: T[];
    isLoading: boolean;
    emptyMessage?: string;
    minWidth?: string | number;
    maxHeight?: number;
    filters?: ReactNode;

    // Selection
    enableSelection?: boolean;
    selectedIds?: string[];
    onRowToggle?: (id: string) => void;
    onSelectAllToggle?: () => void;
    headerCheckboxColor?: string;
    isSelectAllChecked?: boolean;
    isSelectAllIndeterminate?: boolean;

    // Pagination
    pagination?: boolean;
    count?: number;
    page?: number;
    rowsPerPage?: number;
    onPageChange?: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

    renderRow: (row: T, isSelected: boolean, toggleSelect: () => void) => ReactNode;
}

export const GenericTable = <T extends { id: string }>({
    columns,
    rows,
    isLoading,
    emptyMessage = "Nenhum registro encontrado.",
    renderRow,
    minWidth = '100%',
    maxHeight,
    filters,
    
    // Selection
    enableSelection = false,
    selectedIds = [],
    onRowToggle,
    onSelectAllToggle,
    headerCheckboxColor,
    isSelectAllChecked,
    isSelectAllIndeterminate,
    
    // Pagination
    pagination = false,
    count = 0,
    page = 0,
    rowsPerPage = 5,
    onPageChange,
    onRowsPerPageChange,

}: GenericTableProps<T>) => {

    const isSelected = (id: string) => selectedIds.indexOf(id) !== -1;

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Card>
            <TableContainer
                sx={{
                    border: '2px solid #F4F6F8',
                    borderRadius: 2,
                    maxHeight: maxHeight
                }}
            >
                {filters && (
                    <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                        {filters}
                    </Box>
                )}

                <Table sx={{ minWidth: minWidth }}>
                    <TableHead sx={{ bgcolor: '#F4F6F8' }}>
                        <TableRow>
                            {enableSelection && (
                                <TableCell padding="checkbox" sx={{ width: '48px' }}>
                                    <Checkbox
                                        indeterminate={isSelectAllIndeterminate}
                                        checked={isSelectAllChecked}
                                        onChange={() => onSelectAllToggle?.()}
                                        sx={{
                                            '&.Mui-checked': { color: headerCheckboxColor || CHECKBOX_GREEN },
                                            '&.MuiCheckbox-indeterminate': { color: headerCheckboxColor || CHECKBOX_GREEN }
                                        }}
                                    />
                                </TableCell>
                            )}

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
                                        {!col.disableSort && (
                                            <ArrowDownwardIcon sx={{ fontSize: 16, opacity: 0.5 }} />
                                        )}
                                    </Stack>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + (enableSelection ? 1 : 0)} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        {emptyMessage}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row) => {
                                const isItemSelected = isSelected(row.id);
                                return renderRow(row, isItemSelected, () => onRowToggle?.(row.id));
                            })
                        )}
                    </TableBody>
                    
                    {pagination && onPageChange && onRowsPerPageChange && (
                      <TableFooter>
                          <TableRow>
                              <TablePagination
                                  rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
                                  colSpan={columns.length + (enableSelection ? 1 : 0)}
                                  count={count}
                                  rowsPerPage={rowsPerPage}
                                  page={page}
                                  onPageChange={onPageChange}
                                  onRowsPerPageChange={onRowsPerPageChange}
                                  labelRowsPerPage="Itens por página:"
                                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                                  SelectProps={{
                                      native: false,
                                      sx: {
                                        // Estilo do container do Select
                                        backgroundColor: '#F4F6F8',
                                        borderRadius: 1.5,
                                        mx: 1,
                                        // Estilo do texto selecionado
                                        '& .MuiSelect-select': {
                                          padding: '4px 32px 4px 12px', // T R B L
                                          color: 'text.primary',
                                          fontWeight: 600,
                                        },
                                        // Remove a borda padrão
                                        '.MuiOutlinedInput-notchedOutline': {
                                            border: 'none',
                                        },
                                      },
                                      MenuProps: {
                                        PaperProps: {
                                          sx: {
                                            borderRadius: 2,
                                            boxShadow: '0 0 20px rgba(0,0,0,0.1)',
                                          }
                                        }
                                      }
                                  }}
                                  sx={{
                                    // Estiliza os outros labels do componente
                                    '.MuiTablePagination-toolbar': {
                                      '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                                        color: 'text.secondary',
                                        fontWeight: 500,
                                      }
                                    }
                                  }}
                              />
                          </TableRow>
                      </TableFooter>
                    )}
                </Table>
            </TableContainer>
        </Card>
    );
};