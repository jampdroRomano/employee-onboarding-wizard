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
      const matchText = row.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        row.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = filterDept === 'todos' || row.departamento === filterDept;
      return matchText && matchDept;
    });
  }, [rows, searchTerm, filterDept]);

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
    const numSelectedVisible = filteredRows.filter(row => selectedIds.includes(row.id)).length;
    const rowCountVisible = filteredRows.length;
    
    if (numSelectedVisible === rowCountVisible) { // Todos visíveis selecionados, então desmarca todos os visíveis
        const newSelected = selectedIds.filter(id => !filteredRows.map(r => r.id).includes(id));
        onSelectionChange(newSelected);
    } else { // Alguns ou nenhum visível selecionado, então seleciona todos os visíveis
        const newSelected = Array.from(new Set([...selectedIds, ...filteredRows.map(r => r.id)]));
        onSelectionChange(newSelected);
    }
  }, [selectedIds, filteredRows, onSelectionChange]);

  // --- Estados do checkbox do cabeçalho ---
  const numSelectedVisible = filteredRows.filter(row => selectedIds.includes(row.id)).length;
  const rowCountVisible = filteredRows.length;

  const isSelectAllChecked = rowCountVisible > 0 && numSelectedVisible === rowCountVisible;
  const isSelectAllIndeterminate = numSelectedVisible > 0 && numSelectedVisible < rowCountVisible;


  const columns: TableColumn[] = [
    { id: 'colaborador', label: 'Colaborador', width: '40%' },
    { id: 'email', label: 'E-mail', width: '30%' },
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
        rows={filteredRows}
        isLoading={loading}
        maxHeight={400} 
        
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
            placeholder="Buscar por nome ou e-mail..."
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
                <Typography variant="subtitle2" noWrap>{row.nome}</Typography>
              </Stack>
            </TableCell>

            <TableCell>
              <Typography variant="body2" color="text.secondary" noWrap>{row.email}</Typography>
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