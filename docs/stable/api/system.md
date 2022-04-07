---
id: system
title: System
---

A System is a bucket for Devices. Systems have their own metadata, users and contacts. Systems are important organizational structures in the Leverege system.

## Query System

Currently, the System methods require the **systemId** to work. This id can be found under the info tab of the system.

```javascript
let system
try {
  system = await api.system( systemId ).get()
} catch ( ex ) {
  // error handling
}
```

The `system` variable in the script will then have all of the system information. That information will include Metadata, users, contacts and all other information associated with the system.

Other methods are:

1. update( newSystemInfo ) - patches the system with the `newSystemInfo`
2. delete() - deletes the system
3. users() - object to interact with the system users
4. devices() - collection to interact with system devices
5. contacts() - collection to interact with the system contacts
6. interface() - refer to [interface documentation](http://docs.leverege.com/docs/interface)
7. userDevices() - collection of userDevices
8. device() - has two methods, one for history and one for events
9. verify( options ) 

## Creating a System

To create a new System, the `project` method of api needs to be used. 

```js
const system = { ...newSystemInfo }
try {
  api.project( projectId ).systems().create( system )
} catch ( ex ) {
  // error handling
}
```
