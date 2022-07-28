import pkg from '@leverege/unit';
const { getUnitsOfType } = pkg;
/**
 * Represents an Attribute with extract convience functions
 */
export default class Attribute {

  constructor( blueprint, model ) {
    this.blueprint = blueprint
    this.model = model
  }

  get id() { return this.model.id }
  get name() { return this.model.name }
  get path() { return this.model.path }
  get parentPath() { return this.model.parentPath }
  get type() { return this.model.type }
  get source() { return this.model.source }
  get forwardData() { return this.model.forwardData }
  get isCollection() { return this.model.isCollection }
  get metadata() { return this.model.metadata }
  get targetBlueprintId( ) { return this.isRelationship() && this.model.targetBlueprintId }
  get sourceBlueprintId( ) { return this.isParent() && this.model.sourceBlueprintId }
  get relationshipType( ) { return this.model.relationshipType }
  get owned() { return this.model.owned }
  isParent() { return this.model.type === 'parentRelationship' }
  
  /**
   * Returns the tags in the model
   */
  get tags() {
    return this.model.tags || []
  }

  /**
   * Returns true if the tags include the specified tab
   */
  hasTag( tag ) {
    return this.tags.includes( tag )
  }

  /**
   * Returns the first tag starting with the prefix
   * If strip is true, this will return the value of the 
   * tag after the prefix
   */
  getTagStartingWith( prefix, strip ) {
    const arr = this.model.tags
    if ( arr == null ) {
      return null
    }
    const val = arr.find( t => t.startsWith( prefix ) )
    if ( val && strip ) {
      return val.substring( prefix.length )
    }
    return val
  }

  /**
   * Returns all tags starting with the prefix
   * If strip is true, this will return the value of the 
   * tag after the prefix
   */
  getTagsStartingWith( prefix, strip ) {
    let arr = this.model.tags
    if ( arr == null ) {
      return []
    }
    arr = arr.filter( t => t.startsWith( prefix ) )
    if ( arr.length > 0 && strip ) {
      return arr.map( val => val.substring( prefix.length ) )
    }
    return arr
  }

  /**
   * Returns the blueprint object for the type of object this
   * attribute is pointing at. This will return null if the attribute
   * is not a relationship or the blueprint is not in the blueprints lookup.
   */
  get targetBlueprint() {
    const tid = this.targetBlueprintId
    return ( tid == null ) ? null : this.blueprint.blueprints.get( tid )
  }

  /**
   * Returns the parent relationships' blueprint object. This will return null if the attribute
   * is not a relationship or the blueprint is not in the blueprints lookup.
   */
  get parentRelationshipBlueprint() {
    const sid = this.sourceBlueprintId
    return ( sid == null ) ? null : this.blueprint.blueprints.get( sid )
  }

  get searchType() {
    switch ( this.model.type ) {
      case 'string': return 'string'
      case 'int': 
      case 'number': 
      case 'percent': return 'number'
      case 'boolean': return 'boolean'
      case 'timestamp': return 'date'
      case 'geoPoint': return 'geoPoint'
      case 'geoJson': return 'geoShape'
      case 'shape': return 'shape'
      case 'ip': return 'ip'
      case 'relationship': return 'string'
      case 'parentRelationship': return 'string'
      case 'enum': return 'string'
      case 'resourceEnum': return 'string'
      default: return 'number' // all else is a unit....
    }
  }

  isRelationship() { return this.type === 'relationship' }
  isParentRelationship() { return this.type === 'parentRelationship' }
  isOneToOne( ) { return this.isRelationship() && this.model.relationshipType === 'oneToOne' }
  isOneToMany( ) { return this.isRelationship() && this.model.relationshipType === 'oneToMany' }
  isManyToOne( ) { return this.isRelationship() && this.model.relationshipType === 'manyToOne' }
  isManyToMany( ) { return this.isRelationship() && this.model.relationshipType === 'manyToMany' }

  /**
   * Returns true if the attribute is a unit
   */
  isUnit() {
    return getUnitsOfType( this.model.type ) != null
  }

  /**
   * Returns an icon for the attribute, looked up from metadata.icons
   */
  getIcon( type ) {
    return this.model?.metadata?.icons?.[type]
  }

  /**
   * Returns an icon for the attribute, looked up from metadata.strings
   */
  getString( type ) {
    return this.model?.metadata?.strings?.[type]
  }
}
