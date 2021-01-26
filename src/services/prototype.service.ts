import { of, Observable, BehaviorSubject } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';

interface Model {
  id: number;
  name: string;
}

class apiClient {
  get a$(): Observable<Model[]> {
    return of([
      { id: 1, name: 'A' },
      { id: 6, name: 'F' },
      { id: 2, name: 'B' },
      { id: 4, name: 'D' },
      { id: 14, name: 'N' },
      { id: 16, name: 'P' },
    ]);
  }

  get b$(): Observable<Model[]> {
    return of([
      { id: 2, name: 'B' },
      { id: 14, name: 'N' },
      { id: 13, name: 'M' },
      { id: 8, name: 'H' },
      { id: 5, name: 'E' },
      { id: 6, name: 'F' },
    ]);
  }

  get c$(): Observable<Model[]> {
    return of([
      { id: 1, name: 'A' },
      { id: 18, name: 'R' },
      { id: 13, name: 'M' },
      { id: 14, name: 'N' },
      { id: 23, name: 'W' },
      { id: 22, name: 'V' },
    ]);
  }

  get d$(): Observable<Model[]> {
    return of([
      { id: 1, name: 'A' },
      { id: 3, name: 'C' },
      { id: 7, name: 'G' },
      { id: 8, name: 'H' },
      { id: 23, name: 'W' },
      { id: 18, name: 'R' },
    ]);
  }
}

class PrototypeService {
  private apiClient = new apiClient();
  private cachedA: Model[] = [];

  private filterValue$: BehaviorSubject<string> = new BehaviorSubject<string>(
    '',
  );

  // Everytime we update the filter value
  // this will update the Subject
  // which will be streamed to filteredA$ Observable
  // iniating a new calculated return value
  set filterValue(value: string) {
    this.filterValue$.next(value);
  }

  filteredA$(): Observable<Model[]> {
    return this.filterValue$.pipe(
      // Use the filtered value
      // to return a new filtered Observable
      switchMap((filterValue: string) => {
        let data$: Observable<Model[]>;

        // First check for cached values
        if (!this.cachedA) {
          data$ = this.apiClient.a$ as Observable<Model[]>;

          // Cache the data if came from the API
          data$.pipe(
            tap((data: Model[]) => {
              this.cachedA = data;
            }),
          );
        } else {
          // Else use the already cached data
          data$ = of(this.cachedA) as Observable<Model[]>;
        }

        return data$.pipe(
          // Finally actually filter the data
          map((data: Model[]) =>
            data.filter((item: Model) => item.name === filterValue),
          ),
        );
      }),
    );
  }
}

export default new PrototypeService();
