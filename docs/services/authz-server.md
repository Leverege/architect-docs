# Authz Server

This server acts as an authorization server. The JWT Token is used to identify the user making the request.
This is currently driven by the Config.js file, as shown below:

```
jwtOptions : {
  issuers : {
    <JWT Token iss field> : {    
      secret : <shared secret with issuer>,
      domain : <simple domain>
    },
    imagine : {    
      secret : 'sheepie-sheepie-in-the-sky',
      domain : 'imagine'
    }
  }
} 
```

The JWT token must be signed using the secret supplied in the config file.

Between the end user and the resources sits a Resource Service (RS). The RS is responsible for 
determining who and what can be set by their users/services. The RS is uses the JWT signed
with the shared secret to communicate these changes to the Authz Service. The RS, normally
using the authz-api, will check that a user is allowed to perform some permission on its resources,
and the perform it if the user is allowed.

```
  app.get( '/project/:projectId/script/:scriptId', can( Permissions.scriptRead ), getAndReturnScript )
```

To give a user permission permission, the RS should also supply a way to allow users to be assigned
roles within the Authz, and potentially create custom roles, permissions and modules.


# Role

| Method | Path | Description | Body/Query |
|--------|------|-------------|------------|
| POST | /v1/role | Create a new role | CreateRole |
| GET | /v1/role/ | List multiple roles with options | QueryRole |
| GET | /v1/role/:roleId | Get role with the given Id | - |
| PATCH | /v1/role/:roleId | Update an existing role | UpdateRole |
| DELETE | /v1/role | Delete multiple roles | DeleteRoles |
| DELETE | /v1/role/:roleId | Delete the role with the given Id | - |
| POST | /v1/role/:roleId/permissions | Add/Set Permissions on a Role | AddPermissions |
| DELETE | /v1/role/:roleId/permissions | Remove Permissions from a Role | RemovePermissions |
| DELETE | /v1/role/:roleId/permissions/:permissionId | Remove an Permission from a Role | - |

## CreateRole

| Field | type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | The name of the role. Roles created for  |
| projectId | string | Yes | The project Id |
| displayName | string | No | The human readable name. Default to name if null |
| category | string | No | CategoriZation field to be used for business logic. Blueprint roles will set this field to the blueprint id |

```
{
  name : 'string',                // name of the role
  projectId : 'string',           // project Id
  displayName : 'string? | null', // optional - displayname
  category : 'string?',           // optional - category that be used to identify role types
  description : 'string?'         // optional - description of role
}
```

## QueryRole

| Field | type | Required | Description |
|-------|------|----------|-------------|

```
{
  projectId : oneOrMany(),    // A string or array of strings, used to filter by projectId 
  id : oneOrMany( true ),     // A string/number or array of strings/numbers, used to filter by roleId
  name : oneOrMany(),         // A string or array of strings, 
  category : oneOrMany(),     // A string or array of strings.  
  displayName : oneOrMany(),
  includePermissions : 'string?',
  order : 'array?',           // and array of arrays/strings : eg [ [ 'category' : 'asc' ], [ 'name' : 'desc' ] ]
  limit : 'number?',          // max number of results per page
  offset : 'number?'          // the index of the first result
}
```


## UpdateRole

## DeleteRoles



# The following is out dated 

# Roles

Roles represent a group of permissions that can be performed. Roles can be created for a particular project id.

## Create

To create a role
```
POST /v1/project/:projectId/role
```

## Body

| Field | Type | Description |
|-------|------|-------------|
| name | string | The name of the role |
| category | [string] | The optional category of the role, usefuly for presenting only certain roles to an end user UI |
| description | [string] | A user defined description of the role |

## Output
The result will be a Role object

| Field | Type | Description |
|-------|------|-------------|
| id | int | The id of the role |
| domain | string | The domain of the role |
| projectId | string | The id of the role |
| name | string | The name of the role |
| category | string | The optional category of the role, usefuly for presenting only certain roles to an end user UI |
| description | string | A user defined description of the role |
| createdAt | string | A date string representing the creation time |
| updatedAt | string | A date string representing the last update time |

### Errors

