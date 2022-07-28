import Relationship from './Relationship.js'

export default class ImagineRelationship extends Relationship {

  constructor( options, calc ) {
    const { blueprint : bp, attribute : att } = options
    super( { 
      apiName : 'imagine', 
      relationshipType : att ? att.relationshipType : 'oneToMany',
      objectType : bp.objectType,
      ...options 
    }, calc )
  }

  get name() {
    const { blueprint : bp, attribute : att } = this.options
    return att ? att.name || att.path : bp.getString( 'namePlural' ) || bp.name
  }

  get systemId() {
    return this.options.systemId
  }

  get objectTypeName() {
    return this.blueprint
  }

  get blueprint() { 
    return this.options.blueprint
  }

  get parentBlueprint() { 
    return this.options.parentBlueprint
  }

  get chain() { 
    return this.options.chain
  }

  get attribute() { 
    return this.options.attribute
  }

  getIcon( key ) {
    const { blueprint : bp, attribute : att } = this.options
    return ( att && att.getIcon( key ) ) || bp.getIcon( key )
  }

  /**
   * 
   * @param {Object} match the object containing the ids
   */
  // resolve( match ) {
  //   const r = super.resolve( match )
  //   r.interfaceUrl = this.systemId + r.ref + `/` +   
  //   return r
  // }

  // createItem( match, id ) {
  //   return super.
  // }
}
