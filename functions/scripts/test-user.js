const admin = require('firebase-admin');

admin.initializeApp();

async function testUserDelete() {
  const uid = 'TEST-USER-DELETE-001';
  
  try {
    // 1. Create the user
    console.log(`Creating test user: ${uid}...`);
    await admin.auth().createUser({
      uid: uid,
      email: 'test-user-delete-001@example.com',
      displayName: 'Test User Delete'
    });
    console.log(`Successfully created test user: ${uid}`);
    
    // Wait a couple of seconds to ensure Firestore profile is created by beforeUserCreated (if applicable)
    console.log('Waiting 5 seconds...');
    await new Promise(r => setTimeout(r, 5000));
    
    // 2. Delete the user
    console.log(`Deleting test user: ${uid}...`);
    await admin.auth().deleteUser(uid);
    console.log(`Successfully deleted test user: ${uid}. This should trigger onUserDeletedV2!`);
    
  } catch (error) {
    if (error.code === 'auth/uid-already-exists') {
      console.log('User already exists, deleting first...');
      await admin.auth().deleteUser(uid);
      testUserDelete();
    } else {
      console.error('Error during test:', error);
    }
  }
}

testUserDelete();
