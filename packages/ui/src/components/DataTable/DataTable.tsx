import React, { useRef, useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Checkbox,
  Box
} from '@mui/material';
import { useVirtualizer } from '@tanstack/react-virtual';

export interface Column<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  width?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  page?: number;
  rowsPerPage?: number;
  totalRows?: number;
  onPageChange?: (event: unknown, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  orderBy?: keyof T;
  order?: 'asc' | 'desc';
  onSort?: (property: keyof T) => void;
  selected?: string[];
  onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectClick?: (id: string) => void;
  keyField: keyof T;
  hiddenColumns?: string[];
  virtualScroll?: boolean;
  rowHeight?: number;
  resizableColumns?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  page = 0,
  rowsPerPage = 10,
  totalRows = 0,
  onPageChange,
  onRowsPerPageChange,
  orderBy,
  order = 'asc',
  onSort,
  selected = [],
  onSelectAllClick,
  onSelectClick,
  keyField,
  hiddenColumns = [],
  virtualScroll = false,
  rowHeight = 53,
  resizableColumns = false,
}: DataTableProps<T>) {
  
  const createSortHandler = (property: keyof T) => () => {
    if (onSort) onSort(property);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const visibleColumns = columns.filter(col => !hiddenColumns.includes(col.id as string));

  // Virtualization
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  // Column Resizing state
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  const handleResize = useCallback((colId: string, e: React.MouseEvent) => {
    if (!resizableColumns) return;
    
    const startX = e.clientX;
    const initialWidth = columnWidths[colId] || (e.target as HTMLElement).parentElement?.offsetWidth || 150;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(50, initialWidth + (moveEvent.clientX - startX));
      setColumnWidths(prev => ({ ...prev, [colId]: newWidth }));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [columnWidths, resizableColumns]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer ref={tableContainerRef} sx={{ maxHeight: virtualScroll ? 'calc(100vh - 300px)' : 440 }}>
        <Table stickyHeader aria-label="sticky table" size={virtualScroll ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              {onSelectAllClick && (
                <TableCell padding="checkbox" sx={{ width: 50, zIndex: 3 }}>
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < data.length}
                    checked={data.length > 0 && selected.length === data.length}
                    onChange={onSelectAllClick}
                  />
                </TableCell>
              )}
              {visibleColumns.map((column) => {
                const width = columnWidths[column.id as string] || column.width || column.minWidth;
                return (
                  <TableCell
                    key={column.id as string}
                    align={column.align}
                    style={{ minWidth: width, width: width, position: 'relative' }}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    {onSort ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={createSortHandler(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                    {resizableColumns && (
                      <Box
                        sx={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          bottom: 0,
                          width: 5,
                          cursor: 'col-resize',
                          zIndex: 4,
                          '&:hover': {
                            backgroundColor: 'primary.main',
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleResize(column.id as string, e);
                        }}
                      />
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {virtualScroll && virtualRows.length > 0 && (
              <TableRow style={{ height: `${virtualRows[0].start}px` }}>
                 <TableCell colSpan={visibleColumns.length + (onSelectAllClick ? 1 : 0)} style={{ padding: 0, border: 0 }} />
              </TableRow>
            )}
            
            {(virtualScroll ? virtualRows : data.map((_, i) => ({ index: i }))).map((vRow) => {
              const row = data[vRow.index];
              if (!row) return null;
              
              const isItemSelected = isSelected(row[keyField as string]);
              return (
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row[keyField as string] || vRow.index}
                  selected={isItemSelected}
                  style={virtualScroll ? { height: `${rowHeight}px` } : undefined}
                >
                  {onSelectClick && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={() => onSelectClick(row[keyField as string])}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id as string} align={column.align}>
                        {column.format ? column.format(value, row) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
            
            {virtualScroll && virtualRows.length > 0 && (
              <TableRow style={{ height: `${rowVirtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end}px` }}>
                 <TableCell colSpan={visibleColumns.length + (onSelectAllClick ? 1 : 0)} style={{ padding: 0, border: 0 }} />
              </TableRow>
            )}
            
            {!virtualScroll && data.length === 0 && (
               <TableRow>
                 <TableCell colSpan={visibleColumns.length + (onSelectAllClick ? 1 : 0)} align="center" sx={{ py: 3 }}>
                    No data available
                 </TableCell>
               </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {onPageChange && onRowsPerPageChange && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}
    </Paper>
  );
}
