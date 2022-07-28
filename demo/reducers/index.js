import { combineReducers } from 'redux'

const reducers = ( { history } ) => combineReducers( {
  temp : ( a = { } ) => a 
} )

export default reducers
