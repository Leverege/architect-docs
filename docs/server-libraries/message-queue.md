
This library creates interfaces for sending and receiving messages on a queuing system. 

## Quick Usage

BREAKING CHANGE: As of version 4.0.0, this lib has been updated to an ESM Module. The `createReader()` and `createWriter()` methods are now asynchronous. They will also automatically invoke `start()` unless the last argument is false. 


```
  import MsgQueue from 'message-queue'
  const { MessageProcessor } = MsgQueue;


  const { transportConfig, topic, channel } = options;

  // Create a writer
  const writer = await MsgQueue.createWriter( { transportConfig } );
  await writer.start();

  // Create the process message function. It should return a promise
  const processMessage = function( message, messageOptions ) {
    return new Promise( ( resolve, reject ) => {
      // process message 
    })
  }

  // Give the process function to a MessageProcessor that handles autoAck and routing
  const processor = new MessageProcessor( { writer, processor : processMessage } )
  const reader = await MsgQueue.createReader( { transportConfig, topic, channel, processor } );
  await reader.start()
```

Optionally, you can derive from MessageProcessor:

```
  const { MessageProcessor } = require( 'message-queue' )

  class MyProcessor extends MessageProcessor {
    process( message, messageOptions ) {
      return new Promise( ( resolve, reject ) => { /* process */ })
    }
  }
```
and create one of those to give to the reader:

```
  const processor = new MyProcessor( { ...myOptions, writer } );
  const reader = MsgQueue.createReader( { transportConfig, topic, channel, processor } );
  await reader.start()
```


## Note about Config

The `createReader` and `createWriter` methods allow the transport options to be
passed in to the methods as the option `transportConfig`. The value of this can
be a JSON string, the path to a file that will be read via `require`, or an object
with the options. This allows for easier configuration via environment variables:

```
MsgQueue.createReader( {
  transportConfig : process.env.TRANSPORT_CONFIG || { 
    type : 'nsq', 
    host : process.env.NSQ_HOST_ADDR || '127.0.0.1',
    port : process.env.NSQ_HOST_PORT || 4150
  },
  topic : 'myTopic', 
  channel : 'defaultChannel',
  processor : p
} )
```

The above will create a reader listening to the `myTopic` topic on the `defaultChannel`, and will process messages with processor `p`. If `process.env.TRANSPORT_CONFIG` is not defined, a default NSQ reader will be used as the transport.

## Writer Creation
Create a writer by using the `MsqQueue.createWriter( options )` method. The
options will define the type of writer that is created and its options.

### NSQ
To create an NSQ writer, use these options

```
  let options = {
    type : 'nsq',    // Kind of writer
    name : <string>, // used for logging. Defaults to 'NsqWriter'
    host : <string>, // the host name of the nsq server. eg: '127.0.0.1',
    port : <string|number>, // the port of the server to talk on. eg: 4150
  }
```

### Pub/Sub (Google)
To create an Google Pub/Sub writer, use these options

```
  let options = {
    type : 'pubsub',    // Kind of writer
    name : <string>, // used for logging. Defaults to 'PubSubWriter'
    projectId : <string>, // The google projectId,
    keyFilename : <string>, // The location of the service account JSON file.
    publisher : { 
      batching : { 
        // The number of bytes to cache before sending the message. Default Math.pow(1024, 2) * 5,
        maxBytes: <number>, 
        // The number of messages to cache before they are sent. Defaults to 1000
        maxMessages: <number>, 
        // The max milliseconds to cache before sending. Default to 1000
        maxMilliseconds: <number>
      }
    }
  }
```
Note, by default the Pub/Sub publisher will delay a second before sending, so setting
`batching.maxMilliseconds` to something small(0) will cause it to send messages faster.

## Writer Usage

```
  const writer = MsqQueue.createWriter( options )
  writer.start( )
    .then( onReady ) 
    .catch ( onErr )
```

Once you have the writer, there are two different publish methods `publish` or `route`. Both can take an option `callback( err )` method, and if it is not supplied, a promise will be returned instead. 

`publish( topicName, message, callback )` is the lowest level method and is used by `route()`. It will put the message onto the specified topic for consumption. The message should be a JSON object.

