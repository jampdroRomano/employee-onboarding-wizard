import { useEffect, useState, useMemo, memo, useCallback } from 'react';
import { 
  TableCell, 
  TableRow, 
  Typography, 
  Box,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Checkbox, 
  Menu,
  ListItemIcon
} from '@mui/material';

// Ícones
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

// Serviços e Tipos
import { departmentService } from '../../services/departmentService';
import { getAllEmployees } from '../../services/employeeService';
import type { Department, Employee } from '../../types';

// Componentes Comuns
import { GenericTable } from '../common/GenericTable';
import { TableToolbar } from '../common/TableToolbar'; 
import { ConfirmDialog } from '../common/ConfirmDialog'; 
import type { TableColumn } from '../common/GenericTable';

// Hooks e Tema
import { useTableDelete } from '../../hooks/useTableDelete';
import { CHECKBOX_GREEN } from '../../theme/mainTheme';

import { useNavigate } from 'react-router-dom';

export const DepartmentTable = memo(() => {
  const [rows, setRows] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDeptId, setFilterDeptId] = useState('todos');

  // Seleção
  const [selected, setSelected] = useState<string[]>([]);

  // Menu de Ações
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = useState<string | null>(null);

  // --- LÓGICA DE EXCLUSÃO ---
  const { 
    open: openDeleteDialog, 
    idsToDelete, 
    isDeleting, 
    handleOpenDelete, 
    handleClose: handleCloseDeleteDialog, 
    handleConfirmDelete 
   } = useTableDelete({
    onDelete: async (ids) => {
      await departmentService.deleteMany(ids);
      const updatedData = await departmentService.getAll();
      setRows(updatedData);
    },
    onSuccess: () => {
      setSelected([]); 
      handleCloseMenu();
    }
  });

  // --- CARREGAMENTO DE DADOS ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [deptData, empData] = await Promise.all([
          departmentService.getAll(),
          getAllEmployees()
        ]);
        setRows(deptData);
        setEmployees(empData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- MEMOS ---
  const { employeesMap, employeeCounts } = useMemo(() => {
    const map: Record<string, string> = {}; 
    const counts: Record<string, number> = {};

    employees.forEach(emp => {
      // Mapa para Gestor (Apenas Nome)
      map[emp.id] = emp.nome;

      // Contagem por Departamento
      if (emp.departamento) {
        counts[emp.departamento] = (counts[emp.departamento] || 0) + 1;
      }
    });

    return { employeesMap: map, employeeCounts: counts };
  }, [employees]);

  // Helper para exibir nome do gestor
  const getManagerName = (managerId?: string | null) => {
    if (!managerId) return null;
    return employeesMap[managerId] || null;
  };

  // --- FILTRAGEM ---
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const managerName = getManagerName(row.managerId) || '';
      const description = row.description || '';

      const s = searchTerm.toLowerCase();
      const matchesSearch = 
        row.name.toLowerCase().includes(s) || 
        description.toLowerCase().includes(s) ||
        managerName.toLowerCase().includes(s);

      const matchesDept = filterDeptId === 'todos' || row.id === filterDeptId;

      return matchesSearch && matchesDept;
    });
  }, [rows, searchTerm, filterDeptId, employeesMap]);

  // --- Lógica para os novos manipuladores de seleção ---
  const handleRowToggle = useCallback((id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
    } else {
        newSelected = selected.filter(itemId => itemId !== id);
    }
    setSelected(newSelected);
  }, [selected]);

  const handleSelectAllToggle = useCallback(() => {
      const numSelectedVisible = filteredRows.filter(row => selected.includes(row.id)).length;
      const rowCountVisible = filteredRows.length;
      
      if (numSelectedVisible === rowCountVisible) { // Todos visíveis selecionados, então desmarca tudo
          setSelected([]); // Limpa tudo
      } else { // Alguns ou nenhum visível selecionado, então seleciona todos os visíveis
          const newSelected = filteredRows.map(r => r.id);
          setSelected(newSelected);
      }
  }, [selected, filteredRows]);

  // --- Estados do checkbox do cabeçalho ---
  const numSelectedVisible = filteredRows.filter(row => selected.includes(row.id)).length;
  const rowCountVisible = filteredRows.length;

  const isSelectAllChecked = rowCountVisible > 0 && numSelectedVisible === rowCountVisible;
  const isSelectAllIndeterminate = numSelectedVisible > 0 && numSelectedVisible < rowCountVisible;


  // --- HANDLERS ---
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, id: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuRowId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const handleEdit = () => {
    if (menuRowId) {
      navigate(`/departamentos/editar/${menuRowId}`);
    }
    handleCloseMenu();
  };

  const handleDeleteFromMenu = () => {
    if (menuRowId) handleOpenDelete(menuRowId);
    handleCloseMenu();
  };

  const handleDeleteSelected = () => {
    handleOpenDelete(selected);
  };

  // --- COLUNAS ---
  const columns: TableColumn[] = [
    { id: 'name', label: 'Departamento', width: '30%' },
    { id: 'manager', label: 'Gestor Responsável', width: '25%' },
    { id: 'description', label: 'Descrição', width: '25%' },
    { id: 'employees', label: 'Colaboradores', width: '15%', align: 'center' },
    { id: 'actions', label: '', width: '48px', align: 'right', disableSort: true }
  ];

  return (
    <Box>
      <GenericTable<Department>
        columns={columns}
        rows={filteredRows}
        isLoading={loading}
        emptyMessage="Nenhum departamento encontrado."
        
        enableSelection={true}
        selectedIds={selected}
        onRowToggle={handleRowToggle}
        onSelectAllToggle={handleSelectAllToggle}
        isSelectAllChecked={isSelectAllChecked}
        isSelectAllIndeterminate={isSelectAllIndeterminate}
        filters={
          <TableToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Buscar por nome ou gestor..."
          >
            <TextField
              select
              size="small"
              value={filterDeptId}
              onChange={(e) => setFilterDeptId(e.target.value)}
              sx={{ minWidth: '200px' }}
            >
              <MenuItem value="todos">Todos Departamentos</MenuItem>
              {rows.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </TextField>

            <Tooltip title="Excluir selecionados">
              <span>
                <IconButton 
                  onClick={handleDeleteSelected} 
                  color="error"
                  disabled={selected.length === 0}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </span>
            </Tooltip>
            
            {selected.length > 0 && (
              <Typography variant="caption" color="text.secondary">
                {selected.length} selecionado(s)
              </Typography>
            )}
          </TableToolbar>
        }

        renderRow={(row, isSelected, toggleSelect) => {
          const managerName = getManagerName(row.managerId);
          const count = employeeCounts[row.id] || 0; 

          return (
            <TableRow key={row.id} hover selected={isSelected}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    onClick={(e) => { e.stopPropagation(); toggleSelect(); }}
                    sx={{ '&.Mui-checked': { color: CHECKBOX_GREEN } }}
                  />
                </TableCell>

                {/* Nome */}
                <TableCell onClick={toggleSelect} sx={{ cursor: 'pointer' }}>
                    <Typography variant="subtitle2" color="text.primary" noWrap>
                        {row.name}
                    </Typography>
                </TableCell>
                
                {/* Gestor (Apenas Nome) */}
                <TableCell onClick={toggleSelect} sx={{ cursor: 'pointer' }}>
                    {managerName ? (
                      <Typography variant="body2" color="text.secondary" noWrap>
                          {managerName}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="text.disabled">
                          Sem gestor
                      </Typography>
                    )}
                </TableCell>

                {/* Descrição */}
                <TableCell onClick={toggleSelect} sx={{ cursor: 'pointer' }}>
                    <Tooltip title={row.description || ''}>
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>
                            {row.description || '-'}
                        </Typography>
                    </Tooltip>
                </TableCell>

                {/* Contagem */}
                <TableCell align="center" onClick={toggleSelect} sx={{ cursor: 'pointer' }}>
                    <Typography variant="body2">
                        {count}
                    </Typography>
                </TableCell>

                {/* Ações */}
                <TableCell 
                  align="right" 
                  sx={{ padding: 0, paddingRight: 1, width: '48px' }}
                >
                  <IconButton onClick={(e) => handleOpenMenu(e, row.id)} size="small">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
            </TableRow>
          );
        }}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { 
            boxShadow: '0 0 20px rgba(0,0,0,0.1)', 
            minWidth: '140px',
            borderRadius: '8px'
          }
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon><EditOutlinedIcon fontSize="small" /></ListItemIcon>
          Editar
        </MenuItem>
        <MenuItem onClick={handleDeleteFromMenu} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteForeverOutlinedIcon fontSize="small" color="error" /></ListItemIcon>
          Excluir
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={idsToDelete.length > 1 ? "Excluir Departamentos" : "Excluir Departamento"}
        content={
          idsToDelete.length > 1 
          ? `Tem certeza que deseja excluir os ${idsToDelete.length} departamentos selecionados?`
          : "Tem certeza que deseja excluir este departamento?"
        }
      />
    </Box>
  );
});

DepartmentTable.displayName = 'DepartmentTable';