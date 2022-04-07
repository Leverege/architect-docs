
Messenger's function is to receive SMS requests in the form of an `SmsMsg`, queue them, and then forward them to a service that will send the SMS. Currently Messenger is configured to use the [Twilio api](https://www.twilio.com/), but Messenger can be configured for other services' apis.

Messenger listens to the messaging service set up with the Leverege Platform. The default message reading configuration is NSQ, and the topic that that Messenger listens to by default is `messenger`, but can be changed through environment configuration. The format of the message is a `SmsMsg`, which can be found in the [Messages](http://docs.leverege.com/docs/messages) library, and an example is given below.

A message starts by invoking the `route` method on an instance of a writer created by [Message Queue](http://docs.leverege.com/docs/message-queue) with the topic Messenger is listening to and an instance of a `SmsMsg`. Message Queue writes the message to the transponder service, which then routes it to this service (Messenger). Messenger does a validation check to make sure the message received is an instance of an `SmsMsg`. The message is then sent to [Twilio](https://www.twilio.com/) for the SMS to be sent to the client.

## Configuration

#### Required

There are 5 config variable that are required to run this service.

| Name | Description |
| ---- | ----------- |
| TWILIO_SID | id of Twilio account |
| TWILIO_AUTH_TOKEN | auth token for Twilio account |
| TWILIO_PHONE | phone number messages will be sent from |
| MODEL_FIREBASE_SERVICE_ACCOUNT | service account key to firebase database |
| MODEL_FIREBASE_DATABASE_URL | url to firebase database |

#### Optional


| Name | Description | Default | 
| ---- | ----------- | ------- |
| SMS_TEMPLATES_DIR | file path to where sms templates are stored | `null` | 
| TRANSPORT_CONFIG | config for readers and writers | `{ type, host, port }` |
| NSQ_HOST_ADDR | host address for NSQ, not needed if TRANSPORT_CONFIG is specified | `'127.0.0.1'` |
| NSQ_HOST_PORT | port for NSQ, not needed if TRANSPORT_CONFIG is specified | `4150` |
| CACHE_CONFIG | configuration for the cache db | `{ type, connection : { host, port } }` |
| LIMIT_CONFIG | configuration for the limit db | [Limit](http://docs.leverege.com/docs/limit) |
| MESSENGER_TOPIC | topic that this service will listen to | `'messenger'` |
| MESSENGER_SENDER | channel that this service will send messages on | `'sender'` | 

## SmsMsg

A more detailed message spec can be found in the [Messages](http://docs.leverege.com/docs/messages) library

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipients | string or array | phone number/s that will receive the SMS message |
| message | string or null | message that will be sent |
| limitOptions | limitOptions or null | limiter options that will be used for the message | 
| templateId | string or null | id of the template that is to be used | 
| projectId | string or null | Leverege Platform projectId |
| context | object | provides values to be inserted into the template |


#### limitOptions

More detail about the limitOptions can be found in the [Limit](http://docs.leverege.com/docs/limit) library

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | number | maximum number of messages that will be sent in the given period | 
| period | number | time(ms) - period of time that the count will be tracked. if count is reached, stops sending the message to the user for the duration |
| duration | number | time(ms) - if the count is reached in a period, user will not receive another of the message type for this amount of time | 
| key | string | namespace key for the message | 
