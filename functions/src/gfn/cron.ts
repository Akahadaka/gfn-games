import * as admin from 'firebase-admin';

import { getAllGames } from './api';

// Connect to Firestore and run the query
const afs: FirebaseFirestore.Firestore = admin.firestore();
const gfnRef: FirebaseFirestore.CollectionReference = afs.collection('gfn');

const GfnCron = async (request?: any, response?: any) => {
  const games = await getAllGames();
};

export default GfnCron;
