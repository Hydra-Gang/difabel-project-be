import app, { errorHandling } from './app';
import { appDataSource } from './ormconfig';
import { createGlobalRouter } from './routes';

const port = process.env.PORT ?? 5000;

app.listen(port, async () => {
    const globalRouter = await createGlobalRouter();

    app.use('/', globalRouter);
    app.use(errorHandling);

    await appDataSource.initialize();

    console.log(`\nServer is hosted at http://localhost:${port}/`);
});