The `route( routes, message, callback )` method will send the message on the specified routing path. The routes object can be an array, object, or string that determines how to send the message. In the case of an array, the message will be sent to the next topic handler and it is up to that handler to continue the route supplied. In the case of an object (see Route for format), the message will be published to many topics at once. Each of those handlers must follow any specified continuation route. If the routes is a string, it behaves like publish(). Along with routing, an options object can be sent with the message to allow it processed in dynamic ways (like specify a script, or thresholds)

## Reader Creation
  Create a reader by using the `MsqQueue.createReader( options )` method. The options will define the type of reader that is created and its options.

### NSQ
To create an NSQ reader, use these options:
```
  let options = {
    type : 'nsq',    // Kind of writer
    name : <string>, // used for logging. Defaults to 'NsqReader( topic / channel )'
    host : <string>, // the host name of the nsq server. eg: '127.0.0.1',
    port : <string|number>, // the port of the server to talk on. eg: 4150
    topic : <string>, // The name of the topic to listen to. Required.
    channel : <string> // The channel name/group to use, defaults <topic>-default-processor
    processor : <MessageProcessor, function, or object with onMessage> // Required
  }
```

### Pub/Sub (Google)
To create an Google Pub/Sub reader, use these options:
```
  let options = {
    type : 'pubsub',    // Kind of writer
    name : <string>, // used for logging. Defaults to 'PubSubWriter'
    projectId : <string>, // The googel projectId. Required
    keyFilename : <string>, // The location of the service account json file. Required
    topic : <string>, // The name of the topic to listen to. Required
    subscription : <string> // The name of the subscription to use, defaults to <topic>-default-processor
    processor : <MessageProcessor, function, or object with onMessage> // Required
  }
```

  As a note, Pub/Sub rejects attempts to send to any topic that does not exist. By default, The PubSubReader will create the topic and the subscription attached to it. Subscription names are global to the project, so using the topic name in the subscription name is suggested.

## Reader Usage

When creating a reader, the options object requires a processor field. This can be either a `function( Message )` or an object (preferably an instance of `MessageProcessor`) that has an `onMessage( Message )` method. Both of these should process the message and return a Promise.

```
  const reader = MsqQueue.createReader( options )
  reader.start( )
    .then( onReady ) 
    .catch ( onErr )
```

When reader receives a message from its source, it is wrapped in an implementation of Message
and given to the processor to process.

### Message
  
The Message object attempts to adapt messages from different queue types into a standard interface.
The Message object will also handle breaking out of any routing information that has been passed along.
To get the actual message to process, use `Message.getMessage()`. In some cases, `Message.json()` will equal `Message.getMessage()`, but if the message contains routing information, `Message.getMessage()` will actually return the message to route.

Messages must be accepted ( `Message.ack()` ) or rejected ( `Message.noAck()` ). Be default, the MessageProcessor can be setup to call `ack()` before processing ( `options.autoAck : 'onReceipt'` ), after processing ( `options.autoAck : 'afterProcess'` ), or never ( `options.autoAck : 'none'` ). If the never option is chosen, the process call must make sure to either call `ack()` or `noAck()` before completing or the message may be redelivered. If autoAck is `'afterProcess'`, the `options.ackOnError` determines if `ack()` or `noAck()` will be called on the message.

# Routes

As mentioned, a Message can be published along a route by calling the publish() method on the Writer. A route consists of a collection of topics to send to and how to continue sending data along a chain. It is up to the Reader/Processor to continue a route if indicated and not cancelled by processor itself. The message sent to the next topic can be modified or replaced depending on the processor.

Route definition has a long form and some shortcuts.

To publish a message to one topic, the route would look like:

```
const route = {
  topic : 'myTopic',
  options : null,
  route : null,
  terminate : false
}
writer.publish( route, msg )
```

The options, routes and terminate fields default to null, null, and false and can be left out.

```
const route = {
  topic : 'myTopic'
}
writer.publish( route, msg )
```

The route, since all it indicates is a topic, can be written as a string for a shortcut:

```
const route = 'myTopic'
writer.publish( route, msg )
```

This is effectively the same call as ```publish( 'myTopic', msg )```.

So a single route target can either be a topic name (ie, the string) or an object containing a topic, options, routes, and a terminate flag.

## Sending in Series

To send a message to another topic after it is finished being processed by a first, the route object of the topic can be populated with the follow on route. 

