import 'reflect-metadata';
import app from './app';

import { createConnection } from 'typeorm';
import { createGlobalRouter } from './routes';

const port = process.env.PORT ?? 3000;

app.listen(port, async () => {
    const globalRouter = await createGlobalRouter();
    app.use('/', globalRouter);

    await createConnection();
    console.log(`\nServer is hosted at http://localhost:${port}/`);
});