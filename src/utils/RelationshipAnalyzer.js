import Relationships from './Relationships.js'
import ImagineRelationship from './ImagineRelationship.js'

const routes = []
/**
 * 
 */
async function run( opts, blueprints ) {
  if ( blueprints == null || blueprints.length === 0 ) {
    return
  }

  const options = {
    systemId : opts.systemId,
    typeMap : blueprints[0].blueprints,
    blueprints,
    baseUrl : opts.baseUrl
  }

  const phases = [ 'setup' ]
  for ( let pn = 0; pn < phases.length; pn++ ) { 
    const phase = phases[pn]
    for ( let n = 0; n < blueprints.length; n++ ) {
      const blueprint = blueprints[n]
      
      // Root level things are all one to manys
      const relationship = new ImagineRelationship( {
        path : blueprint.type,
        objectType : blueprint.type,
        systemId : options.systemId,
        refPath : `:systemId/${blueprint.type}`,
        urlPath : `${options.baseUrl}/${blueprint.type}`,
        parentBlueprint : null, 
        blueprint, 
        attribute : null,         
        chain : [ blueprint ]
      } )
      // eslint-disable-next-line no-await-in-loop
      await process( opts, relationship, options, phase )
    }
  }
  return routes
}

// Process the attributes of a the current blueprint
async function processAttributes( opts, rel, options, phase ) {
  const { blueprint } = rel
  for ( let n = 0; n < blueprint.attributes.length; n++ ) {
    const attr = blueprint.attributes[n] 
    if ( !attr.isRelationship( ) ) {
      continue
    }
    // const next = rel.isGroup ? `:${rel.blueprint.type}Id/${attr.path}` : attr.path
    const relationship = rel.createChild( attr.path, {
      name : attr.name,
      objectType : attr.targetBlueprint.type,
      relationshipType : attr.relationshipType,
      systemId : rel.systemId,
      parentBlueprint : rel.blueprint, 
      blueprint : attr.targetBlueprint, 
      attribute : attr,         
      chain : [ ...rel.chain, attr ]
    } )
    Relationships.add( relationship )
    routes.push( relationship )

    // eslint-disable-next-line no-await-in-loop
    await process( opts, relationship, options, phase )
  }
}

async function process( opts, relationship, options, phase ) {
  if ( phase === 'setup' ) {
    Relationships.add( relationship )
  } else {
  }
  return processAttributes( opts, relationship, options, phase )

}

export default {
  run
}