```
const route = {
  topic : 'myTopic'
  route : {
    topic : 'myNextTopic'
  }
}
writer.publish( route, msg )
```

This will send msg to myTopic, and then the processor of 'myTopic' will send the results to the 'myNextTopic' topic. If after 'myNextTopic' is completed, you wanted to go to another location, that topic object could also have a route object. This can continue deeper and deepr.

```
const route = {
  topic : 'myTopic'
  route : {
    topic : 'myNextTopic',
    route : {
      topic : 'myNextNextTopic',
      route : {
        topic : 'myNextNextNextTopic'
      }
    }
  }
}
writer.publish( route, msg )
```

Because that can be a little difficult to follow, the array object can be used as a shortcut:

```
const route = [
  { topic : 'myTopic' },
  { topic : 'myNextTopic' },
  { topic : 'myNextNextTopic' },
  { topic : 'myNextNextNextTopic' }
]
writer.publish( route, msg )
```

or, since the above example has no other values except topic names:

```
const route = [ 'myTopic', 'myNextTopic', 'myNextNextTopic', 'myNextNextNextTopic' ]
writer.publish( route, msg )
```

# Sending in Parallel

Sometimes you want to route messages to mulitple places at once. To do this, you can use the concurrent route object.

```
const route = {
  type : 'concurrent',
  routes : [
    { topic : 'A' },
    { topic : 'B' }
  ]
}
writer.publish( route, msg )
```

In this case, msg will be sent to topic A and topic B at the same time. A shortened version of this can use the object notation without the 'type' equaling 'concurrent':

```
const route = {
  A : true,
  B : true
}
writer.publish( route, msg )
```

Each of those topics (A, B) could be directed to send to more routes after they process, or have options. For example:

```
const route = {
  type : 'concurrent',
  routes : [
    { topic : 'A', route : [ 'A0', 'A1' ] },
    { topic : 'B', route : [ 'B0' ] }
  ]
}
writer.publish( route, msg )
```

The above would result in two concurrent paths for the msg: A -> A0 -> A1 and B -> B0. In the above example the route arrays are represented as shortcuts, but could have use the expanded form.

The concurrent object has a shortened version as well. As a note, if you wish to send to the same topic but with different options, this form CANNOT be used and the above 'concurrent' form must be used. The above can be shortend to:

```
const route = {
  A : [ 'A0', 'A1' ],
  B : [ 'B0' ] 
}
writer.publish( route, msg )
```

If B0 required options, it could be expanded. Note, in the shortened concurrent for, the topic that would normal be specified by the 'topic' field in the object is overridden by the concurrent shortcut's key. Because of this, if you need to send mulitple times to the same topic but with different options (ie Reason Scripts), the concurrent shortcut cannot be used.

```
const route = {
  A : [ 'A0', 'A1' ],
  B : { type : 'B0', options : { v : 12 } }
}
writer.publish( route, msg )
```

# The Terminate Flag

In the case of concurrency, we run into a potential problem. Consider this:

```
const route = [
  { type : 'concurrent',
    routes : [
      { topic : 'A', route : [ 'A0', 'A1' ] },
      { topic : 'B', route : [ 'B0' ] }
      { topic : 'C', 
        route : {
          type : 'concurrent',
          routes : [ 'C0', 'C1' ]
        }
      }
    ] 
  },
  'D'
]
writer.publish( route, msg )
```

As is, this would result in several paths for the message:
```
A -> A0 -> A1 -> D
B -> B0 -> D
C -> C0 -> D
C -> C1 -> D
```

What if we didn't want C0 and C1 to continue to D? This is where the terminate flag comes in. Setting terminate to true in the 'C' block would cancel the forwarding to D.

```
const route = [
  { type : 'concurrent',
    routes : [
      { topic : 'A', route : [ 'A0', 'A1' ] },
      { topic : 'B', route : [ 'B0' ] }
      { topic : 'C', 
        route : {
          type : 'concurrent',
          routes : [ 'C0', 'C1' ]
        },
        terminate : true
      }
    ] 
  },
  'D'
]
writer.publish( route, msg )
```

The above would result in the following paths for the message:
```
A -> A0 -> A1 -> D
B -> B0 -> D
C -> C0
C -> C1
```