| Status | Description |
|--------|-------------|
| 403 | The user is not allowed to perform the create |
| 400 | The body params are invalid |

## List

To list the Roles in a project

```
GET /v1/project/:projectId/role
```

### Query Params
The query parameters that can be used to filter the results are:

| Query Param | Value | Description |
|-------------|-------|-------------|
| name | [string] | The role returned has this name |
| category | [string] | The roles returned have this category |
| limit | [int] | The number of results per page |
| offset | [int] | The starting index of results |
| includePermissions | [true or false] | If true, the permissions in each role are returned with the Role |

### Output

The result will be an object

| Field | Type | Description |
|-------|------|-------------|
| count | int | The number of results |
| offset | int | The starting index of the results |
| limit | int | The number of results per page |
| items | array | The array of roles |


### Errors

| Status | Description |
|--------|-------------|
| 403 | The user is not allowed to perform the list |
| 400 | The query params are invalid |


## List Roles from several different Projects

To get Roles in several projects at once

```
GET /v1/role
```
### Query Params
The query parameters that can be used to filter the results are:

| Query Param | Value | Description |
|-------------|-------|-------------|
| projectIds | string | a comma separated list of projectIds |
| name | [string] | The role returned has this name |
| category | [string] | The roles returned have this category |
| limit | [int] | The number of results per page |
| offset | [int] | The starting index of results |
| includePermissions | [true or false] | If true, the permissions in each role are returned with the Role |

### Output

The result will be an object

| Field | Type | Description |
|-------|------|-------------|
| count | int | The number of results |
| offset | int | The starting index of the results |
| limit | int | The number of results per page |
| items | array | The array of roles |

### Errors

| Status | Description |
|--------|-------------|
| 403 | The user is not allowed to perform the get |
| 404 | The role doesnt exist (in the project) |


## Get one Role

To get a Role in a project

```
GET /v1/project/:projectId/role/:roleId
```
### Output

The result will be a Role object


### Errors

| Status | Description |
|--------|-------------|
| 403 | The user is not allowed to perform the get |
| 404 | The role doesnt exist (in the project) |


## Update a Role

To update a role
```
POST /v1/project/:projectId/role/:roleId
```

## Body

| Field | Type | Description |
|-------|------|-------------|
| name | [string] | The name of the role |
| category | [string] | The optional category of the role, usefuly for presenting only certain roles to an end user UI |
| description | [string] | A user defined description of the role |

## Output
The result will be a Role object

### Errors

| Status | Description |
|--------|-------------|
| 403 | The user is not allowed to perform the update |
| 400 | The body params are invalid |



## Delete Role

To delete a Role in a project

```
DELETE /v1/project/:projectId/role/:roleId
```
### Output

The result will be a 
```
{ status : 200, roleId : <id>, deleted : true }
```
### Errors

| Status | Description |
|--------|-------------|
| 403 | The user is not allowed to perform the delete |
| 404 | The role doesnt exist (in the project) |




# Permissions

Permissions represent something that can be done to a resource. Some common ones might include the standard
CRUD permissions - create, read, update, delete - but they are not restricted to that. Custom permissions can be
created as needed. An Permission has both a module name and a name.


## Create

To create an permission
```
POST /v1/project/:projectId/permission
```

## Body

| Field | Type | Description |
|-------|------|-------------|
| module | string | The module name of the permission |
| name | string | The name of the permission |
| category | [string] | The optional category of the permission, usefuly for presenting only certain permissions to an end user UI |
| displayName | [string] | A user readable name for the permission |
| description | [string] | A user defined description of the permission |

## Output
The result will be a Role object

| Field | Type | Description |
|-------|------|-------------|
| id | int | The id of the permission |
| domain | string | The domain of the permission |
| projectId | string | The id of the permission |
| module | string | The name of the module |
| name | string | The name of the permission |
| category | string | The optional category of the permission, usefuly for presenting only certain permissions to an end user UI |
| displayName | string | A user readable name for the permission |
| description | string | A user defined description of the permission |
| createdAt | string | A date string representing the creation time |
| updatedAt | string | A date string representing the last update time |

### Errors

| Status | Description |
|--------|-------------|
| 403 | The user is not allowed to perform the create |
| 400 | The body params are invalid |

