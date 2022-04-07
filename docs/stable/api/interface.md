---
id: interface
title: Interface
---

Interface is designed to query for devices in complex relationships. Interface works with groups and objects, where groups are a grouping of devices and objects are a singular device. Queries can use `*` as a wildcard to query for all devices or objects.

## Query Interface

Currently, the Interface methods require the **systemId** to work. This id can be found under the info tab of the system. In addition to the **systemId**, blueprintIds are required for Interface to work.

```javascript
let deviceInfo
try {
  deviceInfo = await api.interface( systemId, blueprintId ).obj( deviceId ).get()
} catch ( ex ) {
  // error handling
}
```

The systemId and blueprintId can be substituted with the blueprint alias and system alias. The above query will result in `deviceInfo` having all of the information for the device. In addition to this, 

```javascript
let devicesInfo
try {
  devicesInfo = await api.interface( systemId, blueprintId ).obj( '*' ).get()
} catch ( ex ) {
  // error handling
}
```

will result in devicesInfo containing all the info for devices with `blueprintId`. In addition, interface queries can chain on relationships.

```javascript
let devicesInfo
try {
  devicesInfo = await api.interface( systemId, blueprint ).obj( deviceId ).grp( relationshipAttributeName ).list()
} catch ( ex ) {
  // error handling
}
```

`devicesInfo` will result in all the devices that are in a many to one relationship with the device. Many to one relationships use `group` and one to one relationships and specific devices use `object`

## Interface methods

1. list() - return all the devices with the blueprintId 
2. create( device ) - creates a device with the blueprintId
3. get( id ) - return the device with the id
4. delete( id ) - deletes the device with the id
5. obj( id ) - returns an instance of `object`
6. model() - returns the blueprint

## object methods

1. get() - gets the device
2. update( patchOps ) - updates the devices information
3. delete() - deletes the device
4. create( device ) - creates a device with a one to one relationships
5. grp( relationship ) - returns and instance of a `group`
6. obj( id ) - returns an instance of an `object`
7. users() - results in methods to interact with the users
8. model() - returns the blueprint
9. history( options ) - makes a history query
10. events() - returns a `list` method to get all the events for the device

## group methods

1. get( id ) - gets the device
2. list() - gets all the devices in the group
3. create( device ) - creates a device in the group
4. update( id, patchOps ) - updates the devices information 
5. delete( id ) - deletes the device
6. obj( id ) - returns an instance of an `object` 
7. model() - returns the blueprint
