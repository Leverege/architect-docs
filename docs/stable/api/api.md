---
id: api
title: API
---

The Leverege Api Library was created for developers, external servers and web pages to quickly interface with the Leverege REST API. The api library provides chains of properties methods that often return promises which represent the result of a corresponding api calls.  

## api-service

The api-service library forms a wrapper around the api library. The api-service library should be used instead of the api-library in all environments that are not run in a browser. The wrapper adds `node-fetch` and uses it for all its queries. In addition to this, the wrapper adds support for OAuth Key/Secret access.

## Setup

Currently, access libraries only exist in Javascript and libraries for other languages are coming soon. Create a new node project and install the `@leverege/api` library for developing in web settings, or `@leverege/api-service` for developing in Node.js settings.  

```bash
npm install --save @leverege/api 
```

or 

```bash
npm install --save @leverege/api-service
```

Import the library into a node file in the project:

```js
const Api = require( '@leverege/api' )
```    

or 

```js
const Api = require( '@leverege/api-service' )
```    

## Authentication

To obtain access to the Leverege api, authentication is required. There are two major types of authentication, OAuth Key/Secret, and username/password.

### OAuth Key/Secret

> **Note: @leverege/api-service must be used for key/secret authentication**

To begin, create an Api Access Key. Login to the Leverege UI, Select the `Settings` option on the lower left and press the `Add Api Access` button.

There will be a new Api Access item in the list. It is recommended to name the item with something meaningful.

Back in the node file, copy the apiKey and secret into the file as constants:
```js
const apiKey = 'YOUR_API_KEY'
const secret = 'YOUR_API_SECRET'
```
> It is recommended that the apiKey/secret are not directly committed into code and that these are set up as environment variables or command line parameters.

Next create the Api instance
```js
let api = Api.init( { host : 'https://js-imagine-api.leverege.com', apiKey, secret } )
```

### Username/Password Access

> **Note:** this is accessible in both the api and api-service libraries

In order to start using the username and password access to the api, first create an account in the User tab of your project. Clicking the add user button will prompt you for all the user information needed. Once this is completed the user can login using:

```js
const Api = require( '@leverege/api' )

const api = api.init( { host : 'https://js-imagine-api.leverege.com' } )

// username and password created
const username = 'test'
const password = 'password123'

// the id of your project
const projectId = 'test-project'

await api.login( username, password, projectId)
```

> It is recommended that the username/password are not directly committed into code and that these are set up as environment variables or command line parameters.

At this point the user can login, but they do not have access to anything. Once a user has been created, they must be given access to parts of the system in order to be able to see any data after they login.

A user can be added and given permissions on a _system_ or a _device_. In the ui a user can be given permissions on a system using the **Access** tab. To give a user permissions on a device use the [Lol](http://docs.leverege.com/docs/lol/) library.


# OpenId Connect Login

To login using an OpenId Connect server as the authentication client, you must add
an OidcClient object to your project. This would look something like:

```
  const client = await api.project( project ).oidcClients().create( { 
      name : 'Id4',
      alias : 'id4',
      discoveryUrl : 'https://demo.identityserver.io/.well-known/openid-configuration',
      clientId : 'server.code',
      clientSecret : 'secret',
    } )
```

If you want to dynamically present available OpenId clients, get the projects available
clients and make a button for each url
```
  const oidc = await api.project( projectId ).oidcClients().list()
  oidc.items.forEach( oidc => {
    const url = api.oidcLoginUrl( oidc, successUrl, failureUrl )
    // make button linking to url
  })
```

If you have assigned aliases to the OidcClients, you can simply make a link using the
projectId and alias:
```
  const url = api.oidcLoginUrl( { projectId, alias : 'google' }, successUrl, failureUrl )
}

On successful login, the successUrl will be called with 'token' as a query parameter. Call
``` api.setToken( token ) ``` to set the header. You should now be able to make Api queries.

When an OpenId User firsts logins in, the system will construct a new User for that OpenId. TO give that user permissions prior to them loggin in, the PendingUser calls can be used. To add a PendingUser:

```
await api.project( prjId ).pendingUsers().add( {
  issuer : 'https://accounts.google.com',
  emailOrName : 'me@there.com',
  perm : 'role',
  permValue : 'user',
  contextType : 'system', // project, system, or device
  contextId : systemId // the id of the project, system or device
} )
```

To Remove the user, send the exact parameters to delete()
```
await api.project( prjId ).pendingUsers().delete( {
  issuer : 'https://accounts.google.com',
  emailOrName : 'me@there.com',
  perm : 'role',
  permValue : 'user',
  contextType : 'system', // project, system, or device
  contextId : systemId // the id of the project, system or device
} )
```

To see the PendingUsers permissions, call list()

```
ap.project( prjId ).pendingUsers().list()

## Making Calls

At this point, we're ready to make some calls into the platform. As a note, many of these calls require a projectId, which can be found on the same **Settings** page that the Api Access Keys are made. The final code looks like this:

```js
const Api = require( '@leverege/api-service' )

const apiKey = 'YOUR_API_KEY'
const secret = 'YOUR_API_SECRET'

let api = Api.init( { apiKey, secret })
``` 

Most calls in the Api return a Promise. The pattern used when making calls will look something like this:

```js
  let result
  try {
    result = await api.project( projectId ).get()
  } catch ( ex ) {
    // do something
  }
  // data
```

See further documentation for all available calls.
