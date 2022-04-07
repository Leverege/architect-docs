---
id: users
title: Users
---

Users are several methods to interact with all the users of a project

## Users Methods

1. list() - gets all the users
2. create( user ) - creates a user
3. forgotPassword( username, projectId ) - sends a forgot password to the user
4. resetPassword( patch ) - changes a user's password with a token
8. child( id ) - returns an instance of a child

## Project, System and Device Users

When interacting with the `users` method of a project, system or device, there are different methods available. These new methods revolve around adding, removing and changing the user's permissions on the project, system or device.

1. list() - gets all the users specifically permissioned on the project, system or device
2. create( user, permissions, metadata, options ) - creates and permissions a user on the project, system or device
3. add( id, permissions, metadata ) - permissions an existing user on the project, system or device
4. get( id, options ) - gets a user and their information that is permissioned on the project, system or device
5. update( id, patchOps ) - updates the user
6. remove( id ) and delete( id ) - removes the user's permissions on the project, system or device
