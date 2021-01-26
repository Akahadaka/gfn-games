export enum LocalStorageKeyEnum {
  RecentlyUsedIds = '_recently_used_id'
}

export class LocalStorageService {

  private _isLocalStorageAvailable(){
      const testKey = '___TEST___';
      try {
          localStorage.setItem(testKey, testKey);
          localStorage.removeItem(testKey);
          return true;
      } catch(err) {
          return false;
      }
  }

  get (key: LocalStorageKeyEnum): string {
    if (!this._isLocalStorageAvailable) { return ''; }

    try {
      return localStorage.getItem(key) || '';
    } catch (error) {
      return '';
    }
  }

  set (key: LocalStorageKeyEnum, value: string): boolean {
    if (!this._isLocalStorageAvailable) { return false; }

    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    } 
  }
}

