// import { GlobalState, UI } from '@leverege/ui-redux'

const specialParams = {
  // persona : ( ) => { 
  //   const p = UI.get( GlobalState.get() )?.activePersona
  //   return p?.name || 'default'
  // }
}

const capitalizeFirstLetter = ( string ) => {
  return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
}

/**
 * Sets a function to return a special match param
 * @param {String} key 
 * @param {function} resolver a function that should return the value for the key
 * given the path and match as arguments
 */
const setSpecialParam = ( key, resolver ) => {
  specialParams[key] = resolver
}

/**
 * Returns the special param function installed at the key
 * @param {String} key 
 * @returns the function for the key
 */
const getSpecialParam = ( key ) => {
  return specialParams[key]
}

/**
 * Returns the special param functions 
 * @returns and object of all the function for the key
 */
const getSpecialParams = ( ) => {
  return specialParams
}

const EMPTY = {}

/**
 * Replaces all :name arguments in the path with their
 * values in match.params
 */
const resolve = ( path, match, extraParams ) => {
  if ( path == null || ( match == null && extraParams ) || match.params == null ) {
    return path
  }

  const params = match.params || EMPTY
  const extra = extraParams || EMPTY
  const arr = path.split( '/' )
  for ( let n = 0; n < arr.length; n++ ) {
    if ( arr[n][0] === ':' ) {
      const key = arr[n].substring( 1 )
      if ( specialParams[key] ) {
        try {
          arr[n] = specialParams[key]( path, match )
        } catch ( err ) {
          // eslint-disable-next-line no-console
          console.log( err )
          arr[n] = params[key] || null
        }
      } else if ( params[key] ) {
        arr[n] = params[key]
      } else if ( extra[key] ) {
        arr[n] = extra[key]
      } 
    }
  }
  return arr.join( '/' )
}

/**
 * Returns the last id in the path, using match.params to
 * get its value. For example, a path of 'a/:aId/b/:bId/c'
 * would return match.params['bId']. If there is no id, 
 * null will be returned.
 */
const getLastId = ( path, match ) => {
  const { params } = match
  // eslint-disable-next-line react/destructuring-assignment
  const arr = path.split( '/' )
  for ( let n = arr.length - 1; n > 0; n-- ) {
    if ( arr[n][0] === ':' ) {
      const key = arr[n].substring( 1 )
      return params[key]
    }
  }
  return null
}

export default {
  setSpecialParam,
  getSpecialParam,
  getSpecialParams,
  resolve,
  getLastId,
  capitalizeFirstLetter
}
