import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// This should be initialised before importing any possible dependants
admin.initializeApp();

// Import local functions
import SteamApp from './steam/app';
import GfnApp from './gfn/app';
import GfnCron from './gfn/cron';

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
exports.onCacheGfnGames = functions.pubsub
  .schedule('0 */6 * * *')
  .timeZone('America/Vancouver')
  .onRun(GfnCron);

// Temporarily allow running the cron manually
exports.cacheGfnGames = functions.https.onRequest(GfnCron);
