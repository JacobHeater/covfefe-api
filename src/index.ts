import express, { Response } from 'express';
import { argv } from 'yargs';
import { Server } from 'http';
import 'module-alias/register';
import { initializeApiRouter } from './api';
import { covfefeErrorHandler } from './api/middleware/response';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { winstonHttpStream } from '@common/logging/winston';
import helmet from 'helmet';

const app = express();
const port = Number(process.env.PORT || argv.port || 8080);
const [apiPath, apiRouter] = initializeApiRouter();

if (require.main === module) {
  (async () => await startServerAsync(port))();
}

export function startServerAsync(port: number): Promise<Server> {
  return new Promise((resolve, reject) => {
    try {
      // Third-party middleware
      app.use(helmet());
      app.use(bodyParser.json());
      app.use(express.json());
      app.disable('x-powered-by');
      app.use(morgan('combined', { stream: winstonHttpStream }));
      
      // Http handlers
      app.get(['/', '/docs'], (_, res) => res.redirect('/api/docs'));
      app.use(apiPath, apiRouter);
      
      // Covfefe middleware
      app.use(covfefeErrorHandler);
      
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
