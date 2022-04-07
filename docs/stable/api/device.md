---
id: device
title: Device
---

Through the api, a devices can be created, deleted and changed. 

## Query Device

```javascript
let device
try {
  device = await api.device( deviceId ).get()
} catch ( ex ) {
  // error handling
}
```

The `device` variable in the script will then have all of the device information. That information will include Metadata, ids, data and all other information associated with the device.

Other methods are:

1. update( newDeviceInfo ) - patches the device with the `newDeviceInfo`
2. delete() - deletes the device
3. history( options ) - options should include a query to make against the device history
4. events() - has a list method, create and ack method
5. getHistorical( options ) - makes a get request to the historical path of the device
6. setValue( path, value, options ) - sets `value` on the device at `path`
7. startSim( options ) - starts a simulation on the device
8. pauseSim( options ) - pauses a simulation on the device
9. restSim( options ) - resets a simulation on the device
10. playScenario( options ) - plays a scenario on the device
11. stopScenario( options ) - stops a scenario on the device
12. getUpdater( path ) - makes a call to get an updater
13. getUpdaters( options ) - makes a call to get the updaters for a device
9. verify( options ) 
3. users() - object to interact with the system users

## Creating a Device

To create a new device, the `system` method of api needs to be used. 

```js
const device = { ...newDeviceInfo }
try {
  api.system( systemId ).devices().create( device )
} catch ( ex ) {
  // error handling
}
```

after this call has been resolved, there will be a new device for the system.
