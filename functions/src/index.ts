import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Import local functions
import SteamApp from './steam/app';
import GfnApp from './gfn/app';

admin.initializeApp();

// Allows a user to login to Firebase using Steam
exports.steam = functions.https.onRequest(SteamApp);

// Direct all gfn API calls to this cloud function
exports.gfn = functions.https.onRequest(GfnApp);
