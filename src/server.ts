import 'reflect-metadata';

import connectionConfig from './ormconfig';
import app, { errorHandling } from './app';

import { createConnection } from 'typeorm';
import { createGlobalRouter } from './routes';

const port = process.env.PORT ?? 5000;

app.listen(port, async () => {
    const globalRouter = await createGlobalRouter();

    app.use('/', globalRouter);
    app.use(errorHandling);

    await createConnection(connectionConfig);

    console.log(`\nServer is hosted at http://localhost:${port}/`);
});