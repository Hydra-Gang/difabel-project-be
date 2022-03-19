import 'reflect-metadata';

import app from './app';
import connectionConfig from './ormconfig';

import { createConnection } from 'typeorm';
import { createGlobalRouter } from './routes';

const port = process.env.PORT ?? 3000;

app.listen(port, async () => {
    await createConnection(connectionConfig);

    const globalRouter = await createGlobalRouter();
    app.use('/', globalRouter);

    console.log(`\nServer is hosted at http://localhost:${port}/`);
});