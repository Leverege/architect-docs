// const Secrets = require( '@leverege/secrets' )
import * as dotenv from 'dotenv'
import Api from '@leverege/api-service' 
import fs from 'fs-extra'

import Blueprint from '../utils/Blueprint.js'
import RelationshipAnalyzer from '../utils/RelationshipAnalyzer.js'
import Utils from '../utils/Util.js'

import device from '../assets/schemas/device.json' assert { type: 'json' };
import deviceList from '../assets/schemas/deviceList.json' assert { type: 'json' };
import deviceDelete from '../assets/schemas/deviceDelete.json' assert { type: 'json' };
import eventsHistory from '../assets/body/eventsHistory.json' assert { type: 'json' };
import search from '../assets/body/search.json' assert { type: 'json' };
import deviceCreate from '../assets/body/deviceCreate.json' assert { type: 'json' };
import interfaceRoutes from '../assets/routes/interface.json' assert { type: 'json' };
import rootRoutes from '../assets/routes/rootInterfaceRoutes.json' assert { type: 'json' };
import globalResponses from '../assets/responses/global.json' assert { type: 'json' }; 
import globalRefs from '../assets/responses/globalRefs.json' assert { type: 'json' }; 

dotenv.config()

const projectId = process.env.projectId
const host = process.env.host

const config = {
  host,
  apiKey : process.env.apiKey,
  secret : process.env.secret,
  projectId
}

const templateData = {
  openapi : '3.0.0',
  host, 
  basePath : '/v1',
  servers : [
    {
      url : host,
      description : 'API Server'
    }
  ]
}

const opts = {
  docPath : 'docs/api-docs.json',
  rootInterfacePath : 'v1/interface/:systemId',
  templateData
}

const api = Api.init( config )

async function main() {
  const context = buildContext()
  const generatedDocsObject = {}
  // Remove old file
  await fs.remove( opts.docPath )

  // Generate OpenAPI info headers
  generatedDocsObject.info = await getInfoObject( { context } )
  
  generatedDocsObject.server = {
    url : host,
    description : 'This is the live API server'
  }

  const list = await api.project( projectId ).blueprints().list( { children : 'attribute' } )
  const blueprints = new Map()
  const tags = []
  const parameters = {}
  const models = {}
  const bps = list.items.map( ( model ) => { 
    const bp = new Blueprint( model, { blueprints } ) 

    // buildTagsAndModels
    const { tag, apiModel, parameter } = buildOpenApiModelsAndTags( bp )
    tags.push( tag )
    parameters[tag.name] = parameter
    parameters[`${tag.name}s`] = parameter
    models[apiModel.name] = apiModel[apiModel.name]

    blueprints.set( bp.id, bp ) // look up by id
    blueprints.set( bp.type, bp ) // look up by alias if available
    return bp
  } )

  generatedDocsObject.tags = tags
  generatedDocsObject.components = {
    parameters : {
      ...parameters
    },
    responses : globalResponses,
    schemas : {
      securitySchemes : {
        bearerToken : {
          type : 'http',
          scheme : 'bearer',
          bearerFormat : 'JWT'
        }
      },
      ...models,
      Device : device,
      DeviceList : deviceList,
      DeviceDelete : deviceDelete,
    },
    requestBodies : {
      search,
      deviceCreate,
      eventsHistory
    }
  }

  const relationships = await RelationshipAnalyzer.run( { baseUrl : opts.rootInterfacePath }, bps )

  const paths = {}
  // build relationship routes
  for ( let i = 0; i < relationships.length; i++ ) {
    buildRoutes( relationships[i], interfaceRoutes, paths )
  }

  // build blueprint routes
  for ( let i = 0; i < bps.length; i++ ) {
    buildRoutes( bps[i], rootRoutes, paths )
  }

  generatedDocsObject.paths = paths
  await writeFile( generatedDocsObject )
}

