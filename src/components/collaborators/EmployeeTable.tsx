import { useEffect, useState, useMemo, memo, useCallback } from 'react';
import {
  TableCell,
  TableRow,
  Typography,
  Avatar,
  Chip,
  Stack,
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

// Firebase e Services
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { departmentService } from '../../services/departmentService';
import { employeeService } from '../../services/employeeService';
import type { Employee, Department } from '../../types';

// Componentes Comuns
import { GenericTable } from '../common/GenericTable';
import { TableToolbar } from '../common/TableToolbar';
import { ConfirmDialog } from '../common/ConfirmDialog';
import type { TableColumn } from '../common/GenericTable';

// Hooks e Tema
import { useTableDelete } from '../../hooks/useTableDelete';
import { usePagination } from '../../hooks/usePagination';
import { useTableSort } from '../../hooks/useTableSort';
import { CHECKBOX_GREEN } from '../../theme/mainTheme';

import { useNavigate } from 'react-router-dom';

// --- HELPERS ---
const formatCurrency = (value?: string | number) => {
  if (!value) return '-';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return value;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};

export const EmployeeTable = memo(() => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [loadingEmps, setLoadingEmps] = useState(true);

  // Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('todos');

  // Estado de Seleção
  const [selected, setSelected] = useState<string[]>([]);

  // Estado do Menu (3 pontinhos)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = useState<string | null>(null);

  // --- LÓGICA DE EXCLUSÃO (HOOK) ---
  const {
    open: openDeleteDialog,
    idsToDelete,
    isDeleting,
    handleOpenDelete,
    handleClose: handleCloseDeleteDialog,
    handleConfirmDelete
  } = useTableDelete({
    onDelete: async (ids) => {
      await employeeService.deleteMany(ids);
    },
    onSuccess: () => {
      setSelected([]);
      handleCloseMenu();
    }
  });

  // --- HANDLERS DO MENU ---
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
      navigate(`/editar/${menuRowId}`);
    }
    handleCloseMenu();
  };

  const handleDeleteFromMenu = () => {
    if (menuRowId) {
      handleOpenDelete(menuRowId);
    }
    handleCloseMenu();
  };

  const handleDeleteSelected = () => {
    handleOpenDelete(selected);
  };

  // --- COLUNAS ---
  const columns: TableColumn[] = [
    { id: 'nome', label: 'Colaborador', width: '25%' },
    { id: 'role', label: 'Cargo & Dept.', width: '25%' },
    { id: 'admissionDate', label: 'Nível & Admissão', width: '20%' },
    { id: 'salary', label: 'Gestão & Salário', width: '20%' },
    { id: 'status', label: 'Status', align: 'left' },
    { id: 'actions', label: '', disableSort: true }
  ];

  // --- EFEITOS (CARREGAMENTO DE DADOS) ---
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await departmentService.getAll();
        setDepartments(data);
      } catch (error) { console.error(error); } finally { setLoadingDepts(false); }
    };
    loadDepartments();

    const q = query(collection(db, "employees"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Employee[];
      setRows(employees);
      setLoadingEmps(false);
    });
    return () => unsubscribe();
  }, []);

  // --- MEMOS (MAPAS E FILTROS) ---
  const departmentsMap = useMemo(() => departments.reduce((acc: Record<string, string>, d) => ({ ...acc, [d.id]: d.name }), {}), [departments]);
  const employeesMap = useMemo(() => rows.reduce((acc: Record<string, string>, e) => ({ ...acc, [e.id]: e.nome }), {}), [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const s = searchTerm.toLowerCase();
      const matchText = row.nome.toLowerCase().includes(s) || row.email.toLowerCase().includes(s);
      const matchDept = filterDept === 'todos' || row.departamento === filterDept;
      return matchText && matchDept;
    });
  }, [rows, searchTerm, filterDept]);

  // --- ORDENAÇÃO (HOOK) ---
  const {
    sortOrder,
    sortOrderBy,
    handleRequestSort,
    sortedData
  } = useTableSort(filteredRows);

  // --- PAGINAÇÃO (HOOK) ---
  const {
    paginatedData,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    count,
  } = usePagination(sortedData, { initialRowsPerPage: 10 });

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
    const allFilteredIds = filteredRows.map(row => row.id);
    // Se todos os filtrados já estão selecionados, limpa a seleção.
    // Senão, seleciona todos os filtrados.
    if (selected.length === allFilteredIds.length && allFilteredIds.every(id => selected.includes(id))) {
      setSelected([]);
    } else {
      setSelected(allFilteredIds);
    }
  }, [selected, filteredRows]);
  
  // --- Estados do checkbox do cabeçalho ---
  const numSelected = selected.length;
  const numFilteredRows = filteredRows.length;
  const isSelectAllChecked = numFilteredRows > 0 && numSelected === numFilteredRows;
  const isSelectAllIndeterminate = numSelected > 0 && numSelected < numFilteredRows;


  const getDepartmentName = (id: string) => departmentsMap[id] || 'Não atribuído';
  const getManagerName = useCallback((id?: string | null) => {
    if (!id) return '-';
    return employeesMap[id] || 'Não encontrado';
  }, [employeesMap]);
  const isStatusActive = (s: boolean | string) => s === true || s === 'Ativo';

  return (
    <Box>
      <GenericTable<Employee>
        columns={columns}
        rows={paginatedData}
        isLoading={loadingDepts || loadingEmps}

        // Configuração de Ordenação
        sortOrder={sortOrder}
        sortOrderBy={sortOrderBy as string | false}
        onRequestSort={handleRequestSort as (property: string) => void}

        // Configuração de Paginação
        pagination={true}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}

        // Configuração de Seleção
        enableSelection={true}
        selectedIds={selected}
        onRowToggle={handleRowToggle}
        onSelectAllToggle={handleSelectAllToggle}
        isSelectAllChecked={isSelectAllChecked}
        isSelectAllIndeterminate={isSelectAllIndeterminate}

        // Barra de Ferramentas (Filtros + Botão de Excluir em massa)
        filters={
          <TableToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Buscar por nome ou e-mail..."
          >
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

        renderRow={(row, isSelected, toggleSelect) => (
          <TableRow key={row.id} hover selected={isSelected}>
            {/* Checkbox da Linha */}
            <TableCell padding="checkbox">
              <Checkbox
                checked={isSelected}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleSelect();
                }}
                sx={{
                  '&.Mui-checked': { color: CHECKBOX_GREEN }
                }}
              />
            </TableCell>

            <TableCell onClick={toggleSelect} sx={{ cursor: 'pointer' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar src={row.img} alt={row.nome} />
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

            <TableCell onClick={toggleSelect} sx={{ cursor: 'pointer' }}>
              <Box>
                <Typography variant="subtitle2" color="text.primary" noWrap>
                  {row.role || 'Sem cargo'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  {getDepartmentName(row.departamento)}
                </Typography>
              </Box>
            </TableCell>

            <TableCell onClick={toggleSelect} sx={{ cursor: 'pointer' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'text.primary', fontSize: '0.85rem' }}>
                  {row.seniority || '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(row.admissionDate)}
                </Typography>
              </Box>
            </TableCell>

            <TableCell onClick={toggleSelect} sx={{ cursor: 'pointer' }}>
              <Box>
                <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.875rem' }}>
                  {getManagerName(row.managerId)}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  {formatCurrency(row.salary)}
                </Typography>
              </Box>
            </TableCell>

            <TableCell align="left" onClick={toggleSelect} sx={{ cursor: 'pointer' }}>
              <Chip
                label={isStatusActive(row.status) ? 'Ativo' : 'Inativo'}
                size="small"
                sx={{
                  fontWeight: 700,
                  borderRadius: '6px',
                  height: '24px',
                  bgcolor: isStatusActive(row.status) ? 'rgba(34, 197, 94, 0.16)' : 'rgba(255, 86, 48, 0.16)',
                  color: isStatusActive(row.status) ? '#118D57' : '#B71D18',
                }}
              />
            </TableCell>

            {/* Botão de Menu (3 pontinhos) */}
            <TableCell align="right">
              <IconButton onClick={(e) => handleOpenMenu(e, row.id)}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </TableCell>
          </TableRow>
        )}
      />

      {/* --- MENU DE OPÇÕES (FLUTUANTE) --- */}
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

      {/* --- DIALOG DE CONFIRMAÇÃO DE EXCLUSÃO --- */}
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={idsToDelete.length > 1 ? "Excluir Colaboradores" : "Excluir Colaborador"}
        content={
          idsToDelete.length > 1
            ? `Tem certeza que deseja excluir os ${idsToDelete.length} colaboradores selecionados? Esta ação não pode ser desfeita.`
            : "Tem certeza que deseja excluir este colaborador? Esta ação não pode ser desfeita."
        }
      />
    </Box>
  );
});

EmployeeTable.displayName = 'EmployeeTable';