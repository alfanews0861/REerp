import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { DataTable, Column, StatusChip } from '@real-estate-erp/ui';
import { Lead } from '@real-estate-erp/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { setSelectedLeadId } from '../../../../store/leadsSlice';

interface LeadsGridProps {
  leads: Lead[];
  selected: string[];
  onSelectChange: (selected: string[]) => void;
}

export const LeadsGrid: React.FC<LeadsGridProps> = ({ leads, selected, onSelectChange }) => {
  const dispatch = useDispatch();
  const { hiddenColumns } = useSelector((state: RootState) => state.leads);

  const columns: Column<Lead>[] = useMemo(() => [
    {
      id: 'fullName',
      label: 'Name',
      minWidth: 150,
      format: (value: string, row: Lead) => (
        <Box 
          sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 500 }}
          onClick={() => dispatch(setSelectedLeadId(row.id))}
        >
          {value}
        </Box>
      )
    },
    { id: 'phone', label: 'Phone', minWidth: 120 },
    { id: 'email', label: 'Email', minWidth: 150 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 150,
      format: (value: string) => <StatusChip status={value} />
    },
    { id: 'source', label: 'Source', minWidth: 120 },
    { id: 'city', label: 'City', minWidth: 100 },
    { 
      id: 'createdAt', 
      label: 'Created', 
      minWidth: 120,
      format: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      id: 'aiIntentScore', 
      label: 'Intent', 
      minWidth: 80,
      format: (value: number) => (
        <Typography color={value > 75 ? 'success.main' : value > 40 ? 'warning.main' : 'error.main'}>
          {value}
        </Typography>
      )
    },
  ], [dispatch]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectChange(leads.map(l => l.id));
    } else {
      onSelectChange([]);
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter(s => s !== id)
      : [...selected, id];
    onSelectChange(newSelected);
  };

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <DataTable
        columns={columns}
        data={leads}
        keyField="id"
        hiddenColumns={hiddenColumns}
        virtualScroll
        rowHeight={55}
        resizableColumns
        selected={selected}
        onSelectAllClick={handleSelectAll}
        onSelectClick={handleSelectOne}
      />
    </Box>
  );
};
