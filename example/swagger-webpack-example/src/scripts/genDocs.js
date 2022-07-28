// const Secrets = require( '@leverege/secrets' )
// const execa = require( 'execa' )
const Api = require( '@leverege/api-service' )

import Blueprint from '../utils/Blueprint.js'
import RelationshipAnalyzer from '../utils/RelationshipAnalyzer.js'

const host = 'https://leverege-sandbox-imagine-api.leverege.com'
const projectId = '2FZux96zRL27lTqqmOIUF1'
const apiKey = '6SK8IGDNH6yFepwPHF7zup'
const secret = '2uAQ2R7yZpWqHrjn2zmzHw0OSCZg4G3gZ9Pm5sMxMEi82jBCu6UW6GfIhrxnhD6xK81PsjMPFZTt0qc3ez42rTro'

const config = {
  host,
  apiKey,
  secret,
  projectId
}

const api = Api.init( config )

async function main() {

  const list = await api.project( projectId ).blueprints().list( { children : 'attribute' } )
  const blueprints = new Map()
  const bps = list.items.map( ( model ) => { 
    const bp = new Blueprint( model, { blueprints } ) 
    blueprints.set( bp.id, bp ) // look up by id
    blueprints.set( bp.type, bp ) // look up by alias if available
    return bp
  } )

  const results = await RelationshipAnalyzer.run( {}, bps )
  console.log( results)


  // TODO: identity auth later
  // const { key, secret } = await getGithubTokenAndTest()
  console.log( 'Generating Docs! \n\n' )
//   await initCleanupMkdocsTemplate()
//   const file = await fs.readFileSync( './src/template.yml', 'utf8' )
//   const navData = await YAML.parse( file )

//   // generate new ones and insert them into template
//   for ( let i = 0; i < repos.length; i++ ) {
//     await fs.remove( tmpDir )
//     await fs.mkdir( tmpDir )

//     try { 
//       // This git cli is to clone the repo
//       const git = new SimpleGit( )

//       await git.clone( repos[i].url, tmpDir )

//       pushd( tmpDir )

//       // Thi git cli is to utilize the repo (old cli "sticks" to architect docs repo level)
//       const gitTemp = new SimpleGit( )
//       await checkDefaultBranches( repos[i], gitTemp )

//       // get back to root of docs dir
//       popd()
//       await insertTheDocs( repos[i], navData )

//       console.log( 'Done with: ', repos[i], '\n' )
//     // grab readMes and stick them in the right location
//     } catch ( err ) {
//       console.log( `issue with git pull ${repos[i].url} - moving on`, err )
//     }
//     const newFile = await YAML.stringify( navData )
//     await fs.writeFile( 'mkdocs.yml', newFile )
//   }

//   console.log( 'Made it here ' )
  
//   const merged = mergeYaml( [
//     'src/header.yml',
//     'mkdocs.yml',
//     'src/footer.yml'
//   ] )

//   console.log( 'Made it here - merged', merged )

//   await fs.writeFile( 'test.yml', merged )

// }

// async function checkDefaultBranches( repo, git ) {
//   if ( repo.branch ) {
//     await git.fetch( [ repo.branch ] ).checkout( [ repo.branch ] )
//   } else {
//     for ( let i = 0; i < defaultBranches.length; i++ ) {
//       try {
//         await git.fetch().checkout( [ defaultBranches[i] ] )
//         // success? move on 
//         break;
//       } catch ( err ) {
//         console.log( err )
//         console.log( `Issue with ${repo.url} || branch: ${defaultBranches[i]}`, 'trying again with a differnt branch' )
//       }
//     }
//   }
}

// async function insertTheDocs( repo, navData ) {
//   const { indexFiles, navLocation, location, files, supportingFilesDirs } = repo

//   await fs.ensureDir( `${mkdocsSrcDir}/${repo.location.join( '/' )}` )

//   for ( let i = 0; i < files.length; i++ ) {
//     const filePath = findFile( files[i], tmpDir, supportingFilesDirs ) 
//     const newDocLocation = generateLocation( mkdocsSrcDir, location.join( '/' ), indexFiles[i] )
//     await fs.move( filePath, newDocLocation, { overwrite : true } ) 

//     // Add into yaml
//     const docsLocation = `${location.join( '/' )}/${indexFiles[i]}`
//     await addYaml( navLocation[i], docsLocation, navData.nav )
//   }
// }

async function addYaml( navLocation, location, nav ) {
  // Starts with templated data
  const navLevels = navLocation.split( '/' )
  
  traverseNav( location, nav, navLevels )
}

function traverseNav( location, nav, navLevels ) {
  const current = navLevels.shift()
  const levelsLeft = navLevels.length

  const isCurrentPresent = Array.isArray( nav ) ? nav.findIndex( element => element[current] ) : -1

  // if we are doing insert
  if ( levelsLeft === 0 ) {
    if ( isCurrentPresent === -1 ) {
      nav.push( { [current] : location } )
      return
    } 
    nav[isCurrentPresent][current].push( location )
    return
  } if ( isCurrentPresent === -1 ) {
    nav.push( { [current] : [] } )
    traverseNav( location, nav[nav.length - 1][current], navLevels )
  } else {
    traverseNav( location, nav[isCurrentPresent][current], navLevels )
  }
}

function generateLocation( srcDir, location, fileName ) {
  return `${process.cwd()}/${srcDir}/${location}/${fileName}`
}

async function initCleanupMkdocsTemplate() {
  const docsTemplatePath = config.docsTemplatePath

  // first delete the old file
  await fs.remove( docsTemplatePath )

  // make new file with template file contents
  await fs.copy( 'src/template.yml', 'mkdocs.yml' )
}

// async function getGithubTokenAndTest() {
//   const secretsMgr = new Secrets( {
//     namespace : 'ARCHITECT_DOCS', // IG = InGestor
//     projectId : config.GCLOUD_PROJECT,
//   } )

//   const key = await secretsMgr.getString( 'ARCHITECT_DOCS_BITBUCKET_AUTH_KEY' )
//   const secret = await secretsMgr.getString( 'ARCHITECT_DOCS_BITBUCKET_AUTH_SECRET' )
//   return { key, secret }
// }

main().then( ).catch( err => console.log( err ) )



