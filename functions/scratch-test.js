const admin = require('firebase-admin');

// Initialize admin app without credential, assuming we use GOOGLE_APPLICATION_CREDENTIALS or it works if we're authenticated via gcloud locally, but firebase-admin usually needs credentials if not on GCP.
// Wait, actually, let's use the project's own firebaseInit if possible, or just standard admin.initializeApp.
// It's safer to use npx firebase-tools to create a document, or write a script that runs via npx firebase-tools.

// Actually we can just run `firebase firestore:query`? No.
// Let's just create a test document using a quick script. Wait, `firebase-admin` is installed. I will need the service account or use application default credentials.
// Or I can use `firebase firestore:set` command? Oh wait, firebase CLI doesn't have a simple set document command unless I pass data. Wait, let's check `firebase help`.
// Let's just create a JS script and run it with `export GOOGLE_APPLICATION_CREDENTIALS=...` but I don't know the path.
// If the user's environment is set up, `admin.initializeApp({ projectId: 'reerp-b806b' })` might work with local default credentials.
admin.initializeApp({ projectId: 'reerp-b806b' });

async function run() {
  const db = admin.firestore();
  console.log('Creating TEST-BLOCK in Firestore...');
  const blockRef = db.collection('blocks').doc('TEST-BLOCK');
  await blockRef.set({
    name: 'Test Block',
    projectId: 'TEST-PROJECT',
    layoutId: 'TEST-LAYOUT',
    companyId: 'TEST-COMPANY'
  });
  console.log('Document created!');
}

run().catch(console.error);
