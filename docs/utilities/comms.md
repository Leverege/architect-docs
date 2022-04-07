
NOTE:
* Make sure .babelrc is updated to use only server or browser targets or both as needed

# Comms 
This lib provides a chaining interface top of a request mechanism (Axios)

# Installation

```
npm install --save @leverege/comms
```

# Usage

Include the library in your module:

```
const Comms = require( '@leverege/comms' )
```

# Simple Usage

```
const { Comms } = require( '@leverege/comms' )

const api = new Comms( { host } )

// GET <host>/assets?q=fun
const list = await api.get( 'assets', { q : 'fun' } )

// GET <host>/assets/<id>/connections
const list = await api.child( 'assets' ).child( id ).get( 'connections' )

```

# Setting Auth

The `auth` option can be supplied to set the Autentication header. It can be
a string or an object with a `getToken` function.

With a simple string:
```
const auth = "Some Auth Token"
const api = new Comms( { host, auth } )
```

With an object:

```
function authToken( token, type = 'Bearer' ) {
  return { getToken( ) { return type == null ? token : `${type} ${token}` } }
}

const createAuth = ( opts ) => {
  return {
    getToken : ( method, url, extraParams, comms ) => {
      return `Bearer ${opts.create( methord, url, extraParams )}`
    }
  }
}

const api = new Comms( { host, auth : createAuth( opts ) } )
```

The `getToken` method will be called with every request.

By default, the setToken( tkn ) call will assume a `Bearer` JWT token.

