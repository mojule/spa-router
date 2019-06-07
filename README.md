# spa-router

Express-like routing for Single Page Apps

Use if you want something very simple and basic, there are plenty of more
fully-featured solutions out there

`npm install @mojule/spa-router`

Note that although intended to be used in the browser, there is no code in the
package that is specific to either node or the browser, so it can be used
anywhere to do Express-like routing

## basic example

```html
<header>
  <a href="#hello">Hello</a>
</header>
<main></main>
```

```js
const { App } = require( '@mojule/spa-router' )

const hashChange = new Event( 'hashchange' )

document.addEventListener( 'DOMContentLoaded', () => {
  const main = document.querySelector( 'main' )

  const send = node => {
    main.innerHTML = ''
    main.appendChild( node )
  }

  const redirect = path => {
    window.location.hash = `#${ path }`
    window.dispatchEvent( hashChange )
  }

  const app = App( send, redirect )

  app.get( 'hello', ( req, res ) => {
    const hello = document.createTextNode( 'Hello' )

    res.send( hello )
  } )

  window.addEventListener( 'hashchange', () => {
    const { hash } = window.location
    const path = hash.replace( '#', '' )

    try {
      app.router( path )
    } catch( err ){
      window.alert( err.message )
    }
  } )

  if ( location.hash !== '' ) {
    window.dispatchEvent( hashChange )
  }
} )
```

## app factory

A factory function is exported to create the app instance - unlike Express,
it is a named export, and unlike Express, it requires some arguments

In express:

```js
const express = require( 'express' )

const app = express()
```

Here:
```js
const { App } = require( '@mojule/spa-router' )

const app = App( send, redirect )
```

`send` is a function that takes a DOM `Node` and is placed directly on the `res`
object passed to handlers (see example above)

`redirect` is also placed directly on the `res` object - it is up to you to call
`app.router` when `redirect` is called (see the example above where we use
the hash change event to wire everything up)

### app.get

Like express `app.get`, see below

### app.use

Like express `app.use`, see below

### app.router

`app.router( path )`

Causes the app to call the appropriate handlers for the path, like Express does
with an incoming HTTP request - use in conjunction with the `redirect` function,
see example above

## What it supports

You should know how to use Express already - this is a very small subset
of Express - if functionality is not listed below, assume it doesn't exist

### method routing

Only `app.get` - open to PRs but a discussion would have to be had about how
to handle eg `post`

### route params

Same as Express (uses the same library)

```js
app.get( 'hello/:name', ( req, res ) => {
  const { name } = req.params

  const hello = document.createTextNode( `Hello ${ name }` )

  res.send( hello )
} )
```

### multiple handlers

```js
  const logHandler = ( req, res, next ) => {
    console.log( req )
    next()
  }

  app.get(
    'hello',
    logHandler,
    ( req, res ) => {
      const hello = document.createTextNode( 'Hello' )

      res.send( hello )
    }
  )
```

### basic middleware

```js
app.use( ( req, res, next ) => {
  const { send } = res

  // wrap whatever subsequent handlers send in a div
  res.send = node => {
    const div = document.createElement( 'div' )

    div.appendChild( node )

    send( div )
  }

  next()
})
```

Skip all other middleware and go straight to route handlers:

```js
( req, res, next ) => {
  console.log( 'skipping other middleware' )

  next( 'route' )
}
```

### req

Only has `req.path` and `req.params`

### res

Only has `res.send( node )` and `res.redirect( path )`

## Using from TypeScript

It exports all of its own types, no need to install a types package

The response sent by `res.send` can be typed, if you omit it will default to
`any`

If you pass the `App` factory function a typed `send` function it will imply
the response type from that:

```ts
// ... other code etc

const send = ( content: HTMLElement ) => {
  main.innerHTML = ''
  main.appendChild( content )
}

const app = App( send, redirect )

app.get( ( req, res ) => {
  const content: string = 'Hello'

  // you will get a type error here, expected HTMLElement
  res.send( content )
} )
```

Or you can explicity type it:

```ts
const app = App<HTMLElement>( send, redirect )
```

## license

MIT License

Copyright (c) 2019 Nik Coughlin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
