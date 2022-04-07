
The Log library abstracts away much of the logging functionality, making it so that with one call, log statements get logged in multiple places. 

## Usage
```shell
npm install @leverege/log --save
```

By default, the log defaults to the EmptyLog, which no-ops all logging methods.
To install a console logger, in the main class call:
```javascript
const log = require( '@leverege/log' );
log.setAdapter( log.ConsoleLog() )
```

To install a bunyan logger, call:
```javascript
const bunyanLog = bunyan.createLogger( { ... } );
log.setAdapter( log.BunyanLog( bunyanLog ) );
```

## Automated Log Creation and Installation

If you want to install a log entirely from a configuration variable (JSON, file, or plain object) call:
```javascript
log.createAdapter(<config - object, JSON string, or file>, <params - object>, <install - boolean>)
```
This function will create an Adapter based on your configuration, can parameterize your configuration if you are using a string or file, and will automatically call setAdapter if install is not false.

a configuration may look like:
```javascript
const logFile = '/var/config/transponder/logConfig.json'
```
or 
```javascript
const logString = '{
	"type" : "bunyan",
	"name" : "${logName}",
	"streams" : [
		{ 
			"type" : "rotating-file",
			"period" : "1d",
			"count" : 3,
			"level" : "warn",
			"path" : "./logs3/${logName}"
		}, 
		{ 
			"type" : "stream",
			"logName" : "${resource}"
		}
	]
}'
```
or
```javascript
const logObject = {
	type: 'console',
	mod: 'transponder'
}
```

In order to make the second JSON string configuration work, a parameters object would be supplied like so:
```javascript
const logParams = {
  logName: ClusterManager.logName( 'transponder' ),
  resource: `transponder-${process.env.TRANSPONDER_RUN_MODE || 'all'}`,
  logServiceAccount: process.env.LOG_SERVICE_ACCOUNT
}
```

So the installation would look like the following:
```javascript
log.createAdapter(logString, params, true)
```

## Logging

To log, call:
```javascript
const log = require( '@leverege/log' );
log.trace( 'trace log' );
log.debug( 'debug log' );
log.info( 'info log' );
log.warn( 'warn log' );
log.fatal( 'fatal log' );
```

The log methods can take an object as the first argument. See bunyans log for more information.

Other methods include:
```
child, setLevel, getLevel, isTrace, isDebug, isInfo, isWarn, isError, isError, isFatal
```

