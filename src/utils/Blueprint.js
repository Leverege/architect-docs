import Attribute from './Attribute.js'

// Defines the required type of specific named attributes
const nameType = { 
  name : 'string',
  geoPosition : 'geoPoint',
  icon : 'string'
}

const CACHE = { }

/**
 * Given a Blueprint, this will create attributes for each blueprint attribute
 */
export default class Blueprint {

  constructor( model, options = { } ) {
    const { useAliases = true, blueprints } = options
    const { id, alias } = model

    this.type = ( useAliases && alias ) ? alias : id
    this.historyType = `${this.type}.history`
    this.model = model
    this.options = options
    this.blueprints = blueprints
    this.analysis = {
      namedAttributes : { },
      attributes : { hidden : [], local : [], child : [], parent : [] }
    }
    this.attributes = ( this.model.attributes || [] ).map( ( attr ) => { return new Attribute( this, attr ) } )
    this.itemize()    

    CACHE[this.type] = this
  }
  
  static getByType( type ) { return CACHE[type] }
  static getAll( ) { return { ...CACHE } }

  get id() { return this.model.id }
  get name() { return this.model.name }
  get namePlural() { return this.getString( 'namePlural' ) || this.model.name }
  get alias() { return this.model.alias }
  get metadata() { return this.model.metadata }
  
  getAttribute( path ) {
    return this.attributes.find( attr => attr.path === path )
  }

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
   * Returns true if the blueprint has any relationships
   */
  hasRelationships( ignoreOneToOne = false ) {
    if ( ignoreOneToOne ) {
      return this.attributes.some( attr => attr.isRelationship() && !attr.isOneToOne() )
    }
    return this.attributes.some( attr => attr.isRelationship() )
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

  /**
   * This looks at the attributes and puts them into groups of not shown,
   * local, child and parent (1-N). This leaves the attributes as
   * they are (api-attributes)
   */
  itemize() {
    const { hidden, local, child, parent } = this.analysis.attributes
    // const { roles = [ 'user' ] } = this.options
    const attributes = this.attributes
    // const excludeFrom = roles ? roles.map( role => `excludeFrom:${role}` ) : []

    // const iconAttr = this.getIconAttr( key )
    // if ( iconAttr ) {
    //   this.setNamedAttribute( 'icon', iconAttr )
    // }
    let possName, possGeoPosition

    for ( let n = 0; n < attributes.length; n++ ) {
      const attr = attributes[n]
      const { path, type, isCollection, relationshipType, forwardData } = attr
      const tags = attr.tags || []

      if ( isCollection ) {
        // skipping collections for now
        hidden.push( attr )
      } else if ( tags.includes( 'is:hidden' ) ) { // || tags.some( tag => excludeFrom.includes( tag ) ) ) {
        // old attribute perhaps - or techy field - dont include it
        hidden.push( attr )
      } else if ( type === 'relationship' && relationshipType === 'oneToOne' ) {
        if ( forwardData ) {
          child.push( attr )
        } else {
          hidden.push( attr ) // maybe put this into parent
        }
      } else if ( type === 'parentRelationship' ) {
        // reference to parent. we can add some local attributes
        parent.push( attr )

        const names = attr.getTagsStartingWith( 'attribute:', true )
        names.forEach( ( name ) => {
          if ( nameType[name] == null || nameType[name] === attr.type ) {
            this.setNamedAttribute( name, attr )
          }
        } )
      } else {
        // TODO: Remove these in favor of 'attribute:name' and 'attribute:geoPosition'
        const isName = type === 'string' && tags.includes( 'is:name' )
        const isGeoPosition = type === 'geoPoint' && tags.includes( 'is:geoPosition' )
        local.push( attr )

        if ( isName ) { 
          this.setNamedAttribute( 'name', attr ) 
        } else if ( path === 'name' && type === 'string' && possName == null ) {
          possName = attr
        }
        if ( isGeoPosition ) { 
          this.hasGeoPosition = true
          this.setNamedAttribute( 'geoPosition', attr ) 
        } else if ( path === 'position' && type === 'geoPoint' && possGeoPosition == null ) { 
          this.hasGeoPosition = true
          possGeoPosition = attr
        }

        // Set names for all the named attributes
        const names = attr.getTagsStartingWith( 'attribute:', true )
        names.forEach( ( name ) => {
          if ( nameType[name] == null || nameType[name] === attr.type ) {
            this.setNamedAttribute( name, attr )
          }
        } )
      }
    }

    if ( this.analysis.namedAttributes.geoPosition ) {
      this.analysis.namedAttributes.geoPosition.isGeoPosition = true
    } else if ( possGeoPosition ) {
      this.analysis.namedAttributes.geoPosition = possGeoPosition
      possGeoPosition.isGeoPosition = true
    }
    if ( this.analysis.namedAttributes.name == null && possName ) {
      this.analysis.namedAttributes.name = possName
    } 
  }

  setNamedAttribute( name, attr ) {
    if ( this.analysis.namedAttributes[name] ) {
      // eslint-disable-next-line no-console
      console.log( 
        `Warning, attribute '${name}' has already been specified`, 
        this.analysis.namedAttributes[name], 
        attr )
    } else {
      this.analysis.namedAttributes[name] = attr
    }
  }

  getDataSource() {
    return null
  }

  getHistoryDataSource() {
    return null
  }

  getIconAttr( type ) {
    const icon = this.model?.metadata?.icon
    if ( icon ) {
      return {
        name : 'icon',
        displayName : 'Icon',
        objectType : type,
        valueType : 'string', // should it be 'icon'?
        get : ( ) => { return icon }
      }
    }
    return null
  }

  calculatePathLengths( blueprints ) {
    // if ( this.pathLengths ) {
    //   return this.pathLenghts
    // }
    // if ( this.attributes.child.length === 0 ) {
    //   this.
    // })
  }
}
