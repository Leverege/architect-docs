import Util from './Util.js'

export default class Relationship {

  constructor( opts, calc ) {
    this.options = { 
      isGroup : opts.relationshipType !== 'oneToOne', 
      idKey : opts.idKey || `${opts.objectType}Id`,
      ...opts, 
    }
    if ( !this.options.isGroup && this.options.parent == null ) {
      throw Error( 'Root Relationships cannot be oneToOne' )
    }

    this.calc = calc || {}
  }

  /**
   * The unique api name to which the Relationship belongs
   */
  get apiName() { return this.options.apiName }

  /**
   * The human readable name of the Relationship
   */
  get name() { return this.options.name }

  /**
   * The unique path of the Relationship, This might include the data source
   * main interface name. For Example: 'myApi.dealer.vehicles'
   */
  get path() { return this.options.path }

  /**
   * Returns the part of the path this relationship Relationship contributes. (eg : 'vehicles')
   * This will be used as the id in a oneToOne objRef
   */
  get subpath() { return this.options.subpath }

  /**
   * The parameterized path of the Relationship, including personas
   * and other url variables. For example, '/p/:persona/dealer/:dealerId/vehicles'
   */
  get urlPath() { return this.options.urlPath }

  /**
   * The parameterized path of the ref used to construct an ObjectRef. This ref
   * indicates how to get to the parent item holding the objRef Item. For 
   * example, 'dealer/:dealerId/vehicles'
   */
  get refPath() { return this.options.refPath }

  /**
   * The parameterized path to the item referenced by the objRef. This will contain 
   * both the refPath and the id. For example: '/dealer/:dealerId/vehicles/:vehicleId'
   */
  get objRefUrlPath() {
    if ( this.options.objRefUrlPath == null ) {
      const key = this.isGroup ? `:${this.options.idKey}` : this.subpath
      this.options.objRefUrlPath = `${this.refPath}/${key}`
    } 
    return this.options.objRefUrlPath 
  }

  /**
   * The resolved path to the item referenced by the objRef. This will contain 
   * both the refPath and the id. For example: 'dealer/D-1/vehicles/12345'.
   * If a match object is not present in the options, this will return null.
   * Invoke this on one of the relationships returned from createResolved( match ) or
   * createItem( match, id )
   */
  get objRefUrl() {
    if ( this.calc.objRefUrl == null && this.calc.match ) {
      this.calc.objRefUrl = Util.resolve( this.objRefUrlPath, this.calc.match, this.options )
    } 
    return this.calc.objRefUrl 
  }
  
  /**
   * The type of object at the relationship
   */
  get objectType() { return this.options.objectType }

  /**
   * The singular name of the objectType. For example, 'Vehicle'
   */
  get objectTypeName() { return this.options.objectTypeName || this.options.objectType }

  /**
   * The plural name of the objectType. For example, 'Vehicles'
   */
  get objectTypeNamePlural() { return this.options.objectTypeNamePlural || this.objectTypeName }

  /**
   * Return whether or not this relationship represents a group of objects.
   * All Relationships except oneToOne relationships are group relationships. This
   * is an indicator as to whether access to an object is through a `grouping/:childId`
   * or simply throught `grouping`. This often occurs in a relationship between an 
   * asset and a thing tracking it: `group/:groupId/asset/:assetId/tracker`
   * For Relationships where the isItem is true, the isGroup will still be true
   * if the item holding mechanism is not oneToOne.
   */
  get isGroup() { return this.options.isGroup }

  /** 
   * This returns true if the relationship does not impose ids into
   * the urls and paths. The name of the relationship is an alias for the
   * the id. This is true when the relationship is one to one and is the
   * opposite of isGroup.
   */
  get isAlias() { 
    return this.options.isGroup === false
  }

  /**
   * Return whether or not this relationship represents a item. Only Relationships
   * created via createItem() will return true
   */
  get isItem() { return this.options.isItem }

  /**
   * Returns the parent relationship if any exist. Same as this.parentRelationship
   */
  get parent() { 
    const p = this.options.parent || this.options.parentRelationship
    if ( this.match && p && p.match == null ) { 
      return p.createResolved( this.match )
    }
    return p 
  }

  /**
   * Returns the parent relationship if any exist. Same as this.parent
   */
  get parentRelationship() { return this.options.parent || this.options.parentRelationship }

  /**
   * Returns the type of the relationship, one of 'oneToOne', 'oneToMany',
   * 'manyToMany', 'manyToOne', or null, if this is the root relationship
   */
  get relationshipType() { return this.options.relationshipType || null }

  /**
   * Returns true if this is the root of a relationship hierarchy
   */
  get isRoot() { return this.relationshipType === null }

  /**
   * Returns true if this is a one to one relationship
   */
  get isOneToOne() { return this.relationshipType === 'oneToOne' }

  /**
   * Returns true if this is a one to many relationship
   */
  get isOneToMany() { return this.relationshipType === 'oneToMany' }

  /**
   * Returns true if this is a many to many relationship
   */
  get isManyToMany() { return this.relationshipType === 'manyToMany' }
   
