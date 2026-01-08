const admin = require('firebase-admin');

// Initialize Firebase Admin
// For development, we'll use the web API key verification method
// In production, you should use a service account
if (!admin.apps.length) {
    admin.initializeApp({
        projectId: 'nextoffer-8f799',
    });
}

const auth = admin.auth();

module.exports = { admin, auth };
