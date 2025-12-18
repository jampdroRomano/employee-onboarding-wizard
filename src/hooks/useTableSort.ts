import { useState, useMemo } from 'react';

type Order = 'asc' | 'desc' | false;

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<T>(
  order: Exclude<Order, false>, 
  orderBy: keyof T,
): (a: T, b: T) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export const useTableSort = <T>(initialData: T[]) => {
  const [order, setOrder] = useState<Order>(false);
  const [orderBy, setOrderBy] = useState<keyof T | false>(false);

  const handleRequestSort = (property: keyof T) => {
    if (orderBy === property) {
      if (order === 'asc') {
        setOrder('desc');
      } else if (order === 'desc') {
        setOrder(false);
        setOrderBy(false);
      }
    } else {
      setOrder('asc');
      setOrderBy(property);
    }
  };

  const sortedData = useMemo(() => {
    if (orderBy === false || order === false) {
        return initialData;
    }
    return [...initialData].sort(getComparator(order, orderBy));
  }, [initialData, order, orderBy]);

  return {
    sortOrder: order,
    sortOrderBy: orderBy,
    handleRequestSort,
    sortedData,
  };
};
