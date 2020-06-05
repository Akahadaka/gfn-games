import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { fromFetch } from 'rxjs/fetch';
import {
  tap,
  map,
  switchMap,
  catchError,
  concatAll,
  flatMap,
} from 'rxjs/operators';

import data from './gfn.data.json';

const genres = [
  'Action',
  'Adventure',
  'Arcade',
  'Casual',
  'Family',
  'First-Person Shooter',
  'Free To Play',
  'Indie',
  'Massively Multiplayer Online',
  'Multiplayer Online Battle Arena',
  'Platformer',
  'Puzzle',
  'Racing',
  'Role Playing',
  'Simulation',
  'Sports',
  'Strategy',
  'Tech Demo',
];

export type Genre = typeof genres;

export interface Game {
  id: number;
  title: string;
  isFullyOptimized: boolean;
  isHighlightsSupported: boolean;
  steamUrl: string;
  publisher: string;
  genres: Genre[];
  status: string;
}

export interface ResponseError {
  error: boolean;
  message: string;
}

class GfnService {
  get staticGames$(): Observable<Game[]> {
    return of(data).pipe(
      tap(console.log),
    );
  }

  get games$(): Observable<Game[] | ResponseError> {
    const url: string = 'https://static.nvidiagrid.net/supported-public-game-list/gfnpc.json?JSON';

    return fromFetch(url).pipe(
      switchMap((response: Response) => {
        if (!response.ok) {
          // Server is returning a status requiring the client to try something else.
          return of({ error: true, message: `Error ${response.status}` });
        }

        return response.json();
      }),
      catchError((err: Error) => {
        // Network or other error, handle appropriately
        console.error(err);
        return of({ error: true, message: err.message });
      }),
    );
  }
}

export default new GfnService();
