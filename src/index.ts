import express from 'express';
import { argv } from 'yargs';
import { Server } from 'http';
import 'module-alias/register';

import { initializeApiRouter } from './api';

const app = express();
const port = Number(process.env.PORT || argv.port || 8080);
const [apiPath, apiRouter] = initializeApiRouter();

if (require.main === module) {
  (async () => await startServerAsync(port))();
}

export function startServerAsync(port: number): Promise<Server> {
  return new Promise((resolve, reject) => {
    try {
      app.use(apiPath, apiRouter);
      app.set('x-powered-by', false);
      app.get('/', (_, res) => res.redirect('/api/docs'));
      const server = app.listen(port, () => {
        console.log(`Covfefe API is listening on port ${port}`);
        resolve(server);
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function stopServerAsync(server: Server): Promise<void> {
  if (server) {
    return new Promise((resolve, reject) => {
      try {
        server.close(() => {
          console.log(`Covfefe API has stopped`);
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  return Promise.resolve();
}
