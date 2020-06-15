import { of, Subject, BehaviorSubject, throwError, combineLatest } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { fromFetch } from 'rxjs/fetch';
import {
  tap,
  map,
  switchMap,
  catchError,
  concatAll,
  flatMap,
  filter,
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
  private filter$: Subject<number[]> = new BehaviorSubject<number[]>([]);
  private gamesList: Game[] = [];
  private steamUser: string = '';

  private readonly APIURL =
    'https://us-central1-gfn-games.cloudfunctions.net/steam';

  set steamid(id: string) {
    this.steamid$.next(id);
  }

  set filter(ids: number[]) {
    this.filter$.next(ids);
  }

  get games$(): Observable<Game[]> {
    // First make sure we have a SteamID available
    // then switch to the real observable we're interestes in
    return combineLatest(this.steamid$, this.filter$).pipe(
      switchMap(([id, matches]) => {
        // Fake out if no ID present
        if (!id) {
          return of([]);
        }

        if (!this.gamesList.length || id != this.steamUser) {
          return this.fetchGames$(id);
        }

        return of(this.gamesList).pipe(
          map((data) => {
            return data.filter(
              (game: Game) => !matches.length || matches.includes(game.appid),
            );
          }),
        );
      }),
    );
  }

  private fetchGames$(id: string): Observable<Game[]> {
    const url: string = `${this.APIURL}/profile/${id}/GetOwnedGames`;
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
      tap((games: Game[]) => {
        this.gamesList = games;
        this.steamUser = id;
      }),
      catchError((err: Error) => {
        // Network or other error, handle appropriately
        console.error(err);
        return of([]);
      }),
    );
  }
}

export default new SteamService();
