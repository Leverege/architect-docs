# Limit

The limit library is used with messaging services. The limit library limits the number of messages that a user can get in a time period, and if that limit is reached, does not send the user more messages for a specified time period. Limit uses namespaces, so that messages can be limited independent of each other.

## Install

```javascript
npm install -save @leverege/limit
```

## Usage

An example of a redis based approach:

```javascript
const Limit = require( '@leverege/limit' );
const limitConfig = process.env.LIMIT_CONFIG || 
  { type : 'redis', 
    connection : {
      host : '127.0.0.1',
      port : 6379
    },
  };

const limit = await Limit.create( { namespace : 'myApp', limitConfig } )

```

NOTE: Version 2.0 changed the `create()` method to be async. Please wait for it to complete before using the result.


## Limiting

```javascript
// Create a connection to the limiter mechanism. Give it a namespace
const limiter = Limit.create( { namespace : 'myApp'}, limitConfig )

// Create a limit object for a specific key (which can be namespaced),
// with specific properties.
const limit = limiter.limit( 'myKey', {
    count : 10,        // only allow 10
    period : 10*1000,      // over a 10 second period
    duration : 60*60*1000, // or limit for one hour
  })

// Same can be done with a namespaced key.
const limit = limiter.limit( 'myKey', {
    count : 5,        // only allow 5
    period : 30*1000,     // over a 30 second period
    duration : 5*60*1000, // or limit for 5 minutes
  })

const limited = await limit.isLimited( ) // increment and check if we are limited

if ( limited ) {
  // don't do the action
  return
}
// do the action

```

### Limiting with Remaining Limit Time

In some cases it can be useful to know the remaining time until the limit expires. `getRemainingLimit` can be used in place of `isLimited` in these situations.

```javascript
const limiter = Limit.create( { namespace : 'myApp'}, limitConfig )
const limit = limiter.limit( 'myKey', {
    count : 10,        // only allow 10
    period : 10*1000,      // over a 10 second period
    duration : 60*60*1000, // or limit for one hour
  })

const remainingLimit = await limit.getRemainingLimit( ) // increment and get time remaining until limit expiry

if ( remainingLimit > 0 ) {
  // don't do the action
  return `Try again in ${Math.ceiling( remainingLimit / 1000 )} seconds`
}
// do the action
```

### Checking Limit without Incrementing Count

```javascript
const isLimited = await limit.checkLimit( ) // true if and only if limited
const remainingLimit = await limit.checkLimit( { asTime : true } ) // MS time until limit expires (min 0)
```
