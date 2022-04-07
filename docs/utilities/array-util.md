
This library contains methods that expand on the functionality of common array methods

## Install

```
npm install --save @leverege/array-util

const ArrayUtil = require( '@leverege/array-util' );

```

## index( array, key, value, from = 0 )

This will look for the first item whose `key == value` and return its index. If an item is not found, `-1` is returned.

```
const arr = [ { id : 1, name : 'hamster' }, { id : 2, name : 'cat' }, { id : 3, name : 'dog' } ]

ArrayUtil.index( arr, 'name', 'cat' )       // 1
ArrayUtil.index( arr, 'name', 'cat', 1 )    // 1
ArrayUtil.index( arr, 'name', 'cat', 2 )    // -1

```


## find( array, key, value, from = 0 )

This will look for the first item whose `key == value` and return it. If one is not found, `null` is returned.

```
const arr = [ { id : 1, name : 'hamster' }, { id : 2, name : 'cat' }, { id : 3, name : 'dog' } ]

ArrayUtil.find( arr, 'name', 'cat' )       // { id: 2, name: 'cat' }
ArrayUtil.find( arr, 'name', 'cat', 1 )    // { id: 2, name: 'cat' }
ArrayUtil.find( arr, 'name', 'cat', 2 )    // null

```


## replace( array, key, value, elem, from = 0 )

This will look for the first item whose `key == value` and replace it with `elem`. The index of the replacement is returned. If one is not found, `-1` is returned.

```
const arr = [ { id : 1, name : 'hamster' }, { id : 2, name : 'cat' }, { id : 3, name : 'dog' } ]

ArrayUtil.replace( arr, 'name', 'cat', { name:'cat', active:false } )      // 1
// arr = [ { id: 1, name: 'hamster' }, { name: 'cat', active: false }, { id: 3, name: 'dog' } ]
ArrayUtil.replace( arr, 'name', 'cat', { name:'cat', active:true }, 1 )    // 1
// arr = [ { id: 1, name: 'hamster' }, { name: 'cat', active: true }, { id: 3, name: 'dog' } ]
ArrayUtil.replace( arr, 'name', 'cat', { name:'cat' }, 2 )                 // -1
// arr = [ { id: 1, name: 'hamster' }, { name: 'cat', active: true }, { id: 3, name: 'dog' } ]

```

## remove( array, key, value, from = 0 )

Removes the first occurrence where `arr[n][key] == value` and returns the index. If no match is found, `-1` is returned.


## findRemove( array, key, value, from = 0 )

Similar to `remove()`, but the actual item the is being removed is returned.

## removeAll( array, key, value, from = 0 )

Removes the all occurrences where `arr[n][key] == value` and returns the index. An array of the removed items is returned.

## diff( sArr, nArr ) 
Returns an object containing `{ added : [], removed : [], same : [] }` where each of the added, removed and same array contains differences between `sArr` and `nArr`

