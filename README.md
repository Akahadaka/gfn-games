# GeForce NOW Games List

Display a list of all supported games by GeForce NOW. Log in with Steam (and in future other services) and compare games to see what overlaps.

## VUE

### Project setup

```
$ npm install
```

#### Compiles and hot-reloads for development

```
$ npm run serve
```

#### Compiles, minifies for production and deploys to Firebase Hosting

```
$ npm run deploy
```

## Firebase Cloud Functions

Note, all npm commands should be run in the `/functions` sub-folder

#### Project setup

```
$ cd functions
$ npm install
```

For the Steam API to work locally, your own Steam API key is required. This can be obtained from https://steamcommunity.com/dev/apikey

This key should be kept private and not committed to the repo. Add it to the file `/functions/.runtimeconfig.json` in the following format

```json
{
  "steam": {
    "apikey": "MYSTEAMAPIKEY"
  }
}
```

#### Compile and emulate for development

```
$ npm run serve
```

#### Deploy

```
$ npm run deploy
```
