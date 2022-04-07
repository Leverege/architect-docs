# Lock

# Install
```
npm install -save @leverege/lock

const Lock = require( '@leverege/lock' );

```

# Usage

In general, use the lockConfig to drive the type of shared lock. This allows the type to be driven by the environment variables setup by the deployment mechanism.

NOTE: Version 2.0 changed the `create()` method to be async. Please wait for it to complete before using the result.


```
const lockConfig = process.env.LOCK_CONFIG || 
  { type : 'redis', 
    connection : {
      host : '127.0.0.1',
      port : 6379
    },
    lockOptions : { ... }
  };
const lock = await Lock.create( { lockConfig, namespace : 'myApp'} )
```
You can destroy the Lock resources by calling:
```
lock.destroy()
```

# Locking
```
...
const l = await lock.lock( 'myKey', 1000 )  // This will lock globally on myKey
// do work
await l.unlock()

l = await lock.lockNs( 'myKey', myValue ) // This will lock using namespaced myKey (myApp:myKey)
// do work
await l.unlock()

```

# Extending a lock
To extend a lock, call extend( timeMs ) and use the returned lock
```
let l = await lock.lock( 'myKey', { ttl : 1000 } ) 
// do work
l = await l.extend( 1000 )
// do more work
l.unlock()

```

# InMemoryLock
The InMemoryLock will lock on the instance of the lock, and will work only within the process 
itself.
```
const lock = Lock.create({ 
  type : 'inMemory',
  namespace : 'myApp', 
  retry : 0,    // the number of attempts to make before failing. Negative numbers means infinite
  delay : 100,  // time in milliseconds between lock attempts
})

// or, using lockConfig
constlock = Lock.create({ 
  namespace : 'test', 
  lockConfig : { 
    type : 'inMemory', 
    retry : 0,    // the number of attempts to make before failing. Negative numbers means infinite
    delay : 100,  // time in milliseconds between lock attempts
  } })
```

# Redis
The Redis lock can be used to lock between processes.

```

const lock = Lock.create( { 
    type : 'redis',
    namespace : 'myApp', 
    connection : {
      host : '127.0.0.1',
      port : 6379
    },
    // From RedLock
    lockOptions : { 
      // the expected clock drift; for more details
      // see http://redis.io/topics/distlock
      driftFactor: 0.01, // time in ms

      // the max number of times Redlock will attempt
      // to lock a resource before erroring
      retryCount:  0,

      // the time in ms between attempts
      retryDelay:  200, // time in ms

      // the max time in ms randomly added to retries
      // to improve performance under high contention
      // see https://www.awsarchitectureblog.com/2015/03/backoff.html
      retryJitter:  100 // time in ms
    }
  } )


// Or using lockConfig

const lock = Lock.create( { 
  namespace : 'myApp', 
  lockConfig : {
    type : 'redis',
    connection : {
      host : '127.0.0.1',
      port : 6379
    },
    // From RedLock
    lockOptions : { 
      // the expected clock drift; for more details
      // see http://redis.io/topics/distlock
      driftFactor: 0.01, // time in ms

      // the max number of times Redlock will attempt
      // to lock a resource before erroring
      retryCount:  0,

      // the time in ms between attempts
      retryDelay:  200, // time in ms

      // the max time in ms randomly added to retries
      // to improve performance under high contention
      // see https://www.awsarchitectureblog.com/2015/03/backoff.html
      retryJitter:  100 // time in ms
    }
  }
} )
```
