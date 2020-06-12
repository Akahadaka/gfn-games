import * as functions from 'firebase-functions';
import * as http from 'http';
import * as https from 'https';
import * as url from 'url';

const STEAMAPIKEY = functions.config().steam.apikey;
const STEAMAPIURL = 'http://api.steampowered.com/';
const STOREAPIURL = 'https://store.steampowered.com/api/';

const URL = url.URL;

const httpGetJson = (uri: string, req: any = http): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    let rawData: string = '';
    const request = req.get(uri, (res: any) => {
      res.on('data', (chunk: string) => {
        rawData += chunk;
      });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          console.log(parsedData);
          resolve(parsedData);
        } catch (e) {
          console.error(e.message);
        }
        resolve();
      });
    });
    request.on('error', reject);
  });
};

export const login = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    reject();
  });
};

export const getOwnedGames = async (steamid: string): Promise<string> => {
  const uri = new URL(STEAMAPIURL + 'IPlayerService/GetOwnedGames/v0001/');
  uri.searchParams.set('key', STEAMAPIKEY);
  uri.searchParams.set('steamid', steamid);
  uri.searchParams.set('include_played_free_games', 'true');
  uri.searchParams.set('include_appinfo', 'true');
  uri.searchParams.set('format', 'json');

  return await httpGetJson(uri.toString());
};

export const getAppDetails = async (appid: string): Promise<string> => {
  const uri = new URL(STOREAPIURL + 'appdetails/');
  uri.searchParams.set('appids', appid);

  return httpGetJson(uri.toString(), https);
};
