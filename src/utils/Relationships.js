let pathCache = { }
let relationships = []

function add( rel ) {
  relationships = Object.freeze( [ ...relationships, rel ] )
  pathCache = Object.freeze( { ...pathCache, [rel.path] : rel } )
}

function getByPath( path ) {
  return pathCache[path]
}

function getChildByPath( rel, childPath ) {
  return pathCache[`${rel.path}.${childPath}`]
}

function getAllByPath( ) { return pathCache }
function getAll( ) { return relationships }

export default {
  add,
  getByPath,
  getChildByPath,
  getAllByPath,
  getAll
}
