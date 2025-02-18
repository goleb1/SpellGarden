const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin with service account if not already initialized
if (!admin.apps.length) {
  const serviceAccount = require(path.join(__dirname, '..', 'serviceAccountKey.json'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const updateSecurityRules = async () => {
  try {
    // The rules to apply
    const rules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles - users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Game states - users can read/write their own game states
    match /gameStates/{gameId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Default rule - deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`;

    // Update the rules
    await admin.securityRules().updateDocument(
      'firestore.rules',
      rules
    );

    console.log('Successfully updated security rules!');
    console.log('\nNew rules:');
    console.log(rules);
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating security rules:', error);
    process.exit(1);
  }
};

updateSecurityRules(); 