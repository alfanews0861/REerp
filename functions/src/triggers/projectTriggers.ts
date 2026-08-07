import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onProjectCreated = functions.firestore
  .document('projects/{projectId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    console.log(`New Project Created: ${data.name} (${context.params.projectId})`);
    
    // Log to AuditLogs or send notifications
    await admin.firestore().collection('audit_logs').add({
      action: 'PROJECT_CREATED',
      entityId: context.params.projectId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: { projectName: data.name }
    });
  });

export const onLayoutCreated = functions.firestore
  .document('layouts/{layoutId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    console.log(`New Layout Created: ${data.name} (${context.params.layoutId})`);
    
    await admin.firestore().collection('audit_logs').add({
      action: 'LAYOUT_CREATED',
      entityId: context.params.layoutId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: { layoutName: data.name, projectId: data.projectId }
    });
  });

export const onBlockCreated = functions.firestore
  .document('blocks/{blockId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    console.log(`New Block Created: ${data.name} (${context.params.blockId})`);
    
    await admin.firestore().collection('audit_logs').add({
      action: 'BLOCK_CREATED',
      entityId: context.params.blockId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: { blockName: data.name, layoutId: data.layoutId }
    });
  });

export const onPlotCreated = functions.firestore
  .document('plots/{plotId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    console.log(`New Plot Created: ${data.plotNumber} (${context.params.plotId})`);
    
    await admin.firestore().collection('audit_logs').add({
      action: 'PLOT_CREATED',
      entityId: context.params.plotId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: { plotNumber: data.plotNumber, blockId: data.blockId }
    });
  });

export const onPlotPriceChanged = functions.firestore
  .document('plots/{plotId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.price !== after.price) {
      console.log(`Plot ${context.params.plotId} price changed from ${before.price} to ${after.price}`);
      
      await admin.firestore().collection('audit_logs').add({
        action: 'PLOT_PRICE_CHANGED',
        entityId: context.params.plotId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        details: { oldPrice: before.price, newPrice: after.price }
      });
    }
  });
