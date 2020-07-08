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
  epicUrl?: string;
  epicAppId?: string;
  uplayUrl?: string;
  uplayAppId?: string;
  status: 'ARCHIVED' | 'AVAILABLE';
  free?: boolean;
  new?: boolean;
}

class GameService {
  get games$(): Observable<Game[]> {
    // TODO Need to handle these when a ResponseError is returned
    const gfnGames$ = gfnService.games$;
    const steamGames$ = steamService.games$;

    const steamUrl = 'https://store.steampowered.com/app/';
    const twoWeeks = 60 * 60 * 24 * 14 * 1000;

    return combineLatest(gfnGames$, steamGames$).pipe(
      // Convert each item to a common game model
      map((data: any) => {
        return data.map((list: any) => {
          return list.map((item: any) => {
            return {
              id: item.id || item.appid,
              title: item.title || item.name,
              source: item.source,
              steamUrl:
                item.steamUrl || (item.appid ? steamUrl + item.appid : null),
              steamAppId: item.steamAppId || item.appid || null,
              epicUrl: item.epicUrl || null,
              epicAppId: item.epicAppId || null,
              uplayUrl: item.uplayUrl || null,
              uplayAppId: item.uplayAppId || null,
              status: item.status || 'AVAILABLE',
              free: item.free || null,
              new:
                item.created &&
                Date.now() - item.created.seconds * 1000 < twoWeeks,
            } as Game;
          });
        });
      }),
      // Combine the latest of all observables into one
      map(([a, b]) => [...a, ...b]),
      // Order by title
      map((data) =>
        data.sort((a: Game, b: Game) =>
          a.title.replace(/\W/g, '').localeCompare(b.title.replace(/\W/g, '')),
        ),
      ),
    );
  }
}

export default new GameService();
