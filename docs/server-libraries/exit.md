
The purpose of the exit library is to allow for the graceful asynchronous shutdown of resources when signals and exceptions are caught. 

This cannot be used with `process.exit()`. Use `Exit.exit()` instead.

# Installation

```
npm install --save @leverege/exit
```

# Usage

Include the library in your module:

```
const Exit = require( '@leverege/exit' )
```

To configure Exit, you can use `init()` or the individual set methods. By default, Exit will force and exit in 20 seconds if the shutdown hooks don't complete. When the shutdown hooks complete, Exit will wait 100 ms before calling exit to allow for logs to be written. For testing purposes, the exit function can be set. It will default to `process.exit()` if one is not supplied.

```
Exit.init( {
  timeout : 20000,
  exitDelay : 100,
  exit : null
})
```

Install the default handlers, which will cover `SIGINT`, `SIGHUP`, `SIGBREAK`, `SIGTERM`, `beforeExit`, `uncaughtException` and `unhandledRejection`.

```
Exit.installDefaultHandlers()
```

# Installing Shutdown hooks

To install a shutdown hook, use the ```add()``` method:

```
const httpServer = app.listen( 1234 )
const expressShutdown = ( err, { eventType, eventCode } ) => {
  return new Promise( ( resolve, reject ) => { 
    app.close( resolve )
  } )
}

Exit.add( expressShutdown )
```

If you want to remove the shutdown hook:

```
Exit.remove( expressShutdown )
```

# Custom Event Handling


You do not have to use ```Exit.installDefaultHandlers()```. If you wish to handle different 
or addition signals and events, you can elect to register for event individually. The 
```installDefaultHandlers()``` implementation looks like this:

```
  handle( 'beforeExit', 0 )

  handle( 'SIGHUP', 128 + 1 )
  handle( 'SIGINT', 128 + 2 )
  handle( 'SIGTERM', 128 + 15 )
  handle( 'SIGBREAK', 128 + 21 )

  handleErr( 'uncaughtException', 1 )
  handleErr( 'unhandledRejection', 1 )
```


# Exit Filtering

You can install a filter against an event type that can cancelled the shutdown and exit
procedure. Returning ```true``` from a filter will cancel the exit. The following will
not exit if the err object has a field called dontExit which is true.

```
Exit.addFilter( 'uncaughtException', ( err ) => err && err.dontExit === true )
```

