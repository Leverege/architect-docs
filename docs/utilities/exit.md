
The purpose of this library is to enhance the native Promise feature with limit and spread operators.  

## Installation

```
npm install --save @leverege/promise
```

## Usage

Include the library in your module:

```
const P = require( '@leverege/promise' )
```

## Promise Function

A promise function is a function that returns a promise when invoked. This allows us to delay the creation ( and hence execution ) of the Promise until we have an available worker to process it.

Promise functions in the map() call will take arguments : the data and index of the data to be processed.


### limit( Array PromiseFunctions[]|Object, Number | Options )

The `limit()` call takes either an Array of promiseFunctions or object specifying promiseFunctions. By default,
the options is set to a limit of 10 and to exit on error


| Options | Value | Description |
| ------- | ----- | ----------- |
| limit | number | The number of concurrently executing promise functions |
| handleReject | boolean | If true, Promise rejects will be inserted into the resulting array or object. If false, the limit call will stop and its returned promise will be rejected with the error. |

```
const funcs = [
  ( ) => api.queryX( ),
  ( ) => api.queryY( ),
  ( ) => api.queryZ( )
]
const r = await P.limit( funcs )
// return [ x, y, z ] or throw exception
```

```
const funcs = {
  valueX : ( ) => api.queryX( ),
  valueY : ( ) => api.queryY( ),
  valueZ : ( ) => api.queryZ( )
}
// Run only two at a time
const r = await P.limit( funcs, 2 ) 
// return { valueX : x, valueY : y, valueZ : z } or throw exception
```

When not exiting on errors:

```
const funcs = [
  ( ) => api.queryX( ),
  ( ) => api.queryY( ),
  ( ) => api.queryZ( )
]
const r = await P.limit( funcs, { limit : 2, handleReject : true } )
// return [ Error, y, Error ]
```

```
const funcs = {
  valueX : ( ) => api.queryX( ),
  valueY : ( ) => api.queryY( ),
  valueZ : ( ) => api.queryZ( )
}
const r = await P.limit( funcs, { limit : 2, handleReject : true } )
// return { valueX : Error, valueY : y, valueZ : Error } 
```

The limit call can also work in deep structures:

```
const f = {
  values : {
    A : () => api.queryA( ),
    B : () => api.queryB( )
  },
  deep : {
    array : [ api.queryC( ), api.queryD( ) ]
  }
}
const r = await P.limit( f, { limit : 2, handleReject : true } )
// return { values : { A : 'A', B : 'B' }, deep : { array : [ 'C', 'D' ] } }
```

### all( Array PromiseFunctions[]|Object, Options )

The `all()` call takes either an Array of promiseFunctions or object specifying promiseFunctions. There will be no limiting of the promises. If you are not interested in the handleReject or object handling, use `Promise.all( [ promise1, promise2, ... ] )`.


| Options | Value | Description |
| ------- | ----- | ----------- |
| handleReject | boolean | If true, Promise rejects will be inserted into the resulting array or object. If false, the limit call will stop and its returned promise will be rejected with the error. |

```
const funcs = [
  ( ) => api.queryX( ),
  ( ) => api.queryY( ),
  ( ) => api.queryZ( )
]
const r = await P.all( funcs, { handleReject : true } )
// return [ Error, y, Error ]
```

```
const funcs = {
  valueX : ( ) => api.queryX( ),
  valueY : ( ) => api.queryY( ),
  valueZ : ( ) => api.queryZ( )
}
const r = await P.limit( funcs, { limit : 2, handleReject : true } )
// return { valueX : Error, valueY : y, valueZ : Error } 
```

### mapLimit( Array data[], PromiseFunction( data, index ), Number | Options )

The `mapLimit()` call takes an Array of data. Each data item is given to the PromiseFunction. The number of current running PromiseFunctions is determined by the limit. By default, the options is set to a limit of 10 and to exit on error


| Options | Value | Description |
| ------- | ----- | ----------- |
| limit | number | The number of concurrently executing promise functions |
| handleReject | boolean | If true, Promise rejects will be inserted into the resulting array or object. If false, the limit call will stop and its returned promise will be rejected with the error. |


```
const data = [ 1, 2, 3 ]
const r = await P.mapLimit( data, ( d ) => api.get( d ), 2 )
// return [ {result of get(1)}, {result of get(2)}, {result of get(3)} ] or throw exception
```

```
const data = [ 1, 2, 3 ]
const r = await P.mapLimit( data, ( d ) => api.get( d ), { limit : 2, handleReject : true } )
// return [ Error, {result of get(2)}, Error ] or throw exception
```

### map( Array data[], PromiseFunction( data, index ), Options )

This is like mapLimit, but without the limit option.


### deferred()

Returns a promise with a resolve and reject function. This can be used to forward results from
promises that have not been created yet.

