import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllEmployees } from '../services/employeeService';
import { departmentService } from '../services/departmentService';
import { usePagination } from './usePagination';
import { useTableSort } from './useTableSort';
import type { Employee, Department } from '../types';

interface EmployeeChange {
  employeeId: string;
  newDepartmentId: string | null;
}

interface UseDepartmentMemberManagementProps {
  currentDepartmentId: string;
  initialEmployeeChanges?: EmployeeChange[];
  onEmployeeChanges: (changes: EmployeeChange[]) => void;
}

export const useDepartmentMemberManagement = ({
  currentDepartmentId,
  initialEmployeeChanges = [],
  onEmployeeChanges,
}: UseDepartmentMemberManagementProps) => {
  const [rows, setRows] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState(currentDepartmentId);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [localEmployeeChanges, setLocalEmployeeChanges] = useState<EmployeeChange[]>(initialEmployeeChanges);

  const effectiveDepartmentMap = useMemo(() => {
    const map = new Map<string, string | null>();
    rows.forEach(emp => map.set(emp.id, emp.departamento || null));
    localEmployeeChanges.forEach(change => {
      map.set(change.employeeId, change.newDepartmentId);
    });
    return map;
  }, [rows, localEmployeeChanges]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [empData, deptData] = await Promise.all([
          getAllEmployees(),
          departmentService.getAll(),
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

  useEffect(() => {
    onEmployeeChanges(localEmployeeChanges);
  }, [localEmployeeChanges, onEmployeeChanges]);

  const deptNameMap = useMemo(() => {
    return departments.reduce((acc, d) => ({ ...acc, [d.id]: d.name }), {} as Record<string, string>);
  }, [departments]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const s = searchTerm.toLowerCase();
      const currentEmployeeDept = effectiveDepartmentMap.get(row.id);
      const matchText = row.nome.toLowerCase().includes(s) ||
                        row.email.toLowerCase().includes(s) ||
                        (row.role && row.role.toLowerCase().includes(s)) ||
                        (row.seniority && row.seniority.toLowerCase().includes(s));
      const matchDept = filterDept === 'todos' ? true :
                        !currentEmployeeDept ? false : 
                        currentEmployeeDept === filterDept;
      return matchText && matchDept;
    });
  }, [rows, searchTerm, filterDept, effectiveDepartmentMap]);

  const {
    sortOrder,
    sortOrderBy,
    handleRequestSort,
    sortedData,
  } = useTableSort(filteredRows);

  const {
    paginatedData,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    count,
  } = usePagination(sortedData);

  const isSelectionFromCurrentDept = useMemo(() => {
    if (selectedIds.length === 0) return false;
    const firstEmployeeDept = effectiveDepartmentMap.get(selectedIds[0]);
    return firstEmployeeDept === currentDepartmentId;
  }, [selectedIds, currentDepartmentId, effectiveDepartmentMap]);

  const isSelectionMixed = useMemo(() => {
    if (selectedIds.length < 2) return false;
    const firstGroup = effectiveDepartmentMap.get(selectedIds[0]) === currentDepartmentId;
    return selectedIds.slice(1).some(id => (effectiveDepartmentMap.get(id) === currentDepartmentId) !== firstGroup);
  }, [selectedIds, currentDepartmentId, effectiveDepartmentMap]);

  const handleChangeFilter = useCallback((newFilter: string) => {
    if (isSelectionFromCurrentDept) {
      setSelectedIds([]);
    }
    setFilterDept(newFilter);
  }, [isSelectionFromCurrentDept]);

  const handleSelectAllToggle = useCallback(() => {
    const allFilteredIds = filteredRows.map(row => row.id);
    const selectableIds = filterDept === 'todos'
      ? allFilteredIds.filter(id => effectiveDepartmentMap.get(id) !== currentDepartmentId)
      : allFilteredIds;

    const allSelectableAreSelected = selectableIds.length > 0 && selectableIds.every(id => selectedIds.includes(id));

    if (allSelectableAreSelected) {
      setSelectedIds(prev => prev.filter(id => !selectableIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...selectableIds])]);
    }
  }, [filteredRows, selectedIds, filterDept, currentDepartmentId, effectiveDepartmentMap]);

  // --- Lógica de Seleção Aprimorada ---
  const { isSelectAllChecked, isSelectAllIndeterminate } = useMemo(() => {
      const allFilteredIds = filteredRows.map(r => r.id);
      const selectableIds = filterDept === 'todos'
          ? allFilteredIds.filter(id => effectiveDepartmentMap.get(id) !== currentDepartmentId)
          : allFilteredIds;
      
      const selectedInScope = selectedIds.filter(id => selectableIds.includes(id));

      return {
          isSelectAllChecked: selectableIds.length > 0 && selectedInScope.length === selectableIds.length,
          isSelectAllIndeterminate: selectedInScope.length > 0 && selectedInScope.length < selectableIds.length,
      };
  }, [selectedIds, filteredRows, filterDept, currentDepartmentId, effectiveDepartmentMap]);

  const handleRowToggle = useCallback((id: string) => {
    const newSelectedIds = [...selectedIds];
    const currentIndex = selectedIds.indexOf(id);
    
    if (currentIndex === -1) {
      newSelectedIds.push(id);
    } else {
      newSelectedIds.splice(currentIndex, 1);
    }
    setSelectedIds(newSelectedIds);
  }, [selectedIds]);

  const applyChanges = (employeeIds: string[], newDeptId: string | null) => {
    setLocalEmployeeChanges(prevChanges => {
      const updatedChanges = [...prevChanges];
      employeeIds.forEach(empId => {
        const existingIndex = updatedChanges.findIndex(c => c.employeeId === empId);
        if (existingIndex > -1) {
          updatedChanges[existingIndex].newDepartmentId = newDeptId;
        } else {
          updatedChanges.push({ employeeId: empId, newDepartmentId: newDeptId });
        }
      });
      return updatedChanges.filter(change => {
        const originalDept = rows.find(r => r.id === change.employeeId)?.departamento || null;
        return originalDept !== change.newDepartmentId;
      });
    });
  };

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  return {
    loading,
    rows: paginatedData,
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
    page,
    rowsPerPage,
    count,
    handleChangePage,
    handleChangeRowsPerPage,
    sortOrder,
    sortOrderBy,
    handleRequestSort,
  };
};
