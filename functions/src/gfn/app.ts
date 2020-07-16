import * as express from 'express';
import * as cors from 'cors';

import { getAllGames } from './api';

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Add middleware to authenticate requests
// app.use(myMiddleware);

// build multiple CRUD interfaces:
app.get('/GetAllGames', async (req, res) => res.send(await getAllGames()));

// Expose Express API as a single Cloud Function:
export default app;
