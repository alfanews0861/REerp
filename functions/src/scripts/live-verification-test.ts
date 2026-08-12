import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const serviceAccountPath = path.resolve(__dirname, '../../serviceAccountKey.json');
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

  console.log('Project ID:', admin.app().options.projectId);
  const db = admin.firestore();
  console.log('Firestore initialized');
  // test a read
  const snapshot = await db.collection('companies').limit(1).get();
  console.log('Found companies:', snapshot.size);
}

main().catch(console.error);
