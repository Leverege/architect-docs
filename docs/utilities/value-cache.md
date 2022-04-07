
The value cache is designed to simplify the storing of calculated values based on other values. This can be useful in React applications where you want to use the same properties object if the data didn't change.

## Install

```
npm install --save @leverege/value-cache
```

## Usage

There are two potential usages. A version where the cache can contain only one computed value, and a version that uses a key to handle many computed values.

### One Value - ValueCache

```
const { ValueCache } = require( '@leverege/value-cache' )

class MyClass {
  constructor() {
    this.cache = new ValueCache()
  }

  doStuff( a, b, c ) {
    if ( this.cache.isSame( a, b, c ) ) {
      return this.cache.value
    }
    let v = // compute v based on a, b, c
    return this.cache.set( v, a, b, c )
  }
}
```

Another way to use the cache is by creating a function to compute the value and calling `calc( fn, args )`.

```
function calculate( a, b, c ) {
  let v = ... // compute v based on a, b, c
  return v
}
return this.cache.calc( calculate, a, b, c )
```

## Many Values - ValuesCache

The ValuesCache stores ValueCache objects at keys so you don't have to make many ValueCache Object. It has all the same methods as the ValueCache, but the first argument is a key that represents the value you're caching.

On difference to note - to get the value you all `value( key )` instead of accessing `.value` off the ValueCache.

```
const { ValueCache } = require( '@leverege/value-cache' )

class MyClass {
  constructor() {
    this.cache = new ValuesCache()
  }

  doStuff( a, b, c ) {
    if ( this.cache.isSame( 'myThing', a, b, c ) ) {
      return this.cache.value( 'myThing' )
    }
    let v = // compute v based on a, b, c
    return this.cache.set( 'myThing', v, a, b, c )
  }
}
```

The `calc()` methods works as well, but requires the key

```
function calculate( a, b, c ) {
  let v = ... // compute v based on a, b, c
  return v
}

return this.cache.calc( 'myThing', calculate, a, b, c )
```

## Custom equals

You can pass into ValueCache, ValuesCache or memoize an options object that contains
a equals function.

```
  const equals = ( a, b, index ) => {
    return myEquals( a, b )
  }
  new ValueCache( { equals } )

  } )
```

The Equals takes a third argument that is the index of the argument, which would allow
different equality checks per argument