## List

To list the Permissions in a project

```
GET /v1/project/:projectId/permission
```

### Query Params
The query parameters that can be used to filter the results are:

| Query Param | Value | Description |
|-------------|-------|-------------|
| module | [string] | The permission returned has this module |
| name | [string] | The permission returned has this name |
| category | [string] | The permissions returned have this category |
| limit | [int] | The number of results per page |
| offset | [int] | The starting index of results |

### Output

The result will be an object

| Field | Type | Description |
|-------|------|-------------|
| count | int | The number of results |
| offset | int | The starting index of the results |
| limit | int | The number of results per page |
| items | array | The array of permissionns |


### Errors

| Status | Description |
|--------|-------------|
| 403 | The user is not allowed to perform the list |
| 400 | The query params are invalid |

## Get one Permission

To get a Permission in a project

```
GET /v1/project/:projectId/permission/:permissionId
```
### Output

The result will be a Permission object


### Errors

| Status | Description |
|--------|-------------|
| 403 | The user is not allowed to perform the get |
| 404 | The permission doesnt exist (in the project) |


## Update an Permission

To update an permission
```
POST /v1/project/:projectId/permission/:permissionId
```

## Body

| Field | Type | Description |
|-------|------|-------------|
| module | [string] | The module of the permission |
| name | [string] | The name of the permission |
| category | [string] | The optional category of the permission, usefuly for presenting only certain permissions to an end user UI |
| displayName | [string] | The human readable name of the permission |
| description | [string] | A user defined description of the permission |

## Output
The result will be a Permission object

### Errors

| Status | Description |
|--------|-------------|
| 403 | The user is not allowed to perform the update |
| 400 | The body params are invalid |



## Delete Permission

To delete an Permission from a project

```
DELETE /v1/project/:projectId/permission/:permissionId
```
### Output

The result will be a 
```
{ status : 200, permissionId : <id>, deleted : true }
```

### Errors

| Status | Description |
|--------|-------------|
| 403 | The user is not allowed to perform the delete |
| 404 | The permission doesnt exist (in the project) |




# Modules

## Create

To create an module
```
POST /v1/project/:projectId/module
```

## Body

| Field | Type | Description |
|-------|------|-------------|
| name | string | The name of the module |
| displayName | [string] | A user readable name for the module |
| description | [string] | A user defined description of the module |

## Output
The result will be a Role object

| Field | Type | Description |
|-------|------|-------------|
| domain | string | The domain of the module |
| projectId | string | The id of the module |
| name | string | The name of the module |
| displayName | string | A user readable name for the module |
| description | string | A user defined description of the module |
| createdAt | string | A date string representing the creation time |
| updatedAt | string | A date string representing the last update time |

### Errors

| Status | Description |
|--------|-------------|
| 403 | The user is not allowed to perform the create |
| 400 | The body params are invalid |

## List

To list the Modules in a project

```
GET /v1/project/:projectId/module
```

### Query Params
The query parameters that can be used to filter the results are:

| Query Param | Value | Description |
|-------------|-------|-------------|
| limit | [int] | The number of results per page |
| offset | [int] | The starting index of results |

### Output

The result will be an object

| Field | Type | Description |
|-------|------|-------------|
| count | int | The number of results |
| offset | int | The starting index of the results |
| limit | int | The number of results per page |
| items | array | The array of Modules |


### Errors

| Status | Description |
|--------|-------------|
| 403 | The user is not allowed to perform the list |
| 400 | The query params are invalid |

## Get one Module

To get a Module in a project

```
GET /v1/project/:projectId/module/:moduleName
```
### Output

The result will be a Module object


### Errors

| Status | Description |
|--------|-------------|
| 403 | The user is not allowed to perform the get |
| 404 | The permission doesnt exist (in the project) |




## Update an Module

To update an Module
```
POST /v1/project/:projectId/module/:moduleName
```

## Body

| Field | Type | Description |
|-------|------|-------------|
| displayName | [string] | The human readable name of the permission |
| description | [string] | A user defined description of the permission |

## Output
The result will be a Module object

### Errors

