import React from 'react';
import { Box, Typography } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Lead, LeadStatus } from '@real-estate-erp/types';
import { LeadCard } from './LeadCard';

interface LeadKanbanBoardProps {
  leads: Lead[];
  onStatusChange?: (leadId: string, newStatus: LeadStatus) => void;
}

const COLUMNS: { id: LeadStatus; title: string }[] = [
  { id: 'NEW', title: 'New' },
  { id: 'CONTACTED', title: 'Contacted' },
  { id: 'SITE_VISIT_SCHEDULED', title: 'Site Visit' },
  { id: 'NEGOTIATING', title: 'Negotiating' },
  { id: 'BOOKED', title: 'Booked' },
];

export const LeadKanbanBoard: React.FC<LeadKanbanBoardProps> = ({ leads, onStatusChange }) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      if (onStatusChange) {
        onStatusChange(draggableId, destination.droppableId as LeadStatus);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box sx={{ display: 'flex', height: '100%', overflowX: 'auto', p: 2, gap: 2, bgcolor: 'background.default' }}>
        {COLUMNS.map(col => {
          const colLeads = leads.filter(l => l.status === col.id);
          return (
            <Box key={col.id} sx={{ minWidth: 300, width: 300, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>{col.title} ({colLeads.length})</Typography>
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      flex: 1,
                      p: 1,
                      bgcolor: snapshot.isDraggingOver ? 'action.hover' : 'background.paper',
                      borderRadius: 1,
                      overflowY: 'auto'
                    }}
                  >
                    {colLeads.map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ mb: 2, ...provided.draggableProps.style }}
                          >
                            <LeadCard lead={lead} isDragging={snapshot.isDragging} />
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          );
        })}
      </Box>
    </DragDropContext>
  );
};
