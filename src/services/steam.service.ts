import { of, Subject, BehaviorSubject, throwError } from 'rxjs';
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

export interface Game {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  img_logo_url: string;
  has_community_visible_stats: boolean;
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
  source: 'Steam';
}

export interface ResponseError {
  error: boolean;
  message: string;
}

class SteamService {
  private steamid$: Subject<string> = new BehaviorSubject<string>('');

  set steamid(id: string) {
    this.steamid$.next(id);
  }

  get games$(): Observable<Game[] | ResponseError> {
    // First make sure we have a SteamID available
    // then switch to the real observable we're interestes in
    return this.steamid$.pipe(
      tap(console.log),
      switchMap((id: string) => {
        // Fake out if no ID present
        if (!id) {
          return of([]);
        }
        const url: string = `https://us-central1-gfn-games.cloudfunctions.net/steam/profile/${id}/GetOwnedGames`;
        return fromFetch(url).pipe(
          switchMap((response: Response) => {
            if (!response.ok) {
              // Server is returning a status requiring the client to try something else.
              return of({ error: true, message: `Error ${response.status}` });
            }

            return response.json();
          }),
          map((data) => {
            return data.response.games;
          }),
          // Add source to the game model
          map((games: Game[]) => {
            return games.map((game: Game) => {
              return { ...game, source: 'Steam' } as Game;
            });
          }),
          catchError((err: Error) => {
            // Network or other error, handle appropriately
            console.error(err);
            return of([]);
          }),
        );
      }),
    );
  }
}

export default new SteamService();