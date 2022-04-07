/**
 * Shell like things can go in here. I mostly created this to make it
 * easier to push and pop around the directory trees for repo-init. It
 * might make sense to add other things in here to make writing node CLI
 * commands a little less painful.
 */
const fs = require( 'fs' )
const process = require( 'process' )

const dirStack = []

/**
 * Simple wrapper functions for debugging.
 */
const cwd = () => {
  return process.cwd()
}

const chdir = ( dir ) => {
  return process.chdir( dir )
}

const dirs = () => {
  console.log( dirStack )
}

const pushd = ( dir ) => {
  if ( !dir ) {
    throw new Error( 'pushd: no other directory' )
  }

  dirStack.push( cwd() )
  chdir( dir )
}

const throwIfEmptyStack = () => {
  if ( dirStack.length === 0 ) {
    throw new Error( 'popd: directory stack empty' )
  }
}

const popd = ( all ) => {
  throwIfEmptyStack()
  chdir( dirStack.pop() )
}

const popdAll = () => {
  throwIfEmptyStack()
  chdir( dirStack[0] )
  dirStack.length = 0
}

const fileExists = ( file ) => {
  let fileRoot
  if ( fs.existsSync( file ) ) {
    fileRoot = cwd()
    return fileRoot
  }
  return null
}

/**
 * This function will do a downwards (and at root) traversal of a dir looking for the
 * specified file checking only the supporting dirs provided
 * TODO: make recursive so that it breadth first traversal max levesl
 */
const findFile = ( file, startDir, dirs = [] ) => {
  let fileRoot
  chdir( startDir )

  // Check root
  if ( fs.existsSync( file ) ) {
    fileRoot = cwd()
    chdir( '..' )
    return `${fileRoot}/${file}`
  } 

  for ( let i = 0; i < dirs.length; i++ ) {
    try {
      chdir( dirs[i] )
      fileRoot = fileExists( file )
      chdir( '..' )
      if ( fileRoot ) break;
    } catch ( err ) {
      console.log( 'lousy supporting dirs - trying other srcDirs' )
    }
  }

  // back to the root
  chdir( '..' )

  if ( !fileRoot ) {
    throw new Error( `findFile: ${file} not found` )
  }

  return `${fileRoot}/${file}`
}

module.exports = {
  dirs,
  pushd,
  popd,
  popdAll,
  fileExists,
  findFile,

  cwd,
  chdir,
}
