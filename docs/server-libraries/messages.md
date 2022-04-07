# Messages

This library supplies message validation and some object description classes.

## Setup
  ```
  const Messages = require( '@leverege/messages' )
  ```
## Quick Usage

  When a JSON object is received from a source like MessageQueue or a POST message, it can be given to the Messages factory to construct a new object. If the format is invalid, an exception will be thrown. If the type cannot be deteremined, null will be returned.

  ```
    const Messages = require( '@leverege/messages' );
    const { SetTimerMsg } = Messages;

    // Create a message from a javascript object. 
    // This will return null if the message type cannot be determined.
    // This will throw an exception if the message type is correct but
    // the data in it is not
    const msg = Messages.create( dataObj )
  ```

From the 
  ```
    // This will throw an exception if myTimerData is inappropriate. The type
    // field will automatically be set
    const timerMsg = new SetTimerMsg( myTimerData )

  ```




# Messages

Leverege microservices uses Messages to communicate with each other. In addition to this, creating messages and sending them to various microservices can trigger various functionality. For example, sending an `emailMsg` to Emailer will cause emailer to send out emails to the addresses specified in the message. 

## Device 

Device messages are used for dealing with inbound and outbound data. In addition they are used for creating events. The details for each device message can be found below.


### deviceDataEventMsg

