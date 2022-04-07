
API redux is a front end library that uses redux thunk to make api calls and store their result in redux. It supports Auth, Interface, event, history and user calls. If set up correctly, it makes api calls immediately accessible anywhere dispatch is accessible.

## Installation

```
npm install --save @leverege/api-redux
```

## Reducer Setup

Import the reducers that you are going to use:
  * InterfaceReducer - reducer that will handle imagine interface queries
  * AuthReducer - reducer that handles authentication
  * HistoryReducer - reducer that handles queries for getting and updating imagine history
  * EventReducer - reducer that handles queries for getting and updating imagine events
  * UsersReducer - reducer that handles queries for getting and updating imagine Users

```
import { combineReducers } from 'redux' 
import { InterfaceReducer, AuthReducer, HistoryReducer, EventReducer, UsersReducer } from '@leverege/api-redux'
...

const reducers = combineReducers( {
  ...
  interface : InterfaceReducer
  auth : AuthReducer
  history : HistoryReducer
  event : EventReducer
  users : UsersReducer
} )

export default reducers

```

## Incorporate api-redux into your react component

```
import { Interface } from 'leverege/api-redux'

class MyScreen extends React.Component { 

  constructor( props ) {
    super( props )
    const { dispatch } = props
    this.items = Interface.create( system, 'myType' ).getList( interface )
    dispatch( items.list() )
  }

  render() {
    const { model } = this.props
    const items = this.items.getList( model )

    return (
      <div>
        {items.map( item => item.name )}
      </div>
    )
  }
}

export default connect(
  state => ( {
    model : state.interface
  } )
)( MyScreen );
```

## Auth
 
Auth has several methods all relating to authenticating the user and managing their password ( these need to be dispatched )

1) verify( [ targetLocation ] ) - gets and verifies the bearer token
2) login( username, password, [ projectId ] ) - logs in the user
3) logout() - logs out the user
4) forgotPassword( username, projectId ) - sends an email to the user's email address with instructions to reset their password
5) changePassword( oldPassword, newPassword ) - changes the current logged in user's password
6) resetPassword( username, password, confirm, token, projectId ) - uses an api generated token to allow a user to change their password

In addition to several methods to check the current state 

1) isLoggedIn( state ) - returns a boolean representing if there is a user logged in
2) isLoading( state ) - returns a boolean representing if a Auth query is loading
3) isVerifying( state ) - returns a boolean representing if a verify query is loading
4) isError( state ) - returns a boolean representing if there was an Auth error
5) getErrorMessage( state ) - returns the last error message
6) getUsername( state ) - returns the current user's username
7) getUserId( state ) - returns the current user's imagine userId
8) getProfile( state ) - returns the current user's profile

## Users

Users has several methods all relating to maintaining and giving permissions to users ( these need to be dispatched; almost all the methods are for admins, but some allow for the user to make changes to themselves )

1) list( opts ) - gets all the current users for the project
2) create( user ) - creates a new project user
3) get( userId, opts ) - gets a user
4) remove( userId ) - removes a user
5) update( userId, values, opts ) - updates the user with the values
6) forcePWReset( userId, projectId ) - sends an email to the user to reset their password

## Interface

Interface is used to interact with devices and groups on the system and corresponds to the Interface queries. it is possible to chain together objects and groups to get a desired device. 

### create
create( systemId, blueprintAlias ) - creates an Interface object with several methods

  1) list( options ) - makes an api call to get all the devices in the system with the blueprintAlias
  2) create( device, options ) - makes an api call to create a device 
  3) delete( id, options ) - makes an api call to delete a device
  4) model( options ) - makes an api call to get the model
  
  1) obj( id ) - creates an instance of the Obj class with the id
  2) getList( state, opts ) - gets the list from the state
  3) getModel( state, opts ) - gets the model from the state
  4) isLoading( state, opts ) - returns a boolean based on if there is a query being made
  5) isError( state ) - returns a boolean based on if there was an error for a query
  6) isDone( state ) - returns a boolean based on if a query is finished

### Object
Obj( parentPath, deviceId, attribute ) - creates an instance of the Obj class
- created by `Interface.create( 'mySystem', 'myBP' ).obj( 'myDeviceId' )` which will correctly manage the path for you

This class is used to interact with the api for a specific device

1) get( options ) - makes an api call to get the device
2) history( query, options ) - makes an api call to get the history for the device. query is an object with a queryName and query object, refer to history documentation for how to structure the query
4) create( device, options ) - creates a child device
5) update( obj, options ) - updates the current device
6) delete( options ) - deletes the current device
7) model( options ) - gets the model for the current device
8) obj( id ) - new instance of the Obj class pointed at the new device
9) grp( attribute ) - new instance of the Grp class, attribute should be a relationship attribute
10) users() - gets all the users permissioned on the device
11) getObject( state ) - gets the device from the state after an api call has been made
12) getTable( state, opts ) - gets the table for the device from the state after an api call
13) getModel( state, opts ) - gets the model from the state after an api call
14) getHistory( state, queryName ) - gets the history query result corresponding to the queryName
15) isTable( state ) - boolean on whether the api result is a table
16) isLoading( state ) - boolean on whether an api call is being made
17) isError( state ) - boolean on whether an api call returned an error
18) isDone( state ) - boolean on whether an api call is done

### Group
Grp( parentPath, deviceId, attribute ) - creates an instance of the Grp class
- created by `Interface.create( 'mySystem', 'myBP' ).obj( 'myDeviceId' ).grp( 'myChildDevices' )` which will correctly manage the path for you

A group represents a group of devices often by their relationship to a parent device

1) list( options ) - api call to get the list of the group of devices
2) create( obj, options ) - api call to create a new device for the group
3) get( id, options ) - api call to get a specific device from the group
4) update( id, data, options ) - api call to update a specific device from the group
5) delete( id, options ) - deletes a device
6) model( options ) - gets the model for the devices
7) obj( id ) - Obj class Instance
8) getList( state, opts ) - gets the list from the state
9) isTable( state, opts ) - returns a boolean based on if the api call result is a table
10) getObject( state, id, opts ) - returns a device from the state
11) getModel( state ) - returns the model from the state
12) isLoading( state ) - returns if an api call is loading
13) isError( state ) - return if an api call made an error
14) isDone( state ) - returns if an api call is finished

### Filters
You can install custom filter functions by calling
```
Interface.setFilter( 'myFilterType', ( filter, items ) => { 
  return items.filter( item => item.whatever == filter.myOption )
} )
```