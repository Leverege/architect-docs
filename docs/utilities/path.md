
Many aspects of the Leverege system interact with data in a path/value format. This library offers some common functionality working with the path/value format.

## Install

```
npm install --save @leverege/path
```

## Create a Path

A path will turn a `'/'` separated string into a traversal pattern for an object. To create one, call

```
const Path = require( '@leverege/path' );

const p = Path( 'my/path' )
const p2 = Path( ['my', 'path' ] )
const p3 = new Path( 'a/b' )
```

### Array Paths
A path created with an array of strings will preserve `'/'` in its array entries. For example:

```
const obj = { 'a/b' : { c : 'hello' } }

// null
Path( 'a/b/c' ).get( obj )

// 'hello'
Path( [ 'a/b', c ] ).get( obj )
```

## Path( path ).get( object, defaultValue )
## Path.get( path, object, defaultValue )

This will attempt to traverse the object using the current path. If it cannot traverse the path, defaultValue will be returned

```
// given
const obj = { id : 1, info : { name : "Mr Wiggles" } };

Path( 'id' ).get( obj );                      // 1
Path( 'name' ).get( obj, 'dValue' );          // dValue
Path( 'info/name' ).get( obj, 'dValue' );     // Mr Wiggles
```

You can also invoke get as a function directly on path:
```
Path.get( 'id', obj );                        // 1
Path.get( 'name', obj, 'unknown' );           // unknown
Path.get( 'info/name', obj, 'unknown' );      // Mr Wiggles
```


## Path( path ).set( object, value )
## Path.set( path, object, value )

This will attempt to set the value on the object at the current path. If it cannot traverse the path, false will be returned. Otherwise, this will return true.

```
// given
Path( 'id' ).set( obj, 2 );                         // true
Path( 'info/name' ).set( obj, 'Mrs Wiggles' );      // true
Path( 'info/name/last' ).set( obj, 'Wiggles' );     // false
```


## Path( path ).copy( object, [value] )
## Path.copy( path, object, [value] )

This will make a shallow copy of object and all object along the path and return it. If value is supplied, the returned copy's value at path will be value. If the path crosses a primitive, the primitive will be left in place.


## Path( path ).delete( object )
## Path.delete( path, object )

This will call delete on the value at the path. If the delete occurred, true will be returned. Otherwise, false is returned.


