---
id: project
title: Project
---

A project holds most of the pieces in the Leverege Platform, the project method of api can be used to interact with many of these pieces.

## Query Project

Currently, the Project methods require the **projectId** to work. This id can be found under the settings tab.

```javascript
let project
try {
  project = await api.project( projectId ).get()
} catch ( ex ) {
  // error handling
}
```

The `project` variable in the script will then have all of the project information. That information will include systems, users, blueprints and all other information associated with the Project.

Other available methods are:

1. update( newProjectInfo ) - patches the project with the `newProjectInfo`
2. delete() - deletes the project
3. users() - object to interact with the project users
4. device() - has two methods, one for history and one for events
5. members() - collection to interact with the project members
6. accounts() - collection to interact with project accounts
7. apiAccess() - collection to interact with apiAccess keys
8. networks() - collection to interact with networks
9. systems() - collection to interact with systems
10. messageRoutes() - collection to interact with messageRoutes
11. scenarios() - collection to interact with scenarios
12. timers() - collection to interact with timers
13. blueprints() - collection to interact with the blueprints
14. events - lists out the events for the project
15. verify( options )
16. getByUsername( username ) - gets a user by their username
