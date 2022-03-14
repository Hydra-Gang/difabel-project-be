import 'reflect-metadata';
import app from './app';
import { createConnection } from 'typeorm';

const port = process.env.PORT || 3000;

app.listen(port, async () => {
    try {
        await createConnection();
        console.log(`Server is hosted at http://localhost:${port}/`);
    } catch (err) {
        console.error(err);
    }
});