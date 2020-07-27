import * as admin from 'firebase-admin';

import { getAllGames, getAppGames } from './api';

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

export enum AppStore {
  steam = 2,
  uplay = 3,
  nvidia = 4,
  origin = 5,
  epic = 9,
  none = 11,
}

interface Game {
  id: number;
  title: string;
  sortName: string;
  shortName: string;
  shortDescription: string;
  appStore: number;
  store: string;
  steamUrl?: string;
  steamAppId?: number;
  publisher: string;
  genres: Genre[];
  keywords: string[];
  status: string;
  source: 'GFN';
  free?: boolean;
  created: Date | null;
  updated: Date;
  isFullyOptimized: boolean;
  isAnselSupported: boolean;
  isFreeStyleSupported: boolean;
  isHighlightsSupported: boolean;
}

// Connect to Firestore and run the query
const afs: FirebaseFirestore.Firestore = admin.firestore();
const gfnRef: FirebaseFirestore.CollectionReference = afs.collection('gfn');

const GfnCron = async (request?: any, response?: any): Promise<void> => {
  // We can only batch write a max of 500 lines at a time
  const maxBatchSize: number = 500;
  // TODO Determine what the real object is here so we don't stringify just to parse again
  const games: Game[] = JSON.parse(JSON.stringify(await getAppGames()));
  const gamesMeta: Game[] = JSON.parse(JSON.stringify(await getAllGames()));

  // Make sure we have data
  if (!games.length) {
    return Promise.reject();
  }

  // Before we begin, set all games to ARCHIVED
  return gfnRef
    .get()
    .then(async (data) => {
      let date: Date;
      let batch = afs.batch();
      let count = 1;

      if (data) {
        data.forEach((game) => {
          const gameRef: FirebaseFirestore.DocumentReference = gfnRef.doc(
            game.id.toString(),
          );
          let updatedValues: Partial<Game> = { status: 'ARCHIVED' };
          // Temporarily reset the updated date
          // updatedValues = {
          //   ...updatedValues,
          //   created: new Date(2020, 4, 31, 1, 0, 0, 0),
          // };

          // Set created for new games
          if (!game.data().created) {
            updatedValues = {
              ...updatedValues,
              created: game.data().updated,
            };
          }
          // Reset created for archived games, in case they come back
          if (game.data().status === 'ARCHIVED') {
            updatedValues = {
              ...updatedValues,
              created: null,
            };
          }
          batch.update(gameRef, updatedValues);

          // Batches have a write limit
          if (++count >= maxBatchSize) {
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
        // Waiting for the batch to finish before we update the records again
        await batch.commit().catch((err) => {
          // Query not successful
          console.log(err);
          return err;
        });
      }

      // Start updating data
      // Start a new batch
      date = new Date();
      batch = afs.batch();
      count = 1;

      console.log('Found data for', games.length, 'games');
      console.log('Found metadata for', gamesMeta.length, 'games');
      console.log('Starting new write batch');

      games.forEach((game: Game) => {
        const gameRef: FirebaseFirestore.DocumentReference = gfnRef.doc(
          game.id.toString(),
        );

        // Add metadata
        let gameClone: Partial<Game> = game;
        const metaData: Partial<Game> = gamesMeta.find(
          (gameMeta: Game) => gameMeta.id === game.id,
        ) as Partial<Game>;

        gameClone = {
          ...game,
          ...metaData,
        };

        // Only modify Free To Play if we are certain
        // This can also be set manually for some MMORPGs, etc
        if (game.genres.includes('Free To Play')) {
          gameClone = {
            ...gameClone,
            free: true,
          };
        }

        if (game.steamUrl) {
          // Manually set the Steam App ID if available
          gameClone = {
            ...gameClone,
            steamAppId: Number(game.steamUrl.split('/').pop()),
          };
        }

        // Create or update the record with "set, merge"
        batch.set(
          gameRef,
          {
            ...gameClone,
            store:
              metaData.store?.toLocaleLowerCase() ||
              AppStore[game.appStore] ||
              'unknown',
            source: 'GFN',
            status: game.status || 'AVAILABLE',
            updated: date,
          },
          { merge: true },
        );

        // Batches have a write limit
        if (++count >= maxBatchSize) {
          console.log('Committing batch count of', count);
          batch.commit().catch((err) => {
            // Query not successful
            console.log(err);
            return err;
          });
          // Start a new batch
          date = new Date();
          batch = afs.batch();
          count = 1;

          console.log('Starting new write batch');
        }
      });

      // Commit any of the remainder
      batch.commit().catch((err) => {
        // Query not successful
        console.log(err);
        return err;
      });

      console.log('Committing batch count of', count);

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
