---
id: user
title: User
---

The user portion of api is designed to interact with a specific user.

## User Methods

1. get() - gets the user
2. getByUserName() - used to the the user if created with a username
3. update( patchOps ) - patches the user 
4. delete() - deletes the user
5. systems() - gets the systems that the user is permissioned on
6. devices() - gets the devices that the user is permissioned on
7. changePassword( oldPassword, newPassword ) - changes the users password
8. child( id ) - returns an instance of a child
