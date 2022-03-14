import { Router } from 'express';
import todoRoute from './todo.route';

type CommonRoute = {
    /** the current routing version (starts at 1) */
    version: number,
    /** the endpoint path name (don't start with '/') */
    path: string,
    /** the router for this specific endpoint */
    router: Router
};

// All of the routes you've created within the 'routes' folder
// must be registered here, and it'll bind it to the server.
const allRoutes: CommonRoute[] = [
    {
        version: 1,
        path: 'todos',
        router: todoRoute
    }
];

// Insert all routes to the 'global' router
//
// Automatically combine all router into this
// 'global' route, then bind it to the server.
//
// In the end, it'll produce like: /v1/todo/add
const globalRouter = Router();
for (const route of allRoutes) {
    const { version, path, router } = route;
    globalRouter.use(`/v${version}/${path}`, router);
}

export default globalRouter;