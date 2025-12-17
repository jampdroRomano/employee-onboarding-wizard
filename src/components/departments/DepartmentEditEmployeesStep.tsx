import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  Avatar, 
  Checkbox, 
  TableRow, 
  TableCell,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import type { Employee } from '../../types';
import { GenericTable } from '../common/GenericTable';
import type { TableColumn } from '../common/GenericTable';
import { TableToolbar } from '../common/TableToolbar';
import { CHECKBOX_GREEN } from '../../theme/mainTheme';
import { useDepartmentMemberManagement } from '../../hooks/useDepartmentMemberManagement';

interface EmployeeChange {
  employeeId: string;
  newDepartmentId: string | null;
}

interface DepartmentEditEmployeesStepProps {
  currentDepartmentId: string;
  onEmployeeChanges: (changes: EmployeeChange[]) => void;
  initialEmployeeChanges?: EmployeeChange[];
}

export const DepartmentEditEmployeesStep = (props: DepartmentEditEmployeesStepProps) => {
  const {
    loading,
    filteredRows,
    departments,
    deptNameMap,
    searchTerm,
    setSearchTerm,
    filterDept,
    handleChangeFilter,
    selectedIds,
    handleRowToggle,
    handleSelectAllToggle,
    clearSelection,
    isSelectionFromCurrentDept,
    isSelectionMixed,
    isSelectAllChecked,
    isSelectAllIndeterminate,
    applyChanges,
    effectiveDepartmentMap,
  } = useDepartmentMemberManagement(props);

  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [targetTransferDept, setTargetTransferDept] = useState('');

  const handleActionClick = () => {
    if (isSelectionMixed) return;
    if (isSelectionFromCurrentDept) {
      setTargetTransferDept('');
      setIsTransferDialogOpen(true);
    } else {
      setIsAddDialogOpen(true);
    }
  };

  const handleConfirmTransfer = () => {
    if (!targetTransferDept) return;
    applyChanges(selectedIds, targetTransferDept);
    clearSelection();
    setIsTransferDialogOpen(false);
  };

  const handleConfirmAdd = () => {
    applyChanges(selectedIds, props.currentDepartmentId);
    clearSelection();
    setIsAddDialogOpen(false);
  };

  const columns: TableColumn[] = [
    { id: 'colaborador', label: 'Colaborador', width: '40%' },
    { id: 'cargo_nivel', label: 'Cargo & Nível', width: '30%' },
    { id: 'atual_dept', label: 'Departamento Atual', width: '30%' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 700, mb: 1 }}>
          Gestão de Membros
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Selecione colaboradores para <b>Adicionar</b> a este departamento ou <b>Transferir</b> para outro.
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
        headerCheckboxColor={isSelectionFromCurrentDept ? '#0288d1' : CHECKBOX_GREEN}
        filters={
          <TableToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Buscar por nome, e-mail, cargo..."
          >
            {selectedIds.length > 0 && (
                <Button 
                    variant="contained"
                    color={isSelectionFromCurrentDept ? "info" : "primary"}
                    startIcon={isSelectionFromCurrentDept ? <SwapHorizIcon /> : <PersonAddIcon />}
                    onClick={handleActionClick}
                    disabled={isSelectionMixed}
                    title={isSelectionMixed ? "Você não pode misturar colaboradores do departamento atual com outros." : ""}
                    sx={{ mr: 2, fontWeight: 'bold' }}
                >
                    {isSelectionFromCurrentDept 
                        ? `Transferir (${selectedIds.length})` 
                        : `Adicionar (${selectedIds.length})`
                    }
                </Button>
            )}
            <TextField
              select
              size="small"
              value={filterDept}
              onChange={(e) => handleChangeFilter(e.target.value)}
              sx={{ minWidth: '220px' }}
            >
              <MenuItem value="todos">Todos Departamentos</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                    {dept.id === props.currentDepartmentId ? `${dept.name} (Atual)` : dept.name}
                </MenuItem>
              ))}
            </TextField>
          </TableToolbar>
        }
        renderRow={(row, isSelected, toggleSelect) => {
          const currentEmployeeDept = effectiveDepartmentMap.get(row.id);
          const isRowFromCurrentDept = currentEmployeeDept === props.currentDepartmentId;
          
          let isDisabled = false;
          if (selectedIds.length > 0 && !selectedIds.includes(row.id)) {
            const isFirstSelectionFromCurrent = effectiveDepartmentMap.get(selectedIds[0]) === props.currentDepartmentId;
            if (isFirstSelectionFromCurrent !== isRowFromCurrentDept) {
               isDisabled = true;
            }
          }

          return (
            <TableRow 
                key={row.id} 
                hover 
                onClick={() => !isDisabled && toggleSelect()} 
                selected={isSelected}
                sx={{ 
                    cursor: isDisabled ? 'not-allowed' : 'pointer', 
                    opacity: isDisabled ? 0.5 : 1,
                    bgcolor: isSelected 
                      ? (isSelectionFromCurrentDept ? 'rgba(2, 136, 209, 0.08) !important' : 'rgba(34, 197, 94, 0.08) !important') 
                      : 'inherit'
                }}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isSelected}
                  disabled={isDisabled}
                  sx={{ '&.Mui-checked': { color: isSelectionFromCurrentDept ? '#0288d1' : CHECKBOX_GREEN } }}
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
                     bgcolor: currentEmployeeDept ? 'rgba(145, 158, 171, 0.12)' : 'transparent',
                     px: 1, py: 0.5, borderRadius: 1,
                     color: isRowFromCurrentDept ? 'primary.main' : (currentEmployeeDept ? 'text.primary' : 'text.disabled'),
                     fontWeight: isRowFromCurrentDept ? 700 : 400,
                 }}>
                    {deptNameMap[currentEmployeeDept || ''] || 'Sem departamento'}
                 </Typography>
              </TableCell>
            </TableRow>
          );
        }}
      />

      <Dialog open={isTransferDialogOpen} onClose={() => setIsTransferDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Transferir Colaboradores</DialogTitle>
        <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
                Selecione o novo departamento para os <b>{selectedIds.length}</b> colaboradores.
            </DialogContentText>
            <FormControl fullWidth size="small">
                <InputLabel>Novo Departamento</InputLabel>
                <Select
                    value={targetTransferDept}
                    label="Novo Departamento"
                    onChange={(e) => setTargetTransferDept(e.target.value)}
                >
                    {departments
                        .filter(d => d.id !== props.currentDepartmentId)
                        .map(d => (
                            <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setIsTransferDialogOpen(false)} color="inherit">Cancelar</Button>
            <Button onClick={handleConfirmTransfer} variant="contained" color="info" disabled={!targetTransferDept}>
                Transferir
            </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>Adicionar ao Departamento</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Deseja mover os <b>{selectedIds.length}</b> colaboradores para este departamento?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setIsAddDialogOpen(false)} color="inherit">Cancelar</Button>
            <Button onClick={handleConfirmAdd} variant="contained" color="primary">
                Adicionar
            </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};