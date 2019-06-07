"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pathToRegexp = require("path-to-regexp");
exports.App = (send, redirect) => {
    const getRegexpMap = new Map();
    const getHandlersMap = new Map();
    const middlewares = [];
    const get = (route, ...handlers) => {
        const keys = [];
        const regexp = pathToRegexp(route, keys);
        getRegexpMap.set(route, { keys, regexp });
        getHandlersMap.set(route, handlers);
    };
    const use = (...handlers) => {
        middlewares.push(...handlers);
    };
    const router = path => {
        const route = [...getRegexpMap.keys()].find(mapPath => {
            const { regexp } = getRegexpMap.get(mapPath);
            return regexp.test(path);
        });
        if (!route)
            throw Error(`${path} not found`);
        const { keys, regexp } = getRegexpMap.get(route);
        const handlers = getHandlersMap.get(route);
        const exec = [...regexp.exec(path)];
        const params = keys.reduce((map, key, i) => {
            map[key.name] = exec[i + 1];
            return map;
        }, {});
        const req = { path, params };
        const res = { send, redirect };
        let middlewareIndex = -1;
        let handlerIndex = -1;
        const next = arg => {
            if (arg === 'route') {
                middlewareIndex = middlewares.length;
            }
            else {
                middlewareIndex++;
            }
            let handler = middlewares[middlewareIndex];
            if (handler !== undefined) {
                handler(req, res, next);
                return;
            }
            handlerIndex++;
            handler = handlers[handlerIndex];
            if (!handler)
                throw Error('Unexpected next, no more handlers');
            handler(req, res, next);
        };
        next();
    };
    const app = { get, use, router };
    return app;
};
//# sourceMappingURL=index.js.map