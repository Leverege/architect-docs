---
id: child
title: Child
---

Child is a generic way to interact with the Leverege api. It takes a path argument which it uses as the url in http requests. Most times it is used, the path is determined and maintained by the api library. 

## Methods

1. get( options ) - makes a get request to the path intended for a single object
2. list( options ) - makes a get request to the path intended for a group or collection
3. post( body, options ) - make a post request to the path
4. put( body, options ) - make a put request to the path
5. patch( body, options ) - make a patch request to the path
6. patchRaw( body, options ) - make a patch request to the path, will erase all old data
7. delete( body, options ) - make a delete request to the path
8. child( subpath ) - new Child instance with the subpath appended to the current path
9. path() - returns the current path
10. api() - returns the instance of the api
