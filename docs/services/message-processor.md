
Message Processor is a service responsible for receiving, processing, and then forwarding inbound messages along into the Leverege Platform. 

The first step in processing a message is to check the type of id. If the device has an external network id attached, message-processor will look up the device against that network. The next step in processing the inbound message is to create a message with a type corresponding to the internal version of the message. Then, that message gets device data, system data, project data and blueprint data attached. If the blueprint has a Message Route defined, it will be assigned onto the message.

The route that gets attached onto the message is responsible for telling the system which order and services the message will be sent to. A message route is created under the `msg routes` section of the Leverege UI, and then attached to a blueprint, or a specific device under their respective info tabs. The message route is a JSON structure that defines what the routes that different types of messages will follow.

## Configuration

#### Required 

| Name | Description |
| ---- | ----------- |
| MODEL_FIREBASE_SERVICE_ACCOUNT | service account key to firebase database for models |
| MODEL_FIREBASE_DATABASE_URL | url to firebase database for models |

#### Optional

| Name | Description | Default | 
| ---- | ----------- | ------- |
| TRANSPORT_CONFIG | config for readers and writers | `{ type, host, port }` |
| NSQ_HOST_ADDR | host address for NSQ, not needed if TRANSPORT_CONFIG is specified | `'127.0.0.1'` |
| NSQ_HOST_PORT | port for NSQ, not needed if TRANSPORT_CONFIG is specified | `4150` |
| CACHE_CONFIG | configuration for the cache db | `{ type, connection : { host, port } }` |
