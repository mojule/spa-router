import * as pathToRegexp from 'path-to-regexp'

export interface ObjectMap<T> {
  [ key: string ]: T
}

export interface SpaRequest {
  path: string
  params: ObjectMap<string>
}

export interface SpaResponse<T> {
  send: SpaSend<T>
  redirect: SpaRedirect
}

export interface SpaNextFunction {
  ( arg?: any ): void
}

export interface SpaRequestHandler<T> {
  ( req: SpaRequest, res: SpaResponse<T>, next: SpaNextFunction ): void
}

export interface SpaRouteMatcher<T> {
  ( path: string, ...handlers: SpaRequestHandler<T>[] ): void
}

export interface SpaRouterHandler<T> {
  ( ...handlers: SpaRequestHandler<T>[] ): void
}

export interface SpaSend<T> {
  ( content: T ): void
}

export interface SpaRedirect {
  ( path: string ): void
}

export interface SpaPathRegexp {
  keys: pathToRegexp.Key[]
  regexp: RegExp
}

export interface SpaAppFactory<T = any> {
  ( send: SpaSend<T>, redirect: SpaRedirect ): SpaApp<T>
}

export interface SpaRouter {
  ( path: string ): void
}

export interface SpaApp<T> {
  get: SpaRouteMatcher<T>
  use: SpaRouterHandler<T>
  router: SpaRouter
}

