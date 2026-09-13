import React, { useRef, useState, useCallback, useMemo } from 'react';
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
  id: keyof T | string;
  label: string;
  minWidth?: number;
  width?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: T) => React.ReactNode;
  render?: (row: T, value?: any) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  page?: number;
  rowsPerPage?: number;
  totalRows?: number;
  onPageChange?: (event: unknown, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowsPerPageOptions?: number[];
  orderBy?: keyof T | string;
  order?: 'asc' | 'desc';
  onSort?: (property: keyof T | string) => void;
  selected?: string[];
  onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectClick?: (id: string) => void;
  keyField: keyof T | string;
  hiddenColumns?: string[];
  virtualScroll?: boolean;
  rowHeight?: number;
  resizableColumns?: boolean;
  maxHeight?: number | string;
  pagination?: boolean;
  emptyMessage?: string;
  loading?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  page,
  rowsPerPage = 20,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 20, 50, 100],
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
  maxHeight,
  pagination = true,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  // Internal pagination state for uncontrolled mode
  const [internalPage, setInternalPage] = useState(0);
  const [internalRowsPerPage, setInternalRowsPerPage] = useState(rowsPerPage || 20);

  const isControlled = onPageChange !== undefined;
  const activePage = isControlled ? (page ?? 0) : internalPage;
  const activeRowsPerPage = isControlled ? (rowsPerPage ?? 20) : internalRowsPerPage;
  const totalCount = totalRows !== undefined ? totalRows : data.length;

  const handlePageChange = (event: unknown, newPage: number) => {
    if (isControlled && onPageChange) {
      onPageChange(event, newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (isControlled && onRowsPerPageChange) {
      onRowsPerPageChange(event);
    } else {
      setInternalRowsPerPage(newRowsPerPage);
      setInternalPage(0);
    }
  };

  // If uncontrolled and not virtualized, slice data according to pagination
  const displayedData = useMemo(() => {
    if (virtualScroll || isControlled) {
      return data;
    }
    if (!pagination) {
      return data;
    }
    const start = activePage * activeRowsPerPage;
    return data.slice(start, start + activeRowsPerPage);
  }, [data, virtualScroll, isControlled, pagination, activePage, activeRowsPerPage]);
  
  const createSortHandler = (property: keyof T | string) => () => {
    if (onSort) onSort(property);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const visibleColumns = columns.filter(col => !hiddenColumns.includes(col.id as string));

  // Virtualization
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: displayedData.length,
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
    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none' }}>
      <TableContainer
        ref={tableContainerRef}
        sx={{
          maxHeight: virtualScroll ? 'calc(100vh - 300px)' : (maxHeight || undefined),
          overflowX: 'auto',
          overflowY: maxHeight ? 'auto' : 'visible',
        }}
      >
        <Table
          stickyHeader={Boolean(maxHeight || virtualScroll)}
          aria-label="data table"
          size="small"
          sx={{
            '& .MuiTableCell-root': {
              py: 1,
              px: 1.5,
              fontSize: '0.8125rem',
            },
            '& .MuiTableCell-head': {
              py: 1.2,
              px: 1.5,
              fontWeight: 700,
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              bgcolor: '#f8fafc',
              color: '#475569',
              borderBottom: '1px solid #e2e8f0',
            },
            '& .MuiTableRow-root:hover': {
              bgcolor: 'rgba(241, 245, 249, 0.6) !important',
            },
          }}
        >
          <TableHead>
            <TableRow>
              {onSelectAllClick && (
                <TableCell padding="checkbox" sx={{ width: 44, zIndex: 3 }}>
                  <Checkbox
                    size="small"
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < displayedData.length}
                    checked={displayedData.length > 0 && selected.length === displayedData.length}
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
            
            {(virtualScroll ? virtualRows : displayedData.map((_, i) => ({ index: i }))).map((vRow) => {
              const row = displayedData[vRow.index];
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
                        size="small"
                        color="primary"
                        checked={isItemSelected}
                        onChange={() => onSelectClick(row[keyField as string])}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.map((column) => {
                    const col = column as any;
                    const value = row[col.id];
                    let cellContent = value;
                    if (typeof col.render === 'function') {
                      cellContent = col.render(row, value);
                    } else if (typeof col.format === 'function') {
                      cellContent = col.format(value, row);
                    }
                    return (
                      <TableCell key={col.id as string} align={column.align}>
                        {cellContent}
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
            
            {!virtualScroll && displayedData.length === 0 && (
               <TableRow>
                 <TableCell colSpan={visibleColumns.length + (onSelectAllClick ? 1 : 0)} align="center" sx={{ py: 3, color: 'text.secondary', fontWeight: 500 }}>
                    {emptyMessage}
                 </TableCell>
               </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={totalCount}
          rowsPerPage={activeRowsPerPage}
          page={activePage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          sx={{
            borderTop: '1px solid #e2e8f0',
            '.MuiTablePagination-toolbar': {
              minHeight: 44,
              px: 1.5,
              fontSize: '0.8rem',
            },
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              fontSize: '0.8rem',
              mb: 0,
            },
          }}
        />
      )}
    </Paper>
  );
}
