
The reasoner library abstracts FaaS capabilities, wrapping scripts that can be run and triggered from anywhere in the Leverege Platform. Currently only Cloud Functions are supported by reasoner. Reasoner prepares a context with device, system, blueprint and project information in addition to several methods, and then invokes the script with that context.

## Deploying 

A script is deployed through the ui, under the script section, scripts can be created, edited, deployed and have their logs viewed.

## Context

The context enables a lot of functionality that can be utilized within Reason scripts. The context comes with several data properties and several methods.

#### Properties

| key | type | description |
| --- | ---- | ----------- |
| scriptId | string | id of script |
| deviceData | object | current data of the device (before the incoming data reasoner receives) |
| cache | object | cache for the device for this script |
| system | object | current data of the system |
| device | object | current device information |
| blueprint | object | blueprint information of the device |
| scriptCache | object | cache for the script |
| params | object | user defined parameters to run the script with |

#### Methods 

1. setCache( data )

The setCache method is used to set the cache for the device. This cache then gets added to the context for subsequent times the reason script is triggered by a device change.

| param | type | description |
| ----- | ---- | ----------- |
| data | object | the data to be set for the device's cache |

2. setScriptCache( data )

The setScriptCache method is used to set the cache for the script. This cache then gets added to the context for subsequent times the reason script is triggered via the `scriptCache` property.

| param | type | description |
| ----- | ---- | ----------- |
| data | object | the data to be set for the script's cache |

3. sendEmail( msg, targets )

The sendEmail method is used to send emails. This method formats an `EmailMsg` which is then sent into the Leverege Platform, where it is received and processed by [Emailer](http://docs.leverege.com/docs/emailer).

| param | type | description |
| ----- | ---- | ----------- |
| msg | object | follows the format of an `EmailMsg`, does not need to specify a `to` field |
| targets | array | the recipients of the email |

4. sendSms( msg, targets )

The sendSms method is used to send SMS messages. This method formats a `SmsMsg` which is then sent into the Leverege Platform, where it is received and processed by [Messenger](http://docs.leverege.com/docs/messenger).

| param | type | description |
| ----- | ---- | ----------- |
| msg | object | follows the format of an `SmsMsg`, does not need to specify a `to` field |
| targets | array | the recipients of the SMS |

5. setDeviceData( pathValueArray )

This method is used to set device data.

| param | type | description |
| ----- | ---- | ----------- |
| pathValueArray | array | array of objects |
| pathValueArray[x].path | string | `/` separated string that specifies where to save the value to |
| pathValueArray[x].value | any | the value to be saved to the device |

6. log( args )

This method currently just uses `console.log`, but is recommended in case any additional logging functionality is added or existing functionality gets changed.

7. error( args )

This method currently just uses `console.error`, but is recommended in case any additional logging functionality is added or existing functionality gets changed.
