import * as express from 'express';
import * as cors from 'cors';

import { login, getOwnedGames, getAppDetails } from './api';

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Add middleware to authenticate requests
// app.use(myMiddleware);

// build multiple CRUD interfaces:
app.get('/login', (req, res) => res.send(login()));
app.get('/profile/:id/GetOwnedGames/', async (req, res) =>
  res.send(await getOwnedGames(req.params.id)),
);
app.get('/app/:id/GetAppDetails/', async (req, res) =>
  res.send(await getAppDetails(req.params.id)),
);

// Expose Express API as a single Cloud Function:
export default app;
