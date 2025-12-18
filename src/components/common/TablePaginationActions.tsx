import {
    TableFooter,
    TableRow,
    TablePagination,
} from '@mui/material';

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    colSpan: number;
}

export const TablePaginationActions = ({
    count,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    colSpan,
}: TablePaginationActionsProps) => {
    return (
        <TableFooter>
            <TableRow>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
                    colSpan={colSpan}
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
                            backgroundColor: '#F4F6F8',
                            mx: 1,
                            '& .MuiSelect-select': {
                                padding: '4px 32px 4px 12px', 
                                color: 'text.primary',
                                fontWeight: 600,
                            },
                            '.MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                        },
                        MenuProps: {
                            PaperProps: {
                                sx: {
                                    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
                                }
                            }
                        }
                    }}
                    sx={{
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
    );
};