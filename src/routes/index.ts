/***************************************************************************
 *                                WARNING                                  *
 ***************************************************************************
 ***                                                                     ***
 *  This file shouldn't be modified unless you know what you're doing.     *
 *  It contains the logic for `Route` and `Controller` decorator to work.  *
 ***                                                                     ***
 ***************************************************************************/

import { Router } from 'express';
import { routerMap } from '../decorators/express.decorator';
import {
    ControllerDataType,
    HandlerFunction,
    RouteDataType,
    RouterHandlerType
} from '../typings/router';

import fs from 'fs';
import nodePath from 'node:path';

const ANSI = {
    GREEN: '\x1b[0;93m',
    RESET: '\x1b[0m'
};

function registerController(
    router: RouterHandlerType,
    routerData: RouteDataType,
    controllerData: ControllerDataType) {

    const { path, middlewares, handlerName, method } = controllerData;
    const REQUEST_METHODS = ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'];

    // Invalid methods shouldn't be accepted
    if (!REQUEST_METHODS.includes(method)) {
        return;
    }

    const handler = routerData.targetObj[handlerName] as HandlerFunction;

    const methodName = method.toLowerCase();
    router[methodName](path, ...middlewares, handler);

    const msg = `{color}${method} \t${routerData.path}${path}{reset}`
        .replace('{color}', ANSI.GREEN)
        .replace('{reset}', ANSI.RESET);

    console.log(msg);
}

function registerRouters(globalRouter: Router) {
    const { routes, controllers } = routerMap;

    for (const [className, parent] of Object.entries(routes)) {
        const currentRouter = Router();
        const controllerList = controllers[className];

        currentRouter.use(...parent.middlewares);

        // To make the 'registering-route' output look pretty,
        // we're just going to add a line to the output
        // before it shows the actual output.
        if (controllerList) {
            console.log();
        }

        for (const controller of controllerList) {
            // The `registerController` function only accepts the router
            // with the type of `RouterHandlerType`.
            registerController(
                currentRouter as unknown as RouterHandlerType,
                parent,
                controller
            );
        }

        globalRouter.use(parent.path, currentRouter);
    }
}

/**
 * Imports all routes from `controllers/` directory.
 *
 * In TS, it's a bit tricky to import dynamically,
 * therefore It's an async function.
 */
async function importRoutes(path: string) {
    const isDir = fs.lstatSync(path).isDirectory();
    if (isDir) {
        const files = fs.readdirSync(path);
        const promises: Promise<unknown>[] = [];

        for (const file of files) {
            const fullPath = nodePath.join(path, file);
            promises.push(importRoutes(fullPath));
        }

        await Promise.all(promises);
    } else if (path.includes('.controller.')) {
        // Importing based on the complete path won't work,
        // using the `resolve` function will make it like
        // how you used to import a local module.
        await import(nodePath.resolve(path));
    }
}

/**
 * Creates the global router for the entire Express app.
 *
 * To bind all of the routes easily from the `controllers/` directory,
 * we can make use of the {@link Router} to achieve that.
 */
export async function createGlobalRouter(): Promise<Router> {
    const controllersDir = nodePath.join(__dirname, '..', 'controllers/');
    await importRoutes(controllersDir);

    const router = Router();
    registerRouters(router);

    return router;
}