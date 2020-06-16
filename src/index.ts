import express from 'express';
import { argv } from 'yargs';
import 'module-alias/register';

import { initializeApi } from './api';

const app = express();
const port = process.env.PORT || argv.port || 8080;

initializeApi(app);

app.set('x-powered-by', false);
app.get('/', (_, res) => res.send('Covfefe API. See /api/docs for more information'));
app.listen(port, () => console.log(`Covfefe API is listening on port ${port}`));
