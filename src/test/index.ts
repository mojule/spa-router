import * as assert from 'assert'
import { App } from '..'
import { SpaRequestHandler } from '../types'

describe( 'spa-router', () => {
  const noop = () => { }

  it( 'creates an instance', () => {
    const app = App( noop, noop )

    assert( 'get' in app )
    assert( 'use' in app )
    assert( 'router' in app )
  } )

  it( 'routes', () => {
    const log: string[] = []

    const send = ( content: string ) => {
      log.push( content )
    }

    const app = App<string>( send, noop )

    app.get( 'hello', ( _req, res ) => {
      res.send( 'Hello' )
    } )

    app.router( 'hello' )

    assert.deepEqual( log, [ 'Hello' ] )
  } )

  it( 'routes with params', () => {
    const log: string[] = []

    const send = ( content: string ) => {
      log.push( content )
    }

    const app = App( send, noop )

    app.get( 'hello/:name', ( req, res ) => {
      res.send( `Hello ${ req.params.name }` )
    } )

    app.router( 'hello/world' )

    assert.deepEqual( log, [ 'Hello world' ] )
  } )

  it( 'middleware', () => {
    const log: string[] = []

    const logPath: SpaRequestHandler<string> = ( req, _res, next ) => {
      log.push( req.path )

      next()
    }

    const logParams: SpaRequestHandler<string> = ( req, _res, next ) => {
      log.push( JSON.stringify( req.params ) )

      next()
    }

    const send = ( content: string ) => {
      log.push( content )
    }

    const app = App( send, noop )

    app.use( logPath, logParams )

    app.get( 'hello/:name', ( req, res ) => {
      res.send( `Hello ${ req.params.name }` )
    } )

    app.router( 'hello/world' )

    assert.deepEqual(
      log,
      [
        'hello/world',
        '{"name":"world"}',
        'Hello world'
      ]
    )
  } )

  it( 'throws on bad path', () => {
    const app = App( noop, noop )

    assert.throws(
      () => app.router( 'hello' ),
      {
        message: 'hello not found'
      }
    )
  } )

  it( 'early return from middleware', () => {
    const log: string[] = []

    const logPath: SpaRequestHandler<string> = ( req, _res, next ) => {
      log.push( req.path )

      if ( req.path === 'hello/world' ) {
        next( 'route' )
      } else {
        next()
      }
    }

    const logParams: SpaRequestHandler<string> = ( req, _res, next ) => {
      log.push( JSON.stringify( req.params ) )

      next()
    }

    const send = ( content: string ) => {
      log.push( content )
    }

    const app = App( send, noop )

    app.use( logPath, logParams )

    app.get( 'hello/:name', ( req, res ) => {
      res.send( `Hello ${ req.params.name }` )
    } )

    app.router( 'hello/world' )

    assert.deepEqual(
      log,
      [
        'hello/world',
        'Hello world'
      ]
    )
  } )

  it( 'use middleware to modify send', () => {
    const log: string[] = []

    const send = ( content: string ) => {
      log.push( content )
    }

    const modifySend: SpaRequestHandler<string> = ( _req, res, next ) => {
      const { send } = res

      res.send = content => {
        send( `${ content }, world!` )
      }

      next()
    }

    const app = App( send, noop )

    app.use( modifySend )

    app.get( 'hello', ( _req, res ) => {
      res.send( 'Hello' )
    } )

    app.router( 'hello' )

    assert.deepEqual( log, [ 'Hello, world!' ] )
  } )

  it( 'throws when no handler', () => {
    const app = App( noop, noop )

    app.get( 'hello', ( _req, _res, next ) => {
      next()
    } )

    assert.throws(
      () => app.router( 'hello' ),
      {
        message: 'Unexpected next, no more handlers'
      }
    )
  } )
} )
