import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Import local functions
import SteamApp from './steam/app';
import GfnApp from './gfn/app';
import GfnCron from './gfn/cron';

admin.initializeApp();

// Allows a user to login to Firebase using Steam
exports.steam = functions.https.onRequest(SteamApp);

// Direct all gfn API calls to this cloud function
exports.gfn = functions.https.onRequest(GfnApp);

// *  *  *  *  *
// MM hh dd mm N
// N = day of week)
// * = any value
// , = value list separator
// - = range of values
// / = step values
//exports.onCacheGfnGames = functions.pubsub.schedule('00 05,17 * * *').timeZone('America/Vancouver').onRun(GfnCron);
exports.onCacheGfnGames = functions.https.onRequest(GfnCron);