| Field | Type | Description |
|-------|------|-------------|
| type | 'deviceDataEventMsg' | |
| id | string | A uuid generated for this message |
| time | string || integer | the time of the message, as reported by the device |
| receivedTime | string || integer | the time of the message, as reported by the  |ingestion server
| storedTime | string || integer | the time of the message, as reported by the writer |
| historical | boolean | whether or not the message is known to be historical only  |(don't write to rt dbs)
| deviceId | string | A string representing the internal name of the device. |
| systemId | string | The name of the system the device belongs to |
| blueprintId | string | The id of the blueprint the device belongs to |
| projectId | string | The id of the project the device belongs to |
| networkId | string | The networkId of the source |
| data | array || object | This contains a data report. The data report as a path, which  |is the name of the data field, and a value. The path should only contain a-z, A-Z, 0-9, _. Forward slashes (‘/’) are treated as directories
| data.path | string | A string of keys, separated by a ‘/’. For examples, ‘speed’, or  |‘battery/temperature1”
| data.value | any | the value of the path |
| event | object | This contains an event report. The event indicates that something  |significant has happened.
| source | object | this contains the device, user, or reason script source info of the  |object that created this msg
| userId | string | the userId (if any) that initiated the writing of information |


### deviceAckMsg

```
{
  type : 'deviceAckMsg',
  time : string || integer || date object || null, // the time of the message, as reported by the device
  receivedTime : string || integer || date object || null, // the time of the message, as reported by the ingestion server
  msgId : string, // The message id, created at outbound initiated step
  deviceId : string, // A string representing the internal id of the device. 
  systemId : string, // The id of the system the device belongs to
  networkId : string, // The networkId of the source
  blueprintId : string, // the id of the blueprint that the device belongs to
  projectId : string, // the id of the project that the device belongs to
  status : string, // final updated string status of the message
  response : object, // This contains the response data from the device
  source : object // this contains the device, (or less likely) the user, or reason script source info of the inboundAckMsg this derived from

}
```


### deviceEventAckMsg

```
{
  type : 'deviceEventAckMsg',
  id : string, // A uuid generated for this message
  time : string || integer, // the time of the message, as reported by the device
  receivedTime : string || integer, // the time of the message, as reported by the ingestion server
  storedTime : string || integer, // the time of the message, as reported by the writer
write to rt dbs)
  deviceId : string, // A string representing the internal name of the device.
  systemId : string, // The name of the system the device belongs to
  blueprintId : string, // The id of the blueprint the device belongs to
  projectId : string, // The id of the project the device belongs to
  data : array || object, // This contains a data report. The data report as a path, which is the name of the data field, and a value. The path should only contain a-z, A-Z, 0-9, _. Forward slashes (‘/’) are treated as directories
  data.path : string, // A string of keys, separated by a ‘/’. For examples, ‘speed’, or ‘battery/temperature1”
  data.value : any, // the value of the path
  eventType : string, // This contains an event report. The event indicates that something significant has happened.
  source : object, // this contains the device, user, or reason script source info of the object that created this msg
  userId : string // the userId (if any) that initiated the writing of information
}
```

### inboundAckMsg

```
{
  type : 'inboundAckMsg',
  time : string || integer, // the time of the message, as reported by the device
  receivedTime : string || integer, // the time of the message, as reported by the ingestion server
  storedTime : string || integer, // the time of the message, as reported by the writer
  msgId : string, // The message id, created at outbound initiated step
  networkId : string, // The id of network contributing the acknowledgement
  deviceId : string, // A string representing the external name of the device. This could be an IotHub device id, a MAC address of a sensor, etc
  systemId : string, // the id of the system the device belongs to
  aliasKey : string, // The name of the key that forms the mapping between the external device’s id and the internal device. This is stored in the internal device’s aliases list, and tends to be unique per network.
  status : string, // an updated string status of the message
  response : object // This contains the response data from the device
}
```

### outboundInitMsg

```
{
  type : 'outboundInitMsg',
  time : string || integer, // the time of the message, as reported by the device
  receivedTime : string || integer, // the time of the message, as reported by the ingestion server
  msgId : string, // The message id, created at outbound initiated step
  deviceId : string, // A string representing the internal name of the device. 
  systemId : string, // The name of the system the device belongs to
  blueprintId : string, // the id of the blueprint that the device belongs to
  projectId : string, // the id of the project that the device belongs to
  message : object, // This contains the message to go out to the device
  source : object // information about the device, (or less likely) the user, or reason script that generated this message
}
```

### outboundSentMsg

```
{
  type : 'outboundSentMsg',
  time : string || integer, // the time of the message, as reported by the device
  receivedTime : string || integer, // the time of the message, as reported by the ingestion server
  msgId : string, // The message id, created at outbound initiated step
  deviceId : string, // A string representing the internal name of the device. 
  systemId : string, // The name of the system the device belongs to
  blueprintId : string, // the id of the blueprint that the device belongs to
  projectId : string, // the id of the project that the device belongs to
  status : string, // an updated string status of the device
  sendInfo : object, // any information or notes about the data sent
  source : object // information about the device, (or less likely) the user, or reason script that generated this message
}
```

## Notifications

Notification are messages that will result in a message that will be sent to a user in the form of an email or sms.

### emailMsg

An `emailMsg` is sent to the `emailer` microservice. The result will be an email being sent with the desired content to a recipient or list of recipients. 

```
{
  type : 'emailMsg',
  subject : string, // the subject line of the email to be sent
  to : string || array, // to the email address/es to send the email to
  cc : string || array, // cc the email address/es to cc on the email
  bcc : string || array, // bcc the email address/es to bcc on the email
  from : string, // from the email address the email is to be sent from
  html : string, // html email content as html
  text : string, // text email content as plain text
  template : string, // email template to use as the message
  context : object, // context contains all the information that will be substituted into the template
  attachments : array // attachments attachments to be included with the email
  blindTo : boolean // whether 'to' field should send individual messages (batch send) instead of one msg to each recipient (Note: if blindTo is true, then cc and bcc are not allowed)
}
```

### smsMsg

A `smsMsg` is sent to the `messenger` microservice. The result will be a sms being sent with the desired content to a recipient or list of recipients.

```
{
  recipients : array || string, // recipients the phone number/s to send the message to
  message : string, // message the text of the message that will be sent
}
```

## Scheduler

The Scheduler microservice manages timers on the Leverege platform. Instead of using `setTimeout` or `setInterval`, timers should created for scheduler to manage. Scheduler save timers to a database and reads them from the Database. It is more scalable then using timeouts and intervals. In addition to this, all Leverege microservices are stateless, and there is no guarantee that a timeout will be run.

### setTimerMsg

A `setTimerMsg` sent to the `scheduler` microservice will create a timer and start it. After it has run, it will trigger the functionality that it has specified as its `action`. For more information on `action`s and `timer`s refer to scheduler.md.

```
{
  type : 'setTimerMsg`,
  id : string, // identifier that will be used for the timer, unique
  projectId : string || null,
  systemId : string || null, 
  deviceId : string || null, 
  scriptId : string || null,
  timer : Timer,
  action : Action,
  patchAction : boolean || null

}
```

A timer can be reset by sending another `setTimerMsg` with the same `id`. Setting `patchAction` to `true` will patch the action of an existing `setTimerMsg`, but will not reset the timer.

### cancelTimerMsg

A `cancelTimerMsg` sent to the `scheduler` microservice will cancel a timer that has been set/created.

```
{
  type : 'cancelTimerMsg',
  id : string, // identifier of the timer to cancel
}
```

### cancelRelatedTimerMsg

A `cancelRelatedTimerMsg` set to the `scheduler` microservice will cancel all timers related to a device, system, project or script.

```
{
  type : 'cancelRelatedTimerMsg',
  projectId : string || null,
  systemId : string || null,
  deviceId : string || null,
  scriptId : string || null
}
```

## Reason 

To send a message to a Reason Script for processing, a message of type `routeMsg` should be sent to the topic `reason` must be sent. For example:

```
  const runScript = {
    type : 'routeMsg',
    message : {
      type : 'reasonRunScript',
      // Other data of you choice. This will be deliever as `message` to the script
    }
    options : {
      reasoner : {
        id : '<MyScriptId>', // The id of the reason script
        targetFunction : 'run', // The name of the function in the script to run. Defaults to 'run'
        // Other params as desired. These are passed to the script 
        // as context.parameters
        param1 : <any>
      }
    }
  }
  
  messageWriter.send( 'reason', runScript )
