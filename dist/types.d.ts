import * as pathToRegexp from 'path-to-regexp';
export interface ObjectMap<T> {
    [key: string]: T;
}
export interface SpaRequest {
    path: string;
    params: ObjectMap<string>;
}
export interface SpaResponse<TContent> {
    send: SpaSend<TContent>;
    redirect: SpaRedirect;
}
export interface SpaNextFunction {
    (arg?: any): void;
}
export interface SpaRequestHandler<TContent = any> {
    (req: SpaRequest, res: SpaResponse<TContent>, next: SpaNextFunction): void;
}
export interface SpaRouteMatcher<TContent> {
    (path: string, ...handlers: SpaRequestHandler<TContent>[]): void;
}
export interface SpaRouterHandler<TContent> {
    (...handlers: SpaRequestHandler<TContent>[]): void;
}
export interface SpaSend<TContent> {
    (content: TContent): void;
}
export interface SpaRedirect {
    (path: string): void;
}
export interface SpaPathRegexp {
    keys: pathToRegexp.Key[];
    regexp: RegExp;
}
export interface SpaAppFactory<TContent = any> {
    (send: SpaSend<TContent>, redirect: SpaRedirect): SpaApp<TContent>;
}
export interface SpaRouter {
    (path: string): void;
}
export interface SpaApp<TContent> {
    get: SpaRouteMatcher<TContent>;
    use: SpaRouterHandler<TContent>;
    router: SpaRouter;
}
