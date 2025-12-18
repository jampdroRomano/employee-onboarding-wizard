import { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  Avatar, 
  Checkbox, 
  TableRow, 
  TableCell,
  Chip,
  TextField,
  MenuItem
} from '@mui/material';
import { getAllEmployees } from '../../services/employeeService';
import { departmentService } from '../../services/departmentService';
import type { Employee, Department } from '../../types';
import { GenericTable } from '../common/GenericTable';
import type { TableColumn } from '../common/GenericTable';
import { usePagination } from '../../hooks/usePagination';
import { TableToolbar } from '../common/TableToolbar';
import { CHECKBOX_GREEN } from '../../theme/mainTheme';

interface EmployeeSelectionStepProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export const EmployeeSelectionStep = ({ selectedIds, onSelectionChange }: EmployeeSelectionStepProps) => {
  const [rows, setRows] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('todos');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [empData, deptData] = await Promise.all([
          getAllEmployees(),
          departmentService.getAll()
        ]);
        setRows(empData);
        setDepartments(deptData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const deptMap = useMemo(() => {
    return departments.reduce((acc, d) => ({ ...acc, [d.id]: d.name }), {} as Record<string, string>);
  }, [departments]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const s = searchTerm.toLowerCase();
      const matchText = row.nome.toLowerCase().includes(s) ||
                        row.email.toLowerCase().includes(s) ||
                        (row.role && row.role.toLowerCase().includes(s)) ||
                        (row.seniority && row.seniority.toLowerCase().includes(s));
      const matchDept = filterDept === 'todos' || row.departamento === filterDept;
      return matchText && matchDept;
    });
  }, [rows, searchTerm, filterDept]);

  const {
    paginatedData,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    count,
  } = usePagination(filteredRows);


  // --- Lógica para os novos manipuladores de seleção ---

  const handleRowToggle = useCallback((id: string) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
        newSelected = newSelected.concat(selectedIds, id);
    } else {
        newSelected = selectedIds.filter(itemId => itemId !== id);
    }
    onSelectionChange(newSelected);
  }, [selectedIds, onSelectionChange]);

  const handleSelectAllToggle = useCallback(() => {
    const allFilteredIds = filteredRows.map(row => row.id);
    if (selectedIds.length === allFilteredIds.length && allFilteredIds.every(id => selectedIds.includes(id))) {
      onSelectionChange([]);
    } else {
      onSelectionChange(allFilteredIds);
    }
  }, [selectedIds, onSelectionChange, filteredRows]);

  // --- Estados do checkbox do cabeçalho ---
  const numSelected = selectedIds.length;
  const numFilteredRows = filteredRows.length;
  const isSelectAllChecked = numFilteredRows > 0 && numSelected === numFilteredRows;
  const isSelectAllIndeterminate = numSelected > 0 && numSelected < numFilteredRows;


  const columns: TableColumn[] = [
    { id: 'colaborador', label: 'Colaborador', width: '40%' },
    { id: 'cargo_nivel', label: 'Cargo & Nível', width: '30%' },
    { id: 'atual_dept', label: 'Departamento Atual', width: '30%' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 700, mb: 1 }}>
          Adicionar Colaboradores
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Selecione os colaboradores que serão movidos para este novo departamento.
        </Typography>
      </Box>

      <GenericTable<Employee>
        columns={columns}
        rows={paginatedData}
        isLoading={loading}
        
        pagination={true}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        
        enableSelection={true}
        selectedIds={selectedIds}
        onRowToggle={handleRowToggle}
        onSelectAllToggle={handleSelectAllToggle}
        isSelectAllChecked={isSelectAllChecked}
        isSelectAllIndeterminate={isSelectAllIndeterminate}
        filters={
          <TableToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Buscar por nome, e-mail, cargo..."
          >
            {selectedIds.length > 0 && (
                <Chip 
                    label={`${selectedIds.length} selecionado(s)`} 
                    color="primary" 
                    size="small" 
                    sx={{ bgcolor: 'rgba(34, 197, 94, 0.16)', color: 'primary.main', fontWeight: 700 }}
                />
            )}
            <TextField
              select
              size="small"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              sx={{ minWidth: '200px' }}
            >
              <MenuItem value="todos">Todos Departamentos</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
              ))}
            </TextField>
          </TableToolbar>
        }

        renderRow={(row, isSelected, toggleSelect) => (
          <TableRow key={row.id} hover selected={isSelected} onClick={toggleSelect} sx={{ cursor: 'pointer' }}>
            <TableCell padding="checkbox">
              <Checkbox
                checked={isSelected}
                sx={{ '&.Mui-checked': { color: CHECKBOX_GREEN } }}
              />
            </TableCell>

            <TableCell>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar src={row.img} alt={row.nome} sx={{ width: 32, height: 32 }} />
                 <Box>
                  <Typography variant="subtitle2" color="text.primary" noWrap>
                    {row.nome}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: '0.80rem' }}>
                    {row.email}
                  </Typography>
                </Box>
              </Stack>
            </TableCell>

            <TableCell>
              <Box>
                <Typography variant="subtitle2" color="text.primary" noWrap>
                  {row.role || '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  {row.seniority || 'N/A'}
                </Typography>
              </Box>
            </TableCell>

            <TableCell>
               <Typography variant="caption" sx={{ 
                   bgcolor: row.departamento ? 'rgba(145, 158, 171, 0.12)' : 'transparent',
                   px: 1, py: 0.5, borderRadius: 1,
                   color: row.departamento ? 'text.primary' : 'text.disabled'
               }}>
                  {deptMap[row.departamento] || 'Sem departamento'}
               </Typography>
            </TableCell>
          </TableRow>
        )}
      />
    </Box>
  );
};