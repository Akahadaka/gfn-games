import { Observable } from 'rxjs/internal/Observable';
import { combineLatest, concat } from 'rxjs';

import gfnService from './gfn.service';
import steamService from './steam.service';
import { map, tap, flatMap, concatAll } from 'rxjs/operators';

export interface Game {
  id: number;
  appid: number;
  title: string;
  source: 'Steam' | 'GFN';
  match: boolean;
  steamUrl: string;
}

class GameService {
  get games$(): Observable<Game[]> {
    const gfnGames$ = gfnService.games$;
    const steamGames$ = steamService.games$;

    return combineLatest(gfnGames$, steamGames$).pipe(
      // Convert each item to a common game model
      map((data: any) => {
        return data.map((list: any) => {
          return list.map((item: any) => {
            return {
              id: item.id || item.appid,
              appid: item.appid || null,
              title: item.title || item.name,
              source: item.source,
              steamUrl: item.steamUrl || null,
            } as Game;
          });
        });
      }),
      // Combine the latest of all observables into one
      map(([a, b]) => [...a, ...b]),
      // Order by title
      map((data) =>
        data.sort((a: Game, b: Game) =>
          a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1,
        ),
      ),
    );
  }
}

export default new GameService();
