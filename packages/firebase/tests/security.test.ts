import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { assertFails, assertSucceeds, initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as net from 'net';

async function checkEmulator(port = 8080, host = '127.0.0.1'): Promise<boolean> {
  return new Promise((res) => {
    const socket = new net.Socket();
    socket.setTimeout(300);
    socket.on('connect', () => {
      socket.destroy();
      res(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      res(false);
    });
    socket.on('error', () => {
      res(false);
    });
    socket.connect(port, host);
  });
}

const isEmulatorAvailable = await checkEmulator();

let testEnv: RulesTestEnvironment;

describe.skipIf(!isEmulatorAvailable)('Firestore Security Rules: Documents, Notifications, After-Sales', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'real-estate-erp-test',
      firestore: {
        host: '127.0.0.1',
        port: 8080,
        rules: readFileSync(resolve(__dirname, '../../../firestore.rules'), 'utf8'),
      },
    });
  });

  afterAll(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  beforeEach(async () => {
    if (testEnv) {
      await testEnv.clearFirestore();
    }
  });

  it('Customer A cannot read Customer B documents', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('documents').doc('docB').set({
        visibility: 'CUSTOMER_VISIBLE',
        entityId: 'customerB_id'
      });
    });

    const alice = testEnv.authenticatedContext('customerA_id');
    const docRef = alice.firestore().collection('documents').doc('docB');
    await assertFails(docRef.get());
  });

  it('Customer A can read their own CUSTOMER_VISIBLE documents', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('documents').doc('docA').set({
        visibility: 'CUSTOMER_VISIBLE',
        entityId: 'customerA_id'
      });
    });

    const alice = testEnv.authenticatedContext('customerA_id');
    const docRef = alice.firestore().collection('documents').doc('docA');
    await assertSucceeds(docRef.get());
  });

  it('Customer A cannot read their own MANAGEMENT_ONLY documents', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('documents').doc('docA_internal').set({
        visibility: 'MANAGEMENT_ONLY',
        entityId: 'customerA_id'
      });
    });

    const alice = testEnv.authenticatedContext('customerA_id');
    const docRef = alice.firestore().collection('documents').doc('docA_internal');
    await assertFails(docRef.get());
  });

  it('Customer A cannot read Customer B notifications', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('customer_notifications').doc('notifB').set({
        userId: 'customerB_id'
      });
    });

    const alice = testEnv.authenticatedContext('customerA_id');
    const docRef = alice.firestore().collection('customer_notifications').doc('notifB');
    await assertFails(docRef.get());
  });

  it('Customer A cannot read Customer B After-Sales cases', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('after_sales').doc('caseB').set({
        customerId: 'customerB_id'
      });
    });

    const alice = testEnv.authenticatedContext('customerA_id');
    const docRef = alice.firestore().collection('after_sales').doc('caseB');
    await assertFails(docRef.get());
  });
});
