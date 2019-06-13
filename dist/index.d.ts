import { SpaSend, SpaApp } from './types';
export { SpaRequestHandler, SpaRouteMatcher, SpaPathRegexp, SpaRouterHandler, SpaRouter, SpaNextFunction, SpaRequest, ObjectMap, SpaResponse, SpaSend, SpaApp } from './types';
export declare const App: <TContent>(send: SpaSend<TContent>, redirect: any) => SpaApp<TContent>;
