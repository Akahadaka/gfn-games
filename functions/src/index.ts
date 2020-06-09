import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Import local functions
import SteamApp from './steam/app';

admin.initializeApp();

// Allows a user to login to Firebase using Steam
exports.steam = functions.https.onRequest(SteamApp);
