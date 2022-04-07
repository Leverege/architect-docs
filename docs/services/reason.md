
Reason allows for scripts with custom logic to be run on the Leverege Platform. Scripts are written in Javascript, and can be triggered in 3 different ways. Scripts are very powerful, the main uses tend to be Generating reports and triggering alerts. In addition to this, they can be used to augment or change incoming data before it is saved to devices. A script is created in the Leverege UI under the script section. In this section of the UI, scripts can also be edited or deleted in addition to viewing their logs.

## Triggering

The first way to trigger a reason script is through a Message Route. In the Leverege UI, under Msg Routes, create a new message route and in the metadata include 

```json
{ "[message type]" : 
  { "reason" : 
    { "options" : 
      { "reasoner" : 
        { "id" : "[Reason Script Id]" }
      }
    },
    "writer" : true 
  }
}
```

then copy the Message Route Id and attach it to the blueprint/s or device/s, in the info section the input labeled `Msg Route`. Whenever a device or device of that blueprint receives a message of that type, the message will first be sent to reasoner. Here, the reason script can examine, manipulate or run custom functionality before updating the device information.

The second way to trigger a reason script is through a timer. Timer's can be set in two ways. The first way is through the Imagine UI, under the timer section. The second way to create a timer is to send a message on the `scheduler` topic with a `SetTimerMsg`. A more detailed explanation of timers can be found in [scheduler](http://docs.leverege.com/docs/scheduler).

The Third way to trigger a reason script is by sending a message to the `reason` topic. 

## Run

By default reason scripts start with the function `exports.run`. This function has two main arguments, a `message` and a `context`. A description of the context can be found below. The message is the message that triggered the script. This is most useful when the script is set to trigger on a message route, since the message will have the incoming device data which can then be examined and manipulated. If the function is async, a third `done` argument needs to be called if there is no return statement. Additionally, when reasoner is triggered via a message route, the return can change of affect the message. When a `null` is returned, the message will not be changed, and the message will continue on its route as normal. When a `false` is returned, it will stop the message. If an object is returned, reasoner will forward that message on instead of the message that triggered it. 

If invoking a script through the `reason` topic. A different entry function can be specified than the `run` function.

Every function that is intended to be used as an entry point needs to have a `needs` property attached to it. The needs is a JSON object that specifies all of the data the context needs in order for the function to be executed. If all of the parameters specified in needs cannot be met, the script will not run. Additionally, anything not specified by the needs is not guaranteed to be included in the context when the function is executed. 

## Context

Every time a reason script gets triggered, it is invoked with a context. The context changes slightly based on how the script is triggered. There are always several methods that can be invoked through the context (these do not have to be specified in the needs). More details about these methods can be found in the [Reasoner](http://docs.leverege.com/docs/reasoner) library. In addition to this, `device` and `system` information can be attached to the context if it is triggered through a message route. If a timer is set to trigger a reason script, `params` will be attached to the context, which is a JSON object that can be specified in the UI, under the options of the timer. 

## Logging and Debugging

Logging can be done in reason scripts. A `log` and `error` method are attached to the context. Their output will go into GCP logging. They can be viewed there, additionally, they are scraped by StackDriver, and can be seen in the Leverege UI.  

## Configuration

#### Required

| Name | Description |
| ---- | ----------- |
| CF_TRANSPORT_CONFIG | transport config for the cloud function readers and writers |
| MODEL_FIREBASE_SERVICE_ACCOUNT | service account key to firebase database for models |
| MODEL_FIREBASE_DATABASE_URL | url to firebase database for models |
| DATA_FIREBASE_DATABASE_URL | url to the firebase database for data |
| DATA_FIREBASE_SERVICE_ACCOUNT | service account key to firebase database for data |


#### Optional

| Name | Description | Default |
| ---- | ----------- | ------- |
| TRANSPORT_CONFIG | config for readers and writers | `{ type, host, port }` |
| NSQ_HOST_ADDR | host address for NSQ, not needed if TRANSPORT_CONFIG is specified | `'127.0.0.1'` |
| NSQ_HOST_PORT | port for NSQ, not needed if TRANSPORT_CONFIG is specified | `4150` |
