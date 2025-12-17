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
    Checkbox
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
    enableSelection?: boolean;
    selectedIds?: string[];
    onSelectionChange?: (ids: string[]) => void;

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
    enableSelection = false,
    selectedIds = [],
    onSelectionChange
}: GenericTableProps<T>) => {

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            onSelectionChange?.(newSelected);
            return;
        }
        onSelectionChange?.([]);
    };

    const isSelected = (id: string) => selectedIds.indexOf(id) !== -1;

    const handleRowClick = (id: string) => {
        if (!onSelectionChange) return;

        const selectedIndex = selectedIds.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedIds, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedIds.slice(1));
        } else if (selectedIndex === selectedIds.length - 1) {
            newSelected = newSelected.concat(selectedIds.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedIds.slice(0, selectedIndex),
                selectedIds.slice(selectedIndex + 1),
            );
        }
        onSelectionChange(newSelected);
    };

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
                                        indeterminate={selectedIds.length > 0 && selectedIds.length < rows.length}
                                        checked={rows.length > 0 && selectedIds.length === rows.length}
                                        onChange={handleSelectAllClick}
                                        sx={{
                                            '&.Mui-checked': { color: CHECKBOX_GREEN },
                                            '&.MuiCheckbox-indeterminate': { color: CHECKBOX_GREEN }
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
                                return renderRow(row, isItemSelected, () => handleRowClick(row.id));
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
};