  /**
   * Returns true if this is a many to one relationship
   */
  get isManyToOne() { return this.relationshipType === 'manyToOne' }

  /**
   * Returns the id for an relationship created with createItem( match, id )
   */
  get id() { 
    if ( this.calc.id == null && this.calc.match ) {
      if ( this.isGroup ) {
        this.calc.id = this.calc.match.params?.[this.options.idKey]
      } else {
        this.calc.id = this.subpath
      }
    }
    return this.calc.id 
  }

  /**
   * Returns ref value used in an ObjectRef. This is the resolved reference
   * to the container. This will usually return null if this 
   * relationship is not a resolved relationship. 
   */
  get ref() { 
    if ( this.calc.ref == null && this.calc.match ) {
      this.calc.ref = Util.resolve( this.refPath, this.calc.match, this.options )
    } 
    return this.calc.ref 
  }

  /**
   * Returns resolved url. This will usually return null if this 
   * relationship is not a resolved relationship. 
   */
  get url() { 
    if ( this.calc.url == null && this.calc.match ) {
      this.calc.url = Util.resolve( this.urlPath, this.calc.match, this.options )
    } 
    return this.calc.url 
  }
   
  /**
   * Returns object reference, which is an object holding the
   * id, objectType, and ref. This will usually return null if this 
   * relationship is not a resolved relationship.  
   */
  get objRef() { 
    if ( this.calc.objRef == null && this.calc.match ) {
      this.calc.objRef = {
        id : this.id,
        type : this.objectType,
        ref : this.ref
      }
    }
    return this.calc.objRef 
  }

  /**
   * Returns match used to resolved the url and ref
   */
  get match() { return this.calc.match }

  /**
   * Returns an icon to represent this relationship
   * @param {String} key the type (purpose) of icon to return
   * @returns a string representing the icon
   */
  getIcon( key ) {
    return this.options.icons?.[key]
  }

  /**
   * 
   * @param {Object} match the object containing the ids
   */
  // resolve( match ) {
  //   const ref = Util.resolve( this.refPath, match )
  //   const url = Util.resolve( this.urlPath, match )
  //   return { ref, url, match }
  // }

  /**
   * This will compute the path, refPath and urlPath based off the current
   * relationships values. 
   * @param {String} subpath the path of the child relationship
   * @param {Object} childOpts extra options for the child, such as name, objectType, relationshipType
   * @returns 
   */
  createChild( subpath, childOpts ) {
    if ( this.isItem ) {
      return this.parent.createChild( subpath, childOpts )
    }

    if ( childOpts.objectType == null || childOpts.relationshipType == null ) {
      throw new Error( 'Relationship.createChild() requires childOpts to contain a relationshipType and an objectType' )
    }
    const isOneToOne = childOpts.relationshipType === 'oneToOne'
    const isGroup = this.isGroup
    const idKey = this.options.idKey
    let refPath, urlPath
    if ( isGroup ) {
      refPath = isOneToOne ? `${this.refPath}/:${idKey}` : `${this.refPath}/:${idKey}/${subpath}`
      urlPath = `${this.urlPath}/:${idKey}/${subpath}`
    } else {
      refPath = isOneToOne ? `${this.refPath}/${this.subpath}` : `${this.refPath}/${this.subpath}/${subpath}`
      urlPath = `${this.urlPath}/${subpath}`
    }
        
    const opts = {
      refPath,
      urlPath,
      apiName : this.apiName,
      ...childOpts,
      path : `${this.path}.${subpath}`,
      subpath,
      parent : this
    }
    
    return new this.constructor( opts )
  }

  createResolved( match, extraOptions ) {
    const opts = {
      ...this.options,
      ...extraOptions
    }
    return new this.constructor( opts, { match } )
  }

  /**
   * This returns a relationship object that has isItem set to true.
   * @param {Object} match a { params, url } object from react router. This holds the ids 
   * to create a specific relationship.
   * @param {String} id the id of the item. If this is not supplied, the value in 
   * match.params[idKey] will be used
   * @returns a Relationship.
   */
  createItem( match, resourceId ) {
    const isGroup = this.isGroup
    const key = this.options.idKey
    const id = isGroup ? resourceId || match?.params?.[key] : this.subpath

    const calc = { }
    if ( match ) {
      if ( resourceId && isGroup ) {
        calc.match = { ...match, params : { ...match.params, [key] : resourceId } } 
      } else {
        calc.match = { ...match }
      }
      if ( id ) {
        calc.id = id
      }
    } 

    if ( this.isItem ) {
      // Rebind to a new match context
      return new this.constructor( this.options, calc )
    }
    
    const refPath = this.refPath
    let urlPath = this.urlPath
  
    if ( isGroup ) {
      // We are a group, which uses keys. Add that to the url and ref path
      urlPath = `${urlPath}/:${key}`
    } 

    const opts = {
      ...this.options,
      parent : this,
      isItem : true,
      urlPath,
      refPath
    }
  
    const itemRel = new this.constructor( opts, calc )
    return itemRel
  }
}
