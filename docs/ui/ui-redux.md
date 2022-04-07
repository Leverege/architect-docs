
UI-redux contains some commonly used front end functionality and integrates it with redux to make it easily used across and app.

## Installation

```
npm install @leverege/ui-redux --save
```

## Reducer Setup

When creating the reducers, include the InterfaceReducer

```
import { combineReducers } from 'redux' 
import { SelectReducer, UIReducer } from 'ui-redux'
...

const reducers = combineReducers( {
  ...
  select : Select,
  ui : UI
} )

export default reducers

```

## Actions and Access

### select

`select` is a reducer responsible for maintaining arrays (groups) of items that have been selected. 

```
import { select } from '@leverege/ui-redux'

dispatch( select.add( UUID, myGroup ) )
```

the methods on `select` are

1. add( ids, group ) - adds ids to the specified group
2. set( ids, group ) - changes the group to be the ids provided
3. remove( ids, group ) - removes the ids from the group
4. toggle( ids, group ) - if in group, removes id, if not in group adds id; for each id
5. clear( group ) - resets the group to no selection
6. clearAll() - resets all groups to no selection
7. isSelected( groupData, id ) - checks if an item is in a group
8. count( groupData ) - count of the number of items in a group
9. isEmpty( groupData ) - checks if group is empty

### UI

`UI` is a simple reducer that maintains keys.

```
import { UI } from '@leverege/ui-redux'

dispatch( UI.set( myKey, myValue ) )
```

the `UI` methods are

1. set( key, value ) - sets the value of the key
2. multiSet( keyValue ) - object that has all of its keys and values set






# Removed

ReduxForm was removed so ui-redux does not have to depend on ui-elements. It its
code is here, if need. 

```

import { Form, FormValidator } from '@leverege/ui-elements'

import FormActions from './Form'

class ConnectedComponent {
  constructor( { setData, getData } ) {
    this.setData = setData
    this.getData = getData
  }

  setState( diff ) {
    return this.setData( diff )
  }

  get state() {
    return this.getData()
  }
}

class ReduxForm extends Form {

  setFormData = ( diff ) => {
    const { validator, id } = this.props
    return validator.dispatch( FormActions.multiSet( id, diff ) )
  }

  getFormData = () => {
    const { data } = this.props
    return data
  }

  getComponent() {
    const { validator } = this.props
    if ( !this.component ) {
      this.component = new ConnectedComponent( {
        setData : this.setFormData,
        getData : this.getFormData,
        ...validator.connectedComponent
      } )
    }
    return this.component
  }

  getValidator( ) {
    const { validator } = this.props

    if ( this.validator == null || this.validator.options !== validator ) {
      this.validator = FormValidator.create( this.getComponent(), validator, { onRevert : this.onRevert } )
    }
    return this.validator
  }
}

module.exports = ReduxForm

```
