import * as https from 'https';
import * as url from 'url';

const URL = url.URL;

const httpsGetJson = (uri: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    let rawData: string = '';
    const request = https.get(uri, (res: any) => {
      res.on('data', (chunk: string) => {
        rawData += chunk;
      });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
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

export const getAllGames = async (): Promise<string> => {
  const uri = new URL(
    'https://static.nvidiagrid.net/supported-public-game-list/gfnpc.json',
  );
  uri.searchParams.set('JSON', 'true');

  return await httpsGetJson(uri.toString());
};

export const getAppGames = async (): Promise<string> => {
  const uri = new URL('https://layouts.nvidiagrid.net/v1/public/apps');
  uri.searchParams.set('language-code', 'en_GB');
  uri.searchParams.set('vpc-id', 'NP-SEA-01');

  return await httpsGetJson(uri.toString());
};