```

## Custom

In addition to this, using the `@leverege/message-queue` library, a message reader can be created. This reader will listen on a topic for message, and upon receiving them, can execute custom functionality. For more details refer to the `@leverege/message-queue` documentation.


## Structures

### Timers

A timer is used to run functionality on the Leverege platform. Timers consist of two parts, an `action` that is the functionality to be run once the timer has triggered, and a `timer` that details when the timer will trigger. Instead of using `setTimeout` or `setInterval`, timers should created for scheduler to manage. Scheduler save timers to a database and reads them from the Database. It is more scalable then using timeouts and intervals. In addition to this, all Leverege microservices are stateless, and there is no guarantee that a timeout will be run.

There are two different types of timers, managed and unmanaged. Managed timers are created by sending a request to api-server, and api-server maintains a database of all the managed timers. 

Managed timers can be started and stopped. When a managed timer is started, a `setTimerMsg` is send to the `scheduler` microservice from api-server. 

An unmanaged timer is created by directly sending a `setTimerMsg` to scheduler. Scheduler only has a record of active timers, and all completed timers are forgotten. If a timer needs to be reused, it is recommended to use an managed timer. 

## Timer

Timers dictate when the functionality determined by the `action` will be run. Timers are a JSON object with a key of `type` and another key to dictate when the timer will run, this key is based off of the type of timer. There are several different types of timers, `once`, `repeating` and `scheduled`.

### once

Once timers execute their functionality one time. They have either a `delay` key or a `when`. `delay` is a number in milliseconds, which is the amount of time the timer will wait after being started to execute. `when` is a timestamp in milliseconds, that is the specific time that the functionality will be executed.

| Field | Type | Description |
|-------|------|-------------|
| type | 'once' | The type of the timer. Must be 'once' |
| delay | [number] | The time in milliseconds to wait before triggering the timer | 
| when | [number] | The timestamp (milliseconds since epoch) at which the timer should be triggered | 


### repeating

Repeating timers execute at a set interval. They have a `delay` key. 


| Field | Type | Description |
|-------|------|-------------|
| type | 'repeating' | The type of the timer. Must be 'repeating' |
| delay | number | The time in milliseconds between timer triggers | 
| runImmediately | [boolean] | if true will run the functionality when the timer gets started |

### scheduled

Scheduled timers run on a set schedule. They have a `cron` key that takes a cron expression. In addition to this there is a `timezone` key that can be used to define the timezone of the cron string.


| Field | Type | Description |
|-------|------|-------------|
| type | 'scheduled' | The type of the timer. Must be 'scheduled' |
| cron | Cron Expression | The cron expression used by the timer | 
| timezone | string | The timezone |

### solar

Scheduled timers run on a set schedule. They have a `cron` key that takes a cron expression. In addition to this there is a `timezone` key that can be used to define the timezone of the cron string.

| Field | Type | Description |
|-------|------|-------------|
| type | 'solar' | The type of the timer. Must be 'solar' |
| cron | Cron Expression | The optional cron expression used by the timer. This should be the standard cron form ( '* * * * *' ), but hours and minutes will be ignored. | 
| latitude | number | The latitude in degrees of the sun viewer | 
| longitude | number | The longitude in degrees of the sun viewer | 
| fromSunrise | boolean | If true, the timer will run based on sunrise. If false, sunset is used. (Default: true) |
| offset | int | The offset in milliseconds from either sunrise or sunset based on fromSunrise. A value of (-60*60*1000) would mean an hour before sunrise/sunset |

## Action

There are two types of actions that can be triggered by timers. One is to publish a message to a topic inside of the Leverege system. The other action that can be taken is to send a request to a url.

### publishTopic

The `publishTopic` action injects a message into the Leverege system, starting at the specified `topic`. A `message` needs to be included, to be sent to the defined topic.

```
{
  type : 'publishTopic',
  topic : 'reason'
  message : {
    message : {
      type : "reasonRunScript"
    },
    options : {
      reasoner : {
        x : y,
        id : <id of the reason script to run>
      }
    }, 
    type : "routeMsg"
  }
}
```

For more detail on how to create the JSON for a message, refer to messages.md.

### queryUrl

The `queryUrl` action makes a http request.

```
{
  type : 'queryUrl',
  url : string,
  method : string,
  header : object,
  body : any
}
```