function buildRoutes( apiInfo, arrayOfRoutes, paths ) {
  const routes = {}
  const baseUrl = apiInfo?.options?.urlPath || `${opts.rootInterfacePath}/${apiInfo.model.alias}`
  const tag = Utils.capitalizeFirstLetter( apiInfo?.blueprint?.type || apiInfo?.type )

  for ( let i = 0; i < arrayOfRoutes.length; i++ ) {
    
    const { summary, chain } = getSummary( arrayOfRoutes[i], apiInfo )
    const parameters = getParameters( arrayOfRoutes[i], chain.split( '.' ) )
    const responses = getResponses( arrayOfRoutes[i] )
    const requestBody = getRequestBody( arrayOfRoutes[i] )

    console.log( 'requestBody', requestBody )
    
    if ( arrayOfRoutes[i].addToRoute ) {
      const temp = apiInfo?.type || apiInfo?.objectType
      const replaceAlias = arrayOfRoutes[i].addToRoute.replace( 'ALIAS', `${temp}Id` )
      paths[`${baseUrl}${replaceAlias}`] = {
        [arrayOfRoutes[i].type] : {
          summary,
          tags : [ tag ],
          parameters,
          responses,
          requestBody
        }
      } 
    } else {
      routes[arrayOfRoutes[i].type] = {
        summary,
        tags : [ tag ],
        parameters,
        responses,
        requestBody
      } 
    }
  }
  paths[apiInfo.options.urlPath] = routes
}

function getRequestBody( route ) {
  if ( route.requestBody ) {
    return { $ref : `#/components/requestBodies/${route.requestBody}` }
  }
  return {}
}

function getResponses( route ) {
  return globalRefs[route.response]
}

function getParameters( route, arrayOfParams ) {
  const parameters = []

  console.log( 'arrayOfParams', arrayOfParams )

  if ( route.parameters === false ) return parameters
  arrayOfParams.forEach( ( alias ) => {
    parameters.push( {
      $ref : `#/components/parameters/${Utils.capitalizeFirstLetter( alias )}`
    } )
  } )
  return parameters
}

function getSummary( route, apiInfo ) {
  let summary = route?.summaryStart || Utils.capitalizeFirstLetter( route.type )

  // console.log( apiInfo )
  const of = ` ${Utils.capitalizeFirstLetter( apiInfo?.type || apiInfo?.options?.objectType )} `

  let through = ''  
  if ( apiInfo?.options?.path ) {
    through = ' through '  
    const words = apiInfo?.options?.path.split( '.' ) 
    for ( let i = 0; i < words.length; i++ ) {
      // special case for last word of chain
      if ( i === words.length - 1 ) {
        through += `${Utils.capitalizeFirstLetter( words[i] )} `
      } else {
        through += `${Utils.capitalizeFirstLetter( words[i] )}/`
      }
    }
  }

  const end = route?.summaryEnd ? route.summaryEnd : ''
  summary += of + through + end

  if ( apiInfo?.options?.path ) {
    console.log( apiInfo )
  }

  const chain = apiInfo?.options?.path || Utils.capitalizeFirstLetter( apiInfo.type )

  console.log( 'CHAIN', chain )
  return { summary, chain }
}

function buildOpenApiModelsAndTags( blueprint ) {
  const tag = {
    name : Utils.capitalizeFirstLetter( blueprint.type ),
    description : blueprint.model.desc
  }

  const properties = {}
  blueprint.model.attributes.forEach( ( attrib ) => {
    properties[attrib.name] = {
      type : attrib.type,
    }
  } )

  const apiModel = {
    name : blueprint.model.name,
    [blueprint.model.name] : {
      type : 'object',
      properties
    }
  }

  const parameter = {
    name : `${blueprint.type}Id`,
    description : blueprint.model.desc,
    in : 'path',
    required : true,
    schema : {
      type : 'string'
    }
  }
  return { tag, apiModel, parameter }
}

async function getInfoObject( opts ) {
  const { context } = opts
  const { imagine : { projectId } } = context 
  const proj = await context.api.project( projectId ).get()
  return { 
    title : proj.name,
    description : `${proj.name}.`,
    version : '0.0.1',
    'x-logo' : { url : 'data:image/png;base64,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'
    }
  }
}

function buildContext() {
  return {
    api,
    imagine : config,
    opts,
  }
}

async function writeFile( json ) {
  try {
    const jsonWithTemplateData = { ...opts.templateData, ...json }
    // first delete the old file
    await fs.writeFile( opts.docPath, JSON.stringify( jsonWithTemplateData ) )
  } catch ( err ) {
    console.log( 'ERROR', err )
  }
}

main().then( ).catch( err => console.log( err ) )
