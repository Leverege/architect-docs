
This library creates a flexible Factory object.

# Installation

```
npm install --save @leverege/factory
```

# Usage

Include the library in your module:

```
const Factory = require( '@leverege/factory' )

const f = new Factory()
// Register your types
f.add( 'myType', MyTypeMsg )
f.add( 'myOtherType', MyOtherTypeMsg )

const json = { type : 'myOtherType', value : 5 }
const msg = f.create( json )

// At this point msg was created by calling new MyOtherMsg( json ) if MyOtherMsg
// is a Class, otherwise it is the result of MyOtherMsg( json )
```

The Factory.create() method can take multiple arguments, depending on your particular factory needs. If can be invoked with an object as shown above, or with a the type string directly with extra arguments:

```
const f = new Factory( Factory.ARGS )
f.add( 'someMsg', SomeMsg )
const msg = f.create( 'someMsg', param1, param2 )
```
# Options

You can create a factory by calling `new Factory( strategy )` or `new Factory( options )` where the options are defined as

| Option | Default | Description |
| ------ | ------- | ----------- |
| name | `'Factory'`    | Name used in errors |
| typeKey | `'type'` | The field name used when extracting the lookup type from an object |
| registry | `null` | Map of type to object. This is like calling add() with key/value |
| defaultObject | `null` | Default object to used if none is registered for the type |
| strategy | `Factory.All` | The creation strategy |

# Strategies

There are several different strategies for creating the resulting object, and you can write your own, if needed.

## Factory.All

This is the default strategy. It will pass all arguments given to `create()` into
the Class/function. So, assuming `json.type` maps to a `Clazz`.

`f.create( json )` invokes `new Clazz( json )`  
`f.create( json, 'hello' )` invokes `new Clazz( json, 'hello' )`  
`f.create( json, 'hello', props )`  invokes `new Clazz( json, 'hello', props )`  


## Factory.ARGS

This strategy would normally be used when the type and data to process aren't contained in the same object. It will pass all arguments given to `create()` after the type into the Class/function. 

`f.create( type )` invokes `new Clazz( )`  
`f.create( type, 'hello' )` invokes `new Clazz( 'hello' )`  
`f.create( type, 'hello', props )` invokes `new Clazz( 'hello', props )`  

## Factory.NONE

In this strategy, no args are passed to the Class/Function

`f.create( type )` invokes `new Clazz( )`  
`f.create( type, 'hello' )` invokes `new Clazz( )`  
`f.create( type, 'hello', props )` invokes `new Clazz( )`  


## Factory.LOOKUP

When using this strategy, the Factory acts as a lookup, and `Factory.create()` is the same as `Factory.get()`. The registered object is just returned

`f.create( type )` invokes `Clazz`  
`f.create( type, 'hello' )` invokes `Clazz`  
`f.create( type, 'hello', props )` invokes `Clazz`  

## Factory.MERGE

This strategy is a variant of the ARGS strategy. The type/object is merged into the first parameter.

`f.create( json )` invokes `new Clazz( { model : json } )`  
`f.create( json, { value : 1 } )` invokes `new Clazz( { model : json, value : 1 } )`  
`f.create( json, { value : 1 }, props )` invokes `new Clazz( { model : json, value : 1 }, props )`  

`Factory.MERGE` uses `'model'` as the merge key. If you wish to make it something else, use the `Factory.mergeStrategy( 'otherName' )` to create a custom merge strategy.

## Custom Strategy

You can define your strategy by passing your own function in via the options.
The function be invoked with:
```
  // factory is the invoking factory
  // clzz is the item registered against the type
  // typeOrObj is the first argument into create
  // ...args the remaining objects
  strategy( factory, clzz, typeOrObj, ...args )
```

## Factory.reactStrategy

This is a strategy that will treat the first and second arguments passed into 
`create()` as props. The first argument will be merged into the second (the props) at
a specified field name ( defaults to `'model'` ). For this to work, you must supply the
React object to the strategy as well:

```
import React from 'react'

const f = new Factory( Factory.reactStrategy( React, 'model' ) )
f.add( 'myComponent', MyComponent )

const myDataItem = { type : 'myComponent', data : 'values' }

...

<div>
  {f.create( myDataItem, { prop1 : 1, prop2 : 2 } )}
</div>

// will result in
<div>
  <MyComponent model={myDataItem} prop1={1} prop2={2}/>
</div>
```

