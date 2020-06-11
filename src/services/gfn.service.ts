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
  appid?: number;
  title: string;
  isFullyOptimized: boolean;
  isHighlightsSupported: boolean;
  steamUrl: string;
  publisher: string;
  genres: Genre[];
  status: string;
  source: 'GFN';
}

export interface ResponseError {
  error: boolean;
  message: string;
}

class GfnService {
  get games$(): Observable<Game[] | ResponseError> {
    const url: string =
      'https://static.nvidiagrid.net/supported-public-game-list/gfnpc.json?JSON';

    return fromFetch(url).pipe(
      switchMap((response: Response) => {
        if (!response.ok) {
          // Server is returning a status requiring the client to try something else.
          return of({ error: true, message: `Error ${response.status}` });
        }
        return response.json();
      }),
      // Add source to the game model
      map((games: Game[]) => {
        return games.map((game: Game) => {
          return {
            ...game,
            appid: game.steamUrl
              ? Number(game.steamUrl.split('/').pop())
              : null,
            source: 'GFN',
          } as Game;
        });
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
