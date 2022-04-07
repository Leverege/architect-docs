
This library has several functions, it generates various types of UUIDs. In addition this library has a simple interface for encoding and decoding base 62.

## Install

```
npm install @leverege/base62-util --save
```

## Usage

```
let B62 = require('@leverege/base62-util' )

console.log( 'v4', B62.v4() )
console.log( 'v1', B62.v1() )

let s = 'my-string'
let p = 'b62:'
let e = B62.encode( s, p )
let d = B62.decode( e, p )

console.log( 'encode', e )
console.log( 'decode', d )
```
**Result**

```
v4 7ofXDw8naj2j3X844FYHMM
v1 507UkVScUVn99HX6k2s0f1
encode b62:CO5mtg126i3l
decode my-string
```


