
Data Store is a wrapper for Front-end and Back-end database connections. Data Store maintains the structure of the database and provides an API for interacting with the database. It is important to use Data Store for every component interacting with the database, so that it is always in the expected format.

# Usage
```
npm install --save @leverege/data-store
```

# Server Usage
To use with a serviceAccount, use

```
const DataStore = require( '@leverege/data-store' )

const store = DataStore.createRootStore( { type, serviceAccount, databaseUrl, root } )

const data = store.access( 'path/to/data' )
data.update( path, value, onComplete )
data.once( path, onComplete, onError )
```

# Client Usage
to use as a client with signIn capability:

```
const DataStore = require( '@leverege/data-store/lib/web' )
```

const store = DataStore.createRootStore( { type, jwt, databaseUrl, root } )

store.access( 'path/to/data' )
```
