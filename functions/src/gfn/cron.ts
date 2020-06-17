import * as admin from 'firebase-admin';

import { getAllGames } from './api';

export type Genre =
  | 'Action'
  | 'Adventure'
  | 'Arcade'
  | 'Casual'
  | 'Family'
  | 'First-Person Shooter'
  | 'Free To Play'
  | 'Indie'
  | 'Massively Multiplayer Online'
  | 'Multiplayer Online Battle Arena'
  | 'Platformer'
  | 'Puzzle'
  | 'Racing'
  | 'Role Playing'
  | 'Simulation'
  | 'Sports'
  | 'Strategy'
  | 'Tech Demo';

interface Game {
  id: number;
  title: string;
  isFullyOptimized: boolean;
  isHighlightsSupported: boolean;
  steamUrl: string;
  steamAppId: number;
  publisher: string;
  genres: Genre[];
  status: string;
  source: 'GFN';
  free?: boolean;
}

// Connect to Firestore and run the query
const afs: FirebaseFirestore.Firestore = admin.firestore();
const gfnRef: FirebaseFirestore.CollectionReference = afs.collection('gfn');

const GfnCron = async (request?: any, response?: any): Promise<string> => {
  // TODO Determine what the real object is here so we don't stringify just to parse again
  const games: Game[] = JSON.parse(JSON.stringify(await getAllGames()));

  // Make sure we have data
  if (!games.length) {
    return Promise.reject();
  }

  // Before we begin, set all games to ARCHIVED
  return gfnRef
    .get()
    .then((data) => {
      let batch = afs.batch();
      let count = 1;

      if (data) {
        data.forEach((game) => {
          const gameRef: FirebaseFirestore.DocumentReference = gfnRef.doc(
            game.id.toString(),
          );
          batch.update(gameRef, { status: 'ARCHIVED' });

          // We can only batch write a max of 500 lines at a time
          if (++count > 500) {
            batch.commit().catch((err) => {
              // Query not successful
              console.log(err);
              return err;
            });
            // Start a new batch
            batch = afs.batch();
            count = 1;
          }
        });

        // Commit any of the remainder
        batch.commit().catch((err) => {
          // Query not successful
          console.log(err);
          return err;
        });
      }

      // Start updating data
      // Start a new batch
      batch = afs.batch();
      count = 1;

      games.forEach((game: Game) => {
        const gameRef: FirebaseFirestore.DocumentReference = gfnRef.doc(
          game.id.toString(),
        );

        // Only modify Free To Play if we are certain
        // This can also be set manually for some MMORPGs, etc
        let gameClone = game;
        if (game.genres.includes('Free To Play')) {
          gameClone = {
            ...game,
            free: true,
          };
        }

        // Create or update the record with "set, merge"
        batch.set(
          gameRef,
          {
            ...gameClone,
            source: 'GFN',
            // Manually set the Steam App ID if available
            steamAppId: game.steamUrl
              ? Number(game.steamUrl.split('/').pop())
              : null,
            status: game.status === '' ? 'AVAILABLE' : game.status,
          },
          { merge: true },
        );

        // We can only batch write a max of 500 lines at a time
        if (++count > 500) {
          batch.commit().catch((err) => {
            // Query not successful
            console.log(err);
            return err;
          });
          // Start a new batch
          batch = afs.batch();
          count = 1;
        }
      });

      // Commit any of the remainder
      batch.commit().catch((err) => {
        // Query not successful
        console.log(err);
        return err;
      });

      if (response) {
        response.send('ok');
      }

      console.log('ok');
    })
    .catch((err) => {
      // Query not successful
      console.log(err);
      response.send(err);
      return err;
    });
};

export default GfnCron;
