import * as pathToRegexp from 'path-to-regexp'

import {
  SpaRequestHandler, SpaRouteMatcher, SpaPathRegexp, SpaRouterHandler,
  SpaRouter, SpaNextFunction, SpaRequest, ObjectMap, SpaResponse, SpaSend,
  SpaApp
} from './types'

export const App = <T>( send: SpaSend<T>, redirect ) => {
  const getRegexpMap = new Map<string, SpaPathRegexp>()
  const getHandlersMap = new Map<string, SpaRequestHandler<T>[]>()
  const middlewares: SpaRequestHandler<T>[] = []

  const get: SpaRouteMatcher<T> = ( route, ...handlers ) => {
    const keys: pathToRegexp.Key[] = []
    const regexp = pathToRegexp( route, keys )

    getRegexpMap.set( route, { keys, regexp } )
    getHandlersMap.set( route, handlers )
  }

  const use: SpaRouterHandler<T> = ( ...handlers ) => {
    middlewares.push( ...handlers )
  }

  const router: SpaRouter = path => {
    const route = [ ...getRegexpMap.keys() ].find( mapPath => {
      const { regexp } = getRegexpMap.get( mapPath )!

      return regexp.test( path )
    } )

    if ( !route ) throw Error( `${ path } not found` )

    const { keys, regexp } = getRegexpMap.get( route )!
    const handlers = getHandlersMap.get( route )!

    const exec = [ ...regexp.exec( path )! ]

    const params: ObjectMap<string> = keys.reduce( ( map, key, i ) => {
      map[ key.name ] = exec[ i + 1 ]

      return map
    }, {} )

    const req: SpaRequest = { path, params }
    const res: SpaResponse<T> = { send, redirect }

    let middlewareIndex = -1
    let handlerIndex = -1

    const next: SpaNextFunction = arg => {
      if( arg === 'route' ){
        middlewareIndex = middlewares.length
      } else {
        middlewareIndex++
      }

      let handler = middlewares[ middlewareIndex ]

      if( handler !== undefined ){
        handler( req, res, next )

        return
      }

      handlerIndex++

      handler = handlers[ handlerIndex ]

      if( !handler )
        throw Error( 'Unexpected next, no more handlers' )

      handler( req, res, next )
    }

    next()
  }

  const app: SpaApp<T> = { get, use, router }

  return app
}