| Status | Description |
|--------|-------------|
| 403 | The user is not allowed to perform the update |
| 400 | The body params are invalid |



## Delete Module

To delete an Module from a project

```
DELETE /v1/project/:projectId/module/:moduleName
```
### Output

The result will be a 
```
{ status : 200, name : 'moduleName', deleted : true }
```

### Errors

| Status | Description |
|--------|-------------|
| 403 | The user is not allowed to perform the delete |
| 404 | The permission doesnt exist (in the project) |


# UserRole

This defines the relationship between the User and Roles (which define what permissions can be performed).

## Create

To create an UserRole
```
POST /v1/userRole
```

## Body

| Field | Type | Description |
|-------|------|-------------|
| projectId | string | The id of the project |
| userId | string | The id of the user |
| role | string, number, or object | The id of the role or an object containing the role in the form of { name, projectId }  |
| resourceId | string | The id of the resource |
| resourceType | [string] | The type of the resource, used for user lookup |

## Output
The result will be a UserRole object

| Field | Type | Description |
|-------|------|-------------|
| projectId | string | The id of the project |
| userId | string | The id of the user |
| roleId | number | The role id |
| resourceId | string | The resource Id. |
| resourceType | string | The resource Type |
| createdAt | string | A date string representing the creation time |

### Errors

| Status | Description |
|--------|-------------|
| 403 | The user is not allowed to perform the create |
| 400 | The body params are invalid |



## Get

To get UserRoles
```
GET /v1/userRole
```

## Query Params

| Query Param | Type | Description |
|-------|------|-------------|
| projectId | string | The id of the project |
| userId | string | The id of the user |
| roleId | string or number | The id of the role |
| resourceId | string | The id of the resource of interest |
| resourceType | string | The type of the resource of interest |
| order | string |  |
| limit | number | The number per page |
| offset | number | The starting index into the list to return |
| format | string | Use 'userIds' to return only unique ids. Use 'includeRoles' to include the role object |

## Output
The result will be a UserRole object

| Field | Type | Description |
|-------|------|-------------|
| count | number | The number of results |
| offset | number | The starting index of the results |
| limit | number | The number of results per request |
| items | array | The array of ids or user roles |

### Errors

| Status | Description |
|--------|-------------|
| 403 | The user is not allowed to perform the create |
| 400 | The body params are invalid |



## Delete

To delete UserRoles
```
DELETE /v1/userRole
```

## Body

| Body | Type | Description |
|-------|------|-------------|
| projectId | string | The id of the project |
| userId | string | The id of the user |
| roleId | string or number | The id of the role |
| role | Role | The role represented by { projectId, name } |
| resourceId | string | The id of the resource of interest |
| resourceType | string | The type of the resource of interest |
| confirm | string | If the delete does not supply a userId, roleId and resourceId, this must be set to 'bulkDelete'.  |

## Output
The result will be a UserRole object

| Field | Type | Description |
|-------|------|-------------|
| status | number | 200 |
| <options> | <many> | the fields given to the delete

### Errors

| Status | Description |
|--------|-------------|
| 403 | The user is not allowed to perform the create |
| 400 | The body params are invalid |


# Can
```
POST v1/can
```

Simple example. Sending this body will return true if user can perform permission on resource-id:
```
{
  user : 'fred',
  permission : { projectId, module : 'Script', name : 'create' },
  resourceId : 'resource-id'
}
```

Array example. Sending this body will return true if user can perform permission 1 on resource-id OR 
permission 2 on resource-id or parent-id:
```
{
  user : 'fred',
  permissions : [
    { permission : { projectId, module : 'Script', name : 'create' }, resource : 'resource-id' },
    { permission : { projectId, module : 'Script', name : 'delete' }, resource : ['resource-id', 'parent-id'] }
  ]
}
```

Condition example. This will return true if user can perform permission 1 on resource-id AND 
permission 2 on resource-id or parent-d

```
{
  user : 'fred',
  condition : {
    type : 'and',
    conditions : [
      { permission : { projectId, module : 'Script', name : 'create' }, resource : 'resource-id' },
      { permission : { projectId, module : 'Script', name : 'delete' }, resource : ['resource-id', 'parent-id'] }
    ]
  }
}
```
