// backend/firebase.js
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json'); // Replace with your service account file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.firestore = admin.firestore(); // Or exports.db = admin.firestore()
