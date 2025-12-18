import { useState, useMemo } from 'react';

interface PaginationOptions {
  initialPage?: number;
  initialRowsPerPage?: number;
}

export const usePagination = <T,>(
  data: T[],
  options: PaginationOptions = {}
) => {
  const { initialPage = 0, initialRowsPerPage = 5 } = options;

  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const paginatedData = useMemo(() => {
    if (rowsPerPage === -1) {
      return data; // Opção "Todos"
    }
    return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [data, page, rowsPerPage]);

  return {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    paginatedData,
    // Retorna o número total de itens para o componente de paginação
    count: data.length, 
  };
};