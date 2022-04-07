---
id: collection
title: Collection
---

A collection represents a group of objects on the Leverege platform. Collections contain generic methods to interact with all the different collections.

## Methods

1. list() - returns a list with all of the objects in the collection
2. create( object ) - creates an object in the collection
3. get( id ) - gets the object in the collection
4. update( id, patchOps ) - updates the object with the provided data
5. updateRaw( id, patchOps ) - removes the old data for the object
6. delete( id ) - deletes the object from the collection
7. child( id ) - returns an instance of child with the id appended to the current path
