
The error library contains a set of commonly used errors, and allows for easy construction of new Errors.

It will allow for `instanceof` checks and you don't need to use the `new` syntax to create an Error.

# Usage

```javascript
const Err = require( '@leverege/error' )

// to throw a base error, use one of these constructor types. They
// will work on any Err type.
throw Err( )
throw Err( 'My error message' )
throw Err( 'My error message', 1234 )
throw Err( 'My error message', 1234, { otherValue : 789 } )
throw Err( 'My error message', { otherValue : 789} )
throw Err( { message : 'My error message', status : 1234, otherValue : 789 } )

const e = Err()
e instanceof Err // true
e instanceof Error // true

```

Default Err types include

```javascript

// Common Http Errors

Err.badRequest = Err.extend( 'BadRequest', 400, 'Bad arguments' )
Err.unauthorized = Err.extend( 'Unauthorized', 401, 'Unauthorized' )
Err.forbidden = Err.extend( 'Forbidden', 403, 'Forbidden' )
Err.notFound = Err.extend( 'NotFound', 404, 'Not found' )
Err.requestTimeout = Err.extend( 'RequestTimeout', 408, 'Request timeout' )
Err.conflict = Err.extend( 'Conflict', 409, 'Conflict' )
Err.gone = Err.extend( 'Gone', 410, 'Gone' )

Err.internalError = Err.extend( 'InternalError', 500, 'Internal Error' )
Err.notImplemented = Err.extend( 'NotImplemented', 501, 'Not implemented' )
Err.serviceUnavailable = Err.extend( 'ServiceUnavailable', 503, 'Service unavailable' )

// Other errors

Err.illegalArgument = Err.extend( 'IllegalArgument', 400, 'Illegal argument' ) // use BadRequest code
Err.unknownMessage = Err.extend( 'UnknownMessage', 400, 'Unknown Message' )

```

So, if your express request has a bad post parameter, you could do this:

```javascript 
app.post( '/foo' ( req, res, next ) => {
  if ( isNameInvalid( req.param.name ) ) {
    return next( Err.badRequest( 'The name is invalid') )
  }
  doStuff( next )
})
```


To create a new error type, use the `extend()` method.

```javascript
Err.badStuff = Err.extend( 'BadStuff', 666, 'Bad stuff occurred' )

throw Err.badStuff()
/* will produce
{ BadStuff: Bad stuff occurred
    at Function.SubErr [as badStuff] (/Users/steve/Dev/Leverege/error/src/Err.js:50:14)
    at repl:1:5
    at ContextifyScript.Script.runInThisContext (vm.js:50:33)
    at REPLServer.defaultEval (repl.js:240:29)
    at bound (domain.js:301:14)
    at REPLServer.runBound [as eval] (domain.js:314:12)
    at REPLServer.onLine (repl.js:441:10)
    at emitOne (events.js:121:20)
    at REPLServer.emit (events.js:211:7)
    at REPLServer.Interface._onLine (readline.js:282:10) status: 666 }
*/

const bs = Err.badStuff( 'name field wasnt set' )
bs instanceof Err.badStuff // true
bs instanceof Err // true
bs instanceof Error // true
console.log( bs ) 
/*
{ BadStuff: name field wasnt set
    at Function.SubErr [as badStuff] (/Users/steve/Dev/Leverege/error/src/Err.js:50:14)
    at repl:1:10
    at ContextifyScript.Script.runInThisContext (vm.js:50:33)
    at REPLServer.defaultEval (repl.js:240:29)
    at bound (domain.js:301:14)
    at REPLServer.runBound [as eval] (domain.js:314:12)
    at REPLServer.onLine (repl.js:441:10)
    at emitOne (events.js:121:20)
    at REPLServer.emit (events.js:211:7)
    at REPLServer.Interface._onLine (readline.js:282:10) status: 666, message: 'name field wasnt set' }
*/
console.log( bs.toString() )
// BadStuff: name field wasnt set {"status":666,"message":"name field wasnt set"}
```


