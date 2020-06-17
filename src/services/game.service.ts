import { Observable } from 'rxjs/internal/Observable';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import gfnService from './gfn.service';
import steamService from './steam.service';

export interface Game {
  id: number;
  title: string;
  source: 'Steam' | 'GFN';
  match: boolean;
  steamUrl: string;
  steamAppId: number;
  status: 'ARCHIVED' | 'AVAILABLE';
  free?: boolean;
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
              title: item.title || item.name,
              source: item.source,
              steamUrl: item.steamUrl || null,
              steamAppId: item.steamAppId || item.appid || null,
              status: item.status || 'AVAILABLE',
              free: item.free || null,
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
