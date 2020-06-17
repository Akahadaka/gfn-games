import { of, fromEventPattern } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';

import { db } from '@/firebase';

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

export interface Game {
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

export interface ResponseError {
  error: boolean;
  message: string;
}

class GfnService {
  /**
   * Helper function to convert Firestore data into an Observable
   * @param query
   */
  private _getData$(
    query: firebase.firestore.Query<firebase.firestore.DocumentData>,
  ): Observable<Game[]> {
    return fromEventPattern(
      (handler) => query.onSnapshot(handler),
      (handler, unsubscribe) => unsubscribe(),
    ).pipe(map((data: any) => data.docs.map((doc: any) => doc.data() as Game)));
  }

  get games$(): Observable<Game[] | ResponseError> {
    const query = db.collection('gfn');

    return this._getData$(query).pipe(
      catchError((err: Error) => {
        // Network or other error, handle appropriately
        console.error(err);
        return of({ error: true, message: err.message });
      }),
    );
  }
}

export default new GfnService();
