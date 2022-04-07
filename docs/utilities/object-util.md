
The object-util Library provides methods to easily transform object to and from path/value arrays. Path/value arrays are used when updating devices and information for most of the objects on the Leverege platform.

## Install
```
npm install --save @leverege/object-util

const ObjectUtil = require( '@leverege/object-util' );
```

## copy( toCopy )

returns a copy if it is passed an array or object.

## assignFields( dst, src, fields, copyFields )

1. dst - object to have fields added to it
2. src - object to have fields copied from
3. fields - array of strings of keys to have copied
4. copyFields - defaults to false, if true will deep copy the fields

## flatten( obj, options )

Turns a deep object into a shallow object with keys to represent placement of deep values

1. obj - object to be flattened
2. options - value to separate keys

## unflatten( data, opts )

Takes a shallow object and transforms it into a deep array

1. data - the object to be unflattened
2. opts - divider of the keys in data

## toPathValue( obj )

Returns an array of path and value objects from the obj

## fromPathValue( arr ) 

returns a deep object of the path value array

## pathValue( arr, path, dValue ) 

Scans arr for the path and returns the corresponding value.
