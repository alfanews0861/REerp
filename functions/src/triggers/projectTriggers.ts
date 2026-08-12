import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

export const handleProjectCreated = async (event: any) => {
    const data = event.data?.data();
    if (!data) return;
    console.log(`New Project Created: ${data.name} (${event.params.projectId})`);
    
    // Log to AuditLogs or send notifications
    await admin.firestore().collection('audit_logs').add({
      action: 'PROJECT_CREATED',
      entityId: event.params.projectId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: { projectName: data.name }
    });
};

export const onProjectCreated = onDocumentCreated(
  {
    document: 'projects/{projectId}',
    region: 'asia-south1'
  },
  handleProjectCreated
);


export const handleLayoutCreated = async (event: any) => {
    const data = event.data?.data();
    if (!data) return;
    console.log(`New Layout Created: ${data.name} (${event.params.layoutId})`);
    
    await admin.firestore().collection('audit_logs').add({
      action: 'LAYOUT_CREATED',
      entityId: event.params.layoutId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: { layoutName: data.name, projectId: data.projectId }
    });
};

export const onLayoutCreated = onDocumentCreated(
  {
    document: 'layouts/{layoutId}',
    region: 'asia-south1'
  },
  handleLayoutCreated
);


export const handleBlockCreated = async (event: any) => {
    const data = event.data?.data();
    if (!data) return;
    console.log(`New Block Created: ${data.name} (${event.params.blockId})`);
    
    await admin.firestore().collection('audit_logs').add({
      action: 'BLOCK_CREATED',
      entityId: event.params.blockId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: { blockName: data.name, layoutId: data.layoutId }
    });
};

export const onBlockCreated = onDocumentCreated(
  {
    document: 'blocks/{blockId}',
    region: 'asia-south1'
  },
  handleBlockCreated
);


export const handlePlotCreated = async (event: any) => {
    const data = event.data?.data();
    if (!data) return;
    console.log(`New Plot Created: ${data.plotNumber} (${event.params.plotId})`);
    
    await admin.firestore().collection('audit_logs').add({
      action: 'PLOT_CREATED',
      entityId: event.params.plotId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: { plotNumber: data.plotNumber, blockId: data.blockId }
    });
};

export const onPlotCreated = onDocumentCreated(
  {
    document: 'plots/{plotId}',
    region: 'asia-south1'
  },
  handlePlotCreated
);


export const handlePlotPriceChanged = async (event: any) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after) return;

    if (before.price !== after.price) {
      console.log(`Plot ${event.params.plotId} price changed from ${before.price} to ${after.price}`);
      
      await admin.firestore().collection('audit_logs').add({
        action: 'PLOT_PRICE_CHANGED',
        entityId: event.params.plotId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        details: { oldPrice: before.price, newPrice: after.price }
      });
    }
};

export const onPlotPriceChanged = onDocumentUpdated(
  {
    document: 'plots/{plotId}',
    region: 'asia-south1'
  },
  handlePlotPriceChanged
